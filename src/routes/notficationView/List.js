import React from 'react'
import { Table, Row, Col, Button,Alert } from 'antd'
import columns from './Columns'

const list = ({
	dispatch, loading, dataSource, pagination, q
}) => {
	const onSee = (record) => {
		let uuid = typeInfo(record.notificationRuleUUIDs)
		dispatch({
			type: 'notficationView/findRulesById',
			payload: {
				uuid,
			},
		})
		dispatch({
			type: 'notficationView/queryUser',
			payload: {
				q: '',
			},
		})
		dispatch({
			type: 'notficationView/queryApp',
			payload: {
				page: 0,
				pageSize: 9999,
			},
		})
	}

	const typeInfo = (value) => {
		return `${value.substring(0, 8)}-${value.substring(8, 12)}-${value.substring(12, 16)}-${value.substring(16, 20)}-${value.substring(20)}`
	}

	let tableColumns = [...columns]
	tableColumns.push({
		title: '操作',
		width: 50,
		fixed: 'right',
		render: (text, record) => {
			return (<div>
				<Button style={{ float: 'left' }} size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onSee(record)} />
			</div>)
		},
	})

	const onPageChange = (page) => {
		dispatch({
			type: 'notficationView/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
	}

	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				<Table
					scroll={{ x: 4050 }}
					bordered
					columns={tableColumns}
					dataSource={dataSource}
					loading={loading}
					onChange={onPageChange}
					pagination={pagination}
					simple
					rowKey={record => record.uuid}
					size="small"
				/>
			</Col>
		</Row>
	)
}

export default list
