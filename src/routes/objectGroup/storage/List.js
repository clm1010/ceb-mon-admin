import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import _columns from './Columns'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, q, firstClass, secondClass, thirdClass,
}) {
	const user = JSON.parse(sessionStorage.getItem('user'))
	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = true
		}
	}
	//每次都会重新复制一套列配置，然后追加操作列。避免重复追加
	let columns = [..._columns]
	columns.push({
		title: '操作',
		width: 85,
		fixed: 'right',
		render: (text, record) => {
			return (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				<Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
				{disPower ? <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} /> : null}
			</div>)
		},
	})

	const onDeletes = (record) => {
		let uuid = []
		uuid.push(record.mo.uuid)
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk() {
				dispatch({
					type: 'storages/remove',
					payload: {
						uuid,
					},
				})
			},
		})
	}

	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'storages/findById',
			payload: {
				item: record,
			},
		})
		dispatch({
			type: 'storages/setState',
			payload: {
				c1: '',
			},
		})
		dispatch({
			type: 'storages/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
			}
		})
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'storages/query',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q,
				firstClass,
				secondClass,
				thirdClass,
			},
		})
		dispatch({
			type: 'storages/setState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
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
					type: 'storages/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'storages/setState',				//@@@
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
					scroll={{ x: 1200 }}
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
