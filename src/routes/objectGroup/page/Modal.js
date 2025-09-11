import React from 'react'
import { Form, Input, Modal, Button, Select, DatePicker, Alert, message } from 'antd'
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
	type,
	firstClass,
	secondClass,
	thirdClass,
	alertType,
	alertMessage,
	modalType,
	item,
	appSelect,
	appCategorlist,
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
			type: 'page/setState',				//@@@
			payload: {
				currentItem: item,
			},
		})
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

  const onBranchNameChange = (value) => {
	  //如果所属分行名称从总行切换到分行，或者从分行切换到总行，就要清空原有的一二级安全域下拉菜单的信息
	  if ((value === 'ZH' && item.branchName !== 'ZH') || (value !== 'ZH' && item.branchName === 'ZH')) {
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
		  data.secondClass = secondClass

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
					type: `page/${type}`,				//@@@
					payload: {
						currentItem: data,
					},
				})
			resetFields()
			} else if (data.appName === item.appName && type === 'update') {
				dispatch({
					type: `page/${type}`,				//@@@
					payload: {
						currentItem: data,
					},
				})

			resetFields()
			} else {
				message.warning('应用分类名称不存在！')
			}
		})
	}

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'page/setState',
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
	    title: type === 'create' ? '新增页面' : '编辑页面',
	    visible,
	    onOk,
	    onCancel,
	    wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	return (
  <Modal {...modalOpts} width={850}>
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
        <FormItem label="类别" key="typ" hasFeedback {...formItemLayout}>
          {getFieldDecorator('typ', {
							initialValue: item.typ,
							rules: [
							  {
									required: true, message: '类别不能为空',
							  },
							],
						})(<Select>
  <Option key="1" value="static">静态</Option>
  <Option key="2" value="penetrate">穿透</Option>
</Select>)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="关键字" key="keyword" hasFeedback {...formItemLayout}>
          {getFieldDecorator('keyword', {
							initialValue: item.keyword,
						})(<Input disabled />)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="URL" key="URL" hasFeedback {...formItemLayout}>
          {getFieldDecorator('url', {
							initialValue: item.url,
							rules: [
							  {
									required: true, message: 'URL不能为空',
							  },
							  {
							  		pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/, message: 'URL格式错误',
							  },
							],
						})(<Input />)}
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
        <FormItem label="端口" key="port" hasFeedback {...formItemLayout}>
          {getFieldDecorator('port', {
							initialValue: item.port,
							rules: [
							  {
									required: true, message: '端口不能为空',
							  },
							],
						})(<Input />)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="协议" key="protocol" hasFeedback {...formItemLayout}>
          {getFieldDecorator('protocol', {
							initialValue: item.protocol,
							rules: [
							  {
									required: true, message: '协议不能为空',
							  },
							],
						})(<Select>
  <Option key="1" value="http">http</Option>
  <Option key="2" value="https">https</Option>
  <Option key="3" value="ftp">ftp</Option>
  <Option key="4" value="其他">其他</Option>
</Select>)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="URI" key="URI" hasFeedback {...formItemLayout}>
          {getFieldDecorator('uri', {
							initialValue: item.uri,
							rules: [
							  {
									required: true, message: 'URI不能为空',
							  },
							],
						})(<Input />)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
          {getFieldDecorator('capType', {
							initialValue: item.capType,
							rules: [
								{ whitespace: true, message: '您输入了纯空格' },
							],
						})(<Input disabled />)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="所属机构" key="branchName" hasFeedback {...formItemLayout}>
          {getFieldDecorator('branchName', {
							initialValue: item.branchName,
							rules: [
								{ required: true, message: '分支机构不能为空' },
							],
						})(<Select filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
        </FormItem>
      </span>

      <span style={{ width: '50%', float: 'left' }}>
        <FormItem label="管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mngtOrgCode', {
							initialValue: item.mngtOrgCode,
							rules: [
								{ required: true, message: '管理机构不能为空' },
							],
						})(<Select filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
        </FormItem>
      </span>
    </Form>
  </Modal>
	)
}

export default Form.create()(modal)
