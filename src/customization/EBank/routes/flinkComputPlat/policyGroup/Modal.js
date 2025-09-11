import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker } from 'antd'
import moment from 'moment'

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

const formItemLayout1 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  dispatch,
  showpolicyGropuVisible,
  item,
  form,
}) => {

  const [timeModalType, setTimeModalType] = useState("0")

  useEffect(() => {
    setTimeModalType(item.timeMode)
  }, [item])

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
  } = form

  let Fenhangmaps = new Map()
  Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
  })

  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
      payload: {
        showpolicyGropuVisible: false,
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
        showpolicyGropuVisible: false
      }
    })
    dispatch({
      type: "flinkComputPlat/addPolicyGroup",
      payload: data
    })
  }

  const modalOpts = {
    title: `策略组维护`,
    visible: showpolicyGropuVisible,
    onCancel,
    onOk,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    destroyOnClose:true
  }
  
  return (
    <Modal {...modalOpts}
      width={700}
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
      key="routerModal"
    >
      <Form layout="horizontal" preserve={false}>
        <FormItem label="策略组名" key="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="策略组说明" key="comment" hasFeedback {...formItemLayout}>
          {getFieldDecorator('comment', {
            initialValue: item.comment,
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
