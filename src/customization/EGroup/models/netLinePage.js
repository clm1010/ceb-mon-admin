import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { queryByDay, queryLos } from '../../../services/dashboard'

export default {
	namespace: 'netLinePage',
	
	state:{
		q: '',
		item: [],
		pageHeadContent: [],
		rpingLossxAxis: [],
		rpingLossyAxis: [],
		lossStart: 0, 
		lossEnd: 0,
		intervalLoss: '',
		rpingTimexAxis: [],
		rpingTimeyAxis: [],
		timeStart: 0,
		timeEnd: 0,
		intervalTime: ''
	},
	//decodeURI()
	subscriptions:{
		setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname === '/dashboard/netLinePage') {
	        		let hostip = location.search.split('q==')[1].split(';')[0]
	        		let moname = decodeURI(location.search.split('q==')[1].split(';')[1])
	        		dispatch({ type: 'findLineInfo', payload:{ hostip: hostip, moname: moname}})
	        		dispatch({ type: 'rpingLoss', payload:{ hostip: hostip, moname: moname}})
	        		dispatch({ type: 'rpingTime', payload:{ hostip: hostip, moname: moname}})
	        	}
	      	})
    	}
	},
	
	effects:{ 
		//获取单个设备的基本信息 以及必要数据格式
		*findLineInfo ( { payload }, { call, put, select } ) {
			let netLinePageMo = peformanceCfg.netLinePageMo
			let must = []
			netLinePageMo.query.bool.must = []
			must.push({ term: { hostip: payload.hostip } })
			must.push({ term: { moname: payload.moname } })
			netLinePageMo.query.bool.must = must
			const mo = yield call ( queryByDay, netLinePageMo )
			let item = {}
  			let contents = []
  			if(mo.hits.hits.length > 0){
  				item = mo.hits.hits[0]._source
  				contents = [
  					{label: '主机名', span: 1, color: 'blue', content: item.hostname},
  					{label: '所属分类', span: 1, color: 'blue', content: item.component},
  					{label: '本端IP', span: 1, color: 'blue', content: item.hostip},
  					{label: '对端IP', span: 1, color: 'blue', content: item.keyword.split('-->')[1]},
  					{label: '所属应用', span: 1, color: 'blue', content: item.appname}
  				]
  			}
			yield put({
				type: 'setState',
				payload:{
					item: item,
					pageHeadContent:contents
				}
			})
		},
		
		//rping丢包率
		*rpingLoss ( { payload }, { call, put, select } ) {
			let lossStart = yield select(({ netLinePage }) => netLinePage.lossStart)
  			let lossEnd = yield select(({ netLinePage }) => netLinePage.lossEnd)
  			let intervalLoss = yield select(({ netLinePage }) => netLinePage.intervalLoss)
			let netLinePageRpingLoss = peformanceCfg.netLinePageRpingLoss
			let must = []
			let xAxis = []
			let yAxis = []
			netLinePageRpingLoss.query.bool.must = []
			must.push({ 'term': { 'hostip': payload.hostip } })
			must.push({ 'term': { 'moname': payload.moname } })
			must.push({ 'term': { 'kpiname': 'RPING丢包率' } })
			if(lossStart !== 0 && lossEnd !== 0){
				must.push({"range":{"clock":{ "gt":lossStart, "lt": lossEnd}}})
			}else{
				must.push({"range":{"clock":{ "gt":Date.parse(new Date()) /1000 - 7200}}})
			}
			netLinePageRpingLoss.query.bool.must = must
			netLinePageRpingLoss.aggs.clock_value.date_histogram.interval = intervalLoss === '' ? '1m' : intervalLoss
			const data = yield call (queryLos, netLinePageRpingLoss)
			if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
				for(let item of data.aggregations.clock_value.buckets){
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put ({
				type: 'setState',
				payload:{
					rpingLossxAxis : xAxis,
					rpingLossyAxis : yAxis
				}
			}) 
		},
		
		//rping响应时间
		*rpingTime ({ payload }, { call, put, select }){
			let timeStart = yield select(({ netLinePage }) => netLinePage.timeStart)
  			let timeEnd = yield select(({ netLinePage }) => netLinePage.timeEnd)
  			let intervalTime = yield select(({ netLinePage }) => netLinePage.intervalTime)
			let netLinePageRpingTime = peformanceCfg.netLinePageRpingTime
			let must = []
			let xAxis = []
			let yAxis = []
			netLinePageRpingTime.query.bool.must = []
			must.push({ 'term': { 'hostip': payload.hostip } })
			must.push({ 'term': { 'moname': payload.moname } })
			must.push({ 'term': { 'kpiname': 'RPING响应时间' } })
			if(timeStart !== 0 && timeEnd!== 0){
				must.push({"range":{"clock":{ "gt":timeStart, "lt": timeEnd}}})
			}else{
				must.push({"range":{"clock":{ "gt":Date.parse(new Date()) /1000 - 7200}}})
			}
			netLinePageRpingTime.query.bool.must = must
			netLinePageRpingTime.aggs.clock_value.date_histogram.interval = intervalTime === '' ? '1m' : intervalTime
			const data = yield call (queryLos, netLinePageRpingTime)
			if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
				for(let item of data.aggregations.clock_value.buckets){
					xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
					yAxis.push(item.avg_value.value)
				}
			}
			yield put ({
				type: 'setState',
				payload:{
					rpingTimexAxis : xAxis,
					rpingTimeyAxis : yAxis
				}
			}) 
		}
	},
	
	reducers:{ 
		setState (state, action) {
      		return { ...state, ...action.payload }
        }
	}
}
