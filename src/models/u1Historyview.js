import { queryApp } from '../services/maintenanceTemplet'
import { query, querySeverity, queryDetails, queryJournal } from '../services/u1Historyview'
import { DownloadReporter } from '../services/downloadReporter'
import { query as MSMQuery } from '../services/notificationInfo'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from "query-string";
export default {

  namespace: 'u1Historyview',				//@@@

  state: {
  	q: '',
  	filterSelect: '',
		list: [],																				//定义了当前页表格数据集合
		appList: [],																		//应用列表
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: 0,																			//数据总数？
    },
    eventDisposalPagination: {											//事件处置记录
    	showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: 0,
    },
    levelChangePagination: {												//级别变更记录
    	showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: 0,
    },
    SMSnotificationPagination: {										//短信通知记录
    	showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: 0,
    },
    batchDelete: false,															//批量删除按钮状态，默认禁用
    selectedRows: [],																//表格中勾选的对象，准备批量操作
    rowDoubleVisible: false,
    levelChangeDataSource: [],											//级别变更等级
  	eventDataSource: [],														//事件处置记录
  	SMSnotificationDataSource: [],									//短信通知
  	detailsSource: [],															//历史告警信息
  	historyviewSource: [],													//历史告警信息
  	selectInfo: {},
  	severitySql: '',
  	sortSql: '',
  	journalSql: '',
  	detailsSql: '',
  	defaultKey: 0,
  	info: '',
		loadReporter: '',
		expand: true,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
    	//注意：q主要是通过公共组件components/Filter/Filter.js传递过来的
      history.listen((location) => {
      	//初次访问，有可能用户点击左侧历史告警，所以每次拦截到historyview时，清空查询添加q
        const query = queryString.parse(location.search);
        if (location.pathname === '/u1Historyviews/u1HistoryviewScend') {
	        dispatch({
	        	type: 'setState',
	        	payload: {
	        		q: '',
	        	},
	        })
	      } else if (location.pathname.includes('/u1Historyviews/u1HistoryviewScend')) {
	      	if (location.action === 'POP' && location.state === null) {
	      		dispatch({
	      			type: 'queryHistoryview',
	      			payload: {
	      				q: (query.q === '' || query.q === undefined) ? '' : query.q,
	      			},
	      		})
	      	} else {
	      	//进行其他操作的时候只查询历史信息
		      	dispatch({
			          type: 'queryHistoryview',
			          payload: query,
			      })
	      	}
	      	//如果是传的空，因为Filter.js传的为空，所以重新查询左侧应用，同时清空q
	      	if (query.q === '' || query.q === undefined || !query.q.includes('n_AppName==')) {
	      		dispatch({
	      			type: 'setState',
	      			payload: {
	      				q: query.q,
	      			},
	      		})
	      	}
	      }
      })
    },
  },

  effects: {
		* query ({ payload }, { call, put }) {
      //查应用分类树数据
      const treeData = yield call(queryApp, payload)
      if (treeData.success) {
      	yield put({
      		type: 'setState',
      		payload: {
      			appList: treeData.content,
      		},
      	})
      } else {
      	message.error('未响应，无返回结果!')
      }
    },
		* queryHistoryview ({ payload }, { call, put, select }) {
			const data = yield call(query, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						list: data.content,
						pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
				      showQuickJumper: true,
				      showTotal: total => `共 ${total} 条`,
           },
					 loadReporter: payload.q,
					 q: payload.q,
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* querySeverity ({ payload }, { call, put }) {
			//查级别变更数据
			const data = yield call(querySeverity, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						levelChangeDataSource: data.content,
						levelChangePagination: {												//级别变更记录
				    	current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
				      showQuickJumper: true,
				      showTotal: total => `共 ${total} 条`,
				    },
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* queryDetails ({ payload }, { call, put }) {
			//查历史告警短信数据
			const data = yield call(MSMQuery, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						SMSnotificationDataSource: data.content,
						SMSnotificationPagination: {										//短信通知记录
			    		current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
				      showQuickJumper: true,
				      showTotal: total => `共 ${total} 条`,
			    },
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* queryJournal ({ payload }, { call, put }) {
			//查事件处置数据
			const data = yield call(queryJournal, payload)
			if (data.success) {
				yield put({
					type: 'setState',
					payload: {
						eventDataSource: data.content,
						eventDisposalPagination: {											//事件处置记录
				    	current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
				      showQuickJumper: true,
				      showTotal: total => `共 ${total} 条`,
				    },
					},
				})
			} else {
				message.error('未响应，无返回结果!')
			}
		},
		* DownloadReporter ({ payload }, { call, put }) {
			const data = yield call(DownloadReporter, payload)
		},
		* requery ({ payload }, { put }) {
	  	yield put(routerRedux.push({
	    	pathname: window.location.pathname,
	    	query: parse(window.location.search.substr(1)),
	    }))
	  },
  },

  reducers: {
	  setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
