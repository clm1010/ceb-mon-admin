import { routerRedux } from 'dva/router'
import { query, remove, update, create, findById } from '../services/mo/pageSets'
import {findAllApp} from '../services/appCategories'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from "query-string";
import NProgress from 'nprogress'
export default {
	namespace: 'page',

	state: {
		type: '',
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
	    firstClass: '',
		secondClass: '',
	    currentItem: {},
	    alertType: 'info',
	    alertMessage: '',
	    keys: '',
	   	showUploadList: false,
	  	moImportResultVisible: false,
	  	moImportResultdataSource: [],
	  	moImportResultType: '',
		  moImportFileList: [],
		  appCategorlist:[],
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
		      	if (location.pathname === '/page' && location.search.length === 0) {
					const { pathname } = location
					dispatch(routerRedux.push({
			    		pathname,
			     		query: {
			        		page: 0,
			        		q: '',
			      		},
			    	}))
				} else if (location.pathname === '/page' && location.search.length > 0) {
					let query = location.query
					if (query === undefined) {
						query = queryString.parse(location.search);
					}
					dispatch({
			          	type: 'query',
			          	payload: query,
			        })
				}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const data = yield call(query, payload)
			NProgress.done()//异步加载动画结束
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
						secondClass: payload.secondClass,
					    q: payload.q,
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
		* create ({ payload }, { put, call, select }) {
			let currentItem = {}
			currentItem = yield select(({ page }) => page.currentItem)
			currentItem = Object.assign(currentItem, payload.currentItem)
			const data = yield call(create, currentItem)
			if (data.success) {
				message.success('设备保存成功！')
				
				yield put({
					type: 'setState',
					payload: {
						modalVisible: false,
					},
				})
				yield put({ type: 'requery' })
			} else {
				message.error('设备保存失败!')
			}
		},
		* update ({ payload }, { put, call, select }) {
			let currentItem = {}
			currentItem = yield select(({ page }) => page.currentItem)
			currentItem = Object.assign(currentItem, payload.currentItem)
			const data = yield call(update, currentItem)
			if (data.success) {
				message.success('设备修改成功！')
			
				yield put({
					type: 'setState',
					payload: {
						currentItem: data,
						alertType: 'success',
    					alertMessage: '修改成功',
					},
				})
				yield put({ type: 'requery' })
			} else {
				message.error('设备修改失败！')
				throw data
			}
		},
		* remove ({ payload }, { put, call }) {
			const data = yield call(remove, payload)
			if (data.success) {
				message.success('设备删除成功！')
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
				message.error('设备删除失败！')
			}
		},
		* findById ({ payload }, { put, call }) {
			const data = yield call(findById, payload.currentItem)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						modalVisible: true,
						currentItem: data.mo,
						type: 'update',
						alertType: 'info',
						alertMessage: '请输入信息',
						appCode: data.mo.appCode,
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
		* requery ({ payload }, { put }) {
	  	yield put(routerRedux.push({
	    	pathname: window.location.pathname,
	    	query: parse(window.location.search.substr(1)),
	    }))
	  },
	  *appcategories({ payload }, { call, put }) {
		const data = yield call(findAllApp, payload)
		if(data.success){
			yield  put({
				type: 'setState',
				payload:{
					appCategorlist:data.arr
				}
			})
		}
	},
	},

	reducers: {
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
