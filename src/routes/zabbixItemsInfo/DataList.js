import React from 'react'
import { Table, Modal, Row, Col, Button, Tooltip } from 'antd'

import Columns from './Columns'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, q,
}) {
	const onAdd = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalType: 'create',
				currentItem: {},
				stdInfoVal: {}, //指标信息
				moFilterValue: {}, //对象特征信息
				moFilterOldValue: {}, //保存对象特征最初时的状态
				//setModelKey:`${new Date().getTime()}`,
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'zabbixItemsInfo/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q,
      	},
      })
      dispatch({
      	type: 'zabbixItemsInfo/controllerModal',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      	},
      })
    }

	const onCopy = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				modalType: 'copy',
				modalVisibleCopyOrMove: true,
				isClose: false,
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
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
        onOk () {
          dispatch({
		        type: 'zabbixItemsInfo/delete',
		        payload: choosedRows,
		      })
        },
      })
	}

	const handleMenuClick = (record, e) => {
		if (e.key === '2') {
		dispatch({
			type: 'zabbixItemsInfo/findById',
			payload: {
				record,
			},
		})
		} else if (e.key === '3') {
		  confirm({
			title: '您确定要删除这条记录吗?',
			onOk () {
				let ids = []
				//ids.push(Number.parseFloat(record.uuid))
				ids.push(record.uuid)
				dispatch({
					type: 'zabbixItemsInfo/delete',
					payload: ids,
				})
			},
		  })
		} else if (e.key === '1') {
			dispatch({
				type: 'zabbixItemsInfo/findById',
				payload: {
					record,
				},
			})
			dispatch({
				type: 'zabbixItemsInfo/controllerModal',
				payload: {
					see: 'yes',
				},
			})
		}
	}

	/*
	const ontest = () => {
		dispatch({
			type: `zabbixItemsInfo/queryItemInfo`,
			payload: {
				groupUUID:'',
			}
		})

		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {

				selectItemVisible: true,
				isClose: false,
			},
		})

	}
	*/

	const onDeletes = (record) => {
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk () {
				let ids = []
				//ids.push(Number.parseFloat(record.uuid))
				ids.push(record.uuid)
				dispatch({
					type: 'zabbixItemsInfo/delete',
					payload: ids,
				})
			},
		  })
	}
	const onEdit = (record) => {
		dispatch({
			type: 'zabbixItemsInfo/findById',
			payload: {
				record,
			},
		})
	}

  	const onSee = (record) => {
			dispatch({
				type: 'zabbixItemsInfo/findById',
				payload: {
					record,
				},
			})
			dispatch({
				type: 'zabbixItemsInfo/controllerModal',
				payload: {
					see: 'yes',
				},
			})
  	}

	const columns = [...Columns,
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

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			let newselectKeys = []
			selectedRows.forEach((item) => {
				newselectKeys.push(item.uuid)
			})
			if (selectedRows.length > 0) {
				dispatch({
					type: 'zabbixItemsInfo/controllerModal',
						payload: {
							batchDelete: true, //控制删除按钮
							choosedRows: newselectKeys, //把选择的行ID 放到 state 模型中去
						},
					})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'zabbixItemsInfo/controllerModal',
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
        scroll={{ x: 1400 }} //滚动条
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
