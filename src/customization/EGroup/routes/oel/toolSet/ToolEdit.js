import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, Tag } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  	labelCol: {
    		span: 2,
  	},
  	wrapperCol: {
    		span: 22,
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
		validateFields((errors) => {
	      	if (errors) {
	        		return
	      	}
	      	const data = {
	        		...getFieldsValue(),
	      	}
			resetFields()
			dispatch({
				type: 'oelToolset/creates',
				payload: data,
			})
	      	dispatch({
				type: 'oelToolset/updateState',
				payload: {
					tooleditVisible: false,
				},
			})
    		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'oelToolset/updateState',
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

  	const des = (
    <div>
		    1.使用 <Tag color="#2592fc">IN ()</Tag>来替换 <Tag color="#2592fc">=</Tag>来支持批处理;<br />
		    2.字段名和OS实际字段名称包括大小写都要保持一致;<br />
				3.用户名内部变量用<Tag color="#2592fc">%[username]</Tag>; 用户id内部变量用<Tag color="#2592fc">%[userid]</Tag>;<br />
				4.引用选中告警字段里的值,比如OZ_AlarmID字段，用<Tag color="#2592fc">#[OZ_AlarmID]</Tag>;
    </div>
		 )

  	return (
    <Modal {...modalOpts} width="800px">
      <Alert type="info" message="工具内容请注意：" description={des} showIcon />
      <br />
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
          {getFieldDecorator('toolType', {
            				initialValue: 'SQL',
                			})(<Select
                  getPopupContainer={() => document.getElementById('area1')}
                			>
                  <Select.Option value="SQL" >SQL</Select.Option>
                  <Select.Option value="URL" >URL</Select.Option>
                      </Select>)}
        </FormItem>
        <FormItem label="内容" hasFeedback {...formItemLayout}>
          {getFieldDecorator('contents', {
            	initialValue: '',
            	rules: [
             	 {
              	  required: true,
              	},
            	],
         	 })(<TextArea placeholder="请输入" rows={3} />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            	initialValue: '',
            	rules: [
             	 {
              	  required: false,
              	},
            	],
         	 })(<TextArea rows={3} />)}
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
