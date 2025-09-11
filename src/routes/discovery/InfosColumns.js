import {Button} from "antd";
import React from "react";

export default  [
	{
      title: '发现IP',
      dataIndex: 'discoveryIp',
      key: 'discoveryIp',
     width:150
    },
	{
      title: '管理IP',
      dataIndex: 'looIp',
      key: 'looIp',
     width:150
    },
    {
      title: '设备名',
      dataIndex: 'name',
      key: 'name',
       width:150
    },
    {
      title: 'objectID',
      dataIndex: 'sobjectID',
      key: 'sobjectID',
       width:150
    }, {
      title: '描述信息',
      dataIndex: 'descr',
      key: 'descr',
     width:150
    }, {
      title: '设备位置',
      dataIndex: 'location',
      key: 'location',
      width:200
    }, {
      title: '设备服务',
      dataIndex: 'services',
      key: 'services',
     width:100
    }, {
      title: '返回类型',
      dataIndex: 'retCode',
      key: 'retCode',
     width:150,
    render: (text, record, index) => {
      if (text == "0"){
        return "规范设备"
      }else{
        return "不规范设备"
      }
    },
    }, {
    title: '备注信息',
    dataIndex: 'errMsg',
    key: 'errMsg',
     width:150
  }, {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
     width:150,
      render: (text, record) => {
      	return new Date(text).format('yyyy-MM-dd hh:mm:ss')
      },
    }, {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
     width:150
    }, {
      title: '最后更新者',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
     width:150
    }, {
      title: '最后更新时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
     width:150,
      render: (text, record) => {
      	return (text ? new Date(text).format('yyyy-MM-dd hh:mm:ss') : '')
      },
    }
]
