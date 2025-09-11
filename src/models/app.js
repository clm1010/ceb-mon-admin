import { logout, changePassword ,getgrafanaAdd} from '../services/app'
import { update } from '../services/userinfo'
import { getUser } from '../services/login'
import { routerRedux } from 'dva/router'
import { config } from '../utils'
import { message } from 'antd'
import Cookie from '../utils/cookie'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menuPopoverVisible: false,
    siderFold: sessionStorage.getItem(`${prefix}siderFold`) === 'true',
    //darkTheme: sessionStorage.getItem(`${prefix}darkTheme`) === 'true',
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(sessionStorage.getItem(`${prefix}navOpenKeys`)) || [],
    menu: [],
    alarmApplyFilter: [],
	passwordVisible: false,
	userInfoVisible: false,
  },
  subscriptions: {

    setup ({ dispatch, history }) {
      
      if (window.location.pathname === '/' && sessionStorage.getItem('user') === null) {	//当用户第一次访问应用地址，跳转到登录页面
				//window.location = `${location.origin}`
			} else if (window.location.pathname !== '/iam' && window.location.pathname !== '/oauth-sso/entry' && window.location.pathname !== '/oauth-sso/login') {
			  dispatch({
          type: 'query',
        })
      }
/*
      dispatch({
        type: 'query',
      })

      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }

      history.listen(location => {
      	if (window.location.pathname === '/roles') { // '/'
          dispatch({
            type: 'query',
          })
        }
      })
      */
    },
  },
  effects: {

    * query ({
      payload,
    }, { call, put }) {
      
    const data = yield call(getUser, payload)

    if (data.uiPermissions !== undefined) {
      data.uiPermissions.sort((a, b) => (a.id < b.id ? -1 : 1))
    }
      if (data.success && data.user) {
        //将用户信息存入本地

        sessionStorage.setItem('user', JSON.stringify(data.user))
        sessionStorage.setItem('alarmApplyFilter', JSON.stringify(data.alarmApplyFilter))
        yield put({
          type: 'querySuccess',
          payload: {
          	user: data.user,
          	menu: data.uiPermissions,
          	alarmApplyFilter: data.alarmApplyFilter,
          },
        })
        if (window.location.pathname === '/login') {
          yield put(routerRedux.push('/'))
        } else if (window.location.pathname === '/') {
          yield put(routerRedux.push('/welcome'))
        }
      } else if (window.location.pathname !== '/login') {
          let from = window.location.pathname
          if (window.location.pathname === '/' || window.location.pathname === '/iam') {
            from = '/'
          }
          window.location = `${location.origin}/`
          //window.location = `${location.origin}/login?from=${from}`
        } else if (window.location.pathname === '/login') {
          window.location = `${location.origin}/`
        }
        
      },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, payload)
      //if (data.success) {
      sessionStorage.clear()
      let cookie = new Cookie('cebcookie')
      cookie.delCookie()
      window.location = `${location.origin}/`
      window.name = '';
      //yield put({ type: 'query' })
      //} else {
      //  throw (data)
      //}
    },

    * changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },
	* changePassword ({ payload }, { select, call, put }) {
      const data = yield call(changePassword, payload)
      if (data.success) {
				message.info('修改成功！')
	      sessionStorage.clear()
	      window.location = `${location.origin}`
        yield put({ type: 'updateSuccess' })
      } else {
        throw data
      }
    },
	* update ({ payload }, { call, put }) {
		const data = yield call(update, payload.info)
		if (data.success) {
			message.info('修改成功！')
			window.location = `${location.origin}`
     	yield put({ type: 'updateSuccess' })
		}
	},

  * getgrafanaAdd ({ payload }, { call, put }) {
      const user = JSON.parse(sessionStorage.getItem('user'))
      const newPayload = Object.assign({},payload)
      newPayload.username = user.username
      const data = yield call(getgrafanaAdd, newPayload)
      if (data.success) {
        window.open(data.url)
      }else{
        message.error("获取granfana地址失败")
      }
  },

  },
  reducers: {
    querySuccess (state, action) {
    	const { user, menu, alarmApplyFilter } = action.payload
      return {
        ...state,
        user,
        menu,
        alarmApplyFilter,
      }
    },
	updateSuccess (state, action) {
      return {
        ...state,
        passwordVisible: false,
        userInfoVisible: false,
      }
    },

    switchSider (state) {
      sessionStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      sessionStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },
	updateState (state, action) {
      return { ...state, ...action.payload }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
