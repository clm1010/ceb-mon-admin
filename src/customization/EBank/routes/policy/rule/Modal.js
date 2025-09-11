import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, Row, Col, TreeSelect, message, Radio } from 'antd'
import MyTreeSelect from './myTreeSelect'
const { SHOW_PARENT, SHOW_ALL } = TreeSelect
const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  	labelCol: {
    		span: 5,
  	},
  	wrapperCol: {
    		span: 15,
  	},
}

const formItemLayout2 = {
  	labelCol: {
    		span: 5,
  	},
  	wrapperCol: {
    		span: 19,
  	},
}
const formItemLayout3 = {
  	labelCol: {
    		span: 9,
  	},
  	wrapperCol: {
    		span: 15,
  	},
}
const tailFormItemLayout = {
	wrapperCol: {
	  	xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
}

const formButtonLayout = {
  	labelCol: {
    		span: 6,
  	},
  	wrapperCol: {
    		span: 14,
  	},
}

const modal = ({
	dispatch,
	visible,
	type,
	item = {},
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		setFieldsValue,
	},
	modalType,
	checkStatus,
	isClose,
	tempList,
	/*
	ruleValue,
	ruleValue1,
	*/
	alarmFilterInfo,
	//modalVisibleKey,
	treeNodes,
	fenhang,
	see,
	typeValue,
	lableInfoVal,
	element,
	lableInfoVal1,
	element1,
	ArrNodes,
	treeData,
}) => {
	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}
			let monitorItems = []
			tempList.forEach((item) => {
				let tool0 = `tool${item.index}`
				let toolType = data[tool0]
				let monitorItem = {
					monitorMethod: {
						toolType,
					},
					policyTemplate: {
						uuid: item.tempid,
					},
				}
				monitorItems.push(monitorItem)
			})
			let temp = false
			for (let i = 0; i < tempList.length; i++) {
				for (let j = 1; j < tempList.length; j++) {
					if (tempList[i].tempname === tempList[j].tempname && i !== j) {
						temp = true
					}
				}
			}
			let arrs = []
			arrs.push(alarmFilterInfo)
			//新加策略规则树部分--start
			let targetGroupUUIDs = []
			let groupData = data.group
			if (groupData && groupData.length > 0) {
				let arrs = []
				groupData.forEach((item) => {
					if (arrs.length > 0) {
						arrs = [...arrs, item.value]
					} else {
						arrs = [item.value]
					}
				})
				targetGroupUUIDs = arrs
			}
			//end
			let label = []
			lableInfoVal.forEach((item) => {
				label.push(item.uuid)
			})
			label = [...label, ...ArrNodes]
			let payload = {
				//	      	  	moFilter:ruleValue,
				filters: arrs,
				monitorItems,
				//新增分组树--start
				targetGroupUUIDs,
				//end
				name: data.name,
				branch: data.branch,
				alias: data.alias,
				ruleType: data.ruleType,
				tagUUIDs: label,
				std: data.std,
				//envToolTagUUIDs:label1,
			}
			//监控对象特征验证---start
			let valiMo = true
			if (payload.filters && payload.filters.length !== 0) {
				payload.filters.forEach((item) => {
					if (item.filterItems) {
						valiMo = false
					}
				})
			}
			//end
			if (valiMo) {
				Modal.warning({
					title: '监控对象特征未配置！',
					okText: 'OK',
				})
			} else if (temp) {
				message.error('引入模板名称相同！')
			} else {
				dispatch({
					type: `policyRule/${type}`,											//抛一个事件给监听这个type的监听器
					payload,
					tempList: [{
						index: 1,
						tempid: '',
						tempname: '',
						tool: '',
					}],
				})
				resetFields()
			}
		})
	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				typeValue: '',
				lableInfoVal: [],
				lableInfoVal1: [],
				modalVisible: false,
				isClose: true,
				see: 'no',
				ArrNodes:[],
			},
		})
	}

	const modalOpts = {
		title: type === 'create' && see === 'no' ? '新增策略模板应用规则' : type === 'update' && see === 'no' ? '编辑策略模板应用规则' : type === 'update' && see === 'yes' ? '查看策略模板应用规则' : null,
		visible,
		tempList,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		//		key:modalVisibleKey,
		maskClosable: false,
		zIndex: 900,
	}

	const selectObject = () => {
		//获取节点数请求
		dispatch({
			type: 'objectGroup/query',
			payload: {},
		})

		//查询应用系统
		dispatch({
			type: 'appSelect/queryAll',
			payload: {},
		})

		//打开MO过滤器弹窗口
		dispatch({
			type: 'policyRule/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				//modalVisible: false,														//弹出窗口是否可见
				objectVisible: true,
			},
		})
	}
	const selectChange = (obj, index) => {
		const data = {
			...getFieldsValue(),
		}
	}
	const selectTemplet = (index) => {
		let q = ''
		if (typeValue == 'DISTRIBUTE') {
			q = "policyType=='PROMETHEUS'"
		}
		dispatch({
			type: 'policyTempletGroup/query',
			payload: {},
		})
		let groupUUID = '' //此处的 groupUUID 需要指标 所在的 分组
		if (item && item.stdIndicator && item.stdIndicator.group && item.stdIndicator.group.length > 0) {
			groupUUID = item.stdIndicator.group[0].uuid
		}
		dispatch({
			type: 'policyRule/updateState',
			payload: { serachVal: q },
		})
		dispatch({
			type: 'policyRule/queryTemplets',
			payload: {
				groupUUID,
				q,
			},
		})

		dispatch({
			type: 'policyRule/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: true,														//弹出窗口是否可见
				objectVisible: false,
				tempVisible: true,
				selectIndex: index,
			},
		})
	}
	const jiahao = () => {
		let temp = tempList[tempList.length - 1]
		let index = temp.index
		index++
		tempList.push({
			index, tempid: '', tempname: '', tool: '',
		})
		dispatch({
			type: 'policyRule/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				tempList,
			},
		})
	}
	const jianhao = (index) => {
		const tempListNew = tempList.filter(temp => temp.index !== index)
		dispatch({
			type: 'policyRule/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				tempList: tempListNew,
			},
		})
	}
	function panduan(moFilter) {
		if (moFilter == undefined) {
			return ''
		}
		return moFilter
	}
	const showMoFilterName = (data) => {
		if (data && data.filterItems && data.filterItems.length > 0) {
			return '已配置'
		}
		return '未配置'
	}

	const showGroupName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, { value: item.uuid, label: item.name }]
				} else {
					arrs = [{ value: item.uuid, label: item.name }]
				}
			})
		}
		return arrs
	}
	const showSelectName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, { value: item.value, label: item.name }]
				} else {
					arrs = [{ value: item.value, label: item.name }]
				}
			})
		}
		return arrs
	}
	const typeChange = (value) => {
		if(value == 'DISTRIBUTE'){
			dispatch({
				type: 'policyRule/queryDCSlevel',
				payload: {
				},
			})
		}
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				typeValue: value,
			},
		})
	}
	const handleChange = (value) => {
		let temp = lableInfoVal.filter(q => value.find((i => i == q.uuid)))
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				lableInfoVal: temp,
			},
		})
	}
	const handleChange1 = (value) => {
		let temp = lableInfoVal1.filter(q => value.find((i => i == q.uuid)))
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				lableInfoVal1: temp,
			},
		})
	}
	const selectlable = () => {
		element.blur()
		resetFields('lable')
		/*
			获取指标树节点的所有信息
		*/
		dispatch({
			type: 'labelGroup/queryGroup',
			payload: {},
		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				labelVisible: true,
				either: true,
				selectItemObj: lableInfoVal,
			},
		})
		dispatch({
			type: 'policyRule/lablequery',
			payload: {
				q: "(key!='ump_env*' and key!='ump_tool*');enabled==true"
			},
		})
	}
	const selectlable1 = () => {
		element1.blur()
		resetFields('plat_tool')
		dispatch({
			type: 'labelGroup/queryGroup',
			payload: {},
		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				labelVisible: true,
				either: false,
				selectItemObj: lableInfoVal1,
			},
		})
		dispatch({
			type: 'policyRule/lablequery',
			payload: {
				q: "(key=='ump_env*' or key=='ump_tool*');enabled==true"
			},
		})
	}
	const objSelect = (el) => {
		element = el
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				element: element,
			},
		})
	}
	const objSelect1 = (el) => {
		element1 = el
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				element1: element1,
			},
		})
	}
	const getlabelName = (item) => {
		// let nameValue = ''
		// item.forEach((item)=>{
		// 	nameValue+=item.name+'、'
		// })
		// return nameValue.slice(0,nameValue.length-1)
		const defaultValue = []
		item.forEach((option) => {
			defaultValue.push(option.uuid)
		})
		return defaultValue
	}
	const treeProps = {

		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',

	}
	function genOptions(lableInfoVal) {
		let options = []
		lableInfoVal.forEach((option) => {
			options.push(<Option key={option.uuid} value={option.uuid} select={true}>{option.name}</Option>)
		})
		return options
	}
	const options = genOptions(lableInfoVal)
	const options1 = genOptions(lableInfoVal1)

	//适用范围查询条件搜索---start
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
	//end

	const valueMap = {};
	function loops(list, parent) {
		return (list || []).map(({ children, uuid }) => {
			const node = (valueMap[uuid] = {
				parent,
				uuid
			});
			node.children = loops(children, node);
			return node;
		});
	}
	loops(treeData);
	const SelectedNode = []
	const loopNode = data => data.map((item) => {
		for (let i = 0; i < ArrNodes.length; i++) {
			if (ArrNodes[i] == item.uuid) {
				let obj = {}
				obj.label = item.name
				obj.value = item.uuid
				SelectedNode.push(obj)
			}
		}
		if (item.children && item.children.length > 0) {
			loopNode(item.children)
		}
	})
	loopNode(treeData)
	return (
		<Modal {...modalOpts}
			width="600px"
			footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
			<Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
			<Form layout="horizontal">
				<div style={{ marginLeft: 60 }}>
					<FormItem label="规则名称" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: item.name,
							rules: [
								{
									required: true,
								},
							],
						})(<Input />)}
					</FormItem>
					<FormItem label="规则别名" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alias', {
							initialValue: item.alias,
							rules: [
							],
						})(<Input />)}
					</FormItem>
					<FormItem label="规则类型" hasFeedback {...formItemLayout}>
						{getFieldDecorator('ruleType', {
							initialValue: item.ruleType ? item.ruleType : 'ORDINARY',
							rules: [
							],
						})(<Select
							showSearch
							onChange={typeChange}
						>
							<Select.Option value="ORDINARY">普通</Select.Option>
							<Select.Option value="DISTRIBUTE">分布式</Select.Option>
						</Select>)}
					</FormItem>
					{
						typeValue == 'DISTRIBUTE' ?
							<div>
								<FormItem label="标签" hasFeedback {...formItemLayout}>
									{getFieldDecorator('lable', {
										initialValue: item.lable ? item.lable : getlabelName(lableInfoVal),
										rules: [
										],
									})(<Select ref={objSelect} mode="tags" dropdownStyle={{ display: 'none' }} onFocus={selectlable} onChange={handleChange}>
										{options}
									</Select>)}
								</FormItem>
							</div>
							:
							null
					}

					<FormItem label="监控对象特征" hasFeedback {...formItemLayout}>
						{getFieldDecorator('alarmFilter', {
							initialValue: showMoFilterName(alarmFilterInfo),
							rules: [
								{
									required: true,
								},
							],
						})(<Input readOnly onClick={selectObject} />)}
					</FormItem>

					<div style={{ position: 'relative' }} id="area2" />
					<FormItem label="分组" {...formItemLayout}>
						{getFieldDecorator('group', {
							initialValue: showGroupName(item.group), /*此处为字段的值，可以把 item对象 的值放进来*/
							rules: [
								{
									//required: true,
									type: 'array',
								},
							],
						})(<TreeSelect
							{...treeProps}
							getPopupContainer={() => document.getElementById('area2')}
						>{treeNodes}
						</TreeSelect>)}
					</FormItem>

					<FormItem label="分支机构" hasFeedback {...formItemLayout}>
						{getFieldDecorator('branch', {
							initialValue: item.branch,
							rules: [
								{
									required: true,
								},
							],
						})(<Select
							showSearch
							filterOption={mySearchInfo}
						>
							{fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
						</Select>)}
					</FormItem>
					{
						typeValue == 'DISTRIBUTE' ?
							<div style={{ position: 'relative' }} id="area3" >
								<FormItem label="使用平台/工具" hasFeedback {...formItemLayout}>
									{/* {getFieldDecorator('plat_tool', {
										initialValue: item.lable ?　item.lable　: getlabelName(lableInfoVal1),
										rules: [
										],
									})(<Select ref={objSelect1} mode="tags" dropdownStyle={{ display: 'none' }} onFocus={selectlable1} onChange={handleChange1}>
										{options1}
									</Select>)} */}
									{getFieldDecorator('plat_tool', {
										//initialValue: item.lable ? item.lable : getlabelName(lableInfoVal1),
										initialValue: showSelectName(lableInfoVal1),
										rules: [
										],
									})(<MyTreeSelect
										treeData = {treeData}
										ArrNodes = {ArrNodes}
										valueMap = {valueMap}
										dispatch = {dispatch}
										SelectedNode = {SelectedNode}
									></MyTreeSelect>)} 
								</FormItem>
							</div>
							:
							null
					}
				</div>
				{tempList.map(templet =>
					(<Row key={`row_${templet.index}`}>
						<Col span={10} key={`col_${templet.index}_0`}>
							<FormItem label="模板" hasFeedback {...formItemLayout2} key={`muban_${templet.index}`}>
								{getFieldDecorator(`muban${templet.index}`, {
									initialValue: templet.tempname,
									rules: [
										{
											required: true,
										},
									],
								})(<Input readOnly onClick={selectTemplet.bind(this, templet.index)} title={templet.tempname} />)}
							</FormItem>
						</Col>
						<Col span={9} key={`col_${templet.index}_1`}>
							<FormItem label="监控工具" hasFeedback {...formItemLayout3} key={`tool_${templet.index}`}>
								{getFieldDecorator(`tool${templet.index}`, {
									initialValue: typeValue == 'DISTRIBUTE' ? 'PROMETHEUS' : templet.tool,
									rules: [
										{
											required: true,
										},
									],
								})(<Select disabled={typeValue == 'DISTRIBUTE' ? true : false} >
									<Option value="ZABBIX">ZABBIX</Option>
									<Option value="ITM">ITM</Option>
									<Option value="OVO">OVO</Option>
									<Option value="SYSLOG_EPP">SYSLOG_EPP</Option>
									<Option value="NAGIOS">NAGIOS</Option>
									<Option value="NANTIAN_ZABBIX">非网络域Zabbix</Option>
									<Option value="PROMETHEUS">Prometheus</Option>
								</Select>)}
							</FormItem>
						</Col>
						<Col span={4} key={`col_${templet.index}_2`}>
							<Button disabled={tempList.length === 1} onClick={jianhao.bind(this, templet.index)} style={{ float: 'right' }}>-</Button>
							<Button onClick={jiahao} style={{ marginRight: 5, float: 'right' }}>+</Button>
						</Col>
					</Row>))}
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
