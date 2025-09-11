import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Alert, message, InputNumber } from 'antd'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { validateIP } from '../../../utils/FormValTool'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import AppSelectComp from '../../../components/appSelectComp'
import {ozr} from '../../../utils/clientSetting'

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
  appSelect,
  appCategorlist,
  secondClass,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll,
} = form

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
	function genOptions (objArray) {
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
	const fieldsDisplay = ozr('id') === "EGroup"? 'none' : ''
	const isBranchName = ozr('id') === "EGroup"? '所属机构' : '所属行名称'

	const onBranchNameChange = (value) => {
		//如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
		if ((value === 'ZH' && item.branchName !== 'ZH') || (value !== 'ZH' && item.branchName === 'ZH') || (value !== 'QH' && item.branchName === 'QH') || (value === 'QH' && item.branchName !== 'QH')) {
		  delete item.firstSecArea
		delete item.secondSecArea
		resetFields(['firstSecArea', 'secondSecArea'])
	  }
		item.branchName = value
	  dispatch({
		type: 'branchIp/setState',				//@@@
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

	const onMngtOrg = (value, record) => {
		item.mngtOrg = record.props.name
		item.mngtOrgCode = value
		dispatch({
			type: 'application/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}
	const onChangeMngInfoSrc = (value) => {
		//如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
		if (_mngInfoSrc !== '手工' && modalType === 'update' && value === '自动') {
			resetFields(['hostname', 'location', 'objectID'])
		}

		item.mngInfoSrc = value
		dispatch({
			type: 'application/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
	}

	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
		  }
		  let data = {
				...getFieldsValue(),
		  }
		  if (data.name === undefined || data.name === '') {
			data.name = `${data.appName}_${data.alias}`
		  }
		  data.secondClass = secondClass.key

		  for (let field in data) {
		  	if (typeof (data[field]) === 'object') {
		  		data[field] = Date.parse(data[field])
		  	}
		  }
		  
		  //清除appSelect内容
		dispatch({
			type: 'appSelect/clearState',
		})
				//保存MO信息，跳转到抓取设备信息流程
			if (appSelect.currentItem.c1 && modalType === 'create') {
				dispatch({
					type: `application/${modalType}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
			  resetFields()
			} else if (data.appName === item.appName && modalType === 'update') {
				dispatch({
					type: `application/${modalType}`,				//@@@
					payload: {
						currentItem: data,
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
			type: 'application/setState',				//@@@//抛一个事件给监听这个type的监听器
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

  //控制不同secondClass显示的字段
  let pathDisplay = ''
  let portDisplay = ''
  let processDisplay = 'none'
//   if (item.path === undefined  ) 
// 		pathDisplay = 'none'
  if (item.port === 0 || item.port === '0' || secondClass.field === 'port')
		portDisplay = 'none'
 if ( secondClass.field === 'process' ) {
	processDisplay = ''
 }
  //end
  return (
    <Modal {...modalOpts} width={850} key="dataBaseModal">
      <Form layout="horizontal">
        <div>
          <Alert message={alertMessage} type={alertType} showIcon /><br />
        </div>
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
          <AppSelectComp {...appSelectProps} />
        </span>

        <span style={{ width: '50%', float: 'left',display: fieldsDisplay}}>
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
        <span style={{ width: '50%', float: 'left',display: fieldsDisplay }}>
          <FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('secondSecArea', {
							initialValue: item.secondSecArea,
							rules: [
							  {},
							],
						})(<Select allowClear>{genDictOptsByName('secondSecArea')}</Select>)}
          </FormItem>
        </span>

		<span style={{ width: '50%', float: 'left' , display:fieldsDisplay}}>
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
          <FormItem label="主备模式" key="haMode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('haMode', {
							initialValue: item.haMode,
							rules: [],
						})(<Select>{genDictOptsByName('haRole')}</Select>)}
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
          <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
            {getFieldDecorator('room', {
							initialValue: item.room,
							rules: [],
						})(<Select>{genDictOptsByName('room')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('srcType', {
							initialValue: item.srcType,
							rules: [
							],
						})(<Input />)}
          </FormItem>
        </span>
		{secondClass.key==="APP_LOG"?
			<span style={{ width: '50%', float: 'left' }}>
			<FormItem label="关键字" key="logKeyWord" hasFeedback {...formItemLayout}>
				{getFieldDecorator('logKeyWord', {
								initialValue: item.logKeyWord,
								rules: [
									{
										required: true,
									}
								],
							})(<Input />)}
			</FormItem>
			</span>
		:
		null}
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label={secondClass.label} key={secondClass.field} hasFeedback {...formItemLayout}>
            {getFieldDecorator(secondClass.field, {
							initialValue: item.appfield,
							rules: [
							],
						})(<Input />)}
          </FormItem>
        </span>

		{secondClass.key==="APP_URL" || secondClass.key==="APP_LOG"?
		<span style={{ width: '50%', float: 'left' }}>
          <FormItem label='路径' key='path' hasFeedback {...formItemLayout}>
            {getFieldDecorator('path', {
							initialValue: item.path,
							rules: [
							],
						})(<Input disabled = {modalType == 'update'} />)}
          </FormItem>
        </span>
		:
		null}
		{secondClass.key==="APP_URL"?
		<span style={{ width: '50%', float: 'left' }}>
          <FormItem label='端口' key='port' hasFeedback {...formItemLayout}>
            {getFieldDecorator('port', {
							initialValue: item.port,
							rules: [
							],
						})(<Input disabled = {modalType == 'update'} />)}
          </FormItem>
        </span>
		:
		null}
		
		<span style={{ width: '50%', float: 'left', display:processDisplay }}>
          <FormItem label='进程所属用户' key='username' hasFeedback {...formItemLayout}>
            {getFieldDecorator('username', {
							initialValue: item.username,
							rules: [
							],
						})(<Input  />)}
          </FormItem>
        </span>
		
		<span style={{ width: '50%', float: 'left', display:processDisplay }}>
          <FormItem label='进程条件' key='processNum' hasFeedback {...formItemLayout}>
            {getFieldDecorator('processNum', {
							initialValue: item.processNum,
							rules: [
								{
									required: secondClass.key === 'APP_PROC'? true : false ,
							  },
							],
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
