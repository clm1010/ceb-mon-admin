
export default {
  namespace: 'dashboard',
  state: {
  	alarmList: [],
  	lossList: [],								//设备丢包率列表
  	responseList: [],						//设备响应时间列表
	  cpuList: [],									//设备CPU使用率列表
	  memoryList: [],						//设备内存使用率列表
	  portUsageList: [], //Over 50 Interfaces
	  portTrafficList: [], //Top 10 Interfaces by Traffic
  	oelColumns: [],
  	isClosed: false,
  },
  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/dashboard')) {
        	//
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
			//Over 50 Interface

			//reducers
			yield put({
        type: 'querySuccess',
        payload: {
        },
      })
    },
  },
  reducers: {
  	querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
