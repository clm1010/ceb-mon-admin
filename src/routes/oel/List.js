import React from 'react'
import { Table, Row, Col, Icon, message, Badge } from 'antd'
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from 'react-contextmenu'
import './List.css'
import { ozr } from '../../utils/clientSetting/'
import globe_app from './globe_app.png'
import { getSourceByKey } from "../../utils/FunctionTool"
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns

function list({
	dispatch, loading, dataSource, list, pagination, location, onPageChange, tagFilters, currentSelected, oelColumns, oelDatasource, oelFilter, oelViewer, toolList, selectedRows, user,
}) {
	//循环选中的行 抽取一个简单的OZ_AlarmID数组做判断
	let selectedRowKeys = selectedRows.map(v => v.OZ_AlarmID)
	let roleArr = [], givenForceCloseArr = [], delay = []
	if (user.roles !== undefined) {
		roleArr = [...user.roles.filter(item => item.name === '超级管理员')]
		givenForceCloseArr = [...user.roles.filter(item => item.name === '一线服务台' || item.name === '网络团队一线')]
		delay = [...user.roles.filter(item => item.name === '超级管理员' || item.name === '主管')]
	}

	const callOutMenu = getSourceByKey('callOutMenu').map(item => <MenuItem disabled={item.status} onClick={() => initialNotification(item.value)}>{item.value}</MenuItem>)
	//发送工单
	const sendWorkOrder = (e, data) => {
		const woCurrentItem = data.record

		if (woCurrentItem.N_TicketId !== undefined && woCurrentItem.N_TicketId !== '') {
			message.warning('此告警已被发送过工单，不能再次发送。')
		} else {
			dispatch({
				type: 'oel/updateState',
				payload: {
					workOrderVisible: true,
					woCurrentItem,
					alertMessage: '工单信息',
				},
			})
		}
	}

	const cmdb = (e, data) => {
		const { record } = data
		// window.open(`${ozr('cmdbUrl')}/cmdb/cmdbEventProcess/main.action?ciType=AppSystem&loginable=true&autologin=true&conMap.sysCode=${record.N_AppCode}&conMap.ipaddr=${record.NodeAlias}&conMap.comptype=${record.N_ComponentType}`, 'cmdb', '', 'false')
		window.open(`http://10.1.32.156:19201/cmdb/page/ump/queryUserAndDeviceInfo?appSystem=${record.N_AppCode}&ip=${record.NodeAlias}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJrZXkiOiJVTVAifQ.7yiDVw4AWFFPTAj2zGZxyhwzVp6ONqz4aBftKo2EKXM`, 'cmdb', '', 'false')
	}
	//跟踪提醒
	const followAlarm = (e, data) => {
		let flag = data.record.OZ_TraceFlag
		if (flag == 1) {
			message.warning('此告警已被跟踪，不再进行跟踪。')
		} else {
			dispatch({
				type: 'oel/updateState',
				payload: {
					processEventVisible: true,
					contextType: '开启告警跟踪',
					contextMessage: '点击“确定”按钮，将开启告警跟踪下表的事件。',
				},
			})
		}
	}
	//增加备注
	const addNote = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '添加备注',
				contextMessage: '为下表告警添加备注',
			},
		})
	}

	//接管事件
	const takeOverAlarm = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '接管告警',
				contextMessage: '点击“确定”按钮，将接管下表的事件。',
			},
		})
	}
	// 维护期重计算
	const addRecalculate = () => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '维护期重计算',
				contextMessage: '点击“确定”按钮，维护期将进行重计算。',
			},
		})
	}
	// 推送机房巡检信息
	const toDcpms = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '推送机房巡检信息',
				contextMessage: '点击“确定”按钮，将下表事件推送至DCPMS。',
			},
		})
	}

	//强制关闭
	const forceCloseAlarm = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '强制关闭',
				contextMessage: '点击“确定”按钮，将强制关闭下表的事件。',
			},
		})
	}

	//一线服务台和网络一线强制关闭告警
	const givenForceCloseAlarm = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '一线强制关闭',
				contextMessage: '点击“确定”按钮，将强制关闭下表的事件。',
			},
		})
	}

	//处理完成
	const processFinishedAlarm = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '处理完成',
				contextMessage: '点击“确定”按钮，将标记下表的事件处理完成。',
			},
		})
	}

	//已知问题
	const alreadyKnown = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '已知问题',
				contextMessage: '输入问题单号，点击“确定”按钮，下表的事件将关联问题单号。',
			},
		})
	}

	//计划内变更
	const changeInPlan = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '计划内变更',
				contextMessage: '点击“确定”按钮，下表的事件将计划内变更。',
			},
		})
	}

	//计划内变更
	const notifiedBranch = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: `已通知${ozr('FH')}`,
				contextMessage: `点击“确定”按钮，触发已通知${ozr('FH')}。`,
			},
		})
	}

	//计划内变更
	const relatedAlarm = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '关联告警',
				contextMessage: '输入根告警ID，点击“确定”按钮，此ID的事件将成为下表的根源告警。',
			},
		})
	}

	//自动恢复
	const autoBack = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '自动恢复',
				contextMessage: '请输入自动恢复内容，点击“确定”按钮。',
			},
		})
	}

	//其他
	const other = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '其它',
				contextMessage: '请输入文本框，点击“确定”按钮。',
			},
		})
	}

	//一线工程师诊断无影响
	const ackedByEngineer = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '一线工程师诊断无影响',
				contextMessage: '点击“确定”按钮,下表事件将被确认。',
			},
		})
	}

	//无法设置维护期
	const cantSetMantainance = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '无法设置维护期',
				contextMessage: '点击“确定”按钮,下表事件标记为无法设置维护期。',
			},
		})
	}

	//无需处理
	const noNeedHandle = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '无需处理',
				contextMessage: '点击“确定”按钮,下表事件标记为无需处理。',
			},
		})
	}

	//未设置维护期
	const noSetMantainance = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '未设置维护期',
				contextMessage: '点击“确定”按钮,下表事件标记为未设置维护期。',
			},
		})
	}
	// 告警根因推荐
	const getResultRecommend = (e, data) => {
		let AlarmID = data.record.OZ_AlarmID
		dispatch({
			type: 'oel/getRecommendAddres',
			payload: {
				AlarmID
			}
		})
	}
	// 外呼
	const initialNotification = (e, data) => {
		dispatch({
			type: 'oel/getOutcallUser',
			payload: {
				noticeType: 1,
				username: user.username,
				callAlertsReq: {
					alertsList: selectedRows,
					totalElements: selectedRows.length
				}
			}
		})
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: e,
				contextMessage: '点击“确定”按钮,下表事件标记为外呼。',
			},
		})
	}
	//无效告警
	const onInvalidAlert = (e, data) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '无效告警' + e,
				contextMessage: '点击“确定”按钮,下表事件标记为无效告警。',
			},
		})
	}
	const handleAlarms = (processEventVisible, contextType, contextMessage) => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible,
				contextType,
				contextMessage,
			},
		})
	}
	// alarmDelay
	const alarmDelay = () => {
		dispatch({
			type: 'oel/updateState',
			payload: {
				processEventVisible: true,
				contextType: '延迟处理',
				contextMessage: '点击“确定”按钮,进行延迟处理操作。',
			},
		})
	}


	//工具菜单触发
	const triggerTool = (e, data) => {
		let sql = data.sql
		if (data.type === 'SQL') {
			//匹配sql中包含的#[xxxx]这样的字符串，匹配出来是一个数组
			let hunted = sql.match(/(\#\[)([^\}]+)(\])/g)
			//数组排重，避免出现匹配多个相同的${xxx}这样的情况
			hunted = Array.from(new Set(hunted))

			//如果遇见包含内部变量%[username]的情况，要用当前用户替换
			sql = sql.replace('%[username]', user.username)

			//判断用户右键点击的行属于多选被勾选的行，是则true，否则false
			let flag = false

			if (selectedRowKeys.indexOf(data.record.OZ_AlarmID) > -1) {
				flag = true
			}

			let nonStringFields = []
			for (let column of ViewColumns) {
				if (column.type !== 'string') {
					nonStringFields.push(column.key)
				}
			}

			//取sql中的第一个${xxx}特征的字符串
			for (let field of hunted) {
				field = field.replace('#[', '')
				field = field.replace(']', '')

				//在配置文件中判断这个字段类型是数值型还是字符串
				let isStr = !(nonStringFields.indexOf(field) >= 0)

				//准备用来替换${xxx}的字符串
				let valueString = ''
				if (flag) {	//批量处理的情况
					for (let row of selectedRows) {	//在所选的行中，匹配出这个字段的值出来,并拼装成x,y,z这样的字符串用来替换in (${xxx})括号里的部分
						let fieldValue = row[field]

						if (fieldValue == '' || fieldValue == undefined) {

						} else if (isStr) {
							valueString = `${valueString}'${fieldValue}',`
						} else {
							valueString = `${valueString + fieldValue},`
						}
					}
					//干掉末尾的逗号
					if (valueString.length > 0) {
						valueString = valueString.substring(0, valueString.length - 1)
					}
				}

				if (valueString === '') {
					message.error('选中告警中对应的字段值都为空，工具执行失败.')
					return
				}

				//整体替换sql里这个${xxx}类型的字符串
				sql = sql.replace(`#[${field}]`, valueString)
			}

			dispatch({
				type: 'oel/sqlTrigger',
				payload: {
					sql: [sql],
					uuid: oelDatasource,
				},
			})
		} else if (data.type === 'URL') {

		}
	}

	//循环工具列表准备填充到右键菜单中
	let toolInfo = []
	for (let tool of toolList) {
		toolInfo.push(<MenuItem onClick={triggerTool} data={{ sql: tool.contents, type: tool.toolType }}>{tool.name}</MenuItem>)
	}

	//本地过滤触发此方法
	const filterClick = (e, data) => {
		//字段首字母转换大写才能到配置文件里匹配
		let upperFieldName = data.name
		let nonStringFields = []
		for (let column of ViewColumns) {
			if (column.type !== 'string') {
				nonStringFields.push(column.key)
			}
		}

		let dateFields = []
		for (let column of ViewColumns) {
			if (column.type === 'utc') {
				dateFields.push(column.key)
			}
		}
		if (data.op === 'like' && nonStringFields.indexOf(upperFieldName) >= 0) {
			message.error('数值型字段和日期不能使用like或者not like匹配')
			return
		} else if (data.op === 'not like' && nonStringFields.indexOf(upperFieldName) >= 0) {
			message.error('数值型字段和日期不能使用like或者not like匹配')
			return
		}

		//初始状态----------------------------
		if (tagFilters.size === 0) {
			if (data.upperName === 'Severity') {
				tagFilters.set('Severity', { name: data.name, op: data.op, value: String(data.record[data.name]) })
			} else if (dateFields.indexOf(data.name) >= 0) {
				tagFilters.set(1, { name: data.name, op: data.op, value: String(data.record[data.name]) })
			} else {
				tagFilters.set(1, { name: data.name, op: data.op, value: String(data.record[data.name]) })
			}
		} else {	//非初始状态
			if (data.upperName === 'Severity') {			//如果是severity类型
				if (tagFilters.has('Severity')) { //如果包含severity标签，先删掉，再增加，确保severity标签只有一个
					tagFilters.delete('Severity')
				}
				tagFilters.set('Severity', { name: data.name, op: data.op, value: String(data.record[data.name]) })
			} else { //如果是非severity类型的
				//获取key最大值
				let maxValue = 0
				for (let [key, value] of tagFilters) {
					if (key > maxValue) { maxValue = key }
				}
				// if ( dateFields.indexOf(data.name) >= 0 ) {
				//	tagFilters.set(1,{name:data.name, op:data.op, value:String(data.record[data.name])})
				//}
				//生成最大值加1的新item
				//else {
				tagFilters.set(maxValue + 1, { name: data.name, op: data.op, value: String(data.record[data.name]) })
				//}
			}
		}
		//------------------------------------
		const { query, pathname } = location
		if (data.upperName === 'Severity') {
			dispatch({
				type: 'oel/querySuccess',
				payload: {
					tagFilters,
					//如果条件为非等于情况，右上角的severity下拉列表默认选中，不变
					currentSelected: data.op === '=' ? data.record[data.name] : currentSelected,	//使severity下拉列表变化
				},
			})
		} else {
			dispatch({
				type: 'oel/querySuccess',
				payload: {
					tagFilters,
					currentSelected,
				},
			})
		}

		pagination.current = 1

		dispatch({
			type: 'oel/query',
			payload: {
				pagination,
				oelDatasource,
				oelViewer,
				oelFilter,
			},
		})
	}

	//此方法用于右键菜单模块的采集
	const collect = (props) => {
		//判断用户右键点击的行属于多选被勾选的行，是则true，否则false
		if (selectedRowKeys.indexOf(props.record.OZ_AlarmID) === -1) {
			dispatch({
				type: 'oel/updateState',
				payload: {
					selectedRows: [props.record],
				},
			})
		}

		return {
			children: props.children,
			name: props.name,
			upperName: props.upperName,
			OZ_AlarmID: props.OZ_AlarmID,
			record: props.record,
		}
	}

	//右键菜单告警升降级触发此方法
	const changeSeverity = (e, data) => {
		let serverNames = ''
		let serverSerials = ''
		for (let row of selectedRows) {
			serverNames = `${serverNames}'${row.ServerName}',`
			serverSerials = `${serverSerials + row.ServerSerial},`
		}
		serverNames = serverNames.substring(0, serverNames.length - 1)
		serverSerials = serverSerials.substring(0, serverSerials.length - 1)

		dispatch({
			type: 'oel/sqlTrigger',
			payload: {
				sql: [`update alerts.status set N_CustomerSeverity = ${data.sev}, Severity = ${data.orginSev} where ServerName in (${serverNames}) and ServerSerial in (${serverSerials})`],
				uuid: oelDatasource,
			},
		})
	}

	//显示告警详情弹出窗口
	const showDetail = (record, index, event) => {
		dispatch({
			type: 'oel/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				visibleDetail: true,
				currentItem: record,
				curDetailTabKey: '0',
			},
		})
	}

	//由于js对象转json，函数类型的属性无法转换成json，所以在数据库取出后追加render属性(即右键触发功能)
	const colOperation = (cols) => {
		let dateFields = []
		for (let column of ViewColumns) {
			if (column.type === 'utc') {
				dateFields.push(column.key)
			}
		}
		if (cols != undefined) {
			for (let col of cols) {
				if (dateFields.indexOf(col.dataIndex) >= 0) {
					col.render = (text, record) => {
						if (record[col.dataIndex] != undefined) {
							return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{new Date(record[col.dataIndex] * 1000).format('yyyy-MM-dd hh:mm:ss')}</div></ContextMenuTrigger>
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{record[col.dataIndex]}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_SummaryCN') {
					col.render = (text, record) => {
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis"><span style={{ float: 'left', marginLeft: 10 }}>{record[col.dataIndex]}</span></div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_CustomerSeverity') {
					col.render = (text, record, index) => {
						let n_CustomerSeverity = '未知'
						let backgroundColor = '#fff'
						let color = '#000'
						switch (record[col.dataIndex]) {
							case 100:
								n_CustomerSeverity = '信息'
								if (record.Acknowledged === 0) {
									backgroundColor = '#B23AEE'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#68228B'
									color = '#fff'
								}
								break
							case 4:
								n_CustomerSeverity = '提示'
								if (record.Acknowledged === 0) {
									backgroundColor = '#63B8FF'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#4F94CD'
									color = '#fff'
								}
								break
							case 3:
								n_CustomerSeverity = '预警'
								if (record.Acknowledged === 0) {
									backgroundColor = '#ffff00'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#CDCD00'
									color = '#fff'
								}
								break
							case 2:
								n_CustomerSeverity = '告警'
								if (record.Acknowledged === 0) {
									backgroundColor = '#FFB329'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#B56300'
									color = '#fff'
								}
								break
							case 1:
								n_CustomerSeverity = '故障'
								if (record.Acknowledged === 0) {
									backgroundColor = '#FF0000'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#C50000'
									color = '#fff'
								}
								break
						}
						let oz_knowledge_flag
						if (record.oz_knowledge_flag == 'true') {
							oz_knowledge_flag = <Badge status="success" />
						}
						let oz_global_app_flag
						if (record.oz_global_app_flag == 1) {
							oz_global_app_flag = <img src={globe_app} style={{ marginRight: 2 }} />
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}>
							<div title={record[col.dataIndex]} className="oel-ellipsis" style={{ background: backgroundColor, color }}>{oz_knowledge_flag}{n_CustomerSeverity}{oz_global_app_flag}</div></ContextMenuTrigger>
						// <div title={record[col.dataIndex]} className="oel-ellipsis" style={{ background: backgroundColor, color }}>{index == 0 ? <Badge status="success" style={{marginLeft:3}}/> : index==1 ? null : <Badge status="success" style={{marginLeft:3}}/>}{n_CustomerSeverity}{index == 0 ? <><img src={globe_app} style={{marginRight:2}}/></> : index==1 ? <img src={globe_app} style={{marginLeft:2}}/> : null}</div></ContextMenuTrigger>
					}
				} /*else if (col.dataIndex === 'Type') {             
					let type = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								type = '新事件'
								break
							case 5:
								type = '已接管'
								break
							case 4:
								type = '已恢复并关闭'
								break
							case 3:
								type = '已关闭'
								break
							case 2:
								type = '已恢复未关闭'
								break
							case 1:
								type = '已恢复并关闭'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className ='oel-ellipsis'>{type}</div></ContextMenuTrigger>
			    	}
				}*/else if (col.dataIndex === 'Acknowledged') {
					let Acknowledged = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								Acknowledged = '未接管'
								break
							case 1:
								Acknowledged = '已接管'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{Acknowledged}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'ExpireTime') {
					let ExpireTime = ''
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								ExpireTime = '未设置'
								break
							default:
								ExpireTime = record.ExpireTime
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{ExpireTime}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'Flash') {
					let Flash = ''
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								Flash = '否'
								break
							case 1:
								Flash = '是'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{Flash}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_EventStatus') {
					let N_EventStatus = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_EventStatus = '新事件'
								break
							case 1:
								N_EventStatus = '自动恢复需手工关闭'
								break
							case 2:
								N_EventStatus = '自动恢复且自动关闭'
								break
							case 3:
								N_EventStatus = '已手工关闭'
								break
							case 4:
								N_EventStatus = '已强制关闭'
								break
							case 5:
								N_EventStatus = '已接管'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_EventStatus}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_MaintainStatus') {
					let N_MaintainStatus = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_MaintainStatus = '未设置'
								break
							case 1:
								N_MaintainStatus = '在维护期'
								break
							case 2:
								N_MaintainStatus = '出维护期'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_MaintainStatus}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_ManageByCenter') {
					let N_ManageByCenter = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_ManageByCenter = '否'
								break
							case 1:
								N_ManageByCenter = '是'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_ManageByCenter}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_RecoverType') {
					let N_RecoverType = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_RecoverType = '否'
								break
							case 1:
								N_RecoverType = '是'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_RecoverType}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_CustomerSeverity') {
					let Severity = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 100:
								Severity = '五级信息'
								break
							case 4:
								Severity = '四级提示'
								break
							case 3:
								Severity = '三级预警'
								break
							case 2:
								Severity = '二级告警'
								break
							case 1:
								Severity = '一级故障'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{Severity}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'SuppressEscl') {
					let SuppressEscl = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								SuppressEscl = '正常'
								break
							case 1:
								SuppressEscl = '已升级'
								break
							case 2:
								SuppressEscl = '已升级-等级2'
								break
							case 3:
								SuppressEscl = '已升级-等级3'
								break
							case 4:
								SuppressEscl = '抑制'
								break
							case 5:
								SuppressEscl = '故障'
								break
							case 6:
								SuppressEscl = '维护期'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{SuppressEscl}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'Type') {
					let Type = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								Type = '未设置'
								break
							case 1:
								Type = '问题'
								break
							case 2:
								Type = '恢复'
								break
							case 3:
								Type = 'Visionary Problem'
								break
							case 4:
								Type = 'Visionary Resolution'
								break
							case 7:
								Type = 'ISM New Alarm'
								break
							case 8:
								Type = 'ISM Old Alarm'
								break
							case 11:
								Type = 'More Severe'
								break
							case 12:
								Type = 'Less Severe'
								break
							case 13:
								Type = '信息'
								break
							case 20:
								Type = 'ITM问题'
								break
							case 21:
								Type = 'ITM恢复'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{Type}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_ZProcessState') {
					let N_ZProcessState = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_ZProcessState = '未被处理 '
								break
							case 1:
								N_ZProcessState = '被丰富 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_ZProcessState}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_AckMode') {
					let N_AckMode = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_AckMode = '未设置 '
								break
							case 1:
								N_AckMode = '手工确认 '
								break
							case 2:
								N_AckMode = '自动确认 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_AckMode}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_Close') {
					let N_Close = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_Close = '已关闭 '
								break
							case 1:
								N_Close = '未关闭 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_Close}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_NPassHis') {
					let N_NPassHis = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_NPassHis = '未归档 '
								break
							case 1:
								N_NPassHis = '已归档 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_NPassHis}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_AckOverTime') {
					let N_AckOverTime = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_AckOverTime = '接管未超时 '
								break
							case 1:
								N_AckOverTime = '接管超时 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_AckOverTime}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_CloseOverTime') {
					let N_CloseOverTime = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_CloseOverTime = '关闭未超时 '
								break
							case 1:
								N_CloseOverTime = '关闭超时 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_CloseOverTime}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_TicketStatus') {
					let N_TicketStatus = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 'Success':
								N_TicketStatus = '成功 '
								break
							case 'Failure':
								N_TicketStatus = '失败 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_TicketStatus}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'N_Processed') {
					let N_Processed = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_Processed = '未接管'
								break
							case 1:
								N_Processed = '已接管 '
								break
							case 2:
								N_Processed = '已处理'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{N_Processed}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'OZ_MaintainProcess') {
					let OZ_MaintainProcess = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								OZ_MaintainProcess = '维护期处理'
								break
							case 1:
								OZ_MaintainProcess = '维护期未处理 '
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{OZ_MaintainProcess}</div></ContextMenuTrigger>
					}
				} else if (col.dataIndex === 'oz_knowledge_flag') {
					let oz_knowledge_flag = '无'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case "false":
								oz_knowledge_flag = '无'
								break
							case "true":
								oz_knowledge_flag = '有'
								break
							default:
								oz_knowledge_flag = '无'
								break
						}
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{oz_knowledge_flag}</div></ContextMenuTrigger>
					}
				} else {
					col.render = (text, record) => {
						return <ContextMenuTrigger collect={collect} upperName={col.key} name={col.dataIndex} id="simple" OZ_AlarmID={record.OZ_AlarmID} record={record} holdToDisplay={1000}><div title={record[col.dataIndex]} className="oel-ellipsis">{record[col.dataIndex]}</div></ContextMenuTrigger>
					}
				}

				//这里设置sorter函数，有bug要判断字符串或者整型
				col.sorter = true
				//col.sorter = (a,b) => a[col.dataIndex].length - //b[col.dataIndex].length
			}
		}
	}

	colOperation(oelColumns)
	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedRowKeys, selectedRows) => {
			dispatch({
				type: 'oel/updateState',
				payload: {
					selectedRows,
				},
			})
		},
	}
	let widths = document.documentElement.clientHeight - 260

	let scrollX = 0
	oelColumns.forEach(item => scrollX += item.width)
	return (
		<div>
			<Row gutter={24}>
				<Col xs={24} xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
					<div className="content-inner4" >
						<Table
							bordered
							columns={oelColumns}
							dataSource={dataSource}
							loading={loading}
							simple
							scroll={{ x: scrollX, y: widths }}
							size="small"
							pagination={pagination}
							onChange={onPageChange}
							onRowDoubleClick={showDetail}
							rowKey={record => record.OZ_AlarmID}
							rowSelection={rowSelection}
							rowClassName={(record, index) => {
								let bgcolor = 'white test'
								if (selectedRowKeys.indexOf(record.OZ_AlarmID) > -1) {
									bgcolor = 'black'
								} else if (record.Severity === 0) {
									if (record.Acknowledged === 1) {
										bgcolor = 'ack_green test'
									} else {
										bgcolor = 'green test'
									}
								} else if (record.N_CustomerSeverity === 100) {
									if (record.Acknowledged === 1) {
										bgcolor = 'ack_purple test'
									} else {
										bgcolor = 'purple test'
									}
								} else if (record.N_CustomerSeverity === 4) {
									if (record.Acknowledged === 1) {
										bgcolor = 'ack_blue test'
									} else {
										bgcolor = 'blue test'
									}
								} else if (record.N_CustomerSeverity === 3) {
									if (record.Acknowledged === 1) {
										bgcolor = 'ack_yellow test'
									} else {
										bgcolor = 'yellow test'
									}
								} else if (record.N_CustomerSeverity === 2) {
									if (record.Acknowledged === 1) {
										bgcolor = 'ack_orange test'
									} else {
										bgcolor = 'orange test'
									}
								} else if (record.N_CustomerSeverity === 1) {
									if (record.Acknowledged === 1) {
										bgcolor = 'ack_red test'
									} else {
										bgcolor = 'red test'
									}
								}
								return bgcolor
							}}
						/>
					</div>
				</Col>
			</Row>
			<ContextMenu id="simple">
				{
					user.branch != 'ZH' && user.name != 'admin' ?
						<MenuItem onClick={addNote}><Icon type="edit" />  添加备注 ...</MenuItem>
						:
						<>
							<MenuItem onClick={takeOverAlarm}><Icon type="user" />  接管报警 ...</MenuItem>
							<MenuItem divider />
							<SubMenu title={<span><Icon type="tool" />  处理完成</span>} hoverDelay={100}>
								<MenuItem onClick={processFinishedAlarm}>处理完成</MenuItem>
								<MenuItem onClick={alreadyKnown}>已知问题</MenuItem>
								<MenuItem onClick={changeInPlan}>计划内变更</MenuItem>
								<MenuItem onClick={relatedAlarm}>关联告警</MenuItem>
								<MenuItem onClick={autoBack}>自动恢复</MenuItem>
								<MenuItem onClick={other}>其它</MenuItem>
								<MenuItem onClick={ackedByEngineer}>一线工程师诊断无影响</MenuItem>
								<MenuItem onClick={notifiedBranch}>已通知{ozr('FH')}</MenuItem>
								<MenuItem onClick={cantSetMantainance}>无法设置维护期</MenuItem>
								<MenuItem onClick={noNeedHandle}>无需处理</MenuItem>
								<MenuItem onClick={noSetMantainance}>未设置维护期</MenuItem>
								<SubMenu title={<span><Icon type="minus-circle" />  无效告警</span>} hoverDelay={100}>
									<MenuItem onClick={() => onInvalidAlert('通知业务')}>通知业务</MenuItem>
									<MenuItem onClick={() => onInvalidAlert('通知运维二线，未作处置')}>通知运维二线，未作处置</MenuItem>
									<MenuItem onClick={() => onInvalidAlert('连续告警无影响，有预案')}>连续告警无影响，有预案</MenuItem>
									<MenuItem onClick={() => onInvalidAlert('连续告警无影响，无预案')}>连续告警无影响，无预案</MenuItem>
									<MenuItem onClick={() => onInvalidAlert('等到投产日/变更窗口处理')}>等到投产日/变更窗口处理</MenuItem>
									<MenuItem onClick={() => onInvalidAlert('建议管理员屏蔽')}>建议管理员屏蔽</MenuItem>
									<MenuItem onClick={() => onInvalidAlert('运维安全类告警')}>运维安全类告警</MenuItem>
								</SubMenu>
							</SubMenu>
							<MenuItem divider />
							<SubMenu title={<span><Icon type="customer-service" />  外呼</span>} hoverDelay={100}>
								{callOutMenu}
							</SubMenu>
							<MenuItem divider />
							<MenuItem onClick={addNote}><Icon type="edit" />  添加备注 ...</MenuItem>
							<MenuItem onClick={addRecalculate}><Icon type="retweet" />  维护期重计算</MenuItem>
							<MenuItem onClick={sendWorkOrder}><Icon type="export" />  生成工单 ...</MenuItem>
							<MenuItem onClick={cmdb}><Icon type="database" />  CMDB配置信息查询</MenuItem>
							{delay.length === 0 ? null : <MenuItem onClick={alarmDelay}><Icon type="hourglass" />  延迟处理</MenuItem>}
							<MenuItem onClick={toDcpms}><Icon type="search" />  推送机房巡检信息 ...</MenuItem>
							{roleArr.length === 0 ? null : <MenuItem onClick={forceCloseAlarm}><Icon type="close" />  强制关闭 ...</MenuItem>}
							{givenForceCloseArr.length === 0 ? null : <MenuItem onClick={givenForceCloseAlarm}><Icon type="close" />  一线强制关闭 ...</MenuItem>}
							{toolInfo}
							<MenuItem divider />
							<MenuItem onClick={followAlarm}><Icon type="bell" />  开启跟踪提醒</MenuItem>
							<MenuItem divider />
							<SubMenu title={<span><Icon type="filter" />  快速过滤</span>} hoverDelay={100}>
								<MenuItem onClick={filterClick} data={{ op: '=' }}>=</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: '>' }}>&gt;</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: '<' }}>&lt;</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: '>=' }}>&gt;=</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: '<=' }}>&lt;=</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: '!=' }}>!=</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: 'like' }}>like</MenuItem>
								<MenuItem onClick={filterClick} data={{ op: 'not like' }}>not like</MenuItem>
							</SubMenu>
							<MenuItem onClick={getResultRecommend}><Icon type="solution" />告警根因推荐</MenuItem>
						</>
				}
			</ContextMenu>
		</div>
	)
}

export default list

/*
		<SubMenu title={<span><Icon type="arrow-up" />  告警升降级</span>} hoverDelay={100}>
				<MenuItem data={{ sev: '100', orginSev: '1' }} onClick={changeSeverity}><Badge dot={true} style={{ backgroundColor: '#722ed1' }} />&nbsp;&nbsp;信息</MenuItem>
				<MenuItem data={{ sev: '4', orginSev: '2' }} onClick={changeSeverity}><Badge dot={true} style={{ backgroundColor: '#1890ff' }} />&nbsp;&nbsp;提示</MenuItem>
				<MenuItem data={{ sev: '3', orginSev: '3' }} onClick={changeSeverity}><Badge dot={true} style={{ backgroundColor: '#fadb14' }} />&nbsp;&nbsp;预警</MenuItem>
				<MenuItem data={{ sev: '2', orginSev: '4' }} onClick={changeSeverity}><Badge dot={true} style={{ backgroundColor: '#fa8c16' }} />&nbsp;&nbsp;告警</MenuItem>
				<MenuItem data={{ sev: '1', orginSev: '5' }} onClick={changeSeverity}><Badge dot={true} style={{ backgroundColor: '#f5222d' }} />&nbsp;&nbsp;故障</MenuItem>
		  </SubMenu>
		  <MenuItem divider />
		  */
