import React from 'react'
import { connect } from 'dva'
import styles from './welcome.less'
import { notification, Row, Col, Card, Typography, Tooltip  } from 'antd'
const { Paragraph } = Typography;
import nstyles from './index.less'
import {ozr,getUrl} from '../../utils/clientSetting'
//监控系统
import Mon from './monitoring.png'
import nagios from './nagios.png'
//网络监控
import Internet from './Internet.png'
import solaris from './solaris.png'
//数据库监控
import Oracle from './Oracle.png'
import Database from './Database-oracle_over.png'
//应用监控
import app from './app.png'
import apps from './apps.png'

//性能监控
import hpux from './hpux.png'
import xn from './xn.png'

//日志
import alogs from './alogs.png'
import logs from './logs.png'
import WelcomeCard from './welcomeCard'
const welcome = ({ location, dispatch, welcome }) => {
	const infoPart = () => {
			return (
  <div>
    {welcome.notifications.map(templet =>
      (<div className={nstyles.infoInner}>
        <span>{new Date(templet.updateTime).format('yyyy-MM-dd hh:mm:ss')}</span>
        <span>{templet.content}</span>
      </div>))}
  </div>
			)
	}

	const openNotificationWithIcon = (type) => {
			notification[type]({
		    message: '升级通知',
		    description: infoPart(),
		    placement: 'bottomRight',
		    duration: null,
		 })
	}

	if (welcome.notifications.length > 0) {
		openNotificationWithIcon('info')
	}

	const props = {
    img: Mon,//大图片
    avatar: nagios,//小头像
    width: 190,
    user:'monitor',
    show: true,
    name: '系统监控',//卡片名字
    description: <Tooltip title="系统监控工具控制台"><Paragraph ellipsis>系统监控工具控制台</Paragraph></Tooltip>,//描述
    menuItem : [
/*    {title: '生产系统Windows服务器监控',connet: getUrl(`Nagios10137238`),source: 'Nagios（10.1.37.238)'},
      {title: '生产系统Linux、专用设备等服务器监控',connet: getUrl('Nagios1013792'),source: 'Nagios（10.1.37.92)'},
      {title: '生产系统HPUX、AIX等服务器监控',connet: getUrl('Nagios1017166'),source: 'Nagios（10.1.71.66)'},
      {title: '生产系统大数据区服务器监控',connet: getUrl('Nagios10171155'),source: 'Nagios（10.1.71.155)'},
      {title: '生产系统互联网外联区服务器监控',connet: getUrl('Nagios101360'),source: 'Nagios（10.1.3.60）'},
      {title: '生产系统互联网服务域服务器监控',connet: getUrl('Nagios101978'),source: 'Nagios（10.1.97.8)'},
      {title: '生产系统互联网服务域服务器监控',connet: getUrl('Nagios10197204'),source: 'Nagios（10.1.97.204)'},
      {title: '武汉灾备环境服务器监控',connet: getUrl('Nagios102557146'),source: 'Nagios（10.225.7.146)'},
      {title: 'Zabbix系统监控服务器',connet: getUrl('ZM'),source: 'ZABBIX（系统监控）'},
      {title: 'HPUX服务器性能图表工具',connet: getUrl('HPM'),source: 'HP Performance Management'},//有的 */
      {title: '生产系统Windows服务器监控',connet: getUrl(`Nagios10137238`),source: 'Nagios（10.1.37.238)'},
      {title: '生产系统Linux、专用设备等服务器监控',connet: getUrl('Nagios1013792'),source: 'Nagios（10.1.37.92)'},
      {title: '生产系统HPUX、AIX等服务器监控',connet: getUrl('Nagios1017166'),source: 'Nagios（10.1.71.66)'},
      {title: 'nagios系统监控',connet: getUrl('Nagios102183434'),source: 'Nagios（10.218.34.34)'},
      {title: 'nagios系统监控',connet: getUrl('Nagios102183486'),source: 'Nagios（10.218.34.86)'},
      {title: 'nagios系统监控',connet: getUrl('Nagios102183485'),source: 'Nagios（10.218.34.85)'},
      {title: 'nagios系统监控',connet: getUrl('Nagios102183487'),source: 'Nagios（10.218.34.87)'},
      {title: '生产系统大数据区服务器监控',connet: getUrl('Nagios10171155'),source: 'Nagios（10.1.71.155)'},
      {title: '生产系统互联网外联区服务器监控',connet: getUrl('Nagios101360'),source: 'Nagios（10.1.3.60）'},
      {title: '生产系统互联网服务域服务器监控',connet: getUrl('Nagios101978'),source: 'Nagios（10.1.97.8)'},
      {title: '生产系统互联网服务域服务器监控',connet: getUrl('Nagios10197204'),source: 'Nagios（10.1.97.204)'},
      {title: '武汉灾备环境服务器监控',connet: getUrl('Nagios102557146'),source: 'Nagios（10.225.7.146)'},
      {title: '武汉网银区环境服务器监控',connet: getUrl('Nagios102259716'),source: 'Nagios（10.225.97.16)'},
      {title: 'Zabbix系统总行监控服务器',connet: getUrl('ZHZABBIX'),source: 'ZABBIX（系统监控）'},
      {title: 'Zabbix系统分行二级资源池监控服务器',connet: getUrl('FH2ZABBIX'),source: 'ZABBIX（系统监控）'},
      {title: 'Zabbix系统分行一级资源池监控服务器',connet: getUrl('FH1ABBIX'),source: 'ZABBIX（系统监控）'},
      {title: 'HPUX服务器性能图表工具',connet: getUrl('HPM'),source: 'HP Performance Management'},
    ],
  }

  const netprops = {
    img: solaris,//大图片
    avatar: Internet,//小头像
    width: 190,
    user:'monitor',
    show: true,
    name: 'TCP网络监控',//卡片名字
    description: <Tooltip title="科来TCP网络报文监控"><Paragraph ellipsis>科来TCP网络报文监控</Paragraph></Tooltip>,//描述
    menuItem : [{title: '对报文网络层进行统计分析和监控',connet: getUrl('TCPM'),source: 'TCP监控系统'}],
  }

  const dbProps = {
    img: Oracle,//大图片
    avatar: Database,//小头像
    width: 190,
    user:'工号',
    show: true,
    name: '统一视图',//卡片名字
    description: <Tooltip title="科技运营统一视图系统"><Paragraph ellipsis>科技运营统一视图系统</Paragraph></Tooltip>,//描述
    menuItem : [
      {title: '运维数据统一视图展示',connet: getUrl('TOUVS'),source: '科技运营统一视图系统'},
      {title: '业务监控视图',connet: getUrl('BMVSS'),source: '业务监控视图子系统'}
      ],
  }

  const appProps = {
    img: app,//大图片
    avatar: apps,//小头像
    width: 190,
    user:'monitor',
    show: true,
    name: '交易监控',//卡片名字
    description: <Tooltip title="BPC交易监控"><Paragraph ellipsis>BPC交易监控</Paragraph></Tooltip>,//描述
    menuItem : [
      {title: '应用交易监控工具(请使用chrome浏览器)',connet: getUrl('BPCTM'),source: 'BPC交易监控'}
      ],
  }

  const xnProps = {
    img: hpux,//大图片
    avatar: xn,//小头像
    width: 190,
    user:'monitor',
    show: true,
    name: '智能分析',//卡片名字
    description: <Tooltip title="科技运营数据分析平台"><Paragraph ellipsis>科技运营数据分析平台</Paragraph></Tooltip>,//描述
    menuItem : [{title: '运维数据算法分析和处理',connet:getUrl('TODSP'),source: '科技运营数据分析平台'}],
  }

  const logProps = {
    img: logs,//大图片
    avatar: alogs,//小头像
    width: 190,
    user:'monitor',
    show: true,
    name: '运营数据管理',//卡片名字
    description: <Tooltip title="运营数据管理控制台"><Paragraph ellipsis>运营数据管理控制台</Paragraph></Tooltip>,//描述
    menuItem : [
      {title: '科技运营数据平台中接入ES的索引数据查看',connet: getUrl('TODPK'),source: '科技运营数据平台-kibana'},
      {title: '科技运营数据平台提供数据服务平台',connet: getUrl('TODPD'),source: '科技运营数据平台-databank'},
      {title: '科技运营数据平台前期版本',connet: getUrl('TODPE'),source: '科技运营数据平台-ebank'}
      ],
  }

  const content = <Row gutter={[6,12]}>
                    <Col xs={{span: 4}} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                      <WelcomeCard {...dbProps}/>
                    </Col>
                    <Col xs={{span: 4}} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                      <WelcomeCard {...xnProps}/>
                    </Col>
                    <Col xs={{span: 4}} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                      <WelcomeCard {...appProps}/>
                    </Col>
                    <Col xs={{span: 4}} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                      <WelcomeCard {...netprops}/>
                    </Col>
                    <Col xs={{span: 4}} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                      <WelcomeCard {...props}/>
                    </Col>
                    <Col xs={{span: 4}} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                      <WelcomeCard {...logProps}/>
                    </Col>
                  </Row>

  return (
        <div>
          <div className={styles.bgclass}>
            <div>
            {/*<Card  title='监控工具常用链接' style={{display:ozr('welcomeDisplay'), marginTop:'0px'}}>{content}</Card>*/}
            <div className={styles.welcome}>
              <p style={{ fontSize: '24px' }}>欢迎使用{ozr('shortName')}统一监控平台管理2.0系统</p>
              <p style={{ fontSize: '12px' }}>Welcome to {ozr('ename')} centralized monitor platform 2.0   {ozr('version')}</p>
            </div>
            <div className={styles.warnning}>
              严禁在本平台处理、传输绝密、机密、秘密、内部、商密一级信息
            </div>
            </div>
          </div>
        </div>
  )
}
export default connect(({ welcome }) => ({ welcome }))(welcome)
