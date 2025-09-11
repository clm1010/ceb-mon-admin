import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Table } from 'antd'
import {genDictOptsByName} from "../../../utils/FunctionTool"
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const SHOW_ALL = TreeSelect.SHOW_ALL
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const formItemLayout1 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 8,
  },
}
const formItemLayout2 = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 18,
  },
}
const formItemLayout3 = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 8,
  },
}
const formItemLayout4 = {
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
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
	dispatch,
  visible,
  type,
  policyTemplet,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  modalType,
  checkStatus,
  isClose,
  tabstate,
  typeValue,
  stdInfoVal,
  timeList,
  treeNodes,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }

		const onOk = () => {
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				templetModalVisible: false,
			},
		})
	}


	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				templetModalVisible: false,
			},
		})
	}


  const modalOpts = {
    title: '模板详情',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }
	const typeChange = (value) => {
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				typeValue: value,
			},
		})
  }
  const onChange = (activeKey) => {
  	updateTabs(policyTemplet.tabstate.panes, activeKey, policyTemplet.tabstate.newTabIndex)
  }
  const updateTabs = (panes, activeKey, newTabIndex) => {
  	let policyTemplet0 = policyTemplet
  	policyTemplet0.tabstate = {
      			activeKey,
      			panes,
      			newTabIndex,
      		}
  	dispatch({
			type: 'policyInstance/updateTabs',											//抛一个事件给监听这个type的监听器
			payload: {
				policyTemplet: policyTemplet0,
    },
		})
  }
  const onEdit = (targetKey, action) => {

  }
  const add = () => { //所有tabstate前加了policyTemplet
    const panes = tabstate.panes
    const newTabIndex = tabstate.newTabIndex + 1
    const activeKey = `n${newTabIndex}`
    panes.push({ title: `新操作${newTabIndex}`, content: `New Tab Pane${newTabIndex}`, key: activeKey })
    updateTabs(panes, activeKey, newTabIndex)
  }
  const remove = (targetKey) => {
    let activeKey = tabstate.activeKey
    let lastIndex
    tabstate.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const panes = tabstate.panes.filter(pane => pane.key !== (targetKey))
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key
    } else {
    	activeKey = panes[0].key
    }
    updateTabs(panes, activeKey, tabstate.newTabIndex)
  }

const showGroupName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, { value: item.uuid, label: item.name }]
				} else {
					arrs = [{ value: item.uuid, label: item.name }]
				}
			})
		}
		return arrs
	}


  /*
		指标器
	*/
	const onstdIndicatorsInfo = () => {
		/*
			获取指标树节点的所有信息
		*/
		dispatch({
			type: 'stdIndicatorGroup/query',
			payload: {},
		})
		let groupUUID = '' //此处的 groupUUID 需要指标 所在的 分组
		if (item && item.stdIndicator && item.stdIndicator.group && item.stdIndicator.group.length > 0) {
			groupUUID = item.stdIndicator.group[0].uuid
		}
		/*
			获取列表
		*/
		dispatch({
			type: 'policyTemplet/querystdInfo',
			payload: {
				groupUUID,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'policyTemplet/updateState',
			payload: {
				kpiVisible: true,
			},
		})
	}

	const treeProps = {
		//treeData,
		/*value: this.state.value,
		onChange: this.onChange,*/
		//defaultValue: ['0-0-0'],
		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',
		style: {
			width: 300,
		},
	}

	{ /*新操作部分样式变更---start*/ }

	let fowardValue = ''
	const fowardConst = (text) => {
		switch (text) {
			case '>':
			fowardValue = '高于'
			break
			case '>=':
			fowardValue = '高于等于'
			break
			case '<':
			fowardValue = '低于'
			break
			case '<=':
			fowardValue = '低于等于'
			break
			case '=':
			fowardValue = '等于'
			break
		}
	}
	let recoverValue = '可恢复'
	const recoverConst = (record) => {
		if (record.content.recoverType === '1') {
			recoverValue = '可恢复'
		} else {
			recoverValue = '不可恢复'
		}
	}
  	const columns = [
  	{
  		title: '告警名定义',
 	 	dataIndex: 'content.alarmName',
  		key: 'content.alarmName',
  		width: 300,
  	},
  	{
  		title: '恢复类型 ',
 	 	dataIndex: 'recoverType',
  		key: 'recoverType',
  		render: (text, record) => (
    <div onLoad={recoverConst(record)}>{recoverValue}</div>
		),
  	},
  	{
  		title: '监控周期',
 	 	dataIndex: 'content.period',
  		key: 'content.period',
  	},
  	{
  		title: '连续次数',
 	 	dataIndex: 'content.times',
  		key: 'content.times',
  	},
  	{
  		title: '运算符',
 	 	dataIndex: 'content.foward',
  		key: 'content.foward',
  		render: (text, record) => (
    <div onLoad={fowardConst(text)}>{fowardValue}</div>
		),
  	},
  	{
  		title: '数值',
 	 	dataIndex: 'content.value',
  		key: 'content.value',
  	},
  	{
  		title: '原始级别',
 	 	dataIndex: 'content.originalLevel',
  		key: 'content.originalLevel',
  	},
  	{
  		title: '周期内',
 	 	dataIndex: 'content.innderLevel',
  		key: 'content.innderLevel',
  	},
  	{
  		title: '周期外',
 	 	dataIndex: 'content.outerLevel',
  		key: 'content.outerLevel',
  	},
  ]
  	let data = []
  	policyTemplet.tabstate.panes.forEach((pane, i) => {
		data.push(pane)
		data[i].key = i
	})

	{ /*新操作部分样式变更---end*/ }

  return (

    <Modal {...modalOpts} width="600px" height="600px">
      <Form layout="horizontal">
        <Tabs defaultActiveKey="template_1">
          <TabPane tab={<span><Icon type="user" />基本信息</span>} key="template_1">
            <FormItem label="模板名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
            initialValue: policyTemplet.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled />)}
            </FormItem>
            <FormItem label="策略类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('policyType', {
            initialValue: policyTemplet.policyType,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            showSearch
            onChange={typeChange}
            disabled
          >
                {genDictOptsByName('aleatspolicyType')}
            {/*<Select.Option value="NORMAL">普通</Select.Option>*/}
            {/*<Select.Option value="PING">PING</Select.Option>*/}
            {/*<Select.Option value="RPING">RPING</Select.Option>*/}
             </Select>)}
            </FormItem>
            <FormItem label="分组" hasFeedback {...formItemLayout}>
              {getFieldDecorator('group', {
					initialValue: showGroupName(policyTemplet.group), /*此处为字段的值，可以把 item对象 的值放进来*/
					rules: [
					  {
						required: true,
						type: 'array',
					  },
					],
				  })(<TreeSelect {...treeProps} disabled >{treeNodes}</TreeSelect>)}
            </FormItem>
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="template_2">
          <TabPane tab={<span><Icon type="setting" />监控参数</span>} key="template_2">
            <FormItem label="采集间隔" hasFeedback {...formItemLayout4}>
              {getFieldDecorator('collectInterval', {
            initialValue: policyTemplet.collectParams.collectInterval,
            rules: [
              {
                required: true,
              },
            ],
          })(<InputNumber disabled />)}秒
            </FormItem>
            <FormItem label="超时时间" hasFeedback {...formItemLayout4}>
              {getFieldDecorator('timeout', {
            initialValue: policyTemplet.collectParams.timeout,
            rules: [
              {
                required: true,
              },
            ],
          })(<InputNumber disabled />)}秒
            </FormItem>
            {
	      	((typeValue == 'PING') || (typeValue == 'RPING')) ?
  <FormItem label="包大小" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('pktSize', {
		            initialValue: policyTemplet.collectParams.pktSize,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber disabled />)}字节
  </FormItem>
	      	:
	      	null
      	}
            {
	      	((typeValue == 'PING') || (typeValue == 'RPING')) ?
  <FormItem label="包个数" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('pktNum', {
		            initialValue: policyTemplet.collectParams.pktNum,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber disabled />)}
  </FormItem>
	      	:
	      	null
      	}
            {/*
	      	((typeValue=='RPING'))  ?
					<FormItem label="源设备地址" hasFeedback {...formItemLayout4}>
		          {getFieldDecorator('srcDeviceIP', {
		            initialValue: policyTemplet.collectParams.srcDeviceIP,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<Input disabled/>)}
					</FormItem>
	      	:
	      	null
      	*/}
            {/*
	      	((typeValue=='RPING'))  ?
					<FormItem label="源设备超时时间" hasFeedback {...formItemLayout4}>
		          {getFieldDecorator('srcDeviceTimeout', {
		            initialValue: policyTemplet.collectParams.srcDeviceTimeout,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber disabled/>)}
					</FormItem>
	      	:
	      	null
      	*/}
            {
	      	((typeValue == 'RPING')) ?
  <FormItem label="源设备失败重试次数" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('srcDeviceRetries', {
		            initialValue: policyTemplet.collectParams.srcDeviceRetries,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber disabled />)}
  </FormItem>
	      	:
	      	null
      	}
          </TabPane>
        </Tabs>
        <FormItem label="指&nbsp;&nbsp;&nbsp;&nbsp;标" hasFeedback {...formItemLayout}>
          {getFieldDecorator('kpi', {
            initialValue: policyTemplet.monitorParams.indicator.name,
            rules: [
	              {
	                required: true,
	              },
	            ],
          })(<Input readOnly disabled />)}
        </FormItem>
        {/*
          <Tabs
         	  onChange={onChange}
          	activeKey={policyTemplet.tabstate.activeKey}
          	onEdit={onEdit}
          >
            {policyTemplet.tabstate.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>

            	<FormItem label="监控周期" hasFeedback {...formItemLayout}>
          			{getFieldDecorator(`alarmperiod${pane.key}`, {
            			initialValue: pane.content.period,
            			rules: [
	              {
	                required: true,
	              },
	            ],
                })(
                   <Input disabled/>
                )}
             </FormItem>
             <Row>
             <Col span={10}>
             <FormItem label="连续" hasFeedback {...formItemLayout4}>
          			{getFieldDecorator(`times${pane.key}`, {
            			initialValue: pane.content.times,
                })(<InputNumber disabled/>)}次
             </FormItem>
             </Col>
             <Col span={8}>
             <FormItem label="" hasFeedback {...formItemLayout2}>
          			{getFieldDecorator(`foward${pane.key}`, {
            			initialValue: pane.content.foward,
                })(
                	<Select
  					  	placeholder="请选择"
  						disabled >
   					 	<Select.Option key={`${pane.key}>`} value=">">高于</Select.Option>
						<Select.Option key={`${pane.key}>=`} value=">=">高于等于</Select.Option>
    			 	 	<Select.Option key={`${pane.key}<`} value="<">低于</Select.Option>
    			 	 	<Select.Option key={`${pane.key}=<`} value="=<">低于等于</Select.Option>
    			 	 	<Select.Option key={`${pane.key}=`} value="=">等于</Select.Option>
  					</Select>
                )}
             </FormItem>
             </Col>
             <Col span={6}>
            	<FormItem label="" hasFeedback {...formItemLayout2}>
          			{getFieldDecorator(`value${pane.key}`, {
            			initialValue: pane.content.value,
                })(<Input disabled />)}
             </FormItem>
             </Col>
            	</Row>

							<Row>
               <Col span={8}>
            	<FormItem label="原始级别" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`originalLevel${pane.key}`, {
            			initialValue: pane.content.originalLevel,

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					disabled >
   					 	<Select.Option key={`origina_${pane.key}_1`} value="1">1</Select.Option>
    			 	 	<Select.Option key={`origina_${pane.key}_2`} value="2">2</Select.Option>
    			 	 	<Select.Option key={`origina_${pane.key}_3`} value="3">3</Select.Option>
    			 	 	<Select.Option key={`origina_${pane.key}_4`} value="4">4</Select.Option>
    			 	 	<Select.Option key={`origina_${pane.key}_5`} value="5">5</Select.Option>
  					</Select>
                )}
             </FormItem>
             </Col>
             <Col span={8}>
             <FormItem label="周期内" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`innderLevel${pane.key}`, {
            			initialValue: pane.content.innderLevel,

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					disabled >
   					 	<Select.Option key={`innder_${pane.key}_1`} value="1">1</Select.Option>
    			 	 	<Select.Option key={`innder_${pane.key}_2`} value="2">2</Select.Option>
    			 	 	<Select.Option key={`innder_${pane.key}_3`} value="3">3</Select.Option>
    			 	 	<Select.Option key={`innder_${pane.key}_4`} value="4">4</Select.Option>
    			 	 	<Select.Option key={`innder_${pane.key}_5`} value="5">5</Select.Option>
  					</Select>
                )}
             </FormItem>
             </Col>
             <Col span={8}>
             <FormItem label="周期外" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`outerLevel${pane.key}`, {
            			initialValue: pane.content.outerLevel,

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  						disabled >
   					 	<Select.Option key={`outer_${pane.key}_1`} value="1">1</Select.Option>
    			 	 	<Select.Option key={`outer_${pane.key}_2`} value="2">2</Select.Option>
    			 	 	<Select.Option key={`outer_${pane.key}_3`} value="3">3</Select.Option>
    			 	 	<Select.Option key={`outer_${pane.key}_4`} value="4">4</Select.Option>
    			 	 	<Select.Option key={`outer_${pane.key}_5`} value="5">5</Select.Option>
  					</Select>
                )}
             </FormItem>
             </Col>
             </Row>
             	<Row>
             	<Col span={12}>
            	<FormItem label="告警丢弃" hasFeedback {...formItemLayout3} disabled >
          			{getFieldDecorator(`discard_innder${pane.key}`, {
            			valuePropName: 'checked',
                })(
                	<Checkbox.Group defaultValue={pane.content.discard_innder ? ['true'] : []}><Checkbox value="true">周期内</Checkbox></Checkbox.Group>
                )}
             </FormItem>
             </Col>
             <Col span={12}>
             <FormItem label="" hasFeedback {...formItemLayout3} disabled>
          			{getFieldDecorator(`discard_outer${pane.key}`, {
            			valuePropName: 'checked',
                })(
					<Checkbox.Group defaultValue={pane.content.discard_outer ? ['true'] : []}><Checkbox value="true">周期外</Checkbox></Checkbox.Group>
                )}
             </FormItem>
             </Col>
             </Row>
             <FormItem label="告警名定义" hasFeedback {...formItemLayout}>
          			{getFieldDecorator(`alarmName${pane.key}`, {
            			initialValue: pane.content.alarmName,
                })(<Input disabled/>)}
             </FormItem>

            </TabPane>)}

        </Tabs>
				*/}
        {/*新操作部分样式变更---start*/}
        <Tabs defaultActiveKey="templet_3" style={{ marginBottom: 10 }}>
          <TabPane tab={<span><Icon type="exception" />操作详情</span>} key="templet_3">
            <Table
              scroll={{ x: 950 }}
              columns={columns}
              dataSource={data}
              size="small"
              bordered
              pagination={false}
            />
          </TabPane>
        </Tabs>
        {/*新操作部分样式变更---end*/}
        <Row gutter={24}>
          <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="创建人" {...formItemLayout4} >
              {getFieldDecorator('Creater', {
            initialValue: policyTemplet.createdBy,
          })(<Input style={{ width: 100 }} disabled />)}
            </FormItem>
          </Col>
          <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="创建时间" {...formItemLayout4}>
              {getFieldDecorator('CreaterTime', {
            initialValue: policyTemplet.createdTime,
          })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="最后更新人" {...formItemLayout4}>
              {getFieldDecorator('LastCreater', {
            initialValue: policyTemplet.updatedBy,
          })(<Input style={{ width: 100 }} disabled />)}
            </FormItem>
          </Col>
          <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
            <FormItem label="最后更新时间" {...formItemLayout4}>
              {getFieldDecorator('LastCreaterTime', {
            initialValue: policyTemplet.updatedTime,
          })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>

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
