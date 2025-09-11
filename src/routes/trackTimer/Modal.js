import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Icon, Row, Col, Radio, Tabs, Button, DatePicker, InputNumber } from 'antd'
import moment from 'moment'
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const { TextArea } = Input

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
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
}
const formItemLayout2 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 8,
  },
}
const formItemLayout3 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 6,
  },
}
const formItemLayout4 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
}
const formItemLayout5 = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}
const ColProps = {
  style: {
    marginBottom: 8,
    textAlign: 'right',
  },
}
const Colpost = {
  style: {
    marginLeft: 30,
    marginBottom: 8,
    textAlign: 'right',
  },
}
const colstyle = {
  marginTop: 6,
  fontSize: 14,
  textAlign: 'right',
}
const FormItemProps = {
  style: {
    margin: 0,
  },
}
const modal = ({
  dispatch,
  visible,
  type,
  filter,
  timertype,
  typeValue,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
  let firstobj = { interval: '', action: '', value: '', name: '', voice: '' }
  let {
    filterItems = [{ ...firstobj }],
    filterIndex = [0],
  } = filter
  if (filterItems && filterItems.length === 0) {
    filterItems = [{ ...firstobj }]
  }
  if (filterIndex && filterIndex.length === 0) {
    filterIndex = [0]
  }
  if (filterIndex.length != filterItems.length) {
    let indexs = []
    if (filterItems.length > 1) {
      filterItems.forEach((item, index) => {
        indexs.push(index)
      })
    } else {
      indexs = [0]
    }
    filterIndex = indexs
  }
  const getColumsVal = (val) => {
    if (typeof (val) === 'object') {
      return Date.parse(val)
    }
    return val
  }
  const onOk = () => {
    //弹出窗口点击确定按钮触发的函数
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      let fields = []
      let filterIndex = [0]
      if (filter && filter.filterIndex && filter.filterIndex.length > 0) {
        filterIndex = filter.filterIndex
      }
      if (filter && filter.filterItems && filter.filterItems.length > 0 && filter.filterItems.length != filterIndex.length) {
        let indexs = []
        filter.filterItems.forEach((item, index) => {
          indexs.push(index)
        })
        filterIndex = indexs
      }
      filterIndex.forEach((num) => {
        fields.push(`interval_${num}`)
        fields.push(`action_${num}`)
        fields.push(`name_${num}`)
        fields.push(`voice_${num}`)
      })
      const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值

      let arrs = []
      filterIndex.forEach((num, index) => {
        let bean = {}
        bean.action = valObj[`action_${num}`]
        bean.interval = valObj[`interval_${num}`]
        bean.name = valObj[`name_${num}`]
        bean.voice = valObj[`voice_${num}`]
        arrs.push(bean)
      })
      const payload = {
        name: data.name,
        description: data.description,
        condition: data.condition,
        enabled: (data.enabled == 1),
        typ: data.typ,
        cycleMechanism: data.cycleMechanism,
        actions: arrs,
        beginTime: data.cycleMechanism == 'CUSTOM' ? getColumsVal(data.date) : 0,
      }
      resetFields()
      dispatch({
        type: `trackTimer/${type}`,											//抛一个事件给监听这个type的监听器
        payload,
      })
      dispatch({
        type: 'trackTimer/setState',											//抛一个事件给监听这个type的监听器
        payload: {
          modalVisible: false,
          timeFileinfo: {},
          timertype: '',
        },
      })
    })
  }

  const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'trackTimer/showModal',													//抛一个事件给监听这个type的监听器
      payload: {
        modalVisible: false,
        timeFileinfo: {},
        timertype: '',
      },
    })
  }

  const add = (index) => {
    let maxValue = 0
    for (let val of filterIndex) {
      maxValue = (maxValue < val ? val : maxValue)
    }
    //if(filterIndex.length > 0 && filterIndex.length < 11){ //把已经选择的值都保存一下。
    filterItems = allColumsVals()
    //}
    let indexList = [...filterIndex]
    indexList.splice(index + 1, 0, maxValue + 1) //插入下标的值

    let arrs = [...filterItems]
    arrs.splice(index + 1, 0, firstobj) //在指定的下标下面，插入一个数组元素
    /*
      测试用
    */
    let newIndexList = []
    //if(filterIndex.length > 0 && filterIndex.length < 11){
    indexList.forEach((val, index) => {
      newIndexList.push(maxValue + 2 + index)
    })
    //}
    filter.filterItems = arrs
    filter.filterIndex = newIndexList
    /*
      修改过滤条件的集合
        */
    dispatch({
      type: 'trackTimer/setState',
      payload: {
        timeFileinfo: filter,
      },
    })
  }

  const remove = (myindex) => {
    let indexList = filterIndex.filter((val, index) => index != myindex)
    let arrs = filterItems.filter((item, index) => index != myindex)
    filter.filterItems = arrs
    filter.filterIndex = indexList
    /*

       修改过滤条件的集合
   */
    dispatch({
      type: 'trackTimer/setState',
      payload: {
        timeFileinfo: filter,
      },
    })
  }

  const typeChange = (value) => {
    dispatch({
      type: 'trackTimer/setState',
      payload: {
        typeValue: value,
      },
    })
  }
  const onChangeColums = (val, index) => {
    let maxValue = 0
    for (let val of filterIndex) {
      maxValue = (maxValue < val ? val : maxValue)
    }
    let myfilterItems = allColumsVals()
    myfilterItems[index].action = val
    let indexList = [...filterIndex]
    let newIndexList = []
    indexList.forEach((val, index) => {
      newIndexList.push(maxValue + 1 + index)
    })
    filter.filterItems = myfilterItems
    filter.filterIndex = newIndexList
    dispatch({
      type: 'trackTimer/setState',
      payload: {
        timeFileinfo: filter,
      },
    })
  }

  const onChangetimer = (e) => {
    let val = e.target.value
    let arrs = allColumsVals()
    let maxValue = 0
    for (let val of filterIndex) {
      maxValue = (maxValue < val ? val : maxValue)
    }
    let arrIndex = []
    let arrItem = []
    if (val === 'ORDINARY') {
      filter.basicItems = arrs
      if (filter.advancedItems && filter.advancedItems.length > 0) {
        arrItem = filter.advancedItems
        filter.advancedItems.forEach((num, index) => {
          arrIndex.push(maxValue + 1 + index)
        })
      } else {
        arrIndex.push(maxValue + 1)
      }
    } else {
      filter.advancedItems = arrs
      if (filter.basicItems && filter.basicItems.length > 0) {
        arrItem = filter.basicItems
        filter.basicItems.forEach((num, index) => {
          arrIndex.push(maxValue + 1 + index)
        })
      } else {
        arrIndex.push(maxValue + 1)
      }
    }
    filter.filterMode = val //模式

    filter.filterItems = arrItem //过滤条件
    filter.filterIndex = arrIndex //过滤条件下标的数组
    //    resetFields([])
    dispatch({
      type: 'trackTimer/setState',
      payload: {
        timertype: val,
        timeFileinfo: filter,
      },
    })
  }
  const loop = data => data.map((item, index) => {
    switch (timertype) {
      case 'ORDINARY':
        return (
          <Row gutter={8} key={`row_${filterIndex[index]}`} >
            <div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
              <Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                <FormItem {...FormItemProps} hasFeedback key={`interval_info_${filterIndex[index]}`}>
                  {
                    getFieldDecorator(`interval_${filterIndex[index]}`, {
                      initialValue: item.interval,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<InputNumber placeholder= '请输入时间' style={{ width: '100%', height: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </div>
            <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
              <FormItem {...FormItemProps} hasFeedback key={`name_info_${filterIndex[index]}`}>
                {
                  getFieldDecorator(`name_${filterIndex[index]}`, {
                    initialValue: item.name,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input placeholder= '请输入名称'/>)
                }
              </FormItem>
            </Col>
            <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
              <FormItem {...FormItemProps} hasFeedback key={`action_info_${filterIndex[index]}`}>
                {
                  getFieldDecorator(`action_${filterIndex[index]}`, {
                    initialValue: item.action,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input placeholder= '请输入动作' />)
                }
              </FormItem>
            </Col>
            <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
              <FormItem {...FormItemProps} hasFeedback key={`voice_info_${filterIndex[index]}`}>
                {
                  getFieldDecorator(`voice_${filterIndex[index]}`, {
                    initialValue: item.voice ? item.voice : 'default',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Select>
                    <Option value="default">默认</Option>
                    <Option value="five">声音5分钟</Option>
                    <Option value="ten">声音10分钟</Option>
                    <Option value="fifteen">声音15分钟</Option>
                    <Option value="twenty-five">声音25分钟</Option>
                    <Option value="thirty">声音30分钟</Option>
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col key={`col_${filterIndex[index]}_5`} style={{ textAlign: 'right' }} {...ColProps} xl={3} md={3} >
              <Button.Group style={{ width: '100%' }}>
                <Button type="default" icon="minus" onClick={() => remove(index)} disabled={data.length === 1} />
                <Button type="default" icon="plus" onClick={() => add(index)} />
              </Button.Group>
            </Col>
          </Row>
        )
      case 'TIMELIMIT':
        return (
          <Row gutter={8} key={`row_${filterIndex[index]}`} >
            <div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
              <Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                <FormItem {...FormItemProps} hasFeedback key={`interval_info_${filterIndex[index]}`}>
                  {
                    getFieldDecorator(`interval_${filterIndex[index]}`, {
                      initialValue: item.interval,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<InputNumber placeholder= '请输入时间' style={{ width: '100%', height: '100%' }} />)
                  }
                </FormItem>
              </Col>
            </div>
            <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
              <FormItem {...FormItemProps} hasFeedback key={`name_info_${filterIndex[index]}`}>
                {
                  getFieldDecorator(`name_${filterIndex[index]}`, {
                    initialValue: item.name,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input placeholder= '请输入名称' />)
                }
              </FormItem>
            </Col>
            <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
              <FormItem {...FormItemProps} hasFeedback key={`action_info_${filterIndex[index]}`}>
                {
                  getFieldDecorator(`action_${filterIndex[index]}`, {
                    initialValue: item.action,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input placeholder= '请输入动作' />)
                }
              </FormItem>
            </Col>
            <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
              <FormItem {...FormItemProps} hasFeedback key={`voice_info_${filterIndex[index]}`}>
                {
                  getFieldDecorator(`voice_${filterIndex[index]}`, {
                    initialValue: item.voice ? item.voice : 'default',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Select  >
                    <Option value="default">默认</Option>
                    <Option value="default1">声音1</Option>
                    <Option value="default2">声音2</Option>
                    <Option value="default3">声音3</Option>
                    <Option value="default4">声音4</Option>
                  </Select>)
                }
              </FormItem>
            </Col>
            <Col key={`col_${filterIndex[index]}_5`} style={{ textAlign: 'right' }} {...ColProps} xl={3} md={3} >
              <Button.Group style={{ width: '100%' }}>
                <Button type="default" icon="minus" onClick={() => remove(index)} disabled={data.length === 1} />
                <Button type="default" icon="plus" onClick={() => add(index)} />
              </Button.Group>
            </Col>
          </Row>
        )
    }
  })
  const allColumsVals = () => {
    let fields = []
    filterIndex.forEach((num) => {
      fields.push(`interval_${num}`)
      fields.push(`action_${num}`)
      fields.push(`name_${num}`)
      fields.push(`voice_${num}`)
      fields.push(`value_${num}`)
    })

    const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值

    let arrs = []
    filterIndex.forEach((num) => {
      let bean = {}
      bean.interval = valObj[`interval_${num}`]
      bean.action = valObj[`action_${num}`]
      bean.name = valObj[`name_${num}`]
      bean.voice = valObj[`voice_${num}`]
      bean.value = valObj[`value_${num}`]
      arrs.push(bean)
    })
    return arrs
  }
  const myConditionItem = loop(filterItems)
  const modalOpts = {
    title: `${type === 'create' ? '新增定时器' : '编辑定时器'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

  return (
    <Modal {...modalOpts} width="850px">
      <Form layout="horizontal">
        <FormItem label="定时器名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="是否启用" hasFeedback {...formItemLayout3}>
          {getFieldDecorator('enabled', {
            initialValue: (item.enabled) ? 1 : 2,
            rules: [
              {
                required: true,
              },
            ],
          })(<RadioGroup>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </RadioGroup>)}
        </FormItem>
        <Tabs defaultActiveKey="templet_1" style={{ marginBottom: 10 }}>
          <TabPane tab={<span><Icon type="hourglass" />待跟踪告警定义</span>} key="templet_1">
            <FormItem label="内容" hasFeedback {...formItemLayout1}>
              {getFieldDecorator('condition', {
                initialValue: item.condition,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<TextArea rows={3} />)}
            </FormItem>
          </TabPane>
        </Tabs>
        <FormItem label="定时器类型" hasFeedback {...formItemLayout2}>
          {getFieldDecorator('typ', {
            initialValue: item.typ,
            rules: [
              {
                required: true,
              },
            ],
          })(<RadioGroup onChange={onChangetimer} >
            <Radio value="ORDINARY">普通</Radio>
            <Radio value="TIMELIMIT">限期</Radio>
          </RadioGroup>)}
        </FormItem>
        {
          ((timertype == 'TIMELIMIT')) ?
            <div>
              <Tabs>
                <TabPane tab={<span><Icon type="setting" />告警跟踪循环机制定义</span>} key="dingyi">
                  <Row>
                    <Col key="cycb" xl={{ span: 7 }} md={{ span: 7 }}>
                      <div style={colstyle}>限期时间到达之前：</div>
                    </Col>
                    <Col xl={{ span: 16 }} md={{ span: 16 }}> {myConditionItem}</Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
            :
            null
        }{
          ((timertype == 'ORDINARY')) ?
            <div>
              <Tabs>
                <TabPane tab={<span><Icon type="setting" />告警跟踪循环机制定义</span>} key="dingyi">
                  <Row>
                    <Col key="soso" xl={{ span: 12 }} md={{ span: 12 }}>
                      <div style={{ position: 'relative' }} id="area1" />
                      <FormItem label="开始时间" hasFeedback {...formItemLayout4}>
                        {getFieldDecorator('cycleMechanism', {
                          initialValue: item.cycleMechanism,
                        })(<Select
                          onChange={typeChange}
                          getPopupContainer={() => document.getElementById('area1')}
                        >
                          <Select.Option value="FIRSTOCCURRENCE">首次发生时间</Select.Option>
                          <Select.Option value="OUTMAINTAIN">出维护期时间</Select.Option>
                          <Select.Option value="CUSTOM">自定义时间</Select.Option>
                        </Select>)}
                      </FormItem>
                    </Col>
                    {
                      (typeValue == 'CUSTOM') ?
                        <Col xl={{ span: 10 }} md={{ span: 10 }}>
                          <FormItem label="" key="date" hasFeedback {...formItemLayout1}>
                            {getFieldDecorator('date', {
                              initialValue: (item.beginTime && item.beginTime !== '') ? moment(moment(Number.parseInt(item.beginTime)).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : item.beginTime,
                            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                          </FormItem>
                        </Col>
                        :
                        null
                    }
                  </Row>
                  <Row>
                    <Col key="nsss" xl={{ span: 6 }} md={{ span: 6 }}>
                      <div style={colstyle}>重复时间点：</div>
                    </Col>
                    <Col xl={{ span: 17 }} md={{ span: 17 }}> {myConditionItem}</Col>
                  </Row>
                </TabPane>
              </Tabs>
            </div>
            :
            null
        }
        {
          (type !== 'create') ?
            <Row gutter={24} style={{ marginTop: 8 }}>
              <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
                <FormItem label="创建人" {...formItemLayout5} >
                  {getFieldDecorator('Creater', {
                    initialValue: item.createdBy,
                  })(<Input style={{ width: 150 }} disabled />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }}>
                <FormItem label="创建时间" {...formItemLayout5}>
                  {getFieldDecorator('CreaterTime', {
                    initialValue: item.createdTime1,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>

            : null
        }

        {
          (type !== 'create') ?
            <Row gutter={24}>
              <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
                <FormItem label="最后更新人" {...formItemLayout5}>
                  {getFieldDecorator('LastCreater', {
                    initialValue: item.updatedBy,
                  })(<Input style={{ width: 150 }} disabled />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }}>
                <FormItem label="最后更新时间" {...formItemLayout5}>
                  {getFieldDecorator('LastCreaterTime', {
                    initialValue: item.updatedTime1,
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
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
