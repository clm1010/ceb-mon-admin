import React from 'react'
import { Table, Modal, Row, Col, Button, Tabs, Icon } from 'antd'
const TabPane = Tabs.TabPane
import { Link } from 'dva/router'
const {
    info, success, error, warning, confirm,
   } = Modal
import Fenhang from '../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
})


function list({ dispatch,tabShowPage, loading, dataSource, dataSource2, pagination,paginationMan,q }) {

    const openMosModal = (record, e) => {
		/*
			获取关联实例的数据
		*/
        dispatch({
            type: 'notNetDown/getMoById',
            payload: {
                currentItem: record.instance,
                modalMOVisible: true,
            },
        })
		/*
			打开弹出框
		*/
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                //toolInstUUIDMos:uuid,
                //toolMosNumber:policyCount,
                modalMOVisible: true,
            },
        })
    }

    const openMosModal2 = (record, e) => {
		/*
			获取关联实例的数据
		*/
        dispatch({
            type: 'notNetDown/getMoById',
            payload: {
                currentItem: record,
                modalMOVisible: true,
            },
        })
		/*
			打开弹出框
		*/
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                //toolInstUUIDMos:uuid,
                //toolMosNumber:policyCount,
                modalMOVisible: true,
            },
        })
    }

    const openRuleModal = (record, e) => {
        dispatch({
            type: 'notNetDown/getPolicyRuleById',
            payload: {
                currentItem: record.instance,
            },
        })
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                modalRuleVisible: true,
            },
        })
    }

    const openRuleModal2 = (record, e) => {
        dispatch({
            type: 'notNetDown/getPolicyRuleById',
            payload: {
                currentItem: record,
            },
        })
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                modalRuleVisible: true,
            },
        })
    }
    const openTempModal = (record, e) => {
        dispatch({
            type: 'notNetDown/getTemplateById',
            payload: {
                currentItem: record.instance.policy,
            },
        })
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                modalTempVisible: true,
            },
        })
    }

    const openTempModal2 = (record, e) => {
        dispatch({
            type: 'notNetDown/getTemplateById',
            payload: {
                currentItem: record.policy,
            },
        })
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                modalTempVisible: true,
            },
        })
    }

    const openToolModal = (record, e) => {
        dispatch({
            type: 'notNetDown/getToolById',
            payload: {
                currentItem: record.instance,
            },
        })
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                modalToolVisible: true,
            },
        })
    }

    const openToolModal2 = (record, e) => {
        dispatch({
            type: 'notNetDown/getToolById',
            payload: {
                currentItem: record,
            },
        })
        dispatch({
            type: 'notNetDown/showModal',
            payload: {
                modalToolVisible: true,
            },
        })
    }

	const onDeletes = (record) => {
		confirm({
			title:'您确定要删除这条记录吗',
			onOk () {
				let ids = []
				ids.push(record.instance.uuid)
				dispatch({
					type: 'notNetDown/delete',
					payload: ids,
				})
			},
	})
	}
	const onEdit = (record) => {
		let branchs = record.instance.branch
		dispatch({
	type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
	payload: {
		branchs,
	},
})
	dispatch({
		type: 'notNetDown/queryMonitorInstanceById',	//抛一个事件给监听这个type的监听器
		payload: {
			uuid: record.instance.uuid,
		},
	})
	}
  	const onSee = (record) => {
			// let branchs = record.instance.branch
			dispatch({
		type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
		payload: {
			// branchs,
			see: 'yes',
		},
	})
		dispatch({
			type: 'notNetDown/queryMonitorInstanceById',	//抛一个事件给监听这个type的监听器
			payload: {
				uuid: record.instance.uuid,
			},
		})
  	}
    const columns = [
        {//0
            title: '实例名',
            dataIndex: 'instance.name',
            key: 'instance.name',
            width: 200,
        },
        {//0
            title: '对象名称',
            dataIndex: 'instance.mo.name',
            key: 'instance.mo.name',
            width: 150,
            render: (text, record) => <a onClick={e => openMosModal(record, e)}>{text}</a>,
            //sorter: (a, b) => a.mo.name - b.mo.name,
        }, {//1
            title: '管理IP',
            dataIndex: 'instance.mo.discoveryIP',
            key: 'instance.mo.discoveryIP',
        }, {//2
            title: '管理机构',
            dataIndex: 'instance.mo.branchName',
            key: 'instance.mo.branchName',
            render: (text, record) => {
                return Fenhangmaps.get(text)
            },
        }, {//3
            title: '策略规则',
            dataIndex: 'instance.rule.name',
            key: 'instance.rule.name',
            width: 150,
            render: (text, record, index) => {
                return <a onClick={e => openRuleModal(record, e)}>{text}</a>
            },
        }, {//4
            title: '策略模板',
            dataIndex: 'instance.policy.template.name',
            key: 'instance.policy.template.name',
            render: (text, record) => <a onClick={e => openTempModal(record, e)}>{text}</a>,
        }, {//5
            title: '监控工具',
            dataIndex: 'instance.toolInst.toolType',
            key: 'instance.toolInst.toolType',
            render: (text, record) => {
                let ifo=''
                if(text=='NANTIAN_ZABBIX'){
                    ifo='南天zabbix'
                }
                return ifo
            },
        }, {//6
            title: '工具实例',
            dataIndex: 'instance.toolInst.name',
            key: 'instance.toolInst.name',
            render: (text, record) => {
                return <a onClick={e => openToolModal(record, e)}>{text}</a>
            },
        },
        {//7
            title: '动作',
            //fixed: 'right',
            dataIndex: 'instance.operation',
            key: 'instance.operation',
            width:70,
            render: (text) => {
                let op = ''
                if (text == 0) {
                    op = '监控中'
                }else if(text == 1){
                    op = '上线'
                }else if(text == 2){
                    op = '下线'
                }
                return op
            },
        },
        {// 8 for problem
            title: '下发状态',
            dataIndex: 'instance.issueStatus',
            key: 'instance.issueStatus',
            width:80,
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
              return typename
          },
          
      },
        {// 9 for problem
            title: '下发详情',
            dataIndex: 'instance.msg',
            key: 'instance.msg',
            width:450,
        },
        {// 9 for problem
            title: '创建人',
            dataIndex: 'instance.createdBy',
            key: 'instance.createdBy',
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
            },}
    ]

    const columns2 = [
        {//0
            title: '实例名',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {//0
            title: '对象名称',
            dataIndex: 'mo.name',
            key: 'mo.name',
            width: 150,
            render: (text, record) => <a onClick={e => openMosModal2(record, e)}>{text}</a>,
            //sorter: (a, b) => a.mo.name - b.mo.name,
        }, {//1
            title: '管理IP',
            dataIndex: 'mo.discoveryIP',
            key: 'mo.discoveryIP',
        }, {//2
            title: '管理机构',
            dataIndex: 'mo.branchName',
            key: 'mo.branchName',
            render: (text, record) => {
                return Fenhangmaps.get(text)
            },
        }, {//3
            title: '策略规则',
            dataIndex: 'rule.name',
            key: 'rule.name',
            width: 150,
            render: (text, record, index) => {
                return <a onClick={e => openRuleModal2(record, e)}>{text}</a>
            },
        }, {//4
            title: '策略模板',
            dataIndex: 'policy.template.name',
            key: 'policy.template.name',
            render: (text, record) => <a onClick={e => openTempModal2(record, e)}>{text}</a>,
        }, {//5
            title: '监控工具',
            dataIndex: 'toolInst.toolType',
            key: 'toolInst.toolType',
            render: (text, record) => {
                let ifo=''
                if(text=='NANTIAN_ZABBIX'){
                    ifo='南天zabbix'
                }
                return ifo
            },
        }, {//6
            title: '工具实例',
            dataIndex: 'toolInst.name',
            key: 'toolInst.name',
            render: (text, record) => {
                return <a onClick={e => openToolModal2(record, e)}>{text}</a>
            },
        },
        {//7
            title: '动作',
            //fixed: 'right',
            dataIndex: 'operation',
            key: 'operation',
            width:70,
            render: (text) => {
                let op = ''
                if (text == 0) {
                    op = '监控中'
                }else if(text == 1){
                    op = '上线'
                }else if(text == 2){
                    op = '下线'
                }
                return op
            },
        },
        {// 8 for problem
            title: '下发状态',
            dataIndex: 'issueStatus',
            key: 'issueStatus',
            width:80,
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
              return typename
          },
          
      },
        {// 9 for problem
            title: '下发详情',
            dataIndex: 'msg',
            key: 'msg',
            width:450,
        },
        {// 9 for problem
            title: '创建人',
            dataIndex: 'createdBy',
            key: 'createdBy',
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
            },}
    ]

    const onDeletes1 = (record) => {
        confirm({
            title: '您确定要删除这条记录吗?',
            onOk () {
                let ids = []

                ids.push(record.uuid)
                dispatch({
                    type: 'notNetDown/delete',
                    payload: ids,
            })
            },
    })
    }
    const onEdit1 = (record) => {
        let branchs = record.branch
        dispatch({
    type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
    payload: {
        branchs,
    },
})
        dispatch({
            type: 'notNetDown/queryMonitorInstanceById',													//抛一个事件给监听这个type的监听器
            payload: {
                uuid: record.uuid,
            },
    })
    }
        const onSee1 = (record) => {
            // let branchs = record.branch
            dispatch({
        type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
        payload: {
            // branchs,
            see: 'yes',
        },
    })
            dispatch({
                type: 'notNetDown/queryMonitorInstanceById',													//抛一个事件给监听这个type的监听器
                payload: {
                    uuid: record.uuid,
                },
        })
        }
	const onPageChange = (page) => {
        dispatch({
            type: 'notNetDown/query',
            payload: {
                pageSize: page.pageSize,
              page: page.current - 1,
              q,
            },
        })
        dispatch({
            type: 'notNetDown/setState',
            payload: {
                keys: new Date().getTime(),
                batchDelete: false,
                selectedRows: [],
            },
        })
 }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let choosed = []
            selectedRows.forEach((object) => {
                choosed.push = object.id
            })
            if (selectedRows.length > 0) {
                dispatch({
                    type: 'notNetDown/updateState',
                    payload: {
                        batchDelete: true,
                        choosedRows: selectedRows,
                    },
                })
            } else if (selectedRows.length === 0) {
                dispatch({
                    type: 'notNetDown/updateState',
                    payload: {
                        batchDelete: false,
                        choosedRows: selectedRows,
                    },
                })
            }
        },
    }

    const onTabClick = (key) => {
		dispatch({
		  	type: 'notNetDown/updateState',
			payload: {
				tabShowPage: key,
			},
		})
	}
    const customPanelStyle1 = {
        background: '#fff',
        borderRadius: 4,
        border: 0,
        overflow: 'auto', //'hidden',
        borderBottom: '1px solid #E9E9E9',
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 12,
        paddingTop: 12,
        fontSize: 14,
        //		height: '600px',
    }
console.log('dataSource2',dataSource2,dataSource);
    //pagination={{pageSize: 15}}
    return (
        <Row gutter={24}>
            <Tabs activeKey={tabShowPage} onTabClick={onTabClick}>
        <TabPane tab={<span><Icon type="global" />非网络域实例化监控实例</span>} key="notNetDown_1">
            <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <div >
                    <Table
                        scroll={{ x: 1700 }} //滚动条
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        onChange={onPageChange}
                        loading={loading}
                        pagination={pagination}
                        simple
                        rowKey={record => record.instance.mo.uuid + (record.instance.policy ? record.instance.policy.uuid : '') + record.instance.rule.uuid + record.instance.toolInst.uuid}                        size="small"
                        // rowSelection={rowSelection}
                    />
                </div>
            </Col>
            </TabPane>

            <TabPane tab={<span><Icon type="exception" />非网络域非实例化监控实例</span>} key="notNetDown_2">
            <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Table
              bordered
              columns={columns2}
            //   columns={columns}
              scroll={{ x: 1700 }}
              dataSource={dataSource2}
            //   dataSource={dataSource}
              loading={loading}
              onChange={onPageChange}
              pagination={paginationMan}
            //   pagination={pagination}
              simple
              rowKey={record => record.uuid}
              size="small"
            //   rowSelection={rowSelection2}
            />
          </Col>
        </TabPane>
            </Tabs> 
        </Row>
    )
}

export default list
