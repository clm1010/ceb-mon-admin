import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay } from '../services/dashboard'
import { message } from 'antd'
export default {

	namespace: 'f5Monitoring',

	state: {
		q: "",
		buttonState: true,
		dataSource: [],
		pagination: {
		  showSizeChanger: true,
	      showQuickJumper: true,
	      total: null,
	      showTotal: total => `共 ${total} 条`,
		},
		f5Source: [],
		bizareaSource: [],
		ipSource: [],
        bizarea:"",
		f5Name: "",
		bizareaName: "",
		hostipName: "",
	},

	subscriptions: {
    	setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname === '/dashboard/f5Monitoring' && !location.query) {
	         		dispatch({ type: 'query',payload:{}})
	        	}else if(location.pathname === '/dashboard/f5Monitoring' && location.query){
					dispatch({ type: 'query1',payload: location.query })
				}
	      	})
    	}
  	},

	effects:{
		*query ({ payload }, { call, put,select }) {
            let queryTerms = yield select(({f5Monitoring}) => f5Monitoring.queryTerms)
            const traffiCconvert = (text) => {
				let v = ''
				let value = parseInt(text) * 8
                v = (value / 1048576).toFixed(2)
			 	return v
			}
			let f5 = []
			let f5Source =[]
			let ipSource = []
			let bizareaSource = []
			let should = []
			let integer = []
			let f5Table =  peformanceCfg.f5Table//获取配置的查询语句
			const user = JSON.parse(sessionStorage.getItem('user'))//登录的当前用户
			let branch //分行属性   用于后面拼接查询语句
			if (user.branch) { branch = user.branch } else { branch = 'ZH' }
			let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } } //时间限制
      		let branchs = { term: { branchname: branch } } //分行条件
            let component = { bool: { should: [{ "term": { "component": "负载均衡" }},{ "term": { "component": "负载均衡器" }}] }}
      		f5Table.query.bool.must = []
      		should = [{ "term": { "kpiname": "CPU利用率" }},{ "term": { "kpiname": "内存利用率" }},
					  { "term": {"kpiname": "设备启动时间" }},{ "term": {"kpiname": "负载均衡1分钟服务端并发连接数" }},
                      { "term": {"kpiname": "负载均衡1分钟客户端并发连接数" }},{ "term": {"kpiname": "负载均衡1分钟并发连接总数" }},
                      { "term": {"kpiname": "负载均衡1分钟吞吐量" }},{ "term": {"kpiname": "负载均衡5分钟服务端并发连接数" }},
                      { "term": {"kpiname": "负载均衡5分钟客户端并发连接数" }},{ "term": {"kpiname": "负载均衡5分钟并发连接总数" }},
                      { "term": {"kpiname": "负载均衡5分钟吞吐量" }},{ "term": {"kpiname": "负载均衡服务端新建连接实际值" }},{ "term": {"kpiname": "负载均衡客户端新建连接实际值" }}]
      		let bool = { bool: { should: should } }
      		f5Table.query.bool.must.push(bool)
      		f5Table.query.bool.must.push(component)
      		f5Table.query.bool.must.push(ranges)
      		f5Table.query.bool.must.push(branchs)
            if(queryTerms !== null&& queryTerms !== undefined &&payload&&payload.bizarea==''){
                f5Table.query.bool.must = [...f5Table.query.bool.must,...queryTerms]
            }
			// if(payload && payload.queryTerms){
			// f5Table.query.bool.must = [...f5Table.query.bool.must,...payload.queryTerms]
			// }
      		const data = yield call ( queryByDay ,f5Table )
      		let info = data.aggregations.group_appname.buckets
      		console.log('聚合结果：',data.aggregations.group_appname.buckets)
      		if(info){
      			for(let item of info){//根据域来循环
      				let bizarea = item.key
      				bizareaSource.push(bizarea)
      				item.group_mo.buckets.forEach((info, index) => {
      					let obj = {}
      					obj.bizarea = bizarea//设备区域信息
      					obj.moname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.moname//设备名
      					obj.hostip = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.hostip//设备IP
                        obj.appname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.appname//网络域
      					obj.keyword = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.keyword//对象关键字
      					obj.branchname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.branchname//所属分行名
      					obj.hostname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.hostname//主机名
      					f5Source.push(obj.moname)
      					ipSource.push(obj.hostip)
      					for(let kpi of info.group_kpiname.buckets){//获取同级指标
      						switch(kpi.key){
      							case 'CPU利用率' :
      								obj.CPU = kpi.top_info.hits.hits[0]._source.value.toFixed(2)
      								break;
      							case '内存利用率' :
      								obj.memory = kpi.top_info.hits.hits[0]._source.value.toFixed(2)
      								break;
      							case '设备启动时间' :
									integer = ((kpi.top_info.hits.hits[0]._source.value/8640000).toFixed(2)).split(".")
      								obj.beginTime = integer[0] +'天' + Math.round((integer[1]/100)*24) +'小时' 
      								break;
      							case '负载均衡1分钟服务端并发连接数' :
      								obj.f5Server1 = kpi.top_info.hits.hits[0]._source.value
      								break;
                                case '负载均衡1分钟客户端并发连接数' :
      								obj.f5Client1 = kpi.top_info.hits.hits[0]._source.value
      								break;      
                                case '负载均衡1分钟并发连接总数' :
      								obj.f5Sum1 = kpi.top_info.hits.hits[0]._source.value
      								break;
                                case '负载均衡1分钟吞吐量' :
      								obj.f5Throughput1 = traffiCconvert(kpi.top_info.hits.hits[0]._source.value)
      								break;
      							case '负载均衡5分钟服务端并发连接数' :
      								obj.f5Server5 = kpi.top_info.hits.hits[0]._source.value
      								break;
                                case '负载均衡5分钟客户端并发连接数' :
      								obj.f5Client5 = kpi.top_info.hits.hits[0]._source.value
      								break;      
                                case '负载均衡5分钟并发连接总数' :
      								obj.f5Sum5 = kpi.top_info.hits.hits[0]._source.value
      								break;
                                case '负载均衡5分钟吞吐量' :
      								obj.f5Throughput5 =traffiCconvert(kpi.top_info.hits.hits[0]._source.value)
      								break;      
                                case '负载均衡服务端新建连接实际值' :
      								obj.newClient = kpi.top_info.hits.hits[0]._source.value
      								break;
                                case '负载均衡客户端新建连接实际值' :
      								obj.newSever = kpi.top_info.hits.hits[0]._source.value
      								break;                    
      						}
      					}
      					f5.push(obj)
      				})//设备循环   获取基本信息
      			}
      			yield put({
					type: 'setState',
					payload:{
						dataSource: f5,
						f5Source: f5Source,
						bizareaSource: bizareaSource,
						ipSource: ipSource,
						pagination:{
							pageSize: 200,
							showSizeChanger: true,
					        showQuickJumper: true,
					        total: f5.length,
					        showTotal: total => `共 ${total} 条`,
						},
					}
				})
      		}else{
      			message.error("code:500 响应结果异常!")
      			yield put({
					type: 'setState',
					payload:{
						buttonState: false
					}
				})
      		}
		},
		*query1 ({ payload }, { call, put }) {
            const traffiCconvert = (text) => {
				let v = ''
				let value = parseInt(text) * 8
                v = (value / 1048576).toFixed(2)
			 	return v
			}
			let f5 = []
			let firewallSource =[]
			let ipSource = []
			let integer = []
			let bizareaSource = []
			let should = []
			let f5Table =  peformanceCfg.f5Table//获取配置的查询语句
			const user = JSON.parse(sessionStorage.getItem('user'))//登录的当前用户
			let branch //分行属性   用于后面拼接查询语句
			if (user.branch) { branch = user.branch } else { branch = 'ZH' }
			let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } } //时间限制
      		let branchs = { term: { branchname: branch } } //分行条件
      		let component = { bool: { should: [{ "term": { "component": "负载均衡" }},{ "term": { "component": "负载均衡器" }}] }}
      		f5Table.query.bool.must = []
      		should = [{ "term": { "kpiname": "CPU利用率" }},{ "term": { "kpiname": "内存利用率" }},
					  { "term": {"kpiname": "设备启动时间" }},{ "term": {"kpiname": "负载均衡1分钟服务端并发连接数" }},
                      { "term": {"kpiname": "负载均衡1分钟客户端并发连接数" }},{ "term": {"kpiname": "负载均衡1分钟并发连接总数" }},
                      { "term": {"kpiname": "负载均衡1分钟吞吐量" }},{ "term": {"kpiname": "负载均衡5分钟服务端并发连接数" }},
                      { "term": {"kpiname": "负载均衡5分钟客户端并发连接数" }},{ "term": {"kpiname": "负载均衡5分钟并发连接总数" }},
                      { "term": {"kpiname": "负载均衡5分钟吞吐量" }},{ "term": {"kpiname": "负载均衡服务端新建连接实际值" }},{ "term": {"kpiname": "负载均衡客户端新建连接实际值" }}]
      		let bool = { bool: { should: should } }
      		f5Table.query.bool.must.push(bool)
      		f5Table.query.bool.must.push(component)
      		f5Table.query.bool.must.push(ranges)
      		f5Table.query.bool.must.push(branchs)
			let queryTerms
			if(payload && payload.queryTerms){
			queryTerms = payload.queryTerms
			f5Table.query.bool.must = [...f5Table.query.bool.must,...payload.queryTerms]
			}
      		const data = yield call ( queryByDay ,f5Table )
      		let info = data.aggregations.group_appname.buckets
      		console.log('聚合结果：',data.aggregations.group_appname.buckets)
      		if(info){
      			for(let item of info){//根据域来循环
      				let bizarea = item.key
      				// bizareaSource.push(bizarea)
      				item.group_mo.buckets.forEach((info, index) => {
      					let obj = {}
      					obj.bizarea = bizarea//设备区域信息
      					obj.moname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.moname//设备名
      					obj.hostip = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.hostip//设备IP
                        obj.appname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.appname//网络域
      					obj.keyword = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.keyword//对象关键字
      					obj.branchname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.branchname//所属分行名
      					obj.hostname = info.group_kpiname.buckets[0].top_info.hits.hits[0]._source.hostname//主机名
      					// firewallSource.push(obj.moname)
      					// ipSource.push(obj.hostip)
      					for(let kpi of info.group_kpiname.buckets){//获取同级指标
      						switch(kpi.key){
                                case 'CPU利用率' :
                                    obj.CPU = kpi.top_info.hits.hits[0]._source.value.toFixed(2)
                                    break;
                                case '内存利用率' :
                                    obj.memory = kpi.top_info.hits.hits[0]._source.value.toFixed(2)
                                    break;
                                case '设备启动时间' :
                                    integer = ((kpi.top_info.hits.hits[0]._source.value/8640000).toFixed(2)).split(".")
      								obj.beginTime = integer[0] +'天' + Math.round((integer[1]/100)*24) +'小时' 
                                    break;
                                case '负载均衡1分钟服务端并发连接数' :
                                    obj.f5Server1 = kpi.top_info.hits.hits[0]._source.value
                                    break;
                                case '负载均衡1分钟客户端并发连接数' :
                                        obj.f5Client1 = kpi.top_info.hits.hits[0]._source.value
                                        break;      
                                case '负载均衡1分钟并发连接总数' :
                                        obj.f5Sum1 = kpi.top_info.hits.hits[0]._source.value
                                        break;
                                case '负载均衡1分钟吞吐量' :
                                        obj.f5Throughput1 = traffiCconvert(kpi.top_info.hits.hits[0]._source.value)
                                        break;
                                case '负载均衡5分钟服务端并发连接数' :
                                    obj.f5Server5 = kpi.top_info.hits.hits[0]._source.value
                                    break;
                                case '负载均衡5分钟客户端并发连接数' :
                                        obj.f5Client5 = kpi.top_info.hits.hits[0]._source.value
                                        break;      
                                case '负载均衡5分钟并发连接总数' :
                                        obj.f5Sum5 = kpi.top_info.hits.hits[0]._source.value
                                        break;
                                case '负载均衡5分钟吞吐量' :
                                        obj.f5Throughput5 = traffiCconvert(kpi.top_info.hits.hits[0]._source.value)
                                        break;      
                                case '负载均衡服务端新建连接实际值' :
                                        obj.newClient = kpi.top_info.hits.hits[0]._source.value
                                        break;
                                case '负载均衡客户端新建连接实际值' :
                                        obj.newSever = kpi.top_info.hits.hits[0]._source.value
                                        break;                    
      						}
      					}
      					f5.push(obj)
      				})//设备循环   获取基本信息
      			}
      			yield put({
					type: 'setState',
					payload:{
						dataSource: f5,
						pagination:{
							pageSize: 200,
							showSizeChanger: true,
					        showQuickJumper: true,
					        total: f5.length,
					        showTotal: total => `共 ${total} 条`,
						},
						queryTerms,
					}
				})
      		}else{
      			message.error("code:500 响应结果异常!")
      			yield put({
					type: 'setState',
					payload:{
						buttonState: false
					}
				})
      		}
		}
	},

	reducers: {
	 	setState (state, action) {
      		return { ...state, ...action.payload }
        }
  	}
}
