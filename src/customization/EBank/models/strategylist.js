import { query } from '../../../services/strategylist'
import pathToRegexp from 'path-to-regexp'
import { querystrategyinfo } from '../../../services/querystrategyinfo'

export default {

  namespace: 'strategylist',

  state: {
    list: [],												// 定义了当前页表格数据集合
    currentItem: {},										// 被选中的行对象的集合
    modalVisible: false,								// 弹出窗口是否可见
    modalType: 'create',								// 弹出窗口的类型
    strType: 'strategylist',							// 发现配置的类型
    pagination: {											// 分页对象
      showSizeChanger: true,								// 是否可以改变 pageSize
      showQuickJumper: true, // 是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
      current: 1,													// 当前页数
      total: null,													// 数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    choosedRows: [],

    strategyUUIDMos: '', // 指标uuid获取关联的策略
    strategyMosNumber: 0, // 关联策略的数量
    indexlist: [], // 关联策略的对象
    mosVisible: false,
    paginationMos: {									// 分页对象
      showSizeChanger: true, // 是否可以改变 pageSize
      showQuickJumper: true, // 是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, // 用于显示数据总量
      current: 1, // 当前页数
      total: null,									 // 数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    pageChage: 0,
    q: '',
    backRoute: [], // 页面中指示路径的内容，并可以跳转到指定的一级下

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
    typeValue: '',
    stdInfoVal: {},
    timeList: [],
    see: 'no',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/strategylist/:appCode')
          .exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { q: match[1] } })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
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
    * queryindex ({ payload }, { select, call, put }) { // 查询数据
      const match = pathToRegexp('/strategylist/:appCode')
        .exec(location.pathname)
      let newdata = { ...payload, appCode: match[1] }
      if (!payload.policyUUID) { // 传的数据存在 uuid 就不需要从 state 获取
        let policyUUID = yield select(({ strategylist }) => strategylist.strategyUUIDMos)
        newdata = { ...payload, policyUUID }
      }
      const data = yield call(querystrategyinfo, newdata)// 与后台交互，获取数据
      console.log('queryindexinfo data  : ', data)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            indexlist: `${data.policyTemplate}`,
            strategyMosNumber: data.policyInstances,
          },
        })
      }
    },
    * findById ({ payload }, { select, call, put }) {
      const match = pathToRegexp('/strategylist/:appCode')
        .exec(location.pathname)
      let newdata = { ...payload, appCode: match[1] }
      if (!payload.policyUUID) { // 传的数据存在 uuid 就不需要从 state 获取
        let policyUUID = yield select(({ strategylist }) => strategylist.strategyUUIDMos)
        newdata = { ...payload, policyUUID }
      }
      const data = yield call(querystrategyinfo, newdata)// 与后台交互，获取数据

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
                useExt: false, // 是否使用扩展条件
                extOp: '<', // 扩展条件
                extThreshold: '', // 扩展阈值
              },
            },
          ],
          newTabIndex: 1,
        }
      } else {
        let newTabIndex = 0,
          pane
        for (let operation of data.policyTemplate.monitorParams.ops) {
          let tuuid = ''
          if (operation.timePeriod === undefined) {
            tuuid = ''
          } else {
            tuuid = operation.timePeriod.uuid
          }
          newTabIndex++
          pane = {
            title: `新操作${newTabIndex}`,
            key: (`n${newTabIndex}`),
            content: {
              uuid: operation.uuid,
              period: tuuid,
              times: operation.condition.count,
              foward: operation.condition.op,
              value: operation.condition.threshold,
              originalLevel: operation.actions.gradingAction.oriSeverity,
              innderLevel: operation.actions.gradingAction.inPeriodSeverity,
              outerLevel: operation.actions.gradingAction.outPeriodSeverity,
              discard_innder: operation.actions.discardAction.inPeriodDiscard,
              discard_outer: operation.actions.discardAction.outPeriodDiscard,
              alarmName: operation.actions.namingAction.naming,
              recoverType: operation.recoverType,
              actionsuuid: operation.actions.uuid,
              aDiscardActionuuid: operation.actions.discardAction.uuid,
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
          panes,
          newTabIndex,
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
        type: 'showModal',
        payload: {
          modalType: 'update',
          currentItem: data,
          modalVisible: true,
          isClose: false,
          tabstate,
          typeValue: data.policyTemplate.policyType,
          stdInfoVal,
        },
      })
    },
  },
  reducers: {
    // 浏览列表
    querySuccess (state, action) {
      const { list, pagination, q } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
      }
    },
    setState (state, action) {
      return { ...state, ...action.payload }
    },
    showModal (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
