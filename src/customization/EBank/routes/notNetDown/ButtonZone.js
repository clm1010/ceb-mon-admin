import React from 'react'
import { Row, Col, Modal, Button, Checkbox } from 'antd'
import { message } from 'antd'
const confirm = Modal.confirm
const buttonZone = ({ dispatch, batchDelete, choosedRows, oper, onIssueForbid }) => {
	const onDown = () => {
		let flag = ''
		let criteria = ''
		let newdata = {}
		choosedRows.forEach((element) => {
			if (element.instance.issueStatus == 'SUSSCE') {
				flag = 1
			}
			criteria += `uuid == ${element.instance.uuid} or `
		})
		criteria = criteria.substr(0, criteria.length - 4)
		newdata.criteria = criteria
		newdata.oper = oper
		if(flag == 1 ){
			message.error('	请勾选状态为待下发或者失败的记录!')
		}else{
			confirm({
				title: '您确定要下发这些记录吗?',
				onOk() {
					dispatch({
						type: 'notNetDown/issue',
						payload: newdata,
					})
				},
			})
		}
	}
	const onChange = (e)=>{
		if(e.target.checked){
			dispatch({
				type: 'notNetDown/updateState',
				payload: {
					oper:1
				},
			})
		}else{
			dispatch({
				type: 'notNetDown/updateState',
				payload: {
					oper:0
				},
			})
		}

	}

	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete || onIssueForbid} onClick={onDown}>下发</Button>
				<Checkbox  style={{ marginLeft: 8 }} size="default" onChange={onChange}>重启Nagios</Checkbox>
			</Col>
		</Row>
	)
}

export default buttonZone
