import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Tabs, Icon } from 'antd'
const FormItem = Form.Item
const TabPane = Tabs.TabPane
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
  type,
  item,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  checkStatus,
  isClose,
  userList,
  loading,
  pagination,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

  let uiPermissions = []
  if (item.uiPermissions && item.uiPermissions.length > 0) {
  	  for (let info of item.uiPermissions) {
		    if (info.has) {
		      	uiPermissions.push(info)
		    }
		  }
  }

	const onOk = () => {
		if (type === 'see') {
				 dispatch({
        	  type: 'roles/updateState',
			 		  payload: {
				      modalType: 'create',
				      currentItem: {},
				      modalVisible: false,
				      isClose: false,
			     },
        })
        return
		}
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      item.description = data.description
      item.name = data.name
      item.status = 'ENABLED'//去掉角色的锁定属性，但后端未更改，暂时增加时设置为默认的正常
      item.uiPermissions = uiPermissions
      resetFields()
      dispatch({
				type: `roles/${type}`,
				payload: item,
			})
    })
	}

	const onCancel = () => {
		resetFields()
		dispatch({
        type: 'roles/updateState',
			  payload: {
				    modalType: 'create',
				    currentItem: {},
				    modalVisible: false,
				    isClose: false,
			  },
    })
	}
	const onSelect = (selectedKeys, info) => {
  }
  const onCheck = (checkedKeys, info) => {
  }

  const modalOpts = {
    title: '角色信息维护',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

	const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
	  	let choosed = []
	  	selectedRows.forEach((object) => {
	  			choosed.push = object.id
	  		})
	  	if (selectedRows.length > 0) {
		  	dispatch({
		    	type: 'roles/updateState',
					payload: {
						batchDelete: true,
						selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    	type: 'roles/updateState',
					payload: {
						batchDelete: false,
						selectedRows,
					},
				})
			}
	  },
	}
	const onPageChange = (page) => {
		let data = {
				current: page.current - 1,
				page: page.current - 1,
				pageSize: page.pageSize,
}
		dispatch({
			type: 'roles/queryUser',
			payload: data,
		})
	}
	const onSearch = () => {
		const data = {
        ...getFieldsValue(),
    }
    let val = data.username
    let usertype = data.usertype
		let queryStr = ''
		if (val) {
			queryStr = { q: `name=='*${val}*'` }
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'roles/queryUser',
			payload: queryStr,
		})
	}
  return (
    <Modal {...modalOpts} width="600px">
      <Form layout="horizontal">
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><Icon type="solution" />角色信息</span>} key="1">
            <FormItem label="角色名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                     initialValue: item.name,
                     rules: [{ required: true }],
                   })(<Input disabled={type === 'see'} />)}
            </FormItem>

            <FormItem label="描述" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                     initialValue: item.description,
                     rules: [{ required: true }],
                   })(<Input disabled={type === 'see'} />)}
            </FormItem>

            {
                 	(type !== 'create') ?
                   <FormItem label="创建者" {...formItemLayout}>
                     {getFieldDecorator('createdBy', {
                     initialValue: item.createdBy,
                   })(<Input disabled />)}
                   </FormItem>
               : null
	             }
            {
                 	(type !== 'create') ?
                   <FormItem label="创建时间" {...formItemLayout}>
                     {getFieldDecorator('createdTime', {
                     initialValue: item.createdTimeStr,
                   })(<Input disabled />)}
                   </FormItem>
               : null
	             }
          </TabPane>

        </Tabs>
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
