import { routerRedux } from 'dva/router'
import { parse } from 'qs'

import { query, create, remove, update, MoveTo, CopyTo, stdquery, findById, onDown } from '../services/zabbixItemsInfo'
import queryString from "query-string";
import { message } from 'antd'
export default {

	namespace: 'zabbixItemsInfo',

	state: {
		list: [],									//定义了当前页表格数据集合
		currentItem: {},							//被选中的行对象的集合
		modalVisible: false,						//弹出窗口是否可见
		modalVisibleCopyOrMove: false,				//第二个弹出窗口是否可见
		modalType: 'create',						//弹出窗口的类型
		itemType: '',
		flag: true,
		tempList: [
			{
				index: 1,
				flag: '0',
				"params": "",
				"type": "",
			},
		],
		hasPreParams: false,
		pagination: {								//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			//pageSizeOptions: ['10','50','100','200','5000'],
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		isSynching: false,
		isClose: false,
		batchDelete: false,
		choosedRows: [],							//选择的行
		filterSchema: [],							//过滤条件
		groupUUID: [], //Item分组的信息

		selectUnitVisible: false, //指标选择器弹出框 以下为指标选择器
		stdList: [], //指标信息，然而 指标树是直接从指标数model 获取
		stdgroupUUID: [], //指标分组的信息
		paginationStdInfo: {						//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		stdInfoVal: {}, //指标信息 {uuid:'',name:''}

		selectMoFilter: false, //控制打开对象规则弹出框
		moFilterValue: {}, //对象规则的过滤条件
		moFilterOldValue: {}, //原始值，编辑时，初始值为未编辑之前的信息，新增则为{}

		selectItemVisible: false, //Item选择器弹出框 以下为指标选择器
		itemList: [], //Item信息，然而指标树是直接从指标树model 获取
		itemgroupUUID: [], //Item分组的信息
		paginationItemInfo: {						//分页对象
			showSizeChanger: true,					//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,	//用于显示数据总量
			current: 1,								//当前页数
			total: null,							//数据总数？
			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		resetCalInput: true,				//这是
		selectTreeNodeKeys: [],
		filterKey: '', //查询条件控件的key值
		pageChange: 0,
		q: '',
		see: 'no',
		expand: true,
		//导入
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false,
		moImportResultdataSource: [],
		moImportResultType: '',
		chooseWay: '0'
	},

	subscriptions: { //添加一个链接的监听
		setup({ dispatch, history }) {
			history.listen((location) => {
				const query = queryString.parse(location.search);
				if (location.pathname.includes('/zabbixItemsGroup/zabbixItems')) {
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
			const groupuuids = yield select(({ zabbixItemsInfo }) => zabbixItemsInfo.groupUUID)
			let groupUUID = ''
			if (groupuuids && groupuuids.length > 0) {
				groupUUID = groupuuids[0]
			}
			// else {
			//   const arrs = location.pathname.split('/')
			//   if (arrs && arrs.length > 0 && arrs[arrs.length - 1] != 'undefined' && arrs[arrs.length - 1] != '*') {
			// 	  groupUUID = arrs[arrs.length - 1]
			//   }
			// }
			const newdata = { ...payload, groupUUID }
			const data = yield call(query, newdata) //与后台交互，获取数据.
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

		* querystdInfo({ payload }, { select, call, put }) { //查询数据
			/*
			const groupuuids = yield select(({ zabbixItemsInfo }) => zabbixItemsInfo.stdgroupUUID)
			let groupUUID = ''
			if(groupuuids && groupuuids.length > 0){
				groupUUID = groupuuids[0]
			}
	  */
			const newdata = { ...payload }
			const data = yield call(stdquery, newdata) //与后台交互，获取数据
			//const parentItem = yield call(queryTool, payload)
			if (data.success) {
				yield put({
					type: 'querySuccessStdInfo',
					payload: {
						stdList: data.content,
						paginationStdInfo: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
						//stdgroupUUID:[groupUUID],
					},
				})
			}
		},

		* queryItemInfo({ payload }, { select, call, put }) { //查询数据
			const newdata = { ...payload }
			const data = yield call(query, newdata) //与后台交互，获取数据
			//const parentItem = yield call(queryTool, payload)
			if (data.success) {
				yield put({
					type: 'querySuccessItemInfo',
					payload: {
						itemList: data.content,
						paginationItemInfo: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
						},
					},
				})
			}
		},


		* create({ payload }, { call, put }) {
			const data = yield call(create, payload)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisible: false,
						isClose: true,
						stdInfoVal: {},
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

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

		* requery({ payload }, { select, put }) {
			let pageItem = yield select(({ zabbixItemsInfo }) => zabbixItemsInfo.pagination)
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

		* delete({ payload }, { call, put }) {
			const data = yield call(remove, payload)
			if (data.success) {
				message.success('该指标实现已成功删除')
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},

		* update({ payload }, { select, call, put }) {
			const uuid = yield select(({ zabbixItemsInfo }) => zabbixItemsInfo.currentItem.uuid)
			const newdata = { ...payload, uuid }
			const data = yield call(update, newdata)
			if (data.success) {
				yield put({
					type: 'controllerModal',
					payload: {
						modalVisible: false,
						isClose: true,
						stdInfoVal: {},
						tempList: [
							{
								index: 1,
								flag: '0',
								"params": "",
								"type": "",
							},
						],
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* findById({ payload }, { call, put }) {
			const data = yield call(findById, payload.record)
			if (data) {
				let chooseWay = "0"
				if (data.formulaForFrontend) {
					chooseWay = "1"
				}
				let tempList = []
				let hasPreParams = false
				if (data.preprocessing !== undefined && data.preprocessing.length !== 0) {
					let idx = 0
					data.preprocessing.forEach((item, index) => {
						let p = item.params ? item.params : ''
						let t = item.type
						let flag = (t == '6' || t == '7' || t == '8' || t == '9' || t == '10' || t == '19') ? '0' :
							(t == '1' || t == '2' || t == '3' || t == '4'  || t == '11' || t == '12' || t == '14' 
							|| t == '15' || t == '16' || t == '17' || t == '20' || t == '21' || t == '23') ? '1' :
							(t == '5' || t == '13' || t == '18' || t == '22') ? '2' : '3'
						idx += 1
						let temp = {
							index: idx,
							params: p,
							flag: flag,
							type: t
						}
						tempList.push(temp)
					})
					hasPreParams = true
				} else {
					let temp = {
						index: 1,
						flag: '0',
						"params": "",
						"type": "",
					}
					tempList.push(temp)
				}
				yield put({
					type: 'setState',
					payload: {
						chooseWay: chooseWay,
						tempList,
						hasPreParams
					},
				})
			}

			let obj = {}
			let moobj = {}
			if (data && data.stdIndicator) {
				obj = { uuid: data.stdIndicator.uuid, name: data.stdIndicator.name, dataType: data.stdIndicator.dataType }
			}
			if (data && data.filters && data.filters.length > 0) {
				moobj = { ...data.filters[0] }
			}
			yield put({
				type: 'controllerModal',
				payload: {
					modalType: 'update',
					currentItem: { ...data },
					stdInfoVal: obj,
					moFilterValue: { ...moobj },
					moFilterOldValue: { ...moobj }, //保存对象特征最初时的状态,此处必须复制一份。
					//setModelKey:`${new Date().getTime()}`,
					modalVisible: true,
					isClose: false,
					resetCalInput: false,
				},
			})
		},
		*onDown({ payload }, { call, put }) {
			const data = yield call(onDown, payload)
		}
	},

	reducers: {
		//浏览列表
		querySuccess(state, action) {
			const {
				list, pagination, groupUUID, q,
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
			}
		},

		//浏览列表
		querySuccessStdInfo(state, action) {
			const { stdList, paginationStdInfo } = action.payload
			return { //修改
				...state,
				stdList,
				paginationStdInfo: {
					...state.paginationStdInfo,
					...paginationStdInfo,
				},
				//stdgroupUUID,
			}
		},

		//浏览列表
		querySuccessItemInfo(state, action) {
			const { itemList, paginationItemInfo } = action.payload
			return { //修改
				...state,
				itemList,
				paginationItemInfo: {
					...state.paginationItemInfo,
					...paginationItemInfo,
				},
				//stdgroupUUID,
			}
		},

		//这里控制弹出窗口显示 或者隐藏
		controllerModal(state, action) {
			return { ...state, ...action.payload }
		},

		controllerModalPlus(state, action) {
			let objectArray = typeof (state.currentItem.formulaForFrontend) !== 'undefined' && state.currentItem.formulaForFrontend != '' ? JSON.parse(state.currentItem.formulaForFrontend) : []

			objectArray.push(action.payload.formulaForFrontend)
			let stringArray = JSON.stringify(objectArray)
			let formulastr = ''
			if (objectArray && objectArray.length > 0) {
				objectArray.forEach((bean) => {
					let uuidstr = bean.uuid
					if (uuidstr && uuidstr.includes('_')) {
						let arrs = uuidstr.split('_')
						if (arrs && arrs.length > 0) {
							formulastr += arrs[0]
						}
					}
				})
			}
			//给actioin里的currentItem赋值state里的currentItem
			action.payload.currentItem = state.currentItem
			action.payload.currentItem.formulaForFrontend = stringArray
			action.payload.currentItem.formula = formulastr

			return { ...state, ...action.payload }
		},
		setState(state, action) {
			return { ...state, ...action.payload }
		},

	},

}
