import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select } from 'antd'
import fenhang from '../../utils/fenhang'

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
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
	const onOk = () => {

	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalToolVisible: false,
			},
		})
	}


  const modalOpts = {
    title: '查看工具实例详情',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

  return (
    <Modal {...modalOpts} height="600px" footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>]}>
      <Form layout="horizontal">
        <FormItem label="实例名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [],
          })(<Input readOnly />)}
        </FormItem>
        <FormItem label="工具类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('toolType', {
            initialValue: item.toolType,
            rules: [],
          })(<Input readOnly />)}
        </FormItem>
        <FormItem label="所属机构" hasFeedback {...formItemLayout}>
          {getFieldDecorator('branch', {
            initialValue: item.branch,
            rules: [],
          })(<Select disabled>
            {fenhang.map(d => <Select.Option key={d.key}>{d.value}</Select.Option>)}
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
  onOk: PropTypes.func,
}

export default Form.create()(modal)
