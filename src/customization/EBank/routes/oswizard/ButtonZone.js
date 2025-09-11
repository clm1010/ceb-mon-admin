import React from 'react'
import { Modal, Row, Col, Icon, Button, Upload, message } from 'antd'

const buttonZone = ({ dispatch, expand, q, }) => {

	const upMonitor = () => {
		dispatch({
			type: 'oswizard/updateState',
			payload: {
				drawerVisible:true
			}
		})
	}

	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" icon="arrow-up" onClick={upMonitor} >上监控</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
