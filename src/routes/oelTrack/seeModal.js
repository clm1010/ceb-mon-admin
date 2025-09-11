import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Tabs, Row, Col, Icon, Table, Button, Card, Collapse, message, Divider } from 'antd'
import ShowTime from './ShowTime'
import Timecomtent from './Time'
import Continue from './Continue'
import mystyle from './style.css'
import seemodal from './seemodal.less'
import { getUrl} from '../../utils/clientSetting'
import Tables from './tables'
import './tableStyle.css'
const TabPane = Tabs.TabPane

const modal = ({
  dispatch,
  visible,
  item,
  form: {
    resetFields,
    validateFieldsAndScroll,
  },
  expands,
  fullstyle,
  forbind,
  tkey,
  nowDate
}) => {
  let {
    n_CustomerSeverity, n_AppName, nodeAlias, alertGroup, node, n_ComponentType, n_SumMaryCn, firstOccurrence1, lastOccurrence1, n_MaintainETime1, n_MaintainStatus, nextalart, num, createdTime1, oz_LimitTime1, beginTime1,
  } = item
  const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
    resetFields()
    dispatch({
      type: 'oelTrack/setState', //抛一个事件给监听这个type的监听器
      payload: {
        seeModalvisible: false,
        countState: true,
        forbind:true,
        tkey:false,
      },
    })
  }
  let ModaldataSource = []
  if (item.actions) {
    ModaldataSource = item.actions
    ModaldataSource.forEach((val, index) => {
      ModaldataSource[index].timePoint = item.beginTime + ModaldataSource[index].interval * 60 * 1000
    })
  }
  const columns = [
    {
      title: '时间点',
      dataIndex: 'timePoint',
      key: 'timePoint',
      width: '15%',
      render: (text, record, index) => {
        return (<div >
          <span style={{textAlign:'left' }}><Icon type={(index == num) ? 'environment' : ' '} theme="twoTone" style={{ fontSize: 26, color: '#FF0000' }} /></span>
          <span style={{ textAlign: 'center' }}>{new Date(text).format('yyyy/MM/dd hh:mm:ss')}</span>
        </div>)
      },
    },
    {
      title: '相对时间点',
      dataIndex: 'interval',
      key: 'interval',
      width: '10%',
      className:'tableStyle',
      render: (text) => {
        return `${text}分钟`
      }
    },
    {
      title: '动作名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '处置动作',
      dataIndex: 'action',
      key: 'action',
//      width: '40%',
      render: (text, record, index) => {
        return (<div>{text}&nbsp;
            <span style={{ float: 'right', marginRight: 5 }}> {record.handled ? <Icon type="check-circle" style={{ fontSize: 26, color: '#52C41A' }} /> : <Icon type="question-circle" style={{ fontSize: 26, color: '#ff4242' }} />}</span>
        </div>)
      },
    },
    {
      title: '操作',
      width: '5%',
      render: (record) => {
        return <Continue sty={1} dispatch={dispatch} record={record} item={item} nowDate={nowDate}/>
      }
    }]
  const modalOpts = {
    title: '告警跟踪详情',
    visible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    zIndex: 1000,
    centered: false
  }
  let level = (n_CustomerSeverity) => {
    switch (n_CustomerSeverity) {
      case 1: return '故障'
      case 2: return '告警'
      case 3: return '预警'
      case 4: return '提示'
      case 100: return '信息'
    }
  }
  const fullscreen = () => { //弹出窗口中点击取消按钮触发的函数
    expands = expands ? false : true
    dispatch({
      type: 'oelTrack/setState', //抛一个事件给监听这个type的监听器
      payload: {
        expands: expands,
      },
    })
  }
  let msg
  item.lastinfo == '1' ? msg = "已结束" : msg = "请处理"

  const countdown = {
    dispatch: dispatch,
    endTime: item.enddate,
    voice: item.voice,
    actionName:item.actionName,
    ModaldataSource:ModaldataSource,
    forbind:forbind,
    nowDate:nowDate,
    onlyOne: true,
    item: item,
    msg: msg,
    sty: 1,
  }
  let url = `${getUrl('/seeModal')}?refresh=1m&orgId=1&from=now-2h&to=now&var-app_name=${n_AppName}`
  return (
    <Modal {...modalOpts} width="850px" footer={[<Button key="cancdata" onClick={onCancel}>关闭</Button>]} className='bordernone'>
      <Card className={expands ? seemodal.fullscreen : ''} extra={<a onClick={fullscreen} > <Icon type={expands ? "shrink" : "arrows-alt"} />  </a>} style={{background:'#000c17'}} >
        <Form >
          <Row gutter={24} style={{border:0}}>
            <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
              <div className={mystyle.title} >{item.name}
                <a href={url} target="_blank" className={mystyle.link}><Icon type="link" /> </a>
              </div>
            </Col>
          </Row>
{/*           <Collapse bordered={false}>
            <Panel header="基本信息">
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>应用系统</b> : {n_AppName}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>IP地址</b> : {nodeAlias}</Col>
              <Col className={mystyle.mess} xl={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }}><b style={{ textDecoration: 'underline' }}>告警详情</b> : {n_SumMaryCn}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>级别</b> :{level(n_CustomerSeverity)}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>告警组</b> : {alertGroup}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>告警大类</b> : {n_ComponentType}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>首次发生时间</b> : {firstOccurrence1}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>末次发生时间</b> : {lastOccurrence1}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>出维护期时间</b> : {n_MaintainETime1}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>维护期状态</b> : {n_MaintainStatus}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>下次提醒时间</b> : {nextalart}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>开始跟踪时间</b> : {beginTime1}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>已提醒次数</b> : {num}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>触发时间</b> : {createdTime1}</Col>
              <Col className={mystyle.mess} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>限时时间</b> : {oz_LimitTime1}</Col>
            </Panel>
          </Collapse> */}
          {/*告警时间---start*/}
          <Divider style={{background:'#e72121'}}/>
          <div style={{ padding: '20px' }}>
          <Row gutter={16}>
              <div className={mystyle.showtime}>
                <ShowTime />
              </div>
            </Row>
            <Row gutter={16}>
                <div className={mystyle.downtime} >
                  <Timecomtent {...countdown} />
                  {/* <Countdown className='downtime' startTime={Date.now()} endTime={item.enddate} msg="倒计时结束了"></Countdown> */}
                </div>
            </Row>
            <Row gutter={16}>
              <div className={mystyle.follwotime}
              >
                <span>跟踪时长： </span> <Timecomtent starTime={item.followdate} sty={2} nowDate={nowDate} forbind = {forbind}/> {/* <CountTime className='addtime' startTime={item.followdate} msg="跟踪结束了"></CountTime> */}
              </div>
            </Row>
          </div>
          <Divider style={{background:'#e72121'}}/>
          <div>
            <Row gutter={16}>
              <Tables colums={columns} dataSource={ModaldataSource} dispatch={dispatch} item={item} tkey = {tkey} />
            </Row>
          </div>
        </Form>
      </Card>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
