import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { queryByDay } from '../../../services/dashboard'

export default {

  namespace: 'netLine',

  state: {
  	q: '',
  	dataSource: [],
  	Line: {
      showSizeChanger: true,
      showQuickJumper: true,
      total: null,
      showTotal: total => `共 ${total} 条`,
   },
   buttonState: true
  },

  	subscriptions: {
    	setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname === '/dashboard/netLine') {
	         		dispatch({ type: 'query' })
	        	}
	      	})
    	}
  	},

  	effects: {
		*query ({ payload }, { call, put }) {
			let lineSource = []
      let line = peformanceCfg.queryLine//取出配置条件
      const user = JSON.parse(sessionStorage.getItem('user'))//获取当前用户
      let branch//获取当前用户的分行
      if (user.branch) {
        branch = user.branch
      } else {
        branch = 'ZH'
      }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) / 1000 - 600 } } }//ES时间限制条件
      let branchs = { term: { branchname: branch } }//分行条件
      line.query.filtered.filter.bool.must.push(ranges)
      line.query.filtered.filter.bool.must.push(branchs)
      const data = yield call(queryByDay, line)//抛出请求
      if (data.success && data.aggregations.line_info.buckets.length > 0) {
        let lineArray = data.aggregations.line_info.buckets
        for (let info of lineArray) {//处理数据   将ES数据标准化
          let item = {}
          item.key = info.key
          for (let itmeInfo of info.kpiname_info.buckets) {
            if (itmeInfo.key === 'RPING丢包率') {
              item.loss = itmeInfo.top_info.hits.hits[0]._source.value//计算出来的RPING丢包率
              item.hostip = itmeInfo.top_info.hits.hits[0]._source.hostip//对象IP
              item.hostname = itmeInfo.top_info.hits.hits[0]._source.hostname//主机名
              item.keyword = itmeInfo.top_info.hits.hits[0]._source.keyword.split('-->')[1]//对端IP
              item.moname = itmeInfo.top_info.hits.hits[0]._source.moname//对象名
            } else if (itmeInfo.key === 'RPING状态') {
              item.state = itmeInfo.top_info.hits.hits[0]._source.value//计算出来的RPING状态
            } else if (itmeInfo.key === 'RPING响应时间') {
              item.time = itmeInfo.top_info.hits.hits[0]._source.value//计算出来的RPING响应时间
            }
          }
          lineSource.push(item)
        }
        yield put({
	        type: 'setState',
	        payload: {
	          dataSource:lineSource,
	          Line: {//分页
	          	page: 0,
	          	pageSize: lineSource.length,
	            showSizeChanger: false,
	            showQuickJumper: false,
	            total: lineSource.length,
	            showTotal: total => `共 ${total} 条`,
	          },
	        },
	      })
      } else {
      	yield put({
	        type: 'setState',
	        payload: {
	          buttonState: false//如果后台出错   将定时器关掉
	        },
	      })
        //message.error('请求未响应！')
      }
    	}
  	},

  	reducers: {
	 	setState (state, action) {
      		return { ...state, ...action.payload }
        }
   }
}
