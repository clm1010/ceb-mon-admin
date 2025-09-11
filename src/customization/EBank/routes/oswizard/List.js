import React from 'react'
import { Table, Input, Row, Col, Button, Tag } from 'antd'
import columns from './Columns'
function list({
    dispatch, loading, dataSource, pagination, q
}) {

    for (let column of columns) {
        if (column.key === 'mo.monitorStatus') {
            column.render = (text, record) => {
                if (text === '1') {
                    return <Tag color="orange">已监控</Tag>
                }
                return <Tag color="green">未监控</Tag>
            }
        }
    }

    const onPageChange = (page) => {
        dispatch({
            type: 'oswizard/query',
            payload: {
                page: page.current - 1,
                pageSize: page.pageSize,
                q: q === undefined ? '' : q,
            },
        })
    }

    return (
        <div style={{ marginTop: 25 }}>
            <Table
                scroll={{ x: 2800 }} //滚动条
                bordered
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                onChange={onPageChange}
                simple
                rowKey={record => record.uuid}
                size="small"
            />
        </div>
    )
}

export default list
