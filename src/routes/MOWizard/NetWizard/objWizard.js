import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Tabs, Modal, Alert, Row, Col, Steps, Icon, Button, message as tipmessage, DatePicker, Spin } from 'antd'
import moment from 'moment'
import '../wizard.css'
import Fenhang from '../../../utils/fenhang'
import firstSecAreaAll from '../../../utils/selectOption/firstSecAreaAll'
import { onSearchInfo, genDictOptsByName, getSourceByKey } from '../../../utils/FunctionTool'
import { validateIP } from '../../../utils/FormValTool'
import AppSelect from '../../../components/appSelectComp'

import IFList from './interfaceList'
import PreList from '../previewList'

const { Step } = Steps;

const steps = [
  {
    title: '第一步',
    content: '设备发现',
  },
  {
    title: '第二步',
    content: '同步设备信息和接口信息',
  },
  {
    title: '第三步',
    content: '选择需要监控的接口',
  },
  {
    title: '第四步',
    content: '下发预览',
  },
];

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
  wizardVisible,
  currentStep,
  neitem = {},
  preIssueJobInfo = {},
  selectedRows = [],
  /*
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },*/
  form,
  modalType, // create/update
  appSelect,
  ifList,
  policyAllList,
  policyExistList,
  policyList,
  changeType,
  ip,
  moIp,
  moType,
  message,
  moName,
  errorList,
  preListType,
  q,
  loadingEffect,
  secondSecAreaDisabled, //二级安全域禁用状态
  onIssueForbid,
  isMon,
}) => {

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
  } = form

  const [snmpVerStatus, setsnmpVerStatus] = useState('')

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
        wizardVisible: false,
        currentStep: 0,
        neitem: {},
        ifList: [],
        policyAllList: [],
        policyExistList: [],
        policyList: [],
        errorList: [],
        preListType: 'UNISSUED',
        loadingEffect: false,
        secondSecAreaDisabled: true,
      },
    })
  }
  //第四步，点击完成按钮   保存设备以及计算到的增量实例
  const onDone = () => {
    let preIssueJobInfo = {}
    preIssueJobInfo.ne = neitem
    preIssueJobInfo.preIntfs = selectedRows
    preIssueJobInfo.ip = neitem.discoveryIP
    preIssueJobInfo.branch = neitem.branchName
    preIssueJobInfo.intfs = ifList
    preIssueJobInfo.changeType = changeType,
      preIssueJobInfo.ip = ip
    preIssueJobInfo.moIp = moIp
    preIssueJobInfo.moType = moType
    preIssueJobInfo.message = message
    preIssueJobInfo.moName = moName
    preIssueJobInfo.previewData = policyList
    preIssueJobInfo.preIssueResult = {
      all: policyAllList,
      existing: policyExistList,
      incremental: policyList,
      problem: errorList
    }
    if (policyList.length > 0) {//如果存在增量实例
      // dispatch({//保存下发增量实例 保存设备
      //   type: 'mowizard/savePreview',
      //   payload: { preIssueJobInfo: preIssueJobInfo, mo: { intfs: ifList, ne: neitem }, q: q === undefined ? '' : q }
      // })
      // resetFields()//清除表单数据
      // cleanup()//清除当前步骤的数据
      Modal.confirm({
        title: '存在增量实例！',
        content: '请使用下发功能进行操作',
        okText: '确认',
      });
    } else {
      // tipmessage.warning('该设备未匹配到增量实例！')
      dispatch({//保存下发增量实例 保存设备
        type: 'mowizard/savePreview',
        payload: { preIssueJobInfo: preIssueJobInfo, mo: { intfs: ifList, ne: neitem }, q: q === undefined ? '' : q }
      })
      resetFields()//清除表单数据
      cleanup()//清除当前步骤的数据
    }
  }
  //第四步点击下发按钮   先保存监控对象   后下发实例
  const issue = () => {
    let preIssueJobInfo = {}
    preIssueJobInfo.ne = neitem
    preIssueJobInfo.preIntfs = selectedRows
    preIssueJobInfo.ip = neitem.discoveryIP
    preIssueJobInfo.branch = neitem.branchName
    preIssueJobInfo.intfs = ifList
    preIssueJobInfo.changeType = changeType,
      preIssueJobInfo.ip = ip
    preIssueJobInfo.moIp = moIp
    preIssueJobInfo.moType = moType
    preIssueJobInfo.message = message
    preIssueJobInfo.moName = moName
    preIssueJobInfo.previewData = policyList
    preIssueJobInfo.preIssueResult = {
      all: policyAllList,
      existing: policyExistList,
      incremental: policyList,
      problem: errorList
    }
    preIssueJobInfo.ticket = getFieldsValue(['ticket']).ticket
    if (policyList.length > 0) {//如果存在监控实例
      dispatch({//保存下发增量实例 //保存设备
        type: 'mowizard/issuePreview',
        payload: { preIssueJobInfo: preIssueJobInfo, mo: { intfs: ifList, ne: neitem }, q: q === undefined ? '' : q }
      })
      resetFields()//清除表单数据
      cleanup()//清除当前步骤的数据
    } else {
      tipmessage.warning('该设备未匹配到增量实例！')
    }
  }

  const onCancel = () => {
    tipmessage.success('Processing cancelled!', 1)
    resetFields()
    cleanup()
  }

  const next = () => {
    let fstFields = ["discoveryIP", "branchName","snmpVer","snmpv3ConfigUUID"]
    let scdFields = ["alias",
      "firstSecArea",
      "vendor",
      "snmpVer",
      "snmpCommunity",
      "appName",
      "mngInfoSrc",
      "mngtOrgCode",
      "model",
      "onlineStatus",
      "managedStatus",
      "inboundIP",
      "ipv6",
      "syslogSenderIP"]
    let readFields = ["alias",
      "appCode",
      "appName",
      "branchName",
      "capType",
      "description",
      "firstSecArea",
      "location",
      "managedStatus",
      "mngtOrgCode",
      "name",
      "onlineStatus",
      "room"]
    let checkOk = true
    if (currentStep === 0) {
      validateFields(fstFields, (errors) => {
        if (errors) {
          checkOk = false
        } else {
          dispatch({
            type: 'mowizard/setState',
            payload: {
              loadingEffect: true,
            },
          })
          neitem = getFieldsValue(fstFields)
          let querydata = {}
          querydata.ip = neitem.discoveryIP
          querydata.branch = neitem.branchName
          querydata.snmpVer = neitem.snmpVer
          querydata.dictUUID = neitem.snmpVer == 'V3' ? neitem.snmpv3ConfigUUID: null
          dispatch({
            type: 'mowizard/moDiscovery',
            payload: querydata,
          })
        }
      })
    } else if (currentStep === 1) {
      validateFields(scdFields, (errors) => {
        if (errors) {
          checkOk = false
        } else {
          let item = getFieldsValue()
          if (item.name === undefined || item.name === '') {
            item.name = `${item.appName}_${item.alias}`
          }
          item.branchNameCn = Fenhangmaps.get(item.branchName)
          item.mngtOrg = Fenhangmaps.get(item.mngtOrgCode)

          for (let field in item) {
            if (typeof (item[field]) === 'object') {
              item[field] = Date.parse(item[field])
            }
          }
          Object.assign(neitem, item)
          //console.dir(neitem)
          dispatch({
            type: 'mowizard/setState',
            payload: {
              currentStep: 2,
            },
          })

        }
      })

    } else if (currentStep === 2) {
      //console.log("currentStep === 2")
      //console.dir(neitem)
      //console.dir(ifList)
      //console.dir(selectedRows)
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
      preIssueJobInfo.ne = neitem
      preIssueJobInfo.preIntfs = selectedRows
      preIssueJobInfo.ip = neitem.discoveryIP
      preIssueJobInfo.changeType = changeType,
        preIssueJobInfo.moIp = moIp
      preIssueJobInfo.moType = moType
      preIssueJobInfo.message = message
      preIssueJobInfo.branch = neitem.branchName
      preIssueJobInfo.intfs = ifList
      dispatch({
        type: 'mowizard/queryPreview',
        payload: {
          preIssueJobInfo: preIssueJobInfo,
        },
      })
    }
  }

  const prev = () => {
    let current = currentStep - 1;
    if (('update' === modalType) && (current === 0)) { }
    else {
      dispatch({
        type: 'mowizard/setState',
        payload: {
          currentStep: current,
        },
      })
    }
  }

  const modalOpts = {
    title: 'MO向导',
    visible: wizardVisible,
    //onOk,
    //onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    closable: false,
  }

  const user = JSON.parse(sessionStorage.getItem('user'))
  if (modalType === 'create' && neitem.branchName === undefined) {
    neitem.branchName = user.branch
  }

  let onPower = user.roles
  let disPower = true
  for (let a = 0; a < onPower.length; a++) {
    if (onPower[a].name == '超级管理员') {
      disPower = false
    }
  }

  const onBranchNameChange = (value) => {
    //如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
    if ((value === 'ZH' && neitem.branchName !== 'ZH') || (value !== 'ZH' && neitem.branchName === 'ZH') || (value !== 'QH' && neitem.branchName === 'QH') || (value === 'QH' && neitem.branchName !== 'QH')) {
      delete neitem.firstSecArea
      delete neitem.secondSecArea
      resetFields(['firstSecArea', 'secondSecArea'])
    }
    neitem.branchName = value
    dispatch({
      type: 'mowizard/setState',				//@@@
      payload: {
        neitem: neitem,
      },
    })
  }

  const onChangeMngInfoSrc = (value) => {
    //如果mo发现方式属于非手工的，当用户切换到手工乱输入发现字段不保存，又切回自动，要恢复发现字段原始值
    if (_mngInfoSrc !== '手工' && modalType === 'update' && value === '自动') {
      resetFields(['hostname', 'location', 'objectID'])
    }

    neitem.mngInfoSrc = value
    dispatch({
      type: 'mowizard/setState',				//@@@
      payload: {
        neitem: neitem,
      },
    })
  }

  const onMngtOrg = (value, record) => {
    neitem.mngtOrg = record.props.name
    neitem.mngtOrgCode = value
    dispatch({
      type: 'mowizard/setState',				//@@@
      payload: {
        neitem: neitem,
      },
    })
  }

  const onselectSnmpVer = (v) => setsnmpVerStatus(v)

  const firstForm = () => {
    return (
      <div>

        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="设备IP" key="discoveryIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discoveryIP', {
              initialValue: neitem.discoveryIP,
              rules: [
                {
                  required: true,
                },
                {
                  validator: validateIP,
                },
              ],
            })(<Input disabled={isMon} />)}
          </FormItem>
        </span>

        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchName', {
              initialValue: neitem.branchName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select onSelect={onBranchNameChange} disabled={disPower || isMon} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="SNMP版本" key="snmpVer" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpVer', {
              initialValue: neitem.snmpVer ? neitem.snmpVer : 'V2C',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select onSelect={onselectSnmpVer}>{genDictOptsByName('snmpVer')}</Select>)}
          </FormItem>
        </span>
        {
          snmpVerStatus == 'V3' ?
            <Fragment>
              <span style={{ width: '80%', float: 'left' }}>
                <FormItem label="v3配置" key="snmpv3ConfigUUID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('snmpv3ConfigUUID', {
                    initialValue: neitem.snmpv3ConfigUUID,
                    rules: [],
                  })(<Select>{snmpVerOpt}</Select>)}
                </FormItem>
              </span>
            </Fragment>
            :
            null
        }
      </div>
    )
  }

  // 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖

  if (appSelect.currentItem.affectSystem !== undefined) {
    neitem.appName = appSelect.currentItem.affectSystem
    neitem.uniqueCode = appSelect.currentItem.c1
    neitem.appCode = appSelect.currentItem.englishCode
  }

  const appSelectProps = Object.assign({}, appSelect, {
    placeholders: '请输入应用信息查询',
    name: '应用分类名称',
    modeType: false,
    required: true,
    dispatch,
    form,
    disabled: false,
    compName: 'appName',
    formItemLayout,
    currentItem: { affectSystem: neitem.appName },
  })
  const onChangeFirstSecArea = (value) => {
    //如果是分行生产区和分行办公区，二级安全域的options要变
    let flag = false
    if ((value == '分行生产区' || value == '分行办公区'|| value == '二级分行'|| value == '社区银行' || value == '支行') && neitem.secondClass == 'SWITCH' ) {
      flag = true
    }
    if (flag === true) {
      secondSecAreaDisabled = false
    } else {
      secondSecAreaDisabled = true
      neitem.secondSecArea = ''
      resetFields(['secondSecArea'])
    }
    dispatch({
      type: 'mowizard/setState',
      payload: {
        secondSecAreaDisabled,
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

  const branchOption = []
  getSourceByKey('branch').map(item => {
    if (item.key != 'FH' && item.key != 'QH') {
      branchOption.push(<Option key={item.value} value={item.value}>{item.name}</Option>)
    }
    return branchOption
  })
  const snmpVerOpt = getSourceByKey('snmpv3_protocols').map(e => <Option key={e.uuid} value={e.uuid} disabled={e.status}>{e.name}</Option>)

  const secondForm = () => {
    return (
      <div>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: neitem.name,
              rules: [],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alias', {
              initialValue: neitem.alias,
              rules: [
                {
                  required: true, message: '别名不能为空',
                },
              ],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('firstSecArea', {
              initialValue: neitem.firstSecArea,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select showSearch onSelect={onChangeFirstSecArea}>{neitem.branchName === undefined || neitem.branchName === 'QH' ? firstSecAreaAll : (neitem.branchName === 'ZH' ? genDictOptsByName('firstSecAreaZH') : genDictOptsByName('firstSecAreaFH'))}
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('secondSecArea', {
              initialValue: neitem.secondSecArea,
              rules: [
                {
                  required: !secondSecAreaDisabled,
                },
              ],
            })(<Select disabled={secondSecAreaDisabled}>{secondSecAreaDisabled ? null : genDictOptsByName('secondSecArea')}</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
              initialValue: neitem.vendor,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled>{genDictOptsByName('networkVendor')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP版本" key="snmpVer" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpVer', {
              initialValue: neitem.snmpVer ? neitem.snmpVer : 'V2C',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled>{genDictOptsByName('snmpVer')}</Select>)}
          </FormItem>
        </span>
        {
          neitem.snmpVer == 'V3' ?
            <Fragment>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="v3配置" key="snmpv3ConfigUUID" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('snmpv3ConfigUUID', {
                    initialValue: neitem.snmpv3ConfigUUID,
                    rules: [],
                  })(<Select>{snmpVerOpt}</Select>)}
                </FormItem>
              </span>
            </Fragment>
            :
            <Fragment>
              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="SNMP团体串" key="snmpCommunity" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('snmpCommunity', {
                    initialValue: neitem.snmpCommunity,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </span>

              <span style={{ width: '50%', float: 'left' }}>
                <FormItem label="SNMP写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('snmpWriteCommunity', {
                    initialValue: neitem.snmpWriteCommunity,
                    rules: [],
                  })(<Input />)}
                </FormItem>
              </span>
            </Fragment>
        }
        <span style={{ width: '50%', float: 'left' }}>
          <AppSelect {...appSelectProps} />
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('appCode', {
              initialValue: neitem.appCode,
            })(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('capType', {
              initialValue: neitem.capType,
              rules: [
                { whitespace: true, message: '您输入了纯空格' },
              ],
            })(<Input disabled />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
            {getFieldDecorator('netDomain', {
              initialValue: neitem.netDomain ? neitem.netDomain : genOptions(),
              rules: [
                {
                  required: true,
                },
              ]
            })(<Select showSearch>{genDictOptsByName('netdomin')}</Select>
            )}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngInfoSrc', {
              initialValue: neitem.mngInfoSrc ? neitem.mngInfoSrc : '自动',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled onSelect={onChangeMngInfoSrc} >
              {genDictOptsByName('mngInfoSrc')}
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
            {getFieldDecorator('hostname', {
              initialValue: neitem.hostname === null ? '' : neitem.hostname,
              rules: [],
            })(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="区域" key="location" hasFeedback {...formItemLayout}>
            {getFieldDecorator('location', {
              initialValue: neitem.location === null ? '' : neitem.location,
              rules: [],
            })(<Input disabled={neitem.mngInfoSrc === '自动'} />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="ObjectID" key="objectID" hasFeedback {...formItemLayout}>
            {getFieldDecorator('objectID', {
              initialValue: neitem.objectID === null ? '' : neitem.objectID,
              rules: [],
            })(<Input disabled />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: neitem.description,
              rules: [],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mngtOrgCode', {
              initialValue: neitem.mngtOrgCode,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{branchOption}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="型号" key="model" hasFeedback {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: neitem.model,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled showSearch>{genDictOptsByName('deviceModel')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('onlineStatus', {
              initialValue: neitem.onlineStatus ? neitem.onlineStatus : '在线',

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
              initialValue: neitem.managedStatus ? neitem.managedStatus : '纳管',

              rules: [
                {
                  required: true,
                },
              ],
            })(<Select disabled={true}>{genDictOptsByName('managedStatus')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
            {getFieldDecorator('room', {
              initialValue: neitem.room,
              rules: [{ required: true, }],
            })(<Select>{genDictOptsByName('room')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('srcType', {
              initialValue: neitem.srcType,
              rules: [],
            })(<Select disabled>{genDictOptsByName('SrcType')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="负载区分" key="extInt1" hasFeedback {...formItemLayout}>
            {getFieldDecorator('extInt1', {
              initialValue: neitem.extInt1 ? neitem.extInt1 : '0',
              rules: [],
            })(<Select>
              <Option value="0">0</Option>
              <Option value="1">1</Option>
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="系统版本" key="softwareVersion" hasFeedback {...formItemLayout}>
            {getFieldDecorator('softwareVersion', {
              initialValue: neitem.softwareVersion,
              rules: [],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现状态" key="syncStatus" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncStatus', {
              initialValue: neitem.syncStatus ? neitem.syncStatus : '未同步',
              rules: [],
            })(<Select disabled>{genDictOptsByName('SyncStatus')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="发现时间" key="syncTime" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syncTime', {
              initialValue: neitem.syncTime ? moment(neitem.syncTime) : null,
              rules: [],
            })(<DatePicker
              showTime
              style={{ width: '100%' }}
              disabled
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select Time"
            />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="带内IP" key="inboundIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('inboundIP', {
              initialValue: neitem.inboundIP ? neitem.inboundIP : null,
              rules: [
                {
                  validator: validateIP,
                },
              ],
            })(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="IPV6" key="ipv6" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ipv6', {
              initialValue: neitem.ipv6 ? neitem.ipv6 : null,
              rules: [
                {
                  validator: validateIP,
                },
              ],
            })(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="syslog发送IP" key="syslogSenderIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('syslogSenderIP', {
              initialValue: neitem.syslogSenderIP ? neitem.syslogSenderIP : null,
              rules: [
                {
                  validator: validateIP,
                },
              ],
            })(<Input />)}
          </FormItem>
        </span>

      </div>
    )
  }

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    //loading: loading.effects['mowizard/queryInterface'],
    dataSource: ifList,
    selectedRows: selectedRows,
  }

  const thirdForm = () => {
    return (
      <div>
        <IFList {...listProps} />
      </div>
    )
  }

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
  const fourthForm = () => {
    return (
      <div>
        <Row gutter={24}>
          <Col className="content-inner3">
          <FormItem label="工单号" key="ticket" hasFeedback {...formItemLayout}>
              {getFieldDecorator('ticket', {
                initialValue: '',
                rules: [],
              })(<Input />)}
            </FormItem>
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
  //<Steps id="steps" current={currentStep} size="small" >
  //{steps[currentStep].content}
  //<Alert message={steps[currentStep].content} type='info' showIcon /><br />
  //<Row gutter={4} style={{ backgroundColor: '#eef2f9', padding: 8 }}>
  let hideStyle = { display: "none", }
  let showStyle = { display: "block", }
  return (
    <Modal {...modalOpts} width={'80%'} footer={null} >
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
            <div className="steps-content"><Alert message={steps[currentStep].content} type='info' showIcon /><br /></div>
            <Form layout="horizontal" >
              <div className="steps-content" style={currentStep !== 0 ? hideStyle : showStyle}>{firstForm()}</div>
              <div className="steps-content" style={currentStep !== 1 ? hideStyle : showStyle}>{secondForm()}</div>
              <div className="steps-content" style={currentStep !== 2 ? hideStyle : showStyle}>{thirdForm()}</div>
              <div className="steps-content" style={currentStep !== 3 ? hideStyle : showStyle}>{fourthForm()}</div>
            </Form>
          </Row>
          <Row gutter={4} style={{ marginTop: 8, marginBottom: 10 }}>
            {currentStep === steps.length - 1 && (
              <span>
                {/* <Button type="primary" style={{ float: 'left', marginLeft: 12 }} onClick={issue} disabled={onIssueForbid}><Icon type="deployment-unit" />
                  下  发
                </Button> */}
                <Button style={{ float: 'left', marginLeft: 12 }} onClick={onDone}><Icon type="check-circle-o" />
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
                    <Button type="primary" onClick={issue} disabled={onIssueForbid}><Icon type="deployment-unit" />
                      下  发
                    </Button>
                    {/*  <Button type="primary" onClick={onDone}><Icon type="check-circle-o" />
                      保  存
                    </Button> */}&nbsp;
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
  //neitem: PropTypes.object,

  //  onCancel: PropTypes.func,
  //  onOk: PropTypes.func,
}


export default Form.create()(modal)
