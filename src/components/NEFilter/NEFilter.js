import React from 'react'
import SelectFilters from './SelectFilters'
import { Form, Input, Icon, Button, Row, Col, Select, Radio, Tabs } from 'antd'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

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

class NEFilter extends React.Component {
	add = (k) => {
		let info = this.state.info

    		let maxValue = 0
    		for (let value of info.keys) {
    			maxValue = maxValue < value ? value : maxValue
    		}
    		//获取点击按钮行的下标
    		let idx = info.keys.findIndex((value, index, arr) => { return value === k })

    		info.keys.splice(idx + 1, 0, maxValue + 1)
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

  	handleSubmit = (e) => {
    		e.preventDefault()
   		this.props.form.validateFields((err, values) => {
      		if (!err) {
        			console.log('Received values of form: ', values)
      		}
    		})
  	}

	constructor (props) {
    		super(props)
    		this.state.info = props.info.length > 0 ? JSON.parse(props.info) : { keys: [0] }
    		this.state.info_catche = props.info.length > 0 ? JSON.parse(props.info) : { keys: [0] }
    		this.state.default_mode = typeof (this.state.info.mode1) === 'undefined' ? 'basic' : this.state.info.mode1
    		this.state.type = props.type
  	}
  	/*
  	componentWillReceiveProps(props) {
  		if (props !== undefined) {
	  		this.state.info = props.info.length > 0 ? JSON.parse(props.info) : {keys:[0]}
	    		this.state.info_catche = props.info.length > 0 ? JSON.parse(props.info) : {keys:[0]}
	    		this.state.default_mode = typeof(this.state.info.mode1)==='undefined' ? 'basic' : this.state.info.mode1
	    		this.state.type = props.type
	  	}
  	}
	*/
	state = {
		type: '',
		info: {},
		info_catche: {},
		default_mode: '',
	}

	onChange = (value) => {
		this.state.default_mode = typeof (this.state.default_mode) === 'undefined' ? 'basic' : this.state.default_mode

		let info_cache = this.props.info.length > 0 ? JSON.parse(this.props.info) : { keys: [0] }

		if (this.state.default_mode != value) {
			let info = {}
			info.keys = [0]
			info.mode1 = value
	    		this.setState({
		  		info,
		  	})
		} else if (typeof (info_cache.keys) === 'undefined') {
				let info = {}
				info.keys = [0]
				info.mode1 = value

		    		this.setState({
			  		info,
			  	})
			} else {
				//const info1 = this.state.info_catche

		    		this.setState({
		    			info: info_cache,
		    		})
		  	}
	}

	handleSubmit = (e) => {
    		e.preventDefault()
    		this.props.form.validateFields((err, values) => {
      		if (!err) {
        			console.log('Received values of form: ', values)
      		}
    		})
  	}

	switchMode (formInfo) {
		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form

		if (typeof (formInfo.keys) === 'undefined' || this.state.type === 'create') {
			getFieldDecorator('keys', { initialValue: [0] })
		} else {
			getFieldDecorator('keys', { initialValue: formInfo.keys })
		}

		formInfo.mode1 = typeof (formInfo.mode1) === 'undefined' ? 'basic' : formInfo.mode1

		const keys = formInfo.keys

		switch (formInfo.mode1) {
			case 'basic':
				const formItems_basic = keys.map((k, index) => {
					return (
  <Row gutter={12} key={`row${k}`}>
    <Col key={`col1${k}`} {...ColProps} xl={{ span: 9 }} md={{ span: 9 }}>
      <FormItem {...FormItemProps} hasFeedback key={`alarmField_basic${k}`}>
        {
										getFieldDecorator(`alarmField_basic${k}`, {
						       				initialValue: formInfo[`alarmField_basic${k}`],
						        				rules: [
							        			{
							        				required: true,
							        			},
						        				],
						       			})(<Select style={{ width: '100%' }}>
  {SelectFilters}
</Select>)
						       		}
      </FormItem>
    </Col>
    <Col key={`col2${k}`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
      <FormItem {...FormItemProps} hasFeedback key={`op_basic${k}`}>
        {getFieldDecorator(`op_basic${k}`, {
						            		initialValue: formInfo[`op_basic${k}`],
						            		rules: [
						              	{
						               		required: true,
						              	},
						            		],
						          	})(<Select style={{ width: '100%' }}>
  <Select.Option value="=">=</Select.Option>
  <Select.Option value="!=">!=</Select.Option>
  <Select.Option value=">">></Select.Option>
  <Select.Option value=">=">>=</Select.Option>
  <Select.Option value="<">&lt;</Select.Option>
  <Select.Option value="<=">&lt;=</Select.Option>
  <Select.Option value="+">+</Select.Option>
  <Select.Option value="-">-</Select.Option>
  <Select.Option value="*">*</Select.Option>
  <Select.Option value="/">/</Select.Option>
  <Select.Option value="like">like</Select.Option>
</Select>)}
      </FormItem>
    </Col>

    <Col {...ColProps} xl={9} md={8}>
      <FormItem {...FormItemProps} hasFeedback key={`value_basic${k}`}>
        {getFieldDecorator(`value_basic${k}`, {
						            		initialValue: formInfo[`value_basic${k}`],
						            		rules: [
						              	{
						                		required: true,
						              	},
						            		],
						          	})(<Input style={{ width: '100%' }} />)}
      </FormItem>
    </Col>

    <Col key={`col3${k}`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={3}>
      <Button.Group style={{ width: '100%' }}>
        <Button type="default" icon="minus" onClick={() => this.remove(k)} disabled={keys.length === 1} />
        <Button type="default" icon="plus" onClick={() => this.add(k)} />
      </Button.Group>
    </Col>
  </Row>
					)
				})
				return (
  <div>
    <Row>
      <Col xl={{ span: 24 }} md={{ span: 24 }}>
        <FormItem {...FormItemProps}>
          {getFieldDecorator('basic_with', {
							      		initialValue: formInfo.basic_with,
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
    </Row>
    {formItems_basic}
    {/*
				          * <Row>
					        		<Col {...ColProps} xl={{ span: 23 }} md={{ span: 23 }}>
					        			<FormItem {...FormItemProps} hasFeedback>
						          		<Button type="dashed" size="small" onClick={this.add} style={{width:'100%'}}>
						            			<Icon type="plus" /> 增加匹配条件
						         		</Button>
						        		</FormItem>
					        		</Col>
				        		</Row>
				        	*/}
  </div>
				)
			break

			case 'expert':
				//const keys = getFieldValue('keys');
				const formItems_expert = keys.map((k, index) => {
					return (
  <Row gutter={12} key={`row${k}`}>
    <Col key={`col0${k}`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
      <FormItem {...FormItemProps} hasFeedback key={`start_expert${k}`}>
        {getFieldDecorator(`start_expert${k}`, {
						      			initialValue: formInfo[`start_expert${k}`],
						      		})(<Select style={{ width: '100%' }}>
  <Select.Option value="(">(</Select.Option>
  <Select.Option value="((=">((</Select.Option>
  <Select.Option value="(((">(((</Select.Option>
  <Select.Option value="((((">((((</Select.Option>
  <Select.Option value="(((((">(((((</Select.Option>
                 </Select>)}
      </FormItem>
    </Col>
    <Col key={`col1${k}`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
      <FormItem {...FormItemProps} hasFeedback key={`alarmField_expert${k}`}>
        {getFieldDecorator(`alarmField_expert${k}`, {
				            				initialValue: formInfo[`alarmField_expert${k}`],
				            				rules: [
				              			{
				                				required: true,
				              			},
				            				],
				          			})(<Select style={{ width: '100%' }}>
  {SelectFilters}
</Select>)}
      </FormItem>
    </Col>

    <Col key={`col2${k}`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
      <FormItem {...FormItemProps} hasFeedback key={`op_expert${k}`}>
        {getFieldDecorator(`op_expert${k}`, {
				            				initialValue: formInfo[`op_expert${k}`],
				            				rules: [
				              			{
				                				required: true,
				              			},
				            				],
				          				})(<Select style={{ width: '100%' }}>
  <Select.Option value="=">=</Select.Option>
  <Select.Option value="!=">!=</Select.Option>
  <Select.Option value=">">></Select.Option>
  <Select.Option value=">=">>=</Select.Option>
  <Select.Option value="<">&lt;</Select.Option>
  <Select.Option value="<=">&lt;=</Select.Option>
  <Select.Option value="+">+</Select.Option>
  <Select.Option value="-">-</Select.Option>
  <Select.Option value="*">*</Select.Option>
  <Select.Option value="/">/</Select.Option>
  <Select.Option value="like">like</Select.Option>
</Select>)}
      </FormItem>
    </Col>

    <Col key={`col3${k}`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
      <FormItem {...FormItemProps} hasFeedback key={`value_expert${k}`}>
        {getFieldDecorator(`value_expert${k}`, {
				            				initialValue: formInfo[`value_expert${k}`],
				            				rules: [
				              			{
				                				required: true,
				              			},
				            				],
				          			})(<Input style={{ width: '100%' }} />)}
      </FormItem>
    </Col>

    <Col key={`col4${k}`} {...ColProps} xl={{ span: 3 }} md={{ span: 3 }}>
      <FormItem {...FormItemProps} hasFeedback key={`end_expert${k}`}>
        {getFieldDecorator(`end_expert${k}`, {
						      			initialValue: formInfo[`end_expert${k}`],
						      		})(<Select style={{ width: '100%' }}>
  <Select.Option value=")">)</Select.Option>
  <Select.Option value="))">))</Select.Option>
  <Select.Option value=")))">)))</Select.Option>
  <Select.Option value="))))">))))</Select.Option>
  <Select.Option value=")))))">)))))</Select.Option>
                 </Select>)}
      </FormItem>
    </Col>

    <Col key={`col5${k}`} {...ColProps} xl={3} md={3}>
      <FormItem {...FormItemProps} hasFeedback key={`with_expert${k}`}>
        {getFieldDecorator(`with_expert${k}`, {
						      			initialValue: formInfo[`with_expert${k}`],
						      			rules: [
				              			{
				                				required: true,
				              			},
				            				],
						      		})(<Select style={{ width: '100%' }}>
  <Select.Option value="AND">AND</Select.Option>
  <Select.Option value="OR">OR</Select.Option>
                 </Select>)}
      </FormItem>
    </Col>

    <Col key={`col6${k}`} style={{ textAlign: 'right' }} {...ColProps} xl={3} md={3}>
      <Button.Group style={{ width: '100%' }}>
        <Button type="default" icon="minus" onClick={() => this.remove(k)} disabled={keys.length === 1} />
        <Button type="default" icon="plus" onClick={() => this.add(k)} />
      </Button.Group>
    </Col>
  </Row>
					)
				})
		    		return (
  <div>
    {formItems_expert}
    {/*
				          * 	<Row>
					        		<Col {...ColProps} xl={{ span: 23 }} md={{ span: 23 }}>
					        			<FormItem {...FormItemProps} hasFeedback>
						          		<Button type="dashed" size="small" onClick={this.add} style={{width:'100%'}}>
						            			<Icon type="plus" /> 增加匹配条件
						          		</Button>
						        		</FormItem>
					        		</Col>
				        		</Row>
				        	*/}
  </div>
				)
			break
		}
	}

	genString = () => {
		let stringResult = ''
		let jsonResult
		const { form } = this.props
		let obj = this.props.form.getFieldsValue()
		jsonResult = JSON.stringify(obj)

		stringResult = JSON.stringify(jsonResult)

		return stringResult
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

    		const formItemLayout = {
      		labelCol: {
        			xs: { span: 12 },
        			sm: { span: 4 },
      		},
      		wrapperCol: {
        			xs: { span: 12 },
        			sm: { span: 20 },
      		},
    		}
    		const formItemLayoutWithOutLabel = {
      		wrapperCol: {
        			xs: { span: 24, offset: 0 },
        			sm: { span: 20, offset: 4 },
      		},
    		}

		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form

		const children = this.switchMode(formInfo)
		const { form } = this.props

		const operations = (<FormItem {...FormItemProps} hasFeedback key="modeswitch">
  {getFieldDecorator('mode1', {
						           initialValue: formInfo.mode1,
						      	   rules: [
				                   {
				                       required: true,
				                   },
				                   ],
						       })(<Select size="small" onChange={this.onChange} style={{ width: '120px' }}>
  <Select.Option value="basic">基础模式</Select.Option>
  <Select.Option value="expert">专家模式</Select.Option>
</Select>)}
                      </FormItem>)

		return (
  <Tabs size="small" type="line" tabBarExtraContent={operations}>
    <TabPane tab="匹配条件" key="1">
      {children}
    </TabPane>
  </Tabs>
		)
	}
}

export default NEFilter
