import React from 'react'
import { Table, Row, Col, Button, Modal, Badge } from 'antd'

const confirm = Modal.confirm

function List ({
 dispatch, pagination, dataSource, loading, q,
}) {
	let columns = [
	{
	    key: 'name',
	    dataIndex: 'name',
	    width: 250,
	    title: '名称',
	},
	{
	    key: 'urls',
	    dataIndex: 'url',
	    title: 'URL',
	    render: (text, record) => {
	    	if (record.url === undefined) {
	    		return <div><Badge status="warning" text="报表配置项" /></div>
	    	}
	    		return text
	    },
	},
	{
	  	title: '操作',
	  	width: 85,
	  	render: (text, record) => {
				return (<div>
  <Button style={{ float: 'left' }} size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
  <Button style={{ float: 'right' }} size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} disabled />
            </div>)
	  	},
	},
	]

	const onDeletes = (record) => {
		let uuid = []
		//uuid.push()
		confirm({
    	title: '您确定要删除这条记录吗?',
	    	onOk () {
			    dispatch({
					type: '',
			      	payload: {
			      		uuid,
			      	},
				})
	    	},
    	})
	}

	const onEdit = (record) => {
		dispatch({
			type: 'formConfiguration/findById',
			payload: {
				id: record.id,
			},
		})
	}
	const onPageChange = (page) => {
		dispatch({
			type: 'formConfiguration/query',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q,
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
		    	type: 'formConfiguration/setState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'formConfiguration/setState',
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
	  },
	}

	return (
  <div>
    <Row>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          bordered
          columns={columns} //表结构字段
          dataSource={dataSource} //表数据
          pagination={pagination} //分页配置
          onChange={onPageChange}
          simple
          size="small"
          rowKey={record => record.id}
          loading={loading}
          rowSelection={rowSelection}
        />
      </Col>
    </Row>
  </div>
	)
}

export default List
