import React from 'react'
import { Form, Input, Modal, Checkbox, Alert } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 18,
	},
}

const formItemLayout2 = {
	labelCol: {
		span: 4,
	},
	wrapperCol: {
		span: 18,
	},
}
const formItemLayout3 = {
	labelCol: {
		span: 14,
	},
	wrapperCol: {
		span: 8,
	},
}


const modal = ({
	dispatch,
	visible,
	form,
	day,
	week,
	mon,
	fix,
	dayInfo,
	weekInfo,
	monInfo,
	fixInfo,
	checkboxState,
	itme,
	alertType,
	alertMessage,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
} = form

	const onOk = () => {
		validateFieldsAndScroll((errors, value) => {
			if (errors) {
				return
		  }
		  let data = {
				...getFieldsValue(),
		  }
		  let daysCycle = ''
		  let weeksCycle = ''
		  let monsCycle = ''
		  let fixCycle = ''
		  let cycle = ''
		  if (data.days && data.days != '') {
		  	daysCycle = `[day]&${data.days.trim()} ?`
		  }
		  if (data.weeks && data.weeks != '') {
		  	weeksCycle = `[week]&${data.weeks.trim()} ?`
		  }
		  if (data.mons && data.mons != '') {
		  	monsCycle = `[month]&${data.mons.trim()} ?`
		  }
		  if (data.fix && data.fix != '') {
		  	fixCycle = `[fix]&${data.fix.trim()} ?`
		  }
		  cycle = (daysCycle.length > 0 ? `${daysCycle}@` : '') + (weeksCycle.length > 0 ? `${weeksCycle}@` : '') + (monsCycle.length > 0 ? `${monsCycle}@` : '') + (fixCycle.length > 0 ? `${fixCycle}@` : '')
		  let info = {}
		  info.cycle = cycle.substring(0, cycle.length - 1)
		  info.url = data.URL
		  info.name = data.name
		  info.id = itme.id
		  info.category = itme.category
		  info.hosts = itme.hosts
		  info.parentId = itme.parentId
		  info.itRmLevel = itme.itRmLevel
			dispatch({
				type: 'formConfiguration/update',
				payload: {
					info,
				},
			})

		  resetFields()
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'formConfiguration/setState',
			payload: {
				modalVisible: false,
				day: false,
				week: false,
				mon: false,
				fix: false,
				checkboxState: false,
				dayInfo: '',
				weekInfo: '',
				monInfo: '',
				fixInfo: '',
				alertType: 'info',
				alertMessage: '请输入配置信息',
			},
		})
	}

	const modalOpts = {
	    title: '编辑报表信息',
	    visible,
	    onOk,
	    onCancel,
	    wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const onChangeDay = (e) => {
		dispatch({
			type: 'formConfiguration/setState',
			payload: {
				day: e.target.checked,
			},
		})
		if (!e.target.checked) {
			resetFields(['days'])
			dispatch({
				type: 'formConfiguration/setState',
				payload: {
					day: e.target.checked,
					dayInfo: '',
				},
			})
		}
	}

	const onChangeWeek = (e) => {
		dispatch({
			type: 'formConfiguration/setState',
			payload: {
				week: e.target.checked,
			},
		})
		if (!e.target.checked) {
			resetFields(['weeks'])
			dispatch({
				type: 'formConfiguration/setState',
				payload: {
					week: e.target.checked,
					weekInfo: '',
				},
			})
		}
	}

	const onChangeMon = (e) => {
		dispatch({
			type: 'formConfiguration/setState',
			payload: {
				mon: e.target.checked,
			},
		})
		if (!e.target.checked) {
			resetFields(['mons'])
			dispatch({
				type: 'formConfiguration/setState',
				payload: {
					mon: e.target.checked,
					monInfo: '',
				},
			})
		}
	}

	const onChangeFix = (e) => {
		dispatch({
			type: 'formConfiguration/setState',
			payload: {
				fix: e.target.checked,
			},
		})
		if (!e.target.checked) {
			resetFields(['fix'])
			dispatch({
				type: 'formConfiguration/setState',
				payload: {
					fix: e.target.checked,
					fixInfo: '',
				},
			})
		}
	}

	return (
  <Modal {...modalOpts} width={650}>
    <Form layout="horizontal">
      <div>
        <Alert message={alertMessage} type={alertType} showIcon /><br />
      </div>
      <span style={{ width: '100%', float: 'left' }}>
        <FormItem label="报表名称" key="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
							initialValue: itme.name,
							rules: [
							  {
									required: true,
							  },
							],
						})(<Input />)}
        </FormItem>
      </span>
      <span style={{ width: '100%', float: 'left' }}>
        <FormItem label="报表URL" key="URL" colon={false} hasFeedback {...formItemLayout}>
          {getFieldDecorator('URL', {
									initialValue: itme.url,
								})(<TextArea placeholder="" autosize={{ minRows: 4, maxRows: 8 }} />)}
        </FormItem>
      </span>
      <span style={{ width: '30%', float: 'left' }}>
        <FormItem label="模板周期" key="1" hasFeedback {...formItemLayout3}>
          <Checkbox checked={day} onChange={onChangeDay} disabled={!!checkboxState}>日报</Checkbox>
        </FormItem>
      </span>
      <span style={{ width: '70%', float: 'left' }}>
        <FormItem label="" key="days" hasFeedback {...formItemLayout2}>
          {getFieldDecorator('days', {
									initialValue: dayInfo,
								})(<Input disabled={!day} />)}
        </FormItem>
      </span>
      <span style={{ width: '30%', float: 'left' }}>
        <FormItem label="    " key="2" colon={false} hasFeedback {...formItemLayout3}>
          <Checkbox checked={week} onChange={onChangeWeek} disabled={!!checkboxState} >周报</Checkbox>
        </FormItem>
      </span>
      <span style={{ width: '70%', float: 'left' }}>
        <FormItem label="" key="weeks" hasFeedback {...formItemLayout2}>
          {getFieldDecorator('weeks', {
									initialValue: weekInfo,
								})(<Input disabled={!week} />)}
        </FormItem>
      </span>
      <span style={{ width: '30%', float: 'left' }}>
        <FormItem label="    " key="3" colon={false} hasFeedback {...formItemLayout3}>
          <Checkbox checked={mon} onChange={onChangeMon} disabled={!!checkboxState} >月报</Checkbox>
        </FormItem>
      </span>
      <span style={{ width: '70%', float: 'left' }}>
        <FormItem label="" key="mons" colon={false} hasFeedback {...formItemLayout2}>
          {getFieldDecorator('mons', {
									initialValue: monInfo,
								})(<Input disabled={!mon} />)}
        </FormItem>
      </span>
      <span style={{ width: '30%', float: 'left' }}>
        <FormItem label="   " key="4" colon={false} hasFeedback {...formItemLayout3}>
          <Checkbox checked={fix} onChange={onChangeFix} disabled={!!checkboxState} >自定</Checkbox>
        </FormItem>
      </span>
      <span style={{ width: '70%', float: 'left' }}>
        <FormItem label="" key="fix" colon={false} hasFeedback {...formItemLayout2}>
          {getFieldDecorator('fix', {
									initialValue: fixInfo,
								})(<Input disabled={!fix} />)}
        </FormItem>
      </span>
    </Form>
  </Modal>
	)
}

export default Form.create()(modal)
