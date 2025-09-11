import React from 'react'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Select, TreeSelect, Radio, Checkbox, InputNumber } from 'antd'
import { getFilterUrlMapOel } from '../../utils/FunctionTool'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
	style: { marginBottom: 4 },
}
const formItemLayoutdate = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
}

class Filter extends React.Component {
	constructor (props) {
		super(props)
		//this.state.expand = props.expand
		this.state.schema = props.filterSchema
		this.state.dispatch = props.dispatch
		this.state.fieldsObj = getFilterUrlMapOel(props.q)
		this.state.moTypeTree = props.moTypeTree	//mo类型树形下拉列表option
		this.state.externalSql = props.externalSql || '' //新增一个外部传入的sql查询条件，和公共组件组成and的关系
		this.state.buttonZone = props.buttonZone
		this.state.queryPreProcess = props.queryPreProcess
	}

	componentWillReceiveProps (props) {
		//this.state.expand = props.expand
		this.state.schema = props.filterSchema
		this.state.dispatch = props.dispatch
		this.state.fieldsObj = getFilterUrlMapOel(props.q)
		this.state.moTypeTree = props.moTypeTree	//mo类型树形下拉列表option
		this.state.externalSql = props.externalSql || '' //新增一个外部传入的条件，和公共组件组成and的关系
		this.state.buttonZone = props.buttonZone
		this.state.queryPreProcess = props.queryPreProcess
	}

	state = {
		expand: false,
		schema: [],
		fieldsObj: {},
		moTypeTree: {},
		buttonZone: {},
	}

	toggle = () => {
		this.setState({
			...this.state,
			expand: !this.state.expand,
		})
	}

	getStringTypeValue = (key, val, objmap) => {
		let result = `${key} like '${val}';`
		if (objmap && objmap.size > 0) {
			let bean = objmap.get(key)

			if (bean && bean.showType && bean.showType === 'select') {
				if (bean.dataType && bean.dataType === 'boolean') {
					if (val === 'true') {
						result = `${key}=true;`
					} else {
						result = `${key}=false;`
					}
				} else {
					result = `${key}='${val}';`
				}
			} else if (bean && bean.showType && bean.showType === 'radio') {
			  if (bean.dataType && bean.dataType === 'boolean') {
				  if (val === 'true') {
					  result = `${key}=true;`
				  } else {
					  result = `${key}=false;`
				  }
			  } else {
				 result = `${key}='${val}';`
			  }
		  }
		}
		return result
	}

	getArrayTypeValue = (key, val, objmap) => {
		let result = ''
		if (objmap && objmap.size > 0) {
			let bean = objmap.get(key)

			if (bean && bean.showType && bean.showType === 'multiSelect') {
				let internalSql = ''
				if (bean.dataType === 'varchar' || bean.dataType === 'string') {
					val.forEach(item => internalSql += `${key}='${item}' or `)
				} else {
					val.forEach(item => internalSql += `${key}=${item} or `)
				}
				internalSql = internalSql.substring(0, internalSql.length - 4)
				result = `(${internalSql});`
			} else if (bean && bean.showType && bean.showType === 'between') {
			  if (bean.dataType && bean.dataType === 'datetime') {
				result += `${key}>=${Date.parse(val[0]) / 1000};`
				result += `${key}<=${Date.parse(val[1]) / 1000};`
			  } else {
				 result = `${key}='${val}';`
			  }
			}
		}
		return result
	}

	query = () => {
		let data = this.props.form.getFieldsValue()

		if (this.state.queryPreProcess !== undefined) {
			data = this.state.queryPreProcess(data)
		}

		const fields = this.state.schema
		let myMap = new Map()
		if (fields && fields.length > 0) {
			fields.forEach((bean, index) => {
				myMap.set(bean.key, bean)
			})
		}

		let q = ''

		if (data.ISRECOVER === 0) {
			q = 'Severity=0;'
			delete data.ISRECOVER
		} else {
			q = 'Severity!=0;'
			delete data.ISRECOVER
		}

		for (let [key, value] of Object.entries(data)) {
			switch (typeof (value)) {
				case 'number':
					q += `${key}=${value};`
					break
				case 'float':
					q += `${key}=${value};`
					break
				case 'string':
					if (value && value.length > 0) {
						q += this.getStringTypeValue(key, value, myMap)
						break
					}
				case 'object':
					if (value.length > 0) {
						q += this.getArrayTypeValue(key, value, myMap)
					}
			}
		}

		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}
		if (q !== '') {
			q = `${q};${this.state.externalSql}`
		} else {
			q = this.state.externalSql
		}
		if (q.endsWith(';')) {
			q = q.substring(0, q.length - 1)
		}

		q = q.replace(/;/g, ' and ')
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
		let fieldsObj = this.state.fieldsObj
		for (let i = 0; i < schema.length; i++) {
			// 当地址栏查询url存在这个控件名，就把url里的值显示在控件中
			if (fieldsObj[schema[i].key] !== undefined && (schema[i].showType === 'multiSelect' || schema[i].showType === 'between')) {
				// 判断对象是否是数组
				if (Array.isArray(fieldsObj[schema[i].key])) {
					if (schema[i].dataType === 'number') {
						schema[i].defaultValue = fieldsObj[schema[i].key].map(Number)
					} else {
						schema[i].defaultValue = fieldsObj[schema[i].key]
					}
				} else if (schema[i].dataType === 'number') {
						let arr = []
						arr.push(parseInt(fieldsObj[schema[i].key]))
						schema[i].defaultValue = arr
					} else {
						schema[i].defaultValue = new Array(fieldsObj[schema[i].key])
					}
			} else if (fieldsObj[schema[i].key] !== undefined && schema[i].showType !== 'multiSelect') {
				if (schema[i].dataType === 'int') {
					schema[i].defaultValue = parseInt(fieldsObj[schema[i].key])
				} else {
					schema[i].defaultValue = fieldsObj[schema[i].key]
				}
			}

			switch (schema[i].showType) {
				case 'treeSelect':
					children.push(this.transformTreeSelect(schema[i], i, getFieldDecorator))
					break
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
		return (<Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear mode="multiple" placeholder={field.placeholder || '请选择'}>{options}</Select>)}
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
		return (<Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children" filterOption={mySearchInfo} getPopupContainer={() => document.body}>{options}</Select>)}
                                                                             </FormItem>
          </Col>)
	}


	transformRadio (field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
		})
		return (<Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
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

		return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<CheckboxGroup options={options} />)}</FormItem></Col>
	}

	transformNormal (field, key, getFieldDecorator) {
		switch (field.dataType) {
			case 'int':
				let v
				if (field.defaultValue !== undefined) {
					v = parseInt(field.defaultValue)
				}
				return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: v })(<InputNumber size="default" style={{ width: '100%' }} max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'float':
				return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber step={0.01} style={{ width: '100%' }} size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'datetime':
				return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'} />)}</FormItem></Col>

			default:
				return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>
		}
	}

	transformCascader (field, key, getFieldDecorator) {
		return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
	}

	transformBetween (field, key, getFieldDecorator) {
		switch (field.dataType) {
			/*case 'int':
				return <Col span={8} key={key}><Row><Col span={12}>12</Col><Col span={12}>12</Col></Row></Col>

			case 'float':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}/>)}</FormItem></Col>*/

			case 'datetime':
				//let defaultValue = [moment(Date.parse(new Date())).add(-1, 'hour'), moment(Date.parse(new Date()))],  // 注意日期类型defaultValue的格式
				return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key} id={`date_time_area_${key}`}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />)}</FormItem></Col>

				/*default:
					return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>*/
		}
	}

	getBtZone () {
		let btZone = null
		if (this.state.buttonZone !== undefined && this.state.buttonZoneProps != undefined) {
			btZone = <this.state.buttonZone {...this.state.buttonZoneProps} />
		}
		return btZone
	}


	render () {
		const {
			expand,
			schema,
			buttonZone,
			buttonZoneProps,
		} = this.state
		const {
			getFieldDecorator,
		} = this.props.form

		const children = this.parse(schema, getFieldDecorator)
		const shownCount = expand ? children.length : 4
		const btZone = this.getBtZone()

		return (
  <Form>
    <Row gutter={4}>
      {children.slice(0, shownCount)}
    </Row>
    <Row gutter={4} >
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <span style={{ float: 'left' }}>
          { buttonZone }
        </span>

        <span style={{ float: 'right' }}>
          <Button htmlType="submit" onClick={this.query}>查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
					    	重置
          </Button>
          <a style={{ marginLeft: 8 }} onClick={this.toggle}>
            <Icon type={expand ? 'caret-up' : 'caret-down'} style={{ fontSize: 8, color: '#333' }} />
          </a>
        </span>
      </Col>
    </Row>
  </Form>
		)
	}
}

export default Form.create()(Filter)
