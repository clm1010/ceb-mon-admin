export default {

  namespace: 'alarmFrom',

  state: {
    checkedList: [],		//被选中的checkbox
    indeterminate: false, //全选checkbox的状态
    checkAll: false,
    compName: '',
  },

  effects: {},

  reducers: {
		//改变数据的方法
	  setState (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
