import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Select, Form, Tabs, Input, Radio, DatePicker, InputNumber,Alert } from 'antd'
import moment from 'moment'
//import 'moment/locale/zh-cn';
//moment.locale('zh-cn');

//import SelectFilters from './SelectFilters'
import SelectOP from './SelectOP'

//MO字段的统一引用
import RouterColumns from '../MOColumns/RouterColumns'
import RouterInterfaceColumns from '../MOColumns/RouterInterfaceColumns'
import FireWallColumns from '../MOColumns/FireWallColumns'
import FireWallInterfaceColumns from '../MOColumns/FireWallInterfaceColumns'
import SwitchColumns from '../MOColumns/SwitchColumns'
import SwitchInterfaceColumns from '../MOColumns/SwitchInterfaceColumns'
import F5Columns from '../MOColumns/F5Columns'
import NetworkALL from '../MOColumns/NetworkALLColumns'
import F5InterfaceColumns from '../MOColumns/F5InterfaceColumns'

import LinesColumns from '../MOColumns/LinesColumns'
import ApplicationsColumns from '../MOColumns/ApplicationsColumns'
import AppServiceColumns from '../MOColumns/AppServiceColumns'
import DatabasesColumns from '../MOColumns/DatabasesColumns'
import MiddleWaresColumns from '../MOColumns/MiddleWaresColumns'
import OSColumns from '../MOColumns/OSColumns'
import ServersColumns from '../MOColumns/ServersColumns'
import BranchIPColumns from '../MOColumns/BranchIPColumns'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
}

const moformItemLayout = {
	labelCol: {
		span: 10,
	},
	wrapperCol: {
		span: 12,
	},
}

const ColProps = {
	style: {
		marginBottom: 8,
		textAlign: 'right',
	},
}

const TwoColProps = {
	...ColProps,
	xl: 96,
}

const FormItemProps = {
	style: {
		margin: 0,
	},
}

const FormItemProps1 = {
	labelCol: {
		xs: { span: 5 },
	},
	wrapperCol: {
		xs: { span: 8 },
	},
	style: {
		margin: 0,
	},
}

const ConditionBasicMode = ({
	dispatch,
	filter,
	queryPath,
	moFilterName,
	myform,
	moTreeDatas, //MO节点树
	appsInfos, //应用系统信息
	typeValue,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields,
	} = myform
	let firstobj = {
		leftBrackets: '', field: '', op: '', value: '', rightBrackets: '', logicOp: '',
	}
	let {
		filterMode = 'BASIC',
		basicLogicOp = 'AND',
		firstClass = 'NETWORK',
		secondClass = 'ALL',
		thirdClass = '',
		filterItems = [{ ...firstobj }],
		filterIndex = [0],
	} = filter

	if (filterItems && filterItems.length === 0) {
		filterItems = [{ ...firstobj }]
	}
	if (filterIndex && filterIndex.length === 0) {
		filterIndex = [0]
	}
	if (filterIndex.length != filterItems.length) {
		let indexs = []
		if (filterItems.length > 1) {
			filterItems.forEach((item, index) => {
				indexs.push(index)
			})
		} else {
			indexs = [0]
		}
		filterIndex = indexs
	}
	/*
	 * 初始值，没有第二级的就需要把第二级的制空
	 */
	// if (firstClass === 'APP' || firstClass === 'SERVER') {
	// 	secondClass = ''
	// }

	let optionFirstClass = []
	let optionSecondClass = []
	let optionThirdClass = []


	const moTypeShowValue = (moTreeNodes) => {
		/*
		  获取每一个节点的子节点集合
		  modata : MO树
		  arrs：子节点集合存放的地方
		  val: 选中的节点的值
		  parentval：选中节点所有父节点值拼装的字符串
		*/
		const moloop = (modata, arrs, val, parentval) => modata.forEach((node, index) => {
			let tempval = ''
			if (val === '') {
				arrs.push(<Select.Option key={node.key} value={node.key}>{node.name}</Select.Option>)
			} else {
				if (parentval === '') {
					tempval = node.key
				} else {
					tempval = `${parentval}_${node.key}`
				}
				if (node.children && node.children.length > 0) {
					if (tempval === val) {
						moloop(node.children, arrs, '', '')
					} else {
						moloop(node.children, arrs, val, tempval)
					}
				}
			}
		})
		if (moTreeNodes && moTreeNodes.length > 0) {
			moloop(moTreeNodes, optionFirstClass, '', '')
			if (firstClass && firstClass !== '') {
				moloop(moTreeNodes, optionSecondClass, firstClass, '')
				if (secondClass && secondClass !== '') {
					if (secondClass === 'ALL') {
						let sClass=[],tClass = []
						moloop(moTreeNodes, sClass, firstClass, '')
						sClass.forEach(c => {
							moloop(moTreeNodes, tClass, `${firstClass}_${c.key}`, '')
						})
						let tmp=[]
						tClass.forEach(item => {
							if ((tmp.findIndex((element) => (element == item.key)))<0) {
								tmp.push(item.key);
								tmp = _.uniqBy(tmp);
								optionThirdClass.push(item)
							}
						})
					}else{
						moloop(moTreeNodes, optionThirdClass, `${firstClass}_${secondClass}`, '')
					}		
				}
			}
		}
	}
	moTypeShowValue(moTreeDatas)


	/*
	firstClass,secondClass,thirdClass: 三层数据类型
*/
	const getMoInfoByType = (firstClass, secondClass, thirdClass) => {
		let showInfoKeys = ''
		if (firstClass && firstClass !== '') {
			showInfoKeys = firstClass
		}
		if (secondClass && secondClass !== '') {
			showInfoKeys = `${showInfoKeys}_${secondClass}`
		}
		if (secondClass && secondClass !== '' && thirdClass && thirdClass !== '') {
			showInfoKeys = `${showInfoKeys}_${thirdClass}`
		}
		let fields = []
		if (showInfoKeys === 'NETWORK_ALL') {
			fields = NetworkALL
		} else if (showInfoKeys === 'NETWORK_SWITCH') {
			fields = SwitchColumns
		} else if (showInfoKeys === 'NETWORK_ROUTER') {
			fields = RouterColumns
		} else if (showInfoKeys === 'NETWORK_FIREWALL') {
			fields = FireWallColumns
		} else if (showInfoKeys === 'NETWORK_F5') {
			fields = F5Columns
		} else if (showInfoKeys === 'NETWORK_HA_LINE') {
			fields = LinesColumns
		} else if (showInfoKeys === 'NETWORK_BRANCH_IP') {
			fields = BranchIPColumns
		} else if (showInfoKeys === 'NETWORK_SWITCH_NET_INTF') {
			fields = SwitchInterfaceColumns
		} else if (showInfoKeys === 'NETWORK_ROUTER_NET_INTF' || showInfoKeys === 'NETWORK_ALL_NET_INTF') {
			fields = RouterInterfaceColumns                                                                           
		} else if (showInfoKeys === 'NETWORK_FIREWALL_NET_INTF') {
			fields = FireWallInterfaceColumns
		} else if (showInfoKeys === 'NETWORK_F5_NET_INTF') {
			fields = FireWallInterfaceColumns
		} else if (showInfoKeys.includes('OS')) {
			fields = OSColumns
		} else if (showInfoKeys.includes('DB')) {
			fields = DatabasesColumns
		} else if (showInfoKeys.includes('MW')) {
			fields = MiddleWaresColumns
		} else if (showInfoKeys.includes('APP_APP_SERVICE')) {
			fields = AppServiceColumns
		} else if (showInfoKeys.includes('APP')) {
			fields = ApplicationsColumns
		} else if (showInfoKeys === 'SERVER') {
			fields = ServersColumns
		}
		return getAppDataInfo(fields)
	}

	/**
	 *应用系统赋值
	 */
	const getAppDataInfo = (fields) => {
		//应用系统数据
		let appnamelist = []
		let appcodelist = []
		if (appsInfos && appsInfos.length > 0) {
			appsInfos.forEach((bean, index) => {
				appnamelist.push({ key: bean.affectSystem, value: bean.affectSystem })
				appcodelist.push({ key: bean.englishCode, value: bean.englishCode })
			})
		}
		let result = []
		if (fields && fields.length > 0) {
			fields.forEach((bean, index) => {
				if (bean) {
					if (bean.name === 'appName') {
						bean.options = appnamelist
					} else if (bean.name === 'appCode') {
						bean.options = appcodelist
					}
				}
				result.push(bean)
			})
		}
		return result
	}

	let SelectFilters = [] //根据分类获取的
	let columnsMap = new Map() //类型map
	let fieldsInfo = getMoInfoByType(firstClass, secondClass, thirdClass)
	if (fieldsInfo && fieldsInfo.length > 0) {
		fieldsInfo.forEach((bean, index) => {
			if (bean && bean.applicationType && bean.application.includes('filter')) {
				SelectFilters.push(<Select.Option key={bean.name} value={bean.name}>{bean.displayName}</Select.Option>)
				columnsMap.set(bean.name, bean)
			}
		})
	}
	/*
	if(!filter.columnsMap){
		filter.columnsMap = columnsMap
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]:filter,
			}
		})
	}
	*/


	const add = (index) => {
		let maxValue = 0
		for (let val of filterIndex) {
			maxValue = (maxValue < val ? val : maxValue)
		}

		//if(filterIndex.length > 0 && filterIndex.length < 11){ //把已经选择的值都保存一下。
		filterItems = allColumsVals()
		//}
		let indexList = [...filterIndex]
		indexList.splice(index + 1, 0, maxValue + 1) //插入下标的值

		let arrs = [...filterItems]
		arrs.splice(index + 1, 0, firstobj) //在指定的下标下面，插入一个数组元素

		/*
			测试用
		*/
		let newIndexList = []
		//if(filterIndex.length > 0 && filterIndex.length < 11){
		indexList.forEach((val, index) => {
			newIndexList.push(maxValue + 2 + index)
		})
		//}

		filter.filterItems = arrs
		filter.filterIndex = newIndexList

		/*
			修改过滤条件的集合
		*/
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}

	const remove = (myindex) => {
		let indexList = filterIndex.filter((val, index) => index != myindex)
		let arrs = filterItems.filter((item, index) => index != myindex)
		filter.filterItems = arrs
		filter.filterIndex = indexList

		/*

		   修改过滤条件的集合
	   */

		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}

	const getPopupContainers = (index) => {
		if (filterIndex.length > 15) {
			return document.getElementById(`div_col_${filterIndex[index]}_1`)
		}
		return document.body
	}

	const onFocus = (index) => {
		getPopupContainers(index)
	}


	const onChangeColums = (val, index) => {
		let maxValue = 0
		for (let val of filterIndex) {
			maxValue = (maxValue < val ? val : maxValue)
		}
		let myfilterItems = allColumsVals()
		myfilterItems[index].field = val
		let indexList = [...filterIndex]
		let newIndexList = []
		indexList.forEach((val, index) => {
			newIndexList.push(maxValue + 1 + index)
		})
		filter.filterItems = myfilterItems
		filter.filterIndex = newIndexList
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}

	const inputTypeControl = (fieldval) => {
		if (columnsMap && columnsMap.size > 0 && fieldval && fieldval !== '') {
			let bean = columnsMap.get(fieldval)
			if (bean && bean.applicationType && bean.applicationType === 'select') {
				let options = []
				if (bean.options && bean.options.length > 0) {
					bean.options.forEach((option, index) => {
						if (option.disabled) {
							options.push(<Select.Option key={option.key} value={option.key} disabled={option.disabled}>{option.value}</Select.Option>)
						} else {
							options.push(<Select.Option key={option.key} value={option.key}>{option.value}</Select.Option>)
						}
					})
				}
				return <Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} key={bean.name}>{options}</Select>
			} else if (bean && (bean.applicationType === 'int' || bean.applicationType === 'long' || bean.applicationType === 'Integer')) {
				return <InputNumber max={999999999} min={0} style={{ width: '100%', height: '100%' }} />
			}
		}
		return <Input />
	}

	/*
	const inputTypefalg = (fieldname,val) => {
	  if(fieldname && fieldname !== ''){
		  if(val && val !== ''){
			  if(columnsMap && columnsMap.size > 0 ){
				  let bean = columnsMap.get(fieldname)
				  if(bean && bean.name.endsWith('Time') && bean.tpe === 'long'){
					  return true
				  }
			  }
		  }
	  }
	  return false
	}*/

	const inputTypeItem = (fieldname, val, keyval, valuename) => {
		if (fieldname && fieldname !== '') {
			if (columnsMap && columnsMap.size > 0) {
				let bean = columnsMap.get(fieldname)
				if (bean && bean.name.endsWith('Time') && bean.applicationType && bean.applicationType === 'date') {
					return (
						<FormItem {...FormItemProps} hasFeedback key={keyval}>
							{
								getFieldDecorator(`${valuename}`, {
									initialValue: (val && val !== '' ? moment(moment(Number.parseInt(val)).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : val),
									rules: [
										{
											required: true,
										},
									],
								})(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)
							}
						</FormItem>
					)
				}
			}
		}

		return (
			<FormItem {...FormItemProps} hasFeedback key={keyval}>
				{
					getFieldDecorator(`${valuename}`, {
						initialValue: val,
						rules: [
							{
								required: true,
							},
						],
					})(inputTypeControl(fieldname))
				}
			</FormItem>
		)
	}

	//分布式start
	const inputORselect = (index) => {
		if (typeValue == 'DISTRIBUTE') {
			return (
				<Input />
			)
		} else {
			return (
				<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={val => onChangeColums(val, index)} getPopupContainer={() => getPopupContainers(index)}>
					{SelectFilters}
				</Select>
			)
		}

	}
	//分布式end
	//let index = 0
	const loop = data => data.map((item, index) => {
		switch (filterMode) {
			case 'BASIC':
				return (
					<Row gutter={12} key={`row_${filterIndex[index]}`}>
						<div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
							<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>

								<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
									{
										getFieldDecorator(`field_${filterIndex[index]}`, {
											initialValue: item.field,
											rules: [
												{
													required: true,
												},
											],
										})(inputORselect(index))
									}
								</FormItem>

							</Col>
						</div>
						<Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
							<FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`op_${filterIndex[index]}`, {
										initialValue: item.op,
										rules: [
											{
												required: true,
											},
										],
									})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: '100%' }}>
										{SelectOP}
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 9 }} md={{ span: 8 }}>
							{/*<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
					{
						getFieldDecorator(`value_${filterIndex[index]}`, {
							initialValue:  item.value,
						       rules: [
							    {
							       required: true,
							    },
						    ],
						})
						(<Input />)
					}
				</FormItem>*/}
							{inputTypeItem(item.field, item.value, `value_info_${filterIndex[index]}`, `value_${filterIndex[index]}`)}
						</Col>

						<Col key={`col_${filterIndex[index]}_6`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={3}>
							<Button.Group style={{ width: '100%' }}>
								<Button type="default" icon="minus" onClick={() => remove(index)} disabled={data.length === 1} />
								<Button type="default" icon="plus" onClick={() => add(index)} />
							</Button.Group>
						</Col>
					</Row>
				)

			case 'ADVANCED':
				return (
					<Row gutter={12} key={`row_${filterIndex[index]}`}>
						<Col key={`col_${filterIndex[index]}_0`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
							<FormItem {...FormItemProps} hasFeedback key={`leftBrackets_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`leftBrackets_${filterIndex[index]}`, {
										initialValue: item.leftBrackets,

									})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: '100%' }}>
										<Select.Option value=""></Select.Option>
										<Select.Option value="(">(</Select.Option>
										<Select.Option value="((">((</Select.Option>
										<Select.Option value="(((">(((</Select.Option>
										<Select.Option value="((((">((((</Select.Option>
										<Select.Option value="(((((">(((((</Select.Option>
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
							<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`field_${filterIndex[index]}`, {
										initialValue: item.field,
										rules: [
											{
												required: true,
											},
										],
									})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={val => onChangeColums(val, index)} style={{ width: '100%' }}>
										{SelectFilters}
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
							<FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`op_${filterIndex[index]}`, {
										initialValue: item.op,
										rules: [
											{
												required: true,
											},
										],
									})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: '100%' }}>
										{SelectOP}
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
							{/*<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
					{
						getFieldDecorator(`value_${filterIndex[index]}`, {
							initialValue: item.value,
						       rules: [
							    {
							       required: true,
							    },
						    ],
						})
						(<Input />)
					}
				</FormItem>*/}
							{inputTypeItem(item.field, item.value, `value_info_${filterIndex[index]}`, `value_${filterIndex[index]}`)}
						</Col>
						<Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
							<FormItem {...FormItemProps} hasFeedback key={`rightBrackets_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`rightBrackets_${filterIndex[index]}`, {
										initialValue: item.rightBrackets,

									})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: '100%' }}>
										<Select.Option value=""></Select.Option>
										<Select.Option value=")">)</Select.Option>
										<Select.Option value="))">))</Select.Option>
										<Select.Option value=")))">)))</Select.Option>
										<Select.Option value="))))">))))</Select.Option>
										<Select.Option value=")))))">)))))</Select.Option>
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_5`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
							<FormItem {...FormItemProps} hasFeedback key={`logicOp_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`logicOp_${filterIndex[index]}`, (data.length === (index + 1) ? {
										initialValue: item.logicOp,
									} : {
											initialValue: item.logicOp,
											rules: [
												{
													required: true,
												},
											],
										}))(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} disabled={data.length === (index + 1)} onBlur={() => onBlur(index)} style={{ width: '100%' }}>
											<Select.Option value="AND">AND</Select.Option>
											<Select.Option value="OR">OR</Select.Option>
										</Select>)
								}
							</FormItem>
						</Col>
					
						<Col key={`col_${filterIndex[index]}_6`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={3}>
							<Button.Group style={{ width: '100%' }}>
								<Button type="default" icon="minus" onClick={() => remove(index)} disabled={data.length === 1} />
								<Button type="default" icon="plus" onClick={() => add(index)} />
							</Button.Group>
						</Col>
					</Row>
				)
		}
	})

	const onBlur = (index) => {
		let fileds = [`logicOp_${filterIndex[index]}`]
		validateFields(fileds)
	}


	const myConditionItem = loop(filterItems)


	//获取时间的值
	const getColumsVal = (val) => {
		if (typeof (val) === 'object') {
			return Date.parse(val)
		}
		return val
	}


	const allColumsVals = () => {
		let fields = []
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
		filterIndex.forEach((num) => {
			let bean = {}
			bean.leftBrackets = valObj[`leftBrackets_${num}`]
			bean.field = valObj[`field_${num}`]
			bean.op = valObj[`op_${num}`]
			bean.value = getColumsVal(valObj[`value_${num}`])
			bean.rightBrackets = valObj[`rightBrackets_${num}`]
			bean.logicOp = valObj[`logicOp_${num}`]
			arrs.push(bean)
		})
		return arrs
	}

	const onChange = (val) => {
		let fields = ['basicLogicOp']

		const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值

		let arrs = allColumsVals()
		let maxValue = 0
		for (let val of filterIndex) {
			maxValue = (maxValue < val ? val : maxValue)
		}
		let arrIndex = []
		let arrItem = []
		if (val === 'ADVANCED') {
			filter.basicItems = arrs
			filter.basicLogicOp = valObj.basicLogicOp //基础模式的逻辑操作符,保存切换之前的
			if (filter.advancedItems && filter.advancedItems.length > 0) {
				arrItem = filter.advancedItems
				filter.advancedItems.forEach((num, index) => {
					arrIndex.push(maxValue + 1 + index)
				})
			} else {
				arrIndex.push(maxValue + 1)
			}
		} else {
			filter.advancedItems = arrs
			if (filter.basicItems && filter.basicItems.length > 0) {
				arrItem = filter.basicItems
				filter.basicItems.forEach((num, index) => {
					arrIndex.push(maxValue + 1 + index)
				})
			} else {
				arrIndex.push(maxValue + 1)
			}
		}
		filter.filterMode = val //模式

		filter.filterItems = arrItem //过滤条件
		filter.filterIndex = arrIndex //过滤条件下标的数组

		resetFields() //需要重置一下表单
		/*
  
		  修改过滤条件的集合
		*/
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}

	const onChangeFirst = (val) => {
		//resetFields(['secondClass','thirdClass'])
		filter.firstClass = val
		filter.secondClass = ''
		filter.thirdClass = ''
		filter.filterItems = []
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}
	const onChangeSecond = (val) => {
		resetFields(['thirdClass'])
		filter.secondClass = val
		filter.thirdClass = ''
		filter.filterItems = []
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}
	const onChangeThird = (val) => {
		filter.thirdClass = val
		dispatch({
			type: `${queryPath}`,
			payload: {
				[moFilterName]: filter,
			},
		})
	}

	const operations = (<FormItem {...FormItemProps} hasFeedback key="modeswitch">
		{getFieldDecorator('filterMode', {
			initialValue: filterMode,
			rules: [
				{
					required: true,
				},
			],
		})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} size="small" onChange={onChange} style={{ width: '120px' }}>
			<Select.Option value="BASIC">基础模式</Select.Option>
			<Select.Option value="ADVANCED">专家模式</Select.Option>
		</Select>)
		}
	</FormItem>)

	const basicRow = (<Row>
		<Col xl={{ span: 24 }} md={{ span: 24 }}>
			<FormItem {...FormItemProps}>
				{getFieldDecorator('basicLogicOp', {
					initialValue: basicLogicOp,
					rules: [
						{
							required: true,
						},
					],
				})(<Radio.Group>
					<Radio value="AND">AND</Radio>
					<Radio value="OR">OR</Radio>
				</Radio.Group>)}
			</FormItem>
		</Col>
	</Row>)

	const moTypeItem = (
		<Row>
			<Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
				<FormItem label="第一级分类" {...moformItemLayout}>
					{getFieldDecorator('firstClass', {
						initialValue: firstClass,
						rules: [
							{
								required:  typeValue == "ORDINARY" ? true : false,
							},
						],
					})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={onChangeFirst} style={{ width: '100%' }}>
						{optionFirstClass}
					</Select>)}
				</FormItem>
			</Col>

			<Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
				{((firstClass && firstClass !== '' && optionSecondClass.length > 0) ?
					<FormItem label="第二级分类" {...moformItemLayout}>
						{getFieldDecorator('secondClass', {
							initialValue: secondClass,
						})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={onChangeSecond} style={{ width: '100%' }}>
							<Select.Option key='ALL' value='ALL'>全部</Select.Option>
							{optionSecondClass}
						</Select>)}
					</FormItem> : null)}
			</Col>

			<Col {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
				{
					<FormItem label="第三级分类" {...moformItemLayout}>
						{getFieldDecorator('thirdClass', {
							initialValue: thirdClass,
						})(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={onChangeThird} style={{ width: '100%' }}>
							<Select.Option key='' value=''></Select.Option>
							{optionThirdClass}
						</Select>)}
					</FormItem>}
					
			</Col>
			<Col {...ColProps} xl={{ span: 24 }} md={{ span: 24 }}>
				<div ><Alert message="注意：不选择三级分类时，只会匹配到二级分类对象，不会匹配到三级分类对象（例如接口，表空间等）" type="warning" showIcon /></div>
			</Col>
			
		</Row>
		
	)

	return (<div>
		<Tabs activeKey="TabPane_1" size="small" type="line">
			<TabPane tab="监控对象分类" key="TabPane_1">

				{moTypeItem}
			</TabPane>
		</Tabs>
		<Tabs activeKey="TabPane_2" size="small" type="line" tabBarExtraContent={operations}>
			<TabPane tab="匹配条件" key="TabPane_2">

				{(filterMode === 'BASIC') ? basicRow : null}
				{myConditionItem}
			</TabPane>
		</Tabs>
	</div>)
}

ConditionBasicMode.propTypes = {
	filter: PropTypes.object,
	queryPath: PropTypes.string,
	moFilterName: PropTypes.string,
	myform: PropTypes.object.isRequired,
}

export default ConditionBasicMode
