import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Row, Col, Input, Form, DatePicker, Table, Radio } from 'antd'
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
	pagination,
  visible,
  type,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  modalType,
  checkStatus,
  isClose,
  tabstate,
  typeValue,
  indicators,
  pagination1,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
     dispatch({
			type: 'policyInstance/hideModal',													//抛一个事件给监听这个type的监听器
			payload: {
				  //modalVisible: true,														//弹出窗口是否可见
    			kpiVisible: false,
			},
		})
	}
	const radioChange = (e) => {
    let valueStr = e.target.value
    let keys = valueStr.split('##@@')
    dispatch({
			type: 'policyInstance/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
    			kpiid: keys[0],
    			kpiname: keys[1],
			},
		})
  }
	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyInstance/hideModal',													//抛一个事件给监听这个type的监听器
			payload: {
				  //modalVisible: true,														//弹出窗口是否可见
    			kpiVisible: false,
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
		  	type: 'policyInstance/queryIndicators',
			  payload: {
				  q,
		  	},
	  })
	}

	function onPageChange (page) {
		dispatch({
		  	type: 'policyInstance/queryIndicators',
			  payload: {
				  current: page.current,
				  pageSize: page.pageSize + 1,
		  	},
		  })
    }
  const modalOpts = {
    title: '选择指标',
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
      width: 100,
      render: (text, record) => {
      	let a = `${record.uuid}` + '##@@' + `${record.name}`
        return <Radio value={a} />
      },
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '关联策略模板数',
      dataIndex: 'policyTemplates',
      key: 'policyTemplates',
    }, {
      title: '关联策略实例数',
      dataIndex: 'policyInstances',
      key: 'policyInstances',
    }, {
      title: '监控对象数',
      dataIndex: 'mos',
      key: 'mos',
    },
  ]


  return (

    <Modal {...modalOpts} width="750px">
      <Form layout="inline">
        <FormItem label="指标搜索" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
          })(<Input />)}
        </FormItem>
        <FormItem label="创建时间" hasFeedback {...formItemLayout}>
          {getFieldDecorator('time', {
          })(<RangePicker />)}
        </FormItem>
      </Form>
      <Row gutter={24}>
        <Col className="gutter-row" span={6} />
        <Col className="gutter-row" span={6} />
        <Col className="gutter-row" span={6} />
        <Col style={{ float: 'right', marginTop: 8, marginBottom: 8 }} span={6}>
          <Button size="large" type="primary" onClick={onSearch}>检索</Button>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <RadioGroup onChange={radioChange} defaultValue="">
            <Table
              bordered
              columns={columns}
              dataSource={indicators}
              loading={loading}
              onChange={onPageChange}
              pagination={pagination1}
              simple
              rowKey={record => record.uuid}
              size="small"
            />
          </RadioGroup>
        </Col>
      </Row>
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
