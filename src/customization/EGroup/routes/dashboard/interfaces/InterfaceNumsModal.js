import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Form, Modal, Table, Button, Select, Row } from 'antd'

const modal = ({
	loading,
	dispatch,
  	visible,
  	interfaceItem,
  	form,
  	isClose,
  	fenhang,
  	user,
  	onPageChangeNum,
  	pagination,
  	keywordValue,
  	allSource,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalInterfaceVisible: false,
			},
		})
	}

	const oelDetail = (record, e) => {
//		let tagFilters = new Map()
//	tagFilters.set(1,{name:'NodeAlias', op:'=', value:`${record.discoveryIP}`})
		dispatch({
      		type: 'oel/query',
      		payload: {
      				needFilter: false,
	      			filterDisable: true,
        			preFilter: `and NodeAlias = '${record.discoveryIP}'`,
      		},
    		})
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalOelVisible: true,
			},
		})
	}

	const nameOnSelect = (value) => {
		if (value != '' && value != undefined) {
			let newSource = []
			for (let info of allSource) {
				if (info.name.includes(value)) {
					newSource.push(info)
				}
			}
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					interfaceItem: newSource,
					paginationNum: {
				    		showSizeChanger: true,
				      	showQuickJumper: true,
				      	showTotal: total => `共 ${total} 条`,
				      	total: newSource.length,
				      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
			      },
				},
			})
		} else if (value === '') {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					interfaceItem: allSource,
					paginationNum: {
				    		showSizeChanger: true,
				      	showQuickJumper: true,
				      	showTotal: total => `共 ${total} 条`,
				      	total: allSource.length,
				      	pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
			      },
				},
			})
		}
	}

	const columns = [{
		title: '接口IP',
		dataIndex: 'discoveryIP',
		key: 'discoveryIP',
	}, {
		title: '接口名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '接口类型',
		dataIndex: 'intfType',
		key: 'intfType',
	}, {
		title: 'mtu',
		dataIndex: 'mtu',
		key: 'mtu',
	}, {
		title: '创建时间',
		dataIndex: 'createdTime',
		key: 'createdTime',
		render: (text, record) => {
			return new Date(record.createdTime).format('yyyy-MM-dd hh:mm:ss')
		},
	}, {
		title: '更新时间',
		dataIndex: 'updatedTime',
		key: 'updatedTime',
		render: (text, record) => {
			return new Date(record.updatedTime).format('yyyy-MM-dd hh:mm:ss')
		},
	}, {
		title: '操作',
		key: 'action',
		render: (text, record) => (
  <span>
    <Link to={`/chddetail?q=${record.discoveryIP}+${record.keyword}+${record.branchName}`} target="_blank">性能 </Link>
    <a href="javascript:;" onClick={e => oelDetail(record, e)}>活动告警</a>
  </span>
	  	),
	}]

	const modalOpts = {
	    	title: '接口列表',
	    	visible,
	    	onCancel,
	    	wrapClassName: 'vertical-center-modal',
	    	maskClosable: false,
	    	width: 1250,
	    	footer: <Button key="back" onClick={onCancel}>关闭</Button>,
	}
	return (
  <Modal {...modalOpts}>
    <Row>
      <Select placeholder="请输入接口名" style={{ width: '220px', float: 'right' }} mode="combobox" showSearch notFoundContent={null} showArrow={false} onChange={nameOnSelect} />
    </Row>
    <Row>
      <Table
        columns={columns}
        dataSource={interfaceItem}
        loading={loading}
        pagination={pagination}
        rowKey={record => record.uuid}
        style={{ marginTop: '10px' }}
      />
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
}

export default Form.create()(modal)
