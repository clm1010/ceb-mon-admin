import React from 'react'
import { Row, Col, Button, message, Modal, Icon, Select } from 'antd'
import { config } from '../../utils'
import queryString from "query-string";
const { downloadReporter, xykdownloadReporter} = config.api
const confirm = Modal.confirm
const ButtonGroup = Button.Group
const { Option } = Select

function buttonZone({ dispatch, loadReporter, location, batchMaintain, expand, q, branchType, types,switchView }) {
  const query = queryString.parse(location.search)
  let addresIP
  branchType == 'XYK' ? addresIP = xykdownloadReporter : addresIP = downloadReporter
  const onClick = () => {
    confirm({
      title: '您确定要导出历史告警吗?',
      onOk() {
        message.info('正在为您生成历史告警数据,请稍后...', 3)
        //window.open(encodeURI(`${addresIP}?q=${q}&types=${types}`), '_parent')
        dispatch({
          type: 'historyview/onDown',
          payload: {
            url: encodeURI(`${addresIP}?q=${q}&types=${types}`),
          },
        })
      },
    })
  }

  const onMaintain = () => {
    confirm({
      title: '您确定要批量设置这些告警的维护期吗?',
      onOk() {
        dispatch({
          type: 'historyview/updateMt',
          payload: {
            maintainStatus: '1',
          },
        })
      },
    })
  }

  const toggle = () => {
    dispatch({
      type: 'historyview/setState',
      payload: {
        expand: !expand,
      },
    })
  }

  const onchange = (value)=>{
    dispatch({
      type:'historyview/setState',
      payload:{
        types:value
      }
    })

  }
  const onTraceBack = ()=>{
    dispatch({
      type:"historyview/setState",
      payload:{
        switchView:!switchView
      }
    })
    dispatch({
      type:"traceBack/queryTotal",
      payload:{
        q
      }
    })
    dispatch({
      type:"traceBack/queryGrain",
      payload:{
        q,
        CardType: "alarmTotal"
      }
    })
  }
  return (
    <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
      <Col lg={24} md={24} sm={24} xs={24}>
        <a onClick={toggle}>
          <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
        </a>
        <ButtonGroup>
          <Select defaultValue="normal" style={{ width: 86, marginLeft:8,marginTop:2 }} onChange={onchange} id='mesg'>
            <Option value="normal">默认</Option>
            <Option value="app">应用系统</Option>
            <Option value="ip">IP域</Option>
            <Option value="custom">自定义导出</Option>
          </Select>
          <Button size="default" type="ghost" onClick={onClick}>导出</Button>
        </ButtonGroup>
        <Button size="default" type="primary" style={{ marginLeft: 8 }} onClick={onMaintain} disabled={!batchMaintain}>
          设置维护期
        </Button>
        <Button style={{  marginLeft:8}} type="primary" shape="round" icon="sync" onClick={onTraceBack} >
          {switchView ? '告警追溯':'表格显示'}
        </Button>
      </Col>
    </Row>
  )
}

export default buttonZone
