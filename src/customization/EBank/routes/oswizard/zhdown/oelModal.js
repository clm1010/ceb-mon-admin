import React from 'react'
import { connect } from 'dva'
import { Modal } from 'antd'
import Oel from '../../../../../routes/oel'
import myStyle from './myStyle.css'

const modal = ({
  dispatch, visible, loading, location, oel, modalName, performance,
}) => {
  const onCancel = () => {
    dispatch({
      type: 'oswizard/updateState',
      payload: {
        oelModalVisible: false,
        tagFilters: new Map(),
        currentSelected: 'all',
      },
    })
    dispatch({
      type: 'oel/querySuccess',
      payload: {
        tagFilters: new Map(),
        countState: false,
      },
    })
  }

  const modalOpts = {
    title: modalName,
    width: '90%',
    footer: null,
    visible,
    onCancel,
  }

  const oelProps = {
    dispatch,
    loading,
    location,
    performance,
    oel,
  }


  return (
    <Modal {...modalOpts} bodyStyle={{ height: 720 }} style={{ top: 20 }}>
      <div className={myStyle.oelModalStyle}>
        <Oel {...oelProps} />
      </div>
    </Modal>
  )
}

export default connect(({
  charts, oelEventFilter, oelToolset, oelDataSouseset, eventviews, loading,
}) => ({
  charts, oelToolset, oelEventFilter, oelDataSouseset, eventviews, loading: loading.models.charts,
}))(modal)
