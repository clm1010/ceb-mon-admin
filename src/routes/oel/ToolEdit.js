import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Search = Input.Search
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
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
	const onOk = () => {
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      dispatch({
				type: 'oel/updateState',
				payload: {
					tooleditVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'oel/updateState',
				payload: {
					tooleditVisible: false,
				},
		})
	}


  const modalOpts = {
    title: '工具配置',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }


  return (

    <Modal {...modalOpts} width="800px">

      <Form >
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            	initialValue: '',
            	rules: [
             	 {
              	  required: true,
              	},
            	],
         	 })(<Input />)}
        </FormItem>
        <div style={{ position: 'relative' }} id="area1" />
        <FormItem label="类型" hasFeedback {...formItemLayout}>
          			{getFieldDecorator('type', {
            			initialValue: '',
                })(<Select
                  placeholder="请选择"
                  getPopupContainer={() => document.getElementById('area1')}
                >
                  <Select.Option value="1">ComboBox</Select.Option>
                  <Select.Option value="2">ComboBox2</Select.Option>
                   </Select>)}
        </FormItem>
        <FormItem label="SQL" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sql', {
            	initialValue: '',
            	rules: [
             	 {
              	  required: true,
              	},
            	],
         	 })(<Input />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            	initialValue: '',
            	rules: [
             	 {
              	  required: true,
              	},
            	],
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
