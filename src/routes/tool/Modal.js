import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import fenhang from '../../utils/fenhang'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
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
  visible,
  type,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  checkStatus,
  isClose,
  typeValue,
  lableInfoVal,
  element
}) => {
  let icon = ''	//done,success,fail,checking
  if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

  const onOk = () => {
    //弹出窗口点击确定按钮触发的函数
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      let regex = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.'
        + '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'
        + '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'
        + '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\:'
        + '([1-9]\\d{3}|[1-9]\\d{1}|[1-9]\\d{4}|[1-9]|[1-9]\\d{2}|[1-9]\\d{5})$'

      data.org = data.org
      let label = []
      let flag = false
      let flag1 = false
      lableInfoVal.forEach((item) => {
        if (item.key == 'ump_env') {
          flag = true
        }
        label.push(item.uuid)
        if (item.key == 'ump_env' && item.value == 'CPAAS') {
          flag1 = true
        }
      })
      if (flag1) {
        lableInfoVal.forEach((item) => {
          if (item.key == 'ump_env_cluster') {
            flag1 = false
          }
        })
      }
      let pdTool = true
      lableInfoVal.forEach((item) => {
        if (item.key == 'ump_tool') {
          pdTool = false
        }
      })
      dispatch({
        type: `tool/updateState`,											//抛一个事件给监听这个type的监听器
        payload: {
          pdTool: pdTool
        },
      })
      data.tagUUIDs = label
      if (typeValue != 'PROMETHEUS' && data.url && !data.url.match(regex)) {
        Modal.warning({
          title: 'Zabbix的URL输入错误！',
          okText: 'OK',
        })
      } else if (!flag && typeValue == 'PROMETHEUS') {
        Modal.warning({
          title: '分布式中必须增加key为ump_env的标签',
          okText: '确定',
        })
      } else if (flag1) {
        Modal.warning({
          title: '容器云平台的工具必须配置集群标签',
          okText: '确定',
        })
      } else if (pdTool && typeValue == 'PROMETHEUS') {
        Modal.warning({
          title: '请设置ump_tool工具标签！',
          okText: '确定',
        })
      } else {
        dispatch({
          type: `tool/${type}`,											//抛一个事件给监听这个type的监听器
          payload: data,
        })
        resetFields()
      }
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'tool/hideModal',													//抛一个事件给监听这个type的监听器
      payload: {
        modalVisible: false,
        typeValue: '',
        lableInfoVal: [],
      },
    })
  }

  const onCheckStart = () => {																				//弹出窗口点击确定按钮触发的函数
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      dispatch({
        type: 'tool/showCheckStatus',											//抛一个事件给监听这个type的监听器
        payload: {
          currentItem: data,
          checkStatus: 'checking',
        },
      })
    })
  }

  const onCheckCancel = () => {																				//弹出窗口点击确定按钮触发的函数
    dispatch({
      type: 'tool/showCheckStatus',											//抛一个事件给监听这个type的监听器
      payload: {
        checkStatus: 'done',
      },
    })
  }

  //机构查询条件搜索
  const mySearchInfo = (input, option) => {
    return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  }

  const modalOpts = {
    title: `${type === 'create' ? '新增工具实例' : '编辑工具实例'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

  const validateUrl = (rule, value, callback) => {
    let isIPaddress = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{2,5}$/

    if (!isIPaddress.test(value)) {
      callback('格式：11.11.11.11:80')
    } else {
      callback()
    }
  }
  const getlabelName = (item) => {
    const defaultValue = []
    item.forEach((option) => {
      defaultValue.push(option.uuid)
    })
    return defaultValue
  }

  const typeChange = (value) => {
    dispatch({
      type: 'tool/updateState',
      payload: {
        typeValue: value,
      },
    })
  }
  const selectlable = () => {
    element.blur()
    resetFields('lable')
    dispatch({
      type: 'labelGroup/queryGroup',
      payload: {},
    })
    dispatch({
      type: 'tool/updateState',
      payload: {
        labelVisible: true,
      },
    })
    dispatch({
      type: 'tool/lablequery',
      payload: {
        // q:"key!= 'ump_tool*'"
      },
    })
  }

  function genOptions(lableInfoVal) {
    let options = []
    lableInfoVal.forEach((option) => {
      let flag = false
      if (option.key == 'ump_tool') {
        flag = true
      }
      options.push(<Option key={option.uuid} value={option.uuid} select={true} >{option.name}</Option>)
    })
    return options
  }

  const options = genOptions(lableInfoVal)

  const handleChange = (value) => {
    let temp = lableInfoVal.filter(q => value.find((i => i == q.uuid)))
    let temp1 = lableInfoVal.filter(q => value.find((i => i != q.uuid)))
    // if(temp1[0].key == 'ump_tool'){
    //   // message.error('批量禁用失败!')
    //   dispatch({
    //     type: 'tool/updateState',
    //     payload: {
    //       lableInfoVal: lableInfoVal,
    //     },
    //   })
    // }else{
    dispatch({
      type: 'tool/updateState',
      payload: {
        lableInfoVal: temp,
      },
    })
    // }
  }

  const objSelect = (el) => {
    element = el
    dispatch({
      type: 'tool/updateState',
      payload: {
        element: element,
      },
    })
  }

  return (
    <Modal {...modalOpts} height="600px">
      <Form layout="horizontal">
        <FormItem label="实例名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="工具类型" hasFeedback {...formItemLayout}>
          {getFieldDecorator('toolType', {
            initialValue: item.toolType,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select disabled={type !== 'create'} onChange={typeChange}>
            <Select.Option value="ZABBIX">Zabbix</Select.Option>
            <Select.Option value="NANTIAN_ZABBIX">非网络域Zabbix</Select.Option>
            <Select.Option value="ITM">ITM</Select.Option>
            <Select.Option value="OVO">OVO</Select.Option>
            <Select.Option value="NAGIOS">Nagios</Select.Option>
            <Select.Option value="PROMETHEUS">Prometheus</Select.Option>
            <Select.Option value="SKYWALKING">SkyWalking</Select.Option>
            <Select.Option value="ZABBIX_PROXY">主机监控代理</Select.Option>
          </Select>)}
        </FormItem>
        {
          typeValue == 'PROMETHEUS' ?
            <div>
              <FormItem label="Prometheus" hasFeedback {...formItemLayout}>
                {getFieldDecorator('prometheusUrl', {
                  initialValue: item.prometheusUrl,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input placeholder="格式：192.168.0.1:80" />)}
              </FormItem>
              <FormItem label="标签" hasFeedback {...formItemLayout}>
                {getFieldDecorator('lable', {
                  initialValue: item.lable ? item.lable : getlabelName(lableInfoVal),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Select ref={objSelect} mode="tags" dropdownStyle={{ display: 'none' }} onFocus={selectlable} onChange={handleChange}>
                  {options}
                </Select>)}
              </FormItem>
            </div>
            :
            null
        }
        {
          typeValue == 'ZABBIX_PROXY' ? null :
            <FormItem label="URL" hasFeedback {...formItemLayout}>
              {getFieldDecorator('url', {
                initialValue: item.url,
                rules: [
                  {
                    required: true,
                  },
                  // {
                  // 	validator: validateUrl,
                  // },
                ],
              })(<Input placeholder="格式：192.168.0.1:80" />)}
            </FormItem>
        }
        {
          typeValue == 'PROMETHEUS' || typeValue == 'SKYWALKING' || typeValue == 'ZABBIX_PROXY' ? null :
            <div>
              <FormItem label="用户名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('username', {
                  initialValue: item.username,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('password', {
                  initialValue: item.password,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input.Password />)}
              </FormItem>
            </div>
        }
        {
          typeValue == 'ZABBIX_PROXY' ?
            <Fragment>
              <FormItem label="zabbix服务URL" hasFeedback {...formItemLayout}>
                {getFieldDecorator('url', {
                  initialValue: item.url,
                  rules: [
                    {
                      required: true,
                    },
                    {
                      validator: validateUrl,
                    },
                  ],
                })(<Input placeholder="格式：192.168.0.1:80" />)}
              </FormItem>
              <FormItem label="zabbix服务名称" hasFeedback {...formItemLayout}>
                {getFieldDecorator('serverName', {
                  initialValue: item.serverName,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="代理名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('proxyName', {
                  initialValue: item.proxyName,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="代理主机IP" hasFeedback {...formItemLayout}>
                {getFieldDecorator('proxyHostIP', {
                  initialValue: item.proxyHostIP,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              <FormItem label="代理ID" hasFeedback {...formItemLayout}>
                {getFieldDecorator('proxyId', {
                  initialValue: item.proxyId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Fragment>
            :
            null
        }
        <FormItem label="所属机构" hasFeedback {...formItemLayout}>
          {getFieldDecorator('branch', {
            initialValue: item.branch,
            rules: [
              {
                required: false,
              },
            ],
          })(<Select showSearch allowClear filterOption={mySearchInfo} placeholder="支持输入搜索">
            {fenhang.map(d => <Select.Option key={d.key}>{d.value}</Select.Option>)}
          </Select>)}
        </FormItem>
        {
          typeValue == 'PROMETHEUS' || typeValue == 'SKYWALKING' || typeValue == 'ZABBIX_PROXY' ?  // for SkyWalking
            null
            :
            <FormItem label="MO配对条件" hasFeedback {...formItemLayout}>
              {getFieldDecorator('moFilter', {
                initialValue: item.moFilter,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
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
  onOk: PropTypes.func,
}

export default Form.create()(modal)
