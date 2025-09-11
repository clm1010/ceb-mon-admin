import { querySummary, sql } from '../services/alarms'
import { queryById } from '../services/oel/oelEventFilter'
import { config, filterAdapter } from '../utils'
import { zhCfgs } from '../utils/charts'
import { message } from 'antd'
import ViewColumns from '../utils/ViewColumns'
import { queryAllosts } from '../services/osts'

export default {

	namespace: 'centerview',

	state: {
		statusOlet: [],	//总行
		categoryOlet: [],	//分行
		attentionOlet: [],	//重要系统
		modalVisible: false,
		modalName: '',
		countState: true,
		initValue: config.countDown,
		statusState: false,
		categoryState: false,
		attentionState: false,
		sourceState: false,
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname.includes('/centerview')) {
					dispatch({
						type: 'query',
						payload: location.query,
					})
				}
			})
		},
	},

	effects: {
		* query({ payload }, { call, put }) {
			let nonStringFields = []
			for (let column of ViewColumns) {
				if (column.type !== 'string') {
					nonStringFields.push(column.name)
				}
			}

			let statusOlet = []
			let categoryOlet = []
			let attentionOlet = []

			let datasourceId = ''
			let severityMap = []
			//循环图形列表配置文件，从后台查询柱状图数据
			for (let chart of zhCfgs) {
				//获取Omnibus的ObjectServer的uuid
				if (datasourceId === '') {
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
					const filter = yield call(queryById, chart)

					if ('filter' in filter) {
						let filterStr = filterAdapter(filter.filter, nonStringFields)
						//要把所有的括号全部替换成URL转义字符,因为框架request公共类会因为括号的问题，把请求指向本地localhost
						filterStr = filterStr.replace(/\(/g, '%28')
						filterStr = filterStr.replace(/\)/g, '%29')
						filterStr = filterStr.replace(/\*/g, '%2A')

						chart.whereSQL = ` ${filterStr}`

						//查询告警数据
						const data = yield call(querySummary, chart)

						severityMap = [
							{ level: '1', number: data.alertsResponse.severityMap['1'] === undefined ? 0 : data.alertsResponse.severityMap['1'] },
							{ level: '2', number: data.alertsResponse.severityMap['2'] === undefined ? 0 : data.alertsResponse.severityMap['2'] },
							{ level: '3', number: data.alertsResponse.severityMap['3'] === undefined ? 0 : data.alertsResponse.severityMap['3'] },
							{ level: '4', number: data.alertsResponse.severityMap['4'] === undefined ? 0 : data.alertsResponse.severityMap['4'] },
							{ level: '100', number: data.alertsResponse.severityMap['5'] === undefined ? 0 : data.alertsResponse.severityMap['5'] },
						]
					} else {
						message.error(`${chart.title} 匹配不到过滤器`)

						severityMap = []
					}

					chart.data = severityMap

					if (chart.category === 'zhStatus') {
						statusOlet.push(chart)
					} else if (chart.category === 'zhCategory') {
						categoryOlet.push(chart)
					} else if (chart.category === 'zhAttention') {
						attentionOlet.push(chart)
					}
				}
			}

			//触发reducers
			yield put({
				type: 'querySuccess',
				payload: {
					statusOlet,
					categoryOlet,
					attentionOlet,
					sourceState: true,
				},
			})
		},
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			return { ...state, ...action.payload }
		},

		updateState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
