import React from 'react'
import {connect} from 'dva'
import {Button, Card, Col, Row, Icon} from 'antd'
import BarChart from './BarChart'
import LineChart from './LineChart'
import NetWorkPerformance from './NetWorkPerformance'
import DataCenterRoom from './DataCenterRoom'
import DateNow from './DateNow'
import LineHealth from './DedicatedLineHealthStatus'
import Tips from "./Tips";
import seemodal from './seemodal.less';

const sectionStyle= {
  width:'100%',
  height:'100%',
  display: 'inline-block',
  backgroundImage:"url("+ require("./backgroundimg.jpg")+ ")",
}

const screen = ({ location, dispatch, screen, loading }) => {
  const{
    dataCenterRoompingFailed,
    alerts,
    netWorkPerformance,
    lineData,
    coreA ,
    coreB ,
    coreC ,
    coreD ,
    storageAYD,
    storageALT,
    storageBLT,
    storageBYD,
    uuid,
    lineHealthData,
    modalVisible,
    dataCenterRoomLine,
    expands,
  }=screen
  const dataCenterRoomPro = {
    dispatch,
    uuid:uuid,
    dataCenterRoompingFailed:dataCenterRoompingFailed,
    dataCenterRoomLine:dataCenterRoomLine,
  }

  const netWorkPerformancePro = {
    dispatch,
    uuid:uuid,
    netWorkPerformance:netWorkPerformance,
  }

  const LinePro = {
    dispatch,
    uuid:uuid,
    lineData:lineData,
    coreA : coreA,
    coreB : coreB,
    coreC : coreC,
    coreD : coreD,
    storageAYD : storageAYD,
    storageALT : storageALT,
    storageBLT : storageBLT,
    storageBYD : storageBYD
  }

  const BarChartPro = {
    dispatch,
    uuid:uuid,
    alerts:alerts,
  }

  const LineHealthPro = {
    dispatch,
    lineHealthData:lineHealthData,
  };

  const ScreenTipPro = {
    dispatch,
    visible: modalVisible,
  };

  const onAdd = () => {
    dispatch({
      type: 'screen/controllerModal',
      payload: {
        modalVisible: true,
      },
    })
  };

  const fullscreen = () => { //弹出窗口中点击取消按钮触发的函数
    let expand = expands ? false : true
    dispatch({
      type: 'screen/setState', //抛一个事件给监听这个type的监听器
      payload: {
        expands: expand,
      },
    })
  //   dispatch({
  //     type: 'oelTrack/getNowDate',
  //     payload: {},
  // })
  };

  return (
    <div style={{backgroundColor:'#1C3150',marginBottom:'2px'}} className={expands ? seemodal.fullscreen : ''}>
      <div>
        <Row gutter={8} justify="space-between" style={{padding: 0, height:'50%', marginLeft: 0, marginRight: 0,}}>
          <Col lg={8} md={3} sm={5} xs={5} >
          <a onClick={fullscreen} > <Icon type={expands ? "shrink" : "arrows-alt"} />  </a>
          </Col>
          <Col lg={8} md={3} sm={6} xs={6}>
            <DateNow/>
          </Col>
          <Col lg={8} md={3} sm={5} xs={5}>
            <Button style={{ float: 'right' }} size="small" type="link" onClick={onAdd} icon="solution"></Button>
          </Col>
        </Row>
      </div>
      <Row gutter={6} justify="space-between" style={{padding: 0, height:'50%', marginLeft: 0, marginRight: 0,}}>
        <Col lg={6} md={3} sm={4} xs={4}>
          <Card style={sectionStyle}> <NetWorkPerformance {...netWorkPerformancePro}/></Card>
        </Col>
        <Col lg={6} md={3} sm={4} xs={4}>
          <Card style={sectionStyle}> <DataCenterRoom {...dataCenterRoomPro}/> </Card>
        </Col>
        <Col lg={12} md={6} sm={8} xs={8}>
          <Card style={sectionStyle}> <BarChart {...BarChartPro}/></Card>
        </Col>
      </Row>
      <Row gutter={6} justify="space-between" style={{padding: 0, height:'50%', marginLeft: 0, marginRight: 0, marginTop:'3px'}}>
        <Col lg={12} md={6} sm={8} xs={8}>
          <Card style={sectionStyle}> <LineChart {...LinePro}/></Card>
        </Col>
        <Col lg={12} md={6} sm={8} xs={8}>
          <Card style={sectionStyle}> <LineHealth {...LineHealthPro}/> </Card>
        </Col>
      </Row>
      <Tips {...ScreenTipPro} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ screen, loading }) => ({ screen, loading: loading.models.screen }))(screen)
