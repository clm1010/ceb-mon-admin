import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

function list ({
 dispatch, loading, pagination, dataSource, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
}) {
	const onAdd = () => {
		dispatch({
			type: 'trackTimer/showModal',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'trackTimer/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q,
			},
		})
	}


	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk () {
				dispatch({
					type: 'trackTimer/delete',
					payload: choosedRows,
				})
			},
		})
	}

	const onEdit = (record) => {
		if (record.createdTime !== 0) {
			let text = record.createdTime
			record.createdTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		}
		if (record.updatedTime !== 0) {
			let text = record.updatedTime
			record.updatedTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		}
		if (record.beginTime !== 0) {
			let text = record.beginTime
			record.beginTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		}
		let timeFileinfo = {}
		timeFileinfo.filterItems = record.actions
		dispatch({
			type: 'trackTimer/showModal',
			payload: {
				modalType: 'update',
				currentItem: record,
				modalVisible: true,
				timertype: record.typ,
				timeFileinfo,
				typeValue: record.cycleMechanism,
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
					type: 'trackTimer/delete',
					payload: ids,
				})
			},
		})
	}
	const columns = [
		{
			title: '定时器名',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '告警特征定义',
			dataIndex: 'condition',
			key: 'condition',
		}, {
			title: '定时定义',
			dataIndex: 'timedef',
			key: 'timedef',
			render: (text, record) => {
				let arr = record.allInterval
				let str = arr.join(',')
				str += ' 分'
				if (record.typ == 'TIMELIMIT') {
					str = `在限期到达之前${str}`
				}
				return str
			},
		}, {
			title: '描述',
			dataIndex: 'description',
			key: 'description',

		},
		{
			title: '操作',
			width: 100,
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
					choosed.push(object.uuid)
				})
			dispatch({
				type: 'trackTimer/setState',
				payload: {
					choosedRows: choosed,
					batchDelete: choosed.length > 0,
				},
			})
		},
	}


	return (
  <Row gutter={24}>
    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
      <Table
        scroll={{ x: 980 }} //滚动条
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
