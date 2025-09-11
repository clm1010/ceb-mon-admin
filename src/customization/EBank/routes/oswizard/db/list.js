import React from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
import _columns from '../Columns'

const TabPane = Tabs.TabPane

function list({
    dispatch, loading, monitorList, pagination, paginationMan, MOData,
}) {

    return (
        <Row gutter={24}>
            <Tabs >
                <TabPane tab={<span><Icon type="appstore" />未监控</span>} key="_1">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={_columns}
                            dataSource= {MOData}
                            pagination={pagination}
                            simple
                            rowKey={record => record.uuid}
                            size="small"
                        />
                    </Col>
                </TabPane>
                <TabPane tab={<span><Icon type="appstore" />已监控</span>} key="_2">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={_columns}
                            dataSource= {MOData}
                            pagination={pagination}
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
