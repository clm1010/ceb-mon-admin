import React from 'react'
import { Form, DatePicker, InputNumber, Input } from 'antd'

const FormItem = Form.Item
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
}

function formulaZone ({ cfgType, form }) {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	const switchType = (cfgType, item) => {
		for (let str of ViewColumns) {
			if (str.key === cfgType) {
				switch (str.type) {
					case 'int':
						return (<FormItem hasFeedback {...formItemLayout}>
  {
	          						getFieldDecorator('int', {
		          						initialValue: '',
						            	rules: [
						              	{
						                	required: true,
						              	},
						            	],
					          	})(<InputNumber />)}
              </FormItem>)
						break
					case 'utc':
						return (<FormItem hasFeedback {...formItemLayout}>
  {
	          						getFieldDecorator('utc', {
		          						initialValue: '',
						            	rules: [
							              {
							                required: true,
							              },
						            	],
					          	})(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" />)}
              </FormItem>)
						break
					default:
						return (<FormItem hasFeedback {...formItemLayout}>
  {
	          						getFieldDecorator('str', {
	          							initialValue: '',
					            		rules: [],
					          	})(<Input placeholder={"查询条件为空字符串''则保持文本框为空"} />)}
              </FormItem>)
						break
				}
			}
		}
		return (<FormItem hasFeedback {...formItemLayout}>
  {
	          		getFieldDecorator('str', {
	          			initialValue: '',
					       	rules: [],
					    })(<Input placeholder={"查询条件为空字符串''则保持文本框为空"} />)}
          </FormItem>)
	}
	return (
  <div>{switchType(cfgType)}</div>
	)
}

export default formulaZone
