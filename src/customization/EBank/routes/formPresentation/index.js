import React from 'react'
import { connect } from 'dva'
import List from './List'

const formPresentation = ({
 location, loading, formPresentation, dispatch,
}) => {
	const {
 dataSource, defaultActiveKey, id, template, keys, pagination, name,
} = formPresentation
	const listProps = {
		dataSource,
		defaultActiveKey,
		id,
		dispatch,
		loading: loading.effects['formPresentation/query'],
		template,
		key: keys,
		pagination,
		name,
	}
	return (
  <div className="content-inner" id="1">
    <List {...listProps} />
  </div>
	)
}

export default connect(({ formPresentation, loading }) => ({ formPresentation, loading }))(formPresentation)
