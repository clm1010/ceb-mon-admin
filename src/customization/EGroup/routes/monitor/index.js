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
        <TabPane tab="网络重保监控视图" key="4">
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
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ monitor, loading }) => ({ monitor, loading: loading.models.monitor }))(monitor)
