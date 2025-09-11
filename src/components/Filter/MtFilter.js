import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Select, Radio, Checkbox, InputNumber } from 'antd'
const InputGroup = Input.Group
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
}
const formItemLayoutdate = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
}


const MtFilter = ({
	dispatch,
	location,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
		validateFieldsAndScroll,
	},
    filterSchema = [], //查询选项
	expand,
	expandName,
	queryPath,
	isLevels,
	//schema,

}) => {
	const getStringTypeValue = (key, val, objmap) => {
	  let result = `${key}=='*${val}*';`
	  if (objmap && objmap.size > 0) {
		  let bean = objmap.get(key)

		  if (bean && bean.showType && bean.showType === 'select') {
			  if (bean.dataType && bean.dataType === 'boolean') {
				  if (val === 'true') {
					  result = `${key}==true;`
				  } else {
					  result = `${key}==false;`
				  }
			  } else {
				 result = `${key}=='${val}';`
			  }
		  }

		  if (bean && bean.showType && bean.showType === 'radio') {
			  if (bean.dataType && bean.dataType === 'boolean') {
				  if (val === 'true') {
					  result = `${key}==true;`
				  } else {
					  result = `${key}==false;`
				  }
			  } else {
				 result = `${key}=='${val}';`
			  }
		  }

		  if (bean && bean.showType && bean.showType === 'appFilterItems') { //应用名称
		  	result = `filter.basicFilter.${key}.name=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'neFilterItems') { //网络设备
		  	result = `filter.basicFilter.${key}.hostname=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'otherFilterItems') { //其他域对象名称
		  	result = `filter.basicFilter.${key}.alias=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'description') { //应用业务功能
		  	result = `filter.basicFilter.appFilterItems.${key}=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'keyword') { //网络设备IP
		  	result = `filter.basicFilter.neFilterItems.${key}=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'ports') { //网络设备端口
		  	result = `filter.basicFilter.neFilterItems.${key}.name=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'appName') { //其他域应用分类名称
		  	result = `filter.basicFilter.otherFilterItems.${key}=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'oname') { //其他域对象关键字
		  	result = `filter.basicFilter.otherFilterItems.name=='*${val}*';`
		  }
		  if (bean && bean.showType && bean.showType === 'filter') { //专家模式告警定义
		  	result = `(filter.filterMode=='ADVANCED' or  filter.filterMode=='SENIOR');filter.advFilterItems.value=='*${val}*';`
		  }
		  if (key === 'appCategory' && val && val !== '') {
		  	result = `appCategory.affectSystem=='*${val}*';`
		  }
		  if (key === 'users' && val && val !== '') {
		  	result = `user.name=='*${val}*';`
		  }
		  if (key === 'user' && val && val !== '') {
		  	result = `user.mobile=='*${val}*';`
		  }
	  }
	  return result
  }
  const typeChange = (e) => {
		let checked = e.target.checked
		dispatch({
			type: 'mainRuleInstanceInfo/controllerModal',
			payload: {
				isLevels: checked === true ? '1' : '0',
			},
		})
	}
  const query = () => {
  	const data = {
		...getFieldsValue(),
	}
	const fields = [...filterSchema]
	let myMap = new Map()
	if (fields && fields.length > 0) {
		fields.forEach((bean, index) => {
			myMap.set(bean.key, bean)
		})
	}
  	let q = ''
  	for (let [key, value] of Object.entries(data)) {
		  switch (typeof (value)) {
		  	case 'number':
		  		q += `${key}==${value};`
		  		break
		  	case 'float':
		  		q += `${key}==${value};`
		  		break
		  	case 'string':
			    if (value && value.length > 0) {
					q += getStringTypeValue(key, value, myMap)
				}
				break
		  	case 'object':
		  		if (value.length === 2) {
		  			q += `${key}>=${Date.parse(value[0])};`
		  			q += `${key}<=${Date.parse(value[1])};`
		  		}
		  }
		}

		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}
		onSearch(q)
   }

   const onSearch = (q) => {
	  const { search, pathname } = location
		const query = queryString.parse(search);
	  dispatch(routerRedux.push({
			 pathname,
			 search:search,
	      query: {
	      	...query,
	        page: 0,
	        q,
	      },
	   }))
   }

  const handleReset = () => {
    resetFields()
  }


  const toggle = () => {
	dispatch({
		type: `${queryPath}`,
		payload: {
			[expandName]: !expand,
		},
	})
  }


 const parse = (schema) => {
  	const children = []

  	for (let i = 0; i < schema.length; i++) {
  		switch (schema[i].showType) {
  			case 'select':
          children.push(transformSelect(schema[i], i))
          break
        case 'checkbox':
          children.push(transformCheckbox(schema[i], i))
          break
        case 'radio':
          children.push(transformRadio(schema[i], i))
          break
        case 'multiSelect':
          children.push(transformMultiSelect(schema[i], i))
          break
        case 'cascader':
          children.push(transformCascader(schema[i], i))
          break
        case 'between':
          children.push(transformBetween(schema[i], i))
          break
        default:
          children.push(transformNormal(schema[i], i))
  		}
  	}

		return children
 }
  const transformMultiSelect = (field, key) => {
    const options = []
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
    })
    return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear="true" mode="multiple" placeholder={field.placeholder || '请选择'}>{options}</Select>)}
                                                                               </FormItem>
            </Col>)
  }

  const transformSelect = (field, key) => {
		const options = []
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
    })
		return (<div key={`div_${key}`} style={{ position: 'relative', paddingLeft: '0px', paddingRight: '0px' }} id={`div_area_${key}`}><Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select showSearch allowClear placeholder={field.placeholder || '请选择'} filterOption={mySearchInfo} getPopupContainer={() => document.getElementById(`div_area_${key}`)}>{options}</Select>)}
</FormItem>
</Col>
          </div>)
  }

const mySearchInfo = (input, option) => {
	return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
}

  const transformRadio = (field, key) => {
    const options = []
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
    })
    return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
                                                                               </FormItem>
            </Col>)
  }

  const transformCheckbox = (field, key) => {
    const options = []
    field.options.forEach((option) => {
      options.push({ label: option.value, value: option.key })
    })

    return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Checkbox onChange={typeChange} />)}</FormItem></Col>
  }

  const transformNormal = (field, key) => {
		switch (field.dataType) {
			case 'int':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber size="default" style={{ width: '100%' }} max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'float':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber step={0.01} style={{ width: '100%' }} size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'datetime':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'} />)}</FormItem></Col>


			default:
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>
		}
	}

   const transformCascader = (field, key) => {
		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
  }

  const transformBetween = (field, key) => {
		switch (field.dataType) {
			case 'datetime':
				return (<div key={`date_time_${key}`}
  style={{
 position: 'relative', paddingLeft: '0px', paddingRight: '0px', right: '0px',
}}
  id={`date_time_area_${key}`}
				><Col xl={{ span: 15 }} md={{ span: 15 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayoutdate} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />)}</FormItem></Col>
            </div>)
		}
	}


	//const { expand, schema } = this.state
	//const { getFieldDecorator } = this.props.form

	const children = parse(filterSchema)
	const count = children.length
	const shownCount = expand ? count : 30


	return (
  <Form className="filter-form">
    <Row gutter={4}>
      {children.slice(0, shownCount)}
    </Row>
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button htmlType="submit" onClick={query}>查询</Button>
        <Button style={{ marginLeft: 8 }} onClick={handleReset}>
		        	清空
        </Button>
        {(count > 30 ?
          <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggle}>
            {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
          </a>
				 : null)}
      </Col>
    </Row>
  </Form>
		)
}

MtFilter.propTypes = {
  form: PropTypes.object.isRequired,
  expand: PropTypes.bool,
}

export default Form.create()(MtFilter)
