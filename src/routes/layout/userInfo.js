import React from 'react'
import { Form, Input, Modal } from 'antd'
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
	user,
	form,
}) => {
	let uuids = []
	if (user.roles && user.roles.length > 0) {
		for (let item of user.roles) {
	      	uuids.push(item.uuid)
		}
	}

	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
        		return
	      	}
	      	const data = {
	        	...getFieldsValue(),
	      	}

	      	let info = {}
			info.mobile = data.mobile
			info.branch = user.branch
		    info.description = data.description
		    info.domain = user.domain
		    info.email = user.email,
		    info.mobile = data.mobile
		    info.name = user.name
		    info.status = user.status
		    info.username = user.username
		    info.roleUUIDs = uuids
		    info.passwordHash = user.passwordHash
		    info.id = user.uuid
			dispatch({
				type: 'app/update',
				payload: {
					info,
				},
			})
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'app/updateState',
			payload: {
				userInfoVisible: false,
			},
		})
	}

	const modalOpts = {
	    title: '修改个人信息',
	    visible,
	    onOk,
	    onCancel,
	    wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	return (
  <Modal {...modalOpts}>
    <Form>
      <FormItem label="手机号" {...formItemLayout}>
        {getFieldDecorator('mobile', {
				 initialValue: user.mobile,
				})(<Input />)}
      </FormItem>
      <FormItem label="描述" {...formItemLayout}>
        {getFieldDecorator('description', {
				 initialValue: user.description,
				})(<Input />)}
      </FormItem>
    </Form>
  </Modal>
	)
}

export default Form.create()(modal)
