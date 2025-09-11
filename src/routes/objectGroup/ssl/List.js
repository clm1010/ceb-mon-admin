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

	for (let column of columns) {
		if (column.key === 'relatedPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'ALL')}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
	    }
		} else if (column.key === 'issuedPolicyInstances') {
			column.render = (text, record) => {
	    	return <a onClick={e => openPolicyModal(record, e, 'ISSUED')}><Badge count={text} style={{ backgroundColor: '#52c41a' }} showZero /></a>
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
		} else if (column.key === 'intfNum') {
			column.render = (text, record) => {
	    	return <a onClick={e => openInfsModal(record, e)}><Badge count={text} style={{ backgroundColor: '#000' }} showZero /></a>
	    }
		}
	}

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

	const onPreview = (record) => {
		window.open(`/rulespreview?ids=${record.mo.uuid}&branches=${record.mo.branchName}`, `${record.mo.uuid}`, '', 'false')
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'ssl/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'ssl/setState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }

	const onDeletes = (record) => {
		let titles = '您确定要删除这条记录吗?'
		if (record.intfNum && record.intfNum !== 0) {
			titles = `该设备绑定了${record.intfNum}个接口，是否删除？`
		}
		confirm({
    	title: titles,
    	onOk () {
		    dispatch({
					type: 'ssl/delete',				//@@@
		      payload: record.mo,
				})
    	},
    })
	}

	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'ssl/findById',				//@@@
			payload: {
				currentItem: record.mo,
				secondClass: 'SSL',				//@@@
				modalType: 'update',
				modalVisible: true,
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入SSL设备信息',				//@@@
			},
		})
		dispatch({
			type: 'ssl/setState',
			payload: {
				modalType: 'update',
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入SSL设备信息',				//@@@
			},
		})
		dispatch({
			type:'ssl/appcategories',
			payload:{
				q:'affectSystem=="网络|*"'
			}
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
		    	type: 'ssl/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'ssl/setState',				//@@@
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
	  },
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

	const openInfsModal = (record, e) => {
		const currentItem = { uuid: record.mo.uuid }

		dispatch({
			type: 'interfaceList/setState',
			payload: {
				infsVisible: true,
			},
		})
		dispatch({
			type: 'interfacer/getInterfacesById',
			payload: {
				currentItem,
			},
		})
	}

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          scroll={{ x: 6000 }}
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
