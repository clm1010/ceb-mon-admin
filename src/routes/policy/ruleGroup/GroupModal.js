import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const tailFormItemLayout = {
	wrapperCol: {
  	xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
}

const formButtonLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
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
  },
  checkStatus,
  isClose,
  selectparentKeys,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
	  let parentUUID = ''
	  if (selectparentKeys && selectparentKeys.length > 0) {
		  parentUUID = selectparentKeys[0]
	  }
      const data = {
        ...getFieldsValue(),
		parentUUID,

      }
      dispatch({
			type: `policyRuleGroup/${type}`,											//抛一个事件给监听这个type的监听器
			payload: data,

		})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyRuleGroup/controllerState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
			},
		})
	}


  const modalOpts = {
    title: `${type === 'create' ? '新增策略组' : '编辑策略组'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

  return (
  	isClose ? null :
  <Modal height="600px" {...modalOpts} >
    <Form layout="horizontal">
      <FormItem label="id" style={{ display: 'none' }} hasFeedback {...formItemLayout}>
        {getFieldDecorator('uuid', {
            initialValue: item.uuid,
          })(<Input />)}
      </FormItem>
      <FormItem label="名称" hasFeedback {...formItemLayout}>
        {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
      </FormItem>
      <FormItem label="描述" style={{ display: (type === 'update' ? 'none' : 'block') }} hasFeedback {...formItemLayout}>
        {getFieldDecorator('description', {
            initialValue: item.description,
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
  onOk: PropTypes.func,
}

export default Form.create()(modal)
