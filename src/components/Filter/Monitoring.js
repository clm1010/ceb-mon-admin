import React from 'react'
import axios from 'axios'
import { config } from '../../utils'
const { equipment } = config.api
import {
  Icon,
  Form,
  Button,
  Row,
  Col,
  DatePicker,
  Input,
  Select,
  Radio,
  Checkbox,
  InputNumber,
} from 'antd'
import { getFilterUrlMap } from '../../utils/FunctionTool'
import querystring from 'querystring'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const InputGroup = Input.Group

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
  style: { marginBottom: 4 },
}

let timeout
let currentValue

function fetch (value, branch, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake () {
    const str = querystring.encode({
      code: 'utf-8',
      name: value,
      branch: branch,
    })
    axios.get(equipment + `?${str}`)
      .then((d) => {
        if (currentValue === value) {
          const result = d.data
          const data = []
          result.forEach((r) => {
            data.push({
              key: r,
              value: r,
            })
          })
          callback(data)
        }
      })
  }
  timeout = setTimeout(fake, 300)
}


class Monitoring extends React.Component {

  constructor (props) {
    super(props)
    // this.state.expand = props.expand
    this.state.schema = props.filterSchema
    this.state.dispatch = props.dispatch
    this.state.fieldsObj = getFilterUrlMap(props.q)
    // this.state.moTypeTree = props.moTypeTree	// mo类型树形下拉列表option
    this.state.externalSql = props.externalSql || '' // 新增一个外部传入的sql查询条件，和公共组件组成and的关系
    this.state.buttonZone = props.buttonZone
    this.state.queryPreProcess = props.queryPreProcess
    this.state.pathname = props.location !== undefined ? props.location.pathname : ''
    this.state.branch = props.branch
    this.state.area = props.area
    this.state.percent = props.percent
  }

  // 根据父组（nextProps）件传来的值,本组件nextState，如果有变化则渲染返回true，没有发生变化则不渲染返回false.默认返回true
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.branch && nextProps.branch.length > 0) {
      nextState.schema[0].options = nextProps.branch
      return true
    } else {
      return true
    }
  }

  state = {
    expand: false,
    schema: [],
    fieldsObj: {},
    moTypeTree: {},
    buttonZone: {},
    branch: [],
    data: [],
    value: undefined,
    area: '',
    percent: {
      kpi: 1,
      tem: 1,
      over: 0,
    },
  }

  toggle = () => {
    this.setState({
      ...this.state,
      expand: !this.state.expand,
    })
  }

  getArrayTypeValue = (key, val, objmap) => {
    let result = ''
    if (objmap && objmap.size > 0) {
      let bean = objmap.get(key)

      if (bean && bean.showType && (bean.showType === 'multiSelect' || bean.showType === 'querySelect')) {
        let internalSql = ''
        val.forEach(item => internalSql += `${key}==${item} or `)
        internalSql = internalSql.substring(0, internalSql.length - 4)
        result = `(${internalSql});`
      }
    }
    console.log('-------------- key ------ : ', key, ' val : ', val, ' objmap : ', objmap, ' result : ', result)
    return result
  }

  query = () => {
    let data = this.props.form.getFieldsValue()
    let percent = this.state.percent.kpi + '-' + this.state.percent.tem + '-' + this.state.percent.over
    data.percent = percent
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
      console.log('this.state.pathname', this.state.pathname)
      console.info('key:', key, 'value:', value)
      switch (key) {
        case 'appName':
          if (value && value.length > 0) {
            q += this.getStringTypeValue(key, value)
            break
          }
        case  'branch':
          if (value && value.length > 0) {
            q += this.getArrayTypeValue(key, value, myMap)
            break
          }
        case 'discoverIP':
          if (value && value.length > 0) {
            q += `monitoringTree.${key}==${value};`
            break
          }
          case 'percent':
            if (value && value.length > 0) {
              q += this.getStringPercentValue(value);
              break
            }
      }
      // if (value && value.length > 0 && key !== 'appName') {
      //   q += this.getArrayTypeValue(key, value, myMap)
      // }
      // if (key === 'appName' && value !== undefined) {
      //   q += this.getStringTypeValue(key, value)
      // }
    }
    if (q.endsWith(';')) {
      q = q.substring(0, q.length - 1)
    }
    // q = q + '/' + percent
    this.props.onSearch(q)
  }

  getStringPercentValue = (str) => {
    // if (str === '1-1-0' || str === 'null-null-null')   return ''
    let strArr = str.split('-')
    let sql = ''
   if (strArr[0] !== '1' && strArr[0] !== 'null') 
     sql += `coverage>=${strArr[0]};`
   if (strArr[1] !== '1' && strArr[1] !== 'null') 
    sql += `normalizedRate>=${strArr[1]};`
   if (strArr[2] !== '0' && strArr[2] !== 'null') 
    sql += `overMonitoringRate>=${strArr[2]};`
    return sql
  }
  getStringTypeValue = (key, val) => {
    return `${key}=='*${val}*';`
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSearch = (value) => {
    fetch(value, this.state.area, data => this.setState({ data }))
  }

  handleChange = (value) => {
    this.setState({ value })
  }

  click = (field) => {
    switch (field.key) {
      case 'branch':
        this.state.dispatch({
          type: 'branchnet/branch',
          payload: {},
        })
        break
      case 'equipmentName':
        this.state.dispatch({
          type: 'branchnet/branch',
          payload: {},
        })
        break
    }
  }

  changeKpi = (value) => {
    this.state.percent.kpi = value
    console.info(value)
  }

  changeTem = (value) => {
    this.state.percent.tem = value
    console.info(value)
  }

  changeOver = (value) => {
    this.state.percent.over = value
    console.info(value)
  }

  parse (schema, getFieldDecorator) {
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
        case 'querySelect':
          children.push(this.transformQuerySelect(schema[i], i, getFieldDecorator))
          break
        case 'inputNumber':
          children.push(this.transformInputNumber(schema[i], i, getFieldDecorator))
          break
        default:
          children.push(this.transformNormal(schema[i], i, getFieldDecorator))
      }
    }
    return children
  }

  transformMultiSelect (field, key, getFieldDecorator) {
    const options = []
    const mySearchInfo = (input, option) => {
      return (option.props.children.toLowerCase()
        .indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase()
        .indexOf(input.toLowerCase()) >= 0)
    }
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}>{option.value}</Option>)
    })
    return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}>
      <FormItem {...formItemLayout} label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
        <Select allowClear mode="multiple" optionFilterProp="children" filterOption={mySearchInfo}
          placeholder={field.placeholder || '请选择'}
          getPopupContainer={() => document.body}
          onFocus={() => this.click(field)}>{options}
        </Select>)}
      </FormItem>
    </Col>
  }

  transformQuerySelect (field, key, getFieldDecorator) {
    // const options = this.state.data.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>)
    return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}>
      <FormItem {...formItemLayout} label={field.title}>
        {getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <Input placeholder={field.placeholder || '请输入'} />
        )}
      </FormItem>
    </Col>
  }

  transformInputNumber (field, key, getFieldDecorator) {
    return <Col xl={{ span: 10 }} md={{ span: 10 }} sm={{ span: 24 }} key={key}>
      <FormItem {...formItemLayout} label={field.title}>
        {getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <InputGroup compact>
            <InputNumber style={{ width: '30%' }} max={field.max} min={field.min} placeholder={'指标覆盖率:1'} onChange={value => this.changeKpi(value)} />
            <InputNumber style={{ width: '30%' }} max={field.max} min={field.min} placeholder={'策略标准化率:1'} onChange={value => this.changeTem(value)} />
            <InputNumber style={{ width: '30%' }} max={field.max} min={field.min} placeholder={'超布额率:0'} onChange={value => this.changeOver(value)} />
          </InputGroup>
        )}
      </FormItem>
    </Col>
  }

  transformSelect (field, key, getFieldDecorator) {
    const options = []
    const mySearchInfo = (input, option) => {
      return (option.props.children.toLowerCase()
        .indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase()
        .indexOf(input.toLowerCase()) >= 0)
    }
    field.options.forEach((option) => {
      options.push(<Option key={option.key} value={option.key}
                           disabled={option.disabled || false}>{option.value}</Option>)
    })
    return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                        label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children"
              filterOption={mySearchInfo} getPopupContainer={() => document.body}>{options}</Select>)}</FormItem></Col>
  }

  transformRadio (field, key, getFieldDecorator) {
    const options = []
    field.options.forEach((option) => {
      options.push(<Radio key={option.key} value={option.key}>{option.value}</Radio>)
    })
    return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                        label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <RadioGroup>{options}</RadioGroup>)}</FormItem></Col>
  }

  transformCheckbox (field, key, getFieldDecorator) {
    const options = []
    field.options.forEach((option) => {
      options.push({
        label: option.value,
        value: option.key,
      })
    })

    return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                        label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
      <CheckboxGroup options={options}/>)}</FormItem></Col>
  }

  transformNormal (field, key, getFieldDecorator) {
    switch (field.dataType) {
      case 'int':
        return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                            label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <InputNumber size="default" style={{ width: '100%' }} max={field.max} min={field.min}
                       placeholder={field.placeholder}/>)}</FormItem></Col>

      case 'float':
        return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                            label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <InputNumber step={0.01} style={{ width: '100%' }} size="default" max={field.max} min={field.min}
                       placeholder={field.placeholder}/>)}</FormItem></Col>

      case 'datetime':
        return <Col xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                            label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue })(
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
                      placeholder={field.placeholder || '请选择日期'}/>)}</FormItem></Col>

      default:
        return <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key={key}><FormItem {...formItemLayout}
                                                                                            label={field.title}>{getFieldDecorator(field.key, { initialValue: field.defaultValue || '' })(
          <Input placeholder={field.placeholder || '请输入'}/>)}</FormItem></Col>
    }
  }



  render () {
    const {
      expand,
      schema,
      buttonZone,
    } = this.state
    const { getFieldDecorator } = this.props.form

    const children = this.parse(schema, getFieldDecorator)
    const shownCount = expand ? children.length : 3
    return (
      <Form>
        <Row gutter={4} style={{ backgroundColor: '#eef2f9', padding: 8 }}>
          {children.slice(0, shownCount)}
        </Row>
        <Row gutter={4} style={{ marginTop: 8, marginBottom: 20 }}>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <span style={{ float: 'left' }}>{buttonZone}</span>
            <span style={{ float: 'right', marginTop: 8 }}>
              <Button htmlType="submit" onClick={this.query}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggle}>
                <Icon type={expand ? 'caret-up' : 'caret-down'} style={{ fontSize: 8, color: '#333' }}/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(Monitoring)
