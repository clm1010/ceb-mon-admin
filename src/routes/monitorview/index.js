/**
* @module 告警中心/服务台实时告警查询
* @description 
* URL: <u>/monitorview</u>
*
* 此页面用于查询 暂停 更新服务台实时告警
* 通过点击页面生成的告警柱状图,查询对应的所有告警
* 
* ## 刷新告警操作 
* ##### 更新告警
* 更新告警，点击立即查询当前所有告警。 组件Countdown 的 queryInfo方法
*
* ##### 暂停更新
* 暂停更新告警，点击停止更新所有告警。组件Countdown的 stopo方法
*
* ##### 开始更新告警
* 点击后,按周期时间自动更新所有告警  组件Countdown的 start方法
* 
* ##### 点击告警
* 点击告警图会弹出当前类的所有告警列表,其实弹出的是: 实时告警列表 组件 oel
* 
*/

import React from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Button, Table, Spin } from 'antd'
import { Link, routerRedux } from 'dva/router'
import myStyle from './charts.css'
import BarChart from './BarChart'
import PieChart from './PieChart'
import MapChart from './MapChart'
import HeatChart from './HeatChart'
import LineChart from './LineChart'
import Modal from './Modal'
import {ozr} from '../../utils/clientSetting'
import Countdown from './Countdown'

const customPanelStyle = {
  background: '#fff',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden',
  paddingLeft: 12,
  paddingRight: 12,
}

const customPanelStyle1 = {
  background: '#fff',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  borderBottom: '1px solid #E9E9E9',
  paddingLeft: 12,
  paddingRight: 12,
  paddingBottom: 12,
  paddingTop: 12,
  fontWeight: 'bold',
  fontSize: 14,
}

const monitorview = ({
  dispatch, monitorview, loading, location, oel,
}) => {
  const {
    centerOlet, branchOlet, systemOlet, modalVisible, modalName, initValue, countState, centerState, branchState, systemState, sourceState,
  } = monitorview

  if (sourceState) {
    dispatch({
      type: 'monitorview/updateState',
      payload: {
        centerState: false,
        branchState: false,
        systemState: false,
        sourceState: false,
      },
    })
  }

  const genHtml = (chartList) => {
    let chartHtml = []
    for (let chart of chartList) {
      let borderColor = '#95de64'
      let chartProps = {
        dispatch,
        loading,
        data: chart.data,
        title: chart.title,
        modalName: chart.title,
        oelFilter: chart.oelFilter,
        oelDatasource: chart.oelDatasource,
      }

      if (chart.data.length > 0) {
        for (let obj of chart.data) {
          if (obj.level === '5' && obj.number > 0) {
            borderColor = '#ed433c'
            break
          } else if (obj.level === '4' && obj.number > 0) {
            borderColor = '#f56a00'
            break
          } else if (obj.level === '3' && obj.number > 0) {
            borderColor = '#febe2d'
            break
          } else if (obj.level === '2' && obj.number > 0) {
            borderColor = '#1f90e6'
            break
          } else if (obj.level === '1' && obj.number > 0) {
            borderColor = '#722ed1'
            break
          }
        }
      } else {
        borderColor = '#DEDEDE'
      }

      if (chart.type === 'bar') {
        chartHtml.push(<Col lg={3} md={3} key={chart.title} style={{ background: '#fff', margin: '6px', border: `1px solid ${borderColor}` }} onClick={() => window.open(`/oel?oelFilter=${chart.oelFilter}&oelViewer=${chart.oelViewer}&filterDisable=true&title=${chart.title}`, `${chart.oelFilter}`, '', 'false')}>
          <BarChart {...chartProps} />
        </Col>)
      }
    }
    return chartHtml
  }

  let centerHtml = []
  let branchHtml = []
  let systemHtml = []
  if (centerOlet && centerOlet.length > 0) {
    centerHtml = genHtml(centerOlet)
  }
  if (branchOlet && branchOlet.length > 0) {
    branchHtml = genHtml(branchOlet)
  }
  if (systemOlet && systemOlet.length > 0) {
    systemHtml = genHtml(systemOlet)
  }

  const modalProps = {
    dispatch,
    visible: modalVisible,
    loading,
    location,
    oel,
    modalName,
  }

  const countdownProps = {
    dispatch,
    initValue,
    countState,
  }

  return (
    <div>
      <div style={customPanelStyle1}>
        {ozr('ZH')}告警<span><Countdown {...countdownProps} /></span>
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip={"正在更新"+ozr('ZH')+"告警信息..."} spinning={centerState}>{centerHtml}</Spin>
        </Row>
      </div>
      <div style={customPanelStyle1}>
        {ozr('FH')}告警
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip={"正在更新"+ozr('FH')+"告警信息..."} spinning={branchState}>{branchHtml}</Spin>
        </Row>
      </div>
      <div style={customPanelStyle1}>
        其他
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新其他信息..." spinning={systemState}>{systemHtml}</Spin>
        </Row>
      </div>

      <Modal {...modalProps} />

    </div>

  )
}

export default connect(({ oel, monitorview, loading }) => ({ oel, monitorview, loading: loading.models.monitorview }))(monitorview)
