import { queryPolicyInfo } from '../../../../services/objectMO'
import { findById, queryTime } from '../../../../services/policyTemplet'
export default {

	namespace: 'policyList',

	state: {
		modalPolicyVisible: false,
		moPolicyInfo: {},
		openPolicyType: '',
		policyInstanceId: '',
		paginationInfs: {								//分页对象
			showSizeChanger: true,						//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,			//用于显示数据总量
			current: 1,									//当前页数
			total: null,									//数据总数？
		},
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
		modalType: '',
		currentItem: {},
		timeList: [],
		modalVisible: false,
		isClose: false,
		typeValue: '',
		stdInfoVal: {},
		operationVisible: false,
		newOperationItem: {},
		fields:{},
		filterMode: 'BASIC',
		operationType: 'add',
		CheckboxSate1: false,
	},

	effects: {
		* queryPolicy({ payload }, { select, call, put }) {
			let newdata = { ...payload }
			const data = yield call(queryPolicyInfo, newdata)
			if (data.success) {
				let policys = data.policies
				let moPolicyInfo = {}
				let policiesInfo = [...policys.content]
				if (policiesInfo && policiesInfo.length > 0) {
					let uuids = ''
					policiesInfo.forEach((item, index) => {
						if (index === 0) {
							uuids = item.uuid
						} else {
							uuids = `${uuids}%3B${item.uuid}`
						}
					})

					/* 	const tooldata = yield call(queryToolsInstance, { uuids })
						if (tooldata && tooldata.policyToolsMap) {
							policiesInfo.forEach((item) => {
								item.toolPolicys = tooldata.policyToolsMap[item.uuid] ? tooldata.policyToolsMap[item.uuid] : []
								})
							  } */
				}
				moPolicyInfo.content = [...policiesInfo]
				moPolicyInfo.relatedPolicyInstances = data.relatedPolicyInstances
				moPolicyInfo.issuedPolicyInstances = data.issuedPolicyInstances
				moPolicyInfo.unissuedPolicyInstances = data.unissuedPolicyInstances
				moPolicyInfo.issueFailedPolicyInstances = data.issueFailedPolicyInstances
				moPolicyInfo.notStdPolicyInstances = data.notStdPolicyInstances
				moPolicyInfo.tmpPolicyInstances = data.tmpPolicyInstances
				yield put({
					type: 'querySuccessPolicy',
					payload: {
						moPolicyInfo: { ...moPolicyInfo },
						paginationInfs: {
							current: policys.page.number + 1 || 1,
							pageSize: policys.page.pageSize || 10,
							total: policys.page.totalElements,
						},
					},
				})
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
					type: 'updateState',
					payload: {
						timeList,
					},
				})
			} else {
				throw data
			}
		},
		* findPolicyTemplet({ payload }, { select, call, put }) {
			const data = yield call(findById, payload.record.template)
			let tabstate = {}
			let panes = []
			let filterMode = 'BASIC'
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
					let fields = {}
					if (operation.timePeriod === undefined) {
						tuuid = ''
					} else {
						tuuid = operation.timePeriod.uuid
					}
					newTabIndex++
					if (operation.condition.useExt == false && operation.condition.extOp == 'ADV') {
						filterMode = 'ADVANCED'
						fields.formula = operation.condition.threshold
						fields.formulaForFrontend = operation.condition.extThreshold
					}
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
							filterMode: filterMode,
							fields: fields,
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
				type: 'setState',
				payload: {
					modalType: 'see',
					currentItem: data,
					modalVisible: true,
					isClose: false,
					tabstate,
					typeValue: data.policyTemplate.policyType,
					stdInfoVal,
				},
			})
		}
	},

	reducers: {
		setState(state, action) {
			return { ...state, ...action.payload }
		},
		hideModal(state, action) {
			return { ...state, ...action.payload }
		},
		updateState(state, action) {
			return { ...state, ...action.payload }
		},
		querySuccessPolicy(state, action) {
			const { moPolicyInfo, paginationInfs } = action.payload
			return {
				...state,
				moPolicyInfo,
				paginationInfs: {
					...state.paginationInfs,
					...paginationInfs,
				},
			}
		},
	},
}
