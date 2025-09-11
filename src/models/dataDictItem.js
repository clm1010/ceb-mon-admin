import { query, create, remove, update, findById, batchRemove } from '../services/dataDictItem'
import OelColumns from '../utils/OelColumns'
import dictItems from '../utils/selectOption/vendor'
import { message } from 'antd'

export default {

  namespace: 'dataDictItem',

  state: {
    list: [],																				// 定义了当前页表格数据集合
    currentItem: {},																// 被选中的行对象的集合
    modalVisible: false,														// 弹出窗口是否可见
    modalType: 'create',														// 弹出窗口的类型
    pagination: {																		// 分页对象
      showSizeChanger: true,												// 是否可以改变 pageSize
      showQuickJumper: true, // 是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
      current: 1,																		// 当前页数
      total: null,																	// 数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
    batchDelete: false,
    selectedRows: [],
    searchDict: {},
    searchDictItemName: '',
  },

  subscriptions: {
		/*
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/timePeriods') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
		},
		*/
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            list: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
            },
            searchDict: payload.searchDict || {},
            searchDictItemName: payload.searchDictItemName || '',
          },
        })
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'requery' })
        yield put({
          type: 'setState',
          payload: {
            modalVisible: false,
          },
        })
      } else {
        throw data
      }
    },

    * requery ({ payload }, { select, put }) {
      const searchDict = yield select(({ dataDictItem }) => dataDictItem.searchDict)
      const searchDictItemName = yield select(({ dataDictItem }) => dataDictItem.searchDictItemName)
      const page = yield select(({ dataDictItem }) => dataDictItem.pagination)

      yield put({
        type: 'query',
        payload: {
          page: page.current - 1,
          pageSize: page.pageSize,
          searchDict: searchDict || {},
          searchDictItemName: searchDictItemName || '',
        },
      })
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, { payload })
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * batchRemove ({ payload }, { call, put }) {
      const data = yield call(batchRemove, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      yield put({
        type: 'setState',
        payload: {
          modalVisible: false,
        },
      })
      const id = yield select(({ dataDictItem }) => dataDictItem.currentItem.uuid)
      payload.uuid = id
      const newItem = { ...payload, id }
      const data = yield call(update, newItem)

      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * findById ({ payload }, { call, put }) {
      const data = yield call(findById, payload.currentItem)
      if (data.success && data.name) {
        yield put({
          type: 'setState',
          payload: {
            currentItem: data,
          },
        })
      } else {
        message.error('从后端获取字典项配置失败。')
      }
    },

    * importOelDictItem ({ payload }, { call, put }) {
      for (let col of OelColumns) {
        const item = {
          description: col.name,
          dictId: 'a7aae566-bea6-41fc-913a-e06cf13134a1',
          key: col.key,
          name: col.name,
          sortOrder: Date.parse(new Date()) / 1000,
          status: 0,
          value: `{"value":"${col.key}","type":"${col.type}","core":"${col.core}"}`,
        }
        const data = yield call(create, item)
        if (data.success && data.name) {
          yield put({
            type: 'setState',
            payload: {
              currentItem: data,
            },
          })
        } else {
        }
      }
    },
    * importDictItem ({ payload }, { call, put }) {
      for (let item of dictItems) {
        const obj = {
          description: '',
          dictId: '012044a4-b5d8-472e-b86a-aecf96c184a9',
          key: item.value,
          name: item.name,
          sortOrder: Date.parse(new Date()) / 1000,
          status: 0,
          value: item.value,
        }
        const data = yield call(create, obj)
        if (data.success && data.name) {
          yield put({
            type: 'setState',
            payload: {
              currentItem: data,
            },
          })
          yield put({ type: 'requery' })
        } else {
        }
      }
    },
  },

  reducers: {
    setState (state, action) {
      const kk = { ...state, ...action.payload }
      return kk
    },
  },

}
