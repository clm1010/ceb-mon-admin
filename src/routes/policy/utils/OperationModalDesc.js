import React from 'react'
import { Form, Input, InputNumber, Modal, Button, Select, Tabs, Checkbox, Row, Col, Icon, message } from 'antd'
import ConditionSetingModal from './ConditionSetingModal'
import PerformanceModalComp from './PerformanceModalComp'
import myStyle from './DataModal.less'
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout1 = {
	labelCol: {
		span: 10,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout2 = {
	labelCol: {
		span: 2,
	},
	wrapperCol: {
		span: 12,
	},
}

const ColProps = {
	style: {
		marginBottom: 8,
		textAlign: 'right',
	},
}

const formItemLayout3 = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 8,
	},
}
const formItemLayout4 = {
	labelCol: {
		span: 9,
	},
	wrapperCol: {
		span: 12,
	},
}

const formItemLayout6 = {
	labelCol: {
		span: 9,
	},
	wrapperCol: {
		span: 14,
	},
}

const formItemLayout7 = {
	labelCol: {
		span: 1,
	},
	wrapperCol: {
		span: 1,
	},
}

const OperationModalDesc = ({
	dispatch,
	visible,
	newOperationItem,
	form,
	checkStatus,
	tabstate,
	timeList,
	operationType,
	fileType,
	filter,
	advancedItem,
	resetCalInput,
	isDS,
	performanceItem
}) => {
	const { getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll } = form
	let pane = {}
	let keys = 0
	if (operationType === 'edit') {
		pane = newOperationItem
		if (newOperationItem.content && newOperationItem.content.filterItems) {
			filter = newOperationItem.content
		}
		if (pane) {
			keys = pane.key
		}
	} else if (tabstate && tabstate.panes) {
		let newkey = tabstate.panes.length
		keys = newkey - 1
		pane = tabstate.panes[keys]
	}
	let isObject = false
	if (pane.content) {
		if (pane.content.extOp === undefined) {
			pane.content.extOp = ''
		}
		if (pane.content.extThreshold === undefined) {
			pane.content.extThreshold = ''
		}
		if (pane.content.alarmName === undefined) {
			pane.content.alarmName = ''
		}
		if (pane.content.value === undefined) {
			pane.content.value = ''
		}
		isObject = true
	}

	let icon = '' //done,success,fail,checking
	if (checkStatus == 'done') {
		icon = 'reload'
	} else if (checkStatus == 'success') {
		icon = 'check'
	} else if (checkStatus == 'fail') {
		icon = 'close'
	} else if (checkStatus == 'checking') {
		icon = 'loading'
	}
	const showTabstate = (keys, stateLength) => {
		const data = {
			...getFieldsValue(),
		}
		for (let i = keys; i < stateLength; i++) {
			let fields = []
			let filterIndex = [0]
			if (filter && filter.filterIndex && filter.filterIndex.length > 0) {
				filterIndex = filter.filterIndex
			}
			if (filter && filter.filterItems && filter.filterItems.length > 0 && filter.filterItems.length != filterIndex.length) {
				let indexs = []
				filter.filterItems.forEach((item, index) => {
					indexs.push(index)
				})
				filterIndex = indexs
			}
			filterIndex.forEach((num) => {
				fields.push(`indicator_${num}`)
				fields.push(`function_${num}`)
				fields.push(`op_${num}`)
				fields.push(`count_${num}`)
				fields.push(`exprLValue_${num}`)
				fields.push(`exprOperator_${num}`)
				fields.push(`exprRValue_${num}`)
				fields.push(`threshold_${num}`)
			})
			const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
			let arrs = []
			filterIndex.forEach((num, index) => {
				let bean = {}
				bean.indicator = {}
				bean.indicator.name = valObj[`indicator_${num}`]
				bean.function = valObj[`function_${num}`]
				bean.op = valObj[`op_${num}`]
				bean.count = valObj[`count_${num}`]
				bean.exprLValue = valObj[`exprLValue_${num}`]
				bean.exprOperator = valObj[`exprOperator_${num}`]
				bean.exprRValue = valObj[`exprRValue_${num}`]
				bean.threshold = valObj[`threshold_${num}`]
				bean.index = index
				if (filter.filterItems.length > 0 && filter.filterItems[num].index == num) {
					bean.indicator.uuid = filter.filterItems[num].indicator.uuid
				}
				if (bean.function == 'nodata' || bean.function == 'regexp') {
					bean.exprRValue = '1'
				}
				if (bean.function == 'nodata_1') {
					bean.function = 'nodata'
					bean.exprRValue = '0'
				}
				if (bean.function == 'regexp_1') {
					bean.function = 'regexp'
					bean.exprRValue = '0'
				}
				arrs.push(bean)
			})
			let newdata = {}
			newdata.alarmName = (data[`alarmName${keys}`] ? data[`alarmName${keys}`] : '')
			let insertValues = JSON.parse(sessionStorage.getItem('insertValue'))
			if (insertValues !== '' && newdata.alarmName === '') {
				newdata.alarmName = insertValues
			}
			newdata.period = data[`alarmperiod${keys}`]
			if (data[`discard_innder${keys}`][0] === 'true') {
				newdata.discard_innder = true
			} else {
				newdata.discard_innder = false
			}
			if (data[`discard_outer${keys}`][0] === 'true') {
				newdata.discard_outer = true
			} else {
				newdata.discard_outer = false
			}
			newdata.actionsuuid = tabstate.panes[i].content.actionsuuid,
			newdata.aDiscardActionuuid = tabstate.panes[i].content.aDiscardActionuuid,
			newdata.aGradingActionuuid = tabstate.panes[i].content.aGradingActionuuid,
			newdata.aNamingActionuuid = tabstate.panes[i].content.aNamingActionuuid,
			newdata.conditionuuid = tabstate.panes[i].content.conditionuuid,
			newdata.timePerioduuid = tabstate.panes[i].content.timePerioduuid,
			newdata.uuid = tabstate.panes[i].content.uuid,
			newdata.recoverType = data[`recoverType${keys}`]
			newdata.innderLevel = data[`innderLevel${keys}`]
			newdata.originalLevel = data[`originalLevel${keys}`]
			newdata.outerLevel = data[`outerLevel${keys}`]
			newdata.logicOp = data.logicOp
			newdata.mode = data.mode
			newdata.filterItems = arrs
			if (advancedItem.expr) {
				newdata.expr = advancedItem.expr
				newdata.exprForFrontend = advancedItem.exprForFrontend
			} else {
				newdata.expr = newOperationItem.content.expr
				newdata.exprForFrontend = newOperationItem.content.exprForFrontend
			}
			// newdata.logicOp = advancedItem.logicOp
			let newPanes = {}
			newPanes.title = pane.title
			newPanes.key = keys
			newPanes.content = newdata
			tabstate.panes[keys] = newPanes
		}
	}

	const onOk = () => {
		validateFieldsAndScroll((errors) => {
			if (errors) {
				return
			}
			if (operationType === 'edit') { //点击修改只对单个进行修改
				showTabstate(keys, keys + 1)
				dispatch({
					type: `${fileType}/updateState`, //抛一个事件给监听这个type的监听器
					payload: {
						tabstate,
						operationVisible: false,
						showFlag: false,
					},
				})
			} else { //
				showTabstate(keys, tabstate.panes.length)
				dispatch({
					type: `${fileType}/updateState`, //抛一个事件给监听这个type的监听器
					payload: {
						tabstate,
						operationVisible: false,
						showFlag: false,
						//advancedItem:{},
					},
				})
			}
			sessionStorage.setItem('insertValue', JSON.stringify(''))
			resetFields()
		})
	}

	const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
		resetFields()
		if (operationType === 'add') {
			tabstate.panes.pop()
		}
		dispatch({
			type: `${fileType}/updateState`, //抛一个事件给监听这个type的监听器
			payload: {
				tabstate,
				operationVisible: false,
				isClose: true,
				filter: {
					filterItems: [{ indicator: { name: '', uuid: '' }, function: 'count', count: '', exprLValue: '', exprOperator: '', exprRValue: '', op: '', threshold: '', index: 0 }],
					filterIndex: [0],
				},
				showFlag: false
			},
		})
	}

	const modalOpts = {
		title: '告警条件设置',
		visible,
		onCancel,
		onOk,
		wrapClassName: 'vertical-center-modal',
		width: 1200,
		maskClosable: false,
		zIndex: 102,
	}

	//插入字段--start

	//移动光标到最后
	let setPos = function (o) {
		if (o.setSelectionRange) { //W3C
			setTimeout(() => {
				o.setSelectionRange(o.value.length, o.value.length)
				o.focus()
			}, 0)
		} else if (o.createTextRange) { //IE
			let textRange = o.createTextRange()
			textRange.moveStart('character', o.value.length)
			textRange.moveEnd('character', 0)
			textRange.select()
		}
	}
	let insertValue = ''
	function Insert(buttonID, str) {
		let ids = buttonID
		let obj = document.getElementById(buttonID)
		setPos(obj)
		if (document.selection) {
			obj.focus()
			let sel = document.selection.createRange()
			document.selection.empty()
			sel.text = str
		} else {
			let prefix,
				main,
				suffix
			prefix = obj.value.substring(0, obj.selectionStart)
			main = obj.value.substring(obj.selectionStart, obj.selectionEnd)
			suffix = obj.value.substring(obj.selectionEnd)
			obj.value = prefix + str + suffix
		}
		obj.focus()
		insertValue = obj.value
		sessionStorage.setItem('insertValue', JSON.stringify(obj.value))
	}

	//插入字段--end

	const onChange1 = (e) => {
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				CheckboxSate1: e.target.checked,
			},
		})
		if (!e.target.checked) {
			pane.content.extThreshold = ''
		}
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

	const conditionSetingProps = {
		dispatch,
		myform: form,
		queryPath: fileType,
		filter: filter,
		advancedItem,
		resetCalInput,
		pane,
		keys,
		isDS
	}
	const performanceDataProps = {
		dispatch,
		form,
		isDS,
		advancedItem,
		pane,
		fileType,
		performanceItem
	}
	return (
		<Modal {...modalOpts} height="600px">
			<Form layout="horizontal">
				<Tabs defaultActiveKey="templet_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="templet_1">
						<div style={{ position: 'relative' }} /* id={`area3${pane.key}`} */ />
						<Row>
							<Col>
								<FormItem label="监控周期" hasFeedback {...formItemLayout} /* id={`area3${pane.key}`} */>
									{getFieldDecorator(`alarmperiod${pane.key}`, {
										initialValue: (isObject ? `${pane.content.period}` : ''),
										rules: [
											{
												required: true,
											},
										],
									})(<Select
										showSearch
										placeholder="请选择"
									//getPopupContainer={() => document.getElementById(`area3${pane.key}`)}
									>
										{timeList.map(item =>
											<Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
									</Select>)}
								</FormItem>
							</Col>
						</Row>

						<div style={{ position: 'relative' }} id={`area1${pane.key}`} />
						<FormItem label="告警恢复类型" hasFeedback {...formItemLayout}>
							{getFieldDecorator(`recoverType${pane.key}`, {
								initialValue: (isObject ? `${pane.content.recoverType}` : ''),
								rules: [
									{
										required: true,
									},
								],
							})(<Select
								showSearch
								placeholder="请选择"
								getPopupContainer={() => document.getElementById(`area1${pane.key}`)}
							>
								<Select.Option value="0">不可恢复</Select.Option>
								<Select.Option value="1">可恢复</Select.Option>
							</Select>)}
						</FormItem>
					</TabPane>
				</Tabs>
				{isDS ? <PerformanceModalComp {...performanceDataProps} /> : null}
				<ConditionSetingModal {...conditionSetingProps} />
				<Tabs defaultActiveKey="templet_3">
					<TabPane tab={<span><Icon type="user" />告警定义</span>} key="templet_3">
						{/* <Form layout="horizontal"> */}
						<Row>
							<Col span={11}>
								<FormItem label="告警名定义" hasFeedback {...formItemLayout6}>
									{getFieldDecorator(`alarmName${keys}`, {
										initialValue: (isObject ? `${pane.content.alarmName}` : ''),
									})(<Input id={`alarmName${keys}`} />)}
								</FormItem>
							</Col>
							<Col span={8}>
								<div className={myStyle.buttonPart}>
									<Button onClick={Insert.bind(this, `alarmName${keys}`, ' MO_SERVER_NAME ')}>主机名</Button>
									<Button onClick={Insert.bind(this, `alarmName${keys}`, ' MO_IP ')}>IP</Button>
									<Button onClick={Insert.bind(this, `alarmName${keys}`, ' MO_NAME ')}>名称</Button>
									<Button onClick={Insert.bind(this, `alarmName${keys}`, ' <MO_ZZIP> ')}>对端设备IP</Button>
									<Button onClick={Insert.bind(this, `alarmName${keys}`, ' MO_FS_NAME ')}>文件系统名</Button>
									<Button onClick={Insert.bind(this, `alarmName${keys}`, ' LABEL ')}>标签</Button>
								</div>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<div style={{ position: 'relative' }} id={`area8${pane.key}`} />
								<FormItem label="原始级别" hasFeedback {...formItemLayout1}>
									{getFieldDecorator(`originalLevel${keys}`, {
										initialValue: (pane.content && pane.content.originalLevel ? `${pane.content.originalLevel}` : ''),
									})(<Select
										showSearch
										placeholder="请选择"
										getPopupContainer={() => document.getElementById(`area8${pane.key}`)}
										style={{ width: 115 }}
									>
										<Select.Option key={`origina_${keys}_1`} value="1">一级告警</Select.Option>
										<Select.Option key={`origina_${keys}_2`} value="2">二级告警</Select.Option>
										<Select.Option key={`origina_${keys}_3`} value="3">三级告警</Select.Option>
										<Select.Option key={`origina_${keys}_4`} value="4">四级告警</Select.Option>
										<Select.Option key={`origina_${keys}_100`} value="100">五级告警</Select.Option>
									</Select>)}

								</FormItem>
							</Col>
							<Col span={8}>
								<div style={{ position: 'relative' }} id={`area9${pane.key}`} />
								<FormItem label="周期内" hasFeedback {...formItemLayout1}>
									{getFieldDecorator(`innderLevel${keys}`, {
										initialValue: (pane.content && pane.content.innderLevel ? `${pane.content.innderLevel}` : ''),

									})(<Select
										showSearch
										placeholder="请选择"
										getPopupContainer={() => document.getElementById(`area9${pane.key}`)}
										style={{ width: 115 }}
									>
										<Select.Option key={`innder_${keys}_1`} value="1">一级告警</Select.Option>
										<Select.Option key={`innder_${keys}_2`} value="2">二级告警</Select.Option>
										<Select.Option key={`innder_${keys}_3`} value="3">三级告警</Select.Option>
										<Select.Option key={`innder_${keys}_4`} value="4">四级告警</Select.Option>
										<Select.Option key={`innder_${keys}_100`} value="100">五级告警</Select.Option>
									</Select>)}
								</FormItem>
							</Col>
							<Col span={8}>
								<div style={{ position: 'relative' }} id={`area11${pane.key}`} />
								<FormItem label="周期外" hasFeedback {...formItemLayout1}>
									{getFieldDecorator(`outerLevel${keys}`, {
										initialValue: (pane.content && pane.content.outerLevel ? `${pane.content.outerLevel}` : ''),
									})(<Select
										showSearch
										placeholder="请选择"
										getPopupContainer={() => document.getElementById(`area11${pane.key}`)}
										style={{ width: 115 }}
									>
										<Select.Option key={`outer_${keys}_1`} value="1">一级告警</Select.Option>
										<Select.Option key={`outer_${keys}_2`} value="2">二级告警</Select.Option>
										<Select.Option key={`outer_${keys}_3`} value="3">三级告警</Select.Option>
										<Select.Option key={`outer_${keys}_4`} value="4">四级告警</Select.Option>
										<Select.Option key={`outer_${keys}_5`} value="100">五级告警</Select.Option>
									</Select>)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<FormItem label="告警丢弃" hasFeedback {...formItemLayout3}>
									{getFieldDecorator(`discard_innder${keys}`, {
										initialValue: (pane.content && pane.content.discard_innder ? ['true'] : []),
									})(<Checkbox.Group ><Checkbox /* defaultChecked={operationType === 'add' ? false : pane.content.discard_innder} */ value="true">周期内</Checkbox></Checkbox.Group>)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="" hasFeedback {...formItemLayout3}>
									{getFieldDecorator(`discard_outer${keys}`, {
										initialValue: (pane.content && pane.content.discard_outer ? ['true'] : []),
									})(<Checkbox.Group><Checkbox /* defaultChecked={operationType === 'add' ? false : pane.content.discard_outer} */ value="true">周期外</Checkbox></Checkbox.Group>)}
								</FormItem>
							</Col>
						</Row>
						{/* </Form> */}
					</TabPane>
				</Tabs>
			</Form>
		</Modal>
	)
}

export default Form.create()(OperationModalDesc)
