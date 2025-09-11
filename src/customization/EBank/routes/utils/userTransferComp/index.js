import React from 'react'
import { Form, Select, Spin } from 'antd'
import debounce from 'throttle-debounce/debounce'
const FormItem = Form.Item

//特别注意，特别注意 ，特别注意！！！！！  <!-- 当你需要改变API->mode的类型时，需要注意当mode的属性为multiple时，他的defaultName为一个数组，为combobox时，defaultName为一个字符串-->
const userRoleTransfer = ({
	form:{//表单函数
	  getFieldDecorator,
	  validateFields,
	  getFieldsValue,
	  resetFields,
	},
	dataSource:[],				//全量用户集合
  targetKeys:[],				//显示在右侧框数据的key集合
	showSearch:false,			//是否显示搜索框
	formItemLayout,
}) => {

	//当搜索的数据后，点中所选才会触发这个函数
	const onSelect = (value, option) => {
		if(value.length > 0){
			dispatch({
				type:'moSelect/setState',
				payload:({
					defaultName: option.props.children,
				})
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

	return(
		<FormItem label= {name}  hasFeedback={required} {...formItemLayout1}>
			{getFieldDecorator('ip', {
  	  	initialValue: modeType === 'multiple'? cDefaultName : mDefaultName ,
  	  	rules: [
					{
						required: required,
					},
				],
  			})(
  			<Select
			    allowClear
					mode = {modeType}
					filterOption = {filterOption}
					notFoundContent={isLoading ? <Spin size="small"/> : null}
			    style={{ width: '100%' }}
			    placeholder={placeholders}
			    onSearch = {debounce(800 ,query)}
			    onSelect = {onSelect}
			    disabled = {disabled}
			    getPopupContainer={() => document.body}
			    filterOption = {false}
				>
  				{optionsInfo}
  			</Select>
  		)}
		</FormItem>
	)
}
export default Form.create()(userRoleTransfer)
