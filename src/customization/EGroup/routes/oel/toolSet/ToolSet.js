import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, Table, Row } from 'antd'
import { DropOption } from '../../../../../components'
const confirm = Modal.confirm
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
  	visible,
  	eventName,
    eventType,
    eventContent,
  	form: {
    		getFieldDecorator,
    		validateFields,
    		getFieldsValue,
    		resetFields,
  	},
	dataSource,
	loading,
}) => {
const onOk = () => {
	validateFields((errors) => {
    		if (errors) {
        		return
      	}
      	const data = {
        		...getFieldsValue(),
      	}

      	dispatch({
			type: 'oelToolset/updateState',
			payload: {
				toolsetVisible: false,
			},
		})
    	})
}

const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
	dispatch({
		type: 'oelToolset/updateState',
		payload: {
			toolsetVisible: false,
		},
	})
}

{ /*查询功能--start*/ }
const selectOnChange = (val) => {
	dispatch({
		type: 'oelToolset/updateState',
		payload: {
			eventType: val,
		},
	})
}

const onBlurInfo = () => {
	const valObj = getFieldsValue(['eventName'])
	let name = valObj && valObj.eventName ? valObj.eventName : ''
	dispatch({
		type: 'oelToolset/updateState',
		payload: {
			eventName: name,
		},
	})
}
const onBlurContent = () => {
	const valObj = getFieldsValue(['eventContent'])
	let contents = valObj && valObj.eventContent ? valObj.eventContent : ''
	dispatch({
		type: 'oelToolset/updateState',
		payload: {
			eventContent: contents,
		},
	})
}
const onSelectInfo = () => {
	const valObj = getFieldsValue(['eventName', 'eventType', 'eventContent'])
	let name = valObj && valObj.eventName ? valObj.eventName : ''
	let toolType = valObj && valObj.eventType ? valObj.eventType : ''
	let contents = valObj && valObj.eventContent ? valObj.eventContent : ''
	dispatch({
		type: 'oelEventFilter/updateState',
		payload: {
			eventName: name,
			eventType: toolType,
			eventContent: contents,
			toolsetVisible: false,
		},
	})
	dispatch({
		type: 'oelToolset/queryTool',
		payload: {},
	})
}
{ /*查询功能--end*/ }

const columns = [
{
	title: '名称',
	dataIndex: 'name',
	key: 'name',
}, {
	title: '类型',
	dataIndex: 'toolType',
	key: 'toolType',
}, {
	title: '操作',
	key: 'operation',
	render: (text, record) => {
		return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }, { key: '3', name: '克隆' }]} />
	},
},
]
const handleMenuClick = (record, e) => {
	if (e.key === '1') {
		dispatch({
			type: 'oelToolset/findById',
			payload: {
				uuid: record.uuid,
			},
		})
    	} else if (e.key === '2') {
      	confirm({
        		title: '您确定要删除这条记录吗?',
        		onOk () {
        			let ids = []
        			ids.push(record.uuid)
        			dispatch({
		        		type: 'oelToolset/delete',
		        		payload: ids,
		      	})
        			dispatch({
					type: 'oelToolset/updateState',
					payload: {
						toolsetVisible: true,
					},
				})
        			resetFields()
        		},
      	})
    	} else if (e.key === '3') {
    		let currentItemdata = { ...record }
			if (currentItemdata) {
				currentItemdata.uuid = undefined
				let tempname = currentItemdata.name

				let coplyname = `_copy_${new Date().getTime()}`
				if (tempname && tempname.includes('_copy_')) {
					tempname = tempname.replace(/_copy_\d+/g, coplyname)
				} else {
					tempname += coplyname
				}
				currentItemdata.name = tempname
				if (currentItemdata.primeObjSrv) {
					currentItemdata.primeObjSrv.uuid = undefined


					let tempname0 = currentItemdata.primeObjSrv.name

				let coplyname0 = `_copy_${new Date().getTime()}`
				if (tempname0 && tempname0.includes('_copy_')) {
					tempname0 = tempname0.replace(/_copy_\d+/g, coplyname0)
				} else {
					tempname0 += coplyname0
				}
					currentItemdata.primeObjSrv.name = tempname0
				}
			}
		 dispatch({
			type: 'oelToolset/creates',
			payload: currentItemdata,
		})
    	}
}
const modalOpts = {
	title: '工具列表',
	visible,
	onOk,
	onCancel,
	wrapClassName: 'vertical-center-modal',
}

const selectChange = () => {															//弹出窗口中点击取消按钮触发的函数

}

const addTool = () => {															//弹出窗口中点击取消按钮触发的函数
	dispatch({
		type: 'oelToolset/updateState',
		payload: {
			tooleditVisible: true,
		},
	})
}
return (
  <Modal {...modalOpts} width="688px">
    <Form >
      <Row>

        <div style={{ width: '647px', float: 'left' }}>
          {/*查询功能--start*/}
          <span style={{ float: 'left', marginTop: 4 }}>
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('eventName', {
						initialValue: eventName,
					  })(<Input id="eventfiltername" style={{ width: '120px' }} onBlur={onBlurInfo} />)}
            </FormItem>

          </span>

          <span style={{ float: 'left', marginTop: 4, marginLeft: 6 }}>
            <FormItem label="类型" {...formItemLayout}>
              {getFieldDecorator('eventType', {
						initialValue: '',
					  })(<Select id="eventfiltertype" onChange={selectOnChange} style={{ width: '120px' }}>
  <Select.Option value="">所有</Select.Option>
  <Select.Option value="SQL">SQL</Select.Option>
  <Select.Option value="URL">URL</Select.Option>
          </Select>)}
            </FormItem>
          </span>

          <span style={{ float: 'left', marginTop: 4, marginLeft: 6 }}>
            <FormItem label="内容" {...formItemLayout}>
              {getFieldDecorator('eventContent', {
						initialValue: eventContent,
					  })(<Input id="eventfiltercontent" style={{ width: '120px' }} onBlur={onBlurContent} />)}
            </FormItem>

          </span>
          <span style={{ float: 'right', marginTop: 4 }}>
            {/*查询功能--end*/}

            <Button style={{ marginLeft: 8, float: 'right' }} type="ghost" onClick={addTool} >新建</Button>
            {/*查询功能--start*/}
            <Button style={{ marginLeft: 8, float: 'right' }} size="default" type="primary" onClick={onSelectInfo} icon="search" />
            {/*查询功能--end*/}

          </span>
        </div>

      </Row>
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        simple
        rowKey={record => record.uuid}
        size="small"
        loading={loading.effects['oelToolset/queryTools']}
      />
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
