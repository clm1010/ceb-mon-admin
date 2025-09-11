import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'dva/router'

function patch () {
  let backRoute
  backRoute = JSON.parse(sessionStorage.getItem('data'))
  const click = (field) => {
    sessionStorage.setItem('data', JSON.stringify(backRoute.slice(0, field.index)))
  }
  const routItem = (val) => {
    let data = 'branchnet'
    return val.map((item) => {
      if (item.name === 'branchnet') {
        return <Breadcrumb.Item><Link to="/branchnet" style={{ color: '#e01083' }}> 分行</Link></Breadcrumb.Item>
      } else if (item.name === 'headOffice') {
        data = 'totalnet'
        return <Breadcrumb.Item><Link to="/totalnet" style={{ color: '#e01083' }}> 总行</Link></Breadcrumb.Item>
      }
      if (item.code) {
        if (item.index === backRoute.length) {
          return (<Breadcrumb.Item> <span style={{ color: '#e01083' }}> {item.name}</span>
          </Breadcrumb.Item>)
        }
          return (<Breadcrumb.Item> <Link to={`/${data}?q= monitoringTree.parentCode ==${item.code}`} style={{ color: '#e01083' }} onClick={() => click(item)}>
            {item.name}
          </Link>
          </Breadcrumb.Item>)
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
