import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Layout } from '../components'
import { classnames, config } from '../utils'
import { Helmet } from 'react-helmet'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
import EGroupCeb from '../components/Layout/EGroupCeb.ico'
import EBankCeb from '../components/Layout/EBankCeb.ico'
import { ConfigProvider } from 'antd';//国际化控件
import zhCN from 'antd/es/locale/zh_CN';//导入国际化包
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ozr } from '../utils/clientSetting'
import { companyImg } from '../utils/clientSetting'
moment.locale('zh-cn');//指定加载国际化目标

const { prefix } = config

const {
  Header, Bread, Footer, Sider, styles,
} = Layout
let lastHref

const App = ({
  children, location, dispatch, app, loading,
}) => {
  const {
    user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu,
  } = app

  const href = window.location.href

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    passwordVisible: app.passwordVisible,
    userInfoVisible: app.userInfoVisible,
    dispatch,
    menu,
    user,
    siderFold,
    location,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout() {
      dispatch({ type: 'app/logout' })
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys(openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const siderProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeTheme() {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys(openKeys) {
      sessionStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
    getgrafanaAdd() {
      dispatch({ type: 'app/getgrafanaAdd' })
    },
  }

  const breadProps = {
    menu,
  }

  const { iconFontJS, iconFontCSS } = config
  function getImg(img) {
    switch (img) {
      case 'logoimg':
        return companyImg('eCebIco')//titleIco
    }
  } 
  if (config.openPages && config.openPages.indexOf(window.location.pathname) > -1) {
    console.dir(children)
    return <div>
      <ConfigProvider locale={zhCN}>
      <Helmet>
           {/* <title>{ozr('name')}统一监控管理平台</title> */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={getImg('logoimg').default} type="image/x-icon" />
          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />} 
        </Helmet>
        {children}
      </ConfigProvider>
    </div>
  }
  return (
    <div>
      <ConfigProvider locale={zhCN}>
        <Helmet>
           <title>{ozr('name')}统一监控管理平台</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={getImg('logoimg').default} type="image/x-icon" />
          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />} 
        </Helmet>
        <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
          {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''}
          <div className={styles.main}>
            <Header {...headerProps} />
            <Bread {...breadProps} location={location} />
            <div className={styles.container}>
              <div className={styles.content}>
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </ConfigProvider>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ app, loading }) => ({ app, loading }))(App)
