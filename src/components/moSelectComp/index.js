import React from 'react'
import { Form, Select, Spin, notification, Icon } from 'antd'
import debounce from 'throttle-debounce/debounce'
const FormItem = Form.Item
const Option = Select.Option
//特别注意，特别注意 ，特别注意！！！！！  <!-- 当你需要改变API->mode的类型时，需要注意当mode的属性为multiple时，他的defaultName为一个数组，为combobox时，defaultName为一个字符串-->
const moSelect = ({
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
			let values = `${item.discoveryIP}/${item.name}`
			let keyVal = item.uuid
			let keys = item.uuid
			optionsInfo.push(<Option key={keyVal} uuid={keys} value={values}>{values}</Option>)
		})
	}
	if (options.length === pageSize) {
		optionsInfo.push(<Option key="disabled" disabled>{text}</Option>)
	}
	//这是一个回调函数，当在输入框中输入搜索信息时就会触发这个函数
	const query = (value) => {
		//如果输入了信息，就会打开加载的icon,显示正在加载
		if (value !== '') {
			dispatch({
				type: 'moSelect/setState',
				payload: ({
					isLoading: true,
					options: [],
					externalFilter: externalFilter === '' ? '' : externalFilter,
				}),
			})
		//查询，传入输入的查询字段
			dispatch({
				type: 'moSelect/query',
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
				type: 'moSelect/setState',
				payload: ({
					defaultName: option.props.children,
				}),
			})
		}
	}

	const onDeselect = (value, option) => {
    notification.open({
      message: <span>通知规则设备<span style={{ color: '#E90012' , fontWeight: 'bold' }}>删除</span>操作</span>,
      description: <span>请注意！您刚刚在该条通知规则中移除了 <span style={{ color: '#E90012', fontWeight: 'bold'}}>{value}</span> 这台设备!</span>,
      icon: <Icon type="delete" style={{ color: '#EBC581' }} />,
      duration: 10,
      placement: 'topLeft'
    });
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
	  	span: 2,
		},
		wrapperCol: {
	  	span: 22,
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
    mode={modeType}
    filterOption={filterOption}
    notFoundContent={isLoading ? <Spin size="small" /> : null}
    style={{ width: '100%' }}
    placeholder={placeholders}
    onSearch={debounce(800, query)}
    onSelect={onSelect}
    onDeselect = {onDeselect}
    disabled={disabled}
    getPopupContainer={() => document.body}
    filterOption={false}
  			>
    {optionsInfo}
        </Select>)}
  </FormItem>
	)
}
export default moSelect
