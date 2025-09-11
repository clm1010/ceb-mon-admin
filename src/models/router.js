import React from 'react'
import { nescreate, nesupdate, nesquery, nesdelete, nesdeleteAll } from '../services/nes'
import { findById, oneMoSync, managed } from '../services/objectMO'
import { preview } from '../services/policyRule'
import { findAllApp , query as queryApp} from '../services/appCategories'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { Modal, message, Select } from 'antd'
import queryString from "query-string";
import NProgress from 'nprogress'
const Option = Select.Option
export default {

	namespace: 'router',				//@@@

	state: {
		q: '',																					//URL串上的q=查询条件
		list: [],																				//定义了当前页表格数据集合
		currentItem: {},																//被选中的行对象的集合
		modalVisible: false,														//弹出窗口是否可见
		modalType: 'create',														//弹出窗口的类型
		pagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: 0,																			//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		batchDelete: false,															//批量删除按钮状态，默认禁用
		batchSync: false,																//批量同步按钮状态，默认禁用
		selectedRows: [],																//表格中勾选的对象，准备批量操作

		alertType: 'info',															//alert控件状态info,success,warning,error
		alertMessage: '请输入MO信息',											 //alert控件内容

		//设备发现有关
		moSynState: false,															//弹出窗口同步按钮状态
		_mngInfoSrc: '自动',				 							 			 //用户手动切换发现方式记录的临时状态
		zabbixUrl: '',	//选中分行查询到的zabbixUrl
		batchsyncSuccessList: [], //同步成功的集合
		batchsyncFailureList: [], //同步失败的集合
		batchSyncState: true, //提示框的状态
		batchSyncModalVisible: false, //批量同步的弹出框
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
		managedModalVisible: false,
		manageState: true,
		managedType: 'managed',
		managedData: [],
		policyVisible: false,
		pageChange: '',
		appCategorlist: [],
		FScloud:false,
		snmpVerflag:true,
		optionSelectAppName:[]
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				//初次访问
				if (location.pathname === '/router' && location.search.length === 0) {				//@@@
					//制造一个浏览器地址栏看得见的跳转，仅仅是跳转，再次触发subscription监听进行query查询
					console.log("1")
					const { pathname } = location
					const query = {
						q: 'firstClass==\'NETWORK\';secondClass==\'ROUTER\'',
						page: 0
					}
					const stringified = queryString.stringify(query)
					dispatch(routerRedux.push({
						pathname,
						search: stringified,
						query: query,
						//query: {
						//  page: 0,
						//  q: 'firstClass==\'NETWORK\';secondClass==\'ROUTER\'',				//@@@
						//},
					}))
				} else if (location.pathname === '/router' && location.search.length > 0) {			//@@@
					//自动触发mo查询
					console.log("2")
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
		* query({ payload }, { call, put }) {
			const data = yield call(nesquery, payload)
			NProgress.done()//异步加载动画结束
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						list: data.content,
						pagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
						},
						q: payload.q,	//把查询条件放到state中
					},
				})
			}
		},

		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.currentItem)
			let snmpVerflag = true
			if (data.success) {
				let FScloud = false
				if((data.ecBizIP!='' && data.ecBizIP!=undefined )|| (data.ecExpressEip!='' && data.ecExpressEip!=undefined) || (data.ecDomainName!='' &&  data.ecDomainName!=undefined )||
				 (data.ecInstanceID!='' && data.ecInstanceID!=undefined) || (data.ecIngressEip!='' &&  data.ecIngressEip!=undefined)  || ( data.ecMonitorObject!='' && data.ecMonitorObject!=undefined))
				 {
					FScloud=true
				}
				if(data.snmpVer == 'V3'){
					snmpVerflag = false
				}
				yield put({
					type: 'setState',
					payload: {
						currentItem: data,
						_mngInfoSrc: data.mngInfoSrc, //查到一台mo，自动用mngInfoSrc覆盖_mngInfoSrc，记录最原始发现方式
						zabbixUrl: data.createdByTool, //查到一台mo，自动用createdByTool覆盖页面内zabbixUrl。这是机构窗口warning的依据
						modalVisible: true,
						FScloud,
						snmpVerflag,
					},
				})
			}
		},

		// * requery({ payload }, { put }) {
		// 	yield put(routerRedux.push({
		// 		pathname: window.location.pathname,
		// 		query: parse(window.location.search.substr(1)),
		// 	}))
		// },
		* requery({ payload }, { select, put }) {
			let pageItem = yield select(({ router }) => router.pagination)
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

		* update({ payload }, { select, call, put }) {
			//取currentItem是为了获取完整的对象来全量update后端的mo对象
			let currentItem = {}
			currentItem = yield select(({ router }) => router.currentItem)				//@@@

			currentItem = Object.assign(currentItem, payload.currentItem)

			let data = {}
			data = yield call(nesupdate, currentItem)

			if (data.success) {
				message.success('设备修改成功!')
				payload.currentItem = data
				payload.alertType = 'success'
				payload.alertMessage = '设备修改成功。'

				yield put({
					type: 'setState',
					payload,
				})
				yield put({ type: 'requery' })
			} else {
				message.error('设备修改失败!')
				payload.alertType = 'error'
				payload.alertMessage = '设备修改失败。'
				yield put({
					type: 'setState',
					payload,
				})
				throw data
			}
		},

		* create({ payload }, { select, call, put }) {
			//payload.currentItem.alias = payload.currentItem.discoveryIP	//keyword赋值
			payload.currentItem.keyword = payload.currentItem.discoveryIP	//keyword赋值
			payload.currentItem.firstClass = 'NETWORK'
			payload.currentItem.secondClass = 'ROUTER'				//@@@

			let currentItem = {}
			currentItem = yield select(({ router }) => router.currentItem)				//@@@
			currentItem = Object.assign(currentItem, payload.currentItem)

			const data = yield call(nescreate, currentItem)

			if (data.success) {
				message.success('设备保存成功!')
				payload.modalType = 'update'
				payload.alertType = 'success'
				payload.alertMessage = '设备保存成功。'
				payload.currentItem = data

				yield put({
					type: 'setState',
					payload,
				})
				yield put({ type: 'requery' })
			} else {
				message.error('设备保存失败!')
				yield put({
					type: 'setState',
					payload: {
						alertType: 'error',
						alertMessage: '设备保存失败。',
					},
				})
				throw data
			}
		},

		* delete({ payload }, { select, call, put }) {
			const data = yield call(nesdelete, payload)

			if (data.success) {
				message.success('删除成功!')
				yield put({ type: 'requery' })
			} else {
				message.error('删除失败!')
				throw data
			}
		},

		* moSync({ payload }, { call, put, select }) {
			//同步设备信息
			const dataMoInfo = yield call(oneMoSync, payload)

			if (dataMoInfo.success) {
				//取currentItem是为了获取完整的对象来全量update后端的mo对象
				let currentItem = {}
				currentItem = yield select(({ router }) => router.currentItem)				//@@@

				//修改state里当前对象的值
				currentItem = Object.assign(currentItem, dataMoInfo.mos[0])

				let _alertType = 'info'
				let _alertMessage = '请输入信息。'
				if (currentItem.syncStatus === 'success') {
					_alertType = 'success'
					_alertMessage = '设备信息抓取成功'
				} else if (currentItem.syncStatus === 'failed') {
					_alertType = 'error'
					_alertMessage = `设备 ${currentItem.name} 信息抓取失败：${currentItem.ext1}`
				} else if (currentItem.syncStatus === 'unsync') {
					_alertType = 'warning'
					_alertMessage = '设备尚未同步。'
				}

				yield put({
					type: 'setState',
					payload: ({
						currentItem: { ...currentItem },
						moSynState: false,
						alertType: _alertType,
						alertMessage: _alertMessage,
					}),
				})
				yield put({ type: 'requery' })
			} else if (!dataMoInfo.success) {
				yield put({
					type: 'setState',
					payload: ({
						moSynState: false,
						alertType: 'error',
						alertMessage: `设备 ${currentItem.name} 信息抓取失败：${dataMoInfo.msg}`,
					}),
				})
			}
		},

		* batchSync({ payload }, { call, put }) {
			let successList = []
			let failureList = []
			//payload接收一个uuid数组，请求一个oneMoSync接口，返回给我一个mo数组
			const data = yield call(oneMoSync, payload)
			//判断返回集合的状态是否success
			if (data.success) {
				//循环遍历数组，只过滤出同步失败的信息,也需要一个同步成功的集合以防情况有变
				for (let mo of data.mos) {
					if (mo.syncStatus === 'success') {
						successList.push(mo)
					} else if (mo.syncStatus === 'failed') {
						failureList.push(mo)
					}
				}
				yield put({
					type: 'setState',
					payload: ({
						batchSyncState: false,
						batchsyncSuccessList: successList,
						batchsyncFailureList: failureList,
					}),
				})
			} else if (!data.success) {
				//message.error('未返回同步信息!')
				Modal.warning({
					title: '未返回同步信息!',
					content: '可能由于网络原因,批量同步失败!建议减少同步设备数量或稍后再试!',
					okText: '好的',
				})
				yield put({
					type: 'setState',
					payload: ({
						batchSyncModalVisible: false,
					}),
				})
			}
		},

		* deleteAll({ payload }, { select, call, put }) {
			let data = {}
			data = yield call(nesdeleteAll, payload)

			if (data.success) {
				message.success('删除成功!')
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: ({
						batchDelete: false,
					}),
				})
			} else {
				message.error('删除成功!')
				throw data
			}
		},

		* managed({ payload }, { call, put }) {
			const data = yield call(managed, payload)
			if (data.success) {
				delete data.message
				delete data.status
				delete data.success
				yield put({
					type: 'setState',
					payload: {
						managedModalVisible: true,
						managedData: data.mos,
						manageState: false,
					},
				})
			} else {
				yield put({
					type: 'setState',
					payload: {
						managedModalVisible: false,
					},
				})
				message.error('批量修改失败!')
			}
		},

		* preview({ payload }, { call, put }) {
			const data = yield call(preview, payload)
		},

		*appcategories({ payload }, { call, put }) {
			const data = yield call(findAllApp, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						appCategorlist: data.arr
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
		setState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
