import { query, remove, update, updateAction, findById, create ,datequery} from '../services/oelTrack'
import { query as trackRulequery } from '../services/trackTimer'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config } from '../utils'
import { message } from 'antd'
import queryString from "query-string";
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns

export default {

  namespace: 'oelTrack',

  state: {
    title: '告警列表',													// 弹出页标题
    list: [],																				//定义了当前页表格数据集合
    currentItem: {},																//被双击的单个行对象															//oel默认表头
    pagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
      pageSize: 100,
    },
    countState: true,
    initValue: config.countDown,
    batchDelete: false,
    choosedRows: [],
    expand: true,
    seeModalvisible: false,
    editModalvisible: false,
    addModalvisible: false,
    trackRuleModalvisible: false,
    timeFileinfo: {}, //保存告警循环 相应时间和通知对象的定义
    timertype: '', //定义定时器类型的选择
    typeValue: '', //定义循环机制的选择
    rulelist: [],
    rulepagination: {																		//分页对象
      showSizeChanger: true,												//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
      current: 1,																		//当前页数
      total: null,																	//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
      pageSize: 100,
    },
    ruleInfoVal: {},
    expands: false,
    fullstyle: '',
    onlyOne: true,
    forbind: true,
    tkey:false,
    nowDate:0
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.includes('/oelTrack')) {
          const query = queryString.parse(location.search);
          dispatch({
            type: 'query',
            payload:query,
          })
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const data = yield call(query, payload)
      const date = yield call (datequery, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            list: data.content,
            nowDate:date.currentTime,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            },
            q: payload.q,	//把查询条件放到state中
          },
        })
      }
    },
    * trackRule({ payload }, { call, put, select }) {
      const data = yield call(trackRulequery, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            rulelist: data.content,
            rulepagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            },
            q: payload.q,	//把查询条件放到state中
          },
        })
      }
    },
    * findById({ payload }, { call, put, select }) {
      let olddata = yield select(({ oelTrack }) => oelTrack.currentItem)
      const data = yield call(findById, payload.currentItem)				//@@@
      const date = yield call (datequery, payload)
      if (data.success) {
        const newdata = Object.assign(olddata, data)
        yield put({
          type: 'setState',
          payload: {
            nowDate:date.currentTime,
            currentItem: newdata,
            seeModalvisible: true,
          },
        })
      }
    },
    * requery({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: location.pathname,
        query: parse(location.search.substr(1)),
      }))
    },
    * delete({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * create({ payload }, { select, call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            addModalvisible: false,
          },
        })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * update({ payload }, { select, call, put }) {
      const data = yield call(update, payload)
      if (data.success) {
        yield put({
          type: 'setState',
          payload: {
            timeFileinfo: {},
            timertype: '',
            editModalvisible: false,
          },
        })
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * updateAction({ payload }, { call, put }) {
      const data = yield call(updateAction, payload)
      if (data.success) {
        message.success('通知成功')
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    * updateAction1({ payload }, { call, put }) {
      const data = yield call(updateAction, payload)
      if (data.success) {
        message.success('通知成功')
        yield put({
          type: 'setState',
          payload: {
            forbind: true
          },
        })
        yield put({
          type: 'findById',
          payload: payload
        })
      } else {
        throw data
      }
    },
    * getNowDate ({ payload }, { call, put }){
      const date = yield call (datequery, payload)
      if (date.success) {
        yield put({
          type: 'setState',
          payload: {
            nowDate:date.currentTime,
          },
        })
      }
    }
  },

  reducers: {
    //浏览列表
    querySuccess(state, { payload }) {
      return { ...state, ...payload }
    },

    setState(state, action) {
      return { ...state, ...action.payload }
    },

  },

}
