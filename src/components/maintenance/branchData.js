import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Checkbox, message } from 'antd'
import myStyle from './style.css'
const CheckboxGroup = Checkbox.Group
const BranchModalDesc = ({
	dispatch,
	visible,
	loading,
	onCancel,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	},
	checkAll,
	checkedList,
	fenhang,
	indeterminate,
}) => {
	let arrValue = new Array()
	fenhang.map(d => arrValue.push(d.value))
	const error = () => {
		message.error('请至少选择一个分行！')
	}

	const onOk = () => { //弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}

			resetFields()

			let newArr = []
	  		for (let i = 0; i <= checkedList.length; i++) {
	  			let checkedStr = checkedList[i]
	  			for (let j = 0; j < fenhang.length; j++) {
	  				let strs = fenhang[j]
					if (checkedStr === fenhang[j].value) {
						newArr.push(fenhang[j].key)
					}
	  			}
	  		}
	  		if (newArr.length <= 0) {
				error()
			} else {
				//适用范围回填----start
				let branchStr = ''
				let maps = new Map()
				fenhang.forEach((obj, index) => {
					let keys = obj.key
					let values = obj.value
					maps.set(keys, values)
				})

				let branchArrayValue = []
				newArr.forEach((item) => {
					branchArrayValue.push(maps.get(item))
				})
				branchStr = branchArrayValue.join('/')
				//end
				let branchJoin = newArr.join(',')
				dispatch({
					type: 'mainRuleInstanceInfo/updateState',
					payload: {
						branchArray: branchJoin,
						branchStr,
						branchVisible: false,
					},
				})
				resetFields()
			}
		})
	}

  	const modalOpts = {
    		title: '选择适用范围',
    		visible,
    		onCancel,
    		onOk,
    		wrapClassName: 'vertical-center-modal',
		width: 950,
		maskClosable: false,
		zIndex: 1000,
  	}

	const onChange = (checkedList) => {
    		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				checkedList,
				checkAll: checkedList.length === arrValue.length,
				indeterminate: !!checkedList.length && (checkedList.length < arrValue.length),
			},
		})
  	}

  	const onCheckAllChange = (e) => {
    		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				checkedList: e.target.checked ? arrValue : [],
				checkAll: e.target.checked,
				indeterminate: false,
			},
		})
  	}

  	return (
    		<Modal {...modalOpts} >
      <div className={myStyle.checkPart}>
        <div className={myStyle.checkTitle}>请选择适应范围:</div>
        <div className={myStyle.checkAll}>
          <Checkbox
            onChange={onCheckAllChange}
            checked={checkAll}
            indeterminate={indeterminate}
          >
    						全选/全不选
          </Checkbox>
        </div>
        <div className={myStyle.checkOne}>
          <CheckboxGroup options={arrValue} value={checkedList} onChange={onChange} />
        </div>
      </div>
    		</Modal>
  	)
}
BranchModalDesc.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.string,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}
export default Form.create()(BranchModalDesc)
