import React from 'react'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { query, remove, update, create, findById } from '../services/mo/specialdevices'
import {findAllApp, query as queryApp} from '../services/appCategories'
import { message ,Select} from 'antd'
import queryString from "query-string";
import NProgress from 'nprogress'
const Option = Select.Option
export default {
	namespace: 'specialequipment',

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
		_mngInfoSrc: '自动',				 							 			 //用户手动切换发现方式记录的临时状态
		FScloud:false,
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
		      	if (location.pathname === '/specialequipment' && location.search.length === 0) {
					const { pathname } = location
					const query = {
						q : 'firstClass==\'HARDWARE\';secondClass==\'SPECIALDEVICE\'',
						page : 0
					}
					const stringified = queryString.stringify(query)
					dispatch(routerRedux.push({
						pathname,
						search: stringified,
						query:query,
			    	}))
				} else if (location.pathname === '/specialequipment' && location.search.length > 0) {
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
			currentItem = yield select(({ specialequipment }) => specialequipment.currentItem)
			currentItem = Object.assign(currentItem, payload.currentItem)
			const data = yield call(create, currentItem)
			if (data.success) {
				message.success('设备保存成功！')
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						modalVisible: false,
					},
				})
			} else {
				message.error('设备保存失败!')
			}
		},
		* update ({ payload }, { put, call, select }) {
			let currentItem = {}
			currentItem = yield select(({ specialequipment }) => specialequipment.currentItem)
			currentItem = Object.assign(currentItem, payload.currentItem)
			const data = yield call(update, currentItem)
			if (data.success) {
				message.success('设备修改成功！')
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						currentItem: data,
						alertType: 'success',
    					alertMessage: '修改设备成功',
					},
				})
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
				let FScloud = false
				if ((data.mo.ecBizIP != '' && data.mo.ecBizIP != undefined) || (data.mo.ecExpressEip != '' && data.mo.ecExpressEip != undefined) || (data.mo.ecDomainName != '' && data.mo.ecDomainName != undefined) ||
					(data.mo.ecInstanceID != '' && data.mo.ecInstanceID != undefined) || (data.mo.ecIngressEip != '' && data.mo.ecIngressEip != undefined) || (data.mo.ecMonitorObject != '' && data.mo.ecMonitorObject != undefined)) {
					FScloud = true
				}
				yield put({
					type: 'setState',
					payload: {
						modalVisible: true,
						currentItem: data.mo,
						_mngInfoSrc: data.mo.mngInfoSrc, //查到一台mo，自动用mngInfoSrc覆盖_mngInfoSrc，记录最原始发现方式
						type: 'update',
						alertType: 'info',
						alertMessage: '请输入硬件服务器信息',
						appCode: data.mo.appCode,
						FScloud,
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
		// * requery ({ payload }, { put }) {
	  	// yield put(routerRedux.push({
	    // 	pathname: window.location.pathname,
	    // 	query: parse(window.location.search.substr(1)),
	    // }))
		//   },
		* requery({ payload }, { select, put }) {
			let pageItem = yield select(({ specialequipment }) => specialequipment.pagination)
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
		* queryApp({ payload }, { call, put }) {
			const data = yield call(queryApp, payload)
			if (data.success && data.content.length > 0) {
				let optionSelectAppNames = []
				data.content.forEach((item, index) => { //添加name属性--> 将名字改掉   其实是传的uuid
					let values = item.affectSystem
					let keys = item.uuid
					optionSelectAppNames.push(<Option key={keys} value={values}>{values}</Option>)
				})
				yield put({
					type: 'setState',
					payload: {//必须使用
						optionSelectAppName: optionSelectAppNames, //原始数据
					},
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
