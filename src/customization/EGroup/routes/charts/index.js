import React from 'react'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import myStyle1 from './style.css'
import BarChart from './BarChart'
import PieChart from './PieChart'
import MapChart from './MapChart'
import HeatChart from './HeatChart'
import LineChart from './LineChart'
import Modal from './Modal'
const charts = ({
 dispatch, charts, loading, location, oel,
}) => {
  const { chartList, modalVisible, modalName } = charts

  let chartHtml = []
  if (chartList && chartList.length > 0) {
  	for (let chart of chartList) {
  		let chartProps = {
  			dispatch,
    		loading,
    		data: chart.data,
    		title: chart.title,
    		modalName,
  		}
			if (chart.type === 'bar') {
	  		chartHtml.push(<Col lg={4} md={4} key={chart.title} style={{ margin: '6px 0' }}>
  <div className={myStyle1.boxStyle}>
    <div className={myStyle1.boxStyleInner}>
      <BarChart {...chartProps} />
    </div>
  </div>
</Col>)
  		} else if (chart.type === 'pie') {
	  		chartHtml.push(<Col lg={4} md={4} key={chart.title} style={{ margin: '6px 0' }}>
  <Card>
    <PieChart {...chartProps} />
  </Card>
</Col>)
  		}
  	}
  }

  const modalProps = {
    dispatch,
    visible: modalVisible,
    loading,
    location,
    oel,
    modalName,
  }
  return (
    <div>
      <Row gutter={24}>
        <Col lg={8} md={8} key={123}>
          <Card>
            <MapChart />
          </Card>
        </Col>
        {chartHtml}
      </Row>
      <Row gutter={24}>
        <Card>
          <HeatChart />
        </Card>
      </Row>
      <Row gutter={24}>
        <Card>
          <LineChart />
        </Card>
      </Row>
      <Modal {...modalProps} />

    </div>

  )
}

export default connect(({ oel, charts, loading }) => ({ oel, charts, loading: loading.models.charts }))(charts)
