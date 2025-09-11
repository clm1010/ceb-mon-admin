import React from 'react'
import { Table, Modal, Row, Col, Alert } from 'antd'
import { config } from './../../utils'
import { DropOption } from './../../components'
import { getSourceByKey } from './../../utils/FunctionTool'
import Columns from './Columns'
import moment from 'moment'
const confirm = Modal.confirm
const { mtsinfo, exportExcelURL } = config.api
function list({
	dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, fenhang, user, q, alarmApplyFilter, moImportFileList, showUploadList, moImportResultVisible, moImportResultdataSource, moImportResultType,
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
	let Disablelimit = false
	user.roles.forEach((element) => {
		element.permissions.forEach((value) => {
			if (value.resource == '/api/v1/mts' && value.action == 'disable') {
				Disablelimit = Disablelimit || value.has
			}
		})
	})

	const onPageChange = (page, filters, sorter) => {
		let orderBy = ''
		if (sorter.order != undefined) {
			let order = sorter.order == 'descend' ? 'desc' : 'asc'
			orderBy = `${sorter.field},${order}`
		} else {
			orderBy = 'createdTime,desc'
		}
		dispatch({
			type: 'mainRuleInstanceInfo/query',
			payload: {
				page: page.current - 1,
				pageSize: page.pageSize,
				sort: orderBy,
				q,
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				pageChange: new Date().getTime(),
				batchDelete: false,
				selectedRows: [],
			},
		})
	}

	const updateTimes = (record, opertype) => {
		if (record.timeDef.repeatType == 'OTHER') {
			let tempList = []
			let tempLists = record.timeDef.range
			let startValue, endValue
			tempLists.forEach((item, index) => {
				let newObj = {}
				newObj.index = index + 1
				newObj.tempid = item.uuid
				newObj.begin = moment(item.begin, 'YYYY-MM-DD HH:mm:ss')
				newObj.end = moment(item.end, 'YYYY-MM-DD HH:mm:ss')
				tempList[index] = newObj
				startValue = Date.parse(moment(item.begin, 'YYYY-MM-DD HH:mm:ss'))
				endValue = Date.parse(moment(item.end, 'YYYY-MM-DD HH:mm:ss'))
			})
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					startValue: opertype == 'kelong' ? 0 : startValue,
					endValue: opertype == 'kelong' ? 9999999999999 : endValue,
					tempList: opertype == 'kelong' ? [
						{
							index: 1,
							tempid: '',
							begin: '',
							end: '',
						},
					] : tempList,
					tempDayList: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListMon: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListTue: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListWed: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListThu: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListFri: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListSat: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListSun: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
				},
			})
		} else if (record.timeDef.repeatType == 'BY_DAY') {
			let tempDayList = []
			let tempLists = record.timeDef.range
			tempLists.forEach((item, index) => {
				let newObj = {}
				newObj.index = index + 1
				newObj.tempid = item.uuid
				newObj.begin = moment(item.begin, 'HH:mm:ss')
				newObj.end = moment(item.end, 'HH:mm:ss')
				tempDayList[index] = newObj
			})
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					tempDayList,
					tempList: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListMon: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListTue: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListWed: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListThu: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListFri: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListSat: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempWeekListSun: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
				},
			})
		} else if (record.timeDef.repeatType == 'BY_WEEK') {
			let tempWeekListMon = []
			let tempWeekListTue = []
			let tempWeekListWed = []
			let tempWeekListThu = []
			let tempWeekListFri = []
			let tempWeekListSat = []
			let tempWeekListSun = []
			let checked = ''
			let tempLists = record.timeDef.weekRange
			tempLists.forEach((item, index) => {
				let newObj = {}
				let objs = item.range
				switch (item.weekday) {
					case 'MON':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListMon[index] = newObj
						})
						//						checked.push('MON')
						checked = 'MON'
						break
					case 'TUE':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListTue[index] = newObj
						})
						//						checked.push('TUE')
						checked = 'TUE'
						break
					case 'WED':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListWed[index] = newObj
						})
						//						checked.push('WED')
						checked = 'WED'
						break
					case 'THU':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListThu[index] = newObj
						})
						//						checked.push('THU')
						checked = 'THU'
						break
					case 'FRI':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListFri[index] = newObj
						})
						//						checked.push('FRI')
						checked = 'FRI'
						break
					case 'SAT':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListSat[index] = newObj
						})
						//						checked.push('SAT')
						checked = 'SAT'
						break
					case 'SUN':
						objs.forEach((items, indexs) => {
							newObj.index = indexs + 1
							newObj.tempid = items.uuid
							newObj.begin = moment(items.begin, 'HH:mm:ss')
							newObj.end = moment(items.end, 'HH:mm:ss')
							tempWeekListSun[index] = newObj
						})
						//						checked.push('SUN')
						checked = 'SUN'
						break
				}
			})
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					checked,
					checkedWeek: checked,
					tempWeekListMon,
					tempWeekListTue,
					tempWeekListWed,
					tempWeekListThu,
					tempWeekListFri,
					tempWeekListSat,
					tempWeekListSun,
					tempList: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
					tempDayList: [{
						index: 1, tempid: '', begin: '', end: '',
					}],
				},
			})
		}
	}
	const handleMenuClick = (record, e) => {
		if (e.key === '1') {
			initData(record, 'see', fenhang)
		} else if (e.key === '2') {
			initData(record, 'update', fenhang)
			dispatch({
				type: 'mainRuleInstanceInfo/getNowData',
				payload: {},
			})
		} else if (e.key === '3') {
			initData(record, 'kelong', fenhang)
			dispatch({
				type: 'mainRuleInstanceInfo/updateState',
				payload: {
					selectedReviewer: false,
				},
			})
		} else if (e.key === '4') {
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk() {
					let ids = []
					ids.push(record.uuid)
					dispatch({
						type: 'mainRuleInstanceInfo/delete',
						payload: ids,
					})
				},
			})
			//end
		} else if (e.key === '5') {
			confirm({
				title: '您确定要禁用该维护期吗?',
				onOk() {
					dispatch({
						type: 'mainRuleInstanceInfo/disable',
						payload: record.uuid,
					})
				},
			})
		}
	}
	//end
	const initData = (record, type, fenhang) => {
		let branchArrays = record.branch.split(',')
		let newArr = []
		for (let i = 0; i <= branchArrays.length; i++) {
			let checkedStr = branchArrays[i]
			for (let j = 0; j < fenhang.length; j++) {
				let strs = fenhang[j]
				if (checkedStr === fenhang[j].key) {
					newArr.push(fenhang[j].value)
				}
			}
		}
		dispatch({
			type: 'mainRuleInstanceInfo/updateState',
			payload: {
				cycles: record.tpe,
				checkedList: newArr,
				timeType: record.timeDef.repeatType,
				isenabled: record.enabled,
				ruleInstanceKey: `${new Date().getTime()}`,
				appNameAuto: record.appNameAuto === undefined ? '' : record.appNameAuto,
				appNameEditing: record.appNameEditing === undefined ? [] : record.appNameEditing.split(','),
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/findById',
			payload: {
				record,
				type,
				fenhang,
			},
		})
		dispatch({
			type: 'mainRuleInstanceInfo/queryCreateBy',
			payload: {
				q: `username==${record.createdBy} `,
			},
		})
		dispatch({
			type: 'userSelect/setState',
			payload: {
				externalFilter,
			},
		})
	}
	const operArr = Disablelimit ? [{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '克隆' }, { key: '4', name: '删除' }, { key: '5', name: '禁用' }] : [{ key: '1', name: '查看' }, { key: '2', name: '编辑' }, { key: '3', name: '克隆' }, { key: '4', name: '删除' }]
	const columns = [...Columns,
	{
		title: '操作',
		key: 'operation',
		width: 30,
		fixed: 'right',
		render: (text, record) => {
			return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={operArr} />
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
					type: 'mainRuleInstanceInfo/controllerModal',
					payload: {
						batchDelete: true, //控制删除按钮
						choosedRows: newselectKeys, //把选择的行ID 放到 state 模型中去
						choosedRowsItem: selectedRows
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
					type: 'mainRuleInstanceInfo/controllerModal',
					payload: {
						batchDelete: false,
						choosedRows: [],
					},
				})
			}
		},

	}
	function getOelName(key){
		const values = getSourceByKey('OelColumns')
		for(let obj of values){
			if(obj.key == key){
				return obj.name
			}
		}
		return ''
	}
	let infos = ''
	// for (let filter of alarmApplyFilter) {
	// 	if (filter.resource === '/api/v1/mts') { //维护期
	// 		for (let info of filter.filterItems) {
	// 			info.field = getOelName(info.field)
	// 			texts.push(`${info.leftBrackets === undefined ? '' : info.leftBrackets} ${info.field} ${info.op} ${info.value} ${info.rightBrackets === undefined ? '' : info.rightBrackets}  ${info.logicOp === undefined ? '' : info.logicOp}`)
	// 		}
	// 	}
	// }
// 改
	let infoMess = ''
	for (let filter of alarmApplyFilter) {
		let message = []
		if (filter.resource === '/api/v1/mts') { //维护期
			for (let info of filter.filterItems) {
				info.field = getOelName(info.field)
				message.push(`${info.leftBrackets === undefined ? '' : info.leftBrackets} ${info.field} ${info.op} ${info.value} ${info.rightBrackets === undefined ? '' : info.rightBrackets}  ${info.logicOp === undefined ? '' : info.logicOp}`)
			}
		}
		if(message.length > 0) infoMess = infoMess !='' ? ` ${infoMess}  or ( ${message.join(' ')} )` : `( ${message.join(' ')} )`
	}

	if (infoMess != '') {
		infos = `当前用户维护期处理告警范围: ${infoMess}`
	} else {
		infos = '当前用户维护期处理告警范围: 全部告警'
	}
	return (
		<Row gutter={24}>
			<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
				{
					user.branch === undefined ? null : <div><Alert message={infos} type="info" showIcon /><br /></div>
				}
				<Table
					scroll={{ x: 1700 }} //滚动条
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
