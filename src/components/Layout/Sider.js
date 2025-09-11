import React from 'react'
import PropTypes from 'prop-types'
import styles from './Layout.less'
import logoStyles from './logo.css'
import { config } from '../../utils'
import Menus from './Menu'
import {companyImg} from '../../utils/clientSetting'
import {ozr} from '../../utils/clientSetting'
import { Link } from 'dva/router'
const Sider = ({
 siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu,getgrafanaAdd
}) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
    getgrafanaAdd
  }

  const styleDetails = {
    overflow: 'auto', left: 0, height: '100vh',
  }

  function getImg(img){
    switch (img) {
      case 'logoslider':
        return companyImg('eLogoSlider')
    }
  }

  return (
    <div style={siderFold ? {} : styleDetails}>
      <Link to='/welcome'>
        <div className={styles.logo}>
        <div style={{ height: '8px' }} />
        <span className={logoStyles.ceb_logo}><img src={getImg('logoslider').default} /></span>
        {siderFold ? '' :
        <span className={logoStyles.ceb_logo_text}>
          <div className={darkTheme ? styles.bank_name_white : styles.bank_name_black} style={{ color: '#ffffff' }}>{ozr('name')}</div>
          <hr color="#ffffff" />
          <div className={darkTheme ? styles.system_name_white : styles.system_name_black} style={{ color: '#ffffff' }}>{config.system_name}</div>
        </span>}
      </div>
      </Link>
      <Menus {...menusProps} />
      {/*
        *
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />Switch Theme</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="Dark" unCheckedChildren="Light" />
      </div> : ''}]
      */}
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
