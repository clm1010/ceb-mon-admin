import React from 'react'
import { Table, Col , Row} from 'antd'

const list = ({ dispatch, pagination, dataSource, condition, loading }) => {
  const columns = [
    {
      title: 'IP',
      dataIndex: 'source_ip',
      key: 'source_ip',
      width:'15%'
    }, {
      title: '内容',
      dataIndex: 'message',
      key: 'message',
      width:'70%'
    }, {
      title: '时间',
      dataIndex: 'systime',
      key: 'systime',
      width:'15%'
    }
  ]

  const onPageChage = (page) => {
    condition.page.size = page.pageSize
    condition.page.current = page.current - 1
    condition.page.from = (page.current - 1) * page.pageSize
    dispatch({
      type: 'qhNetLog/query',
      payload: condition
    })
  }

  return (
    <Row gutter={24} style={{ marginTop: 12 }}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onPageChage}
          loading={loading}
          simple
          bordered
        />
      </Col>
    </Row>
  )
}
export default list
