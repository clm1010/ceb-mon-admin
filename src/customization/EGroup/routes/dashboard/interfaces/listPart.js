import React from 'react'
import myStyle from './myStyle.css'
import { Link } from 'dva/router'
import { Col, Table, Tooltip, Icon } from 'antd'
import routerImg from './router.png'
import fireWallImg from './firewall.png'
import f5Img from './f5.png'
import switchImg from './switch.png'
const listPart = ({
 dispatch, loading, location, list, pagination, onPageChangeList, oel,
}) => {
	const interfaceDetail = (record, e) => {
		dispatch({
			type: 'interfaces/queryById',
			payload: {
				neUUID: record.uuid,
			},
		})
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalVisible: true,
				isClose: false,
			},
		})
	}

	const oelDetail = (record, e) => {
		let tagFilters = new Map()
  		tagFilters.set(1, { name: 'nodeAlias', op: '=', value: `${record.discoveryIP}` })

  		//触发查询展示oel报表
		dispatch({
      		type: 'oel/query',
      		payload: {
        			tagFilters,
      		},
    		})
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalOelVisible: true,
			},
		})
	}

	const interfaceNums = (record, e) => {
		dispatch({
			type: 'interfaces/queryInterfaceNums',
			payload: {
				uuid: record.uuid,
			},
		})
		dispatch({
			type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
			payload: {
				modalInterfaceVisible: true,
				isInterfaceClose: false,
			},
		})
	}
	let dataSource = []
	list.forEach((objs, index) => {
		let detail = {}
		let mObjs = objs.mo
		detail.name = `${mObjs.alias} ${mObjs.hostname}`
		detail.details = `${mObjs.org}-${mObjs.firstSecArea}-${mObjs.vendor}`
		detail.interfaces = objs.settedNum
		detail.uuid = mObjs.uuid
		detail.key = mObjs.uuid
		detail.secondClass = mObjs.secondClass
		detail.discoveryIP = mObjs.discoveryIP
		dataSource.push(detail)
	})
	const columns = [{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		className: 'listPart01',
		render: (text, record) => (
  <div>
    <span><img src={record.secondClass === 'ROUTER' ? routerImg : record.secondClass === 'F5' ? f5Img : record.secondClass === 'SWITCH' ? switchImg : fireWallImg} /></span>
    <Tooltip title={text}><span>{text}</span></Tooltip>
  </div>
	  	),
	}, {
		title: 'Details',
		dataIndex: 'details',
		key: 'details',
		className: 'listPart02',
	}, {
		title: 'Interfaces',
		dataIndex: 'interfaces',
		key: 'interfaces',
		className: 'listPart03',
		render: (text, record) => (
  <div>
    <span>接口数: </span>
    <span><a href="javascript:;" onClick={e => interfaceNums(record, e)}>{text}</a></span>
  </div>
	  	),
	}, {
		title: 'Action',
		key: 'action',
		className: 'listPart04',
		render: (text, record) => (
  <span>
    <Tooltip title="设备性能详情"><Link to={`/chdlistall/${record.uuid}`} className="listButton01" target="_blank"><Icon type="bar-chart" /></Link></Tooltip>
    <Tooltip title="告警列表"><a href="javascript:;" className="listButton02" onClick={e => oelDetail(record, e)}><Icon type="layout" /></a></Tooltip>
    {/*<Tooltip title='OEL'><a href="javascript:;" className='listButton03' onClick={e => oelDetail(record, e)}>oel</a></Tooltip>*/}
    <Tooltip title="设备详情"><a href="javascript:;" className="listButton04" onClick={e => interfaceDetail(record, e)}><Icon type="info" /></a></Tooltip>
  </span>
	  	),
	}]

	return (
  <Col span={24} className={myStyle.nextPart}>
    <div >
      <Table
        showHeader
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onPageChangeList}
        pagination={pagination}
        rowKey={record => record.uuid}
      />
    </div>
  </Col>
	)
}
export default listPart
