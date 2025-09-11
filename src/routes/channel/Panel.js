import React from 'react'
import { Form, Radio, Alert, Spin, Row, Col, Tabs, Icon, Button } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

class panel extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			byOperator: this.props.byOperator,
			spinning: this.props.spinning,
		}
	}
	componentWillReceiveProps(props) {
		this.state.byOperator = this.props.byOperator
		this.state.spinning = this.props.spinning
	}

	formItemLayout = {
		labelCol: {
			span: 10,
		},
		wrapperCol: {
			span: 14,
		},
	}

	formItemLayout1 = {
		labelCol: {
			span: 7,
		},
		wrapperCol: {
			span: 17,
		},
	}

	onChange = (e) => {
		let tabsValue = ''
		if (e.target.value) {
			tabsValue = '1'
		} else if (!e.target.value) {
			tabsValue = '2'
		}
		this.props.dispatch({
			type: 'channel/setState',
			payload: {
				tabsKey: tabsValue,
			},
		})
	}

	onOk = () => {
		const { getFieldsValue, validateFieldsAndScroll } = this.props.form
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
			}
			let data = {
				...getFieldsValue(),
			}
			this.setState({
				spinning: true,
			})
			this.props.dispatch({
				type: 'channel/update',
				payload: {
					item: data,
				},
			})
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<Spin tip="正在更新状态,请稍后..." spinning={this.state.spinning}>
				<Form layout="horizontal">
					<Row justify="center" style={{ padding: 120 }}>
						<Col>
							<FormItem label="模式" key="byOperator" hasFeedback {...this.formItemLayout}>
								{getFieldDecorator('byOperator', {
									initialValue: this.state.byOperator,
								})(<RadioGroup onChange={this.onChange}>
									<Radio value>人工</Radio>
									<Radio value={false}>自动</Radio>
								</RadioGroup>)}
							</FormItem>
						</Col>
						<Col>
							<Tabs activeKey={this.props.tabsKey}>
								<TabPane tab={<span><Icon type="setting" style={{ color: '#E8C78D', fontSize: 20 }} />人工模式状态设置</span>} disabled key="1">
									<Alert message={this.props.statusOperator ? '当前光大家通知正常,采用短信和光大家通知渠道' : '当前光大家通知异常,采用短信通知渠道'} type={this.props.statusOperator ? 'info' : 'warning'} showIcon /><br />
									<FormItem label="状态" key="statusOperator" hasFeedback {...this.formItemLayout1}>
										{getFieldDecorator('statusOperator', {
											initialValue: this.props.statusOperator,
										})(<RadioGroup>
											<Radio value>采用光大家和短信的通知渠道</Radio>
											<Radio value={false}>仅采用短信的通知渠道</Radio>
										</RadioGroup>)}
									</FormItem>
									<span style={{ float: 'right' }}>
										<Button htmlType="submit" onClick={this.onOk}>保存</Button>
									</span>
								</TabPane>
								<TabPane tab={<span><Icon type="android" style={{ color: '#0ADBF1', fontSize: 20 }} />自动模式状态设置</span>} disabled key="2">
									<Alert message={this.props.statusAuto ? '当前光大家通知正常,采用短信和光大家通知渠道' : '当前光大家通知异常,采用短信通知渠道'} type={this.props.statusAuto ? 'info' : 'warning'} showIcon /><br />
									<span style={{ float: 'right' }}>
										<Button htmlType="submit" onClick={this.onOk}>保存</Button>
									</span>
								</TabPane>
							</Tabs>
						</Col>
					</Row>
				</Form>
			</Spin>
		)
	}
}

export default Form.create()(panel)
