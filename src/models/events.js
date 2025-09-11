import { message } from 'antd'
import { query, sql } from '../services/alarms'
import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryAllosts } from '../services/osts'

export default {
  namespace: 'events',
  state: {
  		alarmList: [],
  		oelColumns: [],
   	pagination: {																		//分页对象
	      	showSizeChanger: true,												//是否可以改变 pageSize
	      	showQuickJumper: true, //是否可以快速跳转至某页
	     	simple: false,
	      	showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
	      	current: 1,																		//当前页数
	      	total: null,																	//数据总数？
   	},

  },
  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dashboard/events') {
          dispatch({
          		type: 'query',
          		//payload: location.query,
          })
        }
      })
    },
  },
  effects: {
  		* query ({ payload }, { call, put }) {
  			const user = JSON.parse(sessionStorage.getItem('user'))
  			let branch
  			if (user.branch) {
	  			branch = user.branch
	  		}
  			//Last 500 Events
			let oelCfg = {}
			oelCfg.pagination = { current: 0, pageSize: 100 }
			oelCfg.whereSQL = ' 1=1 order by FirstOccurrence desc'
			if (peformanceCfg.oelFilter) {
				oelCfg.whereSQL = `${peformanceCfg.oelFilter} order by FirstOccurrence desc`
			}
			const datasources = yield call(queryAllosts, payload)
			if (datasources.content.length > 0) {
				oelCfg.oelDatasource = datasources.content[0].uuid
			} else {
				message.error('找不到告警数据源')
//				return
			}
			const data = yield call(query, oelCfg)
			if (data.success) {
				let pages = { ...payload }
				yield put({
      			type: 'querySuccess',
      			payload: {
      				alarmList: data.alertList,
          		oelColumns: peformanceCfg.oelColumns,
	    				pagination: {
	      				current: Number(pages.page) + 1 || 1,
	      				pageSize: pages.pageSize || 10,
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
