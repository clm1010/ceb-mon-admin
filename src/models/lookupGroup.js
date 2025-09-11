import { query, create, remove, update } from '../services/lookupGroup'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

export default {

	namespace: 'lookupGroup',

  	state: {
		treeDatas: [],
		selectTreeNode: [], //选中的节点
		selectKeys: [], //选中的节点key值
		selectArray: [],
		modalVisible: false, //控制弹出框
		modalType: 'create',
		isClose: false,
		defaultExpandAll: true,
		autoExpandParent: true,
		lookmap: new Map(),
		hierarchys: '',
		moState: 0,
  	},

  	subscriptions: {
		setup ({ dispatch, history }) {
      		history.listen((location) => {
        			if (location.pathname === '/lookupGroup') {
                const query = queryString.parse(location.search);
         			dispatch({
            				type: 'query',
            				payload: query,
          			})

		  			//需要先把指标信息 的groupUUID 清空，然后再跳转到指标页面
//		  			dispatch({  //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
//						type: 'lookupGroup/controllerState',
//						payload: {
//							groupUUID: [],
//						},
//		  			})
					dispatch({
						type: 'controllerState',
						payload: {
							treeDatas: [],
							selectTreeNode: [], //选中的节点
							selectKeys: [], //选中的节点key值
							selectArray: [],
						},
		  			})
		 			dispatch(routerRedux.push('/lookupGroup/lookupInfo'))
        			} else if (location.pathname.includes('/lookupGroup/lookupInfo')) {
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
      		if (data) {
      			let myMap = new Map()
      			const loop = dataInfo => dataInfo.map((item) => {
      				if (item.node.hierarchy && item.node.hierarchy === 1) {
      					myMap.set(item.node.organization, item)
      				} else if (item.node.hierarchy && item.node.hierarchy === 2) {
      					myMap.set(`${item.node.organization}-${item.node.tableType}`, item)
      				} else if (item.node.hierarchy && item.node.hierarchy === 3) {
      					myMap.set(`${item.node.organization}-${item.node.tableType}-${item.node.tableName}`, item)
      				}
      				if (item.children && item.children.length > 0) {
						loop(item.children)
					}
				})
				loop(data.children)
        			yield put({
          			type: 'querySuccess',
          			payload: {
            				treeDatas: data.children,
            				lookmap: myMap,
          			},
        			})
      		}
    		},

    		* create ({ payload }, { call, put }) {
    			let datas = { ...payload }
    			let newdata = {}
    			newdata.name = datas.name
    			if (datas.selectInfo && datas.selectInfo.length !== 0) {
    				newdata.p = {}
	    			newdata.p.name = datas.selectInfo.node.name
	    			newdata.p.hierarchy = datas.selectInfo.node.hierarchy
	    			newdata.p.organization = datas.selectInfo.node.organization
	    			newdata.p.tableType = datas.selectInfo.node.tableType
	    			newdata.p.tier = datas.selectInfo.node.tier
    			} else {
    				newdata.p = {}
	    			newdata.p.name = ''
	    			newdata.p.hierarchy = 0
	    			newdata.p.organization = ''
	    			newdata.p.tableType = ''
	    			newdata.p.tier = ''
    			}

      		const data = yield call(create, newdata)
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
			let datas = { ...payload }
			let newdata = datas.node
      		const data = yield call(remove, newdata)
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
			let datas = { ...payload }
			let newdata = {}
			newdata.name = datas.name
    			newdata.n = datas.selectInfo.node
      		const data = yield call(update, newdata)
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
			const { treeDatas, lookmap } = action.payload
			return { //修改
				...state,
				treeDatas,
				lookmap,
			}
    		},

  		//这里控制state内容的变化
  		controllerState (state, action) {
      		return { ...state, ...action.payload }
    		},
  		//这里控制state内容的变化
  		controllerModal (state, action) {
      		return { ...state, ...action.payload }
    		},
  	},

}
