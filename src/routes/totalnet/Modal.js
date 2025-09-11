import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Modal,
  Table,
  Button,
  Select, Row, Col, Input,
} from 'antd'
import { Link } from 'dva/router'

const FormItem = Form.Item
// const TabPane = Tabs.TabPane
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 10,
  },
}

const modal = ({
                 dispatch,
                 visible,
                 currentItem,
                 paginationKpi,
                 parentUUID,
                 kpiUUID,
                 shouldMonitor,
                 isMonitoring,
                 form: {
                   getFieldDecorator,
                   getFieldsValue,
                   resetFields,
                 },
               }) => {
  const  openKpiModal = (record, e) => {
    let kpiUUID = record.kpiUUID
    /*
    获取关联实例的数据
  */
    dispatch({
      type: 'totalnet/querystra',
      payload: {
        kpiUUID: kpiUUID,
      },
    })
  }

  const openMosModal = (record, e) => {
    let policyUUID = ''
    let uuidPle = ''
    if (record) {
      policyUUID = record.policyUUID
      uuidPle = record.uuid
    }
    console.log('openMosModal :', policyUUID)

    /*
    获取关联实例的数据
  */
    dispatch({
      type: 'totalnet/findById',
      payload: {
        policyUUID: policyUUID,
        kpiUUID: uuidPle,
        relatedType: 'TOOL_INST',
      },
    })
  }
  const onCancel = () => { // 弹出窗口中点击取消按钮触发的函数
    dispatch({
      type: 'totalnet/setState',
      payload: {
        modalVisible: false,
      },
    })
    resetFields()
  }
  const onSearch = () => {
    let data = {
      ...getFieldsValue(),
    }
    dispatch({
      type: 'totalnet/kpiPolicy',
      payload: {
        kpiUUID: data.policy !== undefined && data.policy !== null && data.policy !== 'null' ? null : parentUUID,
        policyName: data.policyName,
        parentUUID: parentUUID,
        shouldMonitor: data.policyType !== undefined ? data.policyType : shouldMonitor,
        isMonitoring: data.policy !== undefined && data.policy !== 'null' ? data.policy : isMonitoring,
      },
    })
    dispatch({
      type: 'totalnet/setState',
      payload: {
        kpiUUID: data.policy !== undefined && data.policy !== null && data.policy !== 'null' ? null : parentUUID,
        policyName: data.policyName,
        parentUUID: parentUUID,
        shouldMonitor: data.policyType !== undefined ? data.policyType : shouldMonitor,
        isMonitoring: data.policy !== undefined && data.policy !== 'null' ? data.policy : isMonitoring,
      },
    })
  }

  const onExport = () => {
    let data = {
      ...getFieldsValue(),
    }
    dispatch({
      type: 'totalnet/kpiPolicyExport',
      payload: {
        kpiUUID: data.policy !== undefined && data.policy !== null && data.policy !== 'null' ? null : parentUUID,
        policyName: data.policyName,
        parentUUID: parentUUID,
        shouldMonitor: data.policyType !== undefined ? data.policyType : shouldMonitor,
        isMonitoring: data.policy !== undefined && data.policy !== 'null' ? data.policy : isMonitoring,
      },
    })
    dispatch({
      type: 'totalnet/setState',
      payload: {
        kpiUUID: data.policy !== undefined && data.policy !== null && data.policy !== 'null' ? null : parentUUID,
        policyName: data.policyName,
        parentUUID: parentUUID,
        shouldMonitor: data.policyType !== undefined ? data.policyType : shouldMonitor,
        isMonitoring: data.policy !== undefined && data.policy !== 'null' ? data.policy : isMonitoring,
      },
    })
  }

  const onPageChage = (page) => {
    let data = {
      ...getFieldsValue(),
    }
    dispatch({
      type: 'totalnet/kpiPolicy',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        kpiUUID: kpiUUID,
        parentUUID: parentUUID,
        policyName: data.policyName,
        shouldMonitor: shouldMonitor,
        isMonitoring: isMonitoring,
      },
    })
    dispatch({
      type: 'totalnet/setState',
      payload: {
        onPageChage: new Date().getTime(),
        batchDelete: false,
        selectedRows: []
      },
    })
  }

  const rowSelection = {
    onChange: (selecteRowKeys, selectedRows) => {
      let choosed = []
      selecteRowKeys.forEach(
        function (object) {
          choosed.push = object.id
        },
      )
      if (selectedRows.length > 0) {
        dispatch({
          type: 'totalnet/setState',
          paload: {
            batchDelete: true,
            selectedRows: selectedRows,
          },
        })
      } else if (selectedRows.length === 0) {
        dispatch({
          type: 'totalnet/setState',
          paload: {
            batchDelete: false,
            selectedRows: selectedRows,
          },
        })
      }
    },
  }

  const modalOpts = {
    title: '查看具体指标策略',
    visible,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    zIndex: 100,
  }
  const columns = [
    {
      title: '指标名称',
      dataIndex: 'kpiName',
      key: 'kpiName',
      width: 300,
      render: (text, record) => {
        return <a onClick={e => openKpiModal(record, e)} >{text}</a>
      }
    },
    {
      title: '策略名称 ',
      dataIndex: 'policyName',
      key: 'policyName',
      render: (text, record) => {
        return <a onClick={e => openMosModal(record, e)} >{text}</a>
      }
    },
    {
      title: '实际监控',
      dataIndex: 'isMonitoring',
      key: 'isMonitoring',
      render: (text, record) => (
        <div>{record.isMonitoring ? '是' : '否'}</div>
      ),
    },
    {
      title: '应监控',
      dataIndex: 'shouldMonitor',
      key: 'shouldMonitor',
      render: (text, record) => (
        <div>{record.shouldMonitor ? '是' : '否'}</div>
      ),
    },
    {
      title: 'ip',
      dataIndex: 'discoverip',
      key: 'discoverip',
    },
    {
      title: 'oid',
      dataIndex: 'objectid',
      key: 'objectid',
    }]

  // 适用范围查询条件搜索---start
  return (
    <Modal {...modalOpts} width="75%" footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>]}>
      <Form layout="horizontal">
        <Row gutter={4} style={{ backgroundColor: '#eef2f9', padding: 8 }}>
          <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key="kpi">
            <FormItem label="应监控" {...formItemLayout} >
              {getFieldDecorator('policyType', {
                initialValue: shouldMonitor + "",
              })(
                <Select
                  showSearch
                  placeholder={'请选择'}
                  getPopupContainer={() => document.body}
                >
                  <Select.Option value="true" >是</Select.Option>
                  <Select.Option value="false">否</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key="policy">
            <FormItem label="实际监控" {...formItemLayout}>{getFieldDecorator('policy', {
              initialValue: isMonitoring + "",
            })(
              <Select allowClear showSearch placeholder={'请选择'} optionFilterProp="children" getPopupContainer={() => document.body}>
                <Select.Option value="true">是</Select.Option>
                <Select.Option value="false">否</Select.Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 24 }} key="policyName">
            <FormItem label="策略名称" {...formItemLayout}>{getFieldDecorator('policyName', {
            })(
              <Input placeholder={'请输入'} />
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={4} style={{ marginTop: 4, marginBottom: 20 }}>
          <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <span style={{ float: 'right', marginTop: 8 }}>
              <Button htmlType="submit" onClick={() => onSearch()} >查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => onExport()}>导出</Button>
            </span>
          </Col>
        </Row>
        <Table
          scroll={{ x: 950 }}
          columns={columns}
          dataSource={currentItem}
          rowSelection={rowSelection}
          pagination={paginationKpi}
          onChange={onPageChage}
          rowKey={record => record.uuid}
          size='small'
          bordered
        />
      </Form>
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
