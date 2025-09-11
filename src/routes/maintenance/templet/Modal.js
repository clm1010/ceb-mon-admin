import React from 'react'
import PropTypes from 'prop-types'
import mystyle from './DataModal.less'
import { Form, Input, Modal, Select, Tabs, Row, Col, Icon, Checkbox, Tooltip } from 'antd'
import ConditionBasicMode from '../../../components/maintenance/eventFilter/ConditionBasicMode'		//基础模式
import ConditionAdvancedMode from '../../../components/maintenance/eventFilter/ConditionAdvancedMode'		//专家模式
import ConditionOtherMode from '../../../components/maintenance/eventFilter/ConditionOtherMode'		//高级模式
import debounce from 'throttle-debounce/debounce'
import UserSelectComp from '../../../components/userSelectComp'
import { genDictOptsByName, getSourceByKey } from '../../../utils/FunctionTool'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const FormItemProps = {
	style: {
		margin: 0,
	},
}
const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout2 = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 12,
	},
}
const formItemLayoutAppName = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
}
const formItemLayoutAppNameEditing = {
	wrapperCol: {
		span: 24,
	},
}
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
}

const formButtonLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}
const formItemLayout5 = {
	labelCol: {
		span: 12,
	},
	wrapperCol: {
		span: 12,
	},
}
const formItemLayout6 = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
}
const modal = ({
	loading,
	dispatch,
	visible,
	type,
	currentItem,
	form,
	modalType,
	isClose,
	fenhang,
	listHost1,
	listHost2,
	selectHostuuid,
	host2portMap,
	listPort1,
	listPort2,
	listApp1,
	listApp2,
	listQita1,
	listQita2,
	listDistributed2,
	selectedKeysHost1,
	selectedKeysHost2,
	selectedKeysPort1,
	selectedKeysPort2,
	selectedKeysApp1,
	selectedKeysApp2,
	selectedKeysQita1,
	selectedKeysQita2,
	paginationHost,
	paginationPort,
	paginationApp,
	paginationQita,
	alarmType, //区分是基础模式还是专家模式,
	moFilterValue,
	list,
	buttonState,
	user,
	isExpert,
	hostOtherValue,
	appOtherValue,
	gjtzOtherValue,
	fetchingIP,
	fetchingApp,
	alertGroupValue,
	componentValue,
	targetGroupUUIDs,
	branchipOptions,
	options,
	serversOptions,
	osOptions,
	dbOptions,
	mwsOptions,
	appOptions,
	appSelect,
	optionAppNameEditing,
	optionCluster,
	optionNamespace,
	optionIndicator,
	appNameAuto,
	appNameEditing,
	appDistributed,		//分布式维护期被选中的应用
	clusterDistributed,	//分布式维护期被选中的一个应用下的集群
	namespaceDistributed, //分布式维护期被选中的命名空间
	indicatorDistributed,	//分布式维护期被选中的指标
	appDistributedFlag,		
	clusterDistributedFlag,	
	namespaceDistributedFlag, 
	indicatorDistributedFlag,
	arrGroupValue,
	showGroupValue,
	forbind,
	transaStatus,
	batchStatus,

	userSelect,
	applicantInfo,
	alertLevel,
	AgentValue,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields,
	} = form

	let flag = false
	if (appNameAuto != '' && appNameEditing.length > 0) {
		resetFields(['appNameEditing'])
	}
	if (type === 'see') {
		flag = true
	}
	//查询是否有专家模式权限--start
	let isExpertRoles = true
	if (type === 'see') {
		isExpertRoles = false
	}
	//end



	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}
			data.appNameAuto = ''
			data.appNameEditing = data.appNameEditing.length === 0 ? '' : data.appNameEditing.join(',')
			//告警过滤条件获取--------start
			let mofilterval = {}
			let fields = ['basicLogicOp', 'filterMode']
			let filterIndex = [0]
			if (moFilterValue && moFilterValue.filterIndex && moFilterValue.filterIndex.length > 0) {
				filterIndex = moFilterValue.filterIndex
			}
			if (moFilterValue && moFilterValue.filterItems && moFilterValue.filterItems.length > 0 && moFilterValue.filterItems.length != filterIndex.length) {
				let indexs = []
				moFilterValue.filterItems.forEach((item, index) => {
					indexs.push(index)
				})
				filterIndex = indexs
			}
			filterIndex.forEach((num) => {
				fields.push(`leftBrackets_${num}`)
				fields.push(`field_${num}`)
				fields.push(`op_${num}`)
				fields.push(`value_${num}`)
				fields.push(`rightBrackets_${num}`)
				fields.push(`logicOp_${num}`)
			})

			const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
			let arrs = []
			filterIndex.forEach((num, index) => {
				let bean = {}
				bean.leftBrackets = valObj[`leftBrackets_${num}`]
				bean.field = valObj[`field_${num}`]
				bean.op = valObj[`op_${num}`]
				bean.value = valObj[`value_${num}`]
				bean.rightBrackets = valObj[`rightBrackets_${num}`]
				bean.logicOp = valObj[`logicOp_${num}`]
				//bean.idx = index
				if (bean.field && bean.field !== '') {
					arrs.push(bean)
				}
			})

			mofilterval.basicLogicOp = valObj.basicLogicOp
			mofilterval.filterMode = valObj.filterMode
			mofilterval.filterItems = arrs

			//告警过滤条件获取--------end

			let saveitem = {}
			saveitem.appNameAuto = ''
			saveitem.appNameEditing = data.appNameEditing
			// saveitem.branch=data.branch;
			if (targetGroupUUIDs.length > 0) {
				saveitem.targetGroupUUIDs = targetGroupUUIDs
			}
			saveitem.name = data.name
			saveitem.description = data.description
			saveitem.enabled = true

			let applicant = ''
			if (data.applicant && data.applicant.length > 0) {
				applicant = data.applicant.split('/')[0]
			}
			saveitem.applicant = applicant

			let filter = {}

			let basicFilter = {}
			basicFilter.appFilterItems = []
			basicFilter.neFilterItems = []
			basicFilter.otherFilterItems = []
			basicFilter.distributedFilterItems = []
			listApp2.forEach((app, index) => {
				let appitem = {}
				appitem.description = app.businessIntroduction
				appitem.name = app.affectSystem
				appitem.objectUUID = app.uuid
				appitem.componetType = app.componentType
				basicFilter.appFilterItems.push(appitem)
			})
			listQita2.forEach((qita, index) => {
				let qitaitem = {}
				qitaitem.appName = qita.appName
				qitaitem.name = qita.keyword
				qitaitem.alias = qita.name
				qitaitem.objectUUID = qita.uuid
				basicFilter.otherFilterItems.push(qitaitem)
			})
			listDistributed2.forEach((qita, index) => {
				// 
			})
			listHost2.forEach((host, index) => {
				let mo = host.mo
				let hostitem = {}
				hostitem.keyword = mo.keyword
				hostitem.hostname = mo.name
				let moports = host2portMap.get(mo.uuid)
				if (moports && moports.length > 0) {
					let ports = []
					moports.forEach((portEntity, index) => {
						let port = {}
						port.description = portEntity.description
						port.name = portEntity.portName
						port.objectUUID = portEntity.uuid
						ports.push(port)
					})
					hostitem.ports = ports
				}
				hostitem.objectUUID = mo.uuid
				basicFilter.neFilterItems.push(hostitem)
			})
			// 分布式维护期新增功能
			if (appDistributed !== '' && appDistributed !== null && appDistributed !== undefined) {
				const clusterArray = clusterDistributed.map(item => {
					return { name: item };
				});
				const namespaceArray = namespaceDistributed.map(item => {
					return { name: item };
				});
				const indicatorArray = indicatorDistributed.map(item => {
					return { name: item };
				});
				
				const tempApp = {
					application: {
						clusters: clusterArray,
						namespaces: namespaceArray,
						indicators: indicatorArray,
						name: appDistributed
					}
				}
				basicFilter.distributedFilterItems.push(tempApp)//fox
			}

			//高级模式---start
			let arrsOther = []
			if (arrGroupValue.length === 1) {
				let dataValue = arrGroupValue[0]
				if (dataValue.appOther && dataValue.appOther !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'N_AppName'
					bean.op = '='
					bean.value = dataValue.appOther
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}
				if (dataValue.hostOther && dataValue.hostOther.length !== 0) {
					let hostArray = []
					if (dataValue.hostOther.length === 1) {
						dataValue.hostOther.forEach((item) => {
							let arrIP = item.split('/')
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'AND'
							bean.field = 'NodeAlias'
							bean.op = '='
							bean.value = arrIP[0]
							bean.rightBrackets = ')'
							if (dataValue.ipScopeValue && dataValue.ipScopeValue !== '') {
								bean.rightBrackets = '))'
							}
							if (bean.field && bean.field !== '') {
								arrsOther.push(bean)
							}
						})

					} else {
						dataValue.hostOther.forEach((item) => {
							let arrIP = item.split('/')
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'OR'
							bean.field = 'NodeAlias'
							bean.op = '='
							bean.value = arrIP[0]
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								hostArray.push(bean)
							}
						})
						let i = hostArray.length
						hostArray[0].leftBrackets = '(('
						hostArray[i - 1].rightBrackets = '))'
						hostArray[i - 1].logicOp = 'AND'
						if (dataValue.ipScopeValue && dataValue.ipScopeValue !== '') {
							hostArray[0].leftBrackets = '('
							hostArray[i - 1].rightBrackets = '))'
						}
						Array.prototype.push.apply(arrsOther, hostArray)
					}
				}
				if (dataValue.gjtzOther && dataValue.gjtzOther !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'N_SummaryCN'
					bean.op = 'like'
					bean.value = dataValue.gjtzOther
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}
				if (dataValue.alertGroup && dataValue.alertGroup !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'AlertGroup'
					bean.op = 'like'
					bean.value = dataValue.alertGroup
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}
				if (dataValue.component && dataValue.component !== '') {
					let componentTypeList = []
					if (dataValue.component.length === 1) {
						dataValue.component.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'AND'
							bean.field = 'N_ComponentType'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								arrsOther.push(bean)
							}
						})
					} else if (dataValue.component.length > 1) {
						dataValue.component.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'OR'
							bean.field = 'N_ComponentType'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								componentTypeList.push(bean)
							}
						})
						let i = componentTypeList.length
						componentTypeList[0].leftBrackets = '(('
						componentTypeList[i - 1].rightBrackets = '))'
						componentTypeList[i - 1].logicOp = 'AND'
						Array.prototype.push.apply(arrsOther, componentTypeList)
					}
				}
				if (dataValue.alertLevel && dataValue.alertLevel !== '') {
					let alertLevelTypeList = []
					if (dataValue.alertLevel.length === 1) {
						dataValue.alertLevel.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'AND'
							bean.field = 'N_CustomerSeverity'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								arrsOther.push(bean)
							}
						})
					} else if (dataValue.alertLevel.length > 1) {
						dataValue.alertLevel.forEach((item) => {
							let bean = {}
							bean.leftBrackets = '('
							bean.logicOp = 'OR'
							bean.field = 'N_CustomerSeverity'
							bean.op = '='
							bean.value = item
							bean.rightBrackets = ')'
							if (bean.field && bean.field !== '') {
								alertLevelTypeList.push(bean)
							}
						})
						let i = alertLevelTypeList.length
						alertLevelTypeList[0].leftBrackets = '(('
						alertLevelTypeList[i - 1].rightBrackets = '))'
						alertLevelTypeList[i - 1].logicOp = 'AND'
						Array.prototype.push.apply(arrsOther, alertLevelTypeList)
					}
				}

				if (dataValue.Agent && dataValue.Agent !== '') {
					let bean = {}
					bean.leftBrackets = '('
					bean.logicOp = 'AND'
					bean.field = 'Agent'
					bean.op = 'like'
					bean.value = dataValue.Agent
					bean.rightBrackets = ')'
					if (bean.field && bean.field !== '') {
						arrsOther.push(bean)
					}
				}

				let len = arrsOther.length
				arrsOther[0].leftBrackets = arrsOther[0].leftBrackets + '('
				arrsOther[len - 1].rightBrackets = arrsOther[len - 1].rightBrackets + ')'

			} else if (arrGroupValue.length > 1) {
				arrGroupValue.forEach((item => {
					let data = item
					let oneGroupValues = []
					if (data.appOther && data.appOther !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'N_AppName'
						bean.op = '='
						bean.value = data.appOther
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					if (data.hostOther && data.hostOther.length !== 0) {
						let hostArray = []
						if (data.hostOther.length === 1) {
							data.hostOther.forEach((item) => {
								let arrIP = item.split('/')
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'AND'
								bean.field = 'NodeAlias'
								bean.op = '='
								bean.value = arrIP[0]
								bean.rightBrackets = ')'
								if (data.ipScopeValue && data.ipScopeValue !== '') {
									bean.rightBrackets = '))'
								}
								if (bean.field && bean.field !== '') {
									oneGroupValues.push(bean)
								}
							})
						} else {
							data.hostOther.forEach((item) => {
								let arrIP = item.split('/')
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'OR'
								bean.field = 'NodeAlias'
								bean.op = '='
								bean.value = arrIP[0]
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									hostArray.push(bean)
								}
							})
							let i = hostArray.length
							hostArray[0].leftBrackets = '(('
							hostArray[i - 1].rightBrackets = '))'
							hostArray[i - 1].logicOp = 'AND'
							if (data.ipScopeValue && data.ipScopeValue !== '') {
								hostArray[0].leftBrackets = '('
								hostArray[i - 1].rightBrackets = '))'
							}
							Array.prototype.push.apply(oneGroupValues, hostArray)
						}
					}
					if (data.gjtzOther && data.gjtzOther !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'N_SummaryCN'
						bean.op = 'like'
						bean.value = data.gjtzOther
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					if (data.alertGroup && data.alertGroup !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'AlertGroup'
						bean.op = 'like'
						bean.value = data.alertGroup
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					if (data.component && data.component !== '') {
						let componentTypeList = []
						if (data.component.length === 1) {
							data.component.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'AND'
								bean.field = 'N_ComponentType'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									oneGroupValues.push(bean)
								}
							})
						} else if (data.component.length > 1) {
							data.component.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'OR'
								bean.field = 'N_ComponentType'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									componentTypeList.push(bean)
								}
							})
							let i = componentTypeList.length
							componentTypeList[0].leftBrackets = '(('
							componentTypeList[i - 1].rightBrackets = '))'
							componentTypeList[i - 1].logicOp = 'AND'
							Array.prototype.push.apply(oneGroupValues, componentTypeList)
						}
					}

					if (data.alertLevel && data.alertLevel !== '') {
						let alertLevelTypeList = []
						if (data.alertLevel.length === 1) {
							data.alertLevel.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'AND'
								bean.field = 'N_CustomerSeverity'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									oneGroupValues.push(bean)
								}
							})
						} else if (data.alertLevel.length > 1) {
							data.alertLevel.forEach((item) => {
								let bean = {}
								bean.leftBrackets = '('
								bean.logicOp = 'OR'
								bean.field = 'N_CustomerSeverity'
								bean.op = '='
								bean.value = item
								bean.rightBrackets = ')'
								if (bean.field && bean.field !== '') {
									alertLevelTypeList.push(bean)
								}
							})
							let i = alertLevelTypeList.length
							alertLevelTypeList[0].leftBrackets = '(('
							alertLevelTypeList[i - 1].rightBrackets = '))'
							alertLevelTypeList[i - 1].logicOp = 'AND'
							Array.prototype.push.apply(oneGroupValues, alertLevelTypeList)
						}
					}
					if (data.Agent && data.Agent !== '') {
						let bean = {}
						bean.leftBrackets = '('
						bean.logicOp = 'AND'
						bean.field = 'Agent'
						bean.op = 'like'
						bean.value = data.Agent
						bean.rightBrackets = ')'
						if (bean.field && bean.field !== '') {
							oneGroupValues.push(bean)
						}
					}
					
					let len = oneGroupValues.length
					oneGroupValues[0].leftBrackets = oneGroupValues[0].leftBrackets + '('
					oneGroupValues[len - 1].rightBrackets = oneGroupValues[len - 1].rightBrackets + ')'
					oneGroupValues[len - 1].logicOp = 'OR'
					Array.prototype.push.apply(arrsOther, oneGroupValues)
				}))

			}
			//end
			filter.filterMode = data.filterModeWai
			if (data.filterModeWai === 'BASIC') {
				filter.basicFilter = basicFilter
			} else if (data.filterModeWai === 'ADVANCED') {
				filter.advFilterItems = mofilterval.filterItems
			} else if (data.filterModeWai === 'SENIOR') {
				if (arrsOther.length !== 0) {
					arrsOther[arrsOther.length - 1].logicOp = ''
				}
				filter.advFilterItems = arrsOther
			}

			saveitem.filter = filter
			let a = JSON.stringify(saveitem)
			//维护期告警定义验证--start
			let valiFilter = true
			let valiFilterAppName = true
			let filterModeValue = saveitem.filter.filterMode
			if (filterModeValue === 'ADVANCED') {
				if (saveitem.filter.advFilterItems && saveitem.filter.advFilterItems.length !== 0) {
					if (saveitem.filter.advFilterItems.length === 1) {
						saveitem.filter.advFilterItems.forEach((item, index) => {
							if (item.field === '' || item.op === '' || item.value === '') {
								valiFilter = false
							}
						})
					} else {
						let advFilterItemsArray = []
						saveitem.filter.advFilterItems.forEach((items) => {
							if (items.logicOp !== '') {
								advFilterItemsArray.push(items)
							}
						})

						advFilterItemsArray.forEach((item, index) => {
							if (item.field === '' || item.leftBrackets === '' || item.op === '' || item.rightBrackets === '' || item.value === '' || item.logicOp === '') {
								valiFilter = false
							}
						})
						//						saveitem.filter.advFilterItems.forEach((item,index) => {
						//							if(item.field === '' || item.leftBrackets === '' || item.op === '' || item.rightBrackets === '' || item.value === '' || item.logicOp === ''){
						//								valiFilter = false
						//							}
						//						})
					}
				} else {
					valiFilter = false
					//					saveitem.filter.advFilterItems.forEach((item,index) => {
					//						if(item.field === '' || item.leftBrackets === '' || item.op === '' || item.rightBrackets === '' || item.value === '' ){
					//							valiFilter = false
					//						}
					//					})
				}
			} else if (filterModeValue === 'BASIC') {
				if (saveitem.filter.basicFilter) {
					if (saveitem.filter.basicFilter.neFilterItems.length === 0 && saveitem.filter.basicFilter.appFilterItems.length === 0 && saveitem.filter.basicFilter.otherFilterItems.length === 0 && saveitem.filter.basicFilter.distributedFilterItems.length === 0) {
						valiFilter = false
					}
					for (let info of saveitem.filter.basicFilter.otherFilterItems) {
						if (info.appName === undefined) {
							valiFilterAppName = false
						}
					}
				}
			} else if (filterModeValue === 'SENIOR') {
				if (saveitem.filter.advFilterItems && saveitem.filter.advFilterItems.length !== 0) {
					saveitem.filter.advFilterItems.forEach((item, index) => {
						if (item.field === '' || item.op === '' || item.value === '') {
							valiFilter = false
						}
					})
				} else {
					valiFilter = false
				}
			}
			//end
			//验证重名---start
			let vailName = false
			if (list.length !== 0) {
				if (type === 'create') {
					list.forEach((item) => {
						if (item.name === data.name) {
							vailName = true
						}
					})
				}
			}
			//end
			let IPState = false
			//验证维护期告警定义IP
			let regex = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.'
				+ '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'
				+ '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'
				+ '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
			let IPfilter = saveitem.filter.advFilterItems
			if (IPfilter && filterModeValue === 'ADVANCED') {
				for (let i = 0; i < IPfilter.length; i++) {
					if ((IPfilter[i].field === 'NodeAlias' && !IPfilter[i].value.match(regex) && IPfilter[i].op === '=') || (IPfilter[i].field === 'NodeAlias' && !IPfilter[i].value.match(regex) && IPfilter[i].op === '!=')) {
						IPState = true
					}
				}
			}
			/* 
				白名单
			*/
			saveitem.whitelistEnabled = data.whitelistEnabled.join(",")
			if (!valiFilter) {
				Modal.warning({
					title: '告警定义不能为空！',
					okText: 'OK',
				})
			} else if (!valiFilterAppName) {
				Modal.warning({
					title: '其他域的应用分类名称为空！',
					okText: 'OK',
				})
			} else if (vailName) {
				Modal.warning({
					title: '维护期名称不能重复，请重新输入！',
					okText: 'OK',
				})
			} else if (IPState) {
				Modal.warning({
					title: '维护期告警定义，告警IP格式错误！',
					okText: 'OK',
				})
			} else {
				dispatch({
					type: `maintenanceTemplet/${type}`,
					payload: saveitem,
				})
				resetFields()
			}

			if (type === 'see') {
				dispatch({
					type: 'maintenanceTemplet/updateState',
					payload: {
						modalVisible: false,
						isClose: true,
						arrGroupValue: [],
						showGroupValue: {},
						transaStatus: false,
						batchStatus: false,
					},
				})
			}
		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'appSelect/clearState',
		})
		dispatch({
			type: 'maintenanceTemplet/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
				listHost1: [],
				listHost2: [],
				selectHostuuid: '',
				host2portMap: new Map(),
				listPort1: [],
				listPort2: [],
				listApp1: [],
				optionAppNameEditing: [],
				listApp2: [],
				listDistributed2: [],
				listQita1: [],
				listQita2: [],
				selectedKeysHost1: [],
				selectedKeysPort1: [],
				selectedKeysApp1: [],
				selectedKeysQita1: [],
				selectedKeysHost2: [],
				selectedKeysPort2: [],
				selectedKeysApp2: [],
				selectedKeysQita2: [],
				hostname: '',
				hostkeyword: '',
				portname: '',
				appName: '',
				bizDesc: '',
				nameQita: '',
				keywordQita: '',
				appQita: '',
				alertGroupValue: '',
				componentValue: [],
				optionCluster:[],
				optionNamespace:[],
				optionIndicator:[],
				appNameAuto: '',
				appNameEditing: [],
				appDistributed: '',
				clusterDistributed: [],
				namespaceDistributed: [],
				indicatorDistributed: [],
				appDistributedFlag: false,		
				clusterDistributedFlag: false,	
				namespaceDistributedFlag: false, 
				indicatorDistributedFlag: false,
				arrGroupValue: [],
				showGroupValue: {},
				transaStatus: false,
				batchStatus: false,
			},
		})
		dispatch({
			type: 'maintenanceTemplet/controlButton',
			payload: {
				buttonState: true,
			},
		})
	}

	const modalOpts = {
		title: `${type === 'create' ? '新增维护期管理模板' : '编辑维护期管理模板'}`,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const moFilterBasicProps = {
		loading,
		dispatch,
		filter: moFilterValue,
		localPath: 'maintenanceTemplet',
		queryPath: 'maintenanceTemplet/updateState',
		moFilterName: 'moFilterValue',
		myform: form,
		isExpertRoles,
		type,
		isExpert,
		listHost1,
		listHost2,
		selectHostuuid,
		host2portMap,
		listPort1,
		listPort2,
		listApp1,
		optionAppNameEditing,
		optionCluster,
		optionNamespace,
		optionIndicator,
		listApp2,
		listQita1,
		listQita2,
		listDistributed2,
		selectedKeysHost1,
		selectedKeysHost2,
		selectedKeysPort1,
		selectedKeysPort2,
		selectedKeysApp1,
		selectedKeysApp2,
		selectedKeysQita1,
		selectedKeysQita2,
		paginationHost,
		paginationPort,
		paginationApp,
		paginationQita,
		buttonState,
		appSelect,
		forbind,
		appDistributed,
		clusterDistributed,
		namespaceDistributed,
		indicatorDistributed,
		appDistributedFlag,		
		clusterDistributedFlag,	
		namespaceDistributedFlag, 
		indicatorDistributedFlag,
	}

	const moFilterProps = {
		dispatch,
		filter: moFilterValue,
		localPath: 'maintenanceTemplet',
		queryPath: 'maintenanceTemplet/updateState',
		moFilterName: 'moFilterValue',
		myform: form,
		isExpertRoles,
		type,
		isExpert,
	}

	const moFilterOtherProps = {
		currentItem,
		dispatch,
		filter: moFilterValue,
		localPath: 'maintenanceTemplet',
		queryPath: 'maintenanceTemplet/updateState',
		moFilterName: 'moFilterValue',
		myform: form,
		isExpertRoles,
		type,
		isExpert,
		listHost1,
		listApp1,
		listQita1,
		hostOtherValue,
		appOtherValue,
		gjtzOtherValue,
		fetchingIP,
		fetchingApp,
		alertGroupValue,
		componentValue,
		branchipOptions,
		options,
		serversOptions,
		osOptions,
		dbOptions,
		mwsOptions,
		appOptions,
		arrGroupValue,
		showGroupValue,
		alertLevel,
		AgentValue,
	}

	const typeChange = (value) => {
		isExpert = false
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				alarmType: value,
				isExpert,
				appName: '',
				bizDesc: '',
				moFilterValue: {
					filterMode: value,
				},
			},
		})
	}

	const operations = (<FormItem {...FormItemProps} key="modeswitchWai">
		{getFieldDecorator('filterModeWai', {
			initialValue: alarmType,
		})(<Select disabled={type === 'see'} size="small" onChange={typeChange} style={{ width: '120px' }}>
			<Select.Option value="BASIC">基础模式</Select.Option>
			<Select.Option value="SENIOR">高级模式</Select.Option>
			<Select.Option value="ADVANCED">专家模式</Select.Option>
		</Select>)
		}
	</FormItem>)
	//适用范围查询条件搜索
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}

	//查询维护期名称是否存在
	const queryName = (value) => {
		const data = {
			...getFieldsValue(), //获取弹出框所有字段的值
		}
		let q = `name=='*${data.name}*'`
		dispatch({
			type: 'maintenanceTemplet/query',
			payload: {
				q,
			},
		})
	}

	const appNameEditingFind = (value) => {
		if (value != '') {
			let q = `systemName=='*${value}*'`
			dispatch({
				type: 'maintenanceTemplet/queryAppNameEditing',
				payload: {
					q,
				},
			})
		}
	}

	const onAppNameEditingChange = (value) => {
		let hostStr = ''
		if (value.length !== 0) {
			let arrays = []
			value.forEach((item) => {
				let arrs = item.split('/')
				arrays.push(arrs[0])
			})
			if (arrays.length === 0) {
				hostStr = []
			} else if (arrays.length === 1) {
				hostStr = [arrays[0]]
			} else {
				hostStr = arrays
			}
		}
		dispatch({
			type: '' + 'mainRuleInstanceInfo/updateState',
			payload: {
				appNameEditing: hostStr,
			},
		})
	}
	const onChangeBatch = (value) => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				batchStatus: value.target.checked,
			},
		})
	}
	const onChangeTransa = (value) => {
		dispatch({
			type: 'maintenanceTemplet/updateState',
			payload: {
				transaStatus: value.target.checked,
			},
		})
	}

	const userSelectProps = Object.assign({}, userSelect, {
		placeholders: '申请人工号或姓名检索', name: '申请人', modeType: 'combobox', required: false, dispatch, form, currentItem, disabled: type === 'see', compName: 'applicant', cDefaultName: applicantInfo,
	})

	const checkboxOption = []
	const defaultCheckbox = []
	getSourceByKey("whileList_Maintain").forEach(item => {
		if (item.description.includes("default-true") && type === 'create') {
			defaultCheckbox.push(item.key)
		}
		checkboxOption.push({ label: item.name, value: item.key })
	})

	return (
		isClose ? null :
			<Modal {...modalOpts} width="1250px" >
				<Form layout="horizontal">
					<FormItem label="模板名称" hasFeedback {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: currentItem.name,
							rules: [
								{
									required: true,
								},
							],
						})(<Input onBlur={queryName} disabled={type === 'see'} />)}
					</FormItem>
					<FormItem label="描述" hasFeedback {...formItemLayout}>
						{getFieldDecorator('description', {
							initialValue: currentItem.description,
							rules: [
								{
									required: true,
								},
							],
						})(<Input disabled={type === 'see'} />)}
					</FormItem>
					<UserSelectComp {...userSelectProps} />
					<Row span={20}>
						<Col span={12}>
							<FormItem label="应用系统名称" hasFeedback {...formItemLayoutAppName}>
								{getFieldDecorator('appNameAuto', {
									initialValue: appNameAuto,
									rules: [
										{
											required: false,
										},
									],
								})(<Input
									disabled
								/>)
								}
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem hasFeedback {...formItemLayoutAppNameEditing}>
								{getFieldDecorator('appNameEditing', {
									initialValue: appNameEditing.length > 0 ? appNameEditing : [],
									rules: [
										{
											required: false,
										},
									],
								})(<Select
									placeholder={appNameEditing.length === 0 ? '默认全局' : ''}
									mode="multiple"
									showArrow={false}
									disabled={flag}
									onSearch={debounce(800, appNameEditingFind)}
									onChange={onAppNameEditingChange}
									getPopupContainer={() => document.body}
								>
									{optionAppNameEditing}
								</Select>)
								}
							</FormItem>
						</Col>
					</Row>

					<Row span={24}>
						<Col span={20}>
							<FormItem label="不进维护期告警" hasFeedback {...formItemLayout6}>
								{getFieldDecorator('whitelistEnabled', {
									initialValue: currentItem.whitelistEnabled ? currentItem.whitelistEnabled.split(",") : defaultCheckbox,
								})((<Checkbox.Group
									className={mystyle.checkboxGroup}
									options={checkboxOption}
								/>))}
							</FormItem>
						</Col>
						<Col span={4} >
							<Tooltip title={"选中后,该类型告警将不进维护期"} overlayClassName='bmd'>
								<Icon type="question" style={{ color: '#eb2f96', fontSize: "16px", marginTop: "7px", fontWeight: "900" }} />
							</Tooltip>
						</Col>
					</Row>
					<Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
						<TabPane tab={<span><Icon type="user" />维护期告警定义</span>} key="1">
							{/*基本模式--start*/}
							{
								((alarmType === 'BASIC')) ?
									<ConditionBasicMode {...moFilterBasicProps} />
									:
									null
							}
							{/*end*/}

							{/*专家模式--start*/}
							{
								((alarmType === 'ADVANCED')) ?
									<ConditionAdvancedMode {...moFilterProps} />
									:
									null
							}
							{/*end*/}

							{/*高级模式--start*/}
							{
								((alarmType === 'SENIOR')) ?
									<ConditionOtherMode {...moFilterOtherProps} />
									:
									null
							}
							{/*end*/}
						</TabPane>
					</Tabs>

					{
						(type !== 'create') ?

							<Row gutter={24}>
								<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
									<FormItem label="创建人" {...formItemLayout} >
										{getFieldDecorator('Creater', {
											initialValue: currentItem.createdBy,
										})(<Input style={{ width: 100 }} disabled />)}
									</FormItem>
								</Col>
								<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
									<FormItem label="创建时间" {...formItemLayout}>
										{getFieldDecorator('CreaterTime', {
											initialValue: new Date(currentItem.createdTime).format('yyyy-MM-dd hh:mm:ss'),
										})(<Input disabled />)}
									</FormItem>
								</Col>
							</Row>
							: null
					}

					{
						(type !== 'create') ?
							<Row gutter={24}>
								<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
									<FormItem label="最后更新人" {...formItemLayout}>
										{getFieldDecorator('LastCreater', {
											initialValue: currentItem.updatedBy,
										})(<Input style={{ width: 100 }} disabled />)}
									</FormItem>
								</Col>
								<Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
									<FormItem label="最后更新时间" {...formItemLayout}>
										{getFieldDecorator('LastCreaterTime', {
											initialValue: new Date(currentItem.updatedTime).format('yyyy-MM-dd hh:mm:ss'),
										})(<Input disabled />)}
									</FormItem>
								</Col>
							</Row>
							: null
					}

				</Form>

			</Modal>
	)
}

modal.propTypes = {
	form: PropTypes.object.isRequired,
	visible: PropTypes.bool,
	type: PropTypes.string,
	item: PropTypes.object,
	onCancel: PropTypes.func,
	onOk: PropTypes.func,
}

export default Form.create()(modal)
