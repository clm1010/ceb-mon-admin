import React from "react"
import '../dashboard/performance/list.css'
import { Link } from 'dva/router'
export default  [
	    {
	      title: '设备名称',
	      dataIndex: 'moname',
	      key: 'moname',
	      width: '100px',
	      render: (text, record) => {
	        return <div style={{ textAlign: 'left' }} title={text}><Link to={'javascript:void(0)'} target='_blank'>{text}</Link></div>
	      },
	    }, {
	    	title: '服务域',        
	    	dataIndex: 'appname',
	    	width: '60px',
	    	key: 'appname',
	    	render: (text, record) => {
	        	return <div style={{ textAlign: 'left' }} title={text}>{text}</div>
	      	}
	    },{
	      title: 'IP地址',
	      dataIndex: 'hostip',
	      key: 'hostip',
	      render: (text, record) => {
	        return <div style={{ textAlign: 'left' }}>{text}</div>
	      },
	    }, {
	      title: 'CPU利用率',
	      dataIndex: 'CPU',
	      sorter: (a, b) => a.CPU - b.CPU,
	      key: 'CPU',
	    },
	    {
	      title: '内存利用率',
	      dataIndex: 'memory',
	      sorter: (a, b) => a.memory - b.memory,
	      key: 'memory',
	    },{
	      title: '设备启动时间',
	      dataIndex: 'beginTime',
	      sorter: (a, b) => a.beginTime - b.beginTime,
	      key: 'beginTime',
	    },{
	      title: '一分钟服务端并发',
	      sorter: (a, b) => a.f5Server1 - b.f5Server1,
	      dataIndex: 'f5Server1',
	      key: 'f5Server1',
	    },{
	      title: '一分钟客户端并发',
	      dataIndex: 'f5Client1',
	      sorter: (a, b) => a.f5Client1 - b.f5Client1,
	      key: 'f5Client1',
	    },{
	      title: '一分钟并发总数',
	      sorter: (a, b) => a.f5Sum1 - b.f5Sum1,
	      dataIndex: 'f5Sum1',
	      key: 'f5Sum1',
	    },{
	      title: '一分钟总吞吐量（Mbps）',
	      dataIndex: 'f5Throughput1',
	      sorter: (a, b) => a.f5Throughput1 - b.f5Throughput1,
	      key: 'f5Throughput1',
	    },{
	      title: '五分钟服务端并发',
	      sorter: (a, b) => a.f5Server5 - b.f5Server5,
	      dataIndex: 'f5Server5',
	      key: 'f5Server5',
	    },{
	      title: '五分钟客户端并发',
	      dataIndex: 'f5Client5',
	      sorter: (a, b) => a.f5Client5 - b.f5Client5,
	      key: 'f5Client5',
	    }, {
	      title: '五分钟并发总数',
	      sorter: (a, b) => a.f5Sum5 - b.f5Sum5,
	      dataIndex: 'f5Sum5',
	      key: 'f5Sum5',
	    },{
	      title: '五分钟总吞吐量（Mbps）',
	      sorter: (a, b) => a.f5Throughput5 - b.f5Throughput5,
	      dataIndex: 'f5Throughput5',
	      key: 'f5Throughput5',
	    },{
	      title: '服务端新建连接',
	      dataIndex: 'newClient',
	      sorter: (a, b) => a.newClient - b.newClient,
	      key: 'newClient',
	    }, {
	      title: '客户端新建连接',
	      sorter: (a, b) => a.newSever - b.newSever,
	      dataIndex: 'newSever',
	      key: 'newSever',
	    }
	]