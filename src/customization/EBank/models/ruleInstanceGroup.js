import { queryGroup, createGroup, removeGroup, updateGroup } from '../../../services/ruleInstance'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
/**
 * 监控配置/监控实例管理
 * @namespace ruleInstanceGroup
 * @requires module:监控配置/监控实例管理
 */
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
    /** 
     * 获取资源
     * 与后台交互, 调用接口/api/v1/rule-instances/groups/ 获取数据
     * @function ruleInstanceGroup.query
     */
	* query ({ payload }, { call, put }) { //查询数据
      const data = yield call(queryGroup, payload) //与后台交互，获取数据
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
      * 与后台交互,调用接口/api/v1/rule-instances/groups/ 新增数据
      * @function ruleInstanceGroup.create
      */
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

    /** 
     * 删除资源
     * 与后台交互, 调用接口/api/v1/rule-instances/groups/，删除数据
     * @function ruleInstanceGroup.delete
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
     * 修改资源
     * 与后台交互, 调用接口/api/v1/rule-instances/groups/，修改资源
     * @function ruleInstanceGroup.delete
     */
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
