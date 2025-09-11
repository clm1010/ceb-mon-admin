import { query, create, remove, update, findById } from '../services/mainRuleInstanceGroup'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import fenhang from '../utils/fenhang'
import queryString from "query-string";
/**
 * 维护期管理/维护期设置
 * @namespace mainRuleInstanceGroup
 * @requires module:维护期管理/维护期设置
 */
export default {

	namespace: 'mainRuleInstanceGroup',

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
        			if (location.pathname === '/mainRuleInstanceGroup') {
          			dispatch({
            				type: 'query',
            				payload: query,
          			})

					dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
						type: 'mainRuleInstanceInfo/controllerModal',
						payload: {
							treeDatas: [],
							groupUUID: [],
							selectKeys: [], //选中的节点key值
							selectTreeNode: [], //选中的节点
							testss: true,
						},
					})
					dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
						type: 'controllerState',
						payload: {
							selectKeys: [], //选中的节点key值
						},
					})
		  			dispatch(routerRedux.push('/mainRuleInstanceGroup/mainRuleInstanceInfo'))
        			} else if (location.pathname.includes('/mainRuleInstanceGroup/mainRuleInstanceInfo')) {
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
		 * 与后台交互, 调用接口/api/v1/mts/groups，获取数据
		 * @function mainRuleInstanceGroup.query
		 */
		* query ({ payload }, { select, call, put }) { //查询数据
			const user = JSON.parse(sessionStorage.getItem('user'))
			const data = yield call(query, payload)
//    		let data = {}
//    		if(!user.branch){
//    			data = yield call(query, payload)  //与后台交互，获取数据
//    		}else{
//    			let newdata = {...payload}
//    			newdata.branch = user.branch
//    			data = yield call(query, newdata)  //与后台交互，获取数据
//    		}

      		//const parentItem = yield call(queryTool, payload)
      		if (data.success) {
				let newdata = []//只针对登录分行就行显示模板树
				let maps = new Map()
				fenhang.forEach((obj, index) => {
					let keys = obj.key
					let values = obj.value
					maps.set(keys, values)
				})
				if (data.children.length !== 0) {
					let childrens = data.children
					for (let i = 0; i < childrens.length; i++) {
						let branch = ''
				  		if (user.branch) {
				  			branch = user.branch
				  		}
				  		// if (branch !== '') {
				  		// 	if (childrens[i].name === branch) {
						// 		  newdata.push(childrens[i])
				  		// 	}
				  		// } else if (branch === '') {
				  		// 	newdata.push(childrens[i])
						  // }
						newdata.push(childrens[i])
					}
				}
				data.children.forEach((obj2) => {
					if (maps.get(obj2.name)) {
						obj2.name = maps.get(obj2.name)
					}
				})
					
        			yield put({
          			type: 'querySuccess',
          			payload: {
            				treeDatas: (newdata || []),
          			},
        			})
      		}
    		},

    /** 
     * 新增资源
     * 与后台交互, 调用接口/api/v1/mts/groups，新增数据
     * @function mainRuleInstanceGroup.create
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
	 * 与后台交互, 调用接口/api/v1/mts/groups，删除数据
	 * @function mainRuleInstanceGroup.delete
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
	 * 与后台交互, 调用接口/api/v1/mts/groups，修改数据
	 * @function mainRuleInstanceGroup.update
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
