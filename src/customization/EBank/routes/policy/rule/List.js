import React from 'react'
import { DropOption } from '../../../../../components'
import { Table, Modal, Row, Col, Button, Tooltip } from 'antd'
const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, fenhang, q,
}) {
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})
	const onAdd = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				modalType: 'create',
				currentItem: {},
				modalVisible: true,
				isClose: false,
				tempList: [{
					index: 1,
				   	tempid: '',
				   	tempname: '',
				   	tool: '',
				}],
				/*
				alarmFilterType:'create',
				alarmFilterInfo:'',
				ruleValue1:'未配置',
				ruleValue:'',
				*/
				alarmFilterInfo: {},
				alarmFilterOldInfo: {},
				name: '',
				modalVisibleKey: `${new Date().getTime()}`,
			},
		})
	}

	const onDelete = () => {
		confirm({
        		title: '您确定要批量删除这些记录吗?',
	        onOk () {
	        		let ids = []
	        		choosedRows.forEach(record => ids.push(record.uuid))
	          	dispatch({
			        type: 'policyRule/delete',
			        payload: ids,
			    	})
	        	},
      	})
	}

	const onPageChange = (page) => {
      dispatch({
      	type: 'policyRule/query',
      	payload: {
      		page: page.current - 1,
        	pageSize: page.pageSize,
        	q,
      	},
      })
      // 设置高度
      let heightSet = {
		height: '1021px',
		overflow: 'hidden',
	}
	if (page.pageSize === 10) {
		heightSet.height = '805px'
	} else if (page.pageSize === 20) {
		heightSet.height = '1295px'
	} else if (page.pageSize === 30) {
		heightSet.height = '1785px'
	} else if (page.pageSize === 40) {
		heightSet.height = '2275px'
	} else if (page.pageSize === 100) {
		heightSet.height = '5199px'
	} else if (page.pageSize === 200) {
		heightSet.height = '10099px'
	}
      dispatch({
      	type: 'policyRule/updateState',
      	payload: {
      		pageChange: new Date().getTime(),
      		batchDelete: false,
      		selectedRows: [],
      		heightSet,
      	},
      })
    }
	const handleMenuClick = (record, e) => {
		if(e.key === '1'){
			dispatch({
				type: 'policyRule/findById',
				payload: {
					record,
				},
			})
			dispatch({
				type: 'policyRule/updateState',
				payload: {
					see: 'yes',
				},
			})
		}
		if(e.key === '2'){
			dispatch({
				type: 'policyRule/findById',
				payload: {
					record,
				},
			})
		}
		if(e.key === '3'){
			let obj = { ...record }
			obj.uuid = ''

			if (obj) {
				let tempname = obj.name

				let coplyname = `_copy_${new Date().getTime()}`
				if (tempname && tempname.includes('_copy_')) {
					tempname = tempname.replace(/_copy_\d+/g, coplyname)
				} else {
					tempname += coplyname
				}
				obj.name = tempname
			}

			let targetGroupUUIDs = []
			for(let i = 0; i < obj.group.length; i++){
				targetGroupUUIDs.push(obj.group[i].uuid)
			}
			let newitem = {}
			let filters = []
			let monitorItems = []

			newitem.name = obj.name
			newitem.branch = obj.branch
			newitem.alias = obj.alias
			newitem.ruleType = obj.ruleType
			let tags = []
			obj.tags.forEach(item=>{
				tags.push(item.uuid)
			})
			newitem.tagUUIDs = tags
			obj.filters.forEach(item => {
				let filter = item;
				filter.uuid=""
				filter.filterItems.forEach(fitm => {
					delete fitm.uuid
				})
				filters.push(filter)
			})
			newitem.filters = filters
			
			newitem.targetGroupUUIDs = targetGroupUUIDs
			obj.monitorItems.forEach(item => {
				let nitm = {monitorMethod:{},policyTemplate:{}}
				nitm.monitorMethod.toolType = item.monitorMethod.toolType
				nitm.policyTemplate.uuid = item.policyTemplate.uuid
				monitorItems.push(nitm)
			})
			newitem.monitorItems = monitorItems;
   
			dispatch({
				type: 'policyRule/create',
				payload: newitem
			})
		}
		if(e.key === '4'){
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk () {
					let ids = []
					ids.push(record.uuid)
					dispatch({
						type: 'policyRule/delete',
						payload: ids,
				})
			},
		})
		}
	}
		
  	const columns = [
    {
      	title: '规则名称',
      	dataIndex: 'name',
      	key: 'name',
    	}, {
      	title: '分支机构',
      	dataIndex: 'branch',
      	key: 'branch',
      	width: 100,
      	render: (text, record) => {
			let typename = maps.get(text)
  			return typename
		},
    }, {
      	title: '策略模板-监控工具',
      	dataIndex: 'tempTool',
      	key: 'tempTool',
      	render: (text, record) => {
      		let result = ''
      		if (record.monitorItems !== undefined) {
      		 	record.monitorItems.forEach((item) => {
      		 	   	let tname = ''
					if (item.policyTemplate !== undefined) {
						tname = item.policyTemplate.name
					}
      		 	  	result = `${result + tname}--${item.monitorMethod.toolType};`
      		 	})
      		}
        		return result
      	},
    },
			{
				title: '操作',
				width: 120,
				fixed: 'right',
				render: (text, record) => {
					return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '克隆' }, { key: '4', name: '删除' }]} />
				},
			},
  	]

  	const rowSelection = {
	  	onChange: (selectedRowKeys, selectedRows) => {
	  		let choosed = []
	  		selectedRows.forEach((object) => {
	  				choosed.push = object.id
	  			})
	  		if (selectedRows.length > 0) {
		  		dispatch({
		    			type: 'policyRule/updateState',
					payload: {
						batchDelete: true,
						choosedRows: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    		type: 'policyRule/updateState',
					payload: {
						batchDelete: false,
						choosedRows: selectedRows,
					},
				})
			}
	  	},
	}
	const calculate = () => {
//		dispatch({
//		    type: 'policyRule/calc',
//				payload: {
//					calculateVisible: true,
//				}
//		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				branchVisible: true,
			},
		})
		let criteriaArr = []
		fenhang.forEach((item) => {
			criteriaArr.push(item.key)
		})
		//查询所有分行下发状态
		dispatch({
			type: 'policyRule/status',
			payload: {
				criteriaArr,
			},
		})
	}
	const onCopy = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				copyOrMoveModalType: 'copy',
				copyOrMoveModal: true,
				keys: new Date().getTime(),
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				copyOrMoveModalType: 'move',
				copyOrMoveModal: true,
				keys: new Date().getTime(),
			},
		})
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
    <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={calculate} >计算</Button>
    <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
    <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onAdd} >新增</Button>
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
    <Tooltip placement="topLeft" title="计算" trigger="hover">
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={calculate} icon="calculator" shape="circle" />
    </Tooltip>
    <Tooltip placement="topLeft" title="批量删除" trigger="hover">
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete} icon="delete" shape="circle" />
    </Tooltip>
    <Tooltip placement="topLeft" title="新增" trigger="hover">
      <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} icon="plus" shape="circle" />
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
          scroll={{ x: 1300 }}
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
