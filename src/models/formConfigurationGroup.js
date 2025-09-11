import { routerRedux } from 'dva/router'
import { queryTree } from '../services/reportFunctions'
import { message } from 'antd'
export default {
	namespace: 'formConfigurationGroup',

	state: {
		Type: '',
		q: '',
		batchDelete: false,
		selectedRows: [],
		pagination: {									//分页对象
	      showSizeChanger: true,						//是否可以改变 pageSize
	      showQuickJumper: true, //是否可以快速跳转至某页
	      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
	      current: 1,									//当前页数
	      total: 0,										//数据总数？
	      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	    },
	    dataSource: [],
	    modalVisible: false,
	    cebTree: [],
	    creditCardTree: [],
	    eventTree: [],
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
		      	if (location.pathname === '/formConfigurationGroup') {
              dispatch({ type: 'query',payload: {},})
		      		//dispatch(routerRedux.push('/formConfigurationGroup/formConfigurationInfo'))
		      	} else if (location.pathname.includes('/formConfigurationGroup/')) {
		      		dispatch({
		      			type: 'query',
		      			payload: {
		      			},
		      		})
		      	}
	      	})
		},
	},

	effects: {
		* query ({ payload }, { put, call }) {
			const data = yield call(queryTree, payload)
			if (data.success) {
				let cebTree = []
				let creditCardTree = []
				let eventTree = []
				cebTree.push(data[2])
				creditCardTree.push(data[1])
				eventTree.push(data[0])
				yield put({
					type: 'setState',
					payload: {
						cebTree,
						creditCardTree,
						eventTree,
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
