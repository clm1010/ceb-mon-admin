import React from 'react'
import { connect } from 'dva'
import { Card, Row, Col } from 'antd'
import Bar from './bar'
import MinBar from './minBar'
import style from './index.less'
import Modal from './historyView'
const monitorSummary = ({
 dispatch, history, loading, monitorSummary,
}) => {
  document.title = '护网行动监控视图'
  let bar = parseInt(document.body.clientHeight * 0.637)
  let minBar = parseInt(document.body.clientHeight * 0.29)
  const {
    f5AppNameTop, //蜜罐F5报警应用名称
    f5NumTop, //蜜罐F5报警数量
    f5State,
    folwAppNameTop, //网络全流量报警应用名称
    folwNumTop, //网络全流量报警数
    folwState,
    loginAppNameTop, //登录失败报警应用名称
    loginNumTop, //登录失败报警数
    loginState,
    portAppNameTop, //异常端口报警应用名称
    portNumTop, //异常端口报警数
    portState,
    connectAppNameTop, //异常连接报警应用系统名称
    connectNumTop, //异常连接报警数
    connectState,
    middlewareAppNameTop, //中间件安全报警应用名称
    middlewareNumTop, //中间件安全报警数
    middlState,
    monitorTop, //护网行动监控视图6项
    monitorNumTop, //护网行动监控视图6项告警数
    monitorState,
    f5Title, //oel跳转是传给oel的标题
    f5Filter, //跳转的oel过滤器
    folwTitle,
    folwFilter,
    loginTitle,
    loginFilter,
    portTitle,
    portFilter,
    connectTitle,
    connectFilter,
    middleTitle,
    middleFilter,
    viewFilter,
    modalVisible,
    hisroryNum,
    q,
    dataSource,
  } = monitorSummary

  const modalProps = {
    dispatch,
    visible: modalVisible,
    q,
    dataSource,
  }

  const barProps = {
    dispatch,
    title: '护网行动监控统计',
    xdata: monitorTop,
    seriesData: monitorNumTop,
    showLoading: monitorState,
    heightBar: `${bar - 100}px`,
    path: 'query',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
    f5Title, //oel跳转是传给oel的标题
    f5Filter, //跳转的oel过滤器
    folwTitle,
    folwFilter,
    loginTitle,
    loginFilter,
    portTitle,
    portFilter,
    connectTitle,
    connectFilter,
    middleTitle,
    middleFilter,
    viewFilter,
    hisroryNum,
  }
  const f5BarProps = {
    dispatch,
    title: '蜜罐F5报警',
    ydata: f5AppNameTop,
    seriesData: f5NumTop,
    showLoading: f5State,
    heightBar: `${minBar - 50}px`,
    path: 'queryF5',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
  }
  const folwBarProps = {
    dispatch,
    title: '网络安全全流量报警',
    ydata: folwAppNameTop,
    seriesData: folwNumTop,
    showLoading: folwState,
    heightBar: `${minBar - 50}px`,
    path: 'queryFolw',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
  }
  const loginBarProps = {
    dispatch,
    title: '登录失败报警',
    ydata: loginAppNameTop,
    seriesData: loginNumTop,
    showLoading: loginState,
    heightBar: `${minBar - 50}px`,
    path: 'queryLogin',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
  }
  const portErrorBarProps = {
    dispatch,
    title: '异常端口报警',
    ydata: portAppNameTop,
    seriesData: portNumTop,
    showLoading: portState,
    heightBar: `${minBar - 50}px`,
    path: 'queryPort',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
  }
  const connectBarProps = {
    dispatch,
    title: '异常连接报警',
    ydata: connectAppNameTop,
    seriesData: connectNumTop,
    showLoading: connectState,
    heightBar: `${minBar - 50}px`,
    path: 'queryConnect',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
  }
  const middlewareBarProps = {
    dispatch,
    title: '应用安全报警',
    ydata: middlewareAppNameTop,
    seriesData: middlewareNumTop,
    showLoading: middlState,
    heightBar: `${minBar - 50}px`,
    path: 'queryMiddle',
    uuid: '51fbf869-b754-4ef8-8866-387a84966c8e',
    sql: 'select N_AppName,count(*) as nums from alerts.status group by N_AppName order by nums desc',
  }

  return (
    <div>
      <div className={style.cardBackground} >
        <Row gutter={12}>
          <Col md={{ span: 18 }} lg={{ span: 18 }} xl={{ span: 18 }}>
            <Card className={style.bar} style={{ minHeight: bar }}>
              <Bar {...barProps} />
            </Card>
          </Col>
          <Col md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
            <Row gutter={12}>
              <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                <Card className={style.pie} style={{ minHeight: minBar }}>
                  <MinBar {...middlewareBarProps} />
                </Card>
              </Col>
              <Col md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                <Card className={style.pieRow} style={{ minHeight: minBar }}>
                  <MinBar {...connectBarProps} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <div style={{ marginTop: '10px' }}>
          <Row gutter={12}>
            <Col md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
              <Card className={style.pie} style={{ minHeight: minBar }}>
                <MinBar {...f5BarProps} />
              </Card>
            </Col>
            <Col md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
              <Card className={style.pie} style={{ minHeight: minBar }}>
                <MinBar {...folwBarProps} />
              </Card>
            </Col>
            <Col md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
              <Card className={style.pie} style={{ minHeight: minBar }}>
                <MinBar {...loginBarProps} />
              </Card>
            </Col>
            <Col md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
              <Card className={style.pie} style={{ minHeight: minBar }}>
                <MinBar {...portErrorBarProps} />
              </Card>
            </Col>
          </Row>
        </div>
        <div style={{ minHeight: '100px' }} />
      </div>
      <Modal {...modalProps} />
    </div>
  )
}

export default connect(({ monitorSummary, loading }) => ({ monitorSummary, loading: loading.models.monitorSummary }))(monitorSummary)
