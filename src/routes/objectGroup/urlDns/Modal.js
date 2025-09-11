import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, Divider } from 'antd'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import Fenhang from '../../../utils/fenhang'
import AppSelect from '../../../components/appSelectComp'
import { useState } from 'react'
const FormItem = Form.Item
const { TextArea } = Input;

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const modal = ({
	dispatch,
	modalVisible,
	item,
	form,
	modalType,
	modalName,
	alertType,
	alertMessage,
	appSelect,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form
	const user = JSON.parse(sessionStorage.getItem('user'))

	const [url, setUrl] = useState({})

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

	if (modalType === 'create' && item.branchName === undefined) {
		item.branchName = user.branch
	}

	// 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖
	if (appSelect.currentItem.affectSystem !== undefined) {
		item.appName = appSelect.currentItem.affectSystem
		item.uniqueCode = appSelect.currentItem.c1
		item.appCode = appSelect.currentItem.englishCode
	}

	const appSelectProps = Object.assign({}, appSelect, {
		placeholders: '请输入应用信息查询',
		name: '应用分类名称',
		modeType: 'combobox',
		required: true,
		dispatch,
		form,
		disabled: false,
		compName: 'appName',
		formItemLayout,
		currentItem: { affectSystem: item.appName },
	})

	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'urlDns/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onOk = () => {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}

			data.keyword = data.keyword
			data.branchname_cn = Fenhangmaps.get(data.branchName)
			data.mngtOrg = Fenhangmaps.get(data.mngtOrgCode)
			data.hostname = data.hostname ? data.hostname : data.discoveryIP

			for (let field in data) {
				if (typeof (data[field]) === 'object') {
					data[field] = Date.parse(data[field])
				}
			}
			//清除appSelect内容
			dispatch({
				type: 'appSelect/clearState',				//@@@
			})

			//保存MO信息，跳转到抓取设备信息流程
			if (appSelect.currentItem.c1 && modalType === 'create') {
				dispatch({
					type: `urlDns/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `urlDns/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}
			setUrl({})
			dispatch({
				type: 'urlDns/setState',				//@@@//抛一个事件给监听这个type的监听器
				payload: {
					modalVisible: false,
				},
			})
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		setUrl({})
		dispatch({
			type: 'urlDns/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})
		//清除appSelect内容
		dispatch({
			type: 'appSelect/clearState',
		})
	}

	const onChange_fullURL = e => {
		try {
			const url = new URL(e.target.value)
			let host_port = url.port == '' ? ':80' : ''
			let port = url.port == '' ? '80' : ''
			setUrl({
				discoveryIP: url.host + host_port,
				protocol: url.protocol,
				port: url.port + port,
				pathname: url.pathname,
				search: url.search,
				section: url.hash,
				keyword: url.host + host_port + url.pathname,
			})
		} catch (error) {
			message.error('请输入正确的完整的路径ag:http://127.0.0.1/80?xxxxx')
		}
	}

	const modalOpts = {
		title: (modalType === 'create' ? `新增${modalName}` : `编辑${modalName}`),
		visible: modalVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}
	//end
	return (
		<Modal {...modalOpts} width={900} key="urlDnsModal">
			<Form layout="horizontal">
				<div>
					<Alert message={alertMessage} type={alertType} showIcon /><br />
				</div>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: item.name,
							rules: [
								{
									required: true, message: '名称不能为空',
								},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="节点地址" key="discoveryIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('discoveryIP', {
							initialValue: url.discoveryIP ? url.discoveryIP : item.discoveryIP,
							rules: [
								{
									required: true,
								}
							],
						})(<Input disabled />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="协议" key="protocol" hasFeedback {...formItemLayout}>
						{getFieldDecorator('protocol', {
							initialValue: url.protocol ? url.protocol : item.protocol,
							rules: [
								{
									required: true,
								}
							],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="端口" key="port" hasFeedback {...formItemLayout}>
						{getFieldDecorator('port', {
							initialValue: url.port ? url.port : item.port,
							rules: [
								{
									required: true,
								}
							],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="路径" key="pathname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('pathname', {
							initialValue: url.pathname ? url.pathname : item.pathname,
							rules: [],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="查询参数" key="search" hasFeedback {...formItemLayout}>
						{getFieldDecorator('search', {
							initialValue: url.search ? url.search : item.search,
							rules: [],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="片段标识" key="section" hasFeedback {...formItemLayout}>
						{getFieldDecorator('section', {
							initialValue: url.section ? url.section : item.section,
							rules: [],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="keyword" key="keyword" hasFeedback {...formItemLayout}>
						{getFieldDecorator('keyword', {
							initialValue: url.keyword ? url.keyword : item.keyword,
							rules: [
								{
									required: true,
								}
							],
						})(<TextArea rows={3} disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="URL全路径" key="fullUrl" hasFeedback {...formItemLayout}>
						{getFieldDecorator('fullUrl', {
							initialValue: item.fullUrl,
							rules: [
								{
									required: true,
								}
							],
						})(<TextArea rows={3} onBlur={onChange_fullURL} />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<AppSelect {...appSelectProps} />
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appCode', {
							initialValue: item.appCode,
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{
									required: true,
								},
							],
						})(<Select disabled={user.branch !== undefined} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('mngtOrgCode', {
							initialValue: item.mngtOrgCode,
							rules: [
								{
									required: true,
								},
							],
						})(<Select onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="映射ip地址" key="ipList" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ipList', {
							initialValue: item.ipList,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('onlineStatus', {
							initialValue: item.onlineStatus,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>{genDictOptsByName('onlineStatus')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('managedStatus', {
							initialValue: item.managedStatus,
							rules: [
								{
									required: true,
								},
							],
						})(<Select >{genDictOptsByName('managedStatus')}</Select>)}
					</FormItem>
				</span>
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
