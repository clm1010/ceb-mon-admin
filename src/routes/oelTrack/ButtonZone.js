import React from 'react'
import { Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, choosedRows }) => {

	const onAdd = () => {
		dispatch({
			type: 'oelTrack/setState',
			payload: {
				addModalvisible: true,
			},
		})
	}
	const onDelete = () => {
		confirm({
			title: '您确定要批量停止这些告警吗?',
			onOk () {
				let ids = []
				choosedRows.forEach(record => ids.push(record))
				dispatch({
					type: 'oelTrack/delete',
					payload: ids,
				})
			},
		})
	}

	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
		<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} >新增</Button>
		<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete}>批量停止跟踪</Button>
    </Col>
  </Row>
	)
}

export default buttonZone
