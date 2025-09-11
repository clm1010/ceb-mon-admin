import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, Table, Row } from 'antd'
import { DropOption } from '../../../../../components'
const FormItem = Form.Item
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
const confirm = Modal.confirm
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
	loading,
  visible,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
	dataSource,
}) => {
	const onOk = () => {
      dispatch({
				type: 'eventviews/updateState',
				payload: {
					viewsetVisible: false,
				},
			})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'eventviews/updateState',
				payload: {
					viewsetVisible: false,
				},
		})
	}

	const columns = [
		/*{
      title: 'uuid',
      dataIndex: 'uuid',
      key: 'uuid',
    },*/
    {
      title: '视图名称',
      dataIndex: 'name',
      key: 'name',
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
    		type: 'eventviews/queryViewer',
    		payload: {
    			oelViewer: record.uuid,
    		},
    	})
    } else if (e.key === '3') {
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
			}
		  dispatch({
			   type: 'eventviews/create',
			   payload: obj,
	  	})
    } else if (e.key === '2') {
        confirm({
           title: '您确定要删除这条记录吗?',
           onOk () {
        			let ids = []
        			ids.push(record.uuid)
         		  dispatch({
		       		 	type: 'eventviews/delete',
		       		 	payload: ids,
		      	  })
        	},
        })
    }
  }
  const modalOpts = {
    title: '视图配置',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

	const selectChange = (value) => {
    let type = value
    let result = false
    if (type === 'Global') {
    	result = true
    } else {
    	result = false
    }
    let querysql = `isGlobal==${result}`
    dispatch({
    	type: 'eventviews/queryAllViews',
    	payload: {
				q: querysql,
			},
		})
	}
	const onSearch = () => {
		 const data = {
        ...getFieldsValue(),
			}

		let q = ''
				let type = data.type
				let name = data.name
        if (type && type !== '') {
        	 let result = false
   				 if (type === 'Global') {
    					result = true
  				 } else {
    					result = false
   				 }
          q += `isGlobal==${result};`
        }
        if (name && name !== '') {
          q += `name=='*${name}*';`
        }
        if (q.endsWith(';')) {
            q = q.substring(0, q.length - 1)
        }
    dispatch({
    	type: 'eventviews/queryAllViews',
    	payload: {
				q,
			},
		})
	}
	const addView = () => {
		let columeList = []
		for (let index in ViewColumns) {
        const colume0 = ViewColumns[index]
        let colume1 = {
        	  key: colume0.key,
   					name: colume0.name,
   					alias: colume0.name,
   					width: 150,
   					locked: false,
   					sort: 'no',
   					isSelected: false,
        }
        columeList.push(colume1)
    }

		dispatch({
			type: 'eventviews/updateState',
			payload: {
				columeVisible: true,
				modaltype: 'create',
				currentView: {
					name: '',
					type: '',
				},
				columeList,
				columeInfo: {
					name: '',
					width: '',
					locked: false,
					sort: '',
				},
			},
		})
	}
  return (

    <Modal {...modalOpts} width="550px">
      <Form >

        <Row>
          <div style={{ position: 'relative' }} id="area0" />
          <div style={{ width: '500px', float: 'left' }}>
            {/*查询功能--start*/}
            <span style={{ float: 'left', marginTop: 4 }}>

              <FormItem label="类型" {...formItemLayout}>
                {getFieldDecorator('type', {
						initialValue: '',
					  })(<Select style={{ width: '120px' }}
  getPopupContainer={() => document.getElementById('area0')}
					  >
  <Option value="">全部</Option>
  <Option value="Global">Global</Option>
  <Option value="Private">Private</Option>
          </Select>)}
              </FormItem>

            </span>

            <span style={{ float: 'left', marginTop: 4 }}>
              <FormItem label="名称" {...formItemLayout}>
                {getFieldDecorator('name', {
						initialValue: '',
					  })(<Input style={{ width: '120px' }} />)}
              </FormItem>

            </span>

            <span style={{ float: 'right', marginTop: 4 }}>
              {/*查询功能--end*/}

              <Button style={{ marginLeft: 8, float: 'right' }} type="ghost" onClick={addView} >新建</Button>
              {/*查询功能--start*/}
              <Button style={{ marginLeft: 8, float: 'right' }} size="default" type="primary" onClick={onSearch} icon="search" />
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
          loading={loading.effects['eventviews/queryAllViews']}
          rowKey={record => record.uuid}
          size="small"
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
