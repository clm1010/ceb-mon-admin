import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Icon, Checkbox, message, Col, Row, Spin } from 'antd'
import myStyle from '../policy/rule/style.css'
import {ozr} from '../../../../utils/clientSetting'
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
	indeterminate,
	user,
	fenhang,
	fenhangArr,
	calculateState,
}) => {
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})
	let mapTurn = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.value
		let values = obj.key
		mapTurn.set(keys, values)
	})
	let arr = new Array()
	let adminFenhang = new Array()
	fenhang.map(d => arr.push(d.key))
	fenhang.map(item => adminFenhang.push(item.value))
	let arrValue = new Array()
	//分行下发权限---start
	let rolesArr = user.roles
	if (rolesArr) {
		if (rolesArr[0].name === '超级管理员' && rolesArr[0].description === '超级管理员') {
			arrValue = adminFenhang
		} else {
			for (let i = 0; i < rolesArr.length; i++) {
				let dataPermissionsArr = rolesArr[i].permissions
				if (dataPermissionsArr.length == 0) {
					fenhang.map(d => arrValue.push(d.value))
				} else {
					for (let j = 0; j < dataPermissionsArr.length; j++) {
						let permissionFilterObj = dataPermissionsArr[j].permissionFilter
						let filterItemsArr = permissionFilterObj.filterItems
						for (let k = 0; k < filterItemsArr.length; k++) {
							if (filterItemsArr[k].field === 'branchName') {
		//						arrValue.push(filterItemsArr[k].value)
								let values = filterItemsArr[k].value
								arrValue.push(maps.get(values))
							}
						}
					}
					let info = []
					for (let infos of arrValue) {
							if (info.indexOf(infos) === -1) {
								info.push(infos)
						}
					}
					arrValue = info
				}
			}
		}
	}


	//end
	const error = () => {
		message.error(ozr('calcError'))
	}

	const error1 = (value) => {
		message.error(`${value}正在下发，请重新选择`)
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
				//查询所选分行是否正在下发---start
				let fenhangNewArr = []
				if (fenhangArr.length > 0) {
				for (let i = 0; i < fenhangArr.length; i++) {
					for (let j = 0; j < newArr.length; j++) {
						if (fenhangArr[i] === newArr[j]) {
							fenhangNewArr.push(fenhangArr[i])
						}
					}
				}
			}
				//end
				let arr2 = new Array()
				for (let i = 0; i < newArr.length; i++) {
					arr2[i] = `branch=='${newArr[i]}'`
				}

				let strs = ''
				strs = arr2.join(' or ')
				if (fenhangNewArr.length !== 0) {
					let fenhangStr = fenhangNewArr.join(' , ')
					error1(fenhangStr)
				} else {
					dispatch({
						type: 'policyRule/updateState',
						payload: {
							calculateState: true,
						},
					})
					dispatch({
						type: 'policyRule/calc',
						payload: {
							criteria: strs,
							criteriaArr: newArr,
						},
					})
				}


//				dispatch({
//					type: 'policyRule/status',
//					payload: {
//						criteriaArr: newArr,
//					},
//				})
//				if(fenhangArr.length !== 0){
//					let fenhangStr = ''
//					let fenhangNewArr = []
//					let maps = new Map();
//					fenhang.forEach((obj,index) => {
//						let keys = obj.key
//						let values = obj.value
//						maps.set(keys,values)
//					})
//					fenhangArr.forEach((item)=>{
//						fenhangNewArr.push(maps.get(item));
//					})
//					fenhangStr = fenhangNewArr.join(" , ");
//					error1(fenhangStr);
//				}else{
//					dispatch({
//						type: 'policyRule/calc',
//						payload: {
//							criteria: strs,
//							criteriaArr: newArr,
//						},
//					})
//				}
			}
		})
	}

  	const modalOpts = {
		title: ozr('calc'),
		visible,
		onCancel,
		onOk,
		wrapClassName: 'vertical-center-modal',
		width: 1000,
		maskClosable: false,
  	}

	const onChange = (checkedList) => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				checkedList,
				checkAll: checkedList.length === arrValue.length,
				indeterminate: !!checkedList.length && (checkedList.length < arrValue.length),
			},
		})
  	}

  	const onCheckAllChange = (e) => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				checkedList: e.target.checked ? arrValue : [],
				checkAll: e.target.checked,
				indeterminate: false,
			},
		})
  	}
  	Array.prototype.in_array = function (e) {
  		let i
	  	for (i = 0; i < this.length && this[i] != e; i++);
	  	return !(i == this.length)
	}
  	let arrValueNew = []
  	arrValue.forEach((item) => {
  		let obj = {}
  		obj.label = item
  		obj.value = item
  		obj.disabled = false
  		if (fenhangArr && fenhangArr.length !== 0) {
  			obj.disabled = fenhangArr.in_array(mapTurn.get(item))
  		}
  		arrValueNew.push(<Col span={6}><Checkbox value={obj.value} disabled={obj.disabled}>{obj.disabled ? <Icon type="loading" /> : null} {obj.value}</Checkbox></Col>)
  	})
  	return (
    		<Modal {...modalOpts} >
      <Spin spinning={calculateState} tip="正在计算，请稍后...">
        <div className={myStyle.checkPart}>
          <div className={myStyle.checkTitle}>请选择{ozr('calcInfo')}:</div>
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
            {/*<CheckboxGroup options={arrValueNew} value={checkedList} onChange={onChange} />*/}
            <CheckboxGroup style={{ width: '100%' }} onChange={onChange} value={checkedList}>
              <Row>
                {arrValueNew}
              </Row>
            </CheckboxGroup>
          </div>
        </div>
      </Spin>
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
