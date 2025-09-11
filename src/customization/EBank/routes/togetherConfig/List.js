import React from 'react'
import { Table, Col, Tag, Modal } from 'antd'
import { DropOption } from '../../../../components'

function list({
  dispatch, pagination, dataSource, q,serviceArea
}) {

  const onPageChage = (page) => {
    dispatch({
      type: 'togetherConfig/query',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q,
      },
    })
  }
  const handleMenuClick = (record, e) => {
    if (e.key === '0') {
      dispatch({
        type: 'togetherConfig/updateState',
        payload: {
          currentItem: record,
          visible: true,
          type: "see"
        }
      })
      dispatch({
        type: 'togetherConfig/getByname',
        payload: record
      })
    }else if (e.key === '1') {
      dispatch({
        type: 'togetherConfig/updateState',
        payload: {
          currentItem: record,
          visible: true,
          type: "update"
        }
      })
      dispatch({
        type: 'togetherConfig/getByname',
        payload: record
      })
    }else if (e.key === '2') {
      dispatch({
        type: 'togetherConfig/register',
        payload: record,
      })
    }else if (e.key === '3') {
      dispatch({
        type: 'togetherConfig/deregister',
        payload: record,
      })
    }else  if (e.key === '4') {
      if (record.status == "REGISTERED") {
        Modal.error({
          title: '警告',
          content: "已注册服务不可以删除，请先注销服务"
        })
      } else {
        dispatch({
          type: 'togetherConfig/delete',
          payload: record
        })
      }
    }
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '组件类型',
      dataIndex: 'typ',
      key: 'typ',
    }, {
      title: '服务域',
      dataIndex: 'area',
      key: 'area',
      width:300,
      render:(text,record)=>{
        if(serviceArea.length > 0){
          const rst = serviceArea.find(item => item.value == text)
          return rst.name
        }else{
          return text
        }
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        let res = ''
        switch (text) {
          case "UNREGISTERED":
            res = <Tag >未注册</Tag>
            break;
          case "REGISTERED":
            res = <Tag color='#87d068'>已注册</Tag>
            break;
          case "DEREGISTERED":
            res = <Tag color='#f50'>已注销</Tag>
            break;
        }
        return res
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 180,
      fixed: 'right',
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '0', name: '查看' }, { key: '1', name: '编辑' }, { key: '2', name: '注册' }, { key: '3', name: '注销' }, { key: '4', name: '删除' }]} />
      },
    },
  ]
  return (
    <div>
      <Col xl={{ span: 24 }} md={{ span: 24 }}>
        <Table
          columns={columns}
          bordered
          size="small"
          dataSource={dataSource}
          rowKey={record => record.id}
          pagination={pagination}
          onChange={onPageChage}
        />
      </Col>
    </div>
  )
}

export default list
