import React from 'react'
import { connect } from 'dva'
import { routerRedux, Link } from 'dva/router'
import { Row, Col, Card, Table, Tooltip } from 'antd'
import Menus from '../performance/Menus'
import Search from '../Search.js'
import filterSchema from '../fileitem'
import queryString from "query-string"

const response = ({
 dispatch, loading, location, performance,
}) => {
	const { responseList, paginationResponse } = performance
	const user = JSON.parse(sessionStorage.getItem('user'))
	//菜单配置项---start
	const menuProps = {
		current: 'Response',
		dispatch,
		userbranch:user.branch
	}
	//end
	const responseColumns = [{
	  title: '主机名',
	  dataIndex: 'deviceName',
	  key: 'deviceName',
	  width: 170,
  	  render: (text, record) => {
  		return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chdlistresponse?q=${record.histIp}+${record.branchname}`} target="_blank">{record.deviceName}</Link></Tooltip></div>
  	  },
	}, {
	  title: '时间',
	  dataIndex: 'time',
	  key: 'time',
	  width: 120,
	  render: (text, record) => {
	  	return <div style={{ float: 'left' }}>{text}</div>
	  },
	}, {
	  title: '响应时间',
	  dataIndex: 'responseValue',
	  key: 'responseValue',
	  width: 70,
	  render: (text, record) => {
	  	return <div style={{ float: 'left', height: '20px' }}>{`${text}秒`}</div>
	  },
	}]
	function onPageChangeResponse (page, filters) {
		const { query, pathname } = location
		dispatch(routerRedux.push({
			pathname,
			query: {
				...query,
			  	pageResponse: page.current - 1,											//分页要减1，因为后端数据页数从0开始
			  	pageSizeResponse: page.pageSize,
			},
		}))
	}
	const filterProps = {
		filterSchema: filterSchema,
		dispatch,
		onSearch(queryTerms) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			query.queryTerms = queryTerms
			dispatch(routerRedux.push({
				pathname,
				query,
			}))
		},
	  }
	return (
  <Row gutter={6}>
    <Col span={24}>
      <Menus {...menuProps} />
    </Col>
	<Col span={24} >
          <Search {...filterProps} />
      </Col>
    <Col span={24}>
      <Card bodyStyle={{
 width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
}}
        style={{ marginBottom: '6px' }}
        title="Top 20 响应时间表"
      >
        <div style={{ width: '100%', float: 'left' }}>
          <Table
            dataSource={responseList}
            bordered
            columns={responseColumns}
            size="small"
//			onChange={onPageChangeResponse}
            pagination={false}
          />
        </div>

      </Card>
    </Col>
  </Row>
	)
}
export default connect(({ performance, loading }) => ({ performance, loading: loading.models.performance }))(response)
