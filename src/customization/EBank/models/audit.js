import { queryES } from '../../../services/audit'
import { queryTree_es,query_es} from '../routes/audit/ES_DSL'
import { ESFindIndex } from '../../../utils/FunctionTool'

export default {

    namespace: 'audit',

    state: {
        list: [],
        treeValues: [],
        searchArr: [],
        currentItem: {},
        pagination: {									//分页对象
            showSizeChanger: true,                      //是否可以改变 pageSize
            showTotal: total => `共 ${total} 条`,       //用于显示数据总量
            current: 1,                                 //当前页数
            total: null,								//数据总数？
            pageSizeOptions: [ '20', '50', '100','200'],
        },
        visible: false,
        preItem: {},
        expand: false,
        preData: {},
        startTime: '',
        endTime: '',
        es_q:{}
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname.includes('/audit')) {
                    const endTime = new Date().getTime()
                    const startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime() //当天的起始时间
                    dispatch({
                        type: 'queryTree',
                        payload: {
                            endTime:new Date(endTime).format('yyyy-MM-dd hh:mm:ss'),
                            startTime:new Date(startTime).format('yyyy-MM-dd hh:mm:ss'), //当天的起始时间
                        },
                    })
                    dispatch({
                        type: 'query',
                        payload: {
                            endTime,
                            startTime, //当天的起始时间
                        },
                    })
                }
            })
        }
    },

    effects: {
        /**
         * 查询所有的数据
         **/
        * query({ payload }, { call, put, select }) {
            let paths = ''
            let queryParams = { es: {}, paths: '' }
            if (payload.endTime !== "" && payload.startTime !== "" && payload.endTime !== undefined && payload.startTime !== undefined) {
                paths = ESFindIndex(payload.startTime, payload.endTime, 'prom-sra-', 'years', '')//按时间生成索引
            } else {
                paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'prom-sra-', 'years', '')
            }
            if(payload.es){
                queryParams.es = JSON.parse(JSON.stringify(payload.es))
            }else{
                queryParams.es = JSON.parse(JSON.stringify(query_es)) 
            }
            let time
            if(payload.endTime && payload.endTime !='' && payload.startTime && payload.startTime != ''){
                time = { range: { oprationTime: {lt: new Date(payload.endTime).format('yyyy-MM-dd hh:mm:ss'), gt: new Date(payload.startTime).format('yyyy-MM-dd hh:mm:ss')} } }
                queryParams.es.query.bool.must.push(time)
            }
            queryParams.es.size =  payload.size ? payload.size : 20
            queryParams.es.from =  payload.from ? payload.from : 0
            queryParams.es.sort[0].oprationTime.order = payload.order ? payload.order : 'desc'
            queryParams.paths = paths
            console.log('paths_query',  queryParams.es)
            const data = yield call(queryES, queryParams)
            const values = []
            if (data.success) {
                if (data.hits && data.hits.hits) {
                    data.hits.hits.forEach(element => {
                        values.push(element._source)
                    });
                    yield put({
                        type: 'setState',
                        payload: {
                            list: values,
                            pagination: {
                                showSizeChanger: true,
                                showQuickJumper: true,
                                current: parseInt(payload.from/payload.size)+1 || 1,  //payload.from : 0   (payload.from/payload.size)+1 || 1
                                pageSize: payload.size || 20,
                                total: data.hits.total.value,
                                showTotal: total => `共 ${total} 条`,
                            },
                            es_q: queryParams.es
                        }
                    })
                }
            } else {
                throw data
            }
        },
        /**
         * 查询树结构的数据
         **/
        * queryTree({ payload }, { call, put }) {
            let es_querytree = { es: {}, paths: '' }
            es_querytree.es = JSON.parse(JSON.stringify(queryTree_es))
            if (payload.endTime) {
                let query = { range: { oprationTime: {lt: payload.endTime, gt: payload.startTime} } }
                es_querytree.es.query = query
            }
            let paths = ''
            if (payload.endTime !== 0 && payload.startTime !== 0 && payload.endTime !== undefined && payload.startTime !== undefined) {
                paths = ESFindIndex(Date.parse(payload.startTime), Date.parse(payload.endTime), 'prom-sra-', 'years', '')//按时间生成索引
            } else {
                paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'prom-sra-', 'years', '')
            }
            es_querytree.paths = paths
            console.log('paths', paths)
            const data = yield call(queryES, es_querytree)
            if (data.success) {
                yield put({
                    type: 'setState',
                    payload: {
                        treeValues: data.aggregations,
                        startTime: payload.startTime,
                        endTime: payload.endTime
                    },
                })
            } else {
                throw data
            }
        },
        /**
         *  查询操作前的操作
         */
        *queryPre({ payload }, { call, select, put }) {
            let startTime = yield select(({ audit }) => audit.startTime)
            let endTime = yield select(({ audit }) => audit.endTime)
            let paths = ''
            let queryParams = { es: {}, paths: '' }
            if (endTime !== "" && startTime !== "" && endTime !== undefined && startTime !== undefined) {
                paths = ESFindIndex(Date.parse(startTime), Date.parse(endTime), 'prom-sra-', 'years', '')//按时间生成索引
            } else {
                paths = ESFindIndex(Date.parse(new Date()) - 86400000, Date.parse(new Date()), 'prom-sra-', 'years', '')
            }
            queryParams.es = payload.es
            queryParams.paths = paths
            const data = yield call(queryES, queryParams)
            if (data.success) {
                if (data.hits && data.hits.hits) {
                    let aa = ''
                    if (data.hits.hits[0]) {
                        aa = data.hits.hits[0]._source
                    }
                    yield put({
                        type: 'setState',
                        payload: {
                            preData: aa
                        }
                    })
                }
            } else {
                throw data
            }
        }
    },

    reducers: {
        //这里控制弹出窗口显示 或者隐藏
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    },

}
