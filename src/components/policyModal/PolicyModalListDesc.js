import React from 'react'
import { Table, Modal, Row, Col } from 'antd'

function list ({
 dispatch, loading, dataSource, pagination, onPageChange, columns, scroll,
}) {
	let isLoading = false
/* 	for (let [key, value] of Object.entries(loading.effects)) {
		if (value) {
			isLoading = true
		}
	} */
  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: scroll }} //滚动条
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          // rowKey={record => record.uuid}
          size="small"
        />
      </Col>
    </Row>
  )
}

export default list
