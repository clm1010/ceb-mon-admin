import React from 'react'
import { Form, Input, Modal, Switch, Button, Select, Transfer, Alert, Spin, Table, Pagination } from 'antd'
import AlarmFromComp from '../../components/alarmFromComp'
import AlarmSeverityComp from '../../components/alarmSeverityComp'
import NotifyWayComp from '../../components/notifyWayComp'
import MoSelectComp from '../../components/moSelectComp'
import groupBranch from '../../utils/selectOption/groupBranch'
import { genDictOptsByName, onSearchInfo } from '../../utils/FunctionTool'
import debounce from 'throttle-debounce/debounce'
import difference from 'lodash/difference';

const { Option, OptGroup } = Select
const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const formItemLayout1 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 20,
	},
}

const formItemLayout4 = {
	labelCol: {
		span: 10,
	},
	wrapperCol: {
		span: 12,
	},
}

const formItemLayout5 = {
	labelCol: {
		span: 14,
	},
	wrapperCol: {
		span: 10,
	},
}

const formItemLayout3 = {
	labelCol: {
		span: 2,
	},
	wrapperCol: {
		span: 22,
	},
}

const formItemLayout2 = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 16,
	},
}

// Customize Table Transfer
const TableTransfer = ({ notificationType, ...restProps }) => (
	<Transfer {...restProps} showSelectAll={false}>
		{({
			direction,
			filteredItems,
			onItemSelectAll,
			onItemSelect,
			selectedKeys: listSelectedKeys,
			disabled: listDisabled,
		}) => {
			const columns = notificationType === 'ORDINARY' ? userColumns : roleColumns;

			const rowSelection = {
				getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
				onSelectAll(selected, selectedRows) {
					const treeSelectedKeys = selectedRows
						.filter(item => !item.disabled)
						.map(({ key }) => key);
					const diffKeys = selected
						? difference(treeSelectedKeys, listSelectedKeys)
						: difference(listSelectedKeys, treeSelectedKeys);
					onItemSelectAll(diffKeys, selected);
				},
				onSelect({ key }, selected) {
					onItemSelect(key, selected);
				},
				selectedRowKeys: listSelectedKeys,
			};
			return (
				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={filteredItems}
					size="small"
					scroll={{ y: 250 }}
					pagination={{ pageSize: 10 }}
					style={{ pointerEvents: listDisabled ? 'none' : null }}
					onRow={({ key, disabled: itemDisabled }) => ({
						onClick: () => {
							if (itemDisabled || listDisabled) return;
							onItemSelect(key, !listSelectedKeys.includes(key));
						},
					})}
				/>
			);
		}}
	</Transfer>
);

const userColumns = [
	{
		dataIndex: 'dataSource',
		title: '人员信息',
		render: (text, record) => {
			return `${record.name}/${record.branch}/${record.mobile}`
		}
	}
];
const roleColumns = [
	{
		dataIndex: 'dataSource',
		title: '人员信息',
		render: (text, record) => {
			return `${record.name}`
		}
	}
];
const modal = ({
	dispatch,
	modalVisible,
	item,
	form,
	modalType,
	modalName,
	alertType,
	alertMessage,
	alarmFrom,
	alarmSeverity,
	notifyWay,
	moSelect,
	appSelect,
	notificationType, //新增或者编辑的对象的通知类型
	users, //在打开新增或者编辑时就会请求users集合，因页面默认是以普通规则呈现的
	targetKeys, //从modal中获取的普通的通知人的集合
	appInfo, //应用的名字，暂时为一个应用。多个应用待开发
	mos, //选中的MO的原始信息，在编辑的时候会渲染转义
	roleTargetKeys, //从modal中获取的全局的通知人的集合
	AppOption, //从数据库中获取的App原始信息
	AppUuid, //选中的App的uuid
	moUuid, //迭代的选中的mo的uuid
	filterInfo,
	see,
	TransferState,
	loading,
}) => {
	const user = JSON.parse(sessionStorage.getItem('user'))
	let texts = []
	let infos = ''
	let texts2 = []
	if (user.roles.length > 0) {
		for (let filter of user.roles[0].alarmApplyFilter) {
			if (filter.resource === '/api/v1/notification_rules') { //通知
				for (let info of filter.filterItems) {
					texts2.push(`${info.field} ${info.op} ${info.value} ${info.logicOp === undefined ? '' : info.logicOp}`)
				}
			}
		}
	}

	for (let filter of filterInfo) {
		if (filter.resource === '/api/v1/notification_rules') { //通知
			for (let info of filter.filterItems) {
				texts.push(`${info.field} ${info.op} ${info.value} ${info.logicOp === undefined ? '' : info.logicOp}`)
			}
		}
	}
	if (modalType === 'update') {
		if (texts.length > 0) {
			infos = `当前用户新建的通知规则处理告警范围: ${texts.join(' ')}`
		} else {
			infos = '当前用户新建的通知规则处理告警范围: 全部告警'
		}
	} else if (texts2.length > 0) {
		infos = `当前用户新建的通知规则处理告警范围: ${texts2.join(' ')}`
	} else {
		infos = '当前用户新建的通知规则处理告警范围: 全部告警'
	}
	let info = []
	if (item.informType === 'ORDINARY') {
		mos.forEach((item, index) => {
			let values = `${item.discoveryIP}/${item.name}`
			info.push(values)
		})
	}
	//拼装应用options
	let optionsInfo = []
	AppOption.forEach((item, index) => { //添加name属性--> 将名字改掉   其实是传的uuid
		let values = item.affectSystem
		let uuid = item.uuid
		let englishCode = item.c1
		optionsInfo.push(<Option key={englishCode} uuid={englishCode} value={uuid}>{values}</Option>)
	})

	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form
	//事件来源控件
	const alarmFromProps = Object.assign({}, alarmFrom, {
		dispatch, form, compName: 'alarmFrom', checkedList: alarmFrom.alarmFromNum ? alarmFrom.checkedList : item.alarmFrom,
	})
	//通知方式控件
	const notifyWayProps = Object.assign({}, notifyWay, {
		dispatch, form, compName: 'notifyWay', checkedList: notifyWay.notifyWayNum ? notifyWay.checkedList : item.notifyWay,
	})
	//事件等级控件
	const alarmSeverityProps = Object.assign({}, alarmSeverity, {
		dispatch, form, compName: 'alarmSeverity', checkedList: alarmSeverity.alarmSeverityNum ? alarmSeverity.checkedList : item.alarmSeverity,
	})
	//设备控件
	const moSelectProps = Object.assign({}, moSelect, {
		placeholders: '请输入设备IP或名字查询，支持多选', name: '设备', modeType: 'multiple', required: false, dispatch, form, item, disabled: notificationType !== 'ORDINARY', compName: 'moUuid', cDefaultName: notificationType === 'ORDINARY' ? info : '每个设备', externalFilter: 'thirdClass==null',
	})
	//应用的控件
	//const appSelectProps = Object.assign({},appSelect,{placeholders: '请输入应用信息查询',name: '应用',modeType: 'combobox',required: false, dispatch, form, item, disabled:notificationType==='ORDINARY'?false:true, cDefaultName:notificationType==='ORDINARY' ? appInfo:'每个应用系统', compName:'apps',formItemLayout:formItemLayout1})

	const onOk = () => {
		validateFieldsAndScroll((errors, values) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}

			//应简单的文本框是没有默认值，所以在没有改变这些控件的值的时候，给他们默认设一个值
			if (data.state === undefined) {
				data.state = false
			}
			if (data.remarks === undefined) {
				data.remarks = ''
			}
			if (data.sql === undefined) {
				data.sql = ''
			}
			if (data.apps === undefined) {
				AppUuid = []
			}
			let time = new Date().getTime()
			if (modalType === 'create') {
				data.createdBy = user.username//创建人
				data.createdTime = time//创建时间
				data.updatedBy = user.username//更新人
				data.updatedTime = time//更新时间
			}
			if (modalType === 'update') {
				data.updatedBy = user.username//更新人
				data.updatedTime = time//更新时间
			}
			if (modalType === 'copy') {
				modalType = 'create'
			}
			//注意：设备，应用、用户、角色是经过modal处理过的数据，如果需要更改，请到modal去修改逻辑,如果用户人数超过1200，去modal更改查询pagSize
			if (AppUuid.length === 0 && data.moUuid.length === 0 && data.sql.length === 0) {
				confirm({
					title: '应用、监控对象、sql附加条件均为空,您确定保存么？',
					onOk() {
						dispatch({
							type: `notification/${modalType}`,
							payload: {
								currentItem: {
									alarmFrom: data.alarmFrom,
									alarmSeverity: data.alarmSeverity,
									appCategory: notificationType === 'ALL' ? [] : AppUuid,
									apps: data.remarks,
									branch: data.branch,
									mo: notificationType === 'ALL' ? [] : data.moUuid,
									name: data.name,
									notifyWay: data.notifyWay,
									roles: notificationType === 'ORDINARY' ? [] : data.userOrRole,
									users: modalType === 'update' ? targetKeys : notificationType === 'ALL' ? [] : data.userOrRole,
									informType: data.informType,
									state: data.state,
									sqls: data.sql,
									createdBy: modalType === 'create' ? data.createdBy : item.createdBy,
									createdTime: modalType === 'create' ? data.createdTime : item.createdTime,
									updatedBy: data.updatedBy,
									updatedTime: data.updatedTime,
									processMaintain: data.processMaintain,
								},
							},
						})
					},
					onCancel() {
					},
				})
			} else {
				dispatch({
					type: `notification/${modalType}`,
					payload: {
						currentItem: {
							alarmFrom: data.alarmFrom,
							alarmSeverity: data.alarmSeverity,
							appCategory: notificationType === 'ALL' ? [] : AppUuid,
							apps: data.remarks,
							branch: data.branch,
							mo: notificationType === 'ALL' ? [] : data.moUuid,
							name: data.name,
							notifyWay: data.notifyWay,
							roles: notificationType === 'ORDINARY' ? [] : data.userOrRole,
							users: modalType === 'update' ? targetKeys : notificationType === 'ALL' ? [] : data.userOrRole,
							informType: data.informType,
							state: data.state,
							sqls: data.sql,
							createdBy: modalType === 'create' ? data.createdBy : item.createdBy,
							createdTime: modalType === 'create' ? data.createdTime : item.createdTime,
							updatedBy: data.updatedBy,
							updatedTime: data.updatedTime,
							processMaintain: data.processMaintain,
						},
					},
				})
			}
			resetFields()
		})
	}

	//弹出窗口中点击取消按钮触发的函数
	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'notification/setState',
			payload: {
				appInfo: '',
				roleTargetKeys: [],
				targetKeys: [],
				users: [],
				see: 'no',
			},
		})
		//通知规则弹窗，清空请求到的单个通知对象，将通知类型清空，将选中的用户，角色清空
		dispatch({
			type: 'notification/setState',
			payload: {
				modalVisible: false,
				currentItem: {},
				notificationType: '',
				targetKeys: [],
				roleTargetKeys: [],
			},
		})
		//清空事件来源的选中集合
		dispatch({
			type: 'alarmFrom/setState',
			payload: {
				checkAll: false,
				checkedList: [],
				alarmFromNum: false,
			},
		})
		//清空事件等级的选中集合
		dispatch({
			type: 'alarmSeverity/setState',
			payload: {
				checkAll: false,
				checkedList: [],
				alarmSeverityNum: false,
			},
		})
		//清空通知方式选中集合
		dispatch({
			type: 'notifyWay/setState',
			payload: {
				checkAll: false,
				checkedList: [],
				notifyWayNum: false,
			},
		})
		dispatch({
			type: 'moSelect/setState',
			payload: {
				externalFilter: '',
				options: [],
			},
		})
	}
	//切换通知模式的事件
	const onNotificationTypeSelect = (value) => {
		resetFields(['apps', 'moUuid'])
		dispatch({
			type: 'notification/setState',
			payload: {
				notificationType: value,
				roleTargetKeys: [],
				targetKeys: [],
				mos: [],
				appInfo: '',
				AppUuid: [],
				moUuid: [],
			},
		})
	}

	//触发分行属性变化
	const onBranchSelect = (value) => {
		//resetFields(['apps','moUuid'])
		dispatch({
			type: 'notification/setState',
			payload: {
				//roleTargetKeys: [],
				//targetKeys: [],
				mos: [],
				//appInfo: '',
				//AppUuid: [],
				moUuid: [],
			},
		})
		//注意：mo的分行属性为branchName，不是branch
		dispatch({
			type: 'moSelect/setState',
			payload: {
				externalFilter: (value === 'QH' || value === 'ZH') ? '' : `branchName == '*${value}*'`,
				options: [],
			},
		})
	}

	//穿梭框的加载界面，因每次编辑或者新增的时候都会请求一次user的信息，所以不需要加载功能
	const onLoadUserRole = () => {
		if (notificationType === 'ORDINARY') {
			dispatch({
				type: 'notification/queryUser',
				payload: {
					q: (item.branch === 'QH' || item.branch === 'ZH') ? '' : `branch == '${item.branch}'`,
				},
			})
		}
	}
	//穿梭框的用户渲染函数
	const renderUser = (user) => {
		return `${user.name}/${user.branch}/${user.mobile}`
	}
	//穿梭框的角色渲染函数
	const renderRole = (role) => {
		return `${role.name}`
	}

	//穿梭框的穿梭移动事件
	const onChangeUser = (value) => {
		if (notificationType === 'ALL') {
			dispatch({
				type: 'notification/setState',
				payload: {
					roleTargetKeys: value,
				},
			})
		} else {
			dispatch({
				type: 'notification/setState',
				payload: {
					targetKeys: value,
				},
			})
		}
	}

	//应用onSelect，选中的应用设置uuid,暂时只支持选中一个应用，如果需要支持多选，去掉这个函数，将应用选择器的类型设为多选，渲染的option的value设为uuid,将name设为value即可
	const onSelect = (value, option) => {
		let uuids = []
		uuids.push(option.props.uuid)
		dispatch({
			type: 'notification/setState',
			payload: {
				AppUuid: uuids,
			},
		})
	}

	const queryApp = (value) => {
		if (value) {
			dispatch({
				type: 'notification/setState',
				payload: {
					AppOption: [],
				},
			})
			dispatch({
				type: 'notification/queryApp',
				payload: {
					q: `affectSystem=='*${value}*'`,
					page: 0,
					pageSize: 100,
				},
			})
		}
	}
	const modalOpts = {
		title: (modalType === 'create' && see === 'no' ? `新增${modalName}` : modalType === 'update' && see === 'no' ? `编辑${modalName}` : modalType === 'update' && see === 'yes' ? `查看${modalName}` : modalType === 'copy' ? `克隆${modalName}` : null),
		visible: modalVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const customPanelStyle = {
		background: '#fbfbfb',
		borderRadius: 4,
		marginBottom: 12,
		border: 0,
		overflow: 'hidden',
		paddingTop: 30,
		paddingLeft: 12,
		paddingRight: 12,
		wordSpacing: 12,
		paddingBottom: 12,
	}

	const transferStyle = {
		background: '#fbfbfb',
		borderRadius: 4,
		border: 0,
		overflow: 'hidden',
		padding: 12,
	}

	const customPanelStyle1 = {
		background: '#fbfbfb',
		borderRadius: 4,
		border: 0,
		overflow: 'hidden',
		borderBottom: '1px solid #E9E9E9',
		paddingLeft: 12,
		paddingRight: 12,
		paddingBottom: 12,
		paddingTop: 12,
	}

	return (
		<Modal {...modalOpts}
			width={800}
			key="notificationModal"
			footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
			<Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
			{
				user.branch === undefined ? null : <div><Alert message={infos} type="info" showIcon /><br /></div>
			}
			<Form layout="horizontal" style={{ margin: 15 }}>
				<span style={{ width: '100%', float: 'left' }}>
					<FormItem label="名称" key="name" {...formItemLayout3}>
						{getFieldDecorator('name', {
							initialValue: modalType === 'copy' ? `${item.name}_cope_${new Date().getTime()}` : item.name,
							rules: [
								{
									required: true,
								},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '100%', float: 'left' }}>
					<FormItem label="应用" key="App" {...formItemLayout3}>
						{getFieldDecorator('apps', {
							initialValue: notificationType === 'ORDINARY' ? appInfo : '每个应用系统',
							rules: [],
						})(<Select
							showSearch
							allowClear
							notFoundContent={loading.effects['notification/queryApp'] ? <Spin size="small" /> : null}
							disabled={notificationType !== 'ORDINARY'}
							onSearch={debounce(800, queryApp)}
							onSelect={onSelect}
							filterOption={false}
						>
							{optionsInfo}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="类型" key="informType" {...formItemLayout1}>
						{getFieldDecorator('informType', {
							initialValue: item.informType ? item.informType : notificationType,
						})(<Select
							onSelect={onNotificationTypeSelect}
						>
							{genDictOptsByName('informType')}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="机构" key="branch" {...formItemLayout1}>
						{getFieldDecorator('branch', {
							initialValue: item.branch,
							rules: [
								{
									required: true,
								},
							],
						})(<Select
							optionFilterProp="children"
							showSearch
							onSelect={onBranchSelect}
						>
							{groupBranch}
						</Select>)}
					</FormItem>
				</span>

				<span style={{ width: '50%', float: 'left' }}>
					<FormItem label="备注" key="remarks" hasFeedback {...formItemLayout1}>
						{getFieldDecorator('remarks', {
							initialValue: item.apps,
							rules: [
								{},
							],
						})(<Input />)}
					</FormItem>
				</span>

				<span style={{ width: '20%', float: 'left' }}>
					<FormItem label="状态" key="state" {...formItemLayout4}>
						{getFieldDecorator('state', {
							initialValue: item.state,
							valuePropName: 'checked',
						})(<Switch checkedChildren="激活" unCheckedChildren="禁用" />)}
					</FormItem>
				</span>

				<span style={{ width: '30%', float: 'left' }}>
					<FormItem label="处理维护期告警" key="processMaintain" {...formItemLayout5}>
						{getFieldDecorator('processMaintain', {
							initialValue: item.processMaintain,
							valuePropName: 'checked',
						})(<Switch checkedChildren="激活" unCheckedChildren="禁用" />)}
					</FormItem>
				</span>

				<span style={{ width: '100%', float: 'left' }}>
					<MoSelectComp {...moSelectProps} />
				</span>

				<AlarmFromComp {...alarmFromProps} />

				<AlarmSeverityComp {...alarmSeverityProps} />

				<NotifyWayComp {...notifyWayProps} />

				<span style={{ width: '100%', float: 'left' }}>
					<FormItem key="sql" hasFeedback>
						{getFieldDecorator('sql', {
							initialValue: item.sqls,
							rules: [
								{
									required: false,
								},
							],
						})(<Input placeholder="附加SQL查询条件" />)}
					</FormItem>
				</span>

				<div style={customPanelStyle1}>
					通知给以下{notificationType === 'ORDINARY' ? '用户' : '角色'}：
				</div>
				<Spin spinning={TransferState} tip="正在拼命加载...">
					<div style={customPanelStyle}>
						<FormItem key="userOrRole">
							{getFieldDecorator('userOrRole', {
								StEngEdsValueValw: 'targetKeys',
								initialValue: notificationType === 'ORDINARY' ? targetKeys : roleTargetKeys,
							})(<TableTransfer
								showSearch
								titles={['待选', '已选']}
								dataSource={notificationType === 'ORDINARY' ? users : JSON.parse(localStorage.getItem('dict')).mRole}
								targetKeys={notificationType === 'ORDINARY' ? targetKeys : roleTargetKeys}
								onChange={onChangeUser}
								render={notificationType === 'ORDINARY' ? renderUser : renderRole}
								//notFoundContent="暂未添加内容"
								listStyle={{
									width: 280,
									height: 444,
								}}
								notificationType={notificationType}
							// footer={() => {
							// 	return (
							// 		<Button
							// 			onClick={onLoadUserRole}
							// 			size="small"
							// 			style={{ float: 'right', margin: 5 }}
							// 			disabled
							// 		>
							// 			加载
							// 		</Button>)
							// }
							// }
							/>)}
						</FormItem>
					</div>
				</Spin>
				{
					modalType === 'update' ?
						<div>
							<span style={{ width: '50%', float: 'left' }}>
								<FormItem label="创建者" key="createdBy" hasFeedback {...formItemLayout2}>
									{getFieldDecorator('createdBy', {
										initialValue: item.createdBy,
									})(<Input disabled />)}
								</FormItem>
							</span>
							<span style={{ width: '50%', float: 'left' }}>
								<FormItem label="创建时间" key="createdTime" hasFeedback {...formItemLayout2}>
									{getFieldDecorator('createdTime', {
										initialValue: new Date(item.createdTime).format('yyyy-MM-dd hh:mm:ss'),
									})(<Input disabled />)}
								</FormItem>
							</span>
							<span style={{ width: '50%', float: 'left' }}>
								<FormItem label="最后更新者" key="updatedBy" hasFeedback {...formItemLayout2}>
									{getFieldDecorator('updatedBy', {
										initialValue: item.updatedBy,
									})(<Input disabled />)}
								</FormItem>
							</span>
							<span style={{ width: '50%', float: 'left' }}>
								<FormItem label="最后更新时间" key="updatedTime" hasFeedback {...formItemLayout2}>
									{getFieldDecorator('updatedTime', {
										initialValue: new Date(item.updatedTime).format('yyyy-MM-dd hh:mm:ss'),
									})(<Input disabled />)}
								</FormItem>
							</span>
						</div>
						:
						null
				}
			</Form>
		</Modal>
	)
}

export default Form.create()(modal)
//(modalType === 'create' || notificationType==='ALL') ? true : false
