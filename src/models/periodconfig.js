import { query, create, remove, update, findById } from '../services/timePeriods'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import moment from 'moment'
import queryString from "query-string";
export default {

  namespace: 'periodconfig',

  state: {
	list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    selectedRows: [],
    timeList: [
    	{
    		index: 1,
    		checked: false,
    		week: '一',
    		stime: '',
    		etime: '',
    		uuid: '',
    	},
    ],
    pageChange: 0,
    q: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/timePeriods') {
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
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: payload.q,
          },
        })
      }
    },
    * create ({ payload }, { call, put }) {
      yield put({
      	type: 'hideModal',
      	payload: {
					modalVisible: false,
				},
      })
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * requery ({ payload }, { put, select }) {
        /* yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
	  })) */
	  let pageItem = yield select(({ periodconfig }) => periodconfig.pagination)
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
    * delete ({ payload }, { call, put }) {
    		const data = yield call(remove, { payload })
	      if (data.success) {
	        yield put({ type: 'requery' })
	      } else {
	        throw data
	      }
    },
    * update ({ payload }, { select, call, put }) {
      yield put({
      	type: 'hideModal',
      	payload: {
					modalVisible: false,
				},
      })
      const id = yield select(({ periodconfig }) => periodconfig.currentItem.uuid)
      payload.uuid = id
      const newTool = { ...payload, id }
      const data = yield call(update, newTool)

      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * findById ({ payload }, { call, put }) {
    	const data = yield call(findById, payload.currentItem)
    	    	//对更新时间和创建时间处理一下
				if (data.createdTime !== 0) {
				let text = data.createdTime
				data.createdTime = new Date(text).toLocaleDateString()
			}
			if (data.updatedTime !== 0) {
				let text = data.updatedTime
				data.updatedTime = new Date(text).toLocaleDateString()
			}
			let timeList = []
			let defs = data.defs
			let uuid
			for (let i = 1; i <= 7; i++) {
				let checked = true
				let week = ''
				if (i === 1) {
					week = '一'
				}
				if (i === 2) {
					week = '二'
				}
				if (i === 3) {
					week = '三'
				}
				if (i === 4) {
					week = '四'
				}
				if (i === 5) {
					week = '五'
				}
				if (i === 6) {
					week = '六'
				}
				if (i === 7) {
					week = '日'
				}
				let stime = ''
				let etime = ''
				if (defs === undefined) {
					break
				}
				defs.forEach((item) => {
					let iindex = ''
						if (item.weekday === '一') {
							iindex = 1
						}
						if (item.weekday === '二') {
							iindex = 2
						}
						if (item.weekday === '三') {
							iindex = 3
						}
						if (item.weekday === '四') {
							iindex = 4
						}
						if (item.weekday === '五') {
							iindex = 5
						}
						if (item.weekday === '六') {
							iindex = 6
						}
						if (item.weekday === '日') {
							iindex = 7
						}
					if (iindex === i) {
						if (item.period !== undefined && item.period.includes('--')) {
							let time = item.period.split('--')
						  if (time[0] !== undefined && time[0] !== '') {
							  stime = moment(time[0], 'HH:mm:ss')
						  }
						  if (time[1] !== undefined && time[1] !== '') {
						  	etime = moment(time[1], 'HH:mm:ss')
						  }
						}
						checked = item.selected
						uuid = item.uuid
					}
				})
				let time = {
					  index: i,
						checked,
    		    week,
    		    stime,
    		    etime,
    		    uuid,
				}
				timeList.push(time)
			}
    	if (data.success && data.name) {
    		yield put({
    			type: 'showModal',
    			payload: {
    			modalType: 'update',
				  currentItem: data,
				  modalVisible: true,
				  timeList,
    			},
    		})
    	} else if (data.name === undefined) {
    		yield put({
    			type: 'showModal',
    			payload: {
    				modalVisible: false,
    			},
    		})
    	}
    },
  },

  reducers: {
  	//浏览列表
  	querySuccess (state, action) {
      const {
 list, pagination, detail, q,
} = action.payload
      return {
 ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
        detail,
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

	  setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
