import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { DatePicker, Row, Col, Tree, Button, Typography } from 'antd'
import moment from 'moment'

const TreeNode = Tree.TreeNode
const { Title, Paragraph, Text } = Typography
const baobiao = ({
    dispatch, baobiao
}) => {
    const { treeDatas, reportMes } = baobiao
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)


    const onSelect = (selectedKeys, info) => {
        if (selectedKeys.length > 0) {
            dispatch({
                type: 'baobiao/getMes',
                payload: {
                    q: `name==${selectedKeys[0]}`,
                    direction: 'asc',
                    sortFields: 'id',
                },
            })
        }
    }
    const onStart = (value) => {
        setStartTime(value)
    }
    const onEnd = (value) => {
        setEndTime(value)
    }
    const disabledDate = (current) => {
        return current && current > moment().endOf('day')
    }
    const onDown = () => {
        let arr = [{
            reporterName: reportMes.name,
            startTime: moment(startTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(endTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }]
        dispatch({
            type: 'baobiao/downLoad',
            payload: arr,
        })
    }
    //定义默认展开的节点数组
    const loop = data => data.map((item) => {
        if (item.subMenu && item.subMenu.length > 0) {
            return <TreeNode title={item.nameCn} key={item.name} isLeaf={false}>{loop(item.subMenu)}</TreeNode>
        }
        return <TreeNode title={item.nameCn} key={item.name} isLeaf />
    })

    let treeNodes = []
    if (treeDatas && treeDatas.length > 0) {
        treeNodes = loop(treeDatas)
    }
    let lastMes = []
    let mes = reportMes && reportMes.tpe && reportMes.tpe.split(',').map(item => {
        if (item == 'day') {
            lastMes.push('日报')
            return <li>日报时间选择样例：开始时间-2024-07-01 结束时间-2024-07-01</li>
        }
        if (item == 'week') {
            lastMes.push('周报')
            return <li>周报时间选择样例：开始时间-2024-07-01 结束时间-2024-07-07</li>
        }
        if (item == 'month') {
            lastMes.push('月报')
            return <li>月报时间选择样例：开始时间-2024-07-01 结束时间-2024-08-01</li>
        }
    })
    useEffect(() => {
        let defaultValueStart, defaultValueEnd
        switch (lastMes[0]) {
            case '日报':
                defaultValueStart = moment().subtract(1, 'day').startOf('day'),
                    defaultValueEnd = moment().subtract(1, 'day').endOf('day')
                break;
            case '周报':
                defaultValueStart = moment().subtract(1, 'week').startOf('week').add(1, 'day'),
                    defaultValueEnd = moment().subtract(1, 'week').endOf('week').add(1, 'day')
                break;
            case '月报':
                defaultValueStart = moment().subtract(1, 'month').startOf('month'),
                    defaultValueEnd = moment().subtract(1, 'month').endOf('month')
                break;
            default:
                defaultValueStart = moment().subtract(1, 'day').startOf('day'),
                    defaultValueEnd = moment().subtract(1, 'day').endOf('day')
                break;
        }
        setStartTime(defaultValueStart)
        setEndTime(defaultValueEnd)
    }, [reportMes])

    return (
        <div>
            <Row>
                <Col span={6}>
                    <div style={{ width: '100%', height: '85vh', display: 'inline-block', overflow: 'scroll', background: '#fff' }}>
                        <Tree
                            showLine
                            autoExpandParent={false}
                            defaultExpandAll={false}
                            onSelect={onSelect}
                        >
                            {treeNodes}
                        </Tree>
                    </div>
                </Col>
                <Col span={17}>
                    <div style={{ width: '98%', height: '85vh', display: 'inline-block', overflow: 'scroll', background: '#fff', textAlign: 'center', float: 'right' }}>
                        <Typography style={{ marginLeft: 50, marginTop: 50 }}>
                            <Title level={2}>{reportMes.nameCn}</Title>
                            {
                                reportMes.tpe ?
                                    <>
                                        <Paragraph strong style={{ textAlign: 'left' }}>提示信息：</Paragraph>
                                        <Paragraph>
                                            <ul style={{ textAlign: 'left', fontSize: '15px', backgroundColor: 'yellow' }}>
                                                {mes}
                                                {reportMes.tpe && <li>本报表仅支持<Text type="danger">{lastMes.join('、')}</Text>导出</li>}
                                            </ul>
                                        </Paragraph>
                                    </> : null
                            }
                        </Typography>
                        {
                            reportMes.tpe ? <>
                                <div style={{ marginTop: 30 }}>
                                    <span >开始时间：<DatePicker style={{ margin: 10, width: '30%' }} onChange={onStart} disabledDate={disabledDate} value={startTime} /></span>
                                    <span >结束时间：<DatePicker style={{ margin: 10, width: '30%' }} onChange={onEnd} disabledDate={disabledDate} value={endTime} /></span>
                                    <Button style={{ margin: 10 }} onClick={onDown}>下载</Button>
                                </div>
                            </> : null
                        }
                    </div>
                </Col>
            </Row>
        </div>
    )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ baobiao, loading }) => ({ baobiao, loading }))(baobiao)
