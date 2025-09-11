import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, AutoComplete, Button , Row, Col, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const AutoOption = AutoComplete.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}
const formItemLayout1 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 6,
  },
}
function genOptions(objArray) {
  let options = []
  objArray.forEach((option) => {
    options.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
  })
  return options
}

function Zabbix_Agent({
  dispatch, item, itemType, form, resetCalInput,chooseWay
}) {
  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields,
  } = form
  if (typeof (item.formulaForFrontend) == 'undefined' || item.formulaForFrontend == '') {
    resetCalInput = true
  } else {
    resetCalInput = false
  }
  let objectArray = typeof (item.formulaForFrontend) !== 'undefined' && item.formulaForFrontend !== '' ? JSON.parse(item.formulaForFrontend) : []
  const resetFormula = () => {
    item.formula = undefined
    item.formulaForFrontend = undefined
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
              }else if(i === arrs.length-2){
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
    resetFields(['formula']) //当输入框的内容被删空后，再次插入内容需要清空一下。
    let uuid
    if (type.length > 1) {
      uuid = `#{${type}}_${new Date().getTime()}`
    } else {
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
  //   resetFields(['formula'])
    let uuid
    if (type.length > 1) {
      uuid = `${type}_${new Date().getTime()}`
    } else {
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

  let selectOptions = [
    <AutoOption key="icmppingloss" >PING丢包率</AutoOption>,
    <AutoOption key="icmppingsec" >PING响应时间</AutoOption>,
    <AutoOption key="icmpping" >PING状态</AutoOption>,
    <AutoOption key="PLR" > RPING丢包率</AutoOption>,
    <AutoOption key="ARTT" >RPING响应时间</AutoOption>]

  const options = typeof (item.formulaForFrontend) !== 'undefined' && item.formulaForFrontend !== '' ? genOptions(objectArray) : selectOptions
  const defaultValue = []
  if (!resetCalInput && typeof (item.formulaForFrontend) !== 'undefined' && item.formulaForFrontend !== '') {		//如果判断不是清空，则展现，否则不展现
    options.forEach((option) => {
      defaultValue.push(option.key)
    })
  }


  /**
   * 
   * 当formula值发生更改时需要先将对应的字段分解 1、增加字段 2、删减字段 的逻辑处理
   */
  const handleChange = (val) => {
    let arrs = []
    let temp 
    if (val && val.length > 0) {
        if(val[val.length-1]==onSearchval){
          temp = !temp
          let type = onSearchval
          let uuid = `${type}_${new Date().getTime()}`
          objectArray.push({ uuid, name: type })
         }
         arrs = temp? objectArray : objectArray.filter((bean, index) => val.includes(bean.uuid))
    } else {
      item.formulaForFrontend = undefined
      item.formula = ''
    }
    if (arrs.length > 0) {
      item.formulaForFrontend = JSON.stringify(arrs)
      item.formula = getFormulaStrs(arrs)
    }
    if (val && val.length > 0) {
      dispatch({
        type: 'zabbixItemsInfo/controllerModal',
        payload: {
          currentItem: item,
          resetCalInput: false,
        },
      })
    } else {
      dispatch({
        type: 'zabbixItemsInfo/controllerModal',
        payload: {
          resetCalInput: true,
        },
      })
    }
  }

  let onSearchval
  const onSearch = (val) => {
    if(val!=''){
      onSearchval = val
    }
    // if (val != '') {
    //   onSearchval = val
    // } else if (onSearchval && onSearchval !== '') {
    //   addString(onSearchval)
    // }
  }

  const onBlur = () => {
    if (onSearchval && onSearchval !== '') {
    //  addString(onSearchval)
    }
    onSearchval = ''
  }
  let mode = resetCalInput ? null : "tags"
  let dropdownStyle = resetCalInput ? null : { display: 'none' }
  const onChange = (value) => {
    item.formula = undefined
    item.formulaForFrontend = undefined
    dispatch({
      type: 'zabbixItemsInfo/controllerModal',
      payload: {
        chooseWay:value,
        currentItem: item
      },
    })
    resetFields(['formula'])
  }

  let pathDisplay = (itemType === 'ZABBIX_IPMI')? 'none' : '';
  let processDisplay = (itemType === 'ZABBIX_IPMI')? 'none' : '';
  let jmx_IpDisplay = (itemType === 'ZABBIX_JMX')? '' : 'none';
  let jmx_PortDisplay = (itemType === 'ZABBIX_JMX')? '' : 'none';
  return (
    <div>
        <FormItem label="请" hasFeedback {...formItemLayout1}>
          {getFieldDecorator('chooseWay', {
            initialValue: chooseWay,
          })(<Select onChange={onChange}>
            <Select.Option value="0">选择</Select.Option>
            <Select.Option value="1">输入</Select.Option>
          </Select>)}
        </FormItem>
        {
          chooseWay== '0' ? 
          <FormItem label="KEY原型" hasFeedback {...formItemLayout}>
          {
            getFieldDecorator('formula', {
              initialValue: defaultValue.length > 0 ? defaultValue : item.formula,
              rules: [
                {
                  required: true,
                },
              ],
            })(<AutoComplete placeholder="公式编辑区" allowClear mode={mode} >
              {options}
            </AutoComplete >)
          }
          </FormItem>
          :
            <FormItem label="KEY原型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('formula', {
                  initialValue: defaultValue.length > 0 ? defaultValue : item.formula,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select placeholder="公式编辑区" allowClear mode="tags" dropdownStyle={{ display: 'none' }} onChange={handleChange} onSearch={onSearch}>
                  {options}
                </Select>)
              }
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('IP')}>IP</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('PORT')}>PORT</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('USERNAME')}>USERNAME</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('PASSWORD')}>PASSWORD</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('FS_NAME')}>文件系统名</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px', display: pathDisplay }} onClick={() => addOps('PATH')}>路径</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px', display: processDisplay }} onClick={() => addOps('PROCESS')}>进程名</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addOps('NAME')}>NAME</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px', display: jmx_IpDisplay }} onClick={() => addOps('JMX_IP')}>JMX_IP</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px', display: jmx_PortDisplay }} onClick={() => addOps('JMX_PORT')}>JMX_PORT</Button>
              <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={resetFormula}>清空</Button>
            </FormItem>
           }
           <FormItem label='KEY扩展' hasFeedback {...formItemLayout}>
              {getFieldDecorator('formulaExt',{
                initialValue: item.formulaExt,
                rule: [],
              })(<Input />)}
           </FormItem>
    </div>
  )
}

export default Zabbix_Agent
