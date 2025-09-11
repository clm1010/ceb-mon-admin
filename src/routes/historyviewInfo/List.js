import React from 'react'
import { Table, Row, Col, Button, Badge, Tooltip, Menu, Dropdown, Icon,message } from 'antd'
import _columns from './Columns'
import ResizTable from './ResizTable'

function List({
	location, dispatch, pagination, dataSource, loading, q, CustomColumns, ColumState, initColumState,saveCulumFlag
}) {
	//发送工单
	const sendWorkOrder = (e, data) => {
		const currentItem = e
		if (currentItem.N_TicketId !== undefined && currentItem.N_TicketId !== '') {
			message.warning('此告警已被发送过工单，不能再次发送。')
		} else {
			dispatch({
				type: 'historyview/setState',
				payload: {
					workOrderVisible: true,
					currentItem,
				},
			})
		}
	}
	let columns = ColumState ? [...CustomColumns] : [..._columns]

	columns.push({
		title: '操作',
		// width: 60,
		render: (text, record) => {
			const menu = (
				<Menu onClick={() => handleMenuClick(record)}>
					<Menu.Item key="oda">
						<Icon type="solution" />
						告警根因推荐
					</Menu.Item>
				</Menu>
			);
			return (
				<Dropdown overlay={menu} placement="bottomLeft">
					<Button>工具</Button>
				</Dropdown>
			)
		},
	})

	const colOperation = (cols) => {
		if (cols != undefined) {
			for (let col of cols) {
				if (col.dataIndex === 'n_CustomerSeverity') {
					col.render = (text, record) => {
						let info = ''
						if (text === 1) {
							info = <div><Badge count={1} style={{ backgroundColor: '#C50000' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
						} else if (text === 2) {
							info = <div><Badge count={2} style={{ backgroundColor: '#B56300' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
						} else if (text === 3) {
							info = <div><Badge count={3} style={{ backgroundColor: '#CDCD00' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
						} else if (text === 4) {
							info = <div><Badge count={4} style={{ backgroundColor: '#4F94CD' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
						} else if (text === 100 || text === 5) {
							info = <div><Badge count={5} style={{ backgroundColor: '#68228B' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
						}
						return info
					}
				}
				if (col.dataIndex === 'firstOccurrence' || col.dataIndex === 'lastOccurrence' || col.dataIndex ==='lastModified') {
					col.render = (text, record) => {
						return new Date(text).format('yyyy-MM-dd hh:mm:ss')
					}
				}
				if (col.dataIndex === 'n_RecoverType' || col.dataIndex === 'n_RecoverType') {
					col.render = (text, record) => {
						let info = ''
						if (text === '0') {
							info = '否'
						} else if (text === '1') {
							info = '是'
						}
						return info
					}
				}
			}
		}
	}

	colOperation(columns)

	const handleMenuClick = (record) => {
		let AlarmID = record.oz_AlarmID
		dispatch({
			type: 'historyview/getRecommendAddres',
			payload: {
				AlarmID
			},
		})
	}
	//每一行的双击事件
	const onRowDoubleClick = (record, index, event) => {
		dispatch({
			type: 'historyview/setState',
			payload: {
				rowDoubleVisible: true,
				selectInfo: record,
				severitySql: `rsPK.serverName=='${record.serverName}';rsPK.serverSerial=='${record.serverSerial}'`,
				sortSql: 'rsPK.startDate,desc',
				journalSql: `rjPK.serverName=='${record.serverName}';rjPK.serverSerial=='${record.serverSerial}'`,
				detailsSql: `alarmId=cs='${record.oz_AlarmID}'`, //${record.serverName}_${record.serverSerial}//后台加了字段改变参数
				//detailsSql: `alarmId=='${record.oz_AlarmID}'`, //${record.serverName}_${record.serverSerial}//后台加了字段改变参数 EGroup
				defaultKey: new Date().getTime(),
			},
		})
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'historyview/queryHistoryview',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q,
			},
		})
	}

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let choosed = selectedRows.map(v => v.oz_AlarmID)

			if (selectedRows.length > 0) {
				dispatch({
					type: 'historyview/setState',
					payload: {
						batchMaintain: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'historyview/setState',
					payload: {
						batchMaintain: false,
						selectedRows,
					},
				})
			}
		},
	}

	return (
		<div>
			<Row>
				<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
					<ResizTable
						dispatch={dispatch}
						initColumState = {initColumState}
						saveCulumFlag = {saveCulumFlag}
						ColumState = {ColumState}
						columns={columns} //表结构字段
						dataSource={dataSource} //表数据
						bordered
						onRowDoubleClick={onRowDoubleClick}
						pagination={pagination} //分页配置
						onChange={onPageChange}
						simple
						size="small"
						loading={loading}
						rowSelection={rowSelection}
						timeStamp={new Date().getTime()}
					/>
				</Col>
			</Row>
		</div>
	)
}

export default List
