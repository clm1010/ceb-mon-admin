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
import AppSelect from '../../../../../components/appSelectComp'
import NestedTable from './dbinfosTabs'
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
  dbWizardVisible,
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
      type: 'dbwizard/setState',
      payload: {
        dbWizardVisible: false,
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
    let opType = modalType + 'Db'
    dispatch({
      type: `dbwizard/${opType}`,
      payload: { currentItem: dbItem, q: q === undefined ? '' : q, policyList: policyList, types: 'save' }
    })
    resetFields()
    cleanup()
  }
  const issue = () => {
    let opType = modalType + 'Db'
    if (policyList.length > 0) {
      dispatch({
        type: `dbwizard/${opType}`,
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
    let fstFields = ["discoveryIP", "port", "username", "password", "typ", "instance", "branchName"]
    let scdFields = [
      "name",
      "alias",
      "appName",
      "appCode",
      "hostname",
      "discoveryIP",
      "keyword",
      "typ",
      "snmpVer",
      "version",
      "instance",
      "port",
      "username",
      "password",
      "branchName",
      "mngInfoSrc",
      "description",
      "mngtOrgCode",
      "onlineStatus",
      "managedStatus",
      "snmpCommunity",
      "snmpWriteCommunity",
      "syncStatus",
      "syncTime",
      "location",
      "room",
      "path",
    ]
    if (currentStep === 0) {
      validateFields(fstFields, (errors) => {
        if (errors) {
          checkOk = false
        } else {
          if ('update' !== modalType) {
            dispatch({
              type: 'dbwizard/setState',
              payload: {
                loadingEffect: true,
              },
            })
            dispatch({
              type: 'dbwizard/appcategories',
              payload: {
                loadingEffect: true,
              },
            })
            dbItem = getFieldsValue(fstFields)
            dispatch({
              type: 'dbwizard/dbDiscovery',
              payload: ({
                ip: dbItem.discoveryIP,
                port: dbItem.port,
                username: dbItem.username,
                password: dbItem.password,
                tpe: dbItem.typ,//数据库类型
                instance: dbItem.instance,
                branch: dbItem.branchName,
              }),
            })
            // resetFields()
          }
          else {
            dispatch({
              type: 'dbwizard/setState',
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
          Object.assign(dbItem, item)
          dispatch({
            type: 'dbwizard/setState',
            payload: {
              loadingEffect: true,
              dbItem: dbItem
            },
          })
          dispatch({
            type: 'dbwizard/queryDbPreview',
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
        type: 'dbwizard/setState',
        payload: {
          currentStep: current,
          dbItem: dbItem,
        },
      })
    }
    else {
      dispatch({
        type: 'dbwizard/setState',
        payload: {
          currentStep: current,
          dbItem: dbItem,
        },
      })
    }
  }
  const modalOpts = {
    title: '数据库向导',
    visible: dbWizardVisible,
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
          <FormItem label="端口" key="port" hasFeedback {...formItemLayout}>
            {getFieldDecorator('port', {
              initialValue: dbItem.port,
              rules: [
                {
                  required: true,
                },
                {
                  validator: blurFunctions,
                },
              ],
            })(<InputNumber min={1} style={{ width: '100%' }} />)}
          </FormItem>
        </span>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="用户名" key="username" hasFeedback {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: dbItem.username,
              rules: [{ required: true, },],
            })(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="密码" key="password" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: dbItem.password,
              rules: [{ required: true, },],
            })(<Input.Password />)}
          </FormItem>
        </span>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="数据库类型" key="typ" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typ', {
              initialValue: dbItem.typ,
              rules: [
                {
                  required: true,
                },],
            })(<Select>
              <Select.Option value="ORACLE">ORACLE</Select.Option>
              <Select.Option value="MYSQL">MYSQL</Select.Option>
            </Select>)}
          </FormItem>
        </span>
        <span style={{ width: '80%', float: 'left' }}>
          <FormItem label="数据库实例名" key="instance" hasFeedback {...formItemLayout}>
            {getFieldDecorator('instance', {
              initialValue: dbItem.instance,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
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
    dbItem.mngtOrg = record.props.children
    dbItem.mngtOrgCode = value
    dispatch({
      type: 'dbwizard/setState',				//@@@
      payload: {
        dbItem: dbItem,
      },
    })
  }
  const listDbProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dbinfos: dbItem.infos,
    panes: dbItem.panes,
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
            <FormItem label="应用编码" key="appCode" hasFeedback {...formItemLayout}>
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
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="版本" key="version" hasFeedback {...formItemLayout}>
              {getFieldDecorator('version', {
                initialValue: dbItem.version,
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
          </span>
          {/* <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="SNMP 版本" key="snmpVer" hasFeedback {...formItemLayout}>
              {getFieldDecorator('snmpVer', {
                initialValue: dbItem.snmpVer,
                rules: [],
              })(<Input />)}
            </FormItem>
          </span> */}
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="实例名" key="instance" hasFeedback {...formItemLayout}>
              {getFieldDecorator('instance', {
                initialValue: dbItem.instance,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="端口" key="port" hasFeedback {...formItemLayout}>
              {getFieldDecorator('port', {
                initialValue: dbItem.port,
                rules: [
                  {
                    required: true,
                  },
                  {
                    validator: blurFunctions,
                  },
                ],
              })(<InputNumber min={1} style={{ width: '100%' }} disabled={true} />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="账号" key="username" hasFeedback {...formItemLayout}>
              {getFieldDecorator('username', {
                initialValue: dbItem.username,
                rules: [{ required: true, },],
              })(<Input disabled={true} />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="密码" key="password" hasFeedback {...formItemLayout}>
              {getFieldDecorator('password', {
                initialValue: dbItem.password,
                rules: [{ required: true, },],
              })(<Input.Password disabled={true} />)}
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
            <FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
              {getFieldDecorator('mngInfoSrc', {
                initialValue: dbItem.mngInfoSrc ? dbItem.mngInfoSrc : "自动",
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select disabled={true} >{genDictOptsByName('mngInfoSrc')}</Select>)}
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
          {/* <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="SNMP 团体串" key="snmpCommunity" hasFeedback {...formItemLayout}>
              {getFieldDecorator('snmpCommunity', {
                initialValue: dbItem.snmpCommunity,
                rules: [],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="SNMP 写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
              {getFieldDecorator('snmpWriteCommunity', {
                initialValue: dbItem.snmpWriteCommunity,
                rules: [
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="同步状态" key="syncStatus" hasFeedback {...formItemLayout}>
              {getFieldDecorator('syncStatus', {
                initialValue: dbItem.syncStatus,
                rules: [
                ],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="同步时间" key="syncTime" hasFeedback {...formItemLayout}>
              {getFieldDecorator('syncTime', {
                initialValue: dbItem.syncTime,
                rules: [],
              })(<Input />)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="区域" key="location" hasFeedback {...formItemLayout}>
              {getFieldDecorator('location', {
                initialValue: dbItem.location,
                rules: [
                ],
              })(<Input />)}
            </FormItem>
          </span> */}
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
              {getFieldDecorator('room', {
                initialValue: dbItem.room,
                rules: [],
              })(<Select>{genDictOptsByName('room')}</Select>)}
            </FormItem>
          </span>
          <span style={{ width: '50%', float: 'left' }}>
            <FormItem label="日志路径" key="path" hasFeedback {...formItemLayout}>
              {getFieldDecorator('path', {
                initialValue: dbItem.path,
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
  const onBranchNameChange = (value) => {
    //如果所属分行名称从总行、分行、全行三者切换，就要清空原有的一二级安全域下拉菜单的信息
    if ((value === 'ZH' && dbItem.branchName !== 'ZH') || (value !== 'ZH' && dbItem.branchName === 'ZH') || (value !== 'QH' && dbItem.branchName === 'QH') || (value === 'QH' && dbItem.branchName !== 'QH')) {
      delete dbItem.firstSecArea
      delete dbItem.secondSecArea
      resetFields(['firstSecArea', 'secondSecArea'])
    }
    dbItem.branchName = value
    dispatch({
      type: 'database/setState',				//@@@
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
      type: 'dbwizard/setState',
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
