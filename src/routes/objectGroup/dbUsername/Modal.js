import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, InputNumber } from 'antd'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { validateIP } from '../../../utils/FormValTool'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import MoSingleSelectComp from '../utils/moSingleSelectComp'
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
	_mngInfoSrc, //记录的是监控对象发现方式最初的样子
	alertType,
	alertMessage,
	appCategorlist,
	firstClass,
	secondClass,
	thirdClass,
	moSingleSelect,
	appSelect,
}) => {


	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form

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
			type: 'dbUsername/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}
	const queryMo = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'moSingleSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
					externalFilter: `firstClass=='${firstClass}' and secondClass=='${secondClass}' and thirdClass==null`,
				}),
			})
			//查询，传入输入的查询字段
			dispatch({
				type: 'moSingleSelect/query',
				payload: ({
					inputInfo: value,
					pageSize: 20,
				}),
			})
		}
	}

	const onSelect = (value, option) => {
		let uuid = option.props.uuid
		//抽取mo
		let options = moSingleSelect.options.map(v => v.mo)
		const parentMo = options.filter((mo) => {
			if (mo.uuid === uuid) {
				return mo
			}
		})
		const neParentobj = parentMo[0]
		item.branchName = neParentobj.branchName			//所属行名称
		item.firstSecArea = neParentobj.firstSecArea		//一级安全域
		item.secondSecArea = neParentobj.secondSecArea		//二级安全域
		item.mngtOrg = neParentobj.mngtOrg				//设备管理机构
		item.mngtOrgCode = neParentobj.mngtOrgCode			//设备管理机构编码
		item.org = neParentobj.org						//设备所属机构
		item.orgCode = neParentobj.orgCode				//设备所属机构编码
		item.appName = neParentobj.appName				//所属应用分类名称
		item.appCode = neParentobj.appCode				//所属应用分类编码
		item.ObjectID = neParentobj.ObjectID				//ObjectID
		item.contact = neParentobj.contact				//联系人
		item.belongsTo = neParentobj
		item.discoveryIP = neParentobj.discoveryIP //此值必须要
		//item.alias = neParentobj.discoveryIP//所有mo的别名修改为用户自行填写
		item.parentUUID = neParentobj.uuid
		item.objectID = neParentobj.objectID
		item.syncStatus = neParentobj.syncStatus		//发现状态
		item.syncTime = neParentobj.syncTime				//发现时间
		item.firstClass = neParentobj.firstClass
		item.secondClass = neParentobj.secondClass
		item.thirdClass = 'DB_USERNAME'

		dispatch({
			type: 'dbUsername/setState',
			payload: ({
				currentItem: item,
			}),
		})
		//清空原始下拉列表中的缓存options
		dispatch({
			type: 'moSingleSelect/setState',
			payload: ({
				options: [],
			}),
		})
	}

	const moSingleSelectProps =
		Object.assign(
			{},
			moSingleSelect,
			{
				placeholders: '请输入数据库关键字或名字查询',
				name: '所属数据库',
				modeType: 'combox',
				required: true,
				dispatch,
				item,
				form,
				disabled: modalType !== 'create',
				compName: 'parentMoName',
				formItemLayout,
				externalFilter: location === undefined ? '' : `firstClass=='${firstClass}' and secondClass=='${secondClass}'`,
				defaultValue: modalType === 'update' ? ('belongsTo' in item ? item.belongsTo.name : '查不到所属数据库') : '',
				onSelect,
				query: queryMo,
			}
		)


	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'dbUsername/setState',				//@@@
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
			type: 'dbUsername/setState',				//@@@
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
			data.createMethod = '手工',
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
			data.isMonitored = data.isMonitored === "已监控" ? true : false

			//清除appSelect内容
			dispatch({
				type: 'appSelect/clearState',				//@@@
			})
			//保存MO信息，跳转到抓取设备信息流程
			if (appSelect.currentItem.c1 && modalType === 'create') {
				dispatch({
					type: `page/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `page/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})

				resetFields()
			} else {
				// message.warning('应用分类名称不存在！')
			}

			//保存MO信息，跳转到抓取设备信息流程
			if (modalType === 'create') {
				dispatch({
					type: `dbUsername/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'dbUsername/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
					},
				})
				resetFields()
			} else if (modalType === 'update') {
				dispatch({
					type: `dbUsername/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'dbUsername/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
					},
				})
				resetFields()
			}
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'dbUsername/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})

	}

	const modalOpts = {
		title: (modalType === 'create' ? `新增${modalName}` : `编辑${modalName}`),
		visible: modalVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
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

	// 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖
	if (appSelect.currentItem.affectSystem !== undefined) {
		item.appName = appSelect.currentItem.affectSystem
		item.uniqueCode = appSelect.currentItem.c1
		item.appCode = appSelect.currentItem.englishCode
	}
	const isBranchName = ozr('id') === "EGroup" ? '所属机构' : '所属行名称'
	const appSelectProps = Object.assign({}, appSelect, {
		placeholders: '请输入应用信息查询',
		name: '应用名称',
		modeType: 'combobox',
		required: true,
		dispatch,
		form,
		disabled: false,
		compName: 'appName',
		formItemLayout,
		currentItem: { affectSystem: item.appName },
	})
	//end
	return (
		<Modal {...modalOpts} width={850} key="dbinstModal">
			<Form layout="horizontal">
				<div>
					<Alert message={alertMessage} type={alertType} showIcon /><br />
				</div>
				<span style={{ width: '50%', float: 'left' }}>
					<MoSingleSelectComp {...moSingleSelectProps} />
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: item.name,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="IP" key="discoveryIP" hasFeedback {...formItemLayout}>
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


				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="主机名称" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
							rules: [
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

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
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
					<AppSelect {...appSelectProps} />
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="应用编码" key="appCode" hasFeedback {...formItemLayout}>
						{getFieldDecorator('appCode', {
							initialValue: item.appCode,
						})(<Input disabled />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="用途" key="dbinstUse" hasFeedback {...formItemLayout}>{/**待定 */}
						{getFieldDecorator('dbinstUse', {
							initialValue: item.keyword,
							rules: [
								{
									// required: true,
								},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="使用状态" key="onlineStatus" hasFeedback {...formItemLayout}>
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
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="是否监控" key="isMonitored" hasFeedback {...formItemLayout}>
						{getFieldDecorator('isMonitored', {
							initialValue: item.isMonitored == undefined ? ' ' : (item.isMonitored === false ? '未监控' : '已监控'),
							rules: [],
						})(<Select>
							<Select.Option value="已监控">已监控</Select.Option>
							<Select.Option value="未监控">未监控</Select.Option>
						</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
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

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="SRCTYPE" key="srcType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [
								{}
							]
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="类型" key="secondClass" hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondClass', {
							initialValue: secondClass,
							rules: [
								{
									required: true,
								},
							],
						})(<Select disabled="true">
							<Select.Option value="DB_ORACLE">Oracle</Select.Option>
							<Select.Option value="DB_MYSQL">Mysql</Select.Option>
							<Select.Option value="DB_DB2">DB2</Select.Option>
							<Select.Option value="DB_MSSQL">MS SQL</Select.Option>
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="账号" key="username" {...formItemLayout}>
						{getFieldDecorator('username', {
							initialValue: item.username,
							rules: [{ required: true }],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="密码" key="password" {...formItemLayout}>
						{getFieldDecorator('password', {
							initialValue: item.password,
							rules: [{ required: true }],
						})(<Input.Password />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
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

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="数据库实例" key="instance" hasFeedback {...formItemLayout}>
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



				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="数据库版本信息" key="version" hasFeedback {...formItemLayout}>
						{getFieldDecorator('version', {
							initialValue: item.version,
							rules: [],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="数据库子类型" key="thirdClass" hasFeedback {...formItemLayout}>
						{getFieldDecorator('thirdClass', {
							initialValue: thirdClass,
							rules: [
								{}
							]
						})(<Select disabled="true">
							<Select.Option value="DB_INST">实例</Select.Option>
							<Select.Option value="DB_TABLE_SPACE">表空间</Select.Option>
							<Select.Option value="DB_TABLE_SPACE_TEMP">临时表空间</Select.Option>
							<Select.Option value="DB_USERNAME">用户名</Select.Option>
							{/* <Select.Option value="DB_SERVICE">服务</Select.Option> */}
						</Select>)

						}
					</FormItem>
				</span>
				{/* <span style={{ width: '50%', float: 'left' }}>
					<FormItem label="关键字" key="keyword" hasFeedback {...formItemLayout}>
						{getFieldDecorator('keyword', {
							initialValue: item.keyword,
							rules: [
								{
									required: true,
								},
							],
						})(<Input />)}
					</FormItem>
				</span> */}






				{/* <span style={{ width: '50%', float: 'left' }}>
					<FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
							rules: [
								{
									required: true,
								},
							],
						})(<Select>{item.branchName === undefined || item.branchName === 'QH' ? firstSecAreaAll : (item.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH'))}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('secondSecArea', {
							initialValue: item.secondSecArea,
							rules: [
								{},
							],
						})(<Select allowClear>{genDictOptsByName('secondSecArea')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
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
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
							],
						})(<Input />)}
					</FormItem> */}
				{/* </span> */}





				{/* <span style={{ width: '50%', float: 'left' }}>
					<FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
						{getFieldDecorator('room', {
							initialValue: item.room,
							rules: [],
						})(<Select>{genDictOptsByName('room')}</Select>)}
					</FormItem>
				</span> */}
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
