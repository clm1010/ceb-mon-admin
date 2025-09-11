import { querydbs } from '../../../../../services/mo/databases'

export default {

  namespace: 'dbSingleSelect',

  state: {
    disabled: false, 					 //控制搜索的可用性
    placeholders: '请输入信息',		//文本框里的提示信息
    options: [],								//选择搜索框的内容
    name: '所属数据库',						 //组件的名字 要加入
    defaultValue: '',						//combobox默认值
    inputInfo: '',							//输入的信息
    isLoading: false,						//加载的状态在multiple模式下才会起作用
		pageSize: 10,								//一次匹配多少条数据
		filterOption: false,				//是否启用控件自带的过滤器
		modeType: 'combobox',				//combobox//multiple//单选或者多选
		required: true,							//是否是必填项目
		formItemLayout: {},
		externalFilter: '',					//外部传入的查询条件
		compName: '',								//控件名称
  },

  effects: {
  	* query ({ payload }, { put, call, select }) {
	
	    let newdatas = { ...payload }
	    //查询条件可以传入，这里需要按分行更改查询语句
	    let qs = newdatas.q
	    qs = `firstClass=='DB' and (keyword=='*${payload.inputInfo}*' or name == '*${payload.inputInfo}*')`
		 
	    //如果有外部附加查询条件
	    const externalFilter = yield select(({ dbSingleSelect }) => dbSingleSelect.externalFilter)
	    if (externalFilter.length > 0) {
	    	qs = `${qs} and ${externalFilter}`
	    }

	    newdatas.q = qs
	    //请求数据
		const data = yield call(querydbs, newdatas)
		 
	    if (data.success) {
	    	yield put({
	    		type: 'setState',
	    		payload: {//必须使用
	    			options: data.content, //原始数据
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
