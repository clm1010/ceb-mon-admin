import React from 'react'
import { Row, Col, Button } from 'antd'

function list ({
 dispatch, loading, dataSource, pagination, location,
}) {
  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ backgroundColor: 'white', marginTop: 8, marginBottom: 8 }}>
          <Button icon="pause" />
        </div>
      </Col>
    </Row>
  )
}

export default list
