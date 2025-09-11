import React from 'react'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Select, TreeSelect, Radio, Checkbox, InputNumber } from 'antd'
import { getFilterUrlMap } from '../../../../utils/FunctionTool'
import { routerRedux } from 'dva/router'
import moment from 'moment'
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
	constructor(props) {
		super(props)
		this.state.schema = props.filterSchema
		this.state.dispatch = props.dispatch
		this.state.fieldsObj = getFilterUrlMap(props.q)
		this.state.moTypeTree = props.moTypeTree	//mo类型树形下拉列表option
		this.state.externalSql = props.externalSql || '' //新增一个外部传入的sql查询条件，和公共组件组成and的关系
		this.state.buttonZone = props.buttonZone
		this.state.queryPreProcess = props.queryPreProcess
		this.state.pathname = props.location !== undefined ? props.location.pathname : ''
	}
	componentWillReceiveProps(props) {
		this.state.schema = props.filterSchema
		this.state.dispatch = props.dispatch
		this.state.fieldsObj = getFilterUrlMap(props.q)
		this.state.moTypeTree = props.moTypeTree	//mo类型树形下拉列表option
		this.state.externalSql = props.externalSql || '' //新增一个外部传入的条件，和公共组件组成and的关系
		this.state.buttonZone = props.buttonZone
		this.state.queryPreProcess = props.queryPreProcess
		this.state.pathname = props.location !== undefined ? props.location.pathname : ''
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
		let result = `${key}=='*${val}*';`
		if (key === 'oz_AlarmID') {
			result = `${key}=='${val}';`
		}
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
			} else if (bean && bean.showType && bean.showType === 'radio') {
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
		}
		return result
	}
	getArrayTypeValue = (key, val, objmap) => {
		let result = ''
		if (objmap && objmap.size > 0) {
			let bean = objmap.get(key)
			if (bean && bean.showType && bean.showType === 'multiSelect') {
				let internalSql = ''
				val.forEach(item => internalSql += `${key}==${item} or `)
				internalSql = internalSql.substring(0, internalSql.length - 4)
				result = `(${internalSql});`
			} else if (bean && bean.showType && bean.showType === 'between') {
				if (bean.dataType && bean.dataType === 'datetime') {
					result += `${key}>=${Date.parse(val[0])};`
					result += `${key}<=${Date.parse(val[1])};`
				} else {
					result = `${key}=='${val}';`
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
		for (let [key, value] of Object.entries(data)) {
			//历史告警和u1历史告警特殊模块，如果传参包含告警序列号oz_AlarmID，则使用这个条件进行查询，忽略其他条件
			if (key === 'oz_AlarmID' && value !== '' && this.state.pathname.includes('historyview')) {
				q = this.getStringTypeValue(key, value, myMap)
				break
			} else if (key === 'serial' && value !== '' && this.state.pathname.includes('u1Historyview')) {
				q = this.getStringTypeValue(key, value, myMap)
				break
			}
			//特殊控件mo树形菜单,查询条件特殊处理
			else if (key === 'moClass') {
				let classes = value.split('-')
				if (classes[0] !== undefined && classes[0] !== 'MO') {
					q += `firstClass=='${classes[0]}';`
				}
				if (classes[1] !== undefined) {
					q += `secondClass=='${classes[1]}';`
				}
				if (classes[2] !== undefined) {
					q += `thirdClass=='${classes[2]}';`
				}
			} else if (key === 'firstOccurrence----' && value !== undefined && value.length > 0) {
				const a = moment(value[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				const b = moment(value[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				q += `firstOccurrence=timein=(${a},${b});`
			} else if (key === 'time----' && value !== undefined && value.length > 0) {
				const a = moment(value[0] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				const b = moment(value[1] / 1000, 'X').utc(8).format('YYYY-MM-DDTHH:mm:ss')
				q += `time=timein=(${a},${b});`
			}
			//普通控件，查询条件普通处理
			else {
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
						if (value.length > 0) {
							q += this.getArrayTypeValue(key, value, myMap)
						}
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
		this.props.onSearch(q)
	}
	handleReset = () => {
		this.props.form.resetFields()
	}
	parse(schema, getFieldDecorator) {
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
					schema[i].defaultValue = fieldsObj[schema[i].key]
				} else {
					schema[i].defaultValue = new Array(fieldsObj[schema[i].key])
				}
			} else if (fieldsObj[schema[i].key] !== undefined && schema[i].showType !== 'multiSelect') {
				schema[i].defaultValue = fieldsObj[schema[i].key]
			}
			//把url的监控对象class映射成树形列表的默认值
			//当FilterSchema配置文件中有mo类型树状菜单控件时
			//需要把url查询串里的mo类型拣出来拼装成控件能识别默认value
			//拼装格式为firstClass-secondClass-thirdClass
			//如果任何class为空，该class不参与拼装
			else if (schema[i].key === 'moClass') {
				//从url里取三类class值
				let firstClass = fieldsObj.firstClass
				let secondClass = fieldsObj.secondClass
				let thirdClass = fieldsObj.thirdClass
				//拼装三类class，形成树形下拉列表默认值
				if (firstClass !== undefined) {
					schema[i].defaultValue = firstClass
				} else {
					schema[i].defaultValue = 'MO'
				}
				if (secondClass !== undefined) {
					schema[i].defaultValue = `${schema[i].defaultValue}-${secondClass}`
				}
				if (thirdClass !== undefined) {
					schema[i].defaultValue = `${schema[i].defaultValue}-${thirdClass}`
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
	transformMultiSelect(field, key, getFieldDecorator) {
		const options = []
		const mySearchInfo = (input, option) => {
			return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
		}
		field.options.forEach((option) => {
			options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear mode="multiple" optionFilterProp="children" filterOption={mySearchInfo} placeholder={field.placeholder || '请选择'} getPopupContainer={() => document.body}>{options}</Select>)}
		</FormItem>
		</Col>)
	}
	transformSelect(field, key, getFieldDecorator) {
		const options = []
		const mySearchInfo = (input, option) => {
			return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
		}
		field.options.forEach((option) => {
			options.push(<Option key={option.key} value={option.key} disabled={option.disabled || false}>{option.value}</Option>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children" filterOption={mySearchInfo} getPopupContainer={() => document.body}>{options}</Select>)}
		</FormItem>
		</Col>)
	}
	transformTreeSelect(field, key, getFieldDecorator) {
		const moChange = (value, label, obj) => {
			switch (value) {
				case 'SERVER':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/server',
					}))
					break
				case 'MW':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/middleware',
					}))
					break
				case 'DB':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/database',
					}))
					break
				case 'OS':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/os',
					}))
					break
				case 'APP':
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/application',
					}))
					break
				case 'IP'://IP
					this.handleReset()
					this.state.dispatch(routerRedux.push({
						pathname: '/IP',
						query: {
							page: 0,
							q: 'firstClass==\'IP\'',
							firstClass: 'IP',
						},
					}))
					break
			}
		}
		const loop = (data, _parent) => data.map((item) => {
			/*
			*因为路由器接口、交换机接口、防火墙接口没有唯一key
			*所以这里根据树的父节点，以减号做分隔符，拼装成唯一key，例：
			*NETWORK-ROUTER:路由器
			*NETWORK-ROUTER-NET_INTF:路由器接口
			*/
			if (item.children && item.children.length > 0) {
				return <TreeNode title={item.name} key={item.key} isLeaf={false} value={item.key} disabled={item.disabled || false}>{loop(item.children)}</TreeNode>
			}
			return <TreeNode title={item.name} key={item.key} isLeaf value={item.key} disabled={item.disabled || false} />
		})
		let treeNodes = []
		if (this.state.moTypeTree && this.state.moTypeTree.length > 0) {
			treeNodes = loop(this.state.moTypeTree, '')
		}
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} lg={{ span: 8 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<TreeSelect treeDefaultExpandAll onChange={moChange} getPopupContainer={() => document.body} style={{ width: '100%' }} size="default" dropdownStyle={{ maxHeight: '300px', overFlow: 'scroll' }} placeholder={field.placeholder}>{treeNodes}
		</TreeSelect>)}
		</FormItem>
		</Col>)
	}
	transformRadio(field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
		})
		return (<Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
		</FormItem>
		</Col>)
	}
	transformCheckbox(field, key, getFieldDecorator) {
		const options = []
		field.options.forEach((option) => {
			options.push({
				label: option.value,
				value: option.key,
			})
		})
		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<CheckboxGroup options={options} />)}</FormItem></Col>
	}
	transformNormal(field, key, getFieldDecorator) {
		switch (field.dataType) {
			case 'int':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber size="default" style={{ width: '100%' }} max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>
			case 'float':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber step={0.01} style={{ width: '100%' }} size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>
			case 'datetime':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'} />)}</FormItem></Col>
			default:
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue || '' })(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>
		}
	}
	transformCascader(field, key, getFieldDecorator) {
		return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
	}
	transformBetween(field, key, getFieldDecorator) {
		switch (field.dataType) {
			case 'datetime':
				return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key} id={`date_time_area_${key}`}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />)}</FormItem></Col>
		}
	}
	getBtZone() {
		let btZone = null
		if (this.state.buttonZone !== undefined && this.state.buttonZoneProps != undefined) {
			btZone = <this.state.buttonZone {...this.state.buttonZoneProps} />
		}
		return btZone
	}
	render() {
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
		const shownCount = expand ? children.length : 3
		const btZone = this.getBtZone()
		return (
			<Form>
				<Row gutter={4} style={{ padding: 8, backgroundColor: '#eef2f9' }}>
					{children.slice(0, shownCount)}
				</Row>
				<Row gutter={4} style={{ marginTop: 8, marginBottom: 20 }}>
					<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
						<span style={{ float: 'left' }}>
							{buttonZone}
						</span>
						<span style={{ float: 'right', marginTop: 8 }}>
							<Button htmlType="submit" onClick={this.query}>查询</Button>
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
