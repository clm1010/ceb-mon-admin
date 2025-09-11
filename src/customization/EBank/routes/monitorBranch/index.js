import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs, Card, Row, Col } from 'antd'
import styles from './index.less'
import branchCfg from '../utils/monitorKey.js'
import { getUrl} from '../../../../utils/clientSetting'
import YJFJYJK from '../../../../utils/monitorBranch/dxtjy/YJFJYJK.jpg'//单系统交易	云缴费交易监控
import WLJYJK from '../../../../utils/monitorBranch/dxtjy/WLJYJK.jpg'
const { TabPane } = Tabs

const monitorBranch = ({
 location, dispatch, monitor, loading,
}) => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  let url = getUrl('/monitorBranch')
  let netUrl = getUrl('/monitorBranchNet')
  if (user.branch) {
    for (let branch of branchCfg) {
      if (user.branch === 'ZH' || user.branch === 'QH') {

      } else if (branch.key === user.branch) {
        url = `http://10.218.34.51:22003/kunpeng/preview/sandbox/dd02e35c7e334e30b128e16d3bc93f4b?citycode='${branch.zone}'`
        netUrl = `http://10.1.165.162/poin/layout/cloudDoubleElevenFh/${branch.orgCode}`
      }
    }
  }


  function openView (_url, title) {
    let obj = window.open(_url, title, 'width=1024,height=768,top=80,left=120')
    obj.document.title = title
  }

  return (
    <Card className={styles.back}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="单系统交易" key="1">
          <Row>

            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="云缴费交易监控" extra={<a target="_blank" onClick={() => openView(url, '云缴费交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView(url, '云缴费交易监控')}>
                    <img width="100%" src={YJFJYJK} />
                  </a>
                </div>
              </Card>
            </Col>

            <Col span={6} >
              <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title="网联交易监控视图" extra={<a target="_blank" onClick={() => openView(netUrl, '网联交易监控')}>跳转</a>}>
                <div className={styles.custom}>
                  <a target="_blank" onClick={() => openView(netUrl, '网联交易监控')}>
                    <img width="100%" height='178px' src={WLJYJK} />
                  </a>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ monitor, loading }) => ({ monitor, loading: loading.models.monitor }))(monitorBranch)
