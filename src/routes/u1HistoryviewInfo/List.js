import React from 'react'
import { Table, Row, Col } from 'antd'
import columns from './Columns'

function List ({
 location, dispatch, pagination, dataSource, loading, filterSelect, q,
}) {
	//每一行的双击事件
	const onRowDoubleClick = (record, index, event) => {
		dispatch({
			type: 'u1Historyview/setState',
			payload: {
				rowDoubleVisible: true,
				selectInfo: record,
				severitySql: `rsPK.serverName=='${record.serverName}';rsPK.serverSerial=='${record.serverSerial}'`,
			  	sortSql: 'rsPK.startDate,desc',
			  	journalSql: `rjPK.serverName=='${record.serverName}';rjPK.serverSerial=='${record.serverSerial}'`,
			  	detailsSql: `alarmId=='${record.serverName}_${record.serverSerial}'`,
			  	defaultKey: new Date().getTime(),
			},
		})
	}

	const onPageChange = (page) => {
		dispatch({
			type: 'u1Historyview/queryHistoryview',
			payload: {
				pageSize: page.pageSize,
				page: page.current - 1,
				q,
			},
		})
	}

	return (
  <div>
    <Row>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          bordered
          scroll={{ y: 500, x: 2000 }}
          onRowDoubleClick={onRowDoubleClick}
          columns={columns} //表结构字段
          dataSource={dataSource} //表数据
          pagination={pagination} //分页配置
          onChange={onPageChange}
          simple
          size="small"
          loading={loading}
        />

      </Col>
    </Row>
  </div>
	)
}

export default List
