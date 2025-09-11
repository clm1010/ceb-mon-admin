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
    bindgoupVisible,
    form,
    groupList,
    choosedRows,
    bindGroupTyep
}) => {
    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields
    } = form


    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
            payload: {
                bindgoupVisible: false,
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
                bindgoupVisible: false
            }
        })
        if(bindGroupTyep == 'bind'){
            dispatch({
                type: "flinkComputPlat/binDev",
                payload: {
                    groupIds: [data.id],
                    deviceIds: choosedRows
                }
            })
        }else if(bindGroupTyep == 'unbind'){
            dispatch({
                type: "flinkComputPlat/unbinDev",
                payload: {
                    id:data.id,
                    // groupIds: [data.id],
                    deviceIds: [choosedRows[0]]
                }
            })
        }
    }

    const modalOpts = {
        title: `添加模板`,
        visible: bindgoupVisible,
        onCancel,
        onOk,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        destroyOnClose: true
    }

    return (
        <Modal {...modalOpts}
            footer={[
                <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
            key="routerModal"
        >
            <Form layout="horizontal" preserve={false}>
                <FormItem label="模板名" key="id" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('id', {
                        initialValue: undefined,
                        rules: [],
                    })(<Select  >
                        {
                            groupList.map(item => {
                                return <Select.Option value={item.id} item={item}>{item.name} </Select.Option>
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
