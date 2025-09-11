import {
  nescreate,
  nesupdate,
  nesquery,
  nesdelete,
  nesdeleteAll,
} from "../services/nes";
import { findById, oneMoSync, managed } from "../services/objectMO";
import { findAllApp } from "../services/appCategories";
import { peformanceCfg } from "../utils/performanceOelCfg";
import { queryES } from "../services/qps";
import { routerRedux } from "dva/router";
import { parse } from "qs";
import { Modal, message } from "antd";
import queryString from "query-string";
import _ from "lodash";
import NProgress from "nprogress";

// 角色映射表 - 根据bizarea和component等字段映射到对应角色
const roleMapping = {
  "互联网服务域公众服务区": {
    "负载均衡": "生产-内网服务器",
  },
  "武汉灾备中心": {
    "负载均衡": "生产-内网权威服务器",
  },
  // 可以根据实际业务需求扩展更多映射规则
};

// 根据设备信息确定角色
function determineRole(deviceInfo) {
  const { bizarea, component, hostname } = deviceInfo;

  // 优先使用映射表
  if (roleMapping[bizarea] && roleMapping[bizarea][component]) {
    return roleMapping[bizarea][component];
  }

  // 根据hostname模式匹配角色
  if (hostname.includes('ZDNS') && hostname.includes('ROOT')) {
    return "生产-内网根服务器";
  }
  if (hostname.includes('YKGTM') && hostname.includes('NS')) {
    return "生产-内网权威服务器";
  }
  if (hostname.includes('ZDNS') && hostname.includes('LOCAL') && hostname.includes('BG')) {
    return "办公-内网递归服务器";
  }
  if (hostname.includes('LOCAL') && !hostname.includes('BG')) {
    return "生产-内网递归服务器";
  }
  if (hostname.includes('HL-GZFW')) {
    return "生产-互联网权威服务器";
  }
  if (hostname.includes('OUT') && hostname.includes('HL-JR')) {
    return "生产-互联网资源池递归服务器";
  }

  // 默认角色
  return "其他设备";
}

// 处理QPS查询数据
function processQpsData(aggregations) {
  const devices = aggregations.group_by_device.buckets;
  const processedData = [];

  devices.forEach((device, index) => {
    const deviceInfo = device.latest_info.hits.hits[0]._source;
    const timeSeries = device.time_series.buckets;

    // 提取6小时内的时间序列数据 - 使用实际value值
    const chartData = {
      categories: [],
      values: []
    };

    // 处理每个时间段的实际值
    timeSeries.forEach(bucket => {
      const timeValues = bucket.values.hits.hits;

      if (timeValues.length > 0) {
        timeValues.forEach(hit => {
          const source = hit._source;
          const date = new Date(source.clock * 1000);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const timeLabel = `${hours}:${minutes}`;

          chartData.categories.push(timeLabel);
          chartData.values.push(source.value ? Math.round(source.value) : 0);
        });
      }
    });

    // 按时间排序
    const combined = chartData.categories.map((cat, idx) => ({
      time: cat,
      value: chartData.values[idx]
    }));
    combined.sort((a, b) => a.time.localeCompare(b.time));

    chartData.categories = combined.map(item => item.time);
    chartData.values = combined.map(item => item.value);

    // 确定设备角色
    const role = determineRole(deviceInfo);

    processedData.push({
      key: (index + 1).toString(),
      role: role,
      vendor: deviceInfo.vendor || "未知",
      device: deviceInfo.hostname,
      hostip: deviceInfo.hostip,
      chartData: chartData,
    });
  });

  // 按角色排序
  processedData.sort((a, b) => {
    if (a.role !== b.role) {
      return a.role.localeCompare(b.role);
    }
    return a.device.localeCompare(b.device);
  });

  return processedData;
}

export default {
  namespace: "qps", //@@@

  state: {
    q: "", //URL串上的q=查询条件
    list: [], //定义了当前页表格数据集合
    currentItem: {}, //被选中的行对象的集合
    modalVisible: false, //弹出窗口是否可见
    modalType: "create", //弹出窗口的类型
    pagination: {
      //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: (total) => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: 0, //数据总数？
      pageSizeOptions: ["10", "20", "30", "40", "100", "200"],
    },
    batchDelete: false, //批量删除按钮状态，默认禁用
    batchSync: false, //批量同步按钮状态，默认禁用
    selectedRows: [], //表格中勾选的对象，准备批量操作

    alertType: "info", //alert控件状态info,success,warning,error
    alertMessage: "请输入MO信息", //alert控件内容

    //设备发现有关
    moSynState: false, //弹出窗口同步按钮状态
    _mngInfoSrc: "自动", //用户手动切换发现方式记录的临时状态
    zabbixUrl: "", //选中分行查询到的zabbixUrl
    batchsyncSuccessList: [], //同步成功的集合
    batchsyncFailureList: [], //同步失败的集合
    batchSyncState: true, //提示框的状态
    batchSyncModalVisible: false, //批量同步的弹出框
    moImportFileList: [],
    showUploadList: false,
    moImportResultVisible: false,
    moImportResultdataSource: [],
    moImportResultType: "",
    secondSecAreaDisabled: true, //二级安全域禁用状态
    managedModalVisible: false,
    manageState: true,
    managedType: "managed",
    managedData: [],
    pageChange: "",
    appCategorlist: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        let query = location.query;
        if (query === undefined) {
          query = queryString.parse(location.search);
        }
        if (location.pathname === "/dashboard/qps") {
          //获取下拉选择内容
          dispatch({ type: "query", payload: {} });
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      console.log("QPS查询开始, payload:", payload);
      let queryParams = { es: {}, paths: "" }

      let dslTemplate = _.cloneDeep(peformanceCfg.qps)

      let startTime, endTime;

      if (payload.date) {
        // 如果传入了日期参数（格式: YYYY-MM-DD HH:mm:ss 或 YYYY-MM-DD）
        const targetDate = new Date(payload.date);
        endTime = Math.floor(targetDate.getTime() / 1000); // 转为秒级时间戳
        startTime = endTime - 6 * 60 * 60; // 6小时前
      } else {
        // 默认查询当前时间前6小时
        endTime = Math.floor(Date.now() / 1000); // 转为秒级时间戳
        startTime = endTime - 6 * 60 * 60; // 6小时前
      }

      console.log("时间范围:", {
        startTime: startTime,
        startTimeDate: new Date(startTime * 1000).toLocaleString('zh-CN'),
        endTime: endTime,
        endTimeDate: new Date(endTime * 1000).toLocaleString('zh-CN')
      });

      // 设置时间范围查询（使用clock字段的秒级时间戳）
      dslTemplate.query.bool.must[0].range.clock = {
        gte: 1749398341,
        lte: 1749398399
      };

      console.log("DSL查询语句:", JSON.stringify(dslTemplate, null, 2));

      queryParams.es = dslTemplate
      queryParams.paths = "/u2performance_for_test/_search/"

      try {
        const data = yield call(queryES, queryParams);
        console.log("ES查询结果:", data);

        NProgress.done(); //异步加载动画结束

        if (data && data.aggregations) {
          console.log("开始处理聚合数据...");
          // 处理ES聚合查询结果
          const processedData = processQpsData(data.aggregations);
          console.log("处理后的数据:", processedData);

          yield put({
            type: "setState",
            payload: {
              list: processedData,
              q: payload.q,
            },
          });
        } else {
          console.warn("没有聚合数据或查询失败:", data);
          yield put({
            type: "setState",
            payload: {
              list: [],
              q: payload.q,
            },
          });
        }
      } catch (error) {
        console.error("QPS查询失败:", error);
        NProgress.done();
        message.error("查询QPS数据失败");
        yield put({
          type: "setState",
          payload: {
            list: [],
            q: payload.q,
          },
        });
      }
    },

    // *findById({ payload }, { call, put }) {
    //   const data = yield call(findById, payload.currentItem);
    //   if (data.success) {
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         currentItem: data,
    //         _mngInfoSrc: data.mngInfoSrc,
    //         zabbixUrl: data.createdByTool,
    //         modalVisible: true,
    //       },
    //     });
    //   }
    // },

    // // 	* requery ({ payload }, { put }) {
    // //   	yield put(routerRedux.push({
    // //     	pathname: window.location.pathname,
    // //     	query: parse(window.location.search.substr(1)),
    // //     }))
    // //   },
    // *requery({ payload }, { select, put }) {
    //   let pageItem = yield select(({ ssl }) => ssl.pagination);
    //   let q = parse(window.location.search.substr(1)).q;
    //   yield put({
    //     type: "query",
    //     payload: {
    //       page: pageItem.current - 1,
    //       pageSize: pageItem.pageSize,
    //       q: q,
    //     },
    //   });
    // },

    // *update({ payload }, { select, call, put }) {
    //   //取currentItem是为了获取完整的对象来全量update后端的mo对象
    //   let currentItem = {};
    //   currentItem = yield select(({ ssl }) => ssl.currentItem); //@@@

    //   currentItem = Object.assign(currentItem, payload.currentItem);

    //   let data = {};
    //   data = yield call(nesupdate, currentItem);

    //   if (data.success) {
    //     message.success("设备修改成功!");
    //     payload.currentItem = data;
    //     payload.alertType = "success";
    //     payload.alertMessage = "设备修改成功。";
    //     yield put({
    //       type: "setState",
    //       payload,
    //     });
    //     yield put({ type: "requery" });
    //   } else {
    //     message.error("设备修改失败!");
    //     payload.alertType = "error";
    //     payload.alertMessage = "设备修改失败。";
    //     yield put({
    //       type: "setState",
    //       payload,
    //     });

    //     throw data;
    //   }
    // },

    // *create({ payload }, { select, call, put }) {
    //   //payload.currentItem.alias = payload.currentItem.discoveryIP	//keyword赋值
    //   payload.currentItem.keyword = payload.currentItem.discoveryIP; //keyword赋值
    //   payload.currentItem.firstClass = "NETWORK";
    //   payload.currentItem.secondClass = "SSL"; //@@@

    //   let currentItem = {};
    //   currentItem = yield select(({ ssl }) => ssl.currentItem); //@@@
    //   currentItem = Object.assign(currentItem, payload.currentItem);

    //   const data = yield call(nescreate, currentItem);

    //   if (data.success) {
    //     message.success("设备保存成功!");
    //     payload.modalType = "update";
    //     payload.alertType = "success";
    //     payload.alertMessage = "设备保存成功。";
    //     payload.currentItem = data;

    //     yield put({
    //       type: "setState",
    //       payload,
    //     });
    //     yield put({ type: "requery" });
    //   } else {
    //     message.error("设备保存失败!");
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         alertType: "error",
    //         alertMessage: "设备保存失败。",
    //       },
    //     });
    //     throw data;
    //   }
    // },

    // *delete({ payload }, { select, call, put }) {
    //   const data = yield call(nesdelete, payload);

    //   if (data.success) {
    //     message.success("删除成功！");
    //     yield put({ type: "requery" });
    //   } else {
    //     message.error("删除失败！");
    //     throw data;
    //   }
    // },

    // *moSync({ payload }, { call, put, select }) {
    //   //同步设备信息
    //   const dataMoInfo = yield call(oneMoSync, payload);

    //   if (dataMoInfo.success) {
    //     //取currentItem是为了获取完整的对象来全量update后端的mo对象
    //     let currentItem = {};
    //     currentItem = yield select(({ ssl }) => ssl.currentItem); //@@@

    //     //修改state里当前对象的值
    //     currentItem = Object.assign(currentItem, dataMoInfo.mos[0]);

    //     let _alertType = "info";
    //     let _alertMessage = "请输入信息。";
    //     if (currentItem.syncStatus === "success") {
    //       _alertType = "success";
    //       _alertMessage = "设备信息抓取成功";
    //     } else if (currentItem.syncStatus === "failed") {
    //       _alertType = "error";
    //       _alertMessage = `设备 ${currentItem.name} 信息抓取失败：${currentItem.ext1}`;
    //     } else if (currentItem.syncStatus === "unsync") {
    //       _alertType = "warning";
    //       _alertMessage = "设备尚未同步。";
    //     }

    //     yield put({
    //       type: "setState",
    //       payload: {
    //         currentItem: { ...currentItem },
    //         moSynState: false,
    //         alertType: _alertType,
    //         alertMessage: _alertMessage,
    //       },
    //     });
    //     yield put({ type: "requery" });
    //   } else if (!dataMoInfo.success) {
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         moSynState: false,
    //         alertType: "error",
    //         alertMessage: `设备 ${currentItem.name} 信息抓取失败：${dataMoInfo.msg}`,
    //       },
    //     });
    //   }
    // },

    // *batchSync({ payload }, { call, put }) {
    //   let successList = [];
    //   let failureList = [];
    //   //payload接收一个uuid数组，请求一个oneMoSync接口，返回给我一个mo数组
    //   const data = yield call(oneMoSync, payload);
    //   //判断返回集合的状态是否success
    //   if (data.success) {
    //     //循环遍历数组，只过滤出同步失败的信息,也需要一个同步成功的集合以防情况有变
    //     for (let mo of data.mos) {
    //       if (mo.syncStatus === "success") {
    //         successList.push(mo);
    //       } else if (mo.syncStatus === "failed") {
    //         failureList.push(mo);
    //       }
    //     }
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         batchSyncState: false,
    //         batchsyncSuccessList: successList,
    //         batchsyncFailureList: failureList,
    //       },
    //     });
    //   } else if (!data.success) {
    //     //message.error('未返回同步信息!')
    //     Modal.warning({
    //       title: "未返回同步信息!",
    //       content:
    //         "可能由于网络原因,批量同步失败!建议减少同步设备数量或稍后再试!",
    //       okText: "好的",
    //     });
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         batchSyncModalVisible: false,
    //       },
    //     });
    //   }
    // },

    // *deleteAll({ payload }, { select, call, put }) {
    //   let data = {};
    //   data = yield call(nesdeleteAll, payload);

    //   if (data.success) {
    //     message.success("删除成功！");
    //     yield put({ type: "requery" });
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         batchDelete: false,
    //       },
    //     });
    //   } else {
    //     message.error("删除失败！");
    //     throw data;
    //   }
    // },

    // *managed({ payload }, { call, put }) {
    //   const data = yield call(managed, payload);
    //   if (data.success) {
    //     delete data.message;
    //     delete data.status;
    //     delete data.success;
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         managedModalVisible: true,
    //         managedData: data.mos,
    //         manageState: false,
    //       },
    //     });
    //   } else {
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         managedModalVisible: false,
    //       },
    //     });
    //     message.error("批量修改失败!");
    //   }
    // },

    // *preview({ payload }, { call, put }) {
    //   const data = yield call(preview, payload);
    // },
    // *appcategories({ payload }, { call, put }) {
    //   const data = yield call(findAllApp, payload);
    //   if (data.success) {
    //     yield put({
    //       type: "setState",
    //       payload: {
    //         appCategorlist: data.arr,
    //       },
    //     });
    //   }
    // },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
