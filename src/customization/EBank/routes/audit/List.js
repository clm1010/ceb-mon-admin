import React from 'react'
import { Table, Icon } from 'antd'
import { queryUUID_es } from './ES_DSL'
import moment from 'moment'

function list({
    dispatch, loading, dataSource, expand,pagination,es_q
}) {
    const columns = [
        {
            title: '模块',
            dataIndex: 'typ',
            key: 'typ',
        },
        {
            title: '操作类型',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: '操作人',
            dataIndex: 'user',
            key: 'user'
        },
        {
            title: '时间',
            dataIndex: 'oprationTime',
            key: 'oprationTime',
            defaultSortOrder:'descend',
            sorter:true
            // sorter:(a,b)=>{
            //     let aa = moment(a.oprationTime,'yyyy-MM-dd hh:mm:ss')
            //     let bb = moment(b.oprationTime,'yyyy-MM-dd hh:mm:ss')
            //     return aa-bb
            // }
        },
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '结果',
            dataIndex: 'responseCode',
            key: 'responseCode',
        },
    ]
    const onClickRow = (event, record) => {
        let es = JSON.parse(JSON.stringify(queryUUID_es))
        let uuid = { term: { uuid: record.uuid } }
        let clock = { range: { oprationTime: { lt: record.oprationTime } } }
        if (record.uuid) {
            es.query.bool.must.push(uuid)
        }
        es.query.bool.must.push(clock)
        dispatch({
            type: 'audit/queryPre',
            payload: {
                es
            }
        })
        dispatch({
            type: 'audit/setState',
            payload: {
                currentItem: record,
                visible: true
            }
        })
    }
    const toggle = () => {
        dispatch({
            type: 'audit/setState',
            payload: {
                expand: !expand,
            },
        })
    }
    const onChange = (page,filter,order) => {
        let sort
        if(order.order){
            if(order.order == 'ascend'){
                sort = 'asc'
            }else if(order.order == 'descend'){
                sort = 'desc'
            }
        }
        dispatch({
            type: 'audit/query',
            payload: {
                from: (page.current - 1) * page.pageSize,
                size: page.pageSize,
                es:es_q,
                order:sort
            },
        })
    }
//  {/*footer={() =><div style={{float:'right',marginTop:-12}}>{`共${dataSource.length}条数据`}</div>}*/}
    return (
        <div style={{ background: "#fff", marginTop: 12, height: '78vh', padding: 12 }}>
            <a onClick={toggle}>
                <Icon type={expand ? 'caret-right' : 'caret-left'} style={{ fontSize: 12, color: '#333' }} />
            </a>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                scroll={{ y: '65vh' }}
                simple
                rowKey={record => record.id}
                onChange={onChange}
                size="small"
                onRow={record => {
                    return {
                        onDoubleClick: event => onClickRow(event, record), // 点击行
                    };
                }}
            />
        </div>
    )
}

export default list
