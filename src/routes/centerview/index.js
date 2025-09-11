import React from 'react'
import { connect } from 'dva'
import { Row, Col, Spin } from 'antd'
import BarChart from './BarChart'
import Countdown from './Countdown'

const customPanelStyle = {
  background: '#fff',
  borderRadius: 4,
  marginBottom: 12,
  border: 0,
  overflow: 'hidden',
  paddingLeft: 12,
  paddingRight: 12,
}

const customPanelStyle1 = {
  background: '#fff',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  borderBottom: '1px solid #E9E9E9',
  paddingLeft: 12,
  paddingRight: 12,
  paddingBottom: 12,
  paddingTop: 12,
  fontWeight: 'bold',
  fontSize: 14,
}

const centerview = ({
 dispatch, centerview, loading, location, oel,
}) => {
  const {
 statusOlet, categoryOlet, attentionOlet, modalVisible, modalName, initValue, countState, statusState, categoryState, attentionState, sourceState,
} = centerview

  if (sourceState) {
  	dispatch({
  		type: 'centerview/updateState',
  		payload: {
  			statusState: false,
  			categoryState: false,
  			attentionState: false,
  			sourceState: false,
  		},
  	})
  }

  const genHtml = (chartList) => {
  	let chartHtml = []
  	for (let chart of chartList) {
  		let borderColor = '#95de64'
  		let chartProps = {
  			dispatch,
    		loading,
    		data: chart.data,
    		title: chart.title,
    		modalName: chart.title,
    		oelFilter: chart.oelFilter,
    		oelDatasource: chart.oelDatasource,
  		}

  		if (chart.data.length > 0) {
	  		for (let obj of chart.data) {
	  			if (obj.level === '5' && obj.number > 0) {
	  				borderColor = '#ed433c'
	  				break
	  			} else if (obj.level === '4' && obj.number > 0) {
	  				borderColor = '#f56a00'
	  				break
	  			} else if (obj.level === '3' && obj.number > 0) {
	  				borderColor = '#febe2d'
	  				break
	  			} else if (obj.level === '2' && obj.number > 0) {
	  				borderColor = '#1f90e6'
	  				break
	  			} else if (obj.level === '1' && obj.number > 0) {
	  				borderColor = '#722ed1'
	  				break
	  			}
	  		}
	  	} else {
	  		borderColor = '#DEDEDE'
	  	}

			if (chart.type === 'bar') {
	  		chartHtml.push(<Col lg={3} md={3} key={chart.title} style={{ background: '#fff', margin: '6px', border: `1px solid ${borderColor}` }} onClick={() => window.open(`/oel?oelFilter=${chart.oelFilter}&oelViewer=${chart.oelViewer}&filterDisable=true&title=${chart.title}`, `${chart.oelFilter}`, '', 'false')}>
  <BarChart {...chartProps} />
</Col>)
  		}
  	}
  	return chartHtml
  }

  let statusHtml = []
  let categoryHtml = []
  let attentionHtml = []
  if (statusOlet && statusOlet.length > 0) {
  	statusHtml = genHtml(statusOlet)
  }
  if (categoryOlet && categoryOlet.length > 0) {
  	categoryHtml = genHtml(categoryOlet)
  }
  if (attentionOlet && attentionOlet.length > 0) {
  	attentionHtml = genHtml(attentionOlet)
  }

  const countdownProps = {
  	dispatch,
  	initValue,
		countState,
  }

  return (
    <div>
      <div style={customPanelStyle1}>
    		状态<span><Countdown {...countdownProps} /></span>
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新状态信息..." spinning={statusState}>{statusHtml}</Spin>
        </Row>
      </div>
      <div style={customPanelStyle1}>
    		种类
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新种类信息..." spinning={categoryState}>{categoryHtml}</Spin>
        </Row>
      </div>
      <div style={customPanelStyle1}>
    		重点关注
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新重点关注信息..." spinning={attentionState}>{attentionHtml}</Spin>
        </Row>
      </div>

    </div>

  )
}

export default connect(({ oel, centerview, loading }) => ({ oel, centerview, loading: loading.models.centerview }))(centerview)
