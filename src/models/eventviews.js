
import { queryAllViews, create, remove, update, queryViewer } from '../services/eventviews'


export default {

  namespace: 'eventviews',

  state: {

   //视图编辑---------------start
   columeVisible: false,
   columeState: {
   	mockData: [],
    targetKeys: [],
   },
   columeList: [

   ],
   columeInfo: {
   		key: '',
   		name: '',
   		width: '',
   		locked: false,
   		sort: '',
   },
   selectKey1: '',
   selectKey2: '',
   viewList: [],
	 modaltype: 'create',
   viewsetVisible: false,
	 copyviewVisible: false,
	 currentView: {},
	 showviewList: [],
   //视图编辑---------------end
  },

  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/config/oel')) {
          dispatch({
            type: 'query',
            payload: {
            	q: '',
            },
          })
        }
      })
    },
  },

  effects: {

    * update ({ payload }, { select, call, put }) {
    	const uuid = yield select(({ eventviews }) => eventviews.currentView.uuid)
    	const uuidUsedByOel = yield select(state => state.oel.oelViewer)
    	const newData = { ...payload, uuid }
    	const data = yield call(update, newData)

      if (data.success) {
      	yield put({
        	type: 'queryAllViews',
        	payload: {
				    q: '',
		    	},
        })
        yield put({
        	type: 'query',
        	payload: {
				    q: '',
		    	},
        })
      	yield put({
	      	type: 'updateState',
	      	payload: {
						copyviewVisible: false,
						columeVisible: false,
					},
	      })

				//如果修改的这个oel表视图就是当前oel使用的，则要触发OEL马上刷新视图
				if (uuid === uuidUsedByOel) {
	  	  	yield put({
		      	type: 'oel/query',
		      	payload: {
		      		forceGetCurrentView: true,
		      	},
		      })
				}
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put, select }) {
    	const data = yield call(remove, payload)
      if (data.success) {
        yield put({
        	type: 'queryAllViews',
        	payload: {
				    q: '',
		    	},
        })
        yield put({
        	type: 'query',
        	payload: {
				    q: '',
		    	},
        })
        const uuidUsedByOel = yield select(state => state.oel.oelViewer)

        if (payload.indexOf(uuidUsedByOel) >= 0) {
        	//清掉state里的oelViewer
        	yield put({
		      	type: 'oel/updateState',
		      	payload: {
		      		oelViewer: '',
		      	},
		      })
		    }
        	//重新查告警
        	yield put({
		      	type: 'oel/query',
		      	payload: {
		      		forceGetViews: true,
		      	},
		      })
      } else {
        throw data
      }
    },

    * create ({ payload }, { select, call, put }) {
      const data = yield call(create, payload)

      if (data.success) {
      	yield put({
        	type: 'queryAllViews',
        	payload: {
				    q: '',
		    	},
        })
        yield put({
        	type: 'query',
        	payload: {
				    q: '',
		    	},
        })
      	yield put({
	      	type: 'updateState',
	      	payload: {
						copyviewVisible: false,
						columeVisible: false,
					},
	      })

        yield put({
		    	type: 'oel/query',
		    	payload: {
		    		forceGetViews: true,
		    	},
		    })
      } else {
        throw data
      }
    },

    * queryAllViews ({ payload }, { select, call, put }) {
			const data = yield call(queryAllViews, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            				viewList: data.content,
            viewsetVisible: true,
          },
        })
      }
    },
    * query ({ payload }, { select, call, put }) {
			const data = yield call(queryAllViews, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            				showviewList: data.content,
          },
        })
      }
    },
    * queryViewer ({ payload }, { call, put }) {
    	const data = yield call(queryViewer, payload)
    	let list1 = []
	    let list2 = []
	    if (data.selectedCols !== undefined && data.selectedCols !== '') {
	    	let a = data.selectedCols
	    	list1 = JSON.parse(a)
	    }
	    if (data.unselectedCols !== undefined && data.unselectedCols !== '') {
	    	let a = data.unselectedCols
	    	list2 = JSON.parse(a)
	    }
	    let columeList = []
	    list1.forEach((item) => {
	    	let locked = false
	    	if (item.fixed === 'left') {
	    		locked = true
	    	} else {
	    		locked = false
	    	}
	    	let sort = ''
	    	if (item.sorter === true) {
	    		sort = 'asc'
	    	} else if (item.sorter === false) {
	    		sort = 'desc'
	    	} else {
	    		sort = 'no'
	    	}
	    	let colume = {
	    		   	key: item.dataIndex,
	   					name: item.alias,
	   					width: item.width,
	   					locked,
	   					sort,
	   					isSelected: true,
	   					alias: (item.alias === undefined || item.alias === 'undefined') ? item.dataIndex : item.alias,
	    	}
	    	columeList.push(colume)
	    })

			list2.forEach((item) => {
	    	let locked = false
	    	if (item.fixed === 'left') {
	    		locked = true
	    	} else {
	    		locked = false
	    	}
	    	let sort = ''
	    	if (item.sorter === true) {
	    		sort = 'asc'
	    	} else if (item.sorter === false) {
	    		sort = 'desc'
	    	} else {
	    		sort = 'no'
	    	}
	    	let colume = {
	    		   	key: item.dataIndex,
	   					name: item.alias,
	   					width: item.width,
	   					locked,
	   					sort,
	   					isSelected: false,
	   					alias: (item.alias === undefined || item.alias === 'undefined') ? item.dataIndex : item.alias,
	    	}
	    	columeList.push(colume)
	    })
	    let currentView = data
	    if (currentView.isGlobal) {
	    	currentView.type = 'true'
	    } else {
	    	currentView.type = 'false'
	    }
			yield put({
				type: 'updateState',
				payload: {
					columeVisible: true,
					modaltype: 'update',
					currentView,
					columeList,
					columeInfo: {
						name: '',
						width: 0,
						locked: false,
						sort: 'no',
					},
				},
			})
		},
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

    updateState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
