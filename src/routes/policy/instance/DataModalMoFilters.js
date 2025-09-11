import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import NEFilter from '../../../components/NEFilter/NEFilter'
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
	visible,
	form = {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
	isClose,
	checkStatus,
	type,
	moFilterValue,


}) => {
  	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	let resultobj = null

  const onOk = () => {
	  form.validateFields((errors) => {
		  if (errors) {
				return
			}

		  let mofilterval = ''
		  if (resultobj) {
			  mofilterval = resultobj.genJson()
		  }

			/*
			const data = {
				...form.getFieldsValue(),   //获取弹出框所有字段的值
			}
			*/
		/*
		关闭弹出框
	   */
		dispatch({
			type: 'policyInstance/showModal',
			payload: {
				selectMoFilter: false,
				moFilterValue: '',
				isClose: false,
			},
		})
	  })
  }

  const onCancel = () => {
	    /*
		关闭弹出框
	   */
		dispatch({
			type: 'policyInstance/showModal',
			payload: {
				selectMoFilter: false,
				isClose: false,
			},
		})
  }

  const modalOpts = {
    title: '对象关联规则',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
   // ruleValue,
	width: 720,
	maskClosable: false,
  }


  const alarmFilterProps = {
	  type,
	  form,
	  info: moFilterValue,
  }

  function getChild (child) { //這个就是表单返回json的值
      resultobj = child
  }

 return (
   <Modal {...modalOpts} height="600">
     <Form>
       <NEFilter {...alarmFilterProps} ref={getChild} />
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
