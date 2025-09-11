import { queryBySql } from '../../../services/osts'
import { query as queryFilter } from '../../../services/oel/oelEventFilter'
import { queryBySql as historyiewQuery } from '../../../services/historyview'
import { message } from 'antd'
export default {

  namespace: 'monitorSummary',

  state: {
    q: '',
    f5AppNameTop: [], //蜜罐F5报警应用名称
    f5NumTop: [], //蜜罐F5报警数量
    f5State: true,
    folwAppNameTop: [], //网络全流量报警应用名称
    folwNumTop: [], //网络全流量报警数
    folwState: true,
    loginAppNameTop: [], //登录失败报警应用名称
    loginNumTop: [], //登录失败报警数
    loginState: true,
    portAppNameTop: [], //异常端口报警应用名称
    portNumTop: [], //异常端口报警数
    portState: true,
    connectAppNameTop: [], //异常连接报警应用系统名称
    connectNumTop: [], //异常连接报警数
    connectState: true,
    middlewareAppNameTop: [], //中间件安全报警应用名称
    middlewareNumTop: [], //中间件安全报警数
    middlState: true,
    monitorTop: [], //护网行动监控视图6项
    monitorNumTop: [], //护网行动监控视图6项告警数
    monitorState: true,
    f5Title: '', //oel跳转是传给oel的标题
    f5Filter: '', //跳转的oel过滤器
    folwTitle: '',
    folwFilter: '',
    loginTitle: '',
    loginFilter: '',
    portTitle: '',
    portFilter: '',
    connectTitle: '',
    connectFilter: '',
    middleTitle: '',
    middleFilter: '',
    viewFilter: 'e6501413-f909-4dac-8a17-e7bd3d056b3f', //监控视图配置器
    modalVisible: false,
    hisroryNum: [],
    dataSource: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitorSummary') {
          dispatch({ type: 'query' })
          dispatch({ type: 'queryF5' })
          dispatch({ type: 'queryFolw' })
          dispatch({ type: 'queryLogin' })
          dispatch({ type: 'queryPort' })
          dispatch({ type: 'queryConnect' })
          dispatch({ type: 'queryMiddle' })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let f5Sql = {},
        folwSql = {},
        loginSql = {},
        portSql = {},
        connectSql = {},
        middleSql = {}
      let f5Num = {},
        folwNum = {},
        loginNum = {},
        portNum = {},
        connectNum = {},
        middleNum = {}
      let monitorTop = [],
        monitorNumTop = [],
        hisroryNum = []
      let hisf5 = `select count(*) as num from reporter_status where N_SummaryCN like '%安全告警：F5设备%'  and N_MaintainStatus =0 and ${timesql}`,
        hisfolw = `select count(*) as num from reporter_status where  N_SummaryCN like '%攻击类型%' and N_MaintainStatus =0 and N_CustomerSeverity < 4 and ${timesql}`,
        hislogin = `select count(*) as num from reporter_status where N_CustomerSeverity < 4  and N_AppName !='统一监控管理平台（UMP）' and N_MaintainStatus =0 and (N_SummaryCN like '%01017%' or  N_SummaryCN like '%堡垒机%'  or N_SummaryCN like '%系统用户登陆失败报警%' ) and ${timesql}`,
        hisport = `select count(*) as num from reporter_status where (AlertGroup like '%PortConnect%' or N_SummaryCN like '%异常流量警报%' or N_SummaryCN like '%windows服务器发现异常端口%' ) and  N_MaintainStatus =0 and N_CustomerSeverity < 4 and N_AppName !='统一监控管理平台（UMP）' and ${timesql}`,
        hisconnect = `select count(*) as num from reporter_status where (AlertGroup like '%IpConnect%' or N_SummaryCN like '%SYN超阈值%' or N_SummaryCN like '%互联网web外网卡对外主动建链%' or N_SummaryCN like '%windows服务器发现异常外部IP连接%' )  and N_MaintainStatus =0 and N_CustomerSeverity < 4 and N_AppName !='统一监控管理平台（UMP）' and ${timesql}`,
        hismiddle = `select count(*) as num from reporter_status where (N_SummaryCN like '%WAF日志发现关键字报警%' or N_SummaryCN like '%护网应用安全检查发现异常%' or N_SummaryCN like '%MDlog%' ) and N_CustomerSeverity < 4  and  N_MaintainStatus !=1 and ${timesql}`
      let heard = 'select count(*) as num  from alerts.status where ',
        f5Title = '',
        f5Filter = '',
        folwTitle = '',
        folwFilter = '',
        loginTitle = '',
        loginFilter = '',
        portTitle = '',
        portFilter = '',
        connectTitle = '',
        connectFilter = '',
        middleTitle = '',
        middleFilter = ''
      let f5newDate = {},
        folwnewDate = {},
        loginnewDate = {},
        portnewDate = {},
        connecnewDate = {},
        middlenewDate = {}
      f5newDate.filter = hisf5
      folwnewDate.filter = hisfolw
      loginnewDate.filter = hislogin
      portnewDate.filter = hisport
      connecnewDate.filter = hisconnect
      middlenewDate.filter = hismiddle
      f5Sql.q = { pageSize: 1, q: 'name==\'安全监控大屏_蜜罐F5报警\'' }
      folwSql.q = { pageSize: 1, q: 'name==\'安全监控大屏_网络全流量报警\'' }
      loginSql.q = { pageSize: 1, q: 'name==\'安全监控大屏_登录失败报警\'' }
      portSql.q = { pageSize: 1, q: 'name==\'安全监控大屏_异常端口报警\'' }
      connectSql.q = { pageSize: 1, q: 'name==\'安全监控大屏_异常连接报警\'' }
      middleSql.q = { pageSize: 1, q: 'name==\'安全监控大屏_应用安全报警\'' }
      const f5 = yield call(queryFilter, f5Sql)
      const folw = yield call(queryFilter, folwSql)
      const login = yield call(queryFilter, loginSql)
      const port = yield call(queryFilter, portSql)
      const connect = yield call(queryFilter, connectSql)
      const middle = yield call(queryFilter, middleSql)
      if (f5.success && f5.content.length > 0) {
        f5Title = f5.content[0].name
        f5Filter = f5.content[0].uuid
        const f5his = yield call(historyiewQuery, f5newDate)
        f5Num = yield call(queryBySql, { uuid: '51fbf869-b754-4ef8-8866-387a84966c8e', sql: heard + f5.content[0].filter.filterItems[0].value })
        if (f5Num.arr) {
          monitorTop.push('蜜罐F5')
          monitorNumTop.push(f5Num.arr[0].num)//f5Num.arr[0].num
        } else {
          message.warning('蜜罐F5报警获取失败,请检查过滤器sql！')
        }
        if (f5his.arr) {
          hisroryNum.push(f5his.arr[0].NUM)
        } else {
          message.warning('蜜罐F5报警暂无历史数据！')
        }
      } else {
        message.error('蜜罐F5过滤器获取失败,请检查过滤器配置！')
      }
      if (folw.success && folw.content.length > 0) {
        folwTitle = folw.content[0].name
        folwFilter = folw.content[0].uuid
        const folwhis = yield call(historyiewQuery, folwnewDate)
        folwNum = yield call(queryBySql, { uuid: '51fbf869-b754-4ef8-8866-387a84966c8e', sql: heard + folw.content[0].filter.filterItems[0].value })
        if (folwNum.arr) {
          monitorTop.push('全流量')
          monitorNumTop.push(folwNum.arr[0].num)
        } else {
          message.warning('网络全流量报警获取失败,请检查过滤器sql！')
        }
        if (folwhis.arr) {
          hisroryNum.push(folwhis.arr[0].NUM)
        } else {
          message.warning('网络全流量报警暂无历史数据！')
        }
      } else {
        message.error('网络全流量过滤器获取失败,请检查过滤器配置！')
      }
      if (login.success && login.content.length > 0) {
        loginTitle = login.content[0].name
        loginFilter = login.content[0].uuid
        const loginhis = yield call(historyiewQuery, loginnewDate)
        loginNum = yield call(queryBySql, { uuid: '51fbf869-b754-4ef8-8866-387a84966c8e', sql: heard + login.content[0].filter.filterItems[0].value })
        if (loginNum.arr) {
          monitorTop.push('登录失败')
          monitorNumTop.push(loginNum.arr[0].num)
        } else {
          message.warning('登录失败报警获取失败,请检查过滤器sql！')
        }
        if (loginhis.arr) {
          hisroryNum.push(loginhis.arr[0].NUM)
        } else {
          message.warning('登录失败报警暂无历史数据！')
        }
      } else {
        message.error('登录失败过滤器获取失败,请检查过滤器配置！')
      }
      if (port.success && port.content.length > 0) {
        portTitle = port.content[0].name
        portFilter = port.content[0].uuid
        const porthis = yield call(historyiewQuery, portnewDate)
        portNum = yield call(queryBySql, { uuid: '51fbf869-b754-4ef8-8866-387a84966c8e', sql: heard + port.content[0].filter.filterItems[0].value })
        if (portNum.arr) {
          monitorTop.push('异常端口')
          monitorNumTop.push(portNum.arr[0].num)
        } else {
          message.warning('异常端口报警获取失败,请检查过滤器sql！')
        }
        if (porthis.arr) {
          hisroryNum.push(porthis.arr[0].NUM)
        } else {
          message.warning('异常端口报警暂无历史数据！')
        }
      } else {
        message.error('异常端口过滤器获取失败,请检查过滤器配置！')
      }
      if (connect.success && connect.content.length > 0) {
        connectTitle = connect.content[0].name
        connectFilter = connect.content[0].uuid
        const connecthis = yield call(historyiewQuery, connecnewDate)
        connectNum = yield call(queryBySql, { uuid: '51fbf869-b754-4ef8-8866-387a84966c8e', sql: heard + connect.content[0].filter.filterItems[0].value })
        if (connectNum.arr) {
          monitorTop.push('异常连接')
          monitorNumTop.push(connectNum.arr[0].num)
        } else {
          message.warning('异常连接报警获取失败,请检查过滤器sql！')
        }
        if (connecthis.arr) {
          hisroryNum.push(connecthis.arr[0].NUM)
        } else {
          message.warning('异常连接报警暂无历史数据！')
        }
      } else {
        message.error('异常连接过滤器获取失败,请检查过滤器配置！')
      }
      if (middle.success && middle.content.length > 0) {
        middleTitle = middle.content[0].name
        middleFilter = middle.content[0].uuid
        const middlehis = yield call(historyiewQuery, middlenewDate)
        middleNum = yield call(queryBySql, { uuid: '51fbf869-b754-4ef8-8866-387a84966c8e', sql: heard + middle.content[0].filter.filterItems[0].value })
        if (middleNum.arr) {
          monitorTop.push('应用安全')
          monitorNumTop.push(middleNum.arr[0].num)
        } else {
          message.warning('应用安全获取失败,请检查过滤器sql！')
        }
        if (middlehis.arr) {
          hisroryNum.push(middlehis.arr[0].NUM)
        } else {
          message.warning('应用安全报警暂无历史数据！')
        }
      } else {
        message.error('应用安全过滤器获取失败,请检查过滤器配置！')
      }
      let monitorState = true
      if (eval(monitorNumTop.join('+')) === 0 && monitorNumTop.length > 0 && eval(hisroryNum.join('+')) === 0) {
        monitorState = false
      }
      console.log(hisroryNum)
      yield put({
        type: 'setState',
        payload: {
          monitorTop, //护网行动监控视图6项
          monitorNumTop, //护网行动监控视图6项告警数
          hisroryNum,
          monitorState,
          f5Title, //oel跳转是传给oel的标题
          f5Filter, //跳转的oel过滤器
          folwTitle,
          folwFilter,
          loginTitle,
          loginFilter,
          portTitle,
          portFilter,
          connectTitle,
          connectFilter,
          middleTitle,
          middleFilter,
        },
      })
    },
    * queryF5 ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let heard = 'select N_AppName,count(*) as num  from reporter_status where N_SummaryCN like \'%安全告警：F5设备%\'  and N_MaintainStatus =0 and ',
        foot = ' group by N_AppName order by num asc'
      let f5Sql = {}
      f5Sql.filter = heard + timesql + foot
      let f5AppNameTop = [],
        f5NumTop = [],
        f5Group = []
      f5Group = yield call(historyiewQuery, f5Sql)
      if (f5Group.success && f5Group.arr) {
        if (f5Group.arr.length <= 5) {
          for (let group of f5Group.arr) {
            f5AppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            f5NumTop.push(group.NUM)//group.num
          }
        } else {
          for (let group of f5Group.arr.slice(f5Group.arr.length - 5, f5Group.arr.length)) {
            f5AppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            f5NumTop.push(group.NUM)//group.num
          }
        }
      } else {
        message.error('蜜罐F5报警APP分组视图数据获取失败！')
      }
      if (f5AppNameTop.length < 5 && f5AppNameTop.length != 0) {
        let lengths = 5 - f5AppNameTop.length
        let f5App = [],
          f5num = []
        for (let i = 0; i < lengths; i++) {
          f5App.push('')
          f5num.push(' ')
        }
        f5AppNameTop = [...f5App, ...f5AppNameTop]
        f5NumTop = [...f5num, ...f5NumTop]
      } else if (f5AppNameTop.length === 0) {
        let lengths = 5 - f5AppNameTop.length
        for (let i = 0; i < lengths; i++) {
          f5AppNameTop.push('')
        }
      }
      yield put({
        type: 'setState',
        payload: {
          f5AppNameTop, //蜜罐F5报警应用名称
          f5NumTop, //蜜罐F5报警数量
          f5State: false,
        },
      })
    },
    * queryFolw ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let heard = 'select N_AppName,count(*) as num  from reporter_status where N_SummaryCN like \'%攻击类型%\' and N_MaintainStatus =0 and N_CustomerSeverity < 4 and ',
        foot = ' group by N_AppName order by num asc'
      let folwSql = {}
      folwSql.filter = heard + timesql + foot
      let folwAppNameTop = [],
        folwNumTop = [],
        folwGroup = []
      folwGroup = yield call(historyiewQuery, folwSql)
      if (folwGroup.success && folwGroup.arr) {
        if (folwGroup.arr.length <= 5) {
          for (let group of folwGroup.arr) {
            folwAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            folwNumTop.push(group.NUM)//group.num
          }
        } else {
          for (let group of folwGroup.arr.slice(folwGroup.arr.length - 5, folwGroup.arr.length)) {
            folwAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            folwNumTop.push(group.NUM)//group.num
          }
        }
      } else {
        message.error('网络全流量报警APP分组视图数据获取失败！')
      }
      if (folwAppNameTop.length < 5 && folwAppNameTop.length != 0) {
        let lengths = 5 - folwAppNameTop.length
        let folws = [],
          folwApp = []
        for (let i = 0; i < lengths; i++) {
          folws.push('')
          folwApp.push(' ')
        }
        folwAppNameTop = [...folwApp, ...folwAppNameTop]
        folwNumTop = [...folws, ...folwNumTop]
      } else if (folwAppNameTop.length === 0) {
        let lengths = 5 - folwAppNameTop.length
        for (let i = 0; i < lengths; i++) {
          folwAppNameTop.push('')
        }
      }
      yield put({
        type: 'setState',
        payload: {
          folwAppNameTop, //网络全流量报警应用名称
          folwNumTop, //网络全流量报警数
          folwState: false,
        },
      })
    },
    * queryLogin ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let heard = 'select N_AppName,count(*) as num  from reporter_status where N_CustomerSeverity < 4  and N_AppName !=\'统一监控管理平台（UMP）\' and N_MaintainStatus =0 and (N_SummaryCN like \'%01017%\' or  N_SummaryCN like \'%堡垒机%\'  or N_SummaryCN like \'%系统用户登陆失败报警%\' ) and ',
        foot = ' group by N_AppName order by num asc'
      let loginSql = {}
      loginSql.filter = heard + timesql + foot
      let loginAppNameTop = [],
        loginNumTop = [],
        loginGroup = []
      loginGroup = yield call(historyiewQuery, loginSql)
      if (loginGroup.success && loginGroup.arr) {
        if (loginGroup.arr.length <= 5) {
          for (let group of loginGroup.arr) {
            loginAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            loginNumTop.push(group.NUM)//group.num
          }
        } else {
          for (let group of loginGroup.arr.slice(loginGroup.arr.length - 5, loginGroup.arr.length)) {
            loginAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            loginNumTop.push(group.NUM)//group.num
          }
        }
      } else {
        message.error('登录失败报警APP分组视图数据获取失败!')
      }
      if (loginAppNameTop.length < 5 && loginAppNameTop.length != 0) {
        let lengths = 5 - loginAppNameTop.length
        let loginApp = [],
          loginNums = []
        for (let i = 0; i < lengths; i++) {
          loginApp.push('')
          loginNums.push(' ')
        }
        loginAppNameTop = [...loginApp, ...loginAppNameTop]
        loginNumTop = [...loginNums, ...loginNumTop]
      } else if (loginAppNameTop.length === 0) {
        let lengths = 5 - loginAppNameTop.length
        for (let i = 0; i < lengths; i++) {
          loginAppNameTop.push('')
          //f5NumTop.push(0)
        }
      }
      yield put({
        type: 'setState',
        payload: {
          loginAppNameTop, //登录失败报警应用名称
          loginNumTop, //登录失败报警数
          loginState: false,
        },
      })
    },
    * queryPort ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let heard = 'select N_AppName,count(*) as num  from reporter_status where (AlertGroup like \'%PortConnect%\' or N_SummaryCN like \'%异常流量警报%\' or N_SummaryCN like \'%windows服务器发现异常端口%\' ) and  N_MaintainStatus =0 and N_CustomerSeverity < 4 and N_AppName !=\'统一监控管理平台（UMP）\' and ',
        foot = ' group by N_AppName order by num asc'
      let portSql = {}
      portSql.filter = heard + timesql + foot
      let portAppNameTop = [],
        portNumTop = [],
        portGroup = []
      portGroup = yield call(historyiewQuery, portSql)
      if (portGroup.success && portGroup.arr) {
        if (portGroup.arr.length <= 5) {
          for (let group of portGroup.arr) {
            portAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            portNumTop.push(group.NUM)//group.num
          }
        } else {
          for (let group of portGroup.arr.slice(portGroup.arr.length - 5, portGroup.arr.length)) {
            portAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            portNumTop.push(group.NUM)//group.num
          }
        }
      } else {
        message.error('异常端口报警APP分组视图数据获取失败!')
      }
      if (portAppNameTop.length < 5 && portAppNameTop.length != 0) {
        let lengths = 5 - portAppNameTop.length
        let portApp = [],
          portNums = []
        for (let i = 0; i < lengths; i++) {
          portApp.push('')
          portNums.push(' ')
        }
        portAppNameTop = [...portApp, ...portAppNameTop]
        portNumTop = [...portNums, ...portNumTop]
      } else if (portAppNameTop.length === 0) {
        let lengths = 5 - portAppNameTop.length
        for (let i = 0; i < lengths; i++) {
          portAppNameTop.push('')
        }
      }
      yield put({
        type: 'setState',
        payload: {
          portAppNameTop, //异常端口报警应用名称
          portNumTop, //异常端口报警数
          portState: false,
        },
      })
    },
    * queryConnect ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let heard = 'select N_AppName,count(*) as num  from reporter_status where  (AlertGroup like \'%IpConnect%\' or N_SummaryCN like \'%SYN超阈值%\' or N_SummaryCN like \'%互联网web外网卡对外主动建链%\' or N_SummaryCN like \'%windows服务器发现异常外部IP连接%\' )  and N_MaintainStatus =0 and N_CustomerSeverity < 4 and N_AppName !=\'统一监控管理平台（UMP）\' and ',
        foot = ' group by N_AppName order by num asc'
      let connectSql = {}
      connectSql.filter = heard + timesql + foot
      let connectAppNameTop = [],
        connectNumTop = [],
        connectGroup = []
      connectGroup = yield call(historyiewQuery, connectSql)
      if (connectGroup.success && connectGroup.arr) {
        if (connectGroup.arr.length <= 5) {
          for (let group of connectGroup.arr) {
            connectAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            connectNumTop.push(group.NUM)////group.num
          }
        } else {
          for (let group of connectGroup.arr.slice(connectGroup.arr.length - 5, connectGroup.arr.length)) {
            connectAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            connectNumTop.push(group.NUM)////group.num
          }
        }
      } else {
        message.error('异常连接报警APP分组视图数据获取失败!')
      }
      if (connectAppNameTop.length < 5 && connectAppNameTop.length != 0) {
        let lengths = 5 - connectAppNameTop.length
        let connectApp = [],
          connectNums = []
        for (let i = 0; i < lengths; i++) {
          connectApp.push('')
          connectNums.push(' ')
        }
        connectAppNameTop = [...connectApp, ...connectAppNameTop]
        connectNumTop = [...connectNums, ...connectNumTop]
      } else if (connectAppNameTop.length === 0) {
        let lengths = 5 - connectAppNameTop.length
        for (let i = 0; i < lengths; i++) {
          connectAppNameTop.push('')
        }
      }
      yield put({
        type: 'setState',
        payload: {
          connectAppNameTop, //异常连接报警应用系统名称
          connectNumTop, //异常连接报警数
          connectState: false,
        },
      })
    },
    * queryMiddle ({ payload }, { call, put }) {
      let year = `${new Date().getFullYear()}`
      let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
      let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
      let time = `${year}-${mons}-${day}`
      let timesql = `firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
      let heard = 'select N_AppName,count(*) as num  from reporter_status where (N_SummaryCN like \'%WAF日志发现关键字报警%\' or N_SummaryCN like \'%护网应用安全检查发现异常%\' or N_SummaryCN like \'%MDlog%\' ) and N_CustomerSeverity < 4  and  N_MaintainStatus !=1 and ',
        foot = ' group by N_AppName order by num asc'
      let middleSql = {}
      middleSql.filter = heard + timesql + foot
      let middlewareAppNameTop = [],
        middlewareNumTop = [],
        middleGroup = []
      middleGroup = yield call(historyiewQuery, middleSql)
      if (middleGroup.success && middleGroup.arr) {
        if (middleGroup.arr.length <= 5) {
          for (let group of middleGroup.arr) {
            middlewareAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            middlewareNumTop.push(group.NUM)//group.num
          }
        } else {
          for (let group of middleGroup.arr.slice(middleGroup.arr.length - 5, middleGroup.arr.length)) {
            middlewareAppNameTop.push(group.N_APPNAME === undefined ? '未知' : group.N_APPNAME)
            middlewareNumTop.push(group.NUM)//group.num
          }
        }
      } else {
        message.error('应用安全APP分组视图数据获取失败!')
      }
      if (middlewareAppNameTop.length < 5 && middlewareAppNameTop.length != 0) {
        let lengths = 5 - middlewareAppNameTop.length
        let middleApp = [],
          middleNums = []
        for (let i = 0; i < lengths; i++) {
          middleApp.push('')
          middleNums.push(' ')
        }
        middlewareAppNameTop = [...middleApp, ...middlewareAppNameTop]
        middlewareNumTop = [...middleNums, ...middlewareNumTop]
      } else if (middlewareAppNameTop.length === 0) {
        let lengths = 5 - middlewareAppNameTop.length
        for (let i = 0; i < lengths; i++) {
          middlewareAppNameTop.push('')
        }
      }
      yield put({
        type: 'setState',
        payload: {
          middlewareAppNameTop, //中间件安全报警应用名称
          middlewareNumTop, //中间件安全报警数
          middlState: false,
        },
      })
    },
    * queryHistory ({ payload }, { call, put }) {
      let filter = {}
      if (payload.filter) {
        filter.filter = payload.filter
      } else {
        let year = `${new Date().getFullYear()}`
        let mons = new Date().getMonth() >= 9 ? `${new Date().getMonth() + 1}` : `0${new Date().getMonth() + 1}`
        let day = new Date().getDate() >= 10 ? `${new Date().getDate()}` : `0${new Date().getDate()}`
        let time = `${year}-${mons}-${day}`
        let timesql = ` and firstOccurrence > to_date('${time} 00:00:00','yyyy-MM-dd hh24:mi:ss') and  firstOccurrence <= to_date('${time} 23:59:59','yyyy-MM-dd hh24:mi:ss')`
        filter.filter = payload.q + timesql
      }
      const data = yield call(historyiewQuery, filter)
      if (data.success && data.arr) {
        yield put({
          type: 'setState',
          payload: {
            dataSource: data.arr,
            q: payload.q,
            modalVisible: true,
          },
        })
      }
    },
  },

  reducers: {
    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
