import React from 'react'
import { Table, Modal, Row, Col } from 'antd'

const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, pagination, onPageChange, onDeleteItem, onEditItem, isMotion, location, batchDelete, choosedRows,
}) {
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
      				},
     			 },
    		 ],
         newTabIndex: 1,
      },
      kpiid: '',
    	kpiname: '',
			}, //payload
		})
	}


	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          let ids = []
        	choosedRows.forEach(record => ids.push(record.uuid))
          dispatch({
		        type: 'policyInstance/delete',
		        payload: ids,
		      })
        },
      })
	}
	const onIssue = () => {
		confirm({
        title: '您确定要批量下发这些记录吗?',
        onOk () {
          let ids = []
        	choosedRows.forEach(record => ids.push(record.uuid))
          dispatch({
		        type: 'policyInstance/issue',
		        payload: ids,
		      })
        },
      })
	}
	const handleMenuClick = (record, e) => {
    if (e.key === '1') {
			let tabstate = {}
			let panes = []
			if (record.monitorParams == undefined || record.monitorParams.ops == undefined) {
				  tabstate = {
      			activeKey: '1',
     			  panes: [
              {
 title: '新操作1',
      	        key: '1',
      	        content: {
      	         	period: '',
      	        	times: '',
      		        foward: '1',
      		        value: '',
      		        originalLevel: '',
      		        innderLevel: '',
      		        outerLevel: '',
      		        discard_innder: '',
      		        discard_outer: '',
      		        alarmName: '',
      	        },
              },
            ],
            newTabIndex: 1,
          }
			} else {
				let newTabIndex = 0,
pane
					for (let operation of record.monitorParams.ops) {
						let tuuid = ''
					if (operation.timePeriod === undefined) {
						tuuid = ''
					} else {
						tuuid = operation.timePeriod.uuid
					}

					newTabIndex++
          pane = {
          	title: `新操作${newTabIndex}`,
          	key: newTabIndex,
          	content: {
      	         	period: tuuid,
      	        	times: operation.condition.count,
      		        foward: operation.condition.op,
      		        value: operation.condition.threshold,
      		        originalLevel: operation.actions.gradingAction.oriSeverity,
      		        innderLevel: operation.actions.gradingAction.inPeriodSeverity,
      		        outerLevel: operation.actions.gradingAction.outPeriodSeverity,
      		        discard_innder: operation.actions.discardAction.inPeriodDiscard,
      		        discard_outer: operation.actions.discardAction.outPeriodDiscard,
      		        alarmName: operation.actions.namingAction.naming,
      	    },
          }
          panes.push(pane)
        }//for
        tabstate = {
      			activeKey: '1',
     			  panes,
            newTabIndex,
        }
			}

			if (record.collectParams === undefined) {
				  record.collectParams.collectInterval = {
      				collectInterval: '',
      				timeout: '',
      				retries: '',
      				pktSize: '',
      				pktNum: '',
      				srcDeviceTimeout: '',
      				srcDeviceRetries: '',
      	  }
			}
			if (record.template === undefined) {
				  record.template = {
				  	name: '',
				  	}
			}
					//对更新时间和创建时间处理一下
			if (record.createdTime !== 0) {
				let text = record.createdTime
				record.createdTime = new Date(text).toLocaleDateString()
			}
			if (record.updatedTime !== 0) {
				let text = record.updatedTime
				record.updatedTime = new Date(text).toLocaleDateString()
			}

			let kkid = ''
			let kkname = ''

			if (record.monitorParams !== undefined && record.monitorParams.indicator !== undefined) {
				  kkid = record.monitorParams.indicator.uuid
				  kkname = record.monitorParams.indicator.name
			}


			let typename = '实例化'
				if (record.createdFrom == 'FROM_TEMPLATE') {
					typename = '实例化'
				} else {
					typename = '手工'
				}
				record.createdFrom = typename
      dispatch({
        type: 'policyInstance/showModal',
        payload: {
        	modalType: 'update',
        	currentItem: record,
        	modalVisible: true,
        	isClose: false,
        	tabstate,
        	typeValue: record.policyType,
        	kpiid: kkid,
        	kpiname: kkname,
        },
      })
    } else if (e.key === '2') {
      confirm({
        title: '您确定要删除这条记录吗?',
        onOk () {
        	let ids = []
        	ids.push(record.uuid)
          dispatch({
		        type: 'policyInstance/delete',
		        payload: ids,
		      })
        },
      })
    }
  }

   const columns = [
    {
      title: '策略实例名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '模板名称',
      dataIndex: 'template.name',
      key: 'template.name',
       render: (text, record) => {
				let typename = ''
				if (record.template !== undefined && record.template.name !== undefined) {
					typename = record.template.name
			} else {
					typename = '无'
				}
				return typename
			},

    }, {
      title: '指标',
      dataIndex: 'monitorParams.indicator.name',
      key: 'monitorParams.indicator.name',
    }, {
      title: '告警参数',
	  dataIndex: 'alarmParamsCount',
      key: 'alarmParamsCount',
	  width: '30%',
      render: (text, record) => {
      	let params = ''
      	if (record.monitorParams === undefined) {
      		return ''
      	}
      	let ops = record.monitorParams.ops
				if (ops !== undefined) {
					ops.forEach((op) => {
						let fuhao = ''
						if (op.condition.op === '>') {
							fuhao = '高于'
						} else {
							fuhao = '低于'
						}
						params += `连续${op.condition.count}次${fuhao}${op.condition.threshold};${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
					})
				}
				return params
			},

    }, {
      title: '策略类型',
	  dataIndex: 'policyType',
      key: 'policyType',
        render: (text, record) => {
      	let typename = '普通'
				if (record.policyType == 'NORMAL') {
					typename = '普通'
				} else {
					typename = record.policyType
				}
				return typename
			},

    }, {
      title: '监控工具实例',
	  dataIndex: 'toolPolicys',
      key: 'toolPolicys',
	  width: '10%',
        render: (text, record) => {
      	let toolsname = ''

		if (text && text.length > 0) {
			text.forEach((item, index) => {
				if (index === 0) {
					toolsname = item.name
				} else {
					toolsname = `${toolsname},${item.name}`
				}
			})
		}
		return toolsname
		},

    }, {
      title: '下发状态',
      dataIndex: 'issueStatus',
      key: 'issueStatus',
        render: (text, record) => {
			let typename = '已下发'
			if (record.issueStatus == 'SUCCESS') {
				typename = '已下发'
			} else {
				typename = '未下发'
			}
			return typename
		},
    },
   {
      title: '是否标准策略',
      dataIndex: 'isStd',
      key: 'isStd',
      render: (text, record) => {
      	let typename = '是'
				if (record.isStd == true) {
					typename = '是'
				} else {
					typename = '否'
				}
				return typename
			},
    }, {
      title: '策略来源',
      dataIndex: 'createdFrom',
      key: 'createdFrom',

      render: (text, record) => {
      	let typename = '实例化'
				if (record.createdFrom == 'FROM_TEMPLATE') {
					typename = '实例化'
				} else {
					typename = '手工'
				}
				return typename
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
	}


  return (
    <Row gutter={24}>
      {/*<Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ float: 'right', marginTop: 8, marginBottom: 8 }}>
            <Button style={{marginLeft: 8 }} size="small" type="ghost" onClick={onDelete} disabled={batchDelete?false:true} icon="delete" />
            <Button style={{marginLeft: 8 }} size="small" type="primary" onClick={onAdd}>新增策略实例</Button>
            <Button style={{marginLeft: 8 }} size="small" type="ghost" onClick={onIssue}  disabled={batchDelete?false:true}>下发</Button>
        </div>
      </Col>*/}
      {/*rowSelection={rowSelection}*/}
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          onChange={onPageChange}
          pagination={pagination}
          simple
          rowKey={record => record.uuid}
          size="small"
        />
      </Col>
    </Row>
  )
}

export default list
