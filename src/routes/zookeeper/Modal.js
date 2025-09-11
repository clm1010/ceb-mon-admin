import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Row, Modal, Table, TreeSelect, Select, message, Cascader } from 'antd'
import fenhang from '../../utils/fenhang'
import { genDictOptsByName } from "../../utils/FunctionTool"
import { ozr } from '../../utils/clientSetting'
const FormItem = Form.Item

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 12,
	},
}
const modal = ({
	dispatch,
	visible,
	modalVisible,
	type,
	item,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	},
	modalType,
	checkStatus,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	function info() {
		Modal.info({
			title: '即将变更注册状态，请检查服务可用状态',
			onOk() { },
		});
	}
	function handleChange(value) {
		if (value == 'true') {
			//更新或新增其他节点为主机群时，提示：“即将变更注册状态，请检查服务可用状态”
			info()
		}
	}
	const onOk = () => {
		if (type === 'see') {
			dispatch({
				type: 'zookeeper/updateState',
				payload: {
					modalType: 'create',
					currentItem: {},
					modalVisible: false,
				},
			})
			return
		}
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}
			item.address = data.address
			item.groupInfo = data.groupInfo
			item.mainCluster = data.mainCluster
			item.username = data.username
			item.password = data.password
			item.restfulAddress = data.restfulAddress
			item.createdTime = ''
			item.createdBy = ''
			resetFields()

			if (type === 'create') {
				item.uuid = ''
				dispatch({
					type: `zookeeper/create`,
					payload: item,
				})
			} else if (type === 'update') {
				item.updatedTime = new Date().getTime()
				dispatch({
					type: `zookeeper/update`,
					payload: item,
				})
			}
			dispatch({
				type: `zookeeper/updateState`,
				payload: {
					modalVisible: false
				},
			})
			// dispatch({
			// 	type: 'zookeeper/dubbo',
			// 	payload: {},
			// })
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'zookeeper/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: false,
			},
		})
	}
	const modalOpts = {
		title: type === 'create' ? '新增集群信息' : type === 'update' ? '编辑集群信息' : type === 'see' ? '查看集群信息' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
	}
	return (
		<Modal {...modalOpts} width="600px">
			<Form >
				<FormItem label="集群地址" hasFeedback {...formItemLayout}>
					{getFieldDecorator('address', {
						initialValue: item.address,
						rules: [
							{ required: true, },
						],
					})(<Input disabled={type === 'see'} />)}
				</FormItem>
				<FormItem label="分组信息" hasFeedback {...formItemLayout}>
					{getFieldDecorator('groupInfo', {
						initialValue: item.groupInfo,
						rules: [],
					})(<Input disabled={type === 'see'} />)}
				</FormItem>
				<FormItem label="集群接口地址" hasFeedback {...formItemLayout}>
					{getFieldDecorator('restfulAddress', {
						initialValue: item.restfulAddress,
						rules: [
							
						],
					})(<Input disabled={type === 'see'} />)}
				</FormItem>
				<FormItem label="用户名" hasFeedback {...formItemLayout}>
					{getFieldDecorator('username', {
						initialValue: item.username,
						rules: [],
					})(<Input disabled={type === 'see'} />)}
				</FormItem>
				<FormItem label="密码" hasFeedback {...formItemLayout}>
					{getFieldDecorator('password', {
						initialValue: item.password,
						rules: [],
					})(<Input.Password disabled={type === 'see'} />)}
				</FormItem>
				<FormItem label="主备状态" {...formItemLayout}>
					{
						getFieldDecorator('mainCluster', {
							initialValue: item.mainCluster == undefined ? ' ' : (item.mainCluster === false ? 'false' : 'true'),
							rules: [{ required: true }],
						})
							(<Select
								disabled={type === 'see'}
								style={{ width: '180px' }}
								onChange={handleChange}
							>
								<Select.Option value="true">主</Select.Option>
								<Select.Option value="false">备</Select.Option>
							</Select>)}
				</FormItem>
			</Form>
		</Modal >
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
