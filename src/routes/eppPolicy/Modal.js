import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Row, Col, InputNumber, DatePicker, Button, Table, Icon, Tooltip, Tag, Spin, Transfer, Divider, message } from 'antd'
import moment from 'moment'
import debounce from 'throttle-debounce/debounce'
import mystyle from './DataModal.less'
import fenhang from '../../utils/fenhang'

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}

const formItemLayout1 = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}

const formItemLayout5 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
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
  borderBottom: '1px solid #E9E9E9',
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
    span: 18,
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
  element,
  paginationEpp,
  listEpp,
  eppKeyFlag,
  eppKey,
  targetKeys,
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
        ...getFieldsValue()
      }

      if (data.startTime !== null && data.endTime !== null) {
        const startTs = data.startTime.valueOf()
        const endTs = data.endTime.valueOf()
        if (endTs <= startTs) {
          message.error('结束时间不能早于开始时间。')
          return
        }
      }

      if (type === 'create') {
        if (targetKeys.length === 0) {
          message.error('请选择绑定的EPP实例')
          return
        }
        dispatch({
          type: `eppPolicy/updateState`,
          payload: {
            resultVisible: true,
            formObj: data,
            modalVisible: false,
          }
        })
        resetFields()
      } else {
        dispatch({
          type: `eppPolicy/${type}`,											//抛一个事件给监听这个type的监听器
          payload: data,
        })
        resetFields()
      }
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'eppPolicy/hideModal',													//抛一个事件给监听这个type的监听器
      payload: {
        modalVisible: false,
        typeValue: '',
        lableInfoVal: [],
        listEpp: [],

      },
    })
  }

  const modalOpts = {
    title: `${type === 'create' ? '新增epp策略实例' : '编辑epp策略实例'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }


  const searchEpp = (page) => {
    const data = {
      ...getFieldsValue(),
    }
    let q = ''
    let eppKey = data.eppKey
    let branch = data.branch
    let validate = true
    if (validate) {
      if (eppKey && eppKey !== '') {
        q = `eppKey=='*${eppKey}*'`
      }
      if (branch && branch !== '') {
        q = q.length > 0 ? `${q};branch=='*${branch}*'` : `branch=='*${branch}*'`
      }

      dispatch({
        type: `eppPolicy/updateState`,
        payload: {
          eppKey: eppKey,
          branch: branch,
        },
      })
      dispatch({
        type: `eppPolicy/queryEpp`,
        payload: {
          q,
          ...(page.current && { page: page.current - 1 }),
          ...(page.pageSize && { pageSize: page.pageSize }),
        },
      })
    }
  }

  const getEpp = (value) => {
    if (value != '') {
      const q = `eppKey=='*${value}*'`
      dispatch({
        type: `eppPolicy/queryEpp`,
        payload: {
          q,
        },
      })
    }
  }

  const onEppChange = (value) => {
    // 选中当前应用
    dispatch({
      type: `eppPolicy/updateState`,
      payload: {
        eppKey: value,
        listEpp: [],
      },
    })
  }

  const columns = [
    {
      title: 'epp_key',
      dataIndex: 'eppKey',
      key: 'eppKey',
      width: 60,
      render: (text, record) => {
        return (
          <div>{text}</div>
        )
      },
    }, {
      title: '机构',
      dataIndex: 'branch',
      key: 'branch',
      width: 70,
      render: (text, record) => {
        return (
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        )
      },
    },
  ]

  const columns2 = [
    {
      title: 'epp_key',
      dataIndex: 'eppKey',
      key: 'eppKey',
      width: 60,
      render: (text, record) => {
        return (
          <div>{text}</div>
        )
      },
    }, {
      title: '机构',
      dataIndex: 'branch',
      key: 'branch',
      width: 70,
      render: (text, record) => {
        return (
          <Tooltip title={text} placement="topLeft">
            {text}
          </Tooltip>
        )
      },
    },
  ]

  function genOptions(listEpp) {
    let eppOptions = []
    listEpp.forEach((option) => {
      eppOptions.push(<Option key={option.eppKey} value={option.eppKey} select={true} >{option.eppKey}</Option>)
    })
    return eppOptions
  }

  const eppOptions = genOptions(listEpp)

  const handleChange = (value) => {
    let temp = lableInfoVal.filter(q => value.find((i => i == q.uuid)))
    let temp1 = lableInfoVal.filter(q => value.find((i => i != q.uuid)))
    dispatch({
      type: 'eppPolicy/updateState',
      payload: {
        lableInfoVal: temp,
      },
    })
  }

  const objSelect = (el) => {
    element = el
    dispatch({
      type: 'eppPolicy/updateState',
      payload: {
        element: element,
      },
    })
  }

  const transferChange = (targetKeys) => {
    dispatch({
      type: `eppPolicy/updateState`,
      payload: {
        targetKeys: targetKeys,
      },
    })
  }

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

  return (
    <Modal {...modalOpts} height="600px" width="1100px">

      <Form layout="horizontal">
        <Divider orientation="left">基础信息配置</Divider>
        <div style={{ margin: '12px 0' }} />
        <Row>
          <Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="策略名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('policyName', {
                initialValue: item.policyName,
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="策略类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('policyType', {
                initialValue: item.policyType,
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  },
                ],
              })(<Select>
                <Select.Option value={1}>字符串</Select.Option>
                <Select.Option value={2}>正则表达式</Select.Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="策略表达式" hasFeedback {...formItemLayout}>
              {getFieldDecorator('policyExpression', {
                initialValue: item.policyExpression,
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('uuid', {
                initialValue: item.uuid,
              })(<Input />)}
            </FormItem>
            <FormItem label="是否过期" hasFeedback {...formItemLayout}>
              {getFieldDecorator('active', {
                initialValue: item.active,
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  },
                ],
              })(<Select>
                <Select.Option value={1}>有效</Select.Option>
                <Select.Option value={2}>过期</Select.Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="开始时间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('startTime', {
                initialValue: item.startTime ? moment.unix(item.startTime) : null,
                rules: [],
              })(
                <DatePicker
                  placeholder="不填则立刻生效"
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: 5 }} xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="结束时间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('endTime', {
                initialValue: item.endTime ? moment.unix(item.endTime) : null,
                rules: [],
              })(
                <DatePicker
                  placeholder="不填则永久生效"
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: 5 }} xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <FormItem label="策略描述" hasFeedback {...formItemLayout1}>
              {getFieldDecorator('descr', {
                initialValue: item.descr,
                rules: [
                  {
                    required: true,
                    message: '必填项'
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          {(type !== 'create') ?
            <Col style={{ marginBottom: 5 }} xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <FormItem label="关联的EPP" hasFeedback {...formItemLayout1}>
                {getFieldDecorator('eppKey', {
                  initialValue: item.eppKey,
                  rules: [
                    {
                      required: true,
                      message: '必填项'
                    },
                  ],
                })(
                  <Select
                    showSearch
                    showArrow={false}
                    placeholder="查询并选择epp实例"
                    allowClear={true}
                    value={item.eppKey}
                    notFoundContent={eppKeyFlag === false ? <Spin size="small" /> : null}
                    onSearch={debounce(800, getEpp)}
                    onChange={onEppChange}
                  >
                    {eppOptions}
                  </Select>
                )}
              </FormItem>
            </Col> : null}
        </Row>

        {((type === 'create')) ?
          <div style={{ margin: '12px 0' }}>
            <Divider orientation="left">选择绑定的EPP实例</Divider>
            <Row >
              <Col span={6}>
                <FormItem label="epp_key" hasFeedback {...formItemLayout5}>
                  {getFieldDecorator('eppKey', {
                    initialValue: '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="机构" hasFeedback {...formItemLayout5}>
                  {getFieldDecorator('branch', {
                    initialValue: '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <Button style={{ marginLeft: 10 }}
                  onClick={searchEpp}
                  size="large" icon="search" />
              </Col>
            </Row >
            <Row>
              <Transfer
                dataSource={listEpp}
                // showSearch
                listStyle={{
                  width: 400,
                  height: 350,
                }}
                rowKey={record => record.eppKey}
                // operations={['to right', 'to left']}
                targetKeys={targetKeys}
                onChange={transferChange}
                // onSearch={transferSearch}
                render={item => `${item.eppKey} ${item.branch}`}
              // footer={this.renderFooter}
              />
            </Row>
          </div>
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
  onOk: PropTypes.func,
}

export default Form.create()(modal)
