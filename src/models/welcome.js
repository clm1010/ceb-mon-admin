
import { query } from '../services/updateHistorys'

export default {
	namespace: 'welcome',

	state: {
		notifications: [],
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      		let timeStamp = new Date().getTime()
				let endTime = timeStamp - 259200000
				let a = new Date(endTime + 28800000).toISOString()//三天前
				let b = new Date(timeStamp + 28800000).toISOString()//当前时间
		      	if (location.pathname === '/' || location.pathname === 'iam' || location.pathname === '/welcome' ) {
		      		dispatch({
		      			type: 'query',
		      			payload: {
		      				q: `updateTime=timein=(${a},${b})`,
		      			},
		      		})
		      	}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const data = yield call(query, payload)
				if (data.success) {
					yield put({
					type: 'setState',
					payload: {
						notifications: data.content,
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
