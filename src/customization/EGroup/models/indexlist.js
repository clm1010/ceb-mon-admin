import { query } from '../../../services/indexlist'
import pathToRegexp from 'path-to-regexp'
import { queryindexinfo } from '../../../services/indexlist'

export default {

  namespace: 'indexlist',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,													//弹出窗口是否可见
    modalType: 'create',													//弹出窗口的类型
    typelistType: 'indexlist',												//发现配置的类型
    pagination: {															//分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: null,								//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    choosedRows: [],

    indexUUIDMos: '', //指标uuid获取关联的策略
    indexMosNumber: 0, //关联策略的数量
    strategylist: [], //关联策略的对象
    mosVisible: false,
    paginationMos: { //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: null,									 //数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    pageChage: 0,
    q: '',
    see: 'yes',
    backRoute: [], // 页面中指示路径的内容，并可以跳转到指定的一级下
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/indexlist/:appCode')
          .exec(location.pathname)
        if (match) {
          dispatch({
            type: 'query',
            payload: {
              q: match[1],
            },
          })
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
    * querystra ({ payload }, { select, call, put }) { //查询数据
      const match = pathToRegexp('/indexlist/:appCode')
        .exec(location.pathname)
      let newdata = { ...payload, appCode: match[1] }
      if (!payload.kpiUUID) { //传的数据存在 uuid 就不需要从 state 获取
        let kpiUUID = yield select(({ indexlist }) => indexlist.indexUUIDMos)
        newdata = { ...payload, kpiUUID }
      }
      const data = yield call(queryindexinfo, newdata)//与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            modalType: 'update',
            currentItem: data,
            modalVisible: true,
            isClose: false,
          },
        })
      }
    },
  },

  reducers: {
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
