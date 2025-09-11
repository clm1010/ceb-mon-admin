import React from 'react'
import { Table, Modal, Row, Col, message } from 'antd'
import { DropOption } from '../../components'
import fenhang from '../../utils/fenhang'

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
			type: 'zookeeper/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'zookeeper/updateState',
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
			dispatch({
				type: 'zookeeper/updateState',
				payload: {
					modalType: 'see',
					currentItem: record,
					modalVisible: true,
				},
			})
		} else if (e.key === '2') { //编辑
			dispatch({
				type: 'zookeeper/findById',
				payload: {
					currentItem: record,
				},
			})
			dispatch({
				type: 'zookeeper/updateState',
				payload: {
					modalType: 'update',
					modalVisible: true,
				},
			})
		} else if (e.key === '3') {
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk() {
					// 若当前记录mainCluster为true，则提示：“请更新其他集群信息为主集群后再次删除”
					if (record.mainCluster == true) {
						message.info('请更新其他集群信息为主集群后再次删除')
					} else {
						let ids = []
						ids.push(record.uuid)
						//获取mainCluster为true的uuid

						dispatch({
							type: 'zookeeper/delete',
							payload: ids,
						})
					}
				},
			})
		}
	}

	const columns = [
		{
			title: '集群地址',
			dataIndex: 'address',
			key: 'address',
		}, {
			title: '主备状态',
			dataIndex: 'mainCluster',
			key: 'mainCluster',
			render: (text, record) => {
				let mainClustername = '主集群'
				if (record.mainCluster === true) {
					mainClustername = '主集群'
				} else if (record.mainCluster === false) {
					mainClustername = '备集群'
				}
				return mainClustername
			},
		}, {
			title: '分组信息',
			dataIndex: 'groupInfo',
			key: 'groupInfo',
		},{
			title: '集群接口地址',
			dataIndex: 'restfulAddress',
			key: 'restfulAddress',
		}, {
			title: '是否验证',
			dataIndex: 'userPass',
			key: 'userPass',
			render: (text, record) => {
				let isverify = '是'
				if (record.username != null && record.password != null) {
					isverify = '是'
				} else {
					isverify = '否'
				}
				return isverify
			},
		}, {
			title: '创建时间',
			dataIndex: 'createdTime',
			key: 'createdTime',
			render: (text, record) => {
				let time = record.createdTime
				let createdTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
				return createdTime
			},
		}, {
			title: '最后更新时间',
			dataIndex: 'updatedTime',
			key: 'updatedTime',
			render: (text, record) => {
				let time = record.updatedTime
				let updatedTime = new Date(time).format('yyyy-MM-dd hh:mm:ss')
				return updatedTime
			},
		}, {
			title: '最后更新人',
			dataIndex: 'updatedBy',
			key: 'updatedBy',
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
					type: 'zookeeper/updateState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'zookeeper/updateState',
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
		},
	}

	return (
		<Row gutter={24} style={{ marginTop: " 90px" }}>
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
		</Row >
	)
}

export default list
