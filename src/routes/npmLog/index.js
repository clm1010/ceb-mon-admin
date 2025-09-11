import React from 'react'
import { connect } from 'dva'
import TableLog from './table'
import { Tabs, Table } from 'antd'
import Tcpmonseg from './tcpmonseg'
const { TabPane } = Tabs

const npmLog = ({ history, dispatch, npmLog }) => {
	let height = parseInt(document.body.clientHeight * 0.7)
	const { source, colume } = npmLog
	const tablePorps = {
		dispatch,
		columns: colume,
		dataSource: source,
		height,
	}

	const onTabClick = (value) => {
		switch (value) {
			case '1':
				dispatch({
					type: 'npmLog/query',
					payload: {
						path: 'tcpmon',
					},
				})
				break
			case '2':
				dispatch({
					type: 'npmLog/query',
					payload: {
						path: 'tcpmonseg',
					},
				})
				break
			case '3':
				dispatch({
					type: 'npmLog/query',
					payload: {
						path: 'tcpmonsegstop',
					},
				})
				break
			case '4':
				dispatch({
					type: 'npmLog/query',
					payload: {
						path: 'tcpmonvlan',
					},
				})
				break
			default:
				dispatch({
					type: 'npmLog/query',
					payload: {
						path: 'tcpmonvlantop',
					},
				})
				break
		}
	}

	return (
  <div className="content-inner">
    <Tabs onTabClick={onTabClick}>
      <TabPane tab="tcpmon" key="1">
        <TableLog {...tablePorps} />
      </TabPane>
      <TabPane tab="tcpmonseg" key="2">
        <TableLog {...tablePorps} />
      </TabPane>
      <TabPane tab="tcpmonsegstop" key="3">
        <TableLog {...tablePorps} />
      </TabPane>
      <TabPane tab="tcpmonvlan" key="4">
        <TableLog {...tablePorps} />
      </TabPane>
      <TabPane tab="tcpmonvlantop" key="5">
        <TableLog {...tablePorps} />
      </TabPane>
    </Tabs>
  </div>
	)
}

export default connect(({ npmLog, loading }) => ({ npmLog, loading }))(npmLog)
