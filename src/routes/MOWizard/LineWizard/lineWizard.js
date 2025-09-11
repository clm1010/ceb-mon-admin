import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Tabs, Modal, Alert, Row, Col, Steps, Icon, Button, message, DatePicker, Tag, Spin } from 'antd'
import moment from 'moment'
import '../wizard.css'
import Fenhang from '../../../utils/fenhang'
import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import { validateIP } from '../../../utils/FormValTool'
import AppSelect from '../../../components/appSelectComp'
import PreList from '../previewList'

const { Step } = Steps;

const steps = [
  {
    title: '第一步',
    content: '设备查询',
  },
  {
    title: '第二步',
    content: '编辑信息',
  },
  {
    title: '第三步',
    content: '下发预览',
  },
];

const Option = Select.Option

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
}

const TabPane = Tabs.TabPane

const modal = ({
  dispatch,
  lineWizardVisible,
  currentStep,
  lineItem = {},
  form,
  lineList,
  modalType, // create/update
  appSelect,
  policyAllList,
  policyExistList,
  policyList,
  dataList,
  errorList,
  preListType,
  q,
  loadingEffect,
  onIssueForbid,
}) => {

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,
  } = form

  const aaInterface = []
  if ('aAItfsList' in lineItem) {
    for (let itf of lineItem.aAItfsList) {
      if (itf.ip !== undefined) {
        aaInterface.push(<Option key={itf.uuid} ip={itf.ip} value={`${itf.portName}&${itf.ip}`} record={itf}><Tag>{itf.portName}</Tag><span style={{ color: '#bebebe' }}>{itf.ip}</span></Option>)
      }
    }
  }
  const zzInterface = []
  if ('zZItfsList' in lineItem) {
    for (let itf of lineItem.zZItfsList) {
      if (itf.ip !== undefined) {
        zzInterface.push(<Option key={itf.uuid} ip={itf.ip} value={`${itf.portName}&${itf.ip}`} record={itf}><Tag>{itf.portName}</Tag><span style={{ color: '#bebebe' }}>{itf.ip}</span></Option>)
      }
    }
  }

  let Fenhangmaps = new Map()
  Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
  })

  const cleanup = () => {
    // 清除appSelect内容
    dispatch({
      type: 'appSelect/clearState',				//@@@
    })
    // clear fields and list
    dispatch({
      type: 'mowizard/setState',
      payload: {
        //modalType: 'create',
        lineWizardVisible: false,
        currentStep: 0,
        lineItem: {},
        policyAllList: [],
        policyExistList: [],
        policyList: [],
        errorList: [],
        preListType: 'UNISSUED',
        loadingEffect: false,
      },
    })
  }
  //点击保存
  const onDone = () => {
    let opType = modalType + 'Line'
    dataList.previewData = dataList.preIssueResult.incremental
    if(policyList.length > 0){
      Modal.confirm({
        title: '存在增量实例！',
        content: '请使用下发功能进行操作',
        okText: '确认',
      });
    }else{
      delete lineItem.aAItfsList
      delete lineItem.zZItfsList
      dispatch({
        type: `mowizard/${opType}`,
        payload: { currentItem: lineItem, q: q === undefined ? '' : q, dataList: dataList, types: 'save' }
      })
      resetFields()
      cleanup()
    }
  }

  const issue = () => {
    let opType = modalType + 'Line'
    dataList.previewData = dataList.preIssueResult.incremental
    if (policyList.length > 0) {
      delete lineItem.aAItfsList
      delete lineItem.zZItfsList
      dispatch({
        type: `mowizard/${opType}`,
        payload: { currentItem: lineItem, q: q === undefined ? '' : q, dataList: dataList, types: 'issue' }
      })
      resetFields()
      cleanup()
    } else {
      message.warning('未匹配到增量实例！')
    }
  }

  const onCancel = () => {
    //message.success('Processing cancelled!',1)
    resetFields()
    cleanup()
    /*
    dispatch({
      type: 'mowizard/setState',
      payload: {
          //modalType: 'create',
          lineWizardVisible: false,
          currentStep: 0,
          lineItem: {},
          policyAllList: [],
          policyExistList: [],
          policyList: [],
          errorList: [],
          preListType: 'UNISSUED',
        },
    })*/
  }

  const resetIFs = () => {
    //clear 接口IP
    delete lineItem.aaIntf
    delete lineItem.zzIntf

    //clear 接口物理名称
    delete lineItem.zzIP
    delete lineItem.aaIP

    //clear 接口
    delete lineItem.zzPort
    delete lineItem.aaPort

    dispatch({
      type: 'mowizard/setState',
      payload: ({
        lineItem: lineItem,
      }),
    })

    resetFields(['aaIntf', 'zzIntf', "aaIP", "zzIP", "_zzPort", "_aaPort"])
  }

  const next = () => {
    let fstFields = ["lineType", "aaDeviceIP", "zzDeviceIP"]
    let scdFields = ["aaPort",
      "zzPort",
      "aaIP",
      "zzIP",
      "zzPhyName",
      "name",
      "branchName",
      "mngtOrgCode",
      "haMode",
      "onlineStatus",
      "managedStatus"]
    let readFields = ["aaPort",
      "zzPort",
      "aaIP",
      "zzIP",
      "aaPhyName",
      "zzPhyName",
      "name",
      "alias",
      "branchName",
      "mngtOrgCode",
      "lineID",
      "haMode",
      "bwFromA",
      "onlineStatus",
      "managedStatus",
      "provider",
      "appCode",
      "appName",
      "capType"]
    let checkOk = true
    if (currentStep === 0) {
      validateFields(fstFields, (errors) => {
        if (errors) {
          checkOk = false
        } else {
          if ('update' !== modalType) {
            dispatch({
              type: 'mowizard/setState',
              payload: {
                loadingEffect: true,
              },
            })
            lineItem = getFieldsValue(fstFields)
            resetIFs()
            dispatch({
              type: 'mowizard/queryLineNe',
              payload: ({
                inputInfo: lineItem.aaDeviceIP,
                linetype: lineItem.lineType,
                farendInfo: lineItem.zzDeviceIP,
                lineItem: lineItem,
              }),
            })
          }
          else {
            dispatch({
              type: 'mowizard/setState',
              payload: {
                currentStep: 1,
              }
            })
          }
        }
      })
    } else if (currentStep === 1) {
      validateFields(scdFields, (errors) => {
        if (errors) {
          checkOk = false
        } else {
          dispatch({
            type: 'mowizard/issueJudge',
            payload: {}
          })
          dispatch({
            type: 'mowizard/setState',
            payload: {
              loadingEffect: true,
            },
          })
          //let item = getFieldsValue(readFields)
          let item = getFieldsValue()
          item.branchname_cn = Fenhangmaps.get(item.branchName)
          item.mngtOrg = Fenhangmaps.get(item.mngtOrgCode)
          Object.assign(lineItem, item)
          dispatch({
            type: 'mowizard/queryLinePreview',
            payload: {
              lineItem,
              modalType
            },
          })
        }
      })
    }
  }

  const prev = () => {
    let current = currentStep - 1;
    //if (('update' === modalType) && (current === 0)){}
    //else{
    dispatch({
      type: 'mowizard/setState',
      payload: {
        currentStep: current,
        //lineItem: lineItem,
      },
    })
    //}
  }

  const modalOpts = {
    title: '线路向导',
    visible: lineWizardVisible,
    //onOk,
    //onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    closable: false,
  }

  const user = JSON.parse(sessionStorage.getItem('user'))
  if (modalType === 'create' && lineItem.branchName === undefined) {
    lineItem.branchName = user.branch
  }

  //1st page
  const onLineTypeChange = (val) => {
    lineItem.lineType = val

    lineItem.zzIP = ''
    delete lineItem.zzPort
    delete lineItem.zzDeviceIP
    delete lineItem.zzIntf

    dispatch({
      type: 'mowizard/setState', //抛一个事件给监听这个type的监听器
      payload: {
        lineItem: lineItem,
      },
    })
  }

  function genOptions() {
    let netDomain = ''
    let value1 = getFieldsValue(['appName'])
    let value2 = getFieldsValue(['firstSecArea'])
    if (value1 && value1.appName && value1.appName.includes('网络|')) {
      netDomain = value1.appName.split('|')[1]
    } else if (value2.firstSecArea != '' || value2.firstSecArea != undefined) {
      netDomain = value2.firstSecArea
    }
    return netDomain
  }

  const firstForm = () => {
    return (
      <div>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="线路类型" hasFeedback {...formItemLayout}>
            {getFieldDecorator('lineType', {
              initialValue: lineItem.lineType ? lineItem.lineType : 'EXTERNAL',
            })(<Select onChange={onLineTypeChange} disabled={'update' === modalType}>
              {/* <Select.Option value="INTERNAL">行内线路</Select.Option >
              <Select.Option value="EXTERNAL">第三方线路</Select.Option > */}
              {genDictOptsByName('lineType')}
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="本端设备IP" key="aaDeviceIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('aaDeviceIP', {
              initialValue: lineItem.aaDeviceIP,
              rules: [{ required: true, },
              { validator: validateIP, },],
            })(<Input disabled={'update' === modalType} />)}
          </FormItem>
        </span>

        <span style={{ width: '80%', float: 'left' }}>
          {lineItem.lineType === 'INTERNAL' ?
            <FormItem label="对端设备IP" key="zzDeviceIP" hasFeedback {...formItemLayout}>
              {getFieldDecorator('zzDeviceIP', {
                initialValue: lineItem.zzDeviceIP,
                rules: [{ required: true, },
                { validator: validateIP, },],
              })(<Input disabled={'update' === modalType} />)}
            </FormItem>
            :
            <FormItem label="对端设备IP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('bbb', {
            })(<Input type="hidden" />)}
          </FormItem>
          }
        </span>
      </div>
    )
  }

  // 2nd page
  // 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖
  if (appSelect.currentItem.affectSystem !== undefined) {
    lineItem.appName = appSelect.currentItem.affectSystem
    lineItem.uniqueCode = appSelect.currentItem.c1
    lineItem.appCode = appSelect.currentItem.englishCode
  }

  const appSelectProps = Object.assign({}, appSelect, {
    placeholders: '请输入应用信息查询',
    name: '应用分类名称',
    modeType: 'combobox',
    required: false,
    dispatch,
    form,
    disabled: false,
    compName: 'appName',
    formItemLayout,
    currentItem: { affectSystem: lineItem.appName },
  })

  const onMngtOrg = (value, record) => {
    lineItem.mngtOrg = record.props.name
    lineItem.mngtOrgCode = value
    dispatch({
      type: 'line/setState',				//@@@
      payload: {
        lineItem: lineItem,
      },
    })
  }

  const onAaIntfSelect = (value, option) => {
    //获取选中的接口对象
    lineItem.aaIntf = { uuid: option.props.record.uuid, name: option.props.record.name }
    // item.aaPhyName = option.props.record.name //接口物理名称，拼关键字用
    lineItem.aaPort = option.props.record.portName

    setFieldsValue({
      aaIP: option.props.record.ip,
    })
    //要传递给后台的接口对象
    dispatch({
      type: 'line/setState',
      payload: ({
        lineItem: lineItem,
      }),
    })
  }
  const onZzIntfSelect = (value, option) => {
    //获取选中的接口对象
    lineItem.zzIntf = { uuid: option.props.record.uuid, name: option.props.record.name }
    // item.zzPhyName = option.props.record.name //接口物理名称，拼关键字用
    lineItem.zzPort = option.props.record.portName

    setFieldsValue({
      zzIP: option.props.record.ip,
    })
    //要传递给后台的接口对象
    dispatch({
      type: 'line/setState',
      payload: ({
        lineItem: lineItem,
      }),
    })
  }

  let info = ''
  if (lineItem.aaIntf) {
    info = lineItem.aaIntf.ip
  }
  const secondForm = () => {
    return (
      <div>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="本端接口" hasFeedback {...formItemLayout}>
            {getFieldDecorator('aaPort', {
              initialValue: lineItem.aaPort,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={'update' === modalType} showSearch onSelect={onAaIntfSelect} notFoundContent="请选择本端设备IP触发接口列表刷新">
              {aaInterface}
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          {lineItem.lineType === 'INTERNAL' ?
            <FormItem label="对端接口" hasFeedback {...formItemLayout}>
              {getFieldDecorator('zzPort', {
                initialValue: lineItem.zzPort,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select disabled={'update' === modalType} showSearch onSelect={onZzIntfSelect} notFoundContent="请选择对端设备IP触发接口列表刷新">
                {zzInterface}
              </Select>)}
            </FormItem>
            :
            <FormItem label="对端接口" hasFeedback {...formItemLayout}>
              {getFieldDecorator('aaa', {
              })(<Input type="hidden" />)}
            </FormItem>
          }
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="本端接口IP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('aaIP', {
              initialValue: info,
              rules: [
                {
                  required: true,
                },
                {
                  validator: validateIP,
                },
              ],
            })(<Input readOnly disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="对端接口IP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('zzIP', {
              initialValue: lineItem.zzIP,
              rules: [
                {
                  required: true,
                },
                {
                  validator: validateIP,
                },
              ],
            })(<Input disabled={(lineItem.lineType === 'INTERNAL') || ('update' === modalType)} />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="本端接口物理名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('aaPhyName', {
              initialValue: lineItem.aaIntf ? lineItem.aaIntf.name : '',
            })(<Input readOnly disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          {lineItem.lineType === 'INTERNAL' ?
            <FormItem label="对端接口物理名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('zzPhyName', {
                initialValue: lineItem.zzIntf ? lineItem.zzIntf.name : '',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input readOnly disabled />)}
            </FormItem>
            :
            <FormItem label="对端接口物理名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('abc', {
              })(<Input type="hidden" />)}
            </FormItem>
          }
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: lineItem.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alias', {
              initialValue: lineItem.alias,
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchName', {
              initialValue: lineItem.branchName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={lineItem.branchName !== undefined || ('update' === modalType)} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngtOrgCode', {
              initialValue: lineItem.mngtOrgCode,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={'update' === modalType} onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="专线ID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('lineID', {
              initialValue: lineItem.lineID,
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主备模式" hasFeedback {...formItemLayout}>
            {getFieldDecorator('haMode', {
              initialValue: lineItem.haMode,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={'update' === modalType}>
                {genDictOptsByName('haRole')}
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="采集带宽来源" hasFeedback {...formItemLayout}>
            {getFieldDecorator('bwFromA', {
              initialValue: (lineItem.bwFromA ? 'false' : 'true'),
            })(<Select disabled={'update' === modalType}>
              <Select.Option value="true">本端</Select.Option>
              <Select.Option value="false">对端</Select.Option>
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('onlineStatus', {
              initialValue: lineItem.onlineStatus ? lineItem.onlineStatus : '在线',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={true}>{genDictOptsByName('onlineStatus')}</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('managedStatus', {
              initialValue: lineItem.managedStatus ? lineItem.managedStatus : '纳管',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={true}>{genDictOptsByName('managedStatus')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="服务商" hasFeedback {...formItemLayout}>
            {getFieldDecorator('provider', {
              initialValue: lineItem.provider,
            })(<Select >
              {genDictOptsByName('provider')}
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <AppSelect {...appSelectProps} />
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appCode', {
              initialValue: lineItem.appCode,
            })(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('capType', {
              initialValue: lineItem.capType,
              rules: [
                { whitespace: true, message: '您输入了纯空格' },
              ],
            })(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
            {getFieldDecorator('netDomain', {
              initialValue: lineItem.netDomain ? lineItem.netDomain : genOptions(),
              rules: [
                {
                  required: true,
                },
              ]
            })(<Input disabled />
            )}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SLA号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('slaNum', {
              initialValue: lineItem.slaNum,
            })(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="线路分类" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typ', {
              initialValue: lineItem.typ,
            })(<Select >
              {genDictOptsByName('Line_stle')}
            </Select>)}
          </FormItem>
        </span>
      </div>
    )
  }

  // 3rd form
  const tabsOpts = {
    activeKey: preListType,
  }

  const tabChange = (key) => {
    dispatch({
      type: 'mowizard/setState',
      payload: {
        preListType: key,
      },
    })
  }
  const PolicyListProps = {
    dispatch,
    dataSource: (policyList && policyList.length > 0 ? policyList : []),
    policyType: preListType,
  }

  const ErrorListProps = {
    dispatch,
    dataSource: (errorList && errorList.length > 0 ? errorList : []),
    policyType: preListType,
  }

  const PolicyListExistProps = {
    dispatch,
    dataSource: (policyExistList && policyExistList.length > 0 ? policyExistList : []),
    policyType: preListType,
  }

  const PolicyListAllProps = {
    dispatch,
    dataSource: (policyAllList && policyAllList.length > 0 ? policyAllList : []),
    policyType: preListType,
  }
  const thirdForm = () => {
    return (
      <div>
        <Row gutter={24}>
          <Col className="content-inner3">
            <Tabs size="small" {...tabsOpts} onTabClick={tabChange}>
              <TabPane tab={<span><Icon type="pause-circle" style={{ color: 'gray' }} />增量实例</span>} key="UNISSUED">
                <PreList {...PolicyListProps} />
              </TabPane>
              <TabPane tab={<span><Icon type="close-circle" style={{ color: 'red' }} />问题实例</span>} key="PROBLEM">
                <PreList {...ErrorListProps} />
              </TabPane>
              <TabPane tab={<span><Icon type="check-circle" style={{ color: '#56c22d' }} />已存在实例</span>} key="ISSUED">
                <PreList {...PolicyListExistProps} />
              </TabPane>
              <TabPane tab={<span><Icon type="info-circle" style={{ color: '#2592fc' }} />全量实例</span>} key="ALL">
                <PreList {...PolicyListAllProps} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }


  let hideStyle = { display: "none", }
  let showStyle = { display: "block", }
  return (
    <Modal {...modalOpts} width={'80%'} footer={null}>
      <div>
        <Spin spinning={loadingEffect === undefined ? false : loadingEffect}>
          <Steps current={currentStep} size="small" >
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <br />
          <Row gutter={4} style={{ backgroundColor: '#fff', padding: 8 }}>
            <span>{//modalType
            }</span>
            <div className="steps-content"><Alert message={steps[currentStep] ? steps[currentStep].content : null} type='info' showIcon /><br /></div>
            <Form layout="horizontal" >
              <div className="steps-content" style={currentStep !== 0 ? hideStyle : showStyle}>{firstForm()}</div>
              <div className="steps-content" style={currentStep !== 1 ? hideStyle : showStyle}>{secondForm()}</div>
              <div className="steps-content" style={currentStep !== 2 ? hideStyle : showStyle}>{thirdForm()}</div>
            </Form>
          </Row>
          <Row gutter={4} style={{ marginTop: 8, marginBottom: 10 }}>
             {currentStep === steps.length - 1 && (
              <span>
                {/* <Button type="primary" style={{ float: 'left', marginLeft: 12 }} onClick={issue} disabled={onIssueForbid}><Icon type="deployment-unit" />
                  下  发
                </Button> */}
                <Button style={{ float: 'left', marginLeft: 12 }}  onClick={onDone}><Icon type="check-circle-o" />
                      保  存
                    </Button>
              </span>
            )}
            <span style={{ float: 'right', marginTop: 8 }}>
              <div >
                {<Button type="primary" style={{ marginRight: 8 }} onClick={onCancel}><Icon type="close-circle-o" />取  消</Button>}
                {currentStep > 0 && (
                  <Button style={{ marginRight: 8 }} onClick={prev}><Icon type="left-circle-o" />
                    上一步
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <span>
                    {/* <Button type="primary" onClick={onDone}><Icon type="check-circle-o" />
                      保  存
                    </Button> */}
                    <Button type="primary" onClick={issue} disabled={onIssueForbid}><Icon type="deployment-unit" />
                      下  发
                    </Button>
                  </span>
                )}
                {currentStep < steps.length - 1 && (
                  <Button onClick={next}><Icon type="right-circle-o" />
                    下一步
                  </Button>
                )}
              </div>
            </span>
          </Row>
        </Spin>
      </div>


    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  currentStep: PropTypes.number,
}

export default Form.create()(modal)
