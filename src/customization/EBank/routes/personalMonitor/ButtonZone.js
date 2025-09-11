import React from 'react'
import { Modal, Row, Col, Icon, Button } from 'antd'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, batchDelete, choosedRows, expand, q }) => {
	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				choosedRows.forEach(record => ids.push(record))
				dispatch({
					type: 'personalMonitor/delete',
					payload: ids,
				})
			},
		})
	}
	const onAdd = () => {
		dispatch({type:'personalMonitor/queryTag',payload:{}})
        dispatch({type:'personalMonitor/queryIndicator',payload:{}})
		dispatch({
			type: 'personalMonitor/updateState',
			payload: {
				modalVisible:true,
				modalType: 'create',
				currentItem: {},
			},
		})
	}
	const toggle = () => {
		dispatch({
			type: 'personalMonitor/updateState',
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
				<Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd} >新增</Button>
				<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
			</Col>
		</Row>
	)
}

export default buttonZone
