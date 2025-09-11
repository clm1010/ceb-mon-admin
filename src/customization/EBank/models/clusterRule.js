import { query, update, remove, issue, getNormal, getBasics, check, getbyname } from '../../../services/clusterRule'
import { Modal, message } from 'antd'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";

export default {

    namespace: 'clusterRule',

    state: {
        list: [],
        currentItem: {},
        modalVisible: false,							//弹出窗口是否可见
        modalType: 'create',							//弹出窗口的类型
        pagination: {									//分页对象
            showSizeChanger: true,                      //是否可以改变 pageSize
            showTotal: total => `共 ${total} 条`,       //用于显示数据总量
            current: 1,                                 //当前页数
            total: null,								//数据总数？
            pageSizeOptions: ['10', '20', '50'],
        },
        normalTreeData: [],                             // 普通规则数据
        basicsTreeData: [],                             // 基础规则数据
        normalTreeSelected: [],                         // 基础规则数据选择
        basicsTreeSelected: [],                         // 基础规则数据选择

        normalList: [],
        basicsList: [],

        transfromLoading: true,
        RuleVisible: false,
        ruleType: '',
        proData_original: [],
        preData_original: [],
        proData_target: [],
        preData_target: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                let query = location.query
                if (query === undefined) { query = queryString.parse(location.search) }

                if (location.pathname === '/clusterRule') {
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put, select }) { //查询数据
            const data = yield call(query, payload)  //与后台交互，获取数
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.content,
                        pagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                            showSizeChanger: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '50'],
                        },
                        q: payload.q,
                    },
                })
            } else {
                throw data
            }
        },
        /*
            通过集群名称获取集群下完整信息
        */
        * getByname({ payload }, { call, put, select }) { //查询数据
            const data = yield call(getbyname, payload)  //与后台交互，获取数
            const item = yield select(({ clusterRule }) => clusterRule.currentItem)
            if (data.success) {
                item.normalRuleList = data.normalRuleList
                item.basicsRuleList = data.basicsRuleList
                yield put({
                    type: 'querySuccess',
                    payload: {
                        currentItem: item,
                        q: payload.q,
                        normalList: data.normalRuleList,
                        basicsList: data.basicsRuleList
                    },
                })
            } else {
                throw data
            }
        },
        /** 
         * 查询数据
         * 刷新页面
         * @function notNetDown.requery
         */
        * requery({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            }))
        },
        * update({ payload }, { select, call, put }) {
            const data = yield call(update, payload)
            if (data.success) {
                yield put({
                    type: 'setState',
                    payload: {
                        modalVisible: false,
                        normalList: [],
                        basicsList: [],
                    },
                })
                yield put({ type: 'requery' })
            } else {
                yield put({
                    type: 'setState',
                    payload: {
                        modalVisible: false,
                        normalList: [],
                        basicsList: [],
                    },
                })
                throw data
            }
        },

        * issue({ payload }, { call, put, select }) { //查询数据
            message.loading('正在下发,请稍后...', 0)
            const data = yield call(issue, payload)  //与后台交互，获取数据
            if (data.success) {
                message.destroy()
                message.success('操作完成，后台正在下发！')
            } else {
                message.destroy()
                throw data
            }
        },
        /**
         * 获取普通规则
         */
        * getRuleNormal({ payload }, { select, call, put }) {
            const data = yield call(getNormal, payload)
            if (data.success) {
                // const currentObj = yield select(({ clusterRule }) => clusterRule.currentItem)
                const normalList = yield select(({ clusterRule }) => clusterRule.normalList)

                // normalList = normalList ? normalList : currentObj.normalRuleList
                const proData_original = data.Formal
                for (let datas of proData_original) {
                    datas.key = datas.uuid
                }
                const preData_original = data.Testing
                for (let datas of preData_original) {
                    datas.key = datas.uuid
                }

                const proData_target = []
                proData_original.forEach(element => {
                    for (let obj of normalList) {
                        if (element.uuid === obj.uuid) proData_target.push(obj.uuid)
                    }
                });
                const preData_target = []
                preData_original.forEach(element => {
                    for (let obj of normalList) {
                        if (element.uuid === obj.uuid) preData_target.push(obj.uuid)
                    }
                });
                yield put({
                    type: 'setState',
                    payload: {
                        normalTreeData: data.Formal,
                        proData_original,
                        preData_original,
                        proData_target,
                        preData_target,
                        transfromLoading: false,
                        normalList,
                    },
                })
            } else {
                throw data
            }
        },
        /**
         * 获取基本规则
         */
        * getRuleBasics({ payload }, { select, call, put }) {
            const data = yield call(getBasics, payload)
            if (data.success) {
                // const currentObj = yield select(({ clusterRule }) => clusterRule.currentItem)
                const basicsList = yield select(({ clusterRule }) => clusterRule.basicsList)
                // basicsList = basicsList ? basicsList : currentObj.basicsRuleList

                const proData_original = data.Formal
                for (let datas of proData_original) {
                    datas.key = datas.uuid
                }
                const preData_original = data.Testing
                for (let datas of preData_original) {
                    datas.key = datas.uuid
                }

                const proData_target = []
                proData_original.forEach(element => {
                    for (let obj of basicsList) {
                        if (element.uuid === obj.uuid) proData_target.push(obj.uuid)
                    }
                });
                const preData_target = []
                preData_original.forEach(element => {
                    for (let obj of basicsList) {
                        if (element.uuid === obj.uuid) preData_target.push(obj.uuid)
                    }
                });

                yield put({
                    type: 'setState',
                    payload: {
                        basicsTreeData: data.Testing,
                        proData_original,
                        preData_original,
                        proData_target,
                        preData_target,
                        transfromLoading: false,
                        basicsList,
                    },
                })
            } else {
                throw data
            }
        },
        * check({ payload }, { call, put, select }) { //查询数据
            message.loading('正在校验,请稍后...', 0)
            payload.callback = () => {
                message.destroy()
            }
            const data = yield call(check, payload)  //与后台交互，获取数据

        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            return { ...state, ...action.payload }
        },
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    }
}
