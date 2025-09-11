import { query, sql, alarmProcessServ, getJournal } from '../services/alarms'
import { queryAllosts } from '../services/osts'
import { queryAllViews, queryViewer } from '../services/eventviews'
import { queryTool } from '../services/oelToolset'
import { sendOuts } from '../services/ticket'

import { message } from 'antd'
import { config } from '../utils'
import queryString from "query-string";

const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns

export default {

  namespace: 'oelCust',

  state: {
    title: '未恢复告警列表',													// 弹出页标题
    filterDisable: 'false',												// 过滤器下拉列表是否禁用
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
	q: '',											// 这是一个外部传入oel的查询条件，和内部条件组合使用。
  },

  subscriptions: {
    setup ({ dispatch, history }) {
		history.listen((location) => {
			if (location.pathname.includes('/oel')) {
        const query = queryString.parse(location.search);
				dispatch({
					type: 'query',
					payload: query,
				})
			}
		})
    },
  },

  effects: {
	* getJournal ({ payload }, { call, put, select }) {
		// 从state中找出数据源id和osid
		const oelDatasource = yield select(state => state.oelCust.oelDatasource)
		const osUuid = yield select(state => state.oelCust.osUuid)
		payload.osUuid = osUuid
		payload.uuid = oelDatasource

		const data = yield call(getJournal, payload)
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

  	* sqlTrigger ({ payload }, { call, put, select }) {
			// 从后台获取告警数据
			const data = yield call(sql, payload)

			let pagination = yield select(state => state.oelCust.pagination)
			let oelFilter = yield select(state => state.oelCust.oelFilter)
			let oelViewer = yield select(state => state.oelCust.oelViewer)
			let oelDatasource = yield select(state => state.oelCust.oelDatasource)
			let osUuid = yield select(state => state.oelCust.osUuid)
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

    * requery ({ payload }, { put }) {
        yield put({
	        type: query,
	        payload: { ...payload },
	      })
    },

    * getViewer ({ payload }, { call, put }) {
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

		* query ({ payload }, { call, put, select }) {
			//如果传过来的ObjectServer的Uuid不存在，则默认使用state里存储的uuid
			const osUuid = yield select(state => state.oelCust.osUuid)
			if (!('osUuid' in payload)) {
				payload.osUuid = osUuid
			}

			//取得非字符串类型字段名集合备用
			let nonStringFields = yield select(state => state.oelCust.nonStringFields)
			if (nonStringFields.length === 0) {
				for (let column of ViewColumns) {
					if (column.type !== 'string') {
						nonStringFields.push(column.key)
					}
				}
				payload.nonStringFields = nonStringFields
			}

			//取得日期类型字段名集合备用
			let dateFields = yield select(state => state.oelCust.dateFields)
			if (dateFields.length === 0) {
				for (let column of ViewColumns) {
					if (column.type == 'utc') {
						dateFields.push(column.key)
					}
				}
				payload.dateFields = dateFields
			}

			//分页数据
			let pagination = yield select(state => state.oelCust.pagination)
			pagination.current = pagination.current

			if (payload.pagination === undefined) {
				payload.pagination = pagination
			}

			//如果有orderBy排序要求，追加到sql后面
			let qOrderBy = ''
			if (payload.orderBy !== '' && payload.orderBy !== undefined) {
				qOrderBy = payload.orderBy
			} else {
				const orderBy = yield select(state => state.oelCust.orderBy)
				if (orderBy.length > 0) {
					qOrderBy = orderBy
				}
			}

			//如果有外部传入的限制条件，则使用外部限制条件。没有，则使用state中的条件
			let q = ''
			if (!('q' in payload)) {
			  q = yield select(state => state.oelCust.q)
			} else {
				q = payload.q
			}

			//拼装查询sql = 过滤器sql + 标签sql + 外部传入的过滤条件 + orderBy
			if (q !== undefined && q !== '') {
				payload.whereSQL = q + qOrderBy
			} else {
				payload.whereSQL = q
			}


			//给导航栏的数据源下拉列表赋值（每次请求都会动态取值）
			const datasourceList = yield select(state => state.oelCust.datasourceList)
			if (datasourceList.length === 0 || payload.forceGetDatasources === true) {
				const datasources = yield call(queryAllosts, {})
				payload.datasourceList = datasources.content
			}

			//如果默认数据源为空，即oel初始化时，从后端数据源列表中取第一个oel数据源
			const oelDatasource = yield select(state => state.oelCust.oelDatasource)
			if (payload.oelDatasource === undefined && oelDatasource === '' && payload.datasourceList.length > 0) {
				payload.oelDatasource = payload.datasourceList[0].uuid
			} else if (payload.oelDatasource === undefined && oelDatasource === '' && payload.datasourceList.length === 0) {
				message.error('系统没有配置任何告警数据源')
				return
			} else if (payload.oelDatasource === undefined && oelDatasource !== '') {
				payload.oelDatasource = oelDatasource
			}

      //视图列表
			const viewList = yield select(state => state.oelCust.viewList)
			const oelViewer = yield select(state => state.oelCust.oelViewer)
			const oelColumns = yield select(state => state.oelCust.oelColumns)

			if (viewList.length === 0 || payload.forceGetViews === true || payload.forceGetCurrentView === true) {
				const viewers = yield call(queryAllViews, {})
				payload.viewList = viewers.content
			}

			//视图
			if (payload.oelViewer !== undefined && (payload.oelViewer !== oelViewer || oelColumns.length === 0)) {
				//如果传过来的视图id和老的视图id不一样，发起请求到后台获取视图对象
				const viewer = yield call(queryViewer, payload)
				payload.oelColumns = JSON.parse(viewer.selectedCols)
			} else if ((payload.oelViewer === undefined && oelViewer !== '' && oelColumns.length === 0) || payload.forceGetCurrentView === true) {
				//如果state里有视图uuid，查询字符串为空，则后端请求
				const viewer = yield call(queryViewer, { oelViewer })
				payload.oelColumns = JSON.parse(viewer.selectedCols)
			} else if ((payload.oelViewer === undefined || payload.oelViewer === '') && (oelViewer === '')) {
				if (payload.viewList.length > 0) {
					payload.oelViewer = payload.viewList[0].uuid
					payload.oelColumns = JSON.parse(payload.viewList[0].selectedCols)
				}
			}

			//工具集合列表
			const toolList = yield select(state => state.oelCust.toolList)
			if (toolList.length === 0) {
				const tools = yield call(queryTool, {})
				payload.toolList = tools.content
			}

			payload.pagination.current = payload.pagination.current - 1
			const data = yield call(query, payload)
      if (data.success) {
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
    * sendOuts ({ payload }, { put, call }) {
    		const data = yield call(sendOuts, payload)
    		if (data.success) {
    				if (data.errList.length > 0) {
    					message.error('工单发送失败')
    					yield put({
    						type: 'updateState',
    						payload: {
    							 alertType: 'error',
   								 alertMessage: '工单发送失败',
    						},
    					})
    				} else if (data.sheetNo.length > 0) {
    					message.success('工单发送成功')
    					yield put({
    						type: 'updateState',
    						payload: {
    							 alertType: 'success',
   								 alertMessage: '工单发送成功',
    						},
    					})
    				}
    		} else {
    			throw data
    		}
    },
    * alarmProcess ({ payload }, { put, call }) {
    	const data = yield call(alarmProcessServ, payload)
    	if (data.success) {
    		message.success(data.message)
				yield put({
					type: 'query',
					payload: { ...payload },
				})
	    } else {
	    	message.error(data.message)
    	}
    },
  },

  reducers: {
  	//浏览列表
  	querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },

    updateState (state, action) {
      return { ...state, ...action.payload }
    },

  },

}
