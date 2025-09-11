import React from 'react'
import { Table, Modal, Row, Col, Button ,List } from 'antd'
import { Link } from 'dva/router'
import './list.css'
import fenhang from '../../../utils/fenhang'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, location, batchDelete, choosedRows, policyTemplet, fenzhi,
}) {
//	for(let i = 0;i < dataSource.length; i++) {
//		let obj = dataSource[i]
//		let str = obj.policy.branch
//		for (let j = 0; j < fenhang.length; j++) {
//      		if(str === fenhang[j].key){
//      			dataSource[i].policy.branch = fenhang[j].value
//      		}
//  		}
//	}
	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})
	const onAdd = () => {
		dispatch({
			type: 'policyInstance/showModal',
				payload: {
			  		modalType: 'create',
					currentItem: {
						name: '',
      	    				policyType: 'NORMAL',
						collectParams: {
		      				collectInterval: '',
		      				timeout: '',
		      				retries: '',
		      				pktSize: '',
		      				pktNum: '',
		      				srcDeviceTimeout: '',
		      				srcDeviceRetries: '',
		      			},
      					monitorMethod: {
   		      				toolType: 'ZABBIX',
          				},
          				actionsuuid: '',
						aDiscardActionuuid: '',
						aGradingActionuuid: '',
						aNamingActionuuid: '',
						conditionuuid: '',
						timePerioduuid: '',
					},
					modalVisible: true,
					isClose: false,
					typeValue: 'NORMAL',
					tabstate: {
      					activeKey: 'n1',
     		 			panes: [
     			  		{
     			  			title: '新操作1',
      						key: 'n1',
		      				content: {
		      					uuid: '',
		      					period: '',
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
								mode:'0',
								logicOp:'AND'
		      				},
     			 		},
    		 				],
         			newTabIndex: 1,
      			},
      			stdInfoVal: {},
      			obInfoVal: {},
			}, //payload
		})
	}


	const onDelete = () => {
		//choosedRows.forEach((item) => {
		confirm({
		   title: '您确定要批量删除这些记录吗?',
			onOk () {
			  let ids = []
				choosedRows.forEach(record => ids.push(record.policy.uuid))
			 	dispatch({
					type: 'policyInstance/delete',
					payload: ids,
				})
			},
		})
		//})
	}

	const onIssue = () => {
		confirm({
        		title: '您确定要批量下发这些记录吗?',
        		onOk () {
          		let ids = []
        			choosedRows.forEach(record => ids.push(record.policy.uuid))
          		dispatch({
		        		type: 'policyInstance/issue',
		        		payload: ids,
		      	})
        		},
      	})
	}

  	const onStdIndicator = (record, e) => {
	 	let uuid = ''
	 	if (record && record.policy && record.policy.monitorParams && record.policy.monitorParams.indicator) {
		 	uuid = record.policy.monitorParams.indicator.uuid
	 	}

	 	dispatch({
			type: 'policyInstance/queryIndicatorsOne',
			payload: uuid,
	  	})

	  	dispatch({
			type: 'policyInstance/showModal',
			payload: {
				stdIndVisible: true,
				isClose: false,
			},
	  	})
  	}

  	const openTemplatModal = (record, e) => { //关于模板详情
  		dispatch({
		  	type: 'policyInstance/queryTemplat',
		  	payload: {
		  		uuid: record.policy.template.uuid,
		  	},
	  	})

	   	dispatch({
			type: 'policyInstance/updateState',
			payload: {
				templetModalVisible: true,
				//policyTemplet:policyTemplet0,
			},
		})
  	}

  	const openMosModal = (record, e) => {
		let uuid = ''
		let policyCount = 0
		if (record) {
			uuid = record.policy.uuid
			policyCount = record.mos
		}


		/*
			获取关联实例的数据
		*/
		dispatch({
			type: 'policyInstance/queryMos',
			payload: {
				uuid,
				relatedType: 'POLICY',
			},
		})
		/*
			打开弹出框
		*/
		dispatch({
			type: 'policyInstance/updateState',
			payload: {
				stdUUIDMos: uuid,
				stdMosNumber: policyCount,
				mosVisible: true,
			},
		})
	}

 	const openIndicatorsModal = (record, e) => {
  		let data = record.policy.monitorParams.indicator.group
  		let result = ''
		if (data && data.length > 0) {
			data.forEach((item) => {
				result = `${result + item.name},`
			})
		}
			record.policy.monitorParams.indicator.groupname = result
   		dispatch({
		  	type: 'policyInstance/updateState',
		  	payload: {
		  		indicatorsItem: record.policy.monitorParams.indicator,
			  	indicatorsModalVisible: true,
		  	},
		})
  	}
  	const onSee = (record) => {
			let tabstate = {}
			let panes = []
			if (record.policy.alarmSettings == undefined || record.policy.alarmSettings.length==0) {
				tabstate = {
      				activeKey: 'n1',
     			  	panes: [
              		{
              			title: '新操作1',
      	        			key: 'n1',
      	        			content: {
      	        			uuid: '',
      	         			period: '',
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
		      	        },
              		},
            		],
            		newTabIndex: 1,
          		}
			} else {
				let newTabIndex = 0,
					pane
				for (let operation of record.policy.alarmSettings) {
					let tuuid = ''
					if (operation.timePeriod === undefined) {
						tuuid = ''
					} else {
						tuuid = operation.timePeriod.uuid
					}

					newTabIndex++
          			pane = {
          				title: `新操作${newTabIndex}`,
          				key: (`n${newTabIndex}`),
          				content: {
          					uuid: operation.uuid,
      	         			period: tuuid,
		      		        originalLevel: operation.actions.gradingAction.oriSeverity,
		      		        innderLevel: operation.actions.gradingAction.inPeriodSeverity,
		      		        outerLevel: operation.actions.gradingAction.outPeriodSeverity,
		      		        discard_innder: operation.actions.discardAction.inPeriodDiscard,
		      		        discard_outer: operation.actions.discardAction.outPeriodDiscard,
		      		        alarmName: operation.actions.namingAction.naming,
		      		        recoverType: operation.recoverType,
		      		        // actionsuuid: operation.actions.uuid,
		      		        // aDiscardActionuuid: operation.actions.discardAction.uuid,
							// aGradingActionuuid: operation.actions.gradingAction.uuid,
							// aNamingActionuuid: operation.actions.namingAction.uuid,
		      		        // conditionuuid: operation.condition.uuid,
							  timePerioduuid: operation.timePeriod.uuid,
							  filterItems:operation.conditions,
							  mode:operation.mode.toString(),
							  logicOp:operation.logicOp,
							  expr:operation.expr,
							  exprForFrontend:operation.exprForFrontend,

      	    				},
          			}

          			panes.push(pane)
        			}//for
        			tabstate = {
      				activeKey: 'n1',
     			  	panes,
            			newTabIndex,
        			}
			}
			if (record.policy.collectParams === undefined) {
				  record.policy.collectParams.collectInterval = {
      				collectInterval: '',
      				timeout: '',
      				retries: '',
      				pktSize: '',
      				pktNum: '',
      				srcDeviceTimeout: '',
      				srcDeviceRetries: '',
      	  		}
			}
			if (record.policy.template === undefined) {
				record.policy.template = {
					name: '',
				}
			}

			if (record.policy.monitorMethod === undefined) { //监控工具
				record.policy.monitorMethod = {
					toolType: '',
				}
			}
					//对更新时间和创建时间处理一下
			if (record.policy.createdTime !== 0) {
				let text = record.policy.createdTime
				record.policy.createdTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
			if (record.policy.updatedTime !== 0) {
				let text = record.policy.updatedTime
				record.policy.updatedTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
			}
      		let stdInfoVal = {}
			if (record.policy.monitorParams !== undefined && record.policy.monitorParams.indicator !== undefined) {
				stdInfoVal = record.policy.monitorParams.indicator
			}


			let typename = '实例化'
			if (record.policy.createdFrom == 'FROM_TEMPLATE') {
				typename = '实例化'
			} else if (record.policy.createdFrom == 'MANUAL') {
				typename = '手工'
			} else if (record.policy.createdFrom == 'OTHER') {
				typename = '其他'
			} else {
				typename = '未知'
			}
			record.policy.createdFromName = typename
			//重新检索一遍（对象特征)
			/*dispatch({
        			type: 'policyInstance/queryobjMos',
        			payload: {
        				uuid:record.policy.uuid,
        			},
			  })*/
      		dispatch({
        			type: 'policyInstance/showModal',
        			payload: {
        				modalType: 'update',
        				currentItem: record,
        				modalVisible: true,
        				isClose: false,
			        	tabstate,
			        	typeValue: record.policy.policyType,
			        	//stdInfoVal,
			        	obInfoVal: {},
			        	see: 'yes',
        			},
      		})
	}
	const onEdit = (record) => {
		let tabstate = {}
		let panes = []
		if (record.policy.alarmSettings == undefined || record.policy.alarmSettings.length==0) {
			tabstate = {
				activeKey: 'n1',
				panes: [
				{
					title: '新操作1',
						key: 'n1',
						content: {
						uuid: '',
						period: '',
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
					},
				},
					],
					newTabIndex: 1,
			}
		} else {
			let newTabIndex = 0,
				pane
			for (let operation of record.policy.alarmSettings) {
				let tuuid = ''
				if (operation.timePeriod === undefined) {
					tuuid = ''
				} else {
					tuuid = operation.timePeriod.uuid
				}

				newTabIndex++
				pane = {
					title: `新操作${newTabIndex}`,
					key: (`n${newTabIndex}`),
					content: {
						uuid: operation.uuid,
						period: tuuid,
						originalLevel: operation.actions.gradingAction.oriSeverity,
						innderLevel: operation.actions.gradingAction.inPeriodSeverity,
						outerLevel: operation.actions.gradingAction.outPeriodSeverity,
						discard_innder: operation.actions.discardAction.inPeriodDiscard,
						discard_outer: operation.actions.discardAction.outPeriodDiscard,
						alarmName: operation.actions.namingAction.naming,
						recoverType: operation.recoverType,
						// actionsuuid: operation.actions.uuid,
						// aDiscardActionuuid: operation.actions.discardAction.uuid,
						// aGradingActionuuid: operation.actions.gradingAction.uuid,
						// aNamingActionuuid: operation.actions.namingAction.uuid,
						// conditionuuid: operation.condition.uuid,
							timePerioduuid: operation.timePeriod.uuid,
							filterItems:operation.conditions,
							mode:operation.mode.toString(),
							logicOp:operation.logicOp,
							expr:operation.expr,
							exprForFrontend:operation.exprForFrontend,
						},
				}

				panes.push(pane)
				}//for
				tabstate = {
				activeKey: 'n1',
				panes,
					newTabIndex,
				}
		}
		if (record.policy.collectParams === undefined) {
				record.policy.collectParams.collectInterval = {
				collectInterval: '',
				timeout: '',
				retries: '',
				pktSize: '',
				pktNum: '',
				srcDeviceTimeout: '',
				srcDeviceRetries: '',
			}
		}
		if (record.policy.template === undefined) {
			record.policy.template = {
				name: '',
			}
		}

		if (record.policy.monitorMethod === undefined) { //监控工具
			record.policy.monitorMethod = {
				toolType: '',
			}
		}
				//对更新时间和创建时间处理一下
		if (record.policy.createdTime !== 0) {
			let text = record.policy.createdTime
			record.policy.createdTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		}
		if (record.policy.updatedTime !== 0) {
			let text = record.policy.updatedTime
			record.policy.updatedTime1 = new Date(text).format('yyyy-MM-dd hh:mm:ss')
		}
		let stdInfoVal = {}
		if (record.policy.monitorParams !== undefined && record.policy.monitorParams.indicator !== undefined) {
			stdInfoVal = record.policy.monitorParams.indicator
		}


		let typename = '实例化'
		if (record.policy.createdFrom == 'FROM_TEMPLATE') {
			typename = '实例化'
		} else if (record.policy.createdFrom == 'MANUAL') {
			typename = '手工'
		} else if (record.policy.createdFrom == 'OTHER') {
			typename = '其他'
		} else {
			typename = '未知'
		}
		record.policy.createdFromName = typename
		//重新检索一遍（对象特征)
		/*dispatch({
				type: 'policyInstance/queryobjMos',
				payload: {
					uuid:record.policy.uuid,
				},
		})*/
		dispatch({
				type: 'policyInstance/showModal',
				payload: {
					modalType: 'update',
					currentItem: record,
					modalVisible: true,
					isClose: false,
					tabstate,
					typeValue: record.policy.policyType,
					//stdInfoVal,
					obInfoVal: {},
				},
		})
	}
	const onDeletes = (record) => {
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk () {
				let ids = []
				ids.push(record.policy.uuid)
				dispatch({
					type: 'policyInstance/delete',
					payload: ids,
			})
			},
	})
	}
   	const columns = [
    {
      	title: '策略实例名称',
      	dataIndex: 'policy.name',
      	key: 'policy.name',
	  	width: '10%',
	  	render: (text, record) => <div title={text}>{text}</div>,
	  	className: 'ellipsis',
    }, {
      	title: '模板名称',
     	dataIndex: 'policy.template.name',
      	key: 'policy.template.name',
      	width: 200,
        render: (text, record) => {
	        let params = ''
	      	if (record.policy.template !== undefined && record.policy.template.name !== '') {
	      		//params = <Link onClick={e => openTemplatModal(record, e)}>{text}</Link>
            params = text
	      	} else {
	      		params = '无'
	      	}
			return params
		},
    }, {
      	title: '分支机构',
      	dataIndex: 'policy.branch',
      	key: 'policy.branch',
      	width: 100,
      	render: (text, record) => {
			let typename = maps.get(text)
			return typename
		},
    }, {
      	title: '指标',
      	width: '8%',
      	dataIndex: 'policy.alarmSettings.indicator.name',
      	key: 'policy.alarmSettings.indicator.name',
       	render: (text, record) => {
			   let listData = []
			   let listDatas =[]
			   if (record.policy.alarmSettings === undefined) {
				   return ''
			   }
			   let alarmSettings = record.policy.alarmSettings
				 if (alarmSettings !== undefined) {
				   alarmSettings.forEach((op) => {
					   let conditions = op.conditions
					   if(conditions !==undefined){
						   conditions.forEach((item)=>{
							   let bean = {}
							   bean.name=item.indicator.name
							   bean.uuid = item.indicator.uuid
							   listDatas = listData.filter(c=>c.uuid!=bean.uuid)
							   listDatas.push(bean)
							   listData = listDatas
						   })
					   }
					 })
				   }
				   return(
				   <List
				   size="small"
				   dataSource={listData }
				   renderItem={item => <List.Item>{item.name}</List.Item>}
				   //renderItem={item => <List.Item><a onClick={e => openIndicatorsModal(record, e)}>{item}</a></List.Item>}
				   />
				   )
		},
    }, {
      	title: '告警参数',
      	width: 200,
      	render: (text, record) => {
			let params = ''
			if (record.policy.alarmSettings === undefined) {
				return ''
			}
			let alarmSettings = record.policy.alarmSettings
		  if (alarmSettings !== undefined) {
			  alarmSettings.forEach((op) => {
				  let conditions = op.conditions
				  conditions.forEach((item)=>{
					  if (item.function === 'count') {
						  params += `连续${item.count}次${item.op}${item.threshold};`
					  }else if(item.function === 'last'){
						  params += `最近值:${item.exprRValue};`
					  }else if(item.function === 'nodata' && item.exprRValue=='1'){
						  params += `有数据:${item.threshold};`
					  }else if(item.function === 'nodata' && item.exprRValue=='0'){
						  params += `无数据:${item.threshold};`
					  }else if(item.function === 'regexp' && item.exprRValue=='1'){
						  params += `匹配${item.threshold};`
					  }else if(item.function === 'regexp' && item.exprRValue=='0'){
						  params += `不匹配${item.threshold};`
					  }else if(item.function === '_expr_') {
						  params += `表达式${item.exprLValue}${item.exprOperator}${item.exprRValue};`
					  }
				  })
				  let express = eval("("+op.exprForFrontend+")")
				  if(express !== undefined){
					  let str = ''
					  express.forEach((it)=>{
						  str+=it.name
					  })
					  params += `${str};`
				  }
				  if (record.policy.policyType === 'SYSLOG') {
					  params += `${op.actions.namingAction.naming};`
				  } else {
					  params += `${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
				  }
			  })
		  }
			const typeStyle = <div className="ellipsis" title={params}>{params}</div>
			return typeStyle
		},

    }, {
      	title: '策略类型',
      	width: 70,
        render: (text, record) => {
      		let typename = '普通'
			if (record.policy.policyType == 'NORMAL') {
				typename = '普通'
			} else {
				typename = record.policy.policyType
			}
			return typename
		},

    }, {
      	title: '监控方法',
      	dataIndex: 'policy.monitorMethod.toolType',
      	key: 'policy.monitorMethod.toolType',
      	width: 70,
      	render: (text, record) => {
      		let typename = ''
      		if (record && record.toolPolicys && record.toolPolicys.length > 0) {
				let set = new Set()
      			record.toolPolicys.forEach((bean, index) => {
					if (bean && bean.toolType) {
						if (!set.has(bean.toolType)) {
							set.add(bean.toolType)
							if (index === 0) {
								typename = bean.toolType
							} else {
								typename = `${typename},${bean.toolType}`
							}
						}
					}
					//set.add(bean && bean.toolType ? bean.toolType : '')
				})
      		}
			return typename
	  	},
    }, {
     	title: '监控工具实例',
      	dataIndex: 'toolPolicys',
      	key: 'toolPolicys',
      	width: '8%',
	   	render: (text, record) => {
		   	let toolname = ''
		   	if (text && text.length > 0) {
			   	let myset = new Set()
			   	text.forEach((bean, index) => {
				   	if (index === 0) {
					   	toolname = bean.name
					   	myset.add(bean.name)
				   	} else if (!myset.has(bean.name)) {
						   	toolname = `${toolname},${bean.name}`
						   	myset.add(bean.name)
					   	}
			   	})
		   	}
		   	return toolname
	   	},
    },
    /*{
      title: '下发状态',
      dataIndex: 'policy.issueStatus',
      key: 'policy.issueStatus',
        render: (text, record) => {
      	let typename = '已下发';
				if (record.policy.issueStatus == 'SUCCESS') {
					typename = '已下发';
				} else if (record.policy.issueStatus == 'FAILURE'){
					typename = '下发失败';
				} else if (record.policy.issueStatus == 'UNISSUED'){
					typename = '未下发';
				} else if (record.policy.issueStatus == 'OTHER'){
					typename = '其他';
				} else {
					typename='未知';
				}
				return typename;
			}
    },*/
   	{
      	title: '是否标准策略',
      	dataIndex: 'policy.isStd',
      	key: 'policy.isStd',
      	width: 100,
      	render: (text, record) => {
		  	let typename = '是'
			if (record.policy.isStd == true) {
				typename = '是'
			} else {
				typename = '否'
			}
			return typename
		},
    }, {
      	title: '监控对象数',
      	dataIndex: 'mos',
      	key: 'mos',
      	width: 100,
		render: (text, record, index) => {
      return <div>{text}</div>
        //<Link onClick={e => openMosModal(record, e)}>{text}</Link>
		},
    }, {
      	title: '策略来源',
      	dataIndex: 'policy.createdFrom',
      	key: 'policy.createdFrom',
      	width: 100,
      	render: (text, record) => {
      		let typename = '实例化'
			if (record.policy.createdFrom == 'FROM_TEMPLATE') {
				typename = '实例化'
			} else if (record.policy.createdFrom == 'MANUAL') {
				typename = '手工'
			} else if (record.policy.createdFrom == 'OTHER') {
				typename = '其他'
			} else {
				typename = '未知'
			}
			return typename
		},

    },
		{
			title: '操作',
			key: 'operation',
			width: 120,
			fixed: 'right',
	  	render: (text, record) => {
				return (<div>
  <Button size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onSee(record)} />
  <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
  <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
            </div>)
	  	},
		},
  	]

  	const rowSelection = {
	  	onChange: (selectedRowKeys, selectedRows) => {
	  		let choosed = []
	  		selectedRows.forEach((object) => {
	  				choosed.push = object.id
	  			})
	  		if (selectedRows.length > 0) {
		  		dispatch({
		    			type: 'policyInstance/updateState',
					payload: {
						batchDelete: true,
						choosedRows: selectedRows,
					},
				})
			} else if (selectedRows.length === 0) {
				dispatch({
		    			type: 'policyInstance/updateState',
					payload: {
						batchDelete: false,
						choosedRows: selectedRows,
					},
				})
			}
	  	},

	   	//根据每一行记录的结果，来判断是否可以选
	  	getCheckboxProps: record => ({
		  	disabled: (!!record.policy.isStd),
		  	defaultChecked: false,
	  	}),

	}
  	return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.policy.uuid}
          size="small"
          rowSelection={rowSelection}
          scroll={{ x: 1700 }}
        />
      </Col>
    </Row>
  	)
}

export default list
