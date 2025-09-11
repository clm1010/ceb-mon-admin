import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Button } from 'antd'
import _columns from './Columns'

const confirm = Modal.confirm

const list = ({
 dispatch, loading, dataSource, pagination, batchDelete, selectedRows, secondClass, q,
}) => {
	const onDeletes = (record) => {
		let uuid = []
		uuid.push(record.uuid)
		let titles = '您确定要删除这条记录吗?'
		confirm({
    	title: titles,
    	onOk () {
		    dispatch({
				type: 'appCategories/remove',				//@@@
		      	payload: {
		      		uuid,
		      	},
			})
    	},
    })
	}

	const onEdit = (record) => {
		dispatch({
				type: 'appCategories/findById',				//@@@
		      	payload: {
		      		currentItem: record,
		      	},
		})
	}

	let columns = [..._columns]
	columns.push({
	  	title: '操作',
	  	width: 110,
	  	fixed: 'right',
	  	render: (text, record) => {
				return (<div>
  <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
  <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
            </div>)
	  	},
		})

	const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push = object.id
	  		})
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'appCategories/setState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'appCategories/setState',
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
	  },
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'appCategories/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'appCategories/setState',
      	payload: {
      		//pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }

	return (
  <Row gutter={24}>
    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
      <Table
        scroll={{ x: 6500 }}
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
