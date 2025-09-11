import React from 'react'
import { Table, Modal, Row, Col, Button, Badge } from 'antd'
import _columns from './Columns'
import { Link } from 'dva/router'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, batchDelete, selectedRows, controllerNumber, q,
}) {
	//每次都会重新复制一套列配置，然后追加操作列。避免重复追加
	let columns = [..._columns]
	columns.push({
	  	title: '操作',
	  	width: 90,
	  	fixed: 'right',
	  	render: (text, record) => {
				return (<div>
				<Button style={{ float: 'left' }} size="small" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
				<Button style={{ float: 'left' }} size="small" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
            </div>)
	  	},
		})

	for (let column of columns) {
		if (column.key === 'relatedPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => openPolicyModal(record, e, 'ALL')}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
			}
		}
	}
	const openPolicyModal = (record, e, type) => {
		dispatch({
			type: 'policyList/queryPolicy',
			payload: {
				uuid: record.mo.uuid,
				policyType: type,

			},
		})
		dispatch({
			type: 'policyList/setState',
			payload: {
				modalPolicyVisible: true,
				openPolicyType: type,
				policyInstanceId: record.mo.uuid,
			},
		})
	}

	const onDeletes = (record) => {
		confirm({
    	title: '您确定要删除这条记录吗?',
    	onOk () {
		    dispatch({
				type: 'fs/delete',				//@@@
				payload: record,
			})
    	},
    })
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'fs/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'fs/setState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }


	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'fs/findById',				//@@@
			payload: {
				currentItem: record,
				firstClass: 'OS',				//@@@
				modalType: 'update',
				modalVisible: true,
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入操作系统信息',
			},
		})
		dispatch({
			type: 'fs/setState',
			payload: {
				c1: '',
			},
		})
	}

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push = object.id
	  		})
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'fs/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'fs/setState',				//@@@
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
	  },
	}

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 2800 }}
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.uuid}
          size="small"
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  )
}

export default list
