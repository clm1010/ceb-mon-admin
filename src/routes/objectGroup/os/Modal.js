import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, Button, Icon, Divider } from 'antd'
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
	moSynState,
	_mngInfoSrc, //记录的是监控对象发现方式最初的样子
	modalName,
	alertType,
	alertMessage,
	appSelect,
	secondClass,
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
	const onChangeMngInfoSrc = (value) => {
		//如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
		if (_mngInfoSrc !== '手工' && modalType === 'update' && value === '自动') {
			resetFields(['hostname', 'location', 'objectID'])
		}

		item.mngInfoSrc = value
		dispatch({
			type: 'os/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'os/setState',				//@@@
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
	const onBranchNameChange = (value) => {
		//如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
		if ((value === 'ZH' && item.branchName !== 'ZH') || (value !== 'ZH' && item.branchName === 'ZH') || (value !== 'QH' && item.branchName === 'QH') || (value === 'QH' && item.branchName !== 'QH')) {
			delete item.firstSecArea
			delete item.secondSecArea
			resetFields(['firstSecArea', 'secondSecArea'])
		}
		item.branchName = value
		dispatch({
			type: 'netmanager/setState',				//@@@
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
			let str = ''
			if (data.appMode !== undefined) {
				for (let info of data.appMode) {
					str = `${info}/${str}`
				}
			}
			data.appMode = str.substring(0, str.length - 1)
			data.branchname_cn = Fenhangmaps.get(data.branchName)
			data.mngtOrg = Fenhangmaps.get(data.mngtOrgCode)

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
					type: `os/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'os/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `os/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'os/setState',				//@@@//抛一个事件给监听这个type的监听器
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

	//控制字段显隐性
	const fieldsDisplay = ozr('id') === "EGroup" ? 'none' : ''
	const isBranchName = ozr('id') === "EGroup" ? '所属机构' : '所属行名称'
	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'os/setState',				//@@@//抛一个事件给监听这个type的监听器
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

	//同步按钮触发的事件
	const onSync = () => {
		dispatch({
			type: 'os/setState',				//@@@
			payload: ({
				moSynState: true,
			}),
		})
		dispatch({
			type: 'os/moSync',				//@@@
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

	const modalOpts = {
		title: (modalType === 'create' ? `新增${modalName}` : `编辑${modalName}`),
		visible: modalVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}
	const deciFScloud = (e) => {
		dispatch({
			type: 'os/setState',
			payload: {
				FScloud: e,
			},
		})
	}
	//end
	return (
		<Modal {...modalOpts} 
			width={1050} 
			footer={[
				<Button key="sync" disabled={modalType !== 'update'} onClick={onSync}>{icon}同步</Button>,
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
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>
				{/* 				<span style={{ width: '33%', float: 'left' }}>
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
				</span> */}
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('discoveryIP', {
							initialValue: item.discoveryIP,
							rules: [
								{
									required: true, message: '管理IP不能为空',
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
					<FormItem label={isBranchName} key="branchName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{
									required: true, message: '所属机构不能为空',
								},
							],
						})(<Select onSelect={onBranchNameChange} disabled={!(user.branch === undefined || user.branch === 'QH')} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left', display: 'none' }}>
					<FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout} >
						{getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
							rules: [
								{
								},
							],
						})(<Select>{item.branchName === undefined || item.branchName === 'QH' ? firstSecAreaAll : (item.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH'))}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left', display: 'none' }}>
					<FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondSecArea', {
							initialValue: item.secondSecArea,
							rules: [
								{},
							],
						})(<Select allowClear>{genDictOptsByName('secondSecArea')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
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
									required: true, message: '管理机构不能为空',
								},
							],
						})(<Select onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left', display: '' }}>
					<FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
						{getFieldDecorator('netDomain', {
							initialValue: item.netDomain,
							rules: [

							]
						})(<Select >
							{genOptions(appCategorlist)}
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('onlineStatus', {
							initialValue: item.onlineStatus,
							rules: [
								{},
							],
						})(<Select>{genDictOptsByName('onlineStatus')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('managedStatus', {
							initialValue: item.managedStatus,
						})(<Select >{genDictOptsByName('managedStatus')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
						{getFieldDecorator('room', {
							initialValue: item.room,
						})(<Select>{genDictOptsByName('room')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="用途" key="usage" hasFeedback {...formItemLayout}>
						{getFieldDecorator('usage', {
							initialValue: item.usage,
						})(<Select>
							{genDictOptsByName('usage')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="系统类型" key="secondClass " hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondClass', {
							initialValue: modalType === 'create' ? secondClass : item.secondClass,
							rules: [
								{ required: true, message: '系统类型不能为空' },
							],
						})(<Select >{genDictOptsByName('osType')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="软件版本" key="SV" hasFeedback {...formItemLayout}>
						{getFieldDecorator('softwareVersion', {
							initialValue: item.softwareVersion,
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="所有IP" key="allIps" hasFeedback {...formItemLayout}>
						{getFieldDecorator('allIps', {
							initialValue: item.allIps,
							rules: [
								{
									validator: validateIP,
								},
							]
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="虚拟IP" key="virtualIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('virtualIp', {
							initialValue: item.virtualIp,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
								{
									validator: validateIP,
								},],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="映射IP" key="mappingIP" hasFeedback {...formItemLayout}>
						{getFieldDecorator('mappingIP', {
							initialValue: item.mappingIP,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
								{
									validator: validateIP,
								},],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="应用模式" key="AppMode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appMode', {
							initialValue: item.appMode || [],
						})(<Select mode="multiple">
							{genDictOptsByName('appMode')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="容灾模式" key="disasterType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('disasterType', {
							initialValue: item.disasterType,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
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
				<span style={{ width: '33%', float: 'left', display: fieldsDisplay }}>
					<FormItem label="SMDBAGENTID" key="SMDBAGENTID" hasFeedback {...formItemLayout}>
						{getFieldDecorator('smdbAgentId', {
							initialValue: item.smdbAgentId,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
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
					<FormItem label="Oracle" key="oracleInstalled" hasFeedback {...formItemLayout}>
						{getFieldDecorator('oracleInstalled', {
							initialValue: item.oracleInstalled,
						})(<Select >
							{genDictOptsByName('InstalledType')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="Weblogic" key="weblogicInstalled" hasFeedback {...formItemLayout}>
						{getFieldDecorator('weblogicInstalled', {
							initialValue: item.weblogicInstalled,
						})(<Select >
							{genDictOptsByName('InstalledType')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="ASM" key="ASMInstalled" hasFeedback {...formItemLayout}>
						{getFieldDecorator('asminstalled', {
							initialValue: item.asminstalled,
						})(<Select >
							{genDictOptsByName('InstalledType')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="Tuxedo" key="tuxedoInstalled" hasFeedback {...formItemLayout}>
						{getFieldDecorator('tuxedoInstalled', {
							initialValue: item.tuxedoInstalled,
						})(<Select >
							{genDictOptsByName('InstalledType')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '33%', float: 'left' }}>
					<FormItem label="VCS" key="VCSInstalled" hasFeedback {...formItemLayout}>
						{getFieldDecorator('vcsinstalled', {
							initialValue: item.vcsinstalled,
						})(<Select >
							{genDictOptsByName('InstalledType')}
						</Select>)}
					</FormItem>
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

modal.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.string,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}

export default Form.create()(modal)
