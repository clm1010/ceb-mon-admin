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
					copydataSouseVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'oel/updateState',
				payload: {
					copydataSouseVisible: false,
				},
		})
	}


  const modalOpts = {
    title: '数据源克隆',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }


  return (

    <Modal {...modalOpts} width="350px">
      <Form >

        <FormItem label="数据源名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
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
