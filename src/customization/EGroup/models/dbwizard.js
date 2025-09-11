import { queryAllTypeOfMO, query } from '../../../services/objectMO'
import { postNewNeAndIfs,issuePreview} from '../../../services/mowizard'
import { postMosIssueOffline } from '../../../services/dbWizard'
import { queryState } from '../../../services/ruleInstance'
import { message } from 'antd'
import queryString from "query-string";
import { routerRedux } from 'dva/router'
import { querydbs,  createDbInfos } from '../../../services/mo/databases'
import { findAllApp } from '../../../services/appCategories'
import { genObj,genObj2,genObj3, genOriginObj } from '../routes/dbwizard/genFun'
import { getDbDiscovery, postDbWizardPreview, postDbOffline, savePreview, findById, ruleInstanceIssue } from '../../../services/dbWizard'
/**
* 非网络域自服务/数据库自服务
* @namespace dbwizard
* @requires module:非网络域自服务/网络自服务
*/
export default {
  namespace: 'dbwizard',
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
    all:[],   //方便接下来保存实例 save-preview接口
    existing:[],
    incremental:[],
    problem:[],
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
    infoBody: [],
    isMon: false,
    state: '',
    moType:'DB',
    twoStepData:{},
    dbinfos:{},//存储第二步获取到的数据
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/dbwizard') {
          dispatch({
            type: 'queryDbs',
            payload: query,
          })
        }
      })
    },
  },
  effects: {
     /**
     * 获取数据库数据列表
     * 与后台交互 调用接口 /api/v1/dbs/ 
     * @function mowizard.queryDbs
     */
    * queryDbs({ payload }, { call, put }) {
      let params = { ...payload }
      let qs = "firstClass=='DB' and  (secondClass == 'DB_ORACLE' or secondClass=='DB_MYSQL') and thirdClass == 'null'"
      if (params.q === undefined || params.q === '' ) {
        params.q = qs
      } else {
        params.q += ';' + qs
      }
      const data = yield call(querydbs, params)
      if (data.success) {
        yield put({
          type: 'queryDbSuccess',
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
     * 数据库信息发现
     * 与后台交互 调用接口 /api/v1/mos/discovery/db
     * @function dbwizard.dbDiscovery
     */
    * dbDiscovery({ payload }, { put, call, select }) {
      const data = yield call(getDbDiscovery, payload)
      if (data.success && data.db !== undefined > 0) {
        let curitem = data.db
        let infos = {}
        let restp = []
        let panes = [];
        if (data.infos) {
          yield put({
            type: 'setState',
            payload: {
              infoBody:data.infos
            }
          })
          let tempInfos= genObj(data.infos)
          tempInfos.forEach((item, index) => {
            let cols = []
            if (restp.indexOf(item.typ) < 0) {
              restp.push(item.typ)
              for (var i in item) {
                cols.push({ title: i, dataIndex: i, key: i })
              }
              infos[item.typ] = { "columns": cols, "infos": [item], selectedRowKeys: [], selectedRows: [] }
            } else {
              infos[item.typ].infos.push(item)
            }
          })
          // get panes from infos
          const titles = { 'DB_TABLE_SPACE': '表空间', 'DB_INST': '实例', 'DB_TABLE_SPACE_TEMP': '临时表空间', 'DB_USERNAME': '用户名' };
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
        yield put({
          type: 'setState',
          payload: {//必须使用
            dbItem: curitem,
            currentStep: 1,
            loadingEffect: false,
            twoStepData: curitem,
            moType: data.moType
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
     * 查看数据库实例生成的监控实例
     * 与后台交互 调用接口 /api/v1/monitor-rules/wizardPreview
     * @function dbwizard.queryDbPreview
     */
    * queryDbPreview({ payload }, { call, select, put }) {
      const infoBody = yield select (({dbwizard })=> dbwizard.infoBody)
      let originInfos = genOriginObj(payload.dbItem.infos,infoBody)
      let newData = {}
      newData ={...payload.dbItem}
      newData.infos = originInfos
      const data = yield call(postDbWizardPreview, newData)
      if (data) {
        yield put({
          type: 'setState',
          payload: {
            all:data.all,
            existing: data.existing,
            incremental: data.incremental,
            problem: data.problem,
            dbItem: payload.dbItem,
            currentStep: 2,
            loadingEffect: false,
            twoStepData:newData
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
     * @function dbwizard.createDb
     */
    * createDb({ payload }, { call, put, select  }) {
      let currentItem = payload.currentItem
      let twoStepData = yield select(({dbwizard})=>dbwizard.twoStepData)
      currentItem.infos = twoStepData.infos
      const data = yield call(createDbInfos, currentItem)
      if (data.success && data.db !== undefined) {//如果保存成功，那么根据types的类型去做相对应的操作
        message.success('设备保存成功！')
          //调用保存接口
          let params = {}
          params.db = data.db
          params.infos=yield select(({dbwizard })=>dbwizard.infoBody)
          params.preInfos = []
          currentItem.infos.forEach(element => {
            if (element.isMonitored ) {
              params.preInfos.push(element)
            }
          });
          params.preIssueResult = {}
          const  all =          yield select(({dbwizard })=>dbwizard.all) ;
          const  existing=      yield select(({dbwizard })=>dbwizard.existing)
          const  incremental =  yield select (({dbwizard})=> dbwizard.incremental)
          const  problem =      yield select (({dbwizard })=> dbwizard.problem)
          params.preIssueResult['all']  = all
          params.preIssueResult['existing']  = existing
          params.preIssueResult['incremental']  = incremental
          params.preIssueResult['problem']  = problem
          params.previewData = payload.policyList
          params.branch = data.db.branchName
          params.changeType = "CHANGE"
          params.moIp =data.db.discoveryIP
          params.ip =data.db.discoveryIP
          params.moName = data.db.name
          params.moType = yield select(({dbwizard })=>dbwizard.moType)
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
            message.success('数据库下发完成！')
          } else {
            message.warning('数据库下发失败！')
          }
        }
        const q = yield select (({dbwizard })=> dbwizard.q)
        yield put({ type: 'queryDbs', payload: { q:q } })
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
     * @function dbwizard.updateDb
     */
    * updateDb({ payload }, { select, call, put }) {
      let data = {}
      let currentItem = payload.currentItem
      let twoStepData = yield select(({dbwizard})=>dbwizard.twoStepData)
      currentItem.infos = twoStepData.infos
      data = yield call(createDbInfos, currentItem)
      if (data.success) {
        message.success('设备修改成功！')
          //调用保存接口
          let params = {}
          params.db = data.db
          params.infos=yield select(({dbwizard })=>dbwizard.infoBody)
          params.preInfos = []
          currentItem.infos.forEach(element => {
            if (element.isMonitored ) {
              params.preInfos.push(element)
            }
          });
          params.preIssueResult = {}
          const  all =          yield select(({dbwizard })=>dbwizard.all) ;
          const  existing=      yield select(({dbwizard })=>dbwizard.existing)
          const  incremental =  yield select (({dbwizard})=> dbwizard.incremental)
          const  problem =      yield select (({dbwizard })=> dbwizard.problem)
          params.preIssueResult['all']  = all
          params.preIssueResult['existing']  = existing
          params.preIssueResult['incremental']  = incremental
          params.preIssueResult['problem']  = problem
          params.previewData = payload.policyList
          params.branch = data.db.branchName
          params.changeType = "CHANGE"
          params.moIp =data.db.discoveryIP
          params.ip =data.db.discoveryIP
          params.moName = data.db.name
          params.moType = yield select(({dbwizard })=>dbwizard.moType)
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
            message.success('数据库下发完成！')
          } else {
            message.warning('数据库下发失败！')
          }
        }
        const q = yield select (({dbwizard })=> dbwizard.q)
        yield put({ type: 'queryDbs', payload: { q:q } })
      } else {
        message.error('设备修改失败！')
        throw data
      }
    },
      /**
     * 下线-保存（下发）
     * 与后台交互 调用接口 /api/v1/mos/offline  /api/v1/rule-instances/
     * @function dbwizard.deleteDb
     */
    * deleteDb({ payload }, { select, call, put }) {
      let params = {}
      let moCriteria = ''
      let issueParams = { oper: 11 }
      params.uuids = payload.uuids
      if (payload.save === 'save') {
        const data = yield call(postDbOffline, params)
        if (data.success) {
          message.success('数据库下线成功！')
          yield put({ type: 'queryDbs', payload: { q: payload.q } })
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
          message.success('数据库下线并下发！')
          yield put({ type: 'queryDbs', payload: { q: payload.q } })
        } else {
          message.error('数据库下线失败！')
        }
      }
    },
     /**
     * 变更-获取数据库实例
     * 与后台交互 调用接口/api/v1/mos/change
     * @function dbwizard.findDbById
     */
    * findDbById({ payload }, { call, put }) {
      const data = yield call(findById, payload.currentItem)
      if (data.success) {
        let curitem = data.db
        let infos = {}
        let restp = []
        let panes = [];
        if (data.infos) {
          yield put({
            type: 'setState',
            payload: {
              infoBody:data.infos
            }
          })
          let tempInfos= genObj2(data.infos)
          tempInfos.forEach((item, index) => {
            let cols = []
            if (restp.indexOf(item.typ) < 0) {
              restp.push(item.typ)
              for (var i in item) {
                cols.push({ title: i, dataIndex: i, key: i })
              }
              infos[item.typ] = { "columns": cols, "infos": [item], selectedRowKeys: [], selectedRows: [] }
            } else {
              infos[item.typ].infos.push(item)
            }
          })
          curitem.infos = genObj3(infos)
          const titles = { 'DB_TABLE_SPACE': '表空间', 'DB_INST': '实例', 'DB_TABLE_SPACE_TEMP': '临时表空间', 'DB_USERNAME': '用户名' };
          for (var tp in  curitem.infos ) {
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
            dbWizardVisible: true,
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
     * 数据库下发下线
     * 调用后台 /api/v1/rule-instances/issue-offline
     * @function dbwizard.issueOffline
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
     * @function dbwizard.appcategories
     */
    *appcategories({ payload }, { call, put }) {
      const data = yield call(findAllApp, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            appCategorlist: data.arr,
          }
        })
      }
    },
    *updateDbinfos({ payload }, {select, call, put }) {
      let { dbItem } = yield select(_ => _.dbwizard);
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
    //gwq
    queryDbSuccess(state, action) {
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
