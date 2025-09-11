import React from 'react'
import { nesquery, nesIntfscreate, nesIntfsupdate, nesIntfsdelete, nesIntfsdeleteAll, allInterfs } from '../services/nes'
import { findById, queryInterfaces } from '../services/objectMO'
import {findAllApp, query as queryApp} from '../services/appCategories'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message , Select} from 'antd'
import queryString from "query-string";
import NProgress from 'nprogress'
const Option = Select.Option
export default {

  namespace: 'interfacer',				//@@@

  state: {
  	q: '',																					//URL串上的q=查询条件
	list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: 0,																			//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    batchDelete: false,															//批量删除按钮状态，默认禁用
    batchSync: false,																//批量同步按钮状态，默认禁用
    selectedRows: [],																//表格中勾选的对象，准备批量操作

    alertType: 'info',															//alert控件状态info,success,warning,error
    alertMessage: '请输入MO信息',											 //alert控件内容

    //设备发现有关
    moSynState: false,															//弹出窗口同步按钮状态
    _mngInfoSrc: '自动',				 							 			 //用户手动切换发现方式记录的临时状态
		zabbixUrl: '',	//选中分行查询到的zabbixUrl
		batchsyncSuccessList: [], //同步成功的集合
		batchsyncFailureList: [], //同步失败的集合
		batchSyncState: true, //提示框的状态
		batchSyncModalVisible: false, //批量同步的弹出框
		firstClass:'NETWORK',
		secondClass: '',
		equipment: {},
		equipmentVisible: false,
		equipmentSecondClass: '',
		pageChange: '',
		appCategorlist:[],
		sortInfo: {},
		optionSelectAppName:[]
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
		  //初次访问
        if (location.pathname === '/interfacer' && location.search.length === 0) {				//@@@
          //制造一个浏览器地址栏看得见的跳转，仅仅是跳转，再次触发subscription监听进行query查询
					const { pathname } = location
					const query = {
						q : 'firstClass==\'NETWORK\';secondClass==\'ROUTER\';thirdClass==\'NET_INTF\'',
						page : 0
					}
					const stringified = queryString.stringify(query)
          			dispatch(routerRedux.push({
			    		pathname,
						search: stringified,
						query:query,
			    	}))
        	} else if (location.pathname === '/interfacer' && location.search.length > 0) {
					//自动触发mo查询
					let query = location.query
					if (query === undefined) {
						query = queryString.parse(location.search);
					}
	        if (query.secondClass !== undefined && query.secondClass !== '') {
					dispatch({
						type: 'setState',
						payload: {
							secondClass: query.secondClass,
						},
					})
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
	* query ({ payload }, { call, put, select }) {
		let sorter = payload.sortInfo
		delete payload.sortInfo
		if (sorter && sorter.columnKey !== '') {
			let sort = (sorter.order === 'descend') ? 'desc' : 'asc'
			payload.sort = `${sorter.columnKey},${sort}`
		}
	  const data = yield call(queryInterfaces, payload)
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
			sortInfo: sorter,
          },
        })
      }
    },

    * findById ({ payload }, { call, put }) {
			const data = yield call(findById, payload.currentItem)
	  	if (data.success) {
	  		payload._mngInfoSrc = data.mngInfoSrc	//查到一台mo，自动用mngInfoSrc覆盖_mngInfoSrc，记录最原始发现方式
	  		payload.currentItem = data
	  		yield put({
			  	type: 'setState',
			  	payload,
				})
	  	}
		},

		* requery ({ payload }, { put, select }) {
	  	/* yield put(routerRedux.push({
	    	pathname: window.location.pathname,
	    	query: parse(window.location.search.substr(1)),
		})) */
			let pageItem = yield select(({ interfacer }) => interfacer.pagination)
			console.log("here123:",window.location.search.substr(1));
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
			currentItem = yield select(({ interfacer }) => interfacer.currentItem)				//@@@

			currentItem = Object.assign(currentItem, payload.currentItem)

			let data = {}
			data = yield call(nesIntfsupdate, currentItem)

	  	if (data.success) {
	  		message.success('设备修改成功！')
	  		payload.currentItem = data
	  		payload.alertType = 'success'
	    	payload.alertMessage = '设备修改成功。'
	    	payload.modalVisible = false

	  		yield put({
					type: 'setState',
					payload,
				})
				yield put({ type: 'requery' })
	  	} else {
	  		payload.alertType = 'error'
	    	payload.alertMessage = '设备修改失败。'
	    	message.error('设备修改失败！')
	    	yield put({
					type: 'setState',
					payload,
				})
	  		throw data
	  	}
	  },

	  * create ({ payload }, { select, call, put }) {
		  //取currentItem是为了获取完整的对象来全量update后端的mo对象
			let currentItem = {}
			currentItem = yield select(({ interfacer }) => interfacer.currentItem)				//@@@
			currentItem = Object.assign({}, currentItem, payload.currentItem)
	  	const data = yield call(nesIntfscreate, currentItem)

	    if (data.success) {
	    	message.success('设备保存成功！')
	    	payload.alertType = 'success'
	    	payload.alertMessage = '设备保存成功。'
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
	    			alertMessage: '设备保存失败。',
	    		},
		  	})
		    throw data
		  }
	  },

	  * delete ({ payload }, { select, call, put }) {
		 		const data = yield call(nesIntfsdelete, payload)

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
		 	data = yield call(nesIntfsdeleteAll, payload)

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
		 	data = yield call(nesIntfsdeleteAll, payload)

		  if (data.success) {
		  	yield put({ type: 'requery' })
		  	yield put({
					type: 'setState',
					payload: ({
						batchDelete: false,
					}),
				})
		  } else {
		  	throw data
		  }
	  },

	  * getInterfacesById ({ payload }, { call, put, select }) {
			//获取接口列表
			const dataList = yield call(allInterfs, payload.currentItem)
			if (dataList.success) {
				payload.list = dataList.content
				yield put({
					type: 'setState',
					payload,
				})
			}
		},
		* queryEquipment ({ payload }, { call, put }) {
		 const data = yield call(nesquery, payload)
		 if (data.success) {
		 		yield put({
		 			type: 'setState',
		 			payload: {
		 				equipment: data.content[0].mo,
		 				equipmentVisible: true,
		 			},
		 		})
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
	* queryApp({ payload }, { call, put }) {
		const data = yield call(queryApp, payload)
		if (data.success && data.content.length > 0) {
			let optionSelectAppNames = []
			data.content.forEach((item, index) => { //添加name属性--> 将名字改掉   其实是传的uuid
				let values = item.affectSystem
				let keys = item.uuid
				optionSelectAppNames.push(<Option key={keys} value={values}>{values}</Option>)
			})
			yield put({
				type: 'setState',
				payload: {//必须使用
					optionSelectAppName: optionSelectAppNames, //原始数据
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
