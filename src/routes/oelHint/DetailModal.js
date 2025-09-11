import React from 'react'
import { Form, Input, Modal, Row, Col, Tabs, Timeline, Result, Divider, Typography, Table } from 'antd'
import nullPage from '../../../public/null.png'
import DescriPtions from '../../components/descriPtions/descriPtions'
import KnowledgeItem from './KnowledgeItem'

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
  knowledges
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
      type: 'oelhint/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        visibleDetail: false,
        fieldKeyword: '',
        curDetailTabKey: '0',
      },
    })
  }

  function onSelect(value) {																				//弹出窗口点击确定按钮触发的函数
    dispatch({
      type: 'oelhint/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        fieldKeyword: value,
      },
    })
  }

  const onChange = (e) => {																				//弹出窗口点击确定按钮触发的函数
    dispatch({
      type: 'oelhint/updateState',													//抛一个事件给监听这个type的监听器
      payload: {
        fieldKeyword: e.target.value,
      },
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'oelhint/updateState',													//抛一个事件给监听这个type的监听器
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
    if (key === '2') {
      dispatch({
        type: 'oelhint/getJournal',													//抛一个事件给监听这个type的监听器
        payload: {
          page: 0,
          pageSize: 200,
          serial: currentItem.Serial,
        },
      })
    } else {
      dispatch({
        type: 'oelhint/updateState',													//抛一个事件给监听这个type的监听器
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

  const genData = (record1) => {
    let record = JSON.parse(JSON.stringify(record1));
    delete record.children
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
  //console.log("oel Detail:")
  //console.dir(journelList)

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
  }
  const onTabClick = (e) => {
    if (e == '4'&& currentItem.oz_knowledge_flag == 'true' ) {
      dispatch({
        type: 'oelhint/knowledges',
        payload: {
          alarmId:currentItem.OZ_AlarmID
        }
      })
    }
  }

  return (
    <Modal {...modalOpts} width="1100px" bodyStyle={{ height: 600 }} >
      <Tabs type="line" size="small" onChange={changeTab} activeKey={curDetailTabKey} onTabClick={onTabClick}>
        <TabPane tab="告警详细信息" key="0">
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
                  })(<TextArea placeholder="" autoSize={{ minRows: 4, maxRows: 8 }} />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="告警原始数据" key="1">
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
        <TabPane tab="告警处置记录" key="2">
          <Timeline>
            {timeItems.length > 0 ? timeItems : <Timeline.Item>没有查到该告警处置记录。</Timeline.Item>}
          </Timeline>
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
        <TabPane tab='知识库' key='4'>
          {
            currentItem.oz_knowledge_flag === 'true' ?
              <div style={{ marginLeft: '40px', marginRight: '40px' }}>
                <KnowledgeItem {...knowledgeItemProps} />
              </div>
              :
              <Result icon={<img src={nullPage} />} title="暂无数据" />
          }
        </TabPane>
      </Tabs>
    </Modal>
  )
}


export default Form.create()(modal)
