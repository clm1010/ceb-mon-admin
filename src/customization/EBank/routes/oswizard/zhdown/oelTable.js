import React from 'react'
import { Form, Table, Input, Row, Col, Button } from 'antd'
import _columns from './oelColumns'

function list({
    dispatch, loading, dataSource,
}) {

    //显示告警详情弹出窗口
    const showDetail = (record, index, event) => {
        dispatch({
            type: 'oswizard/updateState',		//抛一个事件给监听这个type的监听器
            payload: {
                visibleOelDetail: true,
                OelItem: record,
            },
        })
    }

    return (
        <div style={{ marginTop: 25 }}>
            <Row gutter={[16, 16]}>
                <Table
                    scroll={{ x: 980, y: 600 }} //滚动条
                    bordered
                    columns={_columns}
                    dataSource={dataSource}
                    pagination={false}
                    simple
                    rowKey={record => record.OZ_AlarmID}
                    onRowDoubleClick={showDetail}
                    size="small"
                />
            </Row>

        </div>
    )
}

export default list
