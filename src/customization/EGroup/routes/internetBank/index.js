import React from "react"
import { connect } from 'dva'
import { Col, Row, Tabs } from 'antd'
import Iframe from 'react-iframe'
import Menus from '../dashboard/performance/Menus'
//import ECharts from './charts'
//import TopTable from './topTable'
import style from './indexs.css'

const TabPane = Tabs.TabPane

const internetBank = ({ dispatch, location, internetBank, loadding }) => {
  const {
    buttonState,
    queryTime,
    list, //网银互联网出口上地电信-实时流量
    topList,//网银互联网出口上地电信-SYN包TOP
    JXQDXlist,//网银互联网出口酒仙桥电信-实时流量
    JXQDXTop,//网银互联网出口酒仙桥电信-SYN包TOP
    SDYDlist,//网银互联网出口上地移动-实时流量
    SDYDTop,//网银互联网出口上地移动-SYN包TOP
    JXQYDlist,//网银互联网出口酒仙桥移动-实时流量
    JXQYDTop,//网银互联网出口酒仙桥移动-SYN包TOP
    SDLTlist,//网银互联网出口上地联通-实时流量
    SDLTTop,//网银互联网出口上地联通-SYN包TOP
    JXQLTlist,//网银互联网出口酒仙桥联通-实时流量
    JXQLTTop//网银互联网出口酒仙桥联通-SYN包TOP
  } = internetBank
  const menuProps = {
    current: 'internetBank',
    theme: 'dark',
    dispatch
  };

  const onTabClick = (e) => {
    switch (e) {
      case '1':
        window.open('https://10.1.71.28/auth/authLogin.do?authUid=monitor&authPwd=monitor&url=/customMetricMonitor/monitor.html?groupId=5d533ddc46527265b205e94b&fullScreen=true');
        break;
      case '2':
        window.open('https://10.1.71.28/auth/authLogin.do?authUid=monitor&authPwd=monitor&url=/customMetricMonitor/monitor.html?groupId=5d53857046527265b219de1b&fullScreen=true');
        break;
      case '3':
        window.open("https://10.1.71.28/auth/authLogin.do?authUid=monitor&authPwd=monitor&url=/customMetricMonitor/monitor.html?groupId=5d538b0046527265b21b941f&fullScreen=true");
        break;
      case '4':
        window.open("https://10.1.71.28/auth/authLogin.do?authUid=monitor&authPwd=monitor&url=/customMetricMonitor/monitor.html?groupId=5b03b04be4b078892b7dd6e2&fullScreen=true");
        break;
      case '5':
        window.open("https://10.1.71.28/auth/authLogin.do?authUid=monitor&authPwd=monitor&url=/customMetricMonitor/monitor.html?groupId=5c048d6d465272dace71300a&fullScreen=true");
        break
    }
  }

//const eChartsProps = {
//	key: '1',
//  buttonState:buttonState,//控制刷新的状态
//  dispatch,
//  queryTime:queryTime,//自定义刷新时间
//  list:list,//更新的数据    需要三个数据集    出入的流量值、时间轴集合
//  title: '网银互联网出口上地电信-实时流量',//图表标题
//  path: 'tcpmonvlan',//查询的索引名
//  vlan_id: '1,101',//线路标识
//  queryPath: 'query'//查询的dva模板方法
//}
//
//	const eChartsPropsJXQDX = {
//		key: '2',
//		buttonState:buttonState,//控制刷新的状态
//  dispatch,
//  queryTime:queryTime,//自定义刷新时间
//  list:JXQDXlist,//更新的数据    需要三个数据集    出入的流量值、时间轴集合
//  title: '网银互联网出口酒仙桥电信-实时流量',//图表标题
//  path: 'tcpmonvlan',//查询的索引名
//  vlan_id: '2,101',//线路标识
//  queryPath: 'queryJXQDX'//查询的dva模板方法
//	}
//
//	const topTableProps = {
//		key: '3',
//		buttonState:buttonState,
//		dispatch,
//		title: '网银互联网出口上地电信-SYN包TOP',
//		path: 'tcpmonvlantop',
//		vlan_id: '1,101',
//		queryPath: 'queryTop',
//		uiList:topList
//	}
//
//	const topTablePropsJXQDXTop = {
//		key: '4',
//		buttonState:buttonState,
//		dispatch,
//		title: '网银互联网出口酒仙桥电信-SYN包TOP',
//		path: 'tcpmonvlantop',
//		vlan_id: '2,101',
//		queryPath: 'queryJXQDXTop',
//		uiList:JXQDXTop
//	}
////
//	const querySDYDProps = {
//		key: '5',
//		buttonState:buttonState,//控制刷新的状态
//  dispatch,
//  queryTime:queryTime,//自定义刷新时间
//  list:SDYDlist,//更新的数据    需要三个数据集    出入的流量值、时间轴集合
//  title: '网银互联网出口上地移动-实时流量',//图表标题
//  path: 'tcpmonvlan',//查询的索引名
//  vlan_id: '1,324',//线路标识
//  queryPath: 'querySDYD'//查询的dva模板方法
//	}
//
//	const querySDYDTopProps = {
//		key: '6',
//		buttonState:buttonState,
//		dispatch,
//		title: '网银互联网出口上地移动-SYN包TOP',
//		path: 'tcpmonvlantop',
//		vlan_id: '1,324',
//		queryPath: 'querySDYDTop',
//		uiList:SDYDTop
//	}
//
//	const queryJXQYDProps = {
//		key: '7',
//		buttonState:buttonState,//控制刷新的状态
//  dispatch,
//  queryTime:queryTime,//自定义刷新时间
//  list:JXQYDlist,//更新的数据    需要三个数据集    出入的流量值、时间轴集合
//  title: '网银互联网出口酒仙桥移动-实时流量',//图表标题
//  path: 'tcpmonvlan',//查询的索引名
//  vlan_id: '2,103',//线路标识
//  queryPath: 'queryJXQYD'//查询的dva模板方法
//	}
//
//	const queryJXQYDTopProps = {
//		key: '8',
//		buttonState:buttonState,
//		dispatch,
//		title: '网银互联网出口酒仙桥移动-SYN包TOP',
//		path: 'tcpmonvlantop',
//		vlan_id: '2,103',
//		queryPath: 'queryJXQDXTop',
//		uiList:JXQYDTop
//	}
//
//	const querySDLTProps = {
//		key: '9',
//		buttonState:buttonState,//控制刷新的状态
//  dispatch,
//  queryTime:queryTime,//自定义刷新时间
//  list:SDLTlist,//更新的数据    需要三个数据集    出入的流量值、时间轴集合
//  title: '网银互联网出口上地联通-实时流量',//图表标题
//  path: 'tcpmonvlan',//查询的索引名
//  vlan_id: '1,102',//线路标识
//  queryPath: 'querySDLT'//查询的dva模板方法
//	}
//
//	const querySDLTTopProps = {
//		key: '10',
//		buttonState:buttonState,
//		dispatch,
//		title: '网银互联网出口上地联通-SYN包TOP',
//		path: 'tcpmonvlantop',
//		vlan_id: '1,102',
//		queryPath: 'querySDLTTop',
//		uiList:SDLTTop
//	}
//
//	const queryJXQLTProps = {
//		key: '11',
//		buttonState:buttonState,//控制刷新的状态
//  dispatch,
//  queryTime:queryTime,//自定义刷新时间
//  list:JXQLTlist,//更新的数据    需要三个数据集    出入的流量值、时间轴集合
//  title: '网银互联网出口酒仙桥联通-实时流量',//图表标题
//  path: 'tcpmonvlan',//查询的索引名
//  vlan_id: '2,102',//线路标识
//  queryPath: 'queryJXQLT'//查询的dva模板方法
//	}
//
//	const queryJXQLTTopProps = {
//		key: '12',
//		buttonState:buttonState,
//		dispatch,
//		title: '网银互联网出口酒仙桥联通-SYN包TOP',
//		path: 'tcpmonvlantop',
//		vlan_id: '2,102',
//		queryPath: 'queryJXQLTTop',
//		uiList:JXQLTTop
//	}
//
//const onClick = (event) => {
//  dispatch({
//    type: 'internetBank/setState',
//    payload:{
//      buttonState: !buttonState
//    }
//  })
//}
//
//const changeValue = (value) => {
//  let b = /^[0-9]+$/
//  if(value != '' && b.test(value)){
//    if( parseInt(value) >= 1000 ){
//      message.warning('时间间隔最大设置在15分钟');
//    }else{
//      dispatch({
//        type: 'internetBank/setState',
//        payload:{
//          queryTime: parseInt(value)
//        }
//      })
//    }
//  }else{
//    message.warning('请输入整数！');
//  }
//}
//
//	const onmouseover = () => {
//		dispatch({
//			type: 'internetBank/setState',
//			payload:{
//				buttonState: false
//			}
//		})
//	}
//
//	const onmouseout = () => {
//		dispatch({
//			type: 'internetBank/setState',
//			payload:{
//				buttonState: true
//			}
//		})
//	}


//<Row gutter={2}>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		          <ECharts {...eChartsProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//							<ECharts {...eChartsPropsJXQDX}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		          <TopTable {...topTableProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		          <TopTable {...topTablePropsJXQDXTop}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		          <ECharts {...querySDYDProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		          <ECharts {...queryJXQYDProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		         <TopTable {...querySDYDTopProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		         <TopTable {...queryJXQYDTopProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		         <ECharts {...querySDLTProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		         <ECharts {...queryJXQLTProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		         <TopTable {...querySDLTTopProps}/>
//		        </div>
//		      </Col>
//		      <Col span={12}>
//		        <div style={{ marginTop: 5, minHeight: 310 }} className={style.card}>
//		         <TopTable {...queryJXQLTTopProps}/>
//		        </div>
//		      </Col>
//		    </Row>

  return (
    <div className={style.pannl}>
      <Row gutter={6}>
        <Col md={24} lg={24} xl={24}>
          <div style={{ marginTop: 2 }}>
            <Menus {...menuProps}/>
          </div>
        </Col>
        {/*      <Col md={6} lg={6} xl={5}>
          <Row>
            <Col span={24}>
              <div className={style.card}>
                &nbsp;&nbsp;&nbsp;<Tag color={(queryTime <= 15 && queryTime >= 1) ? "#f50" : (queryTime > 15 && queryTime <= 60) ? "#2db7f5" : queryTime > 60 ? "#87d068" : '' }>
                {`查询间隔:${queryTime}秒`}
                </Tag>
                <Tooltip title={buttonState ? "暂停" : "开始"}>
                  <Button shape="circle" icon={buttonState ? "pause" : "caret-right" } size='small' onClick={onClick} />
                </Tooltip>&nbsp;
                <Popover title="自定义检索间隔" placement="bottomRight" content={<div onMouseOver={onmouseover} onMouseOut={onmouseout}><Select mode='combobox' value={queryTime+''} style={{ width: '100%' }} showSearch notFoundContent={null} showArrow={false} onChange={changeValue}/></div>}>
                  <Button shape="circle" icon="setting" size='small'/>
                </Popover>
              </div>
            </Col>
          </Row>
     </Col>*/}
      </Row>
      <Tabs defaultActiveKey='1' onTabClick={onTabClick}>
        <TabPane tab="网银出口流量集中监控" key="1">
          <Iframe
            url=""
            width='100%'
            height='800px'
            id='myId'
            display='initial'
            position='relative'
          />
        </TabPane>
        <TabPane tab='外联专线流量集中监控' key="2">
          <Iframe
            url=""
            width='100%'
            height='800px'
            id='myId'
            display='initial'
            position='relative'
          />
        </TabPane>
        <TabPane tab='骨干网集中监控' key="3">
          <Iframe
            url=""
            width='100%'
            height='800px'
            id='myId'
            display='initial'
            position='relative'
          />
        </TabPane>
        <TabPane tab='网联专线集中监控' key="4">
          <Iframe
            url=""
            width='100%'
            height='800px'
            id='myId'
            display='initial'
            position='relative'
          />
        </TabPane>
        <TabPane tab='图前业务集中监控' key="5">
          <Iframe
            url=""
            width='100%'
            height='800px'
            id='myId'
            display='initial'
            position='relative'
          />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default connect(({ internetBank, loading }) => ({ internetBank, loading: loading.models.internetBank }))(internetBank)
