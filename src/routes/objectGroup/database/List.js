import React from 'react'
import { Table, Row, Col, Button, Modal, Badge } from 'antd'
import _columns from './Columns'
const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, batchDelete, selectedRows, controllerNumber, q,
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
	for (let column of columns) {
		if (column.key === 'relatedPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => openPolicyModal(record, e, 'ALL')}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
			}
		}
		else if (column.key === 'issuedPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => { openPolicyModal(record, e, 'ISSUED') }}> <Badge count={text} style={{ backgroundColor: '#52c41a' }} showZero /></a>
			}
		} else if (column.key === 'unissuedPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => openPolicyModal(record, e, 'UNISSUED')}><Badge count={text} style={{ backgroundColor: 'gray' }} showZero /></a>
			}
		} else if (column.key === 'issueFailedPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => openPolicyModal(record, e, 'ISSUE_FAILED')}><Badge count={text} style={{ backgroundColor: '#f22735' }} showZero /></a>
			}
		} else if (column.key === 'notStdPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => openPolicyModal(record, e, 'NOT_STD')}><Badge count={text} style={{ backgroundColor: '#f8ac30' }} showZero /></a>
			}
		}

	}
	columns.push({
		title: '操作',
		width: 90,
		fixed: 'right',
		render: (text, record) => {
			return (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				<Button size="small" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
				<Button size="small" type="ghost" shape="circle" icon="desktop" onClick={() => onPreview(record)} />
				{disPower ? <Button size="small" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} /> : null}
			</div>)
		},
	})
	const onPreview = (record) => {
		window.open(`/rulespreview?ids=${record.mo.uuid}&branches=${record.mo.branchName}&firstClass=db`, `${record.mo.uuid}`, '', 'false')
	}
	const onDeletes = (record) => {
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk() {
				dispatch({
					type: 'database/delete',				//@@@
					payload: record.mo,
				})
			},
		})
	}

	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'database/findById',				//@@@
			payload: {
				currentItem: record.mo,
				firstClass: 'DB',				//@@@
				modalType: 'update',
				modalVisible: true,
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入数据库信息',				//@@@
			},
		})
		dispatch({
			type: 'database/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
			}
		})
	}
	const openPolicyModal = (record, e, type) => {
		dispatch({
			type: 'policyList/queryPolicy',
			payload: {
				uuid: record.mo.uuid,
				policyType: type,

			},
		})
		dispatch({
			type: 'policyList/setState',
			payload: {
				modalPolicyVisible: true,
				openPolicyType: type,
				policyInstanceId: record.mo.uuid,
			},
		})
	}
	const onPageChange = (page) => {
		dispatch({
			type: 'database/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'database/setState',
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
					type: 'database/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'database/setState',				//@@@
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
					scroll={{ x: 1800 }}
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
