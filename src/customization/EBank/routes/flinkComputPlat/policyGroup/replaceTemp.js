import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Card, Typography, Row, Col, Tree, message, Divider } from 'antd'
import moment from 'moment'
const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const { Text } = Typography
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}


const modal = ({
    dispatch,
    replaceTempModalVisible,
    form,
    item = {},
    groupList
}) => {
    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields
    } = form

    const [sourceID, setSourceID] = useState("")
    const [tragetID, setTragetID] = useState("")

    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
            payload: {
                replaceTempModalVisible: false,
            },
        })
    }

    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
        })
        const data = {
            ...getFieldsValue(), //获取弹出框所有字段的值
        }
        resetFields()
        if (sourceID && sourceID != '' && tragetID && tragetID != '') {
            dispatch({
                type: "flinkComputPlat/setState",
                payload: {
                    replaceTempModalVisible: false
                }
            })
            dispatch({
                type: "flinkComputPlat/replaceTemp",
                payload: {
                    sourceGroupId: sourceID,
                    targetGroupId: tragetID
                }
            })
        } else {
            message.warning('请选择替换的模板组')
        }
    }

    const onSelectSource = (value) => {
        setSourceID(value[0])
    }

    const onSelectTrage = (value) => {
        setTragetID(value[0])
    }

    const modalOpts = {
        title: `替换模板`,
        visible: replaceTempModalVisible,
        onCancel,
        onOk,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        destroyOnClose: true
    }

    return (
        <Modal {...modalOpts}
            width="700px"
            footer={[
                <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
            key="routerModal"
        >
            <Form layout="horizontal" preserve={false}>
                <Row span={24} type='flex' justify='space-between'>
                    <Col span={12}>
                        <Card title="替换源(source)" headStyle={{ textAlign: 'center' }} >
                            <Tree
                                showLine
                                onSelect={onSelectSource}
                                defaultExpandAll
                                multiple={false}
                            >
                                {groupList.map(item => {
                                    return <TreeNode title={item.name} key={item.id} isLeaf={true}>{item.name}</TreeNode>
                                })}

                            </Tree>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="替换目标(target)" headStyle={{ textAlign: 'center' }} >
                            <Tree
                                showLine
                                onSelect={onSelectTrage}
                                defaultExpandAll
                                multiple={false}
                            >
                                {groupList.map(item => {
                                    return <TreeNode title={item.name} key={item.id} isLeaf={true}>{item.name}</TreeNode>
                                })}
                            </Tree>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

modal.propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    type: PropTypes.string,
    item: PropTypes.object,
    onCancel: PropTypes.func,
}

export default Form.create()(modal)
