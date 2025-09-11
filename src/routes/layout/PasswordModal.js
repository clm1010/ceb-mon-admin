import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, message } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

const modal = ({
	dispatch,
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  user,
  isClose,
}) => {
	const onOk = () => {
	 validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

     if (data.newPassword !== data.passwordRepeat) {
      	message.error('两次新密码不一致，请重新输入！')
      	return
      }

      if (data.originalPassword === data.newPassword) {
      	  message.error('老密码和新密码一样，请重新输入新密码！')
      	  return
       }

      if (data.newPassword !== data.passwordRepeat) {
      	message.error('两个新密码不一致，请重新输入！')
      	return
      }

      let saveitem = {}
	  saveitem.uuid = user.uuid
	  saveitem.username = user.username
      saveitem.originalPassword = data.originalPassword
      saveitem.newPassword = data.newPassword
      saveitem.passwordRepeat = data.newPassword
      dispatch({
			type: 'app/changePassword',
			payload: saveitem,
	  })
    })
	}

	const onCancel = () => {
		resetFields()
		dispatch({
        type: 'app/updateState',
			  payload: {
				    passwordVisible: false,
			  },
        })
	}

  const modalOpts = {
    title: '修改密码',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts} width="400px" height="600px">
      <Form layout="horizontal">
        <FormItem label="老密码" {...formItemLayout}>
          {getFieldDecorator('originalPassword', {
				 initialValue: '',
				 rules: [{ required: true }],
			})(<Input type="password" />)}
        </FormItem>
        <FormItem label="新密码" {...formItemLayout}>
          {getFieldDecorator('newPassword', {
				 initialValue: '',
				 rules: [{ required: true }],
			})(<Input type="password" />)}
        </FormItem>
        <FormItem label="重复密码" {...formItemLayout}>
          {getFieldDecorator('passwordRepeat', {
				 initialValue: '',
				 rules: [{ required: true }],
			})(<Input type="password" />)}
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
  onOk: PropTypes.func,
}

export default Form.create()(modal)
