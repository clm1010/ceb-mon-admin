import React from 'react'
import { Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, batchDelete, selectedRows }) => {
	const onAdd = () => {
		dispatch({
			type: 'roles/updateState',
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
        onOk () {
        	let ids = []
        	selectedRows.forEach(record => ids.push(record.uuid))
          dispatch({
		        type: 'roles/delete',
		        payload: ids,
		      })
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
