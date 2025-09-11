import React from 'react'
import { Table, Col } from 'antd'

const list = ({ dispatch, pagination, dataSource, condition, loading }) => {
  const columns = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (text, record) => {
        return <div>{text}</div>
      },
    }, {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => {
        return <div>{text}</div>
      },
    }, {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render: text => {
        return new Date(Number(text)).format('yyyy-MM-dd hh:mm:ss')
      },
    }, {
      title: '类型',
      dataIndex: 'action',
      key: 'action',
      render: text => <div> {text} </div>,
    }, {
      title: '操作',
      dataIndex: 'api',
      key: 'api',
      render: text => <div> {text} </div>,
    }, {
      title: '用户ip',
      dataIndex: 'clientIp',
      key: 'clientIp',
      render: (text, record) => {
        return <div>{text}</div>
      },
    }, {
      title: '服务ip',
      dataIndex: 'ipaddress',
      key: 'ipaddress',
      render: (text, record) => {
        return <div>{text}</div>
      },
    }
  ]

  const onPageChage = (page) => {
    condition.page.size = page.pageSize
    condition.page.current = page.current - 1
    condition.page.from = (page.current - 1) * page.pageSize
    dispatch({
      type: 'auditLog/query',
      payload:condition
    })
  }

  return (
    <div>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          columns={columns}
          scroll={{ y: 600, x: 1200 }}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onPageChage}
          loading={loading}
          simple
          bordered
          size="middle"
          expandedRowRender={record => <p style={{ margin:0}}> { record.message } </p>}
        />
      </Col>
    </div>
  )
}
export default list
