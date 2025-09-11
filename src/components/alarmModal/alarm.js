import { querySeverity, queryJournal } from '../../services/historyview'
import { xykquerySeverity, xykMSMQuery, xykqueryJournal } from '../../services/xykhistoryview'
import { query as MSMQuery } from '../../services/notificationInfo'
import { outCall } from '../../services/alarms'
import { message } from 'antd'
import queryString from 'query-string';
import NProgress from 'nprogress'

export default {

	namespace: 'alarm',				// @@@

	state: {
        levelChangeDataSource: [],											// 级别变更等级
        levelChangePagination: {												// 级别变更记录
			showSizeChanger: true,												// 是否可以改变 pageSize
			showQuickJumper: true, // 是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
			current: 1,																		// 当前页数
			total: 0,
		},
		SMSnotificationDataSource: [],									// 短信通知
        SMSnotificationPagination: {										// 短信通知记录
			showSizeChanger: true,												// 是否可以改变 pageSize
			showQuickJumper: true, // 是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
			current: 1,																		// 当前页数
			total: 0,
		},
        eventDataSource: [],														// 事件处置记录
        eventDisposalPagination: {											// 事件处置记录
			showSizeChanger: true,												// 是否可以改变 pageSize
			showQuickJumper: true, // 是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
			current: 1,																		// 当前页数
			total: 0,
		},
        callOutList:[],
		branchType: 'ZH',
	},

	subscriptions: {
		setup({ dispatch, history }) {
		},
	},

	effects: {
		* querySeverity({ payload }, { call, put, select }) {
			//选择信用卡或者总行的请求
			const branchType = yield select(({ alarm }) => alarm.branchType)
			//查级别变更数据
			const data = branchType == 'XYK' ? yield call(xykquerySeverity, payload) : yield call(querySeverity, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						levelChangeDataSource: data.content,
						levelChangePagination: {												//级别变更记录
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
						},
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* queryDetails({ payload }, { call, put, select }) {
			//选择信用卡或者总行的请求
			const branchType = yield select(({ alarm }) => alarm.branchType)
			//查历史告警短信数据
			const data = branchType == 'XYK' ? yield call(xykMSMQuery, payload) : yield call(MSMQuery, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						SMSnotificationDataSource: data.content,
						SMSnotificationPagination: {										//短信通知记录
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
						},
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* queryJournal({ payload }, { call, put, select }) {
			//选择信用卡或者总行的请求
			const branchType = yield select(({ alarm }) => alarm.branchType)
			//查事件处置数据
			const data = branchType == 'XYK' ? yield call(xykqueryJournal, payload) : yield call(queryJournal, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						eventDataSource: data.content,
						eventDisposalPagination: {											//事件处置记录
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
						},
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},

		* outCallResult({ payload }, { call, put }) {
			const data = yield call(outCall, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						callOutList: data.list,
					},
				})
			}
		}, 
	},

	reducers: {
		setState(state, action) {
			if (state.title !== '') {
				delete action.payload.title
			}
			return { ...state, ...action.payload }
		},
	},

}
