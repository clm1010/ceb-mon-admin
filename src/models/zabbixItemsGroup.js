import { query, create, remove, update } from '../services/zabbixItemsGroup'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

export default {

  namespace: 'zabbixItemsGroup',

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
        if (location.pathname === '/zabbixItemsGroup') {
          dispatch({
            type: 'query',
            payload: query,
          })

		dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				groupUUID: [],
			},
		})
		  dispatch(routerRedux.push('/zabbixItemsGroup/zabbixItems'))
        } else if (location.pathname.includes('/zabbixItemsGroup/zabbixItems')) {
		  dispatch({
             type: 'query',
             payload: query,
          })
		}
      })
    },
  },

  effects: {
	* query ({ payload }, { call, put }) { //查询数据
      const data = yield call(query, payload) //与后台交互，获取数据
      //const parentItem = yield call(queryTool, payload)

      if (data.success) {
		/*
		let arrs = []
		let obj = {}
		obj.uuid = 'undefined'
		obj.name = data.name ? data.name : ''
		obj.children = data.children ? data.children : []
		arrs.push(obj)
		*/
        yield put({
          type: 'querySuccess',
          payload: {
            treeDatas: (data.children ? data.children : []),
          },
        })
      }
    },

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
