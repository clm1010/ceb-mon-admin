import { Button, Badge, Menu, Dropdown, Icon, message, Tooltip } from "antd";
import React from "react";
import ResizTable from '../ResizTable'

class DetailsStic extends React.Component {
    constructor(props) {
        super(props)
        this.state.DataSource = props.traceBack.list
        this.state.pagination = props.traceBack.pagination
        this.state.CustomColumns = props.CustomColumns
        this.state.ColumState = props.ColumState
        this.state.dispatch = props.dispatch
        this.state.saveCulumFlag = props.saveCulumFlag

    }
    state = {
        DataSource: []
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            DataSource: nextProps.traceBack.list,
            pagination: nextProps.traceBack.pagination,
            CustomColumns: nextProps.CustomColumns,
            ColumState: nextProps.ColumState,
            dispatch: nextProps.dispatch,
            saveCulumFlag: nextProps.saveCulumFlag
        }
    }
    showTotal = (data) => {
        return <div style={{ float: 'right' }}> 共{this.state.pagination.total} 条</div>
    }
    //每一行的双击事件
    onRowDoubleClick = (record, index, event) => {
        this.props.dispatch({
            type: 'historyview/setState',
            payload: {
                rowDoubleVisible: true,
                selectInfo: record,
                severitySql: `rsPK.serverName=='${record.serverName}';rsPK.serverSerial=='${record.serverSerial}'`,
                sortSql: 'rsPK.startDate,desc',
                journalSql: `rjPK.serverName=='${record.serverName}';rjPK.serverSerial=='${record.serverSerial}'`,
                detailsSql: `alarmId=cs='${record.oz_AlarmID}'`, //${record.serverName}_${record.serverSerial}//后台加了字段改变参数
                //detailsSql: `alarmId=='${record.oz_AlarmID}'`, //${record.serverName}_${record.serverSerial}//后台加了字段改变参数 EGroup
                defaultKey: new Date().getTime(),
            },
        })
    }

    //发送工单
    sendWorkOrder = (e, data) => {
        const currentItem = e
        if (currentItem.N_TicketId !== undefined && currentItem.N_TicketId !== '') {
            message.warning('此告警已被发送过工单，不能再次发送。')
        } else {
            this.props.dispatch({
                type: 'historyview/setState',
                payload: {
                    workOrderVisible: true,
                    currentItem,
                },
            })
        }
    }

    render() {
        const {
            DataSource,
            ColumState,
            CustomColumns,
            dispatch,
            saveCulumFlag
        } = this.state

        const _columns = [{
            key: 'n_CustomerSeverity',
            dataIndex: 'n_CustomerSeverity',
            width: 100,
            title: '告警级别',
            render: (text, record) => {
                let info = ''
                if (text === 1) {
                    info = <div><Badge count={1} style={{ backgroundColor: '#C50000' }} /></div>
                } else if (text === 2) {
                    info = <div><Badge count={2} style={{ backgroundColor: '#B56300' }} /></div>
                } else if (text === 3) {
                    info = <div><Badge count={3} style={{ backgroundColor: '#CDCD00' }} /></div>
                } else if (text === 4) {
                    info = <div><Badge count={4} style={{ backgroundColor: '#4F94CD' }} /></div>
                } else if (text === 100 || text === 5) {
                    info = <div><Badge count={5} style={{ backgroundColor: '#68228B' }} /></div>
                }
                return info
            }
        },
        {
            key: 'oz_AlarmID',
            dataIndex: 'oz_AlarmID',
            width: 170,
            title: '原始序列号',
        },
        {
            key: 'n_AppName',
            dataIndex: 'n_AppName',
            width: 200,
            title: '应用系统名称',
        },
        {
            key: 'nodeAlias',
            dataIndex: 'nodeAlias',
            width: 150,
            title: 'IP地址',
        },
        {
            key: 'node',
            dataIndex: 'node',
            width: 150,
            title: '主机名',
        },
        {
            key: 'n_ComponentType',
            dataIndex: 'n_ComponentType',
            width: 70,
            title: '告警大类',
        },
        {
            key: 'alertGroup',
            dataIndex: 'alertGroup',
            width: 160,
            title: '告警组',
        },
        {
            key: 'n_ObjectDesCr',
            dataIndex: 'n_ObjectDesCr',
            width: 300,
            title: '告警对象',
        },
        {
            key: 'n_SumMaryCn',
            dataIndex: 'n_SumMaryCn',
            width: 300,
            title: '告警描述',
        },
        {
            key: 'firstOccurrence',
            dataIndex: 'firstOccurrence',
            width: 150,
            title: '首次发生时间',
            render: (text, record) => {
                let time = record.firstOccurrence
                return new Date(time).format('yyyy-MM-dd hh:mm:ss')
            },
        },
        {
            key: 'lastOccurrence',
            dataIndex: 'lastOccurrence',
            width: 150,
            title: '最后发生时间',
            render: (text, record) => {
                let time = record.lastOccurrence
                return new Date(time).format('yyyy-MM-dd hh:mm:ss')
            },
        },
        {
            key: 'tally',
            dataIndex: 'tally',
            title: '重复次数',
            width: 70,
        },
        {
            key: 'n_RecoverType',
            dataIndex: 'n_RecoverType',
            width: 100,
            title: '是否可恢复',
            render: (text, record) => {
                let info = ''
                if (text === '0') {
                    info = '否'
                } else if (text === '1') {
                    info = '是'
                }
                return info
            },
        },
        {
            key: 'n_MgtOrg',
            dataIndex: 'n_MgtOrg',
            width: 70,
            title: '管理机构',
        },
        {
            key: 'n_OrgName',
            dataIndex: 'n_OrgName',
            width: 70,
            title: '所属机构',
        }]

        let columns = ColumState ? [...CustomColumns] : [..._columns]

        columns.push({
            title: '操作',
            // width: 60,
            render: (text, record) => {
                const menu = (
                    <Menu onClick={() => handleMenuClick(record)}>
                        <Menu.Item key="oda">
                            <Icon type="solution" />
                            告警根因推荐
                        </Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Button>工具</Button>
                    </Dropdown>
                )
            },
        })

        const colOperation = (cols) => {
            if (cols != undefined) {
                for (let col of cols) {
                    if (col.dataIndex === 'n_CustomerSeverity') {
                        col.render = (text, record) => {
                            let info = ''
                            if (text === 1) {
                                info = <div><Badge count={1} style={{ backgroundColor: '#C50000' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
                            } else if (text === 2) {
                                info = <div><Badge count={2} style={{ backgroundColor: '#B56300' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
                            } else if (text === 3) {
                                info = <div><Badge count={3} style={{ backgroundColor: '#CDCD00' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
                            } else if (text === 4) {
                                info = <div><Badge count={4} style={{ backgroundColor: '#4F94CD' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
                            } else if (text === 100 || text === 5) {
                                info = <div><Badge count={5} style={{ backgroundColor: '#68228B' }} /><Tooltip title="发送工单"><Button onClick={() => sendWorkOrder(record)} shape="circle" icon="export" /></Tooltip></div>
                            }
                            return info
                        }
                    }
                    if (col.dataIndex === 'firstOccurrence' || col.dataIndex === 'lastOccurrence') {
                        col.render = (text, record) => {
                            return new Date(text).format('yyyy-MM-dd hh:mm:ss')
                        }
                    }
                    if (col.dataIndex === 'n_RecoverType' || col.dataIndex === 'n_RecoverType') {
                        col.render = (text, record) => {
                            let info = ''
                            if (text === '0') {
                                info = '否'
                            } else if (text === '1') {
                                info = '是'
                            }
                            return info
                        }
                    }
                }
            }
        }
        colOperation(columns)
        return (
            <div style={{ background: '#fff', marginTop: 6, maxHeight: "25%" }}>
                <ResizTable
                    dispatch
                    bordered
                    simpl
                    size="small"
                    // scroll={{ y: 300, x: 2220 }}
                    saveCulumFlag={saveCulumFlag}
                    onRowDoubleClick={this.onRowDoubleClick}
                    columns={columns}
                    dataSource={DataSource}
                    pagination={false} //分页配置
                    footer={this.showTotal}
                    timeStamp={new Date().getTime()}
                />
            </div>

        )
    }
}

export default DetailsStic