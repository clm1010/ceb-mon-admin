import React from 'react'
import { Form, Select, Spin } from 'antd'
import debounce from 'throttle-debounce/debounce'
const FormItem = Form.Item
const Option = Select.Option

const osSingleSelect = ({
	form: {//表单函数
	  getFieldDecorator,
	  validateFields,
	  getFieldsValue,
	  resetFields,
	},
	defaultValue,
	dispatch,
	disabled,
	placeholders, //提示信息-string
	options, //查询到的原始数据
	name, //控件的名字
	inputInfo, //输入的搜索条件
	isLoading, //加载的状态
	pageSize, //控制查询的条数
	filterOption,
	modeType,
	required,
	formItemLayout,
	externalFilter,
	item,
	compName,
	onSelect,
	query,
}) => {
	//后端返回的mo列表，真实的mo是嵌套在集合元素中的，需要做抽取
	options = options.map(v => v.mo)

	let optionsInfo = []
	let text = `查询结果大于${pageSize}条，返回前${pageSize}条数据`
	//迭代生成搜索到的数据，下拉框上的数据，<optionsInfo可以从index.js页面渲染后传进来>
	options.forEach((item, index) => {
		let values = item.keyword === '' ? item.name : `${item.keyword}/${item.name}`
		let keys = item.uuid
		optionsInfo.push(<Option key={values} value={values} uuid={keys} record={item}>{values}</Option>)
	})
	//如果查询的数据几个，和规定查多少条相同，那么就会返回这个提示
	if (options.length === pageSize) {
		optionsInfo.push(<Option key="disabled" disabled>{text}</Option>)
	}

	return (
  <FormItem label={name} hasFeedback={required} {...formItemLayout} key={compName}>
    {getFieldDecorator(compName, {
	  	  	initialValue: defaultValue,
	  	  	rules: [
						{
							required,
						},
					],
  			})(<Select
    showSearch
    filterOption={filterOption}
    notFoundContent={isLoading ? <Spin size="small" /> : null}
    style={{ width: '100%' }}
    placeholder={placeholders}
    onSearch={debounce(800, query)}
    onSelect={onSelect}
    disabled={disabled}
    getPopupContainer={() => document.body}
    filterOption={false}
  			>
    {optionsInfo}
        </Select>)}
  </FormItem>
	)
}
export default osSingleSelect
