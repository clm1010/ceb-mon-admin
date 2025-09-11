import React from 'react'
import { connect } from 'dva'
import HeatChart from './HeatChart'
import SearchZone from './SearchZone'
import Modal from './Modal'
import Countdown from './Countdown'

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

const distribution = ({
 dispatch, distribution, loading, location, oel, appSelect,
}) => {
  const {
 modalVisible, initValue, countState, list, appName, acknowledged, modalName,FirstOccurrence
} = distribution

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
    appName,
    acknowledged,
    FirstOccurrence
  }

  const zoneProps = {
    dispatch,
    appSelect,
  }

  const heatChart = {
    list,
    appName,
    acknowledged,
    FirstOccurrence
  }

  return (
    <div>
      <div style={customPanelStyle1}>
        <SearchZone {...zoneProps} />
      </div>
      <div style={customPanelStyle1}>
        <span><Countdown {...countdownProps} /></span>
      </div>
      <div style={customPanelStyle1}>
        <HeatChart {...heatChart} />
      </div>
      <Modal {...modalProps} />

    </div>

  )
}

export default connect(({
 oel, distribution, appSelect, loading,
}) => ({
 oel, distribution, appSelect, loading: loading.models.distribution,
}))(distribution)
