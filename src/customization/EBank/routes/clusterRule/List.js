import React from 'react'
import { Table, Row, Col, Button, Tag, Modal, Tooltip, Icon, Input } from 'antd'
import { DropOption } from '../../../../components'

const confirm = Modal.confirm

function list({ dispatch, loading, dataSource, pagination, q, regColumns }) {
    const handleMenuClick = (record, e) => {
        if (e.key === '1') {
            dispatch({
                type: 'clusterRule/setState',
                payload: {
                    currentItem: record,
                    modalVisible: true,
                    modalType: 'see',
                    // normalList:record.normalRuleList,
                    // basicsList:record.basicsRuleList,
                },
            })
            dispatch({
                type:'clusterRule/getByname',
                payload:{
                    q:`${record.clusterName}`
                }
            })
        }
        if (e.key === '2') {
            dispatch({
                type: 'clusterRule/setState',
                payload: {
                    currentItem: record,
                    modalVisible: true,
                    modalType: 'update',
                    // normalList:record.normalRuleList,
                    // basicsList:record.basicsRuleList,
                },
            })
            dispatch({
                type:'clusterRule/getByname',
                payload:{
                    q:`${record.clusterName}`
                }
            })
        }
    }

    const columns = [
        {
            title: '集群名称',
            dataIndex: 'clusterName',
            key: 'clusterName',
        }, {
            title: 'Server Url',
            dataIndex: 'serverUrl',
            key: 'serverUrl',
        }, {
            title: 'Prometheus Url',
            dataIndex: 'promUrl',
            key: 'promUrl',
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            render: (text, record) => {
                return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看' }, { key: '2', name: '编辑' }]} />
            },
        },
    ]

    const onPageChange = (page) => {
        dispatch({
            type: 'clusterRule/query',
            payload: {
                pageSize: page.pageSize,
                page: page.current - 1,
                q,
            },
        })
        dispatch({
            type: 'clusterRule/setState',
            payload: {
                keys: new Date().getTime(),
                batchDelete: false,
                selectedRows: [],
            },
        })
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRows.length > 0) {
                dispatch({
                    type: 'clusterRule/setState',
                    payload: {
                        batchDelete: true,
                        choosedRows: selectedRows,
                    },
                })
            } else if (selectedRows.length === 0) {
                dispatch({
                    type: 'clusterRule/setState',
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
            <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                <div >
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        onChange={onPageChange}
                        loading={loading}
                        pagination={pagination}
                        simple
                        rowKey={record => record.uuid}
                        size="small"
                        rowSelection={rowSelection}
                    />
                </div>
            </Col>
        </Row>
    )
}

export default list
