import React from 'react'
import '../performance/list.css'
import { Tag } from 'antd'
export default  [
	    {
	      title: '线路名称',
	      dataIndex: 'moname',
	      key: 'moname',
	      className: 'Line',
	      render: (text, record) => {
	        return <div title={text}><a target="_blank" href={`/dashboard/netLinePage?q==${record.hostip};${record.moname}`}>{text}</a></div>
	      },
	    }, {
	      title: '本端设备IP',
	      dataIndex: 'hostip',
	      key: 'hostip',
	      render: (text, record) => {
	        return <div style={{ textAlign: 'left' }}>{text}</div>
	      },
	    }, {
	      title: '对端IP',
	      dataIndex: 'keyword',
	      key: 'keyword',
	      render: (text, record) => {
	        return <div style={{ textAlign: 'left' }}>{text}</div>
	      },
	    },
	    {
	      title: '主机名',
	      dataIndex: 'hostname',
	      key: 'hostname',
	      render: (text, record) => {
	        return <div style={{ textAlign: 'left' }}>{text}</div>
	      },
	    }, {
	      title: 'RPING状态',
	      dataIndex: 'loss',
	      key: 'loss',
	      filters:[
	      	{
	      		text: '异常',value:'err'
	      	},
			{
				text: '正常',value:'succ'
			},
			{
				text: '-',value:'empty'
			}
	      ],
	      filterMultiple: false,//互斥
	      onFilter: ( value, record ) => {
			if(value == 'err'){
				return record.loss == 100
			}else if(value == 'empty'){
				return record.loss == -1
			}else if(value == 'succ'){
				return record.loss >= 0 && record.loss < 100
			}
		  },//如果选择的值与过滤的值相等
	      render: (text, record) => {
	        let state = ''
	        if (text === 100 ) {
	          state = '异常'
	        } else if(text == -1){
	          state = ''
	        }else {
			  state = '正常'
			}
	        return <Tag color={text === 100 ? '#f50' : text == -1? '' :'#87d068' }>{state}</Tag>
	      },
	    }, {
	      title: 'RPING丢包率',
	      dataIndex: 'loss1',
	      key: 'loss1',
	      sorter: (a, b) => a.loss - b.loss,
	      render: (text, record) => {
	        return record.loss > 50 ? <div style={{ color: '#f50' }}>{`${record.loss}%`}</div> : record.loss== -1 ? '' : <div>{`${record.loss}%`}</div>
	      },
	    }, {
	      title: 'RPING响应时间',
	      dataIndex: 'time',
	      key: 'time',
	      sorter: (a, b) => a.time - b.time,
	      render: (text, record) => {
	        return text== -1 ? '' : <div>{`${text}ms`}</div>
	      },
	    },
	]