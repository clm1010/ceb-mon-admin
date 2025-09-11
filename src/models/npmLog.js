import { queryNpmLog } from '../services/dashboard'
import { peformanceCfg } from '../utils/performanceOelCfg'
import Tcpmonvlan from '../routes/npmLog/tcpmonvlan'
import Tcpmon from '../routes/npmLog/tcpmon'
import Tcpmonseg from '../routes/npmLog/tcpmonseg'
import Tcpmonsegstop from '../routes/npmLog/tcpmonsegstop'
import Tcpmonvlantop from '../routes/npmLog/tcpmonvlantop'
export default {

	namespace: 'npmLog',

	state: {
		source: [],
		colume: [],
		q: '',
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/npmLog') {
					dispatch({
			          	type: 'query',
			          	payload: {
			          		q: '',
			          	},
			          	//payload: location.query,
			        })
				}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { call, put }) {
			let info = {
				queryLog: peformanceCfg.queryLog,
				path: payload.path ? payload.path : 'tcpmon',
			}
			let col = []
			switch (info.path) {
				case 'tcpmon':
					col = Tcpmon
					break
				case 'tcpmonseg':
					col = Tcpmonseg
					break
				case 'tcpmonsegstop':
					col = Tcpmonsegstop
					break
				case 'tcpmonvlan':
					col = Tcpmonvlan
					break
				default:
					col = Tcpmonvlantop
					break
			}
			const data = yield call(queryNpmLog, info)
			if (data.success && data.aggregations.top_info.hits.hits) {
				let source = []
				for (let info of data.aggregations.top_info.hits.hits) {
					source.push(info._source)
				}
				console.log(`${payload.path}:`, source)
				yield put({
					type: 'setState',
					payload: {
						source,
						colume: col,
					},
				})
			}else{
				yield put({
					type: 'setState',
					payload: {
						source: [],
						colume: col,
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
