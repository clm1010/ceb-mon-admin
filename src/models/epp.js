import { query, create, remove, update, check, getEppById } from '../services/epp'
import { queryRelatedMOsInfo } from '../services/objectMO'
import { query as lablequery } from '../services/label'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { Modal, message } from 'antd'
const info = Modal.info
/**
* 监控配置/监控工具管理 
* @namespace epp
* @requires module:监控配置/监控工具管理 
*/
export default {
	namespace: 'epp',

	state: {
		list: [], //定义了当前页表格数据集合
    		currentItem: {},											 //被选中的单个行对象
    		modalVisible: false, //弹出窗口是否可见
    		modalType: 'create', //弹出窗口的类型
    		pagination: { //分页对象
      		showSizeChanger: true, //是否可以改变 pageSize
      		showQuickJumper: true, //是否可以快速跳转至某页
      		showTotal: total => `共 ${total} 条`, //用于显示数据总量
      		current: 1, //当前页数
      		total: null,									 //数据总数？
      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    		},
    		checkStatus: 'done',
    		isClose: false,
    		batchDelete: false,
    		choosedRows: [],
    		filterSchema: [],			//查询配置文件，自动加载生成查询界面

			toolInstUUIDMos: '', //策略模板的UUID 用来获取关联的对象
			toolMosNumber: 0, //关联的对象的数量
			mosList: [], //关联的对象对象
			mosVisible: false,

			paginationMos: { //分页对象
				showSizeChanger: true, //是否可以改变 pageSize
				showQuickJumper: true, //是否可以快速跳转至某页
				showTotal: total => `共 ${total} 条`, //用于显示数据总量
				current: 1, //当前页数
				total: null,									 //数据总数？
				pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    		},
    		q: '',
			pageChange: '',
			typeValue:'',
			labelVisible:false,
			lablelist: [],
			lablepagination: {																		//分页对象
				showSizeChanger: true,												//是否可以改变 pageSize
				showQuickJumper: true, //是否可以快速跳转至某页
				showTotal: total => `共 ${total} 条`,					//用于显示数据总量
				current: 1,																		//当前页数
				total: null,																	//数据总数？
				pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
			},
			lableInfoVal:[],
			labelgroupUUID:[],
			serachVal:'',
			element:'',
			pdTool:true,
    	},

  	subscriptions: {
		setup ({ dispatch, history }) {
      		history.listen((location) => {
        		if (location.pathname === '/epp') {
          			dispatch({
            				type: 'query',
            				payload: location.query,
          			})
        		}
      		})
    	},
  	},

  	effects: {
		/**
		* 查询数据
		* 与后台交互 调用接口  /api/v1/epp/
		* @function epp.query 
		*/
		* query ({ payload }, { call, put }) {
			let newdata = { ...payload }
      		const data = yield call(query, newdata)

      		if (data.success) {
        			yield put({
          			type: 'showModal',
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
            				q: newdata.q,
          			},
        			})
      		}
    	},
		/**
		  * 通过uuid查询数据
		  * 与后台交互 调用接口  /api/v1/epp/
		  * @function epp.getEppById 
		  */
    	* getEppById ({ payload }, { call, put }) {
    		const data = yield call(getEppById, payload.currentItem)

			payload.currentItem = data

			if (data.success) {
				yield put({
					type: 'showModal',
					payload,
				})
			}
    	},
		/**
		   * 验证数据 检查数据是否被选取
		   * 与后台交互 调用接口  /api/v1/epp/?do=check-available
		   * @function epp.check 
		   */
    	* check ({ payload }, { call, put }) {
    			yield put({ 		//设置button按钮为checking状态
	    			type: 'showCheckStatus',
	    			payload: {
	    				checkStatus: 'checking',
	    			},
    			})
      		const data = yield call(check, { url: payload.currentItem.url })
      		if (data.success) {
      			yield put({ 										//设置button按钮为checking状态
	    				type: 'showCheckStatus',
			    		payload: {
			    			checkStatus: 'checking',
			    		},
	    			})
        			yield put({
          			type: 'querySuccess',
          			payload: {
            				list: data.content,
            				pagination: {
              				current: data.page.number + 1 || 1,
              				pageSize: data.page.pageSize || 10,
              				total: data.page.totalElements,
            				},
          			},
        			})
      		}
    	},
		/**
		   * 新增资源 
		   * 与后台交互 调用接口  /api/v1/tools/
		   * @function tool.create 
		   */
    	* create ({ payload }, { call, put,select }) {
			  const data = yield call(create, payload)
			  const pdTool = yield select(({ tool }) => tool.pdTool)
      		if (data.success) {
				// if(payload.toolType == "PROMETHEUS" && pdTool){
				// // message.success('创建已经完成，请设置ump_tool工具标签！')
				// info({
				// 	title: '创建已经完成，请设置ump_tool工具标签！',
				//   })
				// }
      			yield put({
	      			type: 'hideModal',
	      			payload: {
						modalVisible: false,
						isClose: true,
						lableInfoVal:[],
					},
	      		})
        		yield put({ type: 'requery' })
      		} else {
        		throw data
      		}
    	},
    	// * requery ({ payload }, { put }) {
        // 		yield put(routerRedux.push({
        // 			pathname: window.location.pathname,
        // 			query: parse(window.location.search.substr(1)),
      	// 	}))
		// },
		* requery ({ payload }, {select, put }) {
			let pageItem = yield select(({epp}) => epp.pagination)
			let q = parse(window.location.search.substr(1)).q
		
			yield put({
						type: 'query',
						payload: {
							page: pageItem.current-1,
							pageSize: pageItem.pageSize,
							q:q
						},
					})
		},
		/**
			   * 删除资源  
			   * 与后台交互 调用接口  /api/v1/epp/
			   * @function epp.delete 
			   */
    	* delete ({ payload }, { call, put }) {
      		const data = yield call(remove, payload)
      		if (data.success) {
        			yield put({ type: 'requery' })
      		} else {
        			throw data
      		}
    	},
		/**
   * 修改数据  
   * 与后台交互 调用接口  /api/v1/epp/
   * @function epp.update 
   */
    	* update ({ payload }, { select, call, put }) {
			const uuid = payload.uuid
			delete payload.uuid
			
      		const newEpp = { ...payload, uuid }
      		const data = yield call(update, newEpp)
      		if (data.success) {
      			yield put({
	      			type: 'hideModal',
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
	   * 查询MO信息 
	   * 与后台交互 调用接口 /api/v1/mos/
	   * @function epp.queryMos 
	   */
		* queryMos ({ payload }, { select, call, put }) { //查询数据
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ tool }) => tool.toolInstUUIDMos)
				newdata = { ...payload, uuid }
			}

			const data = yield call(queryRelatedMOsInfo, newdata) //与后台交互，获取数据
			if (data.success) {
				yield put({
				  type: 'querySuccessMos',
				  payload: {
					mosList: data.content,
					paginationMos: {
					  current: data.page.number + 1 || 1,
					  pageSize: data.page.pageSize || 10,
					  total: data.page.totalElements,
					},
				  },
				})
		    }
		},
		*lablequery({ payload }, { select, call, put }) {
			const q = yield select(({ tool }) => tool.serachVal)
			if (q !== '') {
				payload.q = q
			}
			const data = yield call(lablequery, payload)
			if (data.success) {
				yield put({
					type: 'updateState',
					payload: {
						lablelist: data.content,
						lablepagination: {
							current: data.page.number + 1 || 1,
							pageSize: data.page.pageSize || 10,
							total: data.page.totalElements,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: total => `共 ${total} 条`,
							pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
						},
					},
				})
			}
		}, //query
  	},

  	reducers: {
  		//浏览列表
  		querySuccess (state, action) {
      		const { list, pagination } = action.payload
      		return {
 					...state,
        			list,
        			pagination: {
          			...state.pagination,
          			...pagination,
        			},
      		}
    	},

		//浏览列表
  		querySuccessMos (state, action) {
      		const { mosList, paginationMos } = action.payload
      		return {
				...state,
				mosList,
				paginationMos: {
					...state.paginationMos,
					...paginationMos,
        		},
      		}
    	},

  		//这里控制弹出窗口显示
  		showModal (state, action) {
      		return { ...state, ...action.payload }
    		},
    		//这里控制弹出窗口隐藏
		hideModal (state, action) {
      		return { ...state, ...action.payload }
    		},

    		showCheckStatus (state, action) {
      		return { ...state, ...action.payload }
    		},

    		switchBatchDelete (state, action) {
      		return { ...state, ...action.payload }
			},
			updateState(state, action) {
				return { ...state, ...action.payload }
			},
  	},

}
