import React from 'react'
import { Table, Row, Col } from 'antd'
import './List.css'

const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns

function list ({
 dispatch, loading, dataSource, list, pagination, location, onPageChange, tagFilters, currentSelected, oelColumns, oelDatasource, oelFilter, oelViewer, toolList, selectedRows, user,
}) {
	//循环选中的行 抽取一个简单的OZ_AlarmID数组做判断
	let selectedRowKeys = selectedRows.map(v => v.OZ_AlarmID)


	//显示告警详情弹出窗口
	const showDetail = (record, index, event) => {
		dispatch({
			type: 'oelCust/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				visibleDetail: true,
				currentItem: record,
				curDetailTabKey: '0',
			},
		})
	}

	//由于js对象转json，函数类型的属性无法转换成json，所以在数据库取出后追加render属性(即右键触发功能)
	const colOperation = (cols) => {
		let dateFields = []
		for (let column of ViewColumns) {
			if (column.type === 'utc') {
				dateFields.push(column.key)
			}
		}
		if (cols != undefined) {
			for (let col of cols) {
				if (dateFields.indexOf(col.dataIndex) >= 0) {
					col.render = (text, record) => {
						if (record[col.dataIndex] != undefined) {
							return <div title={record[col.dataIndex]} >{new Date(record[col.dataIndex] * 1000).format('yyyy-MM-dd hh:mm:ss')}</div>
						}
							return <div title={record[col.dataIndex]} >{record[col.dataIndex]}</div>
			    	}
				} else if (col.dataIndex === 'N_SummaryCN') {
					col.render = (text, record) => {
						return <div title={record[col.dataIndex]} ><span style={{ float: 'left', marginLeft: 10 }}>{record[col.dataIndex]}</span></div>
					}
				} else if (col.dataIndex === 'N_CustomerSeverity') {
					col.render = (text, record) => {
						let n_CustomerSeverity = '未知'
						let backgroundColor = '#fff'
						let color = '#000'
						switch (record[col.dataIndex]) {
							case 100:
								n_CustomerSeverity = '信息'
								if (record.Acknowledged === 0) {
									backgroundColor = '#B23AEE'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#68228B'
									color = '#fff'
								}
								break
							case 4:
								n_CustomerSeverity = '提示'
								if (record.Acknowledged === 0) {
									backgroundColor = '#63B8FF'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#4F94CD'
									color = '#fff'
								}
								break
							case 3:
								n_CustomerSeverity = '预警'
								if (record.Acknowledged === 0) {
									backgroundColor = '#ffff00'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#CDCD00'
									color = '#fff'
								}
								break
							case 2:
								n_CustomerSeverity = '告警'
								if (record.Acknowledged === 0) {
									backgroundColor = '#FFB329'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#B56300'
									color = '#fff'
								}
								break
							case 1:
								n_CustomerSeverity = '故障'
								if (record.Acknowledged === 0) {
									backgroundColor = '#FF0000'
								} else if (record.Acknowledged === 1) {
									backgroundColor = '#C50000'
									color = '#fff'
								}
								break
						}
						return <div title={record[col.dataIndex]} style={{ background: backgroundColor, color }}>{n_CustomerSeverity}</div>
			    	}
				} else if (col.dataIndex === 'Acknowledged') {
					let Acknowledged = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								Acknowledged = '未接管'
								break
							case 1:
								Acknowledged = '已接管'
								break
						}
						return <div title={record[col.dataIndex]} >{Acknowledged}</div>
			    	}
				} else if (col.dataIndex === 'ExpireTime') {
					let ExpireTime = ''
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								ExpireTime = '未设置'
								break
							default:
								ExpireTime = record.ExpireTime
								break
						}
						return <div title={record[col.dataIndex]} >{ExpireTime}</div>
			    	}
				} else if (col.dataIndex === 'Flash') {
					let Flash = ''
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								Flash = '否'
								break
							case 1:
								Flash = '是'
								break
						}
						return <div title={record[col.dataIndex]} >{Flash}</div>
			    	}
				} else if (col.dataIndex === 'N_EventStatus') {
					let N_EventStatus = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_EventStatus = '新事件'
								break
							case 1:
								N_EventStatus = '自动恢复需手工关闭'
								break
							case 2:
								N_EventStatus = '自动恢复且自动关闭'
								break
							case 3:
								N_EventStatus = '已手工关闭'
								break
							case 4:
								N_EventStatus = '已强制关闭'
								break
							case 5:
								N_EventStatus = '已接管'
								break
						}
						return <div title={record[col.dataIndex]} >{N_EventStatus}</div>
			    	}
				} else if (col.dataIndex === 'N_MaintainStatus') {
					let N_MaintainStatus = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_MaintainStatus = '未设置'
								break
							case 1:
								N_MaintainStatus = '在维护期'
								break
							case 2:
								N_MaintainStatus = '出维护期'
								break
						}
						return <div title={record[col.dataIndex]} >{N_MaintainStatus}</div>
			    	}
				} else if (col.dataIndex === 'N_ManageByCenter') {
					let N_ManageByCenter = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_ManageByCenter = '否'
								break
							case 1:
								N_ManageByCenter = '是'
								break
						}
						return <div title={record[col.dataIndex]} >{N_ManageByCenter}</div>
			    	}
				} else if (col.dataIndex === 'N_RecoverType') {
					let N_RecoverType = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_RecoverType = '否'
								break
							case 1:
								N_RecoverType = '是'
								break
						}
						return <div title={record[col.dataIndex]} >{N_RecoverType}</div>
			    	}
				} else if (col.dataIndex === 'N_CustomerSeverity') {
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
						return <div title={record[col.dataIndex]} >{Severity}</div>
			    	}
				} else if (col.dataIndex === 'SuppressEscl') {
					let SuppressEscl = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								SuppressEscl = '正常'
								break
							case 1:
								SuppressEscl = '已升级'
								break
							case 2:
								SuppressEscl = '已升级-等级2'
								break
							case 3:
								SuppressEscl = '已升级-等级3'
								break
							case 4:
								SuppressEscl = '抑制'
								break
							case 5:
								SuppressEscl = '故障'
								break
							case 6:
								SuppressEscl = '维护期'
								break
						}
						return <div title={record[col.dataIndex]} >{SuppressEscl}</div>
			    	}
				} else if (col.dataIndex === 'Type') {
					let Type = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								Type = '未设置'
								break
							case 1:
								Type = '问题'
								break
							case 2:
								Type = '恢复'
								break
							case 3:
								Type = 'Visionary Problem'
								break
							case 4:
								Type = 'Visionary Resolution'
								break
							case 7:
								Type = 'ISM New Alarm'
								break
							case 8:
								Type = 'ISM Old Alarm'
								break
							case 11:
								Type = 'More Severe'
								break
							case 12:
								Type = 'Less Severe'
								break
							case 13:
								Type = '信息'
								break
							case 20:
								Type = 'ITM问题'
								break
							case 21:
								Type = 'ITM恢复'
								break
						}
						return <div title={record[col.dataIndex]} >{Type}</div>
			    	}
				} else if (col.dataIndex === 'N_ZProcessState') {
					let N_ZProcessState = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_ZProcessState = '未被处理 '
								break
							case 1:
								N_ZProcessState = '被丰富 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_ZProcessState}</div>
			    	}
				} else if (col.dataIndex === 'N_AckMode') {
					let N_AckMode = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_AckMode = '未设置 '
								break
							case 1:
								N_AckMode = '手工确认 '
								break
							case 2:
								N_AckMode = '自动确认 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_AckMode}</div>
			    	}
				} else if (col.dataIndex === 'N_Close') {
					let N_Close = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_Close = '已关闭 '
								break
							case 1:
								N_Close = '未关闭 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_Close}</div>
			    	}
				} else if (col.dataIndex === 'N_NPassHis') {
					let N_NPassHis = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_NPassHis = '未归档 '
								break
							case 1:
								N_NPassHis = '已归档 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_NPassHis}</div>
			    	}
				} else if (col.dataIndex === 'N_AckOverTime') {
					let N_AckOverTime = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_AckOverTime = '接管未超时 '
								break
							case 1:
								N_AckOverTime = '接管超时 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_AckOverTime}</div>
			    	}
				} else if (col.dataIndex === 'N_CloseOverTime') {
					let N_CloseOverTime = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_CloseOverTime = '关闭未超时 '
								break
							case 1:
								N_CloseOverTime = '关闭超时 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_CloseOverTime}</div>
			    	}
				} else if (col.dataIndex === 'N_TicketStatus') {
					let N_TicketStatus = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 'Success':
								N_TicketStatus = '成功 '
								break
							case 'Failure':
								N_TicketStatus = '失败 '
								break
						}
						return <div title={record[col.dataIndex]} >{N_TicketStatus}</div>
			    	}
				} else if (col.dataIndex === 'N_Processed') {
					let N_Processed = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								N_Processed = '未接管'
								break
							case 1:
								N_Processed = '已接管 '
								break
							case 2:
								N_Processed = '已处理'
								break
						}
						return <div title={record[col.dataIndex]} >{N_Processed}</div>
			    	}
				} else if (col.dataIndex === 'OZ_MaintainProcess') {
					let OZ_MaintainProcess = '未知'
					col.render = (text, record) => {
						switch (record[col.dataIndex]) {
							case 0:
								OZ_MaintainProcess = '维护期处理'
								break
							case 1:
								OZ_MaintainProcess = '维护期未处理 '
								break
						}
						return <div title={record[col.dataIndex]} >{OZ_MaintainProcess}</div>
			    	}
				} else {
					col.render = (text, record) => {
 return <div title={record[col.dataIndex]} >{record[col.dataIndex]}</div>
			    }
			  }

		    //这里设置sorter函数，有bug要判断字符串或者整型
		    col.sorter = true
		    //col.sorter = (a,b) => a[col.dataIndex].length - //b[col.dataIndex].length
			}
		}
	}

	colOperation(oelColumns)
	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedRowKeys, selectedRows) => {
		  dispatch({
		  	type: 'oelCust/updateState',
				payload: {
					selectedRows,
				},
			})
		},
	}
	let widths = document.documentElement.clientHeight - 205
	widths = widths < 533 ? widths : 533

	let scrollX = 0
	oelColumns.forEach(item => scrollX += item.width)

  return (
    <div>
      <Row gutter={24}>
        <Col xs={24} xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
          <div className="content-inner4" >
            <Table
              columns={oelColumns}
              dataSource={dataSource}
              loading={loading}
              simple
              scroll={{ x: scrollX, y: widths }}
              size="small"
              pagination={pagination}
              onChange={onPageChange}
              onRowDoubleClick={showDetail}
              rowKey={record => record.OZ_AlarmID}
              rowSelection={rowSelection}
              rowClassName={(record, index) => {
	  	      	let bgcolor = 'white test'
	  	      	if (selectedRowKeys.indexOf(record.OZ_AlarmID) > -1) {
	  	      		bgcolor = 'black'
	  	      	} else if (record.Severity === 0) {
					if (record.Acknowledged === 1) {
						bgcolor = 'ack_green test'
					} else {
						bgcolor = 'green test'
					}
				} else if (record.N_CustomerSeverity === 100) {
					if (record.Acknowledged === 1) {
	  	      			bgcolor = 'ack_purple test'
	  	      		} else {
						bgcolor = 'purple test'
					}
				} else if (record.N_CustomerSeverity === 4) {
					if (record.Acknowledged === 1) {
	  	      			bgcolor = 'ack_blue test'
	  	      		} else {
						bgcolor = 'blue test'
					}
				} else if (record.N_CustomerSeverity === 3) {
					if (record.Acknowledged === 1) {
	  	      			bgcolor = 'ack_yellow test'
	  	      		} else {
						bgcolor = 'yellow test'
					}
				} else if (record.N_CustomerSeverity === 2) {
					if (record.Acknowledged === 1) {
	  	      			bgcolor = 'ack_orange test'
					} else {
						bgcolor = 'orange test'
					}
				} else if (record.N_CustomerSeverity === 1) {
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
