import { Form, Select, Row, Col, Input, Divider, Icon, Tooltip } from 'antd'
import React from 'react'
import ProgressCom from './progress'
const FormItem = Form.Item
const Option = Select.Option

const FormItems = ({ item, form, drawerVisible, dispatch, showIcon, progressButtonState, uuid }) => {

  const progressComProps = {
    dispatch,
    strokeWidth: '15px',
    percent: item.progress,//,Math.floor(Math.random()*(1- 100) + 100)
    status: 'active',
    all: 0,
    doneNum: 0,
    percentState: true,
    buttonState: progressButtonState,
    payload: { uuid: uuid },
    path: 'jobs/findById'
  }

  const { getFieldDecorator } = form

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  }

  const formItemLayout24 = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  }

  const formItemLayoutSelect = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  }

  const onClick = () => {
    dispatch({
      type: 'jobs/jobDetail',
      payload:{
        uuid: uuid
      }
    })
    dispatch({
      type: 'jobs/setState',
      payload:{
        drawerVisible: !drawerVisible,
        modalVisible: false,
        progressButtonState: !progressButtonState,
        stepButtonState: true
      }
    })
  }

  return (
    <Form layout="horizontal">
      <Divider orientation="left"><b>基本信息</b></Divider>
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label="任务名" key="name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="任务ID" key="ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('uuid', {
              initialValue: item.uuid,
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[8,8]}>
        <Col span={24}>
          <FormItem label="描述" key="describe" hasFeedback {...formItemLayout24}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label="任务类型" key="tpe" hasFeedback {...formItemLayoutSelect}>
            {getFieldDecorator('tpe', {
              initialValue: item.tpe,
              rules: [],
            })(<Select style={{ width: '95%' }} disabled>
              <Option key='ISSUE_JOB' value='ISSUE_JOB'>下发</Option>
              <Option key='NETWORK_DISCOVERY_JOB' value='NETWORK_DISCOVERY_JOB'>自服务</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="提交者" key="userId" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userId', {
              initialValue: item.userId,
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label="是否定时任务" key="timed" hasFeedback {...formItemLayoutSelect}>
            {getFieldDecorator('timed', {
              initialValue: item.timed,
              rules: [],
            })(<Select style={{ width: '95%' }} disabled>
              <Option key={1} value={true}>定时</Option>
              <Option key={2} value={false}>非定时</Option>
            </Select>)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='定时配置' key="cron" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cron', {
              initialValue: item.cron,
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label="工单号" key="ticket" hasFeedback {...formItemLayoutSelect}>
            {getFieldDecorator('ticket', {
              initialValue: item.ticket,
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Divider orientation="left"><b>任务参数</b></Divider>
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label='参数' key="info" hasFeedback {...formItemLayout}>
            {getFieldDecorator('info', {
              initialValue: '',
              rules: [],
            })(<Input disabled/>)}
          </FormItem>
        </Col>
      </Row>
      <Divider orientation="left"><b>进度</b></Divider>
      {
        showIcon ? null :
          <Row gutter={[8, 8]}>
            <Col span={4}>
              <span style={{ paddingLeft: '40px' }}>进&nbsp;&nbsp;&nbsp;&nbsp;度:</span>
            </Col>
            <Col span={18}>
              {/*<Progress strokeWidth='15px' percent={70} status="active" />*/}
              <ProgressCom {...progressComProps}/>
            </Col>
            <Col span={2}>
          <span style={{ cursor: 'pointer' }} onClick={onClick}>
            <Tooltip title="点击查看详情"><Icon type="dashboard" theme="twoTone" style={{ fontSize: 28 }}/></Tooltip>
          </span>
            </Col>
          </Row>
      }
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label='提交时间' key="submitTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('submitTime', {
              initialValue: new Date(item.submitTime).format('yyyy-MM-dd hh:mm:ss'),
              rules: [],
            })(<Input disabled />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='预期时间' key="expectTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('expectTime', {
              initialValue: new Date(item.expectTime).format('yyyy-MM-dd hh:mm:ss'),
              rules: [],
            })(<Input disabled />)}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={[8,8]}>
        <Col span={12}>
          <FormItem label='完成时间' key="finishTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('finishTime', {
              initialValue: new Date(item.finishTime).format('yyyy-MM-dd hh:mm:ss'),
              rules: [],
            })(<Input disabled />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='运行时长' key="runningTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('runningTime', {
              initialValue: new Date(item.finishTime).format('yyyy-MM-dd hh:mm:ss'),
              rules: [],
            })(<Input disabled />)}
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

export default FormItems

