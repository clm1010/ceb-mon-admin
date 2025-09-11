import { query, create, remove, update, findById, dubbo } from '../services/zookeeper'
import { config } from '../utils'
import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { parse } from 'qs'
import queryString from 'query-string';

export default {

	namespace: 'zookeeper',

	state: {
		list: [],													//定义了当前页表格数据集合
		currentItem: {},											//被选中的行对象的集合
		modalVisible: false,										//新增的弹出窗口可见性
		modalType: 'create',										//弹出窗口的类型
		pagination: {												//分页对象
			showSizeChanger: true,									//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
			current: 1,												//当前页数
			total: null,											//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		// isSynching: false,
		// isClose: false,
		detail: {},
		batchDelete: false,
		selectedRows: [],
		loginresult: false,
		createKey: 0,
		pageChange: 0,
		q: '',
		qFilter: '',
		initValue: 10, 												//dubbo服务可用状态 10s刷新
		dubboType: true, 												//dubbo返回值
		dubboMsg: "",
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/zookeeper') {
					let query = location.query
					if (query === undefined) {
						query = { q: '' }
						if (location.search.length > 0) {
							query = queryString.parse(location.search)
						}
					}
					dispatch({
						type: 'query',
						payload: query,
					})
				}
			})
		},
	},

	effects: {
		* query({ payload }, { call, put, select }) {
			if (payload.q) {
				if (payload.q.includes(`isverify==true`)) {
					payload.q = payload.q.replace('isverify==true', 'username!=null;password!=null')
				} else if (payload.q.includes(`isverify==false`)) {
					payload.q = payload.q.replace('isverify==false', 'username==null;password==null')
				}
			}

			const data = yield call(query, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						list: data.content,
						pagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
						},
						q: payload.q,
					},
				})
			}
		},
		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.currentItem)
			yield put({
				type: 'updateState',
				payload: {
					modalType: 'update',
					currentItem: data,
				},
			})
		},
		* requery({ payload }, { put, select }) {
			let pageItem = yield select(({ zookeeper }) => zookeeper.pagination)
			// let q = parse(window.location.search.substr(1)).q
			yield put({
				type: 'query',
				payload: {
					page: pageItem.current - 1,
					pageSize: pageItem.pageSize,
					q: payload ? payload.q : ''
				},
			})
		},
		* create({ payload }, { call, put }) {
			yield put({
				type: 'updateState',
				payload: {
					modalVisible: true,
				},
			})
			message.loading('正在新建集群信息,请稍后...', 0)
			const data = yield call(create, payload)
			message.destroy()
			if (data.success) {
				message.success('集群信息保存成功！')
				yield put({ type: 'dubbo' })
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* update({ payload }, { select, call, put }) {
			yield put({
				type: 'updateState',
				payload: {
					modalVisible: true,
				},
			})
			message.loading('正在修改集群信息,请稍后...', 0)

			const data = yield call(update, payload)
			message.destroy()
			if (data.success) {
				message.success('集群信息修改成功！')
				yield put({ type: 'dubbo' })
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* delete({ payload }, { call, put }) {
			message.loading('正在删除集群信息,请稍后...', 0)
			const data = yield call(remove, { payload })
			message.destroy()
			if (data.success) {
				message.success('集群信息删除成功！')
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* dubbo({ payload }, { call, put }) {
			const data = yield call(dubbo)
			if (data.success) {
				yield put({ type: 'requery' ,payload:payload})
			} else {
				throw data
			}
			yield put({
				type: 'updateState',
				payload: {
					dubboType: data.data,
					dubboMsg: data.msg,
				},
			})
		},
	},

	reducers: {
		//浏览列表
		// querySuccess(state, action) {
		// 	const { list, pagination, detail, q } = action.payload
		// 	return {
		// 		...state,
		// 		list,
		// 		pagination: {
		// 			...state.pagination,
		// 			...pagination,
		// 		},
		// 		detail,
		// 		q,
		// 	}
		// },

		updateState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
