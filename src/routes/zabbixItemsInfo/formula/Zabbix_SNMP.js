import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const FormItemProps = {
  style: {
    margin: 0,
  },
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const ColProps = {
  style: {
    marginBottom: 8,
    textAlign: 'right',
  },
}

function Zabbix_SNMP ({
 dispatch, item, itemType, form,
}) {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	return (
    <div>
      <FormItem label="SNMP OID" hasFeedback {...formItemLayout}>
  {getFieldDecorator('formula', {
				initialValue: (item.itemType !== itemType) ? '' : item.formula,
				rules: [
					{
						required: true,
					},
				],
			})(<Input />)}
         </FormItem>
         <FormItem label='KEY扩展' hasFeedback {...formItemLayout}>
              {getFieldDecorator('formulaExt',{
                initialValue: item.formulaExt,
                rule: [],
              })(<Input />)}
           </FormItem>
    </div>
         
         )
}

export default Zabbix_SNMP
