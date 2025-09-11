import React, { Children } from 'react'
import PropTypes from 'prop-types'
import { Drawer, Row, Col, Tag, Divider, Typography, Tree, Card, Empty } from 'antd'
import _ from 'lodash';
const { Paragraph } = Typography;

const drawer = ({
    dispatch,
    visible,
    item,
    preData,
}) => {

    let empty = false
    if (!item.data || !preData.data) {
        empty = true
    }
    let afterData, beforeData
    if (item.data) {
        afterData = JSON.parse(item.data)
    }
    if (preData.data) {
        beforeData = JSON.parse(preData.data)
    }

    const loopSelect = data => data.map((item) => {
        if (item.children && item.children.length > 0) {
            return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf={false}>{loopSelect(item.children)}</TreeSelectNode>
        }
        return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf />
    })

    const DiffPathMes = []
    function getDiffPath(bVal, aVal, prefix) {
        if (empty) {
            return
        }
        let TreeArr = []
        for (let key in bVal) {
            if (bVal.hasOwnProperty(key)) { //去除原型中的属性
                if (Object.prototype.toString.call(bVal[key]) === '[object Array]') {
                    TreeArr.push({
                        title: <span style={{ fontWeight: 'bold' }}>{key}</span>,
                        key: `${prefix}_${key}`,
                        children: getDiffPath(bVal[key], aVal[key], `${prefix}_${key}`)
                    })
                } else if (Object.prototype.toString.call(bVal[key]) === '[object Object]') {
                    TreeArr.push({
                        title: <span style={{ fontWeight: 'bold' }}>{key}</span>,
                        key: `${prefix}_${key}`,
                        children: getDiffPath(bVal[key], aVal[key], `${prefix}_${key}`)
                    })
                } else {
                    let color = ''
                    let disabled = false
                    if (bVal[key] != aVal[key]) {
                        color = '#ff55ff'
                        disabled = true
                        DiffPathMes.push(`${prefix}_${key}`)
                    }
                    TreeArr.push({
                        title: <><span style={{ fontWeight: 'bold' }}>{key}</span> : <span style={{ color: color }}>{bVal[key]}</span></>,
                        key: `${key}:${bVal[key]}`,
                        children: [],
                        disabled
                    })
                }
            }
        }
        return TreeArr
    }
    getDiffPath(beforeData, afterData, "")

    function getTreeVal(data, diffPath, prefix) {
        if (!data) {
            return []
        }
        let TreeArr = []
        if (diffPath.length == 0) {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    if (Object.prototype.toString.call(data[key]) === '[object Array]') {
                        TreeArr.push({
                            title: <><span style={{ fontWeight: 'bold' }}>{key}</span></>,
                            key: `${prefix}_${key}`,
                            children: getTreeVal(data[key], diffPath, `${prefix}_${key}`),
                        })
                    } else if (Object.prototype.toString.call(data[key]) === '[object Object]') {
                        TreeArr.push({
                            title: <><span style={{ fontWeight: 'bold' }}>{key}</span></>,
                            key: `${prefix}_${key}`,
                            children: getTreeVal(data[key], diffPath, `${prefix}_${key}`),
                        })
                    } else {
                        TreeArr.push({
                            title: <><span style={{ fontWeight: 'bold' }}>{key}</span> : <span >{data[key]}</span></>,
                            key: `${prefix}_${key}`,
                        })
                    }
                }
            }
        } else {
            for (let key in data) {
                let disabled = false
                for (let i = 0; i < diffPath.length; i++) {
                    if (diffPath[i] === `${prefix}_${key}`) {
                        disabled = true
                    }
                }
                if (data.hasOwnProperty(key)) {
                    if (Object.prototype.toString.call(data[key]) === '[object Array]') {
                        TreeArr.push({
                            title: <><span style={{ fontWeight: 'bold' }}>{key}</span></>,
                            key: `${prefix}_${key}`,
                            children: getTreeVal(data[key], diffPath, `${prefix}_${key}`),
                            disabled
                        })
                    } else if (Object.prototype.toString.call(data[key]) === '[object Object]') {
                        TreeArr.push({
                            title: <><span style={{ fontWeight: 'bold' }}>{key}</span></>,
                            key: `${prefix}_${key}`,
                            children: getTreeVal(data[key], diffPath, `${prefix}_${key}`),
                            disabled
                        })
                    } else {
                        let color = ''
                        if (disabled) {
                            color = '#eb2f96'
                        }
                        TreeArr.push({
                            title: <><span style={{ fontWeight: 'bold', color: color }}>{key}</span> : <span style={{ color: color }}>{data[key]}</span></>,
                            key: `${prefix}_${key}`,
                            disabled
                        })
                    }
                }
            }
        }
        return TreeArr
    }
    const treeafterData = getTreeVal(afterData, DiffPathMes, '')
    const treebeforeData = getTreeVal(beforeData, DiffPathMes)

    const DescriptionItem = ({ title, content }) => (
        <div
            style={{
                fontSize: 14,
                lineHeight: '22px',
                marginBottom: 7,
                color: 'rgba(0,0,0,0.65)',
            }}
        >
            <p
                style={{
                    marginRight: 8,
                    display: 'inline-block',
                    color: 'rgba(0,0,0,0.85)',
                }}
            >
                {title}:
            </p>
            {content}
        </div>
    );

    const onClose = () => {
        dispatch({
            type: 'audit/setState',
            payload: {
                visible: false
            }
        })
    }

    const pStyle = {
        fontSize: 16,
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: 16,
    };

    return (
        <Drawer
            width='49%'
            placement="right"
            closable={false}
            visible={visible}
            maskClosable
            onClose={onClose}
        >
            <p style={pStyle}>基本内容</p>
            <Row>
                <Col span={7}>
                    <DescriptionItem title="用户" content={<Tag color="blue">{item.user}</Tag>} />
                </Col>
                <Col span={7}>
                    <DescriptionItem title="时间" content={<Tag color="blue">{item.oprationTime}</Tag>} />
                </Col>
                <Col span={10}>
                    <DescriptionItem title="操作" content={<Tag color="blue">{item.action}</Tag>} />
                </Col>
            </Row>
            <Row>
                <Col span={7}>
                    <DescriptionItem title="结果" content={<Tag color="blue">{item.responseCode}</Tag>} />
                </Col>
                <Col span={7}>
                    <DescriptionItem title="模块" content={<Tag color="blue">{item.typ}</Tag>} />
                </Col>
                <Col span={10}>
                    <DescriptionItem title="uuid" content={<Tag color="blue">{item.uuid}</Tag>} />
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={12}>
                    <Card title="操作后内容" headStyle={{ textAlign: 'center' }}>
                        {
                            item.data ?
                                <Tree
                                    treeData={treeafterData}
                                >
                                </Tree>
                                :
                                <Empty />
                        }

                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="操作前内容" headStyle={{ textAlign: 'center' }} >
                        {
                            preData.data ?
                                <Tree
                                    treeData={treebeforeData}
                                >
                                </Tree>
                                :
                                <Empty />
                        }

                    </Card>
                </Col>
            </Row>
        </Drawer>
    )
}

drawer.propTypes = {
    visible: PropTypes.bool,
    type: PropTypes.string,
    item: PropTypes.object,
}

export default drawer
