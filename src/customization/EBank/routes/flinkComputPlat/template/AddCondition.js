import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, Row, Col } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const formItemLayout2 = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
  dispatch,
  addconditonVisible,
  form,
  contionList,
  tempItem,
  tempCondition
}) => {
  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields
  } = form

  const [tempList, setTempList] = useState([{ index: 1, condition: '', leven: '' }])

  useEffect(item => {
    let aa = []
    tempCondition.forEach((e, index) => {
      aa.push({
        index: index, condition: e.condition.id, leven: e.severityLevel
      })
    })
    if(tempCondition.length == 0){
      setTempList([{ index: 1, condition: '', leven: '' }])
    }else{
      setTempList(aa)
    }

  }, [tempCondition])

  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
      payload: {
        addconditonVisible: false,
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

    let relations = []
    tempList.forEach((item) => {
      let conditionId = data[`condition${item.index}`]
      let severityLevel = data[`leven${item.index}`]
      relations.push({ conditionId: conditionId, severityLevel: severityLevel })
    })

    resetFields()
    dispatch({
      type: "flinkComputPlat/setState",
      payload: {
        addconditonVisible: false
      }
    })
    dispatch({
      type: "flinkComputPlat/addCondiTiontoTemp",
      payload: {
        id: tempItem.id,
        relations
      }
    })
  }

  const jianhao = (index) => {
    const tempListNew = tempList.filter(temp => temp.index !== index)
    setTempList([...tempListNew])
  }
  const jiahao = () => {
    let temp = tempList[tempList.length - 1]
    let index = temp.index
    index++
    tempList.push({ index, condition: '', leven: '' })
    setTempList([...tempList])
  }
  const modalOpts = {
    title: `添加公式`,
    visible: addconditonVisible,
    onCancel,
    onOk,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    destroyOnClose: true
  }

  return (
    <Modal {...modalOpts}
      width="600px"
      footer={[
        <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
      key="routerModal"
    >
      <Form layout="horizontal" preserve={false}>
        {tempList.map(templet =>
        (<Row key={`row_${templet.index}`}>
          <Col span={10} key={`col_${templet.index}_0`}>
            <FormItem label="公式" hasFeedback {...formItemLayout2} key={`condition_${templet.index}`}>
              {getFieldDecorator(`condition${templet.index}`, {
                initialValue: templet.condition,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select disabled={tempCondition.length > 0} >
                {
                  contionList.map(item => {
                    return <Select.Option value={item.id} item={item}>{item.name} </Select.Option>
                  })
                }
              </Select>)}
            </FormItem>
          </Col>
          <Col span={9} key={`col_${templet.index}_1`}>
            <FormItem label="级别" hasFeedback {...formItemLayout2} key={`leven_${templet.index}`}>
              {getFieldDecorator(`leven${templet.index}`, {
                initialValue: templet.leven,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select disabled={tempCondition.length > 0}>
                <Option value="CRITICAL">一级告警</Option>
                <Option value="MINOR">二级告警</Option>
                <Option value="WARNING">三级告警</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col span={4} key={`col_${templet.index}_2`}>
            <Button disabled={tempList.length === 1 || tempCondition.length > 0} onClick={jianhao.bind(this, templet.index)} style={{ float: 'right' }} >-</Button>
            <Button onClick={jiahao} style={{ marginRight: 5, float: 'right' }} disabled={tempCondition.length > 0}>+</Button>
          </Col>
        </Row>))}
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
