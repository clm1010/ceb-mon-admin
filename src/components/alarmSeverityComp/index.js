import React from 'react'
import { Form, Select, Checkbox } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const customPanelStyle = {
  background: '#fbfbfb',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden',
  paddingLeft: 12,
  paddingRight: 12,
}

const customPanelStyle1 = {
  background: '#fbfbfb',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  borderBottom: '1px solid #E9E9E9',
  paddingLeft: 12,
  paddingRight: 12,
  paddingBottom: 12,
  paddingTop: 12,
}

const AlarmSeverityComp = ({
	checkedList,
	indeterminate,
	checkAll,
	dispatch,
	form,
	compName,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	const plainOptions = [
		{ label: '一级故障', value: '1' },
		{ label: '二级告警', value: '2' },
		{ label: '三级预警', value: '3' },
		{ label: '四级提示', value: '4' },
		{ label: '五级信息', value: '100' },
	]

	const onCheckAllChange = (e) => {
		resetFields([compName])

    dispatch({
    	type: 'alarmSeverity/setState',
    	payload: {
	      checkedList: e.target.checked ? ['1', '2', '3', '4', '100'] : [],
	      indeterminate: false,
	      checkAll: e.target.checked,
	      alarmSeverityNum: true,
	    },
    })
  }

  const onChange = (checkedList) => {
    dispatch({
    	type: 'alarmSeverity/setState',
    	payload: {
	      checkedList,
	      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
	      checkAll: checkedList.length === plainOptions.length,
	    },
    })
  }

	return (
  <div>
    <div style={customPanelStyle1}>
			告警等级：&nbsp;&nbsp;
      <Checkbox
        checked={checkAll}
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
      >
	        全选
      </Checkbox>
    </div>
    <div style={customPanelStyle}>
      <FormItem key={compName}>
        {getFieldDecorator(compName, {
						initialValue: checkedList,
						rules: [
							  {
									required: true,
							  },
							],
					})(<Checkbox.Group onChange={onChange} options={plainOptions} />)}
      </FormItem>
    </div>
  </div>
	)
}

export default AlarmSeverityComp
