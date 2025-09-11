import { routerRedux } from 'dva/router'
import { entrys, iamLogins } from '../services/login'
import Cookie from '../utils/cookie'
import { sessionTime, myCompanyName } from '../utils/config'

export default {
    namespace: "entry",
    state: {
        aa: 1,
        entryUrl: '',
        innerText: '',
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if ('EGroup' === myCompanyName) {
                    if (location.pathname == "/oauth-sso/entry") {
                        dispatch({
                            type: 'query',
                        })
                    } else if (location.pathname == "/oauth-sso/login") {
                        dispatch({
                            type: 'login',
                            payload: location.search
                        })
                    }
                }
            })
        }
    },
    effects: {
        * query({ payload }, { call, put }) {
            const data = yield call(entrys)
            if (data.success) {
                yield put({
                    type: 'setState',
                    payload: {
                        entryUrl: data.value
                    }
                })
            }
        },
        * login({ payload }, { call, put }) {
            const data = yield call(iamLogins, payload)
            if (data.key == "success") {
                sessionStorage.setItem('token', data.data)
                yield put({ type: 'dataDict/queryAll' })
                let cookie = new Cookie('cebcookie')
                cookie.setCookie(data.data, sessionTime)
                yield put({ type: 'app/query' })
                yield put(routerRedux.push(data.value))
            } else if (data.key == "error") {
                yield put({
                    type: 'setState',
                    payload: {
                        innerText: data.value
                    }
                })
            }
        }
    },
    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
        },
    }
}