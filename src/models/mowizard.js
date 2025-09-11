import { queryAllTypeOfMO, query, findById } from '../services/objectMO'
import { nesquery } from '../services/nes'
import { querylines, createlines, deletelines, updatelines } from '../services/mo/lines'
import { allInterfs, nesdelete } from '../services/nes'
import { getMoDiscover, postWizardPreview, postNewNeAndIfs, getMOWizardById, postLineWizardPreview, postNesOffline,
         postLineOffline, savePreview, issuePreview, ruleInstanceIssue, postBrIPWizardPreview, postMosOffline,
         postMosIssueOffline
        } from '../services/mowizard'
import { oneMoSync } from '../services/objectMO'
import { querybranchips, createbranchips, updatebranchips } from '../services/mo/branchip'
import {queryState} from '../services/ruleInstance'
import { message,Modal } from 'antd'
import queryString from "query-string";
import { changeInfo } from '../services/discovery'
import { routerRedux } from 'dva/router'
/**
* 自服务管理/网络自服务
* @namespace mowizard
* @requires module:自服务管理/网络自服务
*/
export default {

  namespace: 'mowizard',

  state: {
    wizardVisible: false,														//弹出窗口是否可见
    currentStep: 0,
    neitem: {},
    moList:[],
		list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    //modalVisible: false,														//弹出窗口是否可见
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    ifList: [],                                     //interface List
    policyAllList: [],
    policyExistList: [],
    policyList: [],
    dataList: {},
    lineList: {},
    branchIP: {},
    preIntfs: [],
    preIssueResult: {},
    errorList: [],
    preListType:'UNISSUED',

    selectedRows: [],                //for interface
    selectedRowKeys: [],

    errorMessage:'',
    changeType: '',
    ip:'',
    moIp:'',
    moName:'',
    moType:'',
    message:'',

    pageChange: 0,
    q: '',

    loadingEffect: false,

    batchDelete: false,
    //Line
    lineWizardVisible: false,						//弹出窗口是否可见
    listLine:[],
    lineItem:{},

    batchSelect:[],                  //for MO or Lines
    secondSecAreaDisabled: true, //二级安全域禁用状态
    onIssueForbid:false,         //下发是否禁止标示

    //Line
    bripWizardVisible: false,						//弹出窗口是否可见
    bripItem:{},
    listBrIP:[],
    bripCurrentStep:0,                 // cause error

    infoBody:{},
    isMon:false,
    state:'',

    batchSyncModalVisible:false,
    batchSyncState:true,
    batchsyncSuccessList:[],
    batchsyncFailureList:[]
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = queryString.parse(location.search);
        if (location.pathname === '/MOwizard') {
          dispatch({
            type: 'queryMOs',
            payload: query,
          })
        }
      })
    },
  },

  effects: {

       /**
     * 获取数据
     * 与后台交互 调用接口 /api/v1/mos/ 
     * @function mowizard.query
     */
		* query ({ payload }, { call, put }) {
      const data = yield call(queryAllTypeOfMO, payload)
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
            q: payload.q,
          },
        })
      }
    },

    /**
     * 上线
     * @function  mowizard.neCreate
     */
    * neCreate ({ payload }, { call, put }) {
      //const data = yield call(moDiscover, payload)
      //if (data.success) {
        yield put({
      	    type: 'setState',
      	    payload: payload,
        })
      //}
    },

    /**
     * 自服务向导设备发现
     * 与后台交互 调用接口 /api/v1/mos/discovery
     * @function mowizard.moDiscovery
     */
    * moDiscovery ({ payload }, { call, put }) {
      // clear data
      yield put({
        type: 'setState',
        payload: {
          ifList: [],
          neitem: [],
          selectedRows: [],
        }
      })
      const data = yield call(getMoDiscover, payload)
      if (data.success) {
        let i=0
        let tmpIF = []
        let selRows = []
        data.intfs.forEach(item => {
          i += 1
          let ifData = item
          ifData.id = i
          if (!('typ' in item)) {
            ifData.typ = ""
          }
          tmpIF.push(ifData)

          if (item.performanceCollect || item.iisreset || item.syslogMonitoring) {
            selRows.push(ifData)
            //selectedRowKeys.push(ifData.id)
          }
        });
          yield put({
            type: 'setState',
            payload: {
              changeType: data.changeType,
              ip:data.ip,
              moIp:data.moIp,
              moType:data.moType,
              message:data.message,
              ifList: tmpIF,
              neitem: data.ne,
              selectedRows: selRows,
              currentStep:1,
              loadingEffect: false,
            }
        })
      } else {
        message.error(data.msg)

        yield put({
          type: 'setState',
          payload: {
            //currentStep: (currentStep-1) > 0 ? (currentStep-1):0,
            currentStep:0,
            loadingEffect: false,
          }
      })
  }

    },

    /**
     * 获取数据
     * 与后台交互 调用接口 /api/v1/mos/ 获取管理对象列表
     * @function mowizard.queryMos
     */
    * queryMOs ({ payload }, { call, put }) {
      let params = {...payload}
      /* Only for network field
      if (params.q === undefined || params.q === '' ) {
        //params.q = '(firstClass==NETWORK and secondClass!=HA_LINE or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP)'
        params.q = '(firstClass==NETWORK or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP)'
      }
      else if (params.q.includes("firstClass=='NETWORK'")) {
        params.q = params.q.replace("firstClass=='NETWORK'", '(firstClass==NETWORK and secondClass!=HA_LINE)')
      } else if (params.q.indexOf('firstClass') === -1) {
        //params.q += ';(firstClass==NETWORK and secondClass!=HA_LINE or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP)'
        params.q += ';(firstClass==NETWORK or firstClass==SERVER or firstClass==HARDWARE or firstClass==IP or firstClass==OS or firstClass==DB or firstClass==MW or firstClass==APP)'
      }*/
      let qs = 'firstClass==NETWORK and (secondClass==null or secondClass != HA_LINE and secondClass != BRANCH_IP and secondClass != NM) and (thirdClass==null or thirdClass!=NET_INTF )'
      if (params.q === undefined || params.q === '' ) {
        params.q = qs
      } else {
        params.q += ';' + qs
      }
      /**
       * @description call query
       */
      const data = yield call(query, params)
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
            q: payload.q,
          },
        })
      }
    },

    /**
     * 自服务向导设备变更
     * 与后台交互 调用接口  /api/v1/mos/change/ 获取数据
     * @function mowizard.findMOById
     */
    * findMOById ({ payload }, { call, put }) {
      /*
      // clear data
      yield put({
        type: 'setState',
        payload: {
          ifList: [],
          neitem: [],
          selectedRows: [],
          currentStep:0,
        }
      })*/
      const data = yield call(getMOWizardById, payload.uuid)
      if (data.success) {
        let i=0
        let tmpIF = []
        let selRows = []
        data.intfs.forEach(item => {
          i += 1
          let ifData = item
          ifData.id = i
          // if (!('realBandwidth' in item)) {
          //   ifData.realBandwidth = ""
          // }
          // if (!('typ' in item)) {
          //   ifData.typ = ""
          // }
          tmpIF.push(ifData)

          if (item.performanceCollect || item.iisreset || item.syslogMonitoring) {
            selRows.push(ifData)
            //selectedRowKeys.push(ifData.id)
          }
        });
        yield put({
            type: 'setState',
            payload: {
              ifList: tmpIF,
              neitem: data.ne,
              changeType: data.changeType,
              moIp:data.moIp,
              moType:data.moType,
              message:data.message,
              selectedRows: selRows,
              currentStep:1,
              wizardVisible: true,
            }
        })
      } else {
        message.error(data.msg)

        yield put({
          type: 'setState',
          payload: {
            //currentStep: (currentStep-1) > 0 ? (currentStep-1):0,
            currentStep:0,
          }
      })

      }
    },

    /**
     * 获取数据
     * 与后台交互 调用接口 /api/v1/lines/ 获取线路资源列表
     * @function mowizard.queryLines
     */
    * queryLines ({ payload }, { call, put }) {
      /**
       * @description call querylines
       */
      const data = yield call(querylines, payload)
      if (data.success) {
        yield put({
          type: 'queryLineSuccess',
          payload: {
            listLine: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: payload.q,
          },
        })
      }
    },
    /**
     * 获取自服务预览数据
     * 与后台交互 调用接口 /api/v1/monitor-rules/wizardPreview  获取数据
     * @function mowizard.queryPreview
     */
    * queryPreview({ payload }, { call, put }) {
      const data = yield call(postWizardPreview, payload.preIssueJobInfo)
      //const data = yield call(postWizardPreview, payload)
      if (data.success) {
        /*yield put({
          type: 'setState',
          payload: {
			policyAllList: data.all,
			policyExistList: data.existing,
			policyList: data.incremental,
            errorList: data.problem,
            currentStep:3,
            loadingEffect: false,
          },
        })*/
        yield put({
          type: 'setPreviewLists',
          payload: data,
        })
        yield put({
          type: 'setState',
          payload: {
            currentStep:3,
            moName:data.moName,
            loadingEffect: false,
          },
        })
      } else {
        message.error(data.msg)

        yield put({
          type: 'setState',
          payload: {
            //currentStep: (currentStep-1) > 0 ? (currentStep-1):0,
            currentStep:2,
            loadingEffect: false,
          }
        })
      }
    },
    /**
     * 设备提交
     * 与后台交互 调用接口  /api/v1/nes/neAndIntfs 新增设备和设备下的接口
     * @function mowizard.objWZSubmit
     */
    * objWZSubmit({ payload }, { call, put }) {
      const data = yield call(postNewNeAndIfs, payload.mo)
      if (data.success) {
        message.success('设备提交成功！',2)
        yield put({ type: 'queryMOs', payload : { q:payload.q} })
      } else {
        message.error(data.msg)
      }

    },

    /**
     * 查询线路设备
     * 与后台交互 调用接口  /api/v1/nes/ 获取网元设备
     * @function mowizard.queryLineNe
     */
    * queryLineNe ({ payload }, { put, call, select }) {
      let newdatas = { ...payload }
      let linetype = newdatas.linetype
      delete newdatas.linetype
      let curitem = newdatas.lineItem
      delete newdatas.lineItem
      let uuidLocal = undefined
      let uuidFar = undefined
      let localAppName = undefined
      let localAppCode = undefined
      let branchName,mngtOrgCode
	    //查询条件可以传入，这里需要按分行更改查询语句
	    let qs = newdatas.q
	    //qs = `firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5')  and (discoveryIP=='${payload.inputInfo}')`
      if ('INTERNAL' === linetype) {
        qs = `firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5')  and (discoveryIP=='${payload.inputInfo}' or discoveryIP=='${payload.farendInfo}')`
      } else {
	      qs = `firstClass=='NETWORK' and (secondClass=='ROUTER' or secondClass=='SWITCH' or secondClass=='FIREWALL' or secondClass=='F5')  and (discoveryIP=='${payload.inputInfo}')`
      }

	    newdatas.q = qs
	    //请求数据
	    const data = yield call(nesquery, newdatas)
	    if (data.success) {
        let mos = data.content
        //console.dir(mos)
        mos.forEach((item => {
          if (item.mo.discoveryIP === payload.inputInfo) {
            uuidLocal = item.mo.uuid
            localAppName = item.mo.appName
            localAppCode = item.mo.appCode
            branchName = item.mo.branchName
            mngtOrgCode = item.mo.mngtOrgCode
          }
          if (item.mo.discoveryIP === payload.farendInfo) {
            uuidFar = item.mo.uuid
          }
        }))
        if (uuidLocal === undefined) {
          message.error('本端设备IP不存在, 请先新增设备!',2)
          yield put({
            type: 'setState',
            payload: {
              currentStep:0,
              loadingEffect: false,
            }
          })
        } else if (('INTERNAL' === linetype) && (uuidFar === undefined)){
          message.error('对端设备IP不存在, 请先新增设备!',2)
          yield put({
            type: 'setState',
            payload: {
              currentStep:0,
              loadingEffect: false,
            }
          })
        } else {
          if (uuidLocal !== undefined) {
            //发起查询该设备下端口列表的请求
            let params = {uuid:uuidLocal}
            let dataList = yield call(allInterfs, params)
		        if (dataList.success) {
              curitem.aAItfsList = dataList.content
            }
            curitem.appName = localAppName
            curitem.appCode = localAppCode
            curitem.branchName = branchName
            curitem.mngtOrgCode = mngtOrgCode
          }
          if (('INTERNAL' === linetype) && (uuidFar !== undefined)) {
            let params = {uuid:uuidFar}
            let dataList = yield call(allInterfs, params)
		        if (dataList.success) {
              curitem.zZItfsList = dataList.content
            }
          }
	    	  yield put({
	    		  type: 'setState',
	    		  payload: {//必须使用
	    			  lineItem: curitem,
              currentStep:1,
              loadingEffect: false,
	    		  },
          })
        }
	    } else {
        //message.error(data.status+':设备查询失败!',2)
        message.error(data.msg)

        yield put({
          type: 'setState',
          payload: {
            currentStep:0,
            loadingEffect: false,
          }
        })
      }
  	},

   /**
     * 获取数据
     * 与后台交互 调用接口  /api/v1/monitor-rules/wizardPreview/line 线路基于向导的下发预览
     * @function mowizard.queryLinePreview
     */
    * queryLinePreview({ payload }, { call, put }) {
      let newData = {}
      if(payload.modalType === 'update'){//修改是需要传递uuid
        newData = payload.lineItem
      }else {//新增时只需要传递表单的数据
        newData = {
          aaDeviceIP: payload.lineItem.aaDeviceIP, aaIP: payload.lineItem.aaIP, aaIntf: payload.lineItem.aaIntf,
          aaPhyName: payload.lineItem.aaPhyName, aaPort: payload.lineItem.aaPort, aaa: payload.lineItem.aaa,
          abc: payload.lineItem.abc, alias: payload.lineItem.alias, appCode: payload.lineItem.appCode,
          appName: payload.lineItem.appName, bbb: payload.lineItem.bbb, branchName: payload.lineItem.branchName,
          branchname_cn: payload.lineItem.branchname_cn, bwFromA: payload.lineItem.bwFromA,capType: payload.lineItem.capType,
          haMode: payload.lineItem.haMode, lineID: payload.lineItem.lineID, lineType: payload.lineItem.lineType,
          managedStatus: payload.lineItem.managedStatus, mngtOrg: payload.lineItem.mngtOrg, mngtOrgCode: payload.lineItem.mngtOrgCode,
          name: payload.lineItem.name, onlineStatus: payload.lineItem.onlineStatus, provider: payload.lineItem.provider,
          slaNum: payload.lineItem.slaNum, zzDeviceIP: payload.lineItem.zzDeviceIP, zzIP: payload.lineItem.zzIP,
          zzPhyName: payload.lineItem.zzPhyName, zzPort: payload.lineItem.zzPort,_aaPort: payload.lineItem._aaPort,
          discoveryIP: payload.lineItem.aaDeviceIP, firstClass: 'NETWORK', secondClass:  'HA_LINE',
          keyword: (payload.lineItem.lineType === 'INTERNAL' ? 
          `${payload.lineItem.aaDeviceIP}_[${payload.lineItem.aaPort}]_[${payload.lineItem.aaIntf.name}]-->${payload.lineItem.zzIP}_[${payload.lineItem.zzPort}]_[${payload.lineItem.zzIntf.name}]`
            :`${payload.lineItem.aaDeviceIP}_[${payload.lineItem.aaPort}]_[${payload.lineItem.aaIntf.name}]-->${payload.lineItem.zzIP}`
          )
        }
      }
      const data = yield call(postLineWizardPreview, newData)
      if (data.success) {
        let dataList = {
          line:data.line,
          preIssueResult:data.preIssueResult,
          changeType:data.changeType,
          moType:data.moType,
          moIp:data.moIp,
          moName:data.moName,
          branch:data.branch
        }
        /*yield put({
          type: 'setState',
          payload: {
			policyAllList: data.all,
			policyExistList: data.existing,
			policyList: data.incremental,
            errorList: data.problem,
            currentStep:2,
            loadingEffect: false,
          },
        })*/
        yield put({
          type: 'setPreviewLists',
          payload: data,
        })
        yield put({
          type: 'setState',
          payload: {
            dataList: dataList,
            currentStep:2,
            loadingEffect: false,
          },
        })
      } else {
        message.error(data.msg)

        yield put({
          type: 'setState',
          payload: {
            currentStep:1,
            loadingEffect: false,
          }
        })
      }
    },
    /**
     * 设备保存
     * 与后台交互 调用接口 /api/v1/rule-instances/ 下发
     * @function mowizard.createLine
     */
  * createLine ({ payload }, { call, put }) {
    let currentItem = {}
    currentItem.firstClass = 'NETWORK'
    currentItem.secondClass = 'HA_LINE'				//@@@
    currentItem.discoveryIP = payload.currentItem.aaDeviceIP

    currentItem = Object.assign(currentItem, payload.currentItem)

    if (currentItem.lineType === 'INTERNAL') {	// 行内线路keyword的写法
      currentItem.keyword = `${currentItem.aaDeviceIP}_[${currentItem.aaPort}]_[${currentItem.aaIntf.name}]-->${currentItem.zzIP}_[${currentItem.zzPort}]_[${currentItem.zzIntf.name}]`
    } else {
      currentItem.keyword = `${currentItem.aaDeviceIP}_[${currentItem.aaPort}]_[${currentItem.aaIntf.name}]-->${currentItem.zzIP}`
    }

    //state里的item和表单提取的item合并

    //提交之前干掉多余的端口数组
    delete currentItem.aAItfsList
    delete currentItem.zZItfsList
    const data = yield call(createlines, currentItem)
    if (data.success) {//如果保存成功，那么根据types的类型去做相对应的操作
      // message.success('设备保存成功！')
      if(payload.types === 'save'){//点击保存按钮
        //调用保存接口
        // const save = yield call ( savePreview, payload.dataList )
        // if(save.success){
          // message.success('保存预览实例完成！')
          Modal.success({
            title: 'MO保存成功！',
            content: '未做策略变更,保存线路信息成功！',
            okText: '确认',
          });
        // }else{
        //   // message.warning('保存预览实例失败！')
        //   Modal.error({
        //     title: 'MO保存失败！',
        //     content: '未做策略变更,保存线路信息失败！',
        //     okText: '确认',
        //   });
        // }
      }else if(payload.types === 'issue'){//点击下发按钮
        //调用下发接口
        const issue = yield call ( issuePreview, payload.dataList )
        if(issue.success){
          // message.success('线路下发完成！')
          Modal.success({
            title: '策略变更成功',
            content: '线路下发完成！',
            okText: '确认',
          });
        }else{
          // message.warning('线路下发失败！请重新下发',10)
          Modal.error({
            title: '策略变更失败',
            content: '线路下发失败！请重新下发',
            okText: '确认',
          });
        }
      }
      yield put({ type: 'queryLines', payload : { q:''} })
    } else {
      // message.error(data.msg)
        Modal.error({
          title: 'MO保存失败！',
          content: '未做策略变更,保存线路信息失败！',
          okText: '确认',
      });
      yield put({
        type: 'setState',
        payload: {
          lineItem : {},
        },
      })
      throw data
    }
  },
 /**
     * 线路下线保存
     * 与后台交互 调用接口 /api/v1/lines/offline 下线 ,/api/v1/rule-instances/ 下发
     * @function mowizard.deleteLine
     */
  * deleteLine ({ payload }, { select, call, put }) {
    let params = {}
    let moCriteria = ''
    let issueParams = { oper: 11 }
    params.uuids = payload.uuids

    if (payload.save === 'save') {
      const data = yield call(postLineOffline, params)
      if (data.success) {
        message.success('线路下线成功！')
        yield put({ type: 'queryLines',payload: {q: payload.q}})
      } else {
        message.error(data.msg)
        throw data
      }
    }else if(payload.save === 'issue'){
      //下线设备也需要实现下发  才能真正意义上的下线设备
      if(params.uuids.length === 1){//如果只有一个设备需要下线  直接拼接
        moCriteria = 'uuid == ' + params.uuids[0]
      }else{//如果是批量的下线   组装字符串
        params.uuids.forEach((item, index) => {
          moCriteria = moCriteria + ( index === 0 ? '' : ' or ' ) + 'uuid == ' + item
        })
      }
      issueParams.moCriteria = moCriteria//添加下发的条件
      const issue = yield call (ruleInstanceIssue, issueParams)
      if(issue.success){
        // message.success('线路下线并下发！')
        Modal.success({
          title: '成功',
          content: '线路下线并下发！',
          okText: '确认',
        });
        yield put({ type: 'queryLines',payload: {q: payload.q}})
      }else{
        // message.error('线路下线失败!请重新下线',10)
        Modal.error({
          title: '失败',
          content: '线路下线失败!请重新下线',
          okText: '确认',
        });
      }
    }
    /*// uncaught in promise exception
    const data = yield call(postLineOffline, params)
    if (data.success && payload.save === 'save') {
      message.success('线路下线成功！')
      yield put({ type: 'queryLines',payload: {q: payload.q}})
    }else if(data.success && payload.save === 'issue'){
      //下线设备也需要实现下发  才能真正意义上的下线设备
      if(params.uuids.length === 1){//如果只有一个设备需要下线  直接拼接
        moCriteria = 'uuid == ' + params.uuids[0]
      }else{//如果是批量的下线   组装字符串
        params.uuids.forEach((item, index) => {
          moCriteria = moCriteria + ( index === 0 ? '' : ' or ' ) + 'uuid == ' + item
        })
      }
      issueParams.moCriteria = moCriteria//添加下发的条件
      const issue = yield call (ruleInstanceIssue, issueParams)
      if(issue.success){
        message.success('线路下线并下发！')
        yield put({ type: 'queryLines',payload: {q: payload.q}})
      }else{
        message.error('线路下线失败！')
      }
    } else {
      message.error(data.msg)
      throw data
    }*/
 },

 /**
  * 设备下线状态保存
  * 与后台交互 调用接口 /api/v1/mos/offline MO下线 /api/v1/rule-instances/ 下发
  * @function mowizard.deleteNe
  */
 * deleteNe ({ payload }, { select, call, put }) {
   let params = {}
   let moCriteria = ''
   let issueParams = { oper: 11 }
   params.uuids = payload.uuids
   //先进行标准化端的操作   这一步只是修改了设备的状态
   if (payload.save === 'save') {
    //const data = yield call(postNesOffline, params)
    /**
     * @description call postMosOffline MO下线
     */
    const data = yield call(postMosOffline, params)
    if (data.success){
      message.success('设备下线状态修改成功！')
      yield put({ type: 'queryMOs',payload: {q: payload.q}})
    }else {
      message.error(data.msg)
      throw data
    }
   }
   if (payload.save === 'issue') {//如果下线属性修改成功   再执行设备的下线下发
     //下线设备也需要实现下发  才能真正意义上的下线设备
     if(params.uuids.length === 1){//如果只有一个设备需要下线  直接拼接
       moCriteria = 'uuid == ' + params.uuids[0]
     }else{//如果是批量的下线   组装字符串
       params.uuids.forEach((item, index) => {
         moCriteria = moCriteria + ( index === 0 ? '' : ' or ' ) + 'uuid == ' + item
       })
     }
     issueParams.moCriteria = moCriteria//添加下发的条件
     /**
      * @description call ruleInstanceIssue 下发
      */
     const issue = yield call (ruleInstanceIssue, issueParams)
     if(issue.success){
      //  message.success('设备下线并下发！')
      Modal.success({
        title: '成功',
        content: '设备下线并下发完成！',
        okText: '确认',
      });
       yield put({ type: 'queryMOs',payload: {q: payload.q}})
     }else{
      //  message.error('设备下线失败！请重新下线',10)
       Modal.error({
        title: '失败',
        content: '设备下线失败！请重新下线',
        okText: '确认',
      });
     }
   }
   /*
   //先进行标准化端的操作   这一步只是修改了设备的状态
   const data = yield call(postNesOffline, params)
   if (data.success && payload.save === 'issue') {//如果下线属性修改成功   再执行设备的下线下发
     //下线设备也需要实现下发  才能真正意义上的下线设备
     if(params.uuids.length === 1){//如果只有一个设备需要下线  直接拼接
       moCriteria = 'uuid == ' + params.uuids[0]
     }else{//如果是批量的下线   组装字符串
       params.uuids.forEach((item, index) => {
         moCriteria = moCriteria + ( index === 0 ? '' : ' or ' ) + 'uuid == ' + item
       })
     }
     issueParams.moCriteria = moCriteria//添加下发的条件
     const issue = yield call (ruleInstanceIssue, issueParams)
     if(issue.success){
       message.success('设备下线并下发！')
       yield put({ type: 'queryMOs',payload: {q: payload.q}})
     }else{
       message.error('设备下线失败！')
     }
   } if (data.success && payload.save === 'save'){
     message.success('设备下线状态修改成功！')
     yield put({ type: 'queryMOs',payload: {q: payload.q}})
   }else {
     message.error(data.msg)
     throw data
   }*/
},

 /**
  * 获取线路资源
  * 与后台交互 调用接口 /api/v1/mos/ 获取数据
  * @function mowizard.findLineById
  */
* findLineById ({ payload }, { call, put }) {
  const data = yield call(findById, payload.currentItem)
  if (data.success) {
    yield put({
      type: 'setState',
      payload: {
        //_mngInfoSrc: data.mngInfoSrc,
        //zabbixUrl: data.createdByTool,
        lineItem: data,
        lineWizardVisible: true,
        currentStep: 1,
      },
    })
  } else {
    message.error(data.msg)
  }
},

 /**
  * 线路变更
  * 与后台交互 调用接口 /api/v1/lines/ 获取线路资源列表 ,/api/v1/rule-instances/ 下发 
  * @function mowizard.updateLine
  */
* updateLine ({ payload }, { select, call, put }) {
  //console.dir(payload)
  let data = {}
  data = yield call(updatelines, payload.currentItem)

  if (data.success) {
    // message.success('设备修改成功！')
    if(payload.types === 'save'){//点击保存按钮
      //调用保存接口
      // const save = yield call ( savePreview, payload.dataList )
      // if(save.success){
      //   // message.success('未做策略变更,保存线路信息成功！')
      //   Modal.success({
      //     title: 'MO保存成功！',
      //     content: '未做策略变更,保存线路信息成功！',
      //     okText: '确认',
      //   });
      // }else{
      //   // message.warning('保存预览实例失败！')
      //   Modal.error({
      //     title: 'MO保存失败！',
      //     content: '未做策略变更,保存线路信息失败！',
      //     okText: '确认',
      //   });
      // }
      Modal.success({
        title: 'MO保存成功！',
        content: '未做策略变更,保存线路信息成功！',
        okText: '确认',
      });
    }else if(payload.types === 'issue'){//点击下发按钮
      //调用下发接口
      const issue = yield call ( issuePreview, payload.dataList )
      if(issue.success){
        // message.success('线路下发完成！')
        Modal.success({
          title: '策略变更成功',
          content: '线路下发完成！',
          okText: '确认',
        });
      }else{
        // message.warning('线路下发失败！请重新下发',10)
        Modal.error({
          title: '策略变更失败',
          content: '线路下发失败！请重新下发',
          okText: '确认',
        });
      }
    }
    let qs = `firstClass=='NETWORK' and (secondClass=='HA_LINE')  and (uuid=='${payload.currentItem.uuid}')`
    yield put({ type: 'queryLines',payload: {q: payload.q} })
  } else {
    // message.error('设备修改失败！',10)
      Modal.error({
        title: 'MO保存失败！',
        content: '未做策略变更,保存线路信息失败！',
        okText: '确认',cmd
      });
    throw data
  }

},

    /**
     * 保存预览实例
     * 与后台交互,调用接口 /api/v1/nes/neAndIntfs 新增设备和设备下的接口 , /api/v1/rule-instances/ 下发
     * @function mowizard.savePreview
     */
    *savePreview({ payload }, { select,call, put }){
      const saveMo = yield call ( postNewNeAndIfs, payload.mo )
      if(saveMo.success){
        Modal.success({
          title: 'MO保存成功！',
          content: '未做策略变更,保存设备信息成功！',
          okText: '确认',
        });
        // const data = yield call ( savePreview, payload.preIssueJobInfo)
        // if(data.success){
        //   const isMon = yield select(({ mowizard }) => mowizard.isMon)
        //   const record = yield select(({ mowizard }) => mowizard.infoBody)
        //   const state = yield select(({ mowizard }) => mowizard.state)
        //   if (isMon) {
        //     const uuid = record.uuid
        //     const newTool = {record, state, uuid}
        //     yield call(changeInfo, newTool)
        //     const qu = {
        //       status:"redirect",
        //       branch:record.branch
        //     }
        //     yield put(routerRedux.push({
        //       pathname: window.location.pathname,
        //       qu:qu
        //     }))

        //   }
        //   // message.success('实例保存成功！')
        //   Modal.success({
        //     title: 'MO保存成功！',
        //     content: '未做策略变更,保存设备信息成功！',
        //     okText: '确认',
        //   });
        // }else{
        //   // message.warning('实例保存错误！')
        //   Modal.error({
        //     title: 'MO保存失败',
        //     content: '未做策略变更,保存设备信息失败！',
        //     okText: '确认',
        //   });
        // }
      }else{
        // message.warning('保存预览实例阶段，保存监控实例失败！')
        Modal.error({
          title: 'MO保存失败',
          content: '未做策略变更,保存设备信息失败！',
          okText: '确认',
        });
      }
    },
    /**
     * 基于预览数据下发
     * 与后台交互 调用接口 /api/v1/nes/neAndIntfs 新增设备和设备下的接口 ,/api/v1/rule-instances/ 下发
     * @function mowizard.issuePreview
     */
    *issuePreview({ payload }, { call, put }){
		  const saveMo = yield call ( postNewNeAndIfs, payload.mo )
      if(saveMo.success){
        const data = yield call ( issuePreview, payload.preIssueJobInfo )
        if(data.success){
          // message.success('下发完成！')
          Modal.success({
            title: '策略变更成功',
            content: '下发完成！',
            okText: '确认',
          });
        }else{
          // message.warning('下发失败！请重新下发',10)
          Modal.error({
            title: '策略变更失败',
            content: '下发失败！请重新下发',
            okText: '确认',
          });
        }
      }else{
        message.warning('下发阶段保存监控对象失败！')
      }
    },

    /**
     * 获取资源
     * 与后台交互,调用接口 /api/v1/branch-ips/ 获取网点IP
     * @function mowizard.queryBrIPs
     */
    * queryBrIPs ({ payload }, { call, put }) {
      let params = {...payload}
      let qs = 'firstClass==\'NETWORK\';secondClass==\'BRANCH_IP\''
      if (params.q === undefined || params.q === '' ) {
        params.q = qs
      } else {
        params.q += ';' + qs
      }
      /**
       * @description call querybranchips
       */
      const data = yield call(querybranchips, params)
      if (data.success) {
        yield put({
          type: 'queryBrIPSuccess',
          payload: {
            listBrIP: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: payload.q,
          },
        })
      }
    },

       /**
     * 实例保存
     * 与后台交互,调用接口 /api/v1/branch-ips/ 获取网点IP
     * @function mowizard.saveBrIP
     */
	  * saveBrIP ({ payload }, { select, call, put }) {
      let currentItem = payload.currentItem
      let data = {}
      if (payload.actionType === 'create') {
        currentItem.firstClass = 'NETWORK'
        currentItem.secondClass = 'BRANCH_IP'				//@@@
        currentItem.keyword = payload.currentItem.discoveryIP
        data = yield call(createbranchips, currentItem)				//@@@
      } else if (payload.actionType === 'update') {
        data = yield call(updatebranchips, currentItem)				//@@@
      }

	    if (data && (data.success)) {
        message.success('IP保存成功！')
        if ((payload.policyList) && payload.policyList.length >0) {
          const saveP = yield call ( savePreview, payload.dataList )
          if(saveP.success){
            // message.success('实例保存成功！')
            Modal.success({
              title: 'MO保存成功！',
              content: '未做策略变更,保存网点ip信息成功！',
              okText: '确认',
            });
            yield put({ type: 'queryBrIPs', payload : { q:payload.q} })
          }else{
            // message.warning('实例保存错误！')
            Modal.error({
              title: 'MO保存失败',
              content: '未做策略变更,保存网点ip信息失败！',
              okText: '确认',
            });
          }
        } else {
          message.warning('该设备未匹配到增量实例！')
        }

		  } else {
		  	message.error('IP保存失败!')

		    throw data
		  }
    },
    
    /**
     * 下发实例
     * 与后台交互,调用接口 /api/v1/branch-ips/ 获取网点IP
     * @function mowizard.issueBrIP
     */
    *issueBrIP({ payload }, { call, put }){
      let currentItem = payload.currentItem
      let data = {}
      if (payload.actionType === 'create') {
        currentItem.firstClass = 'NETWORK'
        currentItem.secondClass = 'BRANCH_IP'				//@@@
        currentItem.keyword = payload.currentItem.discoveryIP

        data = yield call(createbranchips, currentItem)				//@@@
      } else if (payload.actionType === 'update') {
        data = yield call(updatebranchips, currentItem)				//@@@
      }

	    if (data && (data.success)) {
        message.success('IP保存成功！')
        if ((payload.policyList) && payload.policyList.length >0) {
          const issueP = yield call ( issuePreview, payload.dataList )
          if(issueP.success){
            // message.success('下发完成！')
            Modal.success({
              title: '策略变更成功',
              content: '下发完成！',
              okText: '确认',
            });
            yield put({ type: 'queryBrIPs', payload : { q:payload.q} })
          }else{
            Modal.error({
              title: '策略变更失败',
              content: '下发失败！请重新下发',
              okText: '确认',
            });
            // message.warning('下发失败！请重新下发',10)
          }
        }else{
          message.warning('该设备未匹配到增量实例！')
        }
      }
    },

      /**
     * 下发预览
     * 与后台交互,调用接口 api/v1/monitor-rules/wizardPreview/branchIp 网点IP基于向导的下发预览/
     * @function mowizard.issueBrIP
     */
    * queryBrIPPreview({ payload }, { call, put }) {
      let currentItem = payload.currentItem

	  	currentItem.firstClass = 'NETWORK'
	  	currentItem.secondClass = 'BRANCH_IP'				//@@@
	  	currentItem.keyword = payload.currentItem.discoveryIP

     const data = yield call(postBrIPWizardPreview, currentItem)
      if (data.success) {
        let dataList = {
          branchIP:data.branchIP,
          preIssueResult:data.preIssueResult,
          changeType:data.changeType,
          moType:data.moType,
          moIp:data.moIp,
          moName:data.moName,
          branch:data.branch

        }
        /*yield put({
          type: 'setState',
          payload: {
			policyAllList: data.all,
			policyExistList: data.existing,
			policyList: data.incremental,
            errorList: data.problem,
            bripCurrentStep:1,
            loadingEffect: false,
          },
        })*/
        yield put({
          type: 'setPreviewLists',
          payload: data,
        })
        yield put({
          type: 'setState',
          payload: {
            dataList:dataList,
            bripCurrentStep:1,
            loadingEffect: false,
          },
        })
      } else {
        message.error(data.msg)

        yield put({
          type: 'setState',
          payload: {
            bripCurrentStep:0,
            loadingEffect: false,
          }
        })
      }
    },

    /**
     * 获取网点IP数据
     * 与后台交互,调用接口  /api/v1/mos/ 获取数据
     * @function mowizard.findIPById
     */
    * findIPById ({ payload }, { call, put }) {
      const data = yield call(findById, payload.currentItem)
      //console.dir(data)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            bripItem: data,
            bripWizardVisible: true,
            modalType:payload.modalType,
            bripCurrentStep: 0,
          },
        })
      } else {
        message.error(data.msg)
      }
    },

    /**
     * 判断是否可以进行下发
     * 与后台交互,调用接口  /api/v1/issue-action-config/ 下发禁用接口
     * @function mowizard.issueJudge
     */
    *issueJudge({ payload }, { call, put }){
      const issueJudge = yield call (queryState,payload)      //判断是否可以下发
      if(issueJudge.success){
          yield put ({
            type:'setState',
            payload:{
              onIssueForbid:issueJudge.content[0].disable
            }
          })
      }
    },
    *setPreviewLists({payload},{put}){

      let dataAll = payload.preIssueResult.all
      let dataExisting = payload.preIssueResult.existing
      let dataIncremental = payload.preIssueResult.incremental
      let dataProblem = payload.preIssueResult.problem

      if ((dataAll)&&(dataAll.length>0)) {
        var i=0
        dataAll.forEach(item => {
          item.id = ++i
        })
      }
      if ((dataExisting)&&(dataExisting.length>0)) {
        var i=0
        dataExisting.forEach(item => {
          item.id = ++i
        })
      }
      if ((dataIncremental)&&(dataIncremental.length>0)) {
        var i=0
        dataIncremental.forEach(item => {
          item.id = ++i
        })
      }
      if ((dataProblem)&&(dataProblem.length>0)) {
        var i=0
        dataProblem.forEach(item => {
          item.id = ++i
        })
      }
      yield put({
        type: 'setState',
        payload: {
          policyAllList: dataAll,
          policyExistList: dataExisting,
          policyList: dataIncremental,
          errorList: dataProblem,
        },
      })
    },

    /**
     * 下线下发
     * 与后台交互,调用接口  /api/v1/rule-instances/issue-offline 
     * @function mowizard.issueOffline
     */
    *issueOffline({ payload }, { call, put }) {
      let params = {}
      params.uuids = payload.uuids
      const data = yield call(postMosIssueOffline, params)
       if (data.success){
        //  message.success('设备下线下发成功！')
         Modal.success({
          title: '成功',
          content: '设备下线下发成功！',
          okText: '确认',
        });
         yield put({ type: payload.next,payload: {q: payload.q}})
       }else {
        //  message.error(data.msg)
         Modal.error({
          title: '失败',
          content: data.msg,
          okText: '确认',
        });
         throw data
       }
   },

   * batchSync({ payload }, { call, put }) {
   let successList = []
   let failureList = []
   //payload接收一个uuid数组，请求一个oneMoSync接口，返回给我一个mo数组
   const data = yield call(oneMoSync, payload)
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
       type: 'setState',
       payload: ({
         batchSyncState: false,
         batchsyncSuccessList: successList,
         batchsyncFailureList: failureList,
       }),
     })
   } else if (!data.success) {
     //message.error('未返回同步信息!')
     Modal.warning({
       title: '未返回同步信息!',
       content: '可能由于网络原因,批量同步失败!建议减少同步设备数量或稍后再试!',
       okText: '好的',
     })
     yield put({
       type: 'setState',
       payload: ({
         batchSyncModalVisible: false,
       }),
     })
   }
 },

},

  reducers: {
  	//浏览列表
  	querySuccess (state, action) {
      const {
 list, pagination, detail, q,
} = action.payload
      return {
 ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
        detail,
}
    },
    queryLineSuccess (state, action) {
      const {
        listLine, pagination, detail, q,
      } = action.payload
      return {
        ...state,
        listLine,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
        detail,
}
    },
    queryBrIPSuccess (state, action) {
      const {
        listBrIP, pagination, detail, q,
      } = action.payload
      return {
        ...state,
        listBrIP,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        q,
      }
    },
	  setState (state, action) {
      //console.log("in set state")
      //console.dir(action)
      //console.dir(state)
      //console.log("========")
      return { ...state, ...action.payload }
    },
  },

}
