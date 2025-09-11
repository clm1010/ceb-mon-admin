import React from 'react'
import { Table, Modal, Row, Col, Button, Alert } from 'antd'
import _columns from './Columns'
import { DropOption } from '../../components'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, location, batchDelete, selectedRows, user, q, alarmApplyFilter,
}) {
	let columns = [..._columns]
	columns.push({
		title: '操作',
		width: 120,
		fixed: 'right',
		render: (text, record) => {
			return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '克隆' }, { key: '4', name: '删除' }]} />
		},
	})

	const handleMenuClick = (record, e) => {
		if (e.key === '1') {
			initData(record, 'see')
			dispatch({
				type: 'notification/setState',
				payload: {
					modalType: 'update',
					alertType: 'info',
					alertMessage: '请输入规则信息',
					see: 'yes',
					TransferState: true,
				},
			})
		} else if (e.key === '2') {
			initData(record, 'update')
			dispatch({
				type: 'notification/setState',
				payload: {
					modalType: 'update',
					alertType: 'info',
					alertMessage: '请输入规则信息',
					TransferState: true,
				},
			})
		} else if (e.key === '3') {
			initData(record, 'copy')
			dispatch({
				type: 'notification/setState',
				payload: {
					modalType: 'copy',
					alertType: 'info',
					alertMessage: '请输入规则信息',
					TransferState: true,
				},
			})
		} else if (e.key === '4') {
			let titles = '您确定要删除这条记录吗?'
			let uuids = []
			uuids.push(record.uuid)
			if (record.intfNum && record.intfNum !== 0) {
				titles = `该设备绑定了${record.intfNum}个接口，是否删除？`
			}
			confirm({
				title: titles,
				onOk() {
					dispatch({
						type: 'notification/delete',				//@@@
						payload: {
							uuid: uuids,
						},
					})
				},
			})
		}
	}
	const initData = (record, type) => {
		dispatch({
			type: 'notification/findById',				//@@@
			payload: {
				uuid: record.uuid,
			},
		})
		dispatch({
			type: 'notification/queryUserInfo',
			payload: {
				q: `username==${record.createdBy}`,
			},
		})
		dispatch({
			type: 'notification/queryUser',
			payload: {
				q: '',
				//(user.branch === undefined || user.branch==='' || user.branch==='ZH' || user.branch === 'QH')?'':`branch == '${user.branch}'`,
			},
		})
		// dispatch({
		// 	type: 'notification/queryApp',
		// 	payload: {
		// 		page: 0,
		// 		pageSize: 9999,
		// 	},
		// })
		dispatch({
			type: 'moSelect/setState',
			payload: {
				externalFilter: record.branch === 'QH' ? '' : `branchName == '*${record.branch}*'`,
				options: [],
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
					type: 'notification/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'notification/setState',				//@@@
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
		},
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'notification/query',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q,
			},
		})
		dispatch({
			type: 'notification/setState',
			payload: {
				keys: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}
	let texts = []
	let infos = ''
	for (let filter of alarmApplyFilter) {
		if (filter.resource === '/api/v1/notification_rules') { //通知
			for (let info of filter.filterItems) {
				texts.push(`${info.field} ${info.op} ${info.value} ${info.logicOp === undefined ? '' : info.logicOp}`)
			}
		}
	}
	if (texts.length > 0) {
		infos = `当前用户通知规则处理告警范围: ${texts.join(' ')}`
	} else {
		infos = '当前用户通知规则处理告警范围: 全部告警'
	}

	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				{
					user.branch === undefined ? null : <div><Alert message={infos} type="info" showIcon /><br /></div>
				}
				<Table
					scroll={{ x: 600 }}
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
