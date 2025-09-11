import { query, update } from '../services/channel'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
export default {

	namespace: 'channel',

	state: {
		byOperator: false,
	    statusOperator: false,
	    statusAuto: false,
	    tabsKey: '1',
	    keys: 0,
	    spinning: true,
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/channel') {
					dispatch({
						type: 'query',
						payload: location.query,
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
						keys: new Date().getTime(),
						byOperator: data.byOperator,
					    statusOperator: data.statusOperator,
					    statusAuto: data.statusAuto,
					    tabsKey: data.byOperator ? '1' : '2',
					    spinning: false,
					},
				})
			} else {
				message.error('服务器接口异常！')
				yield put({
					type: 'setState',
					payload: {
					    spinning: false,
					},
				})
			}
		},
		* update ({ payload }, { put, call }) {
			const data = yield call(update, payload.item)
			if (data.success) {
				message.success('设置成功！')
				yield put({ type: 'requery' })
				yield put({
					type: 'setState',
					payload: {
					    spinning: false,
					},
				})
			} else {
				message.error('服务器接口异常！')
				yield put({
					type: 'setState',
					payload: {
					    spinning: false,
					},
				})
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
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
