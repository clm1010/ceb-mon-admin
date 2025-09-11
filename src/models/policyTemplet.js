import { query, queryTime, stdquery, create, remove, update, check, queryPolicies, MoveTo, CopyTo, queryToolsInstance, findById, onDown, search, Perfdata, Formula } from '../services/policyTemplet'
import { queryRelatedMOsInfo } from '../services/objectMO'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
import moment from 'moment'
import { message } from 'antd'
export default {

	namespace: 'policyTemplet',

	state: {
		CheckboxSate: false,
		CheckboxSate1: false,
		list: [],																				//定义了当前页表格数据集合
		currentItem: {},																//被选中的单个行对象
		modalVisible: false,														//新增编辑弹出窗口是否可见
		groupVisible: false,														//选择分组弹出窗口是否可见
		kpiVisible: false,														//选择指标弹出窗口是否可见
		modalType: 'create',														//弹出窗口的类型
		pagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					//用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		pagination1: {
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共 ${total} 条`,
			current: 1,
			total: null,
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		checkStatus: 'done',
		isClose: false,
		batchDelete: false,
		choosedRows: [],
		filterSchema: [],																//查询配置文件，自动加载生成查询界面
		//新增策略模板-操作详情部分功能代码----start
		fileType: 'policyTemplet',
		newOperationItem: {},
		operationVisible: false,
		operationType: 'add',														//记录操作详情操作状态，add/edit
		tabstate: {
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
					},
				},
			],
			newTabIndex: 1,
		},
		//新增策略模板-操作详情部分功能代码----start
		typeValue: '', //编辑页面--策略类型，根据选择值动态调整采集参数
		timeList: [], //周期
		stdList: [],
		groupUUID: [],
		stdInfoVal: {},
		stdgroupUUID: [],

		stdUUIDToPolicy: '', //指标的UUID 用来获取关联的实例
		stdPolicyNumber: 0, //关联的实例的数量
		policyList: [], //关联的实例对象
		policyVisible: false, //控制弹出框
		paginationPolicy: {							//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},

		stdUUIDMos: '', //策略模板的UUID 用来获取关联的对象
		stdMosNumber: 0, //关联的对象的数量
		mosList: [], //关联的对象对象
		mosVisible: false,


		indicatorsModalVisible: false,
		indicatorsItem: {},
		copyOrMoveModal: false,
		copyOrMoveModalType: 'copy',

		filterKey: '', //查询条件控件的key值

		//列维护所用---------------start
		columeVisible: false,
		columeState: {
			mockData: [],
			targetKeys: [],
		},
		columeList: [

		],
		columeInfo: {
			key: '',
			name: '',
			width: '',
			locked: false,
			sort: '',
		},
		selectKey1: '',
		selectKey2: '',
		//列维护所用---------------end
		keys: '',
		pageChange: 0,
		q: '',
		see: 'no',
		heightSet: {
			height: '1021px',
			overflow: 'hidden',
		},	// 设置高度使用
		expand: true,
		//导入
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
		filter: {
			filterItems: [{ indicator: { name: '', uuid: '' }, function: 'count', count: '', exprLValue: '', exprOperator: '', exprRValue: '', op: '', threshold: '', index: 0, }],
			filterIndex: [0],
		},
		selectIndex: '',
		modaType: '',
		resetCalInput: false,
		advancedItem: {},
		// for performance data of DS
		xyAais: [],
		yAais: [],
		legend: [],
		optiond1: [],
		content: [],
		expr: '',  //性能数据表达式
		showFlag: false,  //性能数据显示
		selectValue: 1800,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				const query = queryString.parse(location.search);
				if (location.pathname.includes('/policyTempletGroup/policyTemplet')) {
					dispatch({
						type: 'query',
						payload: query,
					})
				}
			})
		},
	},

	effects: {

		* queryPolicies({ payload }, { select, call, put }) { //查询数据
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ policyTemplet }) => policyTemplet.stdUUIDToPolicy)
				newdata = { ...payload, uuid }
			}
			const data = yield call(queryPolicies, newdata) //与后台交互，获取数据
			if (data.success) {
				//获取每一个策略实例对应的监控实例（start）
				let policiesInfo = [...data.content]
				if (policiesInfo && policiesInfo.length > 0) {
					let uuids = ''
					policiesInfo.forEach((item, index) => {
						if (index === 0) {
							uuids = item.uuid
						} else {
							uuids = `${uuids}%3B${item.uuid}`
						}
					})

					const tooldata = yield call(queryToolsInstance, { uuids })
					if (tooldata && tooldata.policyToolsMap) {
						policiesInfo.forEach((item) => {
							item.toolPolicys = tooldata.policyToolsMap[item.uuid] ? tooldata.policyToolsMap[item.uuid] : []
						})
					}
				}
				//获取每一个策略实例对应的监控实例（end）

				yield put({
					type: 'querySuccessPolicy',
					payload: {
						policyList: policiesInfo,
						paginationPolicy: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},

		* queryMos({ payload }, { select, call, put }) { //查询数据
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ policyTemplet }) => policyTemplet.stdUUIDMos)
				newdata = { ...payload, uuid }
			}

			const data = yield call(queryRelatedMOsInfo, newdata) //与后台交互，获取数据
			if (data.success) {
				yield put({
					type: 'querySuccessMos',
					payload: {
						mosList: data.content,
						paginationPolicy: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},

		* query({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ policyTemplet }) => policyTemplet.groupUUID)
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			}

			const newdata = { ...payload, groupUUID }
			const data = yield call(query, newdata)
			if (data.success) {
				yield put({
					type: 'showModal', //showModal
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
						q: newdata.q,
					},
				})
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
				type: 'updateState',
				payload: {
					timeList,
				},
			})
		}, //query

		* querystdInfo({ payload }, { select, call, put }) { //查询数据
			const newdata = { ...payload }
			const data = yield call(stdquery, newdata) //与后台交互，获取数据
			if (data.success) {
				yield put({
					type: 'querySuccess1',
					payload: {
						stdList: data.content,
						pagination1: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},


		* move({ payload }, { call, put }) {
			const data = yield call(MoveTo, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						copyOrMoveModal: false,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		* copy({ payload }, { call, put }) {
			const data = yield call(CopyTo, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						copyOrMoveModal: false,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},


		* create({ payload }, { call, put }) {
			payload.isStd = true
			yield put({
				type: 'hideModal',
				payload: {
					modalVisible: false,
					isClose: true,
				},
			})

			const data = yield call(create, payload)
			if (data.success) {
				yield put({
					type: 'hideModal',
					payload: {
						modalVisible: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* requery({ payload }, { put, select }) {
			/* yield put(routerRedux.push({
			pathname: window.location.pathname,
			query: parse(window.location.search.substr(1)),
		  })) */
			let pageItem = yield select(({ policyTemplet }) => policyTemplet.pagination)
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
		* delete({ payload }, { call, put }) {
			const data = yield call(remove, payload)
			if (data.success) {
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* update({ payload }, { select, call, put }) {
			payload.isStd = true
			const id = yield select(({ policyTemplet }) => policyTemplet.currentItem.policyTemplate.uuid)
			const newTool = { ...payload, id }
			const data = yield call(update, newTool)
			if (data.success) {
				yield put({
					type: 'hideModal',
					payload: {
						modalVisible: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.record.policyTemplate)
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
								mode: '0',
								logicOp: 'AND'
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
							//actionsuuid: operation.actions.uuid,
							aDiscardActionuuid: operation.actions.discardAction.uuid,
							aGradingActionuuid: operation.actions.gradingAction.uuid,
							aNamingActionuuid: operation.actions.namingAction.uuid,
							//conditionuuid: operation.condition.uuid,
							timePerioduuid: operation.timePeriod.uuid,
							filterItems: operation.conditions,
							mode: operation.mode.toString(),
							logicOp: operation.logicOp,
							expr: operation.expr,
							exprForFrontend: operation.exprForFrontend,
							// useExt: operation.condition.useExt, //是否使用扩展条件
							// extOp: operation.condition.extOp, //扩展条件
							// extThreshold: operation.condition.extThreshold, //扩展阈值
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
			yield put({
				type: 'showModal',
				payload: {
					modalType: 'update',
					currentItem: data,
					modalVisible: true,
					isClose: false,
					tabstate,
					typeValue: data.policyTemplate.policyType,
					//					stdInfoVal,
				},
			})
		},
		*onDown({ payload }, { call, put }) {
			const data = yield call(onDown, payload)
		},

		* Formula({ payload }, { select, call, put }) { //查询数据
			/*
				payload:
					formula,
					selectValue,
					page,
					q,
					sort
			*/
			let a = {
				formula: payload.formula
			}
			const data = yield call(Formula, a) //与后台交互，获取数据
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						expr: data.expr,
					},
				})
				let payload2 = {
					page: payload.page,
					pageSize: 1000,
					q: payload.q,
					sort: payload.sort,
				}
				const data2 = yield call(search, payload2)
				if (data2.success) {
					yield put({
						type: 'updateState',
						payload: {
							content: data2.content,
						},
					})
					const selectValue = yield select(state => state.policyTemplet.selectValue)
					
					let promApiReq = {
						end: moment(moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DD HH:mm:ss')).unix(),
						query: data.expr,
						start: moment(moment(Date.parse(new Date()) / 1000 - selectValue, 'X').utc(8).format('YYYY-MM-DD HH:mm:ss')).unix(),
						step: 60,
						timeout: 10
					}
					let payload3 = {
						promApiReq: promApiReq,
						tool: data2.content ? data2.content[0] : ''
					}
					const data3 = yield call(Perfdata, payload3)
					let yAais = []
					let xyAais = []
					if (data3.success) {
						if (data3.code == 0) {
							if (data3.data.result && data3.data.result.length > 0) {
								let legend = [], option1 = [], xyAais = []
								data3.data.result.forEach((item, index) => {
									if (index === 0) {
										item.values.forEach((time, index) => {
											xyAais.push(new Date(time[0] * 1000).getHours() + ':' + (new Date(time[0] * 1000).getMinutes() < 10 ? '0' + new Date(time[0] * 1000).getMinutes() : new Date(time[0] * 1000).getMinutes()))
										})
									}
									let source = []
									let legendString = JSON.stringify(item.metric)
									legend.push(legendString)//放图例信息
									item.values.forEach((info, index) => {
										source.push(info[1])
									})
									option1.push({
										name: legendString,
										type: 'line',
										showAllSymbol: true,
										symbol: 'rect',
										symbolSize: 3,
										data: source
									})
								})
								yield put({
									type: 'updateState',
									payload: {
										xyAais: xyAais,
										yAais: [],
										legend: legend,
										option1: option1
									},
								})
							} else {
								yield put({
									type: 'updateState',
									payload: {
										xyAais: [],
										option1: []
									},
								})
							}

						} else {
							message.error(data3.msg)
							yield put({
								type: 'updateState',
								payload: {
									xyAais: [],
									option1: []
								},
							})
						}
					} else {
						message.error(data3.detail)
						yield put({
							type: 'updateState',
							payload: {
								xyAais: [],
								option1: []
							},
						})
					}


				}
			} else {
				message.error(data.detail)
			}
		},

		* Perfdata({ payload }, { select, call, put }) { //查询数据
			/*
				payload:
					promApiReq
					tool
					selectValue
					statrtime
					endtime
			*/
			let newPayload = {
				promApiReq: payload.promApiReq,
				tool: payload.tool
			};

			if (payload.selectValue !== '1') {

				newPayload.promApiReq.end = moment(moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DD HH:mm:ss')).unix()
				newPayload.promApiReq.start = moment(moment(Date.parse(new Date()) / 1000 - payload.selectValue, 'X').utc(8).format('YYYY-MM-DD HH:mm:ss')).unix()
			} else {
				newPayload.promApiReq.end = payload.endtime
				newPayload.promApiReq.start = payload.statrtime
			}

			const data = yield call(Perfdata, newPayload)  //与后台交互，获取数据
			let yAais = []
			let xyAais = []
			if (data.success) {
				if (data.code == 0) {
					if (data.data.result && data.data.result.length > 0) {
						let legend = [], option1 = [], xyAais = []
						data.data.result.forEach((item, index) => {
							if (index === 0) {
								item.values.forEach((time, index) => {
									xyAais.push(new Date(time[0] * 1000).getHours() + ':' + (new Date(time[0] * 1000).getMinutes() < 10 ? '0' + new Date(time[0] * 1000).getMinutes() : new Date(time[0] * 1000).getMinutes()))
								})
							}
							let source = []
							let legendString = JSON.stringify(item.metric)
							legend.push(legendString)//放图例信息
							item.values.forEach((info, index) => {
								source.push(info[1])
							})
							option1.push({
								name: legendString,
								type: 'line',
								showAllSymbol: true,
								symbol: 'rect',
								symbolSize: 3,
								data: source
							})
						})
						yield put({
							type: 'updateState',
							payload: {
								xyAais: xyAais,
								yAais: [],
								legend: legend,
								option1: option1
							},
						})
					} else {
						yield put({
							type: 'updateState',
							payload: {
								xyAais: [],
								option1: []
							},
						})
					}

				} else {
					message.error(data.msg)
					yield put({
						type: 'updateState',
						payload: {
							xyAais: [],
							option1: []
						},
					})
				}

			} else {
				message.error(data.detail)
				yield put({
					type: 'updateState',
					payload: {
						xyAais: [],
						option1: []
					},
				})
			}

		},
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
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
		//浏览列表
		querySuccessMos(state, action) {
			const { mosList, paginationPolicy } = action.payload
			return { //修改
				...state,
				mosList,
				paginationPolicy: {
					...state.paginationPolicy,
					...paginationPolicy,
				},
			}
		},
		//浏览列表
		querySuccessPolicy(state, action) {
			const { policyList, paginationPolicy } = action.payload
			return { //修改
				...state,
				policyList,
				paginationPolicy: {
					...state.paginationPolicy,
					...paginationPolicy,
				},
			}
		},
		querySuccess1(state, action) {
			const { stdList, pagination1 } = action.payload
			return {
				...state,
				stdList,
				pagination1: {
					...state.pagination1,
					...pagination1,
				},
			}
		},
		//这里控制弹出窗口显示
		showModal(state, action) {
			return { ...state, ...action.payload }
		},
		//这里控制弹出窗口隐藏
		hideModal(state, action) {
			return { ...state, ...action.payload }
		},

		showCheckStatus(state, action) {
			return { ...state, ...action.payload }
		},

		switchBatchDelete(state, action) {
			return { ...state, ...action.payload }
		},

		updateTabs(state, action) {
			return { ...state, ...action.payload }
		},
		updateState(state, action) {
			return { ...state, ...action.payload }
		},
		controllerModalPlus(state, action) {
			let objectArray = typeof (state.advancedItem.exprForFrontend) !== 'undefined' && state.advancedItem.exprForFrontend != '' ? JSON.parse(state.advancedItem.exprForFrontend) : []
			objectArray.push(action.payload.exprForFrontend)
			let stringArray = JSON.stringify(objectArray)
			let exprstr = ''
			if (objectArray && objectArray.length > 0) {
				objectArray.forEach((bean) => {
					let uuidstr = bean.uuid
					if (uuidstr && uuidstr.includes('_')) {
						let arrs = uuidstr.split('_')
						if (arrs && arrs.length > 0) {
							exprstr += arrs[0]
						}
					}
				})
			}
			//给actioin里的currentItem赋值state里的currentItem
			action.payload.advancedItem = state.advancedItem
			action.payload.advancedItem.exprForFrontend = stringArray
			action.payload.advancedItem.expr = exprstr

			return { ...state, ...action.payload }
		},
	},

}
