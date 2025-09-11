import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { queryApp } from '../services/maintenanceTemplet'
import queryString from "query-string";

export default {
	namespace: 'u1HistoryviewGroup',

	state: {
		appList: [],
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
            const query = queryString.parse(location.search);

		      	if (location.pathname === '/u1Historyviews') {
		      	  dispatch({
                type: 'query',
                payload:{
                  q: '',
                  page: 0,
                  pageSize: 20,
                }
              })
		      		dispatch(routerRedux.push('/u1Historyviews/u1HistoryviewScend')) //直接跳转，这样做可以避免发生多余请求
		      	} else if (location.pathname.includes('/u1Historyviews/u1HistoryviewScend')) {
			      	if (query.q === '' || query.q === undefined || !query.q.includes('n_AppName==')) {
			      		dispatch({
					        type: 'query',
					        payload: {
					          	q: '',
								page: 0,
								pageSize: 20,
					        },
					      })
			      	} else if (location.action === 'POP' && location.state === null) {
			      		location.state = '200'
			      		dispatch({
		            		type: 'query',
		            		payload: {
		            			q: '',
								page: 0,
								pageSize: 20,
		            		},
		          		})
				    }
		      	}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const data = yield call(queryApp, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						appList: data.content,
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
	},

	reducers: {
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
