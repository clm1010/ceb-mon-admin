import queryString from "query-string";
import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { queryByDay, queryLos } from '../../../services/dashboard'
import { message } from 'antd'
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
	},
	
	subscriptions: {
    	setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname === '/netfireWall') {
	        		let queryState = location.search.split('q==')[1].split(';')
	         		dispatch({ type: 'query', payload:{ hostip: queryState[0], keyword: queryState[1],branchname: queryState[2]} })
	         		dispatch({ type: 'queryCPU', payload:{ hostip: queryState[0], keyword: queryState[1],branchname: queryState[2]} })
	         		
	         		dispatch({ type: 'querymemory', payload:{ hostip: queryState[0], keyword: queryState[1],branchname: queryState[2]} })
	         		dispatch({ type: 'queryNewSession', payload:{ hostip: queryState[0], keyword: queryState[1],branchname: queryState[2]} })
	         		dispatch({ type: 'queryConcurrentSession', payload:{ hostip: queryState[0], keyword: queryState[1],branchname: queryState[2]} })
	        	}
	      	})
    	}
  	},
  	
  	effects:{
  		//获取单个设备的信息
  		*query ({ payload },{ put,call }){
  			let findFireWall = peformanceCfg.findFireWall
  			findFireWall.query.bool.must = []
  			findFireWall.query.bool.must.push({ term: { hostip: payload.hostip } })
  			findFireWall.query.bool.must.push({ term: { keyword: payload.keyword } })
  			findFireWall.query.bool.must.push({ term: { branchname: payload.branchname } })
  			const data =  yield call ( queryByDay, findFireWall )
  			let item = {}
  			let contents = []
  			if(data.hits.hits.length > 0){
  				item = data.hits.hits[0]._source
  				contents = [
  					{label: '主机名', span: 1, color: 'blue', content: item.hostname},
  					{label: '所属分类', span: 1, color: 'blue', content: item.component},
  					{label: '设备IP', span: 1, color: 'blue', content: item.hostip},
  					{label: '对象关键字', span: 1, color: 'blue', content: item.keyword},
  					{label: '所属应用', span: 1, color: 'blue', content: item.appname},
  					{label: '应用编码', span: 1, color: 'blue', content: item.appcode}
  				]
  			}else{
  				message.error('错误！    code:500!')
  			}
  			yield put({
  				type: 'setState',
  				payload:{
  					item: item,
  					content: contents
  				}
  			})
  		},
  		//获取cpu的数据
  		*queryCPU ({ payload },{ put,call, select }) {
  			let xAxis = []
  			let yAxis = []
  			let startCPU = yield select(({ netfireWall }) => netfireWall.startCPU)
  			let endCPU = yield select(({ netfireWall }) => netfireWall.endCPU)
  			let intervalCPU = yield select(({ netfireWall }) => netfireWall.intervalCPU)
  			let netFireWallCPU = peformanceCfg.netFireWallCPU
  			netFireWallCPU.query.filtered.filter.bool.must = []
  			netFireWallCPU.query.filtered.filter.bool.must.push({"term":{"hostip":payload.hostip}})
  			netFireWallCPU.query.filtered.filter.bool.must.push({"term":{"keyword":payload.keyword}})
  			netFireWallCPU.query.filtered.filter.bool.must.push({"term":{"branchname":payload.branchname}})
  			netFireWallCPU.query.filtered.filter.bool.must.push({"term":{"kpiname": "CPU利用率"}})
  			netFireWallCPU.aggs.clock_value.date_histogram.interval = intervalCPU === '' ? '5m' : intervalCPU
  			if(startCPU !== 0 && endCPU !== 0){
  				netFireWallCPU.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":startCPU, "lt": endCPU}}})
  			}else{
  				netFireWallCPU.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":Date.parse(new Date()) / 1000 - 7200}}})
  			}
			const data = yield call (queryLos, netFireWallCPU)
			if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
				for(let item of data.aggregations.clock_value.buckets){
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload:{
					xAxisCPU: xAxis,
					yAxisCPU: yAxis
				}
			})
  		},
  		//获取内存数据
  		*querymemory ({ payload },{ put,call, select }) {
  			let xAxis = []
  			let yAxis = []
  			let startMemory = yield select(({ netfireWall }) => netfireWall.startMemory)
  			let endMemory = yield select(({ netfireWall }) => netfireWall.endMemory)
  			let intervalMemory = yield select(({ netfireWall }) => netfireWall.intervalMemory)
  			let netFireWallMemory = peformanceCfg.netFireWallMemory
  			netFireWallMemory.query.filtered.filter.bool.must = []
  			netFireWallMemory.query.filtered.filter.bool.must.push({"term":{"hostip":payload.hostip}})
  			netFireWallMemory.query.filtered.filter.bool.must.push({"term":{"keyword":payload.keyword}})
  			netFireWallMemory.query.filtered.filter.bool.must.push({"term":{"branchname":payload.branchname}})
  			netFireWallMemory.query.filtered.filter.bool.must.push({"term":{"kpiname": "内存利用率"}})
  			netFireWallMemory.aggs.clock_value.date_histogram.interval = intervalMemory === '' ? '5m' : intervalMemory
  			if(startMemory !== 0 && endMemory !== 0){
  				netFireWallMemory.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":startMemory, "lt": endMemory}}})
  			}else{
  				netFireWallMemory.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":Date.parse(new Date()) / 1000 - 7200}}})
  			}
			const data = yield call (queryLos, netFireWallMemory)
			if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
				for(let item of data.aggregations.clock_value.buckets){
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload:{
					xAxisMemory: xAxis,
					yAxisMemory: yAxis
				}
			})
  		},
  		//新建会话数
  		*queryNewSession ({ payload },{ put,call, select }) {
  			let xAxis = []
  			let yAxis = []
  			let startNewSession = yield select(({ netfireWall }) => netfireWall.startNewSession)
  			let endNewSession = yield select(({ netfireWall }) => netfireWall.endNewSession)
  			let intervalNewSession = yield select(({ netfireWall }) => netfireWall.intervalNewSession)
  			let netFireWallNewSession = peformanceCfg.netFireWallNewSession
  			netFireWallNewSession.query.filtered.filter.bool.must = []
  			netFireWallNewSession.query.filtered.filter.bool.must.push({"term":{"hostip":payload.hostip}})
  			netFireWallNewSession.query.filtered.filter.bool.must.push({"term":{"keyword":payload.keyword}})
  			netFireWallNewSession.query.filtered.filter.bool.must.push({"term":{"branchname":payload.branchname}})
  			netFireWallNewSession.query.filtered.filter.bool.must.push({"term":{"kpiname": "防火墙新建Session"}})
  			netFireWallNewSession.aggs.clock_value.date_histogram.interval = intervalNewSession === '' ? '5m' : intervalNewSession
  			if(startNewSession !== 0 && endNewSession !== 0){
  				netFireWallNewSession.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":startNewSession, "lt": endNewSession}}})
  			}else{
  				netFireWallNewSession.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":Date.parse(new Date()) / 1000 - 7200}}})
  			}
			const data = yield call (queryLos, netFireWallNewSession)
			if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
				for(let item of data.aggregations.clock_value.buckets){
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload:{
					xAxisNewSession: xAxis,
					yAxisNewSession: yAxis
				}
			})
  		},
  		//并发会话数
  		*queryConcurrentSession ({ payload },{ put,call, select }) {
  			let xAxis = []
  			let yAxis = []
  			let startConcurrentSession = yield select(({ netfireWall }) => netfireWall.startConcurrentSession)
  			let endConcurrentSession = yield select(({ netfireWall }) => netfireWall.endConcurrentSession)
  			let intervalConcurrentSession = yield select(({ netfireWall }) => netfireWall.intervalConcurrentSession)
  			let netFireWallConcurrentSession = peformanceCfg.netFireWallConcurrentSession
  			netFireWallConcurrentSession.query.filtered.filter.bool.must = []
  			netFireWallConcurrentSession.query.filtered.filter.bool.must.push({"term":{"hostip":payload.hostip}})
  			netFireWallConcurrentSession.query.filtered.filter.bool.must.push({"term":{"keyword":payload.keyword}})
  			netFireWallConcurrentSession.query.filtered.filter.bool.must.push({"term":{"branchname":payload.branchname}})
  			netFireWallConcurrentSession.query.filtered.filter.bool.must.push({"term":{"kpiname": "防火墙并发Session"}})
  			netFireWallConcurrentSession.aggs.clock_value.date_histogram.interval = intervalConcurrentSession === '' ? '5m' : intervalConcurrentSession
  			if(startConcurrentSession !== 0 && endConcurrentSession !== 0){
  				netFireWallConcurrentSession.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":startConcurrentSession, "lt": endConcurrentSession}}})
  			}else{
  				netFireWallConcurrentSession.query.filtered.filter.bool.must.push({"range":{"clock":{ "gt":Date.parse(new Date()) / 1000 - 7200}}})
  			}
			const data = yield call (queryLos, netFireWallConcurrentSession)
			if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
				for(let item of data.aggregations.clock_value.buckets){
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put({
				type: 'setState',
				payload:{
					xAxisConcurrentSession: xAxis,
					yAxisConcurrentSession: yAxis
				}
			})
  		},
  	},
  	
  	reducers: {
	 	setState (state, action) {
      		return { ...state, ...action.payload }
        }
  	}
}