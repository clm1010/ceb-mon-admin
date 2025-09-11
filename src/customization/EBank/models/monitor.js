import { nesquery } from '../../../services/nes'
export default {

  namespace: 'monitor',

  state: {
		treeDatas: [],
		selectTreeNode: [], //选中的节点
		selectKeys: [], //选中的节点key值
    keys: '1',
    children: [],
    treeData : [
      {
        title: '核心交换域光传输区',
        key: '0',
        isLeaf: false,
        children: []
      },
      {
        title: '互联网服务域邮件接入区',
        key: '1',
        isLeaf: false,
        children: []
      },
      {
        title: '数据域大数据区',
        key: '2',
        isLeaf: false,
        children: []
      },
      {
        title: '核心交换域核心交换区',
        key: '3',
        isLeaf: false,
        children: []
      },
      {
        title: '生产服务域生产A区',
        key: '4',
        isLeaf: false,
        children: []
      },
      {
        title: '互联网服务域公众服务区',
        key: '5',
        isLeaf: false,
        children: []
      },
      {
        title: '互联网服务域外联区',
        key: '6',
        isLeaf: false,
        children: []
      },
      {
        title: '办公服务域城域网接入区',
        key: '7',
        isLeaf: false,
        children: []
      },
      {
        title: '骨干网络域',
        key: '8',
        isLeaf: false,
        children: []
      },
      {
        title: '开发测试域',
        key: '9',
        isLeaf: false,
        children: []
      },
      {
        title: '第三方服务域',
        key: '10',
        isLeaf: false,
        children: []
      },
      {
        title: 'IT管理域',
        key: '11',
        isLeaf: false,
        children: []
      },
      {
        title: '分行云服务域',
        key: '12',
        isLeaf: false,
        children: []
      },
      {
        title: '办公服务域',
        key: '13',
        isLeaf: false,
        children: []
      },
      {
        title: '生产服务域生产B区',
        key: '14',
        isLeaf: false,
        children: []
      },
      {
        title: '网银武汉异地接入区',
        key: '15',
        isLeaf: false,
        children: []
      },
      {
        title: '信用卡中心网络',
        key: '16',
        isLeaf: false,
        children: []
      },
      {
        title: '海外分行域',
        key: '17',
        isLeaf: false,
        children: []
      },
      {
        title: '武汉灾备中心',
        key: '18',
        isLeaf: false,
        children: []
      },
      {
        title: '互联网服务域办公DMZ区',
        key: '19',
        isLeaf: false,
        children: []
      },
      {
        title: '武汉客户满意中心',
        key: '20',
        isLeaf: false,
        children: []
      },
      {
        title: 'NetScout设备',
        key: '21',
        isLeaf: false,
        children: []
      },
      {
        title: '投产准备域',
        key: '22',
        isLeaf: false,
        children: []
      },
      {
        title: 'VPN',
        key: '23',
        isLeaf: false,
        children: []
      },
      {
        title: 'honeypot',
        key: '24',
        isLeaf: false,
        children: []
      },
      {
        title: 'netflow',
        key: '25',
        isLeaf: false,
        children: []
      },
      {
        title: '总行云服务域',
        key: '26',
        isLeaf: false,
        children: []
      },
      {
        title: 'kelai',
        key: '27',
        isLeaf: false,
        children: []
      },
      {
        title: '集团接入区',
        key: '28',
        isLeaf: false,
        children: []
      },
      {
        title: '天津后台中心',
        key: '29',
        isLeaf: false,
        children: []
      }
    ]
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
		* query ({ payload }, { call, put, select }) { //查询数据
      let newDate = {}
      let children = []
      newDate.q = `firstSecArea==${payload.locations}`
      newDate.pageSize = 1000
      const data = yield call(nesquery, newDate)  //与后台交互，获取数据
      const treeData = yield select(({ monitor }) => monitor.treeData)
      if (data.success) {
        children = data.content.map((item, index)=>{
          let treeChild = {}
          treeChild.title = item.mo.alias//名称
          treeChild.key = item.mo.uuid//key
          treeChild.onlineStatus = item.mo.onlineStatus//在线状态
          treeChild.discoveryIP = item.mo.discoveryIP//管理IP
          treeChild.vendor = item.mo.vendor//厂商
          treeChild.managedStatus = item.mo.managedStatus//纳管状态
          treeChild.secondClass = item.mo.secondClass//设备类型
          treeChild.isLeaf = true//为子节点
          return treeChild
        })
        treeData[payload.index].children = children
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
