import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import fenhang from '../../../utils/fenhang'

import '../ellipsis.css'

const confirm = Modal.confirm

function list ({
                 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
               }) {

  let maps = new Map()
  fenhang.forEach((obj, index) => {
    let keys = obj.key
    let values = obj.value
    maps.set(keys, values)
  })


  const columns = [
    {
      title: '分行名称',
      dataIndex: 'branch',
      key: 'branch',
      render: (text, record) => {
        let typename = maps.get(text)
        return typename
      },
    },
    {
      title: '发现设备数',
      dataIndex: 'total',
      key: 'total'
    },
    {
      title: '发现设备数占总设备数比例',
      dataIndex: 'percentage',
      key: 'percentage'
    }
  ]

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 980 }} //滚动条
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          simple
          rowKey={record => record.uuid}
          size="small"
        />
      </Col>
    </Row>
  )
}

export default list
