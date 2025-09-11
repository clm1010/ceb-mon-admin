import React from 'react'
import { Form, Button, Select } from 'antd'
import AppSelect from '../../components/appSelectComp'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
	},
	style: { marginBottom: 4 },
}

const SearchZone = ({
	item,
	form,
	dispatch,
	appSelect,
}) => {
	const {
		getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
	} = form

	const appSelectProps = Object.assign({}, appSelect, {
		placeholders: '请输入应用信息查询',
		name: '应用名',
		modeType: 'combobox',
		required: false,
		dispatch,
		form,
		disabled: false,
		compName: 'appName',
		formItemLayout,
	})

	const query = () => {
		let params = {
			...getFieldsValue(),
		}
		if(params.FirstOccurrence){
			params.FirstOccurrence = parseInt((new Date().getTime() - params.FirstOccurrence*60*60*1000)/1000)
		}
		dispatch({
			type: 'distribution/query',
			payload: {
				acknowledged: params.acknowledged,
				appName: params.appName,
				FirstOccurrence:params.FirstOccurrence
			},
		})
	}
	return (
		<Form layout="horizontal">
			<span style={{ width: '30%', float: 'left' }}>
				<AppSelect {...appSelectProps} />
			</span>
			<span style={{ width: '30%', float: 'left' }}>
				<FormItem label="接管状态" key="acknowledged" hasFeedback {...formItemLayout}>
					{getFieldDecorator('acknowledged', {
						initialValue: 'all',
						rules: [],
					})(<Select>
						<Option value="all">所有</Option>
						<Option value="0">未接管</Option>
						<Option value="1">已接管</Option>
					</Select>)}
				</FormItem>
			</span>
			<span style={{ width: '30%', float: 'left' }}>
				<FormItem label="告警发生时间" key="FirstOccurrence" hasFeedback {...formItemLayout}>
					{getFieldDecorator('FirstOccurrence', {
						initialValue: undefined,
						rules: [],
					})(<Select allowClear={true}>
						<Option value={0.5}>近半小时</Option>
						<Option value={1}>近一小时</Option>
						<Option value={2}>近两小时</Option>
						<Option value={4}>近四小时</Option>
					</Select>)}
				</FormItem>
			</span>
			<span style={{ float: 'right' }}><Button size="large" type="primary" onClick={query}>查询</Button></span>
		</Form>
	)
}

export default Form.create()(SearchZone)
