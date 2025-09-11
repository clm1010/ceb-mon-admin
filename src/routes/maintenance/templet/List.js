import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Row, Col, message } from 'antd'
import { DropOption } from '../../../components'
const confirm = Modal.confirm

function list({
	dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, Filters, fenhang, user, q,
}) {
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

	let externalFilter = ''
	if (user.branch && user.branch !== '' && user.branch != 'QH' && user.branch != 'ZH') {
		externalFilter = `branch == ${user.branch}`
	}

	let mapMode = new Map()
	mapMode.set('BASIC', '基础模式')
	mapMode.set('SENIOR', '高级模式')
	mapMode.set('ADVANCED', '专家模式')

	const onPageChange = (page) => {
		dispatch({
			type: 'maintenanceTemplet/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				q,
			},
		})
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	const handleMenuClick = (record, e) => {
		if (e.key === '1') {
			initData(record, 'see')

			//对更新时间和创建时间处理一下
			if (record.createdTime !== 0) {
				let text = record.createdTime
				record.createdTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (record.updatedTime !== 0) {
				let text = record.updatedTime
				record.updatedTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}

			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					appNameAuto: record.appNameAuto === undefined ? '' : record.appNameAuto,
					appNameEditing: record.appNameEditing === undefined ? [] : record.appNameEditing.split(','),
				},
			})
		} else if (e.key === '2') {
			initData(record, 'update')
			//对更新时间和创建时间处理一下
			if (record.createdTime !== 0) {
				let text = record.createdTime
				record.createdTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (record.updatedTime !== 0) {
				let text = record.updatedTime
				record.updatedTimeStr = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}

			let hostOtherValue,
				appOtherValue,
				gjtzOtherValue,
				alertGroupValue,
				componentValue
			if (record.filter.filterMode !== 'SENIOR') {
				hostOtherValue = ''
				appOtherValue = ''
				gjtzOtherValue = ''
				alertGroupValue = ''
				componentValue = ''
			} else {
				let seniorHost = [],
					seniorApp = '',
					seniorOther = '',
					alertGroup = '',
					component = []
				record.filter.advFilterItems.forEach((item) => {
					if (item.field === 'N_AppName') {
						seniorApp = item.value
					} else if (item.field === 'NodeAlias') {
						seniorHost.push(item.value)
					} else if (item.field === 'N_SummaryCN') {
						seniorOther = item.value
					} else if (item.field === 'AlertGroup') {
						alertGroup = item.value
					} else if (item.field === 'N_ComponentType') {
						component.push(item.value)
					}
					hostOtherValue = seniorHost.join('、')
					appOtherValue = seniorApp
					gjtzOtherValue = seniorOther
					alertGroupValue = alertGroup
					componentValue = component.join('、')
				})
			}
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					hostOtherValue,
					appOtherValue,
					gjtzOtherValue,
					componentValue,
					alertGroupValue,
					appNameAuto: record.appNameAuto === undefined ? '' : record.appNameAuto,
					appNameEditing: record.appNameEditing === undefined ? [] : record.appNameEditing.split(','),
				},
			})
		} else if (e.key === '3') {
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk() {
					let ids = []
					ids.push(record.uuid)
					dispatch({
						type: 'maintenanceTemplet/delete',
						payload: ids,
					})
				},
			})
		} else if (e.key === '4') {
			let obj = { ...record }
			dispatch({
				type: 'maintenanceTemplet/queryNetwork',
				payload: {},
			})
			dispatch({
				type: 'maintenanceTemplet/queryQita',
				payload: {},
			})
			dispatch({
				type: 'maintenanceTemplet/queryApp',
				payload: {},
			})
			let listHost2 = []
			let listApp2 = []
			let listQita2 = []
			let listDistributed2 = []
			let host2portMap = new Map()
			if (record.filter && record.filter.basicFilter) {
				if (record.filter.basicFilter.neFilterItems) {
					record.filter.basicFilter.neFilterItems.forEach((item, index) => {
						let host = {}
						host.mo = {}
						host.mo.uuid = item.objectUUID
						host.mo.keyword = item.keyword
						host.mo.name = item.hostname
						listHost2.push(host)
						let ports = []
						if (item.ports && item.ports.length > 0) {
							item.ports.forEach((item2, index) => {
								let port = {}
								port.description = item2.description
								port.name = item2.name
								port.uuid = item2.objectUUID
								ports.push(port)
							})
						}
						host2portMap.set(host.mo.uuid, ports)
					})
				}
				if (record.filter.basicFilter.appFilterItems) {
					record.filter.basicFilter.appFilterItems.forEach((item, index) => {
						let app = {}
						app.affectSystem = item.name
						app.uuid = item.objectUUID
						app.businessIntroduction = item.description
						listApp2.push(app)
					})
				}
				if (record.filter.basicFilter.otherFilterItems) {
					record.filter.basicFilter.otherFilterItems.forEach((item, index) => {
						let qita = {}
						qita.appName = item.appName
						qita.keyword = item.name
						qita.name = item.alias
						qita.uuid = item.objectUUID
						listQita2.push(qita)
					})
				}
				if (record.filter.basicFilter.distributedFilterItems) {
					record.filter.basicFilter.distributedFilterItems.forEach((item, index) => {
						//
					})
				}
			}
			//专家模式-----start
			let moFilterValue = {},
				hostOtherValue = '',
				appOtherValue = '',
				gjtzOtherValue = '',
				alertGroupValue = '',
				componentValue = [],
				ipScopeValue = '',
				alertLevelValue = [],
				AgentValue = '',
				arrGroupValue =[],
				showGroupValue={}
				if (record.filter.filterMode === 'ADVANCED') {
					if(record.filter.advFilterItems[0].field=="N_PeerPort" && record.filter.advFilterItems[0].value=="批量自动化"){
						record.filter.advFilterItems.splice(0,1)
					}
				   moFilterValue = {
					   filterMode: 'ADVANCED',
					   filterItems: record.filter.advFilterItems,
				   }
			   } else if (record.filter.filterMode === 'SENIOR') {
				   moFilterValue = {
					   filterMode: 'SENIOR',
				   }
				   if(record.filter.advFilterItems[0].field=="N_PeerPort"){
					record.filter.advFilterItems.splice(0,1)
				   }
				   let leftBrackets = 0
				   let rightBrackets = 0
				   let oneGroupData={}
				   oneGroupData.hostOther =[]
				   oneGroupData.component =[]
				   oneGroupData.alertLevel = []
				   let index_key = 0
				   for(let i = 0 ;i<record.filter.advFilterItems.length ; i++){
					   let allConditons = record.filter.advFilterItems
					   leftBrackets += allConditons[i].leftBrackets.length
					   rightBrackets += allConditons[i].rightBrackets.length
			   
					   if (allConditons[i].field === 'N_AppName') {
						   oneGroupData.appOther = allConditons[i].value
					   } else if (allConditons[i].field === 'NodeAlias') {
						   oneGroupData.hostOther.push(allConditons[i].value)
					   } else if (allConditons[i].field === 'N_SummaryCN') {
						   oneGroupData.gjtzOther = allConditons[i].value
					   } else if (allConditons[i].field === 'AlertGroup') {
						   oneGroupData.alertGroup = allConditons[i].value
					   } else if (allConditons[i].field === 'N_ComponentType') {
						   oneGroupData.component.push(allConditons[i].value)
					   } else if(allConditons[i].field === 'N_IPScope') {
						   oneGroupData.ipScopeValue = allConditons[i].value
					   }else if (allConditons[i].field === 'N_CustomerSeverity') {
						oneGroupData.alertLevel.push(allConditons[i].value)
					} else if(allConditons[i].field === 'Agent') {
						oneGroupData.Agent = allConditons[i].value
					}
					   if(leftBrackets == rightBrackets && allConditons[i].logicOp!='AND'){
						   oneGroupData.key = `组合${++index_key}`
						   arrGroupValue.push(oneGroupData)
						   oneGroupData = {}
						   oneGroupData.hostOther =[]
						   oneGroupData.component =[]
						   oneGroupData.alertLevel = []
						   leftBrackets = 0
						   rightBrackets = 0
					   }
				   }
   
				   let seniorHost = [],
				   seniorApp = '',
				   seniorOther = '',
				   alertGroup = '',
				   component = [],
				   alertLevel = [],
				   Agent = ''
				   if(arrGroupValue[0]){
					   if(arrGroupValue[0].appOther && arrGroupValue[0].appOther !=''){
						   seniorApp=arrGroupValue[0].appOther
					   }
					   if(arrGroupValue[0].hostOther && arrGroupValue[0].hostOther.length>0){
						   seniorHost=arrGroupValue[0].hostOther
					   }
					   if(arrGroupValue[0].gjtzOther && arrGroupValue[0].gjtzOther !=''){
						   seniorOther=arrGroupValue[0].gjtzOther
					   }
					   if(arrGroupValue[0].alertGroup && arrGroupValue[0].alertGroup !=''){
						   alertGroup=arrGroupValue[0].alertGroup
					   }
					   if(arrGroupValue[0].component && arrGroupValue[0].component.length>0){
						   component=arrGroupValue[0].component
					   }
					   if(arrGroupValue[0].ipScopeValue && arrGroupValue[0].ipScopeValue !=''){
						   ipScopeValue=arrGroupValue[0].ipScopeValue
					   }
					   if (arrGroupValue[0].alertLevel && arrGroupValue[0].alertLevel.length > 0) {
						alertLevel = arrGroupValue[0].alertLevel
					}
					if (arrGroupValue[0].Agent && arrGroupValue[0].Agent != '') {
						Agent = arrGroupValue[0].Agent
					}
					   hostOtherValue = seniorHost.join('、')
					   appOtherValue = seniorApp
					   gjtzOtherValue = seniorOther
					   alertGroupValue = alertGroup
					   componentValue = component.join('、')
					   alertLevelValue = alertLevel.join('、')
					   AgentValue = Agent
					   showGroupValue = arrGroupValue[0]
					   showGroupValue.flag = true
				   }
			   }
			if (record.filter.advFilterItems) {
				moFilterValue.filterItems = record.filter.advFilterItems
			}
			if (user.branch && user.branch !== ''&& user.branch !== 'QH') {
				dispatch({
					type: 'maintenanceTemplet/queryReviewer',
					payload: {
						branch:`${user.branch}`
					},
				})
			}
			dispatch({
				type: 'userSelect/setState',
				payload: {
					externalFilter,
				},
			})
			dispatch({
				type: 'maintenanceTemplet/updateState',
				payload: {
					currentItem: {},
					datamodalType: 'instance',
					datamodalVisible: true,
					isClose: false,
					cycles: 'NON_PERIODIC',
					timeType: 'BY_WEEK',
					alarmType: obj.filter.filterMode,
					Filters: obj.filter,
					moFilterValue,
					localPath: 'maintenanceTemplet',
					listHost2,
					listApp2,
					listQita2,
					listDistributed2,
					host2portMap,
					selectedKeysHost1: [],
					selectedKeysPort1: [],
					selectedKeysApp1: [],
					selectedKeysQita1: [],
					selectedKeysHost2: [],
					selectedKeysPort2: [],
					selectedKeysApp2: [],
					selectedKeysQita2: [],
					ruleInstanceKey: `${new Date().getTime()}`,
					hostOtherValue,
					appOtherValue,
					gjtzOtherValue,
					alertGroupValue,
					componentValue,
					appNameAuto: record.appNameAuto === undefined ? '' : record.appNameAuto,
					appNameEditing: record.appNameEditing === undefined ? [] : record.appNameEditing.split(','),
					arrGroupValue,  //分组结果
					showGroupValue, //厨师显示
					selectedReviewer:false,
					whitelistEnabled:record.whitelistEnabled ? record.whitelistEnabled : ""
				},
			})
			//end
		} else if (e.key === '5') {
			let obj = { ...record }
			if (obj) {
				obj.uuid = ''
				let tempname = obj.name

				let coplyname = `_copy_${new Date().getTime()}`
				if (tempname && tempname.includes('_copy_')) {
					tempname = tempname.replace(/_copy_\d+/g, coplyname)
				} else {
					tempname += coplyname
				}
				obj.name = tempname
			}
			let newitem = {}
			//			newitem.branch=obj.branch;
			newitem.name = obj.name
			newitem.description = obj.description
			newitem.enabled = obj.enabled
			newitem.group = obj.group
			newitem.overdue = obj.overdue
			newitem.whitelistEnabled = obj.whitelistEnabled ? obj.whitelistEnabled : ""
			let advFilterItems = []
			if (obj.filter.advFilterItems) {
				obj.filter.advFilterItems.forEach((item, index) => {
					let itemnew = {
						field: item.field,
						leftBrackets: item.leftBrackets,
						logicOp: item.logicOp,
						op: item.op,
						rightBrackets: item.rightBrackets,
						value: item.value,
					}
					advFilterItems.push(itemnew)
				})
			}
			let basicFilter = {}
			if (obj.filter.basicFilter) {
				let appFilterItems = obj.filter.basicFilter.appFilterItems
				let newAppFilterItems = []
				appFilterItems.forEach((item, index) => {
					let itemnew = {
						description: item.description,
						name: item.name,
						objectUUID: item.objectUUID,
					}
					newAppFilterItems.push(itemnew)
				})

				let neFilterItems = obj.filter.basicFilter.neFilterItems
				let newNeFilterItems = []
				neFilterItems.forEach((item, index) => {
					let itemnewport = []
					item.ports.forEach((items, indexs) => {
						let itemnews = {
							description: items.description,
							name: items.name,
							objectUUID: items.objectUUID,
						}
						itemnewport.push(itemnews)
					})
					let itemnew = {
						keyword: item.keyword,
						objectUUID: item.objectUUID,
						ports: itemnewport,
						hostname: item.hostname,
					}
					newNeFilterItems.push(itemnew)
				})

				let otherFilterItems = obj.filter.basicFilter.otherFilterItems
				let newOtherFilterItems = []
				otherFilterItems.forEach((item, index) => {
					let itemnew = {
						alias: item.alias,
						appName: item.appName,
						name: item.name,
						objectUUID: item.objectUUID,
					}
					newOtherFilterItems.push(itemnew)
				})
				basicFilter = {
					appFilterItems: newAppFilterItems,
					neFilterItems: newNeFilterItems,
					otherFilterItems: newOtherFilterItems,
				}
			}
			message.info(`克隆的模板的名称为:  ${newitem.name}`, 5)
			newitem.filter = {
				advFilterItems,
				basicFilter,
				filterMode: obj.filter.filterMode,
			}
			dispatch({
				type: 'maintenanceTemplet/create',
				payload: newitem,
			})
		}
	}
	const initData = (record, type) => {
		dispatch({
			type: 'maintenanceTemplet/findById',
			payload: {
				record,
				type,
			},
		})
		//end
	}

	const columns = [
		{
			title: '模板名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '维护期定义',
			dataIndex: 'filter.filterMode',
			key: 'filter.filterMode',
			render: (text, record) => {
				return mapMode.get(text)
			},

		},
		//  ,{
		//    title: '适用范围',
		//    dataIndex: 'branch',
		//    key: 'branch',
		//    render: (text, record) => {
		//			let typename = maps.get(text);
		//			return typename;
		//		}
		//  }
		{
			title: '描述',
			dataIndex: 'description',
			key: 'description',

		}, {
			title: '创建人',
			dataIndex: 'createdBy',
			key: 'createdBy',

		}, {
			title: '应用系统',
			dataIndex: 'AppNameAutoAndEditing',
			key: 'AppNameAutoAndEditing',
			width: 200,
			render: (text, record) => {
				let result = ''
				if (record.appNameAuto === '' || record.appNameAuto == undefined) {

				} else {
					result = record.appNameAuto
				}
				if (record.appNameEditing === '' || record.appNameEditing == undefined) {

				} else {
					result = (result === '') ? record.appNameEditing : (result + record.appNameEditing)
				}
				return result
			},
		}, {
			title: '操作',
			key: 'operation',
			width: 100,
			fixed: 'right',
			render: (text, record) => {
				return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '删除' }, { key: '4', name: '实例化' }, { key: '5', name: '克隆' }]} />
			},
		},
	]

	const rowSelection = {
		selectedRowKeys:choosedRows.map(item=>item.uuid),
		onChange: (selectedRowKeys, selectedRows) => {
			let choosed = []
			selectedRows.forEach((object) => {
				choosed.push = object.id
			})
			if (selectedRows.length > 0) {
				dispatch({
					type: 'maintenanceTemplet/updateState',
					payload: {
						batchDelete: true,
						choosedRows: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'maintenanceTemplet/updateState',
					payload: {
						batchDelete: false,
						choosedRows: selectedRows,
					},
				})
			}
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
