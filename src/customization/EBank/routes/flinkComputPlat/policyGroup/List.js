import React, { useState } from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list({
    dispatch, loading, dataSource, pagination, choosedRows, contions
}) {

    const columns = [
        {
            title: '模板组名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '说明',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: '操作',
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button size="default" type="ghost" onClick={() => onbind(record)} style={{ marginLeft: 10 }}> 绑定模板 </Button>
                    <Button size="default" type="ghost" onClick={() => onbindDevGroup(record)} style={{ marginLeft: 10 }}> 绑定设备组 </Button>
                    <Button size="default" type="ghost" onClick={() => onDeletes(record)} style={{ marginLeft: 10 }} > 删除 </Button>
                </div>)
            },
        },
    ]

    const onbindDevGroup = (record) => {
        dispatch({
            type: 'flinkComputPlat/setState',
            payload: {
                bindDevGroupModalVisible: true,
                currentItem:record
            },
        })
        dispatch({
            type: 'flinkComputPlat/getPolicyG_DevG',
            payload: {
                id:record.id
            },
        })
        dispatch({
            type: 'flinkComputPlat/getAllDeviceGroup',
            payload: {
            },
          })
    }

    const onbind = (record) => {
        dispatch({
            type: 'flinkComputPlat/setState',
            payload: {
                tempModalVisible: true,
                groupItem: record
            },
        })
        dispatch({
            type: 'flinkComputPlat/querytemplate',
            payload: {
                size: 1000
            },
        })
        dispatch({
            type: 'flinkComputPlat/querytemplatebyGroup',
            payload: {
                id: record.id
            },
        })
    }

    const onPageChange = (page) => {
        delete contions.page
        delete contions.size
        dispatch({
            type: 'flinkComputPlat/queryGroup',
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
                    type: 'flinkComputPlat/deleGroup',
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
