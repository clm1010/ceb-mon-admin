import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover } from 'antd'
import styles from './Header.less'
import Menus from './Menu'
import PasswordModal from '../../routes/layout/PasswordModal'
import UserInfo from '../../routes/layout/userInfo'
const SubMenu = Menu.SubMenu

const Header = ({
 dispatch, user, passwordVisible, userInfoVisible, logout, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu,
}) => {
  let handleClickMenu = (e) => { if (e.key === 'logout') { logout() } else if (e.key === 'change') { showPassword() } else if (e.key === 'changeUser') { showUpdateUser() } }
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
	const passwordProps = {
		dispatch,
        visible: passwordVisible,
        user,
    }
	const userInfoProps = {
		dispatch,
		visible: userInfoVisible,
		user,
	}
  const showPassword = () => {
		dispatch({
        type: 'app/updateState',
			  payload: {
				    passwordVisible: true,
			  },
        })
	}
  const showUpdateUser = () => {
  	dispatch({
  		type: 'app/updateState',
  		payload: {
  			userInfoVisible: true,
  		},
  	})
  }
  return (
    <div className={styles.header}>
      <PasswordModal {...passwordProps} />
      <UserInfo {...userInfoProps} />
      <div className={styles.hoverbutton}>
        {isNavbar
        ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div className={styles.button} onClick={switchSider}>
          <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
        </div>}
      </div>
      <div className={styles.rightWarpper}>

        <Menu mode="horizontal" onClick={handleClickMenu} style={{ lineHeight: '44px' }}>
          <SubMenu style={{
            float: 'right',
          }}
            title={<span > <Icon type="user" />
              {user.username}
            </span>}
          >
            <Menu.Item key="change">
              <Icon type="key" />修改密码
            </Menu.Item>
            <Menu.Item key="changeUser">
              <Icon type="solution" />修改个人信息
            </Menu.Item>
            <Menu.Item key="logout">
              <Icon type="poweroff" />注销
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
