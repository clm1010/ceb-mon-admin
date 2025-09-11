import { queryGroup, createGroup, removeGroup, updateGroup } from '../services/label'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
/**
 * 标签列表
 * @namespace labelGroup
 */
export default {

  namespace: 'labelGroup',

  state: {
    treeDatas: [],
    selectTreeNode: [],
    selectKeys: [],
    modalVisible: false,
    modalType: 'create',
    isClose: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search)
        if (location.pathname === '/labelGroup') {
          dispatch({
            type: 'queryGroup',
            payload: query,
          })
          dispatch({
            type: 'label/setState',
            payload: {
              groupUUID: [],
            },
          })
          dispatch(routerRedux.push('/labelGroup/label'))
        } else if (location.pathname.includes('/labelGroup/label')) {
          dispatch({
            type: 'queryGroup',
            payload: query,
          })
        }
      })
    },
  },

  effects: {
    * queryGroup({ payload }, { call, put }) {
      const data = yield call(queryGroup, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            treeDatas: (data.children ? data.children : []),
          },
        })
      }
    },

    * create({ payload }, { call, put }) {
      const data = yield call(createGroup, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            modalVisible: false,
            isClose: true,
          },
        })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * delete({ payload }, { call, put }) {
      const data = yield call(removeGroup, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            selectTreeNode: [],
            selectKeys: [],
          },
        })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * update({ payload }, { call, put }) {
      const data = yield call(updateGroup, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            modalVisible: false,
            isClose: true,
          },
        })
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

  },

  reducers: {
    querySuccess(state, action) {
      const { treeDatas } = action.payload
      return {
        ...state,
        treeDatas,
      }
    },
    setState(state, action) {
      return { ...state, ...action.payload }
    },
  },
}
