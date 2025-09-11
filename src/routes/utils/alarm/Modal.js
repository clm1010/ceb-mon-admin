import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tabs, Icon, Table, Row, Col, Button, Alert, Tag, Result, message, Spin } from 'antd'
import eventDisposalColumns from './eventDisposalColumns'
import levelChangeColumns from './levelChangeColumns'
import SMSnotificationColumns from './SMSnotificationColumns'
import { Link } from 'dva/router'
import fenhang from '../../../utils/fenhang'
import nullPage from '../../../../public/null.png'

const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const formItemLayout = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 16,
	},
}

const formItemLayout1 = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 16,
	},
}

const formItemLayout3 = {
	labelCol: {
		span: 3,
	},
	wrapperCol: {
		span: 21,
	},
}

const unknownStyle1 = {
	background: '#fff1f0',
	borderRadius: 4,
	border: 0,
	overflow: 'hidden',
	borderBottom: '1px solid #E9E9E9',
	padding: 12,
}

const unknownStyle = {
	background: '#fff1f0',
	borderRadius: 4,
	marginBottom: 12,
	border: 0,
	overflow: 'hidden',
	paddingLeft: 12,
	paddingRight: 12,
	padding: 12,
}
const customPanelStyle1 = {
	background: '#e6f7ff',
	borderRadius: 4,
	border: 0,
	overflow: 'hidden',
	borderBottom: '1px solid #E9E9E9',
	padding: 12,
}

const customPanelStyle = {
	background: '#e6f7ff',
	borderRadius: 4,
	marginBottom: 12,
	border: 0,
	overflow: 'hidden',
	paddingLeft: 12,
	paddingRight: 12,
	padding: 12,
}

const nonCoreStyle1 = {
	background: '#fbfbfb',
	borderRadius: 4,
	border: 0,
	overflow: 'hidden',
	borderBottom: '1px solid #E9E9E9',
	padding: 12,
}

const nonCoreStyle = {
	background: '#fbfbfb',
	borderRadius: 4,
	marginBottom: 12,
	border: 0,
	overflow: 'hidden',
	paddingLeft: 12,
	paddingRight: 12,
	padding: 12,
}
const mymap = new Map()
const datefiled = ['oz_Maintainentertime', 'oz_Firstoccurrence', 'oz_Recovertime', 'oz_Exitmtime', 'oz_Escltime', 'oz_Reinfirstoccurrence', 'oz_Enterepptime', 'oz_TicketTime', 'lastModified', 'firstOccurrence', 'lastOccurrence', 'deleteDat', 'n_AckTime', 'n_ClearTime', 'n_CloseTime', 'n_MaintainBTime', 'n_MaintainETime', 'n_SuppressFirStoccurrence']
datefiled.forEach((obj, index) => {
	mymap.set(obj, true)
})


const modal = ({
	dispatch,
	visible,
	form,
	loading,
	dataSource,
	severitySql,
	sortSql,
	journalSql,
	detailsSql,
	branchType,
	user,
	alarm,
	componentType,
	mainItem = {}
}) => {

	const [fieldKeyword, setFieldKeyword] = useState("")
	const [curDetailTabKey, setCurDetailTabKey] = useState("1")
	const currentItem = {}
	for (const key in dataSource) {
		if (Object.hasOwnProperty.call(dataSource, key)) {
			currentItem[key.toLocaleLowerCase()] = dataSource[key].toString()
		}
	}
	const {
		eventDisposalPagination,
		levelChangePagination,
		SMSnotificationPagination,
		levelChangeDataSource,
		eventDataSource,
		SMSnotificationDataSource,
		callOutList,
	} = alarm

	let n_customerseverity = ''
	if (currentItem.n_customerseverity === '1') {
		n_customerseverity = '一级故障'
	} else if (currentItem.n_customerseverity === '2') {
		n_customerseverity = '二级告警'
	} else if (currentItem.n_customerseverity === '3') {
		n_customerseverity = '三级预警'
	} else if (currentItem.n_customerseverity === '4') {
		n_customerseverity = '四级提示'
	} else if (currentItem.n_customerseverity === '100') {
		n_customerseverity = '五级信息'
	} else {
		n_customerseverity = '未知'
	}

	let severity = ''
	if (currentItem.severity === '0') {
		severity = '恢复'
	} else {
		severity = '故障'
	}

	let acknowledged = ''
	if (currentItem.acknowledged === '0') {
		acknowledged = '未接管'
	} else if (currentItem.acknowledged === '1') {
		acknowledged = '已接管'
	}

	let n_MaintainStatus = ''
	if (currentItem.n_maintainstatus === '0') {
		n_MaintainStatus = '未进维护期'
	} else if (currentItem.n_maintainstatus === '1') {
		n_MaintainStatus = '在维护期'
	} else if (currentItem.n_maintainstatus === '2') {
		n_MaintainStatus = '出维护期'
	}
	let timeN = 1
	if (componentType == 'oel') {
		timeN = 1000
	}
	let FirstOccurrence = ''
	if (currentItem.firstoccurrence) {
		FirstOccurrence = new Date(parseInt(currentItem.firstoccurrence) * timeN).format('yyyy-MM-dd hh:mm:ss')
	}

	let LastOccurrence = ''
	if (currentItem.lastoccurrence) {
		LastOccurrence = new Date(parseInt(currentItem.lastoccurrence) * timeN).format('yyyy-MM-dd hh:mm:ss')
	}

	let N_AckTime = ''
	if (currentItem.n_acktime && currentItem.n_acktime != "0") {
		N_AckTime = new Date(parseInt(currentItem.n_acktime) * timeN).format('yyyy-MM-dd hh:mm:ss')
	}

	let N_CloseTime = ''
	if (currentItem.n_closetime && currentItem.n_closetime != '0') {
		N_CloseTime = new Date(parseInt(currentItem.n_closetime) * timeN).format('yyyy-MM-dd hh:mm:ss')
	}

	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form

	const onCancel = () => {
		resetFields()
		setCurDetailTabKey('1')
		dispatch({
			type: `${componentType}/setState`,
			payload: {
				rowDoubleVisible: false,
				visibleDetail: false,
				dataSource: [],
			},
		})
	}
	//
	const onSee = (record) => {
		let uuid = typeInfo(record.notificationRuleUUIDs)
		dispatch({
			type: 'notification/findById',
			payload: {
				uuid: uuid,
			}
		})
		dispatch({
			type: 'notification/queryUser',
			payload: {
				q: '',
			}
		})
		dispatch({
			type: 'notification/queryApp',
			payload: {
				page: 0,
				pageSize: 9999,
			}
		})
	}
	const openMainRuleInstanceModal = (record, e) => {
		let mainRuleUUID = {}
		mainRuleUUID.uuid = record
		mainRuleUUID.branch = e
		dispatch({
			type: 'mainRuleInstanceInfo/findById',
			payload: {
				record: mainRuleUUID,
				type: 'see',
				fenhang: fenhang
			}
		})
	}
	const typeInfo = (value) => {
		return value.substring(0, 8) + '-' + value.substring(8, 12) + '-' + value.substring(12, 16) + '-' + value.substring(16, 20) + '-' + value.substring(20)
	}

	let SnotificationColumns = [...SMSnotificationColumns]
	if (branchType != 'XYK') {
		SnotificationColumns.push(
			{
				title: '操作',
				width: 50,
				fixed: 'right',
				render: (text, record) => {
					return <div>
						<Button style={{ float: 'left' }} size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onSee(record)}></Button>
					</div>
				}
			}
		)
	}
	//
	const modalOpts = {
		title: '告警信息',
		visible,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
		zIndex: 900,
		width: 900,
		footer: <Button onClick={onCancel}>关闭</Button>,
	}
	//事件处置记录页面转换
	const eventOnChange = (page) => {
		dispatch({
			type: 'alarm/queryJournal',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q: journalSql,
				sort: 'rjPK.chrOno,desc',
			},
		})
	}

	//级别变更处置记录
	const levelOnChange = (page) => {
		dispatch({
			type: 'alarm/querySeverity',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q: severitySql,
				sort: sortSql,
			},
		})
	}

	//短信通知记录
	const SMSOnChange = (page) => {
		dispatch({
			type: 'alarm/queryDetails',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q: `alarmId=cs='${currentItem.oz_alarmid}'`,
				sort: 'createdTime,desc',
			},
		})
	}
	const onTabClick = (key) => {
		setCurDetailTabKey(key)
		dispatch({
			type: 'alarm/setState',
			payload: {
				branchType: branchType,
			},
		})
		if (key === '3') {
			dispatch({
				type: 'alarm/queryJournal',
				payload: {
					q: `rjPK.serverName=='${currentItem.servername}';rjPK.serverSerial=='${currentItem.serverserial}'`,
					sort: 'rjPK.chrOno,desc',
				},
			})
		} else if (key === '4') {
			dispatch({
				type: 'alarm/querySeverity',
				payload: {
					q: `rsPK.serverName=='${currentItem.servername}';rsPK.serverSerial=='${currentItem.serverserial}'`,
					sort: 'rsPK.startDate,desc',
				},
			})
		} else if (key === '5') {
			dispatch({
				type: 'alarm/queryDetails',
				payload: {
					q: `alarmId=cs='${currentItem.oz_alarmid}'`,
					sort: 'createdTime,desc',
				},
			})
		} else if (key == '6') {
			// dispatch({
			// 	type: 'alarm/outCallResult',
			// 	payload: {
			// 		pageSize: 0,
			// 		pageNum: 0,
			// 		ozAlarmId: currentItem.oz_alarmid
			// 	}
			// })
			if (currentItem.oz_maintainenterseq) {
				openMainRuleInstanceModal(currentItem.oz_maintainenterseq, currentItem.n_mgtorgid)
			}
		}
	}

	const genData = (record) => {
		let data = { core: [], nonCore: [], unknown: [] }
		if (Object.keys(record).length > 0) {
			for (let prop in record) {
				let isfound = false
				for (let field of ViewColumns) {
					if (prop === field.key && (field.core === true || field.core === 'true')) {
						isfound = true
						if (prop.toUpperCase().includes(fieldKeyword.toUpperCase()) || fieldKeyword === '') {
							data.core.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {record[prop]}</Col>)
						}
					} else if (prop === field.key && field.core === false) {
						isfound = true
						if (prop.toUpperCase().includes(fieldKeyword.toUpperCase()) || fieldKeyword === '') {
							data.nonCore.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {record[prop]}</Col>)
						}
					}
				}
				if (isfound === false) {
					let resultdata = record[prop]
					if (mymap.get(prop)) {
						if (resultdata && resultdata > 0) {
							resultdata = new Date(resultdata).format('yyyy-MM-dd hh:mm:ss')
						}
					}
					if (prop == 'oz_Maintainenterseq' && branchType != 'XYK') {
						data.unknown.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : <a onClick={e => openMainRuleInstanceModal(resultdata, record['n_MgtOrgID'])}>{resultdata}</a></Col>)
					} else {
						data.unknown.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {resultdata}</Col>)
					}
				} else {
					isfound = true
				}
			}
		}
		return data
	}

	let children = genData(dataSource)
	let styletShow = "none"  // none

	if (currentItem.url && currentItem.url != '' && currentItem.url != "NA") {
		styletShow = "inline"
	}
	const onPenGrafana = (e) => {
		e.preventDefault()
		dispatch({
			type: 'historyview/getGrafana',
			payload: {
				appcode: currentItem.n_appcode,
				username: user.username,
			}
		})
	}

	const onOpenquxian = (e) => {
		window.open('http://prometheus:cdamt_2024_prometheus@ump-prom-query.eca.prod.cebbank:10904', 'thanos')
		setTimeout(() => {
			window.open(currentItem.url, 'thanos')
		}, 1000);
		e.preventDefault()
	}

	const getColName = (key) => {
		const colObj = ViewColumns.filter(col => col.key === key)
		return colObj[0].name
	}
	const onChange = (e) => {
		setFieldKeyword(e.target.value)																//弹出窗口点击确定按钮触发的函数
	}
	const transSerImpact = (value) => {
		let text
		switch (value) {
			case '0':
				text = "未知"
				break;
			case '1':
				text = "严重"
				break;
			case '2':
				text = "较大"
				break;
			case '3':
				text = "一般"
				break;
			case '4':
				text = "轻微"
				break;
			case '5':
				text = "潜在"
				break;
			case '6':
				text = "无影响"
				break;
			default:
				break;
		}
		return text
	}
	const OutCallColumns = [
		{
			title: '描述',
			dataIndex: 'userNum',
			key: '1',
			render: (text, record) => {
				let aa = ''
				switch (record.callResult) {
					case -3: aa = '外呼异常'
						break;
					case -2: aa = '无电话号码'
						break;
					case -1: aa = '呼叫等待中'
						break;
					case 0: aa = '客户未接'
						break;
					case 1: aa = '客户接听'
						break;
					case 2: aa = '话机占线'
						break;
					case 3: aa = '话机离线'
						break;
					case 4: aa = '客户未接'
						break;
					case 5: aa = '客户拒接'
						break;
					case 6: aa = '客户应答'
						break;
					case 7: aa = '客户速挂'
						break;
					case 8: aa = '客户挂机'
						break;
					case 9: aa = '排队超时'
						break;
					case 10: aa = '放弃排队'
						break;
					case 11: aa = '未选择队列'
						break;
					default: aa = ''
				}
				let res = `【${record.noticeType}】【${aa}】 ${record.userName} - ${record.callPhone}`
				return res
			}
		}, {
			title: '时间',
			dataIndex: 'createTime',
			key: '2',
		},
	]

	return (
		<Modal {...modalOpts}>
			<Tabs defaultActiveKey="1" type="card" activeKey={curDetailTabKey} onTabClick={onTabClick}>
				<TabPane tab={<span><Icon type="idcard" />告警详细信息</span>} key="1" >
					<Form layout="horizontal" style={{ marginLeft: 15, marginRight: 15 }}>
						<Row style={{ display: styletShow }}>
							<Alert message={<div style={{ paddingLeft: 10 }}>
								<Tag color='#2bd7f5' style={{ borderRadius: 6 }}><a onClick={onOpenquxian} size='small' href='#'>性能曲线</a></Tag>
								<Tag color='#2bd7f5' style={{ borderRadius: 6, marginLeft: 15 }}><a size='small' href='#' onClick={onPenGrafana}>grafana视图</a></Tag>
							</div>} description="" type="info" showIcon />
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('NodeAlias')} key="alarmIP" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('alarmIP', {
										initialValue: currentItem.nodealias,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label={getColName('Node')} key="Node" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('Node', {
										initialValue: currentItem.node,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('OZ_AlarmID')} key="alarmID" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('OZ_AlarmID', {
										initialValue: currentItem.oz_alarmid,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="告警对象" key="n_ObjectDesCr" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('n_ObjectDesCr', {
										initialValue: currentItem.n_objectdescr,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>

							<Col span={12}>
								<FormItem label="当前状态" key="alarmCurrentLevel" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('alarmCurrentLevel', {
										initialValue: severity,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="告警类型" key="eventType" hasFeedback {...formItemLayout}>
									{getFieldDecorator('eventType', {
										initialValue: `${currentItem.n_componenttype}/${currentItem.n_component}/${currentItem.n_subcomponent}`,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('N_AppName')} key="alarmObjec" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('alarmObjec', {
										initialValue: currentItem.n_appname,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label={getColName('N_CustomerSeverity')} key="alarmLevel" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('alarmLevel', {
										initialValue: n_customerseverity,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('Tally')} key="repetitions" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('repetitions', {
										initialValue: currentItem.tally,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="模式组子类" key="n_Cigroup" hasFeedback {...formItemLayout}>
									{getFieldDecorator('n_Cigroup', {
										initialValue: currentItem.n_cigroup,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label="首次发生时间" key="firstTime" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('firstTime', {
										initialValue: FirstOccurrence,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label={getColName('LastOccurrence')} key="lastTime" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('lastTime', {
										initialValue: LastOccurrence,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('N_AckTime')} key="takeoverTime" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('takeoverTime', {
										initialValue: N_AckTime,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label={getColName('N_MaintainStatus')} key="maintenance" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('maintenance', {
										initialValue: n_MaintainStatus,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('N_CloseTime')} key="closingTime" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('closingTime', {
										initialValue: N_CloseTime,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label={getColName('Acknowledged')} key="takeoverState" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('takeoverState', {
										initialValue: acknowledged,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label={getColName('N_TicketId')} key="jobNumber" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('jobNumber', {
										initialValue: currentItem.n_ticketid,
									})(<Input />)}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label={getColName('N_Note')} key="handlingOpinions" hasFeedback {...formItemLayout1}>
									{getFieldDecorator('handlingOpinions', {
										initialValue: currentItem.n_note,
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={12}>
								<FormItem label="业务影响" key="oz_Service_Impact" hasFeedback {...formItemLayout}>
									{getFieldDecorator('oz_Service_Impact', {
										initialValue: transSerImpact(currentItem.oz_service_impact),
									})(<Input />)}
								</FormItem>
							</Col>
						</Row>
						<Row gutter={24}>
							<Col span={24}>
								<FormItem label={getColName('N_SummaryCN')} key="alarmNews" colon={false} hasFeedback {...formItemLayout3}>
									{getFieldDecorator('alarmNews', {
										initialValue: currentItem.n_summarycn,
									})(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
								</FormItem>
							</Col>
						</Row>
					</Form>
				</TabPane>
				<TabPane tab={<span><Icon type="rawAlarm" />告警原始数据</span>} key="2">
					{
						componentType == 'oel' ?
							<>
								<Form layout="horizontal">
									<FormItem hasFeedback {...formItemLayout}>
										{getFieldDecorator('name', {
											initialValue: '',
										})(<Input placeholder="请输入字段名称过滤无关字段" onChange={onChange} />)}
									</FormItem>
								</Form>
								<div style={{ margin: '12px 0' }} />
								<div style={customPanelStyle1}>
									<b>关键字段</b>
								</div>
								<div style={customPanelStyle}>
									<Row>
										{children.core}
									</Row>
								</div>
								<br />
								<div style={nonCoreStyle1}>
									<b>非关键字段</b>
								</div>
								<div style={nonCoreStyle}>
									<Row>
										{children.nonCore}
									</Row>
								</div>
							</>
							:
							null
					}

					{
						children.unknown.length > 0 ?
							<div>
								<br />
								<div style={unknownStyle1}>
									<b>系统未配置字段</b>
								</div>

								<div style={unknownStyle}>
									<Row>
										{children.unknown}
									</Row>
								</div>
							</div>
							:
							null
					}
				</TabPane>
				<TabPane tab={<span><Icon type="solution" />告警处置记录</span>} key="3">
					<Table
						bordered
						simple
						columns={eventDisposalColumns}
						dataSource={eventDataSource}
						pagination={eventDisposalPagination}
						loading={loading.models['alarm']}
						size="small"
						onChange={eventOnChange}
					/>
				</TabPane>
				<TabPane tab={<span><Icon type="edit" />状态变更记录</span>} key="4">
					<Table
						bordered
						simple
						columns={levelChangeColumns}
						dataSource={levelChangeDataSource}
						pagination={levelChangePagination}
						loading={loading.models['alarm']}
						size="small"
						onChange={levelOnChange}
					/>
				</TabPane>
				<TabPane tab={<span><Icon type="message" />通知记录</span>} key="5">
					<Table
						bordered
						simple
						scroll={{ x: 1200 }}
						columns={SnotificationColumns}
						dataSource={SMSnotificationDataSource}
						pagination={SMSnotificationPagination}
						loading={loading.models['alarm']}
						size="small"
						onChange={SMSOnChange}
					/>
				</TabPane>
				<TabPane tab={<span><Icon type="file-protect" />维护期</span>} key='6'>
					{/* <Table
						bordered
						simple
						columns={OutCallColumns}
						dataSource={callOutList}
						loading={loading.models['alarm']}
						size="small"
					/> */}
					<div style={{ textAlign: 'center' }}>
						< Spin spinning={currentItem.oz_maintainenterseq ? loading.models['mainRuleInstanceInfo'] : false} >
							{
								currentItem.oz_maintainenterseq ?
									null
									:
									<Result icon={<img src={nullPage} />} title="暂无数据" />
							}
						</Spin>
					</div>
				</TabPane>
			</Tabs>
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
