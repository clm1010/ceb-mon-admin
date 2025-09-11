import React from 'react'
import { Table, Row, Col, List, Tabs, Icon, Avatar } from 'antd'
import _columns from '../Columns'

const TabPane = Tabs.TabPane

function ThirdForm({
    dispatch, pagination, existMoint, importItem,
}) {
    const coluns = [
        {
            key: 'branch',
            dataIndex: 'branch',
            title: '机构',
            width: '10%',
        },
        {
            key: 'floatIP',
            dataIndex: 'floatIP',
            title: '浮动ip',
        },
        {
            key: 'hostIP',
            dataIndex: 'hostIP',
            title: '主机ip',
        },
        {
            key: 'httpCli',
            dataIndex: 'httpCli',
            title: 'httpCli',
        },
        {
            key: 'instance',
            dataIndex: 'instance',
            title: '实例',
        },
        {
            key: 'interfacePro',
            dataIndex: 'interfacePro',
            title: 'interfacePro',
        },
        {
            key: 'moipaddress',
            dataIndex: 'moipaddress',
            title: 'moipaddress',
        },
        {
            key: 'nodeName',
            dataIndex: 'nodeName',
            title: 'nodeName',
        },
        {
            key: 'port',
            dataIndex: 'port',
            title: '端口',
        },
        {
            key: 'resourcePool',
            dataIndex: 'resourcePool',
            title: '资源池',
        },
    ]
    return (
        <Row gutter={24}>
            <Tabs >
                <TabPane tab={<span><Icon type="appstore" />未监控</span>} key="third_1">
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Table
                            bordered
                            columns={coluns}
                            dataSource={importItem}
                            simple
                            rowKey={record => record.uuid}
                            size="small"
                            pagination={false}
                        />
                    </Col>
                </TabPane>
                <TabPane tab={<span><Icon type="appstore" />已监控</span>} key="third_2">
                    <Col span={16} offset={6}>
                        <List
                            itemLayout='horizontal'
                            dataSource={existMoint}
                            renderItem={item => <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src='#' />}
                                    title={item.hostIP}
                                    description={item.msg}
                                />
                            </List.Item>}
                        />
                    </Col>
                </TabPane>
            </Tabs>
        </Row>
    )
}

export default ThirdForm
