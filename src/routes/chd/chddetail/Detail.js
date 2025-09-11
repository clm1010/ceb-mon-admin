import React from 'react'
import PropTypes from 'prop-types'
import { Link, routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Badge, Select, Icon, Card, DatePicker } from 'antd'
import moment from 'moment'

import InstrumentChart from './InstrumentChart'
import LadderChart from './LadderChart'
import LadderChartM from './LadderChartM'
import LadderChartG from './LadderChartG'
import ScatterChart from './ScatterChart'
import LossChart from './LossChart' 
import WrongChart from './wrongChart'
import Alarm from '../alarm.js'
import './Detail.css'
const { RangePicker } = DatePicker

function detail ({
	nodeDetails,
	instrumentChart,
	portUtilization,
	folwAvg,
	usageTimescope,
	flowTimescope,
	usageGran,
	flowGran,
	lossGran,
	wrongGran,
	lossTimescope,
	wrongTimescope,
	neUUID,
	wrongChart,
   	lossChart,
	dispatch,
	unitState,
	flowTimeStart,
	flowTimeEnd,
	usageStart,
	usageEnd,
	lossStart,
	lossEnd,
	wrongStart,
	wrongEnd,
	alarmDataSource,
	paginationAlarm,
	uuid,
	poetName,
	branch,
	loading,
}) {
	folwAvg.loading = loading
	portUtilization.loading = loading
	lossChart.loading = loading
	wrongChart.loading = loading
	const alarmProps = {
		dataSource: alarmDataSource,
		paginationAlarm,
		uuid,
		poetName,
		dispatch,
		loading:loading.effects['interfaceChart/queryAlarm'],
		path: 'interfaceChart',
	}
	let keys = new Date().getTime()
	//端口流量图表自定义时间
	const onOk = (dates) => {
		dispatch({
			type: 'interfaceChart/querySuccess',
			payload: {
				flowTimeStart: moment(dates[0]).unix(),
				flowTimeEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'interfaceChart/flowQuery',
			payload: {
				flowTimeStart: moment(dates[0]).unix(),
				flowTimeEnd: moment(dates[1]).unix(),
				neUUID: uuid,
				poetName,
				branch,
			},
		})
	}
	//端口利用率图表自定义时间
	const usageOnOk = (dates) => {
		dispatch({
			type: 'interfaceChart/querySuccess',
			payload: {
				usageStart: moment(dates[0]).unix(),
				usageEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'interfaceChart/usageQuerys',
			payload: {
				usageStart: moment(dates[0]).unix(),
				usageEnd: moment(dates[1]).unix(),
				neUUID: uuid,
				poetName,
				branch,
			},
		})
	}
	//端口丢包
	const lossOnOk = (dates) => {
		dispatch({
			type: 'interfaceChart/querySuccess',
			payload: {
				lossStart: moment(dates[0]).unix(),
				lossEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'interfaceChart/queryLoss',
			payload: {
				neUUID: uuid,
				poetName,
				branch,
			},
		})
	}
	//端口错包
	const wrongOnOk = (dates) => {
		dispatch({
			type: 'interfaceChart/querySuccess',
			payload: {
				wrongStart: moment(dates[0]).unix(),
				wrongEnd: moment(dates[1]).unix(),
			},
		})
		dispatch({
			type: 'interfaceChart/queryWrong',
			payload: {
				neUUID: uuid,
				poetName,
				branch,
			},
		})
	}
	//端口利用率图表  切换时间范围
	const handleUsageScopeChange = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					usageTimescope: value,
					usageStart: 0,
					usageEnd: 0,
				},
			})
			dispatch({
				type: 'interfaceChart/usageQuerys',
				payload: {
					neUUID: uuid,
					poetName,
					branch,
				},
			})
	}
	//端口利用率图表   切换粒度
	const handleUsageGranChange = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					usageGran: value,
				},
			})
			dispatch({
				type: 'interfaceChart/usageQuerys',
				payload: {
					neUUID: uuid,
					poetName,
					branch,
				},
			})
	}

	//端口流量图表   切换时间范围
	const handleFlowScopeChange = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					flowTimescope: value,
					flowTimeStart: 0,
					flowTimeEnd: 0,
				},
			})
			dispatch({
				type: 'interfaceChart/flowQuery',
				payload: {
					neUUID: uuid,
					poetName,
					branch,
				},
			})
	}
	//端口流量图表   切换粒度
	const handleFlowGranChange = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					flowGran: value,
				},
			})
			dispatch({
				type: 'interfaceChart/flowQuery',
				payload: {
					neUUID: uuid,
					poetName,
					flowTimescope,
					flowGran: value,
					branch,
				},
			})
	}

	let IntfsDetails = {}
	if (nodeDetails && nodeDetails.content) {
		let arrs = nodeDetails.content
		IntfsDetails = arrs[0]
	}
	console.log('IntfsDetails : ', IntfsDetails)
	function LadderCharts () {
		if (unitState === 0) {
			return <LadderChart {...folwAvg} />
		} else if (unitState === 1) {
			return <LadderChartM {...folwAvg} />
		} else if (unitState === 2) {
			return <LadderChartG {...folwAvg} />
		}
	}
	const lossChartProps = {
    	lossChart,
	}
	const wrongChartProps = {
		wrongChart,
	}
	const onChangeLossTimescope = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					lossStart: 0,
					lossEnd: 0,
					lossTimescope: value,
				},
			})
			dispatch({
				type: 'interfaceChart/queryLoss',
				payload: {
					neUUID: uuid,
					poetName,
					branch,
				},
			})
	}
	const onChangeLossGran = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					lossGran: value,
				},
			})
			dispatch({
				type: 'interfaceChart/queryLoss',
				payload: {
					neUUID: uuid,
					poetName,
					lossTimescope,
					lossGran: value,
					branch,
				},
			})
	}
	const onChangeWrongTimescope = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					wrongTimescope: value,
					wrongStart: 0,
					wrongEnd: 0,
				},
			})
			dispatch({
				type: 'interfaceChart/queryWrong',
				payload: {
					neUUID: uuid,
					poetName,
					branch,
				},
			})
	}
	const onChangeWrongGran = (value) => {
			dispatch({
				type: 'interfaceChart/querySuccess',
				payload: {
					wrongGran: value,
				},
			})
			dispatch({
				type: 'interfaceChart/queryWrong',
				payload: {
					neUUID: uuid,
					wrongTimescope,
					wrongGran: value,
					poetName,
					branch,
				},
			})
	}
	//const links = <Link to=`/chdlistall?q=${nodeDetails.hostip}+${branch}`>{nodeDetails ? nodeDetails.hostip : ''}</Link>
	return (
  <div>
    <Row gutter={6} type="flex" justify="center">
      <Col lg={8} md={8} sm={8} xs={8} style={{ backgroundColor: '#FFFFFF' }}>
        <div style={{
 width: '100%', height: '200px', overflow: 'hidden', marginBottom: '6px',
}}
        >
          <div style={{ fontSize: '14px', paddingTop: 10 }}>接口出/入利用率</div>
          <div className="InterfacePan"><InstrumentChart {...instrumentChart} /></div>
        </div>
        <div style={{
 width: '100%', height: '395px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
        >
          <div style={{ fontSize: '14px' }}>接口信息</div>
          <div className="InterfaceStyle">

            <ul>
              <li>
                <p>接口状态</p>
                <p>{nodeDetails.status === '1' ? <Badge status="success" text="UP" /> : nodeDetails.status === '2' ? <Badge status="error" text="down" /> : <Badge status="default" text="未知" />}</p>
              </li>
              <li>
                <p>代理</p>
                <p>{nodeDetails ? nodeDetails.agent : ''}</p>
              </li>
              <li>
                <p>应用</p>
                <p>{nodeDetails ? nodeDetails.appname : ''}</p>
              </li>
              <li>
                <p>所属分行</p>
                <p>{nodeDetails ? nodeDetails.branchname : ''}</p>
              </li>
              <li>
                <p>设备管理机构</p>
                <p>{nodeDetails ? nodeDetails.mngtorg : ''}</p>
              </li>
              <li>
                <p>业务域</p>
                <p>{nodeDetails ? nodeDetails.bizarea : ''}</p>
              </li>

              <li>
                <p>主机IP</p>
                <p><Link to={`/chdlistall?q=${nodeDetails.hostip}+${branch}`}>{nodeDetails ? nodeDetails.hostip : ''}</Link></p>
              </li>
              <li>
                <p>关键字</p>
                <p>{nodeDetails ? nodeDetails.keyword : ''}</p>
              </li>
              <li>
                <p>名称</p>
                <p>{nodeDetails ? nodeDetails.moname : ''}</p>
              </li>
              <li>
                <p>管理机构</p>
                <p>{nodeDetails ? nodeDetails.mngtorg : ''}</p>
              </li>
              <li>
                <p>管理机构代码</p>
                <p>{nodeDetails ? nodeDetails.mngtorgcode : ''}</p>
              </li>
              <li>
                <p>端口描述</p>
                <p>{nodeDetails ? nodeDetails.alias : ''}</p>
              </li>
			  <li>
                <p>带宽</p>
                <p>{nodeDetails ? nodeDetails.value : ''}M</p>
              </li>
            </ul>
          </div>
        </div>
      </Col>

      <Col lg={16} md={16} sm={16} xs={16}>

        <div style={{
 width: '100%', height: '395px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
        >
          <div style={{ fontSize: '14px', marginBottom: '10px', paddingTop: 10 }}>
            <span style={{ marginLeft: 10 }}>端口流量图表</span>
{/*            <span style={{ float: 'right', fontSize: '12px', marginRight: 10 }} key={keys}>
									&nbsp;&nbsp;粒度 :&nbsp;
              <Select defaultValue={flowGran} style={{ width: 90 }} size="small" onChange={handleFlowGranChange}>
                <Select.Option value="year">年</Select.Option>
                <Select.Option value="month">月</Select.Option>
                <Select.Option value="day">日</Select.Option>
                <Select.Option value="hour">小时</Select.Option>
                <Select.Option value="minute">分钟</Select.Option>
              </Select>
           </span>*/}
            <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
              <Select defaultValue={flowTimescope.toString()} style={{ width: 110 }} size="small" onChange={handleFlowScopeChange}>
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
							范围 : <RangePicker defaultValue={[moment(flowTimeStart), moment(flowTimeEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" onOk={onOk} />
            </span>
          </div>
          <div style={{ fontSize: '16px' }} />
          <div>{LadderCharts()}</div>
        </div>

        <div style={{
 width: '100%', height: '395px', marginBottom: '6px', backgroundColor: '#FFFFFF',
}}
        >
          <div style={{ fontSize: '14px', marginBottom: '10px', paddingTop: 10 }}>
            <span style={{ marginLeft: 10 }}>端口利用率图表</span>
           {/* <span style={{ float: 'right', fontSize: '12px', marginRight: 10 }} key={keys}>
								&nbsp;&nbsp;粒度 :&nbsp;
              <Select defaultValue={usageGran} style={{ width: 90 }} size="small" onChange={handleUsageGranChange}>
                <Select.Option value="year">年</Select.Option>
                <Select.Option value="month">月</Select.Option>
                <Select.Option value="day">日</Select.Option>
                <Select.Option value="hour">小时</Select.Option>
                <Select.Option value="minute">分钟</Select.Option>
              </Select>
            </span>*/}
            <span style={{ float: 'right', fontSize: '12px', marginRight: '10px' }}>
              <Select defaultValue={usageTimescope.toString()} style={{ width: 110 }} size="small" onChange={handleUsageScopeChange}>
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
              <RangePicker defaultValue={[moment(usageStart), moment(usageEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" onOk={usageOnOk} />
            </span>
          </div>

          <div style={{ fontSize: '16px' }} />
          <div><ScatterChart {...portUtilization} /></div>
        </div>
      </Col>
    </Row>
    <Row gutter={6}>
      <Col lg={12} md={12} sm={12} xs={12}>
        <Card title="端口丢包"
          extra={
            <div>
					范围 :
              <RangePicker style={{ width: '220px' }} defaultValue={[moment(wrongStart), moment(wrongEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" onOk={lossOnOk} />
              <Select style={{ width: 90 }} defaultValue={lossTimescope.toString()} size="small" onChange={onChangeLossTimescope}>
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
					{/*&nbsp;&nbsp;粒度: <Select key={keys} style={{ width: 70 }} defaultValue={lossGran} size="small" onChange={onChangeLossGran}>
  <Select.Option value="year">年</Select.Option>
  <Select.Option value="month">月</Select.Option>
  <Select.Option value="day">日</Select.Option>
  <Select.Option value="hour">小时</Select.Option>
  <Select.Option value="minute">分钟</Select.Option>
                     </Select>*/}
            </div>
				}
        >
          <LossChart {...lossChartProps} />
        </Card>
      </Col>
      <Col lg={12} md={12} sm={12} xs={12}>
        <Card title="端口错包"
          extra={
            <div>
					范围 :
              <RangePicker style={{ width: '220px' }} defaultValue={[moment(wrongStart), moment(wrongEnd)]} showTime={{ format: 'HH:mm:ss' }} size="small" format="YYYY-MM-DD HH:mm:ss" onOk={wrongOnOk} />
              <Select style={{ width: 110 }} defaultValue={wrongTimescope.toString()} size="small" onChange={onChangeWrongTimescope}>
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
				{/*&nbsp;&nbsp;粒度: <Select key={keys} style={{ width: 70 }} defaultValue={wrongGran} size="small" onChange={onChangeWrongGran}>
				  <Select.Option value="year">年</Select.Option>
				  <Select.Option value="month">月</Select.Option>
				  <Select.Option value="day">日</Select.Option>
				  <Select.Option value="hour">小时</Select.Option>
				  <Select.Option value="minute">分钟</Select.Option>
                </Select>*/}
            </div>
				}
        >
          <WrongChart {...wrongChartProps} />
        </Card>
      </Col>
      <Col lg={24} md={24} sm={24} xs={24} style={{ backgroundColor: '#ffffff', position: 'relative' }}>
        <Alarm {...alarmProps} />
      </Col>
    </Row>
  </div>
	)
}

export default detail
