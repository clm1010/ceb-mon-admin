import React from 'react'
import { connect } from 'dva'

const OELEventFilter = ({
 location, dispatch, oelEventFilter, loading,
}) => {
	const { filtervisible } = oelEventFilter

	const eventFilterProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		visible: filtervisible,
		loading,
		location,

  }
	return (
  <div>
    {/*<EventFilterModal {...eventFilterProps}/>*/}
  </div>
	)
}

export default connect(({ oelEventFilter, loading }) => ({ oelEventFilter, loading }))(OELEventFilter)
