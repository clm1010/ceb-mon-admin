import { query, policyCounts, queryPolicyInfo, findById, zabbixAdd, batchSync } from '../services/objectMO'
import { queryToolsInstance, viewStrategy } from '../services/policyInstance'
import { queryToolsURL } from '../services/tools'
import { queryInfs, nescreate, nesupdate, nesquery, nesIntfscreate, nesIntfsupdate, nesdelete, nesdeleteAll, nesIntfsdelete, nesIntfsdeleteAll, allInterfs } from '../services/nes'
import { querylines, createlines, updatelines, deletelines, removelines } from '../services/mo/lines'
import { queryapps, createapps, updateapps, deleteapps, removeapps } from '../services/mo/applications'
import { querydbs, createdbs, updatedbs, deletedbs, removedbs } from '../services/mo/databases'
import { querymws, createmws, updatemws, deletemws, removemws } from '../services/mo/middleWares'
import { queryos, createos, updateos, deleteos, removeos } from '../services/mo/os'
import { queryservers, createservers, updateservers, deleteservers, removeservers } from '../services/mo/servers'
import { querybranchips, createbranchips, updatebranchips, deletebranchips, removebranchips } from '../services/mo/branchip'
import { queryApp } from '../services/maintenanceTemplet'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { notification, message } from 'antd'

export default {

  	namespace: 'objectMO',

  	state: {
  		batchsyncSuccessList: [],
  		batchsyncFailureList: [],
  		batchSyncState: true,
  		batchSyncModalVisible: false,								//批量同步的弹出框
  		syncState: '',										//同步状态
  		moId: '',											//单个mo的唯一标识
  		moSynState: false,									//同步按钮状态
  	  policyModalVisible: false,							//mo手工单台设备弹出框
  		policyList: [],										//策略数组
  		controllerNumber: 0,								//控制器
  		deviceIntfs: [],										//单台设备接口集合
  		moSyncInfo: {},											//单台设备的同步信息
  		policyModalType: '',							//策略窗口
  		policyItem: {},										//选中的单个策略
  		policyInfo: {										//操作详情
			activeKey: 'n1',
			panes: [{
				title: '新操作1',
			    key: 'n1',
			    content: {
				   	uuid: '',
				    period: '',
				    times: '',
				    foward: '>',
				    value: '',
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
				    useExt: false, //是否使用扩展条件
					extOp: '<', //扩展条件
					extThreshold: '', //扩展阈值
			    },
			}],
		    newTabIndex: 1,
    	},
    	typeValue: '',										//编辑页面--策略类型，根据选择值动态调整采集参数
    	stdInfoVal: {},
    	obInfoVal: {},
		list: [], //定义了当前页表格数据集合
	    fields: [], //字段
	    currentItem: {}, //被选中的行对象的集合
	    modalVisible: false, //弹出窗口是否可见
	    linesmodalVisible: false,
	    modalType: 'create', //弹出窗口的类型
	    pagination: { //分页对象
	      	showSizeChanger: true, //是否可以改变 pageSize
	      	showQuickJumper: true, //是否可以快速跳转至某页
	      	showTotal: total => `共 ${total} 条`, //用于显示数据总量
	      	current: 1, //当前页数
	      	total: null, //数据总数？
	      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	    },

		moModalKey: '', //新增、编辑MO时弹出框的key
		moFilterKey: '', //过滤条件弹出框的key
		moFilterExpand: false,
		moImportFileList: [],
		showUploadList: false,
		moImportResultVisible: false, //导入mo结果控制modal
		moImportResultType: '', //导入mo结果类型
		moImportResultdataSource: [], //导入mo结果集合

	   	//点击树需要保存的路径
	   	firstClass: '',
	   	secondClass: '',
	   	thirdClass: '',
	   	showInfoKey: '', //选中树节点的组合KEY
	   	showInfoName: '', //选中树节点的显示名称

	   	//对象管理的策略实例
	   	policyInstanceId: '',
	   	openPolicyType: '',
	   	modalPolicyVisible: false,
	   	moPolicyInfo: {},

	   	//展示接口信息
	   	neUUID: '', //选中的网元-交换机 的uuid
			neInfsList: [], //获取网元的接口信息
			neInfsNumber: 0, //获取网元的接口数量
			InfsVisible: false, //接口数弹出框
			paginationInfs: {								//分页对象
		      	showSizeChanger: true,						//是否可以改变 pageSize
		      	showQuickJumper: true, //是否可以快速跳转至某页
		      	showTotal: total => `共 ${total} 条`,			//用于显示数据总量
		      	current: 1,									//当前页数
		      	total: null,									//数据总数？
	    	},

		//创建、更新接口时，父网元的元素
		neParentObj: {}, //格式{uuid:'',discoveryIP:'',name:''}
		neParentVisible: false, //控制弹出框
		parentlist: [], //父元素集合

		//列表现在删除信息
		batchDelete: false, //控制批量删除按钮
		choosedRows: [], //选中的记录uuid

		//线路类型
		linestype: 'INTERNAL',
		isbwFromA: true, //采集带宽来自本段还是对端
		linesVisible: false,
		obInfoValEndON: {},
		linesVisibleEndON: false,
		createMethodValue: '自动',
		zabbixUrl: '',

		//广义的应用系统
		appsDataInfo: [], //广义应用系统的信息从数据库获取
  	},

  	subscriptions: {
	    setup ({ dispatch, history }) {
	      	history.listen((location) => {
	        	if (location.pathname.includes('/objectGroup/')) {
	          	/*dispatch({
	            	type: 'query',
	            	payload: location.query,
	          	})*/
	        	}
	      	})
	    },
  	},

  	effects: {
	 	* queryAll ({ payload }, { select, call, put }) {
	 		let data = {}
	 		const user = JSON.parse(sessionStorage.getItem('user'))
	 		if (user.branch) {
	  			q += `;branchName  =='${user.branch}'`
	  		}
			data = yield call(nesquery, payload)
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
	        	},
	      })
			}
	 	},
		/*
			页面展示查询

		*/
		* query ({ payload }, { select, call, put }) {
			const user = yield select(({ app }) => app.user)

			//获取广义的应用系统信息start
			const appdata = yield call(queryApp, { pageSize: '1000' })
			let appsDataInfo = []
			if (appdata.success && appdata.content) {
				appsDataInfo = appdata.content
			}
			//获取广义的应用系统信息end

	  		const {
 firstClass, secondClass, thirdClass, resolve, reject, defaultExpandAll,
} = payload
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

	  		if (user.branch) {
	  			q += `;branchName  =='${user.branch}'`
	  		}
	  		let data = {}
	  		if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5') {
				if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
				data = yield call(nesquery, payload)
	  		} else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
				if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
				data = yield call(query, payload)
	  		} else if (showInfoKey === 'NETWORK_HA_LINE') { //互备线路start
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
		  		data = yield call(querylines, payload)
	  		}//end
	  		else if (showInfoKey === 'NETWORK_BRANCH_IP') {
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
	  			data = yield call(querybranchips, payload)
	  		} //end
	  		else if (showInfoKey === 'OS') { //操作系统---start
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
		  		data = yield call(queryos, payload)
	  		}//end
	  		else if (showInfoKey === 'DB') { //数据库---start
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
		  		data = yield call(querydbs, payload)
	  		}//end
	  		else if (showInfoKey === 'MW') { //中间件---start
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
		  		data = yield call(querymws, payload)
	  		}//end
	  		else if (showInfoKey === 'APP') { //应用---start
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
		  		data = yield call(queryapps, payload)
	  		}//end
	  		else if (showInfoKey === 'SERVER') { //主机---start
	  			if (payload.q && payload.q !== '') {
					if (!payload.q.includes('firstClass')) {
						payload.q = `${payload.q};${q}`
					}
				} else {
					payload.q = q
				}
		  		data = yield call(queryservers, payload)
	 	 	}//end
	  		//获取字段
	 		// const fieldsdata = yield call(queryFields,payload)
      		//const parentItem = yield call(queryTool, payload)
      		if (data.success) {
      			if (resolve) { resolve('done') }
				//关联的策略总数
				let Moinfo = []
				if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5' || showInfoKey === 'NETWORK_HA_LINE' || showInfoKey === 'NETWORK_BRANCH_IP' || showInfoKey === 'OS' || showInfoKey === 'DB' || showInfoKey === 'MW' || showInfoKey === 'APP' || showInfoKey === 'SERVER') {
					if (data.content) {
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
					}
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
						defaultExpandAll,
						showInfoKey,
			          	pagination: {
			          		current: data.page.number + 1 || 1,
			          		pageSize: data.page.pageSize || 10,
			          		total: data.page.totalElements,
			          	},
	        		},
	      		})
    		} else if (reject) { reject('error') }
    		yield put({
    			type: 'controllerModal',
    			payload: {
    				appsDataInfo,
    			},
    		})
  	},
	    	* create ({ payload }, { select, call, put }) {
	    		let firstClass = yield select(({ objectMO }) => objectMO.firstClass)
	    		let secondClass = yield select(({ objectMO }) => objectMO.secondClass)
	    		let thirdClass = yield select(({ objectMO }) => objectMO.thirdClass)
	    		let showInfoKey = yield select(({ objectMO }) => objectMO.showInfoKey)
	    		let neParentobj = yield select(({ objectMO }) => objectMO.neParentObj)

	    		payload.firstClass = firstClass
	    		payload.secondClass = secondClass
	    		payload.thirdClass = thirdClass

	    		//互备线路插入发现IP---start
	    		if (showInfoKey === 'NETWORK_HA_LINE') {
	    			if (payload.aaIP != null) {
		    			payload.discoveryIP = payload.aaIP
		    		} else {
		    			payload.discoveryIP = payload.zzIP
		    		}
	    		}
	    		//end
	    		let data = {}
	    		if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5') {
	    			payload.currentItem.keyword = payload.currentItem.discoveryIP	//keyword赋值
	    			payload.currentItem.firstClass = firstClass
	    			payload.currentItem.secondClass = secondClass
	    			payload.currentItem.thirdClass = thirdClass

	    			data = yield call(nescreate, payload.currentItem)
	    		} else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
					payload.branchName = neParentobj.branchName			//所属行名称
					payload.firstSecArea = neParentobj.firstSecArea		//一级安全域
					payload.secondSecArea = neParentobj.secondSecArea		//二级安全域
					payload.mngtOrg = neParentobj.mngtOrg				//设备管理机构
					payload.mngtOrgCode = neParentobj.mngtOrgCode			//设备管理机构编码
					payload.org = neParentobj.org						//设备所属机构
					payload.orgCode = neParentobj.orgCode				//设备所属机构编码
					payload.appName = neParentobj.appName				//所属应用分类名称
					payload.appCode = neParentobj.appCode				//所属应用分类编码
					payload.ObjectID = neParentobj.ObjectID				//ObjectID
					payload.contact = neParentobj.contact				//联系人
					payload.keyword = `${neParentobj.discoveryIP}_${payload.portName}` //keyword赋值
	    			payload.belongsTo = neParentobj
	    			payload.discoveryIP = neParentobj.discoveryIP //此值必须要
	    			payload.parentUUID = neParentobj.uuid
	    			payload.objectID = neParentobj.objectID
	    			data = yield call(nesIntfscreate, payload)
	    		} else if (showInfoKey === 'NETWORK_HA_LINE') { //互备线路start
	    			data = yield call(createlines, payload)
	    		}//end
	    		else if (showInfoKey === 'NETWORK_BRANCH_IP') {
	    			payload.currentItem.keyword = payload.currentItem.discoveryIP	//keyword赋值
	    			payload.currentItem.firstClass = payload.firstClass
	    			payload.currentItem.secondClass = payload.secondClass
	    			payload.currentItem.thirdClass = payload.thirdClass

		  			data = yield call(createbranchips, payload.currentItem)
		  		} //end
	    		else if (showInfoKey === 'OS') { //操作系统---start
	    			payload.keyword = payload.discoveryIP	//keyword赋值
	    			data = yield call(createos, payload)
	    		}//end
	    		else if (showInfoKey === 'DB') { //数据库---start
	    			payload.keyword = payload.discoveryIP	//keyword赋值
	    			data = yield call(createdbs, payload)
	    		}//end
	    		else if (showInfoKey === 'MW') { //中间件---start
	    			payload.keyword = payload.discoveryIP	//keyword赋值
	    			data = yield call(createmws, payload)
	    		}//end
	    		else if (showInfoKey === 'APP') { //应用---start
	    			payload.keyword = payload.discoveryIP	//keyword赋值
	    			data = yield call(createapps, payload)
	    		}//end
	    		else if (showInfoKey === 'SERVER') { //主机---start
	    			payload.currentItem.keyword = payload.currentItem.discoveryIP	//keyword赋值
	    			payload.currentItem.firstClass = payload.firstClass
	    			payload.currentItem.secondClass = payload.secondClass
	    			payload.currentItem.thirdClass = payload.thirdClass
	    			data = yield call(createservers, payload.currentItem)
	    		}//end
	    		if (data.success) {
	    			if (showInfoKey === 'NETWORK_HA_LINE') {
	    				yield put({
		    				type: 'controllerModal',
		    				payload: {
		    					linesmodalVisible: false,
		    				linestype: 'INTERNAL',
							obInfoVal: {},
							obInfoValEndON: {},
							isbwFromA: true,
							moId: data.uuid,
		    				},
		    			})
		    			yield put({ type: 'requery' })
	    			} else {
	    				payload.currentItem = data
	    				yield put({
		    				type: 'controllerModal',
		    				payload,
		    			})
		    			yield put({ type: 'requery' })
	    			}
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
    	* delete ({ payload }, { select, call, put }) {
	  		let data = {}
	  		let showInfoKey = yield select(({ objectMO }) => objectMO.showInfoKey)
	  		if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5') {
		 		data = yield call(nesdelete, payload)
	  		} else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
		 		data = yield call(nesIntfsdelete, payload)
	  		} else if (showInfoKey === 'NETWORK_HA_LINE') { //互备线路---start
		  		data = yield call(deletelines, payload)
	  		}//end
	  		else if (showInfoKey === 'NETWORK_BRANCH_IP') { //网点IP
	  			data = yield call(deletebranchips, payload)
	  		} //end
	  		else if (showInfoKey === 'OS') { //操作系统---start
		  		data = yield call(deleteos, payload)
	  		}//end
	  		else if (showInfoKey === 'DB') { //数据库---start
		 		data = yield call(deletedbs, payload)
	  		}//end
	  		else if (showInfoKey === 'MW') { //中间件---start
		  		data = yield call(deletemws, payload)
	  		}//end
	  		else if (showInfoKey === 'APP') { //应用---start
		  		data = yield call(deleteapps, payload)
	  		}//end
	  		else if (showInfoKey === 'SERVER') { //主机---start
		  		data = yield call(deleteservers, payload)
	  		}//end
      		if (data.success) {
        			yield put({ type: 'requery' })
      		} else {
        			throw data
      		}
    		},
		* deleteAll ({ payload }, { select, call, put }) {
		  	let data = {}
		  	let showInfoKey = yield select(({ objectMO }) => objectMO.showInfoKey)
		  	if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5') {
			 	data = yield call(nesdeleteAll, payload)
		  	} else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
				data = yield call(nesIntfsdeleteAll, payload) //payload 是一个对象
		  	} else if (showInfoKey === 'NETWORK_HA_LINE') { //互备线路---start
			  	data = yield call(removelines, payload)
		  	}//end
		  	else if (showInfoKey === 'NETWORK_BRANCH_IP') { //网点IP
		  	 	data = yield call(removebranchips, payload)
		  	} //end
		  	else if (showInfoKey === 'OS') { //操作系统---start
			  	data = yield call(removeos, payload)
		  	}//end
		  	else if (showInfoKey === 'DB') { //数据库---start
			  	data = yield call(removedbs, payload)
		  	}//end
		  	else if (showInfoKey === 'MW') { //中间件---start
			  	data = yield call(removemws, payload)
		  	}//end
		  	else if (showInfoKey === 'APP') { //应用---start
			  	data = yield call(removeapps, payload)
		  	}//end
		  	else if (showInfoKey === 'SERVER') { //主机---start
			  	data = yield call(removeservers, payload)
		  	}//end
		  	if (!payload.falg) {
		      	if (data.success) {
		        		yield put({ type: 'requery' })
		      	} else {
		        		throw data
		      	}
	      	}
	    },
	    * update ({ payload }, { select, call, put }) {
		  	let firstClass = yield select(({ objectMO }) => objectMO.firstClass)
		  	let secondClass = yield select(({ objectMO }) => objectMO.secondClass)
		  	let thirdClass = yield select(({ objectMO }) => objectMO.thirdClass)
		  	let showInfoKey = yield select(({ objectMO }) => objectMO.showInfoKey)
		  	let neParentobj = yield select(({ objectMO }) => objectMO.neParentObj)

		  	//取currentItem是为了获取完整的对象来全量update后端的mo对象
		  	let currentItem = yield select(({ objectMO }) => objectMO.currentItem)

		  	payload.firstClass = firstClass
		  	payload.secondClass = secondClass
		  	payload.thirdClass = thirdClass

		  	//互备线路插入发现IP---start
		  	if (showInfoKey === 'NETWORK_HA_LINE') {
			  	if (payload.aaIP != null) {
				  	payload.discoveryIP = payload.aaIP
			  	} else {
	  				payload.discoveryIP = payload.zzIP
	  			}
			}
			//end
		  	let data = {}
		  	if (showInfoKey === 'NETWORK_SWITCH' || showInfoKey === 'NETWORK_ROUTER' || showInfoKey === 'NETWORK_FIREWALL' || showInfoKey === 'NETWORK_F5') {
					payload.keyword = payload.discoveryIP	//keyword赋值
					currentItem = Object.assign(currentItem, payload.currentItem)

					data = yield call(nesupdate, currentItem)
		  	} else if (showInfoKey === 'NETWORK_SWITCH_NET_INTF' || showInfoKey === 'NETWORK_ROUTER_NET_INTF' || showInfoKey === 'NETWORK_FIREWALL_NET_INTF' || showInfoKey === 'NETWORK_F5_NET_INTF') {
					payload.branchName = neParentobj.branchName			//所属行名称
					payload.firstSecArea = neParentobj.firstSecArea		//一级安全域
					payload.secondSecArea = neParentobj.secondSecArea		//二级安全域
					payload.mngtOrg = neParentobj.mngtOrg				//设备管理机构
					payload.mngtOrgCode = neParentobj.mngtOrgCode			//设备管理机构编码
					payload.org = neParentobj.org						//设备所属机构
					payload.orgCode = neParentobj.orgCode				//设备所属机构编码
					payload.appName = neParentobj.appName				//所属应用分类名称
					payload.appCode = neParentobj.appCode				//所属应用分类编码
					payload.ObjectID = neParentobj.ObjectID				//ObjectID
					payload.keyword = `${neParentobj.discoveryIP}_${payload.portName}` //keyword赋值
					payload.belongsTo = neParentobj
					payload.discoveryIP = neParentobj.discoveryIP //此值必须要
					payload.parentUUID = neParentobj.uuid

					payload = Object.assign(currentItem, payload)

					data = yield call(nesIntfsupdate, payload)
		  	} else if (showInfoKey === 'NETWORK_HA_LINE') { //互备线路
			  	data = yield call(updatelines, payload)
		  	}//end
		  	else if (showInfoKey === 'NETWORK_BRANCH_IP') { //网点IP
		  		currentItem.keyword = payload.currentItem.discoveryIP	//keyword赋值
		  		payload = Object.assign(currentItem, payload.currentItem)
		  	 	data = yield call(updatebranchips, payload)
		  	} //end
		  	else if (showInfoKey === 'OS') { //操作系统---start
		  		payload.keyword = payload.discoveryIP	//keyword赋值
			 	data = yield call(updateos, payload)
		  	}//end
		  	else if (showInfoKey === 'DB') { //数据库---start
		  		payload.keyword = payload.discoveryIP	//keyword赋值
			  	data = yield call(updatedbs, payload)
		  	}//end
		  	else if (showInfoKey === 'MW') { //中间件---start
		  		payload.keyword = payload.discoveryIP	//keyword赋值
			  	data = yield call(updatemws, payload)
		  	}//end
		  	else if (showInfoKey === 'APP') { //应用---start
		  		payload.keyword = payload.discoveryIP	//keyword赋值
			  	data = yield call(updateapps, payload)
		  	}//end
		  	else if (showInfoKey === 'SERVER') { //主机---start
		  		currentItem.keyword = payload.currentItem.discoveryIP	//keyword赋值
		  		payload = Object.assign(currentItem, payload.currentItem)
			  	data = yield call(updateservers, payload)
		  	}//end
	      if (data.success) {
	      	if (showInfoKey === 'NETWORK_HA_LINE') {
	    			yield put({
		    			type: 'controllerModal',
		    			payload: {
		    				linesmodalVisible: false,
		    				moId: data.uuid,
		    				isClose: true,
		    			},
		    		})
		    		yield put({ type: 'requery' })
	    		} else {
	    			payload.currentItem = data
	    			yield put({
		    			type: 'controllerModal',
		    			payload,
		    		})
		    		yield put({ type: 'requery' })
	    		}
	      } else {
	      		throw data
	      }
	    },
		/*
			获取特有MO上层的设备信息
		*/
		* queryParentInfo ({ payload }, { select, call, put }) {
		  	let firstClass = payload.firstClass
		  	let secondClass = payload.secondClass
		  	let q = `firstClass =='${firstClass}'`
		  	if (secondClass && secondClass !== '') {
			  	q += `;secondClass =='${secondClass}'`
		  	}
		  	if (payload.q && payload.q !== '') {
				payload.q = `${payload.q};${q}`
			} else {
				payload.q = q
		  	}
		  	const data = yield call(nesquery, payload)
		  	if (data.success) {
			 	let Moinfo = []
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
				yield put({
	          		type: 'querySuccessParent',
	          		payload: {
	            			parentlist: Moinfo,
	            			paginationInfs: {
	              			current: data.page.number + 1 || 1,
	              			pageSize: data.page.pageSize || 10,
	              			total: data.page.totalElements,
	            			},
	          		},
	        		})
		  	}
		},
		/*
			获取特有MO下层的接口信息
		*/
		* queryInfs ({ payload }, { select, call, put }) {
			let newdata = { ...payload }
			let neToInfsUUID = ''
			if (!payload.neUUID) { //传的数据存在 neUUID 就不需要从 state 获取
				neToInfsUUID = yield select(({ objectMO }) => objectMO.neUUID)
				newdata = { ...payload, neUUID: neToInfsUUID }
			}
			const data = yield call(queryInfs, newdata) //与后台交互，获取数据
			if (data) {
				yield put({
				  	type: 'querySuccessInfs',
				  	payload: {
						neInfsList: data.content,
						paginationInfs: {
					  		current: data.page.number + 1 || 1,
					  		pageSize: data.page.pageSize || 10,
					  		total: data.page.totalElements,
						},
				  	},
				})
	       	}
		},
		/*
			同步zabbix对象到U2后端
		*/
		* zabbixAdd ({ payload }, { select, call, put }) {
			let newdata = { ...payload }
			const data = yield call(zabbixAdd, newdata) //与后台交互，获取数据
			if (data.success) {
				yield put({ type: 'moSync/requery' })
				//如果是同步成功的场景，弹出成功通知
				if (payload.mos.length === 1 && payload.mos[0].syncStatus === 'success') {
					notification.success({
					  message: `设备[${payload.mos[0].name}]同步成功`,
					  description: `ObjectID是${payload.mos[0].objectID}  区域是${payload.mos[0].location}     名称:${payload.mos[0].hostname}  同步到${payload.mos[0].intfs.length}个接口`,
					})
				}
	    	}
		},
		/*
			获取MO关联的策略实例
		*/
		* queryPolicy ({ payload }, { select, call, put }) {
			let newdata = { ...payload }
			if (!payload.uuid) { //传的数据存在 moUUID 就不需要从 state 获取
				let moUUID = yield select(({ objectMO }) => objectMO.policyInstanceId)
				newdata = { ...newdata, uuid: moUUID }
			}
			if (!payload.policyType) { //传的数据存在 policyType 就不需要从 state 获取
				let type = yield select(({ objectMO }) => objectMO.openPolicyType)
				newdata = { ...newdata, policyType: type }
			}
			const data = yield call(queryPolicyInfo, newdata) //与后台交互，获取数据
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
		* findById ({ payload }, { call, put }) {
			const data = yield call(findById, payload.currentItem)

			let neParentObj = {}
	  		if (data && data.belongsTo) {
				neParentObj = data.belongsTo
	  		}
	  		let obInfoVal = {}
	  		let obInfoValEndON = {}
	  		if (data && data.aaIntf) {
		  		obInfoVal = data.aaIntf
	  		}
	  		if (data && data.zzIntf) {
		  		obInfoValEndON = data.zzIntf
	  		}
	  		if (payload.secondClass === 'HA_LINE') {
	  			yield put({
	        			type: 'controllerModal',
	        			payload: {
	        				modalType: 'update',
	        				currentItem: { ...data },
	        				linesmodalVisible: true,
	        				isClose: false,
							neParentObj,
							obInfoVal: { ...obInfoVal },
							obInfoValEndON: { ...obInfoValEndON },
							linestype: (data.lineType ? data.lineType : 'INTERNAL'),
							isbwFromA: data.bwFromA,
							moModalKey: `${new Date().getTime()}`,
	        			},
	      		})
	  		} else if (data.success) {
	  				payload.createMethodValue = data.mngInfoSrc	//查到一台mo，自动用mngInfoSrc覆盖createMethodValue
	  				payload.zabbixUrl = data.createdByTool //查到一台mo，自动用createdByTool覆盖页面内zabbixUrl。这是机构窗口warning的依据
	  				payload.currentItem = data
	  				yield put({
				    	type: 'controllerModal',
				    	payload,
			    	})
	  			}
		},
		* viewStrategy ({ payload }, { call, put }) {
			let uuid = payload.uuid
			const data = yield call(viewStrategy, payload)
			if (data.success) {
				let policyList = data.data[0].policies

				yield put({
					type: 'controllerModal',
					payload: {
						policyList,
					},
				})
			}
		},

		* getInterfacesById ({ payload }, { call, put, select }) {
			//获取接口列表
			const dataList = yield call(allInterfs, payload.currentItem)
			if (dataList.success) {
				payload.deviceIntfs = dataList.content
				yield put({
					type: 'controllerModal',
					payload,
				})
			}
		},

		* oneMoSync ({ payload }, { call, put, select }) {
			//同步设备信息
			const dataMoInfo = yield call(batchSync, payload)
			if (dataMoInfo.success) {
				//取currentItem是为了获取完整的对象来全量update后端的mo对象
		  	let currentItem = yield select(({ objectMO }) => objectMO.currentItem)

				//同步成功后，修改state里当前对象的值
				currentItem = Object.assign(currentItem, dataMoInfo.mos[0])

				yield put({
					type: 'controllerModal',
					payload: ({
						currentItem: { ...currentItem },
						moSynState: false,
					}),
				})

				yield put({ type: 'requery' })

				//获取接口列表
				const dataList = yield call(allInterfs, currentItem)
				if (dataList.success) {
					yield put({
						type: 'controllerModal',
						payload: ({
							deviceIntfs: dataList.content,
						}),
					})
				} else if (!dataList.success) {
					message.error('没有获取到mo接口信息！')
				}
			} else if (!dataMoInfo.success) {
				message.error('同步mo失败,无返回信息！')
				yield put({
					type: 'controllerModal',
					payload: ({
						moSynState: false,
					}),
				})
			}
		},
		* batchSync ({ payload }, { call, put }) {
			let successList = []
			let failureList = []
			//payload接收一个uuid数组，请求一个oneMoSync接口，返回给我一个mo数组
			const data = yield call(batchSync, payload)
			//判断返回集合的状态是否success
			if (data.success) {
				//循环遍历数组，只过滤出同步失败的信息,也需要一个同步成功的集合以防情况有变
				for (let mo of data.mos) {
					if (mo.syncStatus === 'success') {
						successList.push(mo)
					} else if (mo.syncStatus === 'failed') {
						failureList.push(mo)
					}
				}
				yield put({
					type: 'controllerModal',
					payload: ({
						batchSyncState: false,
						batchsyncSuccessList: successList,
						batchsyncFailureList: failureList,
					}),
				})
			} else if (!data.success) {
				message.error('未返回同步信息!')
				yield put({
					type: 'controllerModal',
					payload: ({
						batchSyncModalVisible: false,
					}),
				})
			}
		},
		* queryToolsURL ({ payload }, { call, put }) {
			let newdata = {},
q = ''
			q = `branch ==${payload.branch}` + ';' + 'toolType == \'ZABBIX\''
			newdata.q = q
			const data = yield call(queryToolsURL, newdata)
			if (data.success) {
				if (data.content) {
					yield put({
			        type: 'controllerModal',
			        payload: {
			        		zabbixUrl: (data.content.length !== 0 ? data.content[0].url : ''),
			        },
			   	})
			  }
			}
		},


  	},

  	reducers: {
  		//浏览列表
  		querySuccess (state, action) {
      		const {
 list, pagination, fields, firstClass, secondClass, thirdClass, showInfoKey, controllerNumber, policyModalVisible,
} = action.payload

	     	 return {
	     	 	...state,
				list,
				fields,
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
		querySuccessInfs (state, action) {
	      	const { neInfsList, paginationInfs } = action.payload
	      	return {
	      		...state,
	        		neInfsList,
	        		paginationInfs: {
		          		...state.paginationInfs,
		         		...paginationInfs,
	        		},
		  	}
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
		querySuccessParent (state, action) {
	      	const { parentlist, paginationInfs } = action.payload
	      	return {
	      		...state,
	        		parentlist,
	        		paginationInfs: {
	          		...state.paginationInfs,
	          		...paginationInfs,
	        		},
		  	}
	   },
	  	//这里控制弹出窗口显示
	  	controllerModal (state, action) {
	      return { ...state, ...action.payload }
	    },
  	},
}
