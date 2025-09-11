import React from 'react'
import { Form, Select, Spin } from 'antd'
import debounce from 'throttle-debounce/debounce'
const FormItem = Form.Item
const Option = Select.Option
const OptGroup = Select.OptGroup
//特别注意，特别注意 ，特别注意！！！！！  <!-- 当你需要改变API->mode的类型时，需要注意当mode的属性为multiple时，他的defaultName为一个数组，为combobox时，defaultName为一个字符串-->
const userSelect = ({
	form: {//表单函数
	  getFieldDecorator,
	  validateFields,
	  getFieldsValue,
	  resetFields,
	},
	dispatch,
	//disadled,//可用性-布尔
	disabled,
	placeholders, //提示信息-string
	options, //查询到的原始数据
	name, //控件的名字
	mDefaultName, //编辑时，加载上去的名字
	inputInfo, //输入的搜索条件
	isLoading, //加载的状态
	pageSize, //控制查询的条数
	filterOption,
	modeType,
	cDefaultName,
	required,
	formItemLayout,
	externalFilter,
	item,
	compName,
}) => {
	let optionsInfo = []
	let text = `查询结果大于${pageSize}条，返回前${pageSize}条数据`
	//迭代生成搜索到的数据，下拉框上的数据，<optionsInfo可以从index.js页面渲染后传进来>
	if (options.length > 0) {
		options.forEach((item, index) => { //添加name属性--> 将名字改掉   其实是传的uuid
			let values = `${item.username}/${item.name}`
			let keys = item.uuid
			let userInfo = item.username
			optionsInfo.push(<Option key={keys} username={userInfo} value={values}>{values}</Option>)
		})
	}
	let allOptions = []
	if (optionsInfo.length > 0) {
		allOptions.push(<OptGroup label="申请人信息" key="1">{optionsInfo}</OptGroup>)
	}

	//如果查询的数据几个，和规定查多少条相同，那么就会返回这个提示
	if (options.length === pageSize) {
		optionsInfo.push(<Option key="disabled" disabled>{text}</Option>)
	}
	//这是一个回调函数，当在输入框中输入搜索信息时就会触发这个函数
	const query = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'userSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
				}),
			})
		//查询，传入输入的查询字段
			dispatch({
				type: 'userSelect/query',
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
				type: 'userSelect/setState',
				payload: ({
					defaultName: option.props.children,
				}),
			})
		}
	}

	const formItemLayout1 = {
		labelCol: {
	  	span: 4,
		},
		wrapperCol: {
	  	span: 20,
		},
	}

	const formItemLayout2 = {
		labelCol: {
	  	span: 6,
		},
		wrapperCol: {
	  	span: 14,
		},
	}

	return (
  <FormItem label={name} hasFeedback={required} {...formItemLayout2} key={compName}>
    {getFieldDecorator(compName, {
	  	  	initialValue: cDefaultName,
	  	  	rules: [
						{
							required,
						},
					],
  			})(<Select
	allowClear
	showSearch
    mode={modeType}
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
    {allOptions}
        </Select>)}
  </FormItem>
	)
}
export default userSelect
