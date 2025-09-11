import { query,downLoad,delFile } from '../../../services/monthreport'
import { message } from 'antd'

export default {

    namespace: 'monthreport',

    state: {
        filelist: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/monthreport') {
                    dispatch({ type: 'query' })
                }
            })
        },
    },

    effects: {
        * query({ payload }, { call, put }) { //查询数据
            const data = yield call(query, payload)
            if (data.success) {
                yield put({
                    type: 'querySuccess',
                    payload: {
                        filelist: data.arr
                    }
                })
            } else {
                throw data
            }
        },
        *downLoad({ payload }, { call, put }) {
            const data = yield call(downLoad, payload)
        },
        *delfile({ payload },{ call , put}){
            const data = yield call(delFile , payload)
            if(data.success){
                message.success('删除成功')
                yield put({
                    type:'query',
                    payload:{}
                })
            }else{
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
