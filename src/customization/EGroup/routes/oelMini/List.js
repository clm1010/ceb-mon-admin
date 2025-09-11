import React from 'react'
import { Table, Row, Col, Tooltip } from 'antd'
import { peformanceCfg } from '../../../../utils/performanceOelCfg'
import './List.css'

function list ({
 dispatch, loading, dataSource, location, oelColumns, onPageChange, pagination,
}) {
	const checkDeviceType = (record) => {
		let returnVal = 'UNKNOWN'

		//SWITCH
		let flag = true
		for (let opt of peformanceCfg.switchRule) {
			if (record[opt.key].toLowerCase() !== opt.value.toLowerCase()) {
				flag = false
			}
		}
		if (flag) { return 'SWITCH' }

		//ROUTER
		flag = true
		for (let opt of peformanceCfg.routerRule) {
			if (record[opt.key].toLowerCase() !== opt.value.toLowerCase()) {
				flag = false
			}
		}
		if (flag) { return 'ROUTER' }

		//FIREWALL
		flag = true
		for (let opt of peformanceCfg.firewallRule) {
			if (record[opt.key].toLowerCase() !== opt.value.toLowerCase()) {
				flag = false
			}
		}
		if (flag) { return 'FIREWALL' }

		//PORT
		flag = true
		for (let opt of peformanceCfg.portRule) {
			if (record[opt.key].toLowerCase() !== opt.value.toLowerCase()) {
				flag = false
			}
		}
		if (flag) { return 'PORT' }

		return returnVal
	}

	const checkAcknowledged = (record) => {
		let isAcknowledged = false
		if (record.Acknowledged === 1) {
			isAcknowledged = true
		}
		return isAcknowledged
	}

	//jsjsonjsonrender()
	const colOperation = (cols) => {
		if (cols != undefined) {
			for (let col of cols) {
				if (col.dataIndex === 'FirstOccurrence') {
					col.render = (text, record) => {
						if (record[col.dataIndex] != undefined) {
							return <div>{new Date(record[col.dataIndex] * 1000).format('yyyy-MM-dd hh:mm:ss')}</div>
						}
							return <div />
			    }
				}
				if (col.dataIndex === 'Summary') {
					col.render = (text, record) => {
            let state = ''
						const isAcknowleged = checkAcknowledged(record)
						const fontColor = isAcknowleged ? 'white' : 'black'
						const type = checkDeviceType(record)
						if (type === 'SWITCH' || type === 'ROUTER' || type === 'FIREWALL') {
              return <Tooltip title={`最后发生时间：${new Date(record.LastOccurrence * 1000).format('yyyy-MM-dd hh:mm:ss')}`}>{(record.Severity === 0 ? '恢复: ' : '未恢复: ') + record[col.dataIndex]}</Tooltip>
						}
							return <div>{record[col.dataIndex]}</div>
					}
				}
				if (col.dataIndex === 'N_CustomerSeverity') {
					let Severity = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 100:
								Severity = '五级信息'
								break
							case 4:
								Severity = '四级提示'
								break
							case 3:
								Severity = '三级预警'
								break
							case 2:
								Severity = '二级告警'
								break
							case 1:
								Severity = '一级故障'
								break
						}
						return Severity
			    	}
				}
			}
		}
	}

	colOperation(oelColumns)

	return (
  <div>
    <Row gutter={24}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div className="content-inner5" >
          <Table
            bordered
            columns={oelColumns}
            dataSource={dataSource}
            loading={loading}
            simple
            size="small"
            onChange={onPageChange}
            pagination={pagination}
            showHeader={false}
            rowKey={record => record.OZ_AlarmID}
            rowClassName={(record, index) => {
					  	      	let bgcolor = 'white test'
					  	      	if (record.Severity == 0) {
					  	      		if (record.Acknowledged === 1) {
					  	      			bgcolor = 'ack_green test'
					  	      		} else {
										bgcolor = 'green test'
									}
								} else if (record.Severity == 1) {
									if (record.Acknowledged === 1) {
					  	      			bgcolor = 'ack_purple test'
					  	      		} else {
										bgcolor = 'purple test'
									}
								} else if (record.Severity == 2) {
									if (record.Acknowledged === 1) {
					  	      			bgcolor = 'ack_blue test'
					  	      		} else {
										bgcolor = 'blue test'
									}
								} else if (record.Severity == 3) {
									if (record.Acknowledged === 1) {
					  	      			bgcolor = 'ack_yellow test'
					  	      		} else {
										bgcolor = 'yellow test'
									}
								} else if (record.Severity == 4) {
									if (record.Acknowledged === 1) {
					  	      			bgcolor = 'ack_orange test'
					  	      		} else {
										bgcolor = 'orange test'
									}
								} else if (record.Severity == 5) {
									if (record.Acknowledged === 1) {
					  	      			bgcolor = 'ack_red test'
					  	      		} else {
										bgcolor = 'red test'
									}
								}
								return bgcolor
					  	    }}
          />
        </div>
      </Col>
    </Row>
  </div>
  	)
}

export default list
