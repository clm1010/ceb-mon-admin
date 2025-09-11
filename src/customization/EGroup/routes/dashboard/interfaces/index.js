import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import CountUp from 'react-countup'
import { Row, Col, Card, Tooltip, Icon, Tag, message, Descriptions  } from 'antd'
import Menus from '../performance/Menus'
import fenhang from '../../../../../utils/fenhang'
import FilterForm from './filterForm'
import List from './List'
import InterfaceNumModal from './InterfaceNumsModal'
import OelModal from './oelModal'
import './myStyle.css'

const interfaces = ({
 dispatch, loading, location, interfaces, app, oel,
}) => {
	const {
		pagination,
		list,
		paginationList,
		paginationNum,
		org, //所属机构
		deviceType, //设备类型
		vendor, //厂商
		firstSecArea, //一级安全域
		discoveryIP, //IP
		currentItem,
		InterfaceNum,
		sql,
		tableState,
		allSource,
	} = interfaces
  //菜单配置项---start
  const user = JSON.parse(sessionStorage.getItem('user'))
	const menuProps = {
		current: 'Interfaces',
    dispatch,
    userbranch:user.branch
	}
	//end
	function onPageChange (page, filters) {
    const { search, pathname } = location
    query = queryString.parse(search);
      query.page = page.current - 1
      query.pageSize = page.pageSize
		dispatch(routerRedux.push({
      pathname,
      search,
      query,
		/*	query: {
				...query,
			  	page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
			  	pageSize: page.pageSize,
			},*/
		}))
	}

	const oelProps = {
  		dispatch,
		loading,
		location,
		performance: interfaces,
		onPageChange,
		pagination,
  	}
	const radioPartProps = {
		dispatch,
		loading,
		location,
		fenhang,
		user: app.user,
		organValue: interfaces.organValue,
		branchValue: interfaces.branchValue,
		typeValue: interfaces.typeValue,
		firmValue: interfaces.firmValue,
		firstValue: interfaces.firstValue,
		secondValue: interfaces.secondValue,
	}
	const sortFilterPartProps = {
		dispatch,
		loading,
		location,
	}
	const listPartProps = {
		dispatch,
		loading,
		location,
		list,
		oel,
		pagination: paginationList,
		onPageChangeList (page) {
          const { search, pathname } = location
          query = queryString.parse(search);
          query.page = page.current - 1
          query.pageSize = page.pageSize
	      	dispatch(routerRedux.push({
              pathname,
              search,
              query,
	        		/*query: {
	          		...query,
	          		page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
	          		pageSize: page.pageSize,
	        		},*/
	      	}))
	    },
	}

	const modalProps = {
		dispatch,
		currentItem: interfaces.currentItem,
	    visible: interfaces.modalVisible,															//弹出窗口的可见性是true还是false
	    isClose: interfaces.isClose,
	    loading,
	    fenhang,
	    user: app.user,
	}
	const modalInterfaceProps = {
		dispatch,
		interfaceItem: interfaces.interfaceItem,
	    visible: interfaces.modalInterfaceVisible,
	    fenhang,
	    user: app.user,
	    pagination: paginationNum,
	    allSource,
	}
	const modalOelProps = {
		dispatch,
    		visible: interfaces.modalOelVisible,
    		loading,
    		location,
    		oel,
    		modalName: '',
    		performance: interfaces,
	}
	const filterFormProps = {
		dispatch,
		org, //所属机构
		deviceType, //设备类型
		vendor, //厂商
		firstSecArea, //一级安全域
		discoveryIP, //IP

	}

	const listProps = {
		dispatch,
		pagination: paginationList,
		list,
		sql,
		tableState,
	}

	const showInterface = () => {
		if (currentItem.discoveryIP) {
			dispatch({
				type: 'interfaces/querySuccess',
				payload: {
					modalInterfaceVisible: true,
				},
			})
		} else {
			message.warning('请双击选择相关设备！')
		}
	}
	const showOel = () => {
		if (currentItem.discoveryIP) {
//			let tagFilters = new Map()
//	  		tagFilters.set(1,{name:'NodeAlias', op:'=', value:`${currentItem.discoveryIP}`})
			dispatch({
	      		type: 'oel/query',
	      		payload: {
	      			needFilter: false,
	      			filterDisable: true,
	        		preFilter: `and NodeAlias = '${currentItem.discoveryIP}'`,
	      		},
	    	})
			dispatch({
				type: 'interfaces/querySuccess',													//抛一个事件给监听这个type的监听器
				payload: {
					modalOelVisible: true,
				},
			})
		} else {
			message.warning('请双击选择相关设备！')
		}
	}
	const showCHD = () => {
		if (currentItem.discoveryIP) {
				window.open(`/chdlistall?q=${currentItem.discoveryIP}+${currentItem.branchName}`, '_blank')
		} else {
			message.warning('请双击选择相关设备！')
		}
	}
	return (
  <div>
    <Row gutter={6}>
      <Col span={24}>
        <Menus {...menuProps} />
      </Col>
      <Col span={24}>
        <div style={{ marginTop: '10px' }}>
          <Row gutter={6}>
            <Col span={15}>
              <Row>
                <Col span={24}>
                  <Card title="选择过滤条件" style={{ height: '355px', marginBottom: '10px' }} key="1">
                    <FilterForm {...filterFormProps} />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card className="rowHover" style={{ height: '803px', marginTop: '0px' }} key="2">
                    <List {...listProps} />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={9}>
              <Row gutter={6}>
                <Col span={24}>
                  <Card title="设备详细信息" style={{ height: '688px', marginLeft: '6px', marginBottom: '10px' }} key="3">
                    <Descriptions layout="vertical">
                      <Descriptions.Item label='名称' span={2}>{currentItem.name === undefined ? '' : <Tag color="blue">{currentItem.name}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='发现IP'>{currentItem.discoveryIP === undefined ? '' : <Tag color="blue">{currentItem.discoveryIP}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='所属分行名称'>{currentItem.branchName === undefined ? '' : <Tag color="blue">{currentItem.branchName}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='一级安全域'>{currentItem.firstSecArea === undefined ? '' : <Tag color="blue">{currentItem.firstSecArea}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='厂商'>{currentItem.vendor === undefined ? '' : <Tag color="blue">{currentItem.vendor}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='SNMP团体串'>{currentItem.snmpCommunity === undefined ? '' : <Tag color="blue">{currentItem.snmpCommunity}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='SNMP写团体串'>{currentItem.snmpWriteCommunity === undefined ? '' : <Tag color="blue">{currentItem.snmpWriteCommunity}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='创建方式'>{currentItem.createMethod === undefined ? '' : <Tag color="blue">{currentItem.createMethod}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='主机名' span={2}>{currentItem.hostname === undefined ? '' : <Tag color="blue">{currentItem.hostname}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='区域'>{currentItem.location === undefined ? '' : <Tag color="blue">{currentItem.location}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='ObjectID'>{currentItem.objectID === undefined ? '' : <Tag color="blue">{currentItem.objectID}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='描述'>{currentItem.description === undefined ? '' : <Tag color="blue">{currentItem.description}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='设备管理机构'>{currentItem.mngtOrg === undefined ? '' : <Tag color="blue">{currentItem.mngtOrg}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='在线状态'>{currentItem.onlineStatus === undefined ? '' : <Tag color="blue">{currentItem.onlineStatus}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='纳管状态'>{currentItem.managedStatus === undefined ? '' : <Tag color="blue">{currentItem.managedStatus}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='机房'>{currentItem.room === undefined ? '' : <Tag color="blue">{currentItem.room}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='srcType'>{currentItem.srcType === undefined ? '' : <Tag color="blue">{currentItem.srcType}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='同步状态'>{currentItem.syncStatus === undefined ? '' : <Tag color="blue">{currentItem.syncStatus}</Tag>}</Descriptions.Item>
                      <Descriptions.Item label='同步时间'>{currentItem.syncTime === undefined ? '' : <Tag color="blue">{new Date(currentItem.syncTime).format('yyyy-MM-dd hh:mm:ss')}</Tag>}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card style={{ height: '150px', marginLeft: '6px', marginBottom: '10px' }} key="4">
                    <Row>
                      <Col span={10}>
                        <Icon type="api" style={{marginTop: '20px', marginLeft: '50px', fontSize: 60, color: '#08c',}}/>
                      </Col>
                      <Col span={14}>
                        <div style={{ marginTop: '28px', fontSize: 23, color: '#000000' }}>设备接口数</div>
                        <div style={{ marginTop: '15px', fontSize: 10 }}>
                          {/*<CountUp prefix="该设备共计" suffix="条接口" start={0} end={InterfaceNum} />&nbsp;&nbsp;&nbsp;&nbsp;<Tag color="#f50" onClick={() => showInterface()}>查看</Tag>*/}
                          <span>该设备共计{InterfaceNum}条接口</span>&nbsp;&nbsp;&nbsp;&nbsp;<Tag color="#f50" onClick={() => showInterface()}>查看</Tag>
                          </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card style={{ height: '150px', marginLeft: '6px', marginBottom: '10px' }} key="5">
                    <Row>
                      <Col span={10}>
                        <Icon type="layout"
                          style={{marginTop: '20px', marginLeft: '50px', fontSize: 60, color: '#08c'}}
                        />
                      </Col>
                      <Col span={14}>
                        <div style={{ marginTop: '28px', fontSize: 23, color: '#000000' }}>告&nbsp;&nbsp;&nbsp;&nbsp;警</div>
                        <div style={{ marginTop: '15px', fontSize: 10 }}>
													该设备相关告警数据&nbsp;&nbsp;&nbsp;&nbsp;<Tag color="#f50" onClick={() => showOel()}>查看</Tag>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card style={{ height: '150px', marginLeft: '6px', marginBottom: '10px' }} key="6">
                    <Row>
                      <Col span={10}>
                        <Icon type="rocket"
                          style={{marginTop: '20px', marginLeft: '50px', fontSize: 60, color: '#08c',}}
                        />
                      </Col>
                      <Col span={14}>
                        <div style={{ marginTop: '28px', fontSize: 23, color: '#000000' }}>性&nbsp;&nbsp;&nbsp;&nbsp;能</div>
                        <div style={{ marginTop: '15px', fontSize: 10 }}>
													该设备相关性能数据&nbsp;&nbsp;&nbsp;&nbsp;<Tag color="#f50" onClick={() => showCHD()}>查看</Tag>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <InterfaceNumModal {...modalInterfaceProps} />
    <OelModal {...modalOelProps} />
  </div>
	)
}
//			<Modal {...modalProps}/>
//			<InterfaceNumModal {...modalInterfaceProps}/>
//
export default connect(({
 interfaces, loading, app, oel,
}) => ({
 interfaces, app, oel, loading: loading.models.interfaces,
}))(interfaces)
