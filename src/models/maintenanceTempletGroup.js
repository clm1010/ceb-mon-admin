import { queryGroup, createGroup, removeGroup, updateGroup } from '../services/maintenanceTemplet'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

/**
 * 维护期管理/维护期模版
 * @namespace maintenanceTempletGroup
 * @requires module:维护期管理/维护期模板
 */
export default {

  namespace: 'maintenanceTempletGroup',

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
        if (location.pathname === '/maintenanceTempletGroup') {
          dispatch({
            type: 'queryGroup',
            payload: query,
          })

		      dispatch({
			      type: 'maintenanceTemplet/updateState',
			      payload: {
				      groupUUID: [],
			      },
		      })
		      dispatch({
			      type: 'updateState',
			      payload: {
				      selectKeys: [],
			      },
		      })
		      dispatch(routerRedux.push('/maintenanceTempletGroup/maintenanceTemplet'))
        } else if (location.pathname.includes('/maintenanceTempletGroup/maintenanceTemplet')) {
			    dispatch({
            type: 'queryGroup',
            payload: query,
          })
		   }
     })
    },
  },

  effects: {
    /** 
		 * 获取资源
		 * 与后台交互, 调用接口/api/v1/mt-templates/groups，获取数据
		 * @function maintenanceTempletGroup.query
		 */
	* queryGroup ({ payload }, { call, put }) {
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
     * 与后台交互, 调用接口/api/v1/mt-templates/groups，新增数据
     * @function maintenanceTempletGroup.create
     */
    * create ({ payload }, { call, put }) {
      const data = yield call(createGroup, payload)

      if (data.success) {
      	yield put({
	      	type: 'updateState',
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
     * 与后台交互, 调用接口/api/v1/mt-templates/groups，删除数据
     * @function maintenanceTempletGroup.delete
     */
	* delete ({ payload }, { call, put }) {
      const data = yield call(removeGroup, payload)
      if (data.success) {
		     yield put({
			     type: 'updateState',
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
     * 与后台交互, 调用接口/api/v1/mt-templates/groups，修改数据
     * @function maintenanceTempletGroup.update
     */
	* update ({ payload }, { call, put }) {
      const data = yield call(updateGroup, payload)
      if (data.success) {
      	yield put({
	      	type: 'updateState',
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
	  querySuccess (state, action) {
		  const { treeDatas } = action.payload
		    return {
			    ...state,
			    treeDatas,
		    }
    },
  	updateState (state, action) {
        return { ...state, ...action.payload }
    },
  },

}
