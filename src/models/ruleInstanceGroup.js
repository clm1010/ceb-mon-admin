import { queryGroup, createGroup, removeGroup, updateGroup } from '../services/ruleInstance'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

export default {

  namespace: 'ruleInstanceGroup',

  state: {
	treeDatas: [],
	selectTreeNode: [], //
	selectKeys: [], //
	modalVisible: false, //
	modalType: 'create',
	isClose: false,

  },

  subscriptions: {
	setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/ruleInstanceGroup') {
          dispatch({
            type: 'query',
            payload: query,
          })

		  dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				groupUUID: [],
			},
		  })
		  dispatch(routerRedux.push('/ruleInstanceGroup/ruleInstance'))
        } else if (location.pathname.includes('/ruleInstanceGroup/ruleInstance')) {
			dispatch({
            type: 'query',
            payload: query,
          })
		}
      })
    },
  },

  effects: {
	* query ({ payload }, { call, put }) { //��ѯ���
      const data = yield call(queryGroup, payload) //���̨��������ȡ���
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            treeDatas: (data.children ? data.children : []),
          },
        })
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(createGroup, payload)
      if (data.success) {
      	yield put({
	      	type: 'controllerState',
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

	* delete ({ payload }, { call, put }) {
      const data = yield call(removeGroup, payload)
      if (data.success) {
		     yield put({
			     type: 'controllerState',
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

	* update ({ payload }, { call, put }) {
      const data = yield call(updateGroup, payload)
      if (data.success) {
      	yield put({
	      	type: 'controllerState',
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

	* requery ({ payload }, { put }) {
        yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },

  },

  reducers: {
	//����б�
	querySuccess (state, action) {
		const { treeDatas } = action.payload
		return { //�޸�
			...state,
			treeDatas,
		}
    },

  	//�������state���ݵı仯
  	controllerState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
