import React from 'react'
import { Row, Col, Button ,Modal} from 'antd'
const confirm = Modal.confirm

const buttonZone = ({ dispatch, choosedRows, batchDelete }) => {

	const issue = () => {
		confirm({
			title: '您确定要批量下发这些记录吗?',
			onOk() {
				dispatch({
					type: 'clusterRule/issue',
					payload: choosedRows,
				})
			},
		})
	}

	const check = () => {
		let aa = []
		choosedRows.forEach(element => {
			aa.push(element.clusterName)
		});
		confirm({
			title: '您确定要批量校验这些记录吗?',
			onOk() {
				dispatch({
					type: 'clusterRule/check',
					payload: {
						q:`clustername=${aa.join(';')}`,
						filename:'规则校验'
					},
				})
			},
		})
	}

	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" disabled={!batchDelete} onClick={issue}>规则下发</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="primary" disabled={!batchDelete} onClick={check}>规则校验</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
