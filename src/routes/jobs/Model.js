import React from 'react'
import { Form, Modal } from 'antd'
import FormItems from './FormItem'

const modal = ({ dispatch, visible, form, drawerVisible, progressButtonState, item, uuid }) => {

  const { getFieldsValue, validateFieldsAndScroll } = form

  const onOk = () => {
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue()
      }
    })
  }

  const onCancel = () => {
    dispatch({
      type: 'jobs/setState',
      payload:{
        modalVisible: false,
        progressButtonState: false
      }
    })
  }

  const modalOpts = {
    title: '详细信息',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable:false,
  }

  const formItemsProps = {
    item: item,
    form,
    drawerVisible,
    dispatch,
    showIcon: false,
    progressButtonState,
    uuid
  }

  return (
    <Modal {...modalOpts} width={800}>
      <FormItems {...formItemsProps}/>
    </Modal>
  )
}

export default Form.create()(modal)
