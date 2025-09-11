import { query, create, remove, update, queryUser, queryMO, currentUserPermissions, allPermissions, findById, getRole, findMOS } from '../services/roles'
import { query as queryUserInfo } from '../services/userinfo'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { parse } from 'qs'
import queryString from 'query-string'
import NProgress from 'nprogress'
import { ozr } from '../utils/clientSetting'
import { getMenus } from '../utils/FormValTool'
message.config({ top: 150, duration: 2 })
export default {

  namespace: 'roles',

  state: {
    modalState: false,
    keys: 0,
    list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
    authorizationVisible: false,
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    pagination1: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    selectedRows: [],
    grantVisible: false,
    jiaList: [{
      index: 1, moid: 'uuid', tool: '=', moname: '', mouuid: '',
    }],
    jianList: [{
      index: 1, moid: 'uuid', tool: '!=', moname: '', mouuid: '',
    }],
    dataList: [{
      index: 1, moid: 'branch', tool: 'like', moname: '', mouuid: '',
    }],
    basicDataOp: 'AND',
    selectMOVisible: false,
    userList: [],
    oelFilterValue: {}, //告警授权
    oelFilterOldValue: {}, //告警授权
    selectedKeys: [], //初始化菜单，选中的菜单节点
    checkedFlg: {}, //初始化功能选择
    displayFlg1: {}, //功能授权---根据当前用户角色限制《角色授权》
    displayFlg2: [], //菜单授权---根据当前用户角色限制《菜单授权》
    checkedKeys: [], //手动选择的菜单，id数组
    conditionNotf: { filterMode: 'ADVANCED' },
    conditionAdv: { filterMode: 'ADVANCED' },
    moAddState: false,
    moDeleteState: false,
    moUpdateState: false,
    moReadState: false,
    tagAddState: false,
    tagDeleteState: false,
    tagUpdateState: false,
    tagReadState: false,
    toolAddState: false,
    toolDeleteState: false,
    toolUpdateState: false,
    toolReadState: false,
    ptAddState: false,
    ptDeleteState: false,
    ptUpdateState: false,
    ptReadState: false,
    priAddState: false,
    prDeleteState: false,
    prUpdateState: false,
    prReadState: false,
    prIssuState: false,
    prCalculationState: false,
    riAddState: false,
    riDeleteState: false,
    riUpdateState: false,
    riReadState: false,
    siAddState: false,
    siDeleteState: false,
    siUpdateState: false,
    siReadState: false,
    ziAddState: false,
    ziDeleteState: false,
    ziUpdateState: false,
    ziReadState: false,
    tpAddState: false,
    tpDeleteState: false,
    tpUpdateState: false,
    tpReadState: false,
    notfAddState: false,
    notfDeleteState: false,
    notfUpdateState: false,
    notfReadState: false,
    oelReadState: false,
    oelConfirmState: false,
    oelCloseState: false,
    luAddState: false,
    luDeleteState: false,
    luUpdateState: false,
    luReadState: false,
    mvReadState: false,
    cvReadState: false,
    bvReadState: false,
    hvReadState: false,
    uiAddState: false,
    uiDeleteState: false,
    uiUpdateState: false,
    uiReadState: false,
    rolesAddState: false,
    rolesDeleteState: false,
    rolesUpdateState: false,
    rolesReadState: false,
    mtAddState: false,
    mtDeleteState: false,
    mtUpdateState: false,
    mtReadState: false,
    mtdisableState: false,
    mrAddState: false,
    mrDeleteState: false,
    mrUpdateState: false,
    mrReadState: false,
    advAddState: false,
    advUpdateState: false,
    fcAddState: false,
    fcDeleteState: false,
    fcUpdateState: false,
    fcReadState: false,
    pfReadState: false,
    efAddState: false, //过滤器
    efDeleteState: false,
    efUpdateState: false,
    efReadState: false,
    ostsAddState: false, //数据源配置
    ostsDeleteState: false,
    ostsUpdateState: false,
    ostsReadState: false,
    etAddState: false, //工具列表
    etDeleteState: false,
    etUpdateState: false,
    etReadState: false,
    evAddState: false, //视图配置
    evDeleteState: false,
    evUpdateState: false,
    evReadState: false,
    jobAddState: false,//任务管理
    jobDeleteState: false,
    jobUpdateState: false,
    jobReadState: false,
    myCreateState: false,//我的维护期
    myShortState: false,
    myPreState: false,
    myCheckState: false,
    registerAddState: false,
    registerDeleteState: false,
    registerUpdateState: false,
    registerReadState: false,
    // 个性化策略
    personalAddState: false,
    personalDeleteState: false,
    personalUpdateState: false,
    personalReadState: false,

    moAddFilterValue: { basicLogicOp: 'AND' }, //监控对象新增过滤授权
    moDeleteFilterValue: { basicLogicOp: 'AND' }, //监控对象删除过滤授权
    moUpdateFilterValue: { basicLogicOp: 'AND' }, //监控对象修改过滤授权
    moReadFilterValue: { basicLogicOp: 'AND' }, //监控对象查看过滤授权

    tagAddFilterValue: { basicLogicOp: 'AND' }, //标签管理
    tagDeleteFilterValue: { basicLogicOp: 'AND' },
    tagUpdateFilterValue: { basicLogicOp: 'AND' },
    tagReadFilterValue: { basicLogicOp: 'AND' },

    toolAddFilterValue: { basicLogicOp: 'AND' }, //监控工具
    toolDeleteFilterValue: { basicLogicOp: 'AND' },
    toolUpdateFilterValue: { basicLogicOp: 'AND' },
    toolReadFilterValue: { basicLogicOp: 'AND' },

    ptAddFilterValue: { basicLogicOp: 'AND' }, //策略模板
    ptDeleteFilterValue: { basicLogicOp: 'AND' },
    ptUpdateFilterValue: { basicLogicOp: 'AND' },
    ptReadFilterValue: { basicLogicOp: 'AND' },

    priAddFilterValue: { basicLogicOp: 'AND' }, //策略规则
    prDeleteFilterValue: { basicLogicOp: 'AND' },
    prUpdateFilterValue: { basicLogicOp: 'AND' },
    prReadFilterValue: { basicLogicOp: 'AND' },
    prIssuFilterValue: { basicLogicOp: 'AND' },
    prCalculationFilterValue: { basicLogicOp: 'AND' },

    riAddFilterValue: { basicLogicOp: 'AND' }, //监控实例
    riDeleteFilterValue: { basicLogicOp: 'AND' },
    riUpdateFilterValue: { basicLogicOp: 'AND' },
    riReadFilterValue: { basicLogicOp: 'AND' },

    siAddFilterValue: { basicLogicOp: 'AND' }, //指标管理
    siDeleteFilterValue: { basicLogicOp: 'AND' },
    siUpdateFilterValue: { basicLogicOp: 'AND' },
    siReadFilterValue: { basicLogicOp: 'AND' },

    ziAddFilterValue: { basicLogicOp: 'AND' }, //指标实现
    ziDeleteFilterValue: { basicLogicOp: 'AND' },
    ziUpdateFilterValue: { basicLogicOp: 'AND' },
    ziReadFilterValue: { basicLogicOp: 'AND' },

    tpAddFilterValue: { basicLogicOp: 'AND' }, //周期管理
    tpDeleteFilterValue: { basicLogicOp: 'AND' },
    tpUpdateFilterValue: { basicLogicOp: 'AND' },
    tpReadFilterValue: { basicLogicOp: 'AND' },

    notfAddFilterValue: { basicLogicOp: 'AND' }, //通知管理
    notfDeleteFilterValue: { basicLogicOp: 'AND' },
    notfUpdateFilterValue: { basicLogicOp: 'AND' },
    notfReadFilterValue: { basicLogicOp: 'AND' },

    oelReadFilterValue: { basicLogicOp: 'AND' }, //oel
    oelConfirmFilterValue: { basicLogicOp: 'AND' },
    oelCloseFilterValue: { basicLogicOp: 'AND' },

    luAddFilterValue: { basicLogicOp: 'AND' }, //lookup表维护
    luDeleteFilterValue: { basicLogicOp: 'AND' },
    luUpdateFilterValue: { basicLogicOp: 'AND' },
    luReadFilterValue: { basicLogicOp: 'AND' },

    mvReadFilterValue: { basicLogicOp: 'AND' }, //服务台

    cvReadFilterValue: { basicLogicOp: 'AND' }, //总行监控视图

    bvReadFilterValue: { basicLogicOp: 'AND' }, //分行监控视图

    hvReadFilterValue: { basicLogicOp: 'AND' }, //历史告警视图

    uiAddFilterValue: { basicLogicOp: 'AND' }, //用户
    uiDeleteFilterValue: { basicLogicOp: 'AND' },
    uiUpdateFilterValue: { basicLogicOp: 'AND' },
    uiReadFilterValue: { basicLogicOp: 'AND' },

    rolesAddFilterValue: { basicLogicOp: 'AND' }, //角色
    rolesDeleteFilterValue: { basicLogicOp: 'AND' },
    rolesUpdateFilterValue: { basicLogicOp: 'AND' },
    rolesReadFilterValue: { basicLogicOp: 'AND' },

    mtAddFilterValue: { basicLogicOp: 'AND' }, //维护期模板
    mtDeleteFilterValue: { basicLogicOp: 'AND' },
    mtUpdateFilterValue: { basicLogicOp: 'AND' },
    mtReadFilterValue: { basicLogicOp: 'AND' },

    mrAddFilterValue: { basicLogicOp: 'AND' }, //维护期实例
    mrDeleteFilterValue: { basicLogicOp: 'AND' },
    mrUpdateFilterValue: { basicLogicOp: 'AND' },
    mrReadFilterValue: { basicLogicOp: 'AND' },
    advAddFilterValue: { basicLogicOp: 'AND' },
    advUpdateFilterValue: { basicLogicOp: 'AND' },
    mtdisableFilterValue: { basicLogicOp: 'AND' },

    fcAddFilterValue: { basicLogicOp: 'AND' }, //报表配置
    fcDeleteFilterValue: { basicLogicOp: 'AND' },
    fcUpdateFilterValue: { basicLogicOp: 'AND' },
    fcReadFilterValue: { basicLogicOp: 'AND' },

    pfReadFilterValue: { basicLogicOp: 'AND' }, //性能

    readJobsFilterValue: { basicLogicOp: 'AND' },//任务管理
    updateJobsFilterValue: { basicLogicOp: 'AND' },
    delJobsFilterValue: { basicLogicOp: 'AND' },
    addJobsFilterValue: { basicLogicOp: 'AND' },

    myCreateFilterValue: { basicLogicOp: 'AND' }, //我的维护期
    myShortFilterValue: { basicLogicOp: 'AND' },
    myPreFilterValue: { basicLogicOp: 'AND' },
    myCheckFilterValue: { basicLogicOp: 'AND' },

    addRegisterFilterValue: { basicLogicOp: 'AND' },  //服务注册
    delRegisterFilterValue: { basicLogicOp: 'AND' },
    updateRegisterFilterValue: { basicLogicOp: 'AND' },
    readRegisterFilterValue: { basicLogicOp: 'AND' },

    addPersonalFilterValue: { basicDataOp: 'AND' }, // 个性化策略
    delPersonalFilterValue: { basicDataOp: 'AND' },
    updatePersonalFilterValue: { basicDataOp: 'AND' },
    readPersonalFilterValue: { basicDataOp: 'AND' },

    treeData: [], //当前功能用户拥有的功能权限数组
    permissionsTree: [], //用户菜单权限
    allPermission: [], //全部的菜单节点，包括父节点
    pageChange: 0,
    q: '',
    authorization: [],
    userInfoList: [],
    colors: { color: '#666666' },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/roles') {
          let query = location.query
          if (query === undefined) {
            query = queryString.parse(location.search)
          }
          dispatch({
            type: 'query',
            payload: query,
          })
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      const data = yield call(query, payload)
      const currentData = yield call(currentUserPermissions, payload)
      //获取当前用户功能权限，授权页面用----------start
      let displayFlg1 = {}
      let treeData = []
      if (currentData && currentData.currentPermissions && currentData.currentPermissions.length > 0) {
        for (let i = 0; i < currentData.currentPermissions.length; i++) {
          let mukuai = currentData.currentPermissions[i]
          if (mukuai.key === 'MO') {
            let treeList = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  displayFlg1.display_mo_see = true
                  treeList.push({
                    title: '查看监控对象',
                    key: 'checked_mo_see',
                  })
                } else if (caozuo.action === 'CREATE') {
                  treeList.push({
                    title: '新增监控对象',
                    key: 'checked_mo_create',
                  })
                  displayFlg1.display_mo_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList.push({
                    title: '编辑监控对象',
                    key: 'checked_mo_update',
                  })
                  displayFlg1.display_mo_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList.push({
                    title: '删除监控对象',
                    key: 'checked_mo_delete',
                  })
                  displayFlg1.display_mo_delete = true
                }
              }
              treeData.push({
                title: '监控对象',
                key: '1',
                children: treeList,
              })
            }
          } else if (mukuai.key === 'RULE') {
            let treeList1 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList1.push({
                    title: '查看规则',
                    key: 'checked_rule_see',
                  })
                  displayFlg1.display_rule_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList1.push({
                    title: '新增规则',
                    key: 'checked_rule_create',
                  },)
                  displayFlg1.display_rule_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList1.push({
                    title: '编辑规则',
                    key: 'checked_rule_update',
                  })
                  displayFlg1.display_rule_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList1.push({
                    title: '删除规则',
                    key: 'checked_rule_delete',
                  })
                  displayFlg1.display_rule_delete = true
                } else if (caozuo.action === 'ISSUE') {
                  treeList1.push({
                    title: '下发规则',
                    key: 'checked_rule_issu',
                  })
                  displayFlg1.display_rule_issu = true
                } else if (caozuo.action === 'CALC') {
                  treeList1.push({
                    title: '计算规则',
                    key: 'checked_rule_cal',
                  })
                  displayFlg1.display_rule_cal = true
                }
              }
              treeData.push({
                title: '策略规则',
                key: '2',
                children: treeList1,
              })
            }
          } else if (mukuai.key === 'POLICY_TEMPLATE') {
            let treeList2 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList2.push({
                    title: '查看策略模板',
                    key: 'checked_temp_see',
                  })
                  displayFlg1.display_temp_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList2.push({
                    title: '新增策略模板',
                    key: 'checked_temp_create',
                  })
                  displayFlg1.display_temp_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList2.push({
                    title: '编辑策略模板',
                    key: 'checked_temp_update',
                  })
                  displayFlg1.display_temp_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList2.push({
                    title: '删除策略模板',
                    key: 'checked_temp_delete',
                  })
                  displayFlg1.display_temp_delete = true
                }
              }
              treeData.push({
                title: '策略模板',
                key: '3',
                children: treeList2,
              })
            }
          } else if (mukuai.key === 'RULE_INST') {
            let treeList3 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList3.push({
                    title: '查看监控实例',
                    key: 'checked_inst_see',
                  })
                  displayFlg1.display_inst_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList3.push({
                    title: '新增监控实例',
                    key: 'checked_inst_create',
                  })
                  displayFlg1.display_inst_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList3.push({
                    title: '编辑监控实例',
                    key: 'checked_inst_update',
                  })
                  displayFlg1.display_inst_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList3.push({
                    title: '删除监控实例',
                    key: 'checked_inst_delete',
                  })
                  displayFlg1.display_inst_delete = true
                }
              }
              treeData.push({
                title: '监控实例',
                key: '4',
                children: treeList3,
              })
            }
          } else if (mukuai.key === 'ALARM') {
            let treeList4 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList4.push({
                    title: '查看告警',
                    key: 'checked_alarm_see',
                  })
                  displayFlg1.display_alarm_see = true
                } else if (caozuo.action === 'ACK') {
                  treeList4.push({
                    title: '确认告警',
                    key: 'checked_alarm_confirm',
                  })
                  displayFlg1.display_alarm_confirm = true
                } else if (caozuo.action === 'CLOSE') {
                  treeList4.push({
                    title: '关闭告警',
                    key: 'checked_alarm_close',
                  })
                  displayFlg1.display_alarm_close = true
                } else if (caozuo.action === 'ARCHIEVE') {
                  displayFlg1.display_alarm_arch = true
                }
              }
              treeData.push({
                title: '告警',
                key: '5',
                children: treeList4,
              })
            }
          } else if (mukuai.key === 'POLICY') {
            let treeList5 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList5.push({
                    title: '查看策略实例',
                    key: 'checked_policy_see',
                  })
                  displayFlg1.display_policy_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList5.push({
                    title: '新增策略实例',
                    key: 'checked_policy_create',
                  })
                  displayFlg1.display_policy_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList5.push({
                    title: '编辑策略实例',
                    key: 'checked_policy_update',
                  })
                  displayFlg1.display_policy_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList5.push({
                    title: '删除策略实例',
                    key: 'checked_policy_delete',
                  })
                  displayFlg1.display_policy_delete = true
                }
              }
              treeData.push({
                title: '策略实例',
                key: '6',
                children: treeList5,
              })
            }
          } else if (mukuai.key === 'USER') {
            let treeList6 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList6.push({
                    title: '查看用户',
                    key: 'checked_user_see',
                    state: displayFlg1.display_user_see,
                  })
                  displayFlg1.display_user_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList6.push({
                    title: '新增用户',
                    key: 'checked_user_create',
                  })
                  displayFlg1.display_user_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList6.push({
                    title: '编辑用户',
                    key: 'checked_user_update',
                  })
                  displayFlg1.display_user_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList6.push({
                    title: '删除用户',
                    key: 'checked_user_delete',
                  })
                  displayFlg1.display_user_delete = true
                }
              }
              treeData.push({
                title: '用户管理',
                key: '7',
                children: treeList6,
              })
            }
          } else if (mukuai.key === 'ROLE') {
            let treeList7 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList7.push({
                    title: '查看角色',
                    key: 'checked_role_see',
                  })
                  displayFlg1.display_role_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList7.push({
                    title: '新增角色',
                    key: 'checked_role_create',
                  })
                  displayFlg1.display_role_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList7.push({
                    title: '编辑角色',
                    key: 'checked_role_update',
                  })
                  displayFlg1.display_role_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList7.push({
                    title: '删除角色',
                    key: 'checked_role_delete',
                  })
                  displayFlg1.display_role_delete = true
                }
              }
              treeData.push({
                title: '角色管理',
                key: '8',
                children: treeList7,
              })
            }
          } else if (mukuai.key === 'TOOL') {
            let treeList8 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList8.push({
                    title: '查看工具',
                    key: 'checked_tool_see',
                  })
                  displayFlg1.display_tool_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList8.push({
                    title: '新增工具',
                    key: 'checked_tool_create',
                  })
                  displayFlg1.display_tool_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList8.push({
                    title: '编辑工具',
                    key: 'checked_tool_update',
                  })
                  displayFlg1.display_tool_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList8.push({
                    title: '删除工具',
                    key: 'checked_tool_delete',
                  })
                  displayFlg1.display_tool_delete = true
                }
              }
              treeData.push({
                title: '监控工具',
                key: '9',
                children: treeList8,
              })
            }
          } else if (mukuai.key === 'TIME_PERIOD') {
            let treeList9 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList9.push({
                    title: '查看时间周期',
                    key: 'checked_time_see',
                  })
                  displayFlg1.display_time_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList9.push({
                    title: '新增时间周期',
                    key: 'checked_time_create',
                  })
                  displayFlg1.display_time_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList9.push({
                    title: '编辑时间周期',
                    key: 'checked_time_update',
                  })
                  displayFlg1.display_time_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList9.push({
                    title: '删除时间周期',
                    key: 'checked_time_delete',
                  })
                  displayFlg1.display_time_delete = true
                }
              }
              treeData.push({
                title: '时间周期',
                key: '10',
                children: treeList9,
              })
            }
          } else if (mukuai.key === 'ZABBIX_ITEM') {
            let treeList10 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList10.push({
                    title: '查看指标实现',
                    key: 'checked_zabbix_see',
                  })
                  displayFlg1.display_zabbix_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList10.push({
                    title: '新增指标实现',
                    key: 'checked_zabbix_create',
                  })
                  displayFlg1.display_zabbix_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList10.push({
                    title: '编辑指标实现',
                    key: 'checked_zabbix_update',
                  })
                  displayFlg1.display_zabbix_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList10.push({
                    title: '删除指标实现',
                    key: 'checked_zabbix_delete',
                  })
                  displayFlg1.display_zabbix_delete = true
                }
              }
              treeData.push({
                title: '指标实现',
                key: '12',
                children: treeList10,
              })
            }
          } else if (mukuai.key === 'KPI') {
            let treeList11 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList11.push({
                    title: '查看指标',
                    key: 'checked_kpi_see',
                  })
                  displayFlg1.display_kpi_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList11.push({
                    title: '新增指标',
                    key: 'checked_kpi_create',
                  })
                  displayFlg1.display_kpi_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList11.push({
                    title: '编辑指标',
                    key: 'checked_kpi_update',
                  })
                  displayFlg1.display_kpi_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList11.push({
                    title: '删除指标',
                    key: 'checked_kpi_delete',
                  })
                  displayFlg1.display_kpi_delete = true
                }
              }
              treeData.push({
                title: '指标',
                key: '11',
                children: treeList11,
              })
            }
          } else if (mukuai.key === 'MT_TEMPLATE') {
            let treeList12 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList12.push({
                    title: '查看模板管理',
                    key: 'checked_mt_template_see',
                  })
                  displayFlg1.display_mt_template_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList12.push({
                    title: '新增模板管理',
                    key: 'checked_mt_template_create',
                  })
                  displayFlg1.display_mt_template_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList12.push({
                    title: '编辑模板管理',
                    key: 'checked_mt_template_update',
                  })
                  displayFlg1.display_mt_template_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList12.push({
                    title: '删除模板管理',
                    key: 'checked_mt_template_delete',
                  })
                  displayFlg1.display_mt_template_delete = true
                }
              }
              treeData.push({
                title: '维护期模板管理',
                key: '13',
                children: treeList12,
              })
            }
          } else if (mukuai.key === 'MT') {
            let treeList13 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList13.push({
                    title: '查看实例管理',
                    key: 'checked_mt_see',
                  })
                  displayFlg1.display_mt_see = true
                } else if (caozuo.action === 'CREATE') {
                  treeList13.push({
                    title: '新增实例管理',
                    key: 'checked_mt_create',
                  })
                  displayFlg1.display_mt_create = true
                } else if (caozuo.action === 'UPDATE') {
                  treeList13.push({
                    title: '编辑实例管理',
                    key: 'checked_mt_update',
                  })
                  displayFlg1.display_mt_update = true
                } else if (caozuo.action === 'DELETE') {
                  treeList13.push({
                    title: '删除实例管理',
                    key: 'checked_mt_delete',
                  })
                  displayFlg1.display_mt_delete = true
                } else if (caozuo.action === 'EXPERT_CREATE') {
                  treeList13.push({
                    title: '创建专家模式',
                    key: 'checked_mt_expert_create',
                  })
                  displayFlg1.display_mt_expert_create = true
                } else if (caozuo.action === 'EXPERT_UPDATE') {
                  treeList13.push({
                    title: '编辑专家模式',
                    key: 'checked_mt_expert_update',
                  })
                  displayFlg1.display_mt_expert_update = true
                }
              }
              treeData.push({
                title: '维护期实例管理',
                key: '14',
                children: treeList13,
              })
            }
          } else if (mukuai.key === 'REPORTER_STATUS') {
            let treeList14 = []
            if (mukuai.permissions && mukuai.permissions.length > 0) {
              for (let j = 0; j < mukuai.permissions.length; j++) {
                let caozuo = mukuai.permissions[j]
                if (caozuo.action === 'READ') {
                  treeList14.push({
                    title: '查看历史告警',
                    key: 'checked_reporter_statu_see',
                  })
                  displayFlg1.display_reporter_statu_see = true
                }
              }
              treeData.push({
                title: '历史告警查询',
                key: '15',
                children: treeList14,
              })
            }
          }
        }
      }
      //获取当前用户功能权限，授权页面用----------end
      //获取当前用户菜单权限，授权页面用----------start
      let displayFlg2 = []
      if (currentData && currentData.uiPermissions && currentData.uiPermissions.length > 0) {
        for (let i = 0; i < currentData.uiPermissions.length; i++) {
          let uiPermission = currentData.uiPermissions[i]
          let id = uiPermission.id
          displayFlg2.push(id)
        }
      }
      //获取当前用户菜单权限，授权页面用----------end

      if (data.success) {
        let uuids = []
        data.content.forEach((item, index) => {
          if (item.dataPermissions) {
            item.dataPermissions.forEach((item2, index) => {
              if (item2.resType === 'MO') {
                if (item2.permissions.length > 0) {
                  let included = item2.permissions[0].permissionFilter.included
                  if (included && included.length > 0) {
                    included.forEach((item3, index) => {
                      uuids.push(item3.value)
                    })
                  }
                  let excluded = item2.permissions[0].permissionFilter.excluded
                  if (excluded && excluded.length > 0) {
                    excluded.forEach((item3, index) => {
                      uuids.push(item3.value)
                    })
                  }
                }
              }
            })
          }
        })

        if (uuids.length > 0) {
          const mos = yield call(queryMO, uuids)
          data.content.forEach((item, index) => {
            if (item.dataPermissions) {
              item.dataPermissions.forEach((item2, index) => {
                if (item2.resType === 'MO') {
                  if (item2.permissions.length > 0) {
                    let included = item2.permissions[0].permissionFilter.included
                    if (included && included.length > 0) {
                      included.forEach((item3, index) => {
                        let uuid0 = item3.value
                        item3.value = {
                          uuid: uuid0,
                          name: '未找到匹配设备',
                        }

                        mos.content.forEach((item4, index) => {
                          if (item4.uuid === uuid0) {
                            item3.value.name = item4.name
                          }
                        })
                      })
                    }

                    let excluded = item2.permissions[0].permissionFilter.excluded
                    if (excluded && excluded.length > 0) {
                      excluded.forEach((item3, index) => {
                        let uuid0 = item3.value
                        item3.value = {
                          uuid: uuid0,
                          name: '未找到匹配设备',
                        }

                        mos.content.forEach((item4, index) => {
                          if (item4.uuid === uuid0) {
                            item3.value.name = item4.name
                          }
                        })
                      })
                    }
                  }
                }
              })
            }
          })
        }
        yield put({
          type: 'querySuccess',
          payload: {
            treeData,
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            displayFlg1,
            displayFlg2,
            q: payload.q,
          },
        })
      }
    },
    * queryUser({ payload }, { call, put }) {
      const data = yield call(queryUser, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess1',
          payload: {
            userList: data.content,
            pagination1: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
          },
        })
      }
    },
    * create({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
        },
      })
      message.loading('正在新建角色,请稍后...', 0)
      const data = yield call(create, payload)
      if (data.success) {
        message.destroy()
        message.success('保存成功！')
        yield put({ type: 'requery' })
      } else {
        message.destroy()
        throw data
      }
    },
    * requery({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: location.pathname,
        query: parse(location.search.substr(1)),
      }))
    },
    * delete({ payload }, { call, put }) {
      message.loading('正在删除角色,请稍后...', 0)
      const data = yield call(remove, { payload })
      if (data.success) {
        message.destroy()
        message.success('删除成功！')
        yield put({ type: 'requery' })
      } else {
        message.destroy()
        throw data
      }
    },
    * update({ payload }, { select, call, put }) {
      message.loading('正在修改角色信息,请稍后...', 0)
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          grantVisible: false,
        },
      })
      const id = yield select(({ roles }) => roles.currentItem.uuid)
      const newTool = { ...payload, id }
      newTool.uuid = id
      const data = yield call(update, newTool)
      if (data.success) {
        message.destroy()
        message.success('修改成功！')
        yield put({ type: 'requery' })
      } else {
        message.destroy()
        throw data
      }
    },
    * grant({ payload }, { select, call, put }) {
      const permissions = yield call(allPermissions, payload)
      let map = new Map()
      permissions.content.forEach((item, index) => {
        map.set(`${item.key}_${item.action}`, item.uuid)
      })
      const checkedFlg = yield select(({ roles }) => roles.checkedFlg)
      //处理功能授权------------start
      let permissionUUIDs = []
      if (checkedFlg.checked_mo_see) {
        let uuid = map.get('MO' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mo_create) {
        let uuid = map.get('MO' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mo_update) {
        let uuid = map.get('MO' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mo_delete) {
        let uuid = map.get('MO' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_rule_see) {
        let uuid = map.get('RULE' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_rule_create) {
        let uuid = map.get('RULE' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_rule_update) {
        let uuid = map.get('RULE' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_rule_delete) {
        let uuid = map.get('RULE' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_rule_issu) {
        let uuid = map.get('RULE' + '_' + 'ISSUE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_rule_cal) {
        let uuid = map.get('RULE' + '_' + 'CALC')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_temp_see) {
        let uuid = map.get('POLICY_TEMPLATE' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_temp_create) {
        let uuid = map.get('POLICY_TEMPLATE' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_temp_update) {
        let uuid = map.get('POLICY_TEMPLATE' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_temp_delete) {
        let uuid = map.get('POLICY_TEMPLATE' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_inst_see) {
        let uuid = map.get('RULE_INST' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_inst_create) {
        let uuid = map.get('RULE_INST' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_inst_update) {
        let uuid = map.get('RULE_INST' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_inst_delete) {
        let uuid = map.get('RULE_INST' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_alarm_see) {
        let uuid = map.get('ALARM' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_alarm_confirm) {
        let uuid = map.get('ALARM' + '_' + 'ACK')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_alarm_close) {
        let uuid = map.get('ALARM' + '_' + 'CLOSE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_alarm_arch) {
        let uuid = map.get('ALARM' + '_' + 'ARCHIEVE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_policy_see) {
        let uuid = map.get('POLICY' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_policy_create) {
        let uuid = map.get('POLICY' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_policy_update) {
        let uuid = map.get('POLICY' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_policy_delete) {
        let uuid = map.get('POLICY' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_user_see) {
        let uuid = map.get('USER' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_user_create) {
        let uuid = map.get('USER' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_user_update) {
        let uuid = map.get('USER' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_user_delete) {
        let uuid = map.get('USER' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_role_see) {
        let uuid = map.get('ROLE' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_role_create) {
        let uuid = map.get('ROLE' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_role_update) {
        let uuid = map.get('ROLE' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_role_delete) {
        let uuid = map.get('ROLE' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_tool_see) {
        let uuid = map.get('TOOL' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_tool_create) {
        let uuid = map.get('TOOL' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_tool_update) {
        let uuid = map.get('TOOL' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_tool_delete) {
        let uuid = map.get('TOOL' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_time_see) {
        let uuid = map.get('TIME_PERIOD' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_time_create) {
        let uuid = map.get('TIME_PERIOD' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_time_update) {
        let uuid = map.get('TIME_PERIOD' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_time_delete) {
        let uuid = map.get('TIME_PERIOD' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_kpi_see) {
        let uuid = map.get('KPI' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_kpi_create) {
        let uuid = map.get('KPI' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_kpi_update) {
        let uuid = map.get('KPI' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_kpi_delete) {
        let uuid = map.get('KPI' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_zabbix_see) {
        let uuid = map.get('ZABBIX_ITEM' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_zabbix_create) {
        let uuid = map.get('ZABBIX_ITEM' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_zabbix_update) {
        let uuid = map.get('ZABBIX_ITEM' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_zabbix_delete) {
        let uuid = map.get('ZABBIX_ITEM' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_mt_template_see) {
        let uuid = map.get('MT_TEMPLATE' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_template_create) {
        let uuid = map.get('MT_TEMPLATE' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_template_update) {
        let uuid = map.get('MT_TEMPLATE' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_template_delete) {
        let uuid = map.get('MT_TEMPLATE' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }

      if (checkedFlg.checked_mt_see) {
        let uuid = map.get('MT' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_create) {
        let uuid = map.get('MT' + '_' + 'CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_update) {
        let uuid = map.get('MT' + '_' + 'UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_delete) {
        let uuid = map.get('MT' + '_' + 'DELETE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_expert_create) {
        let uuid = map.get('MT' + '_' + 'EXPERT_CREATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_mt_expert_update) {
        let uuid = map.get('MT' + '_' + 'EXPERT_UPDATE')
        permissionUUIDs.push(uuid)
      }
      if (checkedFlg.checked_reporter_statu_see) {
        let uuid = map.get('REPORTER_STATUS' + '_' + 'READ')
        permissionUUIDs.push(uuid)
      }
      payload.permissionUUIDs = permissionUUIDs
      //处理功能授权------------end
      const id = yield select(({ roles }) => roles.currentItem.uuid)
      const newTool = { ...payload, id }
      newTool.uuid = id
      const data = yield call(update, newTool)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false,
            grantVisible: false,
            isClose: true,
          },
        })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * authorization({ payload }, { put, call }) {
      NProgress.start()//异步加载动画开始
      message.loading('正在生成授权信息,请稍后...', 0)
      const data = yield call(update, payload)
      if (data.success) {
        message.destroy()
        NProgress.done()//异步加载动画结束
        message.success('角色授权成功！')
        yield put({
          type: 'updateState',
          payload: {
            authorizationVisible: false,
            modalState: false,
            moAddFilterValue: { basicLogicOp: 'AND' }, //监控对象新增过滤授权
            moDeleteFilterValue: { basicLogicOp: 'AND' }, //监控对象删除过滤授权
            moUpdateFilterValue: { basicLogicOp: 'AND' }, //监控对象修改过滤授权
            moReadFilterValue: { basicLogicOp: 'AND' }, //监控对象查看过滤授权

            tagAddFilterValue: { basicLogicOp: 'AND' }, //标签管理
            tagDeleteFilterValue: { basicLogicOp: 'AND' },
            tagUpdateFilterValue: { basicLogicOp: 'AND' },
            tagReadFilterValue: { basicLogicOp: 'AND' },

            toolAddFilterValue: { basicLogicOp: 'AND' }, //监控工具
            toolDeleteFilterValue: { basicLogicOp: 'AND' },
            toolUpdateFilterValue: { basicLogicOp: 'AND' },
            toolReadFilterValue: { basicLogicOp: 'AND' },

            ptAddFilterValue: { basicLogicOp: 'AND' }, //策略模板
            ptDeleteFilterValue: { basicLogicOp: 'AND' },
            ptUpdateFilterValue: { basicLogicOp: 'AND' },
            ptReadFilterValue: { basicLogicOp: 'AND' },

            priAddFilterValue: { basicLogicOp: 'AND' }, //策略规则
            prDeleteFilterValue: { basicLogicOp: 'AND' },
            prUpdateFilterValue: { basicLogicOp: 'AND' },
            prReadFilterValue: { basicLogicOp: 'AND' },
            prIssuFilterValue: { basicLogicOp: 'AND' },
            prCalculationFilterValue: { basicLogicOp: 'AND' },

            riAddFilterValue: { basicLogicOp: 'AND' }, //监控实例
            riDeleteFilterValue: { basicLogicOp: 'AND' },
            riUpdateFilterValue: { basicLogicOp: 'AND' },
            riReadFilterValue: { basicLogicOp: 'AND' },

            siAddFilterValue: { basicLogicOp: 'AND' }, //指标管理
            siDeleteFilterValue: { basicLogicOp: 'AND' },
            siUpdateFilterValue: { basicLogicOp: 'AND' },
            siReadFilterValue: { basicLogicOp: 'AND' },

            ziAddFilterValue: { basicLogicOp: 'AND' }, //指标实现
            ziDeleteFilterValue: { basicLogicOp: 'AND' },
            ziUpdateFilterValue: { basicLogicOp: 'AND' },
            ziReadFilterValue: { basicLogicOp: 'AND' },

            tpAddFilterValue: { basicLogicOp: 'AND' }, //周期管理
            tpDeleteFilterValue: { basicLogicOp: 'AND' },
            tpUpdateFilterValue: { basicLogicOp: 'AND' },
            tpReadFilterValue: { basicLogicOp: 'AND' },

            notfAddFilterValue: { basicLogicOp: 'AND' }, //通知管理
            notfDeleteFilterValue: { basicLogicOp: 'AND' },
            notfUpdateFilterValue: { basicLogicOp: 'AND' },
            notfReadFilterValue: { basicLogicOp: 'AND' },

            oelReadFilterValue: { basicLogicOp: 'AND' }, //oel
            oelConfirmFilterValue: { basicLogicOp: 'AND' },
            oelCloseFilterValue: { basicLogicOp: 'AND' },

            luAddFilterValue: { basicLogicOp: 'AND' }, //lookup表维护
            luDeleteFilterValue: { basicLogicOp: 'AND' },
            luUpdateFilterValue: { basicLogicOp: 'AND' },
            luReadFilterValue: { basicLogicOp: 'AND' },

            mvReadFilterValue: { basicLogicOp: 'AND' }, //服务台

            cvReadFilterValue: { basicLogicOp: 'AND' }, //总行监控视图

            bvReadFilterValue: { basicLogicOp: 'AND' }, //分行监控视图

            hvReadFilterValue: { basicLogicOp: 'AND' }, //历史告警视图

            uiAddFilterValue: { basicLogicOp: 'AND' }, //用户
            uiDeleteFilterValue: { basicLogicOp: 'AND' },
            uiUpdateFilterValue: { basicLogicOp: 'AND' },
            uiReadFilterValue: { basicLogicOp: 'AND' },

            rolesAddFilterValue: { basicLogicOp: 'AND' }, //角色
            rolesDeleteFilterValue: { basicLogicOp: 'AND' },
            rolesUpdateFilterValue: { basicLogicOp: 'AND' },
            rolesReadFilterValue: { basicLogicOp: 'AND' },

            mtAddFilterValue: { basicLogicOp: 'AND' }, //维护期模板
            mtDeleteFilterValue: { basicLogicOp: 'AND' },
            mtUpdateFilterValue: { basicLogicOp: 'AND' },
            mtReadFilterValue: { basicLogicOp: 'AND' },
            mtdisableFilterValue: { basicLogicOp: 'AND' },

            mrAddFilterValue: { basicLogicOp: 'AND' }, //维护期实例
            mrDeleteFilterValue: { basicLogicOp: 'AND' },
            mrUpdateFilterValue: { basicLogicOp: 'AND' },
            mrReadFilterValue: { basicLogicOp: 'AND' },
            advAddFilterValue: { basicLogicOp: 'AND' },
            advUpdateFilterValue: { basicLogicOp: 'AND' },
            myShortFilterValue: { basicLogicOp: 'AND' },
            myPreFilterValue: { basicLogicOp: 'AND' },
            myCheckFilterValue: { basicLogicOp: 'AND' },

            readJobsFilterValue: { basicLogicOp: 'AND' },//任务管理
            updateJobsFilterValue: { basicLogicOp: 'AND' },
            delJobsFilterValue: { basicLogicOp: 'AND' },
            addJobsFilterValue: { basicLogicOp: 'AND' },

            fcAddFilterValue: { basicLogicOp: 'AND' }, //报表配置
            fcDeleteFilterValue: { basicLogicOp: 'AND' },
            fcUpdateFilterValue: { basicLogicOp: 'AND' },
            fcReadFilterValue: { basicLogicOp: 'AND' },

            pfReadFilterValue: { basicLogicOp: 'AND' }, //性能

            addRegisterFilterValue: { basicLogicOp: 'AND' },  //服务注册
            delRegisterFilterValue: { basicLogicOp: 'AND' },
            updateRegisterFilterValue: { basicLogicOp: 'AND' },
            readRegisterFilterValue: { basicLogicOp: 'AND' },

            addPersonalFilterValue: { basicDataOp: 'AND' },
            delPersonalFilterValue: { basicDataOp: 'AND' },
            updatePersonalFilterValue: { basicDataOp: 'AND' },
            readPersonalFilterValue: { basicDataOp: 'AND' },

            moAddState: false,
            moDeleteState: false,
            moUpdateState: false,
            moReadState: false,
            tagAddState: false,
            tagDeleteState: false,
            tagUpdateState: false,
            tagReadState: false,
            toolAddState: false,
            toolDeleteState: false,
            toolUpdateState: false,
            toolReadState: false,
            ptAddState: false,
            ptDeleteState: false,
            ptUpdateState: false,
            ptReadState: false,
            priAddState: false,
            prDeleteState: false,
            prUpdateState: false,
            prReadState: false,
            prIssuState: false,
            prCalculationState: false,
            riAddState: false,
            riDeleteState: false,
            riUpdateState: false,
            riReadState: false,
            siAddState: false,
            siDeleteState: false,
            siUpdateState: false,
            siReadState: false,
            ziAddState: false,
            ziDeleteState: false,
            ziUpdateState: false,
            ziReadState: false,
            tpAddState: false,
            tpDeleteState: false,
            tpUpdateState: false,
            tpReadState: false,
            notfAddState: false,
            notfDeleteState: false,
            notfUpdateState: false,
            notfReadState: false,
            oelReadState: false,
            oelConfirmState: false,
            oelCloseState: false,
            luAddState: false,
            luDeleteState: false,
            luUpdateState: false,
            luReadState: false,
            mvReadState: false,
            cvReadState: false,
            bvReadState: false,
            hvReadState: false,
            uiAddState: false,
            uiDeleteState: false,
            uiUpdateState: false,
            uiReadState: false,
            rolesAddState: false,
            rolesDeleteState: false,
            rolesUpdateState: false,
            rolesReadState: false,
            mtAddState: false,
            mtDeleteState: false,
            mtUpdateState: false,
            mtReadState: false,
            mtdisableState: false,
            mrAddState: false,
            mrDeleteState: false,
            mrUpdateState: false,
            mrReadState: false,
            advAddState: false,
            advUpdateState: false,
            fcAddState: false,
            fcDeleteState: false,
            fcUpdateState: false,
            fcReadState: false,
            pfReadState: false,
            myShortState: false,
            myPreState: false,
            myCheckState: false,
            registerAddState: false,
            registerDeleteState: false,
            registerUpdateState: false,
            registerReadState: false,
            personalAddState: false,
            personalDeleteState: false,
            personalUpdateState: false,
            personalReadState: false,
          },
        })
      } else {
        let errInfo = '过滤器参数错误'
        if (data.msg.includes('过滤器不合法')) {
          let info = data.msg
          if (info.includes('/api/v1/std-indicators')) {
            errInfo = '指标管理参数配置错误'
          } else if (info.includes('/api/v1/monitor-rules')) {
            errInfo = '策略规则参数配置错误'
          } else if (info.includes('/api/v1/mt-templates')) {
            errInfo = '维护期模板参数配置错误'
          } else if (info.includes('/api/v1/users')) {
            errInfo = '用户信息参数配置错误'
          } else if (info.includes('/api/v1/zabbix-items')) {
            errInfo = '指标实现参数配置错误'
          } else if (info.includes('/api/v1/policy-templates')) {
            errInfo = '策略模板参数配置错误'
          } else if (info.includes('/api/v1/rule-instances')) {
            errInfo = '监控实例参数配置错误'
          } else if (info.includes('/api/v1/alarms')) {
            errInfo = '告警列表参数配置错误'
          } else if (info.includes('/api/v1/mts')) {
            errInfo = '维护期实例参数配置错误'
          } else if (info.includes('/api/v1/policies')) {
            errInfo = '策略实例参数配置错误'
          } else if (info.includes('/api/v1/tools')) {
            errInfo = '监控工具参数配置错误'
          } else if (info.includes('/api/v1/time-periods')) {
            errInfo = '时间周期参数配置错误'
          } else if (info.includes('/api/v1/notification_rules')) {
            errInfo = '通知规则参数配置错误'
          } else if (info.includes('/api/v1/mos')) {
            errInfo = '监控对象参数配置错误'
          } else if (info.includes('/api/v1/roles')) {
            errInfo = '角色管理参数配置错误'
          } else if (info.includes('/api/v1/tags')) {
            errInfo = '标签管理参数配置错误'
          }else if (info.includes('/api/v1/personalized-strategy')) {
            errInfo = '个性化策略参数配置错误'
          }
        }
        NProgress.done()//异步加载动画结束
        message.destroy()
        message.error(errInfo)
        yield put({
          type: 'updateState',
          payload: {
            modalState: false,
          },
        })
        //throw data
      }
    },
    * findAuthorization({ payload }, { call, put }) {
      NProgress.start()//异步加载动画开始
      message.loading('正在获取授权信息,请稍后...', 0)
      const data = yield call(findById, payload.record)
      let moAddFilterValue = { basicLogicOp: 'AND' }
      let moDeleteFilterValue = { basicLogicOp: 'AND' }
      let moUpdateFilterValue = { basicLogicOp: 'AND' }
      let moReadFilterValue = { basicLogicOp: 'AND' }

      let tagAddFilterValue = { basicLogicOp: 'AND' }//标签管理
      let tagDeleteFilterValue = { basicLogicOp: 'AND' }
      let tagUpdateFilterValue = { basicLogicOp: 'AND' }
      let tagReadFilterValue = { basicLogicOp: 'AND' }

      let toolAddFilterValue = { basicLogicOp: 'AND' }//监控工具
      let toolDeleteFilterValue = { basicLogicOp: 'AND' }
      let toolUpdateFilterValue = { basicLogicOp: 'AND' }
      let toolReadFilterValue = { basicLogicOp: 'AND' }

      let ptAddFilterValue = { basicLogicOp: 'AND' }//策略模板
      let ptDeleteFilterValue = { basicLogicOp: 'AND' }
      let ptUpdateFilterValue = { basicLogicOp: 'AND' }
      let ptReadFilterValue = { basicLogicOp: 'AND' }


      let priAddFilterValue = { basicLogicOp: 'AND' }//策略规则
      let prDeleteFilterValue = { basicLogicOp: 'AND' }
      let prUpdateFilterValue = { basicLogicOp: 'AND' }
      let prReadFilterValue = { basicLogicOp: 'AND' }
      let prIssuFilterValue = { basicLogicOp: 'AND' }
      let prCalculationFilterValue = { basicLogicOp: 'AND' }

      let riAddFilterValue = { basicLogicOp: 'AND' }//监控实例
      let riDeleteFilterValue = { basicLogicOp: 'AND' }
      let riUpdateFilterValue = { basicLogicOp: 'AND' }
      let riReadFilterValue = { basicLogicOp: 'AND' }

      let siAddFilterValue = { basicLogicOp: 'AND' }//指标管理
      let siDeleteFilterValue = { basicLogicOp: 'AND' }
      let siUpdateFilterValue = { basicLogicOp: 'AND' }
      let siReadFilterValue = { basicLogicOp: 'AND' }

      let ziAddFilterValue = { basicLogicOp: 'AND' }//指标实现
      let ziDeleteFilterValue = { basicLogicOp: 'AND' }
      let ziUpdateFilterValue = { basicLogicOp: 'AND' }
      let ziReadFilterValue = { basicLogicOp: 'AND' }

      let tpAddFilterValue = { basicLogicOp: 'AND' }//周期管理
      let tpDeleteFilterValue = { basicLogicOp: 'AND' }
      let tpUpdateFilterValue = { basicLogicOp: 'AND' }
      let tpReadFilterValue = { basicLogicOp: 'AND' }

      let notfAddFilterValue = { basicLogicOp: 'AND' }//通知管理
      let notfDeleteFilterValue = { basicLogicOp: 'AND' }
      let notfUpdateFilterValue = { basicLogicOp: 'AND' }
      let notfReadFilterValue = { basicLogicOp: 'AND' }

      let oelReadFilterValue = { basicLogicOp: 'AND' }//oel
      let oelConfirmFilterValue = { basicLogicOp: 'AND' }
      let oelCloseFilterValue = { basicLogicOp: 'AND' }

      let uiAddFilterValue = { basicLogicOp: 'AND' }//用户
      let uiDeleteFilterValue = { basicLogicOp: 'AND' }
      let uiUpdateFilterValue = { basicLogicOp: 'AND' }
      let uiReadFilterValue = { basicLogicOp: 'AND' }

      let rolesAddFilterValue = { basicLogicOp: 'AND' }//角色
      let rolesDeleteFilterValue = { basicLogicOp: 'AND' }
      let rolesUpdateFilterValue = { basicLogicOp: 'AND' }
      let rolesReadFilterValue = { basicLogicOp: 'AND' }

      let mtAddFilterValue = { basicLogicOp: 'AND' }//维护期模板
      let mtDeleteFilterValue = { basicLogicOp: 'AND' }
      let mtUpdateFilterValue = { basicLogicOp: 'AND' }
      let mtReadFilterValue = { basicLogicOp: 'AND' }

      let mrAddFilterValue = { basicLogicOp: 'AND' }//维护期实例
      let mrDeleteFilterValue = { basicLogicOp: 'AND' }
      let mrUpdateFilterValue = { basicLogicOp: 'AND' }
      let mrReadFilterValue = { basicLogicOp: 'AND' }
      let advAddFilterValue = { basicLogicOp: 'AND' }
      let advUpdateFilterValue = { basicLogicOp: 'AND' }
      let mtdisableFilterValue = { basicLogicOp: 'AND' }

      //任务管理
      let readJobsFilterValue = { basicLogicOp: 'AND' }//任务管理
      let updateJobsFilterValue = { basicLogicOp: 'AND' }
      let delJobsFilterValue = { basicLogicOp: 'AND' }
      let addJobsFilterValue = { basicLogicOp: 'AND' }
      //我的维护期
      let myShortFilterValue = { basicLogicOp: 'AND' }
      let myPreFilterValue = { basicLogicOp: 'AND' }
      let myCheckFilterValue = { basicLogicOp: 'AND' }
      //服务注册
      let addRegisterFilterValue = { basicLogicOp: 'AND' }
      let delRegisterFilterValue = { basicLogicOp: 'AND' }
      let updateRegisterFilterValue = { basicLogicOp: 'AND' }
      let readRegisterFilterValue = { basicLogicOp: 'AND' }
      // 个性化策略
      let addPersonalFilterValue = { basicDataOp: 'AND' }
      let delPersonalFilterValue = { basicDataOp: 'AND' }
      let updatePersonalFilterValue = { basicDataOp: 'AND' }
      let readPersonalFilterValue = { basicDataOp: 'AND' }

      let moAddState = false
      let moDeleteState = false
      let moUpdateState = false
      let moReadState = false
      let tagAddState = false
      let tagDeleteState = false
      let tagUpdateState = false
      let tagReadState = false
      let toolAddState = false
      let toolDeleteState = false
      let toolUpdateState = false
      let toolReadState = false
      let ptAddState = false
      let ptDeleteState = false
      let ptUpdateState = false
      let ptReadState = false
      let priAddState = false
      let prDeleteState = false
      let prUpdateState = false
      let prReadState = false
      let prIssuState = false
      let prCalculationState = false
      let riAddState = false
      let riDeleteState = false
      let riUpdateState = false
      let riReadState = false
      let siAddState = false
      let siDeleteState = false
      let siUpdateState = false
      let siReadState = false
      let ziAddState = false
      let ziDeleteState = false
      let ziUpdateState = false
      let ziReadState = false
      let tpAddState = false
      let tpDeleteState = false
      let tpUpdateState = false
      let tpReadState = false
      let notfAddState = false
      let notfDeleteState = false
      let notfUpdateState = false
      let notfReadState = false
      let oelReadState = false
      let oelConfirmState = false
      let oelCloseState = false
      let luAddState = false
      let luDeleteState = false
      let luUpdateState = false
      let luReadState = false
      let mvReadState = false
      let cvReadState = false
      let bvReadState = false
      let hvReadState = false
      let uiAddState = false
      let uiDeleteState = false
      let uiUpdateState = false
      let uiReadState = false
      let rolesAddState = false
      let rolesDeleteState = false
      let rolesUpdateState = false
      let rolesReadState = false
      let mtAddState = false
      let mtDeleteState = false
      let mtUpdateState = false
      let mtReadState = false
      let mtdisableState = false
      let mrAddState = false
      let mrDeleteState = false
      let mrUpdateState = false
      let mrReadState = false
      let advAddState = false
      let advUpdateState = false
      let fcAddState = false
      let fcDeleteState = false
      let fcUpdateState = false
      let fcReadState = false
      let pfReadState = false
      let efAddState = false//过滤器
      let efDeleteState = false
      let efUpdateState = false
      let efReadState = false
      let ostsAddState = false//数据源配置
      let ostsDeleteState = false
      let ostsUpdateState = false
      let ostsReadState = false
      let etAddState = false//工具列表
      let etDeleteState = false
      let etUpdateState = false
      let etReadState = false
      let evAddState = false//视图配置
      let evDeleteState = false
      let evUpdateState = false
      let evReadState = false
      let jobAddState = false//任务管理
      let jobDeleteState = false
      let jobUpdateState = false
      let jobReadState = false
      //我的维护期
      let myShortState = false
      let myPreState = false
      let myCheckState = false
      //服务注册
      let registerAddState = false
      let registerDeleteState = false
      let registerUpdateState = false
      let registerReadState = false
      //个性化策略
      let personalAddState = false
      let personalDeleteState = false
      let personalUpdateState = false
      let personalReadState = false

      //菜单初始化
      let uis = []//选择的菜单节点，不带父节点
      let uis2 = []//传给后端的节点，带父节点
      let permissionsTree = [] //所有的节点

      /**
       * 菜单授权 
       * @params uis1 uis2 该角色的默认节点菜单
       * @param  permissionsTree 所有的权限菜单
       */
      if (data.uiPermissions && data.uiPermissions.length > 0) {
        for (let i = 0; i < data.uiPermissions.length; i++) {
          let ui = data.uiPermissions[i]
          if (ui.has && ui.router)
            uis.push(`${ui.id}`)
          if (ui.has)
            uis2.push(`${ui.id}`)
        }
        permissionsTree = getMenus(data.uiPermissions).sort(function (a, b) { return a.key - b.key; })
      }


      //初始化功能权限
      if (data.success) {
        for (let info of data.permissions) {
          for (let ops of info.permissions) {
            //过滤器
            if (ops.resource === '/api/v1/ef') {
              if (ops.action === 'create') {
                efAddState = ops.has
              }
              if (ops.action === 'update') {
                efUpdateState = ops.has
              }
              if (ops.action === 'delete') {
                efDeleteState = ops.has
              }
              if (ops.action === 'read') {
                efReadState = ops.has
              }
            }
            //数据源配置
            if (ops.resource === '/api/v1/osts') {
              if (ops.action === 'create') {
                ostsAddState = ops.has
              }
              if (ops.action === 'update') {
                ostsUpdateState = ops.has
              }
              if (ops.action === 'delete') {
                ostsDeleteState = ops.has
              }
              if (ops.action === 'read') {
                ostsReadState = ops.has
              }
            }
            //工具列表
            if (ops.resource === '/api/v1/et') {
              if (ops.action === 'create') {
                etAddState = ops.has
              }
              if (ops.action === 'update') {
                etUpdateState = ops.has
              }
              if (ops.action === 'delete') {
                etDeleteState = ops.has
              }
              if (ops.action === 'read') {
                etReadState = ops.has
              }
            }
            //视图配置
            if (ops.resource === '/api/v1/ev') {
              if (ops.action === 'create') {
                evAddState = ops.has
              }
              if (ops.action === 'update') {
                evUpdateState = ops.has
              }
              if (ops.action === 'delete') {
                evDeleteState = ops.has
              }
              if (ops.action === 'read') {
                evReadState = ops.has
              }
            }
            //mo
            if (ops.resource === '/api/v1/mos') {
              if (ops.action === 'create') {
                moAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  moAddFilterValue.basicLogicOp = 'AND'
                  moAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    moAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    moAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  moAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                moUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  moUpdateFilterValue.basicLogicOp = 'AND'
                  moUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    moUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    moUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  moUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                moDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  moDeleteFilterValue.basicLogicOp = 'AND'
                  moDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    moDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    moDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  moDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                moReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  moReadFilterValue.basicLogicOp = 'AND'
                  moReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    moReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    moReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  moReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //标签管理
            if (ops.resource === '/api/v1/tags') {
              if (ops.action === 'create') {
                tagAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  tagAddFilterValue.basicLogicOp = 'AND'
                  tagAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tagAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    tagAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tagAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                tagUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  tagUpdateFilterValue.basicLogicOp = 'AND'
                  tagUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tagUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    tagUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tagUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                tagDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  tagDeleteFilterValue.basicLogicOp = 'AND'
                  tagDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tagDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    tagDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tagDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                tagReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  tagReadFilterValue.basicLogicOp = 'AND'
                  tagReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tagReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    tagReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tagReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //监控工具
            if (ops.resource === '/api/v1/tools') {
              if (ops.action === 'create') {
                toolAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  toolAddFilterValue.basicLogicOp = 'AND'
                  toolAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    toolAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    toolAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  toolAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                toolUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  toolUpdateFilterValue.basicLogicOp = 'AND'
                  toolUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    toolUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    toolUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  toolUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                toolDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  toolDeleteFilterValue.basicLogicOp = 'AND'
                  toolDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    toolDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    toolDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  toolDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                toolReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  toolReadFilterValue.basicLogicOp = 'AND'
                  toolReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    toolReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    toolReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  toolReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //策略模板
            if (ops.resource === '/api/v1/policy-templates') {
              if (ops.action === 'create') {
                ptAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  ptAddFilterValue.basicLogicOp = 'AND'
                  ptAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ptAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    ptAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ptAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                ptUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  ptUpdateFilterValue.basicLogicOp = 'AND'
                  ptUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ptUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    ptUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ptUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                ptDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  ptDeleteFilterValue.basicLogicOp = 'AND'
                  ptDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ptDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    ptDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ptDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                ptReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  ptReadFilterValue.basicLogicOp = 'AND'
                  ptReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ptReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    ptReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ptReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //策略规则
            if (ops.resource === '/api/v1/monitor-rules') {
              if (ops.action === 'create') {
                priAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  priAddFilterValue.basicLogicOp = 'AND'
                  priAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    priAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    priAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  priAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                prUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  prUpdateFilterValue.basicLogicOp = 'AND'
                  prUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    prUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    prUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  prUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                prDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  prDeleteFilterValue.basicLogicOp = 'AND'
                  prDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    prDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    prDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  prDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                prReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  prReadFilterValue.basicLogicOp = 'AND'
                  prReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    prReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    prReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  prReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'issue') {
                prIssuState = ops.has
                if (ops.permissionFilter === undefined) {
                  prIssuFilterValue.basicLogicOp = 'AND'
                  prIssuFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    prIssuFilterValue.basicLogicOp = 'AND'
                  } else {
                    prIssuFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  prIssuFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'calc') {
                prCalculationState = ops.has
                if (ops.permissionFilter === undefined) {
                  prCalculationFilterValue.basicLogicOp = 'AND'
                  prCalculationFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    prCalculationFilterValue.basicLogicOp = 'AND'
                  } else {
                    prCalculationFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  prCalculationFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //监控实例
            if (ops.resource === '/api/v1/rule-instances') {
              if (ops.action === 'create') {
                riAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  riAddFilterValue.basicLogicOp = 'AND'
                  riAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    riAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    riAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  riAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                riUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  riUpdateFilterValue.basicLogicOp = 'AND'
                  riUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    riUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    riUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  riUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                riDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  riDeleteFilterValue.basicLogicOp = 'AND'
                  riDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    riDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    riDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  riDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                riReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  riReadFilterValue.basicLogicOp = 'AND'
                  riReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    riReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    riReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  riReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //指标管理
            if (ops.resource === '/api/v1/std-indicators') {
              if (ops.action === 'create') {
                siAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  siAddFilterValue.basicLogicOp = 'AND'
                  siAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    siAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    siAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  siAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                siUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  siUpdateFilterValue.basicLogicOp = 'AND'
                  siUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    siUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    siUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  siUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                siDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  siDeleteFilterValue.basicLogicOp = 'AND'
                  siDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    siDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    siDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  siDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                siReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  siReadFilterValue.basicLogicOp = 'AND'
                  siReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    siReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    siReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  siReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //指标实现
            if (ops.resource === '/api/v1/zabbix-items') {
              if (ops.action === 'create') {
                ziAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  ziAddFilterValue.basicLogicOp = 'AND'
                  ziAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ziAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    ziAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ziAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                ziUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  ziUpdateFilterValue.basicLogicOp = 'AND'
                  ziUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ziUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    ziUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ziUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                ziDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  ziDeleteFilterValue.basicLogicOp = 'AND'
                  ziDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ziDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    ziDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ziDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                ziReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  ziReadFilterValue.basicLogicOp = 'AND'
                  ziReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    ziReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    ziReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  ziReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //周期管理
            if (ops.resource === '/api/v1/time-periods') {
              if (ops.action === 'create') {
                tpAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  tpAddFilterValue.basicLogicOp = 'AND'
                  tpAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tpAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    tpAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tpAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                tpUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  tpUpdateFilterValue.basicLogicOp = 'AND'
                  tpUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tpUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    tpUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tpUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                tpDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  tpDeleteFilterValue.basicLogicOp = 'AND'
                  tpDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tpDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    tpDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tpDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                tpReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  tpReadFilterValue.basicLogicOp = 'AND'
                  tpReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    tpReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    tpReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  tpReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //通知管理
            if (ops.resource === '/api/v1/notification_rules') {
              if (ops.action === 'create') {
                notfAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  notfAddFilterValue.basicLogicOp = 'AND'
                  notfAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    notfAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    notfAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  notfAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                notfUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  notfUpdateFilterValue.basicLogicOp = 'AND'
                  notfUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    notfUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    notfUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  notfUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                notfDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  notfDeleteFilterValue.basicLogicOp = 'AND'
                  notfDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    notfDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    notfDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  notfDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                notfReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  notfReadFilterValue.basicLogicOp = 'AND'
                  notfReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    notfReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    notfReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  notfReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //oel
            if (ops.resource === '/api/v1/alarms') {
              if (ops.action === 'read') {
                oelReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  oelReadFilterValue.basicLogicOp = 'AND'
                  oelReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    oelReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    oelReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  oelReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                oelConfirmState = ops.has
                if (ops.permissionFilter === undefined) {
                  oelConfirmFilterValue.basicLogicOp = 'AND'
                  oelConfirmFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    oelConfirmFilterValue.basicLogicOp = 'AND'
                  } else {
                    oelConfirmFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  oelConfirmFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //用户
            if (ops.resource === '/api/v1/users') {
              if (ops.action === 'create') {
                uiAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  uiAddFilterValue.basicLogicOp = 'AND'
                  uiAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    uiAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    uiAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  uiAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                uiUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  uiUpdateFilterValue.basicLogicOp = 'AND'
                  uiUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    uiUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    uiUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  uiUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                uiDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  uiDeleteFilterValue.basicLogicOp = 'AND'
                  uiDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    uiDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    uiDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  uiDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                uiReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  uiReadFilterValue.basicLogicOp = 'AND'
                  uiReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    uiReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    uiReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  uiReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //角色
            if (ops.resource === '/api/v1/roles') {
              if (ops.action === 'create') {
                rolesAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  rolesAddFilterValue.basicLogicOp = 'AND'
                  rolesAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    rolesAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    rolesAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  rolesAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                rolesUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  rolesUpdateFilterValue.basicLogicOp = 'AND'
                  rolesUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    rolesUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    rolesUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  rolesUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                rolesDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  rolesDeleteFilterValue.basicLogicOp = 'AND'
                  rolesDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    rolesDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    rolesDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  rolesDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                rolesReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  rolesReadFilterValue.basicLogicOp = 'AND'
                  rolesReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    rolesReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    rolesReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  rolesReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //维护期模板
            if (ops.resource === '/api/v1/mt-templates') {
              if (ops.action === 'create') {
                mtAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  mtAddFilterValue.basicLogicOp = 'AND'
                  mtAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mtAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    mtAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mtAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                mtUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  mtUpdateFilterValue.basicLogicOp = 'AND'
                  mtUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mtUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    mtUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mtUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                mtDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  mtDeleteFilterValue.basicLogicOp = 'AND'
                  mtDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mtDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    mtDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mtDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                mtReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  mtReadFilterValue.basicLogicOp = 'AND'
                  mtReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mtReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    mtReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mtReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //维护期实例
            if (ops.resource === '/api/v1/mts') {
              if (ops.action === 'create') {
                mrAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  mrAddFilterValue.basicLogicOp = 'AND'
                  mrAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mrAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    mrAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mrAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                mrUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  mrUpdateFilterValue.basicLogicOp = 'AND'
                  mrUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mrUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    mrUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mrUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                mrDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  mrDeleteFilterValue.basicLogicOp = 'AND'
                  mrDeleteFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mrDeleteFilterValue.basicLogicOp = 'AND'
                  } else {
                    mrDeleteFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mrDeleteFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                mrReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  mrReadFilterValue.basicLogicOp = 'AND'
                  mrReadFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mrReadFilterValue.basicLogicOp = 'AND'
                  } else {
                    mrReadFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mrReadFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'create_expert_mode') {
                advAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  advAddFilterValue.basicLogicOp = 'AND'
                  advAddFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    advAddFilterValue.basicLogicOp = 'AND'
                  } else {
                    advAddFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  advAddFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update_expert_mode') {
                advUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  advUpdateFilterValue.basicLogicOp = 'AND'
                  advUpdateFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    advUpdateFilterValue.basicLogicOp = 'AND'
                  } else {
                    advUpdateFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  advUpdateFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'create_short_time_mt') {
                myShortState = ops.has
                if (ops.permissionFilter === undefined) {
                  myShortFilterValue.basicLogicOp = 'AND'
                  myShortFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    myShortFilterValue.basicLogicOp = 'AND'
                  } else {
                    myShortFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  myShortFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'pre_creation') {
                myPreState = ops.has
                if (ops.permissionFilter === undefined) {
                  myPreFilterValue.basicLogicOp = 'AND'
                  myPreFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    myPreFilterValue.basicLogicOp = 'AND'
                  } else {
                    myPreFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  myPreFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'review') {
                myCheckState = ops.has
                if (ops.permissionFilter === undefined) {
                  myCheckFilterValue.basicLogicOp = 'AND'
                  myCheckFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    myCheckFilterValue.basicLogicOp = 'AND'
                  } else {
                    myCheckFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  myCheckFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'disable') {
                mtdisableState = ops.has
                if (ops.permissionFilter === undefined) {
                  mtdisableFilterValue.basicLogicOp = 'AND'
                  mtdisableFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    mtdisableFilterValue.basicLogicOp = 'AND'
                  } else {
                    mtdisableFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  mtdisableFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //任务管理
            if (ops.resource === '/api/v1/jobs') {
              if (ops.action === 'create') {
                jobAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  addJobsFilterValue.basicLogicOp = 'AND'
                  addJobsFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    addJobsFilterValue.basicLogicOp = 'AND'
                  } else {
                    addJobsFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  addJobsFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                jobUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  updateJobsFilterValue.basicLogicOp = 'AND'
                  updateJobsFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    updateJobsFilterValue.basicLogicOp = 'AND'
                  } else {
                    updateJobsFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  updateJobsFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                jobDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  delJobsFilterValue.basicLogicOp = 'AND'
                  delJobsFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    delJobsFilterValue.basicLogicOp = 'AND'
                  } else {
                    delJobsFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  delJobsFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                jobReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  readJobsFilterValue.basicLogicOp = 'AND'
                  readJobsFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    readJobsFilterValue.basicLogicOp = 'AND'
                  } else {
                    readJobsFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  readJobsFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //注册服务
            if (ops.resource === '/api/v1/service-register') {
              if (ops.action === 'create') {
                registerAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  addRegisterFilterValue.basicLogicOp = 'AND'
                  addRegisterFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    addRegisterFilterValue.basicLogicOp = 'AND'
                  } else {
                    addRegisterFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  addRegisterFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                registerUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  updateRegisterFilterValue.basicLogicOp = 'AND'
                  updateRegisterFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    updateRegisterFilterValue.basicLogicOp = 'AND'
                  } else {
                    updateRegisterFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  updateRegisterFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                registerDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  delRegisterFilterValue.basicLogicOp = 'AND'
                  delRegisterFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    delRegisterFilterValue.basicLogicOp = 'AND'
                  } else {
                    delRegisterFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  delRegisterFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                registerReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  readRegisterFilterValue.basicLogicOp = 'AND'
                  readRegisterFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    readRegisterFilterValue.basicLogicOp = 'AND'
                  } else {
                    readRegisterFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  readRegisterFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
            //个性化策略
            if (ops.resource === '/api/v1/personalized-strategy') {
              if (ops.action === 'create') {
                personalAddState = ops.has
                if (ops.permissionFilter === undefined) {
                  addPersonalFilterValue.basicLogicOp = 'AND'
                  addPersonalFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    addPersonalFilterValue.basicLogicOp = 'AND'
                  } else {
                    addPersonalFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  addPersonalFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'update') {
                personalUpdateState = ops.has
                if (ops.permissionFilter === undefined) {
                  updatePersonalFilterValue.basicLogicOp = 'AND'
                  updatePersonalFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    updatePersonalFilterValue.basicLogicOp = 'AND'
                  } else {
                    updatePersonalFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  updatePersonalFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'delete') {
                personalDeleteState = ops.has
                if (ops.permissionFilter === undefined) {
                  delPersonalFilterValue.basicLogicOp = 'AND'
                  delPersonalFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    delPersonalFilterValue.basicLogicOp = 'AND'
                  } else {
                    delPersonalFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  delPersonalFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
              if (ops.action === 'read') {
                personalReadState = ops.has
                if (ops.permissionFilter === undefined) {
                  readPersonalFilterValue.basicLogicOp = 'AND'
                  readPersonalFilterValue.filterItems = []
                } else {
                  if (ops.permissionFilter.basicLogicOp === undefined) {
                    readPersonalFilterValue.basicLogicOp = 'AND'
                  } else {
                    readPersonalFilterValue.basicLogicOp = ops.permissionFilter.basicLogicOp
                  }
                  readPersonalFilterValue.filterItems = ops.permissionFilter.filterItems
                }
              }
            }
          }
        }
        let conditionNotf = { filterMode: 'ADVANCED' }
        let conditionAdv = { filterMode: 'ADVANCED' }
        if (data.alarmApplyFilter !== undefined) {
          for (let info of data.alarmApplyFilter) {
            if (info.resource === '/api/v1/mts') {
              conditionAdv.filterItems = info.filterItems
            }
            if (info.resource === '/api/v1/notification_rules') {
              conditionNotf.filterItems = info.filterItems
            }
          }
        }
        message.destroy()
        NProgress.done()//异步加载动画结束
        yield put({
          type: 'updateState',
          payload: {
            authorizationVisible: true,
            conditionNotf,
            conditionAdv,
            moAddState,
            moDeleteState,
            moUpdateState,
            moReadState,
            tagAddState,
            tagDeleteState,
            tagUpdateState,
            tagReadState,
            toolAddState,
            toolDeleteState,
            toolUpdateState,
            toolReadState,
            ptAddState,
            ptDeleteState,
            ptUpdateState,
            ptReadState,
            priAddState,
            prDeleteState,
            prUpdateState,
            prReadState,
            prIssuState,
            prCalculationState,
            riAddState,
            riDeleteState,
            riUpdateState,
            riReadState,
            siAddState,
            siDeleteState,
            siUpdateState,
            siReadState,
            ziAddState,
            ziDeleteState,
            ziUpdateState,
            ziReadState,
            tpAddState,
            tpDeleteState,
            tpUpdateState,
            tpReadState,
            notfAddState,
            notfDeleteState,
            notfUpdateState,
            notfReadState,
            oelReadState,
            oelConfirmState,
            luAddState,
            luDeleteState,
            luUpdateState,
            luReadState,
            uiAddState,
            uiDeleteState,
            uiUpdateState,
            uiReadState,
            rolesAddState,
            rolesDeleteState,
            rolesUpdateState,
            rolesReadState,
            mtAddState,
            mtDeleteState,
            mtUpdateState,
            mtReadState,
            mtdisableState,
            mrAddState,
            mrDeleteState,
            mrUpdateState,
            mrReadState,
            advAddState,
            advUpdateState,
            efAddState, //过滤器
            efDeleteState,
            efUpdateState,
            efReadState,
            ostsAddState, //数据源配置
            ostsDeleteState,
            ostsUpdateState,
            ostsReadState,
            etAddState, //工具列表
            etDeleteState,
            etUpdateState,
            etReadState,
            evAddState, //视图配置
            evDeleteState,
            evUpdateState,
            evReadState,
            jobAddState,//任务管理
            jobDeleteState,
            jobUpdateState,
            jobReadState,
            //我的维护期
            myShortState,
            myPreState,
            myCheckState,

            moAddFilterValue,
            moUpdateFilterValue,
            moDeleteFilterValue,
            moReadFilterValue,
            tagAddFilterValue,
            tagUpdateFilterValue,
            tagDeleteFilterValue,
            tagReadFilterValue,
            toolAddFilterValue,
            toolUpdateFilterValue,
            toolDeleteFilterValue,
            toolReadFilterValue,
            ptAddFilterValue,
            ptUpdateFilterValue,
            ptDeleteFilterValue,
            ptReadFilterValue,
            priAddFilterValue,
            prUpdateFilterValue,
            prDeleteFilterValue,
            prReadFilterValue,
            prIssuFilterValue,
            prCalculationFilterValue,
            riAddFilterValue,
            riUpdateFilterValue,
            riDeleteFilterValue,
            riReadFilterValue,
            siAddFilterValue,
            siUpdateFilterValue,
            siDeleteFilterValue,
            siReadFilterValue,
            ziAddFilterValue,
            ziUpdateFilterValue,
            ziDeleteFilterValue,
            ziReadFilterValue,
            tpAddFilterValue,
            tpUpdateFilterValue,
            tpDeleteFilterValue,
            tpReadFilterValue,
            notfAddFilterValue,
            notfUpdateFilterValue,
            notfDeleteFilterValue,
            notfReadFilterValue,
            oelReadFilterValue,
            oelConfirmFilterValue,
            uiAddFilterValue,
            uiUpdateFilterValue,
            uiDeleteFilterValue,
            uiReadFilterValue,
            rolesAddFilterValue,
            rolesUpdateFilterValue,
            rolesDeleteFilterValue,
            rolesReadFilterValue,
            mtAddFilterValue,
            mtUpdateFilterValue,
            mtDeleteFilterValue,
            mtReadFilterValue,
            mtdisableFilterValue,
            mrAddFilterValue,
            mrUpdateFilterValue,
            mrDeleteFilterValue,
            mrReadFilterValue,
            advAddFilterValue,
            advUpdateFilterValue,
            addJobsFilterValue,
            delJobsFilterValue,
            updateJobsFilterValue,
            readJobsFilterValue,
            myShortFilterValue,
            myPreFilterValue,
            myCheckFilterValue,
            //菜单授权
            selectedKeys: uis,
            allPermission: uis2,
            permissionsTree,
            //注册服务
            registerAddState,
            registerDeleteState,
            registerUpdateState,
            registerReadState,
            addRegisterFilterValue,
            delRegisterFilterValue,
            updateRegisterFilterValue,
            readRegisterFilterValue,
            // 个性化策略
            personalAddState,
            personalDeleteState,
            personalUpdateState,
            personalReadState,
            addPersonalFilterValue,
            delPersonalFilterValue,
            updatePersonalFilterValue,
            readPersonalFilterValue,
          },
        })
      } else {
        message.destroy()
        NProgress.done()//异步加载动画结束
        throw data
      }
    },
    * currentUserPermissions({ payload }, { put }) {
      const data = yield call(currentUserPermissions)
    },

    * getRole({ payload }, { select, call, put }) {
      let parm = {
        uuid: payload.currentItem.uuid,
      }
      const data = yield call(getRole, parm)
      let record = data
      if (record.dataPermissions && record.dataPermissions.length > 0) {
        for (let i = 0; i < record.dataPermissions.length; i++) {
          let dataPermissionT = record.dataPermissions[i]
          if (dataPermissionT.resType === 'MO') {
            if (dataPermissionT.permissions && dataPermissionT.permissions.length > 0) {
              let entity = dataPermissionT.permissions[0]
              //mo过滤-----start
              payload.moFilterValue0 = entity.permissionFilter
            }
          }
        }
      }
      yield put({
        type: 'updateState',
        payload,
      })
    },

    * findById({ payload }, { call, put }) {
      NProgress.start()//异步加载动画开始
      message.loading('正在生成授权信息,请稍后...', 0)
      const data = yield call(findById, payload.record)
      //对更新时间和创建时间处理一下
      if (data.createdTime && data.createdTime !== 0) {
        let text = data.createdTime
        data.createdTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
      }
      if (data.updatedTime && data.updatedTime !== 0) {
        let text = data.updatedTime
        data.updatedTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
      }
      if (payload.modalType === 'see') {
        message.destroy()
        NProgress.done()//异步加载动画结束
        //message.success('数据请求成功！');
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'see',
            currentItem: data,
            modalVisible: true,
            isClose: false,
          },
        })
      } else if (payload.num === '4') {
        let itemold = data
        //mo过滤初始化
        let moFilterValue0 = {}
        //告警过滤初始化
        let oelFilterValue = {}
        let jiaList = []
        let jianList = []
        let dataList = []
        let basicDataOp = 'AND'
        if (data.dataPermissions && data.dataPermissions.length > 0) {
          for (let i = 0; i < data.dataPermissions.length; i++) {
            let dataPermissionT = data.dataPermissions[i]
            if (dataPermissionT.resType === 'MO') {
              if (dataPermissionT.permissions && dataPermissionT.permissions.length > 0) {
                let entity = dataPermissionT.permissions[0]
                //mo过滤-----start
                moFilterValue0 = entity.permissionFilter
                //mo过滤-----end
                //新增设备----------start
                let permissionFilter = entity.permissionFilter
                let included = permissionFilter.included
                if (included && included.length > 0) {
                  for (let i = 0; i < included.length; i++) {
                    const inMOSdata = yield call(findMOS, included[i])
                    let jia = {
                      index: i,
                      moid: 'uuid',
                      tool: '=',
                      moname: inMOSdata.mo.name,
                      mouuid: inMOSdata.mo.uuid,
                    }
                    jiaList.push(jia)
                  }
                } else {
                  let jia = {
                    index: 0,
                    moid: 'uuid',
                    tool: '=',
                    moname: '',
                    mouuid: '',
                  }
                  jiaList.push(jia)
                }
                //新增设备----------end
                //排除设备----------start
                let excluded = permissionFilter.excluded
                if (excluded && excluded.length > 0) {
                  for (let i = 0; i < excluded.length; i++) {
                    const exMOSdata = yield call(findMOS, excluded[i])
                    let jian = {
                      index: i,
                      moid: 'uuid',
                      tool: '!=',
                      moname: exMOSdata.mo.name,
                      mouuid: exMOSdata.mo.uuid,
                    }
                    jianList.push(jian)
                  }
                } else {
                  let jian = {
                    index: 0,
                    moid: 'uuid',
                    tool: '!=',
                    moname: '',
                    mouuid: '',
                  }
                  jianList.push(jian)
                }
                //排除设备----------end
              }
            } else if (dataPermissionT.resType === 'ALARM') {
              if (dataPermissionT.permissions && dataPermissionT.permissions.length > 0) {
                let entity = dataPermissionT.permissions[0]
                oelFilterValue = entity.permissionFilter
              }
            } else if (dataPermissionT.resType === 'MT') {
              if (dataPermissionT.permissions && dataPermissionT.permissions.length > 0) {
                let entity = dataPermissionT.permissions[0]
                let permissionFilter = entity.permissionFilter
                basicDataOp = entity.permissionFilter.basicLogicOp
                let datas = permissionFilter.filterItems
                if (datas && datas.length > 0) {
                  for (let i = 0; i < datas.length; i++) {
                    let data1 = {
                      index: i,
                      moid: 'branch',
                      tool: 'like',
                      moname: datas[i].value,
                    }
                    dataList.push(data1)
                  }
                } else {
                  let data2 = {
                    index: 0,
                    moid: 'branch',
                    tool: 'like',
                    moname: '',
                    mouuid: '',
                  }
                  dataList.push(data2)
                }
              }
            }
          }
        } else {
          let jia = {
            index: 0,
            moid: 'uuid',
            tool: '=',
            moname: '',
            mouuid: '',
          }
          jiaList.push(jia)
          let jian = {
            index: 0,
            moid: 'uuid',
            tool: '!=',
            moname: '',
            mouuid: '',
          }
          jianList.push(jian)
          let data3 = {
            index: 0,
            moid: 'branch',
            tool: 'like',
            moname: '',
            mouuid: '',
          }
          dataList.push(data3)
        }

        //菜单授权初始化
        let uis = []//选择的菜单节点，不带父节点
        let uis2 = []//传给后端的节点，带父节点
        let userPermissions = []
        let permissionsTree = []
        let toolsPermissions = []//工具菜单
        let policyTempletPermissions = []//策略管理菜单
        let timePeriodsPermissions = []//周期管理菜单
        let oelPermissions = []//告警管理菜单
        let usePermissions = []//用户管理菜单
        let maintenancePermissions = []//维护期管理菜单
        if (data.uiPermissions && data.uiPermissions.length > 0) {
          for (let i = 0; i < data.uiPermissions.length; i++) {
            let ui = data.uiPermissions[i]
            // code merge: copy id and name from backend data
            userPermissions.push({ id: `${ui.id}`, name: `${ui.name}` });
            //userPermissions.push(`${ui.id}`)
            //end
            if (ui.has && ui.router) {
              uis.push(`${ui.id}`)
            }
            if (ui.has) {
              uis2.push(`${ui.id}`)
            }
          }
          for (let i = 0; i < userPermissions.length; i++) {
            if (userPermissions[i].id === '1') {
              permissionsTree.push({
                title: userPermissions[i].name,
                key: userPermissions[i].id,
              })
              /* permissionsTree.push({
                title: '首页',
                key: '1',
              }) */
            }
            if (userPermissions[i].id === '2') {
              permissionsTree.push({
                title: userPermissions[i].name,
                key: userPermissions[i].id,
              })
              /* permissionsTree.push({
                title: '监控对象管理',
                key: '2',
              }) */
            }
            if (userPermissions[i].id === '81' || userPermissions[i].id === '83') {
              toolsPermissions.push({
                title: userPermissions[i].name,
                key: userPermissions[i].id,
              })
              /* if (userPermissions[i] === '81') {
                toolsPermissions.push({
                  title: '工具浏览',
                  key: '81',
                })
              }
              if (userPermissions[i] === '83') {
                toolsPermissions.push({
                  title: '图表浏览',
                  key: '83',
                })
              } */
            }
            if (userPermissions[i].id === '10001' || userPermissions[i].id === '10002' || userPermissions[i].id === '10003'
              || userPermissions[i].id === '10004' || userPermissions[i].id === '10005' || userPermissions[i].id === '10006'
            ) {
              policyTempletPermissions.push({
                title: userPermissions[i].name,
                key: userPermissions[i].id,
              })
              /* if (userPermissions[i] === '10001') {
                policyTempletPermissions.push({
                  title: '策略模板管理',
                  key: '10001',
                })
              }
              if (userPermissions[i] === '10002') {
                policyTempletPermissions.push({
                  title: '策略实例管理',
                  key: '10002',
                })
              }
              if (userPermissions[i] === '10003') {
                policyTempletPermissions.push({
                  title: '策略规则管理',
                  key: '10003',
                })
              }
              if (userPermissions[i] === '10004') {
                policyTempletPermissions.push({
                  title: '监控实例',
                  key: '10004',
                })
              }
              if (userPermissions[i] === '10005') {
                policyTempletPermissions.push({
                  title: '指标管理',
                  key: '10005',
                })
              }
              if (userPermissions[i] === '10006') {
                policyTempletPermissions.push({
                  title: '指标实现',
                  key: '10006',
                })
              } */
            }
            if (userPermissions[i].id === '10011' || userPermissions[i].id === '10012') {
              timePeriodsPermissions.push({
                title: userPermissions[i].name,
                key: userPermissions[i].id,
              })
              /* if (userPermissions[i] === '10011') {
                timePeriodsPermissions.push({
                  title: '周期管理',
                  key: '10011',
                })
              }
              if (userPermissions[i] === '10012') {
                timePeriodsPermissions.push({
                  title: '通知管理',
                  key: '10012',
                }) 
              }
              if (userPermissions[i] === '1007') {
                timePeriodsPermissions.push({
                  title: '监控视图',
                  key: '10012',
                })
              }*/
            }
            if (userPermissions[i] === '10022' || userPermissions[i] === '10023' || userPermissions[i] === '10027' || userPermissions[i] === '10024'
              || userPermissions[i] === '10025' || userPermissions[i] === '10026' || userPermissions[i] === '10099'
            ) {
              if (userPermissions[i] === '10022') {
                oelPermissions.push({
                  title: '告警列表',
                  key: '10022',
                })
              }
              if (userPermissions[i] === '10023') {
                oelPermissions.push({
                  title: 'lookup表维护',
                  key: '10023',
                })
              }
              if (userPermissions[i] === '10027') {
                oelPermissions.push({
                  title: '历史告警查询',
                  key: '10027',
                })
              }
              if (userPermissions[i] === '10024') {
                oelPermissions.push({
                  title: '服务台',
                  key: '10024',
                })
              }
              if (userPermissions[i] === '10027') {
                oelPermissions.push({
                  title: ozr('ZH') + '监控视图',
                  key: '10025',
                })
              }
              if (userPermissions[i] === '10027') {
                oelPermissions.push({
                  title: ozr('FH') + '监控视图',
                  key: '10026',
                })
              }
              if (userPermissions[i] === '10099') {
                oelPermissions.push({
                  title: 'U1历史告警',
                  key: '10099',
                })
              }
            }
            if (userPermissions[i] === '10031' || userPermissions[i] === '10032') {
              if (userPermissions[i] === '10031') {
                usePermissions.push({
                  title: '用户信息',
                  key: '10031',
                })
              }
              if (userPermissions[i] === '10032') {
                usePermissions.push({
                  title: '角色管理',
                  key: '10032',
                })
              }
            }
            if (userPermissions[i] === '10041' || userPermissions[i] === '10042') {
              if (userPermissions[i] === '10041') {
                maintenancePermissions.push({
                  title: '模板',
                  key: '10041',
                })
              }
              if (userPermissions[i] === '10042') {
                maintenancePermissions.push({
                  title: '实例管理',
                  key: '10042',
                })
              }
            }
          }
          if (toolsPermissions.length > 0) {
            permissionsTree.push({
              title: '监控工具',
              key: '8',
              children: toolsPermissions,
            })
          }
          if (policyTempletPermissions.length > 0) {
            permissionsTree.push({
              title: '策略管理',
              key: '1000',
              children: policyTempletPermissions,
            })
          }
          if (timePeriodsPermissions.length > 0) {
            permissionsTree.push({
              title: '配置',
              key: '1001',
              children: timePeriodsPermissions,
            })
          }
          if (oelPermissions.length > 0) {
            permissionsTree.push({
              title: '告警管理',
              key: '1002',
              children: oelPermissions,
            })
          }
          if (usePermissions.length > 0) {
            permissionsTree.push({
              title: '用户管理',
              key: '1003',
              children: usePermissions,
            })
          }
          if (maintenancePermissions.length > 0) {
            permissionsTree.push({
              title: '维护期管理',
              key: '1004',
              children: maintenancePermissions,
            })
          }
        }
        //功能授权初始化
        let checkedFlg = {}
        if (data.permissions && data.permissions.length > 0) {
          for (let i = 0; i < data.permissions.length; i++) {
            let mukuai = data.permissions[i]
            if (mukuai.key === 'MO') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_mo_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_mo_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_mo_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_mo_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'RULE') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_rule_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_rule_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_rule_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_rule_delete = true
                  } else if (caozuo.action === 'ISSUE' && caozuo.has) {
                    checkedFlg.checked_rule_issu = true
                  } else if (caozuo.action === 'CALC' && caozuo.has) {
                    checkedFlg.checked_rule_cal = true
                  }
                }
              }
            } else if (mukuai.key === 'POLICY_TEMPLATE') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_temp_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_temp_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_temp_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_temp_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'RULE_INST') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_inst_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_inst_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_inst_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_inst_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'ALARM') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_alarm_see = true
                  } else if (caozuo.action === 'ACK' && caozuo.has) {
                    checkedFlg.checked_alarm_confirm = true
                  } else if (caozuo.action === 'CLOSE' && caozuo.has) {
                    checkedFlg.checked_alarm_close = true
                  } else if (caozuo.action === 'ARCHIEVE' && caozuo.has) {
                    checkedFlg.checked_alarm_arch = true
                  }
                }
              }
            } else if (mukuai.key === 'POLICY') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_policy_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_policy_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_policy_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_policy_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'USER') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_user_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_user_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_user_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_user_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'ROLE') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_role_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_role_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_role_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_role_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'TOOL') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_tool_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_tool_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_tool_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_tool_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'TIME_PERIOD') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_time_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_time_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_time_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_time_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'ZABBIX_ITEM') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_zabbix_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_zabbix_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_zabbix_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_zabbix_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'KPI') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_kpi_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_kpi_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_kpi_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_kpi_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'MT_TEMPLATE') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_mt_template_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_mt_template_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_mt_template_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_mt_template_delete = true
                  }
                }
              }
            } else if (mukuai.key === 'MT') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_mt_see = true
                  } else if (caozuo.action === 'CREATE' && caozuo.has) {
                    checkedFlg.checked_mt_create = true
                  } else if (caozuo.action === 'UPDATE' && caozuo.has) {
                    checkedFlg.checked_mt_update = true
                  } else if (caozuo.action === 'DELETE' && caozuo.has) {
                    checkedFlg.checked_mt_delete = true
                  } else if (caozuo.action === 'EXPERT_CREATE' && caozuo.has) {
                    checkedFlg.checked_mt_expert_create = true
                  } else if (caozuo.action === 'EXPERT_UPDATE' && caozuo.has) {
                    checkedFlg.checked_mt_expert_update = true
                  }
                }
              }
            } else if (mukuai.key === 'REPORTER_STATUS') {
              if (mukuai.permissions && mukuai.permissions.length > 0) {
                for (let j = 0; j < mukuai.permissions.length; j++) {
                  let caozuo = mukuai.permissions[j]
                  if (caozuo.action === 'READ' && caozuo.has) {
                    checkedFlg.checked_reporter_statu_see = true
                  }
                }
              }
            }
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            currentItem: itemold,
            grantVisible: true,
            selectedKeys: uis,
            allPermission: uis2,
            checkedFlg,
            oelFilterValue,
            jiaList,
            jianList,
            dataList,
            basicDataOp,
            moFilterValue0,
            isClose: false,
            permissionsTree,
          },
        })
      } else {
        message.destroy()
        NProgress.done()//异步加载动画结束
        //message.success('数据请求成功！');
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'update',
            currentItem: data,
            modalVisible: true,
          },
        })
      }
    },
    * queryUserInfo({ payload }, { call, put }) {
      const data = yield call(queryUserInfo, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            userInfoList: data.content,
          },
        })
      }
    },
  },

  reducers: {
    //浏览列表
    querySuccess(state, action) {
      const {
        list, pagination, detail, displayFlg1, displayFlg2, treeData, q,
      } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        displayFlg1,
        displayFlg2,
        treeData,
        q,
        detail,
      }
    },
    querySuccess1(state, action) {
      const { userList, pagination1 } = action.payload
      return { //修改
        ...state,
        userList,
        pagination1: {
          ...state.pagination1,
          ...pagination1,
        },
      }
    },
    updateState(state, action) {
      return { ...state, ...action.payload }
    },
    displayGongneng(state, action) {

    },
  },

}
