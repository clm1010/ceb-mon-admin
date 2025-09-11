import { query, removeall, remove, create, update, queryById } from '../services/oel/oelEventFilter'
export default {

  namespace: 'oelEventFilter',

  state: {
	list: [],							//定义了当前页表格数据集合
    filtervisible: false,
	confirmLoading: false, //确定加载显示
    currentItem: {},					//被选中的单个行对象
	evnetType: 'create',
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					//用于显示数据总量
	  //pageSizeOptions:['1000','2000','5000','10000'],
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
	batchDelete: false,
	choosedRows: [],

	//过滤器选择事件的过滤条件
	oelFiltervisible: false,
	oelFilterValue: {},
	oelFilterOldValue: {},

	//展示使用
	showEventFilterList: [],

	//页面查询过滤器
	eventName: '',
	eventIsGlobal: '',
	filterKey: '',
  },

  subscriptions: {

		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/config/oel')) {
          dispatch({
            type: 'showquery',
						payload: {
						    current: 0,
								page: 0,
								pageSize: 10000,
						   },
          })
        }
      })
    },

  },

  effects: {
	* showquery ({ payload }, { select, call, put }) {
		let mypayload = {}
		mypayload.current = 0
		mypayload.page = 0
		mypayload.pageSize = 10000
		const data = yield call(query, mypayload)
		if (data.success) {
			let mydata = data.content
			yield put({
				type: 'updateState',
				payload: {
					showEventFilterList: mydata,
				},
			})
		} else {
			throw data
		}
	},
	* query ({ payload }, { select, call, put }) {
	/*
		查询条件
	*/
	const eventName = yield select(({ oelEventFilter }) => oelEventFilter.eventName)
	const eventIsGlobal = yield select(({ oelEventFilter }) => oelEventFilter.eventIsGlobal)
	let q = ''
	if (eventName && eventName !== '') {
		q += `name=='*${eventName}*';`
	}
	if (eventIsGlobal && eventIsGlobal !== '') {
		let tempval = false
		if (eventIsGlobal === 'global') {
			tempval = true
		}
		q += `isGlobal==${tempval};`
	}
	if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
	}
	if (q && q !== '') {
				payload.q = {
				page: 0,
				pageSize: 9999,
				q,
			}
	} else {
			payload.q = {
				page: 0,
				pageSize: 9999,
			}
	}
	const data = yield call(query, payload)

	let res = ''
	for (let item of data.content) {
		//{ title: '开发一线实时告警1', type: 'bar', category: 'line1', oelFilter: 'e0b82fd6-c339-41c6-bac9-7a6a551e3593' },
		res += `{ title: '${item.name}', type: 'bar', category: 'line1', oelFilter: '${item.uuid}' },`
	}
	if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
          },
        })
      } else {
		  throw data
	  }
    },

    * move ({ payload }, { call, put }) {
    },

    * copy ({ payload }, { call, put }) {
    },

    * create ({ payload }, { call, put }) {
			const data = yield call(create, payload)

			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						oelFiltervisible: false,
						oelFilterValue: {},
						oelFilterOldValue: {},
						confirmLoading: false,
					},
				})
				yield put({ type: 'requery' })
				yield put({ type: 'showquery' })
			} else {
				throw data
			}
			//添加过滤器时触发oel查询，使得oel重新获取过滤器的下拉列表 added by Fox
			yield put({
		  	type: 'oel/query',
		  	payload: {
		  		forceGetFilters: true,
		  	},
		  })
    },

	* update ({ payload }, { select, call, put }) {
		const data = yield call(update, payload)

		if (data.success) {
			yield put({
				type: 'updateState',
				payload: {
					oelFiltervisible: false,
					oelFilterValue: {},
					oelFilterOldValue: {},
					confirmLoading: false,
				},
			})
			yield put({ type: 'requery' })
			yield put({ type: 'showquery' })


			//如果编辑的过滤器是oel当前使用的过滤器，则立即触发重新查一次 added by Fox
			const uuidUsedByOel = yield select(state => state.oel ? state.oel.oelFilter : '')
			const uuid = payload.uuid

			if (uuid === uuidUsedByOel) {
	  		yield put({
		    	type: 'oel/query',
		    	payload: {
            forceGetFilters: true,
          },
		    })
			}
		} else {
			throw data
		}
	},
	* removeall ({ payload }, { call, put }) {
		const data = yield call(removeall, payload)
		if (data.success) {
			yield put({
				type: 'updateState',
				payload: {
					choosedRows: [],
				},
			})
			yield put({ type: 'requery' })
			yield put({ type: 'showquery' })

			//批量删除过滤器时触发oel查询，使得oel重新获取过滤器的下拉列表(由于当前界面没有批删功能，所以未测) added by Fox
			yield put({
		  	type: 'oel/query',
		  	payload: {
		  		forceGetFilters: true,
		  	},
		  })
		} else {
			throw data
		}
	},
	* delete ({ payload }, { call, put, select }) {
		const data = yield call(remove, payload)
		if (data.success) {
			yield put({ type: 'requery' })
			yield put({ type: 'showquery' })

			//删除过滤器时触发oel查询，使得oel重新获取过滤器的下拉列表 added by Fox
			const uuidUsedByOel = yield select(state => state.oel.oelFilter)
			const uuid = payload.uuid

			if (uuidUsedByOel === uuid) { //如果删除的是OEL正在使用的过滤器，先清空state里的过滤器
				//清掉state里的oelFilter
      	yield put({
		  		type: 'oel/updateState',
		  		payload: {
		  			oelFilter: '',
		  		},
		  	})
			}

			yield put({
		  	type: 'oel/query',
		  	payload: {
		  		forceGetFilters: true,
		  	},
		  })
		} else {
			throw data
		}
	},
	* requery ({ payload }, { put }) {
        yield put({
			type: 'query',
			payload: {
				...payload,
			},
		})
    },
   * queryById ({ payload }, { call, put }) {
   		const data = yield call(queryById, payload)
   		let filters = (data && data.filter ? data.filter : {})
			let obj = { ...data }
			if (obj) {
			  if (obj.isGlobal) {
				obj.isGlobal = 'Global'
			  } else {
				obj.isGlobal = 'Private'
			  }
			}
			 yield put({ //打开一个弹出框
			    type: 'oelEventFilter/updateState',
			    payload: {
					confirmLoading: false,
					currentItem: obj,
					evnetType: 'update',
					oelFiltervisible: true,
					oelFilterValue: { ...filters },
					oelFilterOldValue: { ...filters },
					filterKey: `${new Date().getTime()}_1`,
				},
			 })
   },
  },

  reducers: {
  	//浏览列表
  	querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
 ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
}
    },

    updateState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
