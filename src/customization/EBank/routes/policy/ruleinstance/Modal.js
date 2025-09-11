import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'

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
    resetFields,
  },
  modalType,
  checkStatus,
  isClose,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      dispatch({
				type: `ruleInstance/${type}`,											//抛一个事件给监听这个type的监听器
				payload: data,
			})
			resetFields()
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'ruleInstance/hideModal',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})
	}

	const onCheckStart = () => {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      dispatch({
				type: 'ruleInstance/showCheckStatus',											//抛一个事件给监听这个type的监听器
				payload: {
					currentItem: data,
					checkStatus: 'checking',
				},
			})
    })
	}

	const onCheckCancel = () => {																				//弹出窗口点击确定按钮触发的函数
  	dispatch({
			type: 'ruleInstance/showCheckStatus',											//抛一个事件给监听这个type的监听器
			payload: {
				checkStatus: 'done',
			},
		})
	}

  const modalOpts = {
    title: `${type === 'create' ? '新增监控实例' : '编辑监控实例'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="实例名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="URL" hasFeedback {...formItemLayout}>
          {getFieldDecorator('url', {
            initialValue: item.url,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="用户名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('passwd', {
            initialValue: item.passwd,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input.Password />)}
        </FormItem>
        <div width="100%" style={{ marginLeft: 200 }}>
          <Button.Group>
            {
	        		checkStatus === 'checking' ?
  <Button value="default" size="small" icon="loading" disabled />
	        		:
  <Button value="default" size="small" onClick={onCheckStart} icon="sync" />
			    	}
            <Button value="default" size="small" onClick={onCheckCancel}>取消</Button>
          </Button.Group>
        </div>
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
