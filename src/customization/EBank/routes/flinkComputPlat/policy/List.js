import React, { useState } from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, loading, dataSource, pagination, choosedRows, contions
}) {
    const onDeletes = (record) => {
        confirm({
            title: '您确定要删除这条记录吗?',
            onOk() {
                let ids = []
                ids.push(record.id)
                dispatch({
                    type: 'flinkComputPlat/delete',
                    payload: {
                        ids: ids
                    },
                })
            },
        })
    }
    const onEdit = (record) => {
        dispatch({
            type: 'flinkComputPlat/setState',													//抛一个事件给监听这个type的监听器
            payload: {
                currentItem: record,
                modalVisible: true
            },
        })
    }
    const columns = [
        {
            title: '策略名',
            dataIndex: 'policyName',
            key: 'policyName',
        }, {
            title: '监控设备',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: 125,
        }, {
            title: '策略大类',
            dataIndex: 'componentType',
            key: 'componentType',
            width: 125,
        }, {
            title: '策略中类',
            dataIndex: 'component',
            key: 'component',
        }, {
            title: '策略小类',
            dataIndex: 'subComponent',
            key: 'subComponent',
            render: (text, record) => {
                return text
            },
        }, {
            title: '一级表达式',
            dataIndex: 'sev1Condition',
            key: 'sev1Condition',
            width: 250,
        }, {
            title: '二级表达式',
            dataIndex: 'sev2Condition',
            key: 'sev2Condition',
            width: 150,
        }, {
            title: '三级级表达式',
            dataIndex: 'sev3Condition',
            key: 'sev3Condition',
            width: 150,
        }, {
            title: '生效周期',
            dataIndex: 'workDay',
            key: 'workDay',
            width: 75,
            render: (text, record) => {
                let res = '每天'
                switch (text) {
                    case "0": res = '每天'
                        break;
                    case "1": res = '工作日'
                        break;
                    case "2": res = '节假日'
                        break;
                    default: res = '每天'
                        break;
                }
                return res
            }
        }, {
            title: '监控时间',
            dataIndex: 'timeMode',
            key: 'timeMode',
            width: 75,
            render: (text, record) => {
                let res = '全天'
                switch (text) {
                    case "0": res = '全天'
                        break;
                    case "1": res = '白天'
                        break;
                    case "2": res = '夜间'
                        break;
                    case "3": res = '自定义'
                        break;
                    default: res = '全天'
                        break;
                }
                return res
            }
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
                    <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
                </div>)
            },
        },
    ]

    const onPageChange = (page) => {
        delete contions.page
        delete contions.size
        dispatch({
            type: 'flinkComputPlat/query',
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

    const onDeletes1 = (record) => {
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
                choosed.push(object.id)
            })
            dispatch({
                type: 'flinkComputPlat/setState',
                payload: {
                    choosedRows: choosed,
                    batchDelete: choosed.length > 0,
                },
            })
        },
    }


    return (
        <Row gutter={24} style={{ marginTop: 25 }}>
            <Table
                bordered
                columns={columns}
                scroll={{ x: 1700 }}
                dataSource={dataSource}
                loading={loading}
                onChange={onPageChange}
                pagination={pagination}
                simple
                rowKey={record => record.id}
                size="small"
                rowSelection={rowSelection}
            />
        </Row>
    )
}

export default list
