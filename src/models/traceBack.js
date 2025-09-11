import { queryES, queryDSL } from '../services/traceBack'
import queryString from "query-string";
import qs from 'qs'
import { query as queryDetails } from '../services/historyview'
import { es } from '../utils/traceBackES'
import { queryTransES } from '../utils/FunctionTool'

function aggContionF(value) {
    let agg = {
        grain_group: {
            terms: {}
        }
    }
    let terms = {}
    switch (value) {
        case 'alarmTotal':
            break;
        case 'alarmLeven':
            terms = {
                "field": "n_customerseverity"
            }
            break;
        case 'alarmType':
            terms = {
                "field": "n_componenttype"
            }
            break;
        case 'appName':
            terms = {
                "field": "n_appname"
            }
            break;
    }
    agg.grain_group.terms = terms
    return value == 'alarmTotal' ? null : agg
}
export default {
    namespace: 'traceBack',

    state: {
        list: [], //定义了当前页表格数据集合
        currentItem: {},	//被选中的单个行对象
        CardType: 'alarmTotal', //弹出窗口的类型  alarmTotal alarmLeven alarmType appName
        pagination: { //分页对象
            showTotal: total => `共 ${total} 条`, //用于显示数据总量
            total: null,//数据总数？
            // hideOnSinglePage:true,
            pageSize: 100,
        },
        q: '', // 条件
        StatisticsValues: {},  // 统计值
        TimeSticValues: {},   // 时间粒度显示值
        appNameSelected: [] // 应用系统显示的默认值
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                const query = queryString.parse(location.search)
                if (location.pathname.includes('/traceBack')) {
                    dispatch({ type: 'queryTotal', payload: { q: query.q } })  // 查询 告警总数 告警级别 告警分类 应用系统的总数据
                    dispatch({ type: 'queryGrain', payload: { q: query.q, CardType: "alarmTotal" } })  // 查询 告警总数 告警级别 告警分类 应用系统粒度数据
                    // dispatch({ type: 'queryDetails', payload: { q: query.q } })  // 查询 告警总数 告警级别 告警分类 应用系统详细数据
                }
            })
        },
    },
    effects: {
        /**
        * 与后台交互 调用接口  
        * @function traceBack.queryTotal 
        */
        * queryTotal({ payload }, { call, put }) {
            let q_ES = queryTransES(payload.q)
            let queryParams = { es: {}, paths: '' }
            queryParams.es = es.traceBackTotal
            queryParams.es.query.bool.must = q_ES
            const newParams = { dsl: JSON.stringify(queryParams.es) }
            const data = yield call(queryDSL, qs.stringify(newParams))
            if (data.success) {
                const StatisticsValues = {}
                StatisticsValues.totalNum = data.totalHits
                data.aggregations.forEach(element => {
                    if (element.name == 'n_customerseverity_g') {
                        StatisticsValues.n_customerseverity_g = element.buckets
                    }
                    if (element.name == 'n_ComponentType_g') {
                        StatisticsValues.n_ComponentType_g = element.buckets
                    }
                    if (element.name == 'n_appname_g') {
                        StatisticsValues.n_appname_g = element.buckets
                    }
                });
                yield put({
                    type: 'updateState',
                    payload: {
                        q: payload.q,
                        StatisticsValues
                    },
                })
            } else {
                yield put({
                    type: 'updateState',
                    payload: {
                        q: payload.q
                    },
                })
            }
        },
        /**
        * 与后台交互 调用接口  
        * @function tool.query 
        */
        * queryGrain({ payload }, { call, put, select }) {
            let q_ES
            if (payload.CardType == 'appName') {
                q_ES = queryTransES(payload.q + payload.app_q)
            } else {
                q_ES = queryTransES(payload.q)
            }
            let es_agg = aggContionF(payload.CardType)
            let queryParams = { es: {}, paths: '' }
            queryParams.es = es.traceBackGrain
            if (payload.grain) {
                queryParams.es.aggs.data_group.date_histogram.interval = payload.grain
            }
            queryParams.es.query.bool.must = q_ES
            if (es_agg) {
                queryParams.es.aggs.data_group.aggs = es_agg
            }
            const newParams = { dsl: JSON.stringify(queryParams.es) }
            const data = yield call(queryDSL, qs.stringify(newParams))
            if (data.success) {
                const TimeSticValues = {}
                TimeSticValues.GrainValues = data.aggregations[0].buckets
                yield put({
                    type: 'updateState',
                    payload: {
                        q: payload.q,
                        TimeSticValues,
                        CardType: payload.CardType
                    },
                })
            }
        },
        /**
        * 与后台交互 调用接口  
        * @function tool.query 
        */
        * queryDetails({ payload }, { call, put }) {
            const data = yield call(queryDetails, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.content,
                        pagination: {
                            total: data.page.totalElements,
                            showTotal: total => `共 ${total} 条`,
                            pageSize: 100,
                        },
                    },
                })
            }
        },
    },
    reducers: {
        //浏览列表
        updateState(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
