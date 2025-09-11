import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import fenhang from '../../utils/fenhang'
import './list.css'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, q
}) {

	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

	const onEdit = (record) => {
		dispatch({
			type: 'collector/setState',
			payload: {
				currentItem: record,
				modalVisible: true,
			},
		})
	}

	const onDeletes = (record) => {
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk() {
				let ids = []
				ids.push(record.uuid)
				dispatch({
					type: 'collector/delete',
					payload: ids,
				})
			},
		})
		// }
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'collector/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
	}

	const columns = [
		{
			title: '分行名称',
			dataIndex: 'branch',
			key: 'branch',
			width: 100,
			render: (text, record) => {
				let typename = maps.get(text)
				return typename
			},
		}, {
			title: '业务类型',
			dataIndex: 'servicetype',
			key: 'servicetype',
			width: 100,
		}, {
			title: '状态信息唯一标识',
			dataIndex: 'statuskey',
			key: 'statuskey',
			width: 250,
		}, {
			title: '状态信息',
			dataIndex: 'statusinfo',
			key: 'statusinfo',
			width: 550,
		},
		{
			title: '操作',
			key: 'operation',
			width: 100,
			// fixed: 'right',
			render: (text, record) => {
				return (<div>
					<Button style={{ marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
					<Button style={{ marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
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
			console.log(`choosed:${choosed}`)
			dispatch({
				type: 'collector/setState',
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
					bordered
					columns={columns}
					dataSource={dataSource}
					loading={loading}
					onChange={onPageChange}
					pagination={pagination}
					simple
					rowKey={record => record.uuid}
					rowSelection={rowSelection}
					size="small"
				/>
			</Col>
		</Row>
	)
}

export default list
