import React from 'react'
import { query, create, remove, update, queryPorts, queryQita, queryApp, queryAppInCmdb, MoveTo, CopyTo, findById, queryReviewer,batchInstance } from '../services/maintenanceTemplet'
import { queryClustersByApp, queryNamespacesByCluster, create as createInstance, query as queryName  } from '../services/mainRuleInstanceInfo'
import { query as indicatorsQuery } from '../services/stdIndicatorsInfo'
import { nesquery } from '../services/nes'
import { queryAllTypeOfMO } from '../services/objectMO'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
import { query as queryUser } from '../services/userinfo'
import { Select, message,Modal } from 'antd'
/**
 * 维护期管理/维护期模版
 * @namespace maintenanceTemplet
 * @requires module:维护期管理/维护期模板
 */
export default {

	namespace: 'maintenanceTemplet',

	state: {
		list: [],																				//定义了当前页表格数据集合
		currentItem: {},																//被选中的行对象的集合
		modalVisible: false,														//弹出窗口是否可见
		modalType: 'create',														//弹出窗口的类型
		datamodalVisible: false,														//弹出窗口是否可见
		datamodalType: 'instance',														//弹出窗口的类型
		pagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		copyOrMoveModal: false,
		copyOrMoveModalType: 'copy',
		isClose: false,
		detail: {},
		batchDelete: false,
		groupUUID: [],
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
		localPath: 'maintenanceTemplet',
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
		cycles: 'NON_PERIODIC',							//维护类型（周期、非周期）
		checkedWeek: [],						//维护时间选定天数
		timeType: 'BY_WEEK',						//维护期时间定义（按天，按周）
		isenabled: true,						//是否启用
		tempList: [							//时间段数组
			{
				index: 1,
				tempid: '',
				begin: '',
				end: '',
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

		//查询分页----searchHost
		hostname: '',
		hostkeyword: '',
		//查询分页----searchApp
		appName: '',
		bizDesc: '',
		//查询分页----searchQita
		nameQita: '',
		keywordQita: '',
		appQita: '',
		//查询分页----searchPort
		portname: '',

		ruleInstanceKey: '',
		vaillist: [],
		choosedRows:[],  // 选中列表中的行
		hostOtherValue: '',	//控制维护期告警定义高级模式提示
		appOtherValue: '',	//控制维护期告警定义高级模式提示
		gjtzOtherValue: '',	//控制维护期告警定义高级模式提示
		fetchingIP: false,
		fetchingApp: false,
		alertGroupValue: '',
		componentValue: [],
		targetGroupUUIDs: [],
		branchipOptions: [],					//网点
		options: [],							//网络域四霸
		serversOptions: [], //主机
		osOptions: [],							//操作系统
		dbOptions: [],							//数据库
		mwsOptions: [],							//中间件
		appOptions: [],							//应用
		keysTime: '',
		q: '',
		applicantInfo: '',
		expand: true,
		optionCluster: [],
		optionNamespace: [],
		optionIndicator: [],
		appNameAuto: '',
		appNameEditing: [],
		timeOut: false,             //时间是否超过24小时的判断
		nameChange: '请再次确认',	//确认超过24小时的按钮名字
		timeValue: '',			//显示超24小时的具体时间长短
		startValue: 0,			//记录开始时间、及做判断
		endValue: 9999999999999, //记录结束时间、及做判断
		outTimeChange: false,		//当点击延时时，禁止编辑结束时间的判断
		showEndTime: 0,				//当选择延时时间后，要显示的结束时间
		arrGroupValue:[],      //高级模式的组
		showGroupValue:{},		//显示的数据
		forbind:false,
		restrict:[],        //权限
		selectedReviewer:false, //选择授权人
		reviewers:[], //授权人
		whitelistEnabled:"", //白名单
		transaStatus:false,
		batchStatus:false,
		instanceVisible:false,
		moImportResultVisible:false,
		moImportResultType: '',
		moImportResultdataSource: [],	
		appDistributed:'',
		clusterDistributed:[],
		namespaceDistributed:[],
		indicatorDistributed:[],
		appDistributedFlag: false,
		clusterDistributedFlag: false,
		namespaceDistributedFlag: false,
		indicatorDistributedFlag: false,
		alertLevel:[],
		AgentValue:'',
		ticket: '',
		timeRange: null
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				const query = queryString.parse(location.search);
				if (location.pathname.includes('/maintenanceTempletGroup/maintenanceTemplet')) {
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
		 * 与后台交互, 调用接口/api/v1/mt-templates/，获取数据
		 * @function maintenanceTemplet.query
		 * 
		 */
		* query({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ maintenanceTemplet }) => maintenanceTemplet.groupUUID)
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			}

			const newdata = { ...payload, groupUUID }
			const data = yield call(query, newdata)

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
						q: payload.q,
					},
				})
			}
		}, //query

		/** 
		 * 新增资源
		 * 与后台交互, 调用接口/api/v1/mt-templates/，获取数据
		 * @function maintenanceTemplet.query
		 * 
		 */
		* create({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ maintenanceTemplet }) => maintenanceTemplet.groupUUID)
			if (groupuuids && groupuuids.length > 0) {
				payload.targetGroupUUIDs = groupuuids
			}
			const data = yield call(create, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						modalVisible: false,
						targetGroupUUIDs: [],
						arrGroupValue:[],   
						showGroupValue:{},
						appDistributed: '',
						clusterDistributed: [],
						namespaceDistributed: [],
						indicatorDistributed: [],
						optionCluster: [],
						optionNamespace: [],
						optionIndicator: [],
						optionAppNameEditing: [],
					},
				})
				yield put({ type: 'requery' })
			} else if (data.code === 1008) {
				yield put({
					type: 'updateState',
					payload: {
						errorCode: false,
					},
				})
			} else {
				yield put({ type: 'requery' })
				throw data
			}
		},

		* queryName({ payload }, { select, call, put }) { //查询数据
			const newdata = { ...payload }
			const data = yield call(queryName, newdata) //与后台交互，获取数据
			if (data) {
				yield put({
					type: 'updateState',
					payload: {
						vaillist: data.content,
					},
				})
			}
		},
		* createInstance({ payload }, { call, put }) {
			const data = yield call(createInstance, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						datamodalVisible: false,
						isClose: true,
						//						stdInfoVal:{},
					},
				})
				yield put({ type: 'requery' })
			} else {
				yield put({ type: 'requery' })
				throw data
			}
		},
		/** 
		 * 查询数据
		 * 刷新页面
		 * @function maintenanceTemplet.requery
		 */
		* requery({ payload }, { put }) {
			yield put(routerRedux.push({
				pathname: window.location.pathname,
				query: parse(window.location.search.substr(1)),
			}))
		},
		/** 
		 * 删除资源
		 * 与后台交互, 调用接口/api/v1/mt-templates/{id}，获取数据
		 * @function maintenanceTemplet.delete
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
		 * 与后台交互, 调用接口/api/v1/mt-templates/{id}，获取数据
		 * @function maintenanceTemplet.update
		 * 
		 */
		* update({ payload }, { select, call, put }) {
			yield put({
				type: 'updateState',
				payload: {
					modalVisible: false,
					selectedKeysHost1: [],
					selectedKeysPort1: [],
					selectedKeysApp1: [],
					selectedKeysQita1: [],
					selectedKeysHost2: [],
					selectedKeysPort2: [],
					selectedKeysApp2: [],
					selectedKeysQita2: [],
				},
			})
			const id = yield select(({ maintenanceTemplet }) => maintenanceTemplet.currentItem.uuid)
			const newTool = { ...payload, id }
			newTool.uuid = id
			const data = yield call(update, newTool)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						// targetGroupUUIDs: [],
						arrGroupValue:[],   
						showGroupValue:{},
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
				yield put({ type: 'requery' })
				throw data
			}
		},
		/** 
		 * 获取非网络监控资源列表
		 * 与后台交互, 调用接口/api/v1/rule-instances/，获取数据
		 * @function maintenanceTemplet.query
		 * 
		 */
		* queryNetwork({ payload }, { select, call, put }) {
			let q = "firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5' or secondClass=='NM' )"
			const newdata = { ...payload }
			newdata.q = q
			newdata.sort = 'discoveryIP,asc'
			if (payload.q && payload.q !== '') {
				newdata.q += payload.q
			}
			let qs = newdata.q
			let hostname = yield select(({ maintenanceTemplet }) => maintenanceTemplet.hostname)
			let hostkeyword = yield select(({ maintenanceTemplet }) => maintenanceTemplet.hostkeyword)
			let newdatas = { ...payload }
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
			if (data) {
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
		 * @function maintenanceTemplet.queryAllTypeOfMO
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
				yield put({
					type: 'updateState',
					payload: {//必须使用
						options: data.content, //原始数据
						fetchingIP: false,
					},
				})
			} else if (data.success && data.content.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						options: [],
						fetchingIP: false,
					},
				})
			}
		},
		* queryPorts({ payload }, { select, call, put }) {
			if (payload.selectHostuuid === undefined) {
				const selectHostuuid = yield select(({ maintenanceTemplet }) => maintenanceTemplet.selectHostuuid)
				payload.selectHostuuid = selectHostuuid
			}
			let portname = yield select(({ maintenanceTemplet }) => maintenanceTemplet.portname)
			if (portname && portname !== '') {
				payload.q = ` portName=='*${portname}*'`
			}

			let data = {}
			if (payload.uuid !== '') {
				data = yield call(queryPorts, payload)
			}

			//    		const data = yield call(queryPorts, payload);
			if (payload.uuid !== '' && data) {
				const host2portMap = yield select(({ maintenanceTemplet }) => maintenanceTemplet.host2portMap)
				let listPort2 = []
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
		 * @function maintenanceTemplet.queryQita
		 * 
		 */
		* queryQita({ payload }, { select, call, put }) {
			let q = "((firstClass!='NETWORK' and firstClass != 'APP') or (firstClass=='NETWORK' and secondClass == 'BRANCH_IP'))"
			const newdata = { ...payload }
			newdata.q = q
			newdata.sort = 'discoveryIP,uuid,asc'
			if (payload.q && payload.q !== '') {
				newdata.q += payload.q
			}
			let qs = newdata.q
			let nameQita = yield select(({ maintenanceTemplet }) => maintenanceTemplet.nameQita)
			let keywordQita = yield select(({ maintenanceTemplet }) => maintenanceTemplet.keywordQita)
			let appQita = yield select(({ maintenanceTemplet }) => maintenanceTemplet.appQita)
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
			//let q="firstClass=='APP'"
			let q = ''
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
				appName = yield select(({ maintenanceTemplet }) => maintenanceTemplet.appName)
			}
			let bizDesc = yield select(({ maintenanceTemplet }) => maintenanceTemplet.bizDesc)
			if (appName && appName !== '') {
				qs = ` affectSystem=='*${appName}*'`
				if (bizDesc && bizDesc !== '') {
					qs = ` affectSystem=='*${appName}*'` + ';' + ` businessIntroduction=='*${bizDesc}*'`
				}
			} else if (bizDesc && bizDesc !== '') {
				qs = ` businessIntroduction=='*${bizDesc}*'`
			}

			newdata.q = qs
			const data = yield call(queryApp, newdata)

			if (data) {
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
		 * 移动到分组
		 * 与后台交互, 调用接口/api/v1/mt-templates/groups/move-to，获取数据
		 * @function maintenanceTemplet.move
		 * 
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
		 * 复制到分组
		 * 与后台交互, 调用接口/api/v1/mt-templates/groups/copy-to，获取数据
		 * @function maintenanceTemplet.copy
		 * 
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
		 * 通过id查找资源
		 * 与后台交互, 调用接口/api/v1/nes/{id}
		 * @function maintenanceTemplet.findById
		 * 
		 */
		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.record)
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
						let app = {}
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
			//高级模式-----start
			let moFilterValue = {},
				hostOtherValue = '',
				appOtherValue = '',
				gjtzOtherValue = '',
				alertGroupValue = '',
				componentValue = [],
				ipScopeValue = '',
				arrGroupValue =[],
				showGroupValue={},
				alertLevelValue = [],
				AgentValue = ''
				if (data.filter.filterMode === 'ADVANCED') {
					if (data.filter.advFilterItems[0].field == "N_PeerPort" && data.filter.advFilterItems[0].value == "批量自动化"){
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
				   if(data.filter.advFilterItems[0].field=="N_PeerPort"){
					   data.filter.advFilterItems.splice(0,1)
				   }
				   let leftBrackets = 0
				   let rightBrackets = 0
				   let oneGroupData={}
				   oneGroupData.hostOther =[]
				   oneGroupData.component =[]
				   oneGroupData.alertLevel = []
				   let index_key = 0
				   for(let i = 0 ;i<data.filter.advFilterItems.length ; i++){
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
					   } else if(allConditons[i].field === 'N_IPScope') {
						   oneGroupData.ipScopeValue = allConditons[i].value
					   }else if (allConditons[i].field === 'N_CustomerSeverity') {
						oneGroupData.alertLevel.push(allConditons[i].value)
					} else if (allConditons[i].field === 'Agent') {
						oneGroupData.Agent = allConditons[i].value
					}
					   //
					   if(leftBrackets == rightBrackets && allConditons[i].logicOp!='AND'){
						   oneGroupData.key = `组合${++index_key}`
						   arrGroupValue.push(oneGroupData)
						   oneGroupData = {}
						   oneGroupData.hostOther =[]
						   oneGroupData.component =[]
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
				   if(arrGroupValue[0]){
					   if(arrGroupValue[0].appOther && arrGroupValue[0].appOther !=''){
						   seniorApp=arrGroupValue[0].appOther
					   }
					   if(arrGroupValue[0].hostOther && arrGroupValue[0].hostOther.length>0){
						   seniorHost=arrGroupValue[0].hostOther
					   }
					   if(arrGroupValue[0].gjtzOther && arrGroupValue[0].gjtzOther !=''){
						   seniorOther=arrGroupValue[0].gjtzOther
					   }
					   if(arrGroupValue[0].alertGroup && arrGroupValue[0].alertGroup !=''){
						   alertGroup=arrGroupValue[0].alertGroup
					   }
					   if(arrGroupValue[0].component && arrGroupValue[0].component.length>0){
						   component=arrGroupValue[0].component
					   }
					   if(arrGroupValue[0].ipScopeValue && arrGroupValue[0].ipScopeValue !=''){
						   ipScopeValue=arrGroupValue[0].ipScopeValue
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
			if (data.filter.advFilterItems) {
				moFilterValue.filterItems = data.filter.advFilterItems
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

			yield put({
				type: 'updateState',
				payload: {
					modalType: payload.type,
					currentItem: data,
					modalVisible: true,
					isClose: false,
					alarmType: data.filter.filterMode,
					moFilterValue,
					applicantInfo: values,
					listHost2,
					listApp2,
					listQita2,
					listDistributed2,
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
					hostOtherValue,
					appOtherValue,
					gjtzOtherValue,
					alertGroupValue,
					componentValue,
					arrGroupValue,  //分组结果
					showGroupValue, //厨师显示
					alertLevel:alertLevelValue,
					AgentValue,
				},
			})
		},
		/** 
		 * 获取更新的维护期应用系统
		 * 与后台交互, 调用接口/api/v1/mts/updateMtPeriodAppName
		 * @function maintenanceTemplet.queryAppNameEditing
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
		 * 根据应用获取应用下的集群列表
		 * 与后台交互, 调用接口/api/v1/cmdb_node_info/distnct_list
		 * @function maintenanceeTemplet.queryClustersByApp
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
		 * @function maintenanceeTemplet.queryIndicators
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
		 * 分布式维护期中用来查询 cmdb 中的 app 信息
		 * 与后台交互, 调用接口/api/v1/cmdb_node_info/distnct_list
		 * @function maintenanceTemplet.queryAppInCmdb
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
		 * @function maintenanceeTemplet.queryNamespacesByCluster
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
						namespaceDistributedFlag: true,
						optionNamespace: optionNamespace, //原始数据
					},
				})
			} else if (data.success && data.arr.length === 0) {
				yield put({
					type: 'updateState',
					payload: {
						namespaceDistributedFlag: true,
						optionNamespace: [],
					},
				})
			}
		},

		/** 
		 * 获取选择的应用系统
		 * 与后台交互, 调用接口/api/v1/mts/updateMtPeriodAppName
		 * @function maintenanceeTemplet.queryOptionSelectAppName
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


		*queryReviewer({ payload }, { call, put }){
			const date = yield call (queryReviewer, payload)
			if (date.success) {
			  yield put({
				type: 'updateState',
				payload: {
					reviewers:date.arr,
				},
			  })
			}
		},
		*batch_instance({ payload }, { call, put }){
			const date = yield call (batchInstance, payload)
			if (date.success) {
				message.success('批量实例化成功')
				yield put({
					type: 'updateState',
					payload: {
						instanceVisible: false,
						choosedRows: [],
						timeValue: '',
						timeOut: false,
					},
				  })
			}else{
				throw data
			}
		},
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			const {
				list, pagination, detail, q,
			} = action.payload
			return {
				...state,
				hostList: list,
				paginationHost: {
					...state.paginationHost,
					...pagination,
				},
				list,
				q,
				pagination: {
					...state.pagination,
					...pagination,
				},
				detail,
			}
		},
		querySuccess1(state, action) {
			const { userList, pagination1 } = action.payload
			return { //修改
				...state,
				userList,
				pagination1: {
					...state.pagination1,
					...pagination1,
				},
			}
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
