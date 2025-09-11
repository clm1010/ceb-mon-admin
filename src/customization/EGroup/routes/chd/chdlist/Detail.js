import React from 'react'
import { Link } from 'dva/router'
import { Row, Col, Tooltip, Select } from 'antd'
import InstrumentChart from './InstrumentChart'
import CpuLadderChart from './CpuLadderChart.js'
import MemLadderChart from './MemLadderChart.js'
import myStyle from '../Detail.less'

function detail ({
	dispatch,
	nodeDetails,
	intfDetails,
	instrumentChart,
	cpuLineChart,
	memLineChart,
	cpuTimescope,
	memTimescope,
	cpuGran,
	memGran,
	neUUID,
	isClosed,
}) {
	const handleCpuScopeChange = (value) => {
		dispatch({
			type: 'chd/nesquerys',
			payload: {
				neUUID,
				cpuTimescope: value,
				cpuGran,
			},
		})
	}

	const handleMemScopeChange = (value) => {
		dispatch({
			type: 'chd/nesquerys',
			payload: {
				neUUID,
				memTimescope: value,
				memGran,
			},
		})
	}

	const handleCpuGranChange = (value) => {
		dispatch({
			type: 'chd/nesquerys',
			payload: {
				neUUID,
				cpuTimescope,
				cpuGran: value,
			},
		})
	}

	const handleMemGranChange = (value) => {
		dispatch({
			type: 'chd/nesquerys',
			payload: {
				neUUID,
				memTimescope,
				memGran: value,
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
	// 返回上一页
	const goBack = () => {
		window.history.back()
	}
	return (
  <Row gutter={6}>
    <Col lg={7} md={7} sm={7} xs={7} style={{ backgroundColor: '#ffffff' }}>
      <div style={{
 width: '100%', height: '200px', overflow: 'hidden', marginBottom: '6px',
}}
      >
        <div style={{ fontSize: '16px' }}>响应时间/丢包率</div>
        <div className={myStyle.pan}><InstrumentChart {...instrumentChart} /></div>
      </div>
      <div style={{ width: '100%', height: '477px', marginBottom: '0px' }}>
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
              <Tooltip placement="top" title="branchName"><span>分支机构</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.mngtorg : ''}><span>{nodeDetails ? nodeDetails.mngtorg : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="设备名称"><span>设备名称</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.moname : ''}><span>{nodeDetails ? nodeDetails.moname : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="所属机构"><span>所属机构</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.org : ''}><span>{nodeDetails ? nodeDetails.org : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="代理"><span>代理</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.agent : ''}><span>{nodeDetails ? nodeDetails.agent : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="bizarea"><span>bizarea</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.bizarea : ''}><span>{nodeDetails ? nodeDetails.agent : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="component"><span>component</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.component : ''}><span>{nodeDetails ? nodeDetails.component : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="componetype"><span>componetype</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.componetype : ''}><span>{nodeDetails ? nodeDetails.componetype : ''}</span></Tooltip>
            </li>
            <li>
              <Tooltip placement="top" title="hostip"><span>hostip</span></Tooltip>
              <Tooltip placement="top" title={nodeDetails ? nodeDetails.hostip : ''}><span>{nodeDetails ? nodeDetails.hostip : ''}</span></Tooltip>
            </li>
            <li>
              <p>端口描述</p>
              <p>{nodeDetails ? nodeDetails.alias : ''}</p>
            </li>
          </ul>
        </div>
      </div>
    </Col>
    <Col lg={17} md={17} sm={17} xs={17} className={myStyle.rightPart} style={{ backgroundColor: '#eef2f9' }}>
      <div className="lines" />
      <div style={{ width: '100%', height: '335px', marginBottom: '6px' }}>
        <div style={{ fontSize: '16px' }}>
          <span>CPU使用率</span>

          <span style={{ float: 'right', fontSize: '12px' }}>
            {/*
							时间范围 :
							<Select defaultValue={cpuTimescope.toString()} style={{ width: 130 }} size="small" onChange={handleCpuScopeChange}>
				      			<Option value="86400">现在到往前推1天</Option>
				      			<Option value="604800">现在到往前推1周</Option>
				      			<Option value="2592000">现在到往前推1月</Option>
				      			<Option value="7776000">现在到往前推3个月</Option>
				      			<Option value="15552000">现在到往前推6个月</Option>
				      			<Option value="31104000">现在到往前推1年</Option>
				    			</Select>
				    			*/}
							&nbsp;&nbsp;聚合粒度 :&nbsp;
            <Select defaultValue={cpuGran.toString()} style={{ width: 80 }} size="small" onChange={handleCpuGranChange}>
              <Select.Option value="60">1分钟</Select.Option>
              <Select.Option value="300">5分钟</Select.Option>
              <Select.Option value="600">10分钟</Select.Option>
              <Select.Option value="900">15分钟</Select.Option>
              <Select.Option value="1800">30分钟</Select.Option>
              <Select.Option value="3600">1小时</Select.Option>
              <Select.Option value="86400">1天</Select.Option>
            </Select>
          </span>

        </div>
        <div className={myStyle.line}><CpuLadderChart {...cpuLineChart} /></div>
      </div>
      <div style={{ width: '100%', height: '342px', marginBottom: '6px' }}>
        <div style={{ fontSize: '16px' }}>
          <span>内存使用率</span>

          <span style={{ float: 'right', fontSize: '12px' }}>
            {/*
							时间范围 : <Select defaultValue={memTimescope.toString()} style={{ width: 130 }} size="small" onChange={handleMemScopeChange}>
			      				<Option value="86400">现在到往前推1天</Option>
			      				<Option value="604800">现在到往前推1周</Option>
			      				<Option value="2592000">现在到往前推1月</Option>
			      				<Option value="7776000">现在到往前推3个月</Option>
			      				<Option value="15552000">现在到往前推6个月</Option>
			      				<Option value="31104000">现在到往前推1年</Option>
			    				</Select>
			    				*/}
							&nbsp;&nbsp;聚合粒度 :&nbsp;
            <Select defaultValue={memGran.toString()} style={{ width: 80 }} size="small" onChange={handleMemGranChange}>
              <Select.Option value="60">1分钟</Select.Option>
              <Select.Option value="300">5分钟</Select.Option>
              <Select.Option value="600">10分钟</Select.Option>
              <Select.Option value="900">15分钟</Select.Option>
              <Select.Option value="1800">30分钟</Select.Option>
              <Select.Option value="3600">1小时</Select.Option>
              <Select.Option value="86400">1天</Select.Option>
            </Select>
          </span>

        </div>
        <div className={myStyle.line}><MemLadderChart {...memLineChart} /></div>
      </div>
    </Col>
    <Col lg={24} md={24} sm={24} xs={24} style={{ backgroundColor: '#ffffff', position: 'relative', marginTop: 10 }}>
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
  </Row>
	)
}

export default detail
