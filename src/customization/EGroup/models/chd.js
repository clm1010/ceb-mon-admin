import pathToRegexp from 'path-to-regexp'
//import { query, create, remove, update, policynum, allremove } from '../services/cfg'
//import { query as queryTool } from '../services/tools'
//import { nesquerys, allInterfs, allInterfsDeatil } from '../services/nes'
//import { mosInfts, findById } from '../services/objectMO'
import { queryFault } from '../../../services/historyview'
import { routerRedux } from 'dva/router'
import { queryLos, queryHours, queryConfig } from '../../../services/dashboard'
import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { parse } from 'qs'
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
    setup ({ dispatch, history }) {
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
		* queryDash ({ payload }, { select, call, put }) {
			let newdata = { ...payload }
	  		let data = {}
	  		let branch = payload.branch
			//设备响应时间&设备丢包率仪表盘
			let { responseTimeLossByIP } = peformanceCfg
			let branchs = { term: { "branchname.keyword": branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 1800 } } }
			let ip = { term: { hostip: payload.neUUID } }
			let should = [{ term: { "kpiname.keyword": 'PING响应时间' } },{ term: { "kpiname.keyword": 'PING丢包率' } }]
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
		* queryInfo ({ payload }, { select, call, put }) {
			// Node Details---start
			let nodeDetailsByUuid = peformanceCfg.nodeDetailsByUuidMO
			let must = []
			let hostip = { "term": { "hostip.keyword": payload.neUUID } }
			must.push(hostip)
			must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } })
			nodeDetailsByUuid.query.bool.must = must
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
		* queryCPU ({ payload }, { select, call, put }) {
			let cpuTimescope = payload.cpuTimescope === undefined ? yield select(({ chd }) => chd.cpuTimescope) : payload.cpuTimescope//快捷时间范围
	  		let cpuGran = payload.cpuGran === undefined ? yield select(({ chd }) => chd.cpuGran) : payload.cpuGran//聚合粒度
	  		let cpuStar = yield select(({ chd }) => chd.cpuStar)//自定义时间范围
	  		let cpuEnd = yield select(({ chd }) => chd.cpuEnd)//自定义时间范围
	  		let newdata = { ...payload }
	  		let data = {}
	  		let branch = payload.branch
			//CPU使用率
			let deviceCpuLineChart = peformanceCfg.deviceCpuLineChart
			let branchs = { term: { "branchname.keyword": branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
			let ip = { term: { "hostip.keyword": payload.neUUID } }
			let kpiname = { term: { "kpiname.keyword": 'CPU利用率' } }
			//创建时间窗
			if ((cpuStar === 0 && cpuEnd === 0) || (cpuStar === undefined && cpuEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(cpuTimescope) * 3600 } } }
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
			const cpuLineChartRes = yield call(queryLos, deviceCpuLineChart)
			console.log('聚合结果:', cpuLineChartRes)
			let times = []//x轴时间
			let maxInfo = []//最大值
			let minInfo = []//最小值
			let avgInfo = []//平均
			if (cpuLineChartRes.success) {
						if (cpuLineChartRes.aggregations.clock_value.buckets.length > 0) {
							for (let info of cpuLineChartRes.aggregations.clock_value.buckets) {
									times.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
									if (info.avg_value.value || info.avg_value.value === 0) {
										avgInfo.push(info.avg_value.value.toFixed(2))
									} else {
										avgInfo.push('-')
									}
									if (info.max_value.value || info.max_value.value === 0) {
										maxInfo.push(info.max_value.value.toFixed(2))
									} else {
										maxInfo.push('-')
									}
									if (info.min_value.value || info.min_value.value === 0) {
										minInfo.push(info.min_value.value.toFixed(2))
									} else {
										minInfo.push('-')
									}
							}
						}
			}
			console.log('时间：', times)
			console.log('最大值：', maxInfo)
			console.log('最小值：', minInfo)
			console.log('平均值：', avgInfo)
			console.log('cpuLineChartRes : ', cpuLineChartRes)
			payload.cpuLineChart = {
 max: maxInfo, min: minInfo, avg: avgInfo, allTime: times,
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
		* queryMem ({ payload }, { select, call, put }) {
	  		let memTimescope = payload.memTimescope === undefined ? yield select(({ chd }) => chd.memTimescope) : payload.memTimescope //快捷方式
	  		let memGran = payload.memGran === undefined ? yield select(({ chd }) => chd.memGran) : payload.memGran//聚合粒度
	  		let memStar = yield select(({ chd }) => chd.memStar)//自定义时间开始
	  		let memEnd = yield select(({ chd }) => chd.memEnd)//自定义时间结束
	  		let newdata = { ...payload }
	  		let data = {}
	  		let branch = payload.branch
		  	//内存利用率线性图表
			let deviceMemLineChart = peformanceCfg.deviceMemLineChart
			let branchs = { term: { "branchname.keyword": branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
			let ip = { term: { "hostip.keyword": payload.neUUID } }
			let kpiname = { term: { "kpiname.keyword": '内存利用率' } }
			if ((memStar === 0 && memEnd === 0) || (memStar === undefined && memEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(memTimescope) * 3600 } } }
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
			const memLineChartRes = yield call(queryLos, deviceMemLineChart)
			let timesMem = []//x轴时间
			let maxInfoMem = []//最大值
			let minInfoMem = []//最小值
			let avgInfoMem = []//平均
			if (memLineChartRes.success) {
					if (memLineChartRes.aggregations.clock_value.buckets.length > 0) {
							for (let info of memLineChartRes.aggregations.clock_value.buckets) {
									timesMem.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
									if (info.avg_value.value || info.avg_value.value === 0) {
										avgInfoMem.push(info.avg_value.value.toFixed(2))
									} else {
										avgInfoMem.push('-')
									}
									if (info.max_value.value || info.max_value.value === 0) {
										maxInfoMem.push(info.max_value.value.toFixed(2))
									} else {
										maxInfoMem.push('-')
									}
									if (info.min_value.value || info.min_value.value === 0) {
										minInfoMem.push(info.min_value.value.toFixed(2))
									} else {
										minInfoMem.push('-')
									}
							}
						}
					payload.memLineChart = {
 max: maxInfoMem, min: minInfoMem, avg: avgInfoMem, allTime: timesMem,
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
		* queryResponse ({ payload }, { select, call, put }) {
	  		let responseTimescope = payload.responseTimescope === undefined ? yield select(({ chd }) => chd.responseTimescope) : payload.responseTimescope
	  		let responseGran = payload.responseGran === undefined ? yield select(({ chd }) => chd.responseGran) : payload.responseGran
	  		let responseStar = yield select(({ chd }) => chd.responseStar)
	  		let responseEnd = yield select(({ chd }) => chd.responseEnd)
	  		let newdata = { ...payload }
	  		let data = {}
	  		let branch = payload.branch
		  	//响应时间线性图表---start
			let deviceResponseLineChart = peformanceCfg.deviceResponseLineChart
			let branchs = { term: { "branchname.keyword": branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
			let ip = { term: { "hostip.keyword": payload.neUUID } }
			let kpiname = { term: { "kpiname.keyword": 'PING响应时间' } }
			if ((responseStar === 0 && responseEnd === 0) || (responseStar === undefined && responseEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(responseTimescope) * 3600 } } }
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
			const responseLineChartRes = yield call(queryLos, deviceResponseLineChart)
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
										avgInfoResponse.push('-')
									}
									if (info.max_value.value || info.max_value.value === 0) {
										maxInfoResponse.push(info.max_value.value.toFixed(2))
									} else {
										maxInfoResponse.push('-')
									}
									if (info.min_value.value || info.min_value.value === 0) {
										minInfoResponse.push(info.min_value.value.toFixed(2))
									} else {
										minInfoResponse.push('-')
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
		* queryLoss ({ payload }, { select, call, put }) {
	  		let lossTimescope = payload.lossTimescope === undefined ? yield select(({ chd }) => chd.lossTimescope) : payload.lossTimescope
	  		let lossGran = payload.lossGran === undefined ? yield select(({ chd }) => chd.lossGran) : payload.lossGran
	  		let lossStar = yield select(({ chd }) => chd.lossStar)
	  		let lossEnd = yield select(({ chd }) => chd.lossEnd)
	  		let newdata = { ...payload }
	  		let data = {}
	  		let branch = payload.branch
			//丢包率线性图表---start
			let deviceLossLineChart = peformanceCfg.deviceLossLineChart
			let branchs = { term: { "branchname.keyword": branch } }
			let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
			let ip = { term: { "hostip.keyword": payload.neUUID } }
			let kpiname = { term: { "kpiname.keyword": 'PING丢包率' } }
			if ((lossStar === 0 && lossEnd === 0) || (lossStar === undefined && lossEnd === undefined)) {
				clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(lossTimescope) * 3600 } } }
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
			const lossLineChartRes = yield call(queryLos, deviceLossLineChart)
			if (lossLineChartRes.success) {
				if (lossLineChartRes.aggregations.clock_value.buckets.length > 0) {
							for (let info of lossLineChartRes.aggregations.clock_value.buckets) {
									timesLoss.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
									if (info.avg_value.value || info.avg_value.value === 0) {
										avgInfoLoss.push(info.avg_value.value.toFixed(2))
									} else {
										avgInfoLoss.push('-')
									}
									if (info.max_value.value || info.max_value.value === 0) {
										maxInfoLoss.push(info.max_value.value.toFixed(2))
									} else {
										maxInfoLoss.push('-')
									}
									if (info.min_value.value || info.min_value.value === 0) {
										minInfoLoss.push(info.min_value.value.toFixed(2))
									} else {
										minInfoLoss.push('-')
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
		* querys ({ payload }, { select, call, put }) {
		  //转换函数  queryLos
			const traffiCconvert = (text) => {
				let v = ''
				let value = parseInt(text) * 8
			 	if (value >= 1024 && value < 1048576) {
			 		v = `${(value / 1024).toFixed(2)}Kbps`
			 	} else if (value >= 1048576 && value < 1073741824) {
			 		v = `${(value / 1048576).toFixed(2)}Mbps`
			 	} else if (value >= 1073741824 && value < 1099511627776) {
			 		v = `${(value / 1073741824).toFixed(2)}Gbps`
			 	} else if (value >= 0 && value < 1024) {
			 		v = `${value}Kbps`
			 	}
			 	return v
			}
			let detailsIntfs = []
			let should  = []
			let findAllInterface = peformanceCfg.findAllInterfaceList //查询接口集合信息
			let portInfo = peformanceCfg.portInfo
			//首先通过设备的uuid来查询这个设备的hostip,来作为查询对应设备已采集的接口  portsList
			findAllInterface.query.bool.must[0].range.clock.gt = Date.parse(new Date()) /1000 - 1200
			findAllInterface.query.bool.must[1].term.hostip = payload.neUUID
	  	let branch = payload.branch
	  	if (branch === 'ZH') {
	  		should.push({ term: { "kpiname.keyword": '端口输入丢包数实际值' } },
	  								{ term: { "kpiname.keyword": '端口输出丢包数实际值' } },
	  								{ term: { "kpiname.keyword": '端口输入错包数实际值' } },
										{ term: { "kpiname.keyword": '端口输出错包数实际值' } },
										{ term: { "kpiname.keyword": '端口实际状态' } })
		  	should.push({ term: { "kpiname.keyword": '总行端口输入流量带宽利用率' } },)
		  	should.push({ term: { "kpiname.keyword": '总行端口输出流量带宽利用率' } },)
		  	should.push({ term: { "kpiname.keyword": '总行端口输入流量实际值' } },)
		  	should.push({ term: { "kpiname.keyword": '总行端口输出流量实际值' } })
		  } else {
		  	should.push({ term: { "kpiname.keyword": '端口输入丢包数实际值' } },
	  								{ term: { "kpiname.keyword": '端口输出丢包数实际值' } },
	  								{ term: { "kpiname.keyword": '端口输入错包数实际值' } },
										{ term: { "kpiname.keyword": '端口输出错包数实际值' } },
										{ term: { "kpiname.keyword": '端口实际状态' } })
		  	should.push({ term: { "kpiname.keyword": '端口输入流量带宽利用率' } },)
		  	should.push({ term: { "kpiname.keyword": '端口输出流量带宽利用率' } },)
		  	should.push({ term: { "kpiname.keyword": '端口输入流量实际值' } },)
		  	should.push({ term: { "kpiname.keyword": '端口输出流量实际值' } })
		  }
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
					portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
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
		* queryAlarm ({ payload }, { call, put }) {
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
					newData.q = `nodeAlias == '${payload.uuid}';`+ firstOccurrence
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
	  	querySuccess (state, action) {
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
	  	showModal (state, action) {
	  		return { ...state, ...action.payload }
	  },

	  //这里控制弹出窗口隐藏
		hideModal (state, action) {
	    return { ...state, ...action.payload }
	  },

	  //这里控制弹出窗口显示
	  	syncStart (state, action) {
      return { ...state, ...action.payload }
    },

    syncCancel (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
