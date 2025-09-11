import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tabs, Icon, Table, Row, Col, Button } from 'antd'
import eventDisposalColumns from './eventDisposalColumns'
import levelChangeColumns from './levelChangeColumns'
import SMSnotificationColumns from './SMSnotificationColumns'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const { TextArea } = Input
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns

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

const formItemLayout2 = {
	labelCol: {
  	span: 9,
	},
	wrapperCol: {
  	span: 14,
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

const formItemLayout4 = {
	labelCol: {
  	span: 3,
	},
	wrapperCol: {
  	span: 17,
	},
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

const customPanelStyle1 = {
	background: '#e6f7ff',
	borderRadius: 4,
	border: 0,
	overflow: 'hidden',
	borderBottom: '1px solid #E9E9E9',
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

const modal = ({
  dispatch,
  visible,
  form,
  loading,
  eventDisposalPagination,
  levelChangePagination,
  SMSnotificationPagination,
  levelChangeDataSource,
  eventDataSource,
  SMSnotificationDataSource,
  dataSource,
  severitySql,
  sortSql,
  journalSql,
  detailsSql,
}) => {
	const onChange = (e) => {															//弹出窗口点击确定按钮触发的函数
		dispatch({
			type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				fieldKeyword: e.target.value,
			},
		})
	}

  	let n_CustomerSeverity = ''
  	if (dataSource.n_CustomerSeverity === 1) {
  		n_CustomerSeverity = '一级故障'
  	} else if (dataSource.n_CustomerSeverity === 2) {
  		n_CustomerSeverity = '二级告警'
  	} else if (dataSource.n_CustomerSeverity === 3) {
  		n_CustomerSeverity = '三级预警'
  	} else if (dataSource.n_CustomerSeverity === 4) {
  		n_CustomerSeverity = '四级提示'
  	} else if (dataSource.n_CustomerSeverity === 100) {
  		n_CustomerSeverity = '五级信息'
  	} else {
		n_CustomerSeverity = '未知'
	}

  	let severity = ''
  	if (dataSource.severity === '0') {
  		severity = '恢复'
  	} else {
  		severity = '故障'
  	}

  	let acknowledged = ''
  	if (dataSource.acknowledged === '0') {
  		acknowledged = '未接管'
  	} else if (dataSource.acknowledged === '1') {
  		acknowledged = '已接管'
  	}

  	let n_MaintainStatus = ''
  	if (dataSource.n_MaintainStatus === '0') {
  		n_MaintainStatus = '未进维护期'
  	} else if (dataSource.n_MaintainStatus === '1') {
  		n_MaintainStatus = '在维护期'
  	} else if (dataSource.n_MaintainStatus === '2') {
  		n_MaintainStatus = '维护期'
  	}

  	let FirstOccurrence = ''
  	if (dataSource.firstOccurrence) {
  		FirstOccurrence = new Date(dataSource.firstOccurrence).format('yyyy-MM-dd hh:mm:ss')
  	}

  	let LastOccurrence = ''
  	if (dataSource.lastOccurrence) {
  		LastOccurrence = new Date(dataSource.lastOccurrence).format('yyyy-MM-dd hh:mm:ss')
  	}

  	let N_AckTime = ''
  	if (dataSource.n_AckTime) {
  		N_AckTime = new Date(dataSource.n_AckTime).format('yyyy-MM-dd hh:mm:ss')
  	}

  	let N_CloseTime = ''
  	if (dataSource.n_AckTime) {
  		N_CloseTime = new Date(dataSource.n_CloseTime).format('yyyy-MM-dd hh:mm:ss')
  	}

  	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form
	const onCancel = () => {
		dispatch({
			type: 'u1Historyview/setState',
			payload: {
				rowDoubleVisible: false,
				selectInfo: {},
				defaultKey: '1',
				levelChangeDataSource: [],
			  	eventDataSource: [],
			  	SMSnotificationDataSource: [],
			  	dataSource: [],

			},
		})
	}

  const modalOpts = {
    title: '历史告警',
    visible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    footer: <Button onClick={onCancel}>关闭</Button>,
  }
  //事件处置记录页面转换
  const eventOnChange = (page) => {
  	dispatch({
			type: 'u1Historyview/queryJournal',
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
			type: 'u1Historyview/querySeverity',
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
			type: 'u1Historyview/queryDetails',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q: detailsSql,
				sort: 'createdTime,desc',
			},
	})
  }
  const onTabClick = (key) => {
  	if (key === '2') {
	  	dispatch({
			type: 'u1Historyview/queryJournal',
			payload: {
				q: journalSql,
				sort: 'rjPK.chrOno,desc',
			},
		})
  	} else if (key === '3') {
  		dispatch({
			type: 'u1Historyview/querySeverity',
			payload: {
				q: severitySql,
				sort: 'rsPK.startDate,desc',
		},
	})
  	} else if (key === '4') {
  		dispatch({
			type: 'u1Historyview/queryDetails',
			payload: {
				q: detailsSql,
				sort: 'createdTime,desc',
			},
		})
  	}
  }

  const genData = (record) => {
	let data = { core: [], nonCore: [], unknown: [] }
	if (Object.keys(record).length > 0) {
		for (let prop in record) {
			let isfound = false
			for (let field of ViewColumns) {
				if (prop === field.key && field.core === true) {
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
				data.unknown.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {record[prop]}</Col>)
			} else {
				isfound = true
			}
		}
	}
	return data
}

let children = genData(dataSource)

  return (
    <Modal {...modalOpts} width="900">
      <Tabs defaultActiveKey="1" type="card" onTabClick={onTabClick}>
        <TabPane tab={<span><Icon type="idcard" />告警详细信息</span>} key="1" >
          <Form layout="horizontal" style={{ margin: 15 }}>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="告警IP" key="IP" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('IP', {
									initialValue: dataSource.nodeAlias,
								})(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="告警ID" key="ID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('ID', {
									initialValue: dataSource.serial,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="告警对象" key="n_ObjectDesCr" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('n_ObjectDesCr', {
									initialValue: dataSource.n_ObjectDesCr,
								})(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="当前状态" key="currentLevel" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('currentLevel', {
									initialValue: severity,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="告警类型" key="eventType" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('eventType', {
									initialValue: `${dataSource.n_ComponentType}/${dataSource.n_Component}/${dataSource.n_SubComponent}`,
								})(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="告警级别" key="alarmLevel" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('alarmLevel', {
									initialValue: n_CustomerSeverity,
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
                <FormItem label="重复次数" key="repetitions" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('repetitions', {
									initialValue: dataSource.tally,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="最后发生时间" key="lastTime" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('lastTime', {
									initialValue: LastOccurrence,
								})(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="是否在维护期" key="maintenance" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('maintenance', {
									initialValue: n_MaintainStatus,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="告警接管时间" key="takeoverTime" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('takeoverTime', {
									initialValue: N_AckTime,
								})(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="告警接管状态" key="takeoverState" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('takeoverState', {
									initialValue: acknowledged,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>

              <Col span={12}>
                <FormItem label="告警关闭时间" key="closingTime" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('closingTime', {
									initialValue: N_CloseTime,
								})(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="处理意见" key="handlingOpinions" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('handlingOpinions', {
									initialValue: dataSource.n_Note,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="工单号" key="jobNumber" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('jobNumber', {
									initialValue: dataSource.n_TicketID,
								})(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem label="告警消息" key="alarmNews" colon={false} hasFeedback {...formItemLayout3}>
                  {getFieldDecorator('alarmNews', {
									initialValue: dataSource.n_SumMaryCn,
								})(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab={<span><Icon type="rawAlarm" />告警原始数据</span>} key="5">
          {/*}
					<Form layout="horizontal">
						<FormItem hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: '',
						})(<Input placeholder="请输入字段名称过滤无关字段" onChange={onChange}/>)}
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
				  <br/>
				  <div style={nonCoreStyle1}>
					  <b>非关键字段</b>
				  </div>
				  <div style={nonCoreStyle}>
					  <Row>
					  	{children.nonCore}
					  </Row>
				  </div>
				  { children.unknown.length > 0?
				  <div>
				  <br/>
				  <div style={unknownStyle1}>
					  <b>系统未配置字段</b>
				  </div>
				  */}
          <div style={unknownStyle}>
            <Row>
              {children.unknown}
            </Row>
          </div>
          {/*
				  </div>
				  :
				  null
				  */}
        </TabPane>
        <TabPane tab={<span><Icon type="solution" />告警处置记录</span>} key="2">
          <Table
            bordered
            simple
            columns={eventDisposalColumns}
            dataSource={eventDataSource}
            pagination={eventDisposalPagination}
            loading={loading}
            size="small"
            onChange={eventOnChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="edit" />状态变更记录</span>} key="3">
          <Table
            bordered
            simple
            columns={levelChangeColumns}
            dataSource={levelChangeDataSource}
            pagination={levelChangePagination}
            loading={loading}
            size="small"
            onChange={levelOnChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="message" />短信通知记录</span>} key="4">
          <Table
            bordered
            simple
            scroll={{ x: 1500 }}
            columns={SMSnotificationColumns}
            dataSource={SMSnotificationDataSource}
            pagination={SMSnotificationPagination}
            loading={loading}
            size="small"
            onChange={SMSOnChange}
          />
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
