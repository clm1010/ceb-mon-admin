import React, { useState } from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, loading, dataSource, pagination, choosedRows, contions
}) {

    const columns = [
        {
            title: '公式名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '说明',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: '连续异常次数阈值',
            dataIndex: 'repeatCount',
            key: 'repeatCount',
        },
        {
            title: '采集间隔',
            dataIndex: 'simpleCycle',
            key: 'simpleCycle',
        },
        {
            title: '符号',
            dataIndex: 'operator',
            key: 'operator',
        },
        {
            title: '阈值',
            dataIndex: 'threshold',
            key: 'threshold',
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button size="default" type="ghost" onClick={() => onDeletes(record)} style={{ marginLeft: 10 }} > 删除 </Button>
                </div>)
            },
        },
    ]

    const onbind = () => {
        dispatch({
            type: 'flinkComputPlat/setState',
            payload: {

            },
        })
    }

    const onPageChange = (page) => {
        delete contions.page
        delete contions.size
        dispatch({
            type: 'flinkComputPlat/querycondition',
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
                dispatch({
                    type: 'flinkComputPlat/deleCondition',
                    payload: record
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
                    batchDelete: selectedRows.length > 0,
                },
            })
        },
    }

    return (
        <Row gutter={24} style={{ marginTop: 25 }}>
            <Table
                bordered
                columns={columns}
                scroll={{ x: 1300 }}
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
