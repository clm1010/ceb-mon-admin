import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Select, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const FormItemProps = {
  style: {
    margin: 0,
  },
}

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const ColProps = {
  style: {
    marginBottom: 8,
    textAlign: 'right',
  },
}

function genOptions (objArray) {
	let options = []
	objArray.forEach((option) => {
		options.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
	})
	return options
}

function Zabbix_Calculated ({
 dispatch, item, form, itemType, resetCalInput,
}) {

	//先取state里的Formula字符串，转换成对象数组
	let objectArray = typeof (item.formulaForFrontend) !== 'undefined' && item.formulaForFrontend !== '' ? JSON.parse(item.formulaForFrontend) : []

	const ontest = () => {
		/*
			获取列表
		*/
		dispatch({
			type: 'zabbixItemsInfo/queryItemInfo',
			payload: {
				groupUUID: '',
			},
		})

		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				selectItemVisible: true,
				isClose: false,
			},
		})
		resetFields(['formulaForFrontend'])
	}

	const resetFormula = () => {
		item.formula = ''
		item.formulaForFrontend = ''
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				currentItem: item,
				resetCalInput: true,
			},
		})
	}

	const getFormulaStrs = (objarrs) => {
		let formulastr = ''
		if (objarrs && objarrs.length > 0) {
		  objarrs.forEach((bean) => {
			let uuidstr = bean.uuid
			if (uuidstr && uuidstr.includes('_')) {
			  let arrs = uuidstr.split('_')
			  if (arrs && arrs.length > 0) {
				for (let i=0 ; i<arrs.length-1 ; i++) {
				  if (i != arrs.length-2) {
					formulastr += arrs[i]+'_'
				  }else{
					formulastr += arrs[i]
				  }
				}
			  }
			}
		  })
		}
		return formulastr
	  }

	const addOps = (type) => {
		resetFields(['formulaForFrontend']) //当输入框的内容被删空后，再次插入内容需要清空一下。
		let uuid
		if(type.length>1 && (type=='BANDWIDTH'||type=='COLLECTINTERVAL'|| type=='IP'||type=='PORT'||type=='USERNAME'||type=='PASSWORD'|| type == 'NAME'|| type == 'FS_NAME' ||type=='PATH' ||type=='PROCESS')){
			uuid = `#{${type}}_${new Date().getTime()}`
		}else {
			uuid = `${type}_${new Date().getTime()}`
		}

		//向数组推送新的对象
		objectArray.push({ uuid, name: type })
		//再转型成字符串
		let stringArray = JSON.stringify(objectArray)
		//修改当前item的formual属性
		item.formulaForFrontend = stringArray

		//后台需要解析并计算的公式
		item.formula = getFormulaStrs(objectArray)
		/*
		把修改后的当前currentItem，覆盖到state中去
		*/
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				currentItem: item,
				resetCalInput: false,
			},
		})
	}
	const addString = (type) => {
		resetFields(['formulaForFrontend']) //当输入框的内容被删空后，再次插入内容需要清空一下。
		let uuid
		if(type.length>1 && (type=='BANDWIDTH'||type=='COLLECTINTERVAL'|| type=='IP'||type=='PORT'||type=='USERNAME'||type=='PASSWORD'|| type == 'NAME'||type=='FS_NAME'|| type=='PATH' ||type=='PROCESS')){
			uuid = `#{${type}}_${new Date().getTime()}`
		}else {
			uuid = `${type}_${new Date().getTime()}`
		}

		//向数组推送新的对象
		objectArray.push({ uuid, name: type })
		//再转型成字符串
		let stringArray = JSON.stringify(objectArray)
		//修改当前item的formual属性
		item.formulaForFrontend = stringArray

		//后台需要解析并计算的公式
		item.formula = getFormulaStrs(objectArray)
	}
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	const options = typeof (item.formulaForFrontend) !== 'undefined' && item.formulaForFrontend !== '' ? genOptions(objectArray) : []
	const defaultValue = []
	if (!resetCalInput ) {		//如果判断不是清空，则展现，否则不展现
		options.forEach((option) => {
			defaultValue.push(option.key)
			//options.push(<Option key={option.key} value={option.key} select={true}>{option.props.children}</Option>)
		})
	}


	const handleChange = (val) => {
		let arrs = []
		if (val && val.length > 0) {
			arrs = objectArray.filter((bean, index) => val.includes(bean.uuid))
			// arrs = objectArray
		} else {
			item.formulaForFrontend = undefined
			item.formula = ''
		}
		if (arrs.length > 0) {
			item.formulaForFrontend = JSON.stringify(arrs)
			item.formula = getFormulaStrs(arrs)
		}
		//val=''
		//再转型成字符串
		//let stringArray = JSON.stringify([])

		/*
		把修改后的当前currentItem，覆盖到state中去
		*/
		dispatch({
			type: 'zabbixItemsInfo/controllerModal',
			payload: {
				currentItem: item,
				resetCalInput: false,
			},
		})
		//resetFields(['formula'])
	}

	let onSearchval = ''
	//let falg = true
	const onSearch = (val) => {
		if(val!=''){
            onSearchval = val
        }else if(onSearchval && onSearchval !== ''){
            addString(onSearchval)
        }
	}

	const onBlur = () => {
		if (onSearchval && onSearchval !== '') {
			addOps(onSearchval)
		}
		onSearchval = ''
		//falg = true
	}
	return (<div id="test"><FormItem label="公式编辑区" hasFeedback {...formItemLayout}>
  {getFieldDecorator('formulaForFrontend', {
					initialValue: defaultValue,
					rules: [
					  {
							required: true,
					  },
					],
				  })(<Select placeholder="公式编辑区" allowClear mode="tags" dropdownStyle={{ display: 'none' }} onChange={handleChange} onSearch={onSearch} onBlur={onBlur}>
  {options}
         </Select>)}
  <Button size="small" style={{ marginTop: '8px' }} onClick={() => addOps('+')}>+</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('-')}>-</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('*')}>*</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('/')}>/</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('(')}>(</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps(')')}>)</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('BANDWIDTH')}>端口带宽</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('COLLECTINTERVAL')}>采集周期</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('IP')}>IP</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('PORT')}>PORT</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('USERNAME')}>USERNAME</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('PASSWORD')}>PASSWORD</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('NAME')}>NAME</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('FS_NAME')}>文件系统名</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('PATH')}>路径</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('PROCESS')}>进程名</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={ontest}>插入Item</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} disabled>校验</Button>
  <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={resetFormula}>清空</Button>
    </FormItem>
	<FormItem label='KEY扩展' hasFeedback {...formItemLayout}>
              {getFieldDecorator('formulaExt',{
                initialValue: item.formulaExt,
                rule: [],
              })(<Input />)}
           </FormItem>
         </div>)
}

export default Zabbix_Calculated
