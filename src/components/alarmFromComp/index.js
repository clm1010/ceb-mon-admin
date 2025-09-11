import React from 'react'
import { Form, Checkbox } from 'antd'
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

const AlarmFromComp = ({
	form: {//表单函数
	  getFieldDecorator,
	  validateFields,
	  getFieldsValue,
	  resetFields,
	},
	checkedList,
	indeterminate,
	checkAll,
	dispatch,
	compName,
}) => {
	let dictArr = JSON.parse(localStorage.getItem('dict'))['applicationtype']
	let setaData = new Set()
	if (dictArr) dictArr.forEach((item)=>{
		let name = item.name.split('-')[0]
		setaData.add(name)
	})
	// const plainOptions = [...setaData]
	const plainOptions = [
		'操作系统',
		'数据库',
		'中间件',
		'存储',
		'硬件',
		'应用',
		'安全',
		'网络',
		'自检',
		'机房环境',
		'私有云',
		'桌面云',
		'全栈云',
	]

	const onCheckAllChange = (e) => {
		resetFields([compName])

    dispatch({
    	type: 'alarmFrom/setState',
    	payload: {
	      checkedList: e.target.checked ? plainOptions : [],
	      indeterminate: false,
	      checkAll: e.target.checked,
	      alarmFromNum: true,
	    },
    })
  }

  const onChange = (checkedList) => {
    dispatch({
    	type: 'alarmFrom/setState',
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
			告警来源：&nbsp;&nbsp;
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

export default AlarmFromComp
