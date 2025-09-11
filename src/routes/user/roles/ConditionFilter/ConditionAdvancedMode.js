import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Select, Form, Tabs, Input, Radio } from 'antd'

import ViewColumns from '../../../../utils/ViewColumns'
import SelectOP from '../../../../components/maintenance/eventFilter/SelectOP'

let SelectFilters = []
for (let column of ViewColumns) {
	SelectFilters.push(<Select.Option key={column.key} value={column.key}>{column.name}</Select.Option>)
}

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
	    localPath,
		filter,
		queryPath,
		moFilterName,
		myform,
		isExpertRoles,
		type,
		isExpert,
		info,
}) => {
	//如果是新建维护期模板，切换专家模式的时候，都要清掉历史记录
	if (type === 'create' && filter.filterMode === 'ADVANCED' && isExpert === false) {
		delete filter.filterItems
		delete filter.filterIndex
	}

	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = myform

	let firstobj = {
 leftBrackets: '', field: '', op: '', value: '', rightBrackets: '', logicOp: '',
}
	let {
 filterMode = 'BASIC',
		basicLogicOp = 'AND',
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
				isExpert: true,
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
				isExpert: true,
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

	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
		//let index = 0
  const loop = data => data.map((item, index) => {
	  //index = index + 1

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

						})(<Select getPopupContainer={() => getPopupContainers(index)}>
  {SelectFilters}
         </Select>)
					}
        </FormItem>

      </Col>
    </div>
    <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
      <FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
        {
						getFieldDecorator(`op_${filterIndex[index]}`, {
							initialValue: item.op,
						})(<Select style={{ width: '100%' }}>
  {SelectOP}
         </Select>)
					}
      </FormItem>
    </Col>
    <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 9 }} md={{ span: 8 }}>
      <FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
        {
						getFieldDecorator(`value_${filterIndex[index]}`, {
							initialValue: item.value,

						})(<Input />)
					}
      </FormItem>
    </Col>

    <Col key={`col_${filterIndex[index]}_6`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={3}>
      <Button.Group style={{ width: '100%' }} disabled={type === 'see'}>
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
						getFieldDecorator(`leftBrackets_${info}_${filterIndex[index]}`, {
							initialValue: item.leftBrackets,

						})(<Select style={{ width: '100%' }} disabled={isExpertRoles !== true}>
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
						getFieldDecorator(`field_${info}_${filterIndex[index]}`, {
							initialValue: item.field,

						})(<Select showSearch style={{ width: '100%' }} filterOption={mySearchInfo} disabled={isExpertRoles !== true}>
  {SelectFilters}
         </Select>)
					}
      </FormItem>
    </Col>
    <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
      <FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
        {
						getFieldDecorator(`op_${info}_${filterIndex[index]}`, {
							initialValue: item.op,

						})(<Select style={{ width: '100%' }} disabled={isExpertRoles !== true}>
  {SelectOP}
         </Select>)
					}
      </FormItem>
    </Col>
    <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
      <FormItem {...FormItemProps} hasFeedback key={`value_info_${filterIndex[index]}`}>
        {
						getFieldDecorator(`value_${info}_${filterIndex[index]}`, {
							initialValue: item.value,

						})(<Input disabled={isExpertRoles !== true} />)
					}
      </FormItem>
    </Col>
    <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
      <FormItem {...FormItemProps} hasFeedback key={`rightBrackets_info_${filterIndex[index]}`}>
        {
						getFieldDecorator(`rightBrackets_${info}_${filterIndex[index]}`, {
							initialValue: item.rightBrackets,

						})(<Select style={{ width: '100%' }} disabled={isExpertRoles !== true}>
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
						getFieldDecorator(`logicOp_${info}_${filterIndex[index]}`, (data.length === (index + 1) ? {
							initialValue: item.logicOp,
						} : {
							initialValue: item.logicOp,

						}))(<Select disabled={(type === 'see') ? true : ((data.length === (index + 1)) ? true : (isExpertRoles === false))} onBlur={() => onBlur(index)} style={{ width: '100%' }}>
  <Select.Option value="AND">AND</Select.Option>
  <Select.Option value="OR">OR</Select.Option>
          </Select>)
					}
      </FormItem>
    </Col>

    <Col key={`col_${filterIndex[index]}_6`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={3}>
      <Button.Group style={{ width: '100%' }}>
        <Button type="default" icon="minus" onClick={() => remove(index)} disabled={(data.length === 1) || (type === 'see') || (!isExpertRoles)} />
        <Button type="default" icon="plus" onClick={() => add(index)} disabled={isExpertRoles !== true} />
      </Button.Group>
    </Col>
  </Row>
		)
	}
  })

  const onBlur = (index) => {
	  let fileds = [`logicOp_${info}_${filterIndex[index]}`]
	  validateFields(fileds)
  }


  const myConditionItem = loop(filterItems)

  const allColumsVals = () => {
	  let fields = []
	  filterIndex.forEach((num) => {
		  fields.push(`leftBrackets_${info}_${num}`)
		  fields.push(`field_${info}_${num}`)
		  fields.push(`op_${info}_${num}`)
		  fields.push(`value_${info}_${num}`)
		  fields.push(`rightBrackets_${info}_${num}`)
		  fields.push(`logicOp_${info}_${num}`)
	  })

	  const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值

	  let arrs = []
	  filterIndex.forEach((num) => {
		 let bean = {}
		 bean.leftBrackets = valObj[`leftBrackets_${info}_${num}`]
		 bean.field = valObj[`field_${info}_${num}`]
		 bean.op = valObj[`op_${info}_${num}`]
		 bean.value = valObj[`value_${info}_${num}`]
		 bean.rightBrackets = valObj[`rightBrackets_${info}_${num}`]
		 bean.logicOp = valObj[`logicOp_${info}_${num}`]
		arrs.push(bean)
	  })
	  return arrs
  }

  const onChange = (val) => {
	  let fields = ['basicLogicOp']
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

  const operations = (<FormItem {...FormItemProps} key="modeswitch">
    {getFieldDecorator('filterMode', {
				initialValue: filterMode,

			})(<Select size="small" onChange={onChange} style={{ width: '120px' }}>
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

				})(<Radio.Group>
  <Radio value="AND">AND</Radio>
  <Radio value="OR">OR</Radio>
       </Radio.Group>)}
      </FormItem>
    </Col>
  </Row>)

  return (<div>
    <Tabs size="small" type="line" >
      <TabPane tab="匹配条件" key="1">

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
