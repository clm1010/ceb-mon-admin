import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Tabs, Icon, Table, Row, Col, Spin } from 'antd'
import { Link } from 'dva/router'
import myStyle from './style.css'
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
	labelCol: {
		span: 9,
	},
	wrapperCol: {
		span: 11,
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
const modal = ({
	dispatch,
	visible,
	loading,
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	},
	//dataSource1,
	dataSource2,
	dataSource3,
	dataSource4,
	dataSource5,
	dataSource6,
	criteria,
	checkAll,
	checkedList,
	indeterminate,
	user,
	fenhang,
	issueState,
}) => {
	//判断下发状态权限---start
//	let issueRoles = false
//	if(!user){
//		issueRoles = false
//	}else{
//		let roles = user.roles
//		let rolesArr = [];
//		for(let i = 0;i < roles.length;i++){
//			let permissions = roles[i].permissions;
//			for(let j = 0;j < permissions.length;j++){
//				if(permissions[j].action === 'ISSUE' && permissions[j].name === 'RULE'){
//					issueRoles = true
//				}
//			}
//		}
//	}
	//end

	const onOk = () => { //弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(),
			}

			resetFields()


			confirm({
				title: '您确定要批量下发吗?',
				onOk () {
					dispatch({
						type: 'policyRule/updateState',
						payload: {
							issueState: true,
						},
					})
					dispatch({
						type: 'policyRule/issue',
						payload: {
							criteria,
						},
					})
				},
			})
			/*
			dispatch({
				type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
				payload: {
					calculateVisible: false,
					isCalc:false,
				}
			})*/
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'policyRule/updateState', //抛一个事件给监听这个type的监听器
			payload: {
				calculateVisible: false,
				isCalc: false,
				checkedList: [],
			},
		})
	}

	const openRuleModal = (uuid) => {
		dispatch({
			type: 'policyRule/queryRuleById', //抛一个事件给监听这个type的监听器
			payload: {
				uuid,
			},
		})
	}
	const openMonitorModal = (uuid) => {
		dispatch({
			type: 'policyRule/queryMonitorInstanceById', //抛一个事件给监听这个type的监听器
			payload: {
				uuid,
			},
		})
	}

	const columns = [{
		title: 'MO',
		dataIndex: 'mo',
		key: 'mo',
	}, {
		title: '指标',
		dataIndex: 'kpi',
		key: 'kpi',
	}, {
		title: '监控工具',
		dataIndex: 'tool',
		key: 'tool',
	}, {
		title: '策略信息',
		dataIndex: 'info',
		key: 'info',
		render: (text, record) => {
			//return <div>{record.tname},<Link onClick={e => openMonitorModal(record.monitoruuid)}>{record.rname}</Link></div>
			if (record.standard) {
				return <div>{record.tname},<a onClick={e => openRuleModal(record.ruleuuid)}>{record.rname}</a></div>
			}
				if (record.type === 'rule') {
					return <div>{record.tname},{record.rname}</div>
				}
					return <div>{record.tname},<a onClick={e => openMonitorModal(record.monitoruuid)}>{record.rname}</a></div>
		},
	}, {
		title: '来源',
		dataIndex: 'createdFrom',
		key: 'createdFrom',
		render: (text, record) => {
			let typename = '手工'
			if (record.createdFrom == 'MANUAL') {
				typename = '手工'
			} else if (record.createdFrom == 'FROM_TEMPLATE') {
				typename = '实例化'
			}
			return typename
		},
	}, {
		title: '是否标准',
		dataIndex: 'standard',
		key: 'standard',
		render: (text, record) => {
			let sstdname = '否'
			if (text) {
				sstdname = '是'
			}
			return sstdname
		},
	}]

	const modalOpts = {
		title: '策略规则计算信息',
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		width: 1000,
		maskClosable: false,
	}
	const searchName = () => {
		const data = {
			...getFieldsValue(),
		}
		let name = data.moName
		dispatch({
			type: 'policyRule/queryCalcName',
			payload: {
				name,
				dataSource4,
			},
		})
	}//disabled={issueRoles?false:true}
	return (
  <Modal {...modalOpts}
    footer={[
      <Button key="cancel" size="default" type="Default" onClick={onCancel}>取消</Button>,
      <Button key="confirm" size="default" /*type="primary"*/ onClick={onOk} type={dataSource2.length === 0 && dataSource3.length === 0 && dataSource4.length === 0 ? 'passOk' : 'passError'}>下发</Button>]
    		}
  >
    <Spin spinning={issueState} tip="正在下发...">
      <div className={myStyle.tabPart}>
        <Tabs>
          <TabPane tab={<span><Icon type="usergroup-delete" />重复监控的策略</span>} key="more">
            <Table
              bordered
              columns={columns}
              dataSource={dataSource2}
              //loading={loading}
              pagination={false}
              simple
              rowKey={record => record.uuid}
              size="small"
            />
          </TabPane>
          <TabPane tab={<span><Icon type="coffee" />不存在监控工具实例</span>} key="notool">
            <Table
              bordered
              columns={columns}
              dataSource={dataSource3}
              //loading={loading}
              pagination={false}
              simple
              rowKey={record => record.uuid}
              size="small"
            />
          </TabPane>
          <TabPane tab={<span><Icon type="trophy" />不存在指标实现</span>} key="nokpi">
            <Row>
              <Col span={6}>
                <FormItem label="MO" hasFeedback {...formItemLayout2}>
                  {getFieldDecorator('moName', {
         							initialValue: '',
        							})(<Input />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <Button onClick={searchName} size="large" icon="search" />
              </Col>
            </Row >
            <Table
              bordered
              columns={columns}
              dataSource={dataSource4}
              //loading={loading}
              pagination={false}
              simple
              rowKey={record => record.uuid}
              size="small"
            />
          </TabPane>

          <TabPane tab={<span><Icon type="logout" />存在多个指标实现</span>} key="multi">
            <Table
              bordered
              columns={columns}
              dataSource={dataSource5}
              //loading={false}
              pagination={false}
              simple
              rowKey={record => record.uuid}
              size="small"
            />
          </TabPane>

          <TabPane tab={<span><Icon type="logout" />不支持的监控对象</span>} key="multis">
            <Table
              bordered
              columns={columns}
              dataSource={dataSource6}
              //loading={loading}
              pagination={false}
              simple
              rowKey={record => record.uuid}
              size="small"
            />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
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
