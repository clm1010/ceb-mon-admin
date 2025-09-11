import React from 'react'
import { Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, dataSource }) => {
	const onSeave = () => {
		confirm({
			title: `您确定要保存当前选择的${dataSource.length}条监控实例吗?`,
			onOk() {
				dispatch({
					type: 'rulesPreview/seave',
					payload: dataSource,
				})
			},
		})
	}
	const onDown = () => {
		confirm({
			title: '您确定要下发这些记录吗?',
			onOk() {
				dispatch({
					type: 'rulesPreview/issue',
					payload: dataSource,
				})
			},
		})
	}

	return (
		<Row gutter={24} style={{ marginTop: 8, marginRight: 18 }} >
			<Col style={{ float: 'right' }}>
				<Button style={{ marginLeft: 4 }} size="default" type="ghost" onClick={onSeave}>保存监控实例</Button>
			</Col>
			<Col style={{ float: 'right' }}>
				<Button size="default" type="primary" onClick={onDown}>下发</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
