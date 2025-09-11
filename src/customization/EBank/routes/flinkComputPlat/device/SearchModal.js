import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
  dispatch,
  searchMoalVisible,
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
        searchMoalVisible: false,
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
        searchValues:data.exact,
        searchMoalVisible:false
      }
    })
  }

  const modalOpts = {
    title: "精确查询",
    visible: searchMoalVisible,
    onCancel,
    onOk,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    destroyOnClose:true
  }

  return (
    <Modal {...modalOpts}
      width={660}
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
      key="routerModal"
    >
      <Form layout="horizontal" preserve={false}>
        <FormItem label="设备地址" key="exact" hasFeedback {...formItemLayout}>
          {getFieldDecorator('exact', {
            initialValue: '',
            rules: [],
          })(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
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
