import React from 'react'
import { Table, Modal, Row, Col } from 'antd'
import { DropOption } from '../../../components'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, batchDelete, selectedRows, currentPermissions, q,
}) {
	const onAdd = () => {
		dispatch({
			type: 'roles/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
			},
		})
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'roles/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q,
      	},
      })
      dispatch({
      	type: 'roles/updateState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
        	let ids = []
        	selectedRows.forEach(record => ids.push(record.uuid))
          dispatch({
		        type: 'roles/delete',
		        payload: ids,
		      })
        },
      })
	}

	const handleMenuClick = (record, e) => {
		//查看
      if (e.key === '1') {
    	//对更新时间和创建时间处理一下
      dispatch({
        type: 'roles/findById',
			  payload: {
				  modalType: 'see',
				  record,
				  //currentItem: record,
				  //modalVisible: true,
				  //isClose: false,
			  },
      })
    } else if (e.key === '2') { //编辑
    	dispatch({
    		type: 'roles/findById',
    		payload: {
    			record,
    		},
    	})
    } else if (e.key === '3') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
        	let ids = []
        	ids.push(record.uuid)
          dispatch({
		        type: 'roles/delete',
		        payload: ids,
		      })
        },
      })
    } else if (e.key === '4') {
    	dispatch({
    		type: 'roles/updateState',
    		payload: {
    			authorization: record,
    			keys: new Date().getTime(),
    		},
    	})
    	dispatch({
    		type: 'roles/findAuthorization',
    		payload: {
    			record,
    		},
    	})
    	dispatch({
    		type: 'roles/queryUserInfo',
    		payload: {
    			pageSize: 2000,
    			page: 0,
    		},
    	})
    }
  }

	const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
      render: (text, record) => {
      	if (record.createdTime && record.createdTime !== 0) {
      		let time = record.createdTime
			  	let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
				  return createdTime
      	}
      		return ''
			},
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '删除' }, { key: '4', name: '授权' }]} />
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
		    	type: 'roles/updateState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'roles/updateState',
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
