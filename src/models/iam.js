import { iamLogin } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'
import Cookie from '../utils/cookie'
import { sessionTime } from '../utils/config'
import queryString from "query-string";

export default {
  namespace: 'iam',
  state: {
    loginLoading: false,
    oLoad: true,
  },

  effects: {
    * iamLogin ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })

	    const data = yield call(iamLogin, payload)

      yield put({ type: 'hideLoginLoading' })
      if (data.success && data.token) {
      	//在sessionStorage内存储token，备用
        sessionStorage.setItem('token', data.token)
        yield put({ type: 'dataDict/queryAll' })

      	let cookie = new Cookie('cebcookie')
      	cookie.setCookie(data.token, sessionTime)
        const from = queryURL('from')
        yield put({ type: 'app/query' })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/'))
        }
      } else {
        sessionStorage.clear()
        let cookie = new Cookie('cebcookie')
        cookie.delCookie()
        window.location = `${location.origin}/login`
        throw data
      }
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/iam') {
          const query = queryString.parse(location.search)
          console.log('iam登录请求参数解析:',query)
          console.log('原始参数:', location.search)
          dispatch({
            type: 'iamLogin',
            payload: query,
          })
        }
      })
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
