import React, { useState, useEffect } from 'react';
import { Timeline, Icon, Spin, Collapse } from 'antd';
import './operate.less'
const { Panel } = Collapse

function operateRecord({ operateRecordList, seeOperate }) {

    operateRecordList.sort((a, b) => {
        return a.recordTime > b.recordTime ? 1 : -1
    })

    const optValue = operateRecordList.map((item, index) => {
        let dot = item.recordOpt === 'create' ? <Icon type="clock-circle-o" style={{ color: "#eb2f96" }} /> : null
        return (<Timeline.Item dot={dot} >
            <Collapse className={"operateRecord"}  expandIcon={({ isActive }) => isActive ? <Icon type="minus" /> : <Icon type="plus" />} expandIconPosition={"right"}>
                <Panel header={`${item.recordOpt} by` + ` ${item.recordName}  at` + ` ${item.recordTime}`} key={index}>
                    <p>{item.DetailMessage}</p>
                </Panel>
            </Collapse>
        </Timeline.Item>)
    })

    return (
        <Spin spinning={seeOperate}>
            <Timeline>
                {optValue}
            </Timeline>
        </Spin>
    )
}

export default operateRecord