import React from 'react'
import { Table, Modal, Row, Col } from 'antd'
import { Link } from 'dva/router'

import Fenhang from '../../../../utils/fenhang'
let Fenhangmaps = new Map()
Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
})


function list({ dispatch, loading, dataSource, pagination,q }) {

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
    ]
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
    //pagination={{pageSize: 15}}
    return (
        <Row gutter={24}>
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
                        rowSelection={rowSelection}
                    />
                </div>
            </Col>
        </Row>
    )
}

export default list
