import React from 'react'
import { connect } from 'dva'
import { Row, Col, Spin } from 'antd'
import BarChart from './BarChart'
import Modal from './Modal'
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

const branchview = ({
 dispatch, branchview, loading, location, oel,
}) => {
	const onChartClick = (event) => {
		delete event.data
		delete event.title
		delete event.modalName
		//触发查询展示oel报表
		dispatch({
	    type: 'oel/query',
	    payload: {
	      oelFilter: event.oelFilter,
	      oelDatasource: event.oelDatasource,
	      tagFilters: new Map(),
	      currentItem: {},
	      currentSelected: 'all',
	      filteredSeverityMap: new Map(),
	      visibleFilter: false,
	      workOrderVisible: false,
	      processEventVisible: false,
	      contextType: '',
	      contextMessage: '',
	      contextInput: '',
	      woCurrentItem: {},
	      orderBy: ' order by FirstOccurrence desc',
	      qFilter: '1=1',
	      nonStringFields: [],
	      dateFields: [],
				fieldKeyword: '',
				osUuid: '',
	    },
	  })

	  //显示弹出窗口
	  dispatch({
	    type: 'branchview/updateState',
	    payload: {
	      modalVisible: true,
	    },
	  })
	}

  const {
 line1Olet, line2Olet, line3Olet, modalVisible, modalName, initValue, countState, line10State, line20State, line30State, sourceState,
} = branchview

  if (sourceState) {
  	dispatch({
  		type: 'branchview/updateState',
  		payload: {
  			line10State: false,
				line20State: false,
				line30State: false,
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
				const user = JSON.parse(sessionStorage.getItem('user'))
	  		let preFilter = ''
	  		if (user.branch) {
		  		preFilter = ` AND N_OrgId='${user.branch}'`
		  	}

	  		chartHtml.push(<Col lg={5} md={5} key={chart.title} style={{ background: '#fff', margin: '6px', border: `1px solid ${borderColor}` }} onClick={() => window.open(`/oel?oelFilter=${chart.oelFilter}&oelViewer=${chart.oelViewer}&filterDisable=true&preFilter=${preFilter}&title=${chart.title}`, `${chart.oelFilter}`, '', 'false')}>
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

  const modalProps = {
    dispatch,
    visible: modalVisible,
    loading,
    location,
    oel,
    modalName,
  }

  const countdownProps = {
  	dispatch,
  	initValue,
		countState,
  }

  return (
    <div>
      <div style={customPanelStyle1}>
        <span><Countdown {...countdownProps} /></span>
      </div>
      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin spinning={line10State} tip="正在更新告警信息...">{line1Html}</Spin>
        </Row>
      </div>

      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin spinning={line20State} tip="正在更新告警信息...">{line2Html}</Spin>
        </Row>
      </div>

      <div style={customPanelStyle}>
        <Row gutter={6}>
          <Spin spinning={line30State} tip="正在更新告警信息...">{line3Html}</Spin>
        </Row>
      </div>

      <Modal {...modalProps} />

    </div>

  )
}

export default connect(({ oel, branchview, loading }) => ({ oel, branchview, loading: loading.models.branchview }))(branchview)
