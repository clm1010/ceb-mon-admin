import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Select } from 'antd'
import RuleEditor from '../../../components/RuleEditor/RuleEditor'
import { Link } from 'dva/router'

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

function Syslog_Epp ({
 item, form, type, itemType,
}) {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	let parentObj = {}
	let info = ''

	if (type !== 'create' && item.formula !== undefined && item.itemType === 'SYSLOG_EPP') {
		let parentStr = item.formula.split('|*^_^*|')
		parentObj = JSON.parse(parentStr[0])
		info = parentStr[1]
	}

	const ruleProps = {
		form,
		info,
		type,
	}

	return (
  <div><Row gutter={12} key="row_epp">
    <Col key="epp_col1" {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>消息串</Col>
    <Col key="epp_col2" {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
      <FormItem {...FormItemProps} hasFeedback key="op_epp">
        {
                getFieldDecorator('op_parent', {
                  initialValue: parentObj.op_parent,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select style={{ width: '100%' }}>
                  <Select.Option value="includes">包含</Select.Option>
                  <Select.Option value="equal">匹配</Select.Option>
                   </Select>)}
      </FormItem>
    </Col>
    <Col key="epp_col3" {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
      <FormItem {...FormItemProps} hasFeedback key="value_epp">
        {getFieldDecorator('log_parent', {
                initialValue: parentObj.log_parent,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
      </FormItem>
    </Col>
    <Col key="epp_col4" {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>默认指标值</Col>
    <Col {...ColProps} xl={6} md={6}>
      <FormItem {...FormItemProps} hasFeedback key="epp_col2">
        {getFieldDecorator('kpi_parent', {
                initialValue: parentObj.kpi_parent,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input style={{ width: '100%' }} />)}
      </FormItem>
    </Col>
  </Row>
    <RuleEditor {...ruleProps} />
    <FormItem label='KEY扩展' hasFeedback {...formItemLayout}>
              {getFieldDecorator('formulaExt',{
                initialValue: item.formulaExt,
                rule: [],
              })(<Input />)}
           </FormItem>
  </div>
	)
}

export default Syslog_Epp
//<RuleEditor {...ruleProps} ref={getChild} /><Button onClick={genJson}>Syslog_Epp</Button></div>
