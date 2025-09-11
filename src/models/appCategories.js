import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { query, remove, update, create, findById } from '../services/appCategories'
import { message } from 'antd'
import queryString from "query-string";
export default {
	namespace: 'appCategories',

	state: {
		type: '',
		item: {},
		q: '',
		batchDelete: false,
		selectedRows: [],
		pagination: {									//分页对象
	      showSizeChanger: true,						//是否可以改变 pageSize
	      showQuickJumper: true, //是否可以快速跳转至某页
	      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
	      current: 1,									//当前页数
	      total: 0,										//数据总数？
	      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	    },
	    dataSource: [],
	    modalVisible: false,
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
					//初次访问
		      	if (window.location.pathname === '/appCategories') {
					  /*
							let query = location.query
							if (query === undefined) {
								query = {q:q}
							}*/
							var query = location.query
						if (query === undefined) {
							query = queryString.parse(location.search);
							if (query.q === undefined) {
								query.q=''
							}
						}
						dispatch({
		      			type: 'query',
		      			payload: {
		      				q: query.q,
		      			},
		      		})
		      	}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const data = yield call(query, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						pagination: {
		                    current: data.page.number + 1 || 1,
		                	pageSize: data.page.pageSize || 10,
		                	total: data.page.totalElements,
		              		showSizeChanger: true,
				      		showQuickJumper: true,
				      		showTotal: total => `共 ${total} 条`,
				      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            			},
						dataSource: data.content,
						firstClass: payload.firstClass,
					    q: payload.q,
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},

		* remove ({ payload }, { put, call }) {
			const data = yield call(remove, payload)
			if (data.success) {
				yield put({ type: 'requery' })
				yield put({
					type:　'setState',
					payload: {
						batchDelete: false,
						selectedRows: [],
						keys: new Date().getTime(),
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},

		* findById ({ payload }, { put, call }) {
			const data = yield call(findById, payload.currentItem)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						modalVisible: true,
						item: data,
						type: 'update',
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},

		* update ({ payload }, { put, call, select }) {
			let item = {}
			item = yield select(({ appCategories }) => appCategories.item)
			item = Object.assign(item, payload.currentItem)
			const data = yield call(update, item)
			if (data.success) {
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						item: data,
						modalVisible: false,
					},
				})
			} else {
				throw data
			}
		},

		* create ({ payload }, { put, call }) {
			const data = yield call(create, payload.currentItem)
			if (data.success) {
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						modalVisible: false,
					},
				})
			}
		},

		* requery ({ payload }, { put, select }) {
	  	/* yield put(routerRedux.push({
	    	pathname: window.location.pathname,
	    	query: parse(window.location.search.substr(1)),
		})) */
		let pageItem = yield select(({ appCategories }) => appCategories.pagination)
		let q = parse(window.location.search.substr(1)).q

		yield put({
			type: 'query',
			payload: {
				page: pageItem.current - 1,
				pageSize: pageItem.pageSize,
				q: q
			},
		})
	  },
	},

	reducers: {
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
