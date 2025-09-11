import React from 'react'
import { Table, Modal, Row, Col, Button, Select, Input, Form } from 'antd'
import { DropOption } from '../../../components'

const confirm = Modal.confirm
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 8,
  },
}

function list ({
 dispatch, loading, dataSource, pagination, batchDelete, choosedRows, eventName, eventIsGlobal, myform, location,
}) {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = myform


	const onAdd = () => {
		dispatch({ //打开一个弹出框
		    type: 'oelEventFilter/updateState',
		    payload: {
				confirmLoading: false,
				currentItem: {},
				evnetType: 'create',
				oelFiltervisible: true,
				oelFilterValue: {},
				oelFilterOldValue: {},
			},
		})
	}

	//const  onPageChange =  (page) => {
		//	dispatch({
		//		type: 'oelEventFilter/query',
		//		payload: {
		//			q:{
		//				current:page.current,
		//				page:page.current,
		//				pageSize:page.pageSize,
		//			}
		//		}
		//	})
	//	}

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          dispatch({
		        type: 'oelEventFilter/removeall',
		        payload: choosedRows,
		      })
        },
      })
	}

	const handleMenuClick = (record, e) => {
		if (e.key === '1') {
		 dispatch({ //打开一个弹出框
		    type: 'oelEventFilter/queryById',
		    payload: {
					oelFilter: record.uuid,
			},
		 })
		} else if (e.key === '2') {
			let obj = { ...record }
			if (obj) {
				obj.uuid = ''
				let tempname = obj.name

				let coplyname = `_copy_${new Date().getTime()}`
				if (tempname && tempname.includes('_copy_')) {
					tempname = tempname.replace(/_copy_\d+/g, coplyname)
				} else {
					tempname += coplyname
				}
				obj.name = tempname
				if (obj.filter) {
					obj.filter.uuid = ''
					if (obj.filter.filterItems && obj.filter.filterItems.length > 0) {
						let arrs = []
						obj.filter.filterItems.forEach((item) => {
							item.uuid = ''
							arrs.push(item)
						})
						obj.filter.filterItems = arrs
					}
				}
			}
		 dispatch({
			type: 'oelEventFilter/create',
			payload: obj,
		})
		} else if (e.key === '3') {
		  confirm({
			title: '您确定要删除这条记录吗?',
			onOk () {
			  dispatch({
					type: 'oelEventFilter/delete',
					payload: { uuid: record.uuid },
				  })
			},
		  })
		}
	}


	const columns = [
		/*{
			title: 'ID',
			dataIndex: 'uuid',
			key: 'uuid',
			width:'60%',
		},*/
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: '60%',
			render: (text, record) => {
				return text
			},
		},
		{
			title: '类型',
			dataIndex: 'isGlobal',
			key: 'isGlobal',
			width: '35%',
			render: (text, record) => {
				let globalname = 'Private'
				if (text) {
					globalname = 'Global'
				}
				return globalname
			},
		},
		{
			title: '操作',
			key: 'operation',
			fixed: 'right',
			width: 60,
			render: (text, record) => {
				return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '克隆' }, { key: '3', name: '删除' }]} />
			},
		},
	]

	const rowSelection = {

		onChange: (selectedRowKeys, selectedRows) => {
			let newselectKeys = []
			selectedRows.forEach((item) => {
				newselectKeys.push(item.uuid)
			})
			if (selectedRows.length > 0) {
				dispatch({
					type: 'oelEventFilter/updateState',
						payload: {
							batchDelete: true, //控制删除按钮
							choosedRows: newselectKeys, //把选择的行ID 放到 state 模型中去
						},
					})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'oelEventFilter/updateState',
					payload: {
						batchDelete: false,
						choosedRows: [],
					},
				})
			}
		},


	}

	const selectOnChange = (val) => {
		dispatch({
		    type: 'oelEventFilter/updateState',
				payload: {
					eventIsGlobal: val,
			},
		})
	}

	const onBlurInfo = () => {
		const valObj = getFieldsValue(['eventName'])
		let name = valObj && valObj.eventName ? valObj.eventName : ''
		dispatch({
		    type: 'oelEventFilter/updateState',
				payload: {
					eventName: name,
			},
		})
	}

	const onSelectInfo = () => {
		const valObj = getFieldsValue(['eventName', 'eventIsGlobal'])
		let name = valObj && valObj.eventName ? valObj.eventName : ''
		let type = valObj && valObj.eventIsGlobal ? valObj.eventIsGlobal : ''
		dispatch({
		    type: 'oelEventFilter/updateState',
				payload: {
					eventName: name,
					eventIsGlobal: type,
			},
		})
		dispatch({
		    type: 'oelEventFilter/query',
			payload: {},
		})
	}

	return (
  <Row gutter={24}>


    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>

      <div style={{ width: 688, float: 'left' }}>

        <span style={{ float: 'left', marginTop: 4 }}>
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('eventName', {
						initialValue: eventName,
					  })(<Input id="eventfiltername" style={{ width: '150px' }} onBlur={onBlurInfo} />)}
          </FormItem>

        </span>

        <span style={{ float: 'left', marginLeft: 40, marginTop: 4 }}>
          <FormItem label="类型" {...formItemLayout}>
            {getFieldDecorator('eventIsGlobal', {
						initialValue: eventIsGlobal,
					  })(<Select id="eventfiltertype" onChange={selectOnChange} style={{ width: '150px' }}>
  <Select.Option value=""></Select.Option>
  <Select.Option value="global">Global</Select.Option>
  <Select.Option value="private">Private</Select.Option>
          </Select>)}
          </FormItem>
        </span>
        <span style={{ float: 'right', marginTop: 4 }}>
          <Button style={{ marginLeft: 8 }} size="default" type="primary" onClick={onSelectInfo} icon="search" />
          {/*<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={batchDelete?false:true} icon="delete" />*/}
          <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} icon="plus" />
        </span>
      </div>
    </Col>
    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
      <Table
					//scroll={{x:600}}  //滚动条
        bordered
        columns={columns} //表结构字段
        dataSource={dataSource} //表数据
        loading={loading.effects['oelEventFilter/query']} //页面加载
					//onChange={onPageChange}  //分页、排序、筛选变化时触发，目前只使用了分页事件的触发
        pagination={false} //分页配置
        simple
        size="small"
        rowKey={record => record.uuid}
      />

    </Col>
  </Row>
	)
}

export default list
