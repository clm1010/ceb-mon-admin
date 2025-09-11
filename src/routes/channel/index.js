import React from 'react'
import { connect } from 'dva'
import Panel from './Panel'
const channel = ({
 history, loading, dispatch, channel,
}) => {
	const {
 byOperator, statusOperator, statusAuto, tabsKey, keys, spinning,
} = channel

	const panelProps = {
		dispatch,
		byOperator,
		statusOperator,
		statusAuto,
		tabsKey,
		keys,
		spinning,
	}

	return (
  <div className="content-inner">
    <Panel {...panelProps} />
  </div>
	)
}

export default connect(({ channel, loading }) => ({ channel, loading: loading.models.channel }))(channel)
