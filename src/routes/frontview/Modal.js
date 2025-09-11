import React from 'react'
import { connect } from 'dva'
import { Modal } from 'antd'
import Oel from '../oel'
import myStyle from './myStyle.css'


const modal = ({
 dispatch, visible, loading, location, charts, oel, oelEventFilter, oelToolset, oelDataSouseset, eventviews, modalName, osUuid,
}) => {
  const onCancel = () => {
    dispatch({
      type: 'frontview/updateState',
      payload: {
        modalVisible: false,
        tagFilters: new Map(),
        currentSelected: 'all',
      },
    })

    dispatch({
      type: 'oel/querySuccess',
      payload: {
        tagFilters: new Map(),
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
    oel,
  }


  return (
    <Modal {...modalOpts} bodyStyle={{ height: 720 }} style={{ top: 20 }}>
      <div className={myStyle.modalStyle}>
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
