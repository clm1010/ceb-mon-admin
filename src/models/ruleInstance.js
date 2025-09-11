import { query, queryManual, create, remove, createMonitorInstance, updateMonitorInstance, queryInfsrule, queryMonitorInstanceById, issue, errorInfsrule ,onforbid,queryState,DCSIssue,queryDCSlevel,apmIssue} from '../services/ruleInstance'
import { routerRedux } from 'dva/router'
import { queryTime, stdquery } from '../services/policyTemplet'
import { queryobInfo } from '../services/policyInstance'
import { status } from '../services/policyRule'
import { parse } from 'qs'
import NProgress from 'nprogress'
import { Modal, message } from 'antd'
import queryString from "query-string";
export default {
	namespace: 'ruleInstance',

	state: {
		CheckboxSate: true,
		CheckboxSate1: true,
		list: [],								//标准的
		list2: [], //非标准的
		tabShowPage: 'ruleInstance_1', //标准和非标准展示的页
		currentItem: {},						//被选中的单个行对象
		modalVisible: false,					//弹出窗口是否可见
		modalType: 'create',					//弹出窗口的类型
		pagination: {							//分页对象
  			showSizeChanger: true,					//是否可以改变 pageSize
  			showQuickJumper: true, //是否可以快速跳转至某页
  			showTotal: total => `共 ${total} 条`, //用于显示数据总量
  			current: 1,								//当前页数
  			total: null,							//数据总数？
  			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		//非标准的分页
		paginationMan: {
  			showSizeChanger: true,
  			showQuickJumper: true,
  			showTotal: total => `共 ${total} 条`,
  			current: 1,
  			total: null,
  			pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
		},
		checkStatus: 'done',
		isClose: false,
		batchDelete: false,
		batchDeletes: false,
		choosedRows: [],
		choosedRowslist: [],
		filterSchema: [],			//查询配置文件，自动加载生成查询界面

		openRuleType: '', //打开弹出框，显示那个tabs 页
		ruleUUID: '', //选中的网元-交换机 的uuid
		ruleInfsList: [], //获取网元的接口信息
		ruleInfsNumber: 0, //获取网元的接口数量
		ruleInfsVisible: false, //接口数弹出框
		paginationInfs: {								//分页对象
    		showSizeChanger: true,						//是否可以改变 pageSize
      		showQuickJumper: true, //是否可以快速跳转至某页
      		showTotal: total => `共 ${total} 条`,			//用于显示数据总量
      		current: 1,									//当前页数
      		total: null,									//数据总数？
      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    	},
   		//监控实例页面---------start
	   	fileType: 'ruleInstance',
	   	newOperationItem: {},
   		operationVisible: false,
    	operationType: 'add',									//记录操作详情操作状态，add/edit
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
		      		discard_innder: false,
		      		discard_outer: false,
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
		monitorInstanceVisible: false,
		MonitorInstanceItem: {
			collectParams: {},
		},
		stdInfoVal: {},
		monitorInstanceType: 'create',
		    //选择指标
		kpiVisible: false,
		stdList: [],
		//选择指标的分页
		pagination2: {
      		showSizeChanger: true,
      		showQuickJumper: true,
      		showTotal: total => `共 ${total} 条`,
     		current: 1,
      		total: null,
      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    	},
    	//选择对象的分页
    	pagination3: {
      		showSizeChanger: true,
      		showQuickJumper: true,
      		showTotal: total => `共 ${total} 条`,
      		current: 1,
      		total: null,
      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    	},

    	queryInfsrulenewdata: {},
    	obgroupUUID: '',
    	groupUUID: '',
    	groupUUIDs: [],
		selectObjectVisible: false,		//对象过滤页面
    	obInfoVal: {},
		//选择对象页面-------end

		//新增 OR 编辑页面的key
		ruleInstancecreateOrUpdateKEY: '',

		//监控实例页面---------end
		copyOrMoveModal: false,
      	copyOrMoveModalType: 'copy',

      	//下发状态弹窗-----start
		branchsVisible: false,						//弹出窗口是否可见
		branchsType: 'edit',
		checkAll: false,
		checkedList: [],
		indeterminate: true,
		criteria:[],
		//下发状态弹窗-----end
		  
		//分布式下发状态弹窗-----start
		terrVisible: false,						//弹出窗口是否可见
		terrType: 'edit',
		// checkAll: false,
		checkedTerrList: [],
		issueFlag: true,
		// indeterminate: true,
		moCritera:[],
      	//分布式下发状态弹窗-----end  
      	ruleInstanceKey: '',
      	fenhangArr: [],			//下发中分行数组集合
    errorVisible: false,
    errorList: '',
    heightSet: {
			height: '1110px',
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
	   advancedItem:{},
		onIssueForbid:false,
		disItem:{},
    issueType:'normal',
    },

  	subscriptions: {
		setup ({ dispatch, history }) {
      		history.listen((location) => {
            const query = queryString.parse(location.search);
    			if (location.pathname.includes('/ruleInstanceGroup/ruleInstance')) {
      				dispatch({
        				type: 'query',
        				payload: query,
      				})
      				dispatch({
        				type: 'queryManual',
        				payload: query,
      				})
    			}
  			})
    	},
  	},

  	effects: {
		* query ({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ ruleInstance }) => ruleInstance.groupUUIDs)
			const data1 = yield call(queryState, payload)
	       	let groupUUID = ''
	       	if (groupuuids && groupuuids.length > 0) {
		    	groupUUID = groupuuids[0]
	       	}
			if(payload.q){
			// payload.q+=";(mo.firstClass=='NETWORK' or mo.firstClass=='SERVER')"
			payload.q+=";(toolInst.toolType=='ZABBIX')"
			}else{
				// payload.q="(mo.firstClass=='NETWORK' or mo.firstClass=='SERVER')"
				payload.q="(toolInst.toolType=='ZABBIX')"
			}
	       	const newdata = { ...payload, groupUUID }
			const data = yield call(query, newdata)
      		if (data.success) {
        		yield put({
          			type: 'querySuccess',
          			payload: {
        				list: data.content,
        				pagination: {
          					current: data.page.number + 1 || 1,
          					pageSize: data.page.pageSize || 10,
          					total: data.page.totalElements,
						},
						onIssueForbid:data1.content[0].disable,
						disItem:data1.content[0],
          			},
        		})
			  }
		},
		* queryManual ({ payload }, { select, call, put }) {
			const groupuuids = yield select(({ ruleInstance }) => ruleInstance.groupUUIDs)
	       	let groupUUID = ''
	       	if (groupuuids && groupuuids.length > 0) {
		    	groupUUID = groupuuids[0]
	       	}

	       	const newdata = { ...payload, groupUUID }
      		const data = yield call(queryManual, newdata)
      		if (data.success) {
        		yield put({
          			type: 'querySuccessMan',
          			payload: {
        				list2: data.content,
        				paginationMan: {
          					current: data.page.number + 1 || 1,
          					pageSize: data.page.pageSize || 10,
          					total: data.page.totalElements,
        				},
          			},
        		})
      		}
    	},

    		//监控实例数弹窗
		* queryInfsrule ({ payload }, { select, call, put }) { //查询数据
			let newdata = {}
			let queryInfsrulenewdata = yield select(({ ruleInstance }) => ruleInstance.queryInfsrulenewdata)

			if (payload) {
				newdata = { ...payload }
		  	} else {
		  		newdata = queryInfsrulenewdata
		  	}
			if (payload && !payload.uuid) { //传的数据存在 uuid 就不需要从 state 获取
				let uuid = yield select(({ ruleInstance }) => ruleInstance.ruleUUID)
				newdata = { ...payload, uuid }
			}
			const data = yield call(queryInfsrule, newdata) //与后台交互，获取数据

			let ruleInfo = [...data.content]
			if (data.success) {
				yield put({
			  		type: 'querySuccessInfs',
			  		payload: {
						ruleInfsList: ruleInfo,
						queryInfsrulenewdata: newdata,
						paginationInfs: {
				  			current: data.page.number + 1 || 1,
				  			pageSize: data.page.pageSize || 10,
				  			total: data.page.totalElements,
						},
			  		},
				})
       		}
		},

    	* check ({ payload }, { call, put }) {
    		yield put({ 		//设置button按钮为checking状态
	    		type: 'showCheckStatus',
	    		payload: {
	    			checkStatus: 'checking',
	    		},
    		})
      		const data = yield call(check, { url: payload.currentItem.url })
      		if (data.success) {
      			yield put({ 										//设置button按钮为checking状态
	    			type: 'showCheckStatus',
			    	payload: {
			    		checkStatus: 'checking',
			    	},
	    		})
        		yield put({
          			type: 'querySuccess',
          			payload: {
        				list: data.content,
        				pagination: {
          					current: data.page.number + 1 || 1,
          					pageSize: data.page.pageSize || 10,
          					total: data.page.totalElements,
        				},
          			},
        		})
      		}
    	},
    	* create ({ payload }, { call, put }) {
      		const data = yield call(create, payload)
      		if (data.success) {
      			yield put({
	      			type: 'hideModal',
	      			payload: {
						modalVisible: false,
						isClose: true,
						tabShowPage: 'ruleInstance_2', //只有非实例化才有新增，所以在新增成功则显示非实例化页面
					},
	      		})
        		yield put({ type: 'requery' })
      		} else {
        		throw data
      		}
    	},
    	// * requery ({ payload }, { put }) {
        // 	yield put(routerRedux.push({
        // 		pathname: window.location.pathname,
        // 		query: parse(window.location.search.substr(1)),
      	// 	}))
		// },
		* requery ({ payload }, {select, put }) {
			let pageItem = yield select(({ruleInstance}) => ruleInstance.pagination)
			let q = parse(window.location.search.substr(1)).q
		
			yield put({
						type: 'query',
						payload: {
							page: pageItem.current-1,
							pageSize: pageItem.pageSize,
							q:q
						},
					})
		},
    	* delete ({ payload }, { call, put }) {
      		const data = yield call(remove, payload)
      		if (data.success) {
        		yield put({ type: 'requery' })
      		} else {
        		throw data
      		}
    	},

    	//下发错误信息预览
    	* errorInfsrule ({ payload }, { call, put }) {
    		const data = yield call(errorInfsrule, payload)
    		yield put({
					type: 'showRuleModal',
					payload: {
						errorVisible: true,
						uuid: payload.uuid,
						errorList: data,
					},
				})
    	},

    	* update ({ payload }, { select, call, put }) {
      		const uuid = yield select(({ tool }) => tool.currentItem.uuid)
      		const newTool = { ...payload, uuid }
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

		/*
			下发
		*/
		* issue ({ payload }, { call, put }) {
			NProgress.start()//异步加载动画开始
			message.loading('正在下发,请稍后...', 0)
			const data = yield call(issue, payload)
			if (data && data.success) {
				NProgress.done()//异步加载动画结束
				message.destroy()
				message.success('操作完成，后台正在下发！')
				yield put({
					type: 'requery',
					payload: {
						branchsVisible: false,
						isClose: true,
						checkedList: [],
					},
				})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
    * apmIssue ({ payload }, { call, put }) {
        NProgress.start()//异步加载动画开始
        message.loading('正在下发,请稍后...', 0)
        const data = yield call(apmIssue, payload)
        if (data && data.success) {
          NProgress.done()//异步加载动画结束
          message.destroy()
          message.success('操作完成，后台正在下发！')
          yield put({
            type: 'requery',
            payload: {
              branchsVisible: false,
              isClose: true,
              checkedList: [],
            },
          });
          yield put({ type: 'requery' })
        } else {
          throw data
        }
    },

    	* move ({ payload }, { call, put }) {
	 		const data = yield call(MoveTo, payload)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
				    	copyOrMoveModal: false,
			    	},
	      		})
        		yield put({ type: 'requery' })
      		} else {
        		throw data
      		}
  		},

  		* copy ({ payload }, { call, put }) {
	  		const data = yield call(CopyTo, payload)
     		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
				   		copyOrMoveModal: false,
			    	},
	      		})
        		yield put({ type: 'requery' })
      		} else {
        		throw data
      		}
  		},


    	* queryMonitorInstanceById ({ payload }, { call, put }) {
			  const data = yield call(queryMonitorInstanceById, payload)
      		let item = {}
      		let tabstate = {}
			let panes = []
			if (data.instance.policy.alarmSettings == undefined) {
				tabstate = {
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
		      		        discard_innder: false,
		      		        discard_outer: false,
		      		        alarmName: '',
		      		        recoverType: '1',
		      		        actionsuuid: '',
							aDiscardActionuuid: '',
							aGradingActionuuid: '',
							aNamingActionuuid: '',
							conditionuuid: '',
							timePerioduuid: '',
							mode:'0',
							logicOp:'AND'
		      	        },
	              	},
	            	],
	           		newTabIndex: 1,
          		}
			} else {
				let newTabIndex = 0,
					pane
				for (let operation of data.instance.policy.alarmSettings) {
					let tuuid = ''
					if (operation.timePeriod === undefined) {
						tuuid = ''
					} else {
						tuuid = operation.timePeriod.uuid
					}
					newTabIndex++
          			pane = {
          				title: `新操作${newTabIndex}`,
          				key: (`n${newTabIndex}`),
          				content: {
          					uuid: operation.uuid,
		      	         	period: tuuid,
		      		        originalLevel: operation.actions.gradingAction.oriSeverity,
		      		        innderLevel: operation.actions.gradingAction.inPeriodSeverity,
		      		        outerLevel: operation.actions.gradingAction.outPeriodSeverity,
		      		        discard_innder: operation.actions.discardAction.inPeriodDiscard,
		      		        discard_outer: operation.actions.discardAction.outPeriodDiscard,
		      		        alarmName: operation.actions.namingAction.naming,
		      		        recoverType: operation.recoverType,
		      		        actionsuuid: operation.actions.uuid,
				      		aDiscardActionuuid: operation.actions.discardAction.uuid,
							aGradingActionuuid: operation.actions.gradingAction.uuid,
							aNamingActionuuid: operation.actions.namingAction.uuid,
				      		//conditionuuid: operation.condition.uuid,
							timePerioduuid: operation.timePeriod.uuid,
							filterItems:operation.conditions,
							mode:operation.mode.toString(),
							logicOp:operation.logicOp,
							expr:operation.expr,
							exprForFrontend:operation.exprForFrontend,
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

			if (data.instance.policy.collectParams === undefined) {
				let collectParams = {
      				collectInterval: '',
      				timeout: '',
      				retries: '',
      				pktSize: '',
      				pktNum: '',
      				srcDeviceTimeout: '',
      				srcDeviceRetries: '',
      	  		}
				item.collectParams = collectParams
			} else {
				item.collectParams = data.instance.policy.collectParams
			}
			//对更新时间和创建时间处理一下
			if (data.instance.createdTime !== 0) {
				let text = data.instance.createdTime
				item.createdTime = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (data.instance.updatedTime !== 0) {
				let text = data.instance.updatedTime
				item.updatedTime = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			item.tool = data.instance.toolInst.toolType

			let obInfoVal = {}
			if (data.instance.mo !== undefined) {
				obInfoVal = data.instance.mo
			}
			let typeValue = data.instance.policy.policyType
			const dataTime = yield call(queryTime)
    		let timeList = []
    		if (dataTime.content) {
    			dataTime.content.forEach((item0) => {
    				let time = {
    					key: item0.uuid,
    					value: item0.name,
    				}
    				timeList.push(time)
    			})
    		}
			item.name = data.instance.name
			item.createdBy = data.instance.createdBy
			item.updatedBy = data.instance.updatedBy
			item.policyType = data.instance.policy.policyType
			item.monitorParams = data.instance.policy.monitorParams
			item.uuid = data.instance.uuid
			item.branch = data.instance.branch
			//policy
			item.policyuuid = data.instance.policy.uuid
			item.createdFrom = data.instance.policy.createdFrom
			item.isStd = data.instance.policy.isStd
			item.group = data.instance.policy.group
			item.issueStatus = data.instance.policy.issueStatus
			item.policyname = data.instance.policy.name
			item.templateuuid = (data.instance.policy.template ? data.instance.policy.template.uuid : '')
			//策略应用类型
			item.componentType = data.instance.policy.componentType
			item.componentTypeID = data.instance.policy.componentTypeID
			item.component = data.instance.policy.component
			item.componentID = data.instance.policy.componentID
			item.subComponent = data.instance.policy.subComponent
			item.subComponentID = data.instance.policy.subComponentID
			//rule
			item.ruleUUID = (data.instance && data.instance.rule ? data.instance.rule.uuid : '')
      		yield put({
          		type: 'updateState',
          		payload: {
            		tabstate,
            		typeValue,
	        		monitorInstanceVisible: true,
	        		MonitorInstanceItem: item,
	        		timeList,
	        		obInfoVal,
	        		monitorInstanceType: 'update',
					ruleInstancecreateOrUpdateKEY: `${new Date().getTime()}`,
	         	},
        	})
    	},
    	* querystdInfo ({ payload }, { select, call, put }) { //查询数据
	    	const newdata = { ...payload }
      		const data = yield call(stdquery, newdata) //与后台交互，获取数据
      		if (data.success) {
        		yield put({
          			type: 'querySuccess2',
          			payload: {
            			stdList: data.content,
			      		pagination2: {
              				current: data.page.number + 1 || 1,
              				pageSize: data.page.pageSize || 10,
              				total: data.page.totalElements,
            			},
          			},
        		})
      		}
    	},
    	* addInstance ({ payload }, { select, call, put }) {
	     	const dataTime = yield call(queryTime) //时间周期的查询
    	 	let timeList = []
    	 	if (dataTime.content) {
    		  	dataTime.content.forEach((item0) => {
    			  	let time = {
    				  	key: item0.uuid,
    				  	value: item0.name,
    			  	}
    			  	timeList.push(time)
    	   		})
    	 	}

        	yield put({
          		type: 'updateState',
          		payload: {
            		timeList,
            		monitorInstanceType: 'create',
					monitorInstanceVisible: true,
					MonitorInstanceItem: payload.MonitorInstanceItem,
					tabstate: payload.tabstate,
					obInfoVal: {}, //对象清空
					stdInfoVal: {}, //选择的指标清空
					typeValue: '', //普通类型
					ruleInstancecreateOrUpdateKEY: `${new Date().getTime()}`,
          		},
        	})
    	},

    	//监控对象
	  	* queryobInfo ({ payload }, { select, call, put }) { //查询数据
	    	const newdata = { ...payload }
      		const data = yield call(queryobInfo, newdata) //与后台交互，获取数据
     		if (data.success) {
        		yield put({
          			type: 'querySuccess3',
          			payload: {
            			obList: data.content,
			       		pagination3: {
              				current: data.page.number + 1 || 1,
              				pageSize: data.page.pageSize || 10,
              				total: data.page.totalElements,
            			},
          			},
        		})
      		}
    	},
    	* updateMonitorInstance ({ payload }, { select, call, put }) {
      		const id = yield select(({ ruleInstance }) => ruleInstance.MonitorInstanceItem.uuid)
      		const ruleInfsVisible = yield select(({ ruleInstance }) => ruleInstance.ruleInfsVisible)
      		const newData = { ...payload, uuid: id }
      		const data = yield call(updateMonitorInstance, newData)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
						monitorInstanceVisible: false,
					},
	      		})
        		yield put({ type: 'requery' })
        		if (ruleInfsVisible) {
        	 		yield put({ type: 'queryInfsrule' })
        		}
      		} else {
        		throw data
      		}
    	},
    	* createMonitorInstance ({ payload }, { select, call, put }) {
      		const data = yield call(createMonitorInstance, payload)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
						monitorInstanceVisible: false,
						tabShowPage: 'ruleInstance_2',
					},
	      		})
       			 yield put({ type: 'requery' })
      		} else {
        		throw data
      		}
    	},

    	/*
			下发状态查询
		*/
		* status ({ payload }, { call, put }) {
			const data = yield call(status, payload)
			if (data && data.success) {
				let fenhangArr = []
				if (data.issueStatus && data.issueStatus.length !== 0) {
					data.issueStatus.forEach((item) => {
						if (item.running) {
							fenhangArr.push(item.branch)
						}
					})
				}
				yield put({
	      			type: 'updateState',
	      			payload: {
						fenhangArr,
	      			},
	      		})
				yield put({ type: 'requery' })
			} else {
				throw data
			}
		},
		* onforbid ({ payload }, { call, put }) {
			 const data = yield call(onforbid, payload)
			 if(data.success){
				yield put({
					type: 'updateState',
					payload: {
					onIssueForbid:data.disable,
					},
				})
				}
		   },
		* queryState ({ payload }, { call, put }) {
		let newpayload = {}
		const data = yield call(queryState, newpayload)
		if (!data.content[0].disable) {
			yield put ({
				type:'issue',
				payload:payload
			})
			yield put({
				type: 'updateState',
				payload: {
					onIssueForbid:false,
					branchsVisible: false,
				},
			})
		} else {
			message.error('系统正在升级,请稍后下发!')
			yield put({
				type: 'updateState',
				payload: {
					onIssueForbid:true,
				},
			})
		}
	},
		// 分布式下发
		* terrIssue ({ payload }, { call, put }) {
			const data = yield call(DCSIssue, payload)
			if(data.code === 0){
				message.success('任务'+ data.jobId + '下发驱动成功！')

			} else {
				message.error(data.msg)
			}
		},
		//查询分布式类型
		*queryDCSlevel({ payload }, { call, put }) {
			const data = yield call(queryDCSlevel, payload)
			if(data.success){
				yield put ({
					type:'updateState',
					payload:{
						checkedTerrList:data.children
					}
				})
			} else {
				message.error(data.msg)
			}
		}
  	},

  	reducers: {
  		//浏览列表
  		querySuccess (state, action) {
      		const { list, pagination ,onIssueForbid,disItem} = action.payload
      		return {
      			...state,
        		list,
    			pagination: {
      				...state.pagination,
      				...pagination,
				},
				onIssueForbid,
				disItem,
      		}
    	},
    	querySuccessMan (state, action) {
      		const { list2, paginationMan } = action.payload
      		return {
      			...state,
    			list2,
    			paginationMan: {
      				...state.paginationMan,
      				...paginationMan,
    			},
      		}
    	},
    	querySuccess2 (state, action) {
      		const { stdList, pagination2 } = action.payload
      		return {
      			...state,
        		stdList,
        		pagination2: {
          			...state.pagination2,
          			...pagination2,
        		},
      		}
    	},
    	querySuccess3 (state, action) {
      		const { obList, pagination3 } = action.payload
      		return {
      			...state,
        		obList,
        		pagination3: {
          			...state.pagination3,
          			...pagination3,
        		},
      		}
    	},
    	updateState (state, action) {
     		return { ...state, ...action.payload }
    	},
    	querySuccessInfs (state, action) {
      		const { ruleInfsList, paginationInfs, queryInfsrulenewdata } = action.payload
      		return {
      			...state,
        		ruleInfsList,
        		queryInfsrulenewdata,
        		paginationInfs: {
          			...state.paginationInfs,
          			...paginationInfs,
        		},
	  		}
    	},

  		//这里控制弹出窗口显示
  		showModal (state, action) {
      		return { ...state, ...action.payload }
    	},
    	showRuleModal (state, action) {
	      	return { ...state, ...action.payload }
	    },
		showTerrRuleModal (state, action) {
			return { ...state, ...action.payload }
	  	},
    		//这里控制弹出窗口隐藏
		hideModal (state, action) {
      		return { ...state, ...action.payload }
    		},
    	hideRuleModal (state, action) {
	      	return { ...state, ...action.payload }
	    },
		hideTerrRuleModal (state, action) {
			return { ...state, ...action.payload }
	  	},
    	showCheckStatus (state, action) {
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
