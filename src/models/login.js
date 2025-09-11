import { login, iamStates } from '../services/login'
import { query } from '../services/updateHistorys'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'
import Cookie from '../utils/cookie'
import { sessionTime, myCompanyName } from '../utils/config'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    oLoad: true,
    notifications: [],
    umpState: true,           //应急登陆状态，集团IAM为false，ump登陆为true
    redirecUrl: '',
    entryUrl: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        //初次访问
        if ('EGroup' === myCompanyName) {
          if (location.pathname == "/") {
            dispatch({
              type: 'iamState',
              payload: {},
            })
          }
        }
      })
    }
  },

  effects: {
    * login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success && data.token) {
        // 在sessionStorage内存储token，备用
        sessionStorage.setItem('token', data.token)
        yield put({ type: 'dataDict/queryAll' })

        let cookie = new Cookie('cebcookie')
        cookie.setCookie(data.token, sessionTime)
        const from = queryURL('from')
        yield put({ type: 'app/query' })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/welcome'))
        }
      } else {
        throw data
      }
    },
    * iamState({ payload }, { call, put }) {
      const data = yield call(iamStates, payload)
      if (data.success) {
        if (data.redirect != '') {
          yield put({
            type: 'querySuccess',
            payload: {
              umpState: data.state,
              redirecUrl: data.redirect,
            }
          })
        }
      } else {
        yield put({ type: 'app/logout' })
      }
    },
    * notifications ({ payload }, { call, put }) {
    	const data = yield call(query, payload)
    	if (data.success) {
    		sessionStorage.setItem('info', data.content)
    		yield put({
    			type: 'querySuccess',
    			payload: {
    				notifications: data.content,
    			},
    		})
    	}
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
    querySuccess (state, action) {
      return { ...state, ...action.payload }
    },
  },
}
