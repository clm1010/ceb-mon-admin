import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, location, batchDelete, choosedRows, selectInfo, moState,
}) {
	let isAdd = false
	if (selectInfo && selectInfo.node && selectInfo.node.hierarchy === 3) {
		isAdd = true
	} else {
		dataSource = ''
	}

	const handleMenuClick = (record, e) => {
		  dispatch({
			type: 'lookupinfo/controllerModal',
			payload: {
				modalType: 'update',
				currentItem: record,
				modalVisible: true,
				isClose: false,
			},
		  })
		}
//		else if (e.key === '2') {
//		  confirm({
//			title: '您确定要删除这条记录吗?',
//			onOk () {
//				let ids = []
//				//ids.push(Number.parseFloat(record.uuid))
//				ids.push(record.uuid)
//				dispatch({
//					type: 'lookupinfo/delete',
//					payload: ids,
//				})
//			},
//		  })
//		}

	const columns = [
		{
			title: '内容',
			dataIndex: 'data',
			key: 'data',
		}, {
			title: '操作',
			key: 'operation',
			fixed: 'right',
			width: 100,
			render: (text, record) => {
				return <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => handleMenuClick(record)} disabled={moState === 1} />
			},
		},
	]


	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			if (selectedRows.length > 0) {
				let newselectKeys = []
				selectedRows.forEach((item) => {
					newselectKeys.push(item.uuid)
				})

				dispatch({
					type: 'lookupinfo/controllerModal',
						payload: {
							batchDelete: true, //控制删除按钮
							choosedRows: newselectKeys, //把选择的行ID 放到 state 模型中去
						},
					})
			} else if (selectedRows.length === 0) {
				dispatch({
		    		type: 'lookupinfo/controllerModal',
					payload: {
						batchDelete: false,
						choosedRows: [],
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
        columns={columns} //表结构字段
        dataSource={dataSource} //表数据
        loading={loading} //页面加载
        onChange={onPageChange} //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
        pagination={isAdd ? pagination : false} //分页配置
	scroll={{ y: 500 }}
        simple
        size="small"
        rowKey={record => record.uuid}
        rowSelection={rowSelection}
      />

    </Col>
  </Row>
	)
}

export default list
