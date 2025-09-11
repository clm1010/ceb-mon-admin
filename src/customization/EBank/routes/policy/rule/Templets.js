import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, message, DatePicker, Row, Col, Input, Form, Table, Radio } from 'antd'
const FormItem = Form.Item
const { RangePicker } = DatePicker

const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
}
const modal = ({
	dispatch,
	loading,
	pagination1,
  visible,
  type,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  modalType,
  isClose,
  selectIndex,
  tempList,
  templets,
}) => {
	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		if (tempid == -1) {
			message.error('请选择策略模板')
			return
		}
		for (let templet of tempList) {
				if (templet.index == selectIndex) {
				     templet.tempid = tempid
				     templet.tempname = tempname
			  }
    }
		dispatch({
			type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
					tempVisible: false,
    			tempList,
			},
		})
	}

  	const radioChange = (e) => {
      let valueStr = e.target.value
      let keys = valueStr.split('##@@')
		  tempid = keys[0]
		  tempname = keys[1]
   }

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				  //modalVisible: true,														//弹出窗口是否可见
    			//groupVisible: false,
    			tempVisible: false,
			},
		})
	}

const onSearch = () => {
		const data = {
        ...getFieldsValue(),
    }
    let q = ''
    let name = data.name

    if (name !== undefined && name !== '') {
    	q = `name:=~:${name}+`
    }
    if (data.time !== undefined && data.time.length > 0) {
    	let sTime = `${Date.parse(data.time[0])}`
      let eTime = `${Date.parse(data.time[1])}`
      q = `${q}createdTime:>=:${sTime}+createdTime:<=:${eTime}`
    }

    dispatch({
		  	type: 'policyRule/queryTemplets',
			  payload: {
				  q,
		  	},
	  })
	}
	  //选择的模板id
	  let tempid = -1
	  let tempname = -1
	const onChange = (e) => {
		tempid = e.target.value
		tempname = e.target.name
	}
  const modalOpts = {
    title: '选择策略模板',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }

const columns = [
		{
      title: '选择',
      key: 'operation',
      width: 50,
      render: (text, record) => {
      	let a = `${record.policyTemplate.uuid}` + '##@@' + `${record.policyTemplate.name}`
        return <Radio value={a} name={Math.random()} />
      },
    }, {
      title: '模板名称',
      dataIndex: 'policyTemplate.name',
      key: 'policyTemplate.name',
    }, {
      title: '指标',
      dataIndex: 'policyTemplate.monitorParams.indicator.name',
      key: 'policyTemplate.monitorParams.indicator.name',
    }, {
      title: '告警参数',
      render: (text, record) => {
        let params = ''
        if (record.policyTemplate.monitorParams === undefined) {
          return ''
        }
        if (record.policyTemplate.monitorParams.ops === undefined) {
          return ''
        }
        let ops = record.policyTemplate.monitorParams.ops
    if (ops !== undefined) {
      ops.forEach((op) => {
        let fuhao = ''
        if (op.condition.op === '>') {
          fuhao = '高于'
        }else if(op.condition.op === '>='){
          fuhao = '高于等于'
        } else {
          fuhao = '低于'
        }
        if (record.policyTemplate.policyType === 'SYSLOG') {
          params += `${op.actions.namingAction.naming};`
        }else if(op.condition.useExt == false && op.condition.extOp == 'ADV'){
          let texts=''
          let objectArray = JSON.parse(op.condition.extThreshold)
          objectArray.forEach((i)=>{
            texts+=i.name
          })
          params += `${texts};`
        }else {
          params += `连续${op.condition.count}次${fuhao}${op.condition.threshold};${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
        }
      })
    }
    if (record.policyTemplate.policyType === 'SYSLOG') {
      const typeStyle = <div className="ellipsis" title={params}>{params}</div>

      return typeStyle
    }
      return params
  },
    }, {
      title: '策略类型',
      render: (text, record) => {
      	let typename = '普通'
				if (record.policyTemplate.policyType == 'NORMAL') {
					typename = '普通'
				} else {
					typename = record.policyTemplate.policyType
				}
				return typename
			},

    }, {
      title: '策略实例数',
      dataIndex: 'policyInstances',
      key: 'policyInstances',
    }, {
      title: '监控对象数',
      dataIndex: 'mos',
      key: 'mos',

    },
  ]

  return (
    <Modal {...modalOpts} width="800px">

      <Form layout="inline">
        <FormItem label="模板名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="创建时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('url', {
            initialValue: item.url,
            rules: [
            ],
          })(<RangePicker />)}
        </FormItem>


        <div style={{ float: 'right', marginTop: 8, marginBottom: 8 }}>
          <Button size="large" type="primary" onClick={onSearch} >检索</Button>
        </div>
        <Row gutter={24}>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <RadioGroup onChange={radioChange}>
              <Table
                bordered
                columns={columns}
                dataSource={templets}
                loading={loading}
                pagination={pagination1}
                simple
                size="small"
              />
            </RadioGroup>
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
