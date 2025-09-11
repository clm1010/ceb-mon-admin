import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { queryApp } from '../services/maintenanceTemplet'
import { xykqueryApp } from '../services/xykhistoryview'
import queryString from 'query-string';
export default {
	namespace: 'historyviewGroup',

	state: {
		appList: [],
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
			  //初次访问
		      	if (location.pathname === '/historyviewGroup') {
              dispatch({ type: 'query', payload: { q: '', page: 0, pageSize: 20, }})
		      		dispatch(routerRedux.push(`/historyviewGroup/historyviews`)) //直接跳转，这样做可以避免发生多余请求
		      	} else if (location.pathname.includes('/historyviewGroup/historyviews')) {
					const query = queryString.parse(location.search);
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
		      	}else if(location.pathname.includes('/historyviewGroup/xykhistoryviews')){
					const query = queryString.parse(location.search);
					if (query.q === '' || query.q === undefined || !query.q.includes('n_AppName==')) {
						dispatch({
						  type: 'query',
						  payload: {
							  q: '',
							  page: 0,
							  pageSize: 20,
							  branchType:'XYK',
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
							  branchType:'XYK',
						},
					})
				  }
				}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const user = JSON.parse(sessionStorage.getItem('user'))
			if (payload.q.length === 0 && !payload.branchType) {
				if (user.description === '超级管理员') {
					payload.q = ''
				} else {
					payload.q = `dbaID==${user.username} or dbaBID==${user.username} or applicateManagerAID==${user.username} or applicateManagerBID==${user.username} or businessManagerID==${user.username} or middlewareManagerID==${user.username} or middlewareManagerBID==${user.username} or operateManagerID==${user.username} or qualityManagerID==${user.username} or storeManagerID==${user.username} or systemManagerAID==${user.username} or systemManagerBID==${user.username}`
				}
			}else if( payload.branchType=='XYK'){
				payload.q = "dbaID=='zhdata' or dbaBID=='zhdata' or applicateManagerAID=='zhdata' or applicateManagerBID=='zhdata' or businessManagerID=='zhdata' or middlewareManagerID=='zhdata' or middlewareManagerBID=='zhdata' or operateManagerID=='zhdata' or qualityManagerID=='zhdata' or storeManagerID=='zhdata' or systemManagerAID=='zhdata' or systemManagerBID=='zhdata'"
			}
			const data = payload.branchType == 'XYK' ? yield call(xykqueryApp, payload) : yield call(queryApp, payload)
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
