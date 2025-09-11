import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Tree, Table, Row, Col, Input, Radio, message } from 'antd'
const Search = Input.Search

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
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
  tempgroupUUID,
  treeNodes,
  typeValue,
}) => {
	let selectItemObj = {}
	let searchobj = {}
	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数
		if (selectItemObj.policyTemplate === undefined) {
			message.error('请选择策略模板')
			return
		}
		let tempid = selectItemObj.policyTemplate.uuid
		let tempname = selectItemObj.policyTemplate.name
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

	const rowSelection = {
		type: 'radio',
		onChange: (selectedRowKeys, selectedRows) => {
			if (selectedRowKeys && selectedRowKeys.length > 0) {
				selectItemObj = selectedRows[0]
			}
		},
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				  //modalVisible: true,														//弹出窗口是否可见
    			//groupVisible: false,
				tempVisible: false,
				serachVal:''
			},
		})
	}


	const onSelect = (selectedKeys, info) => {
		let groupkey = '',q = ''
		if (selectedKeys && selectedKeys.length > 0) {
			groupkey = selectedKeys[0]
		}


		if (searchobj && searchobj.input && searchobj.input.refs && searchobj.input.refs.input) {
			searchobj.input.refs.input.value = ''
		}
		if( typeValue=='DISTRIBUTE'){
			q = "policyType=='PROMETHEUS'"
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'policyRule/queryTemplets',
			payload: {
				groupUUID: groupkey,
				q:q == '' ? undefined : q,
			},
		})

		dispatch({
			type: 'policyRule/updateState',
			payload: {
				tempgroupUUID: selectedKeys,
			},
		})
	}

	const onSearch = (val) => {
		let groupkey = ''
		let qs = ''
		if (tempgroupUUID && tempgroupUUID.length > 0) {
			groupkey = tempgroupUUID[0]
		}
		if (val) {
			qs = `name=='*${val}*'`
		}
		if((val!='' && val!=undefined ) &&  typeValue=='DISTRIBUTE'){
			qs+=";policyType=='PROMETHEUS'"
		}
		if((val=='' || val==undefined ) &&  typeValue=='DISTRIBUTE'){
			qs ="policyType=='PROMETHEUS'"
		}
		/*
			获取列表
		*/
		//let q = `name=='*${val}*'`
		let data = { groupUUID: groupkey, q: qs}
		dispatch({
			type: 'policyRule/updateState',
			payload: { serachVal: qs },
		})
		dispatch({
			type: 'policyRule/queryTemplets',
			payload: data,
		})
	}

	const onPageChange = (page) => {
		let data = {
				  current: page.current,
				  pageSize: page.pageSize + 1,
				}
		if (tempgroupUUID && tempgroupUUID.length > 0) {
			data = { ...data, groupUUID: tempgroupUUID[0] }
		}
		dispatch({
			type: 'policyRule/queryTemplets',
			payload: data,
		})
	}

	function getChild (child) { //這个就是获取组件对象
		searchobj = child
	}

	const modalOpts = {
		title: '策略模板选择器',
		visible,
		onOk,
		okText: '确定',
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 920,
		maskClosable: false,
	}
	const columns = [
	{
      title: '模板名称',
      dataIndex: 'policyTemplate.name',
      key: 'policyTemplate.name',
    }, {
      title: '指标',
      dataIndex: 'policyTemplate.monitorParams.indicator.name',
      key: 'policyTemplate.monitorParams.indicator.name',
    }, {
      title: '告警参数',
	  dataIndex: 'aleatsParams',
      key: 'aleatsParams',
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
	  dataIndex: 'aleatspolicyType',
      key: 'aleatspolicyType',
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
		title: '标准策略',
		dataIndex: 'stdAlarmFlag',
		key: 'stdAlarmFlag',
		render: (text, record) => {
			let typename = '未知'
				  if (record.policyTemplate.stdAlarmFlag == '0') {
					  typename = '否'
				  } else if (record.policyTemplate.stdAlarmFlag == '1') {
					  typename = '是'
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
  <Modal {...modalOpts} >
    <Row gutter={12}>
      <Col lg={4} md={5} sm={5} xs={24} className="content-inner">
        <div>策略模板组
        </div>
        <div>
          <Tree
            showLine
						//defaultSelectedKeys={selectKeys}
						//expandedKeys={expandKeys}
            onSelect={onSelect}
            defaultExpandAll
          >
            {treeNodes}
          </Tree>

        </div>

      </Col>
      <Col lg={20} md={19} sm={19} xs={24}>
        <Row gutter={24}>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>

            <Search
              id="123"
              placeholder="请输入模板名称查询"
              style={{ width: '100%', marginBottom: '12px' }}
              onSearch={onSearch}
					//onChange={onInputChange}
              ref={getChild}
            />

          </Col>
        </Row>
        <Row>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Table
              key={new Date()}
              scroll={{ x: 1000 }} //滚动条
              bordered
              columns={columns} //表结构字段
              simple
              size="small"

              dataSource={templets} //表数据
              loading={loading} //页面加载
              rowSelection={rowSelection} //选择框
              rowKey={record => record.policyTemplate.uuid}
              pagination={pagination1} //分页配置
              onChange={onPageChange}
            />
          </Col>

        </Row>
      </Col>
    </Row>
  </Modal>
	)
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
