import React from 'react'
import { Row, Col, Tag } from 'antd'

function TagZone ({
 dispatch, loading, dataSource, pagination, location, tagFilters, currentSelected, oelViewer, oelDatasource, oelFilter, orderBy,
}) {
	const closeTag = (key, e) => {
		const { pathname } = location
		//dva
		e.preventDefault()

		tagFilters.delete(key)

		if (key === 'N_CustomerSeverity') {
			dispatch({
			  type: 'oel/querySuccess',
			  payload: {
			  	tagFilters,
			  	currentSelected: 'all',
			  },
			})
		} else {
			dispatch({
			  type: 'oel/querySuccess',
			  payload: {
			  	tagFilters,
			  	currentSelected,
			  },
			})
		}
		dispatch({
	    type: 'oel/query',
	    payload: {
				page: pagination.current,
				pageSize: pagination.pageSize,
				oelDatasource,
				oelViewer,
	      oelFilter,
	    },
	  })
	}

	let children = []
	for (let [key, value] of tagFilters) {
		children.push(<Tag style={{ marginBottom: 2 }} color="#2db7f5" onClose={closeTag.bind(this, key)} key={key} closable>{value.name} {value.op} {value.value}</Tag>)
	}

  return (
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ marginTop: 2, marginBottom: 2 }}>
          {children}
        </div>
      </Col>
    </Row>
  )
}

export default TagZone
