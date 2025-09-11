import React from 'react'
import { Table, Modal, Tag, Row, Col, Button, Tooltip } from 'antd'
import { Link } from 'dva/router'

function list ({
 dispatch, pagination, q, loading, toolmess, tipItem, tipItem1, dataSource, backRoute,
}) {
    const onSelect = (info) => {
        const indexlist = {}
        indexlist.appCode = info.appCode
        indexlist.appName = info.appName
        indexlist.name = 'indexlist'
        backRoute[6] = indexlist
        let backRoute1 = backRoute.concat()

        const strategylist = {}
        strategylist.appCode = info.appCode
        strategylist.appName = info.appName
        strategylist.name = 'strategylist'
        let backRoute2 = backRoute.concat()
        backRoute2[6] = strategylist
        dispatch({
            type: 'caselist/setState',
            payload: {
                currentItem: info,
            },
        })
        dispatch({
            type: 'indexlist/setState',
            payload: {
                backRoute: backRoute1,
            },
        })
        dispatch({
            type: 'strategylist/setState',
            payload: {
                backRoute: backRoute2,
            },
        })
    }
    const onFocus = (info) => {
        dispatch({
            type: 'caselist/queryTip',
            payload: {
                appCode: info.appCode,
            },
        })
    }
    const onFocus2 = (info) => {
        dispatch({
            type: 'caselist/queryTip1',
            payload: {
                appCode: info.appCode,
            },
        })
    }
    const openMosModal = (record, e) => {
        if (record.path == '0') {
            /*
                获取关联实例的数据设备级
            */
            dispatch({
                type: 'caselist/objectMOinfo',
                payload: {
                    uuid: record.appCode,
                },
            })
            /*
            打开弹出框
            */
            dispatch({
                type: 'caselist/setState',
                payload: {
                    mosVisible: true,
                },
            })
        } else if (record.path == '1') {
            //获取接口设备详情
            dispatch({
                type: 'caselist/mointerinfo',
                payload: {
                    uuid: record.appCode,
                },
            })
            //  打开弹出框
            dispatch({
                type: 'caselist/setState',
                payload: {
                    equipmentVisible: true,
                },
            })
        }
    }
    const columns = [
        {
            title: '具体名称',
            dataIndex: 'appName',
            key: 'appName',
            width: 200,
            /*
            render : (text , record , index)=> {
                return <Link onClick={e => openMosModal(record , e)}>{text}</Link>
            }
            */
        }, {
            title: '指标覆盖率',
            dataIndex: 'coverage',
            key: 'coverage',
            render: (text, record) => {
                return (
                  <div onClick={() => onSelect(record)}>
                    <Tooltip key={1} title={tipItem} mouseEnterDelay={1} onVisibleChange={() => onFocus(record)} >
                      <Link to={`/indexlist/${record.appCode}`}>{text}</Link>
                    </Tooltip>
                  </div>
                )
            },
            sorter: (a, b) => a.coverage - b.coverage,
        }, {
            title: '策略标准化率',
            dataIndex: 'normalizedRate',
            key: 'normalizedRate',
            render: (text, record) => {
                return (
                  <div onClick={() => onSelect(record)}>
                    <Tooltip key={2} title={tipItem1} mouseEnterDelay={1} onVisibleChange={() => onFocus2(record)}>
                      <Link to={`/strategylist/${record.appCode}`}>{text}</Link>
                    </Tooltip>
                  </div>
                )
            },
            sorter: (a, b) => a.normalizedRate - b.normalizedRate,
        }, {
            title: '超额布控率',
            dataIndex: 'overMonitoringRate',
            key: 'overMonitoringRate',

        }, {
            title: '评分',
            dataIndex: 'monitoringScore',
            key: 'monitoringScore',
            sorter: (a, b) => a.monitoringScore - b.monitoringScore,
        },
    ]

    const rowSelection = {
        onChange: (selecteRowKeys, selectedRows) => {
            let choosed = []
            selecteRowKeys.forEach((object) => {
                    choosed.push = object.id
                })
            if (selectedRows.length > 0) {
                dispatch({
                    type: 'caselist/setState',
                    paload: {
                        batchDelete: true,
                        selectedRows,
                    },
                })
            } else if (selectedRows.length === 0) {
                dispatch({
                    type: 'caselist/setState',
                    paload: {
                        batchDelete: false,
                        selectedRows,
                    },
                })
            }
        },
    }
    const onPageChage = (page) => {
        dispatch({
            type: 'caselist/query',
            payload: {
                page: page.current - 1,
                pageSize: page.pageSize,
                q,
                appCode: backRoute[5] == undefined ? backRoute[4].appCode : backRoute[5].appCode,
            },
        })
        dispatch({
            type: 'caselist/setState',
            payload: {
                onPageChage: new Date().getTime(),
                batchDelete: false,
                selectedRows: [],
            },
        })
    }

    return (
      <Col xl={{ span: 24 }} md={{ span: 24 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          rowSelection={rowSelection}
          onChange={onPageChage}
          rowKey={record => record.uuid}
          size="middle"
        />
      </Col>
    )
}

export default list
