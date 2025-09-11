import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker, Icon, Alert, Tooltip, message } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

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
    deviceModalVisible,
    item={},
    form,
}) => {

    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields,
    } = form

    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
            payload: {
                deviceModalVisible: false,
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
        dispatch({
            type: "flinkComputPlat/setState",
            payload: {
                deviceModalVisible: false
            }
        })
        dispatch({
            type: "flinkComputPlat/deviceSave",
            payload: data
        })
    }

    const modalOpts = {
        title: `flink管理平台设备维护`,
        visible: deviceModalVisible,
        onCancel,
        onOk,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        destroyOnClose: true
    }

    return (
        <Modal {...modalOpts}
            width={850}
            footer={[
                <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
            key="routerModal"
        >
            <Form layout="horizontal" preserve={false}>
                <FormItem label="设备ip" key="ipAddress" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('ipAddress', {
                        initialValue: item.ipAddress,
                        rules: [],
                    })(<Input />)}
                </FormItem>
                <FormItem label="应用系统" key="name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: item.name,
                        rules: [],
                    })(<Input />)}
                </FormItem>

                <FormItem label="类型" key="deviceType" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('deviceType', {
                        initialValue: item.deviceType,
                        rules: [],
                    })(<Input />)}
                </FormItem>
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
