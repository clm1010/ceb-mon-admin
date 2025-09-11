import React from 'react'
import { Link } from 'dva/router'
import { Row, Col, Tooltip, Select, Table, Spin, Badge, DatePicker } from 'antd'
import InstrumentChart from './InstrumentChart'
import CpuLadderChart from './CpuLadderChart.js'
import MemLadderChart from './MemLadderChart.js'
import ResponseLadderChart from './ResponseLadderChart.js'
import LossLadderChart from './LossLadderChart.js'
import myStyle from '../Detail.less'
import moment from 'moment'
import Alarm from '../alarm.js'
const { RangePicker } = DatePicker

function detail ({
	dispatch,
	nodeDetails,
	intfDetails,
	instrumentChart,
	cpuLineChart,
	memLineChart,
	responseLineChart,
  	lossLineChart,
	cpuTimescope,
	memTimescope,
	responseTimescope,
	lossTimescope,
	cpuStar,
	cpuEnd,
	memStar,
	memEnd,
	responseStar,
	responseEnd,
	lossStar,
	lossEnd,
	cpuGran,
	memGran,
	responseGran,
	lossGran,
	neUUID,
	isClosed,
	paginationIntf,
	tableState,
	loading,
	alarmDataSource,
	paginationAlarm,
	branch,
	uuid,
}) {
	cpuLineChart.loading = loading
	memLineChart.loading = loading
	responseLineChart.loading = loading
	lossLineChart.loading = loading
	const newPaginationIntf = {
		showSizeChanger: true,
		showQuickJumper: true,
		showTotal: total => `共 ${total} 条`,
		total: intfDetails.length,
		pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
	}
	//alarms表格
	const alarmProps = {
		dataSource: alarmDataSource,
		paginationAlarm,
		uuid,
		dispatch,
		loading:loading.effects['chd/queryAlarm'],
		path: 'chd',
	}
	let keys = new Date().getTime()
	//cpu使用率自定义时间
	const cpuOnOk = (dates) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				cpuStar: moment(dates[0]).unix(),
				cpuEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'chd/queryCPU',
			payload: {
				cpuStar: moment(dates[0]).unix(),
				cpuEnd: moment(dates[1]).unix(),
				neUUID,
				branch,
			},
		})
	}

	//内存利用率自定义时间
	const memOnOk = (dates) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				memStar: moment(dates[0]).unix(),
				memEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'chd/queryMem',
			payload: {
				memStar: moment(dates[0]).unix(),
				memEnd: moment(dates[1]).unix(),
				neUUID,
				branch,
			},
		})
	}
	//响应时间自定义时间
	const responseOnOk = (dates) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				responseStar: moment(dates[0]).unix(),
				responseEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'chd/queryResponse',
			payload: {
				responseStar: moment(dates[0]).unix(),
				responseEnd: moment(dates[1]).unix(),
				neUUID,
				branch,
			},
		})
	}
	//丢包率自定义时间
	const lossOnOk = (dates) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				lossStar: moment(dates[0]).unix(),
				lossEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'chd/queryLoss',
			payload: {
				lossStar: moment(dates[0]).unix(),
				lossEnd: moment(dates[1]).unix(),
				neUUID,
				branch,
			},
		})
	}
	//CPU使用率   切换时间范围
	const handleCpuScopeChange = (value) => {
			dispatch({
				type: 'chd/showModal',
				payload: {
					cpuStar: 0,
					cpuEnd: 0,
					cpuTimescope: value,
				},
			})
			dispatch({
				type: 'chd/queryCPU',
				payload: {
					neUUID,
					branch,
				},
			})
	}
	//CPU使用率    切换粒度
	const handleCpuGranChange = (value) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				cpuGran: value,
			},
		})
		dispatch({
			type: 'chd/queryCPU',
			payload: {
				neUUID,
				cpuTimescope,
				cpuGran: value,
				branch,
			},
		})
	}

	//内存使用率   切换粒度
	const handleMemGranChange = (value) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				memGran: value,
			},
		})
		dispatch({
			type: 'chd/queryMem',
			payload: {
				neUUID,
				memTimescope,
				memGran: value,
				branch,
			},
		})
	}

	//内存使用率    切换时间范围
	const handleMemScopeChange = (value) => {
			dispatch({
				type: 'chd/showModal',
				payload: {
					memStar: 0,
					memEnd: 0,
					memTimescope: value,
				},
			})
			dispatch({
				type: 'chd/queryMem',
				payload: {
					neUUID,
					branch,
				},
			})
	}

	//响应时间    切换粒度
	const handleResponseGranChange = (value) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				responseGran: value,
			},
		})
		dispatch({
			type: 'chd/queryResponse',
			payload: {
				neUUID,
				responseTimescope,
				responseGran: value,
				branch,
			},
		})
	}

	//响应时间   切换时间范围
	const handleResponseScopeChange = (value) => {
			dispatch({
				type: 'chd/showModal',
				payload: {
					responseStar: 0,
					responseEnd: 0,
					responseTimescope: value,
				},
			})
			dispatch({
				type: 'chd/queryResponse',
				payload: {
					neUUID,
					branch,
				},
			})
	}

	//丢包率   切换粒度
	const handleLossGranChange = (value) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				lossGran: value,
			},
		})
		dispatch({
			type: 'chd/queryLoss',
			payload: {
				neUUID,
				lossTimescope,
				lossGran: value,
				branch,
			},
		})
	}

	//丢包率   切换时间范围
	const handleLossScopeChange = (value) => {
			dispatch({
				type: 'chd/showModal',
				payload: {
					lossStar: 0,
					lossEnd: 0,
					lossTimescope: value,
				},
			})
			dispatch({
				type: 'chd/queryLoss',
				payload: {
					neUUID,
					branch,
				},
			})
	}

	const listValue = () => {
		return (
  <ul>
    {
        				intfDetails.map(number =>
          <li><Tooltip placement="top" title={number.name}><Link to={`/chddetail/${number.id}`} className={myStyle.LinkStyle} target="_blank"><div>{number.name}</div><div>{number.partIn}</div><div>{number.partOut}</div></Link></Tooltip></li>)
    				}
  </ul>
		)
	}

	const onPageChangeIntf = (page) => {
		dispatch({
			type: 'chd/showModal',
			payload: {
				tableState: true,
			},
		})
      	dispatch({
		    	type: 'chd/querys',
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
             	pageSize: page.pageSize,
			},
		})
  	}

	const columns = [
    {
	  	title: '端口名称',
	  	dataIndex: 'portName',
	  	key: 'portName',
	  	render: (text, record) => {
			return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${neUUID}+${record.portName}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
		},
    }, {
	  	title: '端口状态',
	  	dataIndex: 'portState',
	  	key: 'portState',
	  	render: (text, record) => {
	  		if (text === '1') {
	  			return <Badge status="success" text="up" />
	  		} else if (text === '2') {
	  			return <Badge status="error" text="down" />
	  		} else if (text === '3') {
	  			return <Badge status="warning" text="shut down" />
	  		}
	  			return <Badge status="warning" text="-" />
	  	},
    }, {
    	title: '端口描述',
    	dataIndex: 'port',
    },{
    	title: '带宽',
    	dataIndex: 'rate',
		render: (text, record) => {
			if (record.rate === undefined || record.rate === '') {
				return ''
			}
				return `${text}M`
		},
    }, {
      	title: '入方向利用率',
      	dataIndex: 'precentsIn',
      	key: 'precentsIn',
		sorter: (a, b) => {
	
		let aValue = parseInt(a.precentsIn),
			bValue = parseInt(b.precentsIn)

		return aValue - bValue
				
		}, 		  
      	render: (text, record) => {
      		if (record.precentsIn === undefined || record.precentsIn === '') {
      			return ''
      		}
      			return text
      	},
    }, {
      	title: '入方向流量',
      	dataIndex: 'inValue',
      	key: 'inValue',
      	sorter: (a, b) => {
			const regUnit = /\w?bps$/gi, regValue = /[0-9]\d*\.?\d*/gi
			let aUnit = a.inValue.match(regUnit),
			    aValue = a.inValue.match(regValue),
				bUnit = b.inValue.match(regUnit),
			    bValue = b.inValue.match(regValue)

			if (aValue&&bValue){
				aValue = (aUnit[0].toLowerCase() === 'mbps')?1024*aValue[0]:(aUnit[0].toLowerCase() === 'gbps')?1024*1024*aValue[0]:aValue[0]
				bValue = (bUnit[0].toLowerCase() === 'mbps')?1024*bValue[0]:(bUnit[0].toLowerCase() === 'gbps')?1024*1024*bValue[0]:bValue[0]
				return aValue - bValue
			}
			return a.inValue - b.inValue
				
		  },
      	render: (text, record) => {
      		if (record.inValue === undefined || record.inValue === '') {
      			return ''
      		}
      			return text
      	},
    }, {
      	title: '出方向利用率',
      	dataIndex: 'precentsOut',
      	key: 'precentsOut',
		sorter: (a, b) =>{
	
			let aValue = parseInt(a.precentsOut),
				bValue = parseInt(b.precentsOut)
	
			return aValue - bValue
					
			}, 
      	render: (text, record) => {
      		if (record.precentsOut === undefined || record.precentsOut === '') {
      			return ''
      		}
      			return text
      	},
    }, {
      	title: '出方向流量',
      	dataIndex: 'outValue',
      	key: 'outValue',
		  sorter: (a, b) => {
			const regUnit = /\w?bps$/gi, regValue = /[0-9]\d*\.?\d*/gi
			let aUnit = a.outValue.match(regUnit),
			    aValue = a.outValue.match(regValue),
				bUnit = b.outValue.match(regUnit),
			    bValue = b.outValue.match(regValue)

			if (aValue&&bValue){
				aValue = (aUnit[0].toLowerCase() === 'mbps')?1024*aValue[0]:(aUnit[0].toLowerCase() === 'gbps')?1024*1024*aValue[0]:aValue[0]
				bValue = (bUnit[0].toLowerCase() === 'mbps')?1024*bValue[0]:(bUnit[0].toLowerCase() === 'gbps')?1024*1024*bValue[0]:bValue[0]
				return aValue - bValue
			}
			return a.outValue - b.outValue
				
		  },		  
      	render: (text, record) => {
      		if (record.outValue === undefined || record.outValue === '') {
      			return '-'
      		}
      			return text
      	},
    },
    {
    	title: '输入丢包',
      	dataIndex: 'inDis',
      	key: 'inDis',
		sorter: (a, b) =>{
	
			let aValue = parseInt(a.inDis),
				bValue = parseInt(b.inDis)
	
			return aValue - bValue
					
			},	  
      	render: (text, record) => {
      		if (record.inDis === undefined || record.inDis === '') {
      			return ''
      		}
      			return text
      	},
    },
    {
    	title: '输出丢包',
      	dataIndex: 'outDis',
      	key: 'outDis',
		sorter: (a, b) => {
	
			let aValue = parseInt(a.outDis),
				bValue = parseInt(b.outDis)
	
			return aValue - bValue
					
			},	  
      	render: (text, record) => {
      		if (record.outDis === undefined || record.outDis === '') {
      			return ''
      		}
      			return text
      	},
    },
    {
    	title: '输入错包',
      	dataIndex: 'inErr',
      	key: 'inErr',
		sorter: (a, b) => {
	
			let aValue = parseInt(a.inErr),
				bValue = parseInt(b.inErr)
	
			return aValue - bValue
					
			},			  
      	render: (text, record) => {
      		if (record.inErr === undefined || record.inErr === '') {
      			return ''
      		}
      			return text
      	},
    },
    {
    	title: '输出错包',
      	dataIndex: 'outErr',
      	key: 'outErr',
		sorter: (a, b) =>  {
	
			let aValue = parseInt(a.outErr),
				bValue = parseInt(b.outErr)
	
			return aValue - bValue
					
			},		  
      	render: (text, record) => {
      		if (record.outErr === undefined || record.outErr === '') {
      			return ''
      		}
      			return text
      	},
    },
  	]

	const searchKeyword = (value) => {
		dispatch({
			type: 'chd/querySuccess',
			payload: {
				keywordValue: value,
			},
		})
		dispatch({
			type: 'chd/querys',
			payload: {
				keywordValue: value,
			},
		})
	}
	return (
  <Row gutter={6}>
    <Col lg={7} md={7} sm={7} xs={7} style={{ backgroundColor: '#ffffff' }}>
      <div style={{
 width: '100%', height: '200px', overflow: 'hidden', marginBottom: '6px', paddingTop: 10,
}}
      >
        <div style={{ fontSize: '16px', paddingTop: '10px' }}>响应时间/丢包率</div>
        <div className={myStyle.pan}><InstrumentChart {...instrumentChart} /></div>
      </div>
      <div style={{ width: '100%', height: '477px', marginBottom: '0px' }} >
        <div style={{ fontSize: '16px' }}>设备详情</div>
        <div className={myStyle.nodePart}>
          <ul>
            <li>
              <Tooltip placement="top" title="应用编码"><span>应用编码</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.appname : ''}><span>{nodeDetails ? nodeDetails.appname : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="对象关键字"><span>对象关键字</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.keyword : ''}><span>{nodeDetails ? nodeDetails.keyword : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="branchname"><span>所属机构</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.branchname : ''}><span>{nodeDetails ? nodeDetails.branchname : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="设备名称"><span>设备名称</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.hostname : ''}><span>{nodeDetails ? nodeDetails.hostname : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="mngtorg"><span>管理机构</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.mngtorg : ''}><span>{nodeDetails ? nodeDetails.mngtorg : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="代理"><span>代理</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.agent : ''}><span>{nodeDetails ? nodeDetails.agent : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="bizarea"><span>服务域</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.bizarea : ''}><span>{nodeDetails ? nodeDetails.bizarea : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="component"><span>中类</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.component : ''}><span>{nodeDetails ? nodeDetails.component : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="componetype"><span>大类</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.componetype : ''}><span>{nodeDetails ? nodeDetails.componetype : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="hostip"><span>主机IP</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.hostip : ''}><span>{nodeDetails ? nodeDetails.hostip : ''}</span></Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </Col>
    <Col lg={17} md={17} sm={17} xs={17} className={myStyle.rightPart} style={{ backgroundColor: '#eef2f9' }}>
      <div className="lines" />
      <div style={{
 width: '100%', height: '335px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
      >
        <div style={{ fontSize: '16px', paddingTop: '10px' }}>
          <span style={{ marginLeft: '10px' }}>CPU使用率</span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }} key={keys}>
								&nbsp;&nbsp;粒度 :&nbsp;
            <Select defaultValue={cpuGran} style={{ width: 90 }} size="small" onChange={handleCpuGranChange}>
              {/*<Select.Option value="year">年</Select.Option>*/}
              <Select.Option value="month">月</Select.Option>
              <Select.Option value="day">日</Select.Option>
              <Select.Option value="hour">小时</Select.Option>
              <Select.Option value="minute">分钟</Select.Option>
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
            <Select defaultValue={cpuTimescope.toString()} style={{ width: 110 }} size="small" onChange={handleCpuScopeChange}>
              <Select.Option value="2">两个小时</Select.Option>
              <Select.Option value="24">一天之内</Select.Option>
              <Select.Option value="48">两天之内</Select.Option>
              <Select.Option value="120">五天之内</Select.Option>
              <Select.Option value="240">十天之内</Select.Option>
              <Select.Option value="360">十五天之内</Select.Option>
              <Select.Option value="720">三十天之内</Select.Option>
              <Select.Option value="1440">两个月之内</Select.Option>
              {/*<Select.Option value="2160">三个月之内</Select.Option>*/}
              {/*<Select.Option value="4320">半年之内</Select.Option>*/}
              {/*<Select.Option value="8760">一年之内</Select.Option>*/}
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
							&nbsp;&nbsp;范围 :&nbsp;
            <RangePicker onOk={cpuOnOk} defaultValue={[moment(cpuStar), moment(cpuEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" />
          </span>
        </div>
        <div><CpuLadderChart {...cpuLineChart} /></div>
      </div>

      <div style={{
 width: '100%', height: '342px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
      >
        <div style={{ fontSize: '16px', paddingTop: '10px' }}>
          <span style={{ marginLeft: 10 }}>内存使用率</span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: 10 }} key={keys}>
								&nbsp;&nbsp;粒度 :&nbsp;
            <Select defaultValue={memGran} style={{ width: 90 }} size="small" onChange={handleMemGranChange}>
              {/*<Select.Option value="year">年</Select.Option>*/}
              <Select.Option value="month">月</Select.Option>
              <Select.Option value="day">日</Select.Option>
              <Select.Option value="hour">小时</Select.Option>
              <Select.Option value="minute">分钟</Select.Option>
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
            <Select defaultValue={memTimescope.toString()} style={{ width: 110 }} size="small" onChange={handleMemScopeChange}>
              <Select.Option value="2">两个小时</Select.Option>
              <Select.Option value="24">一天之内</Select.Option>
              <Select.Option value="48">两天之内</Select.Option>
              <Select.Option value="120">五天之内</Select.Option>
              <Select.Option value="240">十天之内</Select.Option>
              <Select.Option value="360">十五天之内</Select.Option>
              <Select.Option value="720">三十天之内</Select.Option>
              <Select.Option value="1440">两个月之内</Select.Option>
              {/*<Select.Option value="2160">三个月之内</Select.Option>*/}
              {/*<Select.Option value="4320">半年之内</Select.Option>*/}
              {/*<Select.Option value="8760">一年之内</Select.Option>*/}
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
							&nbsp;&nbsp;范围 :&nbsp;
            <RangePicker onOk={memOnOk} defaultValue={[moment(memStar), moment(memEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" />
          </span>
        </div>
        <div><MemLadderChart {...memLineChart} /></div>
      </div>

    </Col>
    <Col lg={12} md={12} sm={12} xs={12} style={{ marginTop: 5 }}>
      <div style={{
 width: '100%', height: '342px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
      >
        <div style={{ fontSize: '16px', paddingTop: 10 }}>
          <span style={{ marginLeft: 10 }}>响应时间</span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: 10 }} key={keys}>
									&nbsp;&nbsp;粒度 :&nbsp;
            <Select defaultValue={responseGran} style={{ width: 60 }} size="small" onChange={handleResponseGranChange}>
              {/*<Select.Option value="year">年</Select.Option>*/}
              <Select.Option value="month">月</Select.Option>
              <Select.Option value="day">日</Select.Option>
              <Select.Option value="hour">小时</Select.Option>
              <Select.Option value="minute">分钟</Select.Option>
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
            <Select defaultValue={responseTimescope.toString()} style={{ width: 80 }} size="small" onChange={handleResponseScopeChange}>
              <Select.Option value="2">两个小时</Select.Option>
              <Select.Option value="24">一天之内</Select.Option>
              <Select.Option value="48">两天之内</Select.Option>
              <Select.Option value="120">五天之内</Select.Option>
              <Select.Option value="240">十天之内</Select.Option>
              <Select.Option value="360">十五天之内</Select.Option>
              <Select.Option value="720">三十天之内</Select.Option>
              <Select.Option value="1440">两个月之内</Select.Option>
              {/*<Select.Option value="2160">三个月之内</Select.Option>*/}
              {/*<Select.Option value="4320">半年之内</Select.Option>*/}
              {/*<Select.Option value="8760">一年之内</Select.Option>*/}
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
							&nbsp;&nbsp;范围 :&nbsp;
            <RangePicker onOk={responseOnOk} style={{ width: 150 }} defaultValue={[moment(responseStar), moment(responseEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" />
          </span>
        </div>
        <div><ResponseLadderChart {...responseLineChart} /></div>
      </div>
    </Col>
    <Col lg={12} md={12} sm={12} xs={12} style={{ marginTop: 5 }}>
      <div style={{
 width: '100%', height: '342px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
      >
        <div style={{ fontSize: '16px', paddingTop: 10 }}>
          <span style={{ marginLeft: 10 }}>丢包率</span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: 10 }} key={keys}>
							&nbsp;&nbsp;粒度 :&nbsp;
            <Select defaultValue={lossGran} style={{ width: 60 }} size="small" onChange={handleLossGranChange}>
              {/*<Select.Option value="year">年</Select.Option>*/}
              <Select.Option value="month">月</Select.Option>
              <Select.Option value="day">日</Select.Option>
              <Select.Option value="hour">小时</Select.Option>
              <Select.Option value="minute">分钟</Select.Option>
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
            <Select defaultValue={lossTimescope.toString()} style={{ width: 80 }} size="small" onChange={handleLossScopeChange}>
              <Select.Option value="2">两个小时</Select.Option>
              <Select.Option value="24">一天之内</Select.Option>
              <Select.Option value="48">两天之内</Select.Option>
              <Select.Option value="120">五天之内</Select.Option>
              <Select.Option value="240">十天之内</Select.Option>
              <Select.Option value="360">十五天之内</Select.Option>
              <Select.Option value="720">三十天之内</Select.Option>
              <Select.Option value="1440">两个月之内</Select.Option>
              {/*<Select.Option value="2160">三个月之内</Select.Option>*/}
              {/*<Select.Option value="4320">半年之内</Select.Option>*/}
              {/*<Select.Option value="8760">一年之内</Select.Option>*/}
            </Select>
          </span>
          <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
								&nbsp;&nbsp;范围 :&nbsp;
            <RangePicker onOk={lossOnOk} style={{ width: 150 }} defaultValue={[moment(lossStar), moment(lossEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" />
          </span>
        </div>
        <div><LossLadderChart {...lossLineChart} /></div>
      </div>
    </Col>
    {/*
			<Col lg={24} md={24} sm={24} xs={24} style={{backgroundColor: '#ffffff',position: 'relative'}}>
    				<div className={myStyle.linkPart}>
    					<div className={myStyle.linkTitle}>对应接口</div>
    					<div className={myStyle.linkTop}>
    						<div>端口</div>
    						<div>入方向利用率(流量)</div>
    						<div>出方向利用率(流量)</div>
    					</div>
    					<div className={myStyle.linkDetails}>
    						{listValue()}
    					</div>
    				</div>
    			</Col>
    			*/}
    <Col lg={24} md={24} sm={24} xs={24} style={{ backgroundColor: '#ffffff', position: 'relative' }}>
     {/*<Spin spinning={tableState}>*/}
        <div className={myStyle.intfTable} style={{ backgroundColor: '#FFFFFF' }}>
          <div className={myStyle.intfTableMain}>
            <Table
              bordered
              columns={columns}
              dataSource={intfDetails}
              pagination={newPaginationIntf}
              loading={loading.effects['chd/querys']}
              simple
              size="small"
            />
          </div>
        </div>
      {/*</Spin>*/}
    </Col>
    <Col lg={24} md={24} sm={24} xs={24} style={{ backgroundColor: '#ffffff', position: 'relative' }}>
      <Alarm {...alarmProps} />
    </Col>
  </Row>
	)
}

export default detail
