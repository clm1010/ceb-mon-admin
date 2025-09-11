import { query } from '../../services/userinfo'

export default {

  namespace: 'userSelect',

  state: {
    disabled: false, 					 //控制搜索的可用性
    placeholders: '请输入信息',		//文本框里的提示信息
    options: [],								//网络域设备  不包含接口
    name: '设备名称',						 //组件的名字 要加入
    mDefaultName: '',						//multiple默认值
    cDefaultName: [],						//combobox默认值
    inputInfo: '',							//输入的信息
    isLoading: false,						//加载的状态在multiple模式下才会起作用
		pageSize: 10,								//一次匹配多少条数据
		filterOption: false,				//是否启用控件自带的过滤器
		modeType: 'multiple',				//combobox//multiple//单选或者多选
		required: true,							//是否是必填项目
		formItemLayout: {},
		externalFilter: '',					//外部传入的查询条件
		compName: '',								//控件名称
  },

  effects: {
  	* query ({ payload }, { put, call, select }) {
	    let newdatas = { ...payload }
	    //网络域
	    //查询条件可以传入，这里需要按分行更改查询语句
	    let qs = newdatas.q
	    qs = `username=='*${payload.inputInfo}*' or name=='*${payload.inputInfo}*'`

	    //如果有外部附加查询条件
	    const externalFilter = yield select(({ userSelect }) => userSelect.externalFilter)
	    if (externalFilter.length > 0) {
	    	qs = `(username=='*${payload.inputInfo}*' and ${externalFilter})`
	    }

	    newdatas.q = qs

	    //请求数据
	    const data = yield call(query, newdatas)
	    if (data.success && data.content.length > 0) {
	    	yield put({
	    		type: 'setState',
	    		payload: {//必须使用
	    			options: data.content, //原始数据
	    		},
	    	})
	    } else if (data.success && data.content.length === 0) {
	    	yield put({
	    		type: 'setState',
	    		payload: {
	    			options: [],
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
