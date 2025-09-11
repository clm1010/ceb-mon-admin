
import { query, findById, create, remove, update, onDown, register, deregister, syncStatus, findRegion, getProjectsAndCluster, getNamespace, getServer, getPod ,syncSystem} from '../../../services/registerServices'
import { query as findAllApp } from '../../../services/appCategories'
import { calculatorProject } from '../../../services/autosearch'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
import { message } from 'antd'
/**
 * 监控配置/注册服务器
 * @namespace registerServices
 * @requires module:监控配置/注册服务器
 */
export default {
    namespace: 'registerServices',
    state: {
        q: '',	//URL串上的q=查询条件
        list: [],
        currentItem: {}, //被选中的单个行对象
        pagination: {																		//分页对象
            showSizeChanger: true,												//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
            current: 1,																		//当前页数
            total: 0,																			//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
        },
        modalVisible: false,
        modalType: 'create',
        choosedRows: [],
        batchDelete: false,
        //导入start
        moImportFileList: [],
        showUploadList: false,
        moImportResultVisible: false,
        moImportResultType: '',
        moImportResultdataSource: [],
        //导入end
        tempListMeta: [
            {
                index: 1,
                key: 'ump_project',
                value: '',
            },
        ],
        tempListChecks: [
            {
                index: 1,
                http: '',
                interval: '',
            },
        ],
        DrawerVisible: false,
        regColumns: ['id', 'name', 'tags', 'address', 'port', 'registerStatus'],
        DropdownVisiblie: false,
        serviceArea: [],
        projectsData: [],
        clusterData: [],
        namespaceData: [],
        serverData: [],
        podData: [],
        ports_: [],
        flag: false,
        appDatas:[],
        oneSystemEvaluate:false,
        fetchingApp:false,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                let query = location.query
                if (query === undefined) { query = queryString.parse(location.search) }
                if (location.pathname.includes('/registerServices')) {
                    dispatch({
                        type: 'query',
                        payload: query
                    })
                    // dispatch({
                    //     type:'getAllApp',
                    //     payload:{}
                    // })
                } else if (location.pathname.includes('/perRegisServer')) {
                    if (!query.q || query.q == '') {
                        query.q = "name=='*CDAMT-SUBNOA-MS-cdamt-df*';tags=='metrics-exporter'"
                    }
                    dispatch({
                        type: 'query',
                        payload: query
                    })
                    dispatch({
                        type: 'getProjectsAndCluster',
                        payload: {}
                    })
                }
            })
        },
    },

    effects: {
        /** 
         * 获取资源列表
         * 与后台交互, 调用接口/api/v1/rule-instances/，获取数据
         * @function registerServices.query
         * 
         */
        * query({ payload }, { call, put }) {
            const data = yield call(query, { ...payload })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        list: data.content,
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
        /** 
         * 查询数据
         * 刷新页面
         * @function registerServices.requery
         */
        * requery({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            }))
        },
        /** 
         * 创建数据
         * 刷新页面
         * @function registerServices.create
         */
        * create({ payload }, { call, put }) {
            const data = yield call(create, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        modalVisible: false,
                        isClose: true,
                    },
                })
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        /** 
        * 删除数据
        * 刷新页面
        * @function registerServices.delete
        */
        * delete({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        /** 
        * 更新数据
        * 刷新页面
        * @function registerServices.create
        */
        * update({ payload }, { select, call, put }) {
            const uuid = yield select(({ registerServices }) => registerServices.currentItem.uuid)
            const newPayload = { ...payload, uuid }
            const data = yield call(update, newPayload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        modalVisible: false,
                        isClose: true,
                    },
                })
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        /** 
         * 获取单个工具资源
         * 与后台交互, 调用接口/api/v1/tools/{id}，获取数据
         * @function registerServices.getToolById
         * 
         */
        * findById({ payload }, { call, put }) {
            const data = yield call(findById, payload.record)
            let tempListMeta = []
            let tempListChecks = []
            if (data.success) {
                let meta = data.meta
                let checks = data.checks
                let i = 0, j = 0
                /* 
                    对ump_project做特殊处理
                */
                let oo = {}
                oo.key = 'ump_project'
                oo.value = meta['ump_project']
                oo.index = ++i
                tempListMeta.push(oo)
                for (let key in meta) {
                    if (key !== 'ump_project') {
                        let obj = {}
                        obj.key = key
                        obj.value = meta[key]
                        obj.index = ++i
                        tempListMeta.push(obj)
                    }
                }

                yield put({
                    type: 'updateState',
                    payload: {
                        currentItem: data,
                        modalVisible: true,
                        tempListMeta,
                        // tempListChecks,
                        offMate: true,
                        offcheck: true,
                        modalType: 'update'
                    },
                })
            } else {
                throw data
            }
        },
        *onDown({ payload }, { call, put }) {
            const data = yield call(onDown, payload)
        },
        *register({ payload }, { call, put }) {
            const data = yield call(register, payload)
            if (data.success) {
                yield put({ type: 'requery' })
                message.success('注册成功')
            } else {
                throw data
            }
        },

        *deregister({ payload }, { call, put }) {
            const data = yield call(deregister, payload)
            if (data.success) {
                yield put({ type: 'requery' })
                message.success('注销成功')
            } else {
                throw data
            }
        },
        *syncStatus({ payload }, { call, put }) {
            const data = yield call(syncStatus, payload)
            if (data.msg == "success") {
                yield put({ type: 'requery' })
                message.success('同步成功')
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

        *getProjectsAndCluster({ payload }, { call, put }) {
            const data = yield call(getProjectsAndCluster, payload)
            const projectsData = []
            const clusterData = {}
            if (data.success) {
                data.data && data.data.Projects && data.data.Projects.items.forEach(item => {
                    projectsData.push(item.metadata.name)
                    clusterData[item.metadata.name] = (item.spec.clusters && item.spec.clusters.length > 0) ? item.spec.clusters.map(e => e.name) : []
                })
                yield put({
                    type: 'updateState',
                    payload: {
                        projectsData,
                        clusterData
                    }
                })
            } else {
                throw data
            }
        },

        *getNamespace({ payload }, { call, put }) {
            const data = yield call(getNamespace, payload)
            let namespaceData = []
            data.data.Namespaces && data.data.Namespaces.items.forEach(item => {
                namespaceData.push(item.metadata.name)
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        namespaceData
                    }
                })
            } else {
                throw data
            }
        },
        *getServer({ payload }, { call, put }) {
            const data = yield call(getServer, payload)
            let serverData = []
            const portObj = {}
            data.items.forEach(item => {
                serverData.push(item.metadata.name)
                portObj[item.metadata.name] = item.spec.ports
            })

            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        serverData,
                        portObj
                    }
                })
            } else {
                throw data
            }
        },
        *getPod({ payload }, { call, put }) {
            const data = yield call(getPod, payload)
            let podData = []
            data.items.forEach(item => {
                podData.push(item.metadata.name)
            })
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        podData
                    }
                })
            } else {
                throw data
            }
        },

        *getAllApp({ payload }, { call, put }) {
            const data = yield call(findAllApp, payload)
            if (data.success) {
                const filterData = data.content.filter(item=>item.englishCode)
                yield put({
                    type: 'updateState',
                    payload: {
                        appDatas:filterData,
                        fetchingApp:false
                    }
                })
            } else {
                throw data
            }
        },

        *syncSystem({ payload }, { call, put }) {
            const data = yield call(syncSystem, payload)
            if (data.success) {
                message.success('执行成功')
            } else {
                throw data
            }
        },
        *evaluate({ payload }, { call, put }) {
            const data = yield call(calculatorProject, payload)
            if (data.success) {
                message.success('执行成功')
            } else {
                throw data
            }
        }
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload }
        },
    },
}

