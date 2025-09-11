import { queryFault } from '../services/historyview'
import { queryLos, queryConfig, queryES } from '../services/dashboard'
import { peformanceCfg } from '../utils/performanceOelCfg'
import { ESFindIndex } from '../utils/FunctionTool'
import { message } from 'antd'
import moment from 'moment'
export default {

	namespace: 'chd',

	state: {
		nodeDetails: {},
		intfDetails: [],		//对应接口
		cpuTimescope: 2,	//cpu现在两个小时的时间范围
		memTimescope: 2,	//内存现在两个小时的时间范围
		responseTimescope: 2,	//cpu现在两个小时的时间范围
		lossTimescope: 2,	//内存现在两个小时的时间范围
		cpuGran: 'minute',	//cpu聚合的时间粒度
		memGran: 'minute',	//内存聚合的时间粒度
		responseGran: 'minute',	//cpu聚合的时间粒度
		lossGran: 'minute',	//内存聚合的时间粒度

		neUUID: '',

		instrumentChart: {
			avgResTime: 0,
			avgLosRate: 0,
		},
		cpuLineChart: {
			max: [],
			min: [],
			avg: [],
			allTime: [],
		},
		memLineChart: {
			max: [],
			min: [],
			avg: [],
			allTime: [],
		},
		responseLineChart: {
			max: [],
			min: [],
			avg: [],
			allTime: [],
		},
		lossLineChart: {
			max: [],
			min: [],
			avg: [],
			allTime: [],
		},
		paginationIntf: {																		//分页对象
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数
		},
		keywordValue: '',
		tableState: true,
		alarmDataSource: [],
		paginationAlarm: {
			showSizeChanger: false,												//是否可以改变 pageSize
			showQuickJumper: false, //是否可以快速跳转至某页
			simple: true,
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数
		},
		uuid: '',
		branch: '',
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(() => {
				let hostIp = location.href.split('?q=')[1].split('+')[0]
				let branch = location.href.split('?q=')[1].split('+')[1]
				dispatch({ type: 'queryDash', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'queryInfo', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'queryCPU', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'queryMem', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'queryResponse', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'queryLoss', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'querys', payload: { neUUID: hostIp, branch } })
				dispatch({ type: 'queryAlarm', payload: { neUUID: hostIp, branch } })
			})
		},
	},

	effects: {
		//		仪表盘查询
		* queryDash({ payload }, { select, call, put }) {
			let newdata = { ...payload }
			let data = {}
			let branch = payload.branch
			//设备响应时间&设备丢包率仪表盘
			let { responseTimeLossByIP } = peformanceCfg
			let branchs = { term: { branchname: branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 1800 } } }
			let ip = { term: { hostip: payload.neUUID } }
			let should = [{ term: { kpiname: 'PING响应时间' } }, { term: { kpiname: 'PING丢包率' } }]
			let bool = { bool: { should: should } }
			responseTimeLossByIP.query.bool.must.push(ip)
			responseTimeLossByIP.query.bool.must.push(branchs)
			responseTimeLossByIP.query.bool.must.push(clock)
			responseTimeLossByIP.query.bool.must.push(bool)
			const avgLosRateRes = yield call(queryLos, responseTimeLossByIP)
			console.log('仪表盘查询实时对象：', avgLosRateRes)
			if (avgLosRateRes.success) {
				let avgResTime = 0
				let avgLosRate = 0
				if (avgLosRateRes.aggregations.kpiname_info.buckets.length > 0) {
					for (let info of avgLosRateRes.aggregations.kpiname_info.buckets) {
						if (info.key === 'PING丢包率') {
							avgLosRate = info.top_info.hits.hits[0]._source.value
						}
						if (info.key === 'PING响应时间') {
							avgResTime = info.top_info.hits.hits[0]._source.value
						}
					}
				}
				payload.instrumentChart = { avgResTime, avgLosRate }
				yield put({
					type: 'showModal',
					payload,
				})
			} else {
				throw avgLosRateRes
			}
		},
		//		设备详情
		* queryInfo({ payload }, { select, call, put }) {
			// Node Details---start
			let nodeDetailsByUuid = peformanceCfg.nodeDetailsByUuid
			nodeDetailsByUuid.query.bool.must[0].term.hostip = payload.neUUID
			nodeDetailsByUuid.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) / 1000 - 7200 } } })
			nodeDetailsByUuid.query.bool.must_not.push({ term: { subcomponet: '端口' } })
			nodeDetailsByUuid.query.bool.must_not.push({ term: { component: '线路' } })
			const nodeDetailsValue = yield call(queryLos, nodeDetailsByUuid)
			if (nodeDetailsValue.success && nodeDetailsValue.hits.hits.length !== 0) {
				let dataValue = nodeDetailsValue.hits.hits[0]
				let detailsValue = dataValue._source
				payload.nodeDetails = detailsValue
				console.log('nodeDetailsValue : ', nodeDetailsValue)
			}
			if (nodeDetailsValue.success) {
				yield put({
					type: 'showModal',
					payload,
				})
			} else {
				throw nodeDetailsValue
			}
		},
		//		CPU利用率线性图表查询
		* queryCPU({ payload }, { select, call, put }) {
			let cpuTimescope = payload.cpuTimescope === undefined ? yield select(({ chd }) => chd.cpuTimescope) : payload.cpuTimescope//快捷时间范围
			let cpuGran = payload.cpuGran === undefined ? yield select(({ chd }) => chd.cpuGran) : payload.cpuGran//聚合粒度
			let cpuStar = yield select(({ chd }) => chd.cpuStar)//自定义时间范围
			let cpuEnd = yield select(({ chd }) => chd.cpuEnd)//自定义时间范围
			let newdata = { ...payload }
			let data = {}
			let title = []
			let CPU = []
			let CPU0 = []
			let CPU1 = []
			let CPU2 = []
			let CPU3 = []
			let CPU4 = []
			let CPU5 = []
			let CPU6 = []
			let CPU7 = []
			let branch = payload.branch
			let should = []
			//CPU使用率
			let deviceCpuLineChart = peformanceCfg.deviceCpuLineChart
			let branchs = { term: { branchname: branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 7200 } } }
			let ip = { term: { hostip: payload.neUUID } }
			let kpiname = { wildcard: { kpiname: 'CPU利用率*' } }
			//创建时间窗
			if ((cpuStar === 0 && cpuEnd === 0) || (cpuStar === undefined && cpuEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - parseInt(cpuTimescope) * 3600 } } }
				cpuStar = Date.parse(new Date()) /1000 - parseInt(cpuTimescope) * 3600
				cpuEnd = Date.parse(new Date()) / 1000
			} else {
				clock = { range: { clock: { gt: cpuStar, lt: cpuEnd } } }
			}
			let must = []
			must.push(branchs)
			must.push(clock)
			must.push(ip)
			must.push(kpiname)
			deviceCpuLineChart.aggs.clock_value.date_histogram.interval = cpuGran
			deviceCpuLineChart.query.bool.must = must
			console.log('CPU使用率查询语句 : ', deviceCpuLineChart)
			let paths = ''
			let queryParams = {es: {}, paths: '' }
			if(cpuStar !== 0  && cpuEnd!== 0 && cpuStar !== undefined  && cpuEnd!== undefined ){ 
				paths = ESFindIndex(cpuStar*1000,cpuEnd*1000,'u2performance-', 'day', '')//按时间生成索引
			}else{
				paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
			}
			queryParams.es = deviceCpuLineChart
			queryParams.paths =paths
			// const cpuLineChartRes = yield call(queryLos, deviceCpuLineChart)
			const cpuLineChartRes = yield call(queryES, queryParams)
			console.log('聚合结果:', cpuLineChartRes)
			let times = []//x轴时间
			let maxInfo = []//最大值
			let minInfo = []//最小值
			let avgInfo = []//平均
			let maxInfo0 = []//最大值
			let minInfo0 = []//最小值
			let avgInfo0 = []//平均
			let maxInfo1 = []//最大值
			let minInfo1 = []//最小值
			let avgInfo1 = []//平均
			let maxInfo2 = []//最大值
			let minInfo2 = []//最小值
			let avgInfo2 = []//平均
			let maxInfo3 = []//最大值
			let minInfo3 = []//最小值
			let avgInfo3 = []//平均
			let maxInfo4 = []//最大值
			let minInfo4 = []//最小值
			let avgInfo4 = []//平均
			let maxInfo5 = []//最大值
			let minInfo5 = []//最小值
			let avgInfo5 = []//平均
			let maxInfo6 = []//最大值
			let minInfo6 = []//最小值
			let avgInfo6 = []//平均
			let maxInfo7 = []//最大值
			let minInfo7 = []//最小值
			let avgInfo7 = []//平均
			let picture = [] //图例
			let showPicture = []
			if (cpuLineChartRes.success) {
				if (cpuLineChartRes.aggregations.clock_value.buckets.length > 0) {
					for (let info of cpuLineChartRes.aggregations.clock_value.buckets) {
						times.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
						if (info.group_kpiname.buckets.length > 0) {
							for (let info2 of info.group_kpiname.buckets) {
								if (info2.key == 'CPU利用率') {
									avgInfo.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率0') {
									avgInfo0.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率1') {
									avgInfo1.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率2') {
									avgInfo2.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率3') {
									avgInfo3.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率4') {
									avgInfo4.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率5') {
									avgInfo5.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率6') {
									avgInfo6.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == 'CPU利用率7') {
									avgInfo7.push(info2.avg_value.value.toFixed(2))
								}
							}
							let Maxlength = Math.max(avgInfo.length,avgInfo0.length,avgInfo1.length,avgInfo2.length,avgInfo3.length,avgInfo4.length,avgInfo5.length,avgInfo6.length,avgInfo7.length)
							if(Maxlength > avgInfo.length){
								avgInfo.push("")
							}
							if(Maxlength > avgInfo0.length){
								avgInfo0.push("")
							}
							if(Maxlength > avgInfo1.length){
								avgInfo1.push("")
							}
							if(Maxlength > avgInfo2.length){
								avgInfo2.push("")
							}
							if(Maxlength > avgInfo3.length){
								avgInfo3.push("")
							}
							if(Maxlength > avgInfo4.length){
								avgInfo4.push("")
							}
							if(Maxlength > avgInfo5.length){
								avgInfo5.push("")
							}
							if(Maxlength > avgInfo6.length){
								avgInfo6.push("")
							}
							if(Maxlength > avgInfo7.length){
								avgInfo7.push("")
							}
						} else {
							if (avgInfo.length > 0) {
								avgInfo.push('')
							}
							if (avgInfo0.length > 0) {
								avgInfo0.push('')
							}
							if (avgInfo1.length > 0) {
								avgInfo1.push('')
							}
							if (avgInfo2.length > 0) {
								avgInfo2.push('')
							}
							if (avgInfo3.length > 0) {
								avgInfo3.push('')
							}
							if (avgInfo4.length > 0) {
								avgInfo4.push('')
							}
							if (avgInfo5.length > 0) {
								avgInfo5.push('')
							}
							if (avgInfo6.length > 0) {
								avgInfo6.push('')
							}
							if (avgInfo7.length > 0) {
								avgInfo7.push('')
							}
						}
					}
					if (avgInfo.length > 0) {
						showPicture.push( 'CPU平均使用率')
						title.push('CPU利用率')
						CPU = [
							{
								name: 'CPU平均使用率',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo, //平均值
							}
						]
					}
					if (avgInfo0.length > 0) {
						showPicture.push( 'CPU平均使用率0')
						title.push('CPU利用率0')
						CPU0 = [
							{
								name: 'CPU平均使用率0',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo0, //平均值
							}
						]
					}
					if (avgInfo1.length > 0) {
						showPicture.push( 'CPU平均使用率1')
						title.push('CPU利用率1')
						CPU1 = [
							{
								name: 'CPU平均使用率1',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo1, //平均值
							}
						]
					}
					if (avgInfo2.length > 0) {
						showPicture.push('CPU平均使用率2')
						title.push('CPU利用率2')
						CPU2 = [
							{
								name: 'CPU平均使用率2',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo2, //平均值
							}
						]
					}
					if (avgInfo3.length > 0) {
						showPicture.push( 'CPU平均使用率3')
						title.push('CPU利用率3')
						CPU3 = [
							{
								name: 'CPU平均使用率3',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo3, //平均值
							}
						]
					}
					if (avgInfo4.length > 0) {
						showPicture.push( 'CPU平均使用率4')
						title.push('CPU利用率4')
						CPU4 = [
							{
								name: 'CPU平均使用率4',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo4, //平均值
							}
						]
					}
					if (avgInfo5.length > 0) {
						showPicture.push('CPU平均使用率5')
						title.push('CPU利用率5')
						CPU5 = [
							{
								name: 'CPU平均使用率5',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo5, //平均值
							}
						]
					}
					if (avgInfo6.length > 0) {
						showPicture.push( 'CPU平均使用率6')
						title.push('CPU利用率6')
						CPU6 = [
							{
								name: 'CPU平均使用率6',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo6, //平均值
							}
						]
					}
					if (avgInfo7.length > 0) {
						showPicture.push( 'CPU平均使用率7')
						title.push('CPU利用率7')
						CPU7 = [
							{
								name: 'CPU平均使用率7',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfo7, //平均值
							}
						]
					}
					let series = [{
						name: 'line',
						type: 'line',
						showSymbol: false,
						data: '', //线性回归
					},]
					picture = picture.concat(CPU).concat(CPU0).concat(CPU1).concat(CPU2).concat(CPU3).concat(CPU4).concat(CPU5).concat(CPU6).concat(CPU7).concat(series)
					console.log(showPicture)
					console.log(picture)
				}
			}
			console.log('时间：', times)
			console.log('最大值：', maxInfo)
			console.log('最小值：', minInfo)
			console.log('平均值：', avgInfo)
			console.log('cpuLineChartRes : ', cpuLineChartRes)
			payload.cpuLineChart = {
				dataSource: picture, allTime: times, showLine: showPicture, biaoti: title,
				 avgInfo: avgInfo,  avgInfo0: avgInfo0, avgInfo1: avgInfo1, avgInfo2: avgInfo2,
				 avgInfo3: avgInfo3,  avgInfo4: avgInfo4, avgInfo5: avgInfo5, avgInfo6: avgInfo6,
				 avgInfo7: avgInfo7
			}
			if (cpuLineChartRes.success) {
				yield put({
					type: 'showModal',
					payload,
				})
			} else {
				throw cpuLineChartRes
			}
		},
		//		内存利用率线性图表
		* queryMem({ payload }, { select, call, put }) {
			let memTimescope = payload.memTimescope === undefined ? yield select(({ chd }) => chd.memTimescope) : payload.memTimescope //快捷方式
			let memGran = payload.memGran === undefined ? yield select(({ chd }) => chd.memGran) : payload.memGran//聚合粒度
			let memStar = yield select(({ chd }) => chd.memStar)//自定义时间开始
			let memEnd = yield select(({ chd }) => chd.memEnd)//自定义时间结束
			let newdata = { ...payload }
			let data = {}
			let title = []
			let Excel = []
			let RAM = []
			let RAM0 = []
			let RAM1 = []
			let RAM2 = []
			let RAM3 = []
			let RAM4 = []
			let RAM5 = []
			let RAM6 = []
			let RAM7 = []
			let branch = payload.branch
			//内存利用率线性图表
			let deviceMemLineChart = peformanceCfg.deviceMemLineChart
			let branchs = { term: { branchname: branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 7200 } } }
			let ip = { term: { hostip: payload.neUUID } }
			let kpiname = { wildcard: { kpiname: '内存利用率*' } }
			if ((memStar === 0 && memEnd === 0) || (memStar === undefined && memEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - parseInt(memTimescope) * 3600 } } }
				memStar = Date.parse(new Date()) /1000 - parseInt(memTimescope) * 3600
				memEnd = Date.parse(new Date()) / 1000
			} else {
				clock = { range: { clock: { gt: memStar, lt: memEnd } } }
			}
			let must = []
			must.push(branchs)
			must.push(clock)
			must.push(ip)
			must.push(kpiname)
			deviceMemLineChart.aggs.clock_value.date_histogram.interval = memGran
			deviceMemLineChart.query.bool.must = must
			console.log('内存利用率查询语句：', deviceMemLineChart)
			let paths = ''
			let queryParams = {es: {}, paths: '' }
			if(memStar !== 0  && memEnd!== 0 && memStar !== undefined  && memEnd!== undefined ){ 
				paths = ESFindIndex(memStar*1000,memEnd*1000,'u2performance-', 'day', '')//按时间生成索引
			}else{
				paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
			}
			queryParams.es = deviceMemLineChart
			queryParams.paths =paths
			// const memLineChartRes = yield call(queryLos, deviceMemLineChart)
			const memLineChartRes = yield call(queryES, queryParams)
			let timesMem = []//x轴时间
			let maxInfoMem = []//最大值
			let minInfoMem = []//最小值
			let avgInfoMem = []//平均
			let maxInfoMem0 = []//最大值
			let minInfoMem0 = []//最小值
			let avgInfoMem0 = []//平均
			let maxInfoMem1 = []//最大值
			let minInfoMem1 = []//最小值
			let avgInfoMem1 = []//平均
			let maxInfoMem2 = []//最大值
			let minInfoMem2 = []//最小值
			let avgInfoMem2 = []//平均
			let maxInfoMem3 = []//最大值
			let minInfoMem3 = []//最小值
			let avgInfoMem3 = []//平均
			let maxInfoMem4 = []//最大值
			let minInfoMem4 = []//最小值
			let avgInfoMem4 = []//平均
			let maxInfoMem5 = []//最大值
			let minInfoMem5 = []//最小值
			let avgInfoMem5 = []//平均
			let maxInfoMem6 = []//最大值
			let minInfoMem6 = []//最小值
			let avgInfoMem6 = []//平均
			let maxInfoMem7 = []//最大值
			let minInfoMem7 = []//最小值
			let avgInfoMem7 = []//平均
			let picture = [] //图例
			let showPicture = []
			if (memLineChartRes.success) {
				if (memLineChartRes.aggregations.clock_value.buckets.length > 0) {
					for (let info of memLineChartRes.aggregations.clock_value.buckets) {
						timesMem.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
						if (info.group_kpiname.buckets.length > 0) {
							for (let info2 of info.group_kpiname.buckets) {
								if (info2.key == '内存利用率') {
									avgInfoMem.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率0') {
									avgInfoMem0.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率1') {
									avgInfoMem1.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率2') {
									avgInfoMem2.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率3') {
									avgInfoMem3.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率4') {
									avgInfoMem4.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率5') {
									avgInfoMem5.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率6') {
									avgInfoMem6.push(info2.avg_value.value.toFixed(2))
								}
								if (info2.key == '内存利用率7') {
									avgInfoMem7.push(info2.avg_value.value.toFixed(2))
								}
							}
							let Maxlength = Math.max(avgInfoMem.length,avgInfoMem0.length,avgInfoMem1.length,avgInfoMem2.length,avgInfoMem3.length,avgInfoMem4.length,avgInfoMem5.length,avgInfoMem6.length,avgInfoMem7.length)
							if(Maxlength > avgInfoMem.length){
								avgInfoMem.push('')
							}
							if(Maxlength > avgInfoMem0.length){
								avgInfoMem0.push('')
							}
							if(Maxlength > avgInfoMem1.length){
								avgInfoMem1.push('')
							}
							if(Maxlength > avgInfoMem2.length){
								avgInfoMem2.push('')
							}
							if(Maxlength > avgInfoMem3.length){
								avgInfoMem3.push('')
							}
							if(Maxlength > avgInfoMem4.length){
								avgInfoMem4.push('')
							}
							if(Maxlength > avgInfoMem5.length){
								avgInfoMem5.push('')
							}
							if(Maxlength > avgInfoMem6.length){
								avgInfoMem6.push('')
							}
							if(Maxlength > avgInfoMem7.length){
								avgInfoMem7.push('')
							}
						} else {
							if (avgInfoMem.length > 0) {
								avgInfoMem.push('')
							}
							if (avgInfoMem0.length > 0) {
								avgInfoMem0.push('')
							}
							if (avgInfoMem1.length > 0) {
								avgInfoMem1.push('')
							}
							if (avgInfoMem2.length > 0) {
								avgInfoMem2.push('')
							}
							if (avgInfoMem3.length > 0) {
								avgInfoMem3.push('')
							}
							if (avgInfoMem4.length > 0) {
								avgInfoMem4.push('')
							}
							if (avgInfoMem5.length > 0) {
								avgInfoMem5.push('')
							}
							if (avgInfoMem6.length > 0) {
								avgInfoMem6.push('')
							}
							if (avgInfoMem7.length > 0) {
								avgInfoMem7.push('')
							}
						}
					}

					if (avgInfoMem.length > 0) {
						showPicture.push('内存平均利用率')
						title.push('内存利用率')
						RAM = [
							{
								name: '内存平均利用率',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem, //平均值
							}
						]
					}
					if (avgInfoMem0.length > 0) {
						showPicture.push('内存平均利用率0')
						title.push('内存利用率0')
						RAM0 = [
							{
								name: '内存平均利用率0',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem0, //平均值
							}
						]
					}
					if (avgInfoMem1.length > 0) {
						showPicture.push( '内存平均利用率1')
						title.push('内存利用率1')
						RAM1 = [
							{
								name: '内存平均利用率1',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem1, //平均值
							}
						]
					}
					if (avgInfoMem2.length > 0) {
						showPicture.push( '内存平均利用率2')
						title.push('内存利用率2')
						RAM2 = [
							{
								name: '内存平均利用率2',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem2, //平均值
							}
						]
					}
					if (avgInfoMem3.length > 0) {
						showPicture.push('内存平均利用率3')
						title.push('内存利用率3')
						RAM3 = [
							{
								name: '内存平均利用率3',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem3, //平均值
							}
						]
					}
					if (avgInfoMem4.length > 0) {
						showPicture.push('内存平均利用率4')
						title.push('内存利用率4')
						RAM4 = [
							{
								name: '内存平均利用率4',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem4, //平均值
							}
						]
					}
					if (avgInfoMem5.length > 0) {
						showPicture.push('内存平均利用率5')
						title.push('内存利用率5')
						RAM5 = [
							{
								name: '内存平均利用率5',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem5, //平均值
							}
						]
					}
					if (avgInfoMem6.length > 0) {
						showPicture.push( '内存平均利用率6')
						title.push('内存利用率6')
						RAM6 = [
							{
								name: '内存平均利用率6',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem6, //平均值
							}
						]
					}
					if (avgInfoMem7.length > 0) {
						showPicture.push( '内存平均利用率7')
						title.push('内存利用率7')
						RAM7 = [
							{
								name: '内存平均利用率7',
								type: 'line',
								connectNulls: true,
								axisLabel: {
									formatter: '{value} %',
								},
								data: avgInfoMem7, //平均值
							}
						]
					}
					let series = [{
						name: 'line',
						type: 'line',
						showSymbol: false,
						data: '', //线性回归
					},]
					picture = picture.concat(RAM).concat(RAM0).concat(RAM1).concat(RAM2).concat(RAM3).concat(RAM4).concat(RAM5).concat(RAM6).concat(RAM7).concat(series)
					console.log(showPicture)
					console.log(picture)

				}
				payload.memLineChart = {
					dataSource: picture, allTime: timesMem, show: showPicture, biaoti: title,
					 avgInfoMem: avgInfoMem, avgInfoMem0: avgInfoMem0, avgInfoMem1: avgInfoMem1, avgInfoMem2: avgInfoMem2,
					 avgInfoMem3: avgInfoMem3, avgInfoMem4: avgInfoMem4, avgInfoMem5: avgInfoMem5, avgInfoMem6: avgInfoMem6,
					 avgInfoMem7: avgInfoMem7
				}
				yield put({
					type: 'showModal',
					payload,
				})
			} else {
				throw memLineChartRes
			}
		},
		//		响应时间线性图表
		* queryResponse({ payload }, { select, call, put }) {
			let responseTimescope = payload.responseTimescope === undefined ? yield select(({ chd }) => chd.responseTimescope) : payload.responseTimescope
			let responseGran = payload.responseGran === undefined ? yield select(({ chd }) => chd.responseGran) : payload.responseGran
			let responseStar = yield select(({ chd }) => chd.responseStar)
			let responseEnd = yield select(({ chd }) => chd.responseEnd)
			let newdata = { ...payload }
			let data = {}
			let branch = payload.branch
			//响应时间线性图表---start
			let deviceResponseLineChart = peformanceCfg.deviceResponseLineChart
			let branchs = { term: { branchname: branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 7200 } } }
			let ip = { term: { hostip: payload.neUUID } }
			let kpiname = { term: { kpiname: 'PING响应时间' } }
			if ((responseStar === 0 && responseEnd === 0) || (responseStar === undefined && responseEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - parseInt(responseTimescope) * 3600 } } }
				responseStar = Date.parse(new Date()) /1000 - parseInt(responseTimescope) * 3600
				responseEnd = Date.parse(new Date()) / 1000
			} else {
				clock = { range: { clock: { gt: responseStar, lt: responseEnd } } }
			}
			let must = []
			must.push(branchs)
			must.push(clock)
			must.push(ip)
			must.push(kpiname)
			deviceResponseLineChart.query.bool.must = must
			deviceResponseLineChart.aggs.clock_value.date_histogram.interval = responseGran
			let paths = ''
			let queryParams = {es: {}, paths: '' }
			if(responseStar !== 0  && responseEnd!== 0 && responseStar !== undefined  && responseEnd!== undefined ){ 
				paths = ESFindIndex(responseStar*1000,responseEnd*1000,'u2performance-', 'day', '')//按时间生成索引
			}else{
				paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
			}
			queryParams.es = deviceResponseLineChart
			queryParams.paths =paths
			// const responseLineChartRes = yield call(queryLos, deviceResponseLineChart)
			const responseLineChartRes = yield call(queryES, queryParams)
			let timesResponse = []//x轴时间
			let maxInfoResponse = []//最大值
			let minInfoResponse = []//最小值
			let avgInfoResponse = []//平均
			// ---响应时间图表 ---end
			if (responseLineChartRes.success) {
				if (responseLineChartRes.aggregations.clock_value.buckets.length > 0) {
					for (let info of responseLineChartRes.aggregations.clock_value.buckets) {
						timesResponse.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
						if (info.avg_value.value || info.avg_value.value === 0) {
							avgInfoResponse.push(info.avg_value.value.toFixed(2))
						} else {
							avgInfoResponse.push('')
						}
						if (info.max_value.value || info.max_value.value === 0) {
							maxInfoResponse.push(info.max_value.value.toFixed(2))
						} else {
							maxInfoResponse.push('')
						}
						if (info.min_value.value || info.min_value.value === 0) {
							minInfoResponse.push(info.min_value.value.toFixed(2))
						} else {
							minInfoResponse.push('')
						}
					}
				}
				payload.responseLineChart = {
					max: maxInfoResponse, min: minInfoResponse, avg: avgInfoResponse, allTime: timesResponse,
				}
				yield put({
					type: 'showModal',
					payload,
				})
			} else {
				throw responseLineChartRes
			}
		},
		//		丢包率线性图表
		* queryLoss({ payload }, { select, call, put }) {
			let lossTimescope = payload.lossTimescope === undefined ? yield select(({ chd }) => chd.lossTimescope) : payload.lossTimescope
			let lossGran = payload.lossGran === undefined ? yield select(({ chd }) => chd.lossGran) : payload.lossGran
			let lossStar = yield select(({ chd }) => chd.lossStar)
			let lossEnd = yield select(({ chd }) => chd.lossEnd)
			let newdata = { ...payload }
			let data = {}
			let branch = payload.branch
			//丢包率线性图表---start
			let deviceLossLineChart = peformanceCfg.deviceLossLineChart
			let branchs = { term: { branchname: branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 7200 } } }
			let ip = { term: { hostip: payload.neUUID } }
			let kpiname = { term: { kpiname: 'PING丢包率' } }
			if ((lossStar === 0 && lossEnd === 0) || (lossStar === undefined && lossEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) / 1000 - parseInt(lossTimescope) * 3600 } } }
				lossStar = Date.parse(new Date()) /1000 - parseInt(lossTimescope) * 3600
				lossEnd = Date.parse(new Date()) / 1000
			} else {
				clock = { range: { clock: { gt: lossStar, lt: lossEnd } } }
			}
			let must = []
			must.push(branchs)
			must.push(clock)
			must.push(ip)
			must.push(kpiname)
			deviceLossLineChart.query.bool.must = must
			deviceLossLineChart.aggs.clock_value.date_histogram.interval = lossGran
			let timesLoss = []//x轴时间
			let maxInfoLoss = []//最大值
			let minInfoLoss = []//最小值
			let avgInfoLoss = []//平均
			let paths = ''
			let queryParams = {es: {}, paths: '' }
			if(lossStar !== 0  && lossEnd!== 0 && lossStar !== undefined  && lossEnd!== undefined ){ 
				paths = ESFindIndex(lossStar*1000,lossEnd*1000,'u2performance-', 'day', '')//按时间生成索引
			}else{
				paths = ESFindIndex(Date.parse(new Date()) - 86400000,Date.parse(new Date()),'u2performance-', 'day', '')
			}
			queryParams.es = deviceLossLineChart
			queryParams.paths =paths
			// const lossLineChartRes = yield call(queryLos, deviceLossLineChart)
			const lossLineChartRes = yield call(queryES, queryParams)
			if (lossLineChartRes.success) {
				if (lossLineChartRes.aggregations.clock_value.buckets.length > 0) {
					for (let info of lossLineChartRes.aggregations.clock_value.buckets) {
						timesLoss.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
						if (info.avg_value.value || info.avg_value.value === 0) {
							avgInfoLoss.push(info.avg_value.value.toFixed(2))
						} else {
							avgInfoLoss.push('')
						}
						if (info.max_value.value || info.max_value.value === 0) {
							maxInfoLoss.push(info.max_value.value.toFixed(2))
						} else {
							maxInfoLoss.push('')
						}
						if (info.min_value.value || info.min_value.value === 0) {
							minInfoLoss.push(info.min_value.value.toFixed(2))
						} else {
							minInfoLoss.push('')
						}
					}
				}
				payload.lossLineChart = {
					max: maxInfoLoss, min: minInfoLoss, avg: avgInfoLoss, allTime: timesLoss,
				}
				yield put({
					type: 'showModal',
					payload,
				})
			} else {
				throw lossLineChartRes
			}
		},
		//		接口查询
		* querys({ payload }, { select, call, put }) {
			//转换函数  queryLos
			const traffiCconvert = (text) => {
				let v = ''
				let value = parseInt(text)
				if (value >= 1000 && value < 1000000) {
					v = `${(Math.round((value / 1000) * 100) / 100).toFixed(2)}Kbps`
				} else if (value >= 1000000 && value < 1000000000) {
					v = `${(Math.round((value / 1000000) * 100) / 100).toFixed(2)}Mbps`
				} else if (value >= 1000000000 && value < 1000000000000) {
					v = `${(Math.round((value / 1000000000) * 100) / 100).toFixed(2)}Gbps`
				} else if (value >= 0 && value < 1000) {
					v = `${(Math.round((value) * 100) / 100).toFixed(2)}bps`
				}
				return v
			}
			let detailsIntfs = []
			let should = []
			let findAllInterface = peformanceCfg.findAllInterfaceList //查询接口集合信息
			let portInfo = peformanceCfg.portInfo
			//首先通过设备的uuid来查询这个设备的hostip,来作为查询对应设备已采集的接口  portsList
			let value = { range: { value: { gte: 0 } } }
			findAllInterface.query.bool.must[0].range.clock.gt = Date.parse(new Date()) / 1000 - 1200
			findAllInterface.query.bool.must[1].term.hostip = payload.neUUID
			findAllInterface.query.bool.must.push(value)
			let branch = payload.branch
			if (branch === 'ZH') {
				should.push({ term: { kpiname: '端口输入丢包数实际值' } },
					{ term: { kpiname: '端口输出丢包数实际值' } },
					{ term: { kpiname: '端口输入错包数实际值' } },
					{ term: { kpiname: '端口输出错包数实际值' } },
					{ term: { kpiname: '端口实际状态' } })
				should.push({ term: { kpiname: '总行端口输入流量带宽利用率' } },)
				should.push({ term: { kpiname: '总行端口输出流量带宽利用率' } },)
				should.push({ term: { kpiname: '总行端口输入流量实际值' } },)
				should.push({ term: { kpiname: '总行端口输出流量实际值' } })
			} else {
				should.push({ term: { kpiname: '端口输入丢包数实际值' } },
					{ term: { kpiname: '端口输出丢包数实际值' } },
					{ term: { kpiname: '端口输入错包数实际值' } },
					{ term: { kpiname: '端口输出错包数实际值' } },
					{ term: { kpiname: '端口实际状态' } })
				should.push({ term: { kpiname: '端口输入流量带宽利用率' } },)
				should.push({ term: { kpiname: '端口输出流量带宽利用率' } },)
				should.push({ term: { kpiname: '端口输入流量实际值' } },)
				should.push({ term: { kpiname: '端口输出流量实际值' } })
			}
			should.push({ term: { kpiname: '端口速率' } })
			let bool = { bool: { should: should } }
			findAllInterface.query.bool.must.push(bool)
			const data = yield call(queryLos, findAllInterface)
			//开始读取ES接口实时数据    将ES数据转换为Table可以解析的数据
			for (let info of data.aggregations.apiname_info.buckets) {
				let objss = {}
				objss.mo = info.key
				for (let item of info.keyword_info.buckets) {
					objss.portName = item.top_info.hits.hits[0]._source.keyword
					objss.hostip = item.top_info.hits.hits[0]._source.hostip
					portInfo.query.bool.must[0].term.hostip = objss.hostip
					portInfo.query.bool.must[1].term.keyword = objss.portName
					portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) / 1000 - 86400
					const states = yield call(queryConfig, portInfo)
					if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
						for (let state of states.aggregations.kpiname_info.buckets) {
							if (state.key === '端口实际状态') {
								objss.portState = state.top_info.hits.hits[0]._source.value
							}
							if (state.key === '端口描述') {
								objss.port = state.top_info.hits.hits[0]._source.value
							}
						}
					}
					objss.branchname = branch
					if (item.key === '总行端口输入流量带宽利用率') {
						objss.precentsIn = `${item.top_info.hits.hits[0]._source.value.toFixed(2)}%`
					} else if (item.key === '总行端口输出流量带宽利用率') {
						objss.precentsOut = `${item.top_info.hits.hits[0]._source.value.toFixed(2)}%`
					} else if (item.key === '总行端口输入流量实际值') {
						objss.inValue = traffiCconvert(item.top_info.hits.hits[0]._source.value)
					} else if (item.key === '总行端口输出流量实际值') {
						objss.outValue = traffiCconvert(item.top_info.hits.hits[0]._source.value)
					} else if (item.key === '端口输入丢包数实际值') {
						objss.inDis = item.top_info.hits.hits[0]._source.value.toFixed(2)
					} else if (item.key === '端口输出丢包数实际值') {
						objss.outDis = item.top_info.hits.hits[0]._source.value.toFixed(2)
					} else if (item.key === '端口输入错包数实际值') {
						objss.inErr = item.top_info.hits.hits[0]._source.value.toFixed(2)
					} else if (item.key === '端口输出错包数实际值') {
						objss.outErr = item.top_info.hits.hits[0]._source.value.toFixed(2)
					} else if (item.key === '端口输入流量带宽利用率') {
						objss.precentsIn = `${item.top_info.hits.hits[0]._source.value.toFixed(2)}%`
					} else if (item.key === '端口输出流量带宽利用率') {
						objss.precentsOut = `${item.top_info.hits.hits[0]._source.value.toFixed(2)}%`
					} else if (item.key === '端口输入流量实际值') {
						objss.inValue = traffiCconvert(item.top_info.hits.hits[0]._source.value)
					} else if (item.key === '端口输出流量实际值') {
						objss.outValue = traffiCconvert(item.top_info.hits.hits[0]._source.value)
					} else if (item.key === '端口速率') {
						objss.rate = item.top_info.hits.hits[0]._source.value
					}
				}
				detailsIntfs.push(objss)
			}
			//				detailsIntfs.push(objss);
			//				console.log('objss:',objss)
			//				console.log('detailsIntfs:',detailsIntfs)
			if (detailsIntfs) {
				yield put({
					type: 'showModal',
					payload: {
						tableState: false,
						intfDetails: detailsIntfs,
						paginationIntf: {
							total: detailsIntfs.length,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
						},
					},
				})
			} else {
				message.error('此设备为接口,暂无接口列表！')
				//throw dataIntf
			}
		},
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
						branch: payload.branch,
					},
				})
			}
		},
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			const { list, pagination, detail } = action.payload
			return {
				...state,
				list,
				pagination: {
					...state.pagination,
					...pagination,
				},
				detail,
			}
		},

		//这里控制弹出窗口显示
		showModal(state, action) {
			return { ...state, ...action.payload }
		},

		//这里控制弹出窗口隐藏
		hideModal(state, action) {
			return { ...state, ...action.payload }
		},

		//这里控制弹出窗口显示
		syncStart(state, action) {
			return { ...state, ...action.payload }
		},

		syncCancel(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
