import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Button, Icon } from 'antd'
import Fenhang from '../../../utils/fenhang'

let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
})


const confirm = Modal.confirm

function list ({
 dispatch, 
 loading, 
 dataSource, 
 pagination, 
 batchDelete, 
 batchSelect, 
 q, // 翻页时的查询参数
 neType,
}) {

  const columns = [
    {
      key: 'mo.name',
      dataIndex: 'mo.name',
      title: '名称',
      width: 120,
    },
    {
      key: 'mo.discoveryIP',
      dataIndex: 'mo.discoveryIP',
      title: '管理 IP',
      width: 120,
    },
    {
      key: 'relatedPolicyInstances',
      dataIndex: 'relatedPolicyInstances',
      title: '关联策略总数',
      width: 80,
    },
    {
      key: 'mo.branchName',
      dataIndex: 'mo.branchName',
      title: '所属行名称',
      render: (text, record) => {
        return Fenhangmaps.get(text)
      },
      width: 120,
    },
    {
      key: 'mo.firstSecArea',
      dataIndex: 'mo.firstSecArea',
      title: '一级安全域',
      width: 120,
    },
    {
      key: 'mo.vendor',
      dataIndex: 'mo.vendor',
      title: '厂商',
      width: 120,
    },
		
  ]

	columns.push({
    title: '操作',
    width: 80,
    fixed: 'right',
    render: (text, record) => {
          return (<div>
<Button style={{ float: 'left' }} size="small" type="ghost" icon="retweet" onClick={() => onEdit(record)} disabled={(record.mo && record.mo.onlineStatus=== "已下线") ? true:false} >变更</Button>
      </div>)
    },
  })
//<Button style={{ float: 'right' }} size="default" type="ghost" shape="circle" icon="arrow-down" onClick={() => onDelete(record)} />

	const onPageChange = (page) => {
      dispatch({
      	type: 'mowizard/queryBrIPs',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'mowizard/setState',
      	payload: {
      		batchDelete: false,
      		batchSelect: [],
      	},
      })
    }

	const onEdit = (record) => {
    dispatch({
			type: 'mowizard/findIPById',				//@@@
			payload: {
				currentItem: record.mo,
				//secondClass: 'BRANCH_IP',				//@@@
				modalType: 'update',
			},
		})      
	}


  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
      //console.log(selectedRows)
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'mowizard/setState',
					payload: {
						batchDelete: true,
						batchSelect: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'mowizard/setState',
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
          scroll={{ x: 1000, y: 400 }}
        />
      </Col>
    </Row>
  )
}

export default list
