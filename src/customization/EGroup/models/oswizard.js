import { queryAllTypeOfMO, query } from '../../../services/objectMO'
import { postNewNeAndIfs, issuePreview } from '../../../services/mowizard'
import { postMosIssueOffline } from '../../../services/dbWizard'

import { queryState } from '../../../services/ruleInstance'
import { message } from 'antd'
import queryString from "query-string";
import { routerRedux } from 'dva/router'
import { queryos, createOsFsDisk } from '../../../services/mo/os'

import { findAllApp } from '../../../services/appCategories'
import { genObj, genObj2, genObj3, genObj4, genOriginObj1 } from '../routes/oswizard/genFun'
import { getOsDiscovery, postOsWizardPreview, postOsOffline, savePreview, findById, ruleInstanceIssue } from '../../../services/osWizard'
import { assign } from 'lodash'
/**
* 非网络域自服务/操作系统自服务
* @namespace oswizard
* @requires module:非网络域自服务/网络自服务
*/
export default {

  namespace: 'oswizard',

  state: {
    wizardVisible: false,														//弹出窗口是否可见
    currentStep: 0,
    neitem: {},
    moList: [],
    list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    ifList: [],                                     //interface List
    policyAllList: [],
    policyExistList: [],
    policyList: [],
    errorList: [],
    all: [],   //方便接下来保存实例 save-preview接口
    existing: [],
    incremental: [],
    problem: [],
    preListType: 'UNISSUED',
    selectedRows: [],                //for interface
    selectedRowKeys: [],
    errorMessage: '',
    pageChange: 0,
    q: '',
    loadingEffect: false,
    batchDelete: false,
    lineWizardVisible: false,						//弹出窗口是否可见
    listLine: [],
    dbItem: {},
    batchSelect: [],                  //for MO or Lines
    secondSecAreaDisabled: true, //二级安全域禁用状态
    onIssueForbid: false,         //下发是否禁止标示
    appCategorlist: [],
    // infoBody: [],
    fssBody: [],
    disksBody: [],
    isMon: false,
    state: '',
    moType: 'OS',
    twoStepData: {},
    dbinfos: {},//存储第二步获取到的数据
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/oswizard') {
          dispatch({
            type: 'queryOses',
            payload: query,
          })
        }
      })
    },
  },

  effects: {
    /**
    * 获取操作系统数据列表
    * 与后台交互 调用接口 /api/v1/oses/ 
    * @function mowizard.queryOses
    */
    * queryOses({ payload }, { call, put }) {
      let params = { ...payload }
      let qs = "firstClass=='OS' and  (secondClass == 'OS_WINDOWS' or secondClass=='OS_LINUX') and thirdClass == 'null'"
      if (params.q === undefined || params.q === '') {
        params.q = qs
      } else {
        params.q += ';' + qs
      }
      const data = yield call(queryos, params)
      if (data.success) {
        yield put({
          type: 'queryOsSuccess',
          payload: {
            listDb: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: payload.q,
          },
        })
      }
    },

    /**
    * 操作系统信息发现
    * 与后台交互 调用接口 /api/v1/mos/discovery/os
    * @function oswizard.osDiscovery
    */
    * osDiscovery({ payload }, { put, call, select }) {
      const data = yield call(getOsDiscovery, payload)
      if (data.success && data.os !== undefined > 0) {
        // console.log('data', data)
        let curitem = data.os
        let infos = {}
        let restp = []
        let panes = [];
        if (data.fss || data.disks) {
          // console.log(22, tempInfos)
          yield put({
            type: 'setState',
            payload: {
              // infoBody: tempInfos,
              fssBody: data.fss,
              disksBody: data.disks,
            }
          })
          let tempInfos = [...data.fss, ...data.disks]
          tempInfos = genObj4(tempInfos)

          // let tempInfos = data.fss
          // console.log(11, tempInfos)
          tempInfos.forEach((item, index) => {
            let cols = []
            if (restp.indexOf(item.thirdClass) < 0) {
              restp.push(item.thirdClass)
              for (var i in item) {
                cols.push({ title: i, dataIndex: i, key: i })
              }
              infos[item.thirdClass] = { "columns": cols, "infos": [item], selectedRowKeys: [], selectedRows: [] }
            } else {
              infos[item.thirdClass].infos.push(item)
            }
          })
          // get panes from infos
          const titles = { 'OS_DISK': '磁盘', 'OS_FS': '文件系统' };
          for (var tp in infos) {
            panes.push({
              'title': titles[tp],
              'columns': infos[tp].columns,
              'dataSrc': infos[tp].infos,
              'key': tp
            })
          }
        };
        curitem.infos = infos
        curitem.panes = panes
        // console.log(5, curitem)
        yield put({
          type: 'setState',
          payload: {//必须使用
            dbItem: curitem,
            currentStep: 1,
            loadingEffect: false,
            twoStepData: curitem,
            moType: data.moType,
          },
        })
      } else {
        message.error(data.msg)
        yield put({
          type: 'setState',
          payload: {
            currentStep: 0,
            loadingEffect: false,
          }
        })
      }
    },
    /**
   * 查看操作系统实例生成的监控实例-变更
   * 与后台交互 调用接口 /api/v1/mos/discovery/os
   * @function dbwizard.queryOsPreview
   */
    * queryOsPreview({ payload }, { call, select, put }) {
      const fssBody = yield select(({ oswizard }) => oswizard.fssBody)
      const disksBody = yield select(({ oswizard }) => oswizard.disksBody)
      let originfss = genOriginObj1(payload.dbItem.infos, fssBody)
      let origindisks = genOriginObj1(payload.dbItem.infos, disksBody)
      let newData = {}
      newData = { ...payload.dbItem }
      // newData.infos = originInfos
      newData.fss = originfss
      newData.disks = origindisks
      const data = yield call(postOsWizardPreview, newData)
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            all: data.all,
            existing: data.existing,
            incremental: data.incremental,
            problem: data.problem,
            dbItem: payload.dbItem,
            currentStep: 2,
            loadingEffect: false,
            twoStepData: newData
          }
        })
        yield put({
          type: 'setPreviewLists',
          payload: data,
        })
      } else {
        message.error(data.msg)
        yield put({
          type: 'setState',
          payload: {
            currentStep: 1,
            dbItem: payload.dbItem,
            loadingEffect: false,
          }
        })
      }
    },
    /**
     * 上线-保存（下发）
     * 与后台交互 调用接口 /api/v1/dbs/
     * @function oswizard.createOs
     */
    * createOs({ payload }, { call, put, select }) {
      let currentItem = payload.currentItem
      let twoStepData = yield select(({ oswizard }) => oswizard.twoStepData)
      currentItem.infos = twoStepData.infos
      let fssBody = yield select(({ oswizard }) => oswizard.fssBody)
      let disksBody = yield select(({ oswizard }) => oswizard.disksBody)
      let preIssueJobInfo = {
        os: currentItem,
        fss: fssBody,
        disks: disksBody
      }
      const data = yield call(createOsFsDisk, preIssueJobInfo)
      console.log(5, data)
      if (data.success && data.os !== undefined) {//如果保存成功，那么根据types的类型去做相对应的操作
        message.success('设备保存成功！')
        //调用保存接口
        let params = {}
        params.os = data.os
        params.disks = yield select(({ oswizard }) => oswizard.disksBody)
        params.fss = yield select(({ oswizard }) => oswizard.fssBody)
        // params.preFss = []
        params.preFss = fssBody.filter((it) => it.isMonitored)
        params.preDisks = disksBody.filter((it) => it.isMonitored)
        params.preIssueResult = {}
        const all = yield select(({ oswizard }) => oswizard.all);
        const existing = yield select(({ oswizard }) => oswizard.existing)
        const incremental = yield select(({ oswizard }) => oswizard.incremental)
        const problem = yield select(({ oswizard }) => oswizard.problem)
        params.preIssueResult['all'] = all
        params.preIssueResult['existing'] = existing
        params.preIssueResult['incremental'] = incremental
        params.preIssueResult['problem'] = problem
        params.previewData = payload.policyList
        params.branch = data.os.branchName
        params.changeType = "ON"
        params.moIp = data.os.discoveryIP
        params.ip = data.os.discoveryIP
        params.moName = data.os.name
        params.moType = yield select(({ oswizard }) => oswizard.moType)

        if (payload.types === 'save') {//点击保存按钮
          const save = yield call(savePreview, params)
          if (save.success) {
            message.success('保存预览实例完成！')
          } else {
            message.warning('保存预览实例失败！')
          }
        } else if (payload.types === 'issue') {//点击下发按钮
          //调用下发接口
          const issue = yield call(issuePreview, params)
          if (issue.success) {
            message.success('操作系统下发完成！')
          } else {
            message.warning('操作系统下发失败！')
          }
        }
        const q = yield select(({ oswizard }) => oswizard.q)
        yield put({ type: 'queryOses', payload: { q: q } })
      } else {
        message.error(data.msg)
        yield put({
          type: 'setState',
          payload: {
            dbItem: {},
          },
        })
        throw data
      }
    },
    /**
   * 变更-保存（下发）
   * 与后台交互 调用接口 /api/v1/dbs/
   * @function oswizard.updateOs
   */
    * updateOs({ payload }, { select, call, put }) {
      let data = {}
      let currentItem = payload.currentItem
      let twoStepData = yield select(({ oswizard }) => oswizard.twoStepData)
      currentItem.infos = twoStepData.infos
      let fssBody = yield select(({ oswizard }) => oswizard.fssBody)
      let disksBody = yield select(({ oswizard }) => oswizard.disksBody)
      let preIssueJobInfo = {
        os: currentItem,
        fss: fssBody,
        disks: disksBody
      }
      data = yield call(createOsFsDisk, preIssueJobInfo)
      if (data.success) {
        message.success('设备修改成功！')
        //调用保存接口
        let params = {}
        params.os = data.os
        params.disks = yield select(({ oswizard }) => oswizard.disksBody)
        params.fss = yield select(({ oswizard }) => oswizard.fssBody)
        // params.preFss = []
        params.preFss = fssBody.filter((it) => it.isMonitored)
        params.preDisks = disksBody.filter((it) => it.isMonitored)
        params.preIssueResult = {}
        const all = yield select(({ oswizard }) => oswizard.all);
        const existing = yield select(({ oswizard }) => oswizard.existing)
        const incremental = yield select(({ oswizard }) => oswizard.incremental)
        const problem = yield select(({ oswizard }) => oswizard.problem)
        params.preIssueResult['all'] = all
        params.preIssueResult['existing'] = existing
        params.preIssueResult['incremental'] = incremental
        params.preIssueResult['problem'] = problem
        params.previewData = payload.policyList
        params.branch = data.os.branchName
        params.changeType = "CHANGE"
        params.moIp = data.os.discoveryIP
        params.ip = data.os.discoveryIP
        params.moName = data.os.name
        params.moType = yield select(({ oswizard }) => oswizard.moType)
        if (payload.types === 'save') {//点击保存按钮
          const save = yield call(savePreview, params)
          if (save.success) {
            message.success('保存预览实例完成！')
          } else {
            message.warning('保存预览实例失败！')
          }
        } else if (payload.types === 'issue') {//点击下发按钮
          //调用下发接口
          const issue = yield call(issuePreview, params)
          if (issue.success) {
            message.success('操作系统下发完成！')
          } else {
            message.warning('操作系统下发失败！')
          }
        }
        const q = yield select(({ oswizard }) => oswizard.q)
        yield put({ type: 'queryOses', payload: { q: q } })
      } else {
        message.error('设备修改失败！')
        throw data
      }
    },
    /**
   * 下线-保存（下发）
   * 与后台交互 调用接口 /api/v1/mos/offline
   * @function oswizard.deleteOs
   */
    * deleteOs({ payload }, { select, call, put }) {
      let params = {}
      let moCriteria = ''
      let issueParams = { oper: 11 }
      params.uuids = payload.uuids
      if (payload.save === 'save') {
        const data = yield call(postOsOffline, params)
        if (data.success) {
          message.success('操作系统下线成功！')
          yield put({ type: 'queryOses', payload: { q: payload.q } })
        } else {
          message.error(data.msg)
          throw data
        }
      } else if (payload.save === 'issue') {
        //下线设备也需要实现下发  才能真正意义上的下线设备
        if (params.uuids.length === 1) {//如果只有一个设备需要下线  直接拼接
          moCriteria = 'uuid == ' + params.uuids[0]
        } else {//如果是批量的下线   组装字符串
          params.uuids.forEach((item, index) => {
            moCriteria = moCriteria + (index === 0 ? '' : ' or ') + 'uuid == ' + item
          })
        }
        issueParams.moCriteria = moCriteria//添加下发的条件
        const issue = yield call(ruleInstanceIssue, issueParams)
        if (issue.success) {
          message.success('操作系统下线并下发！')
          yield put({ type: 'queryOses', payload: { q: payload.q } })
        } else {
          message.error('操作系统下线失败！')
        }
      }
    },
    /**
    * 变更-操作系统
    * 与后台交互 调用接口/api/v1/mos/change
    * @function dbwizard.findOsById
    */
    * findOsById({ payload }, { call, put }) {
      const data = yield call(findById, payload.currentItem)
      // debugger
      if (data.success) {
        let curitem = data.os
        let infos = {}
        let restp = []
        let panes = [];
        if (data.fss || data.disks) {
          yield put({
            type: 'setState',
            payload: {
              fssBody: data.fss,
              disksBody: data.disks,
            }
          })
          let tempInfos = [...data.fss, ...data.disks]
          tempInfos = genObj4(tempInfos)
          tempInfos.forEach((item, index) => {
            let cols = []
            if (restp.indexOf(item.thirdClass) < 0) {
              restp.push(item.thirdClass)
              for (var i in item) {
                cols.push({ title: i, dataIndex: i, key: i })
              }
              infos[item.thirdClass] = { "columns": cols, "infos": [item], selectedRowKeys: [], selectedRows: [] }
            } else {
              infos[item.thirdClass].infos.push(item)
            }
          })
          curitem.infos = genObj3(infos)
          const titles = { 'OS_DISK': '磁盘', 'OS_FS': '文件系统' };
          for (var tp in infos) {
            panes.push({
              'title': titles[tp],
              'columns': curitem.infos[tp].columns,
              'dataSrc': curitem.infos[tp].infos,
              'key': tp
            })
          }
        };
        curitem.panes = panes
        yield put({
          type: 'setState',
          payload: {//必须使用
            dbItem: curitem,
            currentStep: 1,
            osWizardVisible: true,
            loadingEffect: false,
            twoStepData: curitem
          },
        })
      } else {
        message.error(data.msg)
      }
    },

    /**
     * 判断是否可以下发
     * 调用接口 /api/v1/issue-action-config/
     * @function dbwizard.issueJudge
     */
    *issueJudge({ payload }, { call, put }) {
      const issueJudge = yield call(queryState, payload)      //判断是否可以下发
      if (issueJudge.success) {
        yield put({
          type: 'setState',
          payload: {
            onIssueForbid: issueJudge.content[0].disable
          }
        })
      }
    },
    /**
   * 监控实例分类 同步
   * @function dbwizard.setPreviewLists
   */
    *setPreviewLists({ payload }, { put }) {
      let dataAll = payload.all
      let dataExisting = payload.existing
      let dataIncremental = payload.incremental
      let dataProblem = payload.problem
      if ((dataAll) && (dataAll.length > 0)) {
        var i = 0
        dataAll.forEach(item => {
          item.id = ++i
        })
      }
      if ((dataExisting) && (dataExisting.length > 0)) {
        var i = 0
        dataExisting.forEach(item => {
          item.id = ++i
        })
      }
      if ((dataIncremental) && (dataIncremental.length > 0)) {
        var i = 0
        dataIncremental.forEach(item => {
          item.id = ++i
        })
      }
      if ((dataProblem) && (dataProblem.length > 0)) {
        var i = 0
        dataProblem.forEach(item => {
          item.id = ++i
        })
      }
      yield put({
        type: 'setState',
        payload: {
          policyAllList: dataAll,
          policyExistList: dataExisting,
          policyList: dataIncremental,
          errorList: dataProblem,
        },
      })
    },
    /**
   * 操作系统下发下线
   * 调用后台 /api/v1/rule-instances/issue-offline
   * @function oswizard.issueOffline
   */
    *issueOffline({ payload }, { call, put }) {
      let params = {}
      params.uuids = payload.uuids
      const data = yield call(postMosIssueOffline, params)
      if (data.success) {
        message.success('设备下线下发成功！')
        yield put({ type: payload.next, payload: { q: payload.q } })
      } else {
        message.error(data.msg)
        throw data
      }
    },
    /**
   * 查询app
   * 调用后台 /api/v1/app-categories/
   * @function oswizard.appcategories
   */
    *appcategories({ payload }, { call, put }) {
      const data = yield call(findAllApp, payload)
      console.log("dataa", data)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            appCategorlist: data.arr,
          }
        })
      }
    },
    *updateOsinfos({ payload }, { select, call, put }) {
      let { dbItem } = yield select(_ => _.oswizard);
      dbItem.infos = payload.dbinfos;
      yield put({
        type: 'setState',
        payload: {
          dbItem: dbItem,
        }
      });
    },
  },
  reducers: {
    //浏览列表
    querySuccess(state, action) {
      const {
        list, pagination, detail, q,
      } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
        detail,
      }
    },

    queryOsSuccess(state, action) {
      const {
        listDb, pagination, detail, q,
      } = action.payload
      return {
        ...state,
        listDb,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
        detail,
      }
    },
    //gwq
    setState(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
