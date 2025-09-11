import queryString from "query-string";
import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay, queryLos, queryES } from '../services/dashboard'
import { ESFindIndex } from '../utils/FunctionTool'
import { message } from 'antd'
import moment from 'moment'
import { queryFault } from '../services/historyview'
export default {

	namespace: 'netfireWall',

	state: {
		q: '',
		item: {},
		contents: [],

		intervalCPU: '',
		startCPU: 0,
		endCPU: 0,
		xAxisCPU: [],
		yAxisCPU: [],

		intervalMemory: '',
		startMemory: 0,
		endMemory: 0,
		xAxisMemory: [],
		yAxisMemory: [],

		intervalNewSession: '',
		startNewSession: 0,
		endNewSession: 0,
		xAxisNewSession: [],
		yAxisNewSession: [],

		intervalConcurrentSession: '',
		startConcurrentSession: 0,
		endConcurrentSession: 0,
		xAxisConcurrentSession: [],
		yAxisConcurrentSession: [],

		intervalResponseTime: '',
		startResponseTime: 0,
		endResponseTime: 0,
		xAxisResponseTime: [],
		yAxisResponseTime: [],

		intervalPacketLoss: '',
		startPacketLoss: 0,
		endPacketLoss: 0,
		xAxisPacketLoss: [],
		yAxisPacketLoss: [],

		alarmDataSource: [],
		paginationAlarm: {
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数
		},
		interfacerSource: [],
		interfacerPagination: {
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数
		},
		uuid: '',
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/netfireWall') {
					let queryState = location.search.split('q==')[1].split(';')
					dispatch({ type: 'query', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryCPU', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })

					dispatch({ type: 'querymemory', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryNewSession', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryConcurrentSession', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryAlarm', payload: { neUUID: queryState[0] } })
					dispatch({ type: 'netFireWallResponseTime', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'netFireWallPacketLoss', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryAllInterfacer', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
				}
			})
		}
	},

	effects: {
		//获取单个设备的信息
		*query({ payload }, { put, call }) {
			let findFireWall = peformanceCfg.findFireWall
			findFireWall.query.bool.must = []
			findFireWall.query.bool.must.push({ term: { hostip: payload.hostip } })
			findFireWall.query.bool.must.push({ term: { keyword: payload.keyword } })
			findFireWall.query.bool.must.push({ term: { branchname: payload.branchname } })
			const data = yield call(queryByDay, findFireWall)
			let item = {}
			let contents = []
			if (data.hits.hits.length > 0) {
				item = data.hits.hits[0]._source
				contents = [
					{ label: '主机名', span: 1, color: 'blue', content: item.hostname },
					{ label: '所属分类', span: 1, color: 'blue', content: item.component },
					{ label: '设备IP', span: 1, color: 'blue', content: item.hostip },
					{ label: '对象关键字', span: 1, color: 'blue', content: item.keyword },
					{ label: '所属应用', span: 1, color: 'blue', content: item.appname },
					{ label: '应用编码', span: 1, color: 'blue', content: item.appcode }
				]
			} else {
				message.error('错误！    code:500!')
			}
			yield put({
				type: 'setState',
				payload: {
					item: item,
					content: contents
				}
			})
		},
		//获取cpu的数据
		*queryCPU({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startCPU = yield select(({ netfireWall }) => netfireWall.startCPU)
			let endCPU = yield select(({ netfireWall }) => netfireWall.endCPU)
			let intervalCPU = yield select(({ netfireWall }) => netfireWall.intervalCPU)
			let netFireWallCPU = peformanceCfg.netFireWallCPU
			netFireWallCPU.query.bool.must = []
			netFireWallCPU.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			netFireWallCPU.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			netFireWallCPU.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			netFireWallCPU.query.bool.must.push({ "term": { "kpiname": "CPU利用率" } })
			netFireWallCPU.aggs.clock_value.date_histogram.interval = intervalCPU === '' ? '5m' : intervalCPU
			if (startCPU !== 0 && endCPU !== 0) {
				netFireWallCPU.query.bool.must.push({ "range": { "clock": { "gt": startCPU, "lt": endCPU } } })
			} else {
				netFireWallCPU.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startCPU !== 0 && endCPU !== 0 && startCPU !== undefined && endCPU !== undefined) {
				paths = ESFindIndex(startCPU * 1000, endCPU * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = netFireWallCPU
			queryParams.paths = paths
			// const data = yield call (queryLos, netFireWallCPU)
			const data = yield call(queryES, queryParams)
			if (data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0) {
				for (let item of data.aggregations.clock_value.buckets) {
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload: {
					xAxisCPU: xAxis,
					yAxisCPU: yAxis
				}
			})
		},
		//获取内存数据
		*querymemory({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startMemory = yield select(({ netfireWall }) => netfireWall.startMemory)
			let endMemory = yield select(({ netfireWall }) => netfireWall.endMemory)
			let intervalMemory = yield select(({ netfireWall }) => netfireWall.intervalMemory)
			let netFireWallMemory = peformanceCfg.netFireWallMemory
			netFireWallMemory.query.bool.must = []
			netFireWallMemory.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			netFireWallMemory.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			netFireWallMemory.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			netFireWallMemory.query.bool.must.push({ "term": { "kpiname": "内存利用率" } })
			netFireWallMemory.aggs.clock_value.date_histogram.interval = intervalMemory === '' ? '5m' : intervalMemory
			if (startMemory !== 0 && endMemory !== 0) {
				netFireWallMemory.query.bool.must.push({ "range": { "clock": { "gt": startMemory, "lt": endMemory } } })
			} else {
				netFireWallMemory.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startMemory !== 0 && endMemory !== 0 && startMemory !== undefined && endMemory !== undefined) {
				paths = ESFindIndex(startMemory * 1000, endMemory * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = netFireWallMemory
			queryParams.paths = paths
			// const data = yield call (queryLos, netFireWallMemory)
			const data = yield call(queryES, queryParams)
			if (data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0) {
				for (let item of data.aggregations.clock_value.buckets) {
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload: {
					xAxisMemory: xAxis,
					yAxisMemory: yAxis
				}
			})
		},
		//新建会话数
		*queryNewSession({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startNewSession = yield select(({ netfireWall }) => netfireWall.startNewSession)
			let endNewSession = yield select(({ netfireWall }) => netfireWall.endNewSession)
			let intervalNewSession = yield select(({ netfireWall }) => netfireWall.intervalNewSession)
			let netFireWallNewSession = peformanceCfg.netFireWallNewSession
			netFireWallNewSession.query.bool.must = []
			netFireWallNewSession.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			netFireWallNewSession.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			netFireWallNewSession.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			netFireWallNewSession.query.bool.must.push({ "term": { "kpiname": "防火墙新建Session" } })
			netFireWallNewSession.aggs.clock_value.date_histogram.interval = intervalNewSession === '' ? '1s' : intervalNewSession
			if (startNewSession !== 0 && endNewSession !== 0) {
				netFireWallNewSession.query.bool.must.push({ "range": { "clock": { "gt": startNewSession, "lt": endNewSession } } })
			} else {
				netFireWallNewSession.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startNewSession !== 0 && endNewSession !== 0 && startNewSession !== undefined && endNewSession !== undefined) {
				paths = ESFindIndex(startNewSession * 1000, endNewSession * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = netFireWallNewSession
			queryParams.paths = paths
			// const data = yield call (queryLos, netFireWallNewSession)
			const data = yield call(queryES, queryParams)
			if (data.aggregations && data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0) {
				for (let item of data.aggregations.clock_value.buckets) {
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload: {
					xAxisNewSession: xAxis,
					yAxisNewSession: yAxis
				}
			})
		},
		//并发会话数
		*queryConcurrentSession({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startConcurrentSession = yield select(({ netfireWall }) => netfireWall.startConcurrentSession)
			let endConcurrentSession = yield select(({ netfireWall }) => netfireWall.endConcurrentSession)
			let intervalConcurrentSession = yield select(({ netfireWall }) => netfireWall.intervalConcurrentSession)
			let netFireWallConcurrentSession = peformanceCfg.netFireWallConcurrentSession
			netFireWallConcurrentSession.query.bool.must = []
			netFireWallConcurrentSession.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			netFireWallConcurrentSession.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			netFireWallConcurrentSession.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			netFireWallConcurrentSession.query.bool.must.push({ "term": { "kpiname": "防火墙并发Session" } })
			netFireWallConcurrentSession.aggs.clock_value.date_histogram.interval = intervalConcurrentSession === '' ? '1s' : intervalConcurrentSession
			if (startConcurrentSession !== 0 && endConcurrentSession !== 0) {
				netFireWallConcurrentSession.query.bool.must.push({ "range": { "clock": { "gt": startConcurrentSession, "lt": endConcurrentSession } } })
			} else {
				netFireWallConcurrentSession.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startConcurrentSession !== 0 && endConcurrentSession !== 0 && startConcurrentSession !== undefined && endConcurrentSession !== undefined) {
				paths = ESFindIndex(startConcurrentSession * 1000, endConcurrentSession * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = netFireWallConcurrentSession
			queryParams.paths = paths
			// const data = yield call (queryLos, netFireWallConcurrentSession)
			const data = yield call(queryES, queryParams)
			if (data.aggregations && data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0) {
				for (let item of data.aggregations.clock_value.buckets) {
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload: {
					xAxisConcurrentSession: xAxis,
					yAxisConcurrentSession: yAxis
				}
			})
		},
		//防火墙响应时间查询
		*netFireWallResponseTime({ payload }, { call, put, select }) {
			let xAxis = []
			let yAxis = []
			let startResponseTime = yield select(({ netfireWall }) => netfireWall.startResponseTime)
			let endResponseTime = yield select(({ netfireWall }) => netfireWall.endResponseTime)
			let intervalResponseTime = yield select(({ netfireWall }) => netfireWall.intervalResponseTime)
			let netFireWallResponseTime = peformanceCfg.netFireWallResponseTime
			netFireWallResponseTime.query.bool.must = []
			netFireWallResponseTime.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			netFireWallResponseTime.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			netFireWallResponseTime.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			netFireWallResponseTime.query.bool.must.push({ "term": { "kpiname": "PING响应时间" } })
			netFireWallResponseTime.aggs.clock_value.date_histogram.interval = intervalResponseTime === '' ? '5m' : intervalResponseTime
			if (startResponseTime !== 0 && endResponseTime !== 0) {
				netFireWallResponseTime.query.bool.must.push({ "range": { "clock": { "gt": startResponseTime, "lt": endResponseTime } } })
			} else {
				netFireWallResponseTime.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startResponseTime !== 0 && endResponseTime !== 0 && startResponseTime !== undefined && endResponseTime !== undefined) {
				paths = ESFindIndex(startResponseTime * 1000, endResponseTime * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = netFireWallResponseTime
			queryParams.paths = paths
			// const data = yield call (queryLos, netFireWallResponseTime)
			const data = yield call(queryES, queryParams)
			if (data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0) {
				for (let item of data.aggregations.clock_value.buckets) {
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value ? item.avg_value.value.toFixed(2) * 1000 : '-')
				}
			}
			yield put({
				type: 'setState',
				payload: {
					xAxisResponseTime: xAxis,
					yAxisResponseTime: yAxis
				}
			})
		},
		//防火墙丢包率
		*netFireWallPacketLoss({ payload }, { call, put, select }) {
			let xAxis = []
			let yAxis = []
			let startPacketLoss = yield select(({ netfireWall }) => netfireWall.startPacketLoss)
			let endPacketLoss = yield select(({ netfireWall }) => netfireWall.endPacketLoss)
			let intervalPacketLoss = yield select(({ netfireWall }) => netfireWall.intervalPacketLoss)
			let netFireWallPacketLoss = peformanceCfg.netFireWallPacketLoss
			netFireWallPacketLoss.query.bool.must = []
			netFireWallPacketLoss.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			netFireWallPacketLoss.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			netFireWallPacketLoss.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			netFireWallPacketLoss.query.bool.must.push({ "term": { "kpiname": "PING丢包率" } })
			netFireWallPacketLoss.aggs.clock_value.date_histogram.interval = intervalPacketLoss === '' ? '5m' : intervalPacketLoss
			if (startPacketLoss !== 0 && endPacketLoss !== 0) {
				netFireWallPacketLoss.query.bool.must.push({ "range": { "clock": { "gt": startPacketLoss, "lt": endPacketLoss } } })
			} else {
				netFireWallPacketLoss.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startPacketLoss !== 0 && endPacketLoss !== 0 && startPacketLoss !== undefined && endPacketLoss !== undefined) {
				paths = ESFindIndex(startPacketLoss * 1000, endPacketLoss * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = netFireWallPacketLoss
			queryParams.paths = paths
			// const data = yield call (queryLos, netFireWallPacketLoss)
			const data = yield call(queryES, queryParams)
			if (data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0) {
				for (let item of data.aggregations.clock_value.buckets) {
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload: {
					xAxisPacketLoss: xAxis,
					yAxisPacketLoss: yAxis
				}
			})
		},
		//查询告警
		* queryAlarm({ payload }, { call, put }) {
			payload.uuid = payload.neUUID
			let newData = {}
			if (payload.page) {
				newData.page = payload.page
			}
			if (payload.pageSize) {
				newData.pageSize = payload.pageSize
			}
			let end = moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
			let statr = moment(Date.parse(new Date()) / 1000 - 259200, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
			let firstOccurrence = `firstOccurrence=timein=(${statr},${end})`
			newData.q = `nodeAlias == '${payload.uuid}';` + firstOccurrence
			newData.sort = 'firstOccurrence,desc'
			const data = yield call(queryFault, newData)
			if (data.success) {
				yield put({
					type: 'showModal',
					payload: {
						alarmDataSource: data.content,
						paginationAlarm: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
						},
						uuid: payload.uuid,
						//branch: payload.branch,
					},
				})
			}
		},
		*queryAllInterfacer({ payload }, { call, put, select }) {
			let queryAllInterfacer = peformanceCfg.queryAllInterfacer
			queryAllInterfacer.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			const data = yield call(queryLos, queryAllInterfacer)
			console.log('数据：', data)
			let source = []
			let buckets = []
			if (data.aggregations.group_kpiname.buckets && data.aggregations.group_kpiname.buckets.length > 0) {
				buckets = data.aggregations.group_kpiname.buckets
				for (let item of buckets) {
					let fireWallInterfacer = {}
					let kpiBuckets = []
					fireWallInterfacer.moname = item.key
					if (item.group_kpiname.buckets && item.group_kpiname.buckets.length > 0) {
						kpiBuckets = item.group_kpiname.buckets
						for (let kpiInfo of kpiBuckets) {
							switch (kpiInfo.key) {
								case '总行端口输出流量实际值':
									fireWallInterfacer.flowOut = kpiInfo.top_info.hits.hits[0]._source.value
									break;
								case '总行端口输入流量实际值':
									fireWallInterfacer.flowIn = kpiInfo.top_info.hits.hits[0]._source.value
									break
							}
						}
					}
					source.push(fireWallInterfacer)
				}
			}
			yield put({
				type: 'setState',
				payload: {
					interfacerSource: source,
					interfacerPagination: {
						total: source.length,
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: total => `共 ${total} 条`,
						pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
					}
				}
			})
		}
	},

	reducers: {
		setState(state, action) {
			return { ...state, ...action.payload }
		}
	}
}
