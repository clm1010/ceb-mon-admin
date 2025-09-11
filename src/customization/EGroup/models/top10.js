
import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { queryLos } from '../../../services/dashboard'


export default {
  namespace: 'top10',
  state: {
  		lossListTop10: [],								//设备丢包率列表
  		responseListTop10: [],							//设备响应时间列表
	  cpuListTop10: [],									//设备CPU使用率列表
	  memoryListTop10: [],								//设备内存使用率列表
	  portUsageListTop10: [], //Over 50 Interfaces
	  portTrafficListTop10: [], //Top 10 Interfaces by Traffic

  },
  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dashboard/top10') {
          dispatch({
          	type: 'query',
          	payload: location.query,
          })
        }
      })
    },
  },
  effects: {
  		* query ({ payload }, { call, put }) {
  			const user = JSON.parse(sessionStorage.getItem('user'))
  			let branch
  			if (user.branch) {
	  			branch = user.branch
	  		}

			//利用率最高的10条端口
			//查询时间范围
			let portUsageResultTop10
			if (branch !== undefined) {
				let portUsageTop10 = peformanceCfg.portUsageTop10
				portUsageTop10.query.filtered.filter.bool.must.term.mngtorgcode = branch
//				portUsageTop10.aggs.device_uuid.terms.size = 10;
				portUsageResultTop10 = yield call(queryLos, portUsageTop10)
			}
			let portUsageListTop20 = []
			if (!portUsageResultTop10.error) { //如果取值成功
				let temp = portUsageResultTop10.aggregations.device_uuid.buckets
				if (temp.length > 0) {
					for (let record of temp) {
						let hostName = ''
						let interfaceName = ''
						let hostUUID = ''
						if (record.monamevalue.buckets[0] !== []) {
							hostName = record.monamevalue.buckets[0].key
						} else {
							hostName = record.key
						}
						if (record.keywordvalue.buckets[0] !== []) {
							interfaceName = record.keywordvalue.buckets[0].key
						} else {
							interfaceName = record.key
						}
						hostUUID = record.key
						portUsageListTop20.push({
 hostUUID, uuid: record.key, hostName, interfaceName, Oratio: record.kpi_name.buckets[0].avg_kpi.value, Iratio: record.kpi_name.buckets[1].avg_kpi.value,
})
					}
				}
			}
			//Top 10 Interfaces by Traffic

			//查询时间范围
			let portTrafficResultTop10
			if (branch !== undefined) {
				peformanceCfg.portTrafficTop10.query.filtered.filter.bool.must.term.mngtorgcode = branch
				portTrafficResultTop10 = yield call(queryLos, peformanceCfg.portTrafficTop10)
			}
			let portTrafficListTop20 = []
			if (!portTrafficResultTop10.error) { //如果取值成功
				let temp = portTrafficResultTop10.aggregations.device_uuid.buckets
				if (temp.length > 0) {
					for (let record of temp) {
						let hostName = ''
						let interfaceName = ''
						let hostUUID = ''
						if (record.monamevalue.buckets[0] !== []) {
							hostName = record.monamevalue.buckets[0].key
						} else {
							hostName = record.key
						}
						if (record.keywordvalue.buckets[0] !== []) {
							interfaceName = record.keywordvalue.buckets[0].key
						} else {
							interfaceName = record.key
						}
						hostUUID = record.key
						let Oflow = record.kpi_name.buckets[0].sum_kpi.value
						let Iflow = record.kpi_name.buckets[1].sum_kpi.value
						portTrafficListTop20.push({
 hostUUID, uuid: record.key, hostName, interfaceName, Oflow, Iflow,
})
					}
				}
			}
			//top 20 丢包率
			let lossResultTop10
			if (branch !== undefined) {
				let lossRateTop20 = peformanceCfg.lossRateTop20
				lossRateTop20.query.filtered.filter.bool.must[2].term.mngtorgcode = branch
//				lossRateTop20.aggs.kpi_name.terms.size = 10;
				lossResult = yield call(queryLos, lossRateTop20)
			}
			let lossListTop20 = []
			if (!lossResultTop10.error) { //如果取值成功
				let temp = lossResultTop10.aggregations.kpi_name.buckets
				if (temp.length > 0) {
					for (let record of temp) {
						let names = ''
						if (record.monamevalue.buckets[0] !== []) {
							names = record.monamevalue.buckets[0].key
						} else {
							names = record.key
						}

						lossListTop20.push({ uuid: record.key, deviceName: names, lossValue: record.avg_value.value })
					}
				}
			}
			//top 20 响应时间  response time;
			let responseResultTop10
			if (branch !== undefined) {
				let responseTimeTop20 = peformanceCfg.responseTimeTop20
				responseTimeTop20.query.filtered.filter.bool.must[2].term.mngtorgcode = branch
//				responseTimeTop20.aggs.kpi_name.terms.size = 10;
				responseResultTop10 = yield call(queryLos, responseTimeTop20)
			}
			let responseListTop20 = []
			if (!responseResultTop10.error) { //如果取值成功
				let temp = responseResultTop10.aggregations.kpi_name.buckets
				if (temp.length > 0) {
					for (let record of temp) {
						let Rname = ''
						if (record.monamevalue.buckets[0] !== []) {
							Rname = record.monamevalue.buckets[0].key
						} else {
							Rname = record.key
						}
						responseListTop20.push({ uuid: record.key, deviceName: Rname, responseValue: record.avg_value.value })
					}
				}
			}

			//top 20 CPU使用率
			let cpuResultTop10
			if (branch !== undefined) {
				let cpuUsageTop20 = peformanceCfg.cpuUsageTop20
				cpuUsageTop20.query.filtered.filter.bool.must[2].term.mngtorgcode = branch
//				cpuUsageTop20.aggs.kpi_name.terms.size = 10;
				cpuResultTop10 = yield call(queryLos, cpuUsageTop20)
			}
			let cpuListTop20 = []
			if (!cpuResultTop10.error) { //如果取值成功
				let temp = cpuResultTop10.aggregations.kpi_name.buckets
				if (temp.length > 0) {
					for (let record of temp) {
						let Rname = ''
						if (record.monamevalue.buckets[0] !== []) {
							Rname = record.monamevalue.buckets[0].key
						} else {
							Rname = record.key
						}
						cpuListTop20.push({ uuid: record.key, deviceName: Rname, cpuValue: record.avg_value.value })
					}
				}
			}

			//top 20 内存使用率

			let memoryResultTop10
			if (branch !== undefined) {
				let menUsageTop20 = peformanceCfg.menUsageTop20
				menUsageTop20.query.filtered.filter.bool.must[2].term.mngtorgcode = branch
//				menUsageTop20.aggs.kpi_name.terms.size = 10;
				memoryResultTop10 = yield call(queryLos, menUsageTop20)
			}
			let memoryListTop20 = []
			if (!memoryResultTop10.error) { //如果取值成功
				let temp = memoryResultTop10.aggregations.kpi_name.buckets
				if (temp.length > 0) {
					for (let record of temp) {
						let Rname = ''
						if (record.monamevalue.buckets[0] !== []) {
							Rname = record.monamevalue.buckets[0].key
						} else {
							Rname = record.key
						}
						memoryListTop20.push({ uuid: record.key, deviceName: Rname, memoryValue: record.avg_value.value })
					}
				}
			}


			//reducers
			yield put({
        type: 'querySuccess',
        payload: {
          lossListTop10: lossListTop20,
          responseListTop10: responseListTop20,
          cpuListTop10: cpuListTop20,
          memoryListTop10: memoryListTop20,
          portUsageListTop10: portUsageListTop20,
          portTrafficListTop10: portTrafficListTop20,
        },
      })
    },
  },
  reducers: {
  	querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
