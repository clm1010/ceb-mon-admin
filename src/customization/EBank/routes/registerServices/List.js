import React from 'react'
import { Table, Row, Col, Button, Tag, Modal, Tooltip, Icon, Input } from 'antd'
import ListColumns from './ListColumns'
import './List.less'
const confirm = Modal.confirm

function list({ dispatch, loading, dataSource, pagination, q, regColumns, flag }) {
    const onEdit = (record) => {
        dispatch({
            type: 'registerServices/findRegion',
            payload: {}
        })
        dispatch({
            type: 'registerServices/findById',
            payload: {
                record: record,
            },
        })
    }
    const onDeletes = (record) => {
        confirm({
            title: '您确定要删除这条记录吗?',
            onOk() {
                let ids = []
                ids.push(record.uuid)
                dispatch({
                    type: 'registerServices/delete',
                    payload: ids,
                })
            },
        })
    }

    const columns = regColumns.map((current, index) => {
        if (current == 'name') {
            return {//0
                title: '服务名',
                dataIndex: 'name',
                key: 'name',
            }
        } else if (current == 'tags') {
            return {//0
                title: '标签',
                dataIndex: 'tags',
                key: 'tags',
                render: (text, record) => {
                    let rest = text.map((item) => {
                        return <Tag >{item}</Tag>
                    })
                    return <Tooltip placement="top" title={rest} overlayClassName='bmd'>{rest}</Tooltip>
                },
                width: 200,
                ellipsis: true,
            }
        } else if (current == 'address') {
            return {//1
                title: '地址',
                dataIndex: 'address',
                key: 'address',
            }
        } else if (current == 'id') {
            return {//1
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            }
        } else if (current == 'port') {
            return {//2
                title: '端口',
                dataIndex: 'port',
                key: 'port',
            }
        } else if (current == 'meta') {
            return {//2
                title: 'Meta',
                dataIndex: 'meta',
                key: 'meta',
                render: (text, record) => {
                    let rest = []
                    for (let item in text) {
                        let str = <Tag style={{ display: 'inline-block' }}>{item + ":" + text[item]}</Tag>
                        rest.push(str)
                    }
                    return <Tooltip placement="top" title={rest} overlayClassName='bmd'>{rest}</Tooltip>
                },
                width: 200,
                ellipsis: true,
            }
        } else if (current == 'project') {
            return {//2
                title: '项目',
                dataIndex: 'project',
                key: 'project',
            }
        }else if (current == 'registerStatus') {
            return {//2
                title: '状态',
                dataIndex: 'registerStatus',
                key: 'registerStatus',
                render: (text, record) => {
                    let rest = ''
                    if (text == 'UNREGISTERED') {
                        rest = '未注册'
                    }
                    if (text == 'REGISTERED') {
                        rest = '已注册'
                    }
                    if (text == 'DEREGISTERED') {
                        rest = '已注销'
                    }
                    return rest
                },
            }
        } else if (current == 'namespace') {
            return {//3
                title: '命名空间',
                dataIndex: 'namespace',
                key: 'namespace',
                width: 150,
            }
        } else if (current == 'domain') {
            return {//5
                title: '部门信息',
                dataIndex: 'domain',
                key: 'domain',
            }
        } else if (current == 'nodeChecks') {
            return {//5
                title: '节点检查',
                dataIndex: 'nodeChecks',
                key: 'nodeChecks',
                width: 100,
                render: (text, record) => {
                    return text ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon type="close-circle" theme="twoTone" twoToneColor="#ff4d4f" />
                },
            }
        } else if (current == 'serviceChecks') {
            return {//5
                title: '服务检查',
                dataIndex: 'serviceChecks',
                key: 'serviceChecks',
                width: 100,
                render: (text, record) => {
                    return text ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon type="close-circle" theme="twoTone" twoToneColor="#ff4d4f" />
                },
            }
        } else if (current == 'createdBy') {
            return {//5
                title: '创建人',
                dataIndex: 'createdBy',
                key: 'createdBy',
            }
        } else if (current == 'updatedBy') {
            return {//5
                title: '更新人',
                dataIndex: 'updatedBy',
                key: 'updatedBy',
            }
        } else if (current == 'serviceArea') {
            return {//5
                title: '服务域',
                dataIndex: 'serviceArea',
                key: 'serviceArea',
            }
        } else if (current == 'origin') {
            return {
                title: '创建方式',
                dataIndex: 'origin',
                key: 'origin',
            }
        } else if (current == 'createdTime') {
            return {
                title: '创建时间',
                dataIndex: 'createdTime',
                key: 'createdTime',
                render: (text, record, index) => {
                    return new Date(text).format('yyyy-MM-dd hh:mm:ss')
                },
            }
        } else if (current == 'updatedTime') {
            return {
                title: '更新时间',
                dataIndex: 'updatedTime',
                key: 'updatedTime',
                render: (text, record, index) => {
                    return new Date(text).format('yyyy-MM-dd hh:mm:ss')
                },
            }
        }
    })

    const listColumnPros = {
        dispatch,
        regColumns,
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: () => (
            <ListColumns {...listColumnPros} />
        ),
        filterIcon: filtered => (
            <Icon type="form" style={{ color: "#eb2f96", fontSize: 18 }} />
        ),
    });

    columns.push({
        title: '操作',
        key: 'operation',
        width: 120,
        fixed: 'right',
        ...getColumnSearchProps('address'),
        render: (text, record) => {
            return (<div>
                <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
                <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
            </div>)
        },
    })

    const onPageChange = (page) => {
            dispatch({
                type: 'registerServices/query',
                payload: {
                    pageSize: page.pageSize,
                    page: page.current - 1,
                    q,
                },
            })
        dispatch({
            type: 'registerServices/setState',
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
                    type: 'registerServices/updateState',
                    payload: {
                        batchDelete: true,
                        choosedRows: selectedRows,
                    },
                })
            } else if (selectedRows.length === 0) {
                dispatch({
                    type: 'registerServices/updateState',
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
