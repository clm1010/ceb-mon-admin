import React from 'react'
import { Table, Badge, Alert } from 'antd';

const NestedTable = ({ dispatch, dataSource, loading, qContion, pagination }) => {
    const expandedRowRender = (record, index) => {
        const columns = [
            { title: '指标名称', dataIndex: 'kpiName', key: 'kpiName' },
            { title: '指标描述', dataIndex: 'policyName', key: 'policyName' },
            {
                title: '应监控',
                dataIndex: 'shouldMonitor',
                key: 'shouldMonitor',
                render: (text) => (
                    <span>
                        <Badge status={text ? "success" : "error"} />
                    </span>
                ),
            },
            {
                title: '已监控',
                key: 'isMonitoring',
                dataIndex: 'isMonitoring',
                render: (text) => (
                    <span>
                        <Badge status={text ? "success" : "error"} />
                    </span>
                ),
            },
            { title: '监控标签', dataIndex: 'label', key: 'label' }
        ];
        return <Table columns={columns} dataSource={record.distriMonitorDetail} pagination={false} />;
    };

    const columns = [
        {
            title: '环境',
            dataIndex: 'env',
            key: 'env',
            width: '10%',
            render: (text, record) => {
                if (text == '0') {
                    return 'http://cpaas.td.io'
                } else if(text == '1') {
                    return 'http://cpaas.ms.io'
                } else {
                    return 'http://cpaas.eca.dev.cebbank'
                }
            }
        }, {
            title: '集群',
            dataIndex: 'clusterName',
            key: 'clusterName',
            render: (text, record) => {
                if (record.distriMonitorDetail && record.distriMonitorDetail.length > 0) {
                    return record.distriMonitorDetail[0].cluster
                } else {
                    return qContion.cluster
                }
            }
        }, {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            render: (text, record) => {
                if (record.distriMonitorDetail && record.distriMonitorDetail.length > 0) {
                    return record.distriMonitorDetail[0].namespace
                } else {
                    return qContion.namespace
                }
            }
        },
        {
            title: '应用名称',
            dataIndex: 'appName',
            key: 'appName',
        },
        {
            title: '应监控指标数',
            dataIndex: 'criNumber',
            key: 'criNumber',
        },
        {
            title: '实际监控指标数',
            dataIndex: 'aceNumber',
            key: 'aceNumber',
        },
        {
            title: '监控指标覆盖率',
            dataIndex: 'coverage',
            key: 'coverage',
        }
    ]

    const onPageChange = (page) => {
        qContion.parentCode = dataSource[0].distriMonitorTree.parentCode
        dispatch({
            type: 'autoSearch/queryTest',
            payload: {
                page: page.current - 1,
                pageSize: page.pageSize,
                qContion: qContion
            },
        })
    }
    let alertMess = '监控服务对接验证通过'
    let alertType = 'success'
    if (dataSource && dataSource.length > 0) {
        dataSource.forEach(element => {
            if (element.coverage != 100 && !(element.appName.includes('不涉及监控') || element.appName.includes('个性化服务'))) {
                alertMess = '监控服务对接验证不通过'
                alertType = 'error'
            }
        });
    }

    return (
        <>
            {dataSource && dataSource.length > 0 ? <Alert style={{ textAlign: 'center', marginBottom: 10 }} message={alertMess} type={alertType} showIcon /> : null}
            <Table
                // className="components-table-demo-nested"
                loading={loading}
                columns={columns}
                expandedRowRender={expandedRowRender}
                dataSource={dataSource}
                pagination={pagination}
                onChange={onPageChange}
            />
        </>

    );
}

export default NestedTable