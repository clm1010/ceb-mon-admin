import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'dva/router'

function patch ({ backRoute }) {
    console.log('backRoute : ', backRoute)
    let data = backRoute
    let val = []
    if (backRoute.length > 0) {
        let val = JSON.stringify(backRoute)
        sessionStorage.setItem('data', val)
        data = backRoute.slice(0, 6)
    } else {
        val = JSON.parse(sessionStorage.getItem('data'))
        data = val.slice(0, 6)
    }

    const routItem = (val) => {
        return val.map((item) => {
            if (item.name == 'branchnet') {
                return <Breadcrumb.Item ><Link to="/branchnet" style={{ color: '#e01083' }}> 分行</Link></Breadcrumb.Item>
            } else if (item.name == 'headOffice') {
                return <Breadcrumb.Item><Link to="/totalnet" style={{ color: '#e01083' }}> 总行</Link></Breadcrumb.Item>
            }
            if (item.appCode) {
                return <Breadcrumb.Item> <Link to={`/${item.name}/${item.appCode}`} style={{ color: '#e01083' }}> {item.appName}</Link> </Breadcrumb.Item>
            }
        })
    }
    const backRouteItem = routItem(data)

    return (
      <div>
        <Breadcrumb style={{ fontSize: 15 }}>
          {backRouteItem}
        </Breadcrumb>
      </div>
  )
}

export default patch
