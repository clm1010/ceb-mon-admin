import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Select, Tabs, Row, Col, Icon, Table } from 'antd'
import { Link } from 'dva/router'
import {genDictOptsByName} from "../../../../../utils/FunctionTool"
const FormItem = Form.Item
const TabPane = Tabs.TabPane
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
	type,
	dispatch,
  visible,
  item = {},
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
		validateFieldsAndScroll,
  },
  tabstate,
  typeValue,
  stdInfoVal,
  timeList,
  obInfoVal,
  operationType,	//新增策略模板-操作详情部分功能代码
}) => {
	const onOk = () => {
		validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
			let collectParams = {
				  collectInterval: data.collectInterval,
      	  timeout: data.timeout,
      	  retries: data.retries,
      		pktSize: data.pktSize,
      		pktNum: data.pktNum,
      		srcDeviceIP: data.srcDeviceIP,
      		srcDeviceTimeout: data.srcDeviceTimeout,
      		srcDeviceRetries: data.srcDeviceRetries,
      		pktInterval: data.pktInterval,
      		uuid: item.collectParams.uuid,
			}

			let saveitem = {}
			saveitem.moUUID = obInfoVal.uuid
			saveitem.name = data.name
			saveitem.policy = {}
			saveitem.policy.collectParams = collectParams

			let indicator = {
					uuid: stdInfoVal.uuid,
			}
			let monitorParams = {}
			saveitem.policy.monitorParams = monitorParams
			saveitem.policy.monitorParams.indicator = indicator
			saveitem.policy.monitorParams.ops = []
			saveitem.policy.uuid = item.policyuuid

			saveitem.policy.createdFrom = item.createdFrom
			saveitem.policy.isStd = item.isStd
			saveitem.policy.group = item.group
			saveitem.policy.issueStatus = item.issueStatus
			saveitem.policy.name = item.policyname
			saveitem.policy.policyType = data.policyType

			let tool = {}
			tool.toolType = data.tool
			saveitem.tool = tool
			//新增策略模板-操作详情部分功能代码----start
			tabstate.panes.forEach((item) => {
				let op = {
					actions: {
						discardAction: {
							inPeriodDiscard: item.content.discard_innder,
							outPeriodDiscard: item.content.discard_outer,
						},
						gradingAction: {
							oriSeverity: item.content.originalLevel,
							inPeriodSeverity: item.content.innderLevel,
							outPeriodSeverity: item.content.outerLevel,
						},
						namingAction: {
							naming: item.content.alarmName,
						},
					},
					timePeriod: {
						uuid: item.content.period,
					},
					condition: {
						count: item.content.times,
						op: item.content.foward,
						threshold: item.content.value,
					},
					recoverType: item.content.recoverType,
				}
				saveitem.policy.monitorParams.ops.push(op)
			})
			//新增策略模板-操作详情部分功能代码----end
      dispatch({
				type: 'policyRule/updateMonitorInstance',											//抛一个事件给监听这个type的监听器
				payload: saveitem,
		  })
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'policyRule/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				monitorInstanceVisible: false,
			},
		})
	}


  const modalOpts = {
    title: '编辑监控实例',
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
  }
	const typeChange = (value) => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				typeValue: value,
			},
		})
  }
  const onChange = (activeKey) => {
  		updateTabs(tabstate.panes, activeKey, tabstate.newTabIndex)
  	}
  	const updateTabs = (panes, activeKey, newTabIndex) => {
  		dispatch({
			type: 'policyRule/updateState',											//抛一个事件给监听这个type的监听器
			payload: {
				tabstate: {
	      			activeKey,
	      			panes,
	      			newTabIndex,
      			},
			},
		})
  	}
  	const onEdit = (targetKey, action) => {
	    //this[action](targetKey);
	    if (action == 'remove') {
	    		remove(targetKey)
	    } else if (action == 'add') {
	    		add()
	    }
  	}
  	let newContent = {
  		period: '',
  		times: '',
  		foward: '>',
  		value: '',
  		originalLevel: '',
  		innderLevel: '',
  		outerLevel: '',
  		discard_innder: '',
  		discard_outer: '',
  		alarmName: '',
  		recoverType: '1',
  	}
  	const add = () => {
    		const panes = tabstate.panes
    		const newTabIndex = tabstate.newTabIndex + 1
    		const activeKey = `n${newTabIndex}`
    		panes.push({ title: `新操作${newTabIndex}`, content: newContent, key: activeKey })
    		updateTabs(panes, activeKey, newTabIndex)
    		dispatch({
			type: 'policyRule/updateState',
			payload: {
				operationVisible: true,
				operationType: 'add',
			},
		})
  	}
  	const remove = (targetKey) => {
    		let activeKey = tabstate.activeKey
    		let lastIndex
    		tabstate.panes.forEach((pane, i) => {
      		if (pane.key === targetKey.key) {
        			lastIndex = i - 1
      		}
    		})
    		const panes = tabstate.panes.filter(pane => pane.key !== (targetKey.key))
    		if (lastIndex >= 0 && activeKey === targetKey.key) {
      		activeKey = panes[lastIndex].key
    		} else {
    			activeKey = panes[0].key
    		}
    		updateTabs(panes, activeKey, tabstate.newTabIndex)
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
			type: 'policyRule/querystdInfo',
			payload: {
				groupUUID,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				kpiVisible: true,
			},
		})
	}

/*
		选择监控对象
	*/
	const onobjectInfo = () => {
		dispatch({
			type: 'objectMOsModal/query',
			payload: {},
		})
		/*
		dispatch({
			type: `ruleInstance/queryobInfo`,    //抛一个事件给监听这个type的监听器
			payload: {}
		})*/
		dispatch({
			type: 'objectMOsModal/controllerModal',
			payload: {
				modalVisible: true,
				showModalKey: `${new Date().getTime()}`,
				openModalKey: `${new Date().getTime()}`,
			},
		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				selectObjectVisible: true,
			},
		})

		/*
		dispatch({
			type: `objectGroup/query`,
			payload: {},
		})
		dispatch({
			type: `policyRule/queryobInfo`,    //抛一个事件给监听这个type的监听器
			payload: {}
		})
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				selectObjectVisible: true,
			}
		})
		*/
	}

	/*
	const treeProps = {
		//treeData,
		//value: this.state.value,
		//onChange: this.onChange,
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
	*/

	//插入字段
	const insertAtCursor = (buttonID, myValue) => {
		let ids = buttonID
		let myField = document.getElementById(buttonID)
		if (document.selection) {
			myField.focus()
			sel = document.selection.createRange()
			sel.text = myValue
			sel.select()
		} else if (myField.selectionStart || myField.selectionStart == '0') {
			let startPos = myField.selectionStart
			let endPos = myField.selectionEnd
			let restoreTop = myField.scrollTop
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length)
			if (restoreTop > 0) {
				myField.scrollTop = restoreTop
			}
			myField.focus()
			myField.selectionStart = startPos + myValue.length
			myField.selectionEnd = startPos + myValue.length
		} else {
			myField.value += myValue
			myField.focus()
		}
	}

	{ /*新操作部分样式变更---start*/ }
	const newOperation = (record, e) => {
		dispatch({
			type: 'policyRule/updateState',
			payload: {
				operationVisible: true,
				newOperationItem: record,
				operationType: 'edit',
			},
		})
	}

	let mapsPeriod = new Map()
	timeList.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		mapsPeriod.set(keys, values)
	})
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
  		render: (text, record) => (
    <div>{mapsPeriod.get(text)}</div>
  		),
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
  	{
  		title: '操作',
  		key: 'action',
  		width: 150,
      	fixed: 'right',
  		render: (text, record) => (
    <div>
      <a onClick={add} style={{ marginRight: 5 }}>增加</a>
      <a onClick={newOperation.bind(this, record)} style={{ marginRight: 5 }}>编辑</a>
      { tabstate.panes.length === 1 ?
        <a onClick={remove.bind(this, record)} disabled>删除</a> :
        <a onClick={remove.bind(this, record)}>删除</a>
  				}
    </div>
  		),
  	}]
  	let data = []
  	tabstate.panes.forEach((pane, i) => {
		data.push(pane)
		data[i].key = i
	})

  return (

    <Modal {...modalOpts} width="600px" height="600px">
      <Form layout="horizontal">
        <Tabs defaultActiveKey="rule_1">
          <TabPane tab={<span><Icon type="user" />基本信息</span>} key="rule_1">
            <FormItem label="实例名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
            </FormItem>
            <div style={{ position: 'relative' }} id="area1" />
            <FormItem label="策略类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('policyType', {
            initialValue: item.policyType,
            rules: [
              {
                required: true,
              },
            ],
          })(<Select
            showSearch
            onChange={typeChange}
            getPopupContainer={() => document.getElementById('area1')}
          >
                {genDictOptsByName('aleatspolicyType')}
            {/*<Select.Option value="NORMAL">普通</Select.Option>*/}
            {/*<Select.Option value="PING">PING</Select.Option>*/}
            {/*<Select.Option value="RPING">RPING</Select.Option>*/}
             </Select>)}
            </FormItem>
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="rule_2">
          <TabPane tab={<span><Icon type="appstore" />监控工具</span>} key="rule_2">
            <FormItem label="监控工具" hasFeedback {...formItemLayout} >
              {getFieldDecorator('tool', {
           					 initialValue: item.tool,

          			})(<Select >
            <Select.Option value="ZABBIX">ZABBIX</Select.Option>
            <Select.Option value="ITM">ITM</Select.Option>
            <Select.Option value="OVO">OVO</Select.Option>
            {/*<Option value="SYSLOG_EPP">SYSLOG_EPP</Option>*/}
                </Select>)}
            </FormItem>
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="rule_3">
          <TabPane tab={<span><Icon type="global" />监控对象</span>} key="rule_3">
            <FormItem label="监控对象" hasFeedback {...formItemLayout}>
              {getFieldDecorator('object', {
            initialValue: obInfoVal.name,

          })(<Input readOnly onClick={onobjectInfo} />)}
            </FormItem>
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="rule_4">
          <TabPane tab={<span><Icon type="setting" />监控参数</span>} key="rule_4">
            <FormItem label="采集间隔" hasFeedback {...formItemLayout4}>
              {getFieldDecorator('collectInterval', {
            initialValue: item.collectParams.collectInterval,
            rules: [
              {
                required: true,
              },
            ],
          })(<InputNumber />)}秒
            </FormItem>
            <FormItem label="超时时间" hasFeedback {...formItemLayout4}>
              {getFieldDecorator('timeout', {
            initialValue: item.collectParams.timeout,
            rules: [
              {
                required: true,
              },
            ],
          })(<InputNumber />)}秒
            </FormItem>
            {
	      	((typeValue == 'PING') || (typeValue == 'RPING')) ?
  <FormItem label="包大小" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('pktSize', {
		            initialValue: item.collectParams.pktSize,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber />)}字节
  </FormItem>
	      	:
	      	null
      	}
            {
	      	((typeValue == 'PING') || (typeValue == 'RPING')) ?
  <FormItem label="包个数" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('pktNum', {
		            initialValue: item.collectParams.pktNum,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber />)}
  </FormItem>
	      	:
	      	null
      	}
            {
	      	((typeValue == 'RPING')) ?
  <FormItem label="发包间隔" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('rpingPktInterval', {
		            initialValue: (item.collectParams.rpingPktInterval ? item.collectParams.rpingPktInterval : 0),
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber max={60} min={1} />)}
  </FormItem>
	      	:
	      	null
      	}
            {/*
	      	((typeValue=='RPING'))  ?
					<FormItem label="源设备地址" hasFeedback {...formItemLayout4}>
		          {getFieldDecorator('srcDeviceIP', {
		            initialValue: item.collectParams.srcDeviceIP,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<Input />)}
					</FormItem>
	      	:
	      	null
      	*/}
            {/*
	      	((typeValue=='RPING'))  ?
					<FormItem label="源设备SNMP Community" hasFeedback {...formItemLayout4}>
		          {getFieldDecorator('srcDeviceSnmpCommunity', {
		            initialValue: (item.collectParams.srcDeviceSnmpCommunity ? item.collectParams.srcDeviceSnmpCommunity : ''),
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<Input />)}
					</FormItem>
	      	:
	      	null
      	*/}
            {
	      	((typeValue == 'RPING')) ?
  <FormItem label="源设备超时时间" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('srcDeviceTimeout', {
		            initialValue: item.collectParams.srcDeviceTimeout,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber />)}
  </FormItem>
	      	:
	      	null
      	}
            {
	      	((typeValue == 'RPING')) ?
  <FormItem label="源设备失败重试次数" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('srcDeviceRetries', {
		            initialValue: item.collectParams.srcDeviceRetries,
		            rules: [
		              {
		                required: true,
		              },
		            ],
		          })(<InputNumber />)}
  </FormItem>
	      	:
	      	null
      	}
          </TabPane>
          {/*
     </Tabs>
      <FormItem label="指&nbsp;&nbsp;&nbsp;&nbsp;标" hasFeedback {...formItemLayout4}>
          {getFieldDecorator('kpi', {
            initialValue: stdInfoVal.name,

          })(<Input readOnly onClick={onstdIndicatorsInfo}/>)}
      </FormItem>
          <Tabs
         	  onChange={onChange}
          	activeKey={tabstate.activeKey}
          	type="editable-card"
          	onEdit={onEdit}
          >
            {tabstate.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>
            	<div style={{position: 'relative'  }} id={'area3'+pane.key}/>
            	<FormItem label="监控周期" hasFeedback {...formItemLayout}>
          			{getFieldDecorator(`alarmperiod${pane.key}`, {
            			initialValue: pane.content.period,
                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area3'+pane.key)}
  					>
  						{timeList.map(item =>
  							<Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>
						)}
  					</Select>

                )}
             </FormItem>
             <Row>
             <Col span={10}>
             <FormItem label="连续" hasFeedback {...formItemLayout4}>
          			{getFieldDecorator(`times${pane.key}`, {
            			initialValue: pane.content.times,
                })(<InputNumber />)}次
             </FormItem>
             </Col>
             <Col span={8}>
             <div style={{position: 'relative'  }} id={'area4'+pane.key}/>
             <FormItem label="" hasFeedback {...formItemLayout2}>
          			{getFieldDecorator(`foward${pane.key}`, {
            			initialValue: pane.content.foward,
                })(
                	<Select
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area4'+pane.key)}
  					>
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
                })(<Input />)}
             </FormItem>
             </Col>
            	</Row>

							<Row>
               <Col span={8}>
               <div style={{position: 'relative'  }} id={'area5'+pane.key}/>
            	<FormItem label="原始级别" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`originalLevel${pane.key}`, {
						initialValue: (pane.content && pane.content.originalLevel ? `${pane.content.originalLevel}` : ''),

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area5'+pane.key)}
  					>
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
             <div style={{position: 'relative'  }} id={'area6'+pane.key}/>
             <FormItem label="周期内" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`innderLevel${pane.key}`, {
						initialValue: (pane.content && pane.content.innderLevel ? `${pane.content.innderLevel}` : ''),

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area6'+pane.key)}
  					>
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
             <div style={{position: 'relative'  }} id={'area7'+pane.key}/>
             <FormItem label="周期外" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`outerLevel${pane.key}`, {
						initialValue: (pane.content && pane.content.outerLevel ? `${pane.content.outerLevel}` : ''),

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area7'+pane.key)}
  					>
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
            	<FormItem label="告警丢弃" hasFeedback {...formItemLayout3}>
          			{getFieldDecorator(`discard_innder${pane.key}`, {
						//initialValue: (pane.content.discard_innder ? ['true']: []),
            			valuePropName: 'checked',
                })(
                	<Checkbox.Group defaultValue={pane.content.discard_innder ? ['true'] : []}><Checkbox value="true">周期内</Checkbox></Checkbox.Group>
                )}
             </FormItem>
             </Col>
             <Col span={12}>
             <FormItem label="" hasFeedback {...formItemLayout3}>
          			{getFieldDecorator(`discard_outer${pane.key}`, {
            			//initialValue: (pane.content.discard_outer ? ['true'] : []),
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
                })(<Input />)}
             </FormItem>

            </TabPane>)}
           */}
        </Tabs>

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
        {
	(type !== 'create') ?

  <Row gutter={24}>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="创建人" {...formItemLayout4} >
        {getFieldDecorator('Creater', {
            initialValue: item.createdBy,
          })(<Input style={{ width: 100 }} disabled />)}
      </FormItem>
    </Col>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="创建时间" {...formItemLayout4}>
        {getFieldDecorator('CreaterTime', {
            initialValue: item.createdTime,
          })(<Input disabled />)}
      </FormItem>
    </Col>
  </Row>

	: null
	}

        {
	(type !== 'create') ?
  <Row gutter={24}>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="最后更新人" {...formItemLayout4}>
        {getFieldDecorator('LastCreater', {
            initialValue: item.updatedBy,
          })(<Input style={{ width: 100 }} disabled />)}
      </FormItem>
    </Col>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="最后更新时间" {...formItemLayout4}>
        {getFieldDecorator('LastCreaterTime', {
            initialValue: item.updatedTime,
          })(<Input disabled />)}
      </FormItem>
    </Col>
  </Row>
	  : null
	}

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
