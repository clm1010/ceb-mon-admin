import { queryGroup, createGroup, removeGroup, updateGroup } from '../../../services/policyRule'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

/**
* 监控配置/策略规则管理 
* @namespace policyRuleGroup
* @requires module:监控配置/策略规则
*/
export default {

  namespace: 'policyRuleGroup',

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
        if (location.pathname === '/policyRuleGroup') {
          dispatch({
            type: 'query',
            payload: query,
          })

		  dispatch({
			type: 'policyRule/updateState',
			payload: {
				groupUUID: [],
			},
		  })
		  dispatch(routerRedux.push('/policyRuleGroup/policyRule'))
        } else if (location.pathname.includes('/policyRuleGroup/policyRule')) {
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
     * 查询资源
     * 与后台交互 调用接口 /api/v1/monitor-rules/
     * @function  policyRuleGroup.query
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
     * 与后台交互 调用接口 /api/v1/monitor-rules/
     * @function  policyRuleGroup.create
     */
     * create ({ payload }, { call, put }) {
      const data = yield call(createGroup, payload)
      payload.groupType = 'RULE'
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
     * 与后台交互 调用接口 /api/v1/monitor-rules/
     * @function  policyRuleGroup.delete
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
     * 编辑资源
     * 与后台交互 调用接口  /api/v1/monitor-rules/
     * @function  policyRuleGroup.delete
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
