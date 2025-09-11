

import { query as queryTree } from '../services/objectGroup'
import { query, policyCounts } from '../services/objectMO'
import { nesquery } from '../services/nes'
import { querylines } from '../services/mo/lines'
import { queryapps } from '../services/mo/applications'
import { querydbs } from '../services/mo/databases'
import { querymws } from '../services/mo/middleWares'
import { queryos } from '../services/mo/os'
import { queryservers } from '../services/mo/servers'
import { querybranchips } from '../services/mo/branchip'

export default {

  namespace: 'objectMOsModal',

  state: {
		treeDatas: [],
		//selectTreeNode:[],   //选中的节点
		//selectKeys:[],     //选中的节点key值
		treeMap: new Map(), //类型map
		defaultExpandAll: true,
		autoExpandParent: true,
		firstClass: '',
		secondClass: '',
		thirdClass: '',
		selectuuid: '',

		list: [], //定义了当前页表格数据集合
		currentItem: {}, //被选中的行对象的集合
		modalVisible: false, //弹出窗口是否可见
		pagination: { //分页对象
		  showSizeChanger: true, //是否可以改变 pageSize
		  showQuickJumper: true, //是否可以快速跳转至某页
		  showTotal: total => `共 ${total} 条`, //用于显示数据总量
		  current: 1, //当前页数
		  total: null, //数据总数？
		  pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		showModalKey: '',
		openModalKey: '',
  },

  subscriptions: {
	  /*
		setup ({ dispatch, history,put  }) {
      history.listen(location => {
        if (location.pathname === '/objectGroup') {
		  let params = location.query
		  params.falg = true
          dispatch({
            type: 'query',
            payload: params,
          })

        } else if(location.pathname.includes('/objectGroup/')){
			dispatch({
            type: 'query',
            payload: location.query,
          })
		}
      })
    },*/
  },

  effects: {
	* query ({ payload }, { select, call, put }) { //查询数据
      const data = yield call(queryTree, payload) //与后台交互，获取数据
      if (data.success) {
		let myMap = new Map()
		let firstClass = yield select(({ objectMOsModal }) => objectMOsModal.firstClass)
		let secondClass = yield select(({ objectMOsModal }) => objectMOsModal.secondClass)
		let thirdClass = yield select(({ objectMOsModal }) => objectMOsModal.thirdClass)
		let selectuuid = yield select(({ objectMOsModal }) => objectMOsModal.selectuuid)
		const loop = (dataInfo, myarrs) => dataInfo.map((item) => {
			myMap.set(item.uuid, [...myarrs, item.key])
			if (firstClass === '' && myarrs.length === 0) {
				firstClass = item.key
			}
			if (secondClass === '' && myarrs.length === 1) {
				secondClass = item.key
				//selectuuid = item.uuid
			}
			if (selectuuid === '' && myarrs.length === 1) {
				selectuuid = item.uuid
			}
			if (item.children && item.children.length > 0) {
				loop(item.children, [...myarrs, item.key])
			}
		})
		loop(data.children, [])

		//查询tables信息
		yield put({
		 type: 'queryMOsInfo',
          payload: {
			firstClass,
			secondClass,
			thirdClass,
          },
		})

        yield put({
          type: 'queryTreeSuccess',
          payload: {
            treeDatas: data.children,
			treeMap: myMap,
			//firstClass:firstClass,
			//secondClass:secondClass,
			selectuuid,
          },
        })

		/*
		yield put({
			type: 'controllerModal',
			payload: {
				modalVisible: true,
			}
		})
		*/
      }
    },

		/*
		页面展示查询

	*/
	* queryMOsInfo ({ payload }, { call, put }) {
	  let firstClass = payload.firstClass
	  let secondClass = payload.secondClass
	  let thirdClass = payload.thirdClass
	  let showInfoKey = firstClass
	  let q = `firstClass =='${firstClass}'`
	  if (secondClass && secondClass !== '') {
		  showInfoKey = `${showInfoKey}_${secondClass}`
		  q += `;secondClass =='${secondClass}'`
	  }
	  if (thirdClass && thirdClass !== '') {
		  showInfoKey = `${showInfoKey}_${thirdClass}`
		  q += `;thirdClass =='${thirdClass}'`
	  }
	  let data = {}
	  if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5') {
		if (payload.q && payload.q !== '') {
			payload.q = `${payload.q};${q}`
		} else {
			payload.q = q
		}

		data = yield call(nesquery, payload)
	  } else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
		data = yield call(query, payload)
	  } else if (showInfoKey === 'NETWORK_HA_LINE') { //互备线路start
		  data = yield call(querylines, payload)
	  }//end
	  else if (showInfoKey === 'NETWORK_BRANCH_IP') { //互备线路start
		  data = yield call(querybranchips, payload)
	  }//end
	  else if (showInfoKey === 'OS') { //操作系统---start
		  data = yield call(queryos, payload)
	  }//end
	  else if (showInfoKey === 'DB') { //数据库---start
		  data = yield call(querydbs, payload)
	  }//end
	  else if (showInfoKey === 'MW') { //中间件---start
		  data = yield call(querymws, payload)
	  }//end
	  else if (showInfoKey === 'APP') { //应用---start
		  data = yield call(queryapps, payload)
	  }//end
	  else if (showInfoKey === 'SERVER') { //主机---start
		  data = yield call(queryservers, payload)
	  }//end
      //const parentItem = yield call(queryTool, payload)
      if (data.success) {
		//关联的策略总数
		let Moinfo = []
		if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5' || showInfoKey === 'NETWORK_HA_LINE' || showInfoKey === 'NETWORK_BRANCH_IP' || showInfoKey === 'OS' || showInfoKey === 'DB' || showInfoKey === 'MW' || showInfoKey === 'APP' || showInfoKey === 'SERVER') {
			let netMoinfo = [...data.content]
			netMoinfo.forEach((item, index) => {
			let bean = { ...item.mo }
			bean.relatedPolicyInstances = item.relatedPolicyInstances
			bean.issuedPolicyInstances = item.issuedPolicyInstances
			bean.unissuedPolicyInstances = item.unissuedPolicyInstances
			bean.issueFailedPolicyInstances = item.issueFailedPolicyInstances
			bean.notStdPolicyInstances = item.notStdPolicyInstances
			bean.intfNum = item.intfNum
			Moinfo.push(bean)
			})
		} else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
			Moinfo = [...data.content]
			if (Moinfo && Moinfo.length > 0) {
				let uuids = ''
				Moinfo.forEach((item, index) => {
					if (index === 0) {
						  uuids = item.uuid
					  } else {
						  uuids = `${uuids}%3B${item.uuid}`
					}
				})
				const policyCountsdata = yield call(policyCounts, { uuids })
				if (policyCountsdata && policyCountsdata.success && policyCountsdata.policyStatus) {
					let policyColVals = policyCountsdata.policyStatus
					Moinfo.forEach((item) => {
						item.issueFailedPolicyInstances = (policyColVals[item.uuid] && policyColVals[item.uuid].issueFailedPolicyInstances ? policyColVals[item.uuid].issueFailedPolicyInstances : 0)
						item.issuedPolicyInstances = (policyColVals[item.uuid] && policyColVals[item.uuid].issuedPolicyInstances ? policyColVals[item.uuid].issuedPolicyInstances : 0)
						item.notStdPolicyInstances = (policyColVals[item.uuid] && policyColVals[item.uuid].notStdPolicyInstances ? policyColVals[item.uuid].notStdPolicyInstances : 0)
						item.relatedPolicyInstances = (policyColVals[item.uuid] && policyColVals[item.uuid].relatedPolicyInstances ? policyColVals[item.uuid].relatedPolicyInstances : 0)
						item.unissuedPolicyInstances = (policyColVals[item.uuid] && policyColVals[item.uuid].unissuedPolicyInstances ? policyColVals[item.uuid].unissuedPolicyInstances : 0)
					})
				}
			}
		}

        yield put({
          type: 'querySuccess',
          payload: {
            list: Moinfo,
			//fields: fieldsdata.fields,
			firstClass,
			secondClass,
			thirdClass,
			showInfoKey,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
          },
        })
      }
    },

  },

  reducers: {
  	//浏览列表
	queryTreeSuccess (state, action) {
		const {
 treeDatas, treeMap, firstClass, secondClass, selectuuid,
} = action.payload
		return { //修改
			...state,
			treeDatas,
			treeMap,
			firstClass,
			secondClass,
			selectuuid,
		}
	},
	//浏览列表
  	querySuccess (state, action) {
      const {
 list, pagination, firstClass, secondClass, thirdClass, showInfoKey,
} = action.payload
      return {
 ...state,
			list,
			firstClass,
			secondClass,
			thirdClass,
			showInfoKey,
			pagination: {
			  ...state.pagination,
			  ...pagination,
			},
		}
    },

	controllerModal (state, action) {
		return { ...state, ...action.payload }
	},

  },
}
