import React from 'react'
import { Row, Col, Modal, Button, Upload, Icon } from 'antd'
import { message } from 'antd'

const buttonZone = ({ dispatch}) => {

	const onAdd = () => {
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				showConditionVisible:true
			},
		})
	}

	const onDict = () => {
		dispatch({
			type: 'flinkComputPlat/getDict',
			payload: {
				page: 1,
				level: 1
			},
		})
		dispatch({
			type: 'flinkComputPlat/setState',
			payload: {
				dictModalVisible: true,
			},
		})
	}
	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button size="default" type="primary" onClick={onDict} >字典表</Button>

				<Button size="default" type="ghost" onClick={onAdd} style={{ marginLeft: 10 }}>新增</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
