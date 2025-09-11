import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'dva/router'
import {ozr} from '../../utils/clientSetting'

function patch ({ backRoute, dispatch }) {
  if (backRoute.length > 1) {                    // 将地址信息保存到sessionStrage中
    sessionStorage.setItem('data', JSON.stringify(backRoute))
  } else {
    backRoute = JSON.parse(sessionStorage.getItem('data'))
  }
  const click = (field) => {
    dispatch({
      type: 'totalnet/query',
      payload: {
        q: `monitoringTree.parentCode == ${field.code}`
      },
    })
    dispatch({
      type: 'totalnet/setState',
      payload: {
        backRoute: backRoute.slice(0, field.index),
      },
    })
  }

  const routItem = (route) => {                                              // 地址显示
    return route.map(item => {
      if (item.name === 'branchnet') {
        return <Breadcrumb.Item><Link to={'/branchnet'} style={{ color: '#e01083' }}>{ozr('totalnetFH')}</Link></Breadcrumb.Item>
      } else if (item.name === 'headOffice') {
        return <Breadcrumb.Item><Link to={'/totalnet'} style={{ color: '#e01083' }}> {ozr('totalnetZH')}</Link></Breadcrumb.Item>
      }
      if (item.code) {
        return <Breadcrumb.Item>
          <a style={{ color: '#e01083' }} onClick={() => click(item)}>{item.name}</a>  </Breadcrumb.Item>
      }
    })
  }
  const backRouteItem = routItem(backRoute)
  return (
    <div>
      <Breadcrumb style={{ fontSize: 15 }}>
        {backRouteItem}
      </Breadcrumb>
    </div>
  )
}

export default patch
