import React, { useState, useEffect } from 'react'
import { Table, Button, Col } from 'antd'
import style from './tableHook.css'
import NestedTable from './TableFun'

function tableHook({ dispatch,loading, dataSource, qContion,pagination }) {
    
    const columns = [
        {
            title: '环境',
            dataIndex: 'env',
            key: 'env',
            width: '10%',
            render: (text, record) => {
                if (text == '0') {
                    return '测试开发'
                } else if(text == '1') {
                    return '准生产'
                } else {
                    return '自研平台'
                }
            }
        }, {
            title: '集群',
            dataIndex: 'clusterName',
            key: 'clusterName',
            width: '15%'
        }, {
            title: '命名空间',
            dataIndex: 'nameSpace',
            key: 'nameSpace',
            width: '15%'
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
    const propos = {
        dispatch,
        loading,
        dataSource,
        qContion,
        pagination
    }
    return (
        // <div  className={style.hg}>
        //     <Table
        //         bordered
        //         columns={columns}
        //         dataSource={dataSource}
        //         pagination={false}
        //         rowKey={record => record.uuid}
        //         size="middle"
        //     />
        // </div>
        <NestedTable {...propos} />

    )
}

export default tableHook