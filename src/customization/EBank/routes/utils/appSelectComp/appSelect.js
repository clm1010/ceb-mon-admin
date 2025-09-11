import { queryApp } from '../../../../../services/maintenanceTemplet'

export default {

  namespace: 'appSelect',

  state: {
    disabled: false, 					 //控制搜索的可用性
    placeholders: '请输入信息',		//文本框里的提示信息
    options: [],								//选择搜索框的内容
    name: '应用名称',						 //组件的名字 要加入
    currentItem: {},
    inputInfo: '',							//输入的信息
    isLoading: false,						//加载的状态在multiple模式下才会起作用
		pageSize: 100,								//一次展示多少条数据
		total: 0,									//一次匹配到多少条记录
		filterOption: true,				//是否启用控件自带的过滤器
		modeType: 'multiple',				//combobox//multiple//单选或者多选
		required: true,							//是否是必填项目
		formItemLayout: {},
		externalFilter: '',					//外部传入的查询条件
		compName: '',
  },

  effects: {
  	* query ({ payload }, { select, call, put }) {
	    let newdatas = { ...payload }
	    //查询条件可以传入，这里需要按分行更改查询语句
	    let qs = `affectSystem=='*${payload.inputInfo}*'`

   		//如果有外部附加查询条件
			const externalFilter = yield select(({ appSelect }) => appSelect.externalFilter)

			const pageSize = yield select(({ appSelect }) => appSelect.pageSize)

	    if (externalFilter.length > 0) {
	    	qs = `${qs} and ${externalFilter}`
	    }

			newdatas.q = qs
			newdatas.pageSize = pageSize
			const data = yield call(queryApp, newdatas)
      if (data.success) {
      	yield put({
      		type: 'setState',
      		payload: {
      			options: data.content,
						isLoading: false,
						total: data.page.totalElements,
      		},
      	})
      }
    },
    * queryAll ({ payload }, { call, put }) {
				const data = yield call(queryApp, { pageSize: '999' })
    		if (data.success) {
    			yield put({
      		type: 'setState',
      		payload: {
						options: data.content,
						isLoading: false,
						total: data.page.totalElements,
      		},
      	})
    		}
    },
  },

  reducers: {
	  setState (state, action) {
      return { ...state, ...action.payload }
		},

		clearState (state) {
			let obj = {
				currentItem: {},
				options: [],
				isLoading: false,
				inputInfo: '',
				total: 0,
				externalFilter: '',
				compName: '',
				defaultName: '',
			}
			let abj = { ...state, ...obj }
			return abj
		},
  },
}
