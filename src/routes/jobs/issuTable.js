import {  Col, Row, Table } from 'antd'
import React from 'react'
import columns from './issuColumns'

const issuTable = ({dispatch, loading, pagination, mos, issueMotoInsts }) => {

  const expandedRowRender = ( record, index, indent, expanded ) => {
    const columns = [
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '分行', dataIndex: 'branch', key: 'branch' }
    ];
    return <Table columns={columns} bordered size="small" simple dataSource={issueMotoInsts[index].instances} pagination={false} />;
  }

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 1000 }}
          bordered
          columns={columns}
          dataSource={mos}
          expandedRowRender={expandedRowRender}
          loading={loading}
          pagination={pagination}
          simple
          rowKey={record => record.uuid}
          size="small"
        />
      </Col>
    </Row>
  )
}

export default issuTable
