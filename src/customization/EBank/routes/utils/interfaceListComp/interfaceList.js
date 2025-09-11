export default {

  namespace: 'interfaceList',

  state: {
    infsVisible: false,		//接口弹窗是否可见
    neUUID: '',						//当前设备uuid
  },

  reducers: {
	  setState (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
