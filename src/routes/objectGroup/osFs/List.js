import React from 'react'
import { Table, Modal, Row, Col, Button, Badge } from 'antd'
import _columns from './Columns'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, batchDelete, selectedRows, secondClass, q,
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
          <Button style={{ float: 'right' }} size="small" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
		  <Button style={{ float: 'left' }} size="small" type="ghost" shape="circle" icon="desktop" onClick={() => onPreview(record)} />

		    </div>)
	  	},
		})

		for (let column of columns) {
			if (column.key === 'relatedPolicyInstances') {
				column.render = (text, record) => {
					return <a onClick={e => openPolicyModal(record, e, 'ALL')}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
				}
			} else if (column.key === 'issuedPolicyInstances') {
				column.render = (text, record) => {
					return <a onClick={e => { openPolicyModal(record, e, 'ISSUED') }}> <Badge count={text} style={{ backgroundColor: '#52c41a' }} showZero /></a>
				}
			} else if (column.key === 'unissuedPolicyInstances') {
				column.render = (text, record) => {
					return <a onClick={e => openPolicyModal(record, e, 'UNISSUED')}><Badge count={text} style={{ backgroundColor: 'gray' }} showZero /></a>
				}
			} else if (column.key === 'issueFailedPolicyInstances') {
				column.render = (text, record) => {
					return <a onClick={e => openPolicyModal(record, e, 'ISSUE_FAILED')}><Badge count={text} style={{ backgroundColor: '#f22735' }} showZero /></a>
				}
			} else if (column.key === 'notStdPolicyInstances') {
				column.render = (text, record) => {
					return <a onClick={e => openPolicyModal(record, e, 'NOT_STD')}><Badge count={text} style={{ backgroundColor: '#f8ac30' }} showZero /></a>
				}
			}
		}
		const onPreview = (record) => {
			window.open(`/rulespreview?ids=${record.uuid}&branches=${record.branchName}&firstClass=os`, `${record.uuid}`, '', 'false')
		}
		const openPolicyModal = (record, e, type) => {
			dispatch({
				type: 'policyList/queryPolicy',
				payload: {
					uuid: record.uuid,
					policyType: type,
	
				},
			})
			dispatch({
				type: 'policyList/setState',
				payload: {
					modalPolicyVisible: true,
					openPolicyType: type,
					policyInstanceId: record.uuid,
				},
			})
		}


	const onDeletes = (record) => {
		let titles = '您确定要删除这条记录吗?'
		 
		confirm({
    	title: titles,
    	onOk () {
		    dispatch({
					type: 'osFs/delete',				//@@@
		      payload: record,
				})
    	},
    })
	}

	const onPageChange = (page, filters, sorter) => {
		// let sort = (sorter.order === 'descend') ? 'desc' : 'asc'
      dispatch({
      	type: 'osFs/query',
      	payload: {
            page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
          	pageSize: page.pageSize,
			// sort: `${sorter.columnKey},${sort}`,
			q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'osFs/setState',
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
			type: 'osFs/findById',				//@@@
			payload: {
				firstClass: 'OS',
				currentItem: record,
				createMethod: '自动',
				modalType: 'update',
				modalVisible: true,
				alertType: 'info',
				alertMessage: '请输入操作系统-文件系统信息',				//@@@
			},
		})
		/*
		dispatch({
			type:'interfacer/appcategories',
			payload:{
				q:'affectSystem=="网络|*"'
			}
		})*/
	}


  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
		   
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push = object.id
			  })
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'osFs/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'osFs/setState',				//@@@
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
          scroll={{ x: 1200, y: 400  }}
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
