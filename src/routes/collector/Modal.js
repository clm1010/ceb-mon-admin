import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Divider, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const formItemLayout1 = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
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
}) => {
  let statusinfo = {}
  if (item.servicetype === 'zabbix' || item.servicetype === 'zabbixNT') {
    statusinfo = item.statusinfo ? JSON.parse(item.statusinfo) : { zs: {} }
  }

  if (item.servicetype === 'syslog') {
    statusinfo = item.statusinfo ? JSON.parse(item.statusinfo) : {}
  }
  const onOk = () => {
    //弹出窗口点击确定按钮触发的函数
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        ...getFieldsValue(),
      }

      if (item.servicetype == "zabbix") {
        item.statusinfo = { zs: { ...data }, time:  moment(data.strTime).unix(), strTime: moment(data.strTime).format("YYYY-MM-DD hh:mm:ss") }
        item.statusinfo.zs
        delete item.statusinfo.zs.time
        delete item.statusinfo.zs.strTime
      } else if (item.servicetype == "syslog") {
        item.statusinfo = { ...data }
        item.statusinfo.nowTime = new Date().getTime()
      }
      item.statusinfo = JSON.stringify(item.statusinfo)
      dispatch({
        type: `collector/update`,											//抛一个事件给监听这个type的监听器
        payload: {
          ...item
        },
      })
      resetFields()
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'collector/setState',													//抛一个事件给监听这个type的监听器
      payload: {
        modalVisible: false,
      },
    })
  }


  const modalOpts = {
    title: `${item.servicetype === 'zabbix' ? 'zabbix' : 'syslog'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    width: 850
  }

  return (
    <Modal {...modalOpts} height="700px">
      <Form layout="horizontal">
        {
          item.servicetype === 'zabbix' ||  item.servicetype === 'zabbixNT'?
            <Fragment>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="active" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('active', {
                    initialValue: statusinfo.zs.active,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="cinterval" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('cinterval', {
                    initialValue: statusinfo.zs.cinterval,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="hinterval" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('hinterval', {
                    initialValue: statusinfo.zs.hinterval,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="hintervalsec" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('hintervalsec', {
                    initialValue: statusinfo.zs.hintervalsec,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="zabbix主机" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('host', {
                    initialValue: statusinfo.zs.host,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="告警采集间隔" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('interval', {
                    initialValue: statusinfo.zs.interval,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="最大报警数量" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('maxNotSavedAlarms', {
                    initialValue: statusinfo.zs.maxNotSavedAlarms,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="密码" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('password', {
                    initialValue: statusinfo.zs.password,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="端口" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('port', {
                    initialValue: statusinfo.zs.port,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="最长有效时间" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('rinterval', {
                    initialValue: statusinfo.zs.rinterval,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="statusActive" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('statusActive', {
                    initialValue: statusinfo.zs.statusActive,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="url" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('url', {
                    initialValue: statusinfo.zs.url,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                <FormItem label="user" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('user', {
                    initialValue: statusinfo.zs.user,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '33%', float: 'left' }}>
                  <FormItem label="最后读取时间" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('strTime', {
                      initialValue: statusinfo.zs.starTime,
                    })(<Input disabled/>)}
                  </FormItem>
                </span>
              <Divider orientation="left"><span style={{ color: "#eb2f96" }}></span></Divider>
              <div>
                <span style={{ width: '50%', float: 'left' }}>
                  <FormItem label="最后读取时间" hasFeedback {...formItemLayout} >
                    {getFieldDecorator('strTime', {
                      initialValue: moment(statusinfo.strTime),
                    })(
                      <DatePicker
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                  </FormItem>
                </span>
                <span style={{ width: '50%', float: 'left' }}>
                  <FormItem label="最后读取时间戳" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('time', {
                      initialValue: statusinfo.time,
                    })(<Input disabled/>)}
                  </FormItem>
                </span>
              </div>
            </Fragment>
            :
            <Fragment>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="最后读取时间" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('lastBakFileStrTime', {
                    initialValue: statusinfo.lastBakFileStrTime,
                  })(<Input disabled/>)}
                </FormItem>
              </span>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="最后读取时间戳" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('lastBakFileTime', {
                    initialValue: statusinfo.lastBakFileTime,
                  })(<Input disabled/>)}
                </FormItem>
              </span>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="syslog采集文件" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('mainFile', {
                    initialValue: statusinfo.mainFile,
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="采集偏移量" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('mainFilePos', {
                    initialValue: statusinfo.mainFilePos,
                  })(<Input />)}
                </FormItem>
              </span>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="当前时间" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('nowTime', {
                    initialValue: new Date(statusinfo.nowTime).format('yyyy-MM-dd hh:mm:ss'),
                  })(<Input disabled />)}
                </FormItem>
              </span>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="激活状态" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('statusActive', {
                    initialValue: statusinfo.statusActive,
                  })(<Input disabled/>)}
                </FormItem>
              </span>
            </Fragment>
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
