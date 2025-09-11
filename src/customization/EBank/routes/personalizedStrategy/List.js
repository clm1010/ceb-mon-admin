import React from 'react'
import { Table, Row, Col, Button, Tag, Modal, Tooltip, Icon, Input } from 'antd'
import './List.less'
const confirm = Modal.confirm

function list({ dispatch, loading, dataSource, pagination, q }) {

    const onSee = (record) => {
        dispatch({
            type: 'personalizedStrategy/querySuccess',
            payload: {
                currentItem: record,
                modalVisible: true
            },
        })
    }


    const columns = [
        // {
        //     title: 'alertMsg',
        //     dataIndex: 'alertMsg',
        //     key: 'alertMsg',
        //     width:300
        // },
        {
            title: '集群',
            dataIndex: 'clusters',
            key: 'clusters',
            width: 300
        },
        {
            title: '持续时间',
            dataIndex: 'duration',
            key: 'duration',
        },
        // {
        //     title: 'indicator',
        //     dataIndex: 'indicator',
        //     key: 'indicator',
        //     width:500
        // },
        {
            title: '操作',
            dataIndex: 'operator',
            key: 'operator',
            render: (text, record) => {
                let op = ''
                switch (text) {
                    case 'EQUAL': op = '='
                        break;
                    case 'NOT_EQUAL': op = '!='
                        break;
                    case 'GREATER_THAN': op = '>'
                        break;
                    case 'GREATER_THAN_OR_EQUAL': op = '>='
                        break;
                    case 'LESS_THAN': op = '<'
                        break;
                    case 'LESS_THAN_OR_EQUAL': op = '<='
                        break;
                    default:
                        break;
                }
                return op
            }
        },
        // {
        //     title: 'promql',
        //     dataIndex: 'promql',
        //     key: 'promql',
        //     width:400
        // },
        {
            title: '规则状态',
            dataIndex: 'ruleStatus',
            key: 'ruleStatus',
            render: (text, record) => {
                let status = ''
                switch (text) {
                    case 'ISSUED': status = '下发'
                        break;
                    case 'CREATE': status = '新增'
                        break;
                    case 'OFFLINE': status = '下线'
                        break;
                    default:
                        break;
                }
                return status
            }
        },
        {
            title: '服务类型',
            dataIndex: 'serviceType',
            key: 'serviceType',
        },
        {
            title: '级别',
            dataIndex: 'severity',
            key: 'severity',
        },
        {
            title: '阈值',
            dataIndex: 'threshold',
            key: 'threshold',
        },
        {
            title: '操作',
            width: 150,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button size="default" type="link" onClick={() => onSee(record)} >查看</Button>
                </div>)
            },
        },
    ]

    const onPageChange = (page) => {
        dispatch({
            type: 'personalizedStrategy/query',
            payload: {
                pageSize: page.pageSize,
                page: page.current - 1,
                q,
            },
        })
        dispatch({
            type: 'personalizedStrategy/setState',
            payload: {
                keys: new Date().getTime(),
            },
        })
    }

    return (
        <Row gutter={24} >
            <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <div >
                    <Table
                        bordered
                        columns={columns}
                        scroll={{ x: 1500, y: 600 }}
                        dataSource={dataSource}
                        onChange={onPageChange}
                        loading={loading}
                        pagination={pagination}
                        simple
                        rowKey={record => record.uuid}
                        size="small"
                    />
                </div>
            </Col>
        </Row>
    )
}

export default list
