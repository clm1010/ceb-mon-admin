import { queryAllTypeOfMO, modetailDown } from '../services/objectMO'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
export default {

  namespace: 'mo',

  state: {
    list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    selectedRows: [],
    pageChange: 0,
    q: '',
    //导出
    branchsVisible: false,						//弹出窗口是否可见
    branchsType: 'edit',
    checkAll: false,
    checkedList: [],
    indeterminate: true,
    ruleInstanceKey: '',
    fenhangArr: [],			//下发中分行数组集合
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/mo') {
          let query = location.query
          if (query === undefined) { query = queryString.parse(location.search) }
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
      const data = yield call(queryAllTypeOfMO, payload)
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
            q: payload.q,
          },
        })
      }
    },
    * create({ payload }, { call, put, select }) {
      yield put({
        type: 'hideModal',
        payload: {
          modalVisible: false,
        },
      })
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * requery({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
    * moDown({ payload }, { call, put }) {
      yield call(modetailDown, payload)
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

    //这里控制弹出窗口显示
    showModal(state, action) {
      return { ...state, ...action.payload }
    },

    //这里控制弹出窗口隐藏
    hideModal(state, action) {
      return { ...state, ...action.payload }
    },

    setState(state, action) {
      return { ...state, ...action.payload }
    },
  },

}
