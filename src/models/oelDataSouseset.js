
import { queryOsts, queryAllosts, creates, remove, update, query, findById } from '../services/osts'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
export default {

  namespace: 'oelDataSouseset',

  state: {
		list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的单个行对象
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					//用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
   //数据源配置---------------start
   dataSousesetVisible: false,
   copydataSouseVisible: false,
   dataSouseeditVisible: false,
   dataSouseList: [],
   //显示层
   displayObsSrvsList: [
   {
   	index: 1,
   	name: '',
   	serverIP: '',
   	serverPort: '',
   	username: '',
   	password: '',
   },
   ],
   currentItemdata: {},
   datatype: 'creates',
   	//展示使用
	showdataSouseList: [],														//被选中的单个行对象
   //数据源配置---------------end
   dataName: '',
   dataIP: '',
   dataOs: '',
  },

  subscriptions: {

  setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/config/oel')) {
          dispatch({
            type: 'showquery',
			payload: {
			   current: 0,
				page: 0,
				pageSize: 10000,
		   },
          })
        }
      })
    },

  },


  effects: {
  * showquery ({ payload }, { select, call, put }) {
		let mypayload = {}
		mypayload.current = 0
		mypayload.page = 0
		mypayload.pageSize = 10000
		const data = yield call(query, mypayload)
		if (data.success) {
			let mydata = data.content
			yield put({
				type: 'updateState',
				payload: {
					showdataSouseList: mydata,
				},
			})
		} else {
			throw data
		}
	},
      //数据源配置--------start
   * queryOsts ({ payload }, { select, call, put }) {
        /*
          查询条件
        */
        const dataName = yield select(({ oelDataSouseset }) => oelDataSouseset.dataName)
        const dataIP = yield select(({ oelDataSouseset }) => oelDataSouseset.dataIP)
        const dataOs = yield select(({ oelDataSouseset }) => oelDataSouseset.dataOs)
        let q = ''
        if (dataName && dataName !== '') {
          q += `name=='*${dataName}*';`
        }
        if (dataIP && dataIP !== '') {
          q += `primeObjSrv.serverIP=='*${dataIP}*';`
        }
        if (dataOs && dataOs !== '') {
          q += `primeObjSrv.name=='*${dataOs}*';`
        }
        if (q.endsWith(';')) {
            q = q.substring(0, q.length - 1)
        }
        if (q && q !== '') {
            payload.q = q
        }
        const data = yield call(query, payload)

        let dataSouseList1 = []
	     if (data.content) {
	     	let ii = 1
    	   data.content.forEach((item) => {
    	   	 let children0 = []
    	   	 let children1 = []

     	     if (item.primeObjSrv) {
      	 	   let primeObjSrv = {
      	       OSname: `${item.primeObjSrv.name}(主)`,
      	  	   serverIP: item.primeObjSrv.serverIP,
      	  	   serverPort: item.primeObjSrv.serverPort,
      	  	   username: item.primeObjSrv.username,
      	  	   password: item.primeObjSrv.password,
      	  	   uuid: item.primeObjSrv.uuid,
      	  	   old: item,
      	     }
      	     children0.push(primeObjSrv)
      	   }
      	   if (item.backupObjSrv) {
      	 	   let backupObjSrv = {
      	       OSname: `${item.backupObjSrv.name}(备)`,
      	  	   serverIP: item.backupObjSrv.serverIP,
      	  	   serverPort: item.backupObjSrv.serverPort,
      	  	   username: item.backupObjSrv.username,
      	  	   password: item.backupObjSrv.password,
      	  	   uuid: item.backupObjSrv.uuid,
      	  	   old: item,
      	     }
      	     children0.push(backupObjSrv)
      	   }
         if (item.displayObsSrvs && item.displayObsSrvs.length > 0) {
      	  	 item.displayObsSrvs.forEach((item1) => {
      	  	   let displayObsSrvs = {
      	         OSname: item1.name,
      	  	     serverIP: item1.serverIP,
      	  	     serverPort: item1.serverPort,
      	  	     username: item1.username,
      	  	     password: item1.password,
      	  	     uuid: item1.uuid,
      	  	     old: item,
      	     }
      	     children1.push(displayObsSrvs)
      	  	  })
             let jSrv = {
      	       name: '显示层',
      	  	   uuid: ii,
      	  	   old: item,
      	  	   children: children1,
      	    }
      	     children0.push(jSrv)
      	   }
    		   let data1 = {
    		   	 flag: true, //根对象标志位
    			   name: item.name,
    			   uuid: item.uuid,
    			   children: children0,
    			   old: item,
    		   }
    		   dataSouseList1.push(data1)
    		   ii++
    	   })
       }
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            		dataSouseList: dataSouseList1,
                dataSousesetVisible: true,
          },
        })
      }
    	},
    * queryAllosts ({ payload }, { select, call, put }) {
			const data = yield call(queryAllosts, payload)

			 let dataSouseList1 = []
	     if (data.content) {
	     	let ii = 1
    	   data.content.forEach((item) => {
    	   	 let children0 = []
    	   	 let children1 = []

     	     if (item.primeObjSrv) {
      	 	   let primeObjSrv = {
      	       OSname: `${item.primeObjSrv.name}(主)`,
      	  	   serverIP: item.primeObjSrv.serverIP,
      	  	   serverPort: item.primeObjSrv.serverPort,
      	  	   username: item.primeObjSrv.username,
      	  	   password: item.primeObjSrv.password,
      	  	   uuid: item.primeObjSrv.uuid,
      	  	   old: item,
      	     }
      	     children0.push(primeObjSrv)
      	   }
      	   if (item.backupObjSrv) {
      	 	   let backupObjSrv = {
      	       OSname: `${item.backupObjSrv.name}(备)`,
      	  	   serverIP: item.backupObjSrv.serverIP,
      	  	   serverPort: item.backupObjSrv.serverPort,
      	  	   username: item.backupObjSrv.username,
      	  	   password: item.backupObjSrv.password,
      	  	   uuid: item.backupObjSrv.uuid,
      	  	   old: item,
      	     }
      	     children0.push(backupObjSrv)
      	   }
         if (item.displayObsSrvs && item.displayObsSrvs.length > 0) {
      	  	 item.displayObsSrvs.forEach((item1) => {
      	  	   let displayObsSrvs = {
      	         OSname: item1.name,
      	  	     serverIP: item1.serverIP,
      	  	     serverPort: item1.serverPort,
      	  	     username: item1.username,
      	  	     password: item1.password,
      	  	     uuid: item1.uuid,
      	  	     old: item,
      	     }
      	     children1.push(displayObsSrvs)
      	  	  })
             let jSrv = {
      	       name: '显示层',
      	  	   uuid: ii,
      	  	   old: item,
      	  	   children: children1,
      	    }
      	     children0.push(jSrv)
      	   }
    		   let data1 = {
    		   	 flag: true, //根对象标志位
    			   name: item.name,
    			   uuid: item.uuid,
    			   children: children0,
    			   old: item,
    		   }
    		   dataSouseList1.push(data1)
    		   ii++
    	   })
       }
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            		dataSouseList: dataSouseList1,
                dataSousesetVisible: true,
          },
        })
      }
    },
   * creates ({ payload }, { call, put }) {
      		const data = yield call(creates, payload)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
						   dataSouseeditVisible: false,
					},
	      		})
        			yield put({ type: 'queryAllosts' })
        			yield put({ type: 'showquery' })

        			//添加数据源时触发oel查询，使得oel重新获取数据源的下拉列表 added by Fox
						yield put({
					  	type: 'oel/query',
					  	payload: {
					  		forceGetDatasources: true,
					  	},
					  })
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
    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'queryAllosts' })
        yield put({ type: 'showquery' })

        //删除过滤器时触发oel查询，使得oel重新获取过滤器的下拉列表 added by Fox
				const uuidUsedByOel = yield select(state => state.oel.oelDatasource)
				const uuid = payload[0]

				if (uuidUsedByOel === uuid) { //如果删除的是OEL正在使用的数据源，先清空state里的数据源
					//清掉state里的oelDatasource
	      	yield put({
			  		type: 'oel/querySuccess',
			  		payload: {
			  			oelDatasource: '',
			  		},
			  	})
				}

				yield put({
			  	type: 'oel/query',
			  	payload: {
			  		forceGetDatasources: true,
			  	},
			  })
      } else {
        throw data
      }
    },
   * updates ({ payload }, { select, call, put }) {
      const currentItemdata = yield select(({ oelDataSouseset }) => oelDataSouseset.currentItemdata)
      payload.uuid = currentItemdata.uuid
      if (currentItemdata.backupObjSrv && payload.backupObjSrv) {
      	payload.backupObjSrv.uuid = currentItemdata.backupObjSrv.uuid
      }
      payload.primeObjSrv.uuid = currentItemdata.primeObjSrv.uuid
      const data = yield call(update, payload)
      if (data.success) {
      	yield put({
	      	type: 'hideModal',
	      	payload: {
						dataSouseeditVisible: false,
					},
	      })
        yield put({ type: 'queryAllosts' })
        yield put({ type: 'showquery' })

        //如果编辑的数据源是oel当前使用的数据源，则立即触发重新查一次 added by Fox
				const uuidUsedByOel = yield select(state => state.oel.oelDatasource)

				if (payload.uuid === uuidUsedByOel) {
		  		yield put({
			    	type: 'oel/query',
            payload: {
              forceGetDatasources: true,
            },
			    })
				}
      } else {
        throw data
      }
    },
    //数据源配置--------end
    //开始通过uuid来查询单个数据源的信息
    * findById ({ payload }, { call, put }) {
    	const data = yield call(findById, payload)
    	let newData = []
    	newData.push(data)
    		 let ii = 1
    		 let dataSouseList1 = []
    	   newData.forEach((item) => {
    	   	 let children0 = []
    	   	 let children1 = []

     	     if (item.primeObjSrv) {
      	 	   let primeObjSrv = {
      	       OSname: `${item.primeObjSrv.name}(主)`,
      	  	   serverIP: item.primeObjSrv.serverIP,
      	  	   serverPort: item.primeObjSrv.serverPort,
      	  	   username: item.primeObjSrv.username,
      	  	   password: item.primeObjSrv.password,
      	  	   uuid: item.primeObjSrv.uuid,
      	  	   old: item,
      	     }
      	     children0.push(primeObjSrv)
      	   }
      	   if (item.backupObjSrv) {
      	 	   let backupObjSrv = {
      	       OSname: `${item.backupObjSrv.name}(备)`,
      	  	   serverIP: item.backupObjSrv.serverIP,
      	  	   serverPort: item.backupObjSrv.serverPort,
      	  	   username: item.backupObjSrv.username,
      	  	   password: item.backupObjSrv.password,
      	  	   uuid: item.backupObjSrv.uuid,
      	  	   old: item,
      	     }
      	     children0.push(backupObjSrv)
      	   }
         if (item.displayObsSrvs && item.displayObsSrvs.length > 0) {
      	  	 item.displayObsSrvs.forEach((item1) => {
      	  	   let displayObsSrvs = {
      	         OSname: item1.name,
      	  	     serverIP: item1.serverIP,
      	  	     serverPort: item1.serverPort,
      	  	     username: item1.username,
      	  	     password: item1.password,
      	  	     uuid: item1.uuid,
      	  	     old: item,
      	     }
      	     children1.push(displayObsSrvs)
      	  	  })
             let jSrv = {
      	       name: '显示层',
      	  	   uuid: ii,
      	  	   old: item,
      	  	   children: children1,
      	    }
      	     children0.push(jSrv)
      	   }
    		   let data1 = {
    		   	 flag: true, //根对象标志位
    			   name: item.name,
    			   uuid: item.uuid,
    			   children: children0,
    			   old: item,
    		   }
    		   dataSouseList1.push(data1)
    		   ii++
    	   })
    	let displayObsSrvsList = []
      if (dataSouseList1[0].old.displayObsSrvs !== undefined && dataSouseList1[0].old.displayObsSrvs.length !== 0) {
      		 dataSouseList1[0].old.displayObsSrvs.forEach((item, index) => {
      		 	  let iidenx = index + 1
      		 	  let temp = {
      		 	  	 index: iidenx,
      	  	     name: item.name,
      	  	     serverIP: item.serverIP,
      	  	     serverPort: item.serverPort,
      	  	     username: item.username,
      	  	     password: item.password,
      	      }
      		 	  displayObsSrvsList.push(temp)
      		 })
      } else {
          let temp = {
      		 	  	  index: 1,
				          name: '',
   	              serverIP: '',
   	              serverPort: '',
   	              username: '',
   	              password: '',
      		}
      		displayObsSrvsList.push(temp)
      }
			    yield put({
			    	 type: 'updateState',
			    	 payload: {
				    	 	dataSouseeditVisible: true,
						    datatype: 'updates',
						    currentItemdata: {
							    ...dataSouseList1[0].old,
							    },
					    	displayObsSrvsList,
			    	 },
			    })
		   },
    //end
  },

  reducers: {
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

    updateState (state, action) {
      return { ...state, ...action.payload }
    },
  },

}
