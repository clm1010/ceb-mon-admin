import React from 'react'
import { Row, Col, Button, Select, Tooltip, Tag, Radio, Icon, Badge } from 'antd'
import './navStyle.css'
const { Option, OptGroup } = Select

function nav ({
 dispatch, loading, filterDisable, dataSource, pagination, showEventFilterList, location, tagFilters, currentSelected, filteredSeverityMap, showdataSouseList, showviewList, oelViewer, oelColumns, oelDatasource, oelFilter, orderBy,isPackedAlarms,
 Service_Impact_Num,HotPotNum
}) {
  const defaultSelected = String(currentSelected)

  const viewSet = () => {
    dispatch({
      type: 'eventviews/queryAllViews',
      payload: {
        q: '',
      },
    })
	}

	// 处理视图过滤器
	      let viewglobalInfo = []
	      let viewprivateInfo = []
	      if (showviewList && showviewList.length > 0) {
		      showviewList.forEach((bean) => {
			      if (bean.isGlobal) {
				      viewglobalInfo.push(<Option key={bean.uuid} value={bean.uuid}>{bean.name}</Option>)
			} else {
				      viewprivateInfo.push(<Option key={bean.uuid} value={bean.uuid}>{bean.name}</Option>)
			}
		})
	}

	// 工具配置start
	      const onTool = () => {
		      dispatch({
			      type: 'oelToolset/queryTools',
			      payload: {},
		})
	}

	// refresh button
	      const onFresh = () => {
			  const { query, pathname } = location
		      dispatch({
				type: 'oelcompression/query',
				payload: {
					pagination: { current: pagination.current, pageSize: pagination.pageSize },
					oelDatasource,
					oelViewer,
					oelFilter,
					orderBy,
				},
			  })
	}
	// end

	/*
		打开过滤器弹出框
	*/
	      const onEventFilter = () => {
		      dispatch({ // 打开弹出框
			      type: 'oelEventFilter/updateState',													// 抛一个事件给监听这个type的监听器
			      payload: {
				      filtervisible: true,
				      eventName: '',
				      eventIsGlobal: '',
			},
		})
		      dispatch({ // 过滤器数据的查询
			      type: 'oelEventFilter/query',
			      payload: {},
		})
	}

	// 切换视图
	      const onViewChange = (value) => {
		      dispatch({
  type: 'oelcompression/query',
  payload: {
				                current: pagination.current,
				                pageSize: pagination.pageSize,
				                oelDatasource,
				                oelViewer: value,
    oelFilter,
  },
})
	}

	// 切换过滤器
	      const onFilterChange = (value) => {
	        dispatch({
	          type: 'oelcompression/query',
	          payload: {
	            pagination: {
	              current: 1,
	              pageSize: pagination.pageSize,
	            },
	            oelDatasource,
	            oelViewer,
	            oelFilter: value,
	          },
	        })
	      }

	// 切换数据源
	      const onDatasourceChange = (value) => {
	        dispatch({
	          type: 'oelcompression/query',
	          payload: {
	            current: 1,
	            pageSize: pagination.pageSize,
	            oelDatasource: value,
	            oelViewer,
	            oelFilter,
	          },
	        })
	      }

	      const handleChange = (value) => {
					// 删掉nav里的标签
								if (tagFilters.has('N_CustomerSeverity')) {
									tagFilters.delete('N_CustomerSeverity')
					}

					// 删掉nav里的标签
								if (tagFilters.has('n_CustomerSeverity')) {
									tagFilters.delete('n_CustomerSeverity')
					}

					// 删掉nav里的标签
					if (tagFilters.has('Severity')) {
						tagFilters.delete('Severity')
					}

					// 删掉nav里的标签
					if (tagFilters.has('severity')) {
						tagFilters.delete('severity')
					}

					let page
					// 如果是all
					if (value === '0') {
						tagFilters.set('Severity', { name: 'Severity', op: '=', value: String(value) })
					} else if (value !== 'all') {
						tagFilters.set('N_CustomerSeverity', { name: 'N_CustomerSeverity', op: '=', value: String(value) })
						page = 1
					}
								dispatch({
									type: 'oelcompression/query',
									payload: {
										tagFilters,
										currentSelected: value,
										oelFilter,
										oelDatasource,
										oelViewer,
										orderBy,
										page:page,
                    //treeSelected:{}
						},
					})
				}

	      const DataSouseSet = () => {
		      dispatch({
			      type: 'oelDataSouseset/queryAllosts',
			      payload: {},
		})
	}

	      const showModal = () => {
		      dispatch({
			      type: 'oelcompression/updateState',
			      payload: {
				      visibleFilter: true,
			},
		})
	}

  const onRadioChange = (e) => {
    dispatch({
      type: 'oelcompression/updateState',
      payload: {
        isPackedAlarms: (e.target.value === 2),
      },
    })
    dispatch({
      type: 'oelcompression/query',
      payload: {
        isPackedAlarms: (e.target.value === 2),
      },
    })
  }

  const showSearchModal = ()=>{
	dispatch({
		type: 'oelcompression/updateState',
		payload: {
			visibleSearchFilter: true,
		  },
	  })
}

	      let globalInfo = []
	      let privateInfo = []
	      if (showEventFilterList && showEventFilterList.length > 0) {
		      showEventFilterList.forEach((bean) => {
			      if (bean.isGlobal) {
				      globalInfo.push(<Option key={bean.uuid} value={bean.uuid}>{bean.name}</Option>)
			} else {
				      privateInfo.push(<Option key={bean.uuid} value={bean.uuid}>{bean.name}</Option>)
			}
		})
	}
	// 数据源配置
	      let dataInfo = []
	      if (showdataSouseList && showdataSouseList.length > 0) {
		      showdataSouseList.forEach((bean) => {
				      dataInfo.push(<Option key={bean.uuid} value={bean.uuid}>{bean.name}</Option>)
		})
	}

	const BadgeNum = {
		backgroundColor: '#52c41a',
		color:'red',
		
	}
  return (
    <Row gutter={24} style={{ backgroundColor: 'white' }}>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <div style={{ backgroundColor: 'white', marginTop: 8, marginBottom: 8 }}>
          <Tooltip title="刷新告警">
            <Button icon="sync" onClick={onFresh} />
          </Tooltip>
          <Tooltip title="查询告警">
            <Button icon="search" style={{ marginLeft: 8 }} onClick={showModal} />
          </Tooltip>
		  <Tooltip title="快速查询">
            <Button style={{ marginLeft: 8 }} onClick={ showSearchModal }> 快查 </Button>
          </Tooltip>
          <Tooltip title="工具配置">
            <Button icon="tool" style={{ marginLeft: 8 }} onClick={onTool} />
          </Tooltip>
          <span className="glqjg">
            <Tooltip title="数据源配置">
              <Button icon="database" onClick={DataSouseSet} />
            </Tooltip>
            <Select dropdownMatchSelectWidth={false} value={oelDatasource} style={{ width: 120 }} onChange={onDatasourceChange}>
              {dataInfo}
            </Select>
          </span>
          <span className="glqjg">
            <Tooltip title="告警过滤器">
              <Button icon="filter" onClick={onEventFilter} />
            </Tooltip>
            <Select dropdownMatchSelectWidth={false} value={oelFilter} style={{ width: 160 }} onChange={onFilterChange} disabled={filterDisable === 'true'}>
              <OptGroup label="Global">
                {globalInfo}
              </OptGroup>
              <OptGroup label="Private">
                {privateInfo}
              </OptGroup>
            </Select>
          </span>
          <span className="glqjg">
            <Tooltip title="视图配置">
              <Button icon="layout" onClick={viewSet} />
            </Tooltip>
            <Select dropdownMatchSelectWidth={false} value={oelViewer} style={{ width: 120 }} onChange={onViewChange}>
              <OptGroup label="Global">
                {viewglobalInfo}
              </OptGroup>
              <OptGroup label="Private">
                {viewprivateInfo}
              </OptGroup>
            </Select>
          </span>
          <span className="glqjg">
            <Radio.Group onChange={onRadioChange}  value={isPackedAlarms?2:1}>
                  <Radio.Button value={1}>全部</Radio.Button>
                  <Radio.Button value={2}>压缩</Radio.Button>
            </Radio.Group>
          </span>
			<Badge className={Service_Impact_Num > 0 ? 'impact' : 'Service_impact'} count={Service_Impact_Num} showZero overflowCount={9999}>
				<a href={`/oel?oelFilter=edfa5699-4814-4245-9ea1-b9e4b17eff53&oelViewer=e6501413-f909-4dac-8a17-e7bd3d056b3f&filterDisable=true&title=高业务影响`} target="_blank" rel="opener">高业务影响</a>
			</Badge>
			<Badge count={HotPotNum} showZero overflowCount={9999} className={HotPotNum > 0 ? 'hotspot alarmResult' : 'hotspot'}>
				<Icon type="bell" style={{ color: 'ff7800' }}/>
				<a href={`/oelHint`} target="_blank" rel="opener">告警提示</a>
			</Badge>
          <span style={{ float: 'right' }}>
			    	告警级别：
            <Select value={defaultSelected} style={{ marginLeft: 8, width: 120 }} onChange={handleChange} dropdownClassName="oel-select">
              <Option value="all" key="all"><Tag color="#cccccc" style={{ width: 90 }}>全部</Tag></Option>
              <Option value="1" key="1"><Tag color="#ed433c" style={{ width: 90 }}>一级故障</Tag></Option>
              <Option value="2" key="2"><Tag color="#f56a00" style={{ width: 90 }}>二级告警</Tag></Option>
              <Option value="3" key="3"><Tag color="#febe2d" style={{ width: 90 }}>三级预警</Tag></Option>
              <Option value="4" key="4"><Tag color="#1f90e6" style={{ width: 90 }}>四级提示</Tag></Option>
              <Option value="100" key="100"><Tag color="#800080" style={{ width: 90 }}>五级信息</Tag></Option>
              <Option value="0" key="0"><Tag color="#18a658" style={{ width: 90 }}>已恢复</Tag></Option>
            </Select>&nbsp;
          </span>
        </div>
      </Col>
    </Row>
  )
}

export default nav
