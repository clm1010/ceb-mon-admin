export default {

  namespace: 'userTransfer',

  state: {
    dataSource: [],				//全量用户集合
    targetKeys: [],				//显示在右侧框数据的key集合
		showSearch: false,			//是否显示搜索框
  },

  reducers: {
	  setState (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
