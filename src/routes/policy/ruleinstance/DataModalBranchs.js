import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Row, Col, Checkbox, message, Icon, Input } from 'antd'
import myStyle from './branchs.css'
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 16,
	},
}

const modal = ({
	dispatch,
	loading,
	visible,
	type,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
	},
	modalType,
	checkStatus,
	fenhang,
	checkAll,
	checkedList,
	indeterminate,
	user,
	fenhangArr,
	issueType
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
	//end

	const error = () => {
		message.error('请至少选择一个分行！')
	}
	const error1 = (value) => {
		message.warning(`${value}正在下发，其他分行正常下发！`)
	}
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}

			const data = {
				...getFieldsValue(),
			}
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
				let fenhangNewArr = newArr,
					fenhangIssueArr = []
				function removeByValue(arr, val) {
					for (let i = 0; i < arr.length; i++) {
						if (arr[i] == val) {
							arr.splice(i, 1)
							fenhangIssueArr.push(val)
							break
						}
					}
				}

				if (fenhangArr.length !== 0) {
					for (let j = 0; j < fenhangArr.length; j++) {
						removeByValue(fenhangNewArr, fenhangArr[j])
					}
				}
				//end

				let arr2 = new Array()
				for (let i = 0; i < fenhangNewArr.length; i++) {
					arr2[i] = `branch=='${fenhangNewArr[i]}'`
				}

				let strs = ''
				strs = arr2.join(' or ')
				if (fenhangNewArr.length !== 0) {
					let fenhangStr = ''
					if (fenhangIssueArr.length === 1) {
						fenhangStr = maps.get(fenhangIssueArr[0])
						error1(fenhangStr)
					} else if (fenhangIssueArr.length > 1) {
						let fenhangIssueArrs = []
						fenhangIssueArr.forEach((item) => {
							fenhangIssueArrs.push(maps.get(item))
						})
						fenhangStr = fenhangIssueArrs.join(' , ')
						error1(fenhangStr)
					}
					if (issueType === 'APM') {
						dispatch({
							type: 'ruleInstance/apmIssue',
							payload: {
								criteria: strs,
								ticket: data.ticket
							}
						});
						dispatch({
							type: 'ruleInstance/updateState',
							payload: {
								branchsVisible: false,
							},
						});
					} else {
						dispatch({
							type: 'ruleInstance/queryState',
							payload: {
								criteria: strs,
								ticket: data.ticket
							}
						})
					}
					// dispatch({
					// 	type: 'ruleInstance/issue',
					// 	payload: {
					// 		criteria: strs,
					// 	}, 
					// })
				} else {
					if (issueType === 'APM') {
						dispatch({
							type: 'ruleInstance/apmIssue',
							payload: {
								criteria: strs,
								ticket: data.ticket
							}
						})
					} else {
						dispatch({
							type: 'ruleInstance/issue',
							payload: {
								criteria: strs,
								ticket: data.ticket
							},
						})
					};

					dispatch({
						type: 'ruleInstance/updateState',
						payload: {
							branchsVisible: false,
						},
					})
				}

				/*
				此处需要把选择的信息，保存到state中去
				*/
				//				dispatch({
				//					type: 'ruleInstance/issue',
				//					payload: {
				//						criteria: strs,
				//					}
				//				})
				//
				//				dispatch({
				//					type: 'ruleInstance/updateState',
				//					payload: {
				//						branchsVisible: false,
				//					}
				//				})
			}
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				branchsVisible: false,
				checkedList: [],
			},
		})
	}

	const modalOpts = {
		title: '选择下发分支',
		visible,
		onOk,
		okText: '下发',
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 800,
		maskClosable: false,
	}


	const onChange = (checkedList) => {
		dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				checkedList,
				checkAll: checkedList.length === arrValue.length,
				indeterminate: !!checkedList.length && (checkedList.length < arrValue.length),
			},
		})
	}

	const onCheckAllChange = (e) => {
		dispatch({
			type: 'ruleInstance/updateState',
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
	arrValue.forEach((item, idx) => {
		let obj = {}
		obj.label = item
		obj.value = item
		obj.disabled = false
		if (fenhangArr && fenhangArr.length !== 0) {
			obj.disabled = fenhangArr.in_array(mapTurn.get(item))
		}
		arrValueNew.push(<Col span={6} key={idx}><Checkbox value={obj.value} disabled={obj.disabled}>{obj.disabled ? <Icon type="loading" /> : null} {obj.value}</Checkbox></Col>)
	})
	return (
		<Modal {...modalOpts} height="600px">
			<div>
				<div className={myStyle.ticket}>
					<Row>
						<Col>
							<FormItem label="工单号" hasFeedback {...formItemLayout}>
								{getFieldDecorator('ticket', {
									initialValue: '',
									rules: [
									],
								})(<Input />)}
							</FormItem>
						</Col>
					</Row>
				</div>
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
