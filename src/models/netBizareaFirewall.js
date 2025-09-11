import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryByDay } from '../services/dashboard'
import { message } from 'antd'
export default {

	namespace: 'netBizareaFirewall',

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
		firewallSource: [],
		bizareaSource: [],
		ipSource: [],
		firewallName: "",
		bizareaName: "",
		hostipName: "",
		queryTerms:""
	},

	subscriptions: {
    	setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname === '/dashboard/bizarea' && !location.query) {  //获取下拉选择内容
	         		dispatch({ type: 'query',payload:{}})
	        	}else if(location.pathname === '/dashboard/bizarea' && location.query){  
					dispatch({ type: 'query1',payload: location.query })
				}
	      	})
    	}
  	},

	effects:{
		*query ({ payload }, { select ,call, put }) {
			let firewall = []
			let firewallSource =[]
			let ipSource = []
			let bizareaSource = []
			let should = []
			let firewallTable =  peformanceCfg.firewallTable//获取配置的查询语句
			const user = JSON.parse(sessionStorage.getItem('user'))//登录的当前用户
			let queryTerms = yield select(({ netBizareaFirewall }) => netBizareaFirewall.queryTerms)
			let branch //分行属性   用于后面拼接查询语句
			if (user.branch) { branch = user.branch } else { branch = 'ZH' }
			let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } } //时间限制
      		let branchs = { term: { branchname: branch } } //分行条件
      		let componetid = { term: { componetid: "FIREWALL" }}
      		firewallTable.query.bool.must = []
      		should = [{ "term": { "kpiname": "CPU利用率" }},{ "term": { "kpiname": "内存利用率" }},
					  { "term": {"kpiname": "防火墙新建Session" }},{ "term": {"kpiname": "防火墙并发Session" }}]
      		let bool = { bool: { should: should } }
      		firewallTable.query.bool.must.push(bool)
      		firewallTable.query.bool.must.push(componetid)
      		firewallTable.query.bool.must.push(ranges)
			if(payload && payload.queryTerms){
				firewallTable.query.bool.must = [...firewallTable.query.bool.must,...payload.queryTerms]
			}
			if(queryTerms && queryTerms!=''){
				firewallTable.query.bool.must = [...firewallTable.query.bool.must,...queryTerms]
			}else{
				firewallTable.query.bool.must.push(branchs)
			}
      		const data = yield call ( queryByDay ,firewallTable )
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
      					firewallSource.push(obj.moname)
      					ipSource.push(obj.hostip)
      					for(let kpi of info.group_kpiname.buckets){//获取同级指标
      						switch(kpi.key){
      							case 'CPU利用率' :
      								obj.CPU = kpi.top_info.hits.hits[0]._source.value.toFixed(2)
      								break;
      							case '内存利用率' :
      								obj.memory = kpi.top_info.hits.hits[0]._source.value.toFixed(2)
      								break;
      							case '防火墙新建Session' :
      								obj.newSession = kpi.top_info.hits.hits[0]._source.value
      								break;
      							case '防火墙并发Session' :
      								obj.concurrentSession = kpi.top_info.hits.hits[0]._source.value
      								break;
      						}
      					}
      					firewall.push(obj)
      				})//设备循环   获取基本信息
      			}
      			yield put({
					type: 'setState',
					payload:{
						dataSource: firewall,
						firewallSource: firewallSource,
						bizareaSource: bizareaSource,
						ipSource: ipSource,
						pagination:{
							pageSize: 200,
							showSizeChanger: true,
					        showQuickJumper: true,
					        total: firewall.length,
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
			let firewall = []
			let firewallSource =[]
			let ipSource = []
			let bizareaSource = []
			let should = []
			let firewallTable =  peformanceCfg.firewallTable//获取配置的查询语句
			const user = JSON.parse(sessionStorage.getItem('user'))//登录的当前用户
			// let branch //分行属性   用于后面拼接查询语句
			// if (user.branch) { branch = user.branch } else { branch = 'ZH' }
			let ranges = { range: { clock: { gt: Date.parse(new Date()) /1000 - 7200 } } } //时间限制
      		// let branchs = { term: { branchname: branch } } //分行条件
      		let componetid = { term: { componetid: "FIREWALL" }}
      		firewallTable.query.bool.must = []
      		should = [{ "term": { "kpiname": "CPU利用率" }},{ "term": { "kpiname": "内存利用率" }},
					  { "term": {"kpiname": "防火墙新建Session" }},{ "term": {"kpiname": "防火墙并发Session" }}]
      		let bool = { bool: { should: should } }
      		firewallTable.query.bool.must.push(bool)
      		firewallTable.query.bool.must.push(componetid)
      		firewallTable.query.bool.must.push(ranges)
      		// firewallTable.query.bool.must.push(branchs)
			let queryTerms
			if(payload && payload.queryTerms){
				queryTerms = payload.queryTerms
				firewallTable.query.bool.must = [...firewallTable.query.bool.must,...payload.queryTerms]
			}
      		const data = yield call ( queryByDay ,firewallTable )
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
      							case '防火墙新建Session' :
      								obj.newSession = kpi.top_info.hits.hits[0]._source.value
      								break;
      							case '防火墙并发Session' :
      								obj.concurrentSession = kpi.top_info.hits.hits[0]._source.value
      								break;
      						}
      					}
      					firewall.push(obj)
      				})//设备循环   获取基本信息
      			}
      			yield put({
					type: 'setState',
					payload:{
						dataSource: firewall,
						pagination:{
							pageSize: 200,
							showSizeChanger: true,
					        showQuickJumper: true,
					        total: firewall.length,
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
