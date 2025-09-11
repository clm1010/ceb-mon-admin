
import { queryFault } from '../../../services/historyview'
import { queryLos, queryConfig } from '../../../services/dashboard'
import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { queryInterfaceInfo } from '../../../services/interfaceChart'
import moment from 'moment'
export default {

  namespace: 'interfaceChart',

  state: {
    nodeDetails: {},
    usageTimescope: 2,
    flowTimescope: 2,
    lossTimescope: 2,
    wrongTimescope: 2,
    usageGran: 'minute',
    flowGran: 'minute',
    lossGran: 'minute',
    wrongGran: 'minute',
    neUUID: '',
    lossChart: {
      inx: [],
      outx: [],
      y: [],
    },
    wrongChart: {
      inx: [],
      outx: [],
      y: [],
    },
    instrumentChart: {
      avgRecRate: 0,
      avgTranRate: 0,
    },
    orgcode: {
      oorgcode: {
        x: [],
        y: [],
      },
      iorgcode: {
        x: [],
        y: [],
      },
      oodata: [],
      iidata: [],
    },
    folwAvg: {
      imax: [],
      imin: [],
      iavg: [],

      omax: [],
      omin: [],
      oavg: [],
      allTime: [],
      idata: [],
      odata: [],
    },
    unitState: 0,
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
    poetName: '',
    branch: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        if (location.pathname === '/chddetail') {
          //neUUID设备的IP
          //poetName为这条设备下端口的端口名
          let neUUID = location.href.split('?q=')[1].split('+')[0]
          let poetName = decodeURI(location.href.split('?q=')[1].split('+')[1])
          let branch = location.href.split('?q=')[1].split('+')[2]
          dispatch({ type: 'usageQuerys', payload: { neUUID, poetName, branch } })
          dispatch({ type: 'flowQuery', payload: { neUUID, poetName, branch } })
          dispatch({ type: 'nodeQuery', payload: { neUUID, poetName, branch } })
          dispatch({ type: 'usageByUuid', payload: { neUUID, poetName, branch } })
          dispatch({ type: 'queryLoss', payload: { neUUID, poetName, branch } })
          dispatch({ type: 'queryWrong', payload: { neUUID, poetName, branch } })
          dispatch({ type: 'queryAlarm', payload: { neUUID, poetName, branch } })
        }
      })
    },
  },

  effects: {
    * usageByUuid ({ payload }, { select, call, put }) {
      let branch = payload.branch
      let newdata = { ...payload }
      let data = {}
      //仪表盘
      let { recUsageByUuid } = peformanceCfg//1574909835
      let clock =	{ range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
      let ip = { term: { "hostip.keyword": payload.neUUID } }
      let keyword	= { term: { "keyword.keyword": payload.poetName } }
      let branchs = { term: { "branchname.keyword": branch } }
      let kpiname = [{ term: { "kpiname.keyword": '端口输出流量带宽利用率' } }, { term: { "kpiname.keyword": '端口输入流量带宽利用率' } }]
      if (branch === 'ZH') {
        kpiname = [{ term: { "kpiname.keyword": '总行端口输出流量带宽利用率' } }, { term: { "kpiname.keyword": '总行端口输入流量带宽利用率' } }]
      }
      let must = []
      let bool = { bool: { should: kpiname } }
      must.push(clock)
      must.push(ip)
      must.push(keyword)
      must.push(branchs)
      must.push(bool)
      recUsageByUuid.query.bool.must = must
      const avgRecRateRes = yield call(queryLos, recUsageByUuid)
      let outRecRate,inTranRate
      if (avgRecRateRes.success) {
        if (avgRecRateRes.aggregations.kpiname_info.buckets.length > 0) {
          for (let info of avgRecRateRes.aggregations.kpiname_info.buckets) {
            if (info.key === '总行端口输出流量带宽利用率') {
              outRecRate = info.top_info.hits.hits[0]._source.value
            }
            if (info.key === '总行端口输入流量带宽利用率') {
              inTranRate = info.top_info.hits.hits[0]._source.value
            }
            if (info.key === '端口输出流量带宽利用率') {
              outRecRate = info.top_info.hits.hits[0]._source.value
            }
            if (info.key === '端口输入流量带宽利用率') {
              inTranRate = info.top_info.hits.hits[0]._source.value
            }
          }
        }
      }
      if (avgRecRateRes) {
        payload.instrumentChart = { avgRecRate: inTranRate, avgTranRate: outRecRate }
        payload.uuid = payload.neUUID
        payload.poetName = payload.poetName
        payload.branch = payload.branch
        yield put({
          type: 'querySuccess',
          payload,
        })
      } else {
        throw avgRecRateRes
      }
      //仪表盘end
    },
    * nodeQuery ({ payload }, { select, call, put }) {
      //查询单台设备的信息
      // Node Details---start
      let nodeDetailsByUuid = peformanceCfg.nodeDetailsByUuid
      let portInfo = peformanceCfg.portInfo
      nodeDetailsByUuid.query.bool.must = []
      let must = []
      must.push({ term: { "hostip.keyword": payload.neUUID } })
      must.push({ term: { "keyword.keyword": payload.poetName } })
      must.push({ term: { "subcomponet.keyword": '端口' } })
      must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 1800 } } })
      nodeDetailsByUuid.query.bool.must = must
      const nodeDetailsValue = yield call(queryLos, nodeDetailsByUuid)
      if (nodeDetailsValue.success) {
        payload.uuid = payload.neUUID
        payload.poetName = payload.poetName
        if (nodeDetailsValue.hits.hits.length !== 0) {
          let dataValue = nodeDetailsValue.hits.hits[0]
          let detailsValue = dataValue._source
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": payload.neUUID } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": payload.poetName } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 1800 } } })
          // portInfo.query.bool.must[0].term.hostip = payload.neUUID
          // portInfo.query.bool.must[1].term.keyword = payload.poetName
          // portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                dataValue._source.status = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                dataValue._source.alias = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          payload.nodeDetails = detailsValue
        }
        yield put({
          type: 'querySuccess',
          payload,
        })
      } else {
        throw nodeDetailsValue
      }
      //end
    },
    //查询端口利用率     采集间隔已确定
    * usageQuerys ({ payload }, { select, call, put }) {
      let usageStart = yield select(({ interfaceChart }) => interfaceChart.usageStart)
      let usageEnd = yield select(({ interfaceChart }) => interfaceChart.usageEnd)
      let usageTimescope = yield select(({ interfaceChart }) => interfaceChart.usageTimescope)
      let usageGran = yield select(({ interfaceChart }) => interfaceChart.usageGran)//粒度
      let branch = payload.branch
      let { portUtilization, timeOP } = peformanceCfg
      let portUtilRes = {}
      //端口利用率图表
      let oorgcode = {
        x: [], //出方向时间
        y: [], //出方向值
      }//出方向
      let iorgcode = {
        x: [], //入方向时间
        y: [], //入方向值
      }//入方向
      let must = []
      let should = []
      if (branch === 'ZH') {
        should = [{ term: { "kpiname.keyword": '总行端口输入流量带宽利用率' } }, { term: { "kpiname.keyword": '总行端口输出流量带宽利用率' } }]
      }else{
      	should = [{ term: { "kpiname.keyword": '端口输入流量带宽利用率' } }, { term: { "kpiname.keyword": '端口输出流量带宽利用率' } }]
      }
      let bool = { bool: { should: should } }
      let branchs = { term: { "branchname.keyword": branch } }
      let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
      if ((usageStart === 0 && usageEnd === 0) || (usageStart === undefined && usageEnd === undefined)) {
        clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(usageTimescope) * 3600 } } }
      } else {
        clock = { range: { clock: { gt: usageStart, lt: usageEnd } } }
      }
      must.push(bool)
      must.push({ term: { "hostip.keyword": payload.neUUID } })
      must.push({ term: { "keyword.keyword": payload.poetName } })
      must.push(branchs)
      must.push(clock)
      portUtilization.query.bool.must = must
      //在这之前转换时间间隔
      timeOP.query.bool.must = []
      timeOP.query.bool.must.push({"term":{"hostip.keyword":payload.neUUID}})
      timeOP.query.bool.must.push({"term":{"branchname.keyword":branch}})
      timeOP.query.bool.must.push({"term":{"keyword.keyword":payload.poetName}})
      timeOP.query.bool.must.push({"range":{"clock":{"gt": Date.parse(new Date()) /1000 - 1200}}})
      if(branch === 'ZH'){
        timeOP.query.bool.must.push({"term":{"kpiname.keyword":"总行端口输入流量带宽利用率"}})
      }else{
        timeOP.query.bool.must.push({"term":{"kpiname.keyword":"端口输入流量带宽利用率"}})
      }
      const time = yield call ( queryLos, timeOP )

      if(time.aggregations.top_info && time.aggregations.top_info.hits.hits.length > 0){
      	let gran = time.aggregations.top_info.hits.hits
      	let op = (gran[0]._source.clock - gran[1]._source.clock)/60
      	portUtilization.aggs.clock_value.date_histogram.interval = (op === 0 ? 5 : op )+'m'
      	portUtilRes = yield call(queryInterfaceInfo, portUtilization)
      if (portUtilRes.success) {
        let portUtilResArr = portUtilRes.aggregations.clock_value.buckets
        if (portUtilResArr && portUtilResArr.length !== 0) {	//如果查到数据的话
          for (let info of portUtilResArr) {
            oorgcode.x.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))//出方向时间
            iorgcode.x.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))//入方向时间
            let allData = info.kpiname_info.buckets
            if (allData.length === 1) {
              allData.push({})
            }
            if (allData.length === 0) {
              iorgcode.y.push(0)
              oorgcode.y.push(0)
            } else {
              for (let i = 0; i < allData.length; i++) {
                if (allData[i].key === '总行端口输入流量带宽利用率') {
                  iorgcode.y.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === '总行端口输出流量带宽利用率') {
                  oorgcode.y.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === undefined && allData[i - 1].key === '总行端口输入流量带宽利用率') {
                  oorgcode.y.push(0)
                }
                if (allData[i].key === undefined && allData[i - 1].key === '总行端口输出流量带宽利用率') {
                  iorgcode.y.push(0)
                }
                //分行的判断
                if (allData[i].key === '端口输入流量带宽利用率') {
                  iorgcode.y.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === '端口输出流量带宽利用率') {
                  oorgcode.y.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输入流量带宽利用率') {
                  oorgcode.y.push(0)
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输出流量带宽利用率') {
                  iorgcode.y.push(0)
                }
              }
            }
          }
        }
      }
      }

      payload.uuid = payload.neUUID
      payload.poetName = payload.poetName
      payload.orgcode = {
        oorgcode,
        iorgcode,
        oodata: [],
        iidata: [],
      }
      if (portUtilRes) {
        yield put({
          type: 'querySuccess',
          payload,
        })
      } else {
        throw portUtilRes
      }
    },
    //查询端口流量   时间间隔已确定
    * flowQuery ({ payload }, { call, select, put }) {
      let { flow, timeOP } = peformanceCfg
      let flowTimescope = yield select(({ interfaceChart }) => interfaceChart.flowTimescope)//快捷时间查询
      let flowGran = yield select(({ interfaceChart }) => interfaceChart.flowGran)//聚合粒度
      let flowTimeEnd = yield select(({ interfaceChart }) => interfaceChart.flowTimeEnd)//结束时间
      let flowTimeStart = yield select(({ interfaceChart }) => interfaceChart.flowTimeStart)//开始时间
      let branch = payload.branch
      //端口流量输入输出图表
      let must = []
      let should = []
      if (branch === 'ZH') {
        should = [{ term: { "kpiname.keyword": '总行端口输入流量实际值' } }, { term: { "kpiname.keyword": '总行端口输出流量实际值' } }]
      }else{
      	should = [{ term: { "kpiname.keyword": '端口输入流量实际值' } }, { term: { "kpiname.keyword": '端口输出流量实际值' } }]
      }
      let bool = { bool: { should: should } }
      let branchs = { term: { "branchname.keyword": branch } }
      let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
      if ((flowTimeStart === 0 && flowTimeEnd === 0) || (flowTimeStart === undefined && flowTimeEnd === undefined)) {
        clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(flowTimescope) * 3600 } } }
      } else {
        clock = { range: { clock: { gt: flowTimeStart, lt: flowTimeEnd } } }
      }
      must.push({ term: { "hostip.keyword": payload.neUUID } })
      must.push({ term: { "keyword.keyword": payload.poetName } })
      must.push(branchs)
      must.push(clock)
      must.push(bool)
      flow.query.bool.must = must

      timeOP.query.bool.must = []
      timeOP.query.bool.must.push({"term":{"hostip.keyword":payload.neUUID}})
      timeOP.query.bool.must.push({"term":{"branchname.keyword":branch}})
      timeOP.query.bool.must.push({"term":{"keyword.keyword":payload.poetName}})
      timeOP.query.bool.must.push({"range":{"clock":{"gt": Date.parse(new Date()) /1000 - 1200}}})
      if(branch === 'ZH'){
        timeOP.query.bool.must.push({"term":{"kpiname.keyword":"总行端口输入流量实际值"}})
      }else{
        timeOP.query.bool.must.push({"term":{"kpiname.keyword":"端口输入流量实际值"}})
      }
      let folwInfo = {}
      const time = yield call ( queryLos, timeOP )
      if(time.aggregations.top_info && time.aggregations.top_info.hits.hits.length > 0){
      	let gran = time.aggregations.top_info.hits.hits
      	let op = (gran[0]._source.clock - gran[1]._source.clock)/60
      	flow.aggs.clock_value.date_histogram.interval = (op === 0 ? 5 : op )+'m'
      	folwInfo = yield call(queryInterfaceInfo, flow)
      }
      let times = []//x轴时间
      let imaxInfo = []//入最大值
      let iminInfo = []//入最小值
      let iavgInfo = []//入平均
      let omaxInfo = []//出最大值
      let ominInfo = []//出最小值
      let oavgInfo = []//出平均
      let unitState = 0
      let unitStateArr = []
      function dataTran (nums) {
        let v = 0
        if (nums >= 1048576 && nums < 1073741824) {
          unitStateArr.push('M')
        } else if (nums >= 1073741824) {
          unitStateArr.push('G')
        } else if (nums === 0 ){
          unitStateArr.push('0')
        }else if(nums === '-'){
          unitStateArr.push('0')
        }else if (nums < 1048576) {
          unitStateArr.push('K')
        }
        return nums
      }
      //线性回归数据
      let idata = []
      let odata = []

      if (folwInfo.success) {
        let folwInfoArr = folwInfo.aggregations.clock_value.buckets
        if (folwInfoArr && folwInfoArr.length !== 0) {	//如果查到数据的话
          for (let info of folwInfoArr) {
            times.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))
            let allData = info.kpiname_info.buckets
            if (allData.length === 1) {
              allData.push({})
            }
            if (allData.length === 0) {
              omaxInfo.push(0)
              ominInfo.push(0)
              oavgInfo.push(0)
              imaxInfo.push(0)
              iminInfo.push(0)
              iavgInfo.push(0)
            } else {
              for (let i = 0; i < allData.length; i++) {
                if (allData[i].key === '总行端口输入流量实际值') {
                  imaxInfo.push(dataTran(allData[i].max_value.value))
                  iminInfo.push(dataTran(allData[i].min_value.value))
                  iavgInfo.push(dataTran(allData[i].avg_value.value))
                }
                if (allData[i].key === '总行端口输出流量实际值') {
                  omaxInfo.push(dataTran(allData[i].max_value.value))
                  ominInfo.push(dataTran(allData[i].min_value.value))
                  oavgInfo.push(dataTran(allData[i].avg_value.value))
                }
                if (allData[i].key === undefined && allData[i - 1].key === '总行端口输入流量实际值') {
                  omaxInfo.push(0)
                  ominInfo.push(0)
                  oavgInfo.push(0)
                }
                if (allData[i].key === undefined && allData[i - 1].key === '总行端口输出流量实际值') {
                  imaxInfo.push(0)
                  iminInfo.push(0)
                  iavgInfo.push(0)
                }

                //分行的判断
                if (allData[i].key === '端口输入流量实际值') {
                  imaxInfo.push(dataTran(allData[i].max_value.value))
                  iminInfo.push(dataTran(allData[i].min_value.value))
                  iavgInfo.push(dataTran(allData[i].avg_value.value))
                }
                if (allData[i].key === '端口输出流量实际值') {
                  omaxInfo.push(dataTran(allData[i].max_value.value))
                  ominInfo.push(dataTran(allData[i].min_value.value))
                  oavgInfo.push(dataTran(allData[i].avg_value.value))
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输入流量实际值') {
                  omaxInfo.push(0)
                  ominInfo.push(0)
                  oavgInfo.push(0)
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输出流量实际值') {
                  imaxInfo.push(0)
                  iminInfo.push(0)
                  iavgInfo.push(0)
                }
              }
            }
          }
        }
      }
      let g = 0
      let m = 0
      let k = 0
      for (let u = 0; u < unitStateArr.length; u++) {
        if (unitStateArr[u] === 'G') {
          g++
        } else if (unitStateArr[u] === 'M') {
          m++
        } else if (unitStateArr[u] === 'K') {
          k++
        }
      }
      if (g > m && g > k) {
        unitState = 2
        for (let i = 0; i < imaxInfo.length; i++) {
          imaxInfo[i] = (Math.round(((imaxInfo[i]) / 1073741824) * 100) / 100).toFixed(2)
          iminInfo[i] = (Math.round(((iminInfo[i]) / 1073741824) * 100) / 100).toFixed(2)
          iavgInfo[i] = (Math.round(((iavgInfo[i]) / 1073741824) * 100) / 100).toFixed(2)
          omaxInfo[i] = (Math.round(((omaxInfo[i]) / 1073741824) * 100) / 100).toFixed(2)
          ominInfo[i] = (Math.round(((ominInfo[i]) / 1073741824) * 100) / 100).toFixed(2)
          oavgInfo[i] = (Math.round(((oavgInfo[i]) / 1073741824) * 100) / 100).toFixed(2)
        }
      } else if (m > g && m > k) {
        unitState = 1
        for (let i = 0; i < imaxInfo.length; i++) {
          imaxInfo[i] = (Math.round(((imaxInfo[i]) / 1048576) * 100) / 100).toFixed(2)
          iminInfo[i] = (Math.round(((iminInfo[i]) / 1048576) * 100) / 100).toFixed(2)
          omaxInfo[i] = (Math.round(((omaxInfo[i]) / 1048576) * 100) / 100).toFixed(2)
          iavgInfo[i] = (Math.round(((iavgInfo[i]) / 1048576) * 100) / 100).toFixed(2)
          ominInfo[i] = (Math.round(((ominInfo[i]) / 1048576) * 100) / 100).toFixed(2)
          oavgInfo[i] = (Math.round(((oavgInfo[i]) / 1048576) * 100) / 100).toFixed(2)
        }
      } else if (k > m && k > g) {
        unitState = 0
        for (let i = 0; i < imaxInfo.length; i++) {
          imaxInfo[i] = (Math.round(((imaxInfo[i]) / 1024) * 100) / 100).toFixed(2)
          iminInfo[i] = (Math.round(((iminInfo[i]) / 1024) * 100) / 100).toFixed(2)
          iavgInfo[i] = (Math.round(((iavgInfo[i]) / 1024) * 100) / 100).toFixed(2)
          omaxInfo[i] = (Math.round(((omaxInfo[i]) / 1024) * 100) / 100).toFixed(2)
          ominInfo[i] = (Math.round(((ominInfo[i]) / 1024) * 100) / 100).toFixed(2)
          oavgInfo[i] = (Math.round(((oavgInfo[i]) / 1024) * 100) / 100).toFixed(2)
        }
      }
      payload.folwAvg = {
        imax: imaxInfo,
        imin: iminInfo,
        iavg: iavgInfo,

        omax: omaxInfo,
        omin: ominInfo,
        oavg: oavgInfo,
        allTime: times,
        //idata:idata,
        //odata:odata
      }
      payload.unitState = unitState
      if (folwInfo) {
        yield put({
          type: 'querySuccess',
          payload,
        })
      }
    },
    //丢包   时间间隔已更改
    * queryLoss ({ payload }, { call, select, put }) {
      let time = []
      let out = []
      let ins = []
      let { lossValue, timeOP } = peformanceCfg
      let lossStart = yield select(({ interfaceChart }) => interfaceChart.lossStart)
      let lossEnd = yield select(({ interfaceChart }) => interfaceChart.lossEnd)
      let lossTimescope = yield select(({ interfaceChart }) => interfaceChart.lossTimescope)
      let lossGran = yield select(({ interfaceChart }) => interfaceChart.lossGran)
      let branch = payload.branch
      let must = []
      let should = [{ term: { "kpiname.keyword": '端口输入丢包数实际值' } },{ term: { "kpiname.keyword": '端口输出丢包数实际值' } }]
      let bool = { bool: { should: should } }
      let branchs = { term: { "branchname.keyword": branch } }
      let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
      if ((lossStart === 0 && lossEnd === 0) || (lossStart === undefined && lossEnd === undefined)) {
        clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(lossTimescope) * 3600 } } }
      } else {
        clock = { range: { clock: { gt: lossStart, lt: lossEnd } } }
      }
      must.push({ term: { "hostip.keyword": payload.neUUID } })
      must.push({ term: { "keyword.keyword": payload.poetName } })
      must.push(branchs)
      must.push(clock)
      must.push(bool)
      lossValue.query.bool.must = must

      timeOP.query.bool.must = []
      timeOP.query.bool.must.push({"term":{"hostip.keyword":payload.neUUID}})
      timeOP.query.bool.must.push({"term":{"branchname.keyword":branch}})
      timeOP.query.bool.must.push({"term":{"keyword.keyword":payload.poetName}})
      timeOP.query.bool.must.push({"range":{"clock":{"gt": Date.parse(new Date()) /1000 - 1200}}})
      timeOP.query.bool.must.push({"term":{"kpiname.keyword":'端口输入丢包数实际值'}})
      let loss = {}
      const times = yield call ( queryInterfaceInfo, timeOP )
      if(times.aggregations.top_info && times.aggregations.top_info.hits.hits.length > 0){
      	let gran = times.aggregations.top_info.hits.hits
      	let op = (gran[0]._source.clock - gran[1]._source.clock)/60
      	lossValue.aggs.clock_value.date_histogram.interval = (op === 0 ? 5 : op )+'m'
      	loss = yield call(queryInterfaceInfo, lossValue)
      }
      if (loss.success) {
        let lossResArr = loss.aggregations.clock_value.buckets
        if (lossResArr && lossResArr.length !== 0) {	//如果查到数据的话
          for (let info of lossResArr) {
            time.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))//时间
            let allData = info.kpiname_info.buckets
            if (allData.length === 1) {
              allData.push({})
            }
            if (allData.length === 0) {
              ins.push(0)
              out.push(0)
            } else {
              for (let i = 0; i < allData.length; i++) {
                if (allData[i].key === '端口输入丢包数实际值') {
                  ins.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === '端口输出丢包数实际值') {
                  out.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输入丢包数实际值') {
                  ins.push(0)
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输出丢包数实际值') {
                  out.push(0)
                }
              }
            }
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            lossChart: {
              inx: ins,
              outx: out,
              y: time,
            },
          },
        })
      }
    },
    //错包    时间自适应已完成
    * queryWrong ({ payload }, { call, select, put }) {
      let time = []
      let out = []
      let ins = []
      let { wrongValue, timeOP } = peformanceCfg
      let wrongStart = yield select(({ interfaceChart }) => interfaceChart.wrongStart)
      let wrongEnd = yield select(({ interfaceChart }) => interfaceChart.wrongEnd)
      let wrongTimescope = yield select(({ interfaceChart }) => interfaceChart.wrongTimescope)
      let wrongGran = yield select(({ interfaceChart }) => interfaceChart.wrongGran)
      let branch = payload.branch
      let must = []
      let should = [{ term: { "kpiname.keyword": '端口输入错包数实际值' } },{ term: { "kpiname.keyword": '端口输出错包数实际值' } }]
      let bool = { bool: { should: should } }
      let branchs = { term: { "branchname.keyword": branch } }
      let clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } }
      if ((wrongStart === 0 && wrongEnd === 0) || (wrongStart === undefined && wrongEnd === undefined)) {
        clock = { range: { clock: { gt: Date.parse(new Date()) /1000 - parseInt(wrongTimescope) * 3600 } } }
      } else {
        clock = { range: { clock: { gt: wrongStart, lt: wrongEnd } } }
      }
      must.push({ term: { "hostip.keyword": payload.neUUID } })
      must.push({ term: { "keyword.keyword": payload.poetName } })
      must.push(branchs)
      must.push(clock)
      must.push(bool)
      wrongValue.query.bool.must = must

      timeOP.query.bool.must = []
      timeOP.query.bool.must.push({"term":{"hostip.keyword":payload.neUUID}})
      timeOP.query.bool.must.push({"term":{"branchname.keyword":branch}})
      timeOP.query.bool.must.push({"term":{"keyword.keyword":payload.poetName}})
      timeOP.query.bool.must.push({"range":{"clock":{"gt": Date.parse(new Date()) /1000 - 1200}}})
      timeOP.query.bool.must.push({"term":{"kpiname.keyword":'端口输入错包数实际值'}})
      let wrong = {}
      const times = yield call ( queryInterfaceInfo, timeOP )
      if(times.aggregations.top_info && times.aggregations.top_info.hits.hits.length > 0){
      	let gran = times.aggregations.top_info.hits.hits
      	let op = (gran[0]._source.clock - gran[1]._source.clock)/60
      	wrongValue.aggs.clock_value.date_histogram.interval = (op === 0 ? 5 : op )+'m'
      	wrong = yield call(queryInterfaceInfo, wrongValue)
      }
      if (wrong.success) {
        let wrongResArr = wrong.aggregations.clock_value.buckets
        if (wrongResArr && wrongResArr.length !== 0) {	//如果查到数据的话
          for (let info of wrongResArr) {
            time.push(new Date(info.key).format('yyyy-MM-dd hh:mm:ss'))//时间
            let allData = info.kpiname_info.buckets
            if (allData.length === 1) {
              allData.push({})
            }
            if (allData.length === 0) {
              ins.push(0)
              out.push(0)
            } else {
              for (let i = 0; i < allData.length; i++) {
                if (allData[i].key === '端口输入错包数实际值') {
                  ins.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === '端口输出错包数实际值') {
                  out.push(allData[i].avg_value.value.toFixed(2))
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输入错包数实际值') {
                  ins.push(0)
                }
                if (allData[i].key === undefined && allData[i - 1].key === '端口输出错包数实际值') {
                  out.push(0)
                }
              }
            }
          }
        }
        yield put({
          type: 'querySuccess',
          payload: {
            wrongChart: {
              inx: ins,
              outx: out,
              y: time,
            },
          },
        })
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
      newData.q = `n_OrgID =='${payload.branch}';n_InstanceID=='${payload.poetName}';nodeAlias == '${payload.neUUID}';`+ firstOccurrence
      newData.sort = 'firstOccurrence,desc'
      const data = yield call(queryFault, newData)
      if (data.success) {
        yield put({
          type: 'querySuccess',
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
            poetName: payload.poetName,
            branch: payload.branch,
          },
        })
      }
    },
  },
  reducers: {
    //这里控制弹出窗口显示
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
