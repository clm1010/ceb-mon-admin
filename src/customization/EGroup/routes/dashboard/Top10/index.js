import React from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import Menus from '../performance/Menus'
import Details from './Details'
const top10 = ({
 dispatch, loading, location, top10,
}) => {
	const {
 lossListTop10, responseListTop10, cpuListTop10, memoryListTop10, portUsageListTop10, portTrafficListTop10,
} = top10
	//菜单配置项---start
	const menuProps = {
		current: 'Top 10',
		dispatch
	}
	//end
	//详情页配置项 --- start
	const DetailsProps = {
		lossList: lossListTop10,
		responseList: responseListTop10,
		cpuList: cpuListTop10,
		memoryList: memoryListTop10,
		portUsageList: portUsageListTop10,
		portTrafficList: portTrafficListTop10,
	}
	// end
	return (
  <Row gutter={6}>
    <Col span={24}>
      <Menus {...menuProps} />
    </Col>
    <Col span={24}>
      <Details {...DetailsProps} />
    </Col>
  </Row>
	)
}
export default connect(({ top10, loading }) => ({ top10, loading: loading.models.top10 }))(top10)
