import React from 'react'
import { Table, Col } from 'antd'
import { Link } from 'dva/router'
import './List.css'

function list ({
 dispatch, pagination, dataSource, q,
}) {
  const openMosModal = (record, e) => {
    let policyUUID = ''
    let policyCount = 0
    let uuid = ''
    if (record) {
      policyUUID = record.policyUUID
      policyCount = record.discovereMONun
      uuid = record.uuid
    }
    console.log('openMosModal :', policyUUID)

    /*
    获取关联实例的数据
  */
    dispatch({
      type: 'strategylist/findById',
      payload: {
        policyUUID,
        uuid,
        relatedType: 'TOOL_INST',
      },
    })
    /*
     打开弹出框
      */
    dispatch({
      type: 'strategylist/setState',
      payload: {
        strategyUUIDMos: policyUUID,
        strategyMosNumber: policyCount,
        mosVisible: true,
      },
    })
  }
  const onPageChage = (page) => {
    dispatch({
      type: 'strategylist/query',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q,
      },
    })
    dispatch({
      type: 'strategylist/setState',
      payload: {
        onPageChage: new Date().getTime(),
        batchDelete: false,
        selectedRows: [],
      },
    })
  }
  const columns = [
    {
      title: '策略名',
      dataIndex: 'policyName',
      key: 'policyName',
      render: (text, record) => {
        let cc
        record.isMonitoring == true ? record.YN1 = '是' : record.YN1 = '否'
        record.shouldMonitor == true ? record.YN2 = '否' : record.YN2 = '是'
        record.isMonitoring == true ? cc = { color: '#e01083' } : cc = { color: 'rgb(7, 204, 0)' }
        return <a onClick={e => openMosModal(record, e)} style={cc}>{text}</a>
      },
    }, {
      title: '所属指标',
      dataIndex: 'kpiName',
      key: 'kpiName',
    }, {
      title: '是否监控',
      dataIndex: 'YN1',
      key: 'YN1',
    }, {
      title: '是否为额外策略',
      dataIndex: 'YN2',
      key: 'YN2',
    }, {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold',
    }, {
      title: 'ip',
      dataIndex: 'discoverip',
      key: 'discoverip',
      width: 200,
    }, {
      title: 'objectID',
      dataIndex: 'objectid',
      key: 'objectid',
      width: 200,
    },
  ]
  return (
    <div>
      <Col xl={{ span: 24 }} md={{ span: 24 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record.uuid}
          pagination={pagination}
          onChange={onPageChage}
          //               size = "middle"
          rowClassName={(record) => {
            let bgcolor = ' '
            if (record.YN1 === '否') {
              bgcolor = 'red test'
            }
            return bgcolor
          }
          }
        />
      </Col>
    </div>
  )
}

export default list
