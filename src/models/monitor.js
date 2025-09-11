import { nesquery } from '../services/nes'
import { genDictArrToTree } from '../utils/FunctionTool'
export default {

  namespace: 'monitor',

  state: {
		treeDatas: [],
		selectTreeNode: [], //选中的节点
		selectKeys: [], //选中的节点key值
    keys: '1',
    children: [],
    treeData : genDictArrToTree('netdomin-appname'),
  },

  subscriptions: {
		setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitor' || location.pathname.includes('/monitor/')) {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }else if(location.pathname === '/monitorZH'){
          if(location.search !== ''){
            dispatch({
              type: 'controllerModal',
              payload: {
                keys: '4'
              },
            })
          }else{
          	dispatch({
              type: 'controllerModal',
              payload: {
                keys: '1'
              },
            })
          }
        }
      })
    },
  },

  effects: {
		* query ({ payload,callback }, { call, put, select }) { //查询数据
      let newDate = {}
      let children = []
      newDate.q = `appName==${payload.locations};(secondClass==F5 or secondClass==SWITCH or secondClass==FIREWALL or secondClass==ROUTER)`
      newDate.pageSize = 1000
      const data = yield call(nesquery, newDate)  //与后台交互，获取数据
      const treeData = yield select(({ monitor }) => monitor.treeData)
      if (data.success) {
        children = data.content.map((item, index)=>{
          let treeChild = {}
          treeChild.title = item.mo.hostname//名称
          treeChild.key = item.mo.uuid//key
          treeChild.onlineStatus = item.mo.onlineStatus//在线状态
          treeChild.discoveryIP = item.mo.discoveryIP//管理IP
          treeChild.vendor = item.mo.vendor//厂商
          treeChild.managedStatus = item.mo.managedStatus//纳管状态
          treeChild.secondClass = item.mo.secondClass//设备类型
          treeChild.isLeaf = true//为子节点
          treeChild.branchName = item.mo.branchName//所属行
          return treeChild
        })
        // treeData[payload.index].children = children
        treeData.map((item)=>{
          if(item.key == payload.netDomainIndex){
            item.children.map((it)=>{
              if(it.key == payload.appNameIndex){
                it.children = children
              }
            })
            return
          }
        }
      )
      if (callback && typeof callback === 'function') {
        callback(data.success); // 返回结果
      }
        yield put({
          type: 'controllerModal',
          payload: {
            treeData: treeData
          },
        })
      }
    },
  },

  reducers: {
  	//浏览列表
		querySuccess (state, action) {
			const { treeDatas } = action.payload
			return { //修改
				...state,
				treeDatas,
			}
	  },

	  controllerModal (state, action) {
		  return { ...state, ...action.payload }
	  },

  },
}
