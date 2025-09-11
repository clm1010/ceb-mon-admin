
import { nodeQuery as query } from '../../../services/reportFunctions'

export default {
	namespace: 'formPresentation',

	state: {
		type: '',
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
	    defaultActiveKey: '1',
	    id: '8a81873851ab439f015262b8abcf0001',
	    template: 'week',
	    keys: 0,
	    name: '手机客户端登录情况报表',
	},

	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
	      	//初次访问
		      	if (location.pathname.includes('/formPresentationGroup/')) {
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
			if (payload.name === undefined) {
				payload.name = '手机客户端登录情况报表'
			}
			if (payload.id === undefined) {
				payload.id = '8a81873851ab439f015262b8abcf0001'
			}
			let name = payload.name
			let id = payload.id
			const data = yield call(query, payload)
			if (data.success) {
				let source = []
				for (let info of data.content) {
					info.name = name + info.name.split(id)[1]
				}
				yield put({
					type: 'setState',
					payload: {
						dataSource: data.content,
						pagination: {									//分页对象
			              total: data.content.length,
			              showSizeChanger: true,
					      showQuickJumper: true,
					      showTotal: total => `共 ${total} 条`,
					      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
					    },
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
