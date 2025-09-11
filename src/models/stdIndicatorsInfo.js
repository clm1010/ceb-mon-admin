import { routerRedux } from 'dva/router'
import { parse } from 'qs'

import { query, create, remove, update, MoveTo, CopyTo, queryPolicies, queryTemplates, queryToolsInstance, findById, onDown, queryZabbixItem } from '../services/stdIndicatorsInfo'
import { queryRelatedMOsInfo } from '../services/objectMO'
import queryString from "query-string";
/**
 * 监控配置/监控指标管理
 * @namespace stdIndicatorsinfo
 * @requires module:监控配置/监控指标管理
 */
export default {

	namespace: 'stdIndicatorsinfo',

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
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		isSynching: false,
		isClose: false,
		batchDelete: false,
		choosedRows: [],							//选择的行
		filterSchema: [],							//过滤条件
		groupUUID: [], //指标分组的信息


		stdUUIDToPolicy: '', //指标的UUID 用来获取关联的实例
		stdPolicyNumber: 0, //关联的实例的数量
		policyList: [], //关联的实例对象
		policyVisible: false, //控制弹出框
		paginationPolicy: {							//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},

		stdUUIDTemplates: '', //指标的UUID 用来获取关联的模板
		stdTemplatesNumber: 0, //关联的模板的数量
		templatesList: [], //关联的模板对象
		templatesVisible: false,

		stdUUIDMos: '', //指标的UUID 用来获取关联的对象
		stdMosNumber: 0, //关联的对象的数量
		mosList: [], //关联的对象对象
		mosVisible: false,

		filterKey: '',
		pageChange: 0,
		q: '',
		see: 'no',
		expand: true,
		//导入
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: ''
	},

	subscriptions: { //添加一个链接的监听
		setup({ dispatch, history }) {
			history.listen((location) => {
				const query = queryString.parse(location.search);
				if (location.pathname.includes('/stdIndicatorGroup/stdIndicatorInfo')) {
					dispatch({
						type: 'query',
						payload: query,
					})
				}
			})
		},
	},

	effects: { //添加异步处理事件
		/** 
		 * 获取资源
		 * 与后台交互, 调用接口/api/v1/std-indicators/，获取数据
		 * @function stdIndicatorsinfo.query
		 */
		* query({ payload }, { select, call, put }) { //查询数据
			const groupuuids = yield select(({ stdIndicatorsinfo }) => stdIndicatorsinfo.groupUUID)
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			} //else {
			//   const arrs = location.pathname.split('/')
			//   if (arrs && arrs.length > 0 && arrs[arrs.length - 1] != 'undefined' && arrs[arrs.length - 1] != '*') {
			// 	  groupUUID = arrs[arrs.length - 1]
			//   }
			// }

			const newdata = { ...payload, groupUUID }
			const data = yield call(query, newdata) //与后台交互，获取数据
			//const parentItem = yield call(queryTool, payload)
			if (data.success) {
				yield put({
					type: 'querySuccess',
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
						groupUUID: [groupUUID],
						q: newdata.q,
					},
				})
			}
		},

		/** 
		 * 获取标准指标关联的策略实例
		 * 与后台交互, 调用接口/api/v1/std-indicators/{uuid}/policies，获取数据
		 * @function stdIndicatorsinfo.queryPolicies
		 * 
		 */
		* queryPolicies({ payload }, { select, call, put }) { //查询数据
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ stdIndicatorsinfo }) => stdIndicatorsinfo.stdUUIDToPolicy)
				newdata = { ...payload, uuid }
			}
			const data = yield call(queryPolicies, newdata) //与后台交互，获取数据

			if (data.success) {
				//获取每一个策略实例对应的监控实例（start）
				let policiesInfo = [...data.content]
				if (policiesInfo && policiesInfo.length > 0) {
					let uuids = ''
					policiesInfo.forEach((item, index) => {
						if (index === 0) {
							uuids = item.uuid
						} else {
							uuids = `${uuids}%3B${item.uuid}`
						}
					})
					const tooldata = yield call(queryToolsInstance, { uuids })
					if (tooldata && tooldata.policyToolsMap) {
						policiesInfo.forEach((item) => {
							item.toolPolicys = tooldata.policyToolsMap[item.uuid] ? tooldata.policyToolsMap[item.uuid] : []
						})
					}
				}
				//获取每一个策略实例对应的监控实例（end）
				yield put({
					type: 'querySuccessPolicy',
					payload: {
						policyList: policiesInfo,
						paginationPolicy: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},

		/** 
		 * 获取标准指标关联的策略模板
		 * 与后台交互, 调用接口/api/v1/std-indicators/{uuid}/policy-templates，获取数据
		 * @function stdIndicatorsinfo.queryTemplates
		 * 
		 */
		* queryTemplates({ payload }, { select, call, put }) { //查询数据
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ stdIndicatorsinfo }) => stdIndicatorsinfo.stdUUIDTemplates)
				newdata = { ...payload, uuid }
			}
			const data = yield call(queryTemplates, newdata) //与后台交互，获取数据

			if (data.success) {
				yield put({
					type: 'querySuccessTemplates',
					payload: {
						templatesList: data.content,
						paginationPolicy: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},

		/** 
		 * 获取关联的对象
		 * 与后台交互, 调用接口/api/v1/mos/related-mos/{uuid}，获取数据
		 * @function stdIndicatorsinfo.queryMos
		 * 
		 */
		* queryMos({ payload }, { select, call, put }) { //查询数据
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ stdIndicatorsinfo }) => stdIndicatorsinfo.stdUUIDMos)
				newdata = { ...payload, uuid }
			}
			const data = yield call(queryRelatedMOsInfo, newdata) //与后台交互，获取数据

			if (data.success) {
				yield put({
					type: 'querySuccessMos',
					payload: {
						mosList: data.content,
						paginationPolicy: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},


		/** 
		 * 新增指标
		 * 与后台交互, 调用接口/api/v1/std-indicators/，新增数据
		 * @function stdIndicatorsinfo.create
		 */
		* create({ payload }, { call, put }) {
			const data = yield call(create, payload)
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

		/** 
		 * 批量移动
		 * 与后台交互, 调用接口/api/v1/std-indicators/groups/move-to，移动数据后刷新查询
		 * @function stdIndicatorsinfo.move
		 */
		* move({ payload }, { call, put }) {
			const data = yield call(MoveTo, payload)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisibleCopyOrMove: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
		 * 复制到分组
		 * 与后台交互, 调用接口/api/v1/std-indicators/groups/copy-to
		 * @function stdIndicatorsinfo.copy
		 */
		* copy({ payload }, { call, put }) {
			const data = yield call(CopyTo, payload)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisibleCopyOrMove: false,
						isClose: true,
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		// * requery ({ payload }, { put }) {
		//     yield put(routerRedux.push({
		//     pathname: window.location.pathname,
		//     query: parse(window.location.search.substr(1)),
		//   }))
		// },
		/** 
		 * 查询数据
		 * 刷新页面
		 * @function stdIndicatorsinfo.requery
		 */
		* requery({ payload }, { select, put }) {
			let pageItem = yield select(({ stdIndicatorsinfo }) => stdIndicatorsinfo.pagination)
			let q = parse(window.location.search.substr(1)).q

			yield put({
				type: 'query',
				payload: {
					page: pageItem.current - 1,
					pageSize: pageItem.pageSize,
					q: q
				},
			})
		},

		/** 
		 * 删除单个资源
		 * 与后台交互, 调用接口/api/v1/std-indicators/{id}
		 * @function stdIndicatorsinfo.delete
		 */
		* delete({ payload }, { call, put }) {
			const data = yield call(remove, payload)
			if (data.success) {
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		/** 
	 * 更新资源
	 * 与后台交互, 调用接口/api/v1/std-indicators/{id}
	 * @function stdIndicatorsinfo.update
	 */
		* update({ payload }, { select, call, put }) {
			const uuid = yield select(({ stdIndicatorsinfo }) => stdIndicatorsinfo.currentItem.uuid)
			const newdata = { ...payload, uuid }
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
		/** 
		 * 通过ID查找资源
		 * 与后台交互, 调用接口/api/v1/std-indicators/{id}
		 * @function stdIndicatorsinfo.findById
		 */
		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.record)
			yield put({
				type: 'controllerModal',
				payload: {
					modalType: 'update',
					currentItem: data,
					modalVisible: true,
					isClose: false,
				},
			})
		},
		*onDown({ payload }, { call, put }) {
			const data = yield call(onDown, payload)
		},
		/** 
	 * 通过ID查找资源
	 * 与后台交互, 调用接口/api/v1/std-indicators/{id}
	 * @function stdIndicatorsinfo.findById
	 */
		* queryZabbixItem({ payload, callback }, { call, put }) {
			const data = yield call(queryZabbixItem, payload)
			if (callback && typeof callback === 'function') {
				callback(data); // 返回结果
			}
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
				pagination: {
					...state.pagination,
					...pagination,
				},
				groupUUID,
				q,
				//detail
			}
		},

		//浏览列表
		querySuccessPolicy(state, action) {
			const { policyList, paginationPolicy } = action.payload
			return { //修改
				...state,
				policyList,
				paginationPolicy: {
					...state.paginationPolicy,
					...paginationPolicy,
				},
			}
		},

		//浏览列表
		querySuccessTemplates(state, action) {
			const { templatesList, paginationPolicy } = action.payload
			return { //修改
				...state,
				templatesList,
				paginationPolicy: {
					...state.paginationPolicy,
					...paginationPolicy,
				},
			}
		},

		//浏览列表
		querySuccessMos(state, action) {
			const { mosList, paginationPolicy } = action.payload
			return { //修改
				...state,
				mosList,
				paginationPolicy: {
					...state.paginationPolicy,
					...paginationPolicy,
				},
			}
		},

		//这里控制弹出窗口显示 或者隐藏
		controllerModal(state, action) {
			return { ...state, ...action.payload }
		},
		setState(state, action) {
			return { ...state, ...action.payload }
		},
	},

}
