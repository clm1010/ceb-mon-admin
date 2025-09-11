import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Modal, Select, Tabs, Row, Col, Icon, Cascader, Table, Button } from 'antd'
import { Link } from 'dva/router'
import {genDictOptsByName} from "../../../../../utils/FunctionTool"

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

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
const formItemLayout5 = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
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
  item,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
	validateFieldsAndScroll,
  },
  modalType,
  checkStatus,
  isClose,
  tabstate,
  typeValue,
  stdInfoVal,
  obInfoVal,
  timeList,
  treeNodes,
  treeDataApp,
  fenhang,
  operationType,	//新增策略模板-操作详情部分功能代码
  see,
}) => {
	let icon = ''	//done,success,fail,checking
	if (checkStatus == 'done') { icon = 'reload' } else if (checkStatus == 'success') { icon = 'check' } else if (checkStatus == 'fail') { icon = 'close' } else if (checkStatus == 'checking') { icon = 'loading' }
	let appType = new Array()
  	if (type !== 'create') {
  		let arr = item.policy
		appType[0] = `${arr.componentType}-${arr.componentTypeID}`
		appType[1] = `${arr.component}-${arr.componentID}`
		appType[2] = `${arr.subComponent}-${arr.subComponentID}`
  	}

	const onOk = () => { //弹出窗口点击确定按钮触发的函数
    validateFieldsAndScroll((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      let createdFrom = 'MANUAL'
      if (modalType === 'create') {
      	createdFrom = 'MANUAL'
      } else {
		createdFrom = item.policy.createdFrom
      }
      //新加的策略实例树部分
      let targetGroupUUIDs = []
      let groupData = data.group
      if (groupData && groupData.length > 0) {
				let arrs = []
				groupData.forEach((item) => {
					if (arrs.length > 0) {
						arrs = [...arrs, item.value]
					} else {
						arrs = [item.value]
					}
				})
				targetGroupUUIDs = arrs
			}
			let arr = data.applicationtype
			let arrComponentType = ''
			let arrComponent = ''
			let arrSubComponent = ''
			if (arr) {
				arrComponentType = arr[0].split('-')
				arrComponent = arr[1].split('-')
				arrSubComponent = arr[2].split('-')
			}
      const payload = {
      	 monitorMethod: {//监控工具
   		     toolType: data.toolType,
         },
      	name: (data.name ? data.name : ''),
      	policyType: data.policyType,
      	createdFrom,
      	component: arrComponent[0],
			componentID: arrComponent[1],
			componentType: (arrComponentType[0] ? arrComponentType[0] : ''),
			componentTypeID: (arrComponentType[1] ? arrComponentType[1] : ''),
			subComponent: arrSubComponent[0],
			subComponentID: arrSubComponent[1],
			branch: data.branch,
      	collectParams: {
      		collectInterval: data.collectInterval,
      		timeout: data.timeout,
      		retries: data.retries,
      		pktSize: data.pktSize,
      		pktNum: data.pktNum,
        	srcDeviceIP: data.srcDeviceIP,
      		srcDeviceTimeout: data.srcDeviceTimeout,
      		srcDeviceRetries: data.srcDeviceRetries,
			uuid: (item.policy && item.policy.collectParams ? item.policy.collectParams.uuid : ''),
			pktInterval: data.pktInterval,
			srcDeviceSnmpCommunity: data.srcDeviceSnmpCommunity,
      	},
      	targetGroupUUIDs, //新加的策略实例树部分
      	monitorParams: {
      		 indicator: {
      			 	uuid: stdInfoVal.uuid,
      			 },
      			ops: [],
				uuid: (item && item.policy && item.policy.monitorParams ? item.policy.monitorParams.uuid : ''),
      	},
      	moUUIDs: [obInfoVal.uuid],

      }

			//新增策略模板-操作详情部分功能代码----start
			tabstate.panes.forEach((infos) => {
				let op = {
					actions: {
						discardAction: {
							inPeriodDiscard: infos.content.discard_innder,
							outPeriodDiscard: infos.content.discard_outer,
							uuid: infos.content.aDiscardActionuuid,
						},
						gradingAction: {
							oriSeverity: infos.content.originalLevel,
							inPeriodSeverity: infos.content.innderLevel,
							outPeriodSeverity: infos.content.outerLevel,
							uuid: infos.content.aGradingActionuuid,
						},
						namingAction: {
							naming: infos.content.alarmName,
							uuid: infos.content.aNamingActionuuid,
						},
						uuid: infos.content.actionsuuid,
					},
					timePeriod: {
						uuid: infos.content.period,
					},
					condition: {
						count: infos.content.times,
						op: infos.content.foward,
						threshold: infos.content.value,
						extOp: infos.content.extOp,
						extThreshold: infos.content.extThreshold,
						useExt: infos.content.useExt,
						uuid: infos.content.conditionuuid,
					},
					uuid: ((infos.content.uuid !== '') ? infos.content.uuid : ''),
					recoverType: infos.content.recoverType,
				}
				payload.monitorParams.ops.push(op)
			})
			//新增策略模板-操作详情部分功能代码----end
	    resetFields()

	    payload.isStd = item.policy.isStd //非标准
	    payload.issueStatus = 'UNISSUED' //未下发
	   // payload.createdFrom="MANUAL";   //手动
	    //payload.moUUIDs.push("6d1fae9f-bc5e-422b-90ad-2b61bcf67b9e");
      dispatch({
				type: `policyInstance/${type}`,											//抛一个事件给监听这个type的监听器
				payload,
			})
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'policyInstance/hideModal',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: false,
				isClose: true,
				see: 'no',
			},
		})
	}


  const modalOpts = {
    title: type === 'create' && see === 'no' ? '新增策略实例' : type === 'update' && see === 'no' ? '编辑策略实例' : type === 'update' && see === 'yes' ? '查看策略实例' : null,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
	maskClosable: false,
	zIndex:102,
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
  		updateTabs(tabstate.panes, activeKey, tabstate.newTabIndex)
  	}
  	const updateTabs = (panes, activeKey, newTabIndex) => {
  		dispatch({
			type: 'policyInstance/updateState',											//抛一个事件给监听这个type的监听器
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
  		uuid: '',
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
  		actionsuuid: '',
		  aDiscardActionuuid: '',
			aGradingActionuuid: '',
			aNamingActionuuid: '',
		  conditionuuid: '',
		  timePerioduuid: '',
		  useExt: false, //是否使用扩展条件
			extOp: '<', //扩展条件
			extThreshold: '', //扩展阈值
  	}
  	const add = () => {
    		const panes = tabstate.panes
    		const newTabIndex = tabstate.newTabIndex + 1
    		const activeKey = `n${newTabIndex}`
    		panes.push({ title: `新操作${newTabIndex}`, content: newContent, key: activeKey })
    		updateTabs(panes, activeKey, newTabIndex)
    		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				operationVisible: true,
				operationType: 'add',
			},
		})
  	}

  	//数值验证
		const blurFunctions = (rulr, value, callback) => {
			let regx = /^\+?[1-9][0-9]*$/
			if (!regx.test(value)) {
			    callback('Please enter a positive integer！')
			} else {
				callback()
			}
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
	监控工具实例的显示
  */
  const showToolPolicys = (toolpolicy) => {
	  let toolname = ''
	  if (toolpolicy && toolpolicy.length > 0) {
		  toolpolicy.forEach((bean, index) => {
			  if (index === 0) {
				  toolname = bean.name
			  } else {
				  toolname = `${toolname},${bean.name}`
			  }
		  })
	  }
	  return toolname
  }

	/*
		监控对象
	*/
	const onobjectInfo = () => {
	/*
			获取对象树节点的所有信息
		*/
		dispatch({
			type: 'objects/query',
			payload: {},
		})
		/*
			获取列表
		*/
		dispatch({
			type: 'policyInstance/queryobInfo', //抛一个事件给监听这个type的监听器
			payload: {

			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				objectVisible: true,
			},
		})
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
			type: 'policyInstance/querystdInfo', //抛一个事件给监听这个type的监听器
			payload: {
				 groupUUID,
			},
		})

		/*
			打开弹出框
		*/
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				kpiVisible: true,
			},
		})
	}

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
			type: 'policyInstance/updateState',
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

	{ /*新操作部分样式变更---end*/ }
  return (

    <Modal {...modalOpts}
      width="600px"
      footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
        <Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
    >
      <Form layout="horizontal">
        <Tabs defaultActiveKey="policy_1">
          <TabPane tab={<span><Icon type="user" />基本信息</span>} key="policy_1">
            {
	      	((modalType == 'create')) ?
  <FormItem label="策略实例名称" hasFeedback {...formItemLayout}>
    {getFieldDecorator('name', {
            initialValue: (item.policy.name ? item.policy.name : ''),
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
  </FormItem>
        	:
	      	null
      	}
            {
	      	((modalType == 'update')) ?
  <FormItem label="策略实例名称" hasFeedback {...formItemLayout}>
    {getFieldDecorator('name', {
            initialValue: (item.policy.name ? item.policy.name : ''),
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled />)}
  </FormItem>
	      	:
	      	null
      	}

            {
	      	((modalType == 'update')) ?
  <FormItem label="模板名称" hasFeedback {...formItemLayout}>
    {getFieldDecorator('tname', {
		            initialValue: (item.policy.template.name ? item.policy.template.name : ''),
		          })(<Input disabled />)}
  </FormItem>
	      	:
	      	null
      	}
            <div style={{ position: 'relative' }} id="area1" />
            {
	      	((modalType == 'create')) ?
  <FormItem label="策略类型" hasFeedback {...formItemLayout}>
    {getFieldDecorator('policyType', {
            initialValue: (item.policy.policyType ? item.policy.policyType : ''),
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
            {/*<Select.Option value="SYSLOG">SYSLOG</Select.Option>*/}
             </Select >)}
  </FormItem>

	      	:
	      	null
      	}
            {
	      	((modalType == 'update')) ?
  <FormItem label="策略类型" hasFeedback {...formItemLayout}>
    {getFieldDecorator('policyType', {
            initialValue: (item.policy.policyType ? item.policy.policyType : ''),
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
            {/*<Select.Option value="SYSLOG">SYSLOG</Select.Option>*/}
             </Select>)}
  </FormItem>
        	:
	      	null
      	}
            {
	      	((modalType == 'update')) ?
  <FormItem label="策略应用类型" {...formItemLayout}>
    {getFieldDecorator('applicationtype', {
					initialValue: ((type !== 'create') ? appType : null), /*此处为字段的值，可以把 item对象 的值放进来*/
					rules: [
					{
						//required: true,
						type: 'array',
					},
					],
				})(<Cascader options={treeDataApp} disabled />)}
  </FormItem>
			:
	      	null
      	}
            {
      		((modalType == 'update'))	?
        <div>
          <div style={{ position: 'relative' }} id="area2" />
          <FormItem label="分支机构" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branch', {
	            	initialValue: (item.policy.branch ? item.policy.branch : ''),
	         	})(<Select
  showSearch
  disabled
  getPopupContainer={() => document.getElementById('area2')}
	         	>
  {fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
              </Select>)}
          </FormItem>
        </div>
      		:
      			null
      	}
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="policy_2">
          <TabPane tab={<span><Icon type="tool" />监控工具</span>} key="policy_2">
            <div style={{ position: 'relative' }} id="area1" />
            {
	      	((modalType == 'update')) ?
  <FormItem label="监控工具实例" hasFeedback {...formItemLayout}>
    {getFieldDecorator('toolPolicys', {
		            initialValue: showToolPolicys(item.toolPolicys),
		          })(<Input disabled />)}
  </FormItem>
	      	:
	      	null
      	}
          </TabPane>
        </Tabs>
        <Tabs defaultActiveKey="policy_3">
          <TabPane tab={<span><Icon type="setting" />监控参数</span>} key="policy_3">

            {/*<FormItem label="采集参数uuid" style={{ display : 'none' }} {...formItemLayout4}>
          {getFieldDecorator('collectUUID', {
            initialValue: item.policy.collectParams.uuid,
          })(<Input disabled/>)}
        </FormItem>*/}

            <FormItem label="采集间隔" hasFeedback {...formItemLayout4}>
              {getFieldDecorator('collectInterval', {
            initialValue: (item.policy.collectParams.collectInterval ? item.policy.collectParams.collectInterval : ''),
            rules: [
              {
                required: true,
              },
              {
	              validator: blurFunctions,
	            },
            ],
          })(<InputNumber />)}秒
            </FormItem>
            <FormItem label="超时时间" hasFeedback {...formItemLayout4}>
              {getFieldDecorator('timeout', {
            initialValue: (item.policy.collectParams.timeout ? item.policy.collectParams.timeout : ''),
            rules: [
              {
                required: true,
              },
              {
              	validator: blurFunctions,
              },
            ],
          })(<InputNumber />)}秒
            </FormItem>

            {
	      	((typeValue == 'PING') || (typeValue == 'RPING')) ?
  <FormItem label="包大小(字节)" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('pktSize', {
		            initialValue: (item.policy.collectParams.pktSize ? item.policy.collectParams.pktSize : ''),
		            rules: [
		              {
		                required: true,
		              },
		              {
		              	validator: blurFunctions,
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
		            initialValue: (item.policy.collectParams.pktNum ? item.policy.collectParams.pktNum : ''),
		            rules: [
		              {
		                required: true,
		              },
		              {
										validator: blurFunctions,
		              },
		            ],
		         })(<InputNumber />)}
  </FormItem>
	      	:
	      	null
      	}
            {
	      	((typeValue == 'PING') || (typeValue == 'RPING')) ?
  <FormItem label="发包间隔" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('pktInterval', {
		            initialValue: (item.policy.collectParams.pktInterval ? item.policy.collectParams.pktInterval : 1),
		            rules: [
		              {
		                required: true,
		              },
		              {
		              	validator: blurFunctions,
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
		            initialValue: (item.policy.collectParams.srcDeviceIP ? item.policy.collectParams.srcDeviceIP : ''),
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
		            initialValue: (item.policy.collectParams.srcDeviceSnmpCommunity ? item.policy.collectParams.srcDeviceSnmpCommunity : ''),
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
		            initialValue: (item.policy.collectParams.srcDeviceTimeout ? item.policy.collectParams.srcDeviceTimeout : ''),
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
		            initialValue: (item.policy.collectParams.srcDeviceRetries ? item.policy.collectParams.srcDeviceRetries : ''),
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
        </Tabs>

        {
	     ((modalType == 'create')) ?
  <FormItem label="监控指标" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('kpi', {
				initialValue: (stdInfoVal.name ? stdInfoVal.name : ''),
				rules: [
	              {
	                required: true,
	              },
	            ],
			  })(<Input readOnly onClick={onstdIndicatorsInfo} />)}
  </FormItem>
			:
				null
      	}

        {
	     ((modalType == 'update')) ?
  <FormItem label="监控指标" hasFeedback {...formItemLayout4}>
    {getFieldDecorator('kpi', {
				initialValue: (stdInfoVal.name ? stdInfoVal.name : ''),
				rules: [
	              {
	                required: true,
	              },
	            ],
			  })(<Input readOnly onClick={onstdIndicatorsInfo} disabled />)}
  </FormItem>
			:
				null
      	}

        {/*<FormItem label="监控操作uuid" style={{ display : 'none' }} {...formItemLayout4}>
          {getFieldDecorator('monitorUUID', {
            initialValue: (item && item.policy && item.policy.monitorParams ? item.policy.monitorParams.uuid : ''),
          })(<Input disabled/>)}
		</FormItem>*/}
        {/*
          <Tabs
         	  onChange={onChange}
          	activeKey={tabstate.activeKey}
          	type="editable-card"
          	onEdit={onEdit}
          >
            {tabstate.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>
            	<div style={{position: 'relative'  }} id={'area2'+pane.key}/>
            	<FormItem label="监控周期" hasFeedback {...formItemLayout}>
          			{getFieldDecorator(`alarmperiod${pane.key}`, {
            			initialValue: pane.content.period,
            			rules: [
		              {
		                required: true,
		              },
		            ],
                  })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area2'+pane.key)}
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
              <div style={{position: 'relative'  }} id={'area3'+pane.key}/>
             <FormItem label="" hasFeedback {...formItemLayout2}>
          			{getFieldDecorator(`foward${pane.key}`, {
            			initialValue: pane.content.foward,
            		  })(
                	<Select
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area3'+pane.key)}
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
               <div style={{position: 'relative'  }} id={'area4'+pane.key}/>
            	<FormItem label="原始级别" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`originalLevel${pane.key}`, {
            			initialValue: (pane.content && pane.content.originalLevel ? `${pane.content.originalLevel}` : ''),

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area4'+pane.key)}
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
              <div style={{position: 'relative'  }} id={'area5'+pane.key}/>
             <FormItem label="周期内" hasFeedback {...formItemLayout1}>
          			{getFieldDecorator(`innderLevel${pane.key}`, {
            			initialValue: (pane.content && pane.content.innderLevel ? `${pane.content.innderLevel}` : ''),

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area5'+pane.key)}
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
             <div style={{position: 'relative'  }} id={'area6'+pane.key}/>
             <FormItem label="周期外" hasFeedback {...formItemLayout1}>
          		{getFieldDecorator(`outerLevel${pane.key}`, {
            			initialValue: (pane.content && pane.content.outerLevel ? `${pane.content.outerLevel}` : ''),

                })(
                	<Select
    					showSearch
  					  	placeholder="请选择"
  					  	getPopupContainer={() => document.getElementById('area6'+pane.key)}
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

             <div className = {myStyle.buttonPart}>
			 	<Button onClick={insertAtCursor.bind(this,`alarmName${pane.key}`,' MO_SERVER_NAME ')}>主机名</Button>
			 	<Button onClick={insertAtCursor.bind(this,`alarmName${pane.key}`,' MO_IP ')}>IP</Button>
			 	<Button onClick={insertAtCursor.bind(this,`alarmName${pane.key}`,' MO_NAME ')}>名称</Button>
			 </div>

             <FormItem label="告警名定义" hasFeedback {...formItemLayout}>
          			{getFieldDecorator(`alarmName${pane.key}`, {
            			initialValue: pane.content.alarmName,
                })(<Input />)}
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

        <FormItem label="策略来源" hasFeedback {...formItemLayout}>
          {getFieldDecorator('createdFrom', {
		         initialValue: (item.policy.createdFromName ? item.policy.createdFromName : ''),
		    })(<Input disabled />)}
        </FormItem>


        {
	(type !== 'create') ?

  <Row gutter={24}>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="创建人" {...formItemLayout4} >
        {getFieldDecorator('Creater', {
            initialValue: (item.policy.createdBy ? item.policy.createdBy : ''),
          })(<Input style={{ width: 100 }} disabled />)}
      </FormItem>
    </Col>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="创建时间" {...formItemLayout4}>
        {getFieldDecorator('CreaterTime', {
            initialValue: (item.policy.createdTime1 ? item.policy.createdTime1 : ''),
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
            initialValue: (item.policy.updatedBy ? item.policy.updatedBy : ''),
          })(<Input style={{ width: 100 }} disabled />)}
      </FormItem>
    </Col>
    <Col xl={{ span: 12 }} md={{ span: 12 }} sm={{ span: 12 }}>
      <FormItem label="最后更新时间" {...formItemLayout4}>
        {getFieldDecorator('LastCreaterTime', {
            initialValue: (item.policy.updatedTime1 ? item.policy.updatedTime1 : ''),
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
