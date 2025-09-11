import { query, update, move } from '../services/collector'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'
import queryString from "query-string";
export default {

    namespace: 'collector',

    state: {
        q: '',					//URL串上的q=查询条件
        list: [],				//定义了当前页表格数据集合
        currentItem: {},		//被选中的行对象的集合
        modalVisible: false,
        pagination: {					//分页对象
            showSizeChanger: true,		//是否可以改变 pageSize
            showQuickJumper: true,      //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,			//用于显示数据总量
            current: 1,									//当前页数
            total: 0,										//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100'],
        },
        batchDelete: false,
        choosedRows: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/collector') {
                    let query = location.query
                    if (query === undefined) {
                        query = queryString.parse(location.search);
                    }
                    dispatch({
                        type: 'query',
                        payload: query,
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { put, call }) {
            const data = yield call(query, payload)
            if (data.success) {
                yield put({
                    type: 'setState',
                    payload: {
                        list: data.content,
                        pagination: {
                            current: data.page.number + 1 || 1,
                            pageSize: data.page.pageSize || 10,
                            total: data.page.totalElements,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: ['10', '20', '30', '40', '100'],
                        },
                        q: payload.q,
                    },
                })
            } else {
                message.error('服务器接口异常！')
            }
        },
        * update({ payload }, { put, call }) {
            const data = yield call(update, payload)
            if (data.success) {
                message.success('更新成功！')
                yield put({ type: 'requery' })
                yield put({
                    type: 'setState',
                    payload: {
                        modalVisible: false,
                    },
                })
            } else {
                message.error('服务器接口异常！')
            }
        },
        * delete({ payload }, { put, call }) {
            const data = yield call(move, payload)
            if (data.success) {
                message.success('删除成功')
                yield put({ type: 'requery' })
            } else {
                message.error('删除成功失败')
            }
        },
        * requery({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            }))
        },
    },

    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
