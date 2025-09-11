import React from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
import _columns from '../Columns'

const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, loading, monitorList, pagination, paginationMan
}) {


    return (
        <Row gutter={24}>
            <Tabs >
                {/*<TabPane tab={<span><Icon type="appstore" />存在监控</span>} key="ruleInstance_1">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={_columns}
                            dataSource={monitorList.exists}
                            // loading={loading}
                            pagination={pagination}
                            simple
                            rowKey={record => record.uuid}
                            size="small"
                        />
                    </Col>
                </TabPane>*/}
                <TabPane tab={<span><Icon type="api" />不存在监控</span>} key="ruleInstance_2">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={_columns}
                            dataSource={monitorList.notExists}
                            // loading={loading}
                            pagination={paginationMan}
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
