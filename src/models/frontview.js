import { querySummary } from '../services/alarms'
import { queryById } from '../services/oel/oelEventFilter'
import { config, filterAdapter } from '../utils'
import {frontCfgs, xykfrontCfgs} from '../utils/charts'
import { message } from 'antd'
import ViewColumns from '../utils/ViewColumns'
import { queryAllosts } from '../services/osts'
import {xykqueryAllosts, xykqueryById, xykquerySummary, xyklogin} from '../services/xykfrontview' 
import Cookie from '../utils/cookie'
import { sessionTime } from '../utils/config'
export default {

  namespace: 'frontview',

  state: {
		line1Olet: [],	//第一行
		line2Olet: [],	//第二行
		line3Olet: [],	//第三行
		modalVisible: false,
		modalName: '',
		countState: true,
		initValue: config.countDown,
		line1State: false,
		line2State: false,
		line3State: false,
		sourceState: false,
		branchType:'ZH'	
  	},

  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/frontview')) {
			dispatch({
				type:'updateState',
				payload:{
					branchType:'ZH'	
				}
			})
          dispatch({
            type: 'query',
           payload: location.query,
          })
        }else if(location.pathname === '/xykfrontview'){
			dispatch({
				type:'updateState',
				payload:{
					branchType:'XYK'	
				}
			})
			dispatch({
				type:'xyklogin',
				payload: location.query,
			})
		}
      })
    },
  },

  effects: {
	* query ({ payload }, { call, put ,select}) {
			let branchType = yield select(state => state.frontview.branchType)
			let nonStringFields = []
			for (let column of ViewColumns) {
				if (column.type !== 'string') {
					nonStringFields.push(column.name)
				}
			}

			let line1Olet = []
			let line2Olet = []
			let line3Olet = []

			let datasourceId = ''
			let severityMap = []
      let frontCfgsProp = []
			//循环图形列表配置文件，从后台查询柱状图数据
	  const user = JSON.parse(sessionStorage.getItem('user'))
      if (user.branch === 'XYK' || branchType === 'XYK') {
        frontCfgsProp = xykfrontCfgs
      }else{
        frontCfgsProp = frontCfgs
      }
			for (let chart of frontCfgsProp) {
				//获取Omnibus的ObjectServer的uuid
				if (datasourceId === '') {
					const datasources = branchType === 'XYK' ? yield call(xykqueryAllosts, payload) : yield call(queryAllosts, payload)
					if (datasources.content.length > 0) {
						datasourceId = datasources.content[0].uuid
						chart.oelDatasource = datasources.content[0].uuid
					}
					//如果服务器端没有任何数据源
					else {
						message.error('系统没有配置任何告警数据源')
						return
					}
				} else {
					chart.oelDatasource = datasourceId
				}

				if (chart.oelFilter === '' || chart.oelFilter === undefined) {
					//在olet配置文件中过滤器uuid不允许为空
				} else {
					const filter = branchType === 'XYK' ? yield call(xykqueryById, chart) : yield call(queryById, chart)
					chart.title = filter.name
					if ('filter' in filter) {
						let filterStr = filterAdapter(filter.filter, nonStringFields)
						//要把所有的括号全部替换成URL转义字符,因为框架request公共类会因为括号的问题，把请求指向本地localhost
						filterStr = filterStr.replace(/\(/g, '%28')
						filterStr = filterStr.replace(/\)/g, '%29')
						filterStr = filterStr.replace(/\*/g, '%2A')

						chart.whereSQL = ` ${filterStr}`

						//查询告警数据
						const data = branchType === 'XYK' ? yield call(xykquerySummary, chart) : yield call(querySummary, chart)
						severityMap = [
		      		{ level: '1', number: data.alertsResponse.severityMap['1'] === undefined ? 0 : data.alertsResponse.severityMap['1'] },
		      		{ level: '2', number: data.alertsResponse.severityMap['2'] === undefined ? 0 : data.alertsResponse.severityMap['2'] },
		      		{ level: '3', number: data.alertsResponse.severityMap['3'] === undefined ? 0 : data.alertsResponse.severityMap['3'] },
		      		{ level: '4', number: data.alertsResponse.severityMap['4'] === undefined ? 0 : data.alertsResponse.severityMap['4'] },
		      		{ level: '100', number: data.alertsResponse.severityMap['100'] === undefined ? 0 : data.alertsResponse.severityMap['5'] },
		      	]
					} else {
						message.error(`${chart.title} 匹配不到过滤器`)

						severityMap = []
					}

					chart.data = severityMap

					if (chart.category === 'line1') {
						line1Olet.push(chart)
					} else if (chart.category === 'line2') {
						line2Olet.push(chart)
					} else if (chart.category === 'line3') {
						line3Olet.push(chart)
					}
				}
			}

			//触发reducers
			yield put({
		    type: 'querySuccess',
		    payload: {
		      line1Olet,
		      line2Olet,
		      line3Olet,
		      sourceState: true,
		    },
		  })
	},
	* xyklogin ({ payload }, { put, call }) {
		const data = yield call(xyklogin, payload)
 		if (data.success && data.token) {
		  sessionStorage.setItem('xyktoken', data.token)
		  let cookie = new Cookie('xykcookie')
		  cookie.setCookie(data.token, sessionTime) 
		  yield put({ 
			type: 'query',
			payload:payload
		 })
		}
	  },
  },

  reducers: {
  	//浏览列表
  	querySuccess (state, action) {
      return { ...state, ...action.payload }
    },

    updateState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
