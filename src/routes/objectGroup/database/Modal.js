import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, InputNumber, Button, Icon ,Divider } from 'antd'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { validateIP } from '../../../utils/FormValTool'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import Fenhang from '../../../utils/fenhang'
import AppSelect from '../../../components/appSelectComp'
import { ozr } from '../../../utils/clientSetting'
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
	modalVisible,
	item,
	form,
	modalType,
	modalName,
	moSynState,
	_mngInfoSrc, //记录的是监控对象发现方式最初的样子
	alertType,
	alertMessage,
	appSelect,
	appCategorlist,
	FScloud,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form
	if (moSynState) { //同步中
		alertMessage = '设备正在同步中，请稍后……',
			alertType = 'info'
	}
	let Fenhangmaps = new Map()
	Fenhang.forEach((obj, index) => {
		Fenhangmaps.set(obj.key, obj.value)
	})
	const user = JSON.parse(sessionStorage.getItem('user'))
	if (modalType === 'create' && item.branchName === undefined) {
		item.branchName = user.branch
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
	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'database/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}
	const onBranchNameChange = (value) => {
		//如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
		if ((value === 'ZH' && item.branchName !== 'ZH') || (value !== 'ZH' && item.branchName === 'ZH') || (value !== 'QH' && item.branchName === 'QH') || (value === 'QH' && item.branchName !== 'QH')) {
			delete item.firstSecArea
			delete item.secondSecArea
			resetFields(['firstSecArea', 'secondSecArea'])
		}
		item.branchName = value
		dispatch({
			type: 'database/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}
	// 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖
	if (appSelect.currentItem.affectSystem !== undefined) {
		item.appName = appSelect.currentItem.affectSystem
		item.uniqueCode = appSelect.currentItem.c1
		item.appCode = appSelect.currentItem.englishCode
	}
	const onChangeMngInfoSrc = (value) => {
		//如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
		if (_mngInfoSrc !== '手工' && modalType === 'update' && value === '自动') {
			resetFields(['hostname', 'location', 'objectID'])
		}

		item.mngInfoSrc = value
		dispatch({
			type: 'database/setState',				//@@@
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
	let typeMap = new Map()
	typeMap.set("DB_ORACLE", "Oracle")
	typeMap.set("DB_MYSQL", "Mysql")
	typeMap.set("DB_REDIS", "Redis")
	typeMap.set("DB_DB2", "DB2")
	typeMap.set("DB_MSSQL", "MS SQL")
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
			if (data.secondClass && data.secondClass.length > 0) {
				data.typ = typeMap.get(data.secondClass)
			}
			if (data.name === undefined || data.name === '') {
				data.name = `${data.appName}_${data.alias}`
			}
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
					type: `database/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'database/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `database/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'database/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
						FScloud:false,
					},
				})
				resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}
		})
	}//弹出窗口点击确定按钮触发的函数
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'database/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				FScloud:false,
			},
		})
		//清除appSelect内容
		dispatch({
			type: 'appSelect/clearState',
		})
	}
	const fieldsDisplay = ozr('id') === "EGroup" ? 'none' : ''
	const isBranchName = ozr('id') === "EGroup" ? '所属机构' : '所属行名称'
	const modalOpts = {
		title: (modalType === 'create' ? `新增${modalName}` : `编辑${modalName}`),
		visible: modalVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}
	//同步按钮触发的事件
	const onSync = () => {
		dispatch({
			type: 'database/setState',				//@@@
			payload: ({
				moSynState: true,
			}),
		})
		dispatch({
			type: 'database/moSync',				//@@@
			payload: {
				moFirstClass: item.firstClass,
				uuids: [item.uuid]
			},
		})
	}

	let icon = <Icon type="sync" />
	if (moSynState) {
		icon = <Icon type="loading" />
	}

	//数值验证
	const blurFunctions = (rulr, value, callback) => {
		let regx = /^\+?[1-9][0-9]*$/
		if (!regx.test(value)) {
			callback('Please enter a positive integer！')
		} else {
			callback()
		}
	}
	//end
	const deciFScloud = (e) => {
		dispatch({
			type: 'database/setState',
			payload: {
				FScloud: e,
			},
		})
	}
	return (
		<Modal {...modalOpts}
			width={1050}
			footer={[
				<Button key="sync" onClick={onCancel} disabled={modalType !== 'update'} onClick={onSync}>{icon}同步</Button>,
				<Button key="cancel" onClick={onCancel}>关闭</Button>,
				<Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
			key="dataBaseModal">
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
					<FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [],
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
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
							rules: [
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
							rules: [
								{
									required: true,
								},
								{
									validator: validateIP,
								},
							],
						})(<Input />)}
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
					<FormItem label="类型" key="secondClass" hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondClass', {
							initialValue: item.secondClass,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>
							<Select.Option value="DB_ORACLE">Oracle</Select.Option>
							<Select.Option value="DB_MYSQL">Mysql</Select.Option>
							<Select.Option value="DB_REDIS">Redis</Select.Option>
							<Select.Option value="DB_DB2">DB2</Select.Option>
							<Select.Option value="DB_MSSQL">MS SQL</Select.Option>
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="版本" key="version" hasFeedback {...formItemLayout}>
						{getFieldDecorator('version', {
							initialValue: item.version,
							rules: [{ required: true, }],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="实例名" key="instance" hasFeedback {...formItemLayout}>
						{getFieldDecorator('instance', {
							initialValue: item.instance,
							rules: [
								{
									required: true,
								},
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="端口" key="port" hasFeedback {...formItemLayout}>
						{getFieldDecorator('port', {
							initialValue: item.port,
							rules: [
								{
									required: true,
								},
								{
									validator: blurFunctions,
								},
							],
						})(<InputNumber min={1} style={{ width: '100%' }} />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="账号" key="username" {...formItemLayout}>
						{getFieldDecorator('username', {
							initialValue: item.username,
							rules: [{ required: true }],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="密码" key="password" {...formItemLayout}>
						{getFieldDecorator('password', {
							initialValue: item.password,
							rules: [{ required: true }],
						})(<Input.Password />)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label={isBranchName} key="branchName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{
									required: true,
								},
							],
						})(<Select onSelect={onBranchNameChange} disabled={user.branch !== undefined} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left', display: fieldsDisplay }}>
					<FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
							rules: [
								{
								},
							],
						})(<Select>{item.branchName === undefined || item.branchName === 'QH' ? firstSecAreaAll : (item.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH'))}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left', display: fieldsDisplay }}>
					<FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondSecArea', {
							initialValue: item.secondSecArea,
							rules: [
								{},
							],
						})(<Select allowClear>{genDictOptsByName('secondSecArea')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left', display: fieldsDisplay }}>
					<FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
						{getFieldDecorator('netDomain', {
							initialValue: item.netDomain,
							rules: [
								{
								},
							]
						})(<Select >
							{genOptions(appCategorlist)}
						</Select>)}
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
						})(<Select onSelect={onChangeMngInfoSrc} disabled={!!((item.mngInfoSrc === '手工' && modalType === 'update' && _mngInfoSrc === '手工'))}>
							{genDictOptsByName('mngInfoSrc')}
						</Select>)}
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
				<span style={{ width: '33%', float: 'left' }}>
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
				<span style={{ width: '33%', float: 'left' }}>
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
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
						{getFieldDecorator('room', {
							initialValue: item.room,
							rules: [],
						})(<Select>{genDictOptsByName('room')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="日志路径" key="path" hasFeedback {...formItemLayout}>
						{getFieldDecorator('path', {
							initialValue: item.path,
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
modal.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.string,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}
export default Form.create()(modal)
