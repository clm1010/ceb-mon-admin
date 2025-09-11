import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Icon, Button, Upload } from 'antd'
import { Link } from 'dva/router'
import moment from 'moment'

const confirm = Modal.confirm
const ButtonGroup = Button.Group

function buttonZone({
	dispatch, loading, batchDelete, selectedRows,
}) {
	const user = JSON.parse(sessionStorage.getItem('user'))
	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = true
		}
	}
	const onAdd = () => {
		dispatch({
			type: 'interfacer/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
			}
		})
		dispatch({
			type: 'interfacer/setState',				//@@@
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				createMethodValue: '自动',
				alertType: 'info',
				alertMessage: '请输入接口信息',				//@@@
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
					type: 'interfacer/deleteAll',				//@@@
					payload: ids,
				})
			},
		})
	}

	//批量下发预览
	const onRulePreview = () => {
		let ids = []
		let branches = []
		selectedRows.forEach((record) => {
			ids.push(record.uuid)
			branches.push(record.branchName)
		})
		window.open(`/rulespreview?ids=${ids}&branches=${branches}`, '批量下发预览', '', 'false')
	}


	return (
		<Row gutter={24} style={{ marginTop: 8, marginBottom: 8 }} >
			<Col lg={24} md={24} sm={24} xs={24}>
				{
					disPower ?
						<>
							<Button type="primary" onClick={onAdd}>新增</Button>
							<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
							<Button disabled={!batchDelete} onClick={onRulePreview}>批量下发预览</Button>
						</>
						:
						null
				}
			</Col>
		</Row>
	)
}

export default buttonZone
