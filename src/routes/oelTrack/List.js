import React from 'react'
import { Table, Modal, Row, Col, Button, Icon, message } from 'antd'
import Timecomtent from './Time'
import { DropOption } from '../../components'

const list = ({
 dispatch, loading, pagination, dataSource, q,onlyOne,forbind,nowDate
}) => {
    const confirm = Modal.confirm
    const onPageChage = (page) => {
        dispatch({
            type: 'oelTrack/query',
            payload: {
                page: page.current - 1,
                pageSize: page.pageSize,
                q,
            },
        })
        dispatch({
            type: 'oelTrack/setState',
            payload: {
                onPageChage: new Date().getTime(),
                batchDelete: false,
                selectedRows: [],
            },
        })
    }
    const doun = (text, record) => {
        let detaldate = record.beginTime //初始时间
        let resoultdate //时间差
        let netdate //下次提醒时间
        resoultdate = (nowDate - detaldate)
        let arr = []
        let arr1 = []
        arr1 = record.allInterval
        arr = arr1.sort((a, b) => a - b)
        for (let i = 0; i < arr.length; i++) {
            let val = record.allInterval[i] * 60 * 1000 // 下一个时间点
            let val1 = record.allInterval[i - 1] * 60 * 1000 // 前一个时间点
            if (resoultdate < val) {
                let tex = record.actions.filter(arr => arr.interval == record.allInterval[i - 1]).map(x => x.action)
                let actionName = record.actions.filter(arr => arr.interval == record.allInterval[i]).map(x => x.name)
                let handled = record.actions.filter(arr => arr.interval == record.allInterval[i - 1]).map(x => x.handled)[0]
                let voice = record.actions.filter(arr => arr.interval == record.allInterval[i]).map(x => x.voice)[0]
                if (text == 'status') {
                    record.notificatStaus = tex.toString()
                    record.actionName = actionName.toString()
                    record.lastinfo = '0'
                    if (tex != '') {
                        return <div>{tex}&nbsp;<span style={{ float: 'right', marginRight: 5 }}> {handled ? <Icon type="check-circle" style={{ fontSize: 18, color: '#52C41A' }} /> : <Icon type="question-circle" style={{ fontSize: 18, color: '#ff2b2b' }} />}</span></div>
                    }
                    return tex
                }
                if (text == 'nextalart') {
                    record.nextalart = new Date(detaldate + val).format('yyyy-MM-dd hh:mm:ss')
                    record.num = i
                    return new Date(detaldate + val).format('yyyy-MM-dd hh:mm:ss')
                }
                if (text == 'countdown') {
                    netdate = (detaldate + val)
                    record.enddate = netdate
                    record.voice = voice
                    return (
                      <Timecomtent endTime={netdate} voice = {voice} sty={1} msg='00:00:00' onlyOne={onlyOne} forbind = {forbind} nowDate ={nowDate}/>
                    )
                }
                if (text == 'warntime') {
                    return (
                        arr.map((item) => {
                            if (item == record.allInterval[i - 1]) {
                                return <span style={{ color: '#F00' }}>{item}&nbsp;</span>
                            }
                                return <span>{item}&nbsp;</span>
                        })
                    )
                }
            }
        }
        if (resoultdate > Math.max.apply(null, arr) * 60 * 1000) {
            if (text == 'status') {
                let len = arr.length - 1
                let tex = record.actions.filter(arr => arr.interval == record.allInterval[len]).map(x => x.action)
                let handled = record.actions.filter(arr => arr.interval == record.allInterval[len]).map(x => x.handled)[0]
                record.notificatStaus = tex.toString()
                record.actionName = '倒计时'
                record.lastinfo = '1'
                if (tex != '') {
                    return <div>{tex}&nbsp;<span style={{ float: 'right', marginRight: 5 }}> {handled ? <Icon type="check-circle" style={{ fontSize: 18, color: '#52C41A' }} /> : <Icon type="question-circle" style={{ fontSize: 18, color: '#ff4242' }} />}</span></div>
                }
                return tex
            }
            if (text == 'nextalart') {
                record.nextalart = '00:00:00'
                record.num = arr.length
                return '00:00:00'
            }
            if (text == 'countdown') {
                record.enddate = '00:00:00'
                return '倒计时结束'
            }
            if (text == 'warntime') {
                return (
                    arr.map((item) => {
                        if (item == record.allInterval[arr.length - 1]) {
                            return <span style={{ color: '#F00' }}>{item}&nbsp;</span>
                        }
                            return <span>{item}&nbsp;</span>
                    })
                )
            }
        }
        if (text == 'tracktime') {
            record.followdate = detaldate
            return (
              <Timecomtent starTime={detaldate} sty={2} nowDate ={nowDate} forbind = {forbind}/>
                /* <CountTime  startTime={detaldate} ></CountTime>  */
            )
        }
    }
    const handleMenuClick = (record, e) => {
        //查看
        if (e.key === '1') {
            record.firstOccurrence1 = new Date(record.firstOccurrence).format('yyyy-MM-dd hh:mm:ss')
            record.lastOccurrence1 = new Date(record.lastOccurrence).format('yyyy-MM-dd hh:mm:ss')
            record.n_MaintainETime1 = new Date(record.n_MaintainETime).format('yyyy-MM-dd hh:mm:ss')
            record.beginTime1 = new Date(record.beginTime).format('yyyy-MM-dd hh:mm:ss')
            record.oz_LimitTime1 = record.oz_LimitTime == 0 ? record.oz_LimitTime : new Date(record.oz_LimitTime).format('yyyy-MM-dd hh:mm:ss')
            record.createdTime1 = record.createdTime == 0 ? record.createdTime : new Date(record.createdTime).format('yyyy-MM-dd hh:mm:ss')
            dispatch({
                type: 'oelTrack/setState',
                payload: {
                    uuid: record,
                    currentItem: record,
                    seeModalvisible: true,
                    countState:false,
                    onlyOne:false,
                    tkey:true
                },
            }) 
        } else if (e.key === '2') { //编辑
            record.firstOccurrence1 = new Date(record.firstOccurrence).format('yyyy-MM-dd hh:mm:ss')
            record.lastOccurrence1 = new Date(record.lastOccurrence).format('yyyy-MM-dd hh:mm:ss')
            record.n_MaintainETime1 = new Date(record.n_MaintainETime).format('yyyy-MM-dd hh:mm:ss')
            let timeFileinfo = {}
            timeFileinfo.filterItems = record.actions
            dispatch({
                type: 'oelTrack/setState',
                payload: {
                    currentItem: record,
                    timertype: record.traceType,
                    timeFileinfo,
                    typeValue: record.cycleMechanism,
                    editModalvisible: true,
                },
            })
        } else if (e.key === '4') {
            confirm({
                title: '您确定要删除这条记录吗?',
                onOk () {
                    let ids = []
                    ids.push(record.uuid)
                    dispatch({
                        type: 'oelTrack/delete',
                        payload: ids,
                    })
                },
            })
        } else if (e.key === '3') {
            confirm({
                title: '当前环节已处理完成?',
                onOk () {
                    let arr = record.actions.filter(arr => arr.action == record.notificatStaus)[0]
                    let obj = {}
                    if (arr) {
                        if (arr.handled) {
                            message.error(`已经通知过${record.notificatStaus}了`)
                            return
                        }
                        if (arr.uuid) {
                            obj.action = arr.action
                            obj.interval = arr.interval
                            obj.name = arr.name
                            obj.voice = arr.voice
                            obj.handled = true
                            obj.uuid = arr.uuid
                        }
                        dispatch({
                            type: 'oelTrack/updateAction',
                            payload: {
                                obj,
                            },
                        })
                    }
                },
            })
        }
    }
    const columns = [
        {
            title: '告警跟踪名称',
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },{
            title: '告警级别',
            dataIndex: 'n_CustomerSeverity',
            key: 'n_CustomerSeverity',
            render: (text, record) => {
                switch (text) {
                    case 1: return '故障'
                    case 2: return '告警'
                    case 3: return '预警'
                    case 4: return '提示'
                    case 100: return '信息'
                }
            },
        }, {
            title: '应用系统名称',
            dataIndex: 'n_AppName',
            key: 'n_AppName',
        }, {
            title: 'IP地址',
            dataIndex: 'nodeAlias',
            key: 'nodeAlias',
        }, {
            title: '告警大类',
            dataIndex: 'n_ComponentType',
            key: 'n_ComponentType',
        }, {
            title: '告警详情',
            dataIndex: 'n_SumMaryCn',
            key: 'n_SumMaryCn',
            width: 350,
        }, {
            title: '通知状态',
            dataIndex: 'status',
            key: 'status',
            width:300,
            render: (text, record, index) => {
                return (
                  <div>
                    {doun('status', record)}
                  </div>
                )
            },
        }, {
            title: '下次提醒',
            dataIndex: 'nextalart',
            key: 'nextalart',
            render: (text, record) => {
                return doun('nextalart', record)
            },
        }, {
            title: '倒计时',
            dataIndex: 'countdown',
            key: 'countdown',
            render: (text, record) => {
                return doun('countdown', record)
            },
        }, {
            title: '跟踪时长',
            dataIndex: 'tracktime',
            key: 'tracktime',
            render: (text, record) => {
                return doun('tracktime', record)
            },
        }, {
            title: '模式',
            dataIndex: 'modaltype',
            key: 'modaltype',
            render: (text, record) => {
                if (record.traceType == 'TIMELIMIT') {
                    return '限期'
                }
                    return '普通'
            },
        }, {
            title: '提醒时间(min)',
            dataIndex: 'warntime',
            key: 'warntime',
            render: (text, record) => {
                return doun('warntime', record)
            },
        }, {
            title: '操作',
            key: 'operation',
            width: 75,
            fixed: 'right',
            render: (text, record) => {
                return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '详情' }, { key: '2', name: '编辑' }, { key: '3', name: '处理' }, { key: '4', name: '删除' }]} />
            },
        },
    ]
    const onRowMouseEnter = ()=>{
         dispatch({
            type: 'oelTrack/getNowDate',
            payload: { },
        }) 
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            let choosed = []
            selectedRows.forEach((object) => {
                    choosed.push(object.uuid)
                })
            dispatch({
                type: 'oelTrack/setState',
                payload: {
                    choosedRows: choosed,
                    batchDelete: choosed.length > 0,
                },
            })
        },
    }
    return (
      <Row gutter={24}>
        <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <Table
            bordered
            scroll={{x:2300}}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
            onChange={onPageChage}
            loading={loading}
            simple
            rowSelection={rowSelection}
            rowKey={record => record.uuid}
            size="small"
            columnWidth="20"
            onRowMouseLeave ={onRowMouseEnter}
            onRowMouseEnter = {onRowMouseEnter}
          />
        </Col>
      </Row>
    )
}
export default list
