import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Alert, Tag } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
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
}) => {
  const onOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      let payload = {
        name: data.name,
        description: data.description,
        key: data.key,
        metaData: data.metaData,
        sortOrder: Date.parse(new Date()) / 1000,
        modalVisible: false,
      }
      resetFields()
      dispatch({
        type: `dataDict/${modalType}`,											// 抛一个事件给监听这个type的监听器
        payload,
      })
    })
  }

  const onCancel = () => {
    resetFields()
    dispatch({
      type: 'dataDict/setState',
      payload: {
        modalType: 'create',
        // currentItem: {},
        modalVisible: false,
      },
    })
  }

  const modalOpts = {
    title: `${modalType === 'create' ? '新增数据字典' : '编辑数据字典'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  const des = (
    <div>
      当字典有除了<Tag color="#2592fc">KEY</Tag>、<Tag color="#2592fc">NAME</Tag>之外的字段，使用<Tag color="#2592fc">字段元数据</Tag>增加。正常情况下，请保持为空。下方例子描述了给字典额外增加了类型列和是否核心字段列（列值限定于是、否）：
    </div>
   )

  return (
    <Modal {...modalOpts} width="600">
      <Alert message={des} type="info" showIcon /><br />
      <Input.TextArea value="[{title:'类型',dataIndex:'type',key:'type'},{title:'是否核心字段',dataIndex:'core',key:'core',option:[{value:'false',name:'否'},{value:'true',name:'是'}]}]" disabled readOnly />
      <Form layout="horizontal"><br />
        <FormItem label="字典名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: modalType === 'create' ? '' : currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="字典键值" hasFeedback {...formItemLayout}>
          {getFieldDecorator('key', {
            initialValue: modalType === 'create' ? '' : currentItem.key,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="字典描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: modalType === 'create' ? '' : currentItem.description,
          })(<Input />)}
        </FormItem>
        <FormItem label="字段元数据" hasFeedback {...formItemLayout}>
          {getFieldDecorator('metaData', {
            initialValue: modalType === 'create' ? '' : currentItem.metaData,
          })(<Input.TextArea rows={10} placeholder="如果不是特殊定制型的数据字典，此文本框请务必保持为空。" />)}
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
  onOk: PropTypes.func,
  currentItem: PropTypes.object,
}

export default Form.create()(modal)
