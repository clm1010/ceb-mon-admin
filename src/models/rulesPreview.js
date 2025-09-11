import { rulesPreview ,seave ,issue} from '../services/rulesPreview'
import { findById } from '../services/objectMO'
import { queryRuleById } from '../services/policyRule'
import { getToolById } from '../services/tools'
import { findById as queryTempById,queryTime } from '../services/policyTemplet'
import { message } from 'antd'
import queryString from "query-string";

export default {
	namespace: 'rulesPreview',

	state: {
		q: '',																					//URL串上的q=查询条件
		modalMOVisible: false, //监控对象弹出窗口
		modalToolVisible: false, // 工具实例弹出窗口
		modalRuleVisible: false, // 策略规则弹出窗口
		modalTempVisible:false, // 策略模板弹出窗口
		policyList: [],										//定义了increment表格数据集合
		policyExistList: [], //Existing
		policyAllList: [], //All
		errorList: [], //error
		currentItem: {}, //被选中的单个行对象
		openPolicyType: 'UNISSUED',
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
		firstType:'',      //判断一级分类的类型
		//
		operationVisible:false,
		newOperationItem: {},
		timeList: [], //周期
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname.includes('/rulespreview')) {
					let query = location.query
					if (query === undefined) {
						query = queryString.parse(location.search);
					}
					console.dir(query)
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
			let querydata = { ...payload }
			let newdata = {}
			if ((querydata !== undefined) && (querydata !== '')) {
				let ids = querydata.ids.split(',')
				let branches = querydata.branches.split(',')
				let moCriteria = ''
				let criteria = ''
				ids.forEach((record) => {
					moCriteria += `uuid == ${record} or `
				})
				moCriteria = moCriteria.substr(0, moCriteria.length - 4)
				branches.forEach((record) => {
					criteria += `branch == ${record} or `
				})
				criteria = criteria.substr(0, criteria.length - 4)
				// TBD for backend interface
				newdata.criteria = criteria
				newdata.moCriteria = moCriteria
				//newdata.policyType = "UNISSUED"
				if(querydata.firstClass && querydata.firstClass=='os'){
					newdata.toolTypeCriteria = 'ITM,NAGIOS,OVO,ZABBIX'
				}

			}
			let firstType = payload.firstClass
      		const data = yield call(rulesPreview, newdata)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						policyAllList: data.all,
						policyExistList: data.existing,
						policyList: data.incremental,
						errorList: data.problem,
						firstType:firstType,
						q: payload.q,	//把查询条件放到state中
					},
				})
			}
		},

		* seave ({ payload }, { select, call, put }) {
		const data = yield call(seave, payload)				//@@@
  		  if (data.success) {
			  message.success('成功的保存了那条监控实例！')
				yield put({ type: 'requery' })
			} else {
				message.error('主机保存失败!')
			}
		},

		* getToolById({ payload }, { call, put }) {
			const data = yield call(getToolById, payload.currentItem.toolInst)

			if (data.success) {
				let tooldata = {}
				tooldata.uuid = data.uuid
				tooldata.name = data.name
				tooldata.toolType = data.toolType
				tooldata.url = data.url
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

		* getTemplateById({ payload }, { call, put }) { //查询数据
			const data = yield call(queryTempById, payload.currentItem.template)
			let tabstate = {}
			let panes = []
			if (data.policyTemplate.alarmSettings == undefined) {
				tabstate = {
					activeKey: 'n1',
					panes: [
					{
						title: '新操作1',
							key: 'n1',
							content: {
							uuid: '',
							period: '',
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
							mode:'0',
							logicOp:'AND'
							},
					},
					],
						newTabIndex: 1,
				}
			} else {
				let newTabIndex = 0,
					pane
				for (let operation of data.policyTemplate.alarmSettings) {
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
							originalLevel: operation.actions.gradingAction.oriSeverity,
							innderLevel: operation.actions.gradingAction.inPeriodSeverity,
							outerLevel: operation.actions.gradingAction.outPeriodSeverity,
							discard_innder: operation.actions.discardAction.inPeriodDiscard,
							discard_outer: operation.actions.discardAction.outPeriodDiscard,
							alarmName: operation.actions.namingAction.naming,
							recoverType: operation.recoverType,
							aDiscardActionuuid: operation.actions.discardAction.uuid,
							aGradingActionuuid: operation.actions.gradingAction.uuid,
							aNamingActionuuid: operation.actions.namingAction.uuid,
							timePerioduuid: operation.timePeriod.uuid,
							filterItems:operation.conditions,
							mode:operation.mode.toString(),
							logicOp:operation.logicOp,
							expr:operation.expr,
							exprForFrontend:operation.exprForFrontend,
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

			const dataTime = yield call(queryTime)
			let timeList = []
			if (dataTime.content) {
				dataTime.content.forEach((item) => {
					let time = {
						key: item.uuid,
						value: item.name,
					}
					timeList.push(time)
				})
			}

			yield put({
			type: 'showModal',
			payload: {
				timeList,
				currentItem: data,
				modalVisible: true,
				isClose: false,
				tabstate,
				typeValue: data.policyTemplate.policyType,
				},
			})
		},

		* issue({ payload }, { call, put }){
		const data = yield call(issue, payload)				//@@@
  		  if (data.success) {
			  message.success('下发成功')
				yield put({ type: 'requery' })
			} else {
				message.error('下发失败!')
			}
		}
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

