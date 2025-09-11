import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker, Icon, Alert, Tooltip, message } from 'antd'
import { onSearchInfo, genDictOptsByName } from '../../../../../utils/FunctionTool'
import firstSecAreaAll from '../../../../../utils/selectOption/firstSecAreaAll'
import moment from 'moment'

import Fenhang from '../../../../../utils/fenhang'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const formItemLayout1 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
}


const modal = ({
  dispatch,
  modalVisible,
  item,
  form,
  modalType,
  modalName,
}) => {

  const [timeModalType, setTimeModalType] = useState("0")
  const [sev1_data, setSev1_data] = useState("")
  const [sev2_data, setSev2_data] = useState("")
  const [sev3_data, setSev3_data] = useState("")

  useEffect(() => {
    setTimeModalType(item.timeMode)
  }, [item])

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
  } = form

  let Fenhangmaps = new Map()
  Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
  })

  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
      payload: {
        modalVisible: false,
      },
    })
  }

  const onOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
    })
    const data = {
      ...getFieldsValue(), //获取弹出框所有字段的值
    }
    // let sev1_1_val = sev1_data

    // let sev1_2_val = document.getElementById('sev1_2').value

    // let sev2_2_val = document.getElementById('sev2_2').value

    // let sev3_2_val = document.getElementById('sev3_2').value
    // data.sev1_CONDITION = sev1_2_val
    // data.sev2_CONDITION = sev2_2_val
    // data.sev3_CONDITION = sev3_2_val

    if (data.workEndTime) {
      data.workEndTime = data.workEndTime.format('HH:mm:ss')
    }
    if (data.workStartTime) {
      data.workStartTime = data.workStartTime.format('HH:mm:ss')
    }
    data.id = item.id
    resetFields()
    dispatch({
      type: "flinkComputPlat/setState",
      payload: {
        modalVisible: false
      }
    })
    dispatch({
      type: "flinkComputPlat/create_updata",
      payload: data
    })
  }

  const modalOpts = {
    title: `flink管理平台策略维护`,
    visible: modalVisible,
    onCancel,
    onOk,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    destroyOnClose:true
  }

  const onChangeTimeMode = (value) => {
    setTimeModalType(value)
  }
  const onChangeSev1 = (value) => {
    setSev1_data(value)
  }
  const onChangeSev2 = (value) => {
    setSev2_data(value)
  }
  const onChangeSev3 = (value) => {
    setSev3_data(value)
  }
  
  return (
    <Modal {...modalOpts}
      width={850}
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
      key="routerModal"
    >
      <Form layout="horizontal" preserve={false}>
        <FormItem label="策略名称" key="policyName" hasFeedback {...formItemLayout}>
          {getFieldDecorator('policyName', {
            initialValue: item.policyName,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="策略说明" key="policyDesc" hasFeedback {...formItemLayout}>
          {getFieldDecorator('policyDesc', {
            initialValue: item.policyDesc,
            rules: [],
          })(<Input />)}
        </FormItem>

        <FormItem label="监控设备" key="ipAddress" hasFeedback {...formItemLayout}>
          {getFieldDecorator('ipAddress', {
            initialValue: item.ipAddress,
            rules: [],
          })(<Input />)}
        </FormItem>

        <FormItem label="策略大类" key="componentType" hasFeedback {...formItemLayout}>
          {getFieldDecorator('componentType', {
            initialValue: item.componentType,
            rules: [],
          })(<Select >
            <Select.Option value='os'>操作系统 </Select.Option>
          </Select>)}
        </FormItem>

        <FormItem label="策略中类" key="component" hasFeedback {...formItemLayout}>
          {getFieldDecorator('component', {
            initialValue: item.component,
            rules: [],
          })(<Select >
            <Select.Option value='LINUX'>LINUX </Select.Option>
            <Select.Option value='AIX'>AIX </Select.Option>
            <Select.Option value='HPUX'>HPUX </Select.Option>
            <Select.Option value='WINDOWS'>WINDOWS </Select.Option>
          </Select>)}
        </FormItem>

        <FormItem label="策略小类" key="subComponent" hasFeedback {...formItemLayout}>
          {getFieldDecorator('subComponent', {
            initialValue: item.subComponent,
          })(<Select >
            <Select.Option value='CPU'>CPU </Select.Option>
            <Select.Option value='MEM'>MEM </Select.Option>
            <Select.Option value='文件系统'>文件系统 </Select.Option>
            <Select.Option value='文件系统索引节点'>文件系统索引节点 </Select.Option>
          </Select>)}
        </FormItem>
        <FormItem label="次数" key="repeat_count" hasFeedback {...formItemLayout1}>
          {getFieldDecorator('repeat_count', {
            initialValue: item.repeat_count,
          })(<Input placeholder='异常次数'/>)}
        </FormItem>
        <FormItem label="一级策略" key="sev1Condition" hasFeedback {...formItemLayout1}>
          {getFieldDecorator('sev1Condition', {
            initialValue: item.sev1Condition,
          })(<Input  placeholder="阈值"  />
          // <div>
          //   {/* <Select id='sev1_1' style={{ width: "28%" }} placeholder="运算符" onChange={onChangeSev1} value={">"}>
          //     <Select.Option value='>'>&gt; </Select.Option>
          //     <Select.Option value='<'>&lt; </Select.Option>
          //   </Select> */}
          //   <Input  placeholder="阈值"  /> {/*  &nbsp;&nbsp;连续&nbsp;&nbsp; */}
          //   {/* <Input id='sev' style={{ width: "28%" }} />&nbsp;&nbsp;&nbsp;次 */}
          // </div>
          )}
        </FormItem>
        <FormItem label="二级策略" key="sev2Condition" hasFeedback {...formItemLayout1}>
          {getFieldDecorator('sev2Condition', {
            initialValue: item.sev2Condition,
          })(<Input placeholder="阈值"  /> )}
        </FormItem>
        <FormItem label="三级策略" key="sev3Condition" hasFeedback {...formItemLayout1} >
          {getFieldDecorator('sev3Condition', {
            initialValue: item.sev3Condition,
            rules: [],
          })(<Input  placeholder="阈值"  />)}
        </FormItem>
        <FormItem label="生效周期" key="workDay" hasFeedback {...formItemLayout}>
          {getFieldDecorator('workDay', {
            initialValue: item.workDay,
            rules: [],
          })(<Select >
            <Select.Option value='0'>每天 </Select.Option>
            <Select.Option value='1'>工作日 </Select.Option>
            <Select.Option value='2'>节假日 </Select.Option>
          </Select>)}
        </FormItem>
        <FormItem label="监控时间" key="timeMode" hasFeedback {...formItemLayout}>
          {getFieldDecorator('timeMode', {
            initialValue: item.timeMode,
            rules: [],
          })(<Select onChange={onChangeTimeMode}>
            <Select.Option value='0'>全天 </Select.Option>
            <Select.Option value='1'>白天(8:00--17:00) </Select.Option>
            <Select.Option value='2'>夜间(17:00--次日8:00) </Select.Option>
            <Select.Option value='3'>自定义 </Select.Option>
          </Select>)}
        </FormItem>
        {
          timeModalType == '3' ?
            <>
              <FormItem label="开始时间" key="workStartTime" hasFeedback {...formItemLayout}>
                {getFieldDecorator('workStartTime', {
                  initialValue: item.workStartTime ? moment(item.workStartTime, 'HH:mm:ss') : "",
                })(<TimePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder="请选择开始时间"
                  format="HH:mm:ss"
                  style={{ width: '100%' }}
                />)}
              </FormItem>
              <FormItem label="结束时间" key="workEndTime" hasFeedback {...formItemLayout}>
                {getFieldDecorator('workEndTime', {
                  initialValue: item.workEndTime ? moment(item.workEndTime, 'HH:mm:ss') : "",
                })(<TimePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder="请选择开始时间"
                  format="HH:mm:ss"
                  style={{ width: '100%' }}
                />)}
              </FormItem>
            </>
            : null
        }

      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
}

export default Form.create()(modal)
