import { query } from '../../../services/alarms'
import { queryTool, queryTools, creates, remove, tooledit, findById } from '../../../services/oelToolset'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
export default {

	namespace: 'oelToolset',

  	state: {
  		list: [],										//定义了当前页表格数据集合
    		currentItem: {},									//被选中的单个行对象
    		pagination: {									//分页对象
      		showSizeChanger: true,						//是否可以改变 pageSize
      		showQuickJumper: true, //是否可以快速跳转至某页
      		showTotal: total => `共 ${total} 条`,		//用于显示数据总量
      		current: 1,									//当前页数
      		total: null,									//数据总数？
      		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    		},
	   	//工具配置---------------start
	   	toolsetVisible: false,
		  copytoolVisible: false,
	   	tooleditVisible: false,
	   	toolList: [],
	   	tooleditItem: [],
	   	tooledVisible: false,
	   	//工具配置---------------end
      eventName: '',
      eventType: '',
      eventContent: '',

  	},

  	subscriptions: {
  	},

  	effects: {

		* query ({ payload }, { select, call, put }) {
			const data = yield call(query, payload)
      		if (data) {
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

    	//工具配置--------start
      * queryTool ({ payload }, { select, call, put }) {
        /*
          查询条件
        */
        const eventName = yield select(({ oelToolset }) => oelToolset.eventName)
        const eventType = yield select(({ oelToolset }) => oelToolset.eventType)
        const eventContent = yield select(({ oelToolset }) => oelToolset.eventContent)
        let q = ''
        if (eventName && eventName !== '') {
          q += `name=='*${eventName}*';`
        }
        if (eventType && eventType !== '') {
          let tempval = 'SQL'
          q += `toolType==${tempval};`
        }
        if (eventContent && eventContent !== '') {
          q += `contents=='*${eventContent}*';`
        }
        if (q.endsWith(';')) {
            q = q.substring(0, q.length - 1)
        }
        if (q && q !== '') {
            payload.q = q
        }
        const data = yield call(queryTool, payload)
      	if (data) {
        	yield put({
          	type: 'updateState',
          	payload: {
            	toolList: data.content,
            	toolsetVisible: true,
            	pagination: {
              	current: data.page.number + 1 || 1,
              		pageSize: data.page.pageSize || 10,
              		total: data.page.totalElements,
            	},
          	},
        	})
      	}
    	},
    	//工具配置--------end

      //工具查询--------start
      * queryTools ({ payload }, { select, call, put }) {
        const data = yield call(queryTool, payload)
        if (data) {
          yield put({
            type: 'updateState',
            payload: {
              toolList: data.content,
              toolsetVisible: true,
              pagination: {
                current: data.page.number + 1 || 1,
                  pageSize: data.page.pageSize || 10,
                  total: data.page.totalElements,
              },
            },
          })
        }
      },
      //工具查询--------end
    		//工具配置-新建功能 start
    		* creates ({ payload }, { call, put }) {
      		const data = yield call(creates, payload)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
								toolsetVisible: true,
							},
	      		})
        		yield put({ type: 'queryTools' })

        		//添加工具时触发oel查询，使得oel重新获取工具右键菜单 added by Fox
						yield put({
					  	type: 'oel/query',
					  	payload: {},
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
    		//end

    		//工具配置-删除功能 start
    		* delete ({ payload }, { call, put }) {
      		const data = yield call(remove, payload)
      		let newdata = { ...payload }
      		if (data.success) {
        		yield put({ type: 'queryTools' })

        			//添加工具时触发oel查询，使得oel重新获取工具右键菜单 added by Fox
						yield put({
					  	type: 'oel/query',
					  	payload: {},
					  })
      		} else {
        			throw data
      		}
    		},
    		//end

    		//工具配置-克隆功能 start
    		* copys ({ payload }, { call, put }) {
    			const data = yield call(copy, payload)
      		if (data.success) {
        			yield put({ type: 'queryTools' })
      		} else {
        			throw data
      		}
	    },
    		//end

    		//工具配置-编辑功能 start
    		* tooledit ({ payload }, { select, call, put }) {
			const uuid = yield select(({ oelToolset }) => oelToolset.currentItem.uuid)
      		const newTool = { ...payload, uuid }
      		const data = yield call(tooledit, newTool)
      		if (data.success) {
      			yield put({
	      			type: 'updateState',
	      			payload: {
							tooledVisible: false,
					},
	      		})
        			yield put({ type: 'queryTools' })

        		//添加工具时触发oel查询，使得oel重新获取工具右键菜单 added by Fox
						yield put({
					  	type: 'oel/query',
					  	payload: {},
					  })
      		} else {
        			throw data
      		}
    		},

    		//end
    		//开始通过uuid来获取单个工具的信息
    		* findById ({ payload }, { call, put }) {
    			const data = yield call(findById, payload)
    			yield put({
    				type: 'updateState',
    				payload: {
						currentItem: data,
						tooledVisible: true,
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
    		showModal (state, action) {
      		return { ...state, ...action.payload }
    		},
    		hideModal (state, action) {
	      	return { ...state, ...action.payload }
	    },
  	},

}
