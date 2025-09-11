import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Table, Row } from 'antd'
import { DropOption } from '../../../../../components'
const FormItem = Form.Item
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
  visible,
  dataName,
  dataOs,
  dataIP,
  displayObsSrvsList,
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
				type: 'oelDataSouseset/updateState',
				payload: {
					dataSousesetVisible: false,
				},
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
				type: 'oelDataSouseset/updateState',
				payload: {
					dataSousesetVisible: false,

				},
		})
	}
	//查询功能--start
  const onBlurInfo = () => {
	const valObj = getFieldsValue(['dataName'])
	let name = valObj && valObj.dataName ? valObj.dataName : ''
	dispatch({
		type: 'oelDataSouseset/updateState',
		payload: {
			dataName: name,
		},
	})
  }

  const onBlurIP = () => {
	const valObj = getFieldsValue(['dataIP'])
	let IP = valObj && valObj.dataIP ? valObj.dataIP : ''
	dispatch({
		type: 'oelDataSouseset/updateState',
		payload: {
			dataIP: IP,
		},
	})
  }

  const onBlurOS = () => {
	const valObj = getFieldsValue(['dataOs'])
	let osName = valObj && valObj.dataOs ? valObj.dataOs : ''
	dispatch({
		type: 'oelDataSouseset/updateState',
		payload: {
			dataOs: osName,
		},
	})
  }

const onSelectInfo = () => {
	const valObj = getFieldsValue(['dataName', 'dataOs', 'dataIP'])
	let name = valObj && valObj.dataName ? valObj.dataName : ''
	let osName = valObj && valObj.dataOs ? valObj.dataOs : ''
	let IP = valObj && valObj.dataIP ? valObj.dataIP : ''

	dispatch({
		type: 'oelDataSouseset/updateState',
		payload: {
			dataName: name,
			dataOs: osName,
			dataIP: IP,

		},
	})
	dispatch({
		type: 'oelDataSouseset/queryOsts',
		payload: {},
	})
}
//查询功能--end

  const columns = [/*{
    title: 'uuid',
    dataIndex: 'uuid',
    key: 'uuid',
  },*/{
    title: '数据源名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'OS名称',
    dataIndex: 'OSname',
    key: 'OSname',
  }, {
    title: 'Ip',
    dataIndex: 'serverIP',
    key: 'serverIP',
  }, {
    title: '端口',
    dataIndex: 'serverPort',
    key: 'serverPort',
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => {
    	if (record.flag) {
    	  return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }, { key: '3', name: '克隆' }]} />
    	}
    	  return ''
    },
  }]

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
    	dispatch({
    		type: 'oelDataSouseset/findById',
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
		        type: 'oelDataSouseset/delete',
		        payload: ids,
		      })
        },
      })
    } else if (e.key === '3') {
			let currentItemdata = { ...record.old }
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
        }
        if (currentItemdata.backupObjSrv) {
        	currentItemdata.backupObjSrv.uuid = undefined
        }
			}

		 dispatch({
			type: 'oelDataSouseset/creates',
			payload: currentItemdata,
		})
		}
  }
  const modalOpts = {
    title: '数据源配置',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

	const selectChange = () => {															//弹出窗口中点击取消按钮触发的函数

	}
	const addDataSouse = () => {
		let displayObsSrvsList = [
			    {
      		 	  	  index: 1,
				          name: '',
   	              serverIP: '',
   	              serverPort: '',
   	              username: '',
   	              password: '',
      		},
      	]
		dispatch({
			type: 'oelDataSouseset/updateState',
			payload: {
				dataSouseeditVisible: true,
				datatype: 'creates',
				currentItemdata: {
					name: '',
					primeObjSrv: {
				      name: '',
   	          serverIP: '',
   	          serverPort: '',
   	          username: '',
   	          password: '',
					},

				  backupObjSrv: {
						  name: '',
   	          serverIP: '',
   	          serverPort: '',
   	          username: '',
   	          password: '',
					},
				},
				displayObsSrvsList,
			},
		})
	}
  return (

    <Modal {...modalOpts} width="700px">
      <Form >
        <Row>
          <div style={{ width: '647px', float: 'left' }}>
            {/*查询功能--start*/}
            <span style={{ float: 'left', marginTop: 4 }}>
              <FormItem label="名称" {...formItemLayout}>
                {getFieldDecorator('dataName', {
						initialValue: dataName,
					  })(<Input id="eventfiltername" style={{ width: '120px' }} onBlur={onBlurInfo} />)}
              </FormItem>

            </span>

            <span style={{ float: 'left', marginTop: 4 }}>
              <FormItem label="OS" {...formItemLayout}>
                {getFieldDecorator('dataOs', {
						initialValue: dataOs,
					  })(<Input id="eventfilterOS" style={{ width: '120px' }} onBlur={onBlurOS} />)}
              </FormItem>

            </span>

            <span style={{ float: 'left', marginTop: 4 }}>
              <FormItem label="IP" {...formItemLayout}>
                {getFieldDecorator('dataIP', {
						initialValue: dataIP,
					  })(<Input id="eventfilterip" style={{ width: '120px' }} onBlur={onBlurIP} />)}
              </FormItem>

            </span>

            <span style={{ float: 'right', marginTop: 4 }}>
              {/*查询功能--end*/}

              <Button style={{ marginLeft: 8, float: 'right' }} type="ghost" onClick={addDataSouse} >新建</Button>
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
          loading={loading.effects['oelDataSouseset/queryAllosts']}
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
