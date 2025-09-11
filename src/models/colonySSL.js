import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryES } from '../services/dashboard'
import { ESFindIndex } from '../utils/FunctionTool'
import { getSourceByKey } from '../utils/FunctionTool'

const moValues = getSourceByKey('SSL-COLONY')

const obj = {}
const stateDate = (moValues) => {
    moValues.forEach(item => {
        let o = {
            [`${item.key}_xAxis`]: [],
            [`${item.key}_yVSAxis`]: [],
            [`${item.key}_yConAxis`]: [],
            [`${item.key}_loading`]: false,
        }
        Object.assign(obj, o)
    })
    return obj
}
stateDate(moValues)

export default {
    namespace: 'colonySSL',
    state: Object.assign(obj, {

        starTime: null,
        endTime: null,

    }),

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/colonySSL') {
                    dispatch({ type: 'query_pre', payload: {} })
                }
            })
        }
    },

    effects: {
        *query_pre({ payload }, { put, call, select }) {
            let ipTerms, name_pre
            if (payload.name && payload.name != '') {
                for (let item of moValues) {
                    if (item.name == payload.name) {
                        ipTerms = item.value.split(',').map(item => ({ "term": { "hostip": { "value": item } } }))
                        name_pre = item.key
                    }
                }
                yield put({
                    type: 'setState',
                    payload: { [`${name_pre}_loading`]: true }
                })
                yield put({
                    type: 'query',
                    payload: { ipTerms, ...payload, name_pre }
                })
            } else {
                for (let item of moValues) {
                    name_pre = item.key
                    ipTerms = item.value.split(',').map(item => ({ "term": { "hostip": { "value": item } } }))
                    yield put({
                        type: 'setState',
                        payload: { [`${name_pre}_loading`]: true }
                    })
                    yield put({
                        type: 'query',
                        payload: { ipTerms, ...payload, name_pre }
                    })
                }
            }

        },
        *query({ payload }, { put, call, select }) {
            let xAxis = []
            let yVSAxis = []
            let yConAxis = []

            let starTime = payload.starTime
            let endTime = payload.endTime
            let SSLES = peformanceCfg.querySSLColony
            SSLES.query.bool.must[1].bool.should = payload.ipTerms
            SSLES.query.bool.must[2] = { range: { clock: { lt: Date.parse(new Date(Math.floor((new Date().getTime()) / 60000) * 60000)) / 1000 - 180 } } }
            let paths = ''
            let queryParams = { es: {}, paths: '' }
            if (starTime !== 0 && endTime !== 0 && starTime !== undefined && endTime !== undefined) {
                paths = ESFindIndex(starTime, endTime, 'u2performance-', 'day', '')//按时间生成索引
            } else {
                paths = ESFindIndex(Date.parse(new Date(new Date().setHours(8, 0, 0, 0))), Date.parse(new Date()), 'u2performance-', 'day', '')
            }
            queryParams.es = SSLES
            queryParams.paths = paths
            const data = yield call(queryES, queryParams)
            if (data.aggregations.timeGroup && data.aggregations.timeGroup.buckets.length > 0) {
                for (let item of data.aggregations.timeGroup.buckets) {
                    xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
                    for (let kpi of item.kpinameGroup.buckets) {
                        if (kpi.key == "SSL每秒连接") {
                            yConAxis.push(kpi.avgValue.value.toFixed(2))
                        }
                        if (kpi.key == "SSL-VS并发") {
                            yVSAxis.push(kpi.avgValue.value.toFixed(2))
                        }
                    }
                }
            }
            yield put({
                type: 'setState',
                payload: {
                    [`${payload.name_pre}_xAxis`]: xAxis,
                    [`${payload.name_pre}_yVSAxis`]: yVSAxis,
                    [`${payload.name_pre}_yConAxis`]: yConAxis,
                    [`${payload.name_pre}_loading`]: false,
                }
            })
        }
    },

    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        }
    }
}
