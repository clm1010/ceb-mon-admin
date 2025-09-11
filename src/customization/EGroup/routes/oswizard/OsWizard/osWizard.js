import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Tabs, Modal, Alert, Row, Col, Steps, Icon, Button, message, DatePicker, Tag, Spin, InputNumber } from 'antd'
import moment from 'moment'
import '../wizard.css'
import Fenhang from '../../../../../utils/fenhang'
//import firstSecAreaAll from '../../../../../utils/selectOption/firstSecAreaAll'
import { onSearchInfo, genDictOptsByName } from '../../../../../utils/FunctionTool'
import { validateIP } from '../../../../../utils/FormValTool'
import PreList from '../previewList'
import NestedTable from './dbinfosTabs'
import AppSelect from '../../../../../components/appSelectComp'
import { ozr } from '../../../../../utils/clientSetting'

const { Step } = Steps;
//数值验证
const blurFunctions = (rulr, value, callback) => {
  let regx = /^\+?[1-9][0-9]*$/
  if (!regx.test(value)) {
    callback('Please enter a positive integer！')
  } else {
    callback()
  }
}
//控制字段显隐性
const fieldsDisplay = ozr('id') === "EGroup" ? 'none' : ''
const isBranchName = ozr('id') === "EGroup" ? '所属机构' : '所属行名称'

const steps = [
  {
    title: '第一步',
    content: '信息发现',
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
  osWizardVisible,
  currentStep,
  dbItem,
  form,
  modalType, // create/update
  appSelect,
  policyAllList,
  policyExistList,
  policyList,
  errorList,
  preListType,
  q,
  loadingEffect,
  onIssueForbid,
  twoStepData,
  dbinfos,
  appCategorlist,
}) => {

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,
  } = form

  let Fenhangmaps = new Map()
  Fenhang.forEach((obj, index) => {
    Fenhangmaps.set(obj.key, obj.value)
  })

  const cleanup = () => {
    // 清除appSelect内容
    dispatch({
      type: 'appSelect/clearState',				//@@@
    })
    dispatch({
      type: 'oswizard/setState',
      payload: {
        osWizardVisible: false,
        currentStep: 0,
        dbItem: {},
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
    let opType = modalType + 'Os'
    dispatch({
      type: `oswizard/${opType}`,
      payload: { currentItem: dbItem, q: q === undefined ? '' : q, policyList: policyList, types: 'save' }
    })
    resetFields()
    cleanup()
  }

  const issue = () => {
    let opType = modalType + 'Os'
    if (policyList.length > 0) {
      dispatch({
        type: `oswizard/${opType}`,
        payload: { currentItem: dbItem, q: q === undefined ? '' : q, policyList: policyList, types: 'issue' }
      })
      resetFields()
      cleanup()
    } else {
      message.warning('未匹配到增量实例！')
    }
  }

  const onCancel = () => {
    resetFields()
    cleanup()
  }
  const next = () => {
    let fstFields = ["discoveryIP", "branchName"]
    let scdFields = [
      "name",
      "alias",
      "appName",
      "appCode",
      "hostname",
      "discoveryIP",
      "keyword",
      // "typ",
      // "snmpVer",
      // "version",
      // "instance",
      // "port",
      // "username",
      // "password",
      "branchName",
      "description",
      "mngtOrgCode",
      "netDomain",
      "onlineStatus",
      "managedStatus",
      "room",
      "srcType",
      "usage",
      "typ",
      "softwareVersion",
      "allIps",
      "virtualIp",
      "mappingIP",
      "appMode",
      "disasterType",
      "capType",
      "smdbAgentId",
      "appRoleGroup",
      "mngInfoSrc",
      "oracleInstalled",
      "weblogicInstalled",
      "asminstalled",
      "tuxedoInstalled",
      "vcsinstalled",
      "contact",
    ]
    if (currentStep === 0) {
      validateFields(fstFields, (errors) => {
        if (errors) {
          checkOk = false
        } else {
          if ('update' !== modalType) {
            dispatch({
              type: 'oswizard/setState',
              payload: {
                loadingEffect: true,
              },
            })

            dispatch({
              type: 'oswizard/appcategories',
              payload: {
                loadingEffect: true,
                q: 'affectSystem=="网络|*"',
              },
            })
            dbItem = getFieldsValue(fstFields)
            dispatch({
              type: 'oswizard/osDiscovery',
              payload: ({
                ip: dbItem.discoveryIP,
                branch: dbItem.branchName,
              }),
            })

          }
          else {
            dispatch({
              type: 'oswizard/setState',
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
          let item = getFieldsValue(scdFields)
          let str = ''
          if (item.appMode !== undefined) {
            for (let info of item.appMode) {
              str = `${info}/${str}`
            }
          }
          
          item.appMode = str.substring(0, str.length - 1)
          Object.assign(dbItem, item)
          dispatch({
            type: 'oswizard/setState',
            payload: {
              loadingEffect: true,
              dbItem: dbItem
            },
          })
          dispatch({
            type: 'oswizard/queryOsPreview',
            payload: {
              dbItem: dbItem,
              modalType
            },
          })
          resetFields()
        }
      })
    }
  }
  const prev = () => {
    let current = currentStep - 1;
    if (('update' === modalType) && (current === 0)) { }
    else if (current === 1) {
      dispatch({
        type: 'oswizard/setState',
        payload: {
          currentStep: current,
          dbItem: dbItem,
        },
      })
    }
    else {
      dispatch({
        type: 'oswizard/setState',
        payload: {
          currentStep: current,
          dbItem: dbItem,
        },
      })
    }
  }

  const modalOpts = {
    title: '操作系统向导',
    visible: osWizardVisible,
    //onOk,
    //onCancel,
    wrapClassName: 'vertical-center-modal',
    maskClosable: false,
    closable: false,
  }

  const user = JSON.parse(sessionStorage.getItem('user'))



  const firstForm = () => {
    return (
      <div>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="设备IP" key="discoveryIP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discoveryIP', {
              initialValue: dbItem.discoveryIP,
              rules: [{ required: true, },
              { validator: validateIP, },],//检验ip格式是否正确
            })(<Input disabled={'update' === modalType} />)}
          </FormItem>
        </span>

        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchName', {
              initialValue: dbItem.branchName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select onSelect={onBranchNameChange} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>
      </div>
    )
  }

  // 2nd page
  // 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖
  if (appSelect.currentItem.affectSystem !== undefined) {
    dbItem.appName = appSelect.currentItem.affectSystem
    dbItem.uniqueCode = appSelect.currentItem.c1
    dbItem.appCode = appSelect.currentItem.englishCode
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
    currentItem: { affectSystem: dbItem.appName },
  })

  const onMngtOrg = (value, record) => {
    dbItem.mngtOrg = record.props.name
    dbItem.mngtOrgCode = value
    dispatch({
      type: 'oswizard/setState',				//@@@
      payload: {
        dbItem: dbItem,
      },
    })
  }

  const listDbProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dbinfos: dbItem.infos,
    panes: dbItem.panes,
    // good: dbinfos
  }
  const secondForm = () => {
    return (
      <div>
        <div style={{ width: '100%', float: 'left' }}>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: dbItem.name,
                rules: [{
                  required: true
                }],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
              {getFieldDecorator('alias', {
                initialValue: dbItem.alias,
                rules: [],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <AppSelect {...appSelectProps} />
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
              {getFieldDecorator('appCode', {
                initialValue: dbItem.appCode,
                rules: [
                  { required: true }
                ]
              })(<Input disabled />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
              {getFieldDecorator('hostname', {
                initialValue: dbItem.hostname,
                rules: [
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
              {getFieldDecorator('discoveryIP', {
                initialValue: dbItem.discoveryIP,
                rules: [{ required: true, },
                { validator: validateIP, },],//检验ip格式是否正确
              })(<Input disabled={true} />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="关键字" key="keyword" hasFeedback {...formItemLayout}>
              {getFieldDecorator('keyword', {
                initialValue: dbItem.keyword,
              })(<Input disabled />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label={isBranchName} key="branchName" hasFeedback {...formItemLayout}>
              {getFieldDecorator('branchName', {
                initialValue: dbItem.branchName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select onSelect={onBranchNameChange} disabled={true} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: dbItem.description,
                rules: [
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mngtOrgCode', {
                initialValue: dbItem.mngtOrgCode,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left', display: '' }}>
            <FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
              {getFieldDecorator('netDomain', {
                initialValue: dbItem.netDomain,
                rules: []
              })(<Select >
                {genOptions(appCategorlist)}
              </Select>
              )}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
              {getFieldDecorator('onlineStatus', {
                initialValue: dbItem.onlineStatus,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select>{genDictOptsByName('onlineStatus')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
              {getFieldDecorator('managedStatus', {
                initialValue: dbItem.managedStatus,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select >{genDictOptsByName('managedStatus')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
              {getFieldDecorator('room', {
                initialValue: dbItem.room,
                rules: [],
              })(<Select>{genDictOptsByName('room')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
              {getFieldDecorator('srcType', {
                initialValue: dbItem.srcType,
                rules: [
                  { whitespace: true, message: '您输入了纯空格' },
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="用途" key="usage" hasFeedback {...formItemLayout}>
              {getFieldDecorator('usage', {
                initialValue: dbItem.usage,
              })(<Select>
                {genDictOptsByName('usage')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="系统类型" key="typ " hasFeedback {...formItemLayout}>
              {getFieldDecorator('secondClass', {
                initialValue: dbItem.secondClass,
                rules: [
                  { required: true, message: '系统类型不能为空' },
                ],
              })(<Select >{genDictOptsByName('osType')}</Select>)}
            </FormItem>
          </span>
          {/* <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="数据库类型" key="typ" hasFeedback {...formItemLayout}>
              {getFieldDecorator('typ', {
                initialValue: dbItem.typ,
                rules: [
                  {
                    required: true,
                  },],
              })(<Select disabled={true} >
                <Select.Option value="ORACLE">ORACLE</Select.Option>
                <Select.Option value="REDIS">REDIS</Select.Option>
                <Select.Option value="MYSQL">MYSQL</Select.Option>
                <Select.Option value="DB2">DB2</Select.Option>
                <Select.Option value="MSSQL">MS SQL</Select.Option>
              </Select>)}
            </FormItem>
          </span> */}
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="软件版本" key="SV" hasFeedback {...formItemLayout}>
              {getFieldDecorator('softwareVersion', {
                initialValue: dbItem.softwareVersion,
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="所有IP" key="allIps" hasFeedback {...formItemLayout}>
              {getFieldDecorator('allIps', {
                initialValue: dbItem.allIps,
                rules: [
                  {
                    validator: validateIP,
                  },
                ]
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="虚拟IP" key="virtualIP" hasFeedback {...formItemLayout}>
              {getFieldDecorator('virtualIp', {
                initialValue: dbItem.virtualIp,
                rules: [
                  { whitespace: true, message: '您输入了纯空格' },
                  {
                    validator: validateIP,
                  },],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="映射IP" key="mappingIP" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mappingIP', {
                initialValue: dbItem.mappingIP,
                rules: [
                  { whitespace: true, message: '您输入了纯空格' },
                  {
                    validator: validateIP,
                  },],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="应用模式" key="AppMode" hasFeedback {...formItemLayout}>
              {getFieldDecorator('appMode', {
                initialValue: dbItem.appMode || [],
              })(<Select mode="multiple">
                {genDictOptsByName('appMode')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="容灾模式" key="disasterType" hasFeedback {...formItemLayout}>
              {getFieldDecorator('disasterType', {
                initialValue: dbItem.disasterType,
                rules: [
                  { whitespace: true, message: '您输入了纯空格' },
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
              {getFieldDecorator('capType', {
                initialValue: dbItem.capType,
                rules: [
                  { whitespace: true, message: '您输入了纯空格' },
                ],
              })(<Input disabled />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left', display: fieldsDisplay }}>
            <FormItem label="SMDBAGENTID" key="SMDBAGENTID" hasFeedback {...formItemLayout}>
              {getFieldDecorator('smdbAgentId', {
                initialValue: dbItem.smdbAgentId,
                rules: [
                  { whitespace: true, message: '您输入了纯空格' },
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="模式组子类" key="appRoleGroup" hasFeedback {...formItemLayout}>
              {getFieldDecorator('appRoleGroup', {
                initialValue: dbItem.appRoleGroup,
              })(<Input disabled />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mngInfoSrc', {
                initialValue: dbItem.mngInfoSrc ? dbItem.mngInfoSrc : "自动",
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select >{genDictOptsByName('mngInfoSrc')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="Oracle" key="oracleInstalled" hasFeedback {...formItemLayout}>
              {getFieldDecorator('oracleInstalled', {
                initialValue: dbItem.oracleInstalled,
              })(<Select >
                {genDictOptsByName('InstalledType')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="Weblogic" key="weblogicInstalled" hasFeedback {...formItemLayout}>
              {getFieldDecorator('weblogicInstalled', {
                initialValue: dbItem.weblogicInstalled,
              })(<Select >
                {genDictOptsByName('InstalledType')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="ASM" key="ASMInstalled" hasFeedback {...formItemLayout}>
              {getFieldDecorator('asminstalled', {
                initialValue: dbItem.asminstalled,
              })(<Select >
                {genDictOptsByName('InstalledType')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="Tuxedo" key="tuxedoInstalled" hasFeedback {...formItemLayout}>
              {getFieldDecorator('tuxedoInstalled', {
                initialValue: dbItem.tuxedoInstalled,
              })(<Select >
                {genDictOptsByName('InstalledType')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="VCS" key="VCSInstalled" hasFeedback {...formItemLayout}>
              {getFieldDecorator('vcsinstalled', {
                initialValue: dbItem.vcsinstalled,
              })(<Select >
                {genDictOptsByName('InstalledType')}
              </Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="联系人" key="contact" hasFeedback {...formItemLayout}>
              {getFieldDecorator('contact', {
                initialValue: dbItem.contact,
                rules: [],
              })(<Input />)}
            </FormItem>
          </span>
        </div>
        <div style={{ width: '100%', float: 'left' }}>
          <NestedTable {...listDbProps} />
        </div>
      </div>
    )
  }

  function genOptions(objArray) {
    let options = []
    let nameOption = new Set();
    objArray.forEach((option) => {
      let parm = option.affectSystem.split('|')[1]
      nameOption.add(parm)
    })
    nameOption.forEach((option) => {
      options.push(<Option key={option} value={option}>{option}</Option>)
    })
    return options
  }

  const onBranchNameChange = (value) => {
    //如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
    if ((value === 'ZH' && dbItem.branchName !== 'ZH') || (value !== 'ZH' && dbItem.branchName === 'ZH') || (value !== 'QH' && dbItem.branchName === 'QH') || (value === 'QH' && dbItem.branchName !== 'QH')) {
      delete dbItem.firstSecArea
      delete dbItem.secondSecArea
      resetFields(['firstSecArea', 'secondSecArea'])
    }
    dbItem.branchName = value
    dispatch({
      type: 'oswizard/setState',				//@@@
      payload: {
        currentItem: dbItem,
      },
    })
  }
  // 3rd form
  const tabsOpts = {
    activeKey: preListType,
  }

  const tabChange = (key) => {
    dispatch({
      type: 'oswizard/setState',
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
            <div className="steps-content"><Alert message={steps[currentStep].content} type='info' showIcon /><br /></div>
            <Form layout="horizontal" >
              <div className="steps-content" style={currentStep !== 0 ? hideStyle : showStyle}>{firstForm()}</div>
              <div className="steps-content" style={currentStep !== 1 ? hideStyle : showStyle}>{secondForm()}</div>
              <div className="steps-content" style={currentStep !== 2 ? hideStyle : showStyle}>{thirdForm()}</div>
            </Form>
          </Row>
          <Row gutter={4} style={{ marginTop: 8, marginBottom: 10 }}>
            {/* {currentStep === steps.length - 1 && (
              <span>
                <Button type="primary" style={{ float: 'left', marginLeft: 12 }} onClick={issue} disabled={onIssueForbid}><Icon type="deployment-unit" />
                  下  发
                </Button>
              </span>
            )} */}
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
                    {/* <Button type="primary" onClick={onDone}><Icon type="check-circle-o" />
                      保  存
                    </Button> */}
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
