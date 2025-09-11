import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select } from 'antd'
import _ from 'lodash'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}


const modal = ({
	dispatch,
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  currentItem = {},
  searchDict,
}) => {
  const onOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      if (!data.value) {
        let _data = _.clone(data)
        delete _data.description
        delete _data.name
        delete _data.key
        delete _data.status
        data.value = JSON.stringify(_data)
      }

      const payload = {
        name: data.name,
        description: data.description,
        key: data.key,
        value: data.value,
        sortOrder: Date.parse(new Date()) / 1000,
        status: data.status,
        dictId: searchDict.uuid || '',
      }
      resetFields()
      dispatch({
        type: `dataDictItem/${modalType}`,											// 抛一个事件给监听这个type的监听器
        payload,
      })
    })
  }

  const onCancel = () => {
    resetFields()
    dispatch({
      type: 'dataDictItem/setState',
      payload: {
        modalType: 'create',
        // currentItem: {},
        modalVisible: false,
      },
    })
  }

  // 根据如果字典描述字段没有特殊要求，则默认显示value框。否则展示描述字段的表单项
  const genFormItem = () => {
    let items = [] // 特殊字典，特殊处理
    if (searchDict.metaData && searchDict.metaData.length > 0) {
      const cols = eval(searchDict.metaData)
      let val = {}
      if (currentItem.value) {
        val = JSON.parse(currentItem.value)
      }
      for (let item of cols) {
        let formItemVal = ''
        formItemVal = val[item.dataIndex]

        if (item.option) { // 有option属性，展示Select
          let options = []
          item.option.forEach((element) => {
            options.push(<Select.Option value={element.value}>{element.name}</Select.Option>)
          })
          items.push(<FormItem label={item.title} hasFeedback {...formItemLayout}>
            {getFieldDecorator(item.dataIndex, {
                initialValue: modalType === 'create' ? '' : formItemVal,
              })(<Select>{options}</Select>)}
                     </FormItem>)
        } else { // 无option属性，展示文本框
          items.push(<FormItem label={item.title} hasFeedback {...formItemLayout}>
            {getFieldDecorator(item.dataIndex, {
                initialValue: modalType === 'create' ? '' : formItemVal,
              })(<Input />)}
                     </FormItem>)
        }
      }
    } else { // 普通字典，常规处理
      items.push(<FormItem label="字典项内容" hasFeedback {...formItemLayout}>
        {getFieldDecorator('value', {
            initialValue: modalType === 'create' ? '' : currentItem.value,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input.TextArea />)}
                 </FormItem>)
    }
    return items
  }

  const modalOpts = {
    title: `${modalType === 'create' ? '新增数据字典内容项' : '编辑数据字典内容项'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="字典项名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: modalType === 'create' ? '' : currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="字典项键值" hasFeedback {...formItemLayout}>
          {getFieldDecorator('key', {
            initialValue: modalType === 'create' ? '' : currentItem.key,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="字典项描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: modalType === 'create' ? '' : currentItem.description,
          })(<Input />)}
        </FormItem>
        <FormItem label="字典项状态" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: modalType === 'create' ? '' : currentItem.status,
          })(<Select style={{ width: 120 }}>
            <Select.Option value={0}>激活</Select.Option>
            <Select.Option value={1}>禁用</Select.Option>
          </Select>)}
        </FormItem>
        {genFormItem()}
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
  currentItem: PropTypes.object,
  modalType: PropTypes.string,
  dispatch: PropTypes.func,
  searchDict: PropTypes.object,
}

export default Form.create()(modal)
