import { peformanceCfg } from '../utils/performanceOelCfg'
import { queryES, queryMES } from '../services/dashboard'
import { ESFindIndex, ESFindIndex_M } from '../utils/FunctionTool'
import { getSourceByKey } from '../utils/FunctionTool'

const moValues = getSourceByKey('DataCenterTransaction')

function dataTran(nums, unitStateArr) {
    if (nums >= 1000000 && nums < 1000000000) {
        unitStateArr.push('M')
    } else if (nums >= 1000000000) {
        unitStateArr.push('G')
    } else if (nums === 0) {
        unitStateArr.push('0')
    } else if (nums === '-') {
        unitStateArr.push('0')
    } else if (nums < 1000000) {
        unitStateArr.push('K')
    }
    return nums
}
function unitTran(unitStateArr, ...values) {
    let g = 0
    let m = 0
    let k = 0
    let unitState
    for (let u = 0; u < unitStateArr.length; u++) {
        if (unitStateArr[u] === 'G') {
            g++
        } else if (unitStateArr[u] === 'M') {
            m++
        } else if (unitStateArr[u] === 'K') {
            k++
        }
    }
    if (g >= m && g >= k) {
        unitState = 2
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                values[i][j] = (Math.round(((values[i][j]) / 1000000000) * 100) / 100).toFixed(2)
            }
        }
    } else if (m >= g && m >= k) {
        unitState = 1
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                values[i][j] = (Math.round(((values[i][j]) / 1000000) * 100) / 100).toFixed(2)
            }
        }
    } else if (k > m && k > g) {
        unitState = 0
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                values[i][j] = (Math.round(((values[i][j]) / 1000) * 100) / 100).toFixed(2)
            }
        }
    }
    return unitState
}

const obj = {}
const stateDate = (moValues) => {
    moValues.forEach(item => {
        let o = {
            [`start${item.key}`]: 0,
            [`end${item.key}`]: 0,
            [`xAxis${item.key}`]: [],
            [`yInAxis${item.key}`]: [],
            [`yOutAxis${item.key}`]: [],
            [`yInAxis${item.key}1`]: [],
            [`yOutAxis${item.key}1`]: [],
            [`loading_${item.key}`]: false,
        }
        Object.assign(obj, o)
    })
    return obj
}
stateDate(moValues)

export default {
    namespace: 'dataCenterTransaction',
    state: obj ,
    
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/dataCenterTransaction') {
                    dispatch({ type: 'query_pre', payload: {} })  // 获取数据前的处理
                }
            })
        }
    },

    effects: {
        //获取F环 酒仙桥的数据
        *query_FJXQ({ payload }, { put, call, select }) {
            let xAxis = []
            let yInAxis = []
            let yOutAxis = []
            let unitStateArr = [] // 计算保存单位的值
            let startFJXQ = payload.startFJXQ
            let endFJXQ = payload.endFJXQ
            let mos = moValues.filter(item => item.key == '数据中心互联区F环-酒仙桥')[0].value.split(',').map(item => ({ "term": { "moname": { "value": item } } }))
            let DCTAXS = peformanceCfg.queryDCT
            DCTAXS.query.bool.must[1].bool.should = mos
            let paths = ''
            let queryParams = { es: {}, paths: '' }
            if (startFJXQ !== 0 && endFJXQ !== 0 && startFJXQ !== undefined && endFJXQ !== undefined) {
                paths = ESFindIndex(startFJXQ, endFJXQ, 'u2performance-', 'day', '')//按时间生成索引
            } else {
                paths = ESFindIndex(Date.parse(new Date(new Date().setHours(8, 0, 0, 0))), Date.parse(new Date()), 'u2performance-', 'day', '')
            }
            queryParams.es = DCTAXS
            queryParams.paths = paths
            const data = yield call(queryES, queryParams)
            if (data.aggregations.timeGroup && data.aggregations.timeGroup.buckets.length > 0) {
                for (let item of data.aggregations.timeGroup.buckets) {
                    xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
                    for (let kpi of item.kpinameGroup.buckets) {
                        if (kpi.key == "总行端口输出流量实际值") {
                            yInAxis.push(dataTran(kpi.sumValue.value, unitStateArr))
                        }
                        if (kpi.key == "总行端口输入流量实际值") {
                            yOutAxis.push(dataTran(kpi.sumValue.value, unitStateArr))
                        }
                    }
                }
            }
            yield put({
                type: 'setState',
                payload: {
                    yInAxisFJXQ1: [...yInAxis],
                    yOutAxisFJXQ1: [...yOutAxis],
                }
            })
            let unitStateFJXQ = unitTran(unitStateArr, yInAxis, yOutAxis)
            yield put({
                type: 'setState',
                payload: {
                    xAxisFJXQ: xAxis,
                    yInAxisFJXQ: yInAxis,
                    yOutAxisFJXQ: yOutAxis,
                    unitStateFJXQ
                }
            })
        },
        // 请求前对条件的过滤
        *query_pre({ payload }, { put, call, select }) {
            let Terms, EffectName
            if (payload.name && payload.name != '') {
                for (let item of moValues) {
                    if (item.name == payload.name) {
                        Terms = item.value.split(',').map(item => ({ "term": { "moname": { "value": item } } }))
                        EffectName = item.key
                    }
                }
                yield put({
                    type: 'setState',
                    payload: { [`loading_${EffectName}`]: true }
                })
                yield put({
                    type: 'query_Day',
                    payload: { Terms, ...payload, EffectName }
                })
            } else {
                for (let item of moValues) {
                    EffectName = item.key
                    Terms = item.value.split(',').map(item => ({ "term": { "moname": { "value": item } } }))
                    yield put({
                        type: 'setState',
                        payload: { [`loading_${EffectName}`]: true }
                    })
                    yield put({
                        type: 'query_Day',
                        payload: { Terms, ...payload, EffectName }
                    })
                }
            }

        },
        // 按天获取数据
        *query_Day({ payload }, { put, call, select }) {
            let xAxis = []
            let yInAxis = []
            let yOutAxis = []
            let unitStateArr = [] // 计算保存单位的值
            let start = payload.start
            let end = payload.end

            let DCTAXS = peformanceCfg.queryDCT
            DCTAXS.query.bool.must[1].bool.should = payload.Terms
            let paths = ''
            let queryParams = { es: {}, paths: '' }
            if (start !== 0 && end !== 0 && start !== undefined && end !== undefined) {
                paths = ESFindIndex(start, end, 'u2performance-', 'day', '')//按时间生成索引
            } else {
                paths = ESFindIndex(Date.parse(new Date(new Date().setHours(8, 0, 0, 0))), Date.parse(new Date()), 'u2performance-', 'day', '')
            }
            queryParams.es = DCTAXS
            queryParams.paths = paths
            const data = yield call(queryES, queryParams)
            if (data.aggregations.timeGroup && data.aggregations.timeGroup.buckets.length > 0) {
                for (let item of data.aggregations.timeGroup.buckets) {
                    xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
                    for (let kpi of item.kpinameGroup.buckets) {
                        if (kpi.key == "总行端口输出流量实际值") {
                            yInAxis.push(dataTran(kpi.sumValue.value, unitStateArr))
                        }
                        if (kpi.key == "总行端口输入流量实际值") {
                            yOutAxis.push(dataTran(kpi.sumValue.value, unitStateArr))
                        }
                    }
                }
            }
            yield put({
                type: 'setState',
                payload: {
                    [`yInAxis${payload.EffectName}1`]: [...yInAxis],
                    [`yOutAxis${payload.EffectName}1`]: [...yOutAxis],
                }
            })
            let unitState = unitTran(unitStateArr, yInAxis, yOutAxis)
            yield put({
                type: 'setState',
                payload: {
                    [`xAxis${payload.EffectName}`]: xAxis,
                    [`yInAxis${payload.EffectName}`]: [...yInAxis],
                    [`yOutAxis${payload.EffectName}`]: [...yOutAxis],
                    [`unitState${payload.EffectName}`]: unitState,
                    [`loading_${payload.EffectName}`]: false,
                }
            })
        },
        //获取按月的查询数据
        *query_Month({ payload }, { put, call, select }) {
            let xAxis = []
            let yInAvgAxis = [], yInMinAxis = [], yInMaxAxis = []
            let yOutAvgAxis = [], yOutMinAxis = [], yOutMaxAxis = []
            let unitStateArr = [] // 计算保存单位的值
            let startDate = payload.startDate
            let endDate = payload.endDate
            let mos = moValues.filter(item => item.key == payload.EffectName)[0].value.split(',').map(item => ({ "term": { "moname": { "value": item } } }))
            let DCTAXS = peformanceCfg.queryDCT_Month
            DCTAXS.query.bool.must[1].bool.should = mos
            let paths = ''
            let queryParams = { es: {}, paths: '' }
            if (startDate !== 0 && endDate !== 0 && startDate !== undefined && endDate !== undefined) {
                // paths = ESFindIndex(startDate, endDate, 'u2hourperformance-', 'month', '')//按时间生成索引
                paths = ESFindIndex_M(startDate, endDate, 'u2hourperformance-', '', '')//按时间生成索引
            } else {
                // paths = ESFindIndex(Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) + 86400000, Date.parse(new Date()), 'u2hourperformance-', '', '')
                paths = ESFindIndex_M(Date.parse(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) + 86400000, Date.parse(new Date()), 'u2hourperformance-', '', '')//按时间生成索引
            }
            queryParams.es = DCTAXS
            queryParams.paths = paths
            console.log('paths:', paths)
            const data = yield call(queryMES, queryParams)
            if (data.aggregations.timeGroup && data.aggregations.timeGroup.buckets.length > 0) {
                for (let item of data.aggregations.timeGroup.buckets) {
                    xAxis.push(new Date(item.key).format('yyyy-MM-dd hh:mm:ss'))
                    for (let kpi of item.kpinameGroup.buckets) {
                        if (kpi.key == "总行端口输出流量实际值") {
                            yInAvgAxis.push(dataTran(kpi.AvgValue.value, unitStateArr))
                            yInMinAxis.push(dataTran(kpi.MinValue.value, unitStateArr))
                            yInMaxAxis.push(dataTran(kpi.MaxValue.value, unitStateArr))
                        }
                        if (kpi.key == "总行端口输入流量实际值") {
                            yOutAvgAxis.push(dataTran(kpi.AvgValue.value, unitStateArr))
                            yOutMinAxis.push(dataTran(kpi.MinValue.value, unitStateArr))
                            yOutMaxAxis.push(dataTran(kpi.MaxValue.value, unitStateArr))
                        }
                    }
                }
            }
            yield put({
                type: 'setState',
                payload: {
                    [`yMonth${payload.EffectName}`]: [[...yInAvgAxis], [...yInMinAxis], [...yInMaxAxis], [...yOutAvgAxis], [...yOutMinAxis], [...yOutMaxAxis]],
                    [`yInAvgAxis${payload.EffectName}1`]: [...yInAvgAxis],
                    [`yInMinAxis${payload.EffectName}1`]: [...yInMinAxis],
                    [`yInMaxAxis${payload.EffectName}1`]: [...yInMaxAxis],
                    [`yOutAvgAxis${payload.EffectName}1`]: [...yOutAvgAxis],
                    [`yOutMinAxis${payload.EffectName}1`]: [...yOutMinAxis],
                    [`yOutMaxAxis${payload.EffectName}1`]: [...yOutMaxAxis],
                    [`state_${payload.EffectName}`]: payload[`state_${payload.EffectName}`],
                    [`loading_${payload.EffectName}`]: false
                }
            })
            let unitState = unitTran(unitStateArr, yInAvgAxis, yInMinAxis, yInMaxAxis, yOutAvgAxis, yOutMinAxis, yOutMaxAxis)
            yield put({
                type: 'setState',
                payload: {
                    [`xAxis${payload.EffectName}`]: xAxis,
                    [`yInAvgAxis${payload.EffectName}`]: [...yInAvgAxis],
                    [`yInMinAxis${payload.EffectName}`]: [...yInMinAxis],
                    [`yInMaxAxis${payload.EffectName}`]: [...yInMaxAxis],
                    [`yOutAvgAxis${payload.EffectName}`]: [...yOutAvgAxis],
                    [`yOutMinAxis${payload.EffectName}`]: [...yOutMinAxis],
                    [`yOutMaxAxis${payload.EffectName}`]: [...yOutMaxAxis],
                    [`unitState${payload.EffectName}`]: unitState
                }
            })
        },
    },

    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        }
    }
}
