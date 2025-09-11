import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay, queryUyun,queryES } from '../services/dashboard'
import { querylines } from '../services/mo/lines'
import { findIndex, ESFindIndex } from '../utils/FunctionTool'
import { message } from 'antd'
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
		intervalTime: '',
		sourceIn: [],
		startIn: 0,
		endIn: 0,
		comIn: '',
		sourceOut: [],
		startOut: 0,
		endOut: 0,
		comOut: '',
		portOutxAxis : [],
		portOutyAxis : [],
		portInxAxis : [],
		portInyAxis : []
	},
	//decodeURI()
	subscriptions:{
		setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname === '/dashboard/netLinePage') {
	        		let hostip = location.search.split('q==')[1].split(';')[0]
	        		let moname = decodeURI(location.search.split('q==')[1].split(';')[1])
	        		if(location.hash != '' && location.hash){
	        			moname = moname + location.hash
	        		}
	        		dispatch({ type: 'findLineInfo', payload:{ hostip: hostip, moname: moname}})
	        		dispatch({ type: 'rpingLoss', payload:{ hostip: hostip, moname: moname}})
	        		dispatch({ type: 'rpingTime', payload:{ hostip: hostip, moname: moname}})
	        		dispatch({ type: 'portIn', payload:{ hostip: hostip, moname: moname }})
	        		dispatch({ type: 'portOut', payload:{ hostip: hostip, moname: moname }})
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
			yield put({type:'portIn' ,payload:{ hostip: payload.hostip, moname: payload.moname }})
			yield put({type:'portOut' ,payload:{ hostip: payload.hostip, moname: payload.moname }})
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
			let paths = ''
			let queryParams = {es: {}, paths: '' }
			if(lossStart !== 0  && lossEnd!== 0 && lossStart !== undefined  && lossEnd!== undefined ){ 
				paths = ESFindIndex(lossStart*1000,lossEnd*1000,'u2performance-', 'day', '')//按时间生成索引
			}else{
				paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
			}
			queryParams.es = netLinePageRpingLoss
			queryParams.paths =paths
			// const data = yield call (queryLos, netLinePageRpingLoss)
			const data = yield call (queryES, queryParams)
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
			let paths = ''
			let queryParams = {es: {}, paths: '' }
			if(timeStart !== 0  && timeEnd!== 0 && timeStart !== undefined  && timeEnd!== undefined ){ 
				paths = ESFindIndex(timeStart*1000,timeEnd*1000,'u2performance-', 'day', '')//按时间生成索引
			}else{
				paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
			}
			queryParams.es = netLinePageRpingTime
			queryParams.paths =paths
			// const data = yield call (queryLos, netLinePageRpingTime)
			const data = yield call (queryES, queryParams)
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
		},
		//总行端口输入流量实际值
		*portIn ({ payload }, { call, put, select }){
			let q = `firstClass=='NETWORK';secondClass=='HA_LINE';name=='`+payload.moname+`';aaDeviceIP==*`+payload.hostip+'*'
			const lines = yield call ( querylines, { q: q } )

			let startIn = yield select(({ netLinePage }) => netLinePage.startIn)
			let endIn = yield select(({ netLinePage }) => netLinePage.endIn)
			let item = yield select(({ netLinePage }) => netLinePage.item)
			let intervalTime = yield select(({ netLinePage }) => netLinePage.intervalTime)
			let netLinePageRpingTime = peformanceCfg.netLinePageRpingTime
			let must = []
			let xAxis = []
			let yAxis = []
			if(lines.success && lines.content.length > 0){//查询对端接口
				let keyword = ''
				if(lines.content[0].mo.aaIntf){
					keyword = lines.content[0].mo.aaIntf.keyword
				}

				netLinePageRpingTime.query.bool.must = []
				must.push({ 'term': { 'hostip': payload.hostip } })
				must.push({ 'term': { 'keyword': keyword } })
				if(item.branchname == 'ZH'){
					must.push({ 'term': { 'kpiname': '总行端口输入流量实际值' } })
				}else{
					must.push({ 'term': { 'kpiname': '端口输入流量实际值' } })
				}
				if(startIn !== 0 && endIn!== 0){
					must.push({"range":{"clock":{ "gt":startIn, "lt": endIn}}})
				}else{
					must.push({"range":{"clock":{ "gt":Date.parse(new Date()) /1000 - 7200}}})
				}
				netLinePageRpingTime.query.bool.must = must
				netLinePageRpingTime.aggs.clock_value.date_histogram.interval = intervalTime === '' ? '1m' : intervalTime
				let paths = ''
				let queryParams = {es: {}, paths: '' }
				if(startIn !== 0  && endIn!== 0 && startIn !== undefined  && endIn!== undefined ){ 
					paths = ESFindIndex(startIn*1000,endIn*1000,'u2performance-', 'day', '')//按时间生成索引
				}else{
					paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
				}
				queryParams.es = netLinePageRpingTime
				queryParams.paths =paths
				const data = yield call (queryES, queryParams)
				if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
					for(let item of data.aggregations.clock_value.buckets){
						xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
						yAxis.push(item.avg_value.value / 1000)
					}
				}
			}else{
				message.error('线路查询失败！')
			}

			yield put ({
				type: 'setState',
				payload:{
					portInxAxis : xAxis,
					portInyAxis : yAxis
				}
			})
		},
		//总行端口输入流量实际值
		*portOut ({ payload }, { call, put, select }){
			let q = `firstClass=='NETWORK';secondClass=='HA_LINE';name=='`+payload.moname+`';aaDeviceIP==*`+payload.hostip+'*'
			const lines = yield call ( querylines, { q: q } )
			let item = yield select(({ netLinePage }) => netLinePage.item)
			let startOut = yield select(({ netLinePage }) => netLinePage.startOut)
			let endOut = yield select(({ netLinePage }) => netLinePage.endOut)
			let intervalTime = yield select(({ netLinePage }) => netLinePage.intervalTime)
			let netLinePageRpingTime = peformanceCfg.netLinePageRpingTime
			let must = []
			let xAxis = []
			let yAxis = []
			if(lines.success && lines.content.length > 0){//查询对端接口
				let keyword = ''
				if(lines.content[0].mo.aaIntf){
					keyword = lines.content[0].mo.aaIntf.keyword
				}

				netLinePageRpingTime.query.bool.must = []
				must.push({ 'term': { 'hostip': payload.hostip } })
				must.push({ 'term': { 'keyword': keyword } })
				if(item.branchname == 'ZH'){
					must.push({ 'term': { 'kpiname': '总行端口输出流量实际值' } })
				}else{
					must.push({ 'term': { 'kpiname': '端口输出流量实际值' } })
				}
				if(startOut !== 0 && endOut!== 0){
					must.push({"range":{"clock":{ "gt":startOut, "lt": endOut}}})
				}else{
					must.push({"range":{"clock":{ "gt":Date.parse(new Date()) /1000 - 7200}}})
				}
				netLinePageRpingTime.query.bool.must = must
				netLinePageRpingTime.aggs.clock_value.date_histogram.interval = intervalTime === '' ? '1m' : intervalTime
				let paths = ''
				let queryParams = {es: {}, paths: '' }
				if(startOut !== 0  && endOut!== 0 && startOut !== undefined  && endOut!== undefined ){ 
					paths = ESFindIndex(startOut*1000,endOut*1000,'u2performance-', 'day', '')//按时间生成索引
				}else{
					paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
				}
				queryParams.es = netLinePageRpingTime
				queryParams.paths =paths
				const data = yield call (queryES, queryParams)
				if(data.aggregations.clock_value && data.aggregations.clock_value.buckets.length > 0){
					for(let item of data.aggregations.clock_value.buckets){
						xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
						yAxis.push(item.avg_value.value / 1000)
					}
				}
			}else{
				message.error('线路查询失败！')
			}

			yield put ({
				type: 'setState',
				payload:{
					portOutxAxis : xAxis,
					portOutyAxis : yAxis
				}
			})
		},
		//uyun入方向流量
		* uyunFolwIn ({payload}, {call, put, select}) {
			let must = []
			let sourceIn = []
			let paths = '',types = 'ord'
			let querySql = {sql: {}, paths: '' }
			let queryInputInterface = peformanceCfg.queryInputInterface
			let queryAggsIn = peformanceCfg.queryAggsIn
			let q = `firstClass=='NETWORK';secondClass=='HA_LINE';name=='`+payload.moname+`';aaDeviceIP==*`+payload.hostip+'*'
			let startIn = yield select(({ netLinePage }) => netLinePage.startIn)
  			let endIn = yield select(({ netLinePage }) => netLinePage.endIn)
  			const lines = yield call ( querylines, { q: q } )
  			if(lines.success && lines.content.length > 0){//查询对端接口
  				let ports = ''
  			if(lines.content[0].mo.aaIntf){
  				ports = lines.content[0].mo.aaIntf.portName.split('/').join('-')
  			}
  			queryInputInterface.query.bool.must = []//开始拼装查询条件
  			queryAggsIn.query.bool.must = []
  			must.push({ "term": { "kpi_key": "kpi."+payload.hostip+"_"+ports+".zh_net_input_realvalue" } })
  			if(startIn !== 0 && endIn!== 0){
  				if(endIn - startIn > 86400){
  					types = 'aggs'
  					message.info('检索时间跨度更改,已为您切换算法!')
  				}
  				paths = findIndex(startIn*1000,endIn*1000,'uyundw_wl_baseline_sjmx_', 'month', 'http://10.1.71.127:9200')//按时间生成索引
					must.push({"range":{"timestamp":{ "gt":startIn*1000, "lt": endIn*1000}}})
				}else{
					paths = findIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'uyundw_wl_baseline_sjmx_', 'month', 'http://10.1.71.127:9200')
					must.push({"range":{"timestamp":{ "gt":Date.parse(new Date()) - 86400000, "lt": Date.parse(new Date())}}})
				}
				if(types === 'ord'){
					queryInputInterface.query.bool.must = must
					querySql.sql = queryInputInterface
					querySql.paths = paths
				}else{
					queryAggsIn.query.bool.must = must
					querySql.sql = queryAggsIn
					querySql.paths = paths
				}
				const data = yield call ( queryUyun, querySql )
				if(data.hits && data.hits && data.hits.hits.length > 0){
					sourceIn = data.hits.hits.map((item, index) =>{
						let state = ''
						if( item._source.upper && item._source.lower ){
							if( item._source.upper < item._source.value || item._source.value < item._source.lower ){
								state = '(abn)'
							}else{
								state = '(norm)'
							}
						}else{
							state = '(norm)'
						}
						return {
							com: item._source.value < 1024 ? 'B' : item._source.value < 1048576 ? 'K' : item._source.value < 1073741824 ? 'M' : 'G',
				  		upper: item._source.upper === null ? null : (item._source.upper < 1024*1024) ? (item._source.upper/1024).toFixed(2) : (item._source.upper/1024/1024).toFixed(2),
							lower: item._source.lower === null ? null : (item._source.lower < 1024*1024) ? (item._source.lower/1024).toFixed(2) : (item._source.lower/1024/1024).toFixed(2),
				  		value: item._source.value === null ? null : (item._source.value < 1024*1024) ? (item._source.value/1024).toFixed(2) : (item._source.value/1024/1024).toFixed(2),
				  		time: new Date(item._source.timestamp).format('yyyy-MM-dd hh:mm:ss')+ state
						}
					})
				}else if (data.aggregations && data.aggregations.clock_value && data.aggregations.clock_value.buckets && data.aggregations.clock_value.buckets.length > 0) {
					sourceIn = data.aggregations.clock_value.buckets.map((item, index) =>{
						let state = ''
						if( item.avg_upper.value && item.avg_lower.value ){
							if( item.avg_upper.value < item.avg_value.value || item.avg_value.value < item.avg_lower.value ){
								state = '(abn)'
							}else{
								state = '(norm)'
							}
						}else{
							state = '(norm)'
						}
						return {
							com: item.avg_value.value < 1024 ? 'B' : item.avg_value.value < 1048576 ? 'K' : item.avg_value.value < 1073741824 ? 'M' : 'G',
							upper: item.avg_upper.value === null ? null : (item.avg_upper.value < 1024*1024) ? (item.avg_upper.value/1024).toFixed(2) : (item.avg_upper.value/1024/1024).toFixed(2),
							lower: item.avg_lower.value === null ? null : (item.avg_lower.value < 1024*1024) ? (item.avg_lower.value/1024).toFixed(2) : (item.avg_lower.value/1024/1024).toFixed(2),
							value: item.avg_value.value === null ? null : (item.avg_value.value < 1024*1024) ? (item.avg_value.value/1024).toFixed(2) : (item.avg_value.value/1024/1024).toFixed(2),
							time: new Date(item.key).format('yyyy-MM-dd hh:mm:ss') + state
						}
					})
				}
  		}else{

  		}
			yield put({
				type: 'setState',
				payload:{
					sourceIn: sourceIn,
					comIn: sourceIn.length > 0 ? sourceIn[0].com : ''
				}
			})
		},
		//uyun出方向流量
		* uyunFolwOut ({payload}, {call, put, select}) {
			let must = []
			let sourceOut = []
			let paths = '',types = 'ord'
			let querySql = {sql: {}, paths: '' }
			let queryOutInterface = peformanceCfg.queryOutInterface
			let queryAggsOut = peformanceCfg.queryAggsOut
			let q = `firstClass=='NETWORK';secondClass=='HA_LINE';name=='`+payload.moname+`';aaDeviceIP==*`+payload.hostip+'*'
			let startOut = yield select(({ netLinePage }) => netLinePage.startOut)
  			let endOut = yield select(({ netLinePage }) => netLinePage.endOut)
  			const lines = yield call ( querylines, { q: q } )
  			if(lines.success && lines.content.length > 0){//查询对端接口
  				let ports = ''
  			if(lines.content[0].mo.aaIntf){
  				ports = lines.content[0].mo.aaIntf.portName.split('/').join('-')
  			}
  			queryOutInterface.query.bool.must = []//开始拼装查询条件
  			queryAggsOut.query.bool.must = []
  			must.push({ "term": { "kpi_key": "kpi."+payload.hostip+"_"+ports+".zh_net_output_realvalue" } })
  			if(startOut !== 0 && endOut!== 0){
  				if(endOut - startOut > 86400){
  					types = 'aggs'
  					message.info('检索时间跨度更改,已为您切换算法!')
  				}
  				paths = findIndex(startOut*1000,endOut*1000,'uyundw_wl_baseline_sjmx_', 'month', 'http://10.1.71.127:9200')//按时间生成索引
					must.push({"range":{"timestamp":{ "gt":startOut*1000, "lt": endOut*1000}}})
				}else{
					paths = findIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'uyundw_wl_baseline_sjmx_', 'month', 'http://10.1.71.127:9200')
					must.push({"range":{"timestamp":{ "gt":Date.parse(new Date()) - 86400000, "lt": Date.parse(new Date())}}})
				}
				if(types === 'ord'){
					queryOutInterface.query.bool.must = must
					querySql.sql = queryOutInterface
					querySql.paths = paths
				}else{
					queryAggsOut.query.bool.must = must
					querySql.sql = queryAggsOut
					querySql.paths = paths
				}
				const data = yield call ( queryUyun, querySql )
				if(data.hits && data.hits && data.hits.hits.length > 0){
					sourceOut = data.hits.hits.map((item, index) =>{
						let state = ''
						if( item._source.upper && item._source.lower ){
							if( item._source.upper < item._source.value || item._source.value < item._source.lower ){
								state = '(abn)'
							}else{
								state = '(norm)'
							}
						}else{
							state = '(norm)'
						}
						return {
							com: item._source.value < 1024 ? 'B' : item._source.value < 1048576 ? 'K' : item._source.value < 1073741824 ? 'M' : 'G',
				  		upper: item._source.upper === null ? null : (item._source.upper < 1024*1024) ? (item._source.upper/1024).toFixed(2) : (item._source.upper/1024/1024).toFixed(2),
							lower: item._source.lower === null ? null : (item._source.lower < 1024*1024) ? (item._source.lower/1024).toFixed(2) : (item._source.lower/1024/1024).toFixed(2),
				  		value: item._source.value === null ? null : (item._source.value < 1024*1024) ? (item._source.value/1024).toFixed(2) : (item._source.value/1024/1024).toFixed(2),
				  		time: new Date(item._source.timestamp).format('yyyy-MM-dd hh:mm:ss')+state
						}
					})
				}else if (data.aggregations && data.aggregations.clock_value && data.aggregations.clock_value.buckets && data.aggregations.clock_value.buckets.length > 0) {
					sourceOut = data.aggregations.clock_value.buckets.map((item, index) =>{
						let state = ''
						if( item.avg_upper.value && item.avg_lower.value ){
							if( item.avg_upper.value < item.avg_value.value || item.avg_value.value < item.avg_lower.value ){
								state = '(abn)'
							}else{
								state = '(norm)'
							}
						}else{
							state = '(norm)'
						}
						return {
							com: item.avg_value.value < 1024 ? 'B' : item.avg_value.value < 1048576 ? 'K' : item.avg_value.value < 1073741824 ? 'M' : 'G',
							upper: item.avg_upper.value === null ? null : (item.avg_upper.value < 1024*1024) ? (item.avg_upper.value/1024).toFixed(2) : (item.avg_upper.value/1024/1024).toFixed(2),
							lower: item.avg_lower.value === null ? null : (item.avg_lower.value < 1024*1024) ? (item.avg_lower.value/1024).toFixed(2) : (item.avg_lower.value/1024/1024).toFixed(2),
							value: item.avg_value.value === null ? null : (item.avg_value.value < 1024*1024) ? (item.avg_value.value/1024).toFixed(2) : (item.avg_value.value/1024/1024).toFixed(2),
							time: new Date(item.key).format('yyyy-MM-dd hh:mm:ss')+state
						}
					})
				}
  		}else{

  		}
			yield put({
				type: 'setState',
				payload:{
					sourceOut: sourceOut,
					comOut: sourceOut.length > 0 ? sourceOut[0].com : ''
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
