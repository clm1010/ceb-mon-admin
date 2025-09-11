import React from 'react'
import { connect } from 'dva'
import { routerRedux, Link } from 'dva/router'
import { Row, Col, Card, Table, Progress, Tooltip } from 'antd'
import Menus from '../performance/Menus'

const memory = ({
 dispatch, loading, location, performance,
}) => {
	const { memoryList, paginationMemory } = performance
	const user = JSON.parse(sessionStorage.getItem('user'))
	//菜单配置项---start
	const menuProps = {
		current: 'Memory',
		dispatch,
		userbranch:user.branch
	}
	//end
	const memoryColumns = [{
	  title: '主机名',
	  dataIndex: 'deviceName',
	  key: 'deviceName',
	  width: 170,
	  render: (text, record) => {
	  		return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chdlistmemery?q=${record.histIp}+${record.branchname}`} target="_blank">{record.deviceName}</Link></Tooltip></div>
	  },
	}, {
	  title: '采集时间',
	  dataIndex: 'time',
	  key: 'time',
	  width: 120,
	  render: (text, record) => {
	  		return <div style={{ float: 'left' }}>{text}</div>
	  },
	}, {
	  title: '内存使用率',
	  dataIndex: 'memoryValue',
	  key: 'memoryValue',
	  width: 120,
	  render: (text, record) => {
	  		let statu = ''
	  		let info = `${text.toFixed(2)}%`
	  		if (parseInt(text) >= 0 && parseInt(text) <= 50) {
		 		statu = 'success'
		 	} else if (parseInt(text) > 50 && parseInt(text) <= 70) {
		 		statu = 'active'
		 	} else if (parseInt(text) > 70) {
		 		statu = 'exception'
		 	}
	  		return <Progress style={{ paddingRight: 10 }} status={statu} percent={parseInt(text) > 100 ? 100 : parseInt(text)} format={() => info} />
	  },
	}]
	function onPageChangeMemory (page, filters) {
		const { search, pathname } = location
		query = queryString.parse(search);
      query.page = page.current - 1
      query.pageSize = page.pageSize
		dispatch(routerRedux.push({
			pathname,
			search,
			query,
			/*query: {
				...query,
			  	pageMemory: page.current - 1,											//分页要减1，因为后端数据页数从0开始
			  	pageSizeMemory: page.pageSize,
			},*/
		}))
	}
	return (
  <Row gutter={6}>
    <Col span={24}>
      <Menus {...menuProps} />
    </Col>
    <Col span={24}>
      <Card bodyStyle={{
 width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
}}
        style={{ marginBottom: '0px' }}
        title="Top 20 内存使用率表"
      >
        <div style={{ width: '100%', float: 'right' }}>
          <Table
            dataSource={memoryList}
            bordered
            columns={memoryColumns}
            size="small"
//							onChange={onPageChangeMemory}
            pagination={false}
          />
        </div>
      </Card>
    </Col>
  </Row>
	)
}
export default connect(({ performance, loading }) => ({ performance, loading: loading.models.performance }))(memory)
