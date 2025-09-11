import { query, create, remove, update, enable, disable } from '../services/label'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import queryString from "query-string";
import { message } from 'antd'
/**
 * 监控配置/策略实例管理 
 * @namespace label
 * @requires module:监控配置/策略实例管理
 * 
 */
export default {

    namespace: 'label',

    state: {
        list: [],																				//定义了当前页表格数据集合
        currentItem: {},																//被选中的单个行对象
        modalVisible: false,														//弹出窗口是否可见
        pagination: {									//分页对象
            showSizeChanger: true,						//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,			//用于显示数据总量
            current: 1,									//当前页数
            total: 0,										//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
        },
        modalType: 'create',														//弹出窗口的类型
        isClose: false,
        batchDelete: false,
        choosedRows: [],
        see: 'no',
        expand: true,
        q:'',
        groupUUID: [], //Item分组的信息
        inputKeyValue:'',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                const query = queryString.parse(location.search);
                if (location.pathname.includes('/labelGroup/label')) {
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { select, call, put }) {
            //新加的策略实例树部分（start）
            const groupuuids = yield select(({ label }) => label.groupUUID)
            let groupUUID = ''
            if (groupuuids && groupuuids.length > 0) {
                groupUUID = groupuuids[0]
            }
            const newdata = { ...payload, groupUUID }
            const data = yield call(query, newdata)//获取单个策略的方法   debugger暂时不删
            //新加的策略实例树部分（end）
            if (data.success) {
                //获取每一个策略实例对应的监控实例（end）
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.content,
                        pagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                        },
                        q: payload.q,	//把查询条件放到state中
                    },
                })
            }
        }, //query

        /** 
         * 新增资源
         * 与后台交互, 调用接口 /api/v1/policies/
         * @function policyInstance.create
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
        * requery({ payload }, { put, select }) {
            /* yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            })) */
            let pageItem = yield select(({ label }) => label.pagination)
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
        /**
         * 批量删除资源
         * 与后台交互 调用接口  /api/v1/policies/
         * @function policyInstance.delete
         */
        * delete({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        batchDelete: false,
                        isClose: false,
                    },
                })
                yield put({ type: 'requery' })
            } else {
                throw data
            }
        },
        /**
         * 编辑修改资源
         * 与后台交互 调用接口  /api/v1/policies/
         * @function label.update
         */
        * update({ payload }, { select, call, put }) {
            const id = yield select(({ label }) => label.currentItem.uuid)
            const newTool = { ...payload, id }
            const data = yield call(update, newTool)

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
        * enable({ payload }, { call, put }) {
            const data = yield call(enable, payload)
            if (data.success) {
                message.success('批量启用成功！')
                yield put({ type: 'requery' })
            }else{
                message.error('批量启用失败!')
            }
        },
        * disable({ payload }, { call, put }) {
            const data = yield call(disable, payload)
            if (data.success) {
                message.success('批量禁用成功！')
                yield put({ type: 'requery' })
            }else{
                message.error('批量禁用失败!')
            }
        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            const { list, pagination, q } = action.payload
            return {
                ...state,
                list,
                q,
                pagination: {
                    ...state.pagination,
                    ...pagination,
                },
            }
        },
        updateState(state, action) {
            return { ...state, ...action.payload }
        },
    },

}
