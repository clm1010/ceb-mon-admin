import React from 'react'
import { Table, Col } from 'antd'
import { Link } from 'dva/router'

const list = ({
 dispatch, loading, dataSource, pagination, q,
}) => {
    const onPageChage = (page) => {
        dispatch({
            type: 'APPinfor/query',
            payload: {
                page: page.current - 1,
                pageSize: page.pageSize,
                q,
            },
        })
        dispatch({
            type: 'APPinfor/setState',
            payload: {
                onPageChage: new Date().getTime(),
                batchDelete: false,
                selectedRows: [],
            },
        })
    }
    const openModal = (record, e) => {
        dispatch({
            type: 'historyview/queryHistoryview',
            payload: {
                q: `oz_AlarmID=='${record.bussinessID}'`,
                page: 0,
            },
        })
        dispatch({
            type: 'historyview/setState',
            payload: {
                rowDoubleVisible: true,
                defaultKey: new Date().getTime(),
            },
        })
    }
    const columns = [
        {
            title: '告警ID',
            dataIndex: 'bussinessID',
            key: 'bussinessID',
            render: (text, record, index) => {
                return <a onClick={e => openModal(record, e)}>{text}</a>
            },
        }, {
            title: '员工工号',
            dataIndex: 'userAccount',
            key: 'userAccount',
        }, {
            title: '发送时间',
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => {
                return text === 0 ? '' : new Date(text).format('yyyy-MM-dd hh:mm:ss') //toLocaleDateString
            },
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                let statu
                if (record.status == 1) {
                    statu = '已接受'
                } else if (text == 2) {
                    statu = '已送达'
                } else if (text == 3) {
                    statu = '已读'
                }
                return statu
            },
        },
    ]
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let choosed = []
            selectedRows.forEach((object) => {
                    choosed.push(object.uuid)
                })
            dispatch({
                type: 'APPinfor/setState',
                payload: {
                    choosedRows: choosed,
                    batchDelete: choosed.length > 0,
                },
            })
        },
    }
    return (
      <div>
        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            onChange={onPageChage}
            rowSelection={rowSelection}
            rowKey={record => record.uuid}
            size="middle"
            columnWidth="20"
          />
        </Col>
      </div>
    )
}
export default list
