import '../dashboard/performance/list.css'
import { Link } from 'dva/router'
export default  [
	    {
	      title: '防火墙名称',
	      dataIndex: 'moname',
	      key: 'moname',
	      width: '450px',
	      render: (text, record) => {
	        return <div style={{ textAlign: 'left' }} title={text}><Link to={`/netfireWall?q==${record.hostip};${record.keyword};${record.branchname}`} target='_blank'>{text}</Link></div>
	      },
	    }, {
	    	title: '所属服务域',
	    	dataIndex: 'bizarea',
	    	width: '200px',
	    	key: 'bizarea',
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
	    }, {
	      title: '新建会话',
	      dataIndex: 'newSession',
	      sorter: (a, b) => a.newSession - b.newSession,
	      key: 'newSession',
	    }, {
	      title: '并发会话',
	      sorter: (a, b) => a.concurrentSession - b.concurrentSession,
	      dataIndex: 'concurrentSession',
	      key: 'concurrentSession',
	    }
	]