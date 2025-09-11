import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, DatePicker, Alert, message, Divider } from 'antd'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import Fenhang from '../../../utils/fenhang'
import AppSelect from '../../../components/appSelectComp'
const FormItem = Form.Item
const Option = Select.Option

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
	visible,
	form,
	modalType,
	type,
	firstClass,
	alertType,
	alertMessage,
	item,
	appSelect,
	appCategorlist,
	FScloud,
}) => {
	const {
		getFieldDecorator, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue, getFieldValue,
	} = form

	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})

	const user = JSON.parse(sessionStorage.getItem('user'))
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

	function genOptions(objArray) {
		let options = []
		let nameOption = new Set();
		objArray.forEach((option) => {
			let parm = option.affectSystem.split('|')[1]
			nameOption.add(parm)
		})
		nameOption.forEach((option) => {
			options.push(<Option key={option} value={option}>{option}</Option>)
		})
		return options
	}

	const onOk = () => {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}
			data.firstClass = firstClass
			data.branchname_cn = Fenhangmaps.get(data.branchName)
			data.mngtOrg = Fenhangmaps.get(data.mngtOrgCode)

			if (data.name === undefined || data.name === '') {
				data.name = `${data.appName}_${data.alias}`
			}

			//清除appSelect内容
			dispatch({
				type: 'appSelect/clearState',				//@@@
			})
			//保存MO信息，跳转到抓取设备信息流程
			if (appSelect.currentItem.c1 && type === 'create') {
				dispatch({
					type: `IP/${type}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && type === 'update') {
				dispatch({
					type: `IP/${type}`,				//@@@
					payload: {
						currentItem: data,
					},
				})

				resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}

			dispatch({
				type: 'IP/setState',
				payload: {
					modalVisible: false,
					FScloud:false,
				},
			})
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'IP/setState',
			payload: {
				modalVisible: false,
				currentItem: {},
				alertType: 'info',
				alertMessage: '请输入信息',
				appCode: '',
				FScloud:false,
			},
		})

		//清除appSelect内容
		dispatch({
			type: 'appSelect/clearState',
		})
	}

	const modalOpts = {
		title: type === 'create' ? '新增IP' : '编辑IP',
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}
	const deciFScloud = (e)=>{
		dispatch({
			type: 'IP/setState',
			payload: {
				FScloud: e,
			},
		})
	}
	return (
		<Modal {...modalOpts} width={1050} height={600}>
			<Form layout="horizontal">
				<div>
					<Alert message={alertMessage} type={alertType} showIcon /><br />
				</div>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: item.name,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="别名" key="alias" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [
								{
									required: true, message: '别名不能为空',
								},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<AppSelect {...appSelectProps} />
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appCode', {
							initialValue: item.appCode,
						})(<Input disabled />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }} >
					<FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout} >
						{getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
							rules: [
								{ required: true, message: 'IP不能为空' },
								{ pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '格式错误' },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="类别" key="typ" hasFeedback {...formItemLayout}>
						{getFieldDecorator('typ', {
							initialValue: item.typ,
							rules: [
								{
									required: true, message: '类别不能为空',
								},
							],
						})(<Select>
							{genDictOptsByName('IPTyp')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="关键字" key="keyword" hasFeedback {...formItemLayout}>
						{getFieldDecorator('keyword', {
							initialValue: item.keyword,
						})(<Input disabled />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="模式组子类" key="appRoleGroup" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appRoleGroup', {
							initialValue: item.appRoleGroup,
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('capType', {
							initialValue: item.capType,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input disabled />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
						{getFieldDecorator('netDomain', {
							initialValue: item.netDomain,
							rules: [
								{
									required: true,
								},
							]
						})(<Select >
							{genOptions(appCategorlist)}
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<div id="area2">
						<FormItem label="所属机构" key="branchName" hasFeedback {...formItemLayout}>
							{getFieldDecorator('branchName', {
								initialValue: item.branchName,
								rules: [
									{ required: true, message: '分支机构不能为空' },
								],
							})(<Select getPopupContainer={() => document.getElementById('area2')} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
						</FormItem>
					</div>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<div id="area3">
						<FormItem label="管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
							{getFieldDecorator('mngtOrgCode', {
								initialValue: item.mngtOrgCode,
								rules: [
									{ required: true, message: '管理机构不能为空' },
								],
							})(<Select getPopupContainer={() => document.getElementById('area3')} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
						</FormItem>
					</div>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="联系人" key="contact" hasFeedback {...formItemLayout}>
						{getFieldDecorator('contact', {
							initialValue: item.contact,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="是否全栈云" key="syncTime" hasFeedback {...formItemLayout}>
						{getFieldDecorator('FScloud', {
							initialValue: FScloud,
							rules: [],
						})(<Select onChange={deciFScloud}>
							<Option value={false}>否</Option>
							<Option value={true}>是</Option>
						</Select>)}
					</FormItem>
				</span>
				{
					FScloud ?
						<>
							<Divider orientation="left"><span style={{ color: "#eb2f96" }}>全栈云设置</span></Divider>
							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="业务IP" key="ecBizIP" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecBizIP', {
										initialValue: item.ecBizIP,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="出向EIP" key="ecExpressEip" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecExpressEip', {
										initialValue: item.ecExpressEip,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="域名" key="ecDomainName" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecDomainName', {
										initialValue: item.ecDomainName,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>
							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="虚机ID" key="ecInstanceID" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecInstanceID', {
										initialValue: item.ecInstanceID,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="入向EIP" key="ecIngressEip" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecIngressEip', {
										initialValue: item.ecIngressEip,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>

							<span style={{ width: '33%', float: 'left' }}>
								<FormItem label="监控对象" key="ecMonitorObject" hasFeedback {...formItemLayout}>
									{getFieldDecorator('ecMonitorObject', {
										initialValue: item.ecMonitorObject,
										rules: [],
									})(<Input />)}
								</FormItem>
							</span>
						</>
						:
						null
				}
			</Form>
		</Modal>
	)
}

export default Form.create()(modal)
