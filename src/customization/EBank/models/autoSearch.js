import { query, clusertquery, namespacequery, servicequery, monitorTagquery, querySuffix, onDown, projectquery } from '../../../services/autosearch'
import { getProjectsAndCluster, getNamespace, getServer, getPod } from '../../../services/registerServices'
import { Modal, message } from 'antd'
export default {

    namespace: 'autoSearch',

    state: {
        project: [],   // 应用系统
        clusert: [],
        nameSpace: [], //选中的节点
        service: [], //选中的节点key值
        monitorTag: [],
        result: [],
        dataSource: [],   //条件数据
        urlSuffix: [],
        qContion: {},    // 保存查询条件
        pagination: {									//分页对象
            showSizeChanger: true,                      //是否可以改变 pageSize
            showTotal: total => `共 ${total} 条`,       //用于显示数据总量
            current: 1,                                 //当前页数
            total: null,								//数据总数？
            pageSizeOptions: ['10', '20', '50'],
        },
        clusterData: {}
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/autoSearch') {
                }
            })
        },
    },

    effects: {
        * queryProject({ payload }, { call, put, select }) { //查询集群信息
            // let data
            // if (payload.env == '2') {
            //     data = yield call(getProjectsAndCluster, payload)  //与后台交互，获取数据
            // } else {
            //     data = yield call(projectquery, payload)  //与后台交互，获取数据
            // }
            const data = yield call(projectquery, payload)  //与后台交互，获取数据
            if (data.success && data.data) {
                // if (payload.env == '2') {
                //     const project = []
                //     const clusterData = {}
                //     data.data.Projects && data.data.Projects.items.forEach(item => {
                //         project.push(item.metadata.name)
                //         clusterData[item.metadata.name] = (item.spec.clusters && item.spec.clusters.length > 0) ? item.spec.clusters.map(e => e.name) : []
                //     })
                //     yield put({
                //         type: 'querySuccess',
                //         payload: {
                //             project: project,
                //             clusterData: clusterData
                //         },
                //     })
                // } else {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        project: data.data
                    },
                })
                // }
            } else if (data.retCode != 0 && data.data == null) {
                message.error(data.retMsg)
            }
        },
        * queryCluster({ payload }, { call, put, select }) { //查询集群信息
            // if (payload.env == 2) {
            //     let cluster = yield select(({ autoSearch }) => autoSearch.clusterData)
            //     yield put({
            //         type: 'querySuccess',
            //         payload: {
            //             clusert: cluster[payload.project]
            //         },
            //     })
            // } else {
            const data = yield call(clusertquery, payload)  //与后台交互，获取数据
            if (data.success && data.data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        clusert: data.data
                    },
                })
            } else if (data.retCode != 0 && data.data == null) {
                message.error(data.retMsg)
            }
            // }
        },
        * queryNameSpace({ payload }, { call, put, select }) { //获取集群下命名空间
            // let data
            // if (payload.env == '2') {
            //     data = yield call(getNamespace, payload)  //与后台交互，获取数据
            //     if (data.success && data.data) {
            //         let namespaceData = []
            //         data.data.Namespaces && data.data.Namespaces.items.forEach(item => {
            //             namespaceData.push(item.metadata.name)
            //         })
            //         yield put({
            //             type: 'querySuccess',
            //             payload: {
            //                 nameSpace: namespaceData
            //             },
            //         })
            //     }
            // } else {
            const data = yield call(namespacequery, payload)  //与后台交互，获取数据
            if (data.success && data.data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        nameSpace: data.data
                    },
                })
            } else if (data.retCode != 0 && data.data == null) {
                message.error(data.retMsg)
            }
            // }

        },
        * queryService({ payload }, { call, put, select }) { //查询服务信息
            const data = yield call(servicequery, payload)  //与后台交互，获取数据
            if (data.success && data.data) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        service: data.data
                    },
                })
            } else if (data.retCode != 0 && data.data == null) {
                message.error(data.retMsg)
            }
        },

        * queryTest({ payload }, { call, put, select }) { //测试分布式监控效果
            const data = yield call(query, payload)  //与后台交互，获取数据
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        dataSource: data.content,
                        qContion: payload.qContion,
                        pagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50'],
                        },
                    },
                })
            }
        },
        * onExport({ payload }, { call, put, select }) { //测试分布式监控效果
            const data = yield call(onDown, payload)  //与后台交互，获取数据
        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            return { ...state, ...action.payload }
        },

    },
}