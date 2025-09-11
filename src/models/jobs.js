import { query, findById, jobDetail, deleteJobs } from '../services/jobs'
import queryString from 'query-string'
import * as routerRedux from 'react-router-redux'
import { parse } from 'qs'

export default {
  namespace: 'jobs',

  state: {
    q:'',
    batchDelete: false,
    selectedRows: [],
    modalVisible: false,
    drawerVisible: false,
    popoverVisible: false,
    progressButtonState: false,
    stepButtonState: false,
    sourceData: [],
    item: [],
    stepItems: [],//步骤条任务
    toolProgress: {},//工具进度
    instProgress: {},//监控实例
    mos: [],//下发的监控对象
    issueMotoInsts: [],//下发的监控对象及绑定的对应的策略模板
    uuid: '',//单个任务的唯一标识
    pagination: {									//分页对象
      showSizeChanger: true,						//是否可以改变 pageSize
      showQuickJumper: true, //是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`,			//用于显示数据总量
      current: 1,									//当前页数
      total: 0,										//数据总数？
      pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if(location.pathname === '/jobs'){
          let query = location.query
          if (query === undefined) {
            query = queryString.parse(location.search);
          }
            dispatch({
              type: 'query',
              payload: query
            })
        }
      })
    }
  },

  effects: {
    * query ( { payload }, { put, call } ){
      const data = yield call ( query, payload )
      console.log('查询条件：',payload.q)
      if(data.success){
        yield put({
          type: 'setState',
          payload:{
            sourceData: data.content,
            pagination: {
              current: data.page.number + 1 || 1,
              pageSize: data.page.pageSize || 10,
              total: data.page.totalElements,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            },
            q: payload.q === undefined ? '' : payload.q
          }
        })
      }else{

      }
    },
    * findById ( { payload }, { put, call } ){
      const data = yield call ( findById, payload )
      if(data.success){
        yield put ({
          type: 'setState',
          payload:{
            modalVisible: true,
            progressButtonState: true,
            item: data,
            uuid: payload.uuid
          }
        })
      }
    },
    * jobDetail ( { payload }, { put, call} ) {//获取单个任务的下发详情
      const data = yield call ( jobDetail, payload )
      let stepInfo = []
      let instProgress = {}
      let mos = []
      let issueMotoInsts = []
      if(data.success){
        if(data.jobStages.length > 0){
          data.jobStages.forEach((item, index) => {
            switch (item.title) {
              case '开始':
                stepInfo.push({ 'status': item.status, 'title': item.title, 'description':item.description, 'icon': 'play-circle'})
                    break
              case '计算':
                stepInfo.push({ 'status': item.status, 'title': item.title, 'description':item.description, 'icon': 'calculator'})
                    break
              case '下发':
                stepInfo.push({ 'status': item.status, 'title': item.title, 'description':item.description, 'icon': 'global'})
                    break
              case '完成':
                stepInfo.push({ 'status': item.status, 'title': item.title, 'description':item.description, 'icon': 'file-done'})
                    break
            }
          })
        }
        instProgress = data.instInfo
        if(data.moToInsts.length > 0){
          data.moToInsts.forEach((item, index) => {
            mos.push(item.mo)
          })
        }
        issueMotoInsts = data.moToInsts
        yield put({
          type: 'setState',
          payload:{
            stepItems: stepInfo,
            toolProgress: data.toolInfo,
            instProgress: instProgress,
            mos: mos,
            issueMotoInsts: issueMotoInsts
          }
        })
      }else{

      }
    },
    * delete ( { payload }, { put, call } ) {
      const data = yield call ( deleteJobs, payload )
      if(data.success){
        yield put({ type: 'requery' })
      }else{
        throw data
      }
    },
    * requery ({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: window.location.pathname,
        query: parse(window.location.search.substr(1)),
      }))
    },
  },

  reducers: {
    setState (state, action) {
      return { ...state, ...action.payload }
    },
  }

}
