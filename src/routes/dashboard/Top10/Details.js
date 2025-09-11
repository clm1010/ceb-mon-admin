import React from 'react'
import { Link } from 'dva/router'
import { Row, Card, Table, Badge, Tooltip } from 'antd'
import myStyle from './index.less'
function detail ({
	lossList,
	responseList,
	cpuList,
	memoryList,
	portUsageList,
	portTrafficList,
}) {
	//数值格式转换---start
	function formatNumber (num, precision, separator) {
	    let parts
	    // 判断是否为数字
	    if (!isNaN(parseFloat(num)) && isFinite(num)) {
	        // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
	        // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
	        // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
	        // 的值变成了 12312312.123456713
	        num = Number(num)
	        // 处理小数点位数
	        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString()
	        // 分离数字的小数部分和整数部分
	        parts = num.split('.')
	        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
	        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator || ','}`)

	        return parts.join('.')
	    }
	    return NaN
	}
	//数值格式转换---end

	//排序函数
	let by = function (name) {
	 	return function (o, p) {
	   		let a,
b
	   		if (typeof o === 'object' && typeof p === 'object' && o && p) {
	     		a = o[name]
	     		b = p[name]
	     		if (a === b) {
	       			return 0
	     		}
	     		if (typeof a === typeof b) {
	       			return a > b ? -1 : 1
	     		}
	     		return typeof a > typeof b ? -1 : 1
	   		}
	     		throw ('error')
	 	}
	}
	//入方向利用率+出方向利用率排序
	let portUsageNewList = []
	portUsageList.forEach((index) => {
		let sortValue = index.Iratio + index.Oratio
		index.sortValue = sortValue
//		num01 = num01.toFixed(4);
		portUsageNewList.push(index)
	})
	//入方向流量+出方向流量排序
	let portTrafficNewList = []
	portTrafficList.forEach((index) => {
		let sortValue = index.Iflow + index.Oflow
		index.sortValue = sortValue
		portTrafficNewList.push(index)
	})

	portUsageNewList.sort(by('sortValue'))
	portTrafficNewList.sort(by('sortValue'))

	const columns = [{
	  title: '主机名',
	  dataIndex: 'hostName',
	  key: 'hostName',
	  width: 160,
	  className: 'textLeft',
	  render: (text, record) => {
	  	let bgcolor = 'default'
	  	if (record.Severity == 1) {
	  		bgcolor = 'error'
	  	} else {
	  		bgcolor = 'success'
	  	}
	  	return <Tooltip placement="top" title={text}><Link to={`/chdlistall/${record.hostUUID}`} className={myStyle.LinkStyle2} target="_blank"><Badge status={bgcolor} text={record.hostName} style={{ textAlign: 'left' }} /></Link></Tooltip>
	  },

	}, {
	  title: '接口名',
	  dataIndex: 'interfaceName',
	  key: 'interfaceName',
	  className: 'textLeft',
	  width: 85,
	  render: (text, record) => {
	  	let bgcolor = 'default'
	  	if (record.iid == 1) {
	  		bgcolor = 'error'
	  	} else {
	  		bgcolor = 'success'
	  	}
	  	return <Tooltip placement="top" title={text}><Link to={`/chddetail/${record.uuid}`} className={myStyle.LinkStyle} target="_blank"><Badge status={bgcolor} text={record.interfaceName} /></Link></Tooltip>
	  },
	}, {
	  title: '入方向利用率',
	  dataIndex: 'Iratio',
	  key: 'Iratio',
	  className: 'textLeft',
	  width: 95,
	  sorter: (a, b) => a.Iratio - b.Iratio,
	  render: (percent, record) => {
//	  		let precents = parseFloat(percent.toFixed(2))
//	  		return <Progress percent={precents} type="circle" width={40} size="small" status="active"/>
	  		let precents = `${Math.round(percent * 100) / 100}%`
	  		return precents
	  },
	}, {
		title: '出方向利用率',
	  dataIndex: 'Oratio',
	  key: 'Oratio',
	  className: 'textLeft',
	  width: 95,
	  sorter: (a, b) => a.Oratio - b.Oratio,
	  render: (percent, record) => {
//	  		let precents = parseFloat(percent.toFixed(2))
//	  		return <Progress percent={precents} type="circle" width={40} size="small" status="active"/>
			let precents = `${Math.round(percent * 100) / 100}%`
	  		return precents
	  },
	}]
	const columns10 = [{
	  title: '主机名',
	  dataIndex: 'hostName',
	  key: 'hostName',
	  className: 'textLeft',
	  width: 160,
	  render: (text, record) => {
	  	let bgcolor = 'default'
	  	if (record.Severity == 0) {
	  		bgcolor = 'error'
	  	} else {
	  		bgcolor = 'success'
	  	}
	  	return <Tooltip placement="top" title={text}><Link to={`/chdlistall/${record.hostUUID}`} className={myStyle.LinkStyle2}><Badge status={bgcolor} text={record.hostName} /></Link></Tooltip>
	  },
	}, {
	  title: '接口名',
	  dataIndex: 'interfaceName',
	  key: 'interfaceName',
	  className: 'textLeft',
	  width: 85,
	  render: (text, record) => {
	  	let bgcolor = 'default'
	  	if (record.iid == 1) {
	  		bgcolor = 'error'
	  	} else {
	  		bgcolor = 'success'
	  	}
	  	return <Tooltip placement="top" title={text}><Link to={`/chddetail/${record.uuid}`} className={myStyle.LinkStyle}><Badge status={bgcolor} text={record.interfaceName} /></Link></Tooltip>
	  },
	}, {
	  title: '入方向流量',
	  dataIndex: 'Iflow',
	  key: 'Iratio ',
	  width: 85,
	  sorter: (a, b) => a.Iflow - b.Iflow,
	 render: (text, record) => {
	 	let v = ''
	 	if (text >= 1024 && text < 1048576) {
	 		v = `${formatNumber((text / 1024).toFixed(2))}MB`
	 	} else if (text >= 1073741824) {
	 		v = `${formatNumber((text / 1073741824).toFixed(2))}GB`
	 	} else if (text < 1024) {
	 		v = `${formatNumber(text)}KB`
	 	}
	 	return <span style={{ width: '100%', float: 'left', textAlign: 'left' }}>{v}</span>
	  },
	}, {
		title: '出方向流量',
	  dataIndex: 'Oflow',
	  key: 'Oratio',
	  width: 85,
	  sorter: (a, b) => a.Oflow - b.Oflow,
	  render: (text, record) => {
	  let v = ''
	 	if (text >= 1024 && text < 1048576) {
	 		v = `${formatNumber((text / 1024).toFixed(2))}MB`
	 	} else if (text >= 1073741824) {
	 		v = `${formatNumber((text / 1073741824).toFixed(2))}GB`
	 	} else if (text < 1024) {
	 		v = `${formatNumber(text)}KB`
	 	}
	 	return <span style={{ width: '100%', float: 'left', textAlign: 'left' }}>{v}</span>
	  },
	}]

	const columns20 = [{
	  title: '主机名',
	  dataIndex: 'hostName',
	  key: 'hostName',
	  render: (text, record) => {
	  	let bgcolor = 'default'
	  	if (record.Severity == 0) {
	  		bgcolor = 'error'
	  	} else {
	  		bgcolor = 'success'
	  	}
	  	return <Badge status={bgcolor} text={record.hostName} />
	  },
	}, {
	  title: '响应时间',
	  dataIndex: 'CorrespondingTime',
	  key: 'CorrespondingTime',
	  width: 80,
	  sorter: (a, b) => a.CorrespondingTime - b.CorrespondingTime,
	}, {
	  title: '丢包率',
	  dataIndex: 'packetloss',
	  key: 'packetloss',
	  width: 80,
	  sorter: (a, b) => a.packetloss - b.packetloss,
	}]

	const responseColumns = [{
	  title: '主机名',
	  dataIndex: 'deviceName',
	  key: 'deviceName',
  	  render: (text, record) => {
  		return <Tooltip placement="top" title={text}><Link to={`/chdlistresponse/${record.uuid}`} className={myStyle.LinkStyle1}>{record.deviceName}</Link></Tooltip>
  	  },
	}, {
	  title: '响应时间',
	  dataIndex: 'responseValue',
	  key: 'responseValue',
	  width: 85,
	  sorter: (a, b) => a.responseValue - b.responseValue,
	  render: (text, record) => {
	  	return <div>{record.responseValue.toFixed(2)}秒</div>
	  },
	}]

	const lossColumns = [{
	  title: '主机名',
	  dataIndex: 'deviceName',
	  key: 'deviceName',
	  render: (text, record) => {
	  		return <Tooltip placement="top" title={text}><Link to={`/chdlistloss/${record.uuid}`} className={myStyle.LinkStyle1}>{record.deviceName}</Link></Tooltip>
	  },
	}, {
	  title: '丢包率',
	  dataIndex: 'lossValue',
	  key: 'lossValue',
	  width: 80,
	  sorter: (a, b) => a.lossValue - b.lossValue,
	  render: (text, record) => {
	  	return <div>{record.lossValue.toFixed(2)}%</div>
	  },
	}]

	const cpuColumns = [{
	  title: '主机名',
	  dataIndex: 'deviceName',
	  key: 'deviceName',
	  render: (text, record) => {
	  		return <Tooltip placement="top" title={text}><Link to={`/chdlistcpu/${record.uuid}`} className={myStyle.LinkStyle1}>{record.deviceName}</Link></Tooltip>
	  },
	}, {
	  title: 'CPU使用率',
	  dataIndex: 'cpuValue',
	  key: 'cpuValue',
	  className: 'textLeft',
	  width: 100,
	  sorter: (a, b) => a.cpuValue - b.cpuValue,
	  render: (text, record) => {
	  	return <div>{record.cpuValue.toFixed(2)}%</div>
	  },
	}]

	const memoryColumns = [{
	  title: '主机名',
	  dataIndex: 'deviceName',
	  key: 'deviceName',
	  render: (text, record) => {
	  		return <Tooltip placement="top" title={text}><Link to={`/chdlistmemery/${record.uuid}`} className={myStyle.LinkStyle1}>{record.deviceName}</Link></Tooltip>
	  },
	}, {
	  title: '内存使用率',
	  dataIndex: 'memoryValue',
	  key: 'memoryValue',
	  className: 'textLeft',
	  width: 95,
	  sorter: (a, b) => a.memoryValue - b.memoryValue,
	  render: (text, record) => {
	  	return <div>{record.memoryValue.toFixed(2)}%</div>
	  },
	}]

	//end

	return (
  <Row gutter={6}>
    <Card bodyStyle={{
 width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
}}
      style={{ marginBottom: '6px' }}
      title="利用率最高的50条端口"
    >
      <Table
        dataSource={portUsageNewList}
        bordered
        columns={columns}
        size="small"
      />
    </Card>
    <Card bodyStyle={{
 width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
}}
      style={{ marginBottom: '6px' }}
      title="流量总量最高的10条端口"
    >
      <Table
        dataSource={portTrafficNewList}
        bordered
        columns={columns10}
        size="small"
      />
    </Card>
    <Card bodyStyle={{
 width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
}}
      style={{ marginBottom: '6px' }}
      title="Top 20 响应时间表 / 丢包率表"
    >
      <div style={{ width: '49%', float: 'left' }}>
        <Table
          dataSource={responseList}
          bordered
          columns={responseColumns}
          size="small"
        />
      </div>
      <div style={{ width: '49%', float: 'right' }}>
        <Table
          dataSource={lossList}
          bordered
          columns={lossColumns}
          size="small"
        />
      </div>
    </Card>

    <Card bodyStyle={{
 width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
}}
      style={{ marginBottom: '0px' }}
      title="Top 20 CPU使用率表 / 内存使用率表"
    >
      <div style={{ width: '49%', float: 'left' }}>
        <Table
          dataSource={cpuList}
          bordered
          columns={cpuColumns}
          size="small"
        />
      </div>
      <div style={{ width: '49%', float: 'right' }}>
        <Table
          dataSource={memoryList}
          bordered
          columns={memoryColumns}
          size="small"
        />
      </div>
    </Card>
  </Row>
	)
}

export default detail
