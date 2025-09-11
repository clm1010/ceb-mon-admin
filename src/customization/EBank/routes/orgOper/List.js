import React from 'react'
import { Table, Input, Row, Col, Button } from 'antd'

function list({
    dispatch, loading, dataSource, pagination, q
}) {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => <div title={text}>{text}</div>,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                return (<div>
                    <Button size="default" type="link" onClick={() => onAdd(record)} >增加</Button>
                    <Button size="default" type="link" onClick={() => onDeletes(record)}>查看/删除</Button>
                </div>)
            },
        },
    ]
    const onAdd = (record) => {
        dispatch({
            type: 'orgOper/getOrgAllUser',
            payload: {
                orgId: record.id,
                username: ''
            },
        })
        dispatch({
            type: 'orgOper/querySuccess',
            payload: {
                currentItem: record
            }
        })
    }
    const onDeletes = (record) => {
        dispatch({
            type: 'orgOper/getOrgUser',
            payload: {
                orgId: record.id
            },
        })
        dispatch({
            type: 'orgOper/querySuccess',
            payload: {
                currentItem: record
            }
        })
    }

    return (
        <div style={{marginTop:25}}>
            <Table
                scroll={{ x: 980 }} //滚动条
                bordered
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                simple
                rowKey={record => record.uuid}
                size="small"
            />
        </div>
    )
}

export default list
