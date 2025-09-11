import React from 'react'
import { Form, Select } from 'antd'
import debounce from 'throttle-debounce/debounce'
const FormItem = Form.Item
const Option = Select.Option

//特别注意，特别注意 ，特别注意！！！！！  <!-- 当你需要改变API->mode的类型时，需要注意当mode的属性为multiple时，他的defaultName为一个数组，为combobox时，defaultName为一个字符串-->
const appSelect = ({
	form: {//表单函数
	  getFieldDecorator,
	  validateFields,
	  getFieldsValue,
	  resetFields,
	},
	dispatch,
	disabled,
	currentItem,
	placeholders, //提示信息-string
	options, //查询到的原始数据
	name, //控件的名字
	inputInfo, //输入的搜索条件
	isLoading, //加载的状态
	pageSize, //控制查询的条数
	total,
	filterOption,
	modeType,
	required,
	formItemLayout,
	externalFilter,
	compName,
	onChangeFun,
}) => {
	let optionsInfo = []
	let text = `查询结果大于${pageSize}条，返回前${pageSize}条数据`
	//迭代生成搜索到的数据，下拉框上的数据，<optionsInfo可以从index.js页面渲染后传进来>
		options.forEach((item, index) => {
			let values = item.affectSystem
			let keys = Date.parse(new Date()) + index
			optionsInfo.push(<Option key={keys} value={values} record={item}>{values}</Option>)
		})
	//如果查询的数据几个，和规定查多少条相同，那么就会返回这个提示
	if (total > pageSize) {
		optionsInfo.push(<Option key="disabled" disabled>{text}</Option>)
	}
	//这是一个回调函数，当在输入框中输入搜索信息时就会触发这个函数
	const query = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'appSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
					currentItem: {},
				}),
			})
			//查询，传入输入的查询字段
			dispatch({
				type: 'appSelect/query',
				payload: ({
					inputInfo: value,
					pageSize,
				}),
			})
		}
	}

	//当搜索的数据后，点中所选才会触发这个函数
	const onSelect = (value, option) => {
		if (value.length > 0) {
			dispatch({
				type: 'appSelect/setState',
				payload: ({
					defaultName: option.props.children,
					externalFilter: '',
					options: [],
					isLoading: false,
					currentItem: option.props.record,
				}),
			})
		}
	}

	return (
  <FormItem label={name} validateStatus={isLoading ? 'validating' : ''} hasFeedback={required} {...formItemLayout} key={compName}>
    {getFieldDecorator(compName, {
  	  		initialValue: currentItem.affectSystem,
				rules: [
					{
						required,
					},
				],
  			})(<Select
    allowClear
    mode={modeType}
	showSearch
    filterOption={filterOption}
    style={{ width: '100%' }}
    placeholder={placeholders}
    onSearch={debounce(800, query)}
    onSelect={onSelect}
    disabled={disabled}
    getPopupContainer={() => document.body}
	onChange={onChangeFun}
  			>
    {optionsInfo}
        </Select>)}
  </FormItem>
	)
}
export default appSelect
