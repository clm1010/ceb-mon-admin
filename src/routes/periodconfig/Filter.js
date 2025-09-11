import React from 'react'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Select, Radio, Checkbox, InputNumber } from 'antd'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
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

  query = () => {
  	const data = this.props.form.getFieldsValue()

  	let q = ''

  	for (let [key, value] of Object.entries(data)) {
		  switch (typeof (value)) {
		  	case 'number':
		  		q += `${key}:=:${value}+`
		  		break
		  	case 'float':
		  		q += `${key}:=:${value}+`
		  		break
		  	case 'string':
		  		if (value.length > 0) {
			  		q += `${key}:=~:${value}+`
			  		break
		  		}
		  	case 'object':
		  		if (value.length === 2) {
		  			q += `${key}:>=:${Date.parse(value[0])}+`
		  			q += `${key}:<=:${Date.parse(value[1])}+`
		  		}
		  }
		}

		if (q.endsWith('+')) {
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
    return (<Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select mode="multiple" placeholder={field.placeholder || '请选择'}>{options}</Select>)}
                                    </FormItem>
            </Col>)
  }

	transformSelect (field, key, getFieldDecorator) {
		const options = []
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
    })
		return (<Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Select placeholder={field.placeholder || '请选择'}>{options}</Select>)}
                                  </FormItem>
          </Col>)
	}

  transformRadio (field, key, getFieldDecorator) {
    const options = []
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
    })
    return (<Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RadioGroup>{options}</RadioGroup>)}
                                    </FormItem>
            </Col>)
  }

  transformCheckbox (field, key, getFieldDecorator) {
    const options = []
    field.options.forEach((option) => {
      options.push({ label: option.value, value: option.key })
    })

    return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<CheckboxGroup options={options} />)}</FormItem></Col>
  }

	transformNormal (field, key, getFieldDecorator) {
		switch (field.dataType) {
			case 'int':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'float':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder} />)}</FormItem></Col>

			case 'datetime':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder={field.placeholder || '请选择日期'} />)}</FormItem></Col>


			default:
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>
		}
	}

	transformCascader (field, key, getFieldDecorator) {
		return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<Cascader options={field.options} expandTrigger="hover" placeholder={field.placeholder || '请选择'} size="default" />)}</FormItem></Col>
  }

  transformBetween (field, key, getFieldDecorator) {
		switch (field.dataType) {
			/*case 'int':
				return <Col span={8} key={key}><Row><Col span={12}>12</Col><Col span={12}>12</Col></Row></Col>

			case 'float':
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<InputNumber step={0.01} size="default" max={field.max} min={field.min} placeholder={field.placeholder}/>)}</FormItem></Col>*/

			case 'datetime':
				return <Col span={10} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}</FormItem></Col>


			/*default:
				return <Col span={8} key={key}><FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key,{initialValue: field.defaultValue,})(<Input placeholder={field.placeholder || '请输入'} />)}</FormItem></Col>*/
		}
	}

	render () {
		const { expand, schema } = this.state
		const { getFieldDecorator } = this.props.form

		const children = this.parse(schema, getFieldDecorator)
		const shownCount = expand ? children.length : 3

		return (
  <Form style={{ padding: '6px', background: '#fbfbfb', border: '1px solid #d9d9d9' }}>
    <Row gutter={4}>
      {children.slice(0, shownCount)}
    </Row>
    <Row>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit" onClick={this.query} >搜索</Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
		        	清除
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

/*
const Form.Item = Form.Item
const Input.Search = Input.Input.Search
const Radio.Group = Radio.Group
const Checkbox.Group = Checkbox.Group


const Filter = () => {

	let expand = false

	const toggle = () => {
		expand = !expand
  }

  return (
  <Form style={{padding: "24px",background: "#fbfbfb",border: "1px solid #d9d9d9"}}>
    <Row gutter={24}>
<Col key="name" sm={8}>
	<Form.Item key="name" label="用户名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="请输入用户名" size="default"/>
	</Form.Item>
</Col>
<Col key="blog" sm={8}>
	<Form.Item key="blog" label="BLOG" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="请输入网址" size="default"/>
	</Form.Item>
</Col>
<Col key="age" sm={8}>
	<Form.Item key="age" label="年龄" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="请输入年龄" size="default"/>
	</Form.Item>
</Col>
<Col key="weight" sm={8}>
	<Form.Item key="weight" label="体重(kg)" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
<Col key="type" sm={8}>
	<Form.Item key="type" label="类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
		<Select placeholder={undefined || '请选择'} size="default" style={{ width: '100%' }}>

    	<Option key="1" value="1">类型1</Option>
    	<Option key="2" value="2">类型2</Option>
		</Select>
	</Form.Item>
</Col>
<Col key="userType" sm={8}>
	<Form.Item key="userType" label="用户类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
		<Radio.Group>

      <Radio key="typeA" value="typeA">类型A</Radio>
      <Radio key="typeB" value="typeB">类型B</Radio>
		</Radio.Group>
	</Form.Item>
</Col>
<Col key="score" sm={8}>
	<Form.Item key="score" label="分数" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
<Col key="gpa" sm={8}>
	<Form.Item key="gpa" label="GPA" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
<Col key="height" sm={8}>
	<Form.Item key="height" label="身高(cm)" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="哈哈哈" size="default"/>
	</Form.Item>
</Col>
<Col key="duoxuan1" sm={8}>
	<Form.Item key="duoxuan1" label="多选1" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
	<Checkbox.Group options={[
      {label: '类型1', value:'1'},
      {label: '类型2', value:'2'},]}/>
	</Form.Item>
</Col>
<Col key="duoxuan2" sm={8}>
	<Form.Item key="duoxuan2" label="多选2" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
		<Select mode="tags" placeholder={undefined || '请选择'} size="default" style={{ width: '100%' }}>

      <Option key="type1" value="type1">类型1</Option>
      <Option key="type2" value="type2">类型2</Option>
		</Select>
	</Form.Item>
</Col>
<Col key="work" sm={8}>
	<Form.Item key="work" label="工作年限" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
<Col key="duoxuan3" sm={8}>
	<Form.Item key="duoxuan3" label="多选3" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
		<Select mode="tags" placeholder={undefined || '请选择'} size="default" style={{ width: '100%' }}>

      <Option key="K" value="K">开</Option>
      <Option key="F" value="F">封</Option>
      <Option key="C" value="C">菜</Option>
		</Select>
	</Form.Item>
</Col>
<Col key="primarySchool" sm={8}>
	<Form.Item key="primarySchool" label="入学日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
<Col key="birthday" sm={8}>
	<Form.Item key="birthday" label="出生日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
<Col key="xxbirthday" sm={8}>
	<Form.Item key="xxbirthday" label="XX日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
<Input placeholder="" size="default"/>
	</Form.Item>
</Col>
    </Row>
    <Row>
    	<Col span={24} style={{ textAlign: 'right' }}>
      	<Button type="primary" htmlType="submit">Input.Search</Button>
      	<Button style={{ marginLeft: 8 }} >
        	Clear
        </Button>
        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={toggle}>
        Collapse <Icon type={'up'} />
        </a>
      </Col>
    </Row>
    </Form>
  )
}

export default Form.create()(Filter)
*/
