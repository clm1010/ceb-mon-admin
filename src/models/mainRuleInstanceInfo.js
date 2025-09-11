import React from 'react'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { Select, message,Modal } from 'antd'
import { query, create, remove, update, MoveTo, CopyTo, queryPorts, queryQita, queryApp, queryAppInCmdb, findById, saveReviewer, queryReviewer, queryData, myQuery, updReviewer, adjust, operateRecord,disable,onDown, patchDisable, queryClustersByApp, queryNamespacesByCluster} from '../services/mainRuleInstanceInfo'
import { query as indicatorsQuery } from '../services/stdIndicatorsInfo'
import { getLogToken, getaskID, gettaskState, getData } from '../services/tolc'
import { nesquery } from '../services/nes'
import { query as queryUser } from '../services/userinfo'
import { queryAllTypeOfMO } from '../services/objectMO'
import { peformanceCfg } from '../utils/performanceOelCfg'
import { ESFindIndex } from '../utils/FunctionTool'
import fenhang from '../utils/fenhang'
import queryString from "query-string"
import moment from 'moment'
const user = JSON.parse(sessionStorage.getItem('user'))
const Option = Select.Option

/**
 * 维护期管理/维护期设置
 * @namespace mainRuleInstanceInfo
 * @requires module:维护期管理/维护期设置
 */
export default {
	namespace: 'mainRuleInstanceInfo',

	state: {
		oldImportSource: [],
		oldVisible: false,
		buttonState: true,
		list: [],									//定义了当前页表格数据集合
		currentItem: {},							//被选中的行对象的集合
		modalVisible: false,						//弹出窗口是否可见
		modalVisibleCopyOrMove: false,				//第二个弹出窗口是否可见
		modalType: 'create',						//弹出窗口的类型
		itemType: '',
		pagination: {								//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			//pageSizeOptions: ['10','50','100','200','5000'],
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		isSynching: false,
		isClose: false,
		batchDelete: false,
		choosedRows: [],							//选择的行
		filterSchema: [],							//过滤条件
		groupUUID: [], //Item分组的信息

		resetCalInput: false,				//这是

		mtFilterKey: '', //过滤条件弹出框的key
		mtFilterExpand: false,
		isLevels: '0',						//是否高级搜索
		cycles: 'NON_PERIODIC',							//维护类型（周期、非周期）
		checkedWeek: [],						//维护时间选定天数
		timeType: 'BY_WEEK',						//维护期时间定义（按天，按周）
		isenabled: true,						//是否启用
		checked: [],
		tempList: [							//时间段数组
			{
				index: 1,
				tempid: '',
				end: [],
			},
		],
		tempDayList: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListMon: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListTue: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListWed: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListThu: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListFri: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListSat: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],
		tempWeekListSun: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
			},
		],

		listHost1: [],
		listHost2: [],
		selectHostuuid: '',
		host2portMap: new Map(), //选择的网络设备和端口关联关系
		listPort1: [],
		listPort2: [],
		listApp1: [],
		optionAppNameEditing: [],
		listApp2: [],
		listQita1: [],
		listQita2: [],
		listDistributed2: [],
		selectedKeysHost1: [],
		selectedKeysPort1: [],
		selectedKeysApp1: [],
		selectedKeysQita1: [],
		selectedKeysHost2: [],
		selectedKeysPort2: [],
		selectedKeysApp2: [],
		selectedKeysQita2: [],
		paginationHost: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		paginationPort: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		paginationApp: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		paginationQita: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
		},
		alarmType: 'BASIC',
		moFilterValue: {
			filterMode: 'ADVANCED',
		},
		Filters: {},							//模板管理实例化
		//查询分页----searchHost
		hostname: '',
		hostkeyword: '',
		//查询分页----searchPort
		portname: '',
		//查询分页----searchApp
		appName: '',
		bizDesc: '',
		//查询分页----searchQita
		nameQita: '',
		keywordQita: '',
		appQita: '',

		ruleInstanceKey: '',
		isExpert: false,														//是否是在专家模式界面点击+、-按钮的行为
		hostOtherValue: '',	//控制维护期告警定义高级模式提示
		appOtherValue: '',	//控制维护期告警定义高级模式提示
		gjtzOtherValue: '',	//控制维护期告警定义高级模式提示
		fetchingIP: false,
		fetchingApp: false,
		alertGroupValue: '',
		componentValue: [],
		alertLevel:[],
		AgentValue:'',
		targetGroupUUIDs: [],
		branchipOptions: [],					//网点
		options: [],							//网络域四霸
		serversOptions: [], //主机
		osOptions: [],							//操作系统
		dbOptions: [],							//数据库
		mwsOptions: [],							//中间件
		appOptions: [],							//应用
		keysTime: '',
		pageChange: 0,
		q: '',
		filterInfo: [],
		applicantInfo: '',
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
		expand: false,
		nameKey: 0,
		optionCluster: [],
		optionNamespace: [],
		optionIndicator: [],
		appNameAuto: [],
		appNameEditing: [],
		AdvancedFilterValue: '',
		AdvancedFilterAppNameValue: '',
		optionSelectAppName: [],
		timeOut: false,             //时间是否超过24小时的判断
		nameChange: '请再次确认',	//确认超过24小时的按钮名字
		timeValue: '',			//显示超24小时的具体时间长短
		startValue: 0,			//记录开始时间、及做判断
		endValue: 9999999999999, //记录结束时间、及做判断
		outTimeChange: false,		//当点击延时时，禁止编辑结束时间的判断
		showEndTime: 0,				//当选择延时时间后，要显示的结束时间
		nowDate: 0,				//服务器时间
		arrGroupValue: [],      //高级模式的组
		showGroupValue: {},		//显示的数据
		forbind: false,
		forbindQita: false,
		restrict: [],        //权限
		selectedReviewer: false, //选择授权人
		reviewers: [], //授权人
		activeKey: 'CREAATED_BY',
		activeKey1: '',
		transaStatus: false,
		batchStatus: false,
		showOperateRecord: false, // 显示操作记录信息
		operateRecordList: [], //操作记录数据
		seeOperate: true,  //操作记录查询状态
		recalculate: false, // 维护期重计算
		oploading:false, // 操作记录加载状态
		del_bath_visible:false,
		choosedRowsItem:[],
		appDistributed:'',
		clusterDistributed:[],
		namespaceDistributed:[],
		indicatorDistributed:[],
		appDistributedFlag: false,
		clusterDistributedFlag: false,
		namespaceDistributedFlag: false,
		indicatorDistributedFlag: false,
		checkedValue:[]
	},

	subscriptions: { //添加一个链接的监听
		setup({ dispatch, history }) {
			history.listen((location) => {
				let newdata = queryString.parse(location.search)
				if (location.pathname.includes('/mainRuleInstanceGroup/mainRuleInstanceInfo')) {
					if (Object.keys(newdata).length == 0) {
						newdata.q = '((overdue == false and enabled == true) or state == \'ACTIVE\');tpe==\'NON_PERIODIC\''
					}
					dispatch({
						type: 'query',
						payload: newdata,
					})
				}
				if (location.pathname == '/myMaintenan') {
					let pageType = 'CREAATED_BY'
					if (location.query && location.query.pageType) {
						pageType = location.query.pageType
					} else {
						dispatch({
							type: 'updateState',
							payload: {
								activeKey: 'CREAATED_BY',
								activeKey1: '',
							},
						})
					}
					dispatch({
						type: 'myQuery',
						payload: {
							...newdata,
							pageType: pageType
						},
					})
				}
			})
		},
	},

	effects: { //添加异步处理事件
		/** 
		 * 获取资源列表
		 * 与后台交互, 调用接口/api/v1/mts/，获取数据
		 * @function mainRuleInstanceInfo.query
		 * 
		 */
		* query({ payload }, { select, call, put }) { //查询数据
			const groupuuids = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.groupUUID)
			const user = JSON.parse(sessionStorage.getItem('user'))
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			}
			// else {
			// 	const arrs = location.pathname.split('/')
			// 	if (arrs && arrs.length > 0 && arrs[arrs.length - 1] != 'undefined' && arrs[arrs.length - 1] != '*') {
			// 		groupUUID = arrs[arrs.length - 1]
			// 	}
			// }
			let q = ''
			let sql = ''
			let branchInfo = []
			let branchValues = []
			if (user.roles) {
				if (user.roles[0].name === '超级管理员') {

				} else {
					//维护期新增的分行权限
					if (user.roles[0].permissions) {
						if (user.roles[0].permissions.length === 0) {
							q = ''
						} else if (user.roles[0].permissions.length > 0) {
							for (let roles of user.roles[0].permissions) {
								if (roles.resource === '/api/v1/mts') {
									if (roles.action === 'read' && roles.has) { //维护期实例新增的权利
										let infofh = []
										for (let item of roles.permissionFilter.filterItems) {
											if (item.field === 'branch' && item.op === '=') {
												infofh.push(item.value)//拿到分行的属性，需要去重
											}
										}
										//去重
										if (infofh.length === 0) {
											q = ''
										} else {
											for (let info of infofh) {
												if (branchValues.indexOf(info) === -1) {
													branchValues.push(info)
												}
											}
											for (let i = 0; i < branchValues.length; i++) {
												q = `${q}branch == ${branchValues[i]} or `
											}
											q = `(${q.substring(0, q.length - 3)});`
										}
									} else if (roles.action === 'create' && !roles.has) {
										q = ''
									}
								}
							}
						}
					}
				}
			}
			console.log('q : ', q)
			const newdata = { ...payload, groupUUID }
			newdata.q = (q === '' ? '' : q) + (payload.q === undefined ? '' : payload.q)
			if (payload.q === undefined || payload.q === '') {
				newdata.q = newdata.q.substring(0, q.length - 1)
			}
			const data = yield call(query, newdata) //与后台交互，获取数据
			if (data.success) {
				yield put({
					type: 'querySuccess',
					payload: {
						list: data.content,
						pagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
						groupUUID: [groupUUID],
						q: newdata.q,
						tempList: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempDayList: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListMon: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListTue: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListWed: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListThu: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListFri: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListSat: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListSun: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
					},
				})
			} else {
				message.error(data.msg)
				yield put({
					type: 'querySuccess',
					payload: {
						list: [],
						pagination: {
							current: '',
							pageSize: '',
							total: '',
						},
					},
				})
			}
		},
		* myQuery({ payload }, { select, call, put }) { //查询数据
			const user = JSON.parse(sessionStorage.getItem('user'))
			let q = ''
			let branchValues = []
			if (user.roles) {
				if (user.roles[0].name === '超级管理员') {

				} else {
					//维护期新增的分行权限
					if (user.roles[0].permissions) {
						if (user.roles[0].permissions.length === 0) {
							q = ''
						} else if (user.roles[0].permissions.length > 0) {
							for (let roles of user.roles[0].permissions) {
								if (roles.resource === '/api/v1/mts') {
									if (roles.action === 'read' && roles.has) { //维护期实例新增的权利
										let infofh = []
										for (let item of roles.permissionFilter.filterItems) {
											if (item.field === 'branch' && item.op === '=') {
												infofh.push(item.value)//拿到分行的属性，需要去重
											}
										}
										//去重
										if (infofh.length === 0) {
											q = ''
										} else {
											for (let info of infofh) {
												if (branchValues.indexOf(info) === -1) {
													branchValues.push(info)
												}
											}
											for (let i = 0; i < branchValues.length; i++) {
												q = `${q}branch == ${branchValues[i]} or `
											}
											q = `(${q.substring(0, q.length - 3)});`
										}
									} else if (roles.action === 'create' && !roles.has) {
										q = ''
									}
								}
							}
						}
					}
				}
			}
			const newdata = { ...payload }
			newdata.q = (q === '' ? '' : q) + (payload.q === undefined ? '' : payload.q)
			if (payload.q === undefined || payload.q === '') {
				newdata.q = newdata.q.substring(0, q.length - 1)
			}
			const data = yield call(myQuery, newdata) //与后台交互，获取数据
			if (data.success) {
				yield put({
					type: 'querySuccess',
					payload: {
						list: data.content,
						pagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
						q: newdata.q,
						tempList: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempDayList: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListMon: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListTue: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListWed: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListThu: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListFri: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListSat: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
						tempWeekListSun: [{
							index: 1, tempid: '', begin: '', end: '',
						}],
					},
				})
			}
		},

		/** 
		 * 新增资源
		 * 与后台交互, 调用接口/api/v1/mts/，获取数据
		 * @function mainRuleInstanceInfo.create
		 * 
		 */
		* create({ payload }, { select, call, put }) {
			const newdata = { ...payload }
			const user = yield select(({ app }) => app.user)
			const data = yield call(create, payload)
			if (user.branch !== undefined) {
				let moveDate = {}
				moveDate.targetGroupUUIDs = [newdata.groupUUIDs]
				moveDate.targetUUIDs = [data.uuid]
				const dataGroup = yield call(MoveTo, moveDate)
			}
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisible: false,
						isClose: true,
						stdInfoVal: {},
						targetGroupUUIDs: [],
						arrGroupValue: [],
						showGroupValue: {},
						appDistributed: '',
						clusterDistributed: [],
						namespaceDistributed: [],
						indicatorDistributed: [],
						appDistributedFlag: false,
						clusterDistributedFlag: false,
						namespaceDistributedFlag: false,
						indicatorDistributedFlag: false,
						optionCluster: [],
						optionNamespace: [],
						optionIndicator: [],
						optionAppNameEditing: [],

					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
		 * 移动到分组
		 * 与后台交互, 调用接口/api/v1/mts/groups/move-to，获取数据
		 * @function mainRuleInstanceInfo.move
		 * 
		 */
		* move({ payload }, { call, put }) {
			const data = yield call(MoveTo, payload)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisibleCopyOrMove: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
		 * 复制到分组
		 * 与后台交互, 调用接口/api/v1/mts/groups/copy-to，获取数据
		 * @function mainRuleInstanceInfo.copy
		 * 
		 */
		* copy({ payload }, { call, put }) {
			const data = yield call(CopyTo, payload)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisibleCopyOrMove: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
		 * 查询数据
		 * 刷新页面
		 * @function mainRuleInstanceInfo.requery
		 */
		* requery({ payload }, { put, select }) {
			const activeKey1 = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.activeKey1)
			let pageItem = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.pagination)
			// let q = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.q)
			const q = parse(window.location.search.substr(1)).q
			const query = {
				q: q,
				page: pageItem.current - 1,
				pageSize: pageItem.pageSize,
				pageType: activeKey1
			}
			const stringified = queryString.stringify(query)
			yield put(routerRedux.push({
				pathname: window.location.pathname,
				query: query,
				search: stringified,
			}))
		},

		/** 
		 * 删除资源
		 * 与后台交互, 调用接口/api/v1/mts/{id}
		 * @function mainRuleInstanceInfo.delete
		 * 
		 */
		* delete({ payload }, { call, put }) {
			const data = yield call(remove, { payload })
			if (data.success) {
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
		 * 更新资源
		 * 与后台交互, 调用接口/api/v1/mts/{id}
		 * @function mainRuleInstanceInfo.update
		 * 
		 */
		* update({ payload }, { select, call, put }) {
			const uuid = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.currentItem.uuid)
			const newdata = { ...payload, uuid }
			const data = yield call(update, newdata)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisible: false,
						isClose: true,
						stdInfoVal: {},
						targetGroupUUIDs: [],
						arrGroupValue: [],
						showGroupValue: {},
						appDistributed: '',
						clusterDistributed: [],
						namespaceDistributed: [],
						indicatorDistributed: [],
						appDistributedFlag: false,
						clusterDistributedFlag: false,
						namespaceDistributedFlag: false,
						indicatorDistributedFlag: false,
						optionCluster: [],
						optionNamespace: [],
						optionIndicator: [],
						optionAppNameEditing: [],
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
		 * 获取非网络监控资源列表
		 * 与后台交互, 调用接口/api/v1/rule-instances/，获取数据
		 * @function mainRuleInstanceInfo.query
		 * 
		 */
		* queryNetwork({ payload }, { select, call, put }) {
			const user = yield select(({ app }) => app.user)
			let branch = user.branch
			let newdatas = { ...payload }
			let q = ''

			q = "firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5' or secondClass=='NM') "

			const newdata = { ...payload }
			newdata.q = q
			newdata.sort = 'discoveryIP,asc'
			/*if (payload.q && payload.q !== '') {
				newdata.q += payload.q
			}*/
			let qs = newdata.q
			let hostname = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.hostname)
			let hostkeyword = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.hostkeyword)
			if (hostkeyword === '') {
				hostkeyword = newdatas.hostkeyword
			}
			if (hostname && hostname !== '') {
				qs = `${qs} and name=='*${hostname}*'`
			}
			if (hostkeyword && hostkeyword !== '') {
				qs = `${qs} and (discoveryIP=='*${hostkeyword}*' or name == '*${hostkeyword}*')`
			}
			if (newdata.hostkeyword !== undefined) {
				delete newdata.hostkeyword
			}
			newdata.q = qs
			const data = yield call(nesquery, newdata)
			if (data.success) {
				yield put({
					type: 'querySuccessHost',
					payload: {
						listHost1: data.content,
						paginationHost: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
						fetchingIP: false,
					},
				})
			}
		}, //queryNetwork
		/** 
		 * 获取All维护期集合
		 * 与后台交互, 调用接口/api/v1/mts/all
		 * @function mainRuleInstanceInfo.queryAllTypeOfMO
		 * 
		 */
		* queryAllTypeOfMO({ payload }, { call, put }) {
			if (payload.searchMethod === "1") {
				payload.q = `( discoveryIP=='${payload.inputInfo}' or name == '${payload.inputInfo}')`
			} else {
				payload.q = `( discoveryIP=='*${payload.inputInfo}*' or name == '*${payload.inputInfo}*')`
			}
			
			const data = yield call(queryAllTypeOfMO, payload)
			if (data.success && data.content.length > 0) {
				// 增加精确查询
				let payload1 = Object.assign({},payload)
				payload1.q = `( discoveryIP=='${payload.inputInfo}' or name == '${payload.inputInfo}');level==true`
				const data1 = yield call(queryAllTypeOfMO, payload1)
				let filterData = data.content
				if(data1.content.length > 0 ){
					filterData = data.content.filter(item=> item.discoveryIP != data1.content[0].discoveryIP)
				}
				let tempArr = []
				let newOption = []
				let options = [...data1.content,...filterData]
				options.forEach((item, index) => {
					if(!tempArr.includes(item.discoveryIP)){
						tempArr.push(item.discoveryIP)
						newOption.push(item)
					}
				})

				yield put({
					type: 'updateState',
					payload: {//必须使用
						options: newOption, //原始数据
						fetchingIP: false
					},
				})
			} else if (data.success && data.content.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						options: [],
						fetchingIP: false
					},
				})
			}
		},
		* queryPorts({ payload }, { select, call, put }) {
			if (payload.selectHostuuid === undefined) {
				const selectHostuuid = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.selectHostuuid)
				payload.selectHostuuid = selectHostuuid
			}
			let portname = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.portname)
			if (portname && portname !== '') {
				payload.q = ` portName=='*${portname}*'`
			}
			let data = {}
			if (payload.uuid !== '') {
				data = yield call(queryPorts, payload)
			}
			//    			const data = yield call(queryPorts, payload);
			if (payload.uuid !== '' && data) {
				let listPort2 = []
				const host2portMap = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.host2portMap)
				let ports = host2portMap.get(payload.selectHostuuid)
				if (ports && ports.length > 0) {
					listPort2 = ports
				}

				yield put({
					type: 'updateState',
					payload: {
						listPort1: data.content,
						listPort2,
						selectHostuuid: payload.selectHostuuid,
						paginationPort: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},

		/** 
		 * 获取管理对象列表
		 * 与后台交互, 调用接口/api/v1/mos
		 * @function mainRuleInstanceInfo.queryQita
		 * 
		 */
		* queryQita({ payload }, { select, call, put }) {
			const user = yield select(({ app }) => app.user)
			let branch = user.branch
			let q = ''
			q = "((firstClass!='NETWORK'  and firstClass != 'APP') or (firstClass=='NETWORK' and secondClass == 'BRANCH_IP'))"

			const newdata = { ...payload }
			newdata.q = q
			newdata.sort = 'discoveryIP,uuid,asc'
			if (payload.q && payload.q !== '') {
				newdata.q += payload.q
			}
			let qs = newdata.q
			let nameQita = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.nameQita)
			let keywordQita = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.keywordQita)
			let appQita = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.appQita)
			if (nameQita && nameQita !== '') {
				qs = `${qs}; name=='*${nameQita}*'`
			}
			if (keywordQita && keywordQita !== '') {
				qs = `${qs}; keyword=='*${keywordQita}*'`
			}
			if (appQita && appQita !== '') {
				qs = `${qs}; appName=='*${appQita}*'`
			}
			newdata.q = qs
			const data = yield call(queryQita, newdata)
			if (data) {
				yield put({
					type: 'querySuccessQita',
					payload: {
						listQita1: data.content,
						paginationQita: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		}, //queryQita

		/** 
		 * 获取资源列表
		 * 与后台交互, 调用接口/api/v1/nes
		 * @function mainRuleInstanceInfo.queryApp
		 * 
		 */
		* queryApp({ payload }, { select, call, put }) {
			const user = yield select(({ app }) => app.user)
			let branch = user.branch
			let q = ''
			if (user.branch !== undefined && user.branch !== 'ZH') {
				fenhang.forEach((obj, index) => {
					if (branch == obj.key) {
						q = `(branch=='${obj.value.split('(')[0]}*' or branch == '分行系统');`
					}
				})
			}

			const newdata = { ...payload }
			newdata.q = q
			if (payload.q && payload.q !== '') {
				newdata.q += payload.q
			}
			let qs = newdata.q
			let appName = ''
			if (payload.appName !== undefined) {
				appName = payload.appName
				delete newdata.appName
			} else {
				appName = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.appName)
			}

			let bizDesc = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.bizDesc)
			if (appName && appName !== '') {
				qs = q + `affectSystem=='*${appName}*'`
				if (bizDesc && bizDesc !== '') {
					qs = q + `affectSystem=='*${appName}*'` + ';' + ` businessIntroduction=='*${bizDesc}*'`
				}
			} else if (bizDesc && bizDesc !== '') {
				qs = q + `businessIntroduction=='*${bizDesc}*'`
			}
			if (qs.endsWith(';')) {
				qs = qs.substr(0, qs.length - 1)
			}
			newdata.q = qs
			const data = yield call(queryApp, newdata)
			if (data.success) {
				yield put({
					type: 'querySuccessApp',
					payload: {
						listApp1: data.content,
						paginationApp: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
						fetchingApp: false,
					},
				})
			}
		}, //queryQita
		/** 
		 * 通过id查找资源
		 * 与后台交互, 调用接口/api/v1/nes/{id}
		 * @function mainRuleInstanceInfo.findById
		 * 
		 */
		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.record)
			if (!data.success) {
				throw data
			}
			yield put({
				type: 'queryNetwork',
				payload: {},
			})
			yield put({
				type: 'queryQita',
				payload: {},
			})
			yield put({
				type: 'queryApp',
				payload: {},
			})
			if (user.roles[0].name === '超级管理员') {
				yield put({
					type: 'queryReviewer',
					payload: { branch: `${payload.record.branch}` },
				})
			} else if (user.branch && user.branch !== '') {
				yield put({
					type: 'queryReviewer',
					payload: { branch: `${user.branch}` },
				})
			}
			let maps = new Map()
			payload.fenhang.forEach((obj, index) => {
				let keys = obj.key
				let values = obj.value
				maps.set(keys, values)
			})

			let listHost2 = []
			let listApp2 = []
			let listQita2 = []
			let listDistributed2 = []
			let host2portMap = new Map()
			let appDistributed = ''
			let clusterDistributed = []
			let namespaceDistributed = []
			let indicatorDistributed = []

			if (data.filter && data.filter.basicFilter) {
				if (data.filter.basicFilter.neFilterItems) {
					data.filter.basicFilter.neFilterItems.forEach((item, index) => {
						let host = {}
						host.mo = {}
						host.mo.uuid = item.objectUUID
						host.mo.keyword = item.keyword
						host.mo.name = item.hostname
						listHost2.push(host)
						let ports = []
						if (item.ports && item.ports.length > 0) {
							item.ports.forEach((item2, index) => {
								let port = {}
								port.description = item2.description
								port.portName = item2.name
								port.uuid = item2.objectUUID
								ports.push(port)
							})
						}
						host2portMap.set(host.mo.uuid, ports)
					})
				}
				if (data.filter.basicFilter.appFilterItems) {
					data.filter.basicFilter.appFilterItems.forEach((item, index) => {
						//							console.log('update-item : ',item)
						let app = {}
						app.mo = {}
						app.affectSystem = item.name
						app.uuid = item.objectUUID
						app.businessIntroduction = item.description
						app.componentType = item.componetType
						listApp2.push(app)
					})
				}
				if (data.filter.basicFilter.otherFilterItems) {
					data.filter.basicFilter.otherFilterItems.forEach((item, index) => {
						let qita = {}
						qita.appName = item.appName
						qita.keyword = item.name
						qita.name = item.alias
						qita.uuid = item.objectUUID
						listQita2.push(qita)
					})
				}
				if (data.filter.basicFilter.distributedFilterItems) {
					data.filter.basicFilter.distributedFilterItems.forEach((item, index) => {
						appDistributed = item.application.name
						clusterDistributed = item.application.clusters.map(obj => {return obj.name})
						namespaceDistributed = item.application.namespaces.map(obj => {return obj.name})
						indicatorDistributed = item.application.indicators.map(obj => {return obj.name})
					})
				}
			}
			//时间格式化
			let checked = ''
			let tempList = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempDayList = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListMon = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListTue = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListWed = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListThu = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListFri = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListSat = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let tempWeekListSun = [{
				index: 1, tempid: '', begin: '', end: '',
			}]
			let startValue, endValue
			if (data.timeDef.repeatType == 'OTHER') {
				let tempLists = data.timeDef.range
				tempLists.forEach((item, index) => {
					let newObj = {}
					newObj.index = index + 1
					newObj.tempid = item.uuid
					newObj.begin = moment(item.begin, 'YYYY-MM-DD HH:mm:ss')
					newObj.end = moment(item.end, 'YYYY-MM-DD HH:mm:ss')
					tempList[index] = newObj
					startValue = Date.parse(moment(item.begin, 'YYYY-MM-DD HH:mm:ss'))
					endValue = Date.parse(moment(item.end, 'YYYY-MM-DD HH:mm:ss'))
				})
			} else if (data.timeDef.repeatType == 'BY_DAY') {
				let tempLists = data.timeDef.range
				tempLists.forEach((item, index) => {
					let newObj = {}
					newObj.index = index + 1
					newObj.tempid = item.uuid
					newObj.begin = moment(item.begin, 'HH:mm:ss')
					newObj.end = moment(item.end, 'HH:mm:ss')
					tempDayList[index] = newObj
				})
			} else if (data.timeDef.repeatType == 'BY_WEEK') {
				let tempLists = data.timeDef.weekRange
				tempLists.forEach((item, index) => {
					let newObj = {}
					let objs = item.range
					switch (item.weekday) {
						case 'MON':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListMon[index] = newObj
							})
							//						checked.push('MON')
							checked = 'MON'
							break
						case 'TUE':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListTue[index] = newObj
							})
							//						checked.push('TUE')
							checked = 'TUE'
							break
						case 'WED':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListWed[index] = newObj
							})
							//						checked.push('WED')
							checked = 'WED'
							break
						case 'THU':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListThu[index] = newObj
							})
							//						checked.push('THU')
							checked = 'THU'
							break
						case 'FRI':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListFri[index] = newObj
							})
							//						checked.push('FRI')
							checked = 'FRI'
							break
						case 'SAT':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListSat[index] = newObj
							})
							//						checked.push('SAT')
							checked = 'SAT'
							break
						case 'SUN':
							objs.forEach((items, indexs) => {
								newObj.index = indexs + 1
								newObj.tempid = items.uuid
								newObj.begin = moment(items.begin, 'HH:mm:ss')
								newObj.end = moment(items.end, 'HH:mm:ss')
								tempWeekListSun[index] = newObj
							})
							//						checked.push('SUN')
							checked = 'SUN'
							break
					}
				})
			}
			//高级模式-----start
			let moFilterValue = {},
				hostOtherValue = '',
				appOtherValue = '',
				gjtzOtherValue = '',
				alertGroupValue = '',
				componentValue = [],
				alertLevelValue = [],
				ipScopeValue = '',
				arrGroupValue = [],
				showGroupValue = {},
				AgentValue = ''
			if (data.filter.filterMode === 'ADVANCED') {
				if (data.filter.advFilterItems[0].field == "N_PeerPort" && data.filter.advFilterItems[0].value == "批量自动化") {
					data.filter.advFilterItems.splice(0, 1)
				}
				moFilterValue = {
					filterMode: 'ADVANCED',
					filterItems: data.filter.advFilterItems,
				}
			} else if (data.filter.filterMode === 'SENIOR') {
				moFilterValue = {
					filterMode: 'SENIOR',
				}
				if (data.filter.advFilterItems[0].field == "N_PeerPort") {
					data.filter.advFilterItems.splice(0, 1)
				}
				let leftBrackets = 0
				let rightBrackets = 0
				let oneGroupData = {}
				oneGroupData.hostOther = []
				oneGroupData.component = []
				oneGroupData.alertLevel = []
				let index_key = 0
				for (let i = 0; i < data.filter.advFilterItems.length; i++) {
					let allConditons = data.filter.advFilterItems
					leftBrackets += allConditons[i].leftBrackets.length
					rightBrackets += allConditons[i].rightBrackets.length

					if (allConditons[i].field === 'N_AppName') {
						oneGroupData.appOther = allConditons[i].value
					} else if (allConditons[i].field === 'NodeAlias') {
						oneGroupData.hostOther.push(allConditons[i].value)
					} else if (allConditons[i].field === 'N_SummaryCN') {
						oneGroupData.gjtzOther = allConditons[i].value
					} else if (allConditons[i].field === 'AlertGroup') {
						oneGroupData.alertGroup = allConditons[i].value
					} else if (allConditons[i].field === 'N_ComponentType') {
						oneGroupData.component.push(allConditons[i].value)
					} else if (allConditons[i].field === 'N_IPScope') {
						oneGroupData.ipScopeValue = allConditons[i].value
					}else if (allConditons[i].field === 'N_CustomerSeverity') {
						oneGroupData.alertLevel.push(allConditons[i].value)
					} else if (allConditons[i].field === 'Agent') {
						oneGroupData.Agent = allConditons[i].value
					}
					//
					if (leftBrackets == rightBrackets && allConditons[i].logicOp != 'AND') {
						oneGroupData.key = `组合${++index_key}`
						arrGroupValue.push(oneGroupData)
						oneGroupData = {}
						oneGroupData.hostOther = []
						oneGroupData.component = []
						oneGroupData.alertLevel = []
						leftBrackets = 0
						rightBrackets = 0
					}
				}

				let seniorHost = [],
					seniorApp = '',
					seniorOther = '',
					alertGroup = '',
					component = [],
					alertLevel = [],
					Agent = ''
				if (arrGroupValue[0]) {
					if (arrGroupValue[0].appOther && arrGroupValue[0].appOther != '') {
						seniorApp = arrGroupValue[0].appOther
					}
					if (arrGroupValue[0].hostOther && arrGroupValue[0].hostOther.length > 0) {
						seniorHost = arrGroupValue[0].hostOther
					}
					if (arrGroupValue[0].gjtzOther && arrGroupValue[0].gjtzOther != '') {
						seniorOther = arrGroupValue[0].gjtzOther
					}
					if (arrGroupValue[0].alertGroup && arrGroupValue[0].alertGroup != '') {
						alertGroup = arrGroupValue[0].alertGroup
					}
					if (arrGroupValue[0].component && arrGroupValue[0].component.length > 0) {
						component = arrGroupValue[0].component
					}
					if (arrGroupValue[0].ipScopeValue && arrGroupValue[0].ipScopeValue != '') {
						ipScopeValue = arrGroupValue[0].ipScopeValue
					}
					if (arrGroupValue[0].alertLevel && arrGroupValue[0].alertLevel.length > 0) {
						alertLevel = arrGroupValue[0].alertLevel
					}
					if (arrGroupValue[0].Agent && arrGroupValue[0].Agent != '') {
						Agent = arrGroupValue[0].Agent
					}
					hostOtherValue = seniorHost.join('、')
					appOtherValue = seniorApp
					gjtzOtherValue = seniorOther
					alertGroupValue = alertGroup
					componentValue = component.join('、')
					alertLevelValue = alertLevel.join('、')
					AgentValue = Agent
					showGroupValue = arrGroupValue[0]
					showGroupValue.flag = true
				}
			}
			let branchStr = ''
			if (data && data.branch !== '') {
				if (data.branch && data.branch !== '') {
					let branchArrays = data.branch.split(',')
					let branchArrayValue = []
					branchArrays.forEach((item) => {
						branchArrayValue.push(maps.get(item))
					})
					branchStr = branchArrayValue.join('/')
				}
			}
			let values = ''
			if (data && data.applicant && data.applicant !== '') {
				let q = `username == ${data.applicant}`
				let infos = {}
				infos.q = q
				const userInfos = yield call(queryUser, infos)
				if (userInfos.success) {
					if (userInfos.content.length > 0) {
						values = `${userInfos.content[0].username}/${userInfos.content[0].name}`
					}
				}
			}
			let selectedReviewer = false
			if (data.reviewers.length > 0 && payload.type != 'kelong') {
				selectedReviewer = true
			}
			let checkedValue = data.whitelistEnabled && data.whitelistEnabled.length> 0 && data.whitelistEnabled.split(',')
			yield put({
				type: 'updateState',
				payload: {
					nameKey: new Date().getTime(),
					applicantInfo: values,
					modalType: payload.type,
					currentItem: data,
					modalVisible: true,
					isClose: false,
					alarmType: data.filter.filterMode,
					moFilterValue,
					listHost2,
					listApp2,
					listDistributed2,
					listQita2,
					host2portMap,
					selectedKeysHost1: [],
					selectedKeysPort1: [],
					selectedKeysApp1: [],
					selectedKeysQita1: [],
					selectedKeysHost2: [],
					selectedKeysPort2: [],
					selectedKeysApp2: [],
					selectedKeysQita2: [],
					appDistributed,
					clusterDistributed,
					namespaceDistributed,
					indicatorDistributed,
					appDistributedFlag: false,
					clusterDistributedFlag: false,
					namespaceDistributedFlag: false,
					indicatorDistributedFlag: false,
					branchStr,
					hostOtherValue,
					appOtherValue,
					gjtzOtherValue,
					alertGroupValue,
					componentValue,
					alertLevel:alertLevelValue,
					AgentValue,
					arrGroupValue,  //分组结果
					showGroupValue, //厨师显示
					selectedReviewer,
					tempDayList,
					tempWeekListMon,
					tempWeekListTue,
					tempWeekListWed,
					tempWeekListThu,
					tempWeekListFri,
					tempWeekListSat,
					tempWeekListSun,
					checked,
					checkedWeek: checked,
					tempList,
					startValue: payload.type == 'kelong' ? 0 : startValue,
					endValue: payload.type == 'kelong' ? 9999999999999 : endValue,
					tempList: payload.type == 'kelong' ? [
						{
							index: 1,
							tempid: '',
							begin: '',
							end: '',
						},
					] : tempList,
					checkedValue,
				},
			})
		},
		* queryCreateBy({ payload }, { call, put }) {
			const userInfo = yield call(queryUser, payload)
			if (userInfo.success) {
				if (userInfo.content.length > 0) {
					yield put({
						type: 'updateState',
						payload: {
							// filterInfo: userInfo.content[0].roles[0].alarmApplyFilter === undefined ? [] : userInfo.content[0].roles[0].alarmApplyFilter,
							filterInfo: userInfo.content[0].roles[0].alarmApplyFilter || [],
						},
					})
				}
			}
		},
		/** 
		 * 获取更新的维护期应用系统
		 * 与后台交互, 调用接口/api/v1/mts/updateMtPeriodAppName
		 * @function mainRuleInstanceInfo.queryAppNameEditing
		 * 
		 */
		* queryAppNameEditing({ payload }, { call, put }) {
			const data = yield call(queryApp, payload)
			if (data.success && data.content.length > 0) {
				let optionsAppNameEdite = []
				data.content.forEach((item, index) => { //添加name属性--> 将名字改掉   其实是传的uuid
					let values = item.systemName
					let keys = item.uuid
					//let userInfo = item.username
					optionsAppNameEdite.push(<Option key={keys} value={values}>{values}</Option>)
				})
				yield put({
					type: 'updateState',
					payload: {//必须使用
						appDistributedFlag: true,
						optionAppNameEditing: optionsAppNameEdite, //原始数据
					},
				})
			} else if (data.success && data.content.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						appDistributedFlag: true,
						optionAppNameEditing: [<Option key="dhsd28dh231209s" value="全局">全局</Option>],
					},
				})
			}
		},

		/** 
		 * 分布式维护期中用来查询 cmdb 中的 app 信息
		 * 与后台交互, 调用接口/api/v1/cmdb_node_info/distnct_list
		 * @function mainRuleInstanceInfo.queryAppInCmdb
		 * 
		 */
		*queryAppInCmdb({ payload }, { call, put }) {
			const data = yield call(queryAppInCmdb, payload)
			if (data.success && data.content.length > 0) {
				let optionsAppNameEdite = []
				data.content.forEach((item, index) => { 
					optionsAppNameEdite.push(<Option key={item.affectSystem} value={item.affectSystem}>{item.affectSystem}</Option>)
				})
				yield put({
					type: 'updateState',
					payload: {//必须使用
						appDistributedFlag: true,
						optionAppNameEditing: optionsAppNameEdite, //原始数据
					},
				})
			} else if (data.success && data.content.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						appDistributedFlag: true,
						optionAppNameEditing: [<Option key="dhsd28dh231209s" value="全局">全局</Option>],
					},
				})
			}
		},

		/** 
		 * 根据应用获取应用下的集群列表
		 * 与后台交互, 调用接口/api/v1/cmdb_node_info/distnct_list
		 * @function mainRuleInstanceInfo.queryClustersByApp
		 * 
		 */
		*queryClustersByApp({ payload }, { call, put }) {
			const data = yield call(queryClustersByApp, payload)
			if (data.success && data.arr.length > 0) {
				let optionCluster = []
				data.arr.forEach((item, index) => { 
					optionCluster.push(<Option key={item} value={item}>{item}</Option>)
				})
				yield put({
					type: 'updateState',
					payload: {//必须使用
						clusterDistributedFlag: true,
						optionCluster: optionCluster, //原始数据
					},
				})
			} else if (data.success && data.arr.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						clusterDistributedFlag: true,
						optionCluster: [],
					},
				})
			}
		},

		/** 
		 * 获取分布式Promethus 指标组的指标集合
		 * 与后台交互, 调用接口/api/v1/cmdb_node_info/distnct_list
		 * @function mainRuleInstanceInfo.queryIndicators
		 * 
		 */
		*queryIndicators({ payload }, { call, put }) {
			const data = yield call(indicatorsQuery, payload)
			if (data.success && data.content.length > 0) {
				let optionIndicator = []
				data.content.forEach((item, index) => { 
					optionIndicator.push(<Option key={item.name} value={item.name}>{item.name}</Option>)
				})
				yield put({
					type: 'updateState',
					payload: {//必须使用
						indicatorDistributedFlag: true,
						optionIndicator: optionIndicator, //原始数据
					},
				})
			} else if (data.success && data.content.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						indicatorDistributedFlag: true,
						optionIndicator: [],
					},
				})
			}
		},

		/** 
		 * 根据应用获取应用下的集群列表
		 * 与后台交互, 调用接口/api/v1/cmdb_node_info/distnct_list
		 * @function mainRuleInstanceInfo.queryNamespacesByCluster
		 * 
		 */
		*queryNamespacesByCluster({ payload }, { call, put }) {
			const data = yield call(queryNamespacesByCluster, payload)
			if (data.success && data.arr.length > 0) {
				let optionNamespace = []
				data.arr.forEach((item, index) => { 
					optionNamespace.push(<Option key={item} value={item}>{item}</Option>)
				})
				yield put({
					type: 'updateState',
					payload: {//必须使用
						optionNamespace: optionNamespace, //原始数据
					},
				})
			} else if (data.success && data.arr.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						optionNamespace: [],
					},
				})
			}
		},

		/** 
		 * 获取选择的应用系统
		 * 与后台交互, 调用接口/api/v1/mts/updateMtPeriodAppName
		 * @function mainRuleInstanceInfo.queryOptionSelectAppName
		 * 
		 */
		* queryOptionSelectAppName({ payload }, { call, put }) {
			const data = yield call(queryApp, payload)
			//console.log(data)
			if (data.success && data.content.length > 0) {
				let optionSelectAppNames = []
				let filterDuplicate = []
				data.content.forEach((item, index) => { //添加name属性--> 将名字改掉   其实是传的uuid
					//let values = item.affectSystem.toString().indexOf("（") === -1?item.affectSystem:item.affectSystem.toString().substring(0,item.affectSystem.toString().indexOf("（"))
					if(filterDuplicate.indexOf(item.affectSystem) == -1){
						filterDuplicate.push(item.affectSystem)
						let values = item.affectSystem
						let keys = item.uuid
						//let userInfo = item.username
						optionSelectAppNames.push(<Option key={keys} value={values}>{values}</Option>)
					}
				})
				yield put({
					type: 'updateState',
					payload: {//必须使用
						appDistributedFlag: true,
						optionSelectAppName: optionSelectAppNames, //原始数据
					},
				})
			}
		},
		*getNowData({ payload }, { call, put }) {
			const date = yield call(queryData, payload)
			if (date.success) {
				yield put({
					type: 'updateState',
					payload: {
						nowDate: date.currentTime,
					},
				})
			}
		},
		*queryReviewer({ payload }, { call, put }) {
			const date = yield call(queryReviewer, payload)
			if (date.success) {
				yield put({
					type: 'updateState',
					payload: {
						reviewers: date.arr,
					},
				})
			}
		},

		*saveReviewer({ payload }, { call, put }) {
			const date = yield call(saveReviewer, payload)
			if (date.success) {
				yield put({
					type: 'updateState',
					payload: {
					}
				})
			} else {
				throw data
			}
		},
		*updReviewer({ payload }, { call, put }) {
			const date = yield call(updReviewer, payload)
			if (date.success) {
				yield put({
					type: 'updateState',
					payload: {
						modalVisible: false,
						isClose: true,
					}
				})
				yield put({ type: 'requery' })
			} else {
				throw date
			}
		},
		*adjust({ payload }, { call, put, select }) {
			const uuid = yield select(({ mainRuleInstanceInfo }) => mainRuleInstanceInfo.currentItem.uuid)
			const newdata = { ...payload, uuid }
			const date = yield call(adjust, newdata)
			if (date.success) {
				yield put({
					type: 'updateState',
					payload: {
						modalVisible: false,
						isClose: true,
					}
				})
				yield put({ type: 'requery' })
			} else {
				throw date
			}
		},
		/**
		 * 操作记录查询接口
		 */
		*queryOperateRecord1({ payload }, { call, put }) {
			let OperateRecord = peformanceCfg.queryOperateRecord //查询接口集合信息
			let must = []
			let queryString = {
				"query_string": {
					default_field: "DetailMessage",
					query: `/api/v1/mts/ name=${payload.record.name},`,
					default_operator: "AND"
				}
			}
			let op = { "terms": { "op.keyword": ["create", "update","import"] } }
			let name = { "terms": { "name.keyword": [payload.record.name, `${payload.record.name}, uuid=${payload.record.uuid}`] } }
			must.push(queryString)
			must.push(op)
			// must.push(name)
			OperateRecord.query.bool.must = must

			let paths = ESFindIndex(payload.record.createdTime, Date.parse(new Date()), 'u2-containerlog-', 'month', '')
			let queryParams = { es: {}, paths: '' }
			queryParams.es = OperateRecord
			queryParams.paths = paths
			let operateRecordList = []

			const date = yield call(operateRecord, queryParams)
			if (date.success && date.hits.hits.length > 0) {
				let result = date.hits.hits
				result.forEach((item) => {
					let obj = {}
					obj.recordName = item._source.user
					obj.recordOpt = item._source.op
					obj.recordTime = item._source.LogTime
					obj.DetailMessage = item._source.DetailMessage
					operateRecordList.push(obj)
				})
				yield put({
					type: 'updateState',
					payload: {
						operateRecordList,
						showOperateRecord: true,
						seeOperate: false
					}
				})
			} else {
				message.error("查询不到数据")
			}
		},
		/**
 		* 操作记录查询接口
 		*/
 		*queryOperateRecord({ payload }, { call, put }) {
			const operateRecordList = []
			// 通过用户获取token值
			const token = yield call(getLogToken, {})
			if (token.code == 1) {
				// 保持token值，之后接口调用使用
				sessionStorage.setItem('TOLCToken', token.token)
				// 提交查询的请求获取任务id
				const condition = {
					indexs:'_tolc-u2-applog-%{YYYY.MM},tolc-app-ump-oplog-%{YYYY.MM}',
					q:`| where name == \"${payload.record.name}\" || uri == \" /api/v1/mts/review/${payload.record.uuid}\"`,
					time:{},
					page:{}
				}
				const taskID = yield call(getaskID, condition)
				if (taskID.status == 'success') {
					//	通过任务id来获取任务状态
					let taskState = ''
					//  异步循环 判断任务是否完成
					while (taskState != 'SUCCESS') {
						let aaa = yield call(gettaskState, taskID)
						taskState = aaa.content.state
						if (taskState == 'ERROR' || taskState == 'TERMINATED') {
							message.error("任务执行失败")
							return
						}
					}
					//	任务完成后，通过id和分页信息获取结果
					const data = yield call(getData, Object.assign({},taskID,condition))
					if (data.success && data.content.data.length > 0) {
						const objKeysIndex = {}
						data.content.columns.forEach((item, index) =>{
							objKeysIndex[item.name] = index
						})
						const result = data.content.data
						if (result.length > 0) {
							result.forEach(item =>{
								const obj = {}
								obj.recordName = item.values[objKeysIndex.user]
								obj.recordOpt = item.values[objKeysIndex.op]
								obj.recordTime = item.values[objKeysIndex.systime]
								obj.DetailMessage = item.values[objKeysIndex.message]
								operateRecordList.push(obj)
							})
						}
						yield put({
							type: 'updateState',
							payload: {
								operateRecordList,
								showOperateRecord: true,
								seeOperate: false
							}
						})
					} else {
						message.error("查询不到数据")
					}
				} else {
					message.error("获取任务ID失败")
				}
			} else {
				message.error("登录TOCL失败")
			}
			yield put({
				type: 'updateState',
				payload: {
					oploading: false,
				}
			})
		},
		/**
		 * 维护期禁用接口
		 */
		*disable({ payload }, { call, put }) {
			const data = yield call(disable, payload)
			if (data.success) {
				yield put({ type: 'requery' })
				message.success('维护期禁用成功')
			} else {
				throw data
			}
		},
		/**
		 * 
		 */ 
		*onDown({ payload }, { call, put }) {
			const data = yield call(onDown, payload)
		},
		/**
		 * 批量删除维护期 提前结束
		 */ 
		*disablePatch({ payload }, { call, put }) {
			const data = yield call(patchDisable, payload)
			if (data.success) {
				yield put({ type: 'requery' })
				message.success('维护期提前结束成功')
				yield put({
					type: 'updateState',
					payload: {
						del_bath_visible: false,
					}
				})
			} else {
				throw data
			}
		},
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			const {
				list, pagination, groupUUID, q,
			} = action.payload
			return { //修改
				...state,
				list,
				q,
				pagination: {
					...state.pagination,
					...pagination,
				},
				groupUUID,
			}
		},

		//这里控制弹出窗口显示 或者隐藏
		controllerModal(state, action) {
			return { ...state, ...action.payload }
		},

		querySuccessHost(state, action) {
			const { listHost1, paginationHost, fetchingIP } = action.payload
			return { //修改
				...state,
				listHost1,
				paginationHost: {
					...state.paginationHost,
					...paginationHost,
				},
				fetchingIP,
			}
		},
		querySuccessQita(state, action) {
			const { listQita1, paginationQita } = action.payload
			return { //修改
				...state,
				listQita1,
				paginationQita: {
					...state.paginationQita,
					...paginationQita,
				},
			}
		},
		querySuccessApp(state, action) {
			const { listApp1, paginationApp, fetchingApp } = action.payload
			return { //修改
				...state,
				listApp1,
				paginationApp: {
					...state.paginationApp,
					...paginationApp,
				},
				fetchingApp,
			}
		},

		updateState(state, action) {
			return { ...state, ...action.payload }
		},

	},

}