import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay } from '../services/dashboard'

export default {

  namespace: 'netLine',

  state: {
  	q: '',
	name:'',
	aaIP:'',
	zzIP:'',
	appname:'',
  	dataSource: [],
  	Line: {
      showSizeChanger: true,
      showQuickJumper: true,
      total: null,
      showTotal: total => `共 ${total} 条`,
   },
   buttonState: true,
   bizarea: '',
   branchname:'',
  },

  	subscriptions: {
    	setup ({ dispatch, history }) {
	      	// history.listen((location) => {
	        // 	if (location.pathname === '/dashboard/netLine') {
	        // 		let bizarea = location.search.split('?')[1]
	        //  		dispatch({ type: 'query', payload: { bizarea : bizarea } })
	        // 	}
	      	// })
    	}
  	},

  	effects: {
	*query ({ payload }, { select,call, put }) {
	  let name = yield select(({netLine}) => netLine.name)
	  let aaIP = yield select(({netLine}) => netLine.aaIP)
	  let zzIP = yield select(({netLine}) => netLine.zzIP)
	  let appname = yield select(({netLine}) => netLine.appname)
	  let branchname = yield select(({netLine}) => netLine.branchname)

	  let lineSource = []
      let line = peformanceCfg.queryLine//取出配置条件
      const user = JSON.parse(sessionStorage.getItem('user'))//获取当前用户
      let branch//获取当前用户的分行
    //   if (user.branch) {
    //     branch = user.branch
    //   } else {
    //     branch = 'ZH'
    //   }
	  if(!branchname){
		if (user.branch) {
        	branchname = { term: { branchname: user.branch } }
      	} else {
        	branchname = { term: { branchname: 'ZH' } }
      	}
	  }
      let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 4800 } } }//ES时间限制条件
    //   let branchs = { term: { branchname: branchname } }//分行条件
      line.query.bool.must = []
      let should = [{ term: { kpiname: 'RPING丢包率' } },{ term: { kpiname: 'RPING状态' } },{ term: { kpiname: 'RPING响应时间' } }]
      let bool = { bool: { should: should } }
      line.query.bool.must.push({ term: { componetid: 'LINE' } } )
	 if(payload.bizarea == ""){
		if(name !== '' && name){
			line.query.bool.must.push(name)
		}
		if(aaIP !== '' && aaIP){
			line.query.bool.must.push(aaIP)
		}
		if(zzIP !== '' && zzIP){
			line.query.bool.must.push(zzIP)
		}
		if(appname !== '' && appname){
			line.query.bool.must.push(appname)
		}
		if(branchname !== '' && branchname){
			line.query.bool.must.push(branchname)
		}
	 } 
	 
      if(payload.name !== '' && payload.name){
      	line.query.bool.must.push(payload.name)
      }
      if(payload.aaIP !== '' && payload.aaIP){
      	line.query.bool.must.push(payload.aaIP)
      }
      if(payload.zzIP !== '' && payload.zzIP){
      	line.query.bool.must.push(payload.zzIP)
      }
	  if(payload.appname !== '' && payload.appname){
		line.query.bool.must.push(payload.appname)
	}
	if(payload.branchname !== '' && payload.branchname){
		line.query.bool.must.push(payload.branchname)
	}
    //   switch(payload.bizarea){
    //   	case 'other' :
    //   			line.query.bool.must.push({ term: { appname: '网络|第三方服务域' } } )
    //   		break;
    //   	case 'guGan' :
    //   			line.query.bool.must.push({ wildcard: { appname: '网络|骨干*' } } )
    //   		break;
    //   	case 'net' :
    //   			line.query.bool.must.push({ wildcard: { appname: '网络|互联网*' } } )
    //   		break;
    //   }
      line.query.bool.must.push(ranges)
      line.query.bool.must.push(bool)
    //   line.query.bool.must.push(branchs)
      const data = yield call(queryByDay, line)//抛出请求
      if (data.success && data.aggregations.line_info.buckets.length > 0) {
        let lineArray = data.aggregations.line_info.buckets
        for (let info of lineArray) {//处理数据   将ES数据标准化
          let item = {}
          item.key = info.key
          for (let itmeInfo of info.kpiname_info.buckets) {
            if (itmeInfo.key === 'RPING丢包率') {
              item.loss = itmeInfo.top_info.hits.hits[0]._source.value//计算出来的RPING丢包率
            } else if (itmeInfo.key === 'RPING状态') {
              item.state = itmeInfo.top_info.hits.hits[0]._source.value//计算出来的RPING状态
            } else if (itmeInfo.key === 'RPING响应时间') {
              item.time = itmeInfo.top_info.hits.hits[0]._source.value//计算出来的RPING响应时间
            }
            switch(itmeInfo.key){//写这个的目的是   考虑到有些线路有些指标没有采集  导致表格缺失
            	case 'RPING丢包率':
            		item.hostip = itmeInfo.top_info.hits.hits[0]._source.hostip//对象IP
	              item.hostname = itmeInfo.top_info.hits.hits[0]._source.hostname//主机名
	              item.keyword = itmeInfo.top_info.hits.hits[0]._source.keyword.split('-->')[1]//对端IP
	              item.moname = itmeInfo.top_info.hits.hits[0]._source.moname//对象名
            		break;
            	case 'RPING状态':
            		item.hostip = itmeInfo.top_info.hits.hits[0]._source.hostip//对象IP
	              item.hostname = itmeInfo.top_info.hits.hits[0]._source.hostname//主机名
	              item.keyword = itmeInfo.top_info.hits.hits[0]._source.keyword.split('-->')[1]//对端IP
	              item.moname = itmeInfo.top_info.hits.hits[0]._source.moname//对象名
            		break;
            	case 'RPING响应时间':
            		item.hostip = itmeInfo.top_info.hits.hits[0]._source.hostip//对象IP
	              item.hostname = itmeInfo.top_info.hits.hits[0]._source.hostname//主机名
	              item.keyword = itmeInfo.top_info.hits.hits[0]._source.keyword.split('-->')[1]//对端IP
	              item.moname = itmeInfo.top_info.hits.hits[0]._source.moname//对象名
            		break;
            }
          }
          lineSource.push(item)
        }
        yield put({
	        type: 'setState',
	        payload: {
	          dataSource:lineSource,
			  aaIP:payload.aaIP? payload.aaIP: aaIP,
			  zzIP:payload.zzIP? payload.zzIP: zzIP,
			  appname:payload.appname? payload.appname: appname,
			  name:payload.name? payload.name: name,
			  branchname:payload.branchname? payload.branchname: branchname,
	        //   bizarea: payload.bizarea,
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
            buttonState: false,//如果后台出错   将定时器关掉
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
      }
    	}
  	},
    // * requery ({ payload }, {select, put }) {
	// 	alert(1)
    // 	let pageItem = yield select(({netLine}) => netLine.Line)
	// 	console.log(pageItem)
	// 	yield put({
	// 				type: 'query',
	// 				payload: {
	// 					page: pageItem.current-1,
	// 					pageSize: pageItem.pageSize,
	// 				},
	// 			})
    // },
  	reducers: {
	 	setState (state, action) {
      		return { ...state, ...action.payload }
        }
   }
}
