import React, { useState } from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon, Tag } from 'antd'
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, loading, dataSource, pagination, choosedRows, contions
}) {
    const columns2 = [
        {
            title: '设备地址',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            render: (text, record) => {
                return `${record.md && record.md.ipAddress}`
            },
        },
        {
            title: '设备类型',
            dataIndex: 'deviceType',
            key: 'deviceType',
            render: (text, record) => {
                return `${record.md && record.md.deviceType}`
            },
        },
        {
            title: '应用系统',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return `${record.md && record.md.name}`
            },
        },
        {
            title: '设备组',
            dataIndex: 'devGroup',
            key: 'devGroup',
            render: (text, record) => {
                return (record.dict && record.dict.map(item => {
                    return <Tag> {item.value}</Tag>
                }))
            },
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
                </div>)
            },
        },
    ]

    const onPageChange = (page) => {
        delete contions.page
        delete contions.size
        dispatch({
            type: 'flinkComputPlat/queryDevice',
            payload: {
                page: page.current,
                size: page.pageSize,
                ...contions,
            },
        })
        dispatch({
            type: 'flinkComputPlat/setState',
            payload: {
                batchDelete: false,
                choosedRows: [],
            },
        })
    }
    const onDeletes = (record) => {
        confirm({
            title: '您确定要删除这条记录吗?',
            onOk() {
                let ids = []
                ids.push(record.id)
                dispatch({
                    type: 'flinkComputPlat/deviceOffline',
                    payload: {
                        ips: ids
                    }
                })
            },
        })
    }
    const rowSelection = {
        selectedRowKeys: choosedRows,
        onChange: (selectedRowKeys, selectedRows) => {
            let choosed = []
            selectedRows.forEach((object) => {
                choosed.push(object.md.id)
            })
            dispatch({
                type: 'flinkComputPlat/setState',
                payload: {
                    choosedRows: choosed,
                    batchDelete: selectedRows.length > 0,
                },
            })
        },
    }

    return (
        <Row gutter={24} style={{ marginTop: 25 }}>
            <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <Table
                    bordered
                    columns={columns2}
                    scroll={{ x: 1300 }}
                    dataSource={dataSource}
                    loading={loading}
                    onChange={onPageChange}
                    pagination={pagination}
                    simple
                    // rowKey={record => record.md && record.md.id}
                    rowKey={record => {
                        if(record.md){
                            return record.md.id
                        }else{
                            return record.id
                        }
                    }}
                    size="small"
                    rowSelection={rowSelection}
                />
            </Col>
        </Row>
    )
}

export default list
