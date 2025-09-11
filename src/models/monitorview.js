import { querySummary, sql } from '../services/alarms'
import { queryById } from '../services/oel/oelEventFilter'
import { config, filterAdapter } from '../utils'
import { monitorCfgs } from '../utils/charts'
import { message } from 'antd'
import ViewColumns from '../utils/ViewColumns'
import { queryAllosts } from '../services/osts'

/**
* 告警中心/服务台实时告警查询
* @namespace monitorview
* @requires module:告警中心/服务台实时告警查询
*/
export default {

  namespace: 'monitorview',

  state: {
		centerOlet: [],	//总行
		branchOlet: [],	//分行
		systemOlet: [],	//重要系统
		modalVisible: false,
		modalName: '',
		countState: true,
		initValue: config.countDown,
		centerState: false,
		branchState: false,
		systemState: false,
		sourceState: false,
  },

  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/monitorview')) {
          dispatch({
            type: 'query',
           payload: location.query,
          })
        }
      })
    },
  },

  effects: {
		/**
		 * 获取资源
		 * 与后台交互 调用接口 /api/v1/osts/ ,/api/v1/ef/,/api/v1/osts/alerts 获取数据
		 * @function monitorview.query
		 */
		* query ({ payload }, { call, put }) {
			let nonStringFields = []
			for (let column of ViewColumns) {
				if (column.type !== 'string') {
					nonStringFields.push(column.name)
				}
			}

			let centerOlet = []
			let branchOlet = []
			let systemOlet = []

			let datasourceId = ''
			let severityMap = []
			//循环图形列表配置文件，从后台查询柱状图数据
			for (let chart of monitorCfgs) {
				//获取Omnibus的ObjectServer的uuid
				if (datasourceId === '') {
					/**
					 * @description call queryAllosts
					 */
					const datasources = yield call(queryAllosts, payload)

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
					/**
					 * @description call queryById
					 */
					const filter = yield call(queryById, chart)
					chart.title = filter.name
					if ('filter' in filter) {
						let filterStr = filterAdapter(filter.filter, nonStringFields)
						//要把所有的括号全部替换成URL转义字符,因为框架request公共类会因为括号的问题，把请求指向本地localhost
						filterStr = filterStr.replace(/\*/g, '%2A')
						filterStr = filterStr.replace(/\(/g, '%28')
						filterStr = filterStr.replace(/\)/g, '%29')

						chart.whereSQL = ` ${filterStr}`

						//查询告警数据
						/**
						 * @description call querySummary
						 */
						const data = yield call(querySummary, chart)

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

					if (chart.category === 'consoleZhCfgs') {
						centerOlet.push(chart)
					} else if (chart.category === 'consoleBranchCfgs') {
						branchOlet.push(chart)
					} else if (chart.category === 'consoleSystemCfgs') {
						systemOlet.push(chart)
					}
				}
			}

			//触发reducers
			yield put({
		    type: 'querySuccess',
		    payload: {
		      centerOlet,
		      branchOlet,
		      systemOlet,
		      sourceState: true,
		    },
		  })
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
