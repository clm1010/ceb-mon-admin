import { removeInvalidInfo,query, create, remove, update, check, getTaskById,queryDiscoveryInfo,queryOnInfo,queryInInfo,queryTask,changeInvalidInfo,changeInfo,queryTaskList } from '../services/discovery'
import { queryInfo } from '../services/objectMO'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {
  namespace: 'discovery',

  state: {
    list: [], //定义了当前页表格数据集合
    currentItem: {},											 //被选中的单个行对象
    modalVisible: false, //弹出窗口是否可见
    onInfoVisible: false, //弹出窗口是否可见
    inInfoVisible: false, //弹出窗口是否可见
    noInfoVisible: false, //弹出窗口是否可见
    modalType: 'create', //弹出窗口的类型
    pagination: { //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: null,									 //数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    checkStatus: 'done',
    isClose: false,
    batchDelete: false,
    choosedRows: [],
    filterSchema: [],			//查询配置文件，自动加载生成查询界面
    taskIds: '', //策略模板的UUID 用来获取关联的对象
    infoNum: 0,
    onInfoNum: 0,
    inInfoNum: 0,
    branch: '',
    infoList: [], //关联的对象对象
    taskList: [],
    taskVisible: false,
    mosVisible: false,
    timeKey: '',
    paginationInfos: { //分页对象
      showSizeChanger: true, //是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, //用于显示数据总量
      current: 1, //当前页数
      total: null,									 //数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    q: '',
    pageChange: '',
    toolsUrl: [],
    isMon: false,
    isRepeat:false,
    currentId:''
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/discovery') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
          if (location.qu != undefined && location.qu != null){
            dispatch({
              type: 'queryInfos',
              payload:{
                q:"branch == " + location.qu.branch
              },
            })
          }
        }
      })
    },
  },

  effects: {
    * query({payload}, {call, put}) {

      let newdata = {...payload}
      /* 			if (newdata.q === undefined) {
                      newdata.q = "toolType=='ZABBIX'"
                  } else if (newdata.q === '') {
                      newdata.q = "toolType=='ZABBIX'"
                  } else if (newdata.q !== '') {
                      newdata.q = `${newdata.q};` + 'toolType==\'ZABBIX\''
                  } */
      const data = yield call(query, newdata)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            },
            q: newdata.q,
          },
        })
      }
    },
    * getTaskById({payload}, {call, put}) {
      const data = yield call(getTaskById, payload.currentItem)

      payload.currentItem = data

      if (data.success) {
        yield put({
          type: 'showModal',
          payload,
        })
      }
    },
    * check({payload}, {call, put}) {
      yield put({ 		//设置button按钮为checking状态
        type: 'showCheckStatus',
        payload: {
          checkStatus: 'checking',
        },
      })
      const data = yield call(check, {url: payload.currentItem.url})
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
    * create({payload}, {call, put}) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({
          type: 'hideModal',
          payload: {
            modalVisible: false,
            isClose: true,
          },
        })
        // yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * requery({payload}, {put}) {
      yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
    * delete({payload}, {call, put}) {
      let branch = payload.branch
      let q = {q: 'branch == ' + branch}
      let newdata = payload.ids
      const data = yield call(remove, newdata)
      if (data.success) {
        yield put({
          type: 'hideModal',
          payload: {
            timeKey: `${new Date().getTime()}`,
          },
        })

        const queryData = yield call(queryTask, q)
        if (queryData.success) {
          yield put({
            type: 'querySuccessTasks',
            payload: {
              taskList: queryData.content,
              paginationInfos: {
                current: queryData.page.number + 1 || 1,
                pageSize: queryData.page.pageSize || 10,
                total: queryData.page.totalElements,
              },
              q: q.q,
            },
          })
        }

      } else {
        throw data
      }
    },
    * deleteInvalidInfo({payload}, {call, put}) {
      let branch = payload.branch
      let q = {q: 'branch == ' + branch}
      let newdata = payload.ids
      const data = yield call(removeInvalidInfo, newdata)
      if (data.success) {
        yield put({
          type: 'hideModal',
        })


      const newData = yield call(queryInInfo, q) //与后台交互，获取数据
      if (newData.success) {
        yield put({
          type: 'querySuccessInfos',
          payload: {
            infoList: newData.content,
            paginationInfos: {
              current: newData.page.number + 1 || 1,
              pageSize: newData.page.pageSize || 10,
              total: newData.page.totalElements,
            },
            q: q,
          },
        })
      }
      } else {
        throw data
      }
    },
    * update({payload}, {select, call, put}) {
      const uuid = yield select(({discovery}) => discovery.currentItem.uuid)
      const newTool = {...payload, uuid}

      let branch = payload.branch
      let q = {q: 'branch == ' + branch}

      const data = yield call(update, newTool)
      if (data.success) {
        const queryData = yield call(queryTask, q)

        if (queryData.success) {
          yield put({
            type: 'querySuccessTasks',
            payload: {
              taskList: queryData.content,
              paginationInfos: {
                current: queryData.page.number + 1 || 1,
                pageSize: queryData.page.pageSize || 10,
                total: queryData.page.totalElements,
              },
              q: q.q,
            },
          })
        }
        yield put({
          type: 'hideModal',
          payload: {
            modalVisible: false,
            isClose: true,
            timeKey: `${new Date().getTime()}`,
          },
        })
        // yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * queryInfos({payload}, {call, put}) { //查询数据
      let newdata = {...payload}
      // let branch = yield select(({discovery}) => discovery.branch)
      newdata = {...payload}
      const data = yield call(queryDiscoveryInfo, newdata) //与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'querySuccessInfos',
          payload: {
            infoList: data.content,
            paginationInfos: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: newdata.q,
          },
        })
      }
    },
    * checkRepeat({payload}, {call, put}) { //查询数据
      const uuid = payload.uuid
      const data = yield call(queryInfo, payload) //与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'returnRepeat',
          payload: {
            isRepeat: data.content.length > 0 ? true : false,
            currentId:uuid
          },
        })
      }
    },
    * queryOnInfos({payload}, {select, call, put}) { //查询数据
      let newdata = {...payload}
      if (!payload.branch) { //传的数据存在 uuid 就不需要从 state 获取
        let branch = yield select(({discovery}) => discovery.branch)
        newdata = {...payload, branch}
      }

      const data = yield call(queryOnInfo, newdata) //与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'querySuccessInfos',
          payload: {
            infoList: data.content,
            paginationInfos: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: newdata.q,
          },
        })
      }
    },
    * queryInInfos({payload}, {select, call, put}) { //查询数据
      let newdata = {...payload}
      if (!payload.branch) { //传的数据存在 uuid 就不需要从 state 获取
        let branch = yield select(({discovery}) => discovery.branch)
        newdata = {...payload, branch}
      }

      const data = yield call(queryInInfo, newdata) //与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'querySuccessInfos',
          payload: {
            infoList: data.content,
            paginationInfos: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: newdata.q,
          },
        })
      }
    },
    * queryTasks({payload}, {select, call, put}) { //查询数据
      let newdata = {...payload}
      if (!payload.branch) { //传的数据存在 uuid 就不需要从 state 获取
        let branch = yield select(({discovery}) => discovery.branch)
        newdata = {...payload, branch}
      }

      const data = yield call(queryTask, newdata) //与后台交互，获取数据
      if (data.success) {
        yield put({
          type: 'querySuccessTasks',
          payload: {
            taskList: data.content,
            paginationInfos: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            q: newdata.q,
          },
        })
      }
    },
    * changeDicoveryInfo({payload}, {select, call, put}) {
      // const uuid = yield select(({ discovery }) => discovery.currentItem.uuid)
      const uuid = payload.record.uuid
      const state = payload.state
      const branch = payload.record.branch
      const q = {q: 'branch == ' + branch}
      const newTool = {...payload, state, uuid}
      const data = yield call(changeInfo, newTool)
      if (data.success) {
        yield put({
          type: 'hideModal',
          payload: {
            modalVisible: false,
            isClose: true,
          },
        })
        const data = yield call(queryDiscoveryInfo, q) //与后台交互，获取数据
        if (data.success) {
          yield put({
            type: 'querySuccessInfos',
            payload: {
              infoList: data.content,
              paginationInfos: {
                current: data.page.number + 1 || 1,
                pageSize: data.page.pageSize || 10,
                total: data.page.totalElements,
              },
              q: q,
            },
          })
        }
        yield put({type: 'requery'})
        // const queryData = yield call(queryDiscoveryInfo, q) //与后台交互，获取数据
        // if (data.success) {
        //   yield put({
        //     type: 'querySuccessInfos',
        //     payload: {
        //       infoList: queryData.content,
        //       paginationInfos: {
        //         current: queryData.page.number + 1 || 1,
        //         pageSize: queryData.page.pageSize || 10,
        //         total: queryData.page.totalElements,
        //       },
        //       q: q.q,
        //     },
        //   })
        // }
      } else {
        throw data
      }
    },
    * changeInvalidInfo({payload}, {select, call, put}) {
      const uuid = payload.record.uuid
      const state = payload.state
      const newTool = {...payload, state, uuid}

      const branch = payload.record.branch
      const q = {q: 'branch == ' + branch}

      const data = yield call(changeInvalidInfo, newTool)
      if (data.success) {
        yield put({
          type: 'hideModal',
          payload: {
            modalVisible: false,
            isClose: true,
          },
        })

        const data = yield call(queryInInfo, q) //与后台交互，获取数据
        if (data.success) {
          yield put({
            type: 'querySuccessInfos',
            payload: {
              infoList: data.content,
              paginationInfos: {
                current: data.page.number + 1 || 1,
                pageSize: data.page.pageSize || 10,
                total: data.page.totalElements,
              },
              q:q,
            },
          })
        }
        yield put({type: 'requery'})
        // const queryData = yield call(queryInInfo, q) //与后台交互，获取数据
        // if (queryData.success) {
        //   yield put({
        //     type: 'querySuccessInfos',
        //     payload: {
        //       infoList: queryData.content,
        //       paginationInfos: {
        //         current: queryData.page.number + 1 || 1,
        //         pageSize: queryData.page.pageSize || 10,
        //         total: queryData.page.totalElements,
        //       },
        //       q: q.q,
        //     },
        //   })
        // }
      } else {
        throw data
      }
    },
    * queryList({payload}, {call, put}) {
      let newdata = {...payload}
      const data = yield call(queryTaskList, newdata)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            list: data.content,
          },
        })
      }
    },
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

    //浏览列表
    querySuccessInfos (state, action) {
      const { infoList, paginationInfos,q } = action.payload
      return {
        ...state,
        infoList,
        q,
        paginationInfos: {
          ...state.paginationInfos,
          ...paginationInfos,
        },
      }
    },

    querySuccessTasks (state, action) {
      const { taskList, paginationInfos,q } = action.payload
      return {
        ...state,
        taskList,
        q,
        paginationInfos: {
          ...state.paginationInfos,
          ...paginationInfos,
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
    showToolsUrl (state, action) {
      return { ...state, ...action.payload }
    },

    returnRepeat(state, action){
      const { isRepeat,currentId } = action.payload
      return {
        ...state,
        isRepeat,
        currentId
      }
    }
  },

}
