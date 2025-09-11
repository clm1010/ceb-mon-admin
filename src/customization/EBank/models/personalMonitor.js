import queryString from "query-string";
import { query, create, remove, update, findById, queryTag, queryIndicator,ToolLable,PersonalCurve } from '../../../services/personalMonitor'
import { parse } from 'qs'

export default {

    namespace: 'personalMonitor',

    state: {
        list: [],																				//定义了当前页表格数据集合
        currentItem: {},																//被选中的行对象的集合
        modalVisible: false,														//弹出窗口是否可见
        modalType: 'create',														//弹出窗口的类型
        pagination: {																		//分页对象
            showSizeChanger: true,												//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
            current: 1,																		//当前页数
            total: null,																	//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
        },
        q: '',
        batchDelete: false,
        choosedRows: [],
        showCurve: false,
        listTag: [],
        fetchingtag: false,
        listIndicator: [],
        fetchingindicator: false,
        paramTag:{},
        cluster:[],
        namespace:[],
        service:[],
        CurveData:[]
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                const query = queryString.parse(location.search);
                if (location.pathname === '/personalMonitor') {
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                    dispatch({type:'queryTag',payload:{}})
                    dispatch({type:'queryIndicator',payload:{}})
                    dispatch({
                        type:'queryToolLable',
                        payload:{
                            query:"kube_service_info",
                            label:"cluster"
                        }
                    })
                    dispatch({
                        type:'queryToolLable',
                        payload:{
                            query:"kube_service_info",
                            label:"namespace"
                        }
                    })
                    dispatch({
                        type:'queryToolLable',
                        payload:{
                            query:"kube_service_info",
                            label:"service"
                        }
                    })
                }
            })
        },
    },

    effects: {
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
                        },
                        q: payload.q,
                    },
                })
            }
        },
        * create({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        * requery({ payload }, { put, select }) {
            let pageItem = yield select(({ personalMonitor }) => personalMonitor.pagination)
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
        * delete({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        * update({ payload }, { select, call, put }) {
            const uuid = yield select(({ personalMonitor }) => personalMonitor.currentItem.uuid)
            const newTool = { ...payload, uuid }
            const data = yield call(update, newTool)
            if (data.success) {
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        * findById({ payload }, { call, put }) {
            const data = yield call(findById, payload.currentItem)
            if (data.success && data.name) {
                yield put({
                    type: 'updateState',
                    payload: {
                        modalType: 'update',
                        currentItem: data,
                        modalVisible: true,
                    },
                })
            }
        },
        *queryTag({ payload }, { call, put }) {
            const data = yield call(queryTag, payload)
            if (data.success) {
                if(payload.q && payload.q.includes('uuid')){
                    yield put({
                        type: 'updateState',
                        payload: {
                            paramTag:data.content[0],
                        },
                    })
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            listTag: data.content,
                            fetchingtag:false
                        },
                    })
                }
            }
        },
        *queryIndicator({ payload }, { call, put }) {
            const data = yield call(queryIndicator, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        listIndicator: data.content
                    },
                })
            }
        },
         *queryToolLable({ payload }, { call, put, select }) {
            let cluster = yield select(({ personalMonitor }) => personalMonitor.cluster)
            let namespace = yield select(({ personalMonitor }) => personalMonitor.namespace)
            let service = yield select(({ personalMonitor }) => personalMonitor.service)
            const data = yield call(ToolLable, payload)
            if (data.msg=='success') {
                if(payload.label == 'cluster'){
                    cluster = data.values
                    yield put({ type: 'updateState',
                    payload: { cluster }
                })}
                if(payload.label == 'namespace'){
                    namespace = data.values
                    yield put({ type: 'updateState',
                    payload: { namespace }
                })}
                if(payload.label == 'service'){
                    service = data.values
                    yield put({type: 'updateState',
                    payload: {service }
                }) }
            }
        },
        *queryCurve({ payload }, { call, put, select }) {
            const data = yield call(PersonalCurve, payload)
            if (data.status === 'success') {
                yield put({
                    type:'updateState',
                    payload:{
                        CurveData:data.data.result
                    }
                })
            }
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload }
        },
    },

}