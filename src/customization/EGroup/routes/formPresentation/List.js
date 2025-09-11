import React from 'react'
import { Table, Row, Col, Tabs, Icon } from 'antd'
import { Link } from 'dva/router'
import { config } from '../../../../utils'
const { exportExcelURL } = config.api
const TabPane = Tabs.TabPane

const list = ({
 dispatch, dataSource, defaultActiveKey, id, loading, template, pagination, name,
}) => {
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			width: '70%',
		}, {
			title: 'HTML',
			key: 'HTML',
			width: '15%',
			render: (text, record) => {
				return <a onClick={() => openHtml(record)}><Icon type="link" theme="outlined" /></a>
			},
		}, {
			title: 'DOC',
			dataIndex: 'DOC',
			key: 'DOC',
			width: '15%',
			render: (text, record) => {
				return <a onClick={() => openDoc(record)}><Icon type="download" theme="outlined" /></a>
			},
		},
	]

	const openHtml = (record) => {
		let info = record.name.split(name)[1]
		window.open(`${exportExcelURL}/dowload/report-export/${record.id}_${template}${info}.html`)
	}

	const openDoc = (record) => {
		let info = record.name.split(name)[1]
		window.open(`${exportExcelURL}/dowload/report-export/${record.id}_${template}${info}.doc`, '_parent')
	}

	const onTabClick = (key) => {
		if (key === '1') {
			dispatch({
				type: 'formPresentation/query',
				payload: {
					id,
					name,
					template: 'week',
				},
			})
			dispatch({
				type: 'formPresentation/setState',
				payload: {
					template: 'week',
					dataSource: [],
				},
			})
		} else if (key === '2') {
			dispatch({
				type: 'formPresentation/query',
				payload: {
					id,
					name,
					template: 'month',
				},
			})
			dispatch({
				type: 'formPresentation/setState',
				payload: {
					template: 'month',
					dataSource: [],
				},
			})
		}
	}

	return (
  <Row gutter={24}>
    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
      <Tabs defaultActiveKey={defaultActiveKey} onTabClick={onTabClick}>
        <TabPane tab={<span><Icon type="bar-chart" />周报</span>} key="1">
          <Table
            scroll={{ x: 800 }}
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            simple
            rowKey={record => record.key}
            size="default"
          />
        </TabPane>
        <TabPane tab={<span><Icon type="bar-chart" />月报</span>} key="2">
          <Table
            scroll={{ x: 800 }}
            bordered
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            simple
            rowKey={record => record.key}
            size="default"
          />
        </TabPane>
      </Tabs>

    </Col>
  </Row>
	)
}

export default list
