import React from 'react'
import { Table } from 'antd'
import { Link } from 'dva/router'
import './List.css'

function list ({
 dispatch, pagination, q, ssid, dataSource,
}) {
  const openMosModal = (record, e) => {
    let kpiUUID = ''
    let parentUUID = ''
    let policyCount = 0
    if (record) {
      kpiUUID = record.kpiUUID
      policyCount = record.discovereMONun
    }
    parentUUID = ssid
    /*
    获取关联实例的数据
  */
    dispatch({
      type: 'indexlist/querystra',
      payload: {
        kpiUUID,
        parentUUID,
        indexMosNumber: policyCount,
      },
    })
    /*
     打开弹出框
      */
    dispatch({
      type: 'indexlist/setState',
      payload: {
        mosVisible: true,
      },
    })
  }
// const dataSource = [...data.content]
  const onPageChage = (page) => {
    dispatch({
      type: 'indexlist/query',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q,
      },
    })
    dispatch({
      type: 'indexlist/setState',
      payload: {
        onPageChage: new Date().getTime(),
        batchDelete: false,
        selectedRows: [],
      },
    })
  }
  const columns = [
    {
      title: '指标名',
      dataIndex: 'kpiName',
      key: 'kpiName',
      width: 300,
      render: (text, record, index) => {
        let cc
        record.isMonitor ? cc = { color: '#e01083' } : cc = { color: 'rgb(7, 204, 0)' }
        return <a onClick={e => openMosModal(record, e)} style={cc}>{text}</a>
      },
    }, {
      title: '策略名称',
      dataIndex: 'policyName',
      key: 'policyName',
      width: 300,
    }, {
      title: '是否监控',
      dataIndex: 'isMonitoring',
      key: 'isMonitoring',
      width: 200,
      render: (text, record) => {
        return <div>{record.isMonitoring ? '是' : '否'}</div>
      },
    }, {
      title: '是否为额外监控指标',
      dataIndex: 'shouldMonitor',
      key: 'shouldMonitor',
      width: 200,
      render: (text, record) => {
        return <div>{!record.shouldMonitor ? '是' : '否'}</div>
      },
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
  /*    for (let coluum of columns){
         if(coluum.key === 'yn'){
             coluum.render = (text , record) => {
                 if(text === '否'){
                     return <Tag color ="red">否</Tag>
                 }else {
                     return <Tag color ="green">是</Tag>
                 }
             }
         }
     } */
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onPageChage}
        rowKey={record => record.uuid}
        rowClassName={(record, index) => {
          let bgcolor = ' '
          if (!record.isMonitoring) {
            bgcolor = 'red test'
          }
          return bgcolor
        }
        }
      />
    </div>
  )
}

export default list
