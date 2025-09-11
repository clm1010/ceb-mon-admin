import { queryFault } from '../services/historyview'
import moment from 'moment'
import queryString from "query-string";
export default {

	namespace: 'faultList',

	state: {
		pagination: {
	      showSizeChanger: true,
	      showQuickJumper: true,
	      showTotal: total => `共 ${total} 条`,
	      current: 1,
	      total: 0,
	      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	    },
	    list: [],
	    q: '',
	},

	subscriptions: {
		setup ({ history, dispatch }) {
			history.listen((location) => {
				if (location.pathname === '/faultList' || location.pathname.includes('/faultList')) {
					let query = location.query
					if (query === undefined) {
						query = {q:''}
						if  (location.search.length > 0){
							query = queryString.parse(location.search)
						}
                    }
					dispatch({
						type: 'query',
						payload: query,
					})
				}
			})
		},
	},

	effects: {
		* query ({ payload }, { call, put, select }) {
			let newData = {}
			const user = JSON.parse(sessionStorage.getItem('user'))
		    let branch
		    if(user.branch){
		      branch = user.branch
		    }else{
		      branch = 'ZH'
		    }
			newData.sort = 'firstOccurrence,desc'
			let end = moment(Date.parse(new Date()) / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
	    	let statr = moment(Date.parse(new Date()) / 1000 - 86400, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
	    	let firstOccurrence = `firstOccurrence=timein=(${statr},${end})`
	    	let q = yield select(({ faultList }) => faultList.q)
	    	if (payload.q && payload.q.includes('firstOccurrence')) {
	    		firstOccurrence = payload.q
	    		newData.q = q.split('firstOccurrence=timein=(')[0] + firstOccurrence
	    	}
	    	if (payload.q === '') {
	    		newData.q = q.split('firstOccurrence=timein=(')[0] + firstOccurrence
	    	}
			let type = location.search.split('?q=')[1]
			if (type === 'cpu') {
				newData.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';( n_SubComponentID == 'CPU' or  n_SubComponent == 'cpu' );${firstOccurrence}`
			} else if (type === 'men') {
				newData.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';( n_SubComponentID == 'Memory' or  n_SubComponent == '内存' );${firstOccurrence}`
			} else if (type === 'equDown') {
				newData.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';agent=='*Ping*';((manager=='*Zabbix*';alertGroup=='ICMP_Failed') or manager!='*Zabbix*');n_ClearTime==1970-01-01T08:00:00;severity!='0';${firstOccurrence}`
			} else if (type === 'equUp') {
				newData.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';agent=='*Ping*';n_ClearTime>1970-01-01T08:00:00;severity=='0';${firstOccurrence}`
			} else if (type === 'portDown') {
				newData.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';manager!='*Zabbix*';n_InstanceID!=null;(evenTid=='*DOWN*' or evenTid=='*ADJCHG*');alertGroup!='未知SYSLOG事件';(evenTid!='*_full*' or evenTid!='*_up*');${firstOccurrence}`
			} else if (type === 'portUp') {
				newData.q = `n_OrgID == '${branch}';n_ComponentTypeID == 'NetWork';manager!='*Zabbix*';n_InstanceID!=null;(evenTid=='*DOWN*' or evenTid=='*ADJCHG*');alertGroup!='未知SYSLOG事件';(evenTid=='*_full*' or evenTid=='*_up*');${firstOccurrence}`
			}
			newData.pageSize = 100
			if (payload.q.length > 0 && payload.page >= 0 && payload.pageSize > 0) {
				newData = payload
			}
			const data = yield call(queryFault, newData)
			yield put({
				type: 'setState',
				payload: {
					pagination: {
						current: data.page.number + 1 || 1,
			            pageSize: data.page.pageSize || 10,
			            total: data.page.totalElements,
			            showSizeChanger: true,
					    showQuickJumper: true,
					    showTotal: total => `共 ${total} 条`,
					    defaultPageSize: newData.pageSize,
					    pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
					},
					list: data.content,
					q: newData.q,
				},
			})
		},
	},

	reducers: {
		setState (state, action) {
			return { ...state, ...action.payload }
		},
	},
}
