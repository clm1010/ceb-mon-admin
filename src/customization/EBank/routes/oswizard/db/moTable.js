import React from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
import _columns from '../Columns'

const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, MOData,
}) {

    return (
        <Row gutter={24}>
            <Tabs >
                <TabPane tab={<span><Icon type="appstore" />监控对象已存在：请核对</span>} >
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={_columns}
                            dataSource= {MOData}
                            pagination={false}
                            simple
                            rowKey={record => record.uuid}
                            size="small"
                        />
                    </Col>
                </TabPane>
            </Tabs>
        </Row>
    )
}

export default list
