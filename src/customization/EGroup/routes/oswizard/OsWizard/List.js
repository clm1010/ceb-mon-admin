import React from 'react'
import { Table, Modal, Row, Col, Button, Badge, Tag } from 'antd'
import { Link } from 'dva/router'
import Fenhang from '../../../../../utils/fenhang'

let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
  Fenhangmaps.set(obj.key, obj.value)
})

const confirm = Modal.confirm

function list({
  dispatch, loading, dataSource, pagination, batchDelete, batchSelect, controllerNumber, q,
}) {
  //每次都会重新复制一套列配置，然后追加操作列。避免重复追加
  let columns = [


    {
      key: 'mo.name',
      dataIndex: 'mo.name',
      title: '名称',
    },
    {
      key: 'mo.hostname',
      dataIndex: 'mo.hostname',
      title: '主机名',
    },
    {
      key: 'database.code',
      dataIndex: 'mo.code',
      title: '对象编码',
    },
    {
      key: 'mo.appName',
      dataIndex: 'mo.appName',
      title: '所属应用分类名称',
    },
    {
      key: 'mo.mngtOrg',
      dataIndex: 'mo.mngtOrg',
      title: '设备管理机构',
    },
    {
      key: 'mo.discoveryIP',
      dataIndex: 'mo.discoveryIP',
      title: '发现 IP',
    },
    {
      key: 'issueFailedPolicyInstances',
      dataIndex: 'issueFailedPolicyInstances',
      title: '下发失败的策略实例数量',
    },
    {
      key: 'issuedPolicyInstances',
      dataIndex: 'issuedPolicyInstances',
      title: '已下发的策略实例数量',
    },
    {
      key: 'notStdPolicyInstances',
      dataIndex: 'notStdPolicyInstances',
      title: '非标准的策略实例数量',
    },
    {
      key: 'relatedPolicyInstances',
      dataIndex: 'relatedPolicyInstances',
      title: '总关联策略实例数量',
    },
    {
      key: 'unissuedPolicyInstances',
      dataIndex: 'unissuedPolicyInstances',
      title: '未下发的策略实例数量',
    },
    {
      key: 'mo.code',
      dataIndex: 'mo.code',
      title: '对象编码',
    },
    {
      key: 'mo.createMethod',
      dataIndex: 'mo.createMethod',
      title: '创建方式',
    },
    {
      key: 'mo.vendor',
      dataIndex: 'mo.vendor',
      title: '厂商',
    },
    {
      key: 'mo.location',
      dataIndex: 'mo.location',
      title: '区域',
    },
  ]


  columns.push({
    title: '操作',
    width: 80,
    fixed: 'right',
    render: (text, record) => {
      return (<div>
        <Button style={{ float: 'left' }} size="small" type="ghost" icon="retweet" onClick={() => onEdit(record)} disabled={ record.mo.onlineStatus === "已下线"} >变更</Button>
      </div>)
    },
  })

  const onDeletes = (record) => {
    let params = []
    params.push(record.mo.uuid)
    confirm({
      title: '您确定要将线路下线吗?',
      onOk() {
        dispatch({
          type: 'oswizard/deleteDb',				//@@@
          payload: {
            uuids: params,
            q: q === undefined ? '' : q,
          }
        })
      },
    })
  }

  const onPageChange = (page) => {
    dispatch({
      type: 'oswizard/queryOses',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q: q === undefined ? '' : q,
      },
    })
    dispatch({
      type: 'oswizard/setState',
      payload: {
        pageChange: new Date().getTime(),
        batchDelete: false,
        batchSelect: [],
      },
    })
  }

  //修改列表页表格中操作部分按钮---start
  const onEdit = (record) => {

    dispatch({
      type: 'oswizard/findOsById',				//@@@
      payload: {
        currentItem: record.mo,
      },
    })
    dispatch({
      type: 'oswizard/setState',
      payload: {
        lineWizardVisible: true,
        modalType: 'update',
        q: q === undefined ? '' : q,
      },
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        dispatch({
          type: 'oswizard/setState',
          payload: {
            batchDelete: true,
            batchSelect: selectedRows,
          },
        })
      } else if (selectedRows.length === 0) {
        dispatch({
          type: 'oswizard/setState',
          payload: {
            batchDelete: false,
            batchSelect: selectedRows,
          },
        })
      }
    },
  }

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 1200, y: 400 }}
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.mo.uuid}
          size="small"
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default list
