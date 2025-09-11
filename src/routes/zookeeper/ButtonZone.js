import React from 'react'
import { Modal, Row, Col, Button, message } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, dataSource, batchDelete, selectedRows }) => {
	const onAdd = () => {
		dispatch({
			type: 'zookeeper/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
			},
		})
	}

	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.uuid))
				let uuid
				dataSource.forEach(item => {
					if (item.mainCluster == true) {
						uuid = item.uuid
					}
				});
				if (ids.includes(uuid)) {
					message.info('请更新其他集群信息为主集群后再次删除')
				} else {
					dispatch({
						type: 'zookeeper/delete',
						payload: ids,
					})
				}
			},
		})
	}

	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button size="default" type="primary" style={{ marginLeft: 8 }} onClick={onAdd}>新增</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDelete}>批量删除</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
