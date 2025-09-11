import { Form, Row, Col, Input, Divider, Button, Tag, Popover } from 'antd'
import React from 'react'
const FormItem = Form.Item

const itemForm = ({ dispatch, form, selectedRows, selectedRowsAlarms, batchDelete, q }) => {

  const { getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll } = form

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  }

  const onClick = () => {
    dispatch({
      type: 'customMonitor/issue',
      payload:{
        branchIps: selectedRows,
        expectTime: 360,
        repeatInterval: 60
      }
    })
  }

  const queryMO = () => {
    validateFieldsAndScroll((errors, value) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
      }
      let sql = ((data.IP=== '' || data.IP===undefined) ? '' : ` and discoveryIP =='*` + data.IP + `*'` ) + ((data.hostname=== '' || data.hostname===undefined) ?  '' :  ` and hostname=='*` + data.hostname + `*'`)
      dispatch({
        type: 'customMonitor/query',
        payload:{
          q: q,
          sql: sql
        }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Divider orientation="left">监控对象查询</Divider>
      <Row>
        <Col span={8}>
          <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
            {getFieldDecorator('hostname', {
              initialValue: '',
              rules: [],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="IP" key="IP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('IP', {
              initialValue: '',
              rules: [],
            })(<Input />)}
          </FormItem>
        </Col>
        <Col span={8}>
          <div style={{ marginTop: '4px', textAlign: 'center' }}><Button onClick={queryMO}>查询</Button></div>
        </Col>
      </Row>
      <Divider orientation="left">选择IP</Divider>
      {
          selectedRows.length > 0 ?
            <Popover placement="topLeft" content={selectedRows.map((item, index) => {
                 return <Tag color="orange" style={{ marginTop: '2px' }}>{item}</Tag>
               })}>
              <Tag color="#2db7f5">监控对象IP</Tag>
            </Popover>
        : null
      }
      {
          selectedRowsAlarms.length > 0 ?
            <Popover placement="topLeft" content={selectedRowsAlarms.map((item, index) => {
              return <Tag color="purple" style={{ marginTop: '2px' }}>{item}</Tag>
            })}>
              <Tag color="#f50">告警IP</Tag>
            </Popover>
            : null
      }
      <span style={{ marginLeft: '480px' }}><Button onClick={onClick}>提交</Button></span>
    </Form>
  )
}

export default Form.create()(itemForm)
