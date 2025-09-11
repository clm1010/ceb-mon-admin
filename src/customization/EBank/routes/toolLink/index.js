import React from 'react'
import { connect } from 'dva'
import { Row, Col, Tooltip, Typography } from 'antd'
const { Paragraph } = Typography;
import {ozr,getUrl} from '../../../../utils/clientSetting'
import WelcomeCard from '../../../../routes/welcome/welcomeCard'
import Mon from '../../../../routes/welcome/monitoring.png'
import nagios from '../../../../routes/welcome/nagios.png'
import solaris from '../../../../routes/welcome/solaris.png'
import Internet from '../../../../routes/welcome/Internet.png'
import Oracle from '../../../../routes/welcome/Oracle.png'
import Database from '../../../../routes/welcome/Database-oracle_over.png'
import app from '../../../../routes/welcome/app.png'
import apps from '../../../../routes/welcome/apps.png'
import hpux from '../../../../routes/welcome/hpux.png'
import xn from '../../../../routes/welcome/xn.png'
import logs from '../../../../routes/welcome/logs.png'
import alogs from '../../../../routes/welcome/alogs.png'

const toolLink = ({
 location, dispatch, monitor, loading,
}) => {

  const props = {
    img: Mon,//大图片
    avatar: nagios,//小头像
    width: 300,
    user:'monitor',
    show: true,
    name: '系统监控',//卡片名字
    description: <Tooltip title="系统监控工具控制台"><Paragraph ellipsis>系统监控工具控制台</Paragraph></Tooltip>,//描述
    menuItem : [
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
      // {title: '武汉灾备环境服务器监控',connet: getUrl('Nagios102557146'),source: 'Nagios（10.225.7.146)'},
      // {title: '武汉网银区环境服务器监控',connet: getUrl('Nagios102259716'),source: 'Nagios（10.225.97.16)'},

      // {title: 'Zabbix系统总行监控服务器',connet: getUrl('ZHZABBIX'),source: 'ZABBIX（系统监控）'},
      // {title: 'Zabbix系统分行二级资源池监控服务器',connet: getUrl('FH2ZABBIX'),source: 'ZABBIX（系统监控）'},
      // {title: 'Zabbix系统分行一级资源池监控服务器',connet: getUrl('FH1ABBIX'),source: 'ZABBIX（系统监控）'},

      {title: '总行监控(中间件、数据库、全栈云)',connet: getUrl('ZHZABBIX102183543'),source: '主机监控工具系统1(10.218.35.43)'},
      {title: '总行主机linux、AIX',connet: getUrl('ZHZABBIX102141143'),source: '主机监控工具系统2(10.214.114.3)'},
      {title: '总行主机linux、AIX',connet: getUrl('ZHZABBIX1021411421'),source: '主机监控工具系统3(10.214.114.21)'},
      {title: '总行主机linux、AIX',connet: getUrl('ZHZABBIX1021411439'),source: '主机监控工具系统4(10.214.114.39)'},
      {title: '总行主机linux、AIX',connet: getUrl('ZHZABBIX1021411457'),source: '主机监控工具系统5(10.214.114.57)'},
      {title: '总行主机linux、window',connet: getUrl('ZHZABBIX1021411475'),source: '主机监控工具系统6(10.214.114.75)'},
      {title: '分行主机监控',connet: getUrl('ZHZABBIX102183683'),source: '主机监控工具系统7(10.218.36.83)'},
      {title: '总行外部探测',connet: getUrl('ZHZABBIX10214111178'),source: '主机监控工具系统8(10.214.111.178)'},
      {title: '云智维监控一体化配置平台',connet: getUrl('YZHWJK'),source: '云智维监控一体化配置平台'},

      // {title: 'HPUX服务器性能图表工具',connet: getUrl('HPM'),source: 'HP Performance Management'},
    ],
  }

  const netprops = {
    img: solaris,//大图片
    avatar: Internet,//小头像
    width: 300,
    user:'monitor',
    show: true,
    name: 'TCP网络监控',//卡片名字
    description: <Tooltip title="科来TCP网络报文监控"><Paragraph ellipsis>科来TCP网络报文监控</Paragraph></Tooltip>,//描述
    menuItem : [{title: '对报文网络层进行统计分析和监控',connet: getUrl('TCPM'),source: 'TCP监控系统'}],
  }

  const dbProps = {
    img: Oracle,//大图片
    avatar: Database,//小头像
    width: 300,
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
    width: 300,
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
    width: 300,
    user:'monitor',
    show: true,
    name: '智能分析',//卡片名字
    description: <Tooltip title="科技运营数据分析平台"><Paragraph ellipsis>科技运营数据分析平台</Paragraph></Tooltip>,//描述
    menuItem : [{title: '运维数据算法分析和处理',connet:getUrl('TODSP'),source: '科技运营数据分析平台'}],
  }

  const logProps = {
    img: logs,//大图片
    avatar: alogs,//小头像
    width: 300,
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

    return (
      <div>
        <Row gutter={[6,12]}>
          <Col xs={{span: 6}} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <WelcomeCard {...dbProps}/>
          </Col>
          <Col xs={{span: 6}} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <WelcomeCard {...xnProps}/>
          </Col>
          <Col xs={{span: 6}} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <WelcomeCard {...appProps}/>
          </Col>
          <Col xs={{span: 6}} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <WelcomeCard {...netprops}/>
          </Col>
        </Row>
        <Row>
          <Col xs={{span: 6}} xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }}>
            <WelcomeCard {...props}/>
          </Col>
        </Row>
      </div>
    )
}
export default connect(({ toolLink, loading }) => ({ toolLink, loading: loading.models.toolLink }))(toolLink)
