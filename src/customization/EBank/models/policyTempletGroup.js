import pathToRegexp from 'path-to-regexp'
import { queryGroup, createGroup, removeGroup, updateGroup } from '../../../services/policyTemplet'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
/**
 * 监控配置/策略模版
 * @namespace policyTempletGroup
 * @requires module:监控配置/策略模版
 */
export default {

  namespace: 'policyTempletGroup',

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
        if (location.pathname === '/policyTempletGroup') {
          dispatch({
            type: 'query',
            payload: query,
          })

		  dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				groupUUID: [],
			},
		  })
		  dispatch(routerRedux.push('/policyTempletGroup/policyTemplet'))
        } else if (location.pathname.includes('/policyTempletGroup/policyTemplet')) {
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
   * 与后台交互 调用接口 /api/v1/policy-templates/
   * @function  policyTempletGroup.query
   */
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

    /**
     * 新增资源
     * 与后台交互 调用接口 /api/v1/policy-templates/
     * @function  policyTempletGroup.create
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
   * 与后台交互 调用接口 /api/v1/policy-templates/
   * @function  policyTempletGroup.delete
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
    * 与后台交互 调用接口 /api/v1/policy-templates/
    * @function  policyTempletGroup.delete
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

    /**
   * 刷新资源列表
   * @function  policyTempletGroup.requery
   */
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
