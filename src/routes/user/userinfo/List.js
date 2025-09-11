import React from 'react'
import { Table, Modal, Row, Col } from 'antd'
import { DropOption } from '../../../components'
import fenhang from '../../../utils/fenhang'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, batchDelete, selectedRows, q,
}) {
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

	const onPageChange = (page) => {
		dispatch({
			type: 'userinfo/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'userinfo/updateState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	const handleMenuClick = (record, e) => {
		//查看
		if (e.key === '1') {
			//对更新时间和创建时间处理一下
			if (record.createdTime !== 0) {
				let text = record.createdTime
				record.createdTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (record.updatedTime !== 0) {
				let text = record.updatedTime
				record.updatedTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			let timeList = []
			if (record.roles !== undefined) {
				record.roles.forEach((item) => {
					let role = {
						name: item.name,
						createdTime: item.createdTime,
						createdBy: item.createdBy,
						uuid: item.uuid,
					}
					timeList.push(role)
				})
			} else {
				let role = {
					name: '',
					createdTime: '',
					createdBy: '',
					uuid: '',
				}
				timeList.push(role)
			}
			dispatch({
				type: 'userinfo/rolequery',
				payload: {
				},
			})
			dispatch({
				type: 'userinfo/updateState',
				payload: {
					modalType: 'see',
					currentItem: record,
					modalVisible: true,
					timeList,
					changeValue: record.branch,
					createKey: new Date().getTime(),
				},
			})
		} else if (e.key === '2') { //编辑
			dispatch({
				type: 'userinfo/findById',
				payload: {
					currentItem: record,
				},
			})
		} else if (e.key === '3') {
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk() {
					let ids = []
					ids.push(record.uuid)
					dispatch({
						type: 'userinfo/delete',
						payload: ids,
					})
				},
			})
		}
	}

	const columns = [
		{
			title: '用户ID',
			dataIndex: 'username',
			key: 'username',
		}, {
			title: '用户名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '机构',
			dataIndex: 'branch',
			key: 'branch',
			render: (text, record) => {
				let typename = maps.get(text)
				return typename
			},
		}, {
			title: '部门',
			dataIndex: 'domain',
			key: 'domain',
		}, {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				let statusname = '正常'
				if (record.status == 'ENABLED') {
					statusname = '正常'
				} else if (record.status == 'DISABLED') {
					statusname = '锁定'
				}
				return statusname
			},
		}, {
			title: '光大家权限',
			dataIndex: 'extAuth',
			key: 'extAuth',
			render: (text, record) => record.extAuth ? '是' : '否'
		}, {
			title: '创建时间',
			dataIndex: 'time',
			key: 'time',
			render: (text, record) => {
				let time = record.createdTime
				let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
				return createdTime
			},
		}, {
			title: '操作',
			key: 'operation',
			width: 100,
			render: (text, record) => {
				return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '删除' }]} />
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
					type: 'userinfo/updateState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'userinfo/updateState',
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
