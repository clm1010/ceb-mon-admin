import { query, branch, kpiPolicy, kpiPolicyDownload, scoreLine } from '../services/branchnet'
import { querystrategyinfo } from '../services/querystrategyinfo'
import { queryindexinfo } from '../services/indexlist'
import queryString from "query-string";

export default {

  namespace: 'branchnet',

  state: {
    branch: [],
    list: [],
    modalVisible: false,								// 弹出窗口是否可见
    modalType: 'create',								// 弹出窗口的类型
    mosVisible: false,
    moPleVisible: false,
    moKpiVisible: false,
    echartsVisible:false,
    currentItem: [],
    currentItemPle: {},
    currentItemKpi: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共${total}条`,
      current: 1,
      total: null,
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    paginationKpi: {
      // showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共${total}条`,
      current: 1,
      total: null,
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    selectedRows: [],
    pageChage: 0,
    q: '',
    p: '',
    parentUUID: '',
    kpiUUID: '',
    shouldMonitor: false,
    isMonitoring: false,
    percent: {
      kpi: 1,
      tem: 1,
      over: 0,
    },
    typeValue: '',
    backRoute: [{ name: 'branchnet', index: 1 }],             // 页面中指示路径的内容，并可以跳转到指定的一级下
    tabstate: {
      activeKey: 'n1',
      panes: [
        {
          title: '新操作1',
          key: 'n1',
          content: {
            uuid: '',
            period: '',
            times: '',
            foward: '>',
            value: '',
            originalLevel: '',
            innderLevel: '',
            outerLevel: '',
            discard_innder: '',
            discard_outer: '',
            alarmName: '',
            recoverType: '1',
            actionsuuid: '',
            aDiscardActionuuid: '',
            aGradingActionuuid: '',
            aNamingActionuuid: '',
            conditionuuid: '',
            timePerioduuid: '',
            useExt: false, // 是否使用扩展条件
            extOp: '<', // 扩展条件
            extThreshold: '', // 扩展阈值
          },
        },
      ],
      newTabIndex: 1,
    },
    stdInfoVal: {},
    timeList: [],
    see: 'no',
    scoreLineData: [], // 历史变化趋势数据
    startTime: new Date().valueOf(),
    endTime: new Date().valueOf(),
    circle: "120",
    appCode: "",
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        let query = location.query
        if (query === undefined) {query = queryString.parse(location.search)}
        if (location.pathname === '/branchnet') {
          //  返回分行时候的面包屑问题 最后二级不会自动消减 加上这个就会跳转回分行
          if (!query.q) {
            sessionStorage.setItem('data', JSON.stringify([{ name: 'branchnet', index: 1 }]))
          }
          dispatch({
            type: 'query',
            payload: query,
          })
          dispatch({
            type: 'setState',
            payload: {
              backRoute: [{ name: 'branchnet', index: 1 }],
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: payload.p,
          },
        })
      }
    },
    * branch ({ payload }, { call, put }) {
      const data = yield call(branch, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            branch: data.content,
          },
        })
      }
    },

    * kpiPolicy ({ payload }, { call, put }) {
      const data = yield call(kpiPolicy, payload)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            currentItem: data.content,
            paginationKpi: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            modalVisible: true,
            kpiUUID: payload.kpiUUID,
            parentUUID: payload.appCode,
            shouldMonitor: payload.shouldMonitor,
            isMonitoring: payload.isMonitoring,
          },
        })
      }
    },

    * kpiPolicyExport ({ payload }, { call }) {
      yield call(kpiPolicyDownload, payload)
    },

    * querystra ({ payload }, { call, put }) {  //查询数据
      const data = yield call(queryindexinfo, payload)//与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            modalType: 'update',
            currentItemKpi: data,
            moKpiVisible: true,
            isClose: false,
          },
        })
      }
    },

    * scoreLine ({ payload }, { call, put }) {  //查询数据
      const data = yield call(scoreLine, payload)//与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            scoreLineData: data
          },
        })
      }
    },

    * findById ({ payload }, { call, put }) {
      const data = yield call(querystrategyinfo, payload)// 与后台交互，获取数据
      let tabstate = {}
      let panes = []
      if (data.policyTemplate.monitorParams === undefined || data.policyTemplate.monitorParams.ops === undefined) {
        tabstate = {
          activeKey: 'n1',
          panes: [
            {
              title: '新操作1',
              key: 'n1',
              content: {
                uuid: '',
                period: '',
                times: '',
                foward: '1',
                value: '',
                originalLevel: '',
                innderLevel: '',
                outerLevel: '',
                discard_innder: '',
                discard_outer: '',
                alarmName: '',
                recoverType: '1',
                actionsuuid: '',
                aDiscardActionuuid: '',
                aGradingActionuuid: '',
                aNamingActionuuid: '',
                conditionuuid: '',
                timePerioduuid: '',
                useExt: false,// 是否使用扩展条件
                extOp: '<',// 扩展条件
                extThreshold: '',// 扩展阈值
              },
            },
          ],
          newTabIndex: 1,
        }
      } else {
        let newTabIndex = 0,
          pane
        for (var operation of data.policyTemplate.monitorParams.ops) {
          let tuuid = ''
          if (operation.timePeriod === undefined) {
            tuuid = ''
          } else {
            tuuid = operation.timePeriod.uuid
          }
          newTabIndex++
          pane = {
            title: `新操作${newTabIndex}`,
            key: ('n' + newTabIndex),
            content: {
              uuid: operation.uuid,
              period: tuuid,
              times: operation.condition.count,
              foward: operation.condition.op,
              value: operation.condition.threshold,
              originalLevel: operation.actions.gradingAction.oriSeverity,
              innderLevel: operation.actions.gradingAction.inPeriodSeverity,
              outerLevel: operation.actions.gradingAction.outPeriodSeverity,
              // discard_innder: operation.actions.discardAction.inPeriodDiscard,
              // discard_outer: operation.actions.discardAction.outPeriodDiscard,
              alarmName: operation.actions.namingAction.naming,
              recoverType: operation.recoverType,
              actionsuuid: operation.actions.uuid,
              // aDiscardActionuuid: operation.actions.discardAction.uuid,
              aGradingActionuuid: operation.actions.gradingAction.uuid,
              aNamingActionuuid: operation.actions.namingAction.uuid,
              conditionuuid: operation.condition.uuid,
              timePerioduuid: operation.timePeriod.uuid,
              useExt: operation.condition.useExt, // 是否使用扩展条件
              extOp: operation.condition.extOp, // 扩展条件
              extThreshold: operation.condition.extThreshold, // 扩展阈值
            },
          }
          panes.push(pane)
        }// for
        tabstate = {
          activeKey: 'n1',
          panes: panes,
          newTabIndex: newTabIndex,
        }
      }

      if (data.policyTemplate.collectParams === undefined) {
        data.policyTemplate.collectParams = {
          collectInterval: '',
          timeout: '',
          retries: '',
          pktSize: '',
          pktNum: '',
          srcDeviceTimeout: '',
          srcDeviceRetries: '',
        }

      }
      // 对更新时间和创建时间处理一下
      if (data.policyTemplate.createdTime !== 0) {
        let text = data.policyTemplate.createdTime
        data.policyTemplate.createdTime1 = new Date(text).toLocaleString()
      }
      if (data.policyTemplate.updatedTime !== 0) {
        let text = data.policyTemplate.updatedTime
        data.policyTemplate.updatedTime1 = new Date(text).toLocaleString()
      }
      let stdInfoVal = {}
      if (data.policyTemplate.monitorParams !== undefined && data.policyTemplate.monitorParams.indicator !== undefined) {
        stdInfoVal = data.policyTemplate.monitorParams.indicator
      }
      yield put({
        type: 'setState',
        payload: {
          modalType: 'update',
          currentItemPle: data,
          moPleVisible: true,
          isClose: false,
          tabstate: tabstate,
          typeValue: data.policyTemplate.policyType,
          stdInfoVal: stdInfoVal,
        },
      })
    },

  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination, detail, q } = action.payload
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
    setState (state, action) {
      return { ...state, ...action.payload }
    },
    showModal (state, action) {
      const { paginationKpi, modalVisible, currentItem } = action.payload
      return {
        ...state,
        currentItem,
        paginationKpi: {
          ...state.paginationKpi,
          ...paginationKpi,
        },
        modalVisible,
      }
    },
    hideModal (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
