import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs, Card, Row, Col, Icon, Tag, Empty, Tooltip } from 'antd'
import styles from './index.less'
import NETOUTFLOW from '../../../../utils/monitor/wlzbjkst/NETOUTFLOW.jpg'//网络重保监控视图

import { ozr } from '../../../../utils/clientSetting'
//网络重保监控视图	总行网络视图
const { TabPane } = Tabs

const monitor = ({
  location, dispatch, monitor, loading,
}) => {
  //const {  } = monitor	//这里把入参做了拆分，后面代码可以直接调用拆分的变量
  function callback(key) {
    console.log(key)
  }

  function openView(url, title) {
    let obj = window.open(url, title, 'width=1024,height=768,top=80,left=120')
    obj.document.title = title
  }

  return (
    <Card style={{ height: '100vh' }} >
      <Tabs defaultActiveKey={monitor.keys} onChange={callback}>
        
{/*         <TabPane tab="单系统交易" key="1">
          <Row gutter={16}>
            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="核心交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/goldengate/goldengateFirst/goldengate_new.jsp', '核心交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/goldengate/goldengateFirst/goldengate_new.jsp', '核心交易监控')}>
                    <img width="100%" src={one_coreTransactionMonitoring} />
                  </a>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="总前交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/ebipFirst_new.jsp', '总前交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/ebipFirst_new.jsp', '总前交易监控')}>
                    <img width="100%" src={ZQJYJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/ebipFirst_new.jsp', '总前交易监控')*
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="网银交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=NBANK', '网银交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=NBANK', '网银交易监控')}>
                    <img width="100%" src={WYJYJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=NBANK', '网银交易监控')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="客服交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=POWERCC', '客服交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=POWERCC', '客服交易监控')}>
                    <img width="100%" src={KFJYJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=POWERCC', '客服交易监控')
            </Col>
          </Row>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="图前交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=GTS', '图前交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=GTS', '图前交易监控')}>
                      <img width="100%" src={TQJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=GTS', '图前交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="ATMP交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=ATMP', 'ATMP交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=ATMP', 'ATMP交易监控')}>
                      <img width="100%" src={ATMPJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=ATMP', 'ATMP交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="手机银行交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=CEMB135', '手机银行交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=CEMB135', '手机银行交易监控')}>
                      <img width="100%" src={SJYHJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=CEMB135', '手机银行交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="新一代支付交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=PAY', '新一代支付交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=PAY', '新一代支付交易监控')}>
                      <img width="100%" src={XYDZFJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=PAY', '新一代支付交易监控')
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="TPOS交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=TPOS', 'TPOS交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=TPOS', 'TPOS交易监控')}>
                      <img width="100%" src={TPOSJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=TPOS', 'TPOS交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="EBIS交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=EBIS', 'EBIS交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=EBIS', 'EBIS交易监控')}>
                      <img width="100%" src={EBISJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=EBIS', 'EBIS交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="中间业务交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=EBMCP', '中间业务交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=EBMCP', '中间业务交易监控')}>
                      <img width="100%" src={ZJYWJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/allPay/payFirst/payFirst.jsp?appType=EBMCP', '中间业务交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="快捷支付基线交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/epayCreditAndLend/quickPay.jsp', '快捷支付基线交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/epayCreditAndLend/quickPay.jsp', '快捷支付基线交易监控')}>
                      <img width="100%" src={KJZFJXJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/epayCreditAndLend/quickPay.jsp', '快捷支付基线交易监控')
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="快捷支付峰值交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/epayCreditAndLend/quickPayFz.jsp', '快捷支付峰值交易监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/epayCreditAndLend/quickPayFz.jsp', '快捷支付峰值交易监控')}>
                      <img width="100%" src={KJZFFZJYJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/epayCreditAndLend/quickPayFz.jsp', '快捷支付峰值交易监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title={ozr('shortName') + '95595监控'} extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ccsLink/ccsLink.jsp', '分行95595监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ccsLink/ccsLink.jsp', '分行95595监控')}>
                      <img width="100%" src={nums} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ccsLink/ccsLink.jsp', '分行95595监控')
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab={ozr('QH')} key="2">
          <Row gutter={16}>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="电子支付业务监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/map/epayMarkPoint_ditu.jsp', '电子支付业务监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/map/epayMarkPoint_ditu.jsp', '电子支付业务监控')}>
                    <img width="100%" src={DZZFYWJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/map/epayMarkPoint_ditu.jsp', '电子支付业务监控')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="缴费业务交易额监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebmcpMap/ebmcpMarkPoint.jsp', '缴费业务交易额监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebmcpMap/ebmcpMarkPoint.jsp', '缴费业务交易额监控')}>
                    <img width="100%" src={JFYWJYEJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebmcpMap/ebmcpMarkPoint.jsp', '缴费业务交易额监控')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="缴费业务交易量监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebmcpMap/ebmcpMarkLine.jsp', '缴费业务交易量监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebmcpMap/ebmcpMarkLine.jsp', '缴费业务交易量监控')}>
                    <img width="100%" src={JFYWJYLJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebmcpMap/ebmcpMarkLine.jsp', '缴费业务交易量监控')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="核心交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/cbsmonMap/cbsmonMarkPoint.jsp', '核心交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/cbsmonMap/cbsmonMarkPoint.jsp', '核心交易监控')}>
                    <img width="100%" src={HXJYJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/cbsmonMap/cbsmonMarkPoint.jsp', '核心交易监控')
            </Col>
          </Row>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="ATMP业务监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/atmpMap/atmpMarkPoint.jsp', 'ATMP业务监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/atmpMap/atmpMarkPoint.jsp', 'ATMP业务监控')}>
                      <img width="100%" src={QHATMPYWJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/atmpMap/atmpMarkPoint.jsp', 'ATMP业务监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="手机银行业务监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebankMap/cembMarkPoint.jsp', '手机银行业务监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebankMap/cembMarkPoint.jsp', '手机银行业务监控')}>
                      <img width="100%" src={QHSJYHYWJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/ebankMap/cembMarkPoint.jsp', '手机银行业务监控'
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="图前业务监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/gtsMap/gtsMarkPointMonitor.jsp', '图前业务监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/gtsMap/gtsMarkPointMonitor.jsp', '图前业务监控')}>
                      <img width="100%" src={QHTQYWJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/gtsMap/gtsMarkPointMonitor.jsp', '图前业务监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="智能柜员业务监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/gtsMap/gtsMarkPoint.jsp', '智能柜员业务监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/gtsMap/gtsMarkPoint.jsp', '智能柜员业务监控')}>
                      <img width="100%" src={QHZNGYYWJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/gtsMap/gtsMarkPoint.jsp', '智能柜员业务监控')
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="多系统对比" key="3">
          <Row gutter={16}>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allSystemFlowNew.jsp', '重要系统交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allSystemFlowNew.jsp', '重要系统交易监控')}>
                    <img width="100%" src={DXTZYXTJYJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allSystemFlow.jsp', '重要系统交易监控')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统交易监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allSystemFlowTwoNew.jsp', '重要系统交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allSystemFlowTwoNew.jsp', '重要系统交易监控')}>
                    <img width="100%" src={ZYXTJYJK3} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allSystemFlow.jsp', '重要系统交易监控')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="总前总览视图" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/commChart/moritorAllChart_bak7.jsp', '总前总览视图')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/commChart/moritorAllChart_bak7.jsp', '总前总览视图')}>
                    <img width="100%" src={DXTZQZLST} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/commChart/moritorAllChart_bak7.jsp', '总前总览视图')
            </Col>
            <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统交易量汇总监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTrans-new.jsp', '重要系统交易量汇总监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTrans-new.jsp', '重要系统交易量汇总监控')}>
                    <img width="100%" src={DXTZYXTJYKHZJK} />
                  </a>
                </div>
              </Card>
              {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTrans-new.jsp', '重要系统交易量汇总监控')
            </Col>
          </Row>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统TPS汇总监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTPS-new.jsp', '重要系统TPS汇总监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTPS-new.jsp', '重要系统TPS汇总监控')}>
                      <img width="100%" src={DXTTPSJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTPS-new.jsp', '重要系统TPS汇总监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统成功率汇总监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allSuccpt-new.jsp', '重要系统成功率汇总监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allSuccpt-new.jsp', '重要系统成功率汇总监控')}>
                      <img width="100%" src={DXTZYXTCGHLZJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allSuccpt-new.jsp', '重要系统成功率汇总监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统响应时间汇总监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allResponseTime-new.jsp', '重要系统响应时间汇总监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allResponseTime-new.jsp', '重要系统响应时间汇总监控')}>
                      <img width="100%" src={DXTZYXTXYSJHZJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allResponseTime-new.jsp', '重要系统响应时间汇总监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统累计峰值汇总监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTransFZ-new.jsp', '重要系统累计峰值汇总监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTransFZ-new.jsp', '重要系统累计峰值汇总监控')}>
                      <img width="100%" src={ZYXTLJFZHZJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allTransFZ-new.jsp', '重要系统累计峰值汇总监控')
              </Col>
            </Row>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="存储性能监控" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allIndex.jsp', '存储性能监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allIndex.jsp', '存储性能监控')}>
                      <img width="100%" src={DXTCCXNJK} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allIndex.jsp', '存储性能监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统事件分级指标" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/sectionSystemFlow.jsp', '重要系统事件分级指标')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/sectionSystemFlow.jsp', '重要系统事件分级指标')}>
                      <img width="100%" src={ZYXTSJFJZB} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allIndex.jsp', '存储性能监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统历史交易量" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/afterAllSystemFlow.jsp', '重要系统历史交易量')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/afterAllSystemFlow.jsp', '重要系统历史交易量')}>
                      <img width="100%" src={ZYXTLSJYL} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allIndex.jsp', '存储性能监控')
              </Col>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统多数据源交易量对比" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allDoubleSourceSystemFlow.jsp', '重要系统多数据源交易量对比')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/allDoubleSourceSystemFlow.jsp', '重要系统多数据源交易量对比')}>
                      <img width="100%"src={ZTXTDSJY} />
                    </a>
                  </div>
                </Card>
                {/*()=> openView('http://10.218.32.75:9090/itumpsub/com/resoft/ebip/ebipFirst/allIndex.jsp', '存储性能监控')
              </Col>
            </Row>
          </div>
        </TabPane> */}

        <TabPane tab="网络重保监控视图" key="4">
          {/* <Row gutter={16}>
            <Col span={6}>
            <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网线路流量集中监控-秒级" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f8ff055e7ebcc693663627d', '互联网线路流量集中监控-秒级')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f8ff055e7ebcc693663627d', '互联网线路流量集中监控-秒级')}>
                      <img width="100%" height="178px" src={HLWXLs} />
                    </a>
                  </div>
                </Card>
            </Col>
            <Col span={6}>
            <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网线路流量集中监控-分钟级" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f8fedf2e7ebcc6936628d83', '互联网线路流量集中监控-分钟级')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f8fedf2e7ebcc6936628d83', '互联网线路流量集中监控-分钟级')}>
                      <img width="100%" height="178px" src={HLWXLm} />
                    </a>
                  </div>
                </Card>
            </Col>
            <Col span={6}>
            <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网线路流量集中监控-分钟级含基线" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=62cb4d5fe7ebcc5644f1e855', '互联网线路流量集中监控-分钟级含基线')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=62cb4d5fe7ebcc5644f1e855', '互联网线路流量集中监控-分钟级含基线')}>
                      <img width="100%" height="178px" src={HLWCKLLJXFZJ} />
                    </a>
                  </div>
                </Card>
            </Col>
            <Col span={6}>
            <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网线路进出包数-秒级" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f90c2a3e7ebcc693697efa7', '互联网线路进出包数-秒级')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f90c2a3e7ebcc693697efa7', '互联网线路进出包数-秒级')}>
                      <img width="100%" height="178px" src={CBs} />
                    </a>
                  </div>
                </Card>
            </Col>
          </Row> */}

          {/* <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网线路同步包与同步确认包-分钟级" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f1e7c37e7ebcc301be03a64', '互联网线路同步包与同步确认包-分钟级')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f1e7c37e7ebcc301be03a64', '互联网线路同步包与同步确认包-分钟级')}>
                      <img width="100%" height="178px" src={QRBm} />
                    </a>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网线路创建会话数与活动会话数-分钟级" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f90c680e7ebcc693698a765', '互联网线路创建会话数与活动会话数-分钟级')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=5f976cad4652729f60e78423%26groupId=5f90c680e7ebcc693698a765', '互联网线路创建会话数与活动会话数-分钟级')}>
                      <img width="100%" height="178px" src={HHSm} />
                    </a>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="图前10001-20003集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5c048d6d465272dace71300a', '图前10001-20003集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5c048d6d465272dace71300a', '图前10001-20003集中监控')}>
                      <img width="100%" height="178px" src={YWTCP} />
                    </a>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="骨干网集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5d538b0046527265b21b941f', '骨干网集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5d538b0046527265b21b941f', '骨干网集中监控')}>
                      <img width="100%" height="178px" src={ZJYWFHQ} />
                    </a>
                  </div>
                </Card>
              </Col>
            </Row>
          </div> 
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="武汉灾备专线集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5dba84ac465272b1e339db5d', '武汉灾备专线集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5dba84ac465272b1e339db5d', '武汉灾备专线集中监控')}>
                      <img width="100%" height="178px" src={WHZB} />
                    </a>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="海外分行线路集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=61c52e39465272308301976c', '海外分行线路集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=61c52e39465272308301976c', '海外分行线路集中监控')}>
                      <img width="100%" height="178px" src={HWFHXLJZJK} />
                    </a>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="外联专线流量集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5d53857046527265b219de1b', '外联专线流量集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5d53857046527265b219de1b', '外联专线流量集中监控')}>
                      <img width="100%" height="178px" src={ZFBZZFGCD} />
                    </a>
                  </div>
                </Card>
              </Col>
                {/*<Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="总行网络大屏(老)" extra={<a target="_blank" onClick={() => openView('./ZHscreen', '光大集团网络大屏')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('./ZHscreen', '总行网络大屏')}>
                      <img width="100%" height="178px" src={ZHWLST} />
                    </a>
                  </div>
                </Card>
               <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="生产A区重传丢包监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5d6dc81f4652720c1ffffc2b', '生产A区重传丢包监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5d6dc81f4652720c1ffffc2b', '生产A区重传丢包监控')}>
                      <img width="100%" height="178px" src={SHENCHANA} />
                    </a>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        */}
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="互联网出口流量基线" extra={<a target="_blank" onClick={() => openView('http://10.218.32.72/d/nis3eghZk/hu-lian-wang-chu-kou-liu-liang-ji-xian?refresh=1m&orgId=1', '互联网出口流量基线')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.72/d/nis3eghZk/hu-lian-wang-chu-kou-liu-liang-ji-xian?refresh=1m&orgId=1', '互联网出口流量基线')}>
                      <img width="100%" height="178px" src={NETOUTFLOW} />
                    </a>
                  </div>
                </Card>
              </Col>
              {/* <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="网联专线流量集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5b03b04be4b078892b7dd6e2', '网联专线流量集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5b03b04be4b078892b7dd6e2', '网联专线流量集中监控')}>
                      <img width="100%" height="178px" src={XYKZX} />
                    </a>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="信用卡Connex流量集中监控" extra={<a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5c219c2d4652722d269e3821', '信用卡Connex流量集中监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.214.113.73/auth/authLogin.do?authUid=monitor&authPwd=monitor@tcp&url=/customMetricMonitor/monitor.html?viewGroupId=all%26groupId=5c219c2d4652722d269e3821', '信用卡Connex流量集中监控')}>
                      <img width="100%" height="178px" src={XYKConnex} />
                    </a>
                  </div>
                </Card>
              </Col> */}
              {/* <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="网联六条线秒精度视图" extra={<a target="_blank" onClick={() => openView('https://10.1.35.71/auth/authLogin.do?authUid=monitor&authPwd=!monitor1234&url=/customMetricMonitor/monitor.html?groupId=5bc9931f42f8e83714e0ccfb&fullScreen=true', '网联六条线秒精度视图')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('https://10.1.35.71/auth/authLogin.do?authUid=monitor&authPwd=!monitor1234&url=/customMetricMonitor/monitor.html?groupId=5bc9931f42f8e83714e0ccfb&fullScreen=true', '网联六条线秒精度视图')}>
                      <img width="100%"  height="178px" src={LIUTIAOXIANVIEW} />
                    </a>
                  </div>
                </Card>
              </Col> */}
            </Row>
          </div>
          {/* <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="网联业务流量监控" extra={<a target="_blank" onClick={() => openView('https://10.1.35.71/auth/authLogin.do?authUid=monitor&authPwd=!monitor1234&url=/customMetricMonitor/monitor.html?groupId=5db7dfe25504e280a00559d8&fullScreen=true', '网联业务流量监控')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('https://10.1.35.71/auth/authLogin.do?authUid=monitor&authPwd=!monitor1234&url=/customMetricMonitor/monitor.html?groupId=5db7dfe25504e280a00559d8&fullScreen=true', '网联业务流量监控')}>
                      <img width="100%" height="178px" src={YEWULILIANG} />
                    </a>
                  </div>
                </Card>
              </Col>
            </Row>
          </div> */}
        </TabPane>
        
        {/*<TabPane tab="运维安全监控视图" key="5">
          <Row>
            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="运维安全监控视图" extra={<a target="_blank" onClick={() => window.open('/monitorSummary', '运维安全监控视图')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => window.open('/monitorSummary', '运维安全监控视图')}>
                    <img width="100%" src={JKST} />
                  </a>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="应急大屏" key="6">
          <Row>
            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="交易基线" extra={<a target="_blank" onClick={() => window.open('http://10.218.36.41:9090/d/ceb_app_tran_baseline/guang-da-yin-xing-_ying-yong-xi-tong-jiao-yi-ji-xian?refresh=1m&orgId=1', '交易基线')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.36.41:9090/d/ceb_app_tran_baseline/guang-da-yin-xing-_ying-yong-xi-tong-jiao-yi-ji-xian?refresh=1m&orgId=1', '交易基线')}>
                    <img width="100%" src={JYJX} />
                  </a>
                </div>
              </Card>
            </Col>
            {/* <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="交易损失率" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/sectionSystemFlow.jsp', '交易损失率')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/sectionSystemFlow.jsp', '交易损失率')}>
                    <img width="100%" src={ZYXTSJFJZB} />
                  </a>
                </div>
              </Card>
            </Col> 
            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="告警跟踪" extra={<a target="_blank" onClick={() => openView('/oelTrack', '告警跟踪')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('/oelTrack', '告警跟踪')}>
                    <img width="100%" src={GJGZ} />
                  </a>
                </div>
              </Card>
            </Col>
            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="告警分布图" extra={<a target="_blank" onClick={() => openView('/alarmdiagram', '告警分布图')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView('/alarmdiagram', '告警分布图')}>
                    <img width="100%" src={GJFB} />
                  </a>
                </div>
              </Card>
            </Col>
            <Col span={6} >
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="卡中心告警" extra={<a target="_blank" onClick={() => openView('/xykfrontview', '卡中心告警')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('/xykfrontview', '卡中心告警')}>
                      <img width="100%" src={KZX} />
                    </a>
                  </div>
                </Card>
              </Col>
          </Row>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={16}>
              <Col span={6} >
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="网络各区域告警统计" extra={<a target="_blank" onClick={() => openView('http://10.218.36.41:9090/d/alert-sd-emergency/guang-da-yin-xing-fu-wu-tai-shi-tu-da-gui-mo-bao-jing?refresh=1m&orgId=1&from=now-2h&to=now', '网络各区域告警统计')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.36.41:9090/d/alert-sd-emergency/guang-da-yin-xing-fu-wu-tai-shi-tu-da-gui-mo-bao-jing?refresh=1m&orgId=1&from=now-2h&to=now', '网络各区域告警统计')}>
                      <img width="100%" src={DGMBJ} />
                    </a>
                  </div>
                </Card>
              </Col>
              {/* <Col span={6} >
                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="重要系统历史交易量" extra={<a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/afterAllSystemFlow.jsp', '重要系统历史交易量')}>跳转</a>}>
                  <div className={styles.custom}>
                    <a target="_blank" onClick={() => openView('http://10.218.32.75:9090/itumpsub/com/resoft/epay/system/afterAllSystemFlow.jsp', '重要系统历史交易量')}>
                      <img width="100%" src={ZYXTLSJYL} />
                    </a>
                  </div>
                </Card>
              </Col> 

            </Row>
          </div>
        </TabPane>
        */}
      </Tabs>
    </Card>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ monitor, loading }) => ({ monitor, loading: loading.models.monitor }))(monitor)
