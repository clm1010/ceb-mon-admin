import { query, getOrgUser, getOrgAllUser, addOrgUser, remove } from '../../../services/orgOper'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'

export default {

    namespace: 'orgOper',

    state: {
        list: [],										//定义了当前页表格数据集合
        currentItem: {},									//被选中的单个行对象
        pagination: {									//分页对象
            showSizeChanger: true,						//是否可以改变 pageSize
            showQuickJumper: true, //是否可以快速跳转至某页
            showTotal: total => `共 ${total} 条`,		//用于显示数据总量
            total: null,									//数据总数？
            pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
            defaultPageSize: 10
        },
        userList: [],
        type: '',
        orgID: ''
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/orgOper') {
                    dispatch({
                        type: 'query',
                    })
                }
            })
        },
    },

    effects: {
        /* 
            获取org组
        */
        * query({ payload }, { call, put }) { //查询数据
            const data = yield call(query, payload) //与后台交互，获取数据
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        list: data.arr,
                    },
                })
            }
        },
        * requery({ payload }, { put }) {
            yield put(routerRedux.push({
                pathname: window.location.pathname,
                query: parse(window.location.search.substr(1)),
            }))
        },
        /* 
            获取org组下的所有用户信息
        */
        * getOrgAllUser({ payload }, { call, put }) {
            const data = yield call(getOrgAllUser, payload)
            yield put({
                type: 'querySuccess',
                payload: {
                    userList: data.arr,
                    modalVisible: true,
                    type: 'add',
                    orgID: payload.orgId
                },
            })
        },
        /* 
            获取org组下的用户信息添加到org组中
        */
        * addOrgUser({ payload }, { call, put, select }) {
            const data = yield call(addOrgUser, payload)
            const orgID = yield select(({ orgOper }) => orgOper.orgID)
            if (data.success) {
                if (data.status == 'SUCCESS') {
                    message.success('用户信息增加成功')
                    yield put({
                        type: 'getOrgAllUser',
                        payload: {
                            orgId: orgID,
                            username: ''
                        }
                    })
                } else {
                    message.error('用户信息增加失败')
                }
            } else {
                throw data
            }
        },
        /* 
            获取org组下的已有用户信息
        */
        * getOrgUser({ payload }, { call, put }) {
            const data = yield call(getOrgUser, payload)
            yield put({
                type: 'querySuccess',
                payload: {
                    userList: data.arr,
                    modalVisible: true,
                    type: 'delete',
                    orgID: payload.orgId
                },
            })
        },
        /* 
            删除org组下的用户信息
        */
        * deleteOrgUser({ payload }, { call, put, select }) { //查询数据
            const data = yield call(remove, payload) //与后台交互，获取数据
            const orgID = yield select(({ orgOper }) => orgOper.orgID)
            if (data.success) {
                if (data.status == 'SUCCESS') {
                    message.success('用户信息删除成功')
                    yield put({
                        type: 'getOrgUser',
                        payload: {
                            orgId: orgID,
                        }
                    })
                } else {
                    message.error('用户信息删除失败')
                }
            } else {
                throw data
            }
        },
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
