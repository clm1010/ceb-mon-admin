import React from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
import _columns from '../Columns'
import Editable from './Editable'

const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, loading, monitorList, pagination, paginationMan, addMo, validateMO,
}) {
    const editableProps = {
        currentStep: 1,
        data:addMo,
        validateMO,
        dispatch
    }
    return (
        <Row gutter={24}>
            <Tabs >
                <TabPane tab={<span><Icon type="appstore" />监控对象已存在：请核对</span>} key="ruleInstance_1">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={_columns}
                            dataSource={validateMO}
                            pagination={pagination}
                            simple
                            rowKey={record => record.uuid}
                            size="small"
                        />
                    </Col>
                </TabPane>
                <TabPane tab={<span><Icon type="api" />新增监控对象，请核对，如有问题请修改</span>} key="ruleInstance_2">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Editable {...editableProps} />
                    </Col>
                </TabPane>
            </Tabs>
        </Row>
    )
}

export default list
