//import { issue } from '../services/notNetDown'
import { findById } from '../services/objectMO'
import { queryRuleById } from '../services/policyRule'
import { getToolById } from '../services/tools'
import { findById as queryTempById,queryTime, stdquery } from '../services/policyTemplet'
import { query,issueMo,queryState, queryManual, queryMonitorInstanceById  ,remove,updateMonitorInstance} from '../services/ruleInstance'
import NProgress from 'nprogress'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
export default {
	namespace: 'notNetDown',

	state: {
		q: '',																					//URL串上的q=查询条件
		modalMOVisible: false, //监控对象弹出窗口
		modalToolVisible: false, // 工具实例弹出窗口
		modalRuleVisible: false, // 策略规则弹出窗口
		modalTempVisible: false, // 策略模板弹出窗口
		tabShowPage: 'notNetDown_1', //标准和非标准展示的页
	
		//监控实例页面---------start
		fileType: 'notNetDown',
		newOperationItem: {},
		operationVisible: false,
	 operationType: 'add',									//记录操作详情操作状态，add/edit
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
				   discard_innder: false,
				   discard_outer: false,
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
	 typeValue: '', //编辑页面--策略类型，根据选择值动态调整采集参数
	 timeList: [], //周期
	 monitorInstanceVisible: false,
	 MonitorInstanceItem: {
		 collectParams: {},
	 },
	 stdInfoVal: {},
	 monitorInstanceType: 'create',
		 //选择指标
	 kpiVisible: false,
	 stdList: [],
	 //选择指标的分页
	 pagination2: {
		   showSizeChanger: true,
		   showQuickJumper: true,
		   showTotal: total => `共 ${total} 条`,
		  current: 1,
		   total: null,
		   pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	 },
	 //选择对象的分页
	 pagination3: {
		   showSizeChanger: true,
		   showQuickJumper: true,
		   showTotal: total => `共 ${total} 条`,
		   current: 1,
		   total: null,
		   pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	 },

	 queryInfsrulenewdata: {},
	 obgroupUUID: '',
	 groupUUID: '',
	 groupUUIDs: [],
	 selectObjectVisible: false,		//对象过滤页面
	 obInfoVal: {},
	 //选择对象页面-------end

	 //新增 OR 编辑页面的key
	 ruleInstancecreateOrUpdateKEY: '',
		list: [],
		list2: [], //非标准的
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
		//非标准的分页
		paginationMan: {
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
	  batchDeletes: false,
	  choosedRows: [],
	  choosedRowslist: [],
	  filterSchema: [],			//查询配置文件，自动加载生成查询界面

	  openRuleType: '', //打开弹出框，显示那个tabs 页
	  ruleUUID: '', //选中的网元-交换机 的uuid
	  ruleInfsList: [], //获取网元的接口信息
	  ruleInfsNumber: 0, //获取网元的接口数量
	  ruleInfsVisible: false, //接口数弹出框
	  paginationInfs: {								//分页对象
		  showSizeChanger: true,						//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,			//用于显示数据总量
			current: 1,									//当前页数
			total: null,									//数据总数？
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
		see: 'no',
		batchDelete: false,					//批量删除按钮状态，默认禁用
		choosedRows: [],					//表格中勾选的对象，准备批量操作
		oper:0,                               //重启nagios
		onIssueForbid:false,
		advancedItem:{},
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
					dispatch({
        				type: 'queryManual',
        				payload: query,
      				})
				}
			})
		},
	},

	effects: {

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
		* queryManual ({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ notNetDown }) => notNetDown.groupUUIDs)
	       	let groupUUID = ''
	       	if (groupuuids && groupuuids.length > 0) {
		    	groupUUID = groupuuids[0]
	       	}

	       	const newdata = { ...payload, groupUUID }
      		const data = yield call(queryManual, newdata)
      		if (data.success) {
        		yield put({
          			type: 'querySuccessMan',
          			payload: {
        				list2: data.content,
        				paginationMan: {
          					current: data.page.number + 1 || 1,
          					pageSize: data.page.pageSize || 10,
          					total: data.page.totalElements,
        				},
          			},
        		})
      		}
    	},
		* requery ({ payload }, { put }) {
			yield put(routerRedux.push({
			  pathname: window.location.pathname,
			  query: parse(window.location.search.substr(1)),
		  }))
		},
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
		* delete ({ payload }, { call, put }) {
			const data = yield call(remove, payload)
			if (data.success) {
			  yield put({ type: 'requery' })
			} else {
			  throw data
			}
	  },

	  * updateMonitorInstance ({ payload }, { select, call, put }) {
		const id = yield select(({ notNetDown }) => notNetDown.MonitorInstanceItem.uuid)
		const ruleInfsVisible = yield select(({ notNetDown }) => notNetDown.ruleInfsVisible)
		const newData = { ...payload, uuid: id }
		const data = yield call(updateMonitorInstance, newData)
		if (data.success) {
			yield put({
				type: 'updateState',
				payload: {
				  monitorInstanceVisible: false,
			  },
			})
		  yield put({ type: 'requery' })
		//   if (ruleInfsVisible) {
		// 	   yield put({ type: 'queryInfsrule' })
		//   }
		} else {
		  throw data
		}
  },
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

		* queryMonitorInstanceById ({ payload }, { call, put }) {
			const data = yield call(queryMonitorInstanceById, payload)
			let item = {}
			let tabstate = {}
		  let panes = []
		  if (data.instance.policy.alarmSettings == undefined) {
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
							discard_innder: false,
							discard_outer: false,
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
			  for (let operation of data.instance.policy.alarmSettings) {
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
							actionsuuid: operation.actions.uuid,
							aDiscardActionuuid: operation.actions.discardAction.uuid,
						  aGradingActionuuid: operation.actions.gradingAction.uuid,
						  aNamingActionuuid: operation.actions.namingAction.uuid,
							//conditionuuid: operation.condition.uuid,
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

		  if (data.instance.policy.collectParams === undefined) {
			  let collectParams = {
					collectInterval: '',
					timeout: '',
					retries: '',
					pktSize: '',
					pktNum: '',
					srcDeviceTimeout: '',
					srcDeviceRetries: '',
				  }
			  item.collectParams = collectParams
		  } else {
			  item.collectParams = data.instance.policy.collectParams
		  }
		  //对更新时间和创建时间处理一下
		  if (data.instance.createdTime !== 0) {
			  let text = data.instance.createdTime
			  item.createdTime = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		  }
		  if (data.instance.updatedTime !== 0) {
			  let text = data.instance.updatedTime
			  item.updatedTime = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		  }
		  item.tool = data.instance.toolInst.toolType

		  let obInfoVal = {}
		  if (data.instance.mo !== undefined) {
			  obInfoVal = data.instance.mo
		  }
		  let typeValue = data.instance.policy.policyType
		  const dataTime = yield call(queryTime)
		  let timeList = []
		  if (dataTime.content) {
			  dataTime.content.forEach((item0) => {
				  let time = {
					  key: item0.uuid,
					  value: item0.name,
				  }
				  timeList.push(time)
			  })
		  }
		  item.name = data.instance.name
		  item.createdBy = data.instance.createdBy
		  item.updatedBy = data.instance.updatedBy
		  item.policyType = data.instance.policy.policyType
		  item.monitorParams = data.instance.policy.monitorParams
		  item.uuid = data.instance.uuid
		  item.branch = data.instance.branch
		  //policy
		  item.policyuuid = data.instance.policy.uuid
		  item.createdFrom = data.instance.policy.createdFrom
		  item.isStd = data.instance.policy.isStd
		  item.group = data.instance.policy.group
		  item.issueStatus = data.instance.policy.issueStatus
		  item.policyname = data.instance.policy.name
		  item.templateuuid = (data.instance.policy.template ? data.instance.policy.template.uuid : '')
		  //策略应用类型
		  item.componentType = data.instance.policy.componentType
		  item.componentTypeID = data.instance.policy.componentTypeID
		  item.component = data.instance.policy.component
		  item.componentID = data.instance.policy.componentID
		  item.subComponent = data.instance.policy.subComponent
		  item.subComponentID = data.instance.policy.subComponentID
		  //rule
		  item.ruleUUID = (data.instance && data.instance.rule ? data.instance.rule.uuid : '')
			yield put({
				type: 'updateState',
				payload: {
				  tabstate,
				  typeValue,
				  monitorInstanceVisible: true,
				  MonitorInstanceItem: item,
				  timeList,
				  obInfoVal,
				  monitorInstanceType: 'update',
				  ruleInstancecreateOrUpdateKEY: `${new Date().getTime()}`,
			   },
		  })
	  },
		/*
			下发
		*/
		* issue ({ payload }, { call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading('正在下发,请稍后...', 0)
			const data = yield call(issueMo, payload)
			if (data && data.success) {
				NProgress.done()//异步加载动画结束
				message.destroy()
				message.success('操作完成，后台正在下发！')
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
			return { ...state, ...action.payload }
		},
		querySuccessMan (state, action) {
			const { list2, paginationMan } = action.payload
			return {
				...state,
			  list2,
			  paginationMan: {
					...state.paginationMan,
					...paginationMan,
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
		controllerModalPlus (state, action) {
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

