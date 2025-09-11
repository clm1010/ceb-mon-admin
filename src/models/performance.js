import { message } from 'antd'
import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryConfig, queryByDay,queryByDay1 } from '../services/dashboard'
import { queryFault } from '../services/historyview'
import { parse } from 'qs'
import { config } from '../utils/index'
import moment from 'moment'
import lodash from 'lodash'
export default {
  namespace: 'performance',
  state: {
    alarmList: [],
    initValue: config.countDown,					//倒计时刷新初始值
    countState: false,							//倒计时play状态为true,pause状态为false
    lossList: [],								//设备丢包率列表
    responseList: [],							//设备响应时间列表
    cpuList: [],									//设备CPU使用率列表
    memoryList: [],								//设备内存使用率列表
    portUsageList: [], //Over 50 Interfaces
    portUsageInList: [], //
    portTrafficList: [], //Top 10 Interfaces by Traffic
    portTrafficInList: [],
    oelColumns: [],
    inForwardDateSource: [],//端口输入包转发数
    outForwardDateSource: [],//端口输出包转发数
    inForwardRateDateSource: [],//端口输入包转发率
    outForwardRateDateSource: [],//端口输出包转发率
    inForwardPagination: {//端口输入包转发数
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    outForwardPagination: {//端口输出包转发数
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    inForwardRatePagination: {//端口输入包转发率
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    outForwardRatePagination: {//端口输出包转发率
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    paginationTopTrafficIn: {
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    paginationPortUsage: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    paginationPortUsageIn: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '50'],
    },
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
    },
    paginationMemory: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
    },
    paginationCpu: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
    },
    paginationResponse: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
    },
    paginationLoss: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
    },
    paginationTopTraffic: {
      simple: false,
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
    },
    paginationInPortDicards: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    InPortDicardsList: [],
    paginationOutPortDicards: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    OutPortDicardsList: [],
    paginationInPortError: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    InPortErrorList: [],
    paginationOutPortError: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    OutPortErrorList: [],
    paginationInPortError1: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    InPortErrorList1: [],
    paginationOutPortError1: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    OutPortErrorList1: [],
    paginationInPortDicards1: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    InPortDicardsList1: [],
    paginationOutPortDicards1: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    OutPortDicardsList1: [],
    severityMap: {},
    typeValue: '',
    firmValue: '',
    firstValue: [],
    flowTimeStart: 0, //时间选择宽的开始时间 端口流量
    flowTimeEnd: 0, //时间选择宽的结束时间 端口流量
    usageStart: 0, //端口利用率
    usageEnd: 0, //端口利用率
    lossStart: 0, //丢包
    lossEnd: 0, //丢包
    wrongStart: 0, //错包
    wrongEnd: 0, //错包
    cpuNums: 0, //cpu告警数
    menNums: 0, //内存告警数
    equDownNums: 0, //设备Down告警数
    equUpNums: 0, //设备Up告警数
    portDownNums: 0, //端口Down告警数
    porUpNums: 0, //端口up告警数，
    oneHour: false,
    towHour: false,
    toDay: true,
    severity1: true,
    severity2: true,
    severity3: true,
    severity4: true,
    severity5: true,
    rangePicker: false,
    rangePickerDate: [],
    netDomain:'',
    queryTerms:'',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dashboard/performance') {
//        dispatch({type: 'query', payload: location.query,})
          dispatch({ type: 'queryEvent', payload: location.query })
          // dispatch({ type: 'querysysEvent', payload: location.query })
          dispatch({ type: 'queryFault', payload: location.query })
          dispatch({ type: 'queryTopUsage', payload: location.query })
          dispatch({ type: 'queryTopUsageIn', payload: location.query })
          dispatch({ type: 'queryTopTraffic', payload: location.query })
          dispatch({ type: 'queryTopRespon', payload: location.query })
          dispatch({ type: 'queryTopLoss', payload: location.query })
          dispatch({ type: 'queryTopCPU', payload: location.query })
          dispatch({ type: 'queryTopMem', payload: location.query })
          dispatch({ type: 'queryInDicards', payload: location.query })
          dispatch({ type: 'queryOutDicards', payload: location.query })
          dispatch({ type: 'queryInError', payload: location.query })
          dispatch({ type: 'queryOutError', payload: location.query })
          dispatch({ type: 'queryTopTrafficIn', payload: location.query })
          dispatch({ type: 'outForwardQuery', payload: location.query })
          dispatch({ type: 'inForwardQuery', payload: location.query })
          dispatch({ type: 'outForwardRateQuery', payload: location.query })
          dispatch({ type: 'inForwardRateQuery', payload: location.query })
        }
        if(location.pathname === '/dashboard/Discard_error'){
          const query = location.query ? location.query : {}
          dispatch({type:'querySuccess',payload:query})
          dispatch({ type: 'queryInErrorinfo', payload: query })
          dispatch({ type: 'queryOutErrorinfo', payload: query })
          dispatch({ type: 'queryInDicardsinfo', payload: query })
          dispatch({ type: 'queryOutDicardsinfo', payload: query })
        }
        if(location.pathname === '/dashboard/Response'){
          dispatch({ type: 'queryTopRespon', payload: location.query })
        }
        if(location.pathname === '/dashboard/Loss'){
          dispatch({ type: 'queryTopLoss', payload: location.query })
        }
        if(location.pathname === '/dashboard/CPU'){
          dispatch({ type: 'queryTopCPU', payload: location.query })
        }
        if(location.pathname === '/dashboard/Memory'){
          dispatch({ type: 'queryTopMem', payload: location.query })
        }if(location.pathname === '/dashboard/events'){
          dispatch({ type: 'querysysEvent', payload: location.query })
        }
      })
    },
  },
  effects: {
    //告警查询
    * queryEvent ({ payload }, { call, put, select }) {
    	let oneHour = yield select(({ performance }) => performance.oneHour)//当前小时
    	let towHour = yield select(({ performance }) => performance.towHour)//2小时
    	let toDay = yield select(({ performance }) => performance.toDay)//今天
    	let rangePicker = yield select(({ performance }) => performance.rangePicker)//自定义时间
    	let severity1 = yield select(({ performance }) => performance.severity1)
    	let severity2 = yield select(({ performance }) => performance.severity2)
    	let severity3 = yield select(({ performance }) => performance.severity3)
    	let severity4 = yield select(({ performance }) => performance.severity4)
    	let severity5 = yield select(({ performance }) => performance.severity5)
    	let rangePickerDate = yield select(({ performance }) => performance.rangePickerDate)
    	let q = 'firstOccurrence <= ' + moment().add(1, 'days').format('YYYY-MM-DD') + ";(n_ComponentType==网络)"
    	let severity = ''
    	let sql = ''
    	if (oneHour) {
    		q = q + `;hiscope=='hour'`
    	} else if (towHour) {
    		let end = moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				let statr = moment(Date.parse(new Date()) / 1000 - 7200, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				q = q + `;firstOccurrence=timein=(${statr},${end})`
    	} else if (toDay) {
    		q = q + `;hiscope=='today'`
    	} else if (rangePicker) {
    		let end = moment(rangePickerDate[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				let statr = moment(rangePickerDate[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				q = q + `;firstOccurrence=timein=(${statr},${end})`
    	}

    	if (severity1) {
    		severity = severity + ' or n_CustomerSeverity==1'
    	}
    	if (severity2) {
    		severity = severity + ' or n_CustomerSeverity==2'
    	}
    	if (severity3) {
    		severity = severity + ' or n_CustomerSeverity==3'
    	}
    	if (severity4) {
    		severity = severity + ' or n_CustomerSeverity==4'
    	}
    	if (severity5) {
    		severity = severity + ' or n_CustomerSeverity==5'
    	}
    	if(severity.length > 0){
    		sql = q + ';(' + severity.substring(3, severity.length) + ')'
    	}else {
    		sql = q
    	}
    	let params = { q: sql, sort: 'firstOccurrence,desc', pageSize: 100 }
    	const data = yield call ( queryFault, params )
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload:{
            alarmList:data.content,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.content.length,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            }
          }
        })
      }
    
    },
     //SYSLOG告警查询
     * querysysEvent ({ payload }, { call, put, select }) {
      // let oneHour = yield select(({ performance }) => performance.oneHour)//当前小时
      // let towHour = yield select(({ performance }) => performance.towHour)//2小时
      // let toDay = yield select(({ performance }) => performance.toDay)//今天
      // let rangePicker = yield select(({ performance }) => performance.rangePicker)//自定义时间
      let severity1 = yield select(({ performance }) => performance.severity1)
      let severity2 = yield select(({ performance }) => performance.severity2)
      let severity3 = yield select(({ performance }) => performance.severity3)
      let severity4 = yield select(({ performance }) => performance.severity4)
      let severity5 = yield select(({ performance }) => performance.severity5)
      // let rangePickerDate = yield select(({ performance }) => performance.rangePickerDate)
      let end = moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      let statr = moment(Date.parse(new Date()) / 1000 - 604800, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      let q = ''
      if(payload){

        if(payload.IP && payload.IP !== ''){

          q = 'firstOccurrence <= ' + moment().add(1, 'days').format('YYYY-MM-DD') + ";(n_ComponentType==网络)"+`;nodeAlias=='*${payload.IP}*'`+ 
          ";alertGroup=='*未知SYSLOG事件*'"+`;firstOccurrence=timein=(${statr},${end})`
        }
        if(payload.Appname && payload.Appname!== ''&& payload.IP === ''){
          q = 'firstOccurrence <= ' + moment().add(1, 'days').format('YYYY-MM-DD') + ";(n_ComponentType==网络)"+`;n_AppName=='${payload.Appname}'`+ 
          ";alertGroup=='*未知SYSLOG事件*'"+`;firstOccurrence=timein=(${statr},${end})`
        }
        if(payload.Appname && payload.IP && payload.IP !== '' && payload.Appname!== ''){
          q = 'firstOccurrence <= ' + moment().add(1, 'days').format('YYYY-MM-DD') + ";(n_ComponentType==网络)"+`;nodeAlias=='*${payload.IP}*'`+`;n_AppName=='${payload.Appname}'`+ 
          ";alertGroup=='*未知SYSLOG事件*'"+`;firstOccurrence=timein=(${statr},${end})`
        }
        if(payload.Appname === '' && payload.IP === ''){
          q = 'firstOccurrence <= ' + moment().add(1, 'days').format('YYYY-MM-DD') + ";(n_ComponentType==网络)"+ ";(alertGroup=='*未知SYSLOG事件*')"+`;firstOccurrence=timein=(${statr},${end})`
        }
      }else{
        q = 'firstOccurrence <= ' + moment().add(1, 'days').format('YYYY-MM-DD') + ";(n_ComponentType==网络)"+ ";(alertGroup=='*未知SYSLOG事件*')"+`;firstOccurrence=timein=(${statr},${end})`
      }
      // q = q + `;firstOccurrence=timein=(${statr},${end})`
      
      let severity = ''
      let sql = ''
      // if (oneHour) {
      //   q = q + `;hiscope=='hour'`
      // } else if (towHour) {
      //   let end = moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      //   let statr = moment(Date.parse(new Date()) / 1000 - 7200, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      //   q = q + `;firstOccurrence=timein=(${statr},${end})`
      // } else if (toDay) {
      //   q = q + `;hiscope=='today'`
      // } else if (rangePicker) {
      //   let end = moment(rangePickerDate[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      //   let statr = moment(rangePickerDate[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      //   q = q + `;firstOccurrence=timein=(${statr},${end})`
      // }

      if (severity1) {
        severity = severity + ' or n_CustomerSeverity==1'
      }
      if (severity2) {
        severity = severity + ' or n_CustomerSeverity==2'
      }
      if (severity3) {
        severity = severity + ' or n_CustomerSeverity==3'
      }
      if (severity4) {
        severity = severity + ' or n_CustomerSeverity==4'
      }
      if (severity5) {
        severity = severity + ' or n_CustomerSeverity==5'
      }
      if(severity.length > 0){
        sql = q + ';(' + severity.substring(3, severity.length) + ')'
      }else {
        sql = q
      }
      let params = { q: sql, sort: 'firstOccurrence,desc', pageSize: 100 }
      const data = yield call ( queryFault, params )
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload:{
            alarmList:data.content,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.content.length,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            }
          }
        })
      }
    },
    //总行端口输出流量带宽利用率最高的10条端口
    * queryTopUsage ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topUsage = []
      let branchs =	{ term: { branchname: branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      topUsage.push(branchs)
      topUsage.push(ranges)
      topUsage.push({ term: { subcompontid: 'Port' } })
      if(payload && payload.queryTerms){
        topUsage = [...topUsage,...payload.queryTerms]
      }

      let topUsageFirst = []
      if (branch === 'ZH') {
        topUsage.push({ term: { kpiname: '总行端口输出流量带宽利用率' } })
      } else {
        topUsage.push({ term: { kpiname: '端口输出流量带宽利用率' } })
      }
      let portUsageResult
      let portUsageTop10 = peformanceCfg.topUsage10//top查询语句
      let portInfo = peformanceCfg.portInfo//端口描述
      portUsageTop10.query.bool.must = []//先清空
     // portUsageTop10.query.bool.should = []
     //portUsageTop10.query.bool.should = topUsageFirst
     	if(topUsageFirst.length > 0) {
     		topUsage.push( { bool:{ should: topUsageFirst }})
     	}
      portUsageTop10.query.bool.must = topUsage
      portUsageResult = yield call(queryByDay, portUsageTop10)
      let portUsageListTop20 = []
      let portList = []
      let portStart = []
      if (portUsageResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of portUsageResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)//去掉uuid相同的对象，因为数据是已经排好序的，所有只会保留最大值
          return item
        }, [])
        portList = port.slice(0, 10)
      }
      for (let info of portList) {
        let item = {}
        item.hostName = info.hostname
        item.interfaceName = info.keyword
        item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')
        item.value = info.value
        item.uuid = info.mo
        item.histIp = info.hostip
        item.branchname = info.branchname
        portInfo.query.bool.must[0].term.hostip = item.histIp
        portInfo.query.bool.must[1].term.keyword = item.interfaceName
        portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
        const states = yield call(queryConfig, portInfo)
        if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
          for (let state of states.aggregations.kpiname_info.buckets) {
            if (state.key === '端口实际状态') {
              item.sta = state.top_info.hits.hits[0]._source.value
            }
            if (state.key === '端口描述') {
              item.port = state.top_info.hits.hits[0]._source.value
            }
          }
        }
        portUsageListTop20.push(item)
      }
      function sortValue (a, b) {
        return b.value - a.value
      }
      portUsageListTop20.sort(sortValue)
      let pages = { ...payload }
      yield put({
        type: 'querySuccess',
        payload: {
          portUsageList: portUsageListTop20,
          paginationPortUsage: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: portUsageListTop20.length,
            showTotal: total => `共 ${total} 条`,
            current: Number(pages.pagePortUsage) + 1 || 1,
            pageSize: pages.pageSizePortUsage || 10,
          }
        },
      })
    },
    //端口输入流量带宽利用率TOP10
    * queryTopUsageIn ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topUsage = []//must条件
      let topTrafficFirst = []//should条件
      let branchs =	{ term: { branchname: branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      topUsage.push(branchs)
      topUsage.push(ranges)
      topUsage.push({ term: { subcompontid: 'Port' } })
      if(payload && payload.queryTerms){
        topUsage = [...topUsage,...payload.queryTerms]
      }
      if (branch === 'ZH') {
        topUsage.push({ term: { kpiname: '总行端口输入流量带宽利用率' } })
      } else {
        topUsage.push({ term: { kpiname: '端口输入流量带宽利用率' } })
      }
      let portUsageResultIn
      let topUsageIn10 = peformanceCfg.topUsageIn10
      let portInfo = peformanceCfg.portInfo
      topUsageIn10.query.bool.must = []//先清空
			if(topTrafficFirst.length > 0) {
     		topUsage.push( { bool:{ should: topTrafficFirst }})
     	}
      topUsageIn10.query.bool.must = topUsage
      portUsageResultIn = yield call(queryByDay, topUsageIn10)
      let portUsageListTopIn10 = []
      let portList = []
      let portStart = []
      if (portUsageResultIn.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of portUsageResultIn.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, [])
        portList = port.slice(0, 10)
      }
      if (portUsageResultIn.aggregations.top_info.hits.hits) {
        for (let info of portList) {
          let item = {}
          item.hostName = info.hostname
          item.interfaceName = info.keyword
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')
          item.value = info.value
          item.uuid = info.mo
          item.histIp = info.hostip
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.interfaceName
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          portUsageListTopIn10.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        portUsageListTopIn10.sort(sortValue)
        let pages = { ...payload }
        yield put({
          type: 'querySuccess',
          payload: {
            portUsageInList: portUsageListTopIn10,
            paginationPortUsageIn: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: portUsageListTopIn10.length,
              showTotal: total => `共 ${total} 条`,
              current: Number(pages.pagePortUsage) + 1 || 1,
              pageSize: pages.pageSizePortUsage || 10,
            }
          },
        })
      }
    },
    //开始
    //流量总量最高的10条端口(两个小时内数据)
    * queryTopTraffic ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topTraffic = [] //must条件
      let topTrafficFirst = []//should条件
      let branchs = { term: { branchname: branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      topTraffic.push({ term: { subcompontid: 'Port' } })
      topTraffic.push(branchs)
      topTraffic.push(ranges)
      if(payload && payload.queryTerms){
        topTraffic = [...topTraffic,...payload.queryTerms]
      }
      if (branch === 'ZH') {
        topTraffic.push({ term: { kpiname: '总行端口输出流量实际值' } })
      } else {
        topTraffic.push({ term: { kpiname: '端口输出流量实际值' } })
      }
      //查询时间范围
      let portTrafficResult
      let portTrafficTop10 = peformanceCfg.portTrafficTop10
      //portTrafficTop10.query.bool.should = []
      portTrafficTop10.query.bool.must = []
      //portTrafficTop10.query.bool.should = topTrafficFirst
      if(topTrafficFirst.length > 0) {
     		topTraffic.push( { bool:{ should: topTrafficFirst }})
     	}
      portTrafficTop10.query.bool.must = topTraffic
      portTrafficResult = yield call(queryByDay, portTrafficTop10)
      portTrafficTop10 = {}
      let portInfo = peformanceCfg.portInfo
      let portTrafficListTop20 = []
      let portList = []
      let portStart = []
      if (portTrafficResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of portTrafficResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, [])
        portList = port.slice(0, 10)
      }
      if (portTrafficResult.aggregations.top_info.hits.hits) { //如果取值成功
        for (let info of portList) {
          let item = {}
          item.hostName = info.hostname
          item.interfaceName = info.keyword
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')
          item.value = info.value
          item.uuid = info.mo
          item.histIp = info.hostip
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.interfaceName
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          portTrafficListTop20.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        portTrafficListTop20.sort(sortValue)
      }

      yield put({
        type: 'querySuccess',
        payload: {
          portTrafficList: portTrafficListTop20,
          paginationTopTraffic: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: portTrafficListTop20.length,
            showTotal: total => `共 ${total} 条`,
          }
        },
      })
    },
    * queryTopTrafficIn ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topTraffic = [] //must条件
      let topTrafficFirst = []//should条件
      let branchs = { term: { branchname: branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      topTraffic.push({ term: { subcompontid: 'Port' } })
      topTraffic.push(branchs)
      topTraffic.push(ranges)
      if(payload && payload.queryTerms){
        topTraffic = [...topTraffic,...payload.queryTerms]
      }
      if (branch === 'ZH') {
        topTraffic.push({ term: { kpiname: '总行端口输入流量实际值' } })
      } else {
        topTraffic.push({ term: { kpiname: '端口输入流量实际值' } })
      }
      //查询时间范围
      let portTrafficResult
      let portTrafficTop10 = peformanceCfg.portTrafficTopIn10
      //portTrafficTop10.query.bool.should = []
      portTrafficTop10.query.bool.must = []
      portTrafficTop10.query.bool.must = topTraffic
      portTrafficResult = yield call(queryByDay, portTrafficTop10)
      portTrafficTop10 = {}
      let portInfo = peformanceCfg.portInfo
      let portTrafficListTopIn20 = []
      let portList = []
      let portStart = []
      if (portTrafficResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of portTrafficResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, [])
        portList = port.slice(0, 10)
      }
      if (portTrafficResult.aggregations.top_info.hits.hits) { //如果取值成功
        for (let info of portList) {
          let item = {}
          item.hostName = info.hostname
          item.interfaceName = info.keyword
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')
          item.value = info.value
          item.uuid = info.mo
          item.histIp = info.hostip
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.interfaceName
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          portTrafficListTopIn20.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        portTrafficListTopIn20.sort(sortValue)
      }

      yield put({
        type: 'querySuccess',
        payload: {
          portTrafficInList: portTrafficListTopIn20,
          paginationTopTrafficIn: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: portTrafficListTopIn20.length,
            showTotal: total => `共 ${total} 条`,
          }
        },
      })
    },
    //Top 20 响应时间表 / Top 20 丢包率表
    * queryTopRespon ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topRespon = []
      let kpiname = { term: { kpiname: 'PING响应时间' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topRespon.push(kpiname)
      topRespon.push(ranges)
      topRespon.push(branchs)
      if(payload && payload.queryTerms){
        topRespon = [...topRespon,...payload.queryTerms]
      }
      //top 20 响应时间  response time;
      //查询时间范围
      let topResponFirst = []
      let responseResult
      let responseTimeTop20 = peformanceCfg.responseTimeTop20
      if (topResponFirst.length > 0) {
        topRespon.push({ bool:{ should: topResponFirst }})
      } else if (topResponFirst.length === 0 && responseTimeTop20.query.bool.should) {
        delete responseTimeTop20.query.bool.should
      }
      responseTimeTop20.query.bool.must = []
      responseTimeTop20.query.bool.must = topRespon
      responseResult = yield call(queryByDay, responseTimeTop20)
      responseTimeTop20 = {}
      let responseListTop20 = []
      let portList = []
      let portStart = []
      if (responseResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of responseResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, [])
        portList = port.slice(0, 20)
      }
      if (responseResult.aggregations.top_info.hits.hits) { //如果取值成功
        for (let info of portList) {
          let item = {}
          item.deviceName = info.hostname//主机名
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.responseValue = info.value//cup利用率
          item.histIp = info.hostip
          item.branchname = info.branchname
          responseListTop20.push(item)
        }
        function sortValue (a, b) {
          return b.responseValue - a.responseValue
        }
        responseListTop20.sort(sortValue)
        let pages = { ...payload }
        yield put({
          type: 'querySuccess',
          payload: {
            responseList: responseListTop20,
            paginationResponse: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: responseListTop20.length,
              showTotal: total => `共 ${total} 条`,
            }
          },
        })
      }
    },
    //Top 20 响应时间表 / Top 20 丢包率表
    * queryTopLoss ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topLoss = []
      let kpiname = { term: { kpiname: 'PING丢包率' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topLoss.push(kpiname)
      topLoss.push(ranges)
      topLoss.push(branchs)
      if(payload && payload.queryTerms){
        topLoss = [...topLoss,...payload.queryTerms]
      }
      
      //top 20 丢包率
      //查询时间范围
      let lossResult
      let lossRateTop20 = peformanceCfg.lossRateTop20
      
      lossRateTop20.query.bool.must = []
      lossRateTop20.query.bool.must = topLoss
      lossResult = yield call(queryByDay, lossRateTop20)
      lossRateTop20 = {}
      let lossListTop20 = []
      let portList = []
      let portStart = []
      if (lossResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of lossResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        portList = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, []).slice(0, 20)
      }
      if (lossResult.aggregations.top_info.hits.hits) { //如果取值成功
        for (let info of portList) {
          let item = {}
          item.deviceName = info.hostname//主机名
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.lossValue = info.value//cup利用率
          item.histIp = info.hostip
          item.branchname = info.branchname
          lossListTop20.push(item)
        }
        function sortValue (a, b) {
          return b.lossValue - a.lossValue
        }
        lossListTop20.sort(sortValue)
        let pages = { ...payload }
        yield put({
          type: 'querySuccess',
          payload: {
            lossList: lossListTop20,
            paginationLoss: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: lossListTop20.length,
              showTotal: total => `共 ${total} 条`,
            }
          },
        })
      }
    },
    //Top 20 CPU使用率表 / 内存使用率表
    * queryTopCPU ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { prefix: { kpiname: 'CPU利用率' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      topCpu.push({ exists: { field: 'bizarea' } })
      if(payload && payload.queryTerms){
        topCpu = [...topCpu,...payload.queryTerms]
      }
      
      //top 20 CPU使用率
      //查询时间范围
      let cpuResult
      let cpuUsageTop20 = peformanceCfg.cpuUsageTop20
      
      cpuUsageTop20.query.bool.must = []
      cpuUsageTop20.query.bool.must = topCpu
      cpuResult = yield call(queryByDay, cpuUsageTop20)
      cpuUsageTop20 = {}
      let cpuListTop20 = []
      let portList = []
      let portStart = []
      if (cpuResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of cpuResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, [])
        portList = port.slice(0, 20)
      }
      if (cpuResult.aggregations.top_info.hits.hits) { //如果取值成功
        for (let info of portList) {
          let item = {}
          item.deviceName = info.hostname//主机名
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.cpuValue = info.value//cup利用率
          item.histIp = info.hostip
          item.branchname = info.branchname
          cpuListTop20.push(item)
        }
        function sortValue (a, b) {
          return b.cpuValue - a.cpuValue
        }
        cpuListTop20.sort(sortValue)

        let pages = { ...payload }
        yield put({
          type: 'querySuccess',
          payload: {
            cpuList: cpuListTop20,
            paginationCpu: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: cpuListTop20.length,
              showTotal: total => `共 ${total} 条`,
            }
          },
        })
      }
    },
    //Top 20 CPU使用率表 / 内存使用率表
    * queryTopMem ({ payload }, { select, call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topMem = []
      let kpiname = { prefix: { kpiname: '内存利用率' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topMem.push(kpiname)
      topMem.push(ranges)
      topMem.push(branchs)
      if(payload && payload.queryTerms){
        topMem = [...topMem,...payload.queryTerms]
      }
      
      //top 20 内存使用率
      //查询时间范围

      let memoryResult
      let menUsageTop20 = peformanceCfg.menUsageTop20
      
      menUsageTop20.query.bool.must = []
      menUsageTop20.query.bool.must = topMem
      memoryResult = yield call(queryByDay, menUsageTop20)
      menUsageTop20 = {}
      let memoryListTop20 = []
      let portList = []
      let portStart = []
      if (memoryResult.aggregations.top_info.hits.hits.length > 0) {
        let hash = {}
        for (let infos of memoryResult.aggregations.top_info.hits.hits) {
          portStart.push(infos._source)
        }
        let port = portStart.reduce((item, next) => {
          hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
          return item
        }, [])
        portList = port.slice(0, 20)
      }
      if (memoryResult.aggregations.top_info.hits.hits) { //如果取值成功
        for (let info of portList) {
          let item = {}
          item.deviceName = info.hostname//主机名
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.memoryValue = info.value//cup利用率
          item.histIp = info.hostip
          item.branchname = info.branchname
          memoryListTop20.push(item)
        }
        function sortValue (a, b) {
          return b.memoryValue - a.memoryValue
        }
        memoryListTop20.sort(sortValue)
        let pages = { ...payload }
        yield put({
          type: 'querySuccess',
          payload: {
            memoryList: memoryListTop20,
            paginationMemory: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: memoryListTop20.length,
              showTotal: total => `共 ${total} 条`,
            }
          },

        })
      }
    },
    //Top 20 端口输入丢包数
    * queryInDicards ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { kpiname: '端口输入丢包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      if(payload && payload.queryTerms){
        topCpu = [...topCpu,...payload.queryTerms]
      }
      
      let InDicards = peformanceCfg.InDicards
      let portInfo = peformanceCfg.portInfo
      
      InDicards.query.bool.must = []
      InDicards.query.bool.must = topCpu
      let InDicardsInfo = []
      let portList = []
      let portStart = []
      const InDicardsData = yield call(queryByDay, InDicards)
      if (InDicardsData.success) {
        if (InDicardsData.aggregations.top_info.hits.hits.length > 0) {
          let hash = {}
          for (let infos of InDicardsData.aggregations.top_info.hits.hits) {
            portStart.push(infos._source)
          }
          let port = portStart.reduce((item, next) => {
            hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
            return item
          }, [])
          portList = port.slice(0, 20)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.keyword
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          InDicardsInfo.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        InDicardsInfo.sort(sortValue)
        yield put({
          type: 'querySuccess',
          payload: {
            InPortDicardsList: InDicardsInfo,
            paginationInPortDicards: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: InDicardsData.hits.hits.length,
              showTotal: total => `共 ${total} 条`,
            },
          },
        })
      } else {
        message.error('请求未响应！')
      }
    },
    //Top 20 端口输出丢包数
    * queryOutDicards ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { kpiname: '端口输出丢包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      if(payload && payload.queryTerms){
        topCpu = [...topCpu,...payload.queryTerms]
      }
     
      let OutDicards = peformanceCfg.OutDicards
      let portInfo = peformanceCfg.portInfo
      
      OutDicards.query.bool.must = []
      OutDicards.query.bool.must = topCpu
      let OutDicardsInfo = []
      let portList = []
      let portStart = []
      const OutDicardsData = yield call(queryByDay, OutDicards)
      if (OutDicardsData.success) {
        if (OutDicardsData.aggregations.top_info.hits.hits.length > 0) {
          let hash = {}
          for (let infos of OutDicardsData.aggregations.top_info.hits.hits) {
            portStart.push(infos._source)
          }
          let port = portStart.reduce((item, next) => {
            hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
            return item
          }, [])
          portList = port.slice(0, 20)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.keyword
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          OutDicardsInfo.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        OutDicardsInfo.sort(sortValue)
        yield put({
          type: 'querySuccess',
          payload: {
            OutPortDicardsList: OutDicardsInfo,
            paginationOutPortDicards: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: OutDicardsData.hits.hits.length,
              showTotal: total => `共 ${total} 条`,
            },
          },
        })
      } else {
        message.error('请求未响应！')
      }
    },
    //Top 20 端口输入错包数
    * queryInError ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { kpiname: '端口输入错包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      if(payload && payload.queryTerms){
        topCpu = [...topCpu,...payload.queryTerms]
      }
      
      let InError = peformanceCfg.InError
      let portInfo = peformanceCfg.portInfo
      
      InError.query.bool.must = []
      InError.query.bool.must = topCpu
      let InErrorInfo = []
      let portList = []
      let portStart = []
      const InErrorData = yield call(queryByDay, InError)
      if (InErrorData.success) {
        if (InErrorData.aggregations.top_info.hits.hits.length > 0) {
          let hash = {}
          for (let infos of InErrorData.aggregations.top_info.hits.hits) {
            portStart.push(infos._source)
          }
          let port = portStart.reduce((item, next) => {
            hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
            return item
          }, [])
          portList = port.slice(0, 20)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.keyword
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          InErrorInfo.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        InErrorInfo.sort(sortValue)
        yield put({
          type: 'querySuccess',
          payload: {
            InPortErrorList: InErrorInfo,
            paginationInPortError: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: InErrorData.hits.hits.length,
              showTotal: total => `共 ${total} 条`,
            },
          },
        })
      } else {
        message.error('请求未响应！')
      }
    },
    //Top 20 端口输出错包数
    * queryOutError ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { kpiname: '端口输出错包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }

      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      if(payload && payload.queryTerms){
        topCpu = [...topCpu,...payload.queryTerms]
      }
      
      let OutError = peformanceCfg.OutError
      let portInfo = peformanceCfg.portInfo
      
      OutError.query.bool.must = []
      OutError.query.bool.must = topCpu

      let OutErrorInfo = []
      let portList = []
      let portStart = []
      const OutErrorData = yield call(queryByDay, OutError)
      if (OutErrorData.success) {
        if (OutErrorData.aggregations.top_info.hits.hits.length > 0) {
          let hash = {}
          for (let infos of OutErrorData.aggregations.top_info.hits.hits) {
            portStart.push(infos._source)
          }
          let port = portStart.reduce((item, next) => {
            hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
            return item
          }, [])
          portList = port.slice(0, 20)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.keyword
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          OutErrorInfo.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        OutErrorInfo.sort(sortValue)
        yield put({
          type: 'querySuccess',
          payload: {
            OutPortErrorList: OutErrorInfo,
            paginationOutPortError: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: OutErrorData.hits.hits.length,
              showTotal: total => `共 ${total} 条`,
            },
          },
        })
      } else {
        message.error('请求未响应！')
      }
    },
    //查询故障统计信息
    * queryFault ({ payload }, { put, call }) {
      let cpuNums = 0//cpu告警数
      let menNums = 0//内存告警数
      let equDownNums = 0//设备Down告警数
      let equUpNums = 0//设备Up告警数
      let portDownNums = 0//端口Down告警数
      let porUpNums = 0//端口up告警数
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if(user.branch){
        branch = user.branch
      }else{
        branch = 'ZH'
      }
      let end = moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      let statr = moment(Date.parse(new Date()) / 1000 - 86400, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
      let firstOccurrence = `firstOccurrence=timein=(${statr},${end})`
      let cpuQuery = {}
      cpuQuery.pageSize = 1
      cpuQuery.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';( n_SubComponentID == 'CPU' or  n_SubComponent == 'cpu' );${firstOccurrence}`
      //cpu  告警   n_ComponentTypeID == 'NetWork';( n_SubComponentID == 'CPU' or  n_SubComponent == 'cpu' );
      const cpuData = yield call(queryFault, cpuQuery)
      if (cpuData.success) {
        cpuNums = cpuData.page.totalElements
      }
      let MemQuery = {}
      MemQuery.pageSize = 1
      MemQuery.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';( n_SubComponentID == 'Memory' or  n_SubComponent == '内存' );${firstOccurrence}`
      //内存   告警  n_ComponentTypeID == 'NetWork';( n_SubComponentID == 'Memory' or  n_SubComponent == '内存' );
      const MemData = yield call(queryFault, MemQuery)
      if (MemData.success) {
        menNums = MemData.page.totalElements
      }
      let equDownQuery = {}
      equDownQuery.pageSize = 1
      equDownQuery.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';agent=='*Ping*';((manager=='*Zabbix*';alertGroup=='ICMP_Failed') or manager!='*Zabbix*');n_ClearTime==1970-01-01T08:00:00;severity!='0';${firstOccurrence}`
      //设备down n_ComponentTypeID == 'NetWork';agent=='*Ping*';((manager=='*Zabbix*';alertGroup=='ICMP_Failed') or manager!='*Zabbix*');n_ClearTime==1970-01-01T08:00:00;severity!='0';
      const equDown = yield call(queryFault, equDownQuery)
      if (equDown.success) {
        equDownNums = equDown.page.totalElements
      }
      let equUpQuery = {}
      equUpQuery.pageSize = 1
      equUpQuery.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';agent=='*Ping*';n_ClearTime>1970-01-01T08:00:00;severity=='0';${firstOccurrence}`
      //设备up n_ComponentTypeID == 'NetWork';agent=='*Ping*';n_ClearTime>1970-01-01T08:00:00;severity=='0';
      const equUp = yield call(queryFault, equUpQuery)
      if (equUp.success) {
        equUpNums = equUp.page.totalElements
      }
      let portDownQuery = {}
      portDownQuery.pageSize = 1
      portDownQuery.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';manager!='*Zabbix*';n_InstanceID!=null;(evenTid=='*DOWN*' or evenTid=='*ADJCHG*');alertGroup!='未知SYSLOG事件';(evenTid!='*_full*' or evenTid!='*_up*');${firstOccurrence}`
      //端口down n_ComponentTypeID == 'NetWork';manager!='*Zabbix*';n_InstanceID!=null;(evenTid=='*DOWN*' or evenTid=='*ADJCHG*');alertGroup!='未知SYSLOG事件';(evenTid!='*_full*' or evenTid!='*_up*');
      const portDown = yield call(queryFault, portDownQuery)
      if (portDown.success) {
        portDownNums = portDown.page.totalElements
      }
      let portUpQuery = {}
      portUpQuery.pageSize = 1
      portUpQuery.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';manager!='*Zabbix*';n_InstanceID!=null;(evenTid=='*DOWN*' or evenTid=='*ADJCHG*');alertGroup!='未知SYSLOG事件';(evenTid=='*_full*' or evenTid=='*_up*');${firstOccurrence}`
      //端口up n_ComponentTypeID == 'NetWork';manager!='*Zabbix*';n_InstanceID!=null;(evenTid=='*DOWN*' or evenTid=='*ADJCHG*');alertGroup!='未知SYSLOG事件';(evenTid=='*_full*' or evenTid=='*_up*');
      const portUp = yield call(queryFault, portUpQuery)
      if (portUp.success) {
        porUpNums = portUp.page.totalElements
      }
      yield put({
        type: 'querySuccess',
        payload: {
          cpuNums, //cpu告警数
          menNums, //内存告警数
          equDownNums, //设备Down告警数
          equUpNums, //设备Up告警数
          portDownNums, //端口Down告警数
          porUpNums, //端口up告警数
        },
      })
    },
    //端口输出包转发数
    *outForwardQuery ( { payload }, { put, call, select } ){
      let frwardData = []
      let branch
      let outForward = []
      //let outForward = peformanceCfg.outForwardQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      let kpiname = { term: { kpiname: "端口输出包转发数" }}
      outForward.push(kpiname)
      outForward.push(ranges)
      outForward.push(branchs)
      if(payload && payload.queryTerms){
        outForward = [...outForward,...payload.queryTerms]
      }
      //增加选择start
      
      let packageForwardNum = peformanceCfg.outForwardQuery
      packageForwardNum.query.bool.must = outForward
      //end
      const data = yield call(queryByDay, packageForwardNum)
      //"mo", "moname", "clock", "value", "hostip", "keyword", "branchname"
      if(data.success && data.aggregations.topInfo.hits.hits){
        for(let info of data.aggregations.topInfo.hits.hits) {
          let item = {}
          item.portName = info._source.moname//端口名
          item.time = info._source.clock//时间
          item.value = info._source.value//值
          item.mo = info._source.mo//设备uuid
          item.hostip = info._source.hostip//设备IP
          item.keyword = info._source.keyword//设备KEYWORD
          item.branchname = info._source.branchname//分行属性
          frwardData.push(item)
        }
      }
      let hash = {}
      let port = frwardData.reduce((item, next) => {
        hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
        return item
      }, [])
      yield put({
        type: 'querySuccess',
        payload: {
          outForwardDateSource:port.slice(0,10),
          outForwardPagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: port.slice(0,10).length,
            showTotal: total => `共 ${total} 条`,
          },
        },
      })
    },
    //端口输入包转发数
    *inForwardQuery ( { payload }, { put, call, select } ){
      let frwardData = []
      let branch
      let inForward = []
      // let inForward = peformanceCfg.inForwardQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      let kpiname = { term: { kpiname: "端口输入包转发数" }}
      inForward.push(kpiname)
      inForward.push(ranges)
      inForward.push(branchs)
      if(payload && payload.queryTerms){
        inForward = [...inForward,...payload.queryTerms]
      }
      //增加选择start
     
      let packageForwardNum = peformanceCfg.inForwardQuery
      packageForwardNum.query.bool.must = inForward
      //end
      const data = yield call(queryByDay, packageForwardNum)
      //"mo", "moname", "clock", "value", "hostip", "keyword", "branchname"
      if(data.success && data.aggregations.topInfo.hits.hits){
        for(let info of data.aggregations.topInfo.hits.hits) {
          let item = {}
          item.portName = info._source.moname//端口名
          item.time = info._source.clock//时间
          item.value = info._source.value//值
          item.mo = info._source.mo//设备uuid
          item.hostip = info._source.hostip//设备IP
          item.keyword = info._source.keyword//设备KEYWORD
          item.branchname = info._source.branchname//分行属性
          frwardData.push(item)
        }
      }
      let hash = {}
      let port = frwardData.reduce((item, next) => {
        hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
        return item
      }, [])
      yield put({
        type: 'querySuccess',
        payload: {
          inForwardDateSource:port.slice(0,10),
          inForwardPagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: port.slice(0,10).length,
            showTotal: total => `共 ${total} 条`,
          },
        },
      })
    },
    //端口输出包转发率
    *outForwardRateQuery ( { payload }, { put, call, select } ){
      let frwardData = []
      let branch
      let outForwardRate = []
      // let outForwardRate = peformanceCfg.outForwardRateQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      let kpiname = { term: { kpiname: "端口输出包转发率" }}
      outForwardRate.push(kpiname)
      outForwardRate.push(ranges)
      outForwardRate.push(branchs)
      if(payload && payload.queryTerms){
        outForwardRate = [...outForwardRate,...payload.queryTerms]
      }
      //增加选择start
      
      let packageForwardRate = peformanceCfg.outForwardRateQuery
      packageForwardRate.query.bool.must = outForwardRate
      //end
      const data = yield call(queryByDay, packageForwardRate)
      //"mo", "moname", "clock", "value", "hostip", "keyword", "branchname"
      if(data.success && data.aggregations.topInfo.hits.hits){
        for(let info of data.aggregations.topInfo.hits.hits) {
          let item = {}
          item.portName = info._source.moname//端口名
          item.time = info._source.clock//时间
          item.value = info._source.value//值
          item.mo = info._source.mo//设备uuid
          item.hostip = info._source.hostip//设备IP
          item.keyword = info._source.keyword//设备KEYWORD
          item.branchname = info._source.branchname//分行属性
          frwardData.push(item)
        }
      }
      let hash = {}
      let port = frwardData.reduce((item, next) => {
        hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
        return item
      }, [])
      yield put({
        type: 'querySuccess',
        payload: {
          outForwardRateDateSource:port.slice(0,10),
          outForwardRatePagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: port.slice(0,10).length,
            showTotal: total => `共 ${total} 条`,
          },
        },
      })
    },
    //端口输入包转发率
    *inForwardRateQuery ( { payload }, { put, call, select } ){
      let frwardData = []
      let branch
      let inForwardRate = []
      // let inForwardRate = peformanceCfg.inForwardRateQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 240 } } }
      let branchs = { term: { branchname: branch } }
      let kpiname = { term: { kpiname: "端口输入包转发率" }}
      inForwardRate.push(kpiname)
      inForwardRate.push(ranges)
      inForwardRate.push(branchs)
      if(payload && payload.queryTerms){
        inForwardRate = [...inForwardRate,...payload.queryTerms]
      }
      //增加选择start
      
      let packageForwardRate = peformanceCfg.inForwardRateQuery
      packageForwardRate.query.bool.must = inForwardRate
      //end
      const data = yield call(queryByDay, packageForwardRate)
      //"mo", "moname", "clock", "value", "hostip", "keyword", "branchname"
      if(data.success && data.aggregations.topInfo.hits.hits){
        for(let info of data.aggregations.topInfo.hits.hits) {
          let item = {}
          item.portName = info._source.moname//端口名
          item.time = info._source.clock//时间
          item.value = info._source.value//值
          item.mo = info._source.mo//设备uuid
          item.hostip = info._source.hostip//设备IP
          item.keyword = info._source.keyword//设备KEYWORD
          item.branchname = info._source.branchname//分行属性
          frwardData.push(item)
        }
      }
      let hash = {}
      let port = frwardData.reduce((item, next) => {
        hash[next.mo] ? '' : hash[next.mo] = true && item.push(next)
        return item
      }, [])
      yield put({
        type: 'querySuccess',
        payload: {
          inForwardRateDateSource:port.slice(0,10),
          inForwardRatePagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: port.slice(0,10).length,
            showTotal: total => `共 ${total} 条`,
          },
        },
      })
    },
    //端口输入错包数(30分钟)
    * queryInErrorinfo ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { kpiname: '端口输入错包数实际值' } }
      let branchs = { term: { branchname: branch } }
      let value = { range: { value: { gt: 0 } } }
      topCpu.push(value)
      topCpu.push(kpiname)
      topCpu.push(branchs)
      let queryTerms
      let time 
      if(payload && payload.queryTerms){
        let cloneData = lodash.cloneDeep(payload.queryTerms)
        if(cloneData && Array.isArray(cloneData[0]) && cloneData[0][0]._isAMomentObject){
          time = cloneData.shift()
        }
        topCpu = [...topCpu,...cloneData]
        queryTerms = payload.queryTerms
      }
      if( !time && time == null || time == undefined){
        topCpu.push({ range: { clock: { gt: Date.parse(new Date())/1000 - 1800 } } })
      }
      let InError = peformanceCfg.Error_Dicards_info
      let portInfo = peformanceCfg.portInfo
      InError.query.bool.must = []
      InError.query.bool.must = topCpu
      InError.aggs.group_moname.aggs.bucket_field.bucket_sort.size = (payload && payload.size ) ? payload.size : 10
      InError.aggs.group_moname.aggs.bucket_field.bucket_sort.from = (payload && payload.from ) ? payload.from : 0
      let InErrorInfo = []
      let portStart = []
      const InErrorData = yield call(queryByDay1, InError)
      if (InErrorData.success) {
        if (InErrorData.aggregations.group_moname.buckets.length > 0) {
          for (let infos of InErrorData.aggregations.group_moname.buckets) {
            portStart.push(infos.top_info.hits.hits[0]._source)
          }
        }
        for (let info of portStart) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must[0].term.hostip = item.histIp
          portInfo.query.bool.must[1].term.keyword = item.keyword
          portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
          const states = yield call(queryConfig, portInfo)
          if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
            for (let state of states.aggregations.kpiname_info.buckets) {
              if (state.key === '端口实际状态') {
                item.sta = state.top_info.hits.hits[0]._source.value
              }
              if (state.key === '端口描述') {
                item.port = state.top_info.hits.hits[0]._source.value
              }
            }
          }
          InErrorInfo.push(item)
        }
        function sortValue (a, b) {
          return b.value - a.value
        }
        InErrorInfo.sort(sortValue)
        yield put({
          type: 'querySuccess',
          payload: {
            InPortErrorList1: InErrorInfo,
            paginationInPortError1: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: parseInt(payload.from/payload.size)+1 || 1,  //payload.from : 0   (payload.from/payload.size)+1 || 1
              pageSize: payload.size || 10,
              total: InErrorData.aggregations.count.value,
              showTotal: total => `共 ${total} 条`,
            },
            queryTerms:queryTerms,
          },
        })
      } else {
        message.error('请求未响应！')
      }
    },
    // 端口输出错包数(30分钟)
    * queryOutErrorinfo ({ payload }, { put, call, select }) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        let branch
        if (user.branch) {
          branch = user.branch
        } else {
          branch = 'ZH'
        }
        let topCpu = []
        let kpiname = { term: { kpiname: '端口输出错包数实际值' } }
        let branchs = { term: { branchname: branch } }
        let value = { range: { value: { gt: 0 } } }
        topCpu.push(value)
        topCpu.push(kpiname)
        topCpu.push(branchs)
        let queryTerms
        let time 
        if(payload && payload.queryTerms){
          let cloneData = lodash.cloneDeep(payload.queryTerms)
          if(cloneData && Array.isArray(cloneData[0]) && cloneData[0][0]._isAMomentObject){
            time = cloneData.shift()
          }
          topCpu = [...topCpu,...cloneData]
          queryTerms = payload.queryTerms
        }
        if( !time && time == null || time == undefined){
          topCpu.push({ range: { clock: { gt: Date.parse(new Date())/1000 - 1800 } } })
        }
        let OutError = peformanceCfg.Error_Dicards_info
        let portInfo = peformanceCfg.portInfo
        OutError.query.bool.must = []
        OutError.query.bool.must = topCpu
        OutError.aggs.group_moname.aggs.bucket_field.bucket_sort.size = (payload && payload.size ) ? payload.size : 10
        OutError.aggs.group_moname.aggs.bucket_field.bucket_sort.from = (payload && payload.from ) ? payload.from : 0
        let OutErrorInfo = []
        let portStart = []
        const OutErrorData = yield call(queryByDay1, OutError)
        if (OutErrorData.success) {
          if (OutErrorData.aggregations.group_moname.buckets.length > 0) {
            for (let infos of OutErrorData.aggregations.group_moname.buckets) {
              portStart.push(infos.top_info.hits.hits[0]._source)
            }
          }
          for (let info of portStart) {
            let item = {}
            item.moname = info.moname
            item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
            item.value = info.value//cup利用率
            item.histIp = info.hostip
            item.keyword = info.keyword
            item.branchname = info.branchname
            portInfo.query.bool.must[0].term.hostip = item.histIp
            portInfo.query.bool.must[1].term.keyword = item.keyword
            portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
            const states = yield call(queryConfig, portInfo)
            if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
              for (let state of states.aggregations.kpiname_info.buckets) {
                if (state.key === '端口实际状态') {
                  item.sta = state.top_info.hits.hits[0]._source.value
                }
                if (state.key === '端口描述') {
                  item.port = state.top_info.hits.hits[0]._source.value
                }
              }
            }
            OutErrorInfo.push(item)
          }
          function sortValue (a, b) {
            return b.value - a.value
          }
          OutErrorInfo.sort(sortValue)
          yield put({
            type: 'querySuccess',
            payload: {
              OutPortErrorList1: OutErrorInfo,
              paginationOutPortError1: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: parseInt(payload.from/payload.size)+1 || 1,  //
                pageSize: payload.size || 10,
                total: OutErrorData.aggregations.count.value,
                showTotal: total => `共 ${total} 条`,
              },
              queryTerms,
            },
          })
        } else {
          message.error('请求未响应！')
        }
    },
    // 端口输入丢包数(30分钟)
    * queryInDicardsinfo ({ payload }, { put, call, select }) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        let branch
        if (user.branch) {
          branch = user.branch
        } else {
          branch = 'ZH'
        }
        let topCpu = []
        let kpiname = { term: { kpiname: '端口输入丢包数实际值' } }
        let branchs = { term: { branchname: branch } }
        let value = { range: { value: { gt: 0 } } }
        topCpu.push(value)
        topCpu.push(kpiname)
        topCpu.push(branchs)
        let queryTerms
        let time 
        if(payload && payload.queryTerms){
          let cloneData = lodash.cloneDeep(payload.queryTerms)
          if(cloneData && Array.isArray(cloneData[0]) && cloneData[0][0]._isAMomentObject){
            time = cloneData.shift()
          }
          topCpu = [...topCpu,...cloneData]
          queryTerms = payload.queryTerms
        }
        if( !time && time == null || time == undefined){
          topCpu.push({ range: { clock: { gt: Date.parse(new Date())/1000 - 1800 } } })
        }
        let InDicards = peformanceCfg.Error_Dicards_info
        let portInfo = peformanceCfg.portInfo
        InDicards.query.bool.must = []
        InDicards.query.bool.must = topCpu
        InDicards.aggs.group_moname.aggs.bucket_field.bucket_sort.size = (payload && payload.size ) ? payload.size : 10
        InDicards.aggs.group_moname.aggs.bucket_field.bucket_sort.from = (payload && payload.from ) ? payload.from : 0
        let InDicardsInfo = []
        let portStart = []
        const InDicardsData = yield call(queryByDay1, InDicards)
        if (InDicardsData.success) {
          if (InDicardsData.aggregations.group_moname.buckets.length > 0) {
            for (let infos of InDicardsData.aggregations.group_moname.buckets) {
              portStart.push(infos.top_info.hits.hits[0]._source)
            }
          }
          for (let info of portStart) {
            let item = {}
            item.moname = info.moname
            item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
            item.value = info.value//cup利用率
            item.histIp = info.hostip
            item.keyword = info.keyword
            item.branchname = info.branchname
            portInfo.query.bool.must[0].term.hostip = item.histIp
            portInfo.query.bool.must[1].term.keyword = item.keyword
            portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
            const states = yield call(queryConfig, portInfo)
            if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
              for (let state of states.aggregations.kpiname_info.buckets) {
                if (state.key === '端口实际状态') {
                  item.sta = state.top_info.hits.hits[0]._source.value
                }
                if (state.key === '端口描述') {
                  item.port = state.top_info.hits.hits[0]._source.value
                }
              }
            }
            InDicardsInfo.push(item)
          }
          function sortValue (a, b) {
            return b.value - a.value
          }
          InDicardsInfo.sort(sortValue)
          yield put({
            type: 'querySuccess',
            payload: {
              InPortDicardsList1: InDicardsInfo,
              paginationInPortDicards1: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: parseInt(payload.from/payload.size)+1 || 1,  //
                pageSize: payload.size || 10,
                total: InDicardsData.aggregations.count.value,
                showTotal: total => `共 ${total} 条`,
              },
              queryTerms,
            },
          })
        } else {
          message.error('请求未响应！')
        }
    },
    //端口输出丢包数(30分钟)
    * queryOutDicardsinfo ({ payload }, { put, call, select }) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        let branch
        if (user.branch) {
          branch = user.branch
        } else {
          branch = 'ZH'
        }
        let topCpu = []
        let kpiname = { term: { kpiname: '端口输出丢包数实际值' } }
        let branchs = { term: { branchname: branch } }
        let value = { range: { value: { gt: 0 } } }
        topCpu.push(value)
        topCpu.push(kpiname)
        topCpu.push(branchs)
        let queryTerms
        let time 
        if(payload && payload.queryTerms){
          let cloneData = lodash.cloneDeep(payload.queryTerms)
          if(cloneData && Array.isArray(cloneData[0]) && cloneData[0][0]._isAMomentObject){
            time = cloneData.shift()
          }
          topCpu = [...topCpu,...cloneData]
          queryTerms = payload.queryTerms
        }
        if( !time || time == null || time == undefined){
          topCpu.push({ range: { clock: { gt: Date.parse(new Date())/1000 - 1800 } } })
        }

        let OutDicards = peformanceCfg.Error_Dicards_info
        let portInfo = peformanceCfg.portInfo
        OutDicards.query.bool.must = []
        OutDicards.query.bool.must = topCpu
        OutDicards.aggs.group_moname.aggs.bucket_field.bucket_sort.size = (payload && payload.size ) ? payload.size : 10
        OutDicards.aggs.group_moname.aggs.bucket_field.bucket_sort.from = (payload && payload.from ) ? payload.from : 0
        let OutDicardsInfo = []
        let portStart = []
        const OutDicardsData = yield call(queryByDay1, OutDicards)
        if (OutDicardsData.success) {
          if (OutDicardsData.aggregations.group_moname.buckets.length > 0) {
            for (let infos of OutDicardsData.aggregations.group_moname.buckets) {
              portStart.push(infos.top_info.hits.hits[0]._source)
            }
          }
          for (let info of portStart) {
            let item = {}
            item.moname = info.moname
            item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
            item.value = info.value//cup利用率
            item.histIp = info.hostip
            item.keyword = info.keyword
            item.branchname = info.branchname
            portInfo.query.bool.must[0].term.hostip = item.histIp
            portInfo.query.bool.must[1].term.keyword = item.keyword
            portInfo.query.bool.must[2].range.clock.gt = Date.parse(new Date()) /1000 - 86400
            const states = yield call(queryConfig, portInfo)
            if (states.success && states.aggregations.kpiname_info.buckets.length > 0) {
              for (let state of states.aggregations.kpiname_info.buckets) {
                if (state.key === '端口实际状态') {
                  item.sta = state.top_info.hits.hits[0]._source.value
                }
                if (state.key === '端口描述') {
                  item.port = state.top_info.hits.hits[0]._source.value
                }
              }
            }
            OutDicardsInfo.push(item)
          }
          function sortValue (a, b) {
            return b.value - a.value
          }
          OutDicardsInfo.sort(sortValue)
          yield put({
            type: 'querySuccess',
            payload: {
              OutPortDicardsList1: OutDicardsInfo,
              paginationOutPortDicards1: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: parseInt(payload.from/payload.size)+1 || 1,  //
                pageSize: payload.size || 10,
                total: OutDicardsData.aggregations.count.value,
                showTotal: total => `共 ${total} 条`,
              },
              queryTerms,
            },
          })
        } else {
          message.error('请求未响应！')
        }
    },
    * requery ({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
  },
  reducers: {
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
