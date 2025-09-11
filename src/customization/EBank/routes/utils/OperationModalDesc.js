import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { Form, Input, InputNumber, Modal, Button, Select, Tabs, Checkbox, Row, Col, Icon, Collapse, DatePicker } from 'antd'
import myStyle from './DataModal.less'
import moment from 'moment'
const Panel = Collapse.Panel
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const TextArea = Input.TextArea
const RangePicker = DatePicker.RangePicker

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

const formItemLayout5 = {
	labelCol: {
		span: 10,
	},
	wrapperCol: {
		span: 18,
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
const formItemLayout8 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 10,
	},
}
const formItemLayout9 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 8,
	},
}

const formItemLayout10 = {
	wrapperCol: {
		span: 22,
	},
}
const formItemLayout11 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 16,
	},
}
const FormItemProps = {
	style: {
		margin: 0,
	},
}
const OperationModalDesc = ({
	dispatch,
	visible,
	newOperationItem,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
	checkStatus,
	tabstate,
	timeList,
	operationType,
	fileType,
	CheckboxSate1,
	filterMode,
	fields,
	expr,
	flag,
	selectValue,
	promApiReq,
	content,
	endtime,
	statrtime,
	xyAais,
	option1,
	legend,
	preview,
}) => {
	let pane = {}
	let keys = 0
	if (operationType === 'edit') {
		pane = newOperationItem
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
	let isObject1 = true
	if (operationType === 'add') {
		isObject1 = false
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
				newdata.foward = data[`foward${keys}`]//大于号
			newdata.innderLevel = data[`innderLevel${keys}`]
			newdata.originalLevel = data[`originalLevel${keys}`]
			newdata.outerLevel = data[`outerLevel${keys}`]
			newdata.times = (data[`times${keys}`] ? data[`times${keys}`] : '')
			newdata.value = (data[`value${keys}`] ? data[`value${keys}`] : '')//阈值的值
			newdata.recoverType = data[`recoverType${keys}`]
			newdata.extOp = data[`extOp${keys}`]//小于号
			newdata.extThreshold = (data[`extThreshold${keys}`] ? data[`extThreshold${keys}`] : '')
			newdata.fields = Object.assign({}, fields)
			newdata.filterMode = filterMode
			if (newdata.extOp && newdata.extThreshold) {
				newdata.useExt = true
			} else {
				newdata.useExt = false
			}
			let newPanes = {}
			newPanes.title = pane.title
			newPanes.key = keys
			newPanes.content = newdata
			tabstate.panes[keys] = newPanes
		}
	}

	const onOk = () => {
		if (operationType === 'edit') { //点击修改只对单个进行修改
			showTabstate(keys, keys + 1)
		} else { //
			showTabstate(keys, tabstate.panes.length)
		}
		dispatch({
			type: `${fileType}/updateState`, //抛一个事件给监听这个type的监听器
			payload: {
				tabstate,
				operationVisible: false,
				filterMode: 'BASIC',
			},
		})
		sessionStorage.setItem('insertValue', JSON.stringify(''))
		resetFields()
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
				filterMode: 'BASIC',
				fields: {},
				preview:''
			},
		})
	}

	const modalOpts = {
		title: '操作详情',
		visible,
		onCancel,
		onOk,
		wrapClassName: 'vertical-center-modal',
		width: 750,
		maskClosable: false,
		// zIndex: 102,
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

	const onChange = (val) => {
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				filterMode: val
			},
		})
	}

	function genOptions(objArray) {
		let options = []
		objArray.forEach((option) => {
			options.push(<Option key={option.uuid} value={option.uuid} select={true}>{option.name}</Option>)
		})
		return options
	}
	let objectArray = typeof (fields.formulaForFrontend) !== 'undefined' && fields.formulaForFrontend !== '' ? JSON.parse(fields.formulaForFrontend) : []
	const options = typeof (fields.formulaForFrontend) !== 'undefined' && fields.formulaForFrontend !== '' ? genOptions(objectArray) : []

	const defaultValue = []
	if (true) {		//如果判断不是清空，则展现，否则不展现
		options.forEach((option) => {
			defaultValue.push(option.key)
			//	options.push(<Option key={option.key} value={option.key} select={true}>{option.props.children}</Option>)
		})
	}

	const operations = (<FormItem {...FormItemProps} hasFeedback key="modeswitch">
		{getFieldDecorator('filterMode', {
			initialValue: filterMode,
			rules: [
				{
					required: true,
				},
			],
		})(<Select disabled showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} size="small" onChange={onChange} style={{ width: '150px' }}>
			<Select.Option value="BASIC">基础模式</Select.Option>
			<Select.Option value="ADVANCED">专家模式</Select.Option>
		</Select>)
		}
	</FormItem>)
	const getFormulaStrs = (objarrs) => {
		let formulastr = ''
		if (objarrs && objarrs.length > 0) {
			objarrs.forEach((bean) => {
				let uuidstr = bean.uuid
				if (uuidstr && uuidstr.includes('$')) {
					let arrs = uuidstr.split('$')
					if (arrs && arrs.length > 0) {
						formulastr += arrs[0]
					}
				}
			})
		}
		return formulastr
	}

	const handleChange1 = (val) =>{

		if(val=='1'){
			flag = true
			selectValue = val
			dispatch({
				type: `${fileType}/updateState`,
				payload: {
					flag: flag,
					selectValue: selectValue
				},
			})
		}else {
			flag = false
			selectValue = val
			dispatch({
				type: `${fileType}/updateState`,
				payload: {
					flag: flag,
					selectValue: selectValue
				},
			})
		}
	}

	const handleChange = (val) => {
		let arr = []
		if (val && val.length > 0) {
			val.forEach((i) => {
				if (objectArray.find(p => p.uuid == i)) {
					arr.push(objectArray.find(p => p.uuid == i))
				} else {
					const uuid = `${i}$${new Date().getTime()}`
					arr.push({ uuid, name: i })
				}
			})
		}
		if (arr.length > 0) {
			let stringArray = JSON.stringify(arr)
			fields.formulaForFrontend = stringArray
			fields.formula = getFormulaStrs(arr)
		}else if(arr.length==0){
			fields.formulaForFrontend = ''
			fields.formula =''
		}
		resetFields([`extThreshold${keys}`])
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				fields: fields,
				resetCalInput: false,
			},
		})
	}
	const onstdIndicatorsInfo = () => {
		resetFields([`extThreshold${keys}`])
		dispatch({
			type: 'stdIndicatorGroup/query',
			payload: {},
		})
		dispatch({
			type: `${fileType}/querystdInfo`,
			payload: {},
		})
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				kpiVisible: true,
			},
		})
	}
	const addOps = (type) => {
		resetFields([`extThreshold${keys}`])  //当输入框的内容被删空后，再次插入内容需要清空一下。
		const uuid = `${type}_${new Date().getTime()}`
		//向数组推送新的对象
		objectArray.push({ uuid, name: type })
		//再转型成字符串
		let stringArray = JSON.stringify(objectArray)
		//修改当前item的formual属性
		fields.formulaForFrontend = stringArray

		//后台需要解析并计算的公式
		fields.formula = getFormulaStrs(objectArray)
		/*
		把修改后的当前currentItem，覆盖到state中去
		*/
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				fields: fields,
				resetCalInput: false,
			},
		})
	}

	const resetFormula = () => {
		fields.formula = ''
		fields.formulaForFrontend = ''
		resetFields([`extThreshold${keys}`])
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				fields: fields,
				resetCalInput: true,
			},
		})
	}
	let Prometheusuuid = getFieldsValue([`Prometheus${keys}`])

	let newArr = content? content.find(item => item.uuid == Prometheusuuid[`Prometheus${keys}`]) : ''

	const lossOnOk = (dates) => {
		statrtime =  moment(dates[0]).unix()
		endtime = moment(dates[1]).unix()
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				statrtime: statrtime,
				endtime: endtime,
			},
		})



	}

	const onPreview = () => {	
	
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				preview: 'templet_2'
			},
		})
		dispatch({
			type: `${fileType}/Formula`,
			payload: {
				formula: fields.formula,
				page: 0,
				q: `toolType=='PROMETHEUS';__distinct__==true`,
				sort:`name,asc`,
			},
		})
	}

	const onAgree = () => {
		let Exprvalue = getFieldsValue(['expr'])

		promApiReq = {
			end: '',
			query: Exprvalue.expr,
			start: '',
			step: 60,
			timeout: 10
		}
		dispatch({
			type: `${fileType}/Perfdata`,
			payload: {
				promApiReq: promApiReq,
				tool: newArr
			},
		})
	}

	const onSure = () => {
		let Exprvalue = getFieldsValue(['expr'])

		promApiReq = {
			end: '',
			query: Exprvalue.expr,
			start: '',
			step: 60,
			timeout: 10
		}
		dispatch({
			type: `${fileType}/Perfdata`,
			payload: {
				promApiReq: promApiReq,
				tool: newArr
			},
		})
	}


	const offPreview = () => {
		dispatch({
			type: `${fileType}/updateState`,
			payload: {
				preview: ''
			},
		})
	}

	const myConditionItem = () => {
		switch (filterMode) {
			case 'BASIC':
				return (
					<TabPane tab={<span><Icon type="user" />阀值设置</span>} key="templet_2" >
						<Form layout="horizontal">
							<Row>
								<Col>
									<FormItem label="连续" hasFeedback {...formItemLayout4}>
										{getFieldDecorator(`times${keys}`, {
											initialValue: (isObject ? `${pane.content.times}` : ''),
											rules: [
												{
													required: true,
												},
												{
													validator: blurFunctions,
												},
											],
										})(<InputNumber min={1} step={1} precision={1} />)}次
								  </FormItem>
								</Col>
								<Col span={4}>
									&nbsp;&nbsp;&nbsp;告警阀值:
							</Col>
								<Col span={12}>
									<div style={{ position: 'relative' }} id={`area5${pane.key}`} />
									<FormItem label="" hasFeedback {...formItemLayout5}>
										{getFieldDecorator(`foward${keys}`, {
											initialValue: (isObject ? `${pane.content.foward}` : ''),
										})(<Select
											placeholder="请选择"
											getPopupContainer={() => document.getElementById(`area5${pane.key}`)}
										>
											<Select.Option key={`${keys}>`} value=">">高于</Select.Option>
											<Select.Option key={`${keys}>=`} value=">=">高于等于</Select.Option>
											<Select.Option key={`${keys}<`} value="<">低于</Select.Option>
											<Select.Option key={`${keys}=<`} value="=<">低于等于</Select.Option>
											<Select.Option key={`${keys}=`} value="=">等于</Select.Option>
										</Select>)}
									</FormItem>
								</Col>
								<Col span={8}>
									<FormItem label="" hasFeedback {...formItemLayout2}>
										{getFieldDecorator(`value${keys}`, {
											initialValue: (isObject ? `${pane.content.value}` : ''),
										})(<Input />)}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col>
									<Row>
										<Col span={3}>
											&nbsp;&nbsp;&nbsp;告警阀值:
									</Col>
										<Col span={1}>
											<FormItem label="" key="1" hasFeedback {...formItemLayout7}>
												<Checkbox checked={CheckboxSate1} onChange={onChange1} />
											</FormItem>
										</Col>
										<Col span={12}>
											<div style={{ position: 'relative' }} id={`area16${pane.key}`} />
											<FormItem label="" hasFeedback {...formItemLayout5}>
												{getFieldDecorator(`extOp${keys}`, {
													initialValue: (isObject ? `${pane.content.extOp}` : ''),
												})(<Select
													placeholder="请选择"
													getPopupContainer={() => document.getElementById(`area16${pane.key}`)}
													maxTagCount={1}
												>
													<Select.Option key={`${keys}>`} value=">">高于</Select.Option>
													<Select.Option key={`${keys}>=`} value=">=">高于等于</Select.Option>
													<Select.Option key={`${keys}<`} value="<">低于</Select.Option>
													<Select.Option key={`${keys}=<`} value="=<">低于等于</Select.Option>
													<Select.Option key={`${keys}=`} value="=">等于</Select.Option>
												</Select>)}
											</FormItem>
										</Col>
										<Col span={8}>
											<FormItem label="" hasFeedback {...formItemLayout2} id={`textValue${pane.key}`}>
												{getFieldDecorator(`extThreshold${keys}`, {
													initialValue: (isObject ? `${pane.content.extThreshold}` : ''),
												})(<Input disabled={CheckboxSate1 === false} id="textValue" />)}
											</FormItem>
										</Col>
									</Row>
								</Col>
							</Row>
						</Form>
					</TabPane>
				)

			case 'ADVANCED':
				return (
					<TabPane tab={<span><Icon type="user" />阀值设置</span>} key="templet_2" >
						<Form layout="horizontal">
							<Row>
								<Col span={22}>
									<FormItem label="公式编辑区" hasFeedback {...formItemLayout11}>
										{getFieldDecorator(`extThreshold${keys}`, {
											initialValue: defaultValue,
											rules: [
												{
													required: true,
												},
											],
										})(<Select placeholder="公式编辑区" allowClear mode="tags" dropdownStyle={{ display: 'none' }} onChange={handleChange}>
											{options}
										</Select>)}
										<Button size="small" style={{ marginTop: '8px', marginRight: '6px', float: 'right' }} onClick={resetFormula}>清空</Button>
										<Button size="small" style={{ marginTop: '8px', marginRight: '6px', float: 'right' }} onClick={onstdIndicatorsInfo}>插入指标</Button>
									</FormItem>
								</Col>
								<Col span={2} pull={1}>
									<Button style={{ marginTop: 6 }} size="small" onClick={onPreview}>预览数据</Button>
								</Col>
							</Row>
							<Row>
								<Col span={24}>
									<FormItem label="告警阈值" hasFeedback {...formItemLayout8}>
										{getFieldDecorator(`foward${keys}`, {
											initialValue: (isObject1 ? `${pane.content.foward}` : ''),
											rules: [
												{
													required: true,
												},
											],
										})(<Input id="textValue" />)}
									</FormItem>
								</Col>
							</Row>
						</Form>
					</TabPane>
				)
		}
	}

	const customPanelStyle = {
		background: '#fff',
		borderRadius: 4,
		overflow: 'hidden',
		border: 0,
	};

	const option = {
		tooltip: {
			trigger: 'axis'
		},
		// dataZoom:[{
		// 	type:'slider',
		// 	show:true,
		// 	xAxisIndex:[0],
		// 	left:'9%',
		// 	start:10,
		// 	end:90
		// }],
		grid: {
			x2:100,
			left: '10%',
			right: '4%',
			top:'30px',
			containLabel: true
		},
		legend: {
			data:legend
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: xyAais
		},
		yAxis: {
			type: 'value'
		},
		series:option1
	}
	let Seroptions = []
	content? content.forEach((option) => {
			Seroptions.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
  	}):''
	const PerformDdata = () => {
		return (
			<TabPane tab={<span><Icon type="user" />性能数据</span>} key="templet_2">
				<Row>
					<Row>
						<Col>
							<FormItem label="Prometheus" hasFeedback {...formItemLayout9}>
								{getFieldDecorator(`Prometheus${keys}`, {
									initialValue: content && content.length > 0 ? content[0].uuid : '',
								})(<Select>
									{Seroptions}
								</Select>)}
							</FormItem>
						</Col>
					</Row>
					<Row style={{ marginTop: -25 }}>
						<Col span={22} push={2}>
							<Collapse defaultActiveKey='' bordered={false}>
								<Panel header="表达式 :" key="1" style={customPanelStyle}>
									<Col span={22} >
										<FormItem label="" hasFeedback {...formItemLayout10}>
											{getFieldDecorator('expr', {
												initialValue: expr,
											})(<TextArea rows={3} />)}
										</FormItem>
									</Col>
									<Col span={2} pull={1}>
										<Button style={{ marginTop: 36,marginRight:5 }} size="small" onClick={onAgree}>应用</Button>
									</Col>
								</Panel>
							</Collapse>
						</Col>
					</Row>
					<Row>
						<Row style={{ marginTop: 20 }} gutter={[0,0]}>
							<Col span={2} push={2}>监控信息</Col>
							<Col span={2} pull={1} style={{ float: "right"}}>
								<Button size="small" onClick={onSure}>确定</Button>
							</Col>

							<Col span={10} style={{ float: "right"}} >
							
								{!flag  ? '':<RangePicker onOk={lossOnOk} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" style={{ width: 260, marginLeft:-5 }} />}
					
							</Col>
							
							<Col span={5} style={{ float: "right" }}>范围 :&nbsp;
								<Select id = "Select" style={{ width: 100 }} size="small" defaultValue='1800'  onChange={handleChange1}>
									<Select.Option key= "1800" value="1800">过去30分钟</Select.Option>
									<Select.Option key= "3600" value="3600">过去一小时</Select.Option>
									<Select.Option key= "10800" value="10800">过去6小时</Select.Option>
									<Select.Option key= "86400" value="86400">过去1天</Select.Option>
									<Select.Option key= "259200" value="259200">过去三天</Select.Option>
									<Select.Option key= "604800" value="604800">过去7天</Select.Option>
									<Select.Option key= "1" value="1">自定义</Select.Option>
								</Select>
							</Col>
						</Row>
						<Row >
							<Col span={22} push={1} >
								<ReactEcharts
									option={option}
									style={{ width: '100%'}}
									key={Date.now()}
								//showLoading={ladderChart.loading.effects['chd/queryCPU']}
								/>
							</Col>
						</Row>
					</Row>
				</Row>
			</TabPane>
		)
	}
	return (
		<Modal {...modalOpts} height="700px">
			<Form layout="horizontal">
				<Tabs defaultActiveKey="templet_1">
					<TabPane tab={<span><Icon type="user" />基本信息</span>} key="templet_1">
						<div style={{ position: 'relative' }} id={`area3${pane.key}`} />
						<Row>
							<Col>
								<FormItem label="监控周期" hasFeedback {...formItemLayout} id={`area3${pane.key}`}>
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
										getPopupContainer={() => document.getElementById(`area3${pane.key}`)}
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
				<Tabs activeKey={`${preview}`} onTabClick={offPreview}>
					{PerformDdata()}
				</Tabs >
				<Tabs defaultActiveKey="templet_3" tabBarExtraContent={operations}>
					{myConditionItem()}
				</Tabs>
				<Tabs defaultActiveKey="templet_4">
					<TabPane tab={<span><Icon type="user" />告警定义</span>} key="templet_4">
						<Form layout="horizontal">
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
										})(<Checkbox.Group ><Checkbox defaultChecked={operationType === 'add' ? false : pane.content.discard_innder} value="true">周期内</Checkbox></Checkbox.Group>)}
									</FormItem>
								</Col>
								<Col span={12}>
									<FormItem label="" hasFeedback {...formItemLayout3}>
										{getFieldDecorator(`discard_outer${keys}`, {
											initialValue: (pane.content && pane.content.discard_outer ? ['true'] : []),
										})(<Checkbox.Group><Checkbox defaultChecked={operationType === 'add' ? false : pane.content.discard_outer} value="true">周期外</Checkbox></Checkbox.Group>)}
									</FormItem>
								</Col>
							</Row>
						</Form>
					</TabPane>
				</Tabs>
			</Form>
		</Modal>
	)
}

export default Form.create()(OperationModalDesc)
