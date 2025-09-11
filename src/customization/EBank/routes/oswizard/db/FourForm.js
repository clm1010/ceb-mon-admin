import React from 'react'
import { Table, Modal, Row, Col, List, Tabs, Icon, Avatar } from 'antd'
import _columns from '../Columns'
import fail from './fails.svg'
import success from './success.svg'

function FourForm({
    dispatch, loading, verifyRes, MOData
}) {
    if (verifyRes.length && verifyRes.length > 0) {
        verifyRes.length = verifyRes.length - 1
    }
    let dataSourceFalse = verifyRes['0'] || []
    let dataSourceSucces = verifyRes['1'] || []
    const dataSoure = []
    dataSourceFalse.forEach(element => {
        dataSoure.push({
            res:false,
            data:element
        })
    });
    dataSourceSucces.forEach(element => {
        dataSoure.push({
            res:true,
            data:element
        })
    });
    return (
        <Row gutter={24}>
            <Col span={16} offset={6}>
                <List
                    itemLayout='horizontal'
                    dataSource={dataSoure}
                    renderItem={item => <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.res ? success : fail }  />}
                            title={item.data}
                            description={item.res ? '成功' : '失败'}
                        />
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}

export default FourForm
