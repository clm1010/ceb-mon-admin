import React from 'react'
import { Form, Drawer, Steps, Icon, Col, Row, Select, Divider, List, Popover, Button, Tooltip } from 'antd'
import IssuTable from './issuTable'
import FormItems from './FormItem'
import ProgressCom from './progress'
import StepCom from './step'
const { Step } = Steps
const Option = Select.Option

const drawer = ({  dispatch, visible, form, popoverVisible, stepButtonState, stepItems, toolProgress, instProgress, mos, issueMotoInsts, uuid, formItem }) => {

  const {getFieldDecorator, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue, getFieldValue } = form

  const issuTableProps = {
    dispatch,
    pagination:false,
    loadding: false,
    mos,
    issueMotoInsts
  }

  const onClose = () => {
    dispatch({
      type: 'jobs/setState',
      payload:{
        drawerVisible: false,
        popoverVisible: false,
        progressButtonState: false,
        stepButtonState: false
      }
    })
  }

  const data = [
    '1、上线网络设备 1.1.1.1','2、发现接口 35 个,','3、定时下发监控实例120个，包括规则5条，指标10个'
  ]

  const formItemsProps = {
    item: formItem,
    form,
    drawerVisible: visible,
    dispatch,
    showIcon: true
  }

  const onOk = () => {
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue()
      }
    })
  }

  const content = <div style={{ width: 800 }}>
                      <FormItems {...formItemsProps}/>
                      <Button style={{ folat: 'left' }} size="default" type="primary"  disabled onClick={() => onOk()}>修改</Button>
                  </div>

  const onClick  = () => {
     dispatch({
       type: 'jobs/setState',
       payload:{
         popoverVisible: !popoverVisible
       }
     })
  }

  const toolProgressProps = {//工具进度条
    dispatch,
    strokeWidth: '10px',
    percent: toolProgress === undefined ? 0 : (toolProgress.completedTool === undefined ? 0 : toolProgress.completedTool)/(toolProgress.toolSize === undefined ? 0 : toolProgress.toolSize)*100,
    status: (toolProgress.completedTool === undefined ? 0 : toolProgress.completedTool)/(toolProgress.toolSize === undefined ? 0 : toolProgress.toolSize)*100 === 100 ? '' : 'active',
    all: toolProgress.toolSize === undefined ? 0 : toolProgress.toolSize,
    doneNum: toolProgress.completedTool === undefined ? 0 : toolProgress.completedTool,
    percentState: false
  }

  const monitorProgressProps = {//监控实例进度条
    dispatch,
    strokeWidth: '10px',
    percent: instProgress===undefined ? 0 : ((instProgress.completedInst === undefined ? 0 : instProgress.completedInst )/(instProgress.instSize === undefined ? 0 : instProgress.instSize))*100,
    status: instProgress===undefined ? '' : ((instProgress.completedInst === undefined ? 0 : instProgress.completedInst )/(instProgress.instSize === undefined ? 0 : instProgress.instSize))*100 === 100 ?  '' : 'active',
    all: instProgress===undefined ? 0 : instProgress.instSize,
    doneNum: instProgress===undefined ? 0 : instProgress.completedInst,
    percentState: false
  }

  const itemProgressProps = {//Item进度条
    dispatch,
    strokeWidth: '10px',
    percent: 60,
    status: 'active',
    all: 10,
    doneNum: 6,
    percentState: false
  }

  const triggerProgressProps = {//trigger进度条
    dispatch,
    strokeWidth: '10px',
    percent: 60,
    status: 'active',
    all: 10,
    doneNum: 6,
    percentState: false
  }

  const stepComProps  = {
    dispatch,
    buttonState: stepButtonState,
    items: stepItems,
    path: 'jobs/jobDetail',
    payload: { uuid: uuid }
  }

  return (
    <Drawer
      title=''
      placement="right"
      maskClosable={false}
      closable={true}
      mask={false}
      onClose={onClose}
      width={650}
      visible={visible}
    >
      <Popover placement="leftTop" title='详细信息' content={content} trigger="click" visible={popoverVisible}>
        <span style={{ cursor: 'pointer' }} onClick={onClick}>
          <Tooltip title={ popoverVisible ? "点击关闭详情" : "点击查看详情" }><Icon type="profile" theme="twoTone" style={{ fontSize: 28 }}/></Tooltip>
        </span>
      </Popover>
      <Divider orientation="left" style={{ paddingTop: '20px' }}><b>下发详细信息</b></Divider>
      <StepCom {...stepComProps}/>
      <Row gutter={[8,8]} style={{ paddingTop: '20px' }}>
        <Col span={4}>
          <span style={{ paddingLeft: '40px' }}>工&nbsp;&nbsp;&nbsp;&nbsp;具:</span>
        </Col>
        <Col span={8}>
          {/*<Progress format={() => 'Done'} percent={70} status="active" />*/}
          <ProgressCom {...toolProgressProps}/>
        </Col>
        <Col span={4}>
          <span style={{ paddingLeft: '40px' }}>类&nbsp;&nbsp;&nbsp;&nbsp;型:</span>
        </Col>
        <Col span={8}>
          <Select style={{ width: '200px' }} defaultValue='ISSUE_JOB'>
            <Option key={1} value='ISSUE_JOB'>下发任务</Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={[8,8]} style={{ paddingTop: '20px' }}>
        <Col span={4}>
          <span style={{ paddingLeft: '30px' }}>监控实例:</span>
        </Col>
        <Col span={20}>
          <ProgressCom {...monitorProgressProps}/>
        </Col>
      </Row>
{/*      <Row gutter={[8,8]} style={{ paddingTop: '20px' }}>
        <Col span={4}>
          <span style={{ paddingLeft: '40px' }}>Item:</span>
        </Col>
        <Col span={8}>
          <ProgressCom {...itemProgressProps}/>
        </Col>
        <Col span={4}>
          <span style={{ paddingLeft: '40px' }}>Trigger:</span>
        </Col>
        <Col span={8}>
          <ProgressCom {...triggerProgressProps}/>
        </Col>
      </Row>*/}
      <Divider orientation="left" style={{ paddingTop: '20px' }}><b>下发详情</b></Divider>
      <IssuTable {...issuTableProps}/>
      {/*<Divider orientation="left"><b>操作详情</b></Divider>
      <List
        size="small"
        bordered
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />*/}
    </Drawer>
  )
}

export default Form.create()(drawer)
