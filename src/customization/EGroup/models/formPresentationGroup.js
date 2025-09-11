import { routerRedux } from 'dva/router'
import { queryTree } from '../../../services/reportFunctions'
import { message, Tree } from 'antd'
const TreeNode = Tree.TreeNode

export default {
	namespace: 'formPresentationGroup',

	state: {
		tree: [],
		defaultExpandedKeys: [],
		keys: 0,
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
	      		if (location.pathname === '/formPresentationGroup') {
		      		dispatch(routerRedux.push('/formPresentationGroup/undefined'))
		      	} else if (location.pathname.includes('/formPresentationGroup/')) {
		      		dispatch({
		      			type: 'query',
		      			payload: {
		      			},
		      		})
		      		dispatch({
		      			type: 'setState',
		      			keys: new Date().getTime(),
		      			defaultExpandedKeys: [],
		      		})
		      	}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const data = yield call(queryTree, payload)
			if (data.success) {
				let info = []
				for (let i = 0; i < 3; i++) {
					if (data[i].name === '光大') {
						info.push(data[i])
					}
				}
				yield put({
					type: 'setState',
					payload: {
						tree: info,
					},
				})
			} else {
				message.error('异常,未返回数据!')
			}
		},
	},

	reducers: {
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
