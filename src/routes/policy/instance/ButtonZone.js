import React from 'react'
import { Modal, Row, Col, Icon, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({
 dispatch, batchDelete, choosedRows, expand,
}) => {
	const onDelete = () => {
		//choosedRows.forEach((item) => {
		confirm({
		   title: '您确定要批量删除这些记录吗?',
			onOk () {
			  let ids = []
				choosedRows.forEach(record => ids.push(record.policy.uuid))
			 	dispatch({
					type: 'policyInstance/delete',
					payload: ids,
				})
			},
		})
		//})
	}

	const toggle = () => {
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				expand: !expand,
			},
		})
	}

	return (
  <Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
    <Col lg={24} md={24} sm={24} xs={24}>
      <a onClick={toggle}>
        <Icon type={expand ? 'caret-left' : 'caret-right'} style={{ fontSize: 8, color: '#333' }} />
      </a>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDelete}>批量删除</Button>
    </Col>
  </Row>
	)
}

export default buttonZone
