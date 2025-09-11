import React from 'react'
import { Modal, Row, Col, Button } from 'antd'
import { myCompanyName } from '../../../utils/config'

const confirm = Modal.confirm

const buttonZone = ({ dispatch, batchDelete, selectedRows }) => {
	const onAdd = () => {
		dispatch({
			type: 'userinfo/rolequery',
			payload: {},
		})
		dispatch({
			type: 'userinfo/updateState',
			payload: {
				createKey: new Date().getTime(),
				roleUUIDs: [],
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				timeList: [{
					name: '', createdTime: '', createdBy: '', uuid: '',
				}],
				treeData: [{ label: '', value: '', key: '' }],
			},
		})
	}

	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.uuid))
				dispatch({
					type: 'userinfo/delete',
					payload: ids,
				})
			},
		})
	}
	const onAuthAdd = () => {
		confirm({
			title: '您确定要给这些用户增加光大通权限吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.username))
				dispatch({
					type: 'userinfo/authAdd',
					payload: ids,
				})
			},
		})
	}
	const onAuthDelete = () => {
		confirm({
			title: '您确定要给这些用户取消光大通权限吗?',
			onOk() {
				let ids = []
				selectedRows.forEach(record => ids.push(record.username))
				dispatch({
					type: 'userinfo/authDelete',
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
				{/* {
					'EBank' === myCompanyName ? <Button size="default" style={{ marginLeft: 8 }} disabled={!batchDelete} onClick={onAuthAdd} icon="plus" >光大家权限</Button> :null
				}
				{
					'EBank' === myCompanyName ?<Button size="default" style={{ marginLeft: 8 }} disabled={!batchDelete} onClick={onAuthDelete} icon="minus" >光大家权限</Button>:null
				} */}
			</Col>
		</Row>
	)
}

export default buttonZone
