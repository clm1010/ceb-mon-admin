import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import _columns from './Columns'

const confirm = Modal.confirm

const list = ({
 dispatch, loading, dataSource, pagination, batchDelete, selectedRows, secondClass, q,
}) => {
	const onDeletes = (record) => {
		let uuid = []
		uuid.push(record.mo.uuid)
		let titles = '您确定要删除这条记录吗?'
		confirm({
    	title: titles,
    	onOk () {
		    dispatch({
				type: 'page/remove',				//@@@
		      	payload: {
		      		uuid,
		      	},
			})
    	},
    })
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'page/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q: q === undefined ? '' : q,
      	},
      })
      dispatch({
      	type: 'page/setState',
      	payload: {
      		//pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }


	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'page/findById',
			payload: {
				currentItem: record.mo,
			},
		})
		dispatch({
			type: 'page/setState',
			payload: {
				c1: '',
			},
		})
		dispatch({
			type:'page/appcategories',
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
		    	type: 'page/setState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'page/setState',
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
	  },
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
	return (
  <Row gutter={24}>
    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
      <Table
        scroll={{ x: 1000 }}
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
