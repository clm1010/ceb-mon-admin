import { Button, Col, Row, Table } from 'antd'
import React from 'react'
import _columns from './columns'
const List = ({dispatch, loading, pagination, batchDelete, selectedRows, q, dataSource}) => {

  const onPageChange = (page) => {
    dispatch({
      type: 'jobs/query',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q: q === undefined ? '' : q,
      },
    })
    dispatch({
      type: 'jobs/setState',
      payload: {
        batchDelete: false,
        selectedRows: [],
      },
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let choosed = []
      selectedRows.forEach((object) => {
        choosed.push(object.uuid)
      })
      if (selectedRows.length > 0) {
        dispatch({
          type: 'jobs/setState',
          payload: {
            batchDelete: true,
            selectedRows:choosed,
          },
        })
      } else if (selectedRows.length === 0) {
        dispatch({
          type: 'jobs/setState',				//@@@
          payload: {
            batchDelete: false,
            selectedRows: [],
          },
        })
      }
    },
  }

  const showModal = (record) => {
    dispatch({
      type: 'jobs/findById',
      payload:{
        uuid : record.uuid
      }
    })
  }

  const columns = [..._columns]
    columns.push(
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        render: (text, record) => {
          return (<div>
            <Button size="default" type="ghost" shape="circle" icon="caret-right" disabled/>
            <Button size="default" type="ghost" shape="circle" icon="edit"  onClick={() => showModal(record)}/>
            <Button size="default" type="ghost" shape="circle" icon="delete" disabled/>
          </div>)
        },
      }
  )

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 1000 }}
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.uuid}
          size="small"
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default List
