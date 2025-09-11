import queryString from "query-string";
import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay, queryLos, queryES } from '../services/dashboard'
import { ESFindIndex } from '../utils/FunctionTool'
import { message } from 'antd'
import moment from 'moment'
import { queryFault } from '../services/historyview'
export default {

	namespace: 'singleSSLChar',

	state: {
		q: '',
		item: {},
		contents: [],

		intervalVS: '',
		startVS: 0,
		endVS: 0,
		xAxisVS: [],
		yAxisVS: [],

		intervalconn: '',
		startconn: 0,
		endconn: 0,
		xAxisconn: [],
		yAxisconn: [],

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

		alarmDataSource: [],
		paginationAlarm: {
			showSizeChanger: false,	//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`, //用于显示数据总量
			current: 1,					//当前页数
			total: null,				//数据总数
		},
		interfacerSource: [],
		interfacerPagination: {
			showSizeChanger: false,	//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,			//当前页数
			total: null,		//数据总数
		},
		uuid: '',
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/singleSSLChar') {
					let queryState = location.search.split('q==')[1].split(';')
					dispatch({ type: 'query', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryVS', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryconn', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryCPU', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'querymemory', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryAllInterfacer', payload: { hostip: queryState[0], keyword: queryState[1], branchname: queryState[2] } })
					dispatch({ type: 'queryAlarm', payload: { neUUID: queryState[0] } })
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
		//获取SSL-VS并发的数据
		*queryVS({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startVS = yield select(({ singleSSLChar }) => singleSSLChar.startVS)
			let endVS = yield select(({ singleSSLChar }) => singleSSLChar.endVS)
			let intervalVS = yield select(({ singleSSLChar }) => singleSSLChar.intervalVS)
			let singleSSLCharVS = peformanceCfg.singleSSLChar
			singleSSLCharVS.query.bool.must = []
			singleSSLCharVS.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			singleSSLCharVS.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			singleSSLCharVS.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			singleSSLCharVS.query.bool.must.push({ "term": { "kpiname": "SSL-VS并发" } })
			singleSSLCharVS.aggs.clock_value.date_histogram.interval = intervalVS === '' ? '5m' : intervalVS
			if (startVS !== 0 && endVS !== 0) {
				singleSSLCharVS.query.bool.must.push({ "range": { "clock": { "gt": startVS, "lt": endVS } } })
			} else {
				singleSSLCharVS.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startVS !== 0 && endVS !== 0 && startVS !== undefined && endVS !== undefined) {
				paths = ESFindIndex(startVS * 1000, endVS * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = singleSSLCharVS
			queryParams.paths = paths
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
					xAxisVS: xAxis,
					yAxisVS: yAxis
				}
			})
		},
		//获取SSL每秒连接数据
		*queryconn({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startconn = yield select(({ singleSSLChar }) => singleSSLChar.startconn)
			let endconn = yield select(({ singleSSLChar }) => singleSSLChar.endconn)
			let intervalconn = yield select(({ singleSSLChar }) => singleSSLChar.intervalconn)
			let singleSSLCharconn = peformanceCfg.singleSSLChar
			singleSSLCharconn.query.bool.must = []
			singleSSLCharconn.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			singleSSLCharconn.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			singleSSLCharconn.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			singleSSLCharconn.query.bool.must.push({ "term": { "kpiname": "SSL每秒连接" } })
			singleSSLCharconn.aggs.clock_value.date_histogram.interval = intervalconn === '' ? '5m' : intervalconn
			if (startconn !== 0 && endconn !== 0) {
				singleSSLCharconn.query.bool.must.push({ "range": { "clock": { "gt": startconn, "lt": endconn } } })
			} else {
				singleSSLCharconn.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startconn !== 0 && endconn !== 0 && startconn !== undefined && endconn !== undefined) {
				paths = ESFindIndex(startconn * 1000, endconn * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = singleSSLCharconn
			queryParams.paths = paths
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
					xAxisconn: xAxis,
					yAxisconn: yAxis
				}
			})
		},
		//获取cpu的数据
		*queryCPU({ payload }, { put, call, select }) {
			let xAxis = []
			let yAxis = []
			let startCPU = yield select(({ singleSSLChar }) => singleSSLChar.startCPU)
			let endCPU = yield select(({ singleSSLChar }) => singleSSLChar.endCPU)
			let intervalCPU = yield select(({ singleSSLChar }) => singleSSLChar.intervalCPU)
			let singleSSLCharCPU = peformanceCfg.singleSSLChar
			singleSSLCharCPU.query.bool.must = []
			singleSSLCharCPU.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			singleSSLCharCPU.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			singleSSLCharCPU.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			singleSSLCharCPU.query.bool.must.push({ "term": { "kpiname": "CPU利用率" } })
			singleSSLCharCPU.aggs.clock_value.date_histogram.interval = intervalCPU === '' ? '5m' : intervalCPU
			if (startCPU !== 0 && endCPU !== 0) {
				singleSSLCharCPU.query.bool.must.push({ "range": { "clock": { "gt": startCPU, "lt": endCPU } } })
			} else {
				singleSSLCharCPU.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startCPU !== 0 && endCPU !== 0 && startCPU !== undefined && endCPU !== undefined) {
				paths = ESFindIndex(startCPU * 1000, endCPU * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = singleSSLCharCPU
			queryParams.paths = paths
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
			let startMemory = yield select(({ singleSSLChar }) => singleSSLChar.startMemory)
			let endMemory = yield select(({ singleSSLChar }) => singleSSLChar.endMemory)
			let intervalMemory = yield select(({ singleSSLChar }) => singleSSLChar.intervalMemory)
			let singleSSLCharMemory = peformanceCfg.singleSSLChar
			singleSSLCharMemory.query.bool.must = []
			singleSSLCharMemory.query.bool.must.push({ "term": { "hostip": payload.hostip } })
			singleSSLCharMemory.query.bool.must.push({ "term": { "keyword": payload.keyword } })
			singleSSLCharMemory.query.bool.must.push({ "term": { "branchname": payload.branchname } })
			singleSSLCharMemory.query.bool.must.push({ "term": { "kpiname": "内存利用率" } })
			singleSSLCharMemory.aggs.clock_value.date_histogram.interval = intervalMemory === '' ? '5m' : intervalMemory
			if (startMemory !== 0 && endMemory !== 0) {
				singleSSLCharMemory.query.bool.must.push({ "range": { "clock": { "gt": startMemory, "lt": endMemory } } })
			} else {
				singleSSLCharMemory.query.bool.must.push({ "range": { "clock": { "gt": Date.parse(new Date()) / 1000 - 7200 } } })
			}
			let paths = ''
			let queryParams = { es: {}, paths: '' }
			if (startMemory !== 0 && endMemory !== 0 && startMemory !== undefined && endMemory !== undefined) {
				paths = ESFindIndex(startMemory * 1000, endMemory * 1000, 'u2performance-', 'day', '')//按时间生成索引
			} else {
				paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'u2performance-', 'day', '')
			}
			queryParams.es = singleSSLCharMemory
			queryParams.paths = paths
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
					type: 'setState',
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
