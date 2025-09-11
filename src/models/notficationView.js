import { query, userReadStats } from '../services/notficationView'
import { findById as findRulsById } from '../services/notificationRule'
import { queryApp } from '../services/maintenanceTemplet'
import { message } from 'antd'
import NProgress from 'nprogress'
import { query as queryUser, queryALL } from '../services/userinfo'
import queryString from 'query-string'
import moment from 'moment'
import { isEmpty, isUndefined, includes, split, replace } from 'lodash'

// 时间处理辅助函数
const getTimeRange = {
  // 获取今天的时间范围（00:00:00 到当前时间）
  today: () => ({
    start: moment().startOf('day').valueOf(),
    end: moment().valueOf()
  }),
  
  // 获取本周的时间范围（周日00:00:00 到当前时间）
  thisWeek: () => ({
    start: moment().startOf('week').valueOf(),
    end: moment().valueOf()
  }),
  
  // 获取上周的时间范围
  lastWeek: () => ({
    start: moment().subtract(1, 'weeks').startOf('week').valueOf(),
    end: moment().startOf('week').valueOf()
  }),
  
  // 获取上上周的时间范围
  beforeLastWeek: () => ({
    start: moment().subtract(2, 'weeks').startOf('week').valueOf(),
    end: moment().subtract(1, 'weeks').startOf('week').valueOf()
  })
}

// 处理时间范围查询字符串
const handleTimeRangeQuery = (queryStr) => {
  if (includes(queryStr, "AlarmTimeRange=='This'")) {
    const { start, end } = getTimeRange.thisWeek()
    return replace(queryStr, "AlarmTimeRange=='This'", `firstOccurrence>=${start};firstOccurrence<${end}`)
  }
  
  if (includes(queryStr, "AlarmTimeRange=='Last'")) {
    const { start, end } = getTimeRange.lastWeek()
    return replace(queryStr, "AlarmTimeRange=='Last'", `firstOccurrence>=${start};firstOccurrence<${end}`)
  }
  
  if (includes(queryStr, "AlarmTimeRange=='Before-last'")) {
    const { start, end } = getTimeRange.beforeLastWeek()
    return replace(queryStr, "AlarmTimeRange=='Before-last'", `firstOccurrence>=${start};firstOccurrence<${end}`)
  }
  
  return queryStr
}

// 解析用户读取统计参数
const parseUserReadStatsParams = (queryStr) => {
  const params = split(queryStr, ';')
  return {
    userID: replace(split(params[0], '==')[1], /'/g, ''),
    beginTime: split(params[1], '>')[1],
    endTime: split(params[2], '<')[1]
  }
}

export default {
  namespace: 'notficationView',

  state: {
    Type: '',
    q: '',
    batchDelete: false,
    selectedRows: [],
    pagination: {
      //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: (total) => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: 0, //数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200']
    },
    dataSource: [],
    modalVisible: false,
    currentItem: {},
    alertType: 'info', //alert控件状态info,success,warning,error
    alertMessage: '请编辑通知信息', //alert控件内容
    notificationType: '', //选择通知的模式
    users: [], //查询到的user集合
    targetKeys: [], //穿梭框右侧的集合，集合里放的是uuid
    num: 1,
    mos: [],
    appInfo: '',
    roleTargetKeys: [],
    AppUuid: [],
    moUuid: [],
    keys: '',
    q: '',
    filterInfo: [],
    see: 'no',
    TransferState: false,
    modalType: 'update',
    AppOption: [],
    TabPaneType: 'notification',
    summarize: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        //初次访问
        if (location.pathname === '/notficationView') {
          const { start, end } = getTimeRange.today()
          var query = location.query
          if (isUndefined(query)) {
            query = queryString.parse(location.search)
            if (isUndefined(query.q)) {
              query.q = `sendTime>=${start};sendTime<=${end}`
            }
          }
          dispatch({
            type: 'query',
            payload: {
              q: query.q
            }
          })
        }
      })
    }
  },

  effects: {
    *query({ payload }, { put, call, select }) {
      const TabPaneType = yield select(({ notficationView }) => notficationView.TabPaneType)
      let ReadStr = ''
      
      if (TabPaneType === 'read') {
        ReadStr = ";notificationType==APP;n_CustomerSeverity==3;result=='Successful';(content!='*故障再发生*' and content!='*出维护期未恢复*' and content!='*故障升级*' and content!='*维护期内通知*' and content!='*故障恢复*')"
        
        if (!payload.q) {
          const { start, end } = getTimeRange.thisWeek()
          payload.q = `firstOccurrence>=${start};firstOccurrence<${end}`
        } else {
          // 处理时间范围查询
          payload.q = handleTimeRangeQuery(payload.q)
        }
        
        payload.q += ReadStr
        
        if (includes(payload.q, 'receiverUserID')) {
          const { userID, beginTime, endTime } = parseUserReadStatsParams(payload.q)
          yield put({
            type: 'userReadStats',
            payload: {
              userID,
              beginTime,
              endTime,
              typ: 'week'
            }
          })
        }
      } else if ((isUndefined(payload.q) || isEmpty(payload.q)) && TabPaneType === 'notification') {
        const { start, end } = getTimeRange.today()
        payload.q = `sendTime>=${start};sendTime<=${end}`
      }
      
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            dataSource: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200']
            },
            q: replace(payload.q, ReadStr, '') // 把查询条件放到state中
          }
        })
      } else if (data.code === 400 && data.detail === 'esResultWindowTooLargeError') {
        message.warning('查询范围超出可查范围,请缩小查询范围', 5)
      } else {
        throw data
      }
    },
    *findRulesById({ payload }, { put, call }) {
      NProgress.start()
      message.loading('正在为您获取通知信息,请稍后...', 0)
      const data = yield call(findRulsById, payload)
      if (data.success && data.informType !== undefined) {
        NProgress.done() //异步加载动画结束
        message.destroy()
        //如果获取成功，组装已经选中的用户uuid
        let targetKeys = []
        let app = []
        if (data.appCategory.length > 0) {
          app.push(data.appCategory[0].c1)
        }
        for (let userUuid of data.user) {
          targetKeys.push(userUuid.uuid)
        }
        yield put({
          type: 'setState',
          payload: {
            currentItem: data,
            modalVisible: true,
            roleTargetKeys: data.roles,
            targetKeys,
            notificationType: data.informType,
            appInfo: data.appCategory[0] === undefined ? [] : data.appCategory[0].affectSystem, //因应用只支持一单选，暂时这样写
            mos: data.mo[0] === undefined ? [] : data.mo,
            AppUuid: app
          }
        })
      } else if (data.success && data.informType === undefined) {
        NProgress.done() //异步加载动画结束
        message.destroy()
        message.error('未找到对应的通知规则！', 5)
      } else {
        NProgress.done() //异步加载动画结束
        message.destroy()
      }
    },
    *queryUser({ payload }, { select, call, put }) {
      payload.pageSize = 2000
      const data = yield call(queryALL, payload)
      if (data.success) {
        let users = []
        users = data.arr
        for (let datas of users) {
          datas.key = datas.uuid
        }
        yield put({
          type: 'setState',
          payload: {
            users,
            TransferState: false
          }
        })
      }
    },
    *queryApp({ payload }, { call, put }) {
      const data = yield call(queryApp, payload)
      yield put({
        type: 'setState',
        payload: {
          AppOption: data.content
        }
      })
    },

    *userReadStats({ payload }, { call, put }) {
      const data = yield call(userReadStats, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            summarize: data
          }
        })
      }
    }
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload }
    }
  }
}
