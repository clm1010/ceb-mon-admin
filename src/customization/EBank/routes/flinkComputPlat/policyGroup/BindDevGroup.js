import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker } from 'antd'
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
    bindDevGroupModalVisible,
    form,
    devGroupList,
    devGroupAllList,
    item
}) => {
    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields
    } = form

    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
            payload: {
                bindDevGroupModalVisible: false,
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
                bindDevGroupModalVisible: false
            }
        })
        dispatch({
            type: "flinkComputPlat/saveRelationDeviceGroup",
            payload: {
                deviceGroupIds: data.name,
                templateGroupId: item.id
            }
        })
    }

    const modalOpts = {
        title: `绑定设备组`,
        visible: bindDevGroupModalVisible,
        onCancel,
        onOk,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        destroyOnClose: true
    }
    let initialValue = devGroupList.map(element => element.id);

    return (
        <Modal {...modalOpts}
            footer={[
                <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
            key="routerModal" width="600px"
        >
            <Form layout="horizontal" preserve={false}>
                <FormItem label="设备组名" key="name" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('name', {
                        initialValue: initialValue,
                        rules: [],
                    })(<Select mode='multiple' >
                        {
                            devGroupAllList.map(item => {
                                return <Select.Option value={item.id} >{item.value} </Select.Option>
                            })
                        }
                    </Select>)}
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
