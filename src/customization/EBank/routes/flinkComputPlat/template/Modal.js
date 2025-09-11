import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker } from 'antd'
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


const modal = ({
  dispatch,
  showTemplateVisible,
  item,
  form,
  DictList1,
  DictList2,
  DictList3,
}) => {

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields,
  } = form

  const [beforeInput, setBeforeInput] = useState('CEB_')
  const [array, setArray] = useState(['CEB_'])
  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
    resetFields()
    setBeforeInput('CEB_')
    dispatch({
      type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
      payload: {
        showTemplateVisible: false,
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
    resetFields()
    setBeforeInput('CEB_')
    dispatch({
      type: "flinkComputPlat/setState",
      payload: {
        showTemplateVisible: false
      }
    })
    data.name = beforeInput + data.name
    dispatch({
      type: "flinkComputPlat/addTemplate",
      payload: data
    })
  }

  const onChangeLarge = (value, e) => {
    dispatch({
      type: 'flinkComputPlat/getDictChild',
      payload: {
        id: value,
        page: 1,
        size: 1000,
        level: e.props.item.level
      }
    })
  }
  const onChangeMiddle = (value, e) => {
    const name = 'CEB_' + e.props.item.value + '_'
    setBeforeInput(name)
    dispatch({
      type: 'flinkComputPlat/getDictChild',
      payload: {
        id: value,
        page: 1,
        size: 1000,
        level: e.props.item.level,
        parentId: e.props.item.parentId
      }
    })
  }
  const onChangeSub = (value, e) => {
    let aa = beforeInput.split('_')
    aa[2] = e.props.children[0]
    let bb = aa.join('_')
    setBeforeInput(bb)
  }

  const modalOpts = {
    title: `策略模板维护`,
    visible: showTemplateVisible,
    onCancel,
    onOk,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    destroyOnClose: true
  }

  return (
    <Modal {...modalOpts}
      width={777}
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
      key="routerModal"
    >
      <Form layout="horizontal" preserve={false}>
        <FormItem label="策略模板名" key="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [],
          })(<Input addonBefore={beforeInput} />)}
        </FormItem>
        <FormItem label="策略模板说明" key="comment" hasFeedback {...formItemLayout}>
          {getFieldDecorator('comment', {
            initialValue: item.comment,
            rules: [],
          })(<Input />)}
        </FormItem>
        <FormItem label="策略大类" key="componentTypeId" hasFeedback {...formItemLayout}>
          {getFieldDecorator('componentTypeId', {
            initialValue: item.componentTypeId,
            rules: [],
          })(<Select onChange={onChangeLarge} >
            {
              DictList1.map(item => {
                return <Select.Option value={item.id} item={item}>{item.value} </Select.Option>
              })
            }
          </Select>)}
        </FormItem>

        <FormItem label="策略中类" key="componentId" hasFeedback {...formItemLayout}>
          {getFieldDecorator('componentId', {
            initialValue: item.componentId,
            rules: [],
          })(<Select onChange={onChangeMiddle}>
            {
              DictList2.map(item => {
                return <Select.Option value={item.id} item={item}>{item.value} </Select.Option>
              })
            }
          </Select>)}
        </FormItem>

        <FormItem label="策略小类" key="subComponentId" hasFeedback {...formItemLayout}>
          {getFieldDecorator('subComponentId', {
            initialValue: item.subComponentId,
          })(<Select onChange={onChangeSub}>
            {
              DictList3.map(item => {
                return <Select.Option value={item.id}>{item.value} </Select.Option>
              })
            }
          </Select>)}
        </FormItem>
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
