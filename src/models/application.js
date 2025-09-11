//@@@
import { queryapps, createapps, updateapps, deleteapps, removeapps } from '../services/mo/applications'
import { findById, managed } from '../services/objectMO'
//import { queryapps, findById } from '../services/stub'
import {findAllApp} from '../services/appCategories'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from "query-string";
import NProgress from 'nprogress'

const secondClassDict = {
	'APP_URL': {'key':'APP_URL','title':'web','label':'web URL','field':'path'},
	'APP_PROC':{'key':'APP_PROC','title':'进程','label':'进程','field':'process'},
	'APP_PORT':{'key':'APP_PORT','title':'端口','label':'端口号','field':'port'},
	'APP_LOG':{'key':'APP_LOG','title':'日志','label':'日志','field':'path'},
}
export default {

  namespace: 'application',				//@@@

  state: {
  	q: '',																					//URL串上的q=查询条件
		list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
	modalType: 'create',														//弹出窗口的类型
	secondClass:{},
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: 0,																			//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    batchDelete: false,															//批量删除按钮状态，默认禁用
    selectedRows: [],																//表格中勾选的对象，准备批量操作

    alertType: 'info',																//alert控件状态info,success,warning,error
    alertMessage: '请输入网点IP信息',										//alert控件内容
    moImportFileList: [],
	  showUploadList: false,
	  moImportResultVisible: false,
	  moImportResultdataSource: [],
	  moImportResultType: '',
	  managedModalVisible: false,
		manageState: true,
		managedType: 'managed',
		managedData: [],
		pageChange: '',
		appCategorlist:[],
		_mngInfoSrc: '自动',				 							 			 //用户手动切换发现方式记录的临时状态
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
		  //初次访问
        if (location.pathname === '/application' && location.search.length === 0) {				//@@@
		  //制造一个浏览器地址栏看得见的跳转，仅仅是跳转，再次触发subscription监听进行query查询
		  const { pathname } = location
		  let qq = location.query? location.query.q : 'firstClass==\'APP\''
					const query = {
						q : qq,
						page : 0
					}
					const stringified = queryString.stringify(query)
          dispatch(routerRedux.push({
			    	pathname,
						search: stringified,
						query:query,
			    }))
        } else if (location.pathname === '/application' && location.search.length > 0) {			//@@@
					//自动触发mo查询
					let query = location.query
					if (query === undefined) {
						query = queryString.parse(location.search);
					}
					dispatch({
						type: 'setState',
						payload: {
							secondClass:query.secondClass? secondClassDict[query.secondClass]:undefined,//secondClassMap(query.secondClass),
						},
					  })
	        dispatch({
	          type: 'query',
	          payload: query,
	        })
	      }
      })
    },
  },

  effects: {
		* query ({ payload }, { call, put }) {
	  const data = yield call(queryapps, payload)				//@@@
	  NProgress.done()//异步加载动画结束
      if (data.success) {
        yield put({
          type: 'setState',
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
            q: payload.q,	//把查询条件放到state中
          },
        })
      }
    },

    * findById ({ payload }, { call, put }) {
			const data = yield call(findById, payload.currentItem)				//@@@

	  	if (data.success) {
			let newData = data
			let secondClass = secondClassDict[data.secondClass]
			if (secondClass.field in newData) {
				newData.appfield = newData[secondClass.field]
			}
	  		payload.currentItem = newData
			payload._mngInfoSrc = newData.mngInfoSrc	//查到一台mo，自动用mngInfoSrc覆盖_mngInfoSrc，记录最原始发现方式
	  		yield put({
			  	type: 'setState',
			  	payload,
				})
	  	}
		},

	// 	* requery ({ payload }, { put }) {
	//   	yield put(routerRedux.push({
	// 		pathname: window.location.pathname,
	// 		query: parse(window.location.search.substr(1)),
	// 		search: window.location.search,
	//     }))
	//   },
	* requery({ payload }, { select, put }) {
		let pageItem = yield select(({ application }) => application.pagination)
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
	  * update ({ payload }, { select, call, put }) {
			//取currentItem是为了获取完整的对象来全量update后端的mo对象
			let currentItem = {}
			currentItem = yield select(({ application }) => application.currentItem)				//@@@
			currentItem = Object.assign(currentItem, payload.currentItem)

			let data = {}
			data = yield call(updateapps, currentItem)				//@@@

	  	if (data.success) {
	  		message.success('设备修改成功！')
	  		payload.currentItem = data
	  		payload.alertType = 'success'
	    	payload.alertMessage = '应用系统修改成功。'				//@@@
	    	payload.modalVisible = false

	  		yield put({
					type: 'setState',
					payload,
				})
				yield put({ type: 'requery' })
	  	} else {
	  		message.error('设备修改失败！')
	  		payload.alertType = 'error'
	    	payload.alertMessage = '应用系统修改失败。'				//@@@

	    	yield put({
					type: 'setState',
					payload,
				})
	  		throw data
	  	}
	  },

	  * create ({ payload }, { select, call, put }) {
			let currentItem = {}
	  	currentItem = yield select(({ application }) => application.currentItem)				//@@@

	  	currentItem.keyword = ''				//@@@

	  	payload.currentItem.firstClass = 'APP'				//@@@

	  	//state里的item和表单提取的item合并
	  	const appObj = Object.assign({}, currentItem, payload.currentItem)				//@@@

	  	const data = yield call(createapps, appObj)				//@@@

	    if (data.success) {
	    	message.success('设备保存成功！')
	    	payload.alertType = 'success'
	    	payload.alertMessage = '应用系统保存成功。'				//@@@
	    	payload.currentItem = {}
	    	payload.modalVisible = false

	    	yield put({
		  		type: 'setState',
		  		payload,
		  	})
		  	yield put({ type: 'requery' })
		  } else {
		  	message.error('设备保存失败!')
		  	yield put({
		  		type: 'setState',
		  		payload: {
		  			alertType: 'error',
	    			alertMessage: '应用系统保存失败。',				//@@@
	    		},
		  	})
		    throw data
		  }
	  },

	  * delete ({ payload }, { select, call, put }) {
		 		const data = yield call(deleteapps, payload)				//@@@

      	if (data.success) {
      			message.success('设备删除成功！')
        		yield put({ type: 'requery' })
      	} else {
      			message.error('设备删除失败！')
        		throw data
      	}
    	},

		* deleteAll ({ payload }, { select, call, put }) {
			let data = {}
		 	data = yield call(removeapps, payload)				//@@@

		  if (data.success) {
		  	message.success('设备删除成功！')
		  	yield put({ type: 'requery' })
		  	yield put({
					type: 'setState',
					payload: ({
						batchDelete: false,
					}),
				})
		  } else {
		  	message.error('设备删除失败！')
		  	throw data
		  }
	  },

	  * managed ({ payload }, { call, put }) {
	  	const data = yield call(managed, payload)
	  	if (data.success) {
	  			delete data.message
	  			delete data.status
	  			delete data.success
	  			yield put({
	  				type: 'setState',
	  				payload: {
	  					managedModalVisible: true,
							managedData: data.mos,
							manageState: false,
	  				},
	  			})
	  	} else {
	  		yield put({
	  			type: 'setState',
	  				payload: {
	  					managedModalVisible: false,
	  				},
	  		})
	  		message.error('批量修改失败!')
	  	}
	  },
	  *appcategories({ payload }, { call, put }) {
		const data = yield call(findAllApp, payload)
		if(data.success){
			yield  put({
				type: 'setState',
				payload:{
					appCategorlist:data.arr
				}
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
