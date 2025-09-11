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
	      title: '本端IP',
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
	      dataIndex: 'state',
	      key: 'state',
	      filters:[
	      	{
	      		text: '异常',
				value: 0
	      	}
	      ],
	      filterMultiple: false,//互斥
	      onFilter: ( value, record ) => record.state > value,//如果选择的值与过滤的值相等
	      render: (text, record) => {
	        let state = ''
	        if (text === 0) {
	          state = '正常'
	        } else {
	          state = '异常'
	        }
	        return <Tag color={ text === 0 ? '#87d068' : '#f50' }>{state}</Tag>
	      },
	    }, {
	      title: 'RPING丢包率',
	      dataIndex: 'loss',
	      key: 'loss',
	      sorter: (a, b) => a.loss - b.loss,
	      render: (text, record) => {
	        return <div>{`${text}%`}</div>
	      },
	    }, {
	      title: 'RPING响应时间',
	      dataIndex: 'time',
	      key: 'time',
	      sorter: (a, b) => a.time - b.time,
	      render: (text, record) => {
	        return <div>{`${text}ms`}</div>
	      },
	    },
	]