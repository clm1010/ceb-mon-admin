import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import fenhang from '../../utils/fenhang'
const Option = Select.Option
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
  	selectInfo,
  	hierarchys,
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
        			selectInfo,
      		}
      		dispatch({
				type: `lookupGroup/${type}`,											//抛一个事件给监听这个type的监听器
				payload: data,
			})
    		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'lookupGroup/controllerState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
				hierarchys: '',
			},
		})
	}

  	const modalOpts = {
    		title: `${type === 'create' ? '新增节点' : '编辑节点'}`,
    		visible,
    		onOk,
    		onCancel,
    		wrapClassName: 'vertical-center-modal',
    		maskClosable: false,
  	}

  	return (
  		isClose ? null :
  <Modal {...modalOpts} height="600px">

    <Form layout="horizontal">
      { hierarchys === '1' ?
        <FormItem label="节点名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            				initialValue: type === 'create' ? '' : selectInfo.name,
            				rules: [
              			{
                				required: true,
              			},
            				],
          			})(<Input />)}
        </FormItem> :
        <FormItem label="适用范围" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            				initialValue: type === 'create' ? '' : selectInfo.name,
            				rules: [
              			{
                				required: true,
              			},
            				],
         			})(<Select
           showSearch
         			>
           {fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
               </Select>)}
        </FormItem>
        			}

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
