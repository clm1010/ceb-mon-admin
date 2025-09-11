import React from 'react'
import { Table, Modal, Row, Col, Button, Tooltip } from 'antd'
import { Link } from 'dva/router'
import fenhang from '../../utils/fenhang'
import timestamp2date from '../../utils/FunctionTool'

import './ellipsis.css'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
}) {
	const onAdd = () => {
		dispatch({
			type: 'eppPolicy/showModal',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'eppPolicy/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'eppPolicy/showModal',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}


	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				dispatch({
					type: 'eppPolicy/delete',
					payload: choosedRows,
				})
			},
		})
	}

	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

	const openMosModal = (record, e) => {
		let uuid = ''
		let policyCount = 0
		if (record) {
			uuid = record.uuid
			policyCount = record.discoveredMONum
		}

		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'eppPolicy/queryMos',
			payload: {
				uuid,
				relatedType: 'eppPolicy_INST',
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'eppPolicy/showModal',
			payload: {
				eppPolicyInstUUIDMos: uuid,
				eppPolicyMosNumber: policyCount,
				mosVisible: true,
			},
		})
	}
	const onEdit = (record) => {
		dispatch({
			type: 'eppPolicy/getEppPolicyById',
			payload: {
				modalType: 'update',
				currentItem: record,
				modalVisible: true,
				isClose: false,
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
					type: 'eppPolicy/delete',
					payload: ids,
				})
			},
		})
	}
	// render: (text, record) => <Link to={`cfglist/${record.uuid}`}>{text}</Link>,
	//
	const columns = [
		{
			title: 'epp标识',
			dataIndex: 'eppKey',
			key: 'eppKey',
			width: 120,
			render: (text, record) => <div title={text}>{text}</div>,
			sorter: (a, b) => a.name - b.name,
		},
		{
			title: '策略名称',
			dataIndex: 'policyName',
			key: 'policyName',
		}, {
			title: '策略类型',
			dataIndex: 'policyType',
			key: 'policyType',
			render: (text, record) => {
				return (
					<span>{text===1 ? '字符串' : '正则表达式'}</span>
				)
			},
		}, {
			title: '策略表达式',
			dataIndex: 'policyExpression',
			key: 'policyExpression',
		}, {
			title: '开始时间',
			dataIndex: 'startTime',
			key: 'startTime',
			width: 160,
			render: (text, record, index) => {
				return text===0?'':`${new Date(text * 1000).format('yyyy-MM-dd hh:mm:ss')}`
			},

		}, {
			title: '结束时间',
			dataIndex: 'endTime',
			key: 'endTime',
			width: 160,
			render: (text, record, index) => {
				return text===0?'':`${new Date(text * 1000).format('yyyy-MM-dd hh:mm:ss')}`
			},

		}, {
			title: '是否过期',
			dataIndex: 'active',
			key: 'active',
			width: 160,
			render: (text, record) => {
				return (
					<span>{text===1 ? '有效' : '过期'}</span>
				)
			},
		}, {
			title: '描述内容',
			dataIndex: 'descr',
			key: 'descr',
			render: (text, record) => {
				return (
					<Tooltip title={text} placement="topLeft">
						{text}
					</Tooltip>
				)
			},
		}, {
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

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let choosed = []
			selectedRows.forEach((object) => {
				choosed.push(object.uuid)
			})
			console.log(`choosed:${choosed}`)
			dispatch({
				type: 'eppPolicy/switchBatchDelete',
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
