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

const NotifyWayComp = ({
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
  //获取数据字典的通知类型的数据字典
  let notificationType = JSON.parse(localStorage.getItem('dict'))['notificationType']
  let plainOptions = []//复选框的UI数据
  let plainOptionsText = []//文案依据
  if(notificationType.length > 0){//处理数据的数据结构
    //plainOptions 是复选框的UI数据
    plainOptions = notificationType.map( ( item, index ) =>{
      return { label: item.name, value: item.key }
    })
    //plainOptionsText 是全选的文案依据
    plainOptionsText = notificationType.map( ( item, index ) =>{
      return  item.key
    })
  }


	const onCheckAllChange = (e) => {
		resetFields([compName])

    dispatch({
    	type: 'notifyWay/setState',
    	payload: {
	      checkedList: e.target.checked ? plainOptionsText : [],
	      indeterminate: false,
	      checkAll: e.target.checked,
	      notifyWayNum: true,
	    },
    })
  }

  const onChange = (checkedList) => {
    dispatch({
    	type: 'notifyWay/setState',
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
	      通知方式：&nbsp;&nbsp;
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

export default NotifyWayComp
