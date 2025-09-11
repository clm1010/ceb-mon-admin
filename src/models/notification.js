import { query, remove, update, create, findById, onDown } from '../services/notificationRule'
import { query as queryUser, queryALL } from '../services/userinfo'
import { queryApp } from '../services/maintenanceTemplet'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import NProgress from 'nprogress'
import queryString from "query-string";
/**
* 监控配置/通知规则管理
* @namespace notification
* @requires module:监控配置/通知规则管理
*/
export default {

	namespace: 'notification',				//@@@

	state: {
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
		selectedRows: [],																//表格中勾选的对象，准备批量操作

		alertType: 'info',															//alert控件状态info,success,warning,error
		alertMessage: '请编辑通知信息',											 //alert控件内容
		notificationType: '', //选择通知的模式
		users: [],								//查询到的user集合
		targetKeys: [],					//穿梭框右侧的集合，集合里放的是uuid
		num: 1,
		mos: [],
		appInfo: '',
		roleTargetKeys: [],
		AppOption: [],
		AppUuid: [],
		moUuid: [],
		keys: '',
		q: '',
		filterInfo: [],
		see: 'no',
		TransferState: false,
		//导入导出
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				//初次访问
				const query = queryString.parse(location.search);
				if (location.pathname === '/notification' && location.search.length === 0) {				//@@@
					//制造一个浏览器地址栏看得见的跳转，仅仅是跳转，再次触发subscription监听进行query查询
					const { pathname } = location
					dispatch({
						type: 'query',
						payload: query,
					})
				} else if (location.pathname === '/notification' && location.search.length > 0) {
					//自动触发通知查询
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
		 * 获取数据
		 * 与后台交互 调用接口  /api/v1/notification_rules/ (查询按钮)(根据路由跳转自动调用)
		 * @function notification.query
		 */
		* query({ payload }, { call, put }) {
			/**
			 * @description call query 
			 */
			const data = yield call(query, payload)
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
						},
						q: payload.q,
					},
				})
			}
		},

		/**
		 * 获取通知消息
		 * 与后台交互 调用接口 /api/v1/notification_rules/ (查看通知规则按钮)(编辑通知规则按钮)
		 * @function notification.findById
		 */
		* findById({ payload }, { call, put }) {
			NProgress.start()
			message.loading('正在为您获取通知信息,请稍后...', 0)
			const data = yield call(findById, payload)
			if (data.success) {
				NProgress.done()//异步加载动画结束
				message.destroy()
				//如果获取成功，组装已经选中的用户uuid
				let targetKeys = []
				let app = []
				if (data.appCategory.length > 0) {
					app.push(data.appCategory[0].c1)
				}
				for (let userUuid of data.user) {
					targetKeys.push(userUuid.uuid)
				}
				yield put({
					type: 'setState',
					payload: {
						currentItem: data,
						modalVisible: true,
						roleTargetKeys: data.roles,
						targetKeys,
						notificationType: data.informType,
						appInfo: data.appCategory[0] === undefined ? [] : data.appCategory[0].affectSystem, //因应用只支持一单选，暂时这样写
						mos: data.mo[0] === undefined ? [] : data.mo,
						AppUuid: app,
					},
				})
			} else {
				NProgress.done()//异步加载动画结束
				message.destroy()
			}
		},

		/**
		 * 刷新列表 (增删改后会自动调用)
		 * @function notification.requery
		 */
		* requery({ payload }, { put, select }) {
			/* yield put(routerRedux.push({
			pathname: window.location.pathname,
			query: parse(window.location.search.substr(1)),
		})) */
			let pageItem = yield select(({ notification }) => notification.pagination)
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


		/**
		 * 编辑数据
		 * 与后台交互 调用接口  /api/v1/notification_rules/ (编辑按钮)
		 * @function notification.update 
		 */
		* update({ payload }, { select, call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading('正在提交修改信息,请稍后...', 0)
			//取currentItem是为了获取完整的对象来全量update后端的mo对象
			let currentItem = {}
			currentItem = yield select(({ notification }) => notification.currentItem)
			currentItem = Object.assign(currentItem, payload.currentItem)
			payload.currentItem.uuid = currentItem.uuid
			if (payload.currentItem.mo.length > 0) {
				//如果mo存在对象，这循环向后台获取数据，现在暂时只获取交换机、防火墙、路由器、负载均衡对象
				let moInfo = []
				let ips = []
				//备注： 应后台开发人员以及项目经理要求，将以前的逻辑改掉，改为直接传选中设备的discoveryIP
				//for (let _ip of payload.currentItem.mo) {
				//		 let branchName = payload.currentItem.branch
				//		 if(payload.currentItem.branch === 'QH'){
				//		 		branchName = ''
				//		 }
				//		 let qs = "firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5' )  and (discoveryIP=='*"+_ip.split('/')[0]
				//		 +"*' and name == '*" +_ip.split('/')[1]+ "*' and branchName == '*"+ branchName +"*')"
				//		 let newData = {}
				//		 newData.q = qs
				//		 newData.page = 0
				//		 newData.pageSize = 1
				//		 const info = yield call ( nesquery , newData)
				//		 moInfo.push(info.content[0].mo.discoveryIP)
				//	}
				for (let ip of payload.currentItem.mo) {
					ips.push(ip.split('/')[0])
				}
				//去重
				for (let mos of ips) {
					if (moInfo.indexOf(mos) === -1) {
						moInfo.push(mos)
					}
				}
				payload.currentItem.mo = moInfo
			}
			let data = {}
			/**
			 * @description call update
			 */
			data = yield call(update, payload.currentItem)
			if (data.success) {
				NProgress.done()//异步加载动画结束
				message.destroy()
				message.success('修改成功！')
				yield put({
					type: 'setState',
					payload: {
						modalVisible: false,
						targetKeys: [],
						roleTargetKeys: [],
					},
				})
				yield put({ type: 'requery' })
			} else {
				NProgress.done()//异步加载动画结束
				message.destroy()
				throw data
			}
		},


		/**
		 * 新增资源
		 * 与后台交互 调用接口  /api/v1/notification_rules/ (新增按钮)
		 * @function notification.create 
		 */
		* create({ payload }, { select, call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading('正在新增通知,请稍后...', 0)
			if (payload.currentItem.mo.length > 0) {
				let moInfo = []
				//备注： 应后台开发人员以及项目经理要求，将以前的逻辑改掉，改为直接传选中设备的discoveryIP
				//	for (let _ip of payload.currentItem.mo) {
				//			 let branchName = payload.currentItem.branch
				//			 if(payload.currentItem.branch === 'QH'){
				//			 		branchName = ''
				//			 }
				//			 let qs = "firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5')  and (discoveryIP=='*"+_ip.split('/')[0]
				//			 +"*' and name == '*" +_ip.split('/')[1]+ "*' and branchName == '*"+ branchName +"*')"
				//			 let newData = {}
				//			 newData.q = qs
				//			 newData.page = 0
				//			 newData.pageSize = 1
				//			 const info = yield call ( nesquery , newData)
				//			 moInfo.push(info.content[0].mo.discoveryIP)
				//		}
				for (let ip of payload.currentItem.mo) {
					moInfo.push(ip.split('/')[0])
				}
				payload.currentItem.mo = moInfo
			}
			/**
			 * @description call create
			 */
			const data = yield call(create, payload.currentItem)
			if (data.success) {
				message.destroy()
				NProgress.done()//异步加载动画结束
				message.success('新增成功！')
				yield put({
					type: 'setState',
					payload: {
						modalVisible: false,
						targetKeys: [],
						roleTargetKeys: [],
					},
				})
				yield put({ type: 'requery' })
			} else {
				NProgress.done()//异步加载动画结束
				message.destroy()
				throw data
			}
		},

		/**
		 * 批量删除
		 * 与后台交互,调用接口 /api/v1/notification_rules/ 批量删除规则(删除按钮)(列表删除按钮)
		 * @function notification.delete
		 */
		* delete({ payload }, { select, call, put }) {
			/**
			 * @description call remove
			 */
			const data = yield call(remove, payload)
			if (data.success) {
				message.success('删除成功！')
				yield put({
					type: 'setState',
					payload: {
						selectedRows: [],
						batchDelete: false,
						keys: new Date().getTime(),
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/**
		 * 查询ordinary用户集合
		 * 与后台交互 调用接口 /api/v1/users/ 获取所有用户 (新增按钮) (查看按钮)(编辑按钮)
		 * @function notification.queryUser
		 */
		* queryUser({ payload }, { select, call, put }) {
			payload.pageSize = 2000
			/**
			 * @description call queryAll 
			 */
			const data = yield call(queryALL, payload)
			if (data.success) {
				let users = []
				users = data.arr
				for (let datas of users) {
					datas.key = datas.uuid
				}
				yield put({
					type: 'setState',
					payload: {
						users,
						TransferState: false,
					},
				})
			}
		},

		/**
		 * 获取用户信息
		 *与后台交互 调用接口  /api/v1/users/ 获取数据(查看按钮)(编辑按钮)
		 * @function notification.queryUserInfo
		 */
		* queryUserInfo({ payload }, { call, put }) {
			/**
			 * @description call queryUser
			 */
			const data = yield call(queryUser, payload)
			if (data.success) {
				if (data.content.length > 0) {
					yield put({
						type: 'setState',
						payload: {
							//filterInfo: data.content[0].roles[0].alarmApplyFilter === undefined ? [] : data.content[0].roles[0].alarmApplyFilter,
							filterInfo: data.content[0].roles[0].alarmApplyFilter || [],
						},
					})
				}
			}
		},

		/**
		 * 查询应用系统
		 * 与后台交互,调用接口 /api/v1/app-categories/ 获取应用数据 (新增按钮)(查看按钮)(编辑按钮)
		 * @function notification.queryApp
		 */
		* queryApp({ payload }, { call, put }) {
			const data = yield call(queryApp, payload)
			if(data.success){
				yield put({
					type: 'setState',
					payload: {
						AppOption: data.content,
					},
				})
			}
		},
		*onDown({ payload }, { call, put }) {
			yield call(onDown, payload)
		}

	},

	reducers: {
		setState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
