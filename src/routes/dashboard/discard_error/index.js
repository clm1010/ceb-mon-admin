import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Row, Col, Card, Table, Badge, Tooltip, Select, Button } from 'antd'
import Menus from '../performance/Menus'
import queryString from "query-string"
import { routerRedux } from 'dva/router'
import './style.css'
import Search from '../Search.js'
import filterSchema from './fileitem'

const Option = Select.Option
const discard_error = ({
    dispatch, loading, location, performance,
}) => {
    const { InPortDicardsList1, OutPortDicardsList1, InPortErrorList1, OutPortErrorList1, paginationInPortDicards1,
        paginationOutPortDicards1, paginationInPortError1, paginationOutPortError1, netDomain,queryTerms, } = performance
    const user = JSON.parse(sessionStorage.getItem('user'))
    //菜单配置项---start
    const menuProps = {
        current: 'Discard_error',
        dispatch,
        userbranch: user.branch
    }
    //end
    const portError1 = [
        {
            title: '端口名',
            dataIndex: 'moname',
            key: 'moname',
            className: 'name',
            render: (text, record) => {
                let bgcolor = 'default'
                if (record.sta == '1') {
                    bgcolor = 'success'
                } else if (record.sta == '2') {
                    bgcolor = 'error'
                } else {
                    bgcolor = 'default'
                }
                return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
            },
        },
        {
            title: '端口描述',
            dataIndex: 'port',
            key: 'port3',
            className: 'ellipsis',
            render: (text, record) => <div title={text}>{text}</div>,
        },
        {
            title: '输出错包数',
            width: 85,
            dataIndex: 'value',
            key: 'value',
        },
    ]

    const portError2 = [
        {
            title: '端口名',
            dataIndex: 'moname',
            key: 'moname',
            className: 'name',
            render: (text, record) => {
                let bgcolor = 'default'
                if (record.sta == '1') {
                    bgcolor = 'success'
                } else if (record.sta == '2') {
                    bgcolor = 'error'
                } else {
                    bgcolor = 'default'
                }
                return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
            },
        },
        {
            title: '端口描述',
            dataIndex: 'port',
            key: 'port4',
            className: 'ellipsis',
            render: (text, record) => <div title={text}>{text}</div>,
        },
        {
            title: '输入错包数',
            width: 95,
            dataIndex: 'value',
            key: 'value',
        },
    ]

    const portDicards1 = [
        {
            title: '端口名',
            dataIndex: 'moname',
            key: 'moname',
            className: 'name',
            render: (text, record) => {
                let bgcolor = 'default'
                if (record.sta == '1') {
                    bgcolor = 'success'
                } else if (record.sta == '2') {
                    bgcolor = 'error'
                } else {
                    bgcolor = 'default'
                }
                return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
            },
        },
        {
            title: '端口描述',
            dataIndex: 'port',
            key: 'port1',
            className: 'ellipsis',
            render: (text, record) => <div title={text}>{text}</div>,
        },
        {
            title: '输出丢包数',
            dataIndex: 'value',
            width: 95,
            key: 'value',
        },
    ]

    const portDicards2 = [
        {
            title: '端口名',
            dataIndex: 'moname',
            key: 'moname',
            className: 'name',
            render: (text, record) => {
                let bgcolor = 'default'
                if (record.sta == '1') {
                    bgcolor = 'success'
                } else if (record.sta == '2') {
                    bgcolor = 'error'
                } else {
                    bgcolor = 'default'
                }
                return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
            },
        },
        {
            title: '端口描述',
            dataIndex: 'port',
            key: 'port2',
            className: 'ellipsis',
            render: (text, record) => <div title={text}>{text}</div>,
        },
        {
            title: '输入丢包数',
            width: 85,
            dataIndex: 'value',
            key: 'value',
        },
    ]
    const onChangeFirst = (value) => {
        dispatch({
            type: 'performance/querySuccess',
            payload: {
                netDomain: value,
            },
        })
    }
    const onSub = () => {
        dispatch({
            type: 'performance/queryInDicardsinfo',
            payload: {
                from: 0,
                size: 10
            },
        })
        dispatch({
            type: 'performance/queryOutDicardsinfo',
            payload: {
                from: 0,
                size: 10
            },
        })
        dispatch({
            type: 'performance/queryInErrorinfo',
            payload: {
                from: 0,
                size: 10
            },
        })
        dispatch({
            type: 'performance/queryOutErrorinfo',
            payload: {
                from: 0,
                size: 10
            },
        })
    }
    const onPageChangeInError = (page) => {
        dispatch({
            type: 'performance/queryInErrorinfo',
            payload: {
                from: (page.current - 1) * page.pageSize,
                size: page.pageSize,
                queryTerms,
            },
        })
    }
    const onPageChangeOutError = (page) => {
        dispatch({
            type: 'performance/queryOutErrorinfo',
            payload: {
                from: (page.current - 1) * page.pageSize,
                size: page.pageSize,
                queryTerms,
            },
        })
    }
    const onPageChangeInDicards = (page) => {
        dispatch({
            type: 'performance/queryInDicardsinfo',
            payload: {
                from: (page.current - 1) * page.pageSize,
                size: page.pageSize,
                queryTerms,
            },
        })
    }
    const onPageChangeOutDicards = (page) => {
        dispatch({
            type: 'performance/queryOutDicardsinfo',
            payload: {
                from: (page.current - 1) * page.pageSize,
                size: page.pageSize,
                queryTerms,
            },
        })
    }

    const filterProps = {
        filterSchema: filterSchema,
        dispatch,
        onSearch(queryTerms) {
            const { search, pathname } = location
            const query = queryString.parse(search);
            query.queryTerms = queryTerms
            dispatch(routerRedux.push({
                pathname,
                query,
            }))
        },
      }

    return (
        <Row gutter={6}>
            <Col span={24}>
                <Menus {...menuProps} />
            </Col>
            <Col span={24}>
                <Search {...filterProps} />
            </Col>

            <Col span={24}>
                <Card bodyStyle={{ width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center', }}
                    style={{ marginBottom: '6px' }}
                >
                    <div style={{ width: '49%', float: 'left' }}>
                        <Table
                            dataSource={OutPortErrorList1}
                            bordered
                            loading={loading.effects['performance/queryOutErrorinfo']}
                            columns={portError1}
                            size="small"
                            pagination={paginationOutPortError1}
                            onChange={onPageChangeOutError}
                            title={() => <div className='title'> output CRC error</div>}
                        />
                    </div>
                    <div style={{ width: '49%', float: 'right' }}>
                        <Table
                            dataSource={InPortErrorList1}
                            bordered
                            loading={loading.effects['performance/queryInErrorinfo']}
                            columns={portError2}
                            size="small"
                            pagination={paginationInPortError1}
                            onChange={onPageChangeInError}
                            title={() => <div className='title'>input CRC error</div>}
                        />
                    </div>
                </Card>
                <Card bodyStyle={{
                    width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
                }}
                    style={{ marginBottom: '6px' }}
                // title="input discard/output discard"
                >
                    <div style={{ width: '49%', float: 'left' }}>
                        <Table
                            dataSource={OutPortDicardsList1}
                            bordered
                            loading={loading.effects['performance/queryOutDicardsinfo']}
                            columns={portDicards1}
                            size="small"
                            pagination={paginationOutPortDicards1}
                            onChange={onPageChangeOutDicards}
                            title={() => <div className='title'>output discard</div>}
                        />
                    </div>
                    <div style={{ width: '49%', float: 'right' }}>
                        <Table
                            dataSource={InPortDicardsList1}
                            bordered
                            loading={loading.effects['performance/queryInDicardsinfo']}
                            columns={portDicards2}
                            size="small"
                            pagination={paginationInPortDicards1}
                            onChange={onPageChangeInDicards}
                            title={() => <div className='title'>input discard</div>}
                        />
                    </div>
                </Card>
            </Col>
        </Row>
    )
}
export default connect(({ performance, loading }) => ({ performance, loading }))(discard_error)
