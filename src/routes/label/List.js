import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import './list.css'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination,q
}) {
	const onEdit = (record) => {
		dispatch({
			type: 'label/updateState',
			payload: {
				modalType: 'update',
				currentItem: record,
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const onDeletes = (record) => {
		let reg = /^(?!ump_tool).*/
		// if(!reg.test(record.key)){
		// 	Modal.warning({
		// 		title: '系统自动生成的标签不能删除',
		// 		okText: '取消',
		// 	})
		// }else{
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk() {
					let ids = []
					ids.push(record.uuid)
					dispatch({
						type: 'label/delete',
						payload: ids,
					})
				},
			})
		// }
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'label/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'label/updateState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	const columns = [
		{
			title: '标签名称',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => <div title={text}>{text}</div>,
			className: 'ellipsis',
		}, {
			title: '标签键',
			dataIndex: 'key',
			key: 'key',
		}, {
			title: '标签值',
			dataIndex: 'value',
			key: 'value',
		},{
			title: '是否启用',
			dataIndex: 'enabled',
			key: 'enabled',
			render:(text,record)=>{
				if(text) return '是'
				else return '否'
			}
		}, {
			title: '描述',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: '操作',
			key: 'operation',
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
					type: 'label/updateState',
					payload: {
						batchDelete: true,
						choosedRows: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'label/updateState',
					payload: {
						batchDelete: false,
						choosedRows: selectedRows,
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
