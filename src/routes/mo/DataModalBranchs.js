import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Table, Row, Col, Checkbox, message, Icon } from 'antd'
import myStyle from './branchs.css'
const CheckboxGroup = Checkbox.Group

const modal = ({
	dispatch,
	visible,
	form: {
		validateFields,
	},
	fenhang,
	checkAll,
	checkedList,
	indeterminate,
	user,
	fenhangArr,
}) => {
	let arr = new Array()
	fenhang.map(d => arr.push(d.key))
	let arrValue = new Array()
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
	let adminFenhang = new Array()
	fenhang.map(item => adminFenhang.push(item.value))
	//分行下发权限---start
	//	let branchValue = new Array();
	let rolesArr = user.roles
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
							//arrValue.push(filterItemsArr[k].value)
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
	//end

	const error = () => {
		message.error('请至少选择一个分行！')
	}
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			let newArr = []
			for (let i = 0; i <= checkedList.length; i++) {
				let checkedStr = checkedList[i]
				for (let j = 0; j < fenhang.length; j++) {
					if (checkedStr === fenhang[j].value) {
						newArr.push(fenhang[j].key)
					}
				}
			}
			if (newArr.length <= 0) {
				error()
			} else {
				//查询所选分行是否正在下发---start
				let arrtemp = []
				if (newArr.find(str => str == 'QH')) {
					// arrtemp.push('QH')
				} else if ((newArr.find(str => str == 'FH')) && (newArr.find(str => str == 'ZH'))) {
					// arrtemp.push('QH')
				} else if ((newArr.find(str => str == 'FH'))) {
					arrtemp.push(`branchName!='ZH'`)
				} else {
					for (let i = 0; i < newArr.length; i++) {
						arrtemp[i] = `branchName=='${newArr[i]}'`
					}
				}
				// let arr2 = new Array()
				// for (let i = 0; i < arrtemp.length; i++) {
				// 	arr2[i] = `branchName=='${arrtemp[i]}'`
				// }
				// let strs = ''
				// strs = arr2.join(' or ')
				dispatch({
					type: 'mo/moDown',
					payload: {
						q: arrtemp.join(' or '),
						filename:'监控对象'
					},
				})
			}
			dispatch({
				type: 'mo/setState',
				payload: {
					branchsVisible: false,
				},
			})
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'mo/setState',
			payload: {
				branchsVisible: false,
				checkedList: [],
			},
		})
	}

	const modalOpts = {
		title: '选择导出行',
		visible,
		onOk,
		okText: '导出',
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 760,
		maskClosable: false,
	}

	const onChange = (checkedList) => {
		dispatch({
			type: 'mo/setState',
			payload: {
				checkedList,
				checkAll: checkedList.length === arrValue.length,
				indeterminate: !!checkedList.length && (checkedList.length < arrValue.length),
			},
		})
	}

	const onCheckAllChange = (e) => {
		dispatch({
			type: 'mo/setState',
			payload: {
				checkedList: e.target.checked ? arrValue : [],
				checkAll: e.target.checked,
				indeterminate: false,
			},
		})
	}

	let arrValueNew = []
	arrValue.forEach((item) => {
		let obj = {}
		obj.label = item
		obj.value = item
		obj.disabled = false
		arrValueNew.push(<Col span={6}><Checkbox value={obj.value} disabled={obj.disabled}>{obj.value}</Checkbox></Col>)
	})
	return (
  <Modal {...modalOpts} height="600px">
    <div>
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
        <CheckboxGroup style={{ width: '100%' }} onChange={onChange} value={checkedList}>
          <Row>
            {arrValueNew}
          </Row>
        </CheckboxGroup>
      </div>
    </div>
  </Modal>
	)
}

modal.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}

export default Form.create()(modal)
