import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, choosedRows, q,
}) {
	const onPageChange = (page) => {
		dispatch({
			type: 'personalMonitor/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'personalMonitor/updateState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => <div title={text}>{text}</div>,
		},
		{
			title: '类型',
			dataIndex: 'category',
			key: 'category',
			render: (text, record) => {
				let categoryName
				switch (record.category) {
					case "STANDARD":
						categoryName = "标准指标"
						break;
					case "SPECIAL":
						categoryName = "个性化指标"
						break;
					case "RATIO":
						categoryName = "同环指标"
						break;
					case "AGGREGATION":
						categoryName = "全域指标汇聚"
						break;
					default:
						break;
				}
				return categoryName
			}
		}, {
			title: '命名空间',
			dataIndex: 'namespace',
			key: 'namespace',
			//end
		}, {
			title: '服务',
			dataIndex: 'service',
			key: 'service',
		}, {
			title: '指标',
			dataIndex: 'indicator',
			key: 'indicator',
		}, {
			title: '标签',
			dataIndex: 'tags',
			key: 'tags',
			render: (text, record) => {
				if (record.tags[0] && record.tags[0].name) {
					return record.tags[0].name
				}
				return ''
			}
		}, {
			title: '规则',
			dataIndex: 'promql',
			key: 'promql',
		},
		{
			title: '操作',
			width: 100,
			fixed: 'right',
			render: (text, record) => {
				return (<div>
					<Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
					<Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
				</div>)
			},
		},
	]
	const onEdit = (record) => {
		dispatch({type:'personalMonitor/queryTag',payload:{}})
        dispatch({type:'personalMonitor/queryIndicator',payload:{}})
		dispatch({
			type: 'personalMonitor/updateState',
			payload: {
				modalType: 'update',
				currentItem: record,
				modalVisible: true,
				paramTag:record.tags[0]
			},
		})
	}
	const onDeletes = (record) => {
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk() {
				let ids = []
				ids.push(record.uuid)
				dispatch({
					type: 'personalMonitor/delete',
					payload: ids,
				})
			},
		})
	}

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let choosed = []
			selectedRows.forEach((object) => {
				choosed.push(object.uuid)
			})
			dispatch({
				type: 'personalMonitor/updateState',
				payload: {
					choosedRows: choosed,
					batchDelete: choosed.length > 0,
				},
			})
		},
	}


	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				<Table
					scroll={{ x: 980 }} //滚动条
					bordered
					columns={columns}
					dataSource={dataSource}
					loading={loading}
					onChange={onPageChange}
					pagination={pagination}
					simple
					rowKey={record => record.uuid}
					size="small"
					rowSelection={rowSelection}
				/>
			</Col>
		</Row>
	)
}

export default list
