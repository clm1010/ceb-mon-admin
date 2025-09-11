import { updateMonitorInstance, query, create, remove, update, check, queryTemplets, queryRuleById, queryMonitorInstanceById, calc, issue, CopyTo, MoveTo, status ,onDown} from '../../../services/policyRule'
import { queryTime, stdquery } from '../../../services/policyTemplet'
import { queryobInfo } from '../../../services/policyInstance'
import { query as lablequery } from '../../../services/label'
import { queryDCSlevel, DCSIssue} from '../../../services/ruleInstance'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import NProgress from 'nprogress'
import queryString from "query-string";
import {ozr} from '../../../utils/clientSetting'
message.config({ top: 200, duration: 2 })
/**
* 监控配置/策略规则管理 
* @namespace policyRule
* @requires module:监控配置/策略规则
*/
export default {

	namespace: 'policyRule',

	state: {
		calculateState: false,
		issueState: false,
		list: [],																				//定义了当前页表格数据集合
		currentItem: {},																//被选中的单个行对象
		modalVisible: false,														//新增编辑弹出窗口是否可见
		modalVisibleKey: '',
		branchVisible: false,
		//新增选择树--start
		groundUUID: [], 										//策略规则分组树
		copyOrMoveModal: false,
		copyOrMoveModalType: 'copy',
		//end
		tempVisible: false,														//选择指标弹出窗口是否可见
		modalType: 'create',														//弹出窗口的类型
		pagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					//用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		pagination1: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					//用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		templets: [], //选择模板页面列表
		checkStatus: 'done',
		isClose: false,
		batchDelete: false,
		choosedRows: [],
		filterSchema: [],								//查询配置文件，自动加载生成查询界面
		objectVisible: false,		//对象过滤页面
		alarmFilterInfo: {},
		alarmFilterOldInfo: {},


		//规则计算页面-----start
		tempList: [
			{
				index: 1,
				tempid: '',
				tempname: '',
				tool: '',
			},
		],
		selectIndex: -1,
		tempid: '',
		tempname: '',
		tempgroupUUID: '',
		calculateVisible: false,
		//正常的
		dataSource1: [],
		//重复监控的策略
		dataSource2: [],
		//不存在监控工具实例
		dataSource3: [],
		//不存在指标实现
		dataSource4: [],
		dataOldSource4: [],
		//同一个监控对象多个指标实现
		dataSource5: [],
		//不支持的监控对象
		dataSource6: [],
		//规则计算是否重算标识
		isCalc: false,
		criteria: '',
		//规则计算页面-----end

		//监控实例页面---------start
		//新增策略模板-操作详情部分功能代码----start
		fileType: 'policyRule',
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
		selectObjectVisible: false,		//对象过滤页面
		obgroupUUID: '',
		groupUUID: [],
		obInfoVal: {},
		//监控实例页面---------end
		checkAll: false,
		checkedList: [],
		indeterminate: true,
		fenhangArr: [],			//下发中分行数组集合
		serachVal: '',	//策略模板选择区查询条件值
		keys: '',
		pageChange: '',
		q: '',
		heightSet: {
			height: '805px',
			overflow: 'hidden',
		},	// 设置高度使用
		see: 'no',
		expand: true,
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
		typeValue: 'ORDINARY',
		labelVisible: false,
		lablelist: [],
		lablepagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					//用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		lableInfoVal:[],
		element:{},
		lableInfoVal1:[],
		element1:{},
		either:false,
		labelgroupUUID:[],
		selectItemObj:[],
		ArrNodes:[],
		treeData: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				//    		if (location.pathname === '/policy/rules') {
				const query = queryString.parse(location.search);
				if (location.pathname.includes('/policyRuleGroup/policyRule')) {
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
	     * 查询数据
	     * 与后台交互 调用后台接口  /api/v1/monitor-rules/ , /api/v1/time-periods/
	     * @function  policyRule.query
	     */
		* query({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ policyRule }) => policyRule.groupUUID)
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			}

			const newdata = { ...payload, groupUUID }
			const data = yield call(query, newdata)
			if (data.success) {
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
		},
		/**
	 * 根据uuid查询监控实例
	 * 与后台交互 调用后台接口  /api/v1/rule-instances/
	 * @function  policyRule.queryMonitorInstanceById
	 */
		* queryMonitorInstanceById({ payload }, { call, put }) {
			const data = yield call(queryMonitorInstanceById, payload)
			let item = {}

			let tabstate = {}
			let panes = []
			if (data.instance.policy.monitorParams == undefined || data.instance.policy.monitorParams.ops == undefined) {
				tabstate = {
					activeKey: 'n1',
					panes: [
						{
							title: '新操作1',
							key: 'n1',
							content: {
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
							},
						},
					],
					newTabIndex: 1,
				}
			} else {
				let newTabIndex = 0,
					pane
				for (let operation of data.instance.policy.monitorParams.ops) {
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
				item.createdTime = new Date(text).toLocaleDateString()
			}
			if (data.instance.updatedTime !== 0) {
				let text = data.instance.updatedTime
				item.updatedTime = new Date(text).toLocaleDateString()
			}
			item.tool = data.instance.toolInst.toolType
			let stdInfoVal = {}
			if (data.instance.policy.monitorParams !== undefined && data.instance.policy.monitorParams.indicator !== undefined) {
				stdInfoVal = data.instance.policy.monitorParams.indicator
			}
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
			item.issueStatus = data.instance.issueStatus
			item.policyType = data.instance.policy.policyType
			item.monitorParams = data.instance.policy.monitorParams
			item.uuid = data.instance.uuid
			//policy
			item.policyuuid = data.instance.policy.uuid
			item.createdFrom = data.instance.policy.createdFrom
			item.isStd = data.instance.policy.isStd
			item.group = data.instance.policy.group
			item.policyname = data.instance.policy.name
			yield put({
				type: 'updateState',
				payload: {
					tabstate,
					typeValue,
					monitorInstanceVisible: true,
					MonitorInstanceItem: item,
					timeList,
					stdInfoVal,
					obInfoVal,
				},
			})
		},
		/**
	     * 指标查询
	     * 与后台交互 调用后台接口  /api/v1/std-indicators/
	     * @function  policyRule.queryMonitorInstanceById
	     */
		* querystdInfo({ payload }, { select, call, put }) { //查询数据
			const newdata = { ...payload }
			const data = yield call(stdquery, newdata) //与后台交互，获取数据
			if (data) {
				yield put({
					type: 'querySuccess2',
					payload: {
						stdList: data.content,
						pagination2: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},
		/**
	     * 根据uuid查询策略规则
	     * 与后台交互 调用后台接口  /api/v1/monitor-rules/
	     * @function  policyRule.queryRuleById
	     */
		* queryRuleById({ payload }, { call, put }) {
			const data = yield call(queryRuleById, payload)
			if (data) {
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

				yield put({
					type: 'updateState',
					payload: {
						currentItem: data,
						modalType: 'update',
						modalVisible: true,
						tempList,
						alarmFilterInfo: { ...moobj },
						alarmFilterOldInfo: { ...moobj },
						modalVisibleKey: `${new Date().getTime()}`,
						isCalc: true,
					},
				})
			}
		},
		//监控对象
		* queryobInfo({ payload }, { select, call, put }) { //查询数据
			const newdata = { ...payload }
			const data = yield call(queryobInfo, newdata) //与后台交互，获取数据
			if (data) {
				yield put({
					type: 'querySuccess3',
					payload: {
						obList: data.content,
						pagination3: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},
		/**
         * 查询策略
         * 与后台交互 调用后台接口  /api/v1/policy-templates/
         * @function  policyRule.queryTemplets
         */
		* queryTemplets({ payload }, { select, call, put }) {
			const q = yield select(({ policyRule }) => policyRule.serachVal)
			if (q !== '') {
				payload.q = q
			}
			const data1 = yield call(queryTemplets, payload)

			if (data1) {
				yield put({
					type: 'querySuccess1',
					payload: {
						templets: data1.content,
						pagination1: {
							current: data1.page.number + 1 || 1,
							pageSize: data1.page.pageSize || 10,
							total: data1.page.totalElements,
						},
					},
				})
			}
		},
		/**
	     * 计算分行
	     * 与后台交互 调用后台接口  /api/v1/monitor-rules/
	     * @function  policyRule.queryTemplets
	     */
		* calc({ payload }, { call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading(ozr('calcAlert'), 0)
			let newdata = { ...payload }
			let criterias = newdata.criteria
			const data = yield call(calc, payload)
			if (data.success) {
				message.destroy()
				NProgress.done()//异步加载动画结束
				let data2 = data.duplicated
				let data3 = data.noTools
				let data4 = data.notImplementedKpis
				let data5 = data.multiImplementedKpis
				let data6 = data.notSupported
				let dataSource2 = []
				let dataSource3 = []
				let dataSource4 = []
				let dataSource5 = []
				let dataSource6 = []
				//data2------start
				let arrs = [data.duplicated, data.noTools, data.notImplementedKpis, data.multiImplementedKpis]
				arrs.forEach((bean, allindex) => {
					if (bean !== undefined && bean !== {}) {
						let countuuid = 100000000 * (allindex + 1)
						for (let [key, mos] of Object.entries(bean)) {
							//      		  		var num=Math.random();
							let type = ''
							if (mos[0].rule && mos[0].rule.uuid) {
								type = 'rule'
							} else {
								type = ''
							}
							let data22 = {
								uuid: countuuid,
								ruleuuid: (mos[0].rule ? mos[0].rule.uuid : ''),
								monitoruuid: (mos[0].ruleInst ? mos[0].ruleInst.uuid : ''),
								mo: (mos[0].mo ? mos[0].mo.name : ''),
								kpi: (mos[0].policy && mos[0].policy.monitorParams && mos[0].policy.monitorParams.indicator ? mos[0].policy.monitorParams.indicator.name : ''),
								tool: mos[0].tool,
								type,
								tname: (mos[0].policy.isStd ? mos[0].policy.template.name : mos[0].policy.name),
								rname: (mos[0].policy.isStd ? mos[0].rule.name : mos[0].ruleInst.name),
								createdFrom: mos[0].policy.createdFrom,
								standard: mos[0].policy.isStd,
								children: [],
							}
							let children = []
							if (mos.length === 1) {
								//dataSource3.push(data0);
							} else {
								for (let index = 0; index < mos.length; index++) {
									countuuid += 1
									if (index === 0) {
										continue
									}
									//								var num1=Math.random();
									let type1 = ''
									if (mos[index].rule && mos[index].rule.uuid) {
										type1 = 'rule'
									} else {
										type1 = ''
									}
									let data222 = {
										uuid: countuuid,
										ruleuuid: (mos[index].rule ? mos[index].rule.uuid : ''),
										monitoruuid: (mos[index].ruleInst ? mos[index].ruleInst.uuid : ''),
										mo: (mos[index].mo ? mos[index].mo.name : ''),
										kpi: (mos[index].policy && mos[index].policy.monitorParams && mos[index].policy.monitorParams.indicator ? mos[index].policy.monitorParams.indicator.name : ''),
										tool: mos[index].tool,
										type: type1,
										tname: (mos[index].policy.isStd ? mos[index].policy.template.name : mos[index].policy.name),
										rname: (mos[index].policy.isStd ? mos[index].rule.name : mos[index].ruleInst.name),
										createdFrom: mos[index].policy.createdFrom,
										standard: mos[index].policy.isStd,
									}
									children.push(data222)
								}
							}
							data22.children = children
							if (data22.children.length === 0) {
								data22.children = undefined
							}
							if (allindex === 0) {
								dataSource2.push(data22)
							} else if (allindex === 1) {
								dataSource3.push(data22)
							} else if (allindex === 2) {
								dataSource4.push(data22)
							} else if (allindex === 3) {
								dataSource5.push(data22)
							} else if (allindex === 4) {
								dataSource6.push(data22)
							}
							countuuid += 1
						}
					}
				})
				yield put({
					type: 'updateState',
					payload: {
						dataSource2,
						dataSource3,
						dataSource4,
						dataOldSource4: dataSource4,
						dataSource5,
						dataSource6,
						criteria: criterias,
						calculateVisible: true,
						branchVisible: false,
						calculateState: false,
					},
				})
			} else {
				message.destroy()
				NProgress.done()//异步加载动画结束
				yield put({
					type: 'updateState',
					payload: {
						calculateState: false,
					},
				})
				throw data
			}
		},
		/**
	 * 查询不存在指标实现的mo名称
	 * @function  policyRule.queryCalcName
	 */
		//查询不存在指标实现的mo名称
		* queryCalcName({ payload }, { select, call, put }) {
			const dataOldSources = yield select(({ policyRule }) => policyRule.dataOldSource4)
			let dataSources = payload.dataSource4
			if (dataSources.length !== dataOldSources.length) {
				dataSources = dataOldSources
			}
			let moName = payload.name
			let newDataSource = []
			dataSources.forEach((item) => {
				if (payload.name.length !== 0) {
					let list = item.mo
					if (list.indexOf(moName) >= 0) {
						newDataSource.push(item)
					}
				} else {
					newDataSource.push(item)
				}
			})

			yield put({
				type: 'updateState',
				payload: {
					dataSource4: newDataSource,
				},
			})
		},
		//end
		/**
 * 批量移动
 * 与后台交互 调用后台接口  /api/v1/monitor-rules/
 * @function  policyRule.move
 */
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

		/**
         * 批量复制
         * 与后台交互 调用后台接口  /api/v1/monitor-rules/
         * @function  policyRule.copy
         */
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
		/**
         * 新增资源
         * 与后台交互 调用后台接口  /api/v1/monitor-rules/
         * @function  policyRule.create
         */
		* create({ payload }, { call, put }) {
			yield put({
				type: 'hideModal',
				payload: {
					modalVisible: false,
					isClose: true,
				},
			  })
			console.log(payload)
      		const data = yield call(create, payload)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
						modalVisible: false,
						typeValue:'',
						lableInfoVal:[],
						lableInfoVal1:[],
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* requery({ payload }, { put }) {
			yield put(routerRedux.push({
				pathname: window.location.pathname,
				query: parse(window.location.search.substr(1)),
			}))
		},
		/**
         * 删除数据
         * 与后台交互 调用后台接口  /api/v1/monitor-rules/
         * @function  policyRule.delete
         */
		* delete({ payload }, { call, put }) {
			const data = yield call(remove, payload)
			if (data.success) {
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		/**
         * 编辑监控实例
         * 与后台交互 调用后台接口  /api/v1/rule-instances/
         * @function  policyRule.updateMonitorInstance
         */
		* updateMonitorInstance({ payload }, { select, call, put }) {
			const id = yield select(({ policyRule }) => policyRule.MonitorInstanceItem.uuid)
			const newData = { ...payload, id }
			const data = yield call(updateMonitorInstance, newData)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						monitorInstanceVisible: false,
					},
				})
				yield put({ type: 'calc' })
			} else {
				throw data
			}
		},
		/**
	     * 编辑
	     * 与后台交互 调用后台接口  /api/v1/rule-instances/
	     * @function  policyRule.update
	     */
		* update({ payload }, { select, call, put }) {
			const id = yield select(({ policyRule }) => policyRule.currentItem.uuid)
			const newTool = { ...payload, id }
			const data = yield call(update, newTool)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						modalVisible: false,
						isClose: true,
						typeValue:'',
						lableInfoVal:[],
						lableInfoVal1:[],
					},
				})
				const myisCalc = yield select(({ policyRule }) => policyRule.isCalc)
				if (myisCalc) {
					yield put({ type: 'calc' })
				}
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/**
	     * 下发
	     * 与后台交互 调用后台接口  /api/v1/rule-instances/
	     * @function  policyRule.issue
	     */
		* issue({ payload }, { call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading('正在下发,请稍后...', 0)
			const data = yield call(issue, payload)
			if (data && data.success) {
				message.destroy()
				NProgress.done()//异步加载动画结束
				message.success('下发完成！')
				yield put({
					type: 'updateState',
					payload: {
						calculateVisible: false,
						isCalc: false,
						issueState: false,
					},
				})
				yield put({ type: 'requery' })
			} else {
				message.destroy()
				NProgress.done()//异步加载动画结束
				yield put({
					type: 'updateState',
					payload: {
						issueState: false,
					},
				})
				throw data
			}
		},

		/**
		 * 下发状态查询
		 * 与后台交互 调用后台接口  /api/v1/rule-instances/
		 * @function  policyRule.status
		 */
		* status({ payload }, { call, put }) {
			const data = yield call(status, payload)
			if (!data.success) {
				//message.warning('计算需涉及下发数据,当前用户无下发权限。允许此次计算！')
			} else if (data && data.success) {
				let fenhangArr = []
				if (data.issueStatus && data.issueStatus.length !== 0) {
					data.issueStatus.forEach((item) => {
						if (item.running) {
							fenhangArr.push(item.branch)
						}
					})
				}
				yield put({
					type: 'updateState',
					payload: {
						fenhangArr,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		/**
	     *分页查询
	     * 与后台交互 调用后台接口  /api/v1/rule-instances/
	     * @function  policyRule.findById
	     */
		* findById({ payload }, { call, put }) {
			const data = yield call(queryRuleById, payload.record)
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
			let lableInfoVal = [], lableInfoVal1 = [], ArrNodes=[]
			if(data.tags != undefined && data.tags.length !== 0 ){
				yield put({ type: 'queryDCSlevel' })
				data.tags.forEach((item)=>{
					if(item.key.includes('ump_env') || item.key.includes('ump_tool') ){
						lableInfoVal1.push(item)
						ArrNodes.push(item.uuid)
					}else{
						lableInfoVal.push(item)
					}
				})
			}
			yield put({
				type: 'updateState',
				payload: {
					modalType: 'update',
					currentItem: { ...data },
					modalVisible: true,
					tempList,
					alarmFilterInfo: { ...moobj },
					alarmFilterOldInfo: { ...moobj },
					isCalc: false,
					modalVisibleKey: `${new Date().getTime()}`,
					typeValue:data.ruleType,
					lableInfoVal:lableInfoVal,
					lableInfoVal1:lableInfoVal1,
					ArrNodes:ArrNodes
				},
			})
		},
		/**
		 * 导出
		 * 与后台交互 调用后台接口  /api/v3/monitor-rules/
		 * @function policyRule.onDown
		 */
		*onDown({ payload }, { call, put }) {
			const data = yield call(onDown, payload)
		},

		*lablequery({ payload }, { select, call, put }) {
			const data = yield call(lablequery, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						lablelist: data.content,
						lablepagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
						},
					},
				})
			}
		}, //query
		//查询分布式类型
		*queryDCSlevel({ payload }, { call, put }) {
			const data = yield call(queryDCSlevel, payload)
			if(data.success){
				yield put ({
					type:'updateState',
					payload:{
						treeData:data.children
					}
				})
			} else {
				message.error(data.msg)
			}
		},

		*DCSIssue({ payload }, { call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading('正在下发,请稍后...', 0)
			const data = yield call(DCSIssue, payload)
			if(data.success){
				message.destroy()
				NProgress.done()//异步加载动画结束
				message.success('增量下发完成！')
			} else {
				message.destroy()
				NProgress.done()//异步加载动画结束
				message.error(data.msg)
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
		querySuccess1(state, action) {
			const { templets, pagination1 } = action.payload
			return {
				...state,
				templets,
				pagination1: {
					...state.pagination1,
					...pagination1,
				},
			}
		},
		querySuccess2(state, action) {
			const { stdList, pagination2 } = action.payload
			return {
				...state,
				stdList,
				pagination2: {
					...state.pagination2,
					...pagination2,
				},
			}
		},
		querySuccess3(state, action) {
			const { obList, pagination3 } = action.payload
			return {
				...state,
				obList,
				pagination3: {
					...state.pagination3,
					...pagination3,
				},
			}
		},
		updateState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
