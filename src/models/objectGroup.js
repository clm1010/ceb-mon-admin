import { query } from '../services/objectGroup'

export default {

  namespace: 'objectGroup',

  state: {
		treeDatas: [],
		selectTreeNode: [], //选中的节点
		selectKeys: [], //选中的节点key值
		treeMap: new Map(), //类型map
		defaultExpandAll: true,
		autoExpandParent: true,
		defaultExpandedKeys: [],
		firstClass: '',
		secondClass: '',
		thirdClass: '',
		selectuuid: '',
		isClosed: false,
  },

  subscriptions: {
		setup ({ dispatch, history, put }) {
      history.listen((location) => {
        if (location.pathname === '/router' ||
        location.pathname === '/switcher' ||
        location.pathname === '/firewall' ||
        location.pathname === '/interfacer' ||
        location.pathname === '/f5' ||
        location.pathname === '/line' ||
        location.pathname === '/branchIp' ||
        location.pathname === '/server' ||
        location.pathname === '/application' ||
        location.pathname === '/database' ||
        location.pathname === '/middleware' ||
        location.pathname === '/os'
        ) {
		  		let params = location.query
          dispatch({
            type: 'query',
            payload: params,
          })
        }
      })
    },
  },

  effects: {
		* query ({ payload }, { select, call, put }) { //查询数据
	  const data = yield call(query, payload) //与后台交互，获取数据
      if (data.success) {
		let myMap = new Map()
		let firstClass = yield select(({ objectGroup }) => objectGroup.firstClass)
		let secondClass = yield select(({ objectGroup }) => objectGroup.secondClass)
		let selectuuid = yield select(({ objectGroup }) => objectGroup.selectuuid)
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

        yield put({
          type: 'querySuccess',
          payload: {
            treeDatas: data.children,
			treeMap: myMap,
			firstClass,
			secondClass,
			selectuuid,
          },
        })
      }
    },

  },

  reducers: {
  	//浏览列表
		querySuccess (state, action) {
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

	  controllerModal (state, action) {
		  return { ...state, ...action.payload }
	  },

  },
}
