import React from 'react'
import { Form, Input, Modal, Row, Col, Tabs, Timeline, Icon, Divider, Typography, Table } from 'antd'
import nullPage from '../../../public/null.png'
import DescriPtions from '../../components/descriPtions/descriPtions'
import KnowledgeItem from './KnowledgeItem'
import levelChangeColumns from '../historyviewInfo/levelChangeColumns'
import SMSnotificationColumns from '../historyviewInfo/SMSnotificationColumns'

const FormItem = Form.Item
const { TabPane } = Tabs
const { TextArea } = Input
const { Paragraph } = Typography
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
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

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
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
  visibleDetail,
  currentItem,
  currentFieldValue,
  fieldKeyword,
  journelList,
  curDetailTabKey,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  knowledges,
  DisposalPagination,
  DisposalDataSource,
  loading,
  callOutList
}) => {
  let flag = false

  // if(currentItem.OZ_IS_Knowledgebase && currentItem.OZ_IS_Knowledgebase === '是'){
  flag = true
  // }
  let n_CustomerSeverity = ''
  if (currentItem.N_CustomerSeverity === 1) {
    n_CustomerSeverity = '一级故障'
  } else if (currentItem.N_CustomerSeverity === 2) {
    n_CustomerSeverity = '二级告警'
  } else if (currentItem.N_CustomerSeverity === 3) {
    n_CustomerSeverity = '三级预警'
  } else if (currentItem.N_CustomerSeverity === 4) {
    n_CustomerSeverity = '四级提示'
  } else if (currentItem.N_CustomerSeverity === 100) {
    n_CustomerSeverity = '五级信息'
  }

  let severity = ''
  if (currentItem.Severity === 0) {
    severity = '恢复'
  } else {
    severity = '故障'
  }

  let acknowledged = ''
  if (currentItem.Acknowledged === 0) {
    acknowledged = '未接管'
  } else if (currentItem.Acknowledged === 1) {
    acknowledged = '已接管'
  }

  let n_MaintainStatus = ''
  if (currentItem.N_MaintainStatus === 0) {
    n_MaintainStatus = '未设置'
  } else if (currentItem.N_MaintainStatus === 1) {
    n_MaintainStatus = '在维护期'
  } else if (currentItem.N_MaintainStatus === 2) {
    n_MaintainStatus = '出维护期'
  }

  let FirstOccurrence = ''
  if (currentItem.FirstOccurrence) {
    FirstOccurrence = new Date(currentItem.FirstOccurrence * 1000).format('yyyy-MM-dd hh:mm:ss')
  }

  let LastOccurrence = ''
  if (currentItem.LastOccurrence) {
    LastOccurrence = new Date(currentItem.LastOccurrence * 1000).format('yyyy-MM-dd hh:mm:ss')
  }

  let N_AckTime = ''
  if (currentItem.N_AckTime) {
    N_AckTime = new Date(currentItem.N_AckTime * 1000).format('yyyy-MM-dd hh:mm:ss')
  }

  let N_CloseTime = ''
  if (currentItem.N_CloseTime) {
    N_CloseTime = new Date(currentItem.N_CloseTime * 1000).format('yyyy-MM-dd hh:mm:ss')
  }
  function onOk() {																				//弹出窗口点击确定按钮触发的函数
    resetFields()
    dispatch({
      type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        visibleDetail: false,
        fieldKeyword: '',
        curDetailTabKey: '0',
      },
    })
  }

  function onSelect(value) {																				//弹出窗口点击确定按钮触发的函数
    dispatch({
      type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        fieldKeyword: value,
      },
    })
  }

  const onChange = (e) => {																				//弹出窗口点击确定按钮触发的函数
    dispatch({
      type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        fieldKeyword: e.target.value,
      },
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        visibleDetail: false,
        fieldKeyword: '',
        curDetailTabKey: '0',
      },
    })
  }

  const getColName = (key) => {
    const colObj = ViewColumns.filter(col => col.key === key)
    return colObj[0].name
  }

  const changeTab = (key) => {
    if (key === '3') {
      dispatch({
        type: 'oel/getHistoryJournal',													//抛一个事件给监听这个type的监听器
        payload: {
          page: 0,
          pageSize: 200,
          q: `rjPK.serverName=='${currentItem.ServerName}';rjPK.serverSerial=='${currentItem.ServerSerial}'`,
          sort: 'rjPK.chrOno,desc',
        },
      })
      dispatch({
        type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
        payload: {
          curDetailTabKey: key,
        },
      })
    } else {
      dispatch({
        type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
        payload: {
          curDetailTabKey: key,
        },
      })
    }
  }

  const modalOpts = {
    title: '告警详情',
    visible: visibleDetail,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
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
          } else if (prop === field.key && (field.core === false || field.core === 'false')) {
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

  const getTimeline = (journals) => {
    let res = []
    for (let item of journals) {
      res.push(<Timeline.Item>{new Date(item.Chrono * 1000).format('yyyy-MM-dd hh:mm:ss')} - <b>{item.Type}</b> - {item.Text1}</Timeline.Item>)
    }
    return res
  }

  let children = genData(currentItem)

  let timeItems = getTimeline(journelList)
  console.log("oel Detail:")
  console.dir(journelList)

  const descriPtionsProps = {
    title: '',  //标题
    size: 'middle',	//描述大小   在bordere为true时起作用
    bordere: false,//边框可见性
    layout: 'horizontal',//布局方式  vertical   horizontal
    colon: true,//冒号可见性
    column: 2,//
    item: [
      { label: '知识ID', span: 1, color: 'purple', content: knowledges.knowledgeId ? knowledges.knowledgeId : '' },
      { label: '知识名称', span: 1, color: 'purple', content: knowledges.name ? knowledges.name : '' },
      { label: '事件单号', span: 1, color: 'purple', content: knowledges.ticketId ? knowledges.ticketId : '' },
      { label: '故障根源系统', span: 1, color: 'purple', content: knowledges.rootCauseSystem ? knowledges.rootCauseSystem : '' },
    ]//JSON对象数组
  }
  const knowledgeItemProps = {
    title: '告警故障推荐方案',  //标题
    size: 'middle',	//描述大小   在bordere为true时起作用
    bordered: false,//边框可见性
    item: knowledges
    // [
    //   {
    //     score:0.726,
    //     content: "[诊断步骤]: 1、登录BPC检查9点27分开始响应率低，联系应用管理员董嗣伯  2、现场检查系统服务器资源正常，容器平台内CNC模块出现健康检查异常，并被平台主动重启 [处置方案]: 管理员到ECC排查，容器平台内CNC模块出现健康检查异常，并被平台主动重启，9点32分报警恢复 [故障原因]: 容器平台内CNC模块使用的开源产品问题，引起服务工作异常导致系统响应率下降",
    //     uuid:0
    //   },
    //   {
    //     score:0.826,
    //     content: "[诊断步骤]: 应用一线工程师登录BPC检查核心系统交易正常，联系核心应用管理员胥骞，管理员怀疑是BPC问题，联系BPC管理员李向锋，怀疑是ODA监控阀值敏感，具体需要BPC后续分析，无业务影响。 [处置方案]: 应用一线工程师登录BPC检查核心系统交易正常，联系核心应用管理员胥骞，管理员怀疑是BPC问题，联系BPC管理员李向锋，怀疑是ODA监控阀值敏感，具体需要BPC后续分析，无业务影响。 [故障原因]: 从BPC看为镜像流量丢包引起，经查确认为夜间IFT行内文件传输系统传输文件流量突发，流量峰值超过网络流量采集网带宽导致瞬间丢包。",
    //     uuid:1
    //   },
    //   {
    //     score:0.926,
    //     content: "1、协调网络一线检查总前到银联网络连通性，有无丢包和抖动2、关注其他系统有无报警3、如果网络正常，继续关注，如果该报警持续，则联系二线进行诊断",
    //     uuid:2
    //   },
    //   {
    //     score:0.626,
    //     content: "[诊断步骤]: 应用一线工程师电话联系应用管理员胡文博，20点37分，经管理员对理财系统数据库进行kill session，重启查询子系统的六台服务器，总前对相关服务进行隔离再放开后，经验证故障已经恢复。已将相关情况通知业务部门，目前客服中心反馈未收到用户咨询和投诉。 [处置方案]: 应用一线工程师电话联系应用管理员胡文博，20点37分，经管理员对理财系统数据库进行kill session，重启查询子系统的六台服务器，总前对相关服务进行隔离再放开后，经验证故障已经恢复。已将相关情况通知业务部门，目前客服中心反馈未收到用户咨询和投诉。",
    //     uuid:3
    //   },
    //   {
    //     score:0.7326,
    //     content: "[处置方案]: 应用一线工程师电话联系应用管理员胡文博，20点37分，经管理员对理财系统数据库进行kill session，重启查询子系统的六台服务器，总前对相关服务进行隔离再放开后，经验证故障已经恢复。已将相关情况通知业务部门，目前客服中心反馈未收到用户咨询和投诉。",
    //     uuid:4
    //   },
    //   {
    //     score:0.426,
    //     content: "[诊断步骤]: 1、登录BPC检查9点27分开始响应率低，联系应用管理员董嗣伯  2、现场检查系统服务器资源正常，容器平台内CNC模块出现健康检查异常，并被平台主动重启 [故障原因]: 容器平台内CNC模块使用的开源产品问题，引起服务工作异常导致系统响应率下降",
    //     uuid:5
    //   },
    // ]
  }
  const onTabClick = (e) => {
    // if (e == '4' && currentItem.oz_knowledge_flag == 'true') {
    //   dispatch({
    //     type: 'oel/knowledges',
    //     payload: {
    //       alarmId: currentItem.OZ_AlarmID
    //     }
    //   })
    // } 
    if (key === '4') { //变更记录
			dispatch({
				type: 'oel/querySeverity',
				payload: {
					q: `rsPK.serverName=='${currentItem.serverName}';rsPK.serverSerial=='${currentItem.serverSerial}'`,
					sort: 'rsPK.startDate,desc',
				},
			})
		} else if (key === '5') { //通知记录
			dispatch({
				type: 'oel/queryDetails',
				payload: {
					q: `alarmId=cs='${record.OZ_AlarmID}'`,
					sort: 'createdTime,desc',
				},
			})
		}else if (e == '6') {
      dispatch({
        type: 'oel/outCallResult',
        payload: {
          pageSize: 0,
          pageNum: 0,
          ozAlarmId: currentItem.OZ_AlarmID
        }
      })
    }
  }
  //事件处置记录页面转换
  const eventOnChange = (page) => {
    dispatch({
      type: 'oel/getHistoryJournal',
      payload: {
        pageSize: page.pageSize,
        page: page.current - 1,
        q: `rjPK.serverName=='${currentItem.serverName}';rjPK.serverSerial=='${currentItem.serverSerial}'`,
        sort: 'rjPK.chrOno,desc',
      },
    })
  }
  const DisposalColumns = [
    {
      title: '处理时间',
      dataIndex: 'chrOno',
      key: '1',
      render: (text, record) => {
        let time = record.chrOno
        let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
        return createdTime
      },
    }, {
      title: '描述',
      dataIndex: 'text1',
      key: '2',
    },
  ]
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
  return (
    <Modal {...modalOpts} width="1100px" bodyStyle={{ height: 600 }}>
      <Tabs type="line" size="small" onChange={changeTab} activeKey={curDetailTabKey} onTabClick={onTabClick}>
        <TabPane tab={<span><Icon type="idcard" />告警详细信息</span>} key="1">
          <Form layout="horizontal" style={{ margin: 0 }} >
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={getColName('NodeAlias')} key="alarmIP" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('alarmIP', {
                    initialValue: currentItem.NodeAlias,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={getColName('Node')} key="Node" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('Node', {
                    initialValue: currentItem.Node,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={getColName('OZ_AlarmID')} key="alarmID" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('OZ_AlarmID', {
                    initialValue: currentItem.OZ_AlarmID,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={getColName('N_AppName')} key="alarmObjec" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('alarmObjec', {
                    initialValue: currentItem.N_AppName,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="告警类型" key="alarmEventType" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('alarmEventType', {
                    initialValue: `${currentItem.N_ComponentType}/${currentItem.N_Component}/${currentItem.N_SubComponent}`,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="当前状态" key="alarmCurrentLevel" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('alarmCurrentLevel', {
                    initialValue: severity,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={getColName('N_CustomerSeverity')} key="alarmLevel" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('alarmLevel', {
                    initialValue: n_CustomerSeverity,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={getColName('FirstOccurrence')} key="firstTime" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('firstTime', {
                    initialValue: FirstOccurrence,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={getColName('Tally')} key="repetitions" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('repetitions', {
                    initialValue: currentItem.Tally,
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
                <FormItem label={getColName('N_MaintainStatus')} key="maintenance" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('maintenance', {
                    initialValue: n_MaintainStatus,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={getColName('N_AckTime')} key="takeoverTime" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('takeoverTime', {
                    initialValue: N_AckTime,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={getColName('Acknowledged')} key="takeoverState" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('takeoverState', {
                    initialValue: acknowledged,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={getColName('N_CloseTime')} key="closingTime" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('closingTime', {
                    initialValue: N_CloseTime,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label={getColName('N_Note')} key="handlingOpinions" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('handlingOpinions', {
                    initialValue: currentItem.N_Note,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={getColName('N_TicketId')} key="jobNumber" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('jobNumber', {
                    initialValue: currentItem.N_TicketId,
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem label={getColName('N_SummaryCN')} key="alarmNews" colon={false} hasFeedback {...formItemLayout3}>
                  {getFieldDecorator('alarmNews', {
                    initialValue: currentItem.N_SummaryCN,
                  })(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab={<span><Icon type="rawAlarm" />告警原始数据</span>} key="2">
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
          {children.unknown.length > 0 ?
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
          {/* <Timeline>
            {timeItems.length > 0 ? timeItems : <Timeline.Item>没有查到该告警处置记录。</Timeline.Item>}
          </Timeline> */}
          <Table
            bordered
            simple
            columns={DisposalColumns}
            dataSource={DisposalDataSource}
            pagination={DisposalPagination}
            loading={loading.effects['oel/getHistoryJournal']}
            size="small"
            onChange={eventOnChange}
          />
        </TabPane>
        {/* <TabPane tab='知识库' key='3'>
          {
            flag ?
              <div>
                <Divider orientation="left">基本信息</Divider>
                <div style={{ marginLeft: '100px' }}>
                  <DescriPtions {...descriPtionsProps} />
                </div>
                <Divider orientation="left">事件处置过程</Divider>
                <Typography>
                  <Paragraph ellipsis={{ rows: 6, expandable: true }}>
                    {
                      (knowledges.disposalProcess && knowledges.disposalProcess !== undefined) ?
                        knowledges.disposalProcess.split('\\n').map((item, index) => {
                          return <p style={{ marginLeft: '100px' }}>{item}</p>
                        })
                        :
                        null
                    }
                  </Paragraph>
                </Typography>
                <Divider orientation="left">事件影响</Divider>
                <Typography>
                  <Paragraph ellipsis={{ rows: 6, expandable: true }}>
                    <p style={{ marginLeft: '100px' }}>
                      {knowledges.impact}
                    </p>
                  </Paragraph>
                </Typography>
                <Divider orientation="left">后续改进建议</Divider>
                <Typography>
                  <Paragraph ellipsis={{ rows: 6, expandable: true }}>
                    {
                      (knowledges.suggest && knowledges.suggest !== undefined) ?
                        knowledges.suggest.split('\\n').map((item, index) => {
                          return <p style={{ marginLeft: '100px' }}>{item}</p>
                        })
                        :
                        null
                    }
                  </Paragraph>
                </Typography>
              </div>
              :
              <Result icon={<img src={nullPage} />} title="暂无数据" />
          }
        </TabPane> */}
        {/* <TabPane tab='知识库' key='4'>
          {
            currentItem.oz_knowledge_flag === 'true' ?
              <div style={{ marginLeft: '40px', marginRight: '40px' }}>
                <KnowledgeItem {...knowledgeItemProps} />
              </div>
              :
              <Result icon={<img src={nullPage} />} title="暂无数据" />
          }
        </TabPane> */}
        <TabPane tab={<span><Icon type="edit" />状态变更记录</span>} key="4">
          <Table
            bordered
            simple
            columns={levelChangeColumns}
            dataSource={levelChangeDataSource}
            pagination={levelChangePagination}
            loading={loading}
            size="small"
            // onChange={levelOnChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="message" />通知记录</span>} key="5">
          <Table
            bordered
            simple
            scroll={{ x: 1100 }}
            columns={SnotificationColumns}
            dataSource={SMSnotificationDataSource}
            pagination={SMSnotificationPagination}
            loading={loading}
            size="small"
            // onChange={SMSOnChange}
          />
        </TabPane>
        <TabPane tab={<span><Icon type="customer-service" />告警外呼</span>} key='6'>
          <Table
            bordered
            simple
            columns={OutCallColumns}
            dataSource={callOutList}
            loading={loading.effects['oel/outCallResult']}
            size="small"
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}


export default Form.create()(modal)
