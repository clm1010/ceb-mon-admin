import React from 'react'
import { Modal, Row, Col, Icon, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({
 dispatch, batchDelete, choosedRows, expand,
}) => {
	const onDelete = () => {
		confirm({
		   title: '您确定要批量删除这些记录吗?',
			onOk () {
			  let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
			 	dispatch({
					type: 'label/delete',
					payload: ids,
				})
			},
		})
	}
	const onEnable = () => {
		confirm({
		   title: '您确定要批量启用这些记录吗?',
			onOk () {
			  let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
			 	dispatch({
					type: 'label/enable',
					payload: ids,
				})
			},
		})
	}
	const onDisable = () => {
		confirm({
		   title: '您确定要批量禁用这些记录吗?',
			onOk () {
			  let ids = []
				choosedRows.forEach(record => ids.push(record.uuid))
			 	dispatch({
					type: 'label/disable',
					payload: ids,
				})
			},
		})
	}
	const onAdd = () => {
		dispatch({
			type: 'label/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
			},
		})
	}
	const toggle = () => {
		dispatch({
			type: 'label/updateState',
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
	  <Button size="default" type="primary" onClick={onAdd} >新增</Button>
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDelete}>批量删除</Button>
	  <Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onEnable}>批量启用</Button>
	  <Button style={{ marginLeft: 8 }} size="default" type="ghost" disabled={!batchDelete} onClick={onDisable}>批量禁用</Button>
    </Col>
  </Row>
	)
}

export default buttonZone
