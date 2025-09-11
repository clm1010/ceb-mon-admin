import { query, create, remove, update, queryAll, onDown } from '../services/dataDict'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {

  namespace: 'dataDict',

  state: {
    list: [],																				// 定义了当前页表格数据集合
    currentItem: {},																// 被选中的行对象的集合
    q: '',
    modalVisible: false,
    modalType: 'create',
    //导入导出
	  moImportFileList: [],
	  showUploadList: false,
	  moImportResultVisible: false,
	  moImportResultdataSource: [],
	  moImportResultType: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dataDict') {
          dispatch({
            type: 'query',
            payload: {
              q: '',
            },
          })
        }
      })
    },
  },

  effects: {

    * queryAll ({ payload }, { call }) {
      const data = yield call(queryAll, payload)

      if (data.success) {
        // 将获取的全量字典数据转换成键值对象存储到sessionStorage中
        let dict = {}
        data.arr.forEach((element) => {
          if (!element.metaData) {
            dict[element.key] = element.data
          } else {
            let adaptedData = []
            const meta = eval(element.metaData)
            element.data.forEach((ele) => {
              let val = JSON.parse(ele.value)
              val.key = ele.key
              val.description = ele.description
              val.name = ele.name
              val.sortOrder = ele.sortOrder
              val.uuid = ele.uuid
              val.status = ele.status
              for (let m of meta) {
                if (val[m.dataIndex] !== undefined) {
                  val.value = val[m.dataIndex]
                }
              }
              adaptedData.push(val)
            })
            dict[element.key] = adaptedData
          }
        })

        localStorage.setItem('dict', JSON.stringify(dict))
      }
    },

    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        const isEmpty = data.content.length === 0
        yield put({
          type: 'setState',
          payload: {
            list: data.content,
            q: payload.q,
            currentItem: isEmpty ? {} : data.content[0],
          },
        })
        if (!isEmpty) {
          yield put({
            type: 'dataDictItem/query',
            payload: {
              searchDict: data.content[0],
            },
          })
        }
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'requery' })
        yield put({
          type: 'setState',
          payload: {
            currentItem: data,
            modalVisible: false,
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ dataDict }) => dataDict.currentItem.uuid)
      payload.uuid = id
      const data = yield call(update, payload)

      if (data.success) {
        yield put({ type: 'requery' })
        yield put({
          type: 'setState',
          payload: {
            currentItem: data,
            modalVisible: false,
          },
        })
      } else {
        throw data
      }
    },

    *onDown({ payload }, { select, call }) {
      const q = yield select(({ dataDict }) => dataDict.q)
      let newPayload = {...payload};
      newPayload.q = q
    
      yield call(onDown, newPayload)
    }, 

  },

  reducers: {
    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
