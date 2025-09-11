import React from 'react'
import { Table, Modal, Row, Col, Button, Tooltip, Badge, message, notification } from 'antd'

import { Link } from 'dva/router'

const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
}) {
	const onAdd = () => {
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
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
			type: 'stdIndicatorsinfo/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q,
			},
		})
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	const onCopy = () => {
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				modalType: 'copy',
				modalVisibleCopyOrMove: true,
				isClose: false,
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				modalType: 'move',
				modalVisibleCopyOrMove: true,
				isClose: false,
			},
		})
	}

	const onDelete = () => {
		confirm({
			title: '您确定要批量删除这些记录吗?',
			onOk() {
				dispatch({
					type: 'stdIndicatorsinfo/delete',
					payload: choosedRows,
				})
			},
		})
	}

	const openPolicyModal = (record, e) => {
		let uuid = ''
		let policyCount = 0
		if (record) {
			uuid = record.uuid
			policyCount = record.policyInstances
		}


		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'stdIndicatorsinfo/queryPolicies',
			payload: {
				uuid,
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				stdUUIDToPolicy: uuid,
				stdPolicyNumber: policyCount,
				policyVisible: true,
			},
		})
	}

	const openTemplatesModal = (record, e) => {
		let uuid = ''
		let policyCount = 0
		if (record) {
			uuid = record.uuid
			policyCount = record.policyTemplates
		}


		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'stdIndicatorsinfo/queryTemplates',
			payload: {
				uuid,
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				stdUUIDTemplates: uuid,
				stdTemplatesNumber: policyCount,
				templatesVisible: true,
			},
		})
	}


	const openMosModal = (record, e) => {
		let uuid = ''
		let policyCount = 0
		if (record) {
			uuid = record.uuid
			policyCount = record.mos
		}


		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'stdIndicatorsinfo/queryMos',
			payload: {
				uuid,
				relatedType: 'KPI',
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				stdUUIDMos: uuid,
				stdMosNumber: policyCount,
				mosVisible: true,
			},
		})
	}

	const columns = [
		/*{
			title: 'ID',
			dataIndex: 'uuid',
			key: 'uuid',
		},*/{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '值类型',
			dataIndex: 'dataType',
			key: 'dataType',
			width: 60,
			render: (text) => {
				if (text == 'Log') {
					return '日志'
				} else {
					return text
				}
			}
		}, {
			title: '描述',
			dataIndex: 'description',
			key: 'description',
		}, {
			title: '分组',
			dataIndex: 'group',
			key: 'group',
			render: (text, record, index) => {
				let tempval = ''
				if (text && text.length > 0) {
					text.forEach((val) => {
						if (tempval === '') {
							tempval = val.name
						} else {
							tempval = `${tempval},${val.name}`
						}
					})
				}
				return tempval
			},
		}, {
			title: '单位',
			dataIndex: 'unit',
			key: 'unit',
			width: 45,
		}, {
			title: '关联策略模板数量',
			dataIndex: 'policyTemplates',
			key: 'policyTemplates',
			width: 120,
			render: (text, record, index) => {
				return <a onClick={e => openTemplatesModal(record, e)}><Badge count={text} style={{ backgroundColor: '#2592fc' }} showZero /></a>
			},
		}, {
			title: '关联策略实例数量',
			dataIndex: 'policyInstances',
			key: 'policyInstances',
			width: 120,
			render: (text, record, index) => {
				return <a onClick={e => openPolicyModal(record, e)}><Badge count={text} style={{ backgroundColor: '#13c2c2' }} showZero /></a>
			},
		}, {
			title: '关联监控对象数量',
			dataIndex: 'mos',
			key: 'mos',
			width: 120,
			render: (text, record, index) => {
				return <a onClick={e => openMosModal(record, e)}><Badge count={text} style={{ backgroundColor: '#52c41a' }} showZero /></a>
			},
		}, {
			title: '创建者',
			dataIndex: 'createdBy',
			key: 'createdBy',
		}, {
			title: '创建时间',
			dataIndex: 'createdTime',
			key: 'createdTime',
			render: (text, record, index) => {
				return new Date(text).format('yyyy-MM-dd hh:mm:ss')
			},
		}, {
			title: '最后更新者',
			dataIndex: 'updatedBy',
			key: 'updatedBy',
		}, {
			title: '最后更新时间',
			dataIndex: 'updatedTime',
			key: 'updatedTime',
			render: (text, record, index) => {
				return new Date(text).format('yyyy-MM-dd hh:mm:ss')
			},
		},
		{
			title: '操作',
			width: 120,
			fixed: 'right',
			render: (text, record) => {
				return (<div>
					<Button size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onSee(record)} />
					<Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
					<Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
				</div>)
			},
		},
	]
	const onEdit = (record) => {
		dispatch({
			type: 'stdIndicatorsinfo/findById',
			payload: {
				record,
			},
		})
	}

	const onSee = (record) => {
		dispatch({
			type: 'stdIndicatorsinfo/findById',
			payload: {
				record,
			},
		})
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				see: 'yes',
			},
		})
	}
	const onDeletes = (record) => {
		dispatch({
			type: 'stdIndicatorsinfo/queryZabbixItem',
			payload: record,
			callback: (res) => {
				if (res.success && res.content.length > 0) {
					// message.warning('该指标有指标实现在使用,不允许删除!')
					notification.warning({
						message:'禁止删除指标!',
						description:'该指标存在指标实现的引用,不能被删除!'
					}
					)
				} else {
					confirm({
						title: '您确定要删除这条记录吗?',
						onOk() {
							let ids = []
							//ids.push(Number.parseFloat(record.uuid))
							ids.push(record.uuid)
							dispatch({
								type: 'stdIndicatorsinfo/delete',
								payload: ids,
							})
						},
					})
				}
			}
		})
	}

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			if (selectedRows.length > 0) {
				let newselectKeys = []
				selectedRows.forEach((item) => {
					newselectKeys.push(item.uuid)
				})

				dispatch({
					type: 'stdIndicatorsinfo/controllerModal',
					payload: {
						batchDelete: true, //控制删除按钮
						choosedRows: newselectKeys, //把选择的行ID 放到 state 模型中去
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'stdIndicatorsinfo/controllerModal',
					payload: {
						batchDelete: false,
						choosedRows: [],
					},
				})
			}
		},

	}

	//动态获取屏幕分辨率宽度
	const resize = () => {
		let widths = ''
		widths = window.innerWidth
		if (widths > 950) {
			const buttonGroup = () => {
				return (
					<div>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete}>批量复制</Button>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete}>批量移动</Button>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} >新增</Button>
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="setting" />
					</div>
				)
			}
			return buttonGroup()
		}
		const buttonGroup = () => {
			return (
				<div>
					<Tooltip placement="topLeft" title="批量复制" trigger="hover">
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete} icon="copy" shape="circle" />
					</Tooltip>
					<Tooltip placement="topLeft" title="批量移动" trigger="hover">
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete} icon="code-o" shape="circle" />
					</Tooltip>
					<Tooltip placement="topLeft" title="批量删除" trigger="hover">
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete} icon="delete" shape="circle" />
					</Tooltip>
					<Tooltip placement="topLeft" title="新增" trigger="hover">
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} icon="plus" shape="circle" />
					</Tooltip>
					<Tooltip placement="topLeft" title="setting" trigger="hover">
						<Button style={{ marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="setting" />
					</Tooltip>
				</div>
			)
		}
		return buttonGroup()
	}
	window.onresize = resize
	resize()

	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				<Table
					scroll={{ x: 1500 }} //滚动条
					bordered
					columns={columns} //表结构字段
					dataSource={dataSource} //表数据
					loading={loading} //页面加载
					onChange={onPageChange} //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
					pagination={pagination} //分页配置
					simple
					size="small"
					rowKey={record => record.uuid}
					rowSelection={rowSelection}
				/>

			</Col>
		</Row>
	)
}

export default list
