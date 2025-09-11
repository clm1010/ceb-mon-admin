import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select } from 'antd'
import ConditionBasicMode from './ConditionBasicMode'
import './style.css'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 8,
  },
}

const oelmodal = ({
	dispatch,
	loading,
	visible, //控制弹出窗
	currentItem,
	visibleName, //控制弹出窗state中的名称
	form,
	moFilterValue, //保存对象的值
	moFilterName, //保存对象在state中的名称，
	moFilterOldValue, //保存最初的状态,点击cancel的时候可以恢复，在编辑时很有用
	queryPath, //保存的路径
	title, //弹出窗的名称
	confirmLoading,
	evnetType,

}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form
  const onOk = () => {
	  dispatch({
			type: `${queryPath}`,
			payload: {
				confirmLoading: true,
			},
		})

	  form.validateFields((errors) => {
		if (errors) {
		  dispatch({
			type: `${queryPath}`,
			payload: {
				confirmLoading: false,
			},
		  })
		  return
		}

	  let mofilterval = {}
	  let fields = ['name', 'description', 'isGlobal', 'basicLogicOp', 'filterMode']
	  let filterIndex = [0]
	  if (moFilterValue && moFilterValue.filterIndex && moFilterValue.filterIndex.length > 0) {
		  filterIndex = moFilterValue.filterIndex
	  }
	  if (moFilterValue && moFilterValue.filterItems && moFilterValue.filterItems.length > 0 && moFilterValue.filterItems.length != filterIndex.length) {
		  let indexs = []
		  moFilterValue.filterItems.forEach((item, index) => {
			indexs.push(index)
		  })
		  filterIndex = indexs
	  }
	  filterIndex.forEach((num) => {
		fields.push(`leftBrackets_${num}`)
		fields.push(`field_${num}`)
		fields.push(`op_${num}`)
		fields.push(`value_${num}`)
		fields.push(`rightBrackets_${num}`)
		fields.push(`logicOp_${num}`)
	  })

		const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值

		let arrs = []
		filterIndex.forEach((num, index) => {
			let bean = {}
			bean.leftBrackets = valObj[`leftBrackets_${num}`]
			bean.field = valObj[`field_${num}`]
			bean.op = valObj[`op_${num}`]
			bean.value = valObj[`value_${num}`]
			bean.rightBrackets = valObj[`rightBrackets_${num}`]
			bean.logicOp = valObj[`logicOp_${num}`]
			//bean.idx = index
			arrs.push(bean)
		})

		mofilterval.basicLogicOp = valObj.basicLogicOp
		mofilterval.filterMode = valObj.filterMode
		mofilterval.filterItems = arrs
		mofilterval.uuid = (moFilterValue && moFilterValue.uuid ? moFilterValue.uuid : '')

		let eventfilteritem = {}
		eventfilteritem.name = valObj.name
		eventfilteritem.description = valObj.description
		eventfilteritem.isGlobal = (!!(valObj.isGlobal && valObj.isGlobal === 'Global'))
		eventfilteritem.filter = mofilterval
		eventfilteritem.uuid = (currentItem ? currentItem.uuid : '')

	resetFields() //需要重置一下表单

		//添加/修改一条记录
		dispatch({
			type: `oelEventFilter/${evnetType}`,
			payload: eventfilteritem,
		})
	  })
  }


  const onCancel = () => {
	  resetFields() //需要重置一下表单

		//关闭弹出框
		//取消的时候，恢复最初的状态

		dispatch({
			type: `${queryPath}`,
			payload: {
				[visibleName]: false,
				[moFilterName]: { ...moFilterOldValue },
			},
		})
  }

  const modalOpts = {
    title,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
   // ruleValue,
	width: 720,
	confirmLoading,
	maskClosable: false,
	//key:`${new Date().getTime()}`,
  }


  const alarmFilterProps = {
	  dispatch,
	  filter: moFilterValue,
	  queryPath,
	  moFilterName,
	  myform: form,
  }

 return (
   <Modal {...modalOpts} height="800px">
     <Form>
       <section>
         <FormItem label="过滤器名称" hasFeedback {...formItemLayout}>
           {getFieldDecorator('name', {
					initialValue: currentItem.name,
					rules: [
					  {
						required: true,
					  },
					],
				  })(<Input />)}
         </FormItem>
         <FormItem label="描述" {...formItemLayout}>
           {getFieldDecorator('description', {
					initialValue: currentItem.description,
				  })(<Input />)}
         </FormItem>
         <FormItem label="类型" hasFeedback {...formItemLayout}>
           {getFieldDecorator('isGlobal', {
					initialValue: currentItem.isGlobal,
					rules: [
					  {
						required: true,
					  },
					],
				  })(<Select>
  <Select.Option value="Global">Global</Select.Option>
  <Select.Option value="Private">Private</Select.Option>
         </Select>)}
         </FormItem>
       </section>
       <ConditionBasicMode {...alarmFilterProps} />
     </Form>
   </Modal>
	)
}

oelmodal.propTypes = {

  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  visibleName: PropTypes.string,
  moFilterValue: PropTypes.object,
  moFilterName: PropTypes.string,
  moFilterOldValue: PropTypes.object,
  queryPath: PropTypes.string,
  title: PropTypes.string,
  currentItem: PropTypes.object,

}

export default Form.create()(oelmodal)
