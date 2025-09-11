import React from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
const TabPane = Tabs.TabPane
const confirm = Modal.confirm

function list ({
 dispatch, loading, dataSource, dataSource2, pagination, paginationMan, onPageChange, onDeleteItem, onEditItem, isMotion, location, batchDelete, choosedRows, tabShowPage, fenhang, branchs, checkAll, user,
}) {
	//判断下发状态权限---start
	let issueRoles = false
	if (!user) {
		issueRoles = false
	} else {
		let roles = user.roles
		let rolesArr = []
		for (let i = 0; i < roles.length; i++) {
			let permissions = roles[i].permissions
			for (let j = 0; j < permissions.length; j++) {
				if (permissions[j].action === 'ISSUE' && permissions[j].name === 'RULE') {
					issueRoles = true
				}
			}
		}
	}
	//end

	let maps = new Map()
	fenhang.forEach((obj, index) => {
		let keys = obj.key
		let values = obj.value
		maps.set(keys, values)
	})

//	for(let i = 0;i < dataSource.length; i++) {
//		let obj = dataSource[i]
//		let str = obj.instance.branch
//		for (let j = 0; j < fenhang.length; j++) {
//      		if(str === fenhang[j].key){
//      			dataSource[i].instance.branch = fenhang[j].value
//      		}
//  		}
//	}
//
//	for(let j = 0;j < dataSource2.length; j++) {
//		let obj = dataSource2[j]
//		let str = obj.branch
//		for (let k = 0; k < fenhang.length; k++) {
//      		if(str === fenhang[k].key){
//      			dataSource2[j].branch = fenhang[k].value
//      		}
//  		}
//	}
	const onAdd = () => {
		dispatch({
			type: 'ruleInstance/addInstance',
			payload: {
				monitorInstanceType: 'create',
				MonitorInstanceItem: {
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

				tabstate: {
					activeKey: 'n1',
						panes: [
						  {
 title: '新操作1',
							key: 'n1',
							content: {
								uuid: '',
								period: '',
								times: '',
								foward: '>',
								value: '',
								originalLevel: '',
								innderLevel: '',
								outerLevel: '',
								discard_innder: false,
								discard_outer: false,
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
							},
						 },
					 ],
					newTabIndex: 1,
				},

			},

		})
	}

	const onDelete = () => {
		confirm({
        title: '您确定要批量删除这些记录吗?',
        onOk () {
          dispatch({
		        type: 'ruleInstance/delete',
		        payload: choosedRows,
		      })
        },
      })
	}

	const onIssue = () => {
//		confirm({
//      		title: '您确定要批量下发这些记录吗?',
//      		onOk () {
//        		let ids = [];
//      			//choosedRows.forEach(record => ids.push(record.policy.uuid));
//        		dispatch({
//		        		type: 'ruleInstance/issue',
//		        		payload: {},
//		      	})
//      		},
//    	})

		let criteriaArr = []
		fenhang.forEach((item) => {
			criteriaArr.push(item.key)
		})
		//查询所有分行下发状态
		dispatch({
			type: 'ruleInstance/status',
			payload: {
				criteriaArr,
			},
		})

		dispatch({
			type: 'ruleInstance/showRuleModal',
			payload: {
				branchsType: 'edit',
				branchsVisible: true,
				checkAll,
				checkedList: [],
				ruleInstanceKey: `${new Date().getTime()}`,
			},
		})
	}
	//错误信息的弹出框
	const openErrorModal = (text, record, e) => {
		if (text === 'FAILURE') {
			dispatch({
				type: 'ruleInstance/errorInfsrule',
				payload: {
					uuid: record.instance.uuid,
				},
			})
		}
	}

  	//监控实例数弹窗
  	const openInfsModal = (record, e) => {
		let uuid = ''
		let count = 0
		if (record) {
			uuid = record.instance.rule.uuid
			count = record.instanceNum
		}
		/*
			获取接口数据
		*/
		dispatch({
			type: 'ruleInstance/queryInfsrule',
			payload: {
				uuid,
			},
		})

		/*
			打开
		*/
		dispatch({
			type: 'ruleInstance/showRuleModal',
			payload: {
				ruleUUID: uuid,
				ruleInfsNumber: count,
				ruleInfsVisible: true,
			},
		})
	}//end
	const onDeletes = (record) => {
		confirm({
			title: '您确定要删除这条记录吗?',
			onOk () {
				let ids = []

				ids.push(record.instance.uuid)
				dispatch({
					type: 'ruleInstance/delete',
					payload: ids,
				})
			},
	})
	}
	const onEdit = (record) => {
		let branchs = record.instance.branch
		dispatch({
	type: 'ruleInstance/updateState',													//抛一个事件给监听这个type的监听器
	payload: {
		branchs,
	},
})
	dispatch({
		type: 'ruleInstance/queryMonitorInstanceById',	//抛一个事件给监听这个type的监听器
		payload: {
			uuid: record.instance.uuid,
		},
	})
	}
  	const onSee = (record) => {
			let branchs = record.instance.branch
			dispatch({
		type: 'ruleInstance/updateState',													//抛一个事件给监听这个type的监听器
		payload: {
			branchs,
			see: 'yes',
		},
	})
		dispatch({
			type: 'ruleInstance/queryMonitorInstanceById',	//抛一个事件给监听这个type的监听器
			payload: {
				uuid: record.instance.uuid,
			},
		})
  	}
  const columns = [
    {

      	title: '策略规则',
      	dataIndex: 'instance.rule.name',
      	key: 'instance.rule.name',

    }, {
      	title: '分支机构',
      	dataIndex: 'instance.branch',
      	key: 'instance.branch',
		width: 100,
		render: (text, record) => {
			let typename = maps.get(text)
  			return typename
		},
    }, {
      	title: '监控实例',
      	dataIndex: 'instance.name',
      	key: 'instance.name',
		width: '15%',
    }, {

      	title: '监控实例数',
      	dataIndex: 'instanceNum',
      	key: 'instanceNum',
      	//弹窗
      	render: (text, record) => {
		  	let count = record.instanceNum
      		return <a onClick={e => openInfsModal(record, e)}>{count}</a>
      	},
    }, {
      	title: '对象',
      	dataIndex: 'instance.mo.name',
      	key: 'instance.mo.name',
    }, {
      	title: '监控工具实例',
      	dataIndex: 'instance.toolInst.name',
      	key: 'instance.toolInst.name',
    }, {
      	title: '策略实例',
      	dataIndex: 'instance.policy.name',
      	key: 'instance.policy.name',
		width: '15%',
    }, {
      	title: '下发状态',
      	dataIndex: 'instance.issueStatus',
      	key: 'instance.issueStatus',
		render: (text, record) => {
      	let typename = '已下发'
			if (text == 'SUCCESS') {
				typename = '已下发'
			} else if (text == 'FAILURE') {
				typename = '下发失败'
			} else if (text == 'UNISSUED') {
				typename = '未下发'
			} else if (text == 'OTHER') {
				typename = '其他'
			} else {
				typename = '未知'
			}
			return <a onClick={e => openErrorModal(text, record, e)}>{typename}</a>
		},
    }, {
      	title: '是否标准',
      	dataIndex: 'instance.policy.isStd',
      	key: 'instance.policy.isStd',
      	render: (text, record) => {
      	  let typename = '是'
			    if (record.instance.policy.isStd == true) {
				    typename = '是'
			    } else {
				    typename = '否'
			    }
			    return typename
		   },
    }, {
      	title: '来源',
      	dataIndex: 'instance.policy.createdFrom',
      	key: 'instance.policy.createdFrom',
      	render: (text, record) => {
      	  let typename = ''
			    if (record.instance.policy.createdFrom === 'MANUAL') {
				    typename = '手工'
			    } else if (record.instance.policy.createdFrom === 'FROM_TEMPLATE') {
				    typename = '实例化'
			    } else {
			    	typename = '未知'
			    }
			    return typename
		   },
    },
		{
	  	title: '操作',
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
  	const columns2 = [
    {
      	title: '监控实例',
      	dataIndex: 'name',
      	key: 'name',
		width: '15%',
    }, {
      	title: '对象',
      	dataIndex: 'mo.name',
      	key: 'mo.name',
    }, {
      	title: '分支机构 ',
      	dataIndex: 'branch',
      	key: 'branch',
      	render: (text, record) => {
			let typename = maps.get(text)
  			return typename
		},
    }, {
      	title: '监控工具实例',
      	dataIndex: 'toolInst.name',
      	key: 'toolInst.name',
    }, {
      	title: '策略实例',
      	dataIndex: 'policy.name',
      	key: 'policy.name',
		width: '15%',
    }, {
      	title: '下发状态',
      	dataIndex: 'issueStatus',
      	key: 'issueStatus',
		render: (text, record) => {
      	let typename = '已下发'
			if (text == 'SUCCESS') {
				typename = '已下发'
			} else if (text == 'FAILURE') {
				typename = '下发失败'
			} else if (text == 'UNISSUED') {
				typename = '未下发'
			} else if (text == 'OTHER') {
				typename = '其他'
			} else {
				typename = '未知'
			}
			return <a onClick={e => openErrorModal(text, record, e)}>{typename}</a>
		},
		/*
      	render: (text, record) => {
      	  let typename = '是';
			    if (record.issueStatus === 'UNISSUED') {
				    typename = '否';
			    } else {
				    typename='是';
			    }
			    return typename;
		   }
		 */
    }, {
      	title: '是否标准',
      	dataIndex: 'policy.isStd',
      	key: 'policy.isStd',
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
      	title: '来源',
      	dataIndex: 'createdFrom',
      	key: 'createdFrom',
      	render: (text, record) => {
      	  let typename = ''
			    if (record.createdFrom === 'MANUAL') {
				    typename = '手工'
			    } else if (record.createdFrom === 'FROM_TEMPLATE') {
				    typename = '实例化'
			    } else {
			    	typename = '未知'
			    }
			    return typename
		   },
    },
		{
	  	title: '操作',
	  	width: 120,
	  	fixed: 'right',
	  	render: (text, record) => {
				return (<div>
  <Button size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onSee1(record)} />
  <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit1(record)} />
  <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes1(record)} />
            </div>)
	  	},
		},
		]

		const onDeletes1 = (record) => {
			confirm({
				title: '您确定要删除这条记录吗?',
				onOk () {
					let ids = []

					ids.push(record.uuid)
					dispatch({
						type: 'ruleInstance/delete',
						payload: ids,
				})
				},
		})
		}
		const onEdit1 = (record) => {
			let branchs = record.branch
			dispatch({
		type: 'ruleInstance/updateState',													//抛一个事件给监听这个type的监听器
		payload: {
			branchs,
		},
	})
			dispatch({
				type: 'ruleInstance/queryMonitorInstanceById',													//抛一个事件给监听这个type的监听器
				payload: {
					uuid: record.uuid,
				},
		})
		}
			const onSee1 = (record) => {
				let branchs = record.branch
				dispatch({
			type: 'ruleInstance/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				branchs,
				see: 'yes',
			},
		})
				dispatch({
					type: 'ruleInstance/queryMonitorInstanceById',													//抛一个事件给监听这个type的监听器
					payload: {
						uuid: record.uuid,
					},
			})
			}

  	const rowSelection = {
	  	onChange: (selectedRowKeys, selectedRows) => {
	  		let choosed = []
	  		selectedRows.forEach((object) => {
	  				choosed.push(object.instance.uuid)
	  			})
		  	dispatch({
		  		type: 'ruleInstance/updateState',
				  payload: {
					  choosedRows: choosed,
					  batchDelete: choosed.length > 0,
				  },
			})
	  	},
		 //根据每一行记录的结果，来判断是否可以选
		  getCheckboxProps: record => ({
			  disabled: (!!record.instance.policy.isStd),
			  defaultChecked: false,
		  }),
	  }
  	const rowSelection2 = {
	  	onChange: (selectedRowKeys, selectedRows) => {
	  		let choosed = []
	  		selectedRows.forEach((object) => {
	  				choosed.push(object.uuid)
	  			})
		  	dispatch({
		  		type: 'ruleInstance/updateState',
				  payload: {
					  choosedRows: choosed,
					  batchDelete: choosed.length > 0,
				  },
			})
	  	},
	  }
	const onTabClick = (key) => {
		dispatch({
		  	type: 'ruleInstance/updateState',
			payload: {
				tabShowPage: key,
			},
		})
	}
const onCopy = () => {
		dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				copyOrMoveModalType: 'copy',
				copyOrMoveModal: true,
			},
		})
	}

	const onMove = () => {
		dispatch({
			type: 'ruleInstance/updateState',
			payload: {
				copyOrMoveModalType: 'move',
				copyOrMoveModal: true,
			},
		})
	}
  	return (//disabled={issueRoles?false:true}
    <Row gutter={24}>
      <Tabs activeKey={tabShowPage} onTabClick={onTabClick}>
        <TabPane tab={<span><Icon type="global" />实例化监控实例</span>} key="ruleInstance_1">
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Table
              bordered
              columns={columns}
              scroll={{ x: 1300 }}
              dataSource={dataSource}
              loading={loading}
              onChange={onPageChange}
              pagination={pagination}
              simple
              rowKey={record => record.instance.uuid}
              size="small"
              rowSelection={rowSelection}
            />
          </Col>
        </TabPane>
        <TabPane tab={<span><Icon type="exception" />非实例化监控实例</span>} key="ruleInstance_2">
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Table
              bordered
              columns={columns2}
              scroll={{ x: 1300 }}
              dataSource={dataSource2}
              loading={loading}
              onChange={onPageChange}
              pagination={paginationMan}
              simple
              rowKey={record => record.uuid}
              size="small"
              rowSelection={rowSelection2}
            />
          </Col>
        </TabPane>
      </Tabs>
    </Row>
  	)
}

export default list
