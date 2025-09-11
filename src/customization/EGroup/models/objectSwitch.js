import { query, create, remove, update, query as queryTool } from '../services/objectSwitch'

import { queryInfs } from '../../../services/nes'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {

  namespace: 'objectSwitch',

  state: {
		list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    modalPolicyVisible: false,
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
    },
    isSynching: false,
    isClose: false,
    choosedRows: [],
    filterSchema: [],

	openPolicyType: '', //打开弹出框，显示那个tabs 页

	neUUID: '', //选中的网元-交换机 的uuid
	neInfsList: [], //获取网元的接口信息
	neInfsNumber: 0, //获取网元的接口数量
	InfsVisible: false, //接口数弹出框
	paginationInfs: {								//分页对象
      showSizeChanger: true,						//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
      current: 1,									//当前页数
      total: null,									//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },

  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/object/switch') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
		* query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      const parentItem = yield call(queryTool, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            detail: parentItem,
          },
        })
      }
    },
    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
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
    * requery ({ payload }, { put }) {
        yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * update ({ payload }, { select, call, put }) {
      const data = yield call(update, payload)
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


	* queryInfs ({ payload }, { select, call, put }) {
		let newdata = { ...payload }
		let neToInfsUUID = ''
		if (!payload.neUUID) { //传的数据存在 neUUID 就不需要从 state 获取
			neToInfsUUID = yield select(({ objectSwitch }) => objectSwitch.neUUID)
			newdata = { ...payload, neUUID: neToInfsUUID }
		}
		const data = yield call(queryInfs, newdata) //与后台交互，获取数据

		if (data) {
			yield put({
			  type: 'querySuccessInfs',
			  payload: {
				neInfsList: data.content,
				paginationInfs: {
				  current: data.page.number + 1 || 1,
				  pageSize: data.page.pageSize || 10,
				  total: data.page.totalElements,
				},
			  },
			})
       }
	},

  },

  reducers: {
  	//浏览列表
  	querySuccess (state, action) {
      const { list, pagination, detail } = action.payload

      return {
 ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        detail,
}
    },

	querySuccessInfs (state, action) {
      const { neInfsList, paginationInfs } = action.payload
      return {
 ...state,
        neInfsList,
        paginationInfs: {
          ...state.paginationInfs,
          ...paginationInfs,
        },
	  }
    },

  	//这里控制弹出窗口显示
  	showModal (state, action) {
      return { ...state, ...action.payload }
    },

    showPolicyModal (state, action) {
      return { ...state, ...action.payload }
    },

    hidePolicyModal (state, action) {
      return { ...state, ...action.payload }
    },

    //这里控制弹出窗口隐藏
		hideModal (state, action) {
      return { ...state, ...action.payload }
    },

    //这里控制弹出窗口显示
  	syncStart (state, action) {
      return { ...state, ...action.payload }
    },

    syncCancel (state, action) {
      return { ...state, ...action.payload }
    },

    switchBatchDelete (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
