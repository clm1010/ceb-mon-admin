import React from 'react'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Switch, Select, Radio, Checkbox, InputNumber } from 'antd'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
}
const formItemLayoutdate = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
}

class Filter extends React.Component {
	constructor (props) {
		super(props)
		this.state.expand = props.expand
		this.state.schema = props.filterSchema
	}

	state = {
		expand: false,
		schema: [],
	}

	toggle = () => {
		this.setState({
			...this.state,
			expand: !this.state.expand,
		})
	}

	getStringTypeValue = (key, val, objmap) => {
		let result = `${key}=='*${val}*';`
		if (objmap && objmap.size > 0) {
			let bean = objmap.get(key)

			if (bean && bean.showType && bean.showType === 'select') {
				if (bean.dataType && bean.dataType === 'boolean') {
					if (val === 'true') {
						result = `${key}==true;`
					} else if (val === 'false') {
						result = `${key}==false;`
					} else {
						result = ''
					}
				} else {
					result = `${key}=='${val}';`
				}
			}
			if (bean && bean.showType && bean.showType === 'radio') {
				if (bean.dataType && bean.dataType === 'boolean') {
					if (val === 'true') {
						result = `${key}==true;`
					} else if (val === 'false') {
						result = `${key}==false;`
					} else {
						result = ''
					}
				} else {
					result = `${key}=='${val}';`
				}
			}
		}
		return result
	}

	query = () => {
		const data = this.props.form.getFieldsValue()
		const fields = this.state.schema
		let myMap = new Map()
		if (fields && fields.length > 0) {
			fields.forEach((bean, index) => {
				myMap.set(bean.key, bean)
			})
		}
		let q = ''
		for (let [key, value] of Object.entries(data)) {
			if (key === 'rule_name' && value != undefined && value != '') {
				q += `rule.name=='*${value}*';`
			} else if (key === 'mo_name' && value != undefined && value != '') {
				q += `mo.name=='*${value}*';`
			} else {
				switch (typeof (value)) {
					case 'number':
						q += `${key}==${value};`
						break
					case 'float':
						q += `${key}==${value};`
						break
					case 'string':
						if (value && value.length > 0) {
							q += this.getStringTypeValue(key, value, myMap)
							break
						}
					case 'object':
						if (value.length === 2) {
							q += `${key}>=${Date.parse(value[0])};`
							q += `${key}<=${Date.parse(value[1])};`
						}
				}
			}
		}

		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}
		this.props.onSearch(q)
	}

	handleReset = () => {
		this.props.form.resetFields()
	}

	parse (schema, getFieldDecorator) {
		const rows = []
		let cols = []

		let spaceLeft = 24

		const children = []

		for (let i = 0; i < schema.length; i++) {
			switch (schema[i].showType) {
				case 'select':
					children.push(this.transformSelect(schema[i], i, getFieldDecorator))
					break
				case 'checkbox':
					children.push(this.transformCheckbox(schema[i], i, getFieldDecorator))
					break
				case 'radio':
					children.push(this.transformRadio(schema[i], i, getFieldDecorator))
					break
				case 'multiSelect':
					children.push(this.transformMultiSelect(schema[i], i, getFieldDecorator))
					break
				case 'cascader':
					children.push(this.transformCascader(schema[i], i, getFieldDecorator))
					break
				case 'between':
					children.push(this.transformBetween(schema[i], i, getFieldDecorator))
					break
				default:
					children.push(this.transformNormal(schema[i], i, getFieldDecorator))
			}
		}

		return children
	}

	transformMultiSelect (field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear="true" mode="multiple" placeholder={field.placeholder || '请选择'}>{options}</Select>)}
                                                                             </FormItem>
          </Col>)
	}

	transformSelect (field, key, getFieldDecorator) {
		const options = []
		const mySearchInfo = (input, option) => {
			return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
		}
		field.options.forEach((option) => {
			options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
		})
		return (<div key={`div_${key}`} style={{ position: 'relative' }} id={`div_area_${key}`}><Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear="true" showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children" filterOption={mySearchInfo} getPopupContainer={() => document.getElementById(`div_area_${key}`)}>{options}</Select>)}
</FormItem>
</Col>
          </div>)
	}

	transformRadio (field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
                                                                             </FormItem>
          </Col>)
	}

	transformCheckbox (field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push({
				label: option.value,
				value: option.key,
			})
		})

		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<CheckboxGroup options={options} />)}</FormItem></Col>
	}

	transformNormal (field, key, getFieldDecorator) {
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

	transformCascader (field, key, getFieldDecorator) {
		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
	}

	transformBetween (field, key, getFieldDecorator) {
		switch (field.dataType) {
			/*case 'int':
				return <Col span={8} key={key}><Row><Col span={12}>12</Col><Col span={12}>12</Col></Row></Col>

			case 'float':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}/>)}</FormItem></Col>*/

			case 'datetime':
				return <div key={`date_time_${key}`} style={{ position: 'relative' }} id={`date_time_area_${key}`}><Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayoutdate} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />)}</FormItem></Col></div>

				/*default:
					return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>*/
		}
	}

	render () {
		const {
			expand,
			schema,
		} = this.state
		const {
			getFieldDecorator,
		} = this.props.form

		const children = this.parse(schema, getFieldDecorator)
		const shownCount = expand ? children.length : 3

		return (
  <Form>
    <Row gutter={4}>
      {children.slice(0, shownCount)}
    </Row>
    <Row style={{ marginTop: '10px' }}>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button htmlType="submit" onClick={this.query}>查询</Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
		        	清空
        </Button>
        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
          {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
        </a>
      </Col>
    </Row>
  </Form>
		)
	}
}

export default Form.create()(Filter)
