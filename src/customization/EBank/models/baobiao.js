import { querymenu, downLoad, getMes } from '../../../services/journaling'
import { message } from 'antd'

export default {

    namespace: 'baobiao',

    state: {
        treeDatas: [],
        reportMes:{}
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/formPresentationGroup') {
                    dispatch({ type: 'querymenu', payload: {} })
                }
            })
        },
    },

    effects: {
        * querymenu({ payload }, { call, put }) { //查询数据
            const data = yield call(querymenu, payload)
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        treeDatas: data.menu
                    }
                })
            } else {
                throw data
            }
        },
        * getMes({ payload }, { call, put }) { //查询数据
            const data = yield call(getMes, payload)
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        reportMes: data.arr[0]
                    }
                })
            } else {
                throw data
            }
        },
        *downLoad({ payload }, { call, put }) {
            const data = yield call(downLoad, payload)
            if (data.success && data.stateCode == 200) {
                window.open(data.remoteReporterFile)
              }else{
                message.error(data.errMsg)
              }
        },
        *delfile({ payload }, { call, put }) {
            const data = yield call(delFile, payload)
            if (data.success) {
                message.success('删除成功')
                yield put({
                    type: 'query',
                    payload: {}
                })
            } else {
                message.error('删除失败')
            }
        }
    },

    reducers: {
        //浏览列表
        querySuccess(state, action) {
            return { ...state, ...action.payload }
        },
    },
}
