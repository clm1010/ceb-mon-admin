import { query, sql, alarmProcessServ, getJournal, knowledges,queryRecommend, outCall, outCalluser, queryHint } from '../services/alarms'
import { queryAllosts } from '../services/osts'
import { queryAllViews, queryViewer } from '../services/eventviews'
import { queryById, queryAllFilters } from '../services/oel/oelEventFilter'
import { queryTool } from '../services/oelToolset'
import { sendOuts } from '../services/ticket'
import { query as queryApp } from '../services/appCategories'
import { xykqueryAllFilters, xykqueryById, xykqueryAllViews, xykqueryAllosts, xykqueryViewer, xykqueryTool, xykquery, xykgetJournal } from '../services/xykfrontview'
import { queryJournal as historyJournal } from '../services/historyview'
import token from '../utils/otherToken'
import { message } from 'antd'
import { filterAdapter, config } from '../utils'
import queryString from "query-string";

const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
/**
* 告警中心/实时告警列表
* @namespace oel
* @requires module:告警中心/实时告警列表
*/
export default {

	namespace: 'oel',

	state: {
		title: '告警列表',													// 弹出页标题
		filterDisable: false,												// 过滤器下拉列表是否禁用
		list: [],																				//定义了当前页表格数据集合
		currentItem: {},																//被双击的单个行对象
		initValue: config.countDown,										//倒计时刷新初始值
		tagFilters: new Map(),													//过滤器标签集合
		currentSelected: 'all',													//右上角Severity控件，当前默认选中类型
		filteredSeverityMap: new Map(),									//右上角Severity控件，当前告警总数默认选中
		visibleFilter: false,														//快速过滤器modal
		workOrderVisible: false,												//工单弹窗可见性
		processEventVisible: false,											//通用事件处理弹窗可见性
		contextType: '',																//右键弹窗类型
		contextMessage: '',															//右键弹窗说明信息
		contextInput: '',																//右键弹窗要包含的控件
		woCurrentItem: {},																//要发送工单的告警
		oelFilter: '',																	//oel默认过滤器uuid
		oelDatasource: '', //oel默认ObjectServer数据源（三层）uuid
		osUuid: '',																	//oel连接的具体的哪个ObjectServer
		oelViewer: '',																	//oel默认视图uuid
		oelColumns: [],																	//oel默认表头
		pagination: {																		//分页对象
			showSizeChanger: true,												//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
			pageSize: 100,
		},
		toolList: [],																			//工具列表
		filterList: [],																		//过滤器列表
		datasourceList: [],																//数据源列表
		viewList: [],																			//视图列表
		countState: false,																//倒计时play状态为true,pause状态为false
		orderBy: ' order by FirstOccurrence desc',				//sql语句的排序部分
		selectedRows: [],																	//多选选中的行集合
		alertType: '',
		alertMessage: '工单信息',
		qFilter: '1=1',																			//这是由具体过滤器生成的查询字符串
		nonStringFields: [],															//非字符串字段名称集合
		dateFields: [],																		//日期字符串字段名称集合
		fieldKeyword: '',																	//告警详情窗口，快速过滤字段的关键字
		journelList: [],										//特定告警历史记录
		curDetailTabKey: '0',
		preFilter: '',											// 这是一个外部传入oel的查询条件，和内部条件组合使用。
		needFilter: true,										// 是否使用后端存储的过滤器，默认需要
		branchType: '',
		knowledges: [],

		DisposalPagination: {											// 事件处置记录
			showSizeChanger: true,												// 是否可以改变 pageSize
			showQuickJumper: true, // 是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
			current: 1,																		// 当前页数
			total: 0,
		},
		DisposalDataSource: [],
		preSearch: '',
		visibleSearchFilter: false,
		appNameList: [],
		fetchingApp: false,
		Service_Impact_Num: 0,
		HotPotNum: 0,
		callOutList:[],
		callUsers: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname.includes('/oel')) {
					if (location.search && location.search.endsWith('/')) {//处理TOPO管理的地址栏参数问题
						location.search = location.search.substr(0, location.search.length - 1)
					}

					const query = queryString.parse(location.search);
					dispatch({
						type: 'updateState',
						payload: {
							branchType: query.branchType,
							preSearch: location.search
						}
					})
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
		 * 获取告警的日志列表
		 * 与后台交互, 调用接口/api/v1/osts/journals，获取数据
		 * @function oel.getJournal
		 */
		* getJournal({ payload }, { call, put, select }) {
			let branchType = yield select(state => state.oel.branchType)
			// 从state中找出数据源id和osid
			const oelDatasource = yield select(state => state.oel.oelDatasource)
			const osUuid = yield select(state => state.oel.osUuid)
			payload.osUuid = osUuid
			payload.uuid = oelDatasource

			const data = branchType == 'XYK' ? yield call(xykgetJournal, payload) : yield call(getJournal, payload)
			console.log("oel model:")
			console.dir(data)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						journelList: data.journalList,
						curDetailTabKey: '2',
					},
				})
			}
		},
		/**
			 * 从数据库获取告警数据
			 * 与后台交互,调用接口  /api/v1/osts/alerts 获取数据
			 * @function oel.sqlTrigger
			 */
		* sqlTrigger({ payload }, { call, put, select }) {
			// 从后台获取告警数据
			const data = yield call(sql, payload)

			let pagination = yield select(state => state.oel.pagination)
			let oelFilter = yield select(state => state.oel.oelFilter)
			let oelViewer = yield select(state => state.oel.oelViewer)
			let oelDatasource = yield select(state => state.oel.oelDatasource)
			let osUuid = yield select(state => state.oel.osUuid)
			pagination.current = pagination.current

			if (data) {
				yield put({
					type: 'query',
					payload: {
						oelFilter,
						oelViewer,
						oelDatasource,
						osUuid,
						pagination,
					},
				})
			} else {
				throw data
			}
		},

		* requery({ payload }, { put }) {
			yield put({
				type: query,
				payload: { ...payload },
			})
		},
		/**
			 * 获取视图
			 * 与后台交互,调用接口 /api/v1/ev/ 获取数据
			 * @function oel.getViewer
			 */
		* getViewer({ payload }, { call, put }) {
			//从后台获取视图
			const viewer = yield call(queryViewer, payload)

			if (viewer) {
				yield put({
					type: 'updateState',
					payload: {
						oelColumn: {
							uuid: viewer.uuid,
							column: JSON.parse(viewer.selectedCols),
						},
					},
				})
			}
		},
		/**
			 * 获取告警数据
			 * 与后台交互,调用接口/searchxykalarm/api/v1/ef/,/searchxykalarm/api/v1/ev/,/searchxykalarm/api/v1/osts/,
			 * /searchxykalarm/api/v1/et/,/api/v1/ef/,/api/v1/osts/,/api/v1/et/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  获取数据
			 * @function oel.query
			 */
		* query({ payload }, { call, put, select }) {
			let branchType = yield select(state => state.oel.branchType)
			if (payload === undefined) {
				payload = {}
			}
			//如果传过来的ObjectServer的Uuid不存在，则默认使用state里存储的uuid
			const osUuid = yield select(state => state.oel.osUuid)
			if (!('osUuid' in payload)) {
				payload.osUuid = osUuid
			}
			//取得非字符串类型字段名集合备用
			let nonStringFields = yield select(state => state.oel.nonStringFields)
			if (nonStringFields.length === 0) {
				for (let column of ViewColumns) {
					if (column.type !== 'string') {
						nonStringFields.push(column.key)
					}
				}
				payload.nonStringFields = nonStringFields
			}

			//取得日期类型字段名集合备用
			let dateFields = yield select(state => state.oel.dateFields)
			if (dateFields.length === 0) {
				for (let column of ViewColumns) {
					if (column.type == 'utc') {
						dateFields.push(column.key)
					}
				}
				payload.dateFields = dateFields
			}

			//分页数据
			let pagination = yield select(state => state.oel.pagination)
			if (payload.page !== undefined) {
				pagination.current = payload.page
			} else {
				pagination.current = pagination.current
			}

			if (payload.pagination === undefined) {
				payload.pagination = pagination
			}

			//生成过滤器下拉列表
			const filterList = yield select(state => state.oel.filterList)
			if (filterList.length === 0 || payload.forceGetFilters === true) {
				const filters = branchType == 'XYK' ? yield call(xykqueryAllFilters, {}) : yield call(queryAllFilters, {})
				payload.filterList = filters.content
			}
			
			//过滤器
			const oelFilterState = yield select(state => state.oel.oelFilter)
			//过滤器字符串
			const qFilter = yield select(state => state.oel.qFilter)
			payload.qFilter = qFilter

			//过滤器qFilter
			if (payload.needFilter !== undefined && payload.needFilter === false) {
				payload.oelFilter = ''
			} else if (payload.oelFilter !== undefined && payload.oelFilter !== '' && (payload.oelFilter !== oelFilterState || qFilter === '1=1')) {
				//如果传过来的过滤器id和老的过滤器id不一样，发起请求到后台获取过滤器对象
				const filter = branchType == 'XYK' ? yield call(xykqueryById, { oelFilter: payload.oelFilter }) : yield call(queryById, { oelFilter: payload.oelFilter })
				payload.qFilter = filterAdapter(filter.filter, nonStringFields)
			} else if (payload.oelFilter === undefined && oelFilterState !== '' && qFilter === '1=1') {
				//如果state里有过滤器uuid，查询字符串为空，则后端请求
				const filter = branchType == 'XYK' ? yield call(xykqueryById, { oelFilter: oelFilterState }) : yield call(queryById, { oelFilter: oelFilterState })
				payload.qFilter = filterAdapter(filter.filter, nonStringFields)
			} else if ((payload.oelFilter === undefined || payload.oelFilter === '') && (oelFilterState === '')) {
				if (payload.filterList.length > 0) {
					let filter = {},
						oelFilter = ''
					for (let filterInfo of payload.filterList) {
						if (filterInfo.name === '所有告警') {
							filter = filterInfo.filter
							oelFilter = filterInfo.uuid
						}
					}
					if (filter.uuid === undefined) {
						filter = payload.filterList[0].filter
						oelFilter = payload.filterList[0].uuid
					}
					payload.qFilter = filterAdapter(filter, nonStringFields)
					payload.oelFilter = oelFilter
				}
			}

			//根据tagFilters生成过滤请求，追加到q后形成AND关系
			const tagFilters = yield select(state => state.oel.tagFilters)
			let qTagFilter = ''
			for (let [key, value] of tagFilters) {
				// let filterName = value.name.slice(0, 1).toUpperCase() + value.name.slice(1)
				let filterName = value.name
				//如果是日期型字段
				if (dateFields.indexOf(value.name) >= 0 || nonStringFields.indexOf(filterName) >= 0) {	//如果是日期字段
					qTagFilter += ` AND ${filterName} ${value.op} ${value.value}`
				} else { //如果是字符串字段
					let str = ` AND ${filterName} ${value.op} '${value.value}'`
					str = str.replace(new RegExp(/\%/, 'g'), '%25').replace(new RegExp(/\:/, 'g'), '%3A')
					qTagFilter += str
				}
			}
			//TOPO传入的地址栏参数进行查询sql语句转化
			if (payload.ip || payload.NodeAlias) {
				let val = payload.ip ? payload.ip : payload.NodeAlias
				qTagFilter += ` AND NodeAlias = '${val}'`
			} else if (payload.N_AppCode) {
				qTagFilter += ` AND N_AppCode = '${payload.N_AppCode}'`
			}

			//如果有orderBy排序要求，追加到sql后面
			let qOrderBy = ''
			if (payload.orderBy !== '' && payload.orderBy !== undefined) {
				qOrderBy = payload.orderBy
			} else {
				const orderBy = yield select(state => state.oel.orderBy)
				if (orderBy.length > 0) {
					qOrderBy = orderBy
				}
			}

			//如果有外部传入的限制条件，则使用外部限制条件。没有，则使用state中的条件
			let preFilter = ''
			if (!('preFilter' in payload)) {
				preFilter = yield select(state => state.oel.preFilter)
			} else {
				preFilter = payload.preFilter
			}

			//拼装查询sql = 过滤器sql + 标签sql + 外部传入的过滤条件 + orderBy
			payload.whereSQL = `(${payload.qFilter})${qTagFilter} ${preFilter} ${qOrderBy}`


			//给导航栏的数据源下拉列表赋值（每次请求都会动态取值）
			const datasourceList = yield select(state => state.oel.datasourceList)
			if (datasourceList.length === 0 || payload.forceGetDatasources === true) {
				const datasources = branchType == 'XYK' ? yield call(xykqueryAllosts, {}) : yield call(queryAllosts, {})
				payload.datasourceList = datasources.content
			}

			//如果默认数据源为空，即oel初始化时，从后端数据源列表中取第一个oel数据源
			const oelDatasource = yield select(state => state.oel.oelDatasource)
			if (payload.oelDatasource === undefined && oelDatasource === '' && payload.datasourceList.length > 0) {
				payload.oelDatasource = payload.datasourceList[0].uuid
			} else if (payload.oelDatasource === undefined && oelDatasource === '' && payload.datasourceList.length === 0) {
				message.error('系统没有配置任何告警数据源')
				return
			} else if (payload.oelDatasource === undefined && oelDatasource !== '') {
				payload.oelDatasource = oelDatasource
			}

			//视图列表
			const viewList = yield select(state => state.oel.viewList)
			const oelViewer = yield select(state => state.oel.oelViewer)
			const oelColumns = yield select(state => state.oel.oelColumns)

			if (viewList.length === 0 || payload.forceGetViews === true || payload.forceGetCurrentView === true) {
				const viewers = branchType == 'XYK' ? yield call(xykqueryAllViews, {}) : yield call(queryAllViews, {})
				payload.viewList = viewers.content
			}

			//视图
			if (payload.oelViewer !== undefined && (payload.oelViewer !== oelViewer || oelColumns.length === 0)) {
				//如果传过来的视图id和老的视图id不一样，发起请求到后台获取视图对象
				const viewer = branchType == 'XYK' ? yield call(xykqueryViewer, payload) : yield call(queryViewer, payload)
				payload.oelColumns = JSON.parse(viewer.selectedCols)
			} else if ((payload.oelViewer === undefined && oelViewer !== '' && oelColumns.length === 0) || payload.forceGetCurrentView === true) {
				//如果state里有视图uuid，查询字符串为空，则后端请求
				const viewer = branchType == 'XYK' ? yield call(xykqueryViewer, { oelViewer }) : yield call(queryViewer, { oelViewer })
				payload.oelColumns = JSON.parse(viewer.selectedCols)
			} else if ((payload.oelViewer === undefined || payload.oelViewer === '') && (oelViewer === '')) {
				if (payload.viewList.length > 0) {
					payload.oelViewer = payload.viewList[0].uuid
					payload.oelColumns = JSON.parse(payload.viewList[0].selectedCols)
				}
			}

			//工具集合列表
			const toolList = yield select(state => state.oel.toolList)
			if (toolList.length === 0) {
				const tools = branchType == 'XYK' ? yield call(xykqueryTool, {}) : yield call(queryTool, {})
				payload.toolList = tools.content
			}
			// 查询高业务影响告警的数量 start
			let impactFilterList = []
			if(filterList.length > 0){
				impactFilterList = filterList
			}else{
				impactFilterList = payload.filterList
			}
			let impactFilter = impactFilterList.filter((item) => {
				return item.uuid == 'edfa5699-4814-4245-9ea1-b9e4b17eff53'
			})
			let whereSQL = (impactFilter.length > 0 && impactFilter[0].filter.filterItems.length > 0) ? impactFilter[0].filter.filterItems[0].value + ' order by FirstOccurrence desc': "(Type = 1 or Type = 20) and (OZ_Service_Impact = 1 or OZ_Service_Impact = 2) and ((N_RecoverType = 1 and N_MaintainStatus = 2 and Severity > 0) or N_MaintainStatus = 0)  order by FirstOccurrence desc"
			let impactPayload = {
				whereSQL: whereSQL,
				oelDatasource: payload.oelDatasource,
				page: 0,
				pageSize: 1,
			}
			const Service_Impact = branchType == 'XYK' ? yield call(xykquery, impactPayload) : yield call(query, impactPayload)
			if (Service_Impact.success) {
				payload.Service_Impact_Num = Service_Impact.alertsResponse.page.totalElements
			}
			//查询高业务影响告警的数量 end
			// 查询告警热点数量 start
			let HotPotFilter = impactFilterList.filter((item) => {
				return item.uuid == '28f6be1b-1534-45a0-bc7a-07d91665bb22'
			})
			let HotPotwhereSQL = (HotPotFilter.length > 0 && HotPotFilter[0].filter.filterItems.length > 0) ? HotPotFilter[0].filter.filterItems[0].value + ' order by FirstOccurrence desc': "(AlertGroup not like 'Gateway' ) and (oz_eventtype != 0 ) order by FirstOccurrence desc"
			
			let HotPotPayload = {
				whereSQL: HotPotwhereSQL,
				oelDatasource: payload.oelDatasource,
				page: 0,
				pageSize: 1,
			}
			const HotPotData = yield call(queryHint, HotPotPayload)
			
			if(HotPotData.success){
				payload.HotPotNum = HotPotData.alertsResponse.alertList.length
			}
			// 查询告警热点数量 end
			payload.pagination.current = payload.pagination.current - 1
			const data = branchType == 'XYK' ? yield call(xykquery, payload) : yield call(query, payload)
			if (data.success) {
				if (data.alertsResponse === undefined) {
					message.error('后端没有返回告警信息')
					return
				}
				const { alertsResponse: res, osUuid: newOsUuid } = data
				//每次都强制删除刷新数据源列表的标记
				delete payload.forceGetDatasources
				delete payload.forceGetFilters
				delete payload.forceGetViews
				delete payload.forceGetCurrentView

				//获取各个不同severity告警数目，展现在右上角的下拉列表中
				let filteredSeverityMap = new Map()
				if ('severityMap' in res) {
					filteredSeverityMap.set('s0', res.severityMap['0'] ? res.severityMap['0'] : 0)
					filteredSeverityMap.set('s1', res.severityMap['1'] ? res.severityMap['1'] : 0)
					filteredSeverityMap.set('s2', res.severityMap['2'] ? res.severityMap['2'] : 0)
					filteredSeverityMap.set('s3', res.severityMap['3'] ? res.severityMap['3'] : 0)
					filteredSeverityMap.set('s4', res.severityMap['4'] ? res.severityMap['4'] : 0)
					filteredSeverityMap.set('s100', res.severityMap['100'] ? res.severityMap['100'] : 0)
					filteredSeverityMap.set('all', res.page.totalElements ? res.page.totalElements : 0)
				} else {
					filteredSeverityMap.set('s0', 0)
					filteredSeverityMap.set('s1', 0)
					filteredSeverityMap.set('s2', 0)
					filteredSeverityMap.set('s3', 0)
					filteredSeverityMap.set('s4', 0)
					filteredSeverityMap.set('s100', 0)
					filteredSeverityMap.set('all', 0)
				}

				payload.list = res.alertList === undefined ? [] : res.alertList
				payload.filteredSeverityMap = filteredSeverityMap
				payload.osUuid = newOsUuid
				payload.pagination.current = res.page.number + 1
				payload.pagination.total = res.page.totalElements
				payload.pagination.pageSize = res.page.pageSize
				payload.pagination.totalPages = res.page.totalPages

				yield put({
					type: 'querySuccess',
					payload,
				})
			} else {
				message.error(data.msg)
				payload.list = []
				payload.filteredSeverityMap = new Map()

				payload.pagination.current = 1
				payload.pagination.total = 0
				payload.pagination.pageSize = 0
				payload.pagination.totalPages = 0

				yield put({
					type: 'updateState',
					payload,
				})
				//return
			}
		},
		/**
		 * 工单发送
		 * 与后台交互,调用后台接口 /api/v1/em/ticket/ 获取数据
		 * @function oel.sendOuts
		 */
		* sendOuts({ payload }, { put, call }) {
			const data = yield call(sendOuts, payload)
			if (data.success) {
				if (data.errList.length > 0) {
					message.error(data.errList)
					yield put({
						type: 'updateState',
						payload: {
							alertType: 'error',
							alertMessage: `工单发送失败! 失败原因：${data.errList}`,
						},
					})
				} else if (data.sheetNo.length > 0) {
					message.success('工单发送成功')
					yield put({
						type: 'updateState',
						payload: {
							workOrderVisible: false,
							alertType: 'success',
							alertMessage: '工单发送成功',
						},
					})
				}
			} else {
				throw data
			}
		},
		/**
		 * 告警跟踪
		 * 与后台交互,调用接口  /api/v1/em/all 获取数据
		 * @function oel.alarmProcess
		 */
		* alarmProcess({ payload }, { put, call }) {
			const data = yield call(alarmProcessServ, payload)
			if (data.success) {
				message.success(data.message)
				if (data.message == '执行【开启告警跟踪】动作成功！') {
					window.open('/oelTrack', '告警跟踪', '', 'false')
				}
				yield put({
					type: 'query',
					payload: { ...payload },
				})
			} else {
				message.error(data.message)
			}
		},
		*knowledges({ payload }, { put, call }) {
			const data = yield call(knowledges, payload)
			if (data.status == '200' && (data.data != null || data.data != undefined) && data.data.alarmRecommendation.length > 0) {
				yield put({
					type: 'updateState',
					payload: {
						knowledges: data.data.alarmRecommendation
					}
				})
			} else {
				yield put({
					type: 'updateState',
					payload: {
						knowledges: []
					}
				})
				throw data.msg
			}
		},
		*getHistoryJournal({ payload }, { put, call }) {
			let data = yield call(historyJournal, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						DisposalDataSource: data.content,
						DisposalPagination: {											//事件处置记录
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
						},
						curDetailTabKey: '2',
					},
				})
			}
		},
		* queryApp({ payload }, { call, put }) {
			const data = yield call(queryApp, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						appNameList: data.content,
						fetchingApp: false,
					},
				})
			}
		}, //queryQita
		/* 
			告警根因分析 传参数 通过告警id获取故障id ，跳转
		*/
		* getRecommendAddres({ payload }, { call, put }) {
			const data = yield call(queryRecommend, payload)
			if (data.success) {
				if(data.data && data.data.failureCodes && data.data.failureCodes.length > 0 ){
					let id = data.data.failureCodes[0]
					window.open(`http://10.218.34.27:21080/problem/${id}?token=${token.oda_token}`)
				}else{
					message.warning('该告警没有对应的根因分析')
				}
			}else{
				throw data
			}
		},
		* outCallResult({ payload }, { call, put }) {
			const data = yield call(outCall, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						callOutList: data.list,
					},
				})
			}
		}, 
		* getOutcallUser({ payload }, { call, put }) {
			const data = yield call(outCalluser, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						callUsers: data.alarmCallUsers || [],
					},
				})
			}
		}, 
	},

	reducers: {
		//浏览列表
		querySuccess(state, { payload }) {
			return { ...state, ...payload }
		},

		updateState(state, action) {
			return { ...state, ...action.payload }
		},
		setState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
