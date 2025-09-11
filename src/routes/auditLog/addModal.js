import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Select, Row, Col, Input } from 'antd'

const FormItem = Form.Item
// const TabPane = Tabs.TabPane
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
    modalVisiable,
    form: {
        getFieldDecorator,
        getFieldsValue,
        resetFields,
        validateFields,
    },
}) => {

    const onCancel = () => {
        dispatch({
            type: 'auditLog/setState',
            payload: {
                modalVisiable: false
            },
        })
    }
    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            dispatch({
                type: `auditLog/modalAdd`,											//抛一个事件给监听这个type的监听器
                payload: data,
              })
              resetFields()
        })
    }
    const modalOpts = {
        title: '新增模块',
        visible: modalVisiable,
        onCancel,
        onOk,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 200,
    }

    // 适用范围查询条件搜索---start
    return (
        <Modal {...modalOpts} width="30%" >
            <Form layout="horizontal">
                <Row gutter={[4, 12]} >
                    <Col  xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} key="name">
                        <FormItem label="模块名" {...formItemLayout}  >
                            {getFieldDecorator('name', {
                                initialValue: "",
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col  xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} key="description">
                        <FormItem label="模块值" {...formItemLayout}  >
                            {getFieldDecorator('description', {
                                initialValue: "",
                            })(
                                <Input />
                            )}
                        </FormItem>
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
    onOk: PropTypes.func,
}

export default Form.create()(modal)
