import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Radio, Modal, TreeSelect } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const SHOW_ALL = TreeSelect.SHOW_ALL
const { TextArea } = Input
const formItemLayout = {
	labelCol: {
		  span: 4,
	},
   wrapperCol: {
		  span: 16,
	},
}

const modal = ({
	dispatch,
	visible,
	type,
	item = {},
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	},
	modalType,
	checkStatus,
	isClose,
	treeNodes,
	selectInfo,
}) => {
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(), //获取弹出框所有字段的值
				selectInfo,
			}
			if (data.targetGroupUUIDs && data.targetGroupUUIDs.length > 0) {
				let arrs = []
				data.targetGroupUUIDs.forEach((item) => {
					if (arrs.length > 0) {
						arrs = [...arrs, item.value]
					} else {
						arrs = [item.value]
					}
				})
				data.targetGroupUUIDs = arrs
			}

			dispatch({
				type: `lookupinfo/${type}`,
				payload: data,
			})
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'lookupinfo/controllerModal',
			payload: {
				modalVisible: false,
				isClose: true,
			},
		})
	}
	const modalOpts = {
		title: `${type === 'create' ? '新增记录' : '编辑记录'}`,
		visible,
		onOk,
		onCancel,
		width:800,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	return (
		isClose ? null :
		<Modal {...modalOpts}  >
  <Form layout="horizontal">
    <FormItem label="记录内容" hasFeedback {...formItemLayout}>
      {getFieldDecorator('data', {
					initialValue: item.data,
					rules: [
					  {
						required: true,
					  },
					],
				  })(<TextArea rows={5}/>)}
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
