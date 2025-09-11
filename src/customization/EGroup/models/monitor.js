
export default {

  namespace: 'monitor',

  state: {
		treeDatas: [],
		selectTreeNode: [], //选中的节点
		selectKeys: [], //选中的节点key值
    keys: '1'
  },

  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitor' || location.pathname.includes('/monitor/')) {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }else if(location.pathname === '/monitorZH'){
          if(location.search !== ''){
            dispatch({
              type: 'controllerModal',
              payload: {
                keys: '4'
              },
            })
          }
        }
      })
    },
  },

  effects: {
		* query ({ payload }, { call, put }) { //查询数据
		  /*
      const data = yield call(query, payload)  //与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            treeDatas: data.children,
          },
        })
      }
      */
    },
  },

  reducers: {
  	//浏览列表
		querySuccess (state, action) {
			const { treeDatas } = action.payload
			return { //修改
				...state,
				treeDatas,
			}
	  },

	  controllerModal (state, action) {
		  return { ...state, ...action.payload }
	  },

  },
}
