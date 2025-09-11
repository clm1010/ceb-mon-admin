import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import LineChart from './LineChart1.js';

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

  const modalOpts = {
    title: `XXX设备QPS曲线图`,
    visible: false,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  const chartData = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [820, 932, 901, 934, 1290, 1330, 1320]
  }

  return (
    <Modal {...modalOpts} height="600px" width="1000px">
      XXX 设备 QPS 曲线图
      <LineChart data={chartData} />
      所有设备QPS累加曲线图
      <LineChart data={chartData} />
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
