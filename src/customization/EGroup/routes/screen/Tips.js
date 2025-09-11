import React from 'react'
import PropTypes from 'prop-types'
import {Alert, Form, Icon, Modal, Tabs} from 'antd'

const modal = ({
                 dispatch,
                 visible,
               }) => {
  const onOk = () => {
    dispatch({
      type: 'appSelect/clearState',
    });
    dispatch({
      type: 'screen/updateState',
      payload: {
        modalVisible: false,
      },
    })
  };

  const onCancel = () => {
    dispatch({
      type: 'appSelect/clearState',
    });
    dispatch({
      type: 'screen/updateState',
      payload: {
        modalVisible: false,
      },
    })
  };

  const modalOpts = {
    title: `大屏说明`,
    visible,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    zIndex: 990,
  };
  const {TabPane} = Tabs;
  return (
    <Modal {...modalOpts} width="1250px">
      <Tabs defaultActiveKey="1" >
        <TabPane tab={<span><Icon type="exception" />网络安全域告警(1,2级)</span>} key="1">
          {<div><Alert message={'点击告警数值，跳转到网络服务域告警（1,2级）详情页面。'} type="info" showIcon /><br /></div>}
        </TabPane>
      </Tabs>

      <Tabs defaultActiveKey="1" >
        <TabPane tab={<span><Icon type="exception" />办公大楼及坐席健康状态</span>} key="1">
          <Alert message={'节点状态：绿色（正常），红色（超过50%的设备ping不通），黄色（50%以下设备ping不通）'} type="info" showIcon /><br />
          <Alert message={'线路状态：绿色（正常），红色（主备线路都中断）,黄色（一条线路中断）'} type="info" showIcon /><br />
          <Alert message={'点击节点或者线，跳转到具体告警详情页面'} type="info" showIcon /><br />
        </TabPane>
      </Tabs>

      <Tabs defaultActiveKey="1" >
        <TabPane tab={<span><Icon type="exception" />骨干网健康状态</span>} key="1">
        <Alert message={'线路状态：绿色（正常），红色（中断）,黄色（响应时间高，丢包，带宽超阈值）'} type="info" showIcon /><br />
        <Alert message={'节点状态：绿色（正常），黄色（分行上联路由器1级、2级告警），橘黄色（分行上联路由器3级告警）'} type="info" showIcon /><br />
        <Alert message={'点击节点或者线，跳转到具体告警详情页面'} type="info" showIcon /><br />
        </TabPane>
      </Tabs>

      <Tabs defaultActiveKey="1" >
        <TabPane tab={<span><Icon type="exception" />数据中心互联DWDM裸光健康状态</span>} key="1">
        <Alert message={'线路状态：绿色（正常），红色（中断）'} type="info" showIcon /><br />
        <Alert message={'点击线，跳转到DWDM连接健康状态告警详情页面'} type="info" showIcon /><br />
        </TabPane>
      </Tabs>

      <Tabs defaultActiveKey="1" >
        <TabPane tab={<span><Icon type="exception" />第三方专线健康状态</span>} key="1">
          <Alert message={'线路状态：绿色（正常），红色（中断）,黄色（响应时间高，丢包，带宽超阈值）'} type="info" showIcon /><br />
          <Alert message={'点击线，跳转到具体告警详情页面'} type="info" showIcon /><br />
        </TabPane>
    </Tabs>
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
