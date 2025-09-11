import { routerRedux } from 'dva/router'
import { parse } from 'qs'

import { query, create, remove, update, downloadExcel, onDown } from '../services/lookupInfo'
import queryString from "query-string";

export default {

	namespace: 'lookupinfo',

	state: {
		list: [],									//定义了当前页表格数据集合
		currentItem: {},							//被选中的行对象的集合
		modalVisible: false,						//弹出窗口是否可见
		modalVisibleCopyOrMove: false,					//第二个弹出窗口是否可见
		modalType: 'create',						//弹出窗口的类型
		pagination: {								//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,																		//当前页数
			total: null,																	//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200', '400'],
		},
		isSynching: false,
		isClose: false,
		batchDelete: false,
		choosedRows: [],							//选择的行
		filterSchema: [],							//过滤条件

		filterKey: '',
		filterq: '',
		q: '',
		expand: true,
		dataSource: 0,
		organization: '',
		rsqlParam: '',
		tableName: '',
		tableType: ''
	},

	subscriptions: { //添加一个链接的监听
		setup({ dispatch, history }) {
			history.listen((location) => {
				const query = queryString.parse(location.search);
				if (location.pathname.includes('/lookupGroup/lookupInfo')) {
					dispatch({
						type: 'query',
						payload: query,
					})
				}
			})
		},
	},

	effects: { //添加异步处理事件
		* query({ payload }, { select, call, put }) { //查询数据
			console.dir(payload)
			let organization = payload.organization
			let tableType = payload.tableType
			let tableName = payload.tableName
			let tabledatasource = payload.dataSource
			let rsqlParam = payload.rsqlParam
			let datass = payload.filterq
			//	  		let q = `organization =='${organization}'`
			//			  if(tableType && tableType !== ''){
			//				  q = q + ` and tableType =='${tableType}'`
			//			  }
			//			  if(tableName && tableName !== ''){
			//				  q = q + ` and tableName =='${tableName}'`
			//			  }
			let q = ''
			if (datass && datass !== '' && tabledatasource && tabledatasource === '1' && payload.q != undefined) {
				if (payload.q !== payload.filterq) {
					q = `${datass}`
				} else {
					let mydata = datass.split('==\'*')[1]
					let msData = mydata.substring(0, mydata.length - 2)
					q = `${rsqlParam} and ms == ${msData}`
				}

			} else if (datass && datass !== '' && tabledatasource && tabledatasource === '1' && payload.q === undefined) {
				q = `${rsqlParam}`
			} else if (datass && datass !== '' && tabledatasource && tabledatasource === '0') {
				q = `${rsqlParam} and ${datass}`
			} else if (rsqlParam) {
				q = rsqlParam
			}
			let newdata = {}
			newdata.page = (payload.page ? payload.page : 0)
			newdata.pageSize = (payload.pageSize ? payload.pageSize : 10)
			newdata.dataSource = payload.dataSource
			newdata.organization = payload.organization
			newdata.rsqlParam = payload.rsqlParam
			newdata.tableName = payload.tableName
			newdata.tableType = payload.tableType
			if (q === '') {
				newdata.q = 'organization ==undefined'
			} else {
				newdata.q = q
			}
			console.log('newData:', newdata)
			const data = yield call(query, newdata) //与后台交互，获取数据
			//			const data = yield call(query, payload)
			if (data) {
				yield put({
					type: 'controllerModal',
					payload: {
						list: data.content,
						pagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200', '400'],
						},
						q: newdata.q,
						dataSource: payload.dataSource,
						organization: payload.organization,
						rsqlParam: payload.rsqlParam,
						tableName: payload.tableName,
						tableType: payload.tableType
						//						groupUUID: [groupUUID],
					},
				})
			}
		},

		* create({ payload }, { call, put }) {
			let datas = { ...payload }
			let newdata = {}
			newdata.data = datas.data
			newdata.organization = datas.selectInfo.node.organization
			newdata.tableName = datas.selectInfo.node.tableName
			newdata.tableType = datas.selectInfo.node.tableType
			newdata.hierarchy = 100
			const data = yield call(create, newdata)
			//    		const data = yield call(create, payload)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisible: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		* requery({ payload }, { put,select }) {
			const query = parse(window.location.search.substr(1))
			const q = yield select(({ lookupinfo }) => lookupinfo.q)
			query.dataSource = yield select(({ lookupinfo }) => lookupinfo.dataSource)
			query.organization = yield select(({ lookupinfo }) => lookupinfo.organization)
			query.rsqlParam = yield select(({ lookupinfo }) => lookupinfo.rsqlParam)
			query.tableName = yield select(({ lookupinfo }) => lookupinfo.tableName)
			query.tableType = yield select(({ lookupinfo }) => lookupinfo.tableType)
			query.q=q
			query.page = 0
			const stringified = queryString.stringify(query)
			yield put(routerRedux.push({
				pathname: window.location.pathname,
				search: stringified,
			}))
		},

		* delete({ payload }, { call, put }) {
			const data = yield call(remove, payload)
			if (data.success) {
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		* update({ payload }, { select, call, put }) {
			const uuid = yield select(({ lookupinfo }) => lookupinfo.currentItem.uuid)
			//    		const newdata = { ...payload, uuid }
			const datas = { ...payload }
			let newdata = {}
			newdata.data = datas.data
			newdata.organization = datas.selectInfo.node.organization
			newdata.tableName = datas.selectInfo.node.tableName
			newdata.tableType = datas.selectInfo.node.tableType
			newdata.hierarchy = 100
			newdata.uuid = uuid
			const data = yield call(update, newdata)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisible: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* downloadExcel({ payload }, { call, put }) {
			const data = yield call(downloadExcel, payload)
		},

		*onDown({ payload }, { select, call }) {
			yield call(onDown, payload.url);
		},

	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			const {
				list, pagination, detail, groupUUID, q,
			} = action.payload
			return { //修改
				...state,
				list,
				q,
				pagination: {
					...state.pagination,
					...pagination,
				},
				//				groupUUID,
			}
		},

		//这里控制弹出窗口显示 或者隐藏
		controllerModal(state, action) {
			return { ...state, ...action.payload }
		},

	},

}
