import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message } from 'antd'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { validateIP } from '../../../utils/FormValTool'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import Fenhang from '../../../utils/fenhang'
import AppSelect from '../../../components/appSelectComp'
import OsSingleSelectComp from '../utils/moSingleSelectComp'
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
	alertType,
	alertMessage,
	appSelect,
	secondClass,
	osSingleSelect,
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

	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'fs/setState',				//@@@
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
	const queryMo = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'osSingleSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
					externalFilter: `secondClass=='${secondClass}'`,
				}),
			})
			//查询，传入输入的查询字段
			dispatch({
				type: 'osSingleSelect/query',
				payload: ({
					inputInfo: value,
					pageSize: 20,
				}),
			})
		}
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

	const onSelect = (value, option) => {
		let uuid = option.props.uuid
		//抽取mo
		let options = osSingleSelect.options.map(v => v.mo)
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
		item.typ = neParentobj.typ
		item.thirdClass = 'OS_FS'

		dispatch({
			type: 'interfacer/setState',
			payload: ({
				currentItem: item,
			}),
		})
		//清空原始下拉列表中的缓存options
		dispatch({
			type: 'osSingleSelect/setState',
			payload: ({
				options: [],
			}),
		})
	}

	const osSingleSelectProps =
		Object.assign(
			{},
			osSingleSelect,
			{
				placeholders: '请输入设备IP或名字查询',
				name: '所属操作系统',
				modeType: 'combox',
				required: true,
				dispatch,
				item,
				form,
				disabled: modalType !== 'create',
				compName: 'parentMoName',
				formItemLayout,
				externalFilter: location === undefined ? '' : `secondClass=='${secondClass}'`,
				defaultValue: modalType === 'update' ? ('belongsTo' in item ? item.belongsTo.name : '查不到所属设备') : '',
				onSelect,
				query: queryMo,
			}
		)


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
			if ((appSelect.currentItem.c1 || data.appName === item.appName) && modalType === 'create') {
				dispatch({
					type: `fs/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'fs/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
					},
				})
				resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `fs/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
				dispatch({
					type: 'fs/setState',				//@@@//抛一个事件给监听这个type的监听器
					payload: {
						modalVisible: false,
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
			type: 'fs/setState',				//@@@//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
			},
		})

		//清除appSelect内容
		dispatch({
			type: 'appSelect/clearState',
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

	//end
	return (
		<Modal {...modalOpts} width={850} key="dataBaseModal">
			<Form layout="horizontal">
				<div>
					<Alert message={alertMessage} type={alertType} showIcon /><br />
				</div>
				<span style={{ width: '50%', float: 'left' }}>
          			<OsSingleSelectComp {...osSingleSelectProps} />
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
					<FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
						{getFieldDecorator('hostname', {
							initialValue: item.hostname,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
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

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="对象关键字" key="keyword" hasFeedback {...formItemLayout}>
						{getFieldDecorator('keyword', {
							initialValue: item.keyword,
							rules: [
								{
									required: true, message: '所属分行不能为空',
								},
							],
						})(<Input  />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="所属分行" key="branchName" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{
									required: true, message: '所属分行不能为空',
								},
							],
						})(<Select onSelect={onBranchNameChange} disabled={!(user.branch === undefined || user.branch === 'QH')} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
						{getFieldDecorator('firstSecArea', {
							initialValue: item.firstSecArea,
							rules: [
								{
								},
							],
						})(<Select disabled={modalType === 'update' && !(user.name === 'admin' || user.roles[0].name==='超级管理员')}>
							{item.branchName === undefined || item.branchName === 'QH' ? firstSecAreaAll : (item.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH'))}
							</Select>)}
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
					<FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="容量" key="size" hasFeedback {...formItemLayout}>
						{getFieldDecorator('size', {
							initialValue: item.size,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="路径" key="patch" hasFeedback {...formItemLayout}>
						{getFieldDecorator('patch', {
							initialValue: item.patch,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
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

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('onlineStatus', {
							initialValue: item.onlineStatus,
							rules: [
								{},
							],
						})(<Select disabled={modalType === 'update' && !(user.name === 'admin' || user.roles[0].name==='超级管理员')}>{genDictOptsByName('onlineStatus')}</Select>)}
					</FormItem>
				</span>
				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
						{getFieldDecorator('managedStatus', {
							initialValue: item.managedStatus,
						})(<Select disabled={modalType === 'update' && !(user.name === 'admin' || user.roles[0].name==='超级管理员')}>{genDictOptsByName('managedStatus')}</Select>)}
					</FormItem>
				</span>


				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
						{getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="文件系统类型" key="typ " hasFeedback {...formItemLayout}>
						{getFieldDecorator('typ', {
							initialValue: item.typ,
							rules: [
								
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="联系人" key="contact" hasFeedback {...formItemLayout}>
						{getFieldDecorator('contact', {
							initialValue: item.contact,
							rules: [],
						})(<Input />)}
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
