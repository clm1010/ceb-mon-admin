import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tabs, Row, Col, Button, DatePicker, Alert, Table, Icon } from 'antd'
import { genDictOptsByName, getSourceByKey } from '../../../utils/FunctionTool'
import UserSelectComp from '../../../components/userSelectComp'
import mystyle from './DataModal.less'
import moment from 'moment'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItemProps = {
	style: {
		margin: 0,
	},
}
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
		span: 6,
	},
	wrapperCol: {
		span: 16,
	},
}
const formItemLayout4 = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
}

const formItemLayoutAppNameEditing = {
	wrapperCol: {
		span: 24,
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

const modal = ({
	dispatch,
	instanceVisible,				//# 实例化窗口可见
	type,
	item = {},
	form,
	user,
	userSelect,
	applicantInfo,
	choosedRows,
	tempList,
	timeOut,          				//# 改开始
	showEndTime,     //结束
	reviewers,
	timeValue,						//# 时长
	selectedReviewer, //授权人
	endValue,
	startValue,
	nameChange,						//# 请再次确认
	restrict, //权限
	selectTreeNode,			// 选中场景节点
	ticket,							//# 工单号
	timeRange,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields,
	} = form
	const rhCfg = getSourceByKey('RenhangTime')

	function getDescriptionValue(arr, description) {
		let obj = null
		arr.map(item => {
			if (item.name === description) {
				obj = item
			}
		})
		return obj
	}

	const branchs = genDictOptsByName('branch')

	let branchInfo = []
	let branchValues = []
	if (user.roles) {
		if (user.roles[0].name === '超级管理员' || user.roles[0].name === '一线服务台') {
			branchInfo = branchs
		} else {
			//维护期新增的分行权限
			if (user.roles[0].permissions) {
				if (user.roles[0].permissions.length === 0) {
					branchInfo = branchs
				} else if (user.roles[0].permissions.length > 0) {
					for (let roles of user.roles[0].permissions) {
						if (roles.resource === '/api/v1/mts') {
							if (roles.action === 'create' && roles.has && type === 'instance') { //维护期实例新增的权利
								let infofh = []
								for (let item of roles.permissionFilter.filterItems) {
									if (item.field === 'branch' && item.op === '=') {
										infofh.push(item.value)//拿到分行的属性，需要去重
									}
								}
								//去重
								if (infofh.length === 0) {
									branchInfo = branchs
								} else {
									for (let info of infofh) {
										if (branchValues.indexOf(info) === -1) {
											branchValues.push(info)
										}
									}
									for (let i = 0; i < branchValues.length; i++) {
										branchInfo.push(<Option key={branchValues[i]} value={branchValues[i]} name={maps.get(branchValues[i])}>{maps.get(branchValues[i])}</Option>)
									}
								}
							} else if (roles.action === 'create' && !roles.has && type === 'instance') {
								branchInfo = branchs
							}
							if (roles.action === 'create_short_time_mt' && roles.has) {  //短时维护期
							}
							if (roles.action === 'pre_creation' && roles.has) { //预维护期
							}
						}
					}
				}
			}
		}
	}

	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}

			if (nameChange == '请再次确认' && timeOut) {
				//message.warning('请点击再次确认')
				Modal.warning({
					title: '维护期设置时间大于24小时,请点击再次确认',
					okText: 'OK',
				})
				return
			}

			const data = {
				...getFieldsValue(),
			}
			//非周期时间数组
			let timeDef = {}
			let defs = []
			let beginStr = ''
			let endStr = ''
			// 处理时间
			let begin = data.beginTimeList
			let end = data.endTimeList
			if (end !== undefined && end !== null && end.length !== 0) {
				beginStr = begin.format('YYYY-MM-DD HH:mm:ss')
				endStr = end.format('YYYY-MM-DD HH:mm:ss')
			}
			let def = {
				begin: beginStr,
				end: endStr,
			}
			defs.push(def)
			timeDef.repeatType = 'OTHER'
			timeDef.range = defs
			//模板
			let templates = []
			choosedRows.forEach(record => templates.push(record.uuid))
			let palyload = {
				ticket: data.ticket,
				branch: data.branch,
				timeDef: timeDef,
				tpe: "NON_PERIODIC",
				whitelistEnabled: "t",
				templates: templates
			}
			dispatch({
				type: 'maintenanceTemplet/batch_instance',
				payload: palyload,
			})
			resetFields()
		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'maintenanceTemplet/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				instanceVisible: false,
				choosedRows: [],
				timeValue: '',
				timeOut: false,
				ticket: '',
			},
		})
	}

	const validatbegin = (rule, value, callback) => {
		if (value === undefined || value === '' || endValue == 9999999999999) {
			callback()
		} else {
			let end = endValue
			let bagin = Date.parse(value)
			if ((end - bagin > 24 * 60 * 60 * 1000) && (restrict[1] == 'create_short_time_mt' && restrict[0] == undefined && restrict[2] == undefined)) {
				callback('您的权限只能设置为24小时之内')
			} else {
				callback()
			}
		}
	}
	const validatend = (rule, value, callback) => {
		if (value === undefined || value === '' || startValue == 0) {
			callback()
		} else {
			let bagin = startValue
			let end = Date.parse(value)
			if ((end - bagin > 24 * 60 * 60 * 1000) && (restrict[1] == 'create_short_time_mt' && restrict[0] == undefined && restrict[2] == undefined)) {
				callback('您的权限只能设置为24小时之内')
			} else {
				callback()
			}
		}
	}
	function disabledDate(current) {
		//时间跨度 起始时间不能是今天以前，结束时间也不能是一年半以后(365 + 366/2) * 24 * 3600 * 1000 =
		//时间间隔不能超过一个月（30*24*3600*1000）
		let mothslimt = 0
		if (endValue != 9999999999999) {
			mothslimt = endValue - 2592000000
		}
		return current && (
			current.valueOf() < new Date(new Date().toLocaleDateString()).getTime() || current.valueOf() > endValue ||
			current.valueOf() > new Date(new Date().toLocaleDateString()).getTime() + 47347200000 || current.valueOf() < mothslimt)
	}

	const getData = (begin, end) => {
		if (begin && end) {
			let value = end - begin
			let day = parseInt(value / (1000 * 3600 * 24))
			let day1 = parseInt(value % (1000 * 3600 * 24))
			let hour = parseInt(day1 / (1000 * 3600))
			let hour1 = parseInt(day1 % (1000 * 3600))
			let minu = parseInt(hour1 / (1000 * 60))
			timeValue = (day == 0 ? `维护期时长为：${hour}小时${minu}分` : `维护期时长为：${day}天${hour}小时${minu}分`)
			//timeValue = `维护期时长为：${day}天${hour}小时${minu}分`
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					timeValue: timeValue,
					startValue: begin ? begin : 0,
					endValue: end ? end : 9999999999999,
				}
			})
		} else {
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					timeValue: '',
					startValue: begin ? begin : 0,
					endValue: end ? end : 9999999999999,
				}
			})
		}
	}

	const onButton = () => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				nameChange: '已确认'
			}
		})
	}

	const getinfoTime = (begin, end) => {
		if (end - begin > 24 * 60 * 60 * 1000) {
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					timeOut: true,
					nameChange: '请再次确认'
				}
			})
		} else {
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					timeOut: false,
					nameChange: '请再次确认'
				}
			})
		}

		if ((restrict[0] == undefined && restrict[1] == undefined && restrict[2] === 'pre_creation') ||
			(restrict[0] == undefined && restrict[1] == 'create_short_time_mt' && restrict[2] === 'pre_creation' && (end - begin > 24 * 60 * 60 * 1000))) {
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					selectedReviewer: true
				}
			})
		} else {
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					selectedReviewer: false
				}
			})
		}
	}
	const onOkbegin = (date, dataString) => {
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let end = data.endTimeList
		let begin = Date.parse(date)
		getData(begin, end)
		if (end && end != '') {
			getinfoTime(begin, end)
		}
	}
	const onOkend = (date, dataString) => {
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let begin = data.beginTimeList
		let end = Date.parse(date)
		getData(begin, end)
		if (begin && begin != '') {
			getinfoTime(begin, end)
		}
	}

	function disabledEndDate(current) {
		//时间跨度 起始时间不能是今天以前，结束时间也不能是一年半以后(365 + 366/2) * 24 * 3600 * 1000 =
		//时间间隔不能超过一个月（30*24*3600*1000）
		let mothslimt = 9999999999999
		if (startValue != 0) {
			mothslimt = startValue + 2592000000
		}
		return current && (
			(current.valueOf() < startValue || current.valueOf() < new Date(new Date().toLocaleDateString()).getTime()) ||
			current.valueOf() > new Date(new Date().toLocaleDateString()).getTime() + 47347200000 || current.valueOf() > mothslimt)
	}

	const modalOpts = {
		title: `批量实例化`,
		visible: instanceVisible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}


	//适用范围查询条件搜索
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}

	const userSelectProps = Object.assign({}, userSelect, {
		placeholders: '申请人工号或姓名检索', name: '申请人', modeType: 'combobox', required: true, dispatch, form, item, disabled: type === 'see', compName: 'applicant', cDefaultName: applicantInfo,
	})

	const reviewersOption = []
	reviewers.forEach((option) => {
		reviewersOption.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
	})

	const Optionreviews = []
	if (item.reviewers && item.reviewers.length > 0) {
		item.reviewers.forEach((item) => {
			Optionreviews.push(item.reviewerId)
		})
	}

	const columns = [
		{
			title: '模板名称',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '描述',
			dataIndex: 'description',
			key: 'description',

		}, {
			title: '创建人',
			dataIndex: 'createdBy',
			key: 'createdBy',

		}
	]
	
	return (
		<Modal {...modalOpts} width="1250px" >
			<Form layout="horizontal">
				<Tabs defaultActiveKey="1">
					<TabPane tab={<span><Icon type="user" />实例化基本信息</span>} key="1">
						<FormItem label="变更号" hasFeedback {...formItemLayout}>
							{getFieldDecorator('ticket', {
								initialValue: ticket,
								rules: [
									{
										required: true,
										message: '变更号必填'
									}
								],
							})(<Input />)}
						</FormItem>

						<FormItem label="适用范围" hasFeedback {...formItemLayout}>
							{getFieldDecorator('branch', {
								initialValue: 'QH',
								rules: [
									{
										required: true,
									},
								],
							})(<Select showSearch
								filterOption={mySearchInfo}
							>
								{branchInfo}
							</Select>)}
						</FormItem>
						<Row style={{ paddingTop: 10, paddingLeft: 200 }} >
							<Col lg={10} md={10} sm={10} xs={10}  >
								<FormItem label="开始时间" hasFeedback {...formItemLayout1} >
									{getFieldDecorator('beginTimeList', {
										initialValue: timeRange === null ? undefined : moment(new Date()),
										rules: [
											{
												required: true,
												message: '开始时间必填'
											},
											{
												validator: validatbegin,
											},
										],
									})(<DatePicker
										disabledDate={disabledDate}
										showTime placeholder="请选择开始时间"
										format="YYYY-MM-DD HH:mm:ss"
										style={{ width: '100%' }}
										onChange={onOkbegin}
									/>)}
								</FormItem>
							</Col>
							<Col lg={10} md={10} sm={10} xs={10} >
								<FormItem label="结束时间" hasFeedback {...formItemLayout1} >
									{getFieldDecorator('endTimeList', {
										initialValue: timeRange === null ? undefined : moment(new Date()).add(timeRange, 'm'),
										rules: [
											{
												required: true,
												message: '结束时间必填'
											},
											{
												validator: validatend,
											},
										],
									})(
										<DatePicker
											disabledDate={disabledEndDate}
											showTime placeholder="请选择结束时间"
											format="YYYY-MM-DD HH:mm:ss"
											style={{ width: '100%' }}
											onChange={onOkend}
										/>
									)}
								</FormItem>
							</Col>
							<Col lg={10} md={10} sm={10} xs={10}  >
								{
									selectedReviewer ?
										<FormItem label="授权人" hasFeedback {...formItemLayout1} >
											{getFieldDecorator('reviewers', {
												initialValue: '',
												rules: [
													{
														required: true,
													},
												],
											})(<Select width='100%' allowClear
												showSearch filterOption={mySearchInfo}>
												{reviewersOption}
											</Select>)}
										</FormItem>
										:
										null
								}
							</Col>
							<Col xl={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} style={{ paddingLeft: 100 }}>
								{
									timeOut ? <span className={mystyle.outTime}> <Button style={{ marginLeft: 2, backgroundColor: nameChange == '已确认' ? '#008B00' : '#eb2f96', color: '#ffffff' }} onClick={onButton} > {nameChange}</Button>{timeValue}</span> :
									 <span className={mystyle.inTime}>{timeValue}</span>
								}
							</Col>
						</Row>
					</TabPane>
				</Tabs>
				<Tabs defaultActiveKey="2">
					<TabPane tab={<span><Icon type="user" />维护期告警定义</span>} key="2">
						<Row type="flex" justify="center">
							<Col lg={20} md={20} sm={20} xs={20}  >
								<Table
									scroll={{ x: 980 }} //滚动条
									bordered
									columns={columns}
									dataSource={choosedRows}
									rowKey={record => record.uuid}
									size="small"
									pagination={false}
								/>
							</Col>
						</Row>
					</TabPane>
				</Tabs>
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
