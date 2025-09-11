
import { allInterfs } from '../../../services/nes'
import { queryInfo } from '../../../services/objectMO'
import queryString from "query-string";


export default {
  namespace: 'interfaces',
  state: {
  	list: [],
  	InterfaceNum: 0,
  	IPvalue: '',
  	alarmList: [],
  	oelColumns: [],
		organValue: 'zongHang',
		branchValue: '',
		typeValue: '',
		firmValue: '',
		firstValue: '',
		secondValue: '',
		keywordValue: '',
		org: '', //所属机构
		deviceType: '', //设备类型
		vendor: '', //厂商
		firstSecArea: '', //一级安全域
		discoveryIP: '', //IP
   	pagination: {																		//分页对象
      	showSizeChanger: true,												//是否可以改变 pageSize
      	showQuickJumper: true, //是否可以快速跳转至某页
     	simple: false,
      	showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      	current: 1,																		//当前页数
      	total: null,																	//数据总数？
   	},
   	paginationList: { //分页对象
      	showSizeChanger: true, //是否可以改变 pageSize
      	showQuickJumper: true, //是否可以快速跳转至某页
      	showTotal: total => `共 ${total} 条`, //用于显示数据总量
      	current: 1, //当前页数
      	total: null, //数据总数？
      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	 	},
	 	paginationNum: { //分页对象
      	showSizeChanger: true, //是否可以改变 pageSize
      	showQuickJumper: true, //是否可以快速跳转至某页
      	showTotal: total => `共 ${total} 条`, //用于显示数据总量
      	current: 1, //当前页数
      	total: null, //数据总数？
      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	 	},
   	currentItem: {},
   	queryUUID: '',
   	interfaceItem: {},
    modalVisible: false,
    isClose: false,
    modalInterfaceVisible: false,
    isInterfaceClose: false,
    modalOelVisible: false,
    sql: '',
    tableState: true,
    allSource: [],
  },
  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/dashboard/interfaces') {
          dispatch({
          		type: 'query',
          		payload: query,
          })
        }
      })
    },
  },
  effects: {
  	//主要处理自定义组合条件查询
		* query ({ payload }, { select, call, put }) {
				if (payload.pageSize === undefined) {
					payload.pageSize = 20
				}
				const data = yield call(queryInfo, payload)
				yield put({
	      		type: 'querySuccess',
	       	payload: {
	       			list: data.content,
				  		paginationList: {
				    		showSizeChanger: true,
				      	showQuickJumper: true,
				      	showTotal: total => `共 ${total} 条`,
				      	total: data.page.totalElements,
				      	pageSize: payload.pageSize,
				      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
			      	},
			      	tableState: false,
			      	sql: payload.q === undefined ? '' : payload.q,
	        },
	     })
   },
   //双击事件，查询单台设备信息时调用
   * queryInterfaceNums ({ payload }, { select, call, put }) {
			payload.q = `(performanceCollect == true or iisreset == true) and keyword == '*${payload.keyword}*'`
			let data = yield call(allInterfs, payload)
			if (data.success) {
				yield put({
	      		type: 'querySuccess',
	       	payload: {
		      		interfaceItem: data.content,
		      		allSource: data.content,
		      		InterfaceNum: data.page.totalElements,
		      		paginationNum: {
				    		showSizeChanger: true,
				      	showQuickJumper: true,
				      	showTotal: total => `共 ${total} 条`,
				      	total: data.page.totalElements,
				      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
			      },
	        },
	      })
			}
    },

  },

  reducers: {
  		querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
