import React from 'react'
import { Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({
	dispatch, batchDelete, choosedRows, expand,
}) => {
	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				// choosedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'collector/delete',
					payload: choosedRows,
				})
			},
		})
	}

	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDelete}>批量删除</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
