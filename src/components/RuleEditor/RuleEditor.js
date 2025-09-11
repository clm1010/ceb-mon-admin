import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Select, Tabs } from 'antd'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  padding: '10px',
  border: '1px solid #d9d9d9',

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

class RuleEditor extends React.Component {
  add = (k) => {
    let info = this.state.info
    let maxValue = 0
    for (let value of info.keys) {
      maxValue = maxValue < value ? value : maxValue
    }
    //获取点击按钮行的下标
    let idx = info.keys.findIndex((value, index, arr) => {
      return value === k
    })

    info.keys.splice(idx + 1, 0, maxValue + 1)
    this.props.form.setFieldsValue({ keys: info.keys })
    this.setState({
      info,
    })
  }

  remove = (k) => {
    let info = this.state.info
    const keys = info.keys

    info.keys = keys.filter(key => key !== k)

    this.setState({
      info,
    })
  }

  //在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。
  componentWillMount (props) {
  }

  /*props是父组件传递给子组件的。父组件发生render的时候子组件就会调用componentWillReceiveProps
  （不管props有没有更新，也不管父子组件之间有没有数据交换）*/
  /*
  componentWillReceiveProps(props) {
  	if (props !== undefined) {
	  	this.state.info = ( typeof(props.info) !== 'undefined' && props.info.length > 0 )? JSON.parse(props.info) : {keys: [0]}
	    this.state.type = props.type
	  }
  }
  */

  constructor (props) {
    super(props)
    this.state.info = (typeof (props.info) !== 'undefined' && props.info.length > 0) ? JSON.parse(props.info) : { keys: [0] }
    this.state.type = props.type
  }

  state = {
    type: '',
    info: {},
  }

  showComponent (formInfo) {
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form

    if (typeof (formInfo.keys) === 'undefined') {
      getFieldDecorator('keys', { initialValue: [0] })
    } else {
      getFieldDecorator('keys', { initialValue: formInfo.keys })
    }

    const keys = formInfo.keys

    const formItems = keys.map((k, index) => {
      return (
        <Row gutter={12} key={`row${k}`}>
          <Col key={`col0${k}`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>若消息串</Col>
          <Col key={`col1${k}`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
            <FormItem {...FormItemProps} hasFeedback key={`alarmField_basic${k}`}>
              {
                getFieldDecorator(`op_children${k}`, {
                  initialValue: formInfo[`op_children${k}`],
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select style={{ width: '100%' }}>
                  <Select.Option value="includes">包含</Select.Option>
                  <Select.Option value="equal">匹配</Select.Option>
                   </Select>)}
            </FormItem>
          </Col>
          <Col key={`col2${k}`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
            <FormItem {...FormItemProps} hasFeedback key={`op_basic${k}`}>
              {getFieldDecorator(`log_children${k}`, {
                initialValue: formInfo[`log_children${k}`],
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col key={`col7${k}`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>则指标值</Col>
          <Col {...ColProps} xl={5} md={5}>
            <FormItem {...FormItemProps} hasFeedback key={`value_basic${k}`}>
              {getFieldDecorator(`kpi_children${k}`, {
                initialValue: formInfo[`kpi_children${k}`],
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col key={`col3${k}`} style={{ textAlign: 'right' }} {...ColProps} xl={4} md={4}>
            <Button.Group style={{ width: '100%' }}>
              <Button type="default" icon="minus" onClick={() => this.remove(k)} disabled={keys.length === 1} />
              <Button type="default" icon="plus" onClick={() => this.add(k)} />
            </Button.Group>
          </Col>
        </Row>
      )
    })
    return formItems
  }

  genJson = () => {
    let jsonResult
    const { form } = this.props
    let obj = this.props.form.getFieldsValue()
    jsonResult = JSON.stringify(obj)

    return jsonResult
  }

  render () {
    const formInfo = this.state.info

    const { form } = this.props
    const children = this.showComponent(formInfo)
    return <div style={customPanelStyle}>{children}</div>
  }
}

export default RuleEditor
