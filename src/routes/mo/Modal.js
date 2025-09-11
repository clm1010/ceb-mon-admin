import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Checkbox, Modal, Table, TimePicker } from 'antd'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
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
  modalType,
  checkStatus,
  isClose,
  timeList,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

	const onOk = () => {
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      let defs = []
      timeList.forEach((item) => {
      	  let stime0 = `stime${item.index}`
				  let stime = data[stime0]
				  let stimeStr = ''
				  let etimeStr = ''
				  if (stime !== undefined && stime !== null && stime !== '') {
				  	stimeStr = stime.format('HH:mm:ss')
				  }
				  let etime0 = `etime${item.index}`
				  let etime = data[etime0]
				  if (etime !== undefined && etime !== null && etime !== '') {
				  	etimeStr = etime.format('HH:mm:ss')
				  }
      		let def = {
      			 selected: item.checked,
      			 weekday: item.week,
      			 period: `${stimeStr}--${etimeStr}`,
      			 uuid: item.uuid,
      		}
      		defs.push(def)
      })
      let payload = {
      	 name: data.name,
      	 description: data.description,
      	 defs,
      }
      resetFields()
      dispatch({
				type: `periodconfig/${type}`,											//抛一个事件给监听这个type的监听器
				payload,
			})
    })
	}

	const onCancel = () => {
		resetFields()
		dispatch({
        type: 'periodconfig/setState',
			  payload: {
				    modalType: 'create',
				    currentItem: {},
				    modalVisible: false,
				    isClose: false,
			  },
      })
	}
  function onChange (e) {
    let selectIndex = e.target.value
    timeList.forEach((item) => {
    	if (item.index === selectIndex) {
    		item.checked = e.target.checked
    	}
    })
    dispatch({
        type: 'periodconfig/setState',
			  payload: {
				    timeList,
			  },
    })
  }
	const columns = [
	  {
      title: '开启',
	  dataIndex: 'openChecked',
      key: 'openChecked',
	    width: 10,
	    render: (text, record) => {
         return <Checkbox value={record.index} checked={record.checked} onChange={onChange} />
      },
    }, {
      title: '星期',
      dataIndex: 'week',
      key: 'week',
	    width: 50,
    }, {
      title: '时间段',
      key: 'time',
      width: 180,
      render: (text, record) => {
        return (
          <Form layout="inline">
            <FormItem label="" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`stime${record.index}`, {
            initialValue: record.stime,
          })(<TimePicker />)}
            </FormItem>
            <FormItem label="" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`etime${record.index}`, {
            initialValue: record.etime,
          })(<TimePicker />)}
            </FormItem>
          </Form>
		)
      },
    },
	]

  const modalOpts = {
    title: `${type === 'create' ? '新增周期' : '编辑周期'}`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }


  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="周期名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="周期描述" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        <Table
          columns={columns}
          dataSource={timeList}
          simple
          size="small"
          pagination={false}
        />
      </Form>


      {
		((type !== 'create')) ?
  <Form layout="inline">

    <FormItem label="创建人" style={{ left: 24 }} >
      {getFieldDecorator('Creater', {
            initialValue: item.createdBy,
          })(<Input style={{ width: 100 }} disabled />)}
    </FormItem>

    <FormItem label="创建时间" style={{ left: 70 }}>
      {getFieldDecorator('CreaterTime', {
            initialValue: item.createdTime,
          })(<Input disabled />)}
    </FormItem>

  </Form>

	   : null

}
      <br />
      {
		((type !== 'create')) ?
  <Form layout="inline">
    <FormItem label="最后更新人" >
      {getFieldDecorator('LastCreater', {
            initialValue: item.updatedBy,
          })(<Input style={{ width: 100 }} disabled />)}
    </FormItem>

    <FormItem label="最后更新时间" style={{ left: 22 }}>
      {getFieldDecorator('LastCreaterTime', {
            initialValue: item.updatedTime,
          })(<Input disabled />)}
    </FormItem>
  </Form>

	  : null

}
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
