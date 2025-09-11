import { query, dwn,remove } from '../../../services/fileAssistant'
import { Modal, message } from 'antd'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'

export default {

    namespace: 'fileAssistant',

    state: {
        list: [],
        dataSource: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                //初次访问
                if (location.pathname.includes('/fileAssistant')) {
                    dispatch({
                        type: 'query',
                        payload: {},
                    })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put }) {
            // const data = yield call(query, qs.stringify(newPayload))
            const data = yield call(query, payload)
            if (data.success) {
                let dataSource = []
                data.data.forEach(element => {
                    let obj = {}
                    obj.name = element
                    dataSource.push(obj)
                });
                yield put({
                    type: 'setState',
                    payload: {
                        dataSource: dataSource,
                    },
                })
            }
        },

        * down({ payload }, { call, put }) {
            const data = yield call(dwn, payload)
        },
        * delete({ payload }, { call, put }) {
            const data = yield call(remove, payload)
            if (data.success) {
                message.success(data.data)
                yield put({ type: 'requery' })
            } else {
                throw data
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
        showModal(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
