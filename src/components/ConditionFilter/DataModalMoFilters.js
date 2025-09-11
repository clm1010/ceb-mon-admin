import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import ConditionBasicMode from './ConditionBasicMode'
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
}

const modal = ({
	dispatch,
	loading,
	visible, //控制弹出窗
	visibleName, //控制弹出窗state中的名称
	form,
	moFilterValue, //保存对象的值
	moFilterName, //保存对象在state中的名称，
	moFilterOldValue, //保存最初的状态,点击cancel的时候可以恢复，在编辑时很有用
	queryPath, //保存的路径
	title, //弹出窗的名称
	moTreeDatas, //mo节点树
	appsInfos, //应用系统信息
	typeValue,
}) => {
	/*
  	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' }
	else if (checkStatus == 'success') { icon = 'check' }
	else if (checkStatus == 'fail') { icon = 'close' }
	else if (checkStatus == 'checking') { icon = 'loading' }
	*/
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

  //获取时间的值
  const getColumsVal = (val) => {
	if (typeof (val) === 'object') {
		return Date.parse(val)
	}
	return val
  }

  const onOk = () => {
	  form.validateFields((errors) => {
		if (errors) {
			return
		}

	  let mofilterval = {}
	  let fields = ['basicLogicOp', 'filterMode', 'firstClass', 'secondClass', 'thirdClass']
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
			bean.value = getColumsVal(valObj[`value_${num}`])
			bean.rightBrackets = valObj[`rightBrackets_${num}`]
			bean.logicOp = valObj[`logicOp_${num}`]
			bean.index = index
			arrs.push(bean)
		})

		mofilterval.basicLogicOp = valObj.basicLogicOp
		mofilterval.filterMode = valObj.filterMode
		mofilterval.filterItems = arrs
		mofilterval.uuid = ''
		mofilterval.firstClass = (valObj.firstClass && valObj.firstClass !== '' ? valObj.firstClass : undefined)
		mofilterval.secondClass = (valObj.secondClass && valObj.secondClass !== '' ? valObj.secondClass : undefined)
		mofilterval.thirdClass = (valObj.thirdClass && valObj.thirdClass !== '' ? valObj.thirdClass : undefined)


	resetFields() //需要重置一下表单
		/*
		关闭弹出框
	   */
		dispatch({
			type: `${queryPath}`,
			payload: {
				[visibleName]: false,
				[moFilterName]: mofilterval,
			},
		})
	  })
  }

  const onCancel = () => {
	  resetFields() //需要重置一下表单
	    /*
		关闭弹出框
		取消的时候，恢复最初的状态
	   */
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
	width: 750,
	maskClosable: false,

	//key:`${new Date().getTime()}`,
  }


  const alarmFilterProps = {
	  dispatch,
	  filter: moFilterValue,
	  queryPath,
	  moFilterName,
	  myform: form,
	  moTreeDatas,
	  appsInfos,
	  typeValue,
  }


 return (
   <Modal {...modalOpts} height="600px">
     <Form>
       <ConditionBasicMode {...alarmFilterProps} />
     </Form>
   </Modal>
	)
}

modal.propTypes = {
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

}

export default Form.create()(modal)
