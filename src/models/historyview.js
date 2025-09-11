import { queryApp } from '../services/maintenanceTemplet'
import { query, querySeverity, queryJournal, updateMt, onDown, saveHistoryColums, findHistoryColums, createHistoryColums, delDefindColums, querGrafana } from '../services/historyview'
import { xyklogin, xykquery, xykquerySeverity, xykMSMQuery, xykqueryJournal } from '../services/xykhistoryview'
import { queryAllosts } from '../services/osts'
import { DownloadReporter } from '../services/downloadReporter'
import { query as MSMQuery } from '../services/notificationInfo'
import { sendOuts } from '../services/ticket'
import { queryRecommend,outCall } from '../services/alarms'
import { message } from 'antd'
import queryString from 'query-string';
import { findById as findRulsById } from '../services/notificationRule'
import { queryALL } from '../services/userinfo'
import NProgress from 'nprogress'
import Cookie from '../utils/cookie'
import token from '../utils/otherToken'
import { sessionTime } from '../utils/config'
const user = JSON.parse(sessionStorage.getItem('user'))
export default {

	namespace: 'historyview',				// @@@

	state: {
		q: '',
		filterSelect: '',
		list: [],																				// 定义了当前页表格数据集合
		appList: [],																		// 应用列表
		currentItem: {},																// 被选中的行对象的集合
		modalVisible: false,														// 弹出窗口是否可见
		modalType: 'create',														// 弹出窗口的类型
		pagination: {																		// 分页对象
			showSizeChanger: true,												// 是否可以改变 pageSize
			showQuickJumper: true, // 是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
			current: 1,																		// 当前页数
			total: 0,																			// 数据总数？
		},
		batchMaintain: false,															// 批量删除按钮状态，默认禁用
		selectedRows: [],																// 表格中勾选的对象，准备批量操作
		rowDoubleVisible: false,
		detailsSource: [],															// 历史告警信息
		historyviewSource: [],													// 历史告警信息
		selectInfo: {},
		severitySql: '',
		sortSql: '',
		journalSql: '',
		detailsSql: '',
		defaultKey: 0,
		info: '',
		loadReporter: '',
		title: '',
		expand: true,
		workOrderVisible: false,
		alertType: '',
		alertMessage: '工单信息',
		//通知规则查询
		rulesCurrentItem: {},
		users: [],								//查询到的user集合
		TransferState: false,
		AppOption: [],
		mos: [],
		appInfo: '',
		roleTargetKeys: [],
		AppUuid: [],
		notificationType: '',    //选择通知的模式
		targetKeys: [],					//穿梭框右侧的集合，集合里放的是uuid
		moUuid: [],
		filterInfo: [],
		defaultKey1: '',
		branchType: 'ZH',
		types: 'normal',
		switchView: true,
		DrawerVisible: false,
		CustomColumns: [],
		ColumState: false,
		initColumState: '',
		saveCulumFlag: true
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// 注意：q主要是通过公共组件components/Filter/Filter.js传递过来的
			history.listen((location) => {
				let query = location.query
				if (query === undefined) {
					query = queryString.parse(location.search);
				}
				//初次访问，有可能用户点击左侧历史告警，所以每次拦截到historyview时，清空查询添加q
				if (location.pathname === '/historyviewGroup/historyviews') {
					dispatch({ type: 'findDefindColums', payload: {} })
					dispatch({
						type: 'queryHistoryview',
						payload: query,
					})
					dispatch({
						type: 'setState',
						payload: {
							q: '',
							title: '历史告警查询',
							branchType: 'ZH'
						},
					})
				} else if (location.pathname.includes('/historyviewGroup/historyviews')) {
					dispatch({ type: 'findDefindColums', payload: {} })
					if (location.action === 'POP' && location.state === null) {
						dispatch({
							type: 'queryHistoryview',
							payload: {
								q: (query.q === '' || query.q === undefined) ? '' : query.q,
							},
						})
					} else {
						//进行其他操作的时候只查询历史信息
						dispatch({
							type: 'queryHistoryview',
							payload: query,
						})
					}
					//如果是传的空，因为Filter.js传的为空，所以重新查询左侧应用，同时清空q
					if (query.q === '' || query.q === undefined || !query.q.includes('n_AppName==')) {
						let title = '历史告警查询'
						if (query.q === 'isClear==\'1\';hiscope==\'hour\'') {
							title = '未恢复告警查询'
						}
						dispatch({
							type: 'setState',
							payload: {
								q: query.q,
								title,
								branchType: 'ZH'
							},
						})
					}
				} else if (location.pathname === '/historyviewGroup/xykhistoryviews') {
					dispatch({
						type: 'xyklogin',
						payload: query,
					})
					dispatch({
						type: 'setState',
						payload: {
							q: '',
							title: '历史告警查询',
							branchType: 'XYK',
						},
					})
				}
			})
		},
	},

	effects: {
		* updateMt({ payload }, { call, put, select }) {
			const selectedRows = yield select(({ historyview }) => historyview.selectedRows)
			const ids = selectedRows.map(v => v.oz_AlarmID)

			payload.ids = ids
			const data = yield call(updateMt, payload)

			if (data.success) {
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		* query({ payload }, { call, put }) {
			//查应用分类树数据
			const treeData = yield call(queryApp, payload)
			if (treeData.success) {
				yield put({
					type: 'setState',
					payload: {
						appList: treeData.content,
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* queryHistoryview({ payload }, { call, put, select }) {
			//选择信用卡或者总行的请求
			const branchType = yield select(({ historyview }) => historyview.branchType)
			const switchView = yield select(({ historyview }) => historyview.switchView)
			const data = branchType == 'XYK' ? yield call(xykquery, payload) : yield call(query, payload)
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
						loadReporter: payload.q,
						q: payload.q,
						saveCulumFlag: true
					},
				})
				if (!switchView) {
					yield put({
						type: "traceBack/queryTotal",
						payload: {
							q: payload.q,
						}
					})
					yield put({
						type: "traceBack/queryGrain",
						payload: {
							q: payload.q,
							CardType: "alarmTotal"
						}
					})
				}

			} else if (data.detail && data.detail.includes("customError")) {
				throw data
			} else if (data.code === 400 && data.detail && data.detail === "esResultWindowTooLargeError") {
				message.warning('查询范围超出可查范围,请缩小查询范围', 5)
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* DownloadReporter({ payload }, { call, put }) {
			const data = yield call(DownloadReporter, payload)
		},
		// * requery({ payload }, { put }) {
		// 	yield put(routerRedux.push({
		// 		pathname: window.location.pathname,
		// 		query: parse(window.location.search.substr(1)),
		// 	}))
		// },
		* requery({ payload }, { select, put }) {
			let pageItem = yield select(({ historyview }) => historyview.pagination)
			let q = yield select(({ historyview }) => historyview.q)
			yield put({
				type: 'queryHistoryview',
				payload: {
					page: pageItem.current - 1,
					pageSize: pageItem.pageSize,
					q: q
				},
			})
		},

		* sendOuts({ payload }, { put, call, select }) {
			let datasourceList = []
			const data = yield call(queryAllosts, {})
			if (data.success) {
				datasourceList = data.content
				if (datasourceList.length > 0) {
					let oelDatasource = datasourceList[0].uuid
					// payload.source = oelDatasource 历史告警发工单不需要传source
					payload.source = ''
					const data1 = yield call(sendOuts, payload)
					if (data1.success) {
						if (data1.errList.length > 0) {
							message.error(data1.errList)
							yield put({
								type: 'setState',
								payload: {
									alertType: 'error',
									alertMessage: `工单发送失败! 失败原因：${data1.errList}`,
								},
							})
						} else if (data1.sheetNo.length > 0) {
							message.success('工单发送成功')
							yield put({
								type: 'setState',
								payload: {
									workOrderVisible: false,
									alertType: 'success',
									alertMessage: '工单发送成功',
								},
							})
						}
					}
				} else {

				}
			}
		},
		//通知规则需要的请求 star
		*findRulesById({ payload }, { put, call }) {
			NProgress.start()
			message.loading('正在为您获取通知信息,请稍后...', 0)
			const data = yield call(findRulsById, payload)
			if (data.success && data.informType !== undefined) {
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
						rulesCurrentItem: data,
						modalVisible: true,
						roleTargetKeys: data.roles,
						targetKeys: targetKeys,
						notificationType: data.informType,
						appInfo: data.appCategory[0] === undefined ? [] : data.appCategory[0].affectSystem,//因应用只支持一单选，暂时这样写
						mos: data.mo[0] === undefined ? [] : data.mo,
						AppUuid: app,
						defaultKey1: `${new Date().getTime()}`,
					},
				})
			} else if (data.success && data.informType === undefined) {
				NProgress.done()//异步加载动画结束
				message.destroy()
				message.error('未找到对应的通知规则！', 5)
			} else {
				NProgress.done()//异步加载动画结束
				message.destroy()
			}
		},
		*queryUser({ payload }, { select, call, put }) {
			payload.pageSize = 2000
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
		*queryApp({ payload }, { call, put }) {
			const data = yield call(queryApp, payload)
			yield put({
				type: 'setState',
				payload: {
					AppOption: data.content
				}
			})
		},
		//通知规则需要的请求 end
		* xyklogin({ payload }, { put, call }) {
			const data = yield call(xyklogin, payload)
			if (data.success && data.token) {
				sessionStorage.setItem('xyktoken', data.token)
				let cookie = new Cookie('xykcookie')
				cookie.setCookie(data.token, sessionTime)
				yield put({
					type: 'queryHistoryview',
					payload: payload
				})
			}
		},

		*onDown({ payload }, { select, call }) {
			yield call(onDown, payload.url);
		},
		*trceBack({ payload }, { select, call, put }) {
			const q = yield select(({ historyview }) => historyview.q)
			window.open(`/traceBack?q=${q}`, '', '', 'false')
		},

		/* 
			告警根因分析 传参数 通过告警id获取故障id ，跳转
		*/
		* getRecommendAddres({ payload }, { call, put }) {
			const data = yield call(queryRecommend, payload)
			if (data.success) {
				if (data.data && data.data.failureCodes && data.data.failureCodes.length > 0) {
					let id = data.data.failureCodes[0]
					window.open(`http://10.218.34.27:21080/problem/${id}?token=${token.oda_token}`)
				} else {
					message.warning('该告警没有对应的根因分析')
				}
			} else {
				throw data
			}
		},
		* findDefindColums({ payload }, { call, put }) {
			payload.q = `user == '${user.username}';viewKey == 'historyview'`
			const data = yield call(findHistoryColums, payload)
			if (data.success) {
				if (data.content.length == 0) {
					yield put({
						type: 'setState',
						payload: {
							ColumState: false,
							initColumState: '',   // 初始数据库是否有列存在
						}
					})
				} else {
					let CustomColumns = JSON.parse(data.content[0].viewInfo)
					yield put({
						type: 'setState',
						payload: {
							CustomColumns: CustomColumns,
							ColumState: true,
							initColumState: data.content[0].uuid,    // 初始数据库是否有列存在
						}
					})
				}
			} else {
				throw data
			}
		},
		* saveDefindColums({ payload }, { call, put }) {
			const data = yield call(saveHistoryColums, payload)
			if (data.success) {
				let CustomColumns = JSON.parse(data.viewInfo)
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						DrawerVisible: false,
						CustomColumns: CustomColumns,
						ColumState: true,
						initColumState: data.uuid,    // 初始数据库是否有列存在
					}
				})
			} else {
				throw data
			}
		},
		* createDefindColums({ payload }, { call, put }) {
			const data = yield call(createHistoryColums, payload)
			if (data.success) {
				let CustomColumns = JSON.parse(data.viewInfo)
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						DrawerVisible: false,
						CustomColumns: CustomColumns,
						ColumState: true,
						initColumState: data.uuid,    // 初始数据库是否有列存在
					}
				})
			} else {
				throw data
			}
		},
		* delDefindColums({ payload }, { call, put }) {
			const data = yield call(delDefindColums, payload)
			if (data.success) {
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
						DrawerVisible: false,
						ColumState: false,
					}
				})
			} else {
				throw data
			}
		},
		// 调用grafana
		* getGrafana({ payload }, { call, put }) {
			const data = yield call(querGrafana, payload)
			if (data.success && data.url.includes('ump-proxy')) {
				window.open(data.url)
			} else {
				message.error("获取granfana地址失败")
			}
		},
	},

	reducers: {
		setState(state, action) {
			if (state.title !== '') {
				delete action.payload.title
			}
			return { ...state, ...action.payload }
		},
	},

}
