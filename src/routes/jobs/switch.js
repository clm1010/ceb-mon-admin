import React from 'react'
import { Switch, Row, Col, Button } from 'antd'

const switchs = ({ dispatch, loading, batchDelete, selectedRows}) => {

  const deleteJobs = () => {
    dispatch({
      type: 'jobs/delete',
      payload:selectedRows
    })
  }

  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col lg={24} md={24} sm={24} xs={24}>
        {/* <Button style={{ marginLeft: 8 }} size="default" type="primary" disabled >新建任务</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="primary" disabled>启停任务</Button>
        <Button style={{ marginLeft: 8 }} size="default" type="primary" disabled={!batchDelete} onClick={deleteJobs}>废弃任务</Button> */}
      </Col>
    </Row>
  )
}

export default switchs
