import React from 'react'
import { connect } from 'dva'
import Menus from '../dashboard/performance/Menus'
import Tables from './table'
import AlarmsTable from './alarmsTable'
import alarmsColumns from './alarmsColumns'
import ItemForm from './ItemForm'
import { Row, Col, Card, Descriptions, Tag, Icon } from 'antd'

const customMonitor = ({ dispatch, location, loading, customMonitor }) => {

  const { dataSource, pagination, batchDelete, selectedRows, q, dataSourceAlarms, paginationAlarms, selectedRowsAlarms } = customMonitor

  const user = JSON.parse(sessionStorage.getItem('user'))
  //菜单配置项---start
  const menuProps = {
    current: 'customMonitor',
    dispatch,
    userbranch:user.branch
  }

  const tableProps = {
    dispatch,
    location,
    dataSource,
    pagination,
    batchDelete,
    selectedRows,
    q,
    loading:loading.effects['customMonitor/query']
  }

  const alarmsTableProps = {
    dispatch,
    dataSource:dataSourceAlarms,
    colums: alarmsColumns,
    buttonState: true,
    loading: loading.effects['customMonitor/queryAlarm'],
    payload: {},
    path: 'customMonitor/queryAlarm',
    path2: 'customMonitor/setState',
    pagination:paginationAlarms
  }

  const itemFormProps = {
    dispatch,
    selectedRows,
    selectedRowsAlarms,
    batchDelete,
    q
  }

  return (
    <div>
      <Row gutter={6}>
        <Col span={24}>
          <Menus {...menuProps} />
        </Col>
        <Col span={24}>
          <div style={{ marginTop: '10px' }}>
            <Row gutter={6}>
              <Col span={12}>
                <Row>
                  <Col span={24}>
                    <Card title="选择过滤条件" style={{ height: '355px', marginBottom: '10px' }} key="1">
                        <ItemForm {...itemFormProps}/>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card className="rowHover" style={{ height: '823px', marginTop: '0px' }} key="2">
                      <Tables {...tableProps}/>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row gutter={6}>
                  <Col span={24}>
                    <Card title="告警" style={{ height: '688px', marginLeft: '6px', marginBottom: '10px' }} key="3">
                      <AlarmsTable{...alarmsTableProps}/>
                    </Card>
                  </Col>
                  {/*<Col span={24}>*/}
                    {/*<Card style={{ height: '150px', marginLeft: '6px', marginBottom: '10px' }} key="4">*/}
                        {/*<Result title="Great, we have done all the operations!"/>*/}
                    {/*</Card>*/}
                  {/*</Col>*/}
                  <Col span={24}>
                    <Card style={{ height: '480px', marginLeft: '6px', marginBottom: '10px' }} key="6">
                      {/*<Result title="Great, we have done all the operations!"/>*/}
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default connect (({ customMonitor, loading }) => ({ customMonitor, loading }))(customMonitor)
