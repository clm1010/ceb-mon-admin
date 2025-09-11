import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker } from 'antd'
import Fenhang from '../../../../../utils/fenhang'

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
  showConditionVisible,
  item,
  form,
}) => {

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
  } = form

  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
      payload: {
        showConditionVisible: false,
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
        showConditionVisible: false
      }
    })
    dispatch({
      type: "flinkComputPlat/addCondition",
      payload: data
    })
  }

  const modalOpts = {
    title: `flink策略公式维护`,
    visible: showConditionVisible,
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
        <FormItem label="公式" key="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="	描述" key="comment" hasFeedback {...formItemLayout}>
          {getFieldDecorator('comment', {
            initialValue: item.comment,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="连续异常次数阈值	" key="repeatCount" hasFeedback {...formItemLayout}>
          {getFieldDecorator('repeatCount', {
            initialValue: item.repeatCount,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="阈值条件" key="threshold" hasFeedback {...formItemLayout}>
          {getFieldDecorator('threshold', {
            initialValue: item.threshold,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="采集间隔" key="simpleCycle" hasFeedback {...formItemLayout}>
          {getFieldDecorator('simpleCycle', {
            initialValue: item.simpleCycle,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="计算符号" key="operator" hasFeedback {...formItemLayout}>
          {getFieldDecorator('operator', {
            initialValue: item.operator,
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
