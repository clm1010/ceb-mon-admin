import { queryGroup, createGroup, removeGroup, updateGroup } from '../services/policyInstance'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

/**
 * 监控配置/策略实例管理 
 * @namespace policyInstanceGroup
 * @requires module:监控配置/策略实例管理
 */
export default {

  namespace: 'policyInstanceGroup',

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
        if (location.pathname === '/policyInstanceGroup') {
          dispatch({
            type: 'query',
            payload: query,
          })

		  dispatch({
			type: 'policyInstance/updateState',
			payload: {
				groupUUID: [],
			},
		  })
		  dispatch(routerRedux.push('/policyInstanceGroup/policyInstance'))
        } else if (location.pathname.includes('/policyInstanceGroup/policyInstance')) {
			dispatch({
            type: 'query',
            payload: query,
          })
		    }
      })
    },
  },

  effects: {
/** 
* 获取资源
* 与后台交互, 调用接口/api/v1/policies/，获取数据,策略实例分组
* @function policyInstanceGroup.query
*/
	* query ({ payload }, { call, put }) {
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
    /** 
     * 新增资源
     * 与后台交互, 调用接口/api/v1/policies/，添加数据
     * @function policyInstanceGroup.create
     */

    * create ({ payload }, { call, put }) {
      const data = yield call(createGroup, payload)
      payload.groupType = 'POLICY'
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

   /** 
    * 删除资源
    * 与后台交互, 调用接口/api/v1/policies/，删除数据
    * @function policyInstanceGroup.delete
    */
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

    /** 
     * 编辑
     * 与后台交互, 调用接口/api/v1/policies/，删除数据
     * @function policyInstanceGroup.delete
     */
	* update ({ payload }, { call, put }) {
      const data = yield call(updateGroup, payload)
      payload.groupType = 'POLICY'
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
