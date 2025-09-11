
export default {

  namespace: 'alertKeyenrichScene',

  state: {

	filter: { filterItems: [{}, {}], filterMode: 'ADVANCED' },
	colorInfo: {},
	colorIndex: -1,
	colorValVisible: false,

	popovervisible: false,
  },

  subscriptions: {


  },

  effects: {

  },

  reducers: {
  //这里控制弹出窗口显示 或者隐藏
  	controllerState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
