import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, Button } from 'antd'
//import { DropOption } from '../../../components'
import _columns from './Columns'
import { Link } from 'dva/router'
import moment from 'moment'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, batchDelete, selectedRows, secondClass, q, sortInfo
}) {
	const user = JSON.parse(sessionStorage.getItem('user'))
	let onPower = user.roles
	let disPower = false
	for (let a = 0; a < onPower.length; a++) {
		if (onPower[a].name == '超级管理员') {
			disPower = true
		}
	}

	//每次都会重新复制一套列配置，然后追加操作列。避免重复追加
	let columns = [..._columns(sortInfo)]
	columns.push({
		title: '操作',
		width: 90,
		fixed: 'right',
		render: (text, record) => {
			return (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
				<Button size="small" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
				<Button size="small" type="ghost" shape="circle" icon="desktop" onClick={() => onPreview(record)} />
				{disPower ? <Button size="small" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} /> : null}
			</div>)
		},
	})

	const onPreview = (record) => {
		window.open(`/rulespreview?ids=${record.uuid}&branches=${record.branchName}`, `${record.uuid}`, '', 'false')
	}

	const onDeletes = (record) => {
		let titles = '您确定要删除这条记录吗?'
		confirm({
			title: titles,
			onOk() {
				dispatch({
					type: 'interfacer/delete',				//@@@
					payload: record,
				})
			},
		})
	}

	const onPageChange = (page, filters, sorter) => {
		let thisSortInfo = { // clean state
			columnKey: '',
			order: ''
		}
		if (!sorter.order && sorter.columnKey) {

		} else if (!sorter.order && !sorter.columnKey) {
			thisSortInfo = sortInfo
		} else {
			thisSortInfo = sorter
		}
		dispatch({
			type: 'interfacer/query',
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
				pageSize: page.pageSize,
				firstClass: 'NETWORK',
				secondClass,
				thirdClass: 'NET_INTF',
				q: q === undefined ? '' : q,
				// sort: `${sorter.columnKey},${sort}`,
				sortInfo: thisSortInfo
			},
		})
		dispatch({
			type: 'interfacer/setState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	//修改列表页表格中操作部分按钮---start
	const onEdit = (record) => {
		dispatch({
			type: 'interfacer/findById',				//@@@
			payload: {
				currentItem: record,
				modalType: 'update',
				modalVisible: true,
				alertType: 'info',
				alertMessage: '请输入接口信息',				//@@@
			},
		})
		dispatch({
			type: 'interfacer/appcategories',
			payload: {
				q: 'affectSystem=="网络|*"'
			}
		})
	}

	const onSee = (record) => {
		dispatch({
			type: 'interfacer/queryEquipment',
			payload: {
				q: `firstClass == '${record.firstClass}';secondClass == '${record.secondClass}';discoveryIP== '${record.discoveryIP}'`,
				pageSize: 1,
			},
		})
		dispatch({
			type: 'interfacer/setState',
			payload: {
				equipmentSecondClass: record.secondClass,
			},
		})
	}

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let choosed = []
			selectedRows.forEach((object) => {
				choosed.push = object.id
			})
			if (selectedRows.length > 0) {
				dispatch({
					type: 'interfacer/setState',				//@@@
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'interfacer/setState',				//@@@
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
		},
	}
	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				<Table
					scroll={{ x: 8250, y: 650 }}
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
