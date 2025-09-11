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

const frontview = ({
 dispatch, frontview, loading, location, oel,
}) => {
  const {
 line1Olet, line2Olet, line3Olet, modalVisible, modalName, initValue, countState, line1State, line2State, line3State, sourceState,branchType
} = frontview
const user = JSON.parse(sessionStorage.getItem('user'))
let countNumber = 0
if(line1Olet.length>0){
  line1Olet[0].data.forEach(element => {
    if(element.level != '100'){
      countNumber+=element.number
    }
  });
  line1Olet[1].data.forEach(element => {
    if(element.level != '100'){
      countNumber+=element.number
    }
  });
}
if(line2Olet.length>0){
  line2Olet[0].data.forEach(element => {
    if(element.level != '100'){
      countNumber+=element.number
    }
  });
  line2Olet[1].data.forEach(element => {
    if(element.level != '100'){
      countNumber+=element.number
    }
  });
}
if(line3Olet.length>0){
  line3Olet[0].data.forEach(element => {
    if(element.level != '100'){
      countNumber+=element.number
    }
  });
  line3Olet[1].data.forEach(element => {
    if(element.level != '100'){
      countNumber+=element.number
    }
  });
}
  if (sourceState) {
  	dispatch({
  		type: 'frontview/updateState',
  		payload: {
  			line1State: false,
  			line2State: false,
  			line3State: false,
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
	  		chartHtml.push(<Col lg={3} md={3} key={chart.title} style={{ background: '#fff', margin: '6px', border: `1px solid ${borderColor}` }} onClick={() => window.open(`/oel?oelFilter=${chart.oelFilter}&oelViewer=${chart.oelViewer}&filterDisable=true&title=${chart.title}&branchType=${branchType}`, `${chart.oelFilter}`, '', 'false')}>
  <BarChart {...chartProps} />
</Col>)
  		}
  	}
  	return chartHtml
  }

  let line1Html = []
  let line2Html = []
  let line3Html = []
  if (line1Olet && line1Olet.length > 0) {
  	line1Html = genHtml(line1Olet)
  }
  if (line2Olet && line2Olet.length > 0) {
  	line2Html = genHtml(line2Olet)
  }
  if (line3Olet && line3Olet.length > 0) {
  	line3Html = genHtml(line3Olet)
  }

  const countdownProps = {
  	dispatch,
  	initValue,
    countState,
    userbranch:user.branch,
    countNumber:countNumber
  }

  return (
    <div>
      <div style={customPanelStyle1}>
        <span>应用<Countdown {...countdownProps} /></span>
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新 一线实时告警信息..." spinning={line1State}>{line1Html}</Spin>
        </Row>
      </div>
      <div style={customPanelStyle1}>
				系统
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新类型2信息..." spinning={line2State}>{line2Html}</Spin>
        </Row>
      </div>
      <div style={customPanelStyle1}>
				网络
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin tip="正在更新类型3信息..." spinning={line3State}>{line3Html}</Spin>
        </Row>
      </div>
    </div>

  )
}

export default connect(({ oel, frontview, loading }) => ({ oel, frontview, loading: loading.models.frontview }))(frontview)
