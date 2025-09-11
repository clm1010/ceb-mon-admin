import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Row, Col, InputNumber, Descriptions, List } from 'antd'
import fenhang from '../../utils/fenhang'

let Fenhangmaps = new Map()
fenhang.forEach((obj, index) => {
  Fenhangmaps.set(obj.key, obj.value)
})

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 6,
  },
}

const customPanelStyle1 = {
  background: '#e6f7ff',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  borderBottom: '1px solid #E9E9E9',
  padding: 12,
}

const customPanelStyle = {
  background: '#e6f7ff',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden',
  paddingLeft: 12,
  paddingRight: 12,
  padding: 12,
}

const nonCoreStyle1 = {
  background: '#fbfbfb',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  padding: 12,
}

const nonCoreStyle = {
  background: '#fbfbfb',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden',
  paddingLeft: 12,
  paddingRight: 12,
  padding: 12,
}

const unknownStyle1 = {
  background: '#E3FCD6',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  borderBottom: '1px solid #E9E9E9',
  padding: 12,
}

const unknownStyle = {
  background: '#E3FCD6',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden',
  paddingLeft: 12,
  paddingRight: 12,
  padding: 12,
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

const formButtonLayout = {
  labelCol: {
    span: 6,
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
      dispatch({
        type: `epp/${type}`,											//抛一个事件给监听这个type的监听器
        payload: data,
      })
      resetFields()
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'epp/hideModal',													//抛一个事件给监听这个type的监听器
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
    title: `编辑epp实例`, //`${type === 'create' ? '新增工具实例' : '编辑epp实例：xxxxxx'}`,
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

  const jsonObj = { name: "John", age: 31, city: "New York" }

  const genData = (record) => {
    let data = { basic: [], cur: [], setting: [] }
    if (Object.keys(record).length > 0) {
      for (let prop in record) {
        let isfound = false
        for (let field of ViewColumns) {
          if (prop === field.key && (field.core === true || field.core === 'true')) {
            isfound = true
            if (prop.toUpperCase().includes(fieldKeyword.toUpperCase()) || fieldKeyword === '') {
              data.core.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {record[prop]}</Col>)
            }
          } else if (prop === field.key && (field.core === false || field.core === 'false')) {
            isfound = true
            if (prop.toUpperCase().includes(fieldKeyword.toUpperCase()) || fieldKeyword === '') {
              data.nonCore.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {record[prop]}</Col>)
            }
          }
        }
        if (isfound === false) {
          data.unknown.push(<Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}><b style={{ textDecoration: 'underline' }}>{prop}</b> : {record[prop]}</Col>)
        } else {
          isfound = true
        }
      }
    }
    return data
  }

  let params = []
  if (item !== null && item !== undefined && item.defaultStartupParam) {
    params = item.defaultStartupParam.split("|+|")
  }
  
  console.log(params)
  // let children = genData(item)

  return (
    <Modal {...modalOpts} height="600px" width="1100px">
      <Form layout="horizontal">
        <Descriptions title="基础信息" bordered>
          <Descriptions.Item label="eppKey">{item.eppKey}</Descriptions.Item>
          <Descriptions.Item label="epp类型">{item.eppType}</Descriptions.Item>
          <Descriptions.Item label="分支机构">{Fenhangmaps.get(item.branch)}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(item.createdTime).format('yyyy-MM-dd hh:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="修改时间">{new Date(item.updatedTime).format('yyyy-MM-dd hh:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="当前的读取速率">{item.curReadRate}</Descriptions.Item>
          <Descriptions.Item label="实际的处理并发数">{item.curProcessParallel}</Descriptions.Item>
          <Descriptions.Item label="实际的持久化并发数">{item.curPersistentParallel}</Descriptions.Item>
        </Descriptions>
        <div style={{ margin: '12px 0' }} />

        <br />
        <Descriptions title="配置项"></Descriptions>
        <div>
          <Row>
            <Col style={{ marginBottom: 5 }} xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }}>
              <FormItem label="配置的读取速率" hasFeedback {...formItemLayout}>
                {getFieldDecorator('readRate', {
                  initialValue: item.readRate,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col style={{ marginBottom: 5 }} xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }}>
              <FormItem label="配置的处理并发数" hasFeedback {...formItemLayout}>
                {getFieldDecorator('processParallel', {
                  initialValue: item.processParallel,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col style={{ marginBottom: 5 }} xl={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }}>
              <FormItem label="配置的持久化并发数" hasFeedback {...formItemLayout}>
                {getFieldDecorator('persistentParallel', {
                  initialValue: item.persistentParallel,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('uuid', {
                  initialValue: item.uuid,
                })(<InputNumber />)}
              </FormItem>
            </Col>
          </Row>
        </div>
        <br />
        <Descriptions title="最近一分钟情况分析" bordered>
          <Descriptions.Item label="接收到的事件数">{item.receiveNum}</Descriptions.Item>
          <Descriptions.Item label="被规则丢弃的事件数">{item.policyMaskNum}</Descriptions.Item>    
          <Descriptions.Item label="被处理的事件数">{item.rulesProcessNum}</Descriptions.Item>    
          <Descriptions.Item label="被插入的事件数">{item.insertNum}</Descriptions.Item>    
          <Descriptions.Item label="被reinsert的事件数">{item.reinsertNum}</Descriptions.Item>    
          <Descriptions.Item label="被trigger丢弃的事件数">{item.triggerCancelNum}</Descriptions.Item>    
          <Descriptions.Item label="进入umdb失败的事件数">{item.failedNum}</Descriptions.Item>    
        </Descriptions>
        <br />
        <Descriptions title="启动配置详情">
        </Descriptions>
          <Row>
            <Col style={{ marginBottom: 5 }} xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <List
              size="small"
              bordered
              dataSource={params}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
            </Col>
          </Row>
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
