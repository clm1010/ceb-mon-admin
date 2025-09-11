import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, selectedRows, q,
}) {
	const onPageChange = (page) => {
      dispatch({
      	type: 'periodconfig/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q,
      	},
      })
      dispatch({
      	type: 'periodconfig/setState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }
	const onEdit = (record) => {
		dispatch({
			type: 'periodconfig/findById',
			payload: {
			//  modalType: 'update',
				currentItem: record,
			//  modalVisible: true,
			 // timeList:timeList,
			},
		})
	}

		const onDeletes = (record) => {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
        	let ids = []
        	ids.push(record.uuid)
          dispatch({
		        type: 'periodconfig/delete',
		        payload: ids,
		      })
        },
      })
		}
	const columns = [
    {
      title: '周期名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
		{
	  	title: '操作',
	  	width: 120,
	  	fixed: 'right',
	  	render: (text, record) => {
				return (<div>
  <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
  <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
            </div>)
	  	},
		},
  ]

  const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push = object.id
	  		})
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'periodconfig/setState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'periodconfig/setState',
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
