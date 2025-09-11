import React from 'react'
import { Table, Row, Col, Button, Modal, Badge } from 'antd'
import _columns from './Columns'
import { Link } from 'dva/router'

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
		window.open(`/rulespreview?ids=${record.mo.uuid}&branches=${record.mo.branchName}`, `${record.mo.uuid}`, '', 'false')
	}

	for (let column of columns) {
		if (column.key === 'relatedPolicyInstances') {
			column.render = (text, record) => {
				return <a onClick={e => openPolicyModal(record, e, 'ALL')}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
			}
		}
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

	const onDeletes = (record) => {
		Modal.confirm({
			title: '您确定要删除这条记录吗?',
			onOk() {
				dispatch({
					type: 'branchIp/delete',				//@@@
					payload: record.mo,
				})
			},
		})
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'branchIp/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'branchIp/setState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'branchIp/findById',				//@@@
			payload: {
				currentItem: record.mo,
				secondClass: 'BRANCH_IP',				//@@@
				modalType: 'update',
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入网点IP信息',				//@@@
			},
		})
		dispatch({
			type: 'branchIp/setState',
			payload: {
				modalType: 'update',
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入网点IP信息',
			},
		})
		dispatch({
			type: 'branchIp/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
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
					type: 'branchIp/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'branchIp/setState',				//@@@
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
