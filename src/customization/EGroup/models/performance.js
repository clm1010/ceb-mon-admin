import { message } from 'antd'
import { query, sql } from '../../../services/alarms'
import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { queryAllosts } from '../../../services/osts'
import { queryConfig, queryByDay } from '../../../services/dashboard'
import { queryFault } from '../../../services/historyview'
import { parse } from 'qs'
import { config } from '../../../utils'
import moment from 'moment'

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
    severityMap: {},
    OutPortErrorList: [],
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
    rangePickerDate: []
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dashboard/performance') {
//        dispatch({type: 'query', payload: location.query,})
          dispatch({ type: 'queryEvent', payload: location.query })
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
          //dispatch({ type: 'queryOutError', payload: location.query })
          dispatch({ type: 'queryTopTrafficIn', payload: location.query })
          dispatch({ type: 'outForwardQuery', payload: location.query })
          dispatch({ type: 'inForwardQuery', payload: location.query })
          dispatch({ type: 'outForwardRateQuery', payload: location.query })
          dispatch({ type: 'inForwardRateQuery', payload: location.query })
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
      /*const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let oelCfg = {}
      oelCfg.pagination = { current: 0, pageSize: 500 }
      oelCfg.whereSQL = ' 1=1 order by FirstOccurrence desc'
      if (peformanceCfg.oelFilter) {
        oelCfg.whereSQL = `(N_OrgId = '${branch}') and ${peformanceCfg.oelFilter} order by FirstOccurrence desc`
      }
      const datasources = yield call(queryAllosts, payload)
      if (datasources.content.length > 0) {
        oelCfg.oelDatasource = datasources.content[0].uuid
      } else {
        message.error('找不到告警数据源')
      }
      const data = yield call(query, oelCfg)
      if (data.success) {
        let pages = { ...payload }
        yield put({
          type: 'querySuccess',
          payload: {
            alarmList: data.alertsResponse.alertList,
            oelColumns: peformanceCfg.oelColumns,
            severityMap: {
              Severity0: data.alertsResponse.severityMap[0] ? data.alertsResponse.severityMap[0] : 0,
              Severity1: data.alertsResponse.severityMap[1] ? data.alertsResponse.severityMap[1] : 0,
              Severity2: data.alertsResponse.severityMap[2] ? data.alertsResponse.severityMap[2] : 0,
              Severity3: data.alertsResponse.severityMap[3] ? data.alertsResponse.severityMap[3] : 0,
              Severity4: data.alertsResponse.severityMap[4] ? data.alertsResponse.severityMap[4] : 0,
              Severity5: data.alertsResponse.severityMap[100] ? data.alertsResponse.severityMap[100] : 0,
            },
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              current: Number(pages.page) + 1 || 1,
              pageSize: pages.pageSize || 10,
            },
          },
        })
      }*/
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
      //Date.parse(new Date()) /1000
      let topUsage = []
      let branchs =	{ term: { "branchname.keyword": branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      topUsage.push(branchs)
      topUsage.push(ranges)
      topUsage.push({ term: { "subcompontid.keyword": 'Port' } })
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)

      if (typeValue != '' && typeValue != 'ALL') {
        localStorage.removeItem(`${user.username}_typeValue`)
        localStorage.setItem(`${user.username}_typeValue`, typeValue)
        topUsage.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topUsage.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      } else if (typeValue === 'ALL') {
        localStorage.removeItem(`${user.username}_typeValue`)
      }

      if (firmValue != '' && firmValue != 'ALL') {
        localStorage.removeItem(`${user.username}_firmValue`)
        localStorage.setItem(`${user.username}_firmValue`, firmValue)
        topUsage.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topUsage.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      } else if (firmValue === 'ALL') {
        localStorage.removeItem(`${user.username}_firmValue`)
      }
      let topUsageFirst = []
      if (branch === 'ZH') {
        topUsage.push({ term: { "kpiname.keyword": '总行端口输出流量带宽利用率' } })
      } else {
        topUsage.push({ term: { "kpiname.keyword": '端口输出流量带宽利用率' } })
      }
      if (firstValue.length > 0) { //有条件
        let firstValueStr = ''
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {
            localStorage.removeItem(`${user.username}_firstValue`)
          } else if (firstValue.length === 0) {
            localStorage.removeItem(`${user.username}_firstValue`)
          } else {
            firstValueStr = firstValue[0]
            localStorage.removeItem(`${user.username}_firstValue`)
            localStorage.setItem(`${user.username}_firstValue`, firstValueStr)
            topUsageFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          firstValueStr = firstValue.join('_')
          localStorage.removeItem(`${user.username}_firstValue`)
          localStorage.setItem(`${user.username}_firstValue`, firstValueStr)
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topUsageFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            } else {
              message.info('条件中存在 全部 存在逻辑错误,将默认去除!', 5)
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topUsageFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
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
        portInfo.query.bool.must = []
        portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
        portInfo.query.bool.must.push({ term: { "keyword.keyword": item.interfaceName } })
        portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 1800 } } })
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
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      let topUsage = []//must条件
      let topTrafficFirst = []//should条件
      let branchs =	{ term: { "branchname.keyword": branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      topUsage.push(branchs)
      topUsage.push(ranges)
      topUsage.push({ term: { "subcompontid.keyword": 'Port' } })
      if (typeValue != '' && typeValue != 'ALL') {
        topUsage.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topUsage.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topUsage.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topUsage.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }
      if (branch === 'ZH') {
        topUsage.push({ term: { "kpiname.keyword": '总行端口输入流量带宽利用率' } })
      } else {
        topUsage.push({ term: { "kpiname.keyword": '端口输入流量带宽利用率' } })
      }
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topTrafficFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topTrafficFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topTrafficFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      let portUsageResultIn
      let topUsageIn10 = peformanceCfg.topUsageIn10
      let portInfo = peformanceCfg.portInfo
      topUsageIn10.query.bool.must = []//先清空
			//    topUsageIn10.query.bool.should = []
			//    topUsageIn10.query.bool.should = topTrafficFirst
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
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.interfaceName } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 1800 } } })
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
      let branchs = { term: { "branchname.keyword": branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      topTraffic.push({ term: { "subcompontid.keyword": 'Port' } })
      topTraffic.push(branchs)
      topTraffic.push(ranges)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topTraffic.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topTraffic.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topTraffic.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topTraffic.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }
      if (branch === 'ZH') {
        topTraffic.push({ term: { "kpiname.keyword": '总行端口输出流量实际值' } })
      } else {
        topTraffic.push({ term: { "kpiname.keyword": '端口输出流量实际值' } })
      }
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topTrafficFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topTrafficFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topTrafficFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
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
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.interfaceName } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 1800 } } })
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
      let branchs = { term: { "branchname.keyword": branch } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      topTraffic.push({ term: { "subcompontid.keyword": 'Port' } })
      topTraffic.push(branchs)
      topTraffic.push(ranges)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topTraffic.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topTraffic.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topTraffic.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topTraffic.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }
      if (branch === 'ZH') {
        topTraffic.push({ term: { "kpiname.keyword": '总行端口输入流量实际值' } })
      } else {
        topTraffic.push({ term: { "kpiname.keyword": '端口输入流量实际值' } })
      }
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topTrafficFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topTrafficFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topTrafficFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      //查询时间范围
      let portTrafficResult
      let portTrafficTop10 = peformanceCfg.portTrafficTopIn10
      //portTrafficTop10.query.bool.should = []
      portTrafficTop10.query.bool.must = []
      //portTrafficTop10.query.bool.should = topTrafficFirst
      if(topTrafficFirst.length > 0){
      	topTraffic.push({ bool:{ should: topTrafficFirst }})
      }
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
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.interfaceName } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 86400 } } })
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
      let kpiname = { term: { "kpiname.keyword": 'PING响应时间' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topRespon.push(kpiname)
      topRespon.push(ranges)
      topRespon.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topRespon.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topRespon.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topRespon.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topRespon.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }

      let topResponFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topResponFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topResponFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topResponFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      //top 20 响应时间  response time;
      //查询时间范围

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
      let kpiname = { term: { "kpiname.keyword": 'PING丢包率' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topLoss.push(kpiname)
      topLoss.push(ranges)
      topLoss.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topLoss.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topLoss.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topLoss.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topLoss.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }
      let topLossFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topLossFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topLossFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topLossFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      //top 20 丢包率
      //查询时间范围
      let lossResult
      let lossRateTop20 = peformanceCfg.lossRateTop20
      if (topLossFirst.length > 0) {
        //lossRateTop20.query.bool.should = topLossFirst
        topLoss.push({ bool:{ should: topLossFirst }})
      } else if (topLossFirst.length === 0 && lossRateTop20.query.bool.should) {
        delete lossRateTop20.query.bool.should
      }
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
      let kpiname = { prefix: { "kpiname.keyword": 'CPU利用率' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 300 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      topCpu.push({ exists: { field: 'bizarea' } })
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topCpu.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topCpu.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topCpu.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topCpu.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }

      let topCpuFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topCpuFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      //top 20 CPU使用率
      //查询时间范围
      let cpuResult
      let cpuUsageTop20 = peformanceCfg.cpuUsageTop20
      if (topCpuFirst.length > 0) {
        //cpuUsageTop20.query.bool.should = topCpuFirst
        topCpu.push({ bool:{ should: topCpuFirst }})
      } else if (topCpuFirst.length === 0 && cpuUsageTop20.query.bool.should) {
        delete cpuUsageTop20.query.bool.should
      }
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
          item.cpuPolicName = info.kpiname//cpu名字
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
      let kpiname = { prefix: { "kpiname.keyword": '内存利用率' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 300 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topMem.push(kpiname)
      topMem.push(ranges)
      topMem.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topMem.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topMem.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topMem.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topMem.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }
      let topMemFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topMemFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topMemFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topMemFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      //top 20 内存使用率
      //查询时间范围

      let memoryResult
      let menUsageTop20 = peformanceCfg.menUsageTop20
      if (topMemFirst.length > 0) {
        //menUsageTop20.query.bool.should = topMemFirst\
        topMem.push({ bool:{ should: topMemFirst }})
      } else if (topMemFirst.length === 0 && menUsageTop20.query.bool.should) {
        delete menUsageTop20.query.bool.should
      }
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
          item.kpiname = info.kpiname//指标名字
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
    //Top 10 端口输入丢包数
    * queryInDicards ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { "kpiname.keyword": '端口输入丢包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topCpu.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topCpu.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topCpu.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topCpu.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }

      let topCpuFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topCpuFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      let InDicards = peformanceCfg.InDicards
      let portInfo = peformanceCfg.portInfo
      if (topCpuFirst.length > 0) {
        //InDicards.query.bool.should = topCpuFirst
        topCpu.push({ bool:{ should: topCpuFirst }})
      } else if (topCpuFirst.length === 0 && InDicards.query.bool.should) {
        delete InDicards.query.bool.should
      }
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
          portList = port.slice(0, 10)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.keyword } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 86400 } } })
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
    //Top 10 端口输出丢包数
    * queryOutDicards ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { "kpiname.keyword": '端口输出丢包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topCpu.push({ term: { component: typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topCpu.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topCpu.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topCpu.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }

      let topCpuFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topCpuFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      let OutDicards = peformanceCfg.OutDicards
      let portInfo = peformanceCfg.portInfo
      if (topCpuFirst.length > 0) {
        //OutDicards.query.bool.should = topCpuFirst
        topCpu.push({ bool:{ should: topCpuFirst }})
      } else if (topCpuFirst.length === 0 && OutDicards.query.bool.should) {
        delete OutDicards.query.bool.should
      }
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
          portList = port.slice(0, 10)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.keyword } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 86400 } } })
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
    //Top 10 端口输入错包数
    * queryInError ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { "kpiname.keyword": '端口输入错包数实际值' } }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topCpu.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topCpu.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topCpu.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topCpu.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }

      let topCpuFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topCpuFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      let InError = peformanceCfg.InError
      let portInfo = peformanceCfg.portInfo
      if (topCpuFirst.length > 0) {
        //InError.query.bool.should = topCpuFirst
        topCpu.push({ bool:{ should: topCpuFirst }})
      } else if (topCpuFirst.length === 0 && InError.query.bool.should) {
        delete InError.query.bool.should
      }
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
          portList = port.slice(0, 10)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.keyword } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 86400 } } })
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
    //Top 10 端口输出错包数
    * queryOutError ({ payload }, { put, call, select }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      let branch
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let topCpu = []
      let kpiname = { term: { "kpiname.keyword": '端口输出错包数实际值' } }
      let ranges = { range: { clock: { gt:Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      topCpu.push(kpiname)
      topCpu.push(ranges)
      topCpu.push(branchs)
      let typeValue = yield select(({ performance }) => performance.typeValue)
      let firmValue = yield select(({ performance }) => performance.firmValue)
      let firstValue = yield select(({ performance }) => performance.firstValue)
      if (typeValue != '' && typeValue != 'ALL') {
        topCpu.push({ term: { "component.keyword": typeValue } })
      } else if (typeValue === '') {
        if (localStorage.getItem(`${user.username}_typeValue`) != null) {
          topCpu.push({ term: { "component.keyword": localStorage.getItem(`${user.username}_typeValue`) } })
        }
      }

      if (firmValue != '' && firmValue != 'ALL') {
        topCpu.push({ term: { "vendor.keyword": firmValue } })
      } else if (firmValue === '') {
        if (localStorage.getItem(`${user.username}_firmValue`) != null) {
          topCpu.push({ term: { "vendor.keyword": localStorage.getItem(`${user.username}_firmValue`) } })
        }
      }

      let topCpuFirst = []
      if (firstValue.length > 0) { //有条件
        if (firstValue.length === 1) {
          if (firstValue[0] === 'ALL') {

          } else if (firstValue.length === 0) {

          } else {
            topCpuFirst.push({ term: { "bizarea.keyword": firstValue[0] } })
          }
        } else if (firstValue.length > 1) {
          for (let i = 0; i < firstValue.length; i++) {
            if (firstValue[i] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": firstValue[i] } })
            }
          }
        }
      } else if (firstValue.length === 0) {
        if (localStorage.getItem(`${user.username}_firstValue`) != null) {
          let infosItem = localStorage.getItem(`${user.username}_firstValue`).split('_')
          for (let q = 0; q < infosItem.length; q++) {
            if (infosItem[q] != 'ALL') {
              topCpuFirst.push({ term: { "bizarea.keyword": infosItem[q] } })
            }
          }
        }
      }
      let OutError = peformanceCfg.OutError
      let portInfo = peformanceCfg.portInfo
      if (topCpuFirst.length > 0) {
       // OutError.query.bool.should = topCpuFirst
       topCpu.push({ bool:{ should: topCpuFirst }})
      } else if (topCpuFirst.length === 0 && OutError.query.bool.should) {
        delete OutError.query.bool.should
      }
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
          portList = port.slice(0, 10)
        }
        for (let info of portList) {
          let item = {}
          item.moname = info.moname
          item.time = new Date(info.clock * 1000).format('yyyy-MM-dd hh:mm:ss')//时间
          item.value = info.value//cup利用率
          item.histIp = info.hostip
          item.keyword = info.keyword
          item.branchname = info.branchname
          portInfo.query.bool.must = []
          portInfo.query.bool.must.push({ term: { "hostip.keyword": item.histIp } })
          portInfo.query.bool.must.push({ term: { "keyword.keyword": item.keyword } })
          portInfo.query.bool.must.push({ range: { clock: { gt: Date.parse(new Date()) /1000 - 86400 } } })
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
      let statr = moment(Date.parse(new Date()) / 1000 - 604800, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
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
    *outForwardQuery ( { payload }, { put, call } ){
      let frwardData = []
      let branch
      let outForward = peformanceCfg.outForwardQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt:Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      let kpiname = { term: { "kpiname.keyword": "端口输出包转发数" }}
      outForward.query.bool.must = []
      outForward.query.bool.must.push(kpiname)
      outForward.query.bool.must.push(ranges)
      outForward.query.bool.must.push(branchs)
      const data = yield call(queryByDay, outForward)
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
    *inForwardQuery ( { payload }, { put, call } ){
      let frwardData = []
      let branch
      let inForward = peformanceCfg.inForwardQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      let kpiname = { term: { "kpiname.keyword": "端口输入包转发数" }}
      inForward.query.bool.must = []
      inForward.query.bool.must.push(kpiname)
      inForward.query.bool.must.push(ranges)
      inForward.query.bool.must.push(branchs)
      const data = yield call(queryByDay, inForward)
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
    *outForwardRateQuery ( { payload }, { put, call } ){
      let frwardData = []
      let branch
      let outForwardRate = peformanceCfg.outForwardRateQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      let kpiname = { term: { "kpiname.keyword": "端口输出包转发率" }}
      outForwardRate.query.bool.must = []
      outForwardRate.query.bool.must.push(kpiname)
      outForwardRate.query.bool.must.push(ranges)
      outForwardRate.query.bool.must.push(branchs)
      const data = yield call(queryByDay, outForwardRate)
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
    *inForwardRateQuery ( { payload }, { put, call } ){
      let frwardData = []
      let branch
      let inForwardRate = peformanceCfg.inForwardRateQuery
      const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch) {branch = user.branch} else {branch = 'ZH'}
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 600 } } }
      let branchs = { term: { "branchname.keyword": branch } }
      let kpiname = { term: { "kpiname.keyword": "端口输入包转发率" }}
      inForwardRate.query.bool.must = []
      inForwardRate.query.bool.must.push(kpiname)
      inForwardRate.query.bool.must.push(ranges)
      inForwardRate.query.bool.must.push(branchs)
      const data = yield call(queryByDay, inForwardRate)
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
