import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, DatePicker, Alert } from 'antd'
import moment from 'moment'
import MoSingleSelectComp from '../utils/moSingleSelectComp'
import { validateIP } from '../../../utils/FormValTool'
import { genDictOptsByName } from '../../../utils/FunctionTool'

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
	q,
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
  moSingleSelect,
	location,
	firstClass,
	secondClass,
	appCategorlist,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll,
} = form
	const queryMo = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'moSingleSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
					//externalFilter: `secondClass=='${location.query.secondClass}'`,
					externalFilter: `firstClass=='${firstClass}' and secondClass=='${secondClass}'`,
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
		item.thirdClass = 'NET_INTF'

		dispatch({
			type: 'interfacer/setState',
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
				placeholders: '请输入设备IP或名字查询',
				name: '所属设备',
				modeType: 'combox',
				required: true,
				dispatch,
				item,
				form,
				disabled: modalType !== 'create',
				compName: 'parentMoName',
				formItemLayout,
				//externalFilter: location === undefined ? '' : `secondClass=='${location.query.secondClass}'`,
				externalFilter: location === undefined ? '' : `firstClass=='${firstClass}' and secondClass=='${secondClass}'`,
				defaultValue: modalType === 'update' ? ('belongsTo' in item ? item.belongsTo.name : '查不到所属设备') : '',
				onSelect,
				query: queryMo,
			}
		)

	const onChangeMngInfoSrc = (value) => {
		//如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
		if (_mngInfoSrc !== '手工' && modalType === 'update' && value === '自动') {
			resetFields(['hostname', 'location', 'objectID'])
		}

		item.mngInfoSrc = value
  	dispatch({
			type: 'interfacer/setState',				//@@@
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

		  //如果有时间的数据，转换成时间戳
		  for (let field in data) {
		  	if (typeof (data[field]) === 'object') {
		  		data[field] = Date.parse(data[field])
		  	}
		  }

		  let itfObj = Object.assign(item, data)
		  itfObj.keyword = `${item.discoveryIP}_${item.portName}`
		  //修改为别名是可以修改的
		  itfObj.alias = data.alias
		  //保存MO信息，跳转到抓取设备信息流程
			dispatch({
				type: `interfacer/${modalType}`,				//@@@
				payload: {
					currentItem: itfObj,
				},
			})

		  resetFields()
		})
	}//弹出窗口点击确定按钮触发的函数

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'interfacer/setState',				//@@@//抛一个事件给监听这个type的监听器
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

  //end
  return (
    <Modal {...modalOpts}
      width={850}
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>,
        <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}
      key="switchModal"
    >
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
							rules: [
							  {
									required: true,
							  },
							],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [
								{
									required: false, message: '别名不能为空',
							 },
							],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="接口描述" key="description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
							initialValue: item.description,
							rules: [
							  {},
							],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="物理名称" key="portName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('portName', {
							initialValue: item.portName,
							rules: [
							  {
									required: true,
							  },
							],
						})(<Input />)}
          </FormItem>
        </span>

		<span style={{ width: '50%', float: 'left' }}>
			<FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
				{getFieldDecorator('netDomain', {
					initialValue: item.netDomain,
				})(<Select >
				{genOptions(appCategorlist)}
			</Select>)}
			</FormItem>
		</span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="采集带宽" key="bandwidth" hasFeedback {...formItemLayout}>
            {getFieldDecorator('bandwidth', {
							initialValue: item.bandwidth,
							rules: [
							  {},
							],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="实际带宽" key="realBandwidth" hasFeedback {...formItemLayout}>
            {getFieldDecorator('realBandwidth', {
							initialValue: item.realBandwidth,
							rules: [
							  {},
							],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="物理逻辑类型" key="intfLogicType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('intfLogicType', {
							initialValue: item.intfLogicType,
							rules: [
							  {},
							],
						})(<Select>
  {genDictOptsByName('interfacePhyType')}
         </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="接口IP" key="ip" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ip', {
							initialValue: item.ip,
							rules: [
							  {
									validator: validateIP,
								},
							],
						})(<Input />)}
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
						})(<Select onSelect={onChangeMngInfoSrc} disabled>
  {genDictOptsByName('mngInfoSrc')}
</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主备模式" key="haMode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('haMode', {
							initialValue: item.haMode,
							rules: [],
						})(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主备地位" key="haRole" hasFeedback {...formItemLayout}>
            {getFieldDecorator('haRole', {
							initialValue: item.haRole ? 'true' : 'false',
							rules: [],
						})(<Select>
  {genDictOptsByName('haRole')}
</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="性能监控" key="iisreset" hasFeedback {...formItemLayout}>
            {getFieldDecorator('iisreset', {
							initialValue: item.iisreset,
							rules: [],
						})(<Select>
  {genDictOptsByName('monitoringState')}
</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="性能采集" key="performanceCollect" hasFeedback {...formItemLayout}>
            {getFieldDecorator('performanceCollect', {
							initialValue: item.performanceCollect,
							rules: [],
						})(<Select>
  {genDictOptsByName('monitoringState')}
</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SYSLOG监控" key="syslogMonitoring" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syslogMonitoring', {
							initialValue: item.syslogMonitoring,
							rules: [],
						})(<Select>
  {genDictOptsByName('monitoringState')}
</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现状态" key="syncStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncStatus', {
							initialValue: item.syncStatus ? item.syncStatus : '未同步',
							rules: [],
						})(<Select disabled>{genDictOptsByName('SyncStatus')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现时间" key="syncTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncTime', {
							initialValue: item.syncTime ? moment(item.syncTime) : null,
							rules: [],
						})(<DatePicker
  showTime
  style={{ width: '100%' }}
  disabled
  format="YYYY-MM-DD HH:mm:ss"
  placeholder="Select Time"
						/>)}
          </FormItem>
        </span>

		<span style={{ width: '50%', float: 'left' }}>
          <FormItem label="接口类型" key="typ" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typ', {
							initialValue: item.typ,
							rules: [
							  {},
							],
						})(<Select>
  {genDictOptsByName('interfaceType')}
         </Select>)}
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
