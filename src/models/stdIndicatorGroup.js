import { query, create, remove, update } from '../services/stdIndicatorGroup'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
/**
 * 监控配置/监控指标管理
 * @namespace stdIndicatorGroup
 * @requires module:监控配置/监控指标管理
 */
export default {

  namespace: 'stdIndicatorGroup',

  state: {
	treeDatas: [],
	selectTreeNode: [], //选中的节点
	selectKeys: [], //选中的节点key值
	modalVisible: false, //控制弹出框
	modalType: 'create',
	isClose: false,

  },

  subscriptions: {
	setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/stdIndicatorGroup') {
         dispatch({
            type: 'query',
            payload: query,
          })

		  //需要先把指标信息 的groupUUID 清空，然后再跳转到指标页面
		  dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				groupUUID: [],
			},
		  })
		 dispatch(routerRedux.push('/stdIndicatorGroup/stdIndicatorInfo'))
        } else if (location.pathname.includes('/stdIndicatorGroup/stdIndicatorInfo')) {
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
   * 与后台交互, 调用接口/api/v1/std-indicators/groups/，获取数据
   * @function stdIndicatorGroup.query
   */
	* query ({ payload }, { call, put }) { //查询数据
      const data = yield call(query, payload) //与后台交互，获取数据
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
   * 与后台交互, 调用接口/api/v1/std-indicators/groups/，新增数据
   * @function stdIndicatorGroup.create
   */
    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
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
   * 与后台交互, 调用接口/api/v1/std-indicators/groups/，删除数据
   * @function stdIndicatorGroup.delete
   */
	* delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
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
   * 与后台交互, 调用接口/api/v1/std-indicators/groups/，修改数据
   * @function stdIndicatorGroup.update
   */
	* update ({ payload }, { call, put }) {
      const data = yield call(update, payload)
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
	//浏览列表
	querySuccess (state, action) {
		const { treeDatas } = action.payload
		return { //修改
			...state,
			treeDatas,
		}
    },

  	//这里控制state内容的变化
  	controllerState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
