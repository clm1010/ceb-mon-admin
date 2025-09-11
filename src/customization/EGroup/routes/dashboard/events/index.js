import React from 'react'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import Menus from '../performance/Menus'
import DashboardAlarm from '../alarm'

const events = ({ dispatch, loading, location, events, performance }) => {
	const user = JSON.parse(sessionStorage.getItem('user'))
	//菜单配置项---start
	const menuProps = {
		current: 'Events',
		dispatch,
		userbranch:user.branch
	}
	//end

	function onPageChange (page, filters) {
		const { query, pathname } = location
//		dispatch(routerRedux.push({
//			pathname,
//			query: {
//				...query,
//			  	page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
//			  	pageSize: page.pageSize,
//			},
//		}))

		dispatch({
		    	type: 'performance/queryEvent',
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
             	pageSize: page.pageSize,
			},
		})
	}

	const dashboardAlarmProps = {
		dataSource: performance.alarmList,
    	paginationAlarm: false,
    	loading: false
  	}
	return (
  <Row gutter={6}>
    <Col span={24}>
      <Menus {...menuProps} />
    </Col>
    <Col span={24}>
      <Card bodyStyle={{ width: '98%', border: 'none', padding: 6 }} style={{ marginBottom: '6px' }} title="最新100条告警">
        <DashboardAlarm {...dashboardAlarmProps} />
      </Card>
    </Col>
  </Row>
	)
}
export default connect(({ events, loading, performance }) => ({ events, performance, loading: loading }))(events)
