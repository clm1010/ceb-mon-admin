import { query, create, update, remove, register, deregister } from "../../../services/togetherConfig";
import { findRegion } from '../../../services/registerServices'
import { queryES } from '../../../services/dashboard'
import { Modal, message } from 'antd'
import { parse } from 'qs'

export default {

    namespace: 'togetherConfig',

    state: {
        list: [],
        visible: false,
        yamlData: {},
        type: "type",
        q: '',
        currentItem: {},
        pagination: {											// 分页对象
            showSizeChanger: true,								// 是否可以改变 pageSize
            showQuickJumper: true, // 是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,					 // 用于显示数据总量
            current: 1,											    // 当前页数
            total: null,											// 数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
        },
        serviceArea: [],
        vList:[]
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/TogetherConfig') {
                    dispatch({
                        type: 'query',
                        payload: {}
                    })
                    dispatch({
                        type: 'findRegion',
                        payload: {}
                    })
                }
            })
        },
    },

    effects: {
        *query({ payload }, { call, put }) {
            const tc = {
                "query": {
                    "bool": {
                        "must": []
                    }
                },
                "aggs": {
                    "name_g": {
                        "terms": {
                            "field": "name.keyword",
                            "size": 10
                        },
                        "aggs": {
                            "sou": {
                                "top_hits": {
                                    "size": 1,
                                    "sort": [{
                                        "createdTime": {
                                            "order": "desc"
                                        }
                                    }]
                                }
                            }
                        }
                    }
                },
                "size": 0
            }
            for (let item in payload.data) {
                if (payload.data[item] && payload.data[item] != "") {
                    tc.query.bool.must.push({ term: { [`${item}.keyword`]: { value: payload.data[item] } } })
                }
            }
            let queryParams = { es: {}, paths: '' }
            // const data = yield call(query, payload)
            queryParams.es = tc
            queryParams.paths = '/distributed_configuration/_search/'
            const data = yield call(queryES, queryParams)
            let dataSource = []
            if (data.success) {
                data.aggregations.name_g.buckets.forEach(element => {
                    element.sou.hits.hits[0]._source
                    dataSource.push({ ...element.sou.hits.hits[0]._source, _id: element.sou.hits.hits[0]._id })
                });
                yield put({
                    type: 'setState',
                    payload: {
                        list: dataSource,
                        // pagination: {
                        //     current: data.page.number + 1 || 1,
                        //     pageSize: data.page.pageSize || 10,
                        //     total: data.page.totalElements,
                        // },
                        q: payload.q,
                    },
                })
            } else {
                throw data
            }
        },
        *findRegion({ payload }, { call, put }) {
            const data = yield call(findRegion, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        serviceArea: data.arr
                    }
                })
            } else {
                throw data
            }
        },
        * requery({ payload }, { put, select }) {
            let pageItem = yield select(({ togetherConfig }) => togetherConfig.pagination)
            let q = parse(window.location.search.substr(1)).q
            yield put({
                type: 'query',
                payload: {
                    page: pageItem.current - 1,
                    pageSize: pageItem.pageSize,
                    q: q
                },
            })
        },
        *create({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                message.success('创建成功')
                yield put({ type: 'requery' })
            } else {
                message.error("创建失败");
                throw data
            }
        },

        *update({ payload }, { call, put }) {
            const data = yield call(update, payload)
            if (data.success) {
                message.success('更新成功')
            } else {
                message.error("更新失败");
                throw data
            }
        },

        *delete({ payload }, { call, put }) {
            const tc = {
                "query": {
                    "bool": {
                      "must": [
                        {
                          "term": {
                            "name.keyword": {
                              "value": `${payload.name}`
                            }
                          }
                        }
                      ]
                    }
                  },
                  "size": 1000
            }
            let queryParams = { es: {}, paths: '' }
            queryParams.es = tc
            queryParams.paths = '/distributed_configuration/_search/'
            const ids = yield call(queryES, queryParams)
            let id = []
            ids.hits.hits.forEach(item=>{
                id.push(item._id)
            })
            const data = yield call(remove, id)
            if (data.success) {
                message.success('删除成功')
                yield put({ type: 'requery' })
            } else {
                message.error("删除失败");
                throw data
            }
        },
        *register({ payload }, { call, put }) {
            const data = yield call(register, payload)
            if (data.success) {
                message.success('注册成功')
                yield put({ type: 'requery' })
                yield put({
                    type: 'setState',
                    payload: {
                        alerts: data.data,
                    },
                })
            } else {
                message.error("注册失败");
                throw data
            }
        },
        *deregister({ payload }, { call, put }) {
            const data = yield call(deregister, payload)
            if (data.success) {
                message.success('注销成功')
                yield put({ type: 'requery' })
                yield put({
                    type: 'setState',
                    payload: {
                        alerts: data.data,
                    },
                })
            } else {
                message.error("注销失败");
                throw data
            }
        },
        
        *getByname({ payload }, { call, put }) {
            const tc = {
                "query": {
                    "bool": {
                      "must": [
                        {
                          "term": {
                            "name.keyword": {
                              "value": `${payload.name}`
                            }
                          }
                        }
                      ]
                    }
                  },
                  "sort": [
                    {
                      "createdTime": {
                        "order": "desc"
                      }
                    }
                  ], 
                  "size": 1000
            }
            let queryParams = { es: {}, paths: '' }
            queryParams.es = tc
            queryParams.paths = '/distributed_configuration/_search/'
            const names = yield call(queryES, queryParams)
            if (names.success) {
                let datas = []
                let len = names.hits.hits.length
                names.hits.hits.forEach((item,index)=>{
                    datas.push({...item._source,vtag:len--})
                })
                yield put({
                    type: 'setState',
                    payload: {
                        vList: datas,
                    },
                })
            }
        },
    },

    reducers: {
        setState(state, action) {
            return {
                ...state, ...action.payload
            }
        },

        updateState(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
