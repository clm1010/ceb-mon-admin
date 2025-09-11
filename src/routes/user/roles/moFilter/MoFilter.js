import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Select, Form, Tabs, Input, Radio, Cascader } from 'antd'
import debounce from 'throttle-debounce/debounce'
import SelectOP from './SelectOP'
import ProfessionalOP from './ProfessionalOP'
import ConditionFilter from './ConditionFilter'
import notificationFilter from './notificationFilter'
import fenhang from '../../../../utils/fenhang'
import genDictArrToCascader from '../../../../../src/customization/EBank/routes/registerServices/FunctionTool'
const Option = Select.Option
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
	objType,
	userInfoList,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields,
	} = myform
	let userInfoOptions = []
	if (userInfoList !== undefined) {
		userInfoList.forEach((item, index) => {
			let ops = item.username
			let values = `${item.username}/${item.name}`
			userInfoOptions.push(<Option key={values} value={ops}>{values}</Option>)
		})
	}
	let firstobj = {
		leftBrackets: '', field: '', op: '', value: '', rightBrackets: '', logicOp: '',
	}
	let {
		TfilterMode = 'BASIC',
		TbasicLogicOp = filter.basicLogicOp,
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

	const add = (index) => {
		let maxValue = 0
		for (let val of filterIndex) {
			maxValue = (maxValue < val ? val : maxValue)
		}

		if (filterIndex.length > 0 && filterIndex.length < 11) { //把已经选择的值都保存一下。
			filterItems = allColumsVals()
		}

		let indexList = [...filterIndex]
		indexList.splice(index + 1, 0, maxValue + 1) //插入下标的值

		let arrs = [...filterItems]
		arrs.splice(index + 1, 0, firstobj) //在指定的下标下面，插入一个数组元素

		/*
			测试用
		*/
		let newIndexList = []
		if (filterIndex.length > 0 && filterIndex.length < 11) {
			indexList.forEach((val, index) => {
				newIndexList.push(maxValue + 2 + index)
			})
		}

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
		if (filterIndex.length > 10) {
			return document.getElementById(`div_col_${filterIndex[index]}_1`)
		}
		return document.body
	}

	const onFocus = (index) => {
		getPopupContainers(index)
	}

	const fenhangChange = (myindex, value) => {
		let arrs = allColumsVals()
		let indexList = [...filterIndex]

		let indexLists = filterIndex.filter((val, index) => index !== myindex)
		let newArrs = []
		filterItems.forEach((item, index) => {
			if (index === myindex) {
				item = { field: value, value: '' }
			}
			newArrs.push(item)
		})
		filter.filterItems = newArrs
		filter.filterIndex = indexLists

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

	const fenhangChange2 = (myindex, value) => {
		let arrs = allColumsVals()
		let indexList = [...filterIndex]

		let indexLists = filterIndex.filter((val, index) => index !== myindex)
		let newArrs = []
		filterItems.forEach((item, index) => {
			if (index === myindex) {
				item = { field: value, value: '' }
			}
			newArrs.push(item)
		})
		filter.filterItems = newArrs
		filter.filterIndex = indexLists

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

	const fenhangChange3 = (myindex, value) => {
		let arrs = allColumsVals()
		let indexList = [...filterIndex]

		let indexLists = filterIndex.filter((val, index) => index !== myindex)
		let newArrs = []
		filterItems.forEach((item, index) => {
			if (index === myindex) {
				item = { field: value, value: '' }
			}
			newArrs.push(item)
		})
		filter.filterItems = newArrs
		filter.filterIndex = indexLists

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

	const queryUser =(value) =>{
		let p = queryPath.split('/')[0]
		dispatch({
			type:`${p}/queryUserInfo`,
			payload:{
				q:`username == *${value}*`,
				pageSize:10,
			}
		})
	}

	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
	let fenhangs = []

	if (fenhang && fenhang !== '') {
		fenhang.forEach((item, index) => {
			fenhangs.push(<Option key={item.key} value={item.key}>{item.value}</Option>)
		})
	}

	//let index = 0
	const loop = data => data.map((item, index) => {
		//index = index + 1
		switch (TfilterMode) {
			case 'BASIC':
				return (
					<Row gutter={12} key={`row_${filterIndex[index]}`}>
						{//
							(objType === 'mrAdd' || objType === 'mrDelete' || objType === 'mrUpdate' || objType === 'mrRead' || objType === 'advAdd' || objType === 'advUpdate' || objType === 'myShort' || objType === 'myPre' || objType === 'myCheck'|| objType === 'mtdisable') ?
								<div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
									<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>

										<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
											{
												getFieldDecorator(`Tfield_${objType}_${filterIndex[index]}`, {
													initialValue: item.field,

												})(<Select allowClear="true" showSearch optionFilterProp="children" getPopupContainer={() => getPopupContainers(index)} onChange={value => fenhangChange(index, value)} >
													<Option key="branch" value="branch">使用范围</Option>
													<Option key="tpe" value="tpe">周期类型</Option>
													<Option key="createdBy" value="createdBy">创建者</Option>
													<Option key="filter.filterMode" value="filter.filterMode">维护期模式</Option>
												</Select>)
											}
										</FormItem>
									</Col>
								</div>
								:
								(objType === 'oelRead' || objType === 'oelConfirm') ?
									<div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
										<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
											<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
												{
													getFieldDecorator(`Tfield_${objType}_${filterIndex[index]}`, {
														initialValue: item.field,
													})(<Select allowClear="true" showSearch optionFilterProp="children" getPopupContainer={() => getPopupContainers(index)} onChange={value => fenhangChange(index, value)} >
														<Option key="NodeAlias" value="NodeAlias">IP地址</Option>
														<Option key="Node" value="Node">主机名</Option>
														<Option key="AlertGroup" value="AlertGroup">告警组</Option>
														<Option key="N_Factory" value="N_Factory">告警节点厂商</Option>
														<Option key="Manager" value="Manager">告警采集器</Option>
														<Option key="N_AppCode" value="N_AppCode">应用系统代码</Option>
														<Option key="N_AppName" value="N_AppName">应用系统名称</Option>
														<Option key="N_MgtOrgId" value="N_MgtOrgId">所属机构</Option>
														<Option key="Acknowledged" value="Acknowledged">接管状态</Option>
														<Option key="Agent" value="Agent">监控代理</Option>
														<Option key="N_MgtOrg" value="N_MgtOrg">管理机构</Option>
														<Option key="Severity" value="Severity">级别</Option>
														<Option key="N_MaintainStatus" value="N_MaintainStatus">维护期状态</Option>
														<Option key="OZ_OrgName" value="OZ_OrgName">采集器所在机构</Option>
														<Option key="N_SubComponent" value="N_SubComponent">告警子类</Option>
														<Option key="N_Component" value="N_Component">告警中类</Option>
														<Option key="N_ComponentType" value="N_ComponentType">告警大类</Option>
														<Option key="N_BizArea" value="N_BizArea">网络区域</Option>
													</Select>)
												}
											</FormItem>
										</Col>
									</div>
									:
									(objType === 'notfAdd' || objType === 'notfDelete' || objType === 'notfUpdate' || objType === 'notfRead') ?
										<div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
											<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>

												<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
													{
														getFieldDecorator(`Tfield_${objType}_${filterIndex[index]}`, {
															initialValue: item.field,

														})(<Select allowClear="true" showSearch optionFilterProp="children" getPopupContainer={() => getPopupContainers(index)} onChange={value => fenhangChange(index, value)} >
															<Option key="branch" value="branch">分行</Option>
															<Option key="createdBy" value="createdBy">创建者</Option>
															<Option key="informType" value="informType">类型</Option>
														</Select>)
													}
												</FormItem>

											</Col>
										</div>
										:
										(objType === 'registerAdd' || objType === 'registerDel' || objType === 'registerUpdate' || objType === 'registerRead') ?
											<div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
												<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>

													<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
														{
															getFieldDecorator(`Tfield_${objType}_${filterIndex[index]}`, {
																initialValue: item.field,

															})(<Select allowClear="true" showSearch optionFilterProp="children" getPopupContainer={() => getPopupContainers(index)} onChange={value => fenhangChange(index, value)} >
																<Option key="id" value="id">ID</Option>
																<Option key="name" value="name">服务名</Option>
																<Option key="tags" value="tags">标签</Option>
																<Option key="address" value="address">地址</Option>
																<Option key="port" value="port">端口</Option>
																<Option key="domain" value="domain">部门</Option>
															</Select>)
														}
													</FormItem>

												</Col>
											</div>
											:
											<div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
												<Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
													<FormItem {...FormItemProps} hasFeedback key={`field_info_${filterIndex[index]}`}>
														{
															getFieldDecorator(`Tfield_${objType}_${filterIndex[index]}`, {
																initialValue: item.field,

															})(<Select allowClear="true" showSearch optionFilterProp="children" getPopupContainer={() => getPopupContainers(index)} onChange={value => fenhangChange(index, value)} >
																<Option key="firstClass" value="firstClass">一级分类</Option>
																<Option key="secondClass" value="secondClass">二级分类</Option>
																<Option key="thirdClass" value="thirdClass">三级分类</Option>
																<Option key="branchName" value="branchName">所属机构</Option>
																<Option key="mngtOrgCode" value="mngtOrgCode">管理机构</Option>
																<Option key="appName" value="appName">应用分类名称</Option>
																<Option key="branch" value="branch">分行</Option>
																<Option key="vendor" value="vendor">厂商</Option>
																<Option key="createdBy" value="createdBy">创建者</Option>
															</Select>)
														}
													</FormItem>
												</Col>
											</div>
						}

						<Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
							<FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`Top_${objType}_${filterIndex[index]}`, {
										initialValue: item.op,

									})(<Select allowClear="true" style={{ width: '100%' }}>
										{SelectOP}
									</Select>)
								}
							</FormItem>
						</Col>

						{
							(item.field === 'firstClass' || item.field === 'branchName' || item.field === 'branch' || item.field === 'mngtOrgCode' || item.field === 'N_OrgName' || item.field === 'N_MgtOrg' || item.field === 'OZ_OrgName' || item.field === 'N_MgtOrgId'
								|| item.field === 'filter.filterMode' || item.field === 'informType') ?
								<Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 9 }} md={{ span: 8 }}>
									<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
										{
											getFieldDecorator(`Tvalue_${objType}_${filterIndex[index]}`, {
												initialValue: item.value,

											})(<Select style={{ width: '100%' }} allowClear="true" showSearch optionFilterProp="children">
												{item.field === 'firstClass' ? ProfessionalOP : (item.field === 'branchName' || item.field === 'branch' || item.field === 'mngtOrgCode' || item.field === 'N_OrgName' || item.field === 'N_MgtOrg' || item.field === 'OZ_OrgName' || item.field === 'N_MgtOrgId' ? fenhangs
												 : item.field === 'filter.filterMode' ? ConditionFilter : item.field === 'informType' ? notificationFilter : null
												)}
											</Select>)
										}
									</FormItem>
								</Col>
								:
								item.field === 'createdBy' ?
								<Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 9 }} md={{ span: 8 }}>
									<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
										{
											getFieldDecorator(`Tvalue_${objType}_${filterIndex[index]}`, {
												initialValue: item.value

											})(<Select style={{ width: '100%' }} allowClear="true" showSearch optionFilterProp="children"  onSearch={debounce(800, queryUser)}>
											{userInfoOptions}
										</Select>)
										}
									</FormItem>
								</Col>
								:
								item.field === 'domain' ?
									<Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 9 }} md={{ span: 8 }}>
										<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
											{
												getFieldDecorator(`Tvalue_${objType}_${filterIndex[index]}`, {
													initialValue: item.value.split('-')

												})(<Cascader style={{ width: '100%' }} allowClear="true" showSearch optionFilterProp="children" options={genDictArrToCascader('userDomain')} changeOnSelect={true}></Cascader>)
											}
										</FormItem>
									</Col>
									:
									<Col key={`col_${filterIndex[index]}_13`} {...ColProps} xl={{ span: 9 }} md={{ span: 8 }}>
										<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
											{
												getFieldDecorator(`iTvalue_${objType}_${filterIndex[index]}`, {
													initialValue: item.value,
												})(<Input />)
											}
										</FormItem>
									</Col>
						}

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
									getFieldDecorator(`TleftBrackets_${filterIndex[index]}`, {
										initialValue: item.leftBrackets,

									})(<Select style={{ width: '100%' }}>
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
									getFieldDecorator(`Tfield_${filterIndex[index]}`, {
										initialValue: item.field,

									})(<Select style={{ width: '100%' }}>
										<Option key="branchName" value="branchName">分行</Option>
										<Option key="firstClass" value="firstClass">专业</Option>
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
							<FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`Top_${filterIndex[index]}`, {
										initialValue: item.op,

									})(<Select style={{ width: '100%' }}>
										{SelectOP}
									</Select>)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
							<FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`Tvalue_${filterIndex[index]}`, {
										initialValue: item.value,

									})(<Input />)
								}
							</FormItem>
						</Col>
						<Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
							<FormItem {...FormItemProps} hasFeedback key={`rightBrackets_info_${filterIndex[index]}`}>
								{
									getFieldDecorator(`TrightBrackets_${filterIndex[index]}`, {
										initialValue: item.rightBrackets,

									})(<Select style={{ width: '100%' }}>
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
									getFieldDecorator(`TlogicOp_${filterIndex[index]}`, (data.length === (index + 1) ? {
										initialValue: item.logicOp,
									} : {
										initialValue: item.logicOp,

									}))(<Select disabled={data.length === (index + 1)} onBlur={() => onBlur(index)} style={{ width: '100%' }}>
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

	const allColumsVals = () => {
		let fields = []
		filterIndex.forEach((num) => {
			fields.push(`TleftBrackets_${objType}_${num}`)
			fields.push(`Tfield_${objType}_${num}`)
			fields.push(`Top_${objType}_${num}`)
			fields.push(`Tvalue_${objType}_${num}`)
			fields.push(`iTvalue_${objType}_${num}`)
			fields.push(`TrightBrackets_${objType}_${num}`)
			fields.push(`TlogicOp_${objType}_${num}`)
		})

		const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
		let arrs = []
		filterIndex.forEach((num) => {
			let bean = {}
			bean.leftBrackets = valObj[`TleftBrackets_${objType}_${num}`]
			bean.field = valObj[`Tfield_${objType}_${num}`]
			bean.op = valObj[`Top_${objType}_${num}`]
			if (bean.field === 'branchName' || bean.field === 'branch' || bean.field === 'informType'
				|| bean.field === 'createdBy' || bean.field === 'mngtOrgCode' || bean.field === 'N_OrgName' ||
				bean.field === 'N_MgtOrg' || bean.field === 'OZ_OrgName' || bean.field === 'filter.filterMode' ||
				bean.field === 'informType' || bean.field === 'N_MgtOrgId' || bean.field === 'oelConfirm' || bean.field === 'firstClass'
			) {
				bean.value = valObj[`Tvalue_${objType}_${num}`]
			} else {
				bean.value = valObj[`iTvalue_${objType}_${num}`]
			}

			bean.rightBrackets = valObj[`TrightBrackets_${objType}_${num}`]
			bean.logicOp = valObj[`TlogicOp_${objType}_${num}`]
			arrs.push(bean)
		})
		return arrs
	}

	const onChange = (val) => {
		let fields = ['TbasicLogicOp']
		/*
		filterIndex.forEach((num) => {
			fields.push(`leftBrackets_${num}`)
			fields.push(`field_${num}`)
			fields.push(`op_${num}`)
			fields.push(`value_${num}`)
			fields.push(`rightBrackets_${num}`)
			fields.push(`logicOp_${num}`)
		})
		*/

		const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
		/*
		let arrs = []
		filterIndex.forEach((num) => {
		   let bean = {}
		   bean.leftBrackets = valObj[`leftBrackets_${num}`]
		   bean.field = valObj[`field_${num}`]
		   bean.op = valObj[`op_${num}`]
		   bean.value = valObj[`value_${num}`]
		   bean.rightBrackets = valObj[`rightBrackets_${num}`]
		   bean.logicOp = valObj[`logicOp_${num}`]
		  arrs.push(bean)
		})
		*/
		let arrs = allColumsVals()
		let maxValue = 0
		for (let val of filterIndex) {
			maxValue = (maxValue < val ? val : maxValue)
		}
		let arrIndex = []
		let arrItem = []
		if (val === 'ADVANCED') {
			filter.basicItems = arrs
			filter.TbasicLogicOp = valObj.TbasicLogicOp //基础模式的逻辑操作符,保存切换之前的
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
		filter.TfilterMode = val //模式

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

	const operations = (<FormItem {...FormItemProps} key="modeswitch">
		{getFieldDecorator('TfilterMode', {
			initialValue: TfilterMode,

		})(<Select size="small" onChange={onChange} style={{ width: '120px' }}>
			<Select.Option value="BASIC">基础模式</Select.Option>
			<Select.Option value="ADVANCED">专家模式</Select.Option>
		</Select>)
		}
	</FormItem>)

	const basicRow = (<Row>
		<Col xl={{ span: 24 }} md={{ span: 24 }}>
			<FormItem {...FormItemProps}>
				{getFieldDecorator('TbasicLogicOp' + `${objType}`, {
					initialValue: TbasicLogicOp,

				})(<Radio.Group>
					<Radio value="AND">AND</Radio>
					<Radio value="OR">OR</Radio>
				</Radio.Group>)}
			</FormItem>
		</Col>
	</Row>)

	return (<div>
		<Tabs size="small" type="line" >
			<TabPane tab="数据范围限制" key="1">

				{(TfilterMode === 'BASIC') ? basicRow : null}
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

