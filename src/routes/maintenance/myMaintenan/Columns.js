import React from 'react'
import fenhang from '../../../utils/fenhang'
import './list.css'
import { Tooltip } from 'antd'

let state = ''
let maps = new Map()
fenhang.forEach((obj, index) => {
	let keys = obj.key
	let values = obj.value
	maps.set(keys, values)
})
export default  [
	{
		title: '维护期名',
		dataIndex: 'name',
		key: 'name',
		width: 200,
		render: (text, record) => <div title={text}>{text}</div>,
		className: 'ellipsis',
	}, {
		title: '维护期类型',
		dataIndex: 'tpe',
		key: 'tpe',
		render: (text, record) => {
			let typename = '非周期'
			if (record.tpe === 'NON_PERIODIC') {
				typename = '非周期'
			} else {
				typename = '周期'
			}
			return typename
		},
	}, {
		title: '维护期告警定义',
		dataIndex: 'filter.filterMode',
		key: 'filter.filterMode',
		render: (text, record) => {
			let typename = '基础模式'
			if (record.filter) {
				if (record.filter.filterMode === 'BASIC') {
					typename = '基础模式'
				} else if (record.filter.filterMode === 'ADVANCED') {
					typename = '专家模式'
				} else {
					typename = '高级模式'
				}
			}

			return typename
		},
	}, {
		title: '适用范围',
		dataIndex: 'branch',
		key: 'branch',
		render: (text, record) => {
			let typename = maps.get(text)
			return typename
		},
	}, {
		title: '维护期起止时间',
		dataIndex: 'timeDef.range[0]',
		key: 'timeDefRangeBegin',
		render: (text, record) => {
			if (record.timeDef.range && record.timeDef.range.length > 0) {
				if (record.timeDef.repeatType === 'BY_DAY') {
					state = '每天'
				} else if (record.timeDef.repeatType === 'OTHER') {
					state = ''
				}
				return `${state + record.timeDef.range[0].begin} - ${record.timeDef.range[0].end}`
			} else if (record.timeDef.weekRange.length > 0) {
				if (record.timeDef.weekRange[0].weekday === 'MON') {
					state = '每周一'
				} else if (record.timeDef.weekRange[0].weekday === 'TUE') {
					state = '每周二'
				} else if (record.timeDef.weekRange[0].weekday === 'WED') {
					state = '每周三'
				} else if (record.timeDef.weekRange[0].weekday === 'THU') {
					state = '每周四'
				} else if (record.timeDef.weekRange[0].weekday === 'FRI') {
					state = '每周五'
				} else if (record.timeDef.weekRange[0].weekday === 'SAT') {
					state = '每周六'
				} else if (record.timeDef.weekRange[0].weekday === 'SUN') {
					state = '每周日'
				}
				return `${state}  ${record.timeDef.weekRange[0].range[0].begin} - ${
					record.timeDef.weekRange[0].range[0].end}`
			}
		},
	}, {
		title: '过滤条件',
		dataIndex: 'mainRuleInstanceInfoFilter',
		key: 'mainRuleInstanceInfoFilter',
		width: 200,
		className: 'ellipsis',
		render: (text, record) => {
			if (record.filter.filterMode === 'BASIC') { //基础模式
				let appFilterState = '过滤应用分类为:'
				let neFilterState = ''
				let otherFilterState = ''
				let infoState = ''
				if (record.filter.basicFilter.appFilterItems.length > 0) { //应用分类选择器
					for (let appFilter of record.filter.basicFilter.appFilterItems) {
						appFilterState = `${appFilterState + appFilter.name},`
					}
				}
				if (record.filter.basicFilter.neFilterItems.length > 0) { //网络设备选择器
					for (let neFilter of record.filter.basicFilter.neFilterItems) {
						neFilterState = `${neFilterState + neFilter.keyword},`
					}
				}
				if (record.filter.basicFilter.otherFilterItems.length > 0) { //其它域对象选择器
					for (let otherFilter of record.filter.basicFilter.otherFilterItems) {
						otherFilterState = `${otherFilterState + otherFilter.name},`
					}
				}
				infoState = `${appFilterState === '过滤应用分类为:' ? '' : appFilterState}过滤IP为:${neFilterState}${otherFilterState}`

				if (record.filter.basicFilter.distributedFilterItems.length > 0) { //其它域对象选择器
					// for (let distributedFilter of record.filter.basicFilter.distributedFilterItems) {
						infoState = `${record.expr},`
					// }				
				}
				
				return <div><Tooltip placement="topLeft" title={infoState}>{infoState}</Tooltip></div>
			} else if (record.filter.filterMode === 'SENIOR') { //高级模式
				let advFilterState = ''
				let appName = '应用系统为:'//应用系统
				let nodeAlias = '屏蔽IP为:'//屏蔽IP
				let summary = '告警详情为:'//告警详情
				let alterGroup = '告警组为:'//告警组
				let componentType = '事件来源为:' //事件来源
				if (record.filter.advFilterItems.length > 0) {
					for (let advFilter of record.filter.advFilterItems) {
						if (advFilter.field === 'N_AppName') { //应用系统
							appName = `${appName + advFilter.value},`
						} else if (advFilter.field === 'NodeAlias') { //屏蔽IP
							nodeAlias = `${nodeAlias + advFilter.value},`
						} else if (advFilter.field === 'N_SummaryCN') { //告警详情
							summary = `${summary + advFilter.value},`
						} else if (advFilter.field === 'AlertGroup') { //告警组
							alterGroup = `${alterGroup + advFilter.value},`
						} else if (advFilter.field === 'N_ComponentType') { //事件来源
							componentType = `${componentType + advFilter.value},`
						}
					}
				}
				advFilterState = (appName === '应用系统为:' ? '' : appName) +
					(nodeAlias === '屏蔽IP为:' ? '' : nodeAlias) +
					(summary === '告警详情为:' ? '' : summary) +
					(alterGroup === '告警组为:' ? '' : alterGroup) +
					(componentType === '事件来源为:' ? '' : componentType)
				return <div><Tooltip placement="topLeft" title={advFilterState}>{advFilterState}</Tooltip></div>
			} else if (record.filter.filterMode === 'ADVANCED') { //专家模式
				let advancedState = '过滤条件为:'
				if (record.filter.advFilterItems.length > 0) {
					for (let advanced of record.filter.advFilterItems) {
						advancedState = `${advancedState + advanced.field} ${advanced.op} ${advanced.value} ${advanced.logicOp === undefined ? ' ' : `${advanced.logicOp} `}`
					}
				}
				return <div><Tooltip placement="topLeft" title={advancedState}>{advancedState}</Tooltip></div>
			}
		},
	}, {
		title: '描述',
		dataIndex: 'description',
		key: 'description',
	}, {
		title: '申请人',
		dataIndex: 'applicant',
		key: 'applicant',
	}, {
		title: '变更号',
		dataIndex: 'ticket',
		key: 'ticket',
	}, {
		title: '应用系统',
		dataIndex: 'appNameAuto',
		key: 'appNameAuto',
		width: 200,
		className: 'ellipsis',
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
			return <div title={text}>{result}</div>
		},

	},
]
