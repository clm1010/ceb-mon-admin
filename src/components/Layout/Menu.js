import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link, routerRedux } from 'dva/router'
import { arrayToTree, queryArray } from '../../utils'
//import menu from '../../utils/menu'
import pathToRegexp from 'path-to-regexp'
import './iconfonts.css'
import {getUrl,ozr} from '../../utils/clientSetting'

const Menus = ({
  siderFold, darkTheme, location, navOpenKeys, changeOpenKeys, menu,getgrafanaAdd
}) => {
  // 生成树状
  const menuTree = arrayToTree(menu.filter(_ => _.mpid !== -1), 'id', 'mpid')
  const levelMap = {}

  const getMenuDisplay = (item) => {
    if (ozr('id') === 'EBank'){
      switch (item.router) {
        case '/topoManager':
          return 'none'
        case '/dbwizard':
          return 'none'
        default:
          return ''
      }
    }
    if (ozr('id') === 'EGroup') {
      switch (item.router) {
        case '/branchview':
          return 'none'
        case '/xykfrontview':
          return 'none'
        case '/xykhistoryview':
          return 'none'
        case '/monitorFH':
          return 'none'
        case '/branchnet':
          return 'none'
        default:
          return ''
      }
    }
    
  }


  // 递归生成菜单
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {

        if (item.mpid) {
          levelMap[item.id] = item.mpid
        }

        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </span>}
          >

            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )

      }

      //因现场环境未接入性能数据，暂时隐藏首页的，全部用户不能查看首页
      if (item.icon && item.id && item.icon === 'home' && item.id === 1) {
        return null
      } else if (item.icon && item.id && item.icon === 'sync' && item.id === 3) {
        return null
      }
      if (item.router === '/oel'|| item.router === '/oelHint') {
        return (
          <Menu.Item key={item.id}>
            <a href={item.router} target="_blank" rel="opener">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/timeoutAlarm') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/historyview') {
        //const url = '/historyviewGroup?page=0&q=hiscope==\'hour\';(n_CustomerSeverity==1 or n_CustomerSeverity==2 or n_CustomerSeverity==3)&sort=firstOccurrence%2Cdesc'
        const url = '/historyviewGroup/historyviews?page=0&q=hiscope==\'hour\';(n_CustomerSeverity==1 or n_CustomerSeverity==2 or n_CustomerSeverity==3)&sort=firstOccurrence%2Cdesc'
        return (
          <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }}>
            <a href={url} target="_blank" rel="opener">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/u1Historyview') {
        //const url = '/u1Historyviews?page=0&q=hiscope==\'hour\';(n_CustomerSeverity==1 or n_CustomerSeverity==2 or n_CustomerSeverity==3)&sort=firstOccurrence%2Cdesc'
        const url = '/u1Historyviews/u1HistoryviewScend?page=0&q=hiscope==\'hour\';(n_CustomerSeverity==1 or n_CustomerSeverity==2 or n_CustomerSeverity==3)&sort=firstOccurrence%2Cdesc'
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/unclearAlarm') {
        return (
          <Menu.Item key={item.id}>
            <a href="/oelCust?q=Severity!=0 and N_RecoverType=1 and (N_MaintainStatus=1) and (N_CustomerSeverity=1 or N_CustomerSeverity=2 or N_CustomerSeverity=3)" target="_blank" rel="opener">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } 
      // else if (item.router === '/formPresentationGroup') {
      //   const url =getUrl(item.router)
      //   return (
      //     <Menu.Item key={item.id}>
      //       <a href={url} target="_blank">
      //         {item.icon && <Icon type={item.icon} />}
      //         {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
      //       </a>
      //     </Menu.Item>
      //   )
      // } 
      else if (item.router === '/systemsManagement') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/evaluate' || item.router === '/indicators') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/profile') {
        const url =getUrl(item.router)
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/zhNetwork') {
        const url =getUrl(item.router)
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/platOper') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id}>
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/xykhistoryview') {
        const url = '/historyviewGroup/xykhistoryviews?page=0&q=hiscope==\'hour\';(n_CustomerSeverity==1 or n_CustomerSeverity==2 or n_CustomerSeverity==3)&sort=firstOccurrence%2Cdesc'
        return (
          <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }} >
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/umdb') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }} >
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      } else if (item.router === '/skyWalking'){
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }} >
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      }else if (item.router === '/topoManager') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }} >
            <a href={url} target="_blank">
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      }else if (item.router === '/dmViewer') {
        const url = getUrl(item.router)
        return (
          <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }} >
            <a target="_blank" onClick = {(e)=>skipgrafana(e)}>  
            {/* <a href={url} target="_blank"> */}
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </a>
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={item.id} style={{ display: getMenuDisplay(item) }}>
          <Link to={item.router}>
            {item.icon && <Icon type={item.icon} />}
            {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
          </Link>
        </Menu.Item>
      )
    })
  }
  const menuItems = getMenus(menuTree, siderFold)

  // 保持选中
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !(navOpenKeys.indexOf(key) > -1))
    const latestCloseKey = navOpenKeys.find(key => !(openKeys.indexOf(key) > -1))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  const menuClick = (menu) => {

  }

  const skipgrafana = (e) =>{
    e.preventDefault()
    getgrafanaAdd()
  }

  let menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {}


  // 寻找选中路由
  let currentMenu
  let defaultSelectedKeys
  for (let item of menu) {
    if (item.router && pathToRegexp(item.router).exec(window.location.pathname)) {
      currentMenu = item
      break
    }
  }
  const getPathArray = (array, current, pid, id) => {
    let result = [String(current[id])]
    const getPath = (item) => {
      if (item && item[pid]) {
        result.unshift(String(item[pid]))
        getPath(queryArray(array, item[pid], id))
      }
    }
    getPath(current)
    return result
  }
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id')
  }
  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      onClick={menuClick}
      defaultSelectedKeys={defaultSelectedKeys}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  isNavbar: PropTypes.bool,
  handleClickNavMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Menus
