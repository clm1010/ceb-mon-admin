import { issue } from '../../../services/notNetDown'
import { findById } from '../../../services/objectMO'
import { queryRuleById } from '../../../services/policyRule'
import { getToolById } from '../../../services/tools'
import { findById as queryTempById } from '../../../services/policyTemplet'
import { query,issueMo,queryState } from '../../../services/ruleInstance'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

/**
 * 监控配置/非网络监控实例
 * @namespace notNetDown
 * @requires module:监控配置/非网络监控实例
 */
export default {
	namespace: 'notNetDown',

	state: {
		q: '',																					//URL串上的q=查询条件
		modalMOVisible: false, //监控对象弹出窗口
		modalToolVisible: false, // 工具实例弹出窗口
		modalRuleVisible: false, // 策略规则弹出窗口
		modalTempVisible: false, // 策略模板弹出窗口
		list: [],
		currentItem: {}, //被选中的单个行对象
		currentRuleItem: {},
		pagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: 0,																			//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		openPolicyType: '',
		typeValue: '', //编辑页面--策略类型，根据选择值动态调整采集参数
		stdInfoVal: {},
		tabstate: {
			activeKey: 'n1',
			panes: [
				{
					title: '新操作1',
					key: 'n1',
					content: {
						uuid: '',
						period: '',
						times: '',
						foward: '>',
						value: '',
						originalLevel: '',
						innderLevel: '',
						outerLevel: '',
						discard_innder: '',
						discard_outer: '',
						alarmName: '',
						recoverType: '1',
						actionsuuid: '',
						aDiscardActionuuid: '',
						aGradingActionuuid: '',
						aNamingActionuuid: '',
						conditionuuid: '',
						timePerioduuid: '',
						useExt: false, //是否使用扩展条件
						extOp: '<', //扩展条件
						extThreshold: '', //扩展阈值
					},
				},
			],
			newTabIndex: 1,
		},
		batchDelete: false,					//批量删除按钮状态，默认禁用
		choosedRows: [],					//表格中勾选的对象，准备批量操作
		oper:0,                               //重启nagios
		onIssueForbid:false,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				let query = location.query
				if (query === undefined) {query = queryString.parse(location.search)}
				if (location.pathname.includes('/notNetDown')) {
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
		 * 获取资源列表
		 * 与后台交互, 调用接口/api/v1/rule-instances/，获取数据
		 * @function notNetDown.query
		 * 
		 */
		* query({ payload }, { call, put }) {
			if(payload.q){
				payload.q+=";(mo.firstClass!='NETWORK' and mo.firstClass!='SERVER')"
			}else{
			   payload.q="(mo.firstClass!='NETWORK' and mo.firstClass!='SERVER')"
			}
			const data = yield call(query, payload)
			if (data.success) {
				const issueJudge = yield call (queryState,payload)      //判断是否可以下发
				if(issueJudge.success){
					yield put({
						type: 'updateState',
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
							onIssueForbid:issueJudge.content[0].disable,
						},
					})
				}
			}
		},
		/** 
		 * 查询数据
		 * 刷新页面
		 * @function notNetDown.requery
		 */
		* requery ({ payload }, { put }) {
			yield put(routerRedux.push({
			  pathname: window.location.pathname,
			  query: parse(window.location.search.substr(1)),
		  }))
		},
		/** 
		 * 获取单个工具资源
		 * 与后台交互, 调用接口/api/v1/tools/{id}，获取数据
		 * @function notNetDown.getToolById
		 * 
		 */
		* getToolById({ payload }, { call, put }) {
			const data = yield call(getToolById, payload.currentItem.toolInst)

			if (data.success) {
				let tooldata = {}
				tooldata.uuid = data.uuid
				tooldata.name = data.name
				tooldata.toolType = data.toolType
				if (data.branch) tooldata.branch = data.branch
				else tooldata.branch = ''

				yield put({
					type: 'updateState',
					payload: {
						currentItem: tooldata,
						modalToolVisible: true,
					},
				})
			}
		},
		/** 
		 * 获取单个资源
		 * 与后台交互, 调用接口/api/v1/monitor-rules/{id}，获取数据
		 * @function notNetDown.getMoById
		 * 
		 */
		* getMoById({ payload }, { call, put }) { //查询数据
			const data = yield call(findById, payload.currentItem.mo)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						currentItem: data,
						_mngInfoSrc: data.mngInfoSrc, //查到一台mo，自动用mngInfoSrc覆盖_mngInfoSrc，记录最原始发现方式
						zabbixUrl: data.createdByTool, //查到一台mo，自动用createdByTool覆盖页面内zabbixUrl。这是机构窗口warning的依据
						modalMOVisible: true,
					},
				})
			}
		},
		/** 
		 * 获取单个策略实例资源
		 * 与后台交互, 调用接口/api/v1/policies/{id}，获取数据
		 * @function notNetDown.getPolicyRuleById
		 * 
		 */
		* getPolicyRuleById({ payload }, { call, put }) {
			let newq = {}
			newq.uuid = payload.currentItem.rule.uuid
			const data = yield call(queryRuleById, newq)
			if (data.success) {
				let tempList = []
				if (data.monitorItems !== undefined && data.monitorItems.length !== 0) {
					data.monitorItems.forEach((item, index) => {
						let tempid = ''
						let tempname = ''
						if (item.policyTemplate !== undefined) {
							tempid = item.policyTemplate.uuid
							tempname = item.policyTemplate.name
						}
						let iidenx = index + 1
						let temp = {
							index: iidenx,
							tempid,
							tempname,
							tool: item.monitorMethod.toolType,
						}
						tempList.push(temp)
					})
				} else {
					let temp = {
						index: 1,
						tempid: '',
						tempname: '',
						tool: '',
					}
					tempList.push(temp)
				}
				let moobj = {}
				if (data && data.filters && data.filters.length > 0) {
					moobj = { ...data.filters[0] }
				}
				let newdata = {}
				newdata.currentItem = data
				newdata.tempList = tempList
				newdata.alarmFilterInfo = moobj

				yield put({
					type: 'updateState',
					payload: {
						currentItem: newdata,
						modalVisible: true,
						//tempList: tempList,
						//alarmFilterInfo:{...moobj},
					},
				})
			}
		},
		/** 
		 * 获取单个资源
		 * 与后台交互, 调用接口/api/v1/policy-templates/{id}，获取数据
		 * @function notNetDown.issue
		 * 
		 */
		* getTemplateById({ payload }, { call, put }) { //查询数据
			const data = yield call(queryTempById, payload.currentItem.template)
			let tabstate = {}
			let panes = []
			if (data.policyTemplate.monitorParams == undefined || data.policyTemplate.monitorParams.ops == undefined) {
				tabstate = {
					activeKey: 'n1',
					panes: [
						{
							title: '新操作1',
							key: 'n1',
							content: {
								uuid: '',
								period: '',
								times: '',
								foward: '1',
								value: '',
								originalLevel: '',
								innderLevel: '',
								outerLevel: '',
								discard_innder: '',
								discard_outer: '',
								alarmName: '',
								recoverType: '1',
								actionsuuid: '',
								aDiscardActionuuid: '',
								aGradingActionuuid: '',
								aNamingActionuuid: '',
								conditionuuid: '',
								timePerioduuid: '',
								useExt: false, //是否使用扩展条件
								extOp: '<', //扩展条件
								extThreshold: '', //扩展阈值
							},
						},
					],
					newTabIndex: 1,
				}
			} else {
				let newTabIndex = 0,
					pane
				for (let operation of data.policyTemplate.monitorParams.ops) {
					let tuuid = ''
					if (operation.timePeriod === undefined) {
						tuuid = ''
					} else {
						tuuid = operation.timePeriod.uuid
					}
					newTabIndex++
					pane = {
						title: `新操作${newTabIndex}`,
						key: (`n${newTabIndex}`),
						content: {
							uuid: operation.uuid,
							period: tuuid,
							times: operation.condition.count,
							foward: operation.condition.op,
							value: operation.condition.threshold,
							originalLevel: operation.actions.gradingAction.oriSeverity,
							innderLevel: operation.actions.gradingAction.inPeriodSeverity,
							outerLevel: operation.actions.gradingAction.outPeriodSeverity,
							discard_innder: operation.actions.discardAction.inPeriodDiscard,
							discard_outer: operation.actions.discardAction.outPeriodDiscard,
							alarmName: operation.actions.namingAction.naming,
							recoverType: operation.recoverType,
							actionsuuid: operation.actions.uuid,
							aDiscardActionuuid: operation.actions.discardAction.uuid,
							aGradingActionuuid: operation.actions.gradingAction.uuid,
							aNamingActionuuid: operation.actions.namingAction.uuid,
							conditionuuid: operation.condition.uuid,
							timePerioduuid: operation.timePeriod.uuid,
							useExt: operation.condition.useExt, //是否使用扩展条件
							extOp: operation.condition.extOp, //扩展条件
							extThreshold: operation.condition.extThreshold, //扩展阈值
						},
					}
					panes.push(pane)
				}//for
				tabstate = {
					activeKey: 'n1',
					panes,
					newTabIndex,
				}
			}

			if (data.policyTemplate.collectParams == undefined) {
				data.policyTemplate.collectParams = {
					collectInterval: '',
					timeout: '',
					retries: '',
					pktSize: '',
					pktNum: '',
					srcDeviceTimeout: '',
					srcDeviceRetries: '',
				}
			}
			//对更新时间和创建时间处理一下
			if (data.policyTemplate.createdTime !== 0) {
				let text = data.policyTemplate.createdTime
				data.policyTemplate.createdTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (data.policyTemplate.updatedTime !== 0) {
				let text = data.policyTemplate.updatedTime
				data.policyTemplate.updatedTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			let stdInfoVal = {}
			if (data.policyTemplate.monitorParams !== undefined && data.policyTemplate.monitorParams.indicator !== undefined) {
				stdInfoVal = data.policyTemplate.monitorParams.indicator
			}
			yield put({
				type: 'showModal',
				payload: {
					//					modalType: 'update',
					currentItem: data,
					modalTempVisible: true,
					tabstate,
					typeValue: data.policyTemplate.policyType,
					stdInfoVal,
				},
			})
		},

		/** 
		 * 下发
		 * 与后台交互, 调用接口/api/v1/rule-instances/issue，获取数据
		 * @function notNetDown.issue
		 * 
		 */
		* issue ({ payload }, { call, put }) {
//			NProgress.start()//异步加载动画开始
//			message.loading('正在下发,请稍后...', 0)
			message.success('操作完成')
			const data = yield call(issueMo, payload)
			if (data && data.success) {
//				NProgress.done()//异步加载动画结束
//				message.destroy()
//				message.success('操作完成，后台正在下发！')
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			const {
				policyAllList, policyExistList, policyList, q,
			} = action.payload
			return {
				...state,
				policyAllList,
				policyExistList,
				policyList,
			}
		},

		updateState(state, action) {
			//console.log("in updateState")
			//console.dir(action.payload)

			return { ...state, ...action.payload }
		},

		//这里控制弹出窗口显示
		showModal(state, action) {
			return { ...state, ...action.payload }
		},
		//这里控制弹出窗口隐藏
		hideModal(state, action) {
			return { ...state, ...action.payload }
		},

	},
}

