import { queryPolicyInfo } from '../../../../../services/objectMO'
import { queryToolsInstance } from '../../../../../services/policyInstance'

export default {

  namespace: 'policyList',

  state: {
    modalPolicyVisible: false,
    moPolicyInfo: {},
    openPolicyType: '',
    policyInstanceId: '',
    paginationInfs: {								//分页对象
			showSizeChanger: true,						//是否可以改变 pageSize
			showQuickJumper: true, //是否可以快速跳转至某页
			showTotal: total => `共 ${total} 条`,			//用于显示数据总量
			current: 1,									//当前页数
			total: null,									//数据总数？
	  },
  },

  effects: {
  	* queryPolicy ({ payload }, { select, call, put }) {
			let newdata = { ...payload }
			const data = yield call(queryPolicyInfo, newdata)
			if (data.success) {
				let policys = data.policies
				let moPolicyInfo = {}
				let policiesInfo = [...policys.content]
				if (policiesInfo && policiesInfo.length > 0) {
					let uuids = ''
					policiesInfo.forEach((item, index) => {
						if (index === 0) {
							uuids = item.uuid
						} else {
							uuids = `${uuids}%3B${item.uuid}`
						}
					})

					const tooldata = yield call(queryToolsInstance, { uuids })
					if (tooldata && tooldata.policyToolsMap) {
						policiesInfo.forEach((item) => {
							item.toolPolicys = tooldata.policyToolsMap[item.uuid] ? tooldata.policyToolsMap[item.uuid] : []
					  	})
				   	}
			    }
				moPolicyInfo.content = [...policiesInfo]
				moPolicyInfo.relatedPolicyInstances = data.relatedPolicyInstances
				moPolicyInfo.issuedPolicyInstances = data.issuedPolicyInstances
				moPolicyInfo.unissuedPolicyInstances = data.unissuedPolicyInstances
				moPolicyInfo.issueFailedPolicyInstances = data.issueFailedPolicyInstances
				moPolicyInfo.notStdPolicyInstances = data.notStdPolicyInstances
				moPolicyInfo.tmpPolicyInstances = data.tmpPolicyInstances
				yield put({
					type: 'querySuccessPolicy',
					payload: {
						moPolicyInfo: { ...moPolicyInfo },
						paginationInfs: {
						  	current: policys.page.number + 1 || 1,
						  	pageSize: policys.page.pageSize || 10,
						  	total: policys.page.totalElements,
						},
					},
				})
			} else {
				throw data
			}
		},
  },

  reducers: {
	  setState (state, action) {
      return { ...state, ...action.payload }
    },

    querySuccessPolicy (state, action) {
	  	const { moPolicyInfo, paginationInfs } = action.payload
	  	return {
	  		...state,
	  		moPolicyInfo,
	  		paginationInfs: {
	  			...state.paginationInfs,
	  			...paginationInfs,
	  		},
			}
	  },
  },
}
