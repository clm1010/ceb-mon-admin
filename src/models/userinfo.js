import { rolequery, query, create, remove, update, findById, authAdd, authDelete } from '../services/userinfo'
import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd'
import { parse } from 'qs'
import queryString from 'query-string';

export default {

  namespace: 'userinfo',

  state: {
    list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被选中的行对象的集合
    modalVisible: false,														//新增的弹出窗口可见性
    UpdatemodalVisible: false,											//编辑的弹出窗口可见性
    modalType: 'create',														//弹出窗口的类型
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    isSynching: false,
    isClose: false,
    detail: {},
    batchDelete: false,
    selectedRows: [],
    timeList: [
      {
        name: '',
        createdTime: '',
        createdBy: '',
        uuid: '',
      },
    ],
    treeData: [
      {
        label: '',
        value: '',
        key: '',
      },
    ],
    roleUUIDs: [],
    loginresult: false,
    createKey: 0,
    pageChange: 0,
    q: '',
    changeValue: ''     //根据机构选择部门
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/userinfo') {
          let query = location.query
          if (query === undefined) {
            query = { q: '' }
            if (location.search.length > 0) {
              query = queryString.parse(location.search)
              /*let searchQuery = queryString.parse(location.search)
              if ('q' in searchQuery){
                query.q = 'q'+searchQuery.q
              }*/
            }
          }
          // console.dir(query)
          dispatch({
            type: 'query',
            payload: query,
          })
        }
      })
    },
  },

  effects: {
    * rolequery({ payload }, { call, put }) {
      const data = yield call(rolequery, payload)
      let treeData = []
      if (data.content) {
        data.content.forEach((item) => {
          let children0 = []
          let role1 = {
            label: item.name,
            value: item.uuid,
            key: item.uuid,
          }
          children0.push(role1)
          let data1 = {
            label: item.name,
            value: item.uuid,
            key: item.uuid,
            //children:children0,
          }
          treeData.push(data1)
        })
        yield put({
          type: 'updateState',
          payload: {
            treeData,
          },
        })
      }
    },
    * query({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
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
            q: payload.q,
          },
        })
      }
    },
    * create({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
        },
      })
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * requery({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
    * delete({ payload }, { call, put }) {
      const data = yield call(remove, { payload })
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * update({ payload }, { select, call, put }) {
      if (payload.originalPassword && payload.originalPassword !== '') {
        const name = yield select(({ userinfo }) => userinfo.currentItem.name)
        let newuser = {
          username: name,
          password: payload.originalPassword,
        }
        const data0 = yield call(login, newuser)
        if (!data0.success) {
          message.error('老密码错误，请重新输入！')
          return
        }
      }

      yield put({
        type: 'updateState',
        payload: {
          UpdatemodalVisible: false,
        },
      })
      const id = yield select(({ userinfo }) => userinfo.currentItem.uuid)
      const newTool = { ...payload, id }
      const data = yield call(update, newTool)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * findById({ payload }, { call, put }) {
      const data = yield call(findById, payload.currentItem)
      //对更新时间和创建时间处理一下
      if (data.createdTime !== 0) {
        let text = data.createdTime
        data.createdTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
      }
      if (data.updatedTime !== 0) {
        let text = data.updatedTime
        data.updatedTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
      }
      let timeList = []
      if (data.roles !== undefined) {
        data.roles.forEach((item) => {
          let role = {
            name: item.name,
            createdTime: item.createdTime,
            createdBy: item.createdBy,
            uuid: item.uuid,
          }
          timeList.push(role)
        })
      } else {
        let role = {
          name: '',
          createdTime: '',
          createdBy: '',
          uuid: '',
        }
        timeList.push(role)
      }
      yield put({
        type: 'rolequery',
        payload: {
        },
      })
      let arrs = []
      if (data.roles && data.roles.length > 0) {
        data.roles.forEach((item) => {
          if (arrs.length > 0) {
            arrs = [...arrs, { value: item.uuid, label: item.name }]
          } else {
            arrs = [{ value: item.uuid, label: item.name }]
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          modalType: 'update',
          currentItem: data,
          UpdatemodalVisible: true,
          timeList,
          roleUUIDs: arrs,
          changeValue: data.branch,
        },
      })
    },
    * authAdd({ payload }, { call, put }) {
      const data = yield call(authAdd, { payload })
      if (data.respCode === '00') {
        Modal.success({content:data.respMsg})
        // yield put({ 
        //   type:'update',
        //   payload:payload.item
        // })
        // yield put({ type: 'requery' })
      } else {
        Modal.error({content:data.respMsg})
        // throw data.respMsg
      }
    },
    * authDelete({ payload }, { call, put }) {
      const data = yield call(authDelete, { payload })
      if (data.respCode === '00') {
        Modal.success({content:data.respMsg})
        // yield put({ 
        //   type:'update',
        //   payload:payload.item
        // })
        // yield put({ type: 'requery' })
      } else {
        Modal.error({content:data.respMsg})
      }
    },
  },

  reducers: {
    //浏览列表
    querySuccess(state, action) {
      const { list, pagination, detail } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        detail,
      }
    },

    updateState(state, action) {
      return { ...state, ...action.payload }
    },
  },

}
