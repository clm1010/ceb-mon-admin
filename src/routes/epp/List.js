import React from 'react'
import { Table, Modal, Row, Col, Button } from 'antd'
import { Link } from 'dva/router'
import fenhang from '../../utils/fenhang'
import timestamp2date from '../../utils/FunctionTool'
import './ellipsis.css'

let Fenhangmaps = new Map()
fenhang.forEach((obj, index) => {
	Fenhangmaps.set(obj.key, obj.value)
})

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
}) {
	const onAdd = () => {
		dispatch({
			type: 'epp/showModal',
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
			type: 'epp/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q: q === undefined ? '' : q,
			},
		})
		dispatch({
			type: 'epp/showModal',
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
					type: 'epp/delete',
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
			type: 'epp/queryMos',
			payload: {
				uuid,
				relatedType: 'epp_INST',
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'epp/showModal',
			payload: {
				eppInstUUIDMos: uuid,
				eppMosNumber: policyCount,
				mosVisible: true,
			},
		})
	}
	const onEdit = (record) => {
		dispatch({
			type: 'epp/getEppById',
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
					type: 'epp/delete',
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
			title: '分支机构',
			dataIndex: 'branch',
			key: 'branch',
			render: (text, record) => {
				return Fenhangmaps.get(text)
			},
		}, {
			title: 'epp类型',
			dataIndex: 'eppType',
			key: 'eppType',
		}, {
			title: '创建时间',
			dataIndex: 'createdTime',
			key: 'createdTime',
			width: 160,
			render: (text, record, index) => {
				return `${new Date(text).format('yyyy-MM-dd hh:mm:ss')}`
			},

		}, {
			title: '修改时间',
			dataIndex: 'updatedTime',
			key: 'updatedTime',
			width: 160,
			render: (text, record, index) => {
				return `${new Date(text).format('yyyy-MM-dd hh:mm:ss')}`
			},

		}, {
			title: '自定义读取速率',
			dataIndex: 'readRate',
			key: 'readRate',
		}, {
			title: '自定义处理并发数',
			dataIndex: 'processParallel',
			key: 'processParallel',
		}, {
			title: '自定义持久化并发数',
			dataIndex: 'persistentParallel',
			key: 'persistentParallel',
		}, {
			title: '当前读取速率',
			dataIndex: 'curReadRate',
			key: 'curReadRate',
		}, {
			title: '当前并发数',
			dataIndex: 'curProcessParallel',
			key: 'curProcessParallel',
		}, {
			title: '当前持久化并发数',
			dataIndex: 'curPersistentParallel',
			key: 'curPersistentParallel',
		},
		//     {
		// 	title: '所属机构',
		// 	dataIndex: 'branch',
		// 	key: 'branch',
		// 	render: (text, record) => {
		// 		let typename = maps.get(text)
		// 		return typename
		// 	},
		// },
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

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let choosed = []
			selectedRows.forEach((object) => {
				choosed.push(object.uuid)
			})
			console.log(`choosed:${choosed}`)
			dispatch({
				type: 'epp/switchBatchDelete',
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
