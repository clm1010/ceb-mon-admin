import { query, queryTime, stdquery, create, remove, update, check, issue, stdDescquery, queryTemplat, queryobInfo, queryobjMos, queryToolsInstance, viewStrategy } from '../services/policyInstance'
import { queryRelatedMOsInfo } from '../services/objectMO'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { query as queryPolicies } from '../services/nes'
import queryString from "query-string";
export default {

  namespace: 'policyInstance',

  state: {
  	CheckboxSate: true,
  	CheckboxSate1: true,
		list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的单个行对象
    modalVisible: false,														//弹出窗口是否可见
    kpiVisible: false, //选择指标弹出窗口是否可见
    objectVisible: false, //选择指标对象弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					//用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
     pagination1: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
     pagination2: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
    checkStatus: 'done',
    isClose: false,
    batchDelete: false,
    choosedRows: [],
    filterSchema: [],																//查询配置文件，自动加载生成查询界面
     //新增策略实例-操作详情部分功能代码----start
    fileType: 'policyInstance',
    newOperationItem: {},
   	operationVisible: false,
    operationType: 'add',														//记录操作详情操作状态，add/edit
    tabstate: {
      activeKey: 'n1',
      panes: [
      {
 title: '新操作1',
      	key: 'n1',
      	content: {
      		uuid: '',
      		period: '',
      		originalLevel: '',
      		innderLevel: '',
      		outerLevel: '',
      		discard_innder: '',
      		discard_outer: '',
      		alarmName: '',
      		recoverType: '1',
      		actionsuuid: '',
		    aDiscardActionuuid: '',
			aGradingActionuuid: '',
			aNamingActionuuid: '',
		    conditionuuid: '',
		    timePerioduuid: '',
      	},
     },
    ],
    newTabIndex: 1,
   },
   typeValue: '', //编辑页面--策略类型，根据选择值动态调整采集参数
    timeList: [], //周期
    stdList: [],
    groupUUID: [], //策略实例分组树
    stdInfoVal: {},
    stdgroupUUID: [],
    obList: [], //监控对象
    obInfoVal: {
    }, //监控对象
    obgroupUUID: [],
   relatedPolicyInstances: 0,
   issuedPolicyInstances: 0,
   unissuedPolicyInstances: 0,
   issueFailedPolicyInstances: 0,
   notStdPolicyInstances: 0,
   tmpPolicyInstances: 0,
   policyInstanceId: '',
   policyType: '',
   monitorMethod: {//监控工具
   		toolType: '',
  },
   stdIndicators: {}, //指标详情,只有一条记录
   stdIndVisible: false, //控制弹出框


   templetModalVisible: false, //模板详情,只有一条记录
   policyTemplet: {
   	timeList: [],
   	collectParams: {},
   	monitorParams: {
   		indicator: {},
   		},

   		tabstate: {
      activeKey: 'n1',
      panes: [
      {
 title: '新操作1',
      	key: 'n1',
      	content: {
      		uuid: '',
      		period: '',
      		originalLevel: '',
      		innderLevel: '',
      		outerLevel: '',
      		discard_innder: '',
      		discard_outer: '',
      		alarmName: '',
      		actionsuuid: '',
		    aDiscardActionuuid: '',
			aGradingActionuuid: '',
			aNamingActionuuid: '',
		    conditionuuid: '',
		    timePerioduuid: '',
      	},
     },
    ],
    newTabIndex: 1,
   },
  },

	paginationPolicy: {							//分页对象
		showSizeChanger: true,					//是否可以改变 pageSize
		showQuickJumper: true, //是否可以快速跳转至某页
		showTotal: total => `共 ${total} 条`,	//用于显示数据总量
		current: 1,								//当前页数
		total: null,							//数据总数？
	},

	stdUUIDMos: '', //指标的UUID 用来获取关联的对象
	stdMosNumber: 0, //关联的对象的数量
	mosList: [], //关联的对象对象
	mosVisible: false,

   indicatorsModalVisible: false,
   indicatorsItem: {},

    heightSet: {
			height: '1021px',
			overflow: 'hidden',
		},	// 设置高度使用
	see: 'no',
	expand: true,
	filter:{
		filterItems : [{ indicator: {name:'',uuid:''}, function: 'count', count:'', exprLValue: '', exprOperator:'', exprRValue:'', op: '', threshold: '',index:0,}],
		filterIndex : [0],
   	},
   selectIndex: '',
   modaType:'',
   resetCalInput:false,
   advancedItem:{}
  },

  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname.includes('/policyInstanceGroup/policyInstance')) {
          dispatch({
            type: 'query',
            payload: query,
          })
        }
      })
    },
  },

  effects: {

  * queryobjMos ({ payload }, { select, call, put }) { //查询数据
	    let newdata = { ...payload }
	    const data = yield call(queryobjMos, newdata) //与后台交互，获取数据
	    let obInfoVal = {

      }
	    if (data.content.length === 0) {


	    } else {
	    	obInfoVal = data.content[0]
	    }
	    yield put({
      	  type: 'updateState',
        	payload: {
					    obInfoVal,
				  },
      })
	},
  * queryMos ({ payload }, { select, call, put }) { //查询数据
		let newdata = { ...payload }
		if (!payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
			let uuid = yield select(({ policyInstance }) => policyInstance.stdUUIDMos)

			newdata = { ...payload, uuid }
		}
		const data = yield call(queryRelatedMOsInfo, newdata) //与后台交互，获取数据

		if (data) {
			yield put({
			  type: 'querySuccessMos',
			  payload: {
				mosList: data.content,
				paginationPolicy: {
				  current: data.page.number + 1 || 1,
				  pageSize: data.page.pageSize || 10,
				  total: data.page.totalElements,
				},
			  },
			})
    }
	},
	 		//模板详情
  * queryTemplat ({ payload }, { select, call, put }) { //查询数据
		let newdata = { ...payload }
		const data = yield call(queryTemplat, newdata)
		if (data) {
			yield put({
			  type: 'querySuccessTemplat',
			  payload: {
				   policyTemplet: data.policyTemplate,
			  },
			})
    }
	},
		* query ({ payload }, { select, call, put }) {
			//新加的策略实例树部分（start）
				const groupuuids = yield select(({ policyInstance }) => policyInstance.groupUUID)
	    let groupUUID = ''
	    if (groupuuids && groupuuids.length > 0) {
		     groupUUID = groupuuids[0]
	    }
	    const newdata = { ...payload, groupUUID }
      const data = yield call(query, newdata)//获取单个策略的方法 
      //新加的策略实例树部分（end）
      if (data.success) {
      		//获取每一个策略实例对应的监控实例（start）
		  let policiesInfo = [...data.content]
		  if (policiesInfo && policiesInfo.length > 0) {
			  let uuids = ''
			  policiesInfo.forEach((item, index) => {
				if (index === 0) {
					  uuids = item.policy.uuid
				  } else {
					  uuids = `${uuids}%3B${item.policy.uuid}`
				  }
			  })

			  const tooldata = yield call(queryToolsInstance, { uuids })
			  if (tooldata && tooldata.policyToolsMap) {
				  policiesInfo.forEach((item) => {
				 	let text = tooldata.policyToolsMap[item.policy.uuid] ? tooldata.policyToolsMap[item.policy.uuid] : []
					/*
				  let toolsname = ''
				  if (text && text.length > 0) {
					  text.forEach((item,index) => {
						if(index === 0){
							toolsname = item.name
						} else {
							toolsname = toolsname + "," + item.name
						}
					 })
				   }
				*/

				item.toolPolicys = text
			  })
		   }
	   }
		//获取每一个策略实例对应的监控实例（end）
        yield put({
          type: 'querySuccess',
          payload: {
            list: policiesInfo,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
          },
        })
      }
 const dataTime = yield call(queryTime)
    let timeList = []
    if (dataTime.content) {
    	dataTime.content.forEach((item) => {
    		let time = {
    			key: item.uuid,
    			value: item.name,
    		}
    		timeList.push(time)
    	})
    }
    yield put({
      	type: 'updateState',
      	payload: {
					timeList,
				},
      })
    }, //query

    * querystdInfo ({ payload }, { select, call, put }) { //查询数据
	    const newdata = { ...payload }
      const data = yield call(stdquery, newdata) //与后台交互，获取数据
      if (data) {
        yield put({
          type: 'querySuccess1',
          payload: {
            stdList: data.content,
			       pagination1: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
          },
        })
      }
    },
    //监控对象
	  * queryobInfo ({ payload }, { select, call, put }) { //查询数据
	    const newdata = { ...payload }
      const data = yield call(queryobInfo, newdata) //与后台交互，获取数据
      if (data) {
        yield put({
          type: 'querySuccess2',
          payload: {
            obList: data.content,
			       pagination2: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
          },
        })
      }
    },
	* queryIndicatorsOne ({ payload }, { call, put }) {
      const data1 = yield call(stdDescquery, payload)
      if (data1) {
        yield put({
          type: 'showModal',
          payload: {
            stdIndicators: data1,
          },
        })
      }
    },


    * create ({ payload }, { call, put }) {
      yield put({
      	type: 'hideModal',
      	payload: {
					modalVisible: false,
					isClose: true,
				},
      })

      const data = yield call(create, payload)
      if (data.success) {
      	yield put({
	      	type: 'hideModal',
	      	payload: {
						modalVisible: false,
						isClose: true,
					},
	      })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * requery ({ payload }, { put }) {
        yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
     * issue ({ payload }, { call, put }) {
      const data = yield call(issue, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * update ({ payload }, { select, call, put }) {
     const id = yield select(({ policyInstance }) => policyInstance.currentItem.policy.uuid)
     const newTool = { ...payload, id }
      const data = yield call(update, newTool)

      if (data.success) {
      	yield put({
	      	type: 'hideModal',
	      	payload: {
						modalVisible: false,
						isClose: true,
					},
	      })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * getPoliciesById ({ payload }, { call, put }) {
      const data = yield call(queryPolicies, payload)
      if (data.success) {
		  //获取每一个策略实例对应的监控实例（start）
		  let policiesInfo = [...data.policies.content]
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

		//获取每一个策略实例对应的监控实例（end）
        yield put({
          type: 'queryObjectPoliciesSuccess',
          payload: {
            list: policiesInfo,
            policyInstanceId: payload.policyInstanceId,
			policyType: payload.policyType,
            relatedPolicyInstances: data.relatedPolicyInstances,
					  issuedPolicyInstances: data.issuedPolicyInstances,
					  unissuedPolicyInstances: data.unissuedPolicyInstances,
					  issueFailedPolicyInstances: data.issueFailedPolicyInstances,
					  notStdPolicyInstances: data.notStdPolicyInstances,
					  tmpPolicyInstances: data.tmpPolicyInstances,

            pagination1: {
              current: data.policies.page.number + 1 || 1,
              pageSize: data.policies.page.pageSize || 10,
              total: data.policies.page.totalElements,
            },
          },
        })
      }
    },
  },

  reducers: {

  	//对象关联策略实例列表用到
  	queryObjectPoliciesSuccess (state, action) {
      const {
 list, pagination1, relatedPolicyInstances, issuedPolicyInstances, unissuedPolicyInstances, issueFailedPolicyInstances, notStdPolicyInstances, tmpPolicyInstances, policyInstanceId, policyType,
} = action.payload
      return {
 ...state,
        list,
        policyInstanceId,
		policyType,
        relatedPolicyInstances,
			  issuedPolicyInstances,
			  unissuedPolicyInstances,
			  issueFailedPolicyInstances,
			  notStdPolicyInstances,
			  tmpPolicyInstances,
        pagination1: {
          ...state.pagination1,
          ...pagination1,
        },
}
    },
 //模板详情浏览列表
	querySuccessTemplat (state, action) {
		let { policyTemplet } = action.payload


		//let policyTemplet=policyTemplet;
  	  if (policyTemplet.collectParams === undefined) {
				  policyTemplet.collectParams = {}
			}
			if (policyTemplet.monitorParams === undefined) {
				  policyTemplet.monitorParams = {
      				indicator: {},
      	  }
			}
			if (policyTemplet.monitorParams.indicator === undefined) {
				  policyTemplet.monitorParams.indicator = {}
			}
			let tabstate = {}

			if (policyTemplet.monitorParams == undefined || policyTemplet.monitorParams.ops == undefined) {
				tabstate = {
				 panes: [],
			  }
			} else {
				let panes = []
				let newTabIndex = 0,
pane

				for (let operation of policyTemplet.monitorParams.ops) {
					let tname = ''
					if (operation.timePeriod === undefined) {
						tname = ''
					} else {
						tname = operation.timePeriod.name
					}
					newTabIndex++

          pane = {
          	title: `新操作${newTabIndex}`,
          	key: (`n${newTabIndex}`),
          	content: {
          				uuid: operation.uuid,
      	         	period: tname,
      	        	times: operation.condition.count,
      		        foward: operation.condition.op,
      		        value: operation.condition.threshold,
      		        originalLevel: operation.actions.gradingAction.oriSeverity,
      		        innderLevel: operation.actions.gradingAction.inPeriodSeverity,
      		        outerLevel: operation.actions.gradingAction.outPeriodSeverity,
      		        discard_innder: operation.actions.discardAction.inPeriodDiscard,
      		        discard_outer: operation.actions.discardAction.outPeriodDiscard,
      		        alarmName: operation.actions.namingAction.naming,
      		        actionsuuid: operation.actions.uuid,
		      		    aDiscardActionuuid: operation.actions.discardAction.uuid,
									aGradingActionuuid: operation.actions.gradingAction.uuid,
									aNamingActionuuid: operation.actions.namingAction.uuid,
		      		    conditionuuid: operation.condition.uuid,
		      		    timePerioduuid: operation.timePeriod.uuid,
      	    },
          }
          panes.push(pane)
        }//for
        tabstate = {
      			activeKey: 'n1',
     			  panes,
            newTabIndex,
        }
			}
			policyTemplet.tabstate = tabstate
		 //对模板详情更新时间和创建时间处理一下
			if (policyTemplet.createdTime !== 0) {
				let text = policyTemplet.createdTime
			policyTemplet.createdTime = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (policyTemplet.updatedTime !== 0) {
				let text = policyTemplet.updatedTime
				policyTemplet.updatedTime = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
		let typeValue = policyTemplet.policyType
	  return { //修改
		  	...state,
		  	policyTemplet,
		  	typeValue,
		  }
    },
  	//浏览列表
  	querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
 ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
}
    },
     	//浏览列表
	querySuccessMos (state, action) {
		const { mosList, paginationPolicy } = action.payload
		  return { //修改
		  	...state,
		  	mosList,
		  	paginationPolicy: {
		  	...state.paginationPolicy,
		  	...paginationPolicy,
		  	},
		  }
    },

    querySuccess1 (state, action) {
      const { stdList, pagination1 } = action.payload
      return {
 ...state,
        stdList,
        pagination1: {
          ...state.pagination1,
          ...pagination1,
        },
}
    },
    //监控对象
     querySuccess2 (state, action) {
      const { obList, pagination2 } = action.payload
      return {
 ...state,
        obList,
        pagination2: {
          ...state.pagination2,
          ...pagination2,
        },
}
    },

  	//这里控制弹出窗口显示
  	showModal (state, action) {
      return { ...state, ...action.payload }
    },
    //这里控制弹出窗口隐藏
		hideModal (state, action) {
      return { ...state, ...action.payload }
    },

    showCheckStatus (state, action) {
      return { ...state, ...action.payload }
    },

    switchBatchDelete (state, action) {
      return { ...state, ...action.payload }
    },

    updateTabs (state, action) {
      return { ...state, ...action.payload }
    },
    updateState (state, action) {
      return { ...state, ...action.payload }
	},
	controllerModalPlus (state, action) {
		let objectArray = typeof (state.advancedItem.exprForFrontend) !== 'undefined' && state.advancedItem.exprForFrontend != '' ? JSON.parse(state.advancedItem.exprForFrontend) : []
		objectArray.push(action.payload.exprForFrontend)
		let stringArray = JSON.stringify(objectArray)
	  let exprstr = ''
	  if (objectArray && objectArray.length > 0) {
		  objectArray.forEach((bean) => {
			  let uuidstr = bean.uuid
			  if (uuidstr && uuidstr.includes('_')) {
				  let arrs = uuidstr.split('_')
				  if (arrs && arrs.length > 0) {
					exprstr += arrs[0]
				  }
			  }
		  })
	  }
	  //给actioin里的currentItem赋值state里的currentItem
		action.payload.advancedItem = state.advancedItem
		action.payload.advancedItem.exprForFrontend = stringArray
	  	action.payload.advancedItem.expr = exprstr

	return { ...state, ...action.payload }
  },
  },

}
