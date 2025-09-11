import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, Divider } from 'antd'
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
	type,
	firstClass,
	secondClass,
	thirdClass,
	alertType,
	alertMessage,
	item,
	form,
	visible,
	dispatch,
	modalType,
	_mngInfoSrc, //记录的是监控对象发现方式最初的样子
	appSelect,
	appCategorlist,
	FScloud,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form

	let info = ''
	if (thirdClass === 'MINICOMPUTER') {
		info = '小型机'
	} else if (thirdClass === 'PCSERVER') {
		info = 'PC服务器'
	} else if (thirdClass === 'BLADE_CONSOLE') {
		info = '刀笼及控制台'
	} else if (thirdClass === 'OTHER') {
		info = '其它'
	}

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

	const onChangeMngInfoSrc = (value) => {
		//如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
		if (_mngInfoSrc !== '手工' && type === 'update' && value === '自动') {
			resetFields(['hostname', 'location', 'objectID'])
		}

		item.mngInfoSrc = value
		dispatch({
			type: 'hardwareServer/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
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

	const onOk = () => {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}
			data.branchname_cn = Fenhangmaps.get(data.branchName)
			data.mngtOrg = Fenhangmaps.get(data.mngtOrgCode)
			data.thirdClass = thirdClass
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
					type: `hardwareServer/${type}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && type === 'update') {
				dispatch({
					type: `hardwareServer/${type}`,				//@@@
					payload: {
						currentItem: data,
					},
				})

				resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}
			dispatch({
				type: 'hardwareServer/setState',				//@@@//抛一个事件给监听这个type的监听器
				payload: {
					modalVisible: false,
					currentItem: {},
					alertType: 'info',
					alertMessage: '请输入信息',
					appCode: '',
					FScloud:false,
				},
			})
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'hardwareServer/setState',
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
		title: type === 'create' ? '新增' + `${info}` : '修改' + `${info}`,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}
	const deciFScloud = (e) => {
		dispatch({
			type: 'hardwareServer/setState',
			payload: {
				FScloud: e,
			},
		})
	}
	return (
		<Modal {...modalOpts} width={1050}>
			<Form layout="horizontal">
				<div>
					<Alert message={alertMessage} type={alertType} showIcon /><br />
				</div>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: item.name,
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname === null ? '' : item.hostname,
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

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
							rules: [
								{ required: true, message: 'IP不能为空' },
								{ pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: 'IP格式错误' },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="类别" key="serverType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('serverType', {
							initialValue: thirdClass,
							rules: [
								{
									required: true, message: '类别不能为空',
								},
							],
						})(<Select disabled>
							<Option key="1" value="MINICOMPUTER">小型机</Option>
							<Option key="2" value="PCSERVER">PC服务器</Option>
							<Option key="3" value="BLADE_CONSOLE">刀笼及控制台</Option>
							<Option key="4" value="OTHER">其他</Option>
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
					<FormItem label="序列号" key="serialNum" hasFeedback {...formItemLayout}>
						{getFieldDecorator('serialNum', {
							initialValue: item.serialNum,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="搜索代码" key="searchCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('searchCode', {
							initialValue: item.searchCode,
							rules: [],
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
					<FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
						{getFieldDecorator('mngInfoSrc', {
							initialValue: item.mngInfoSrc ? item.mngInfoSrc : '手工',
							rules: [
								{
									required: true,
								},
							],
						})(<Select onSelect={onChangeMngInfoSrc} disabled={!!((item.mngInfoSrc === '手工' && type === 'update' && _mngInfoSrc === '手工'))}>
							{genDictOptsByName('mngInfoSrc')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
						{getFieldDecorator('room', {
							initialValue: item.room,
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机房模块" key="roomModule" hasFeedback {...formItemLayout}>
						{getFieldDecorator('roomModule', {
							initialValue: item.roomModule,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机柜" key="cabinet" hasFeedback {...formItemLayout}>
						{getFieldDecorator('cabinet', {
							initialValue: item.cabinet,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
						{getFieldDecorator('vendor', {
							initialValue: item.vendor,
							rules: [
								{ required: true, message: '厂商不能为空' },
							],
						})(<Select key="vendor">
							{genDictOptsByName('hardwareVendor')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="所属机构" key="branchName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{ required: true, message: '所属机构不能为空' },
							],
						})(<Select filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('mngtOrgCode', {
							initialValue: item.mngtOrgCode,
							rules: [
								{ required: true, message: '管理机构不能为空' },
							],
						})(<Select filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
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
