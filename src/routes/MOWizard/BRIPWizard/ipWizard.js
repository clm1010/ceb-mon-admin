import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Tabs, Modal, Alert, Row, Col, Steps, Icon, Button, message, DatePicker, Spin } from 'antd'
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
    content: '编辑信息',
  },
  {
    title: '第二步',
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
  dataList,
  neitem = {},
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
  errorList,
  preListType,
  q,
  loadingEffect,
  secondSecAreaDisabled //二级安全域禁用状态
}) => {

  const {
    getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
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
    // clear fields and list
    dispatch({
      type: 'mowizard/setState',
      payload: {
        bripWizardVisible: false,
        bripCurrentStep: 0,
        bripItem: {},
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
    dataList.previewData = dataList.preIssueResult.incremental
    dispatch({
      type: `mowizard/saveBrIP`,				//@@@
      payload: {
        currentItem: neitem,
        actionType: modalType,
        policyList: policyList,
        dataList: dataList,
        q: q === undefined ? '' : q
      },
    })

    resetFields()//清除表单数据
    cleanup()//清除当前步骤的数据
  }
  //第四步点击下发按钮   先保存监控对象   后下发实例
  const issue = () => {
    dataList.previewData = dataList.preIssueResult.incremental
    dispatch({
      type: `mowizard/issueBrIP`,				//@@@
      payload: {
        currentItem: neitem,
        actionType: modalType,
        policyList: policyList,
        dataList: dataList,
        q: q === undefined ? '' : q
      },
    })
    resetFields()//清除表单数据
    cleanup()//清除当前步骤的数据
  }

  const onCancel = () => {
    //message.success('Processing cancelled!',1)
    resetFields()
    cleanup()
  }

  const next = () => {
    let scdFields = ["alias",
      "discoveryIP",
      "ipType",
      "branchType",
      "branchName",
      "appName",
      "firstSecArea",
      "mngtOrgCode",
      "onlineStatus",
      "managedStatus"]
    if (currentStep === 0) {
      //let checkOK = true
      validateFields(scdFields, (errors) => {
        if (errors) {
          //checkOk = false
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
          //console.log("step1")
          //console.dir(neitem)
          dispatch({
            type: 'mowizard/setState',
            payload: {
              loadingEffect: true,
            },
          })
          dispatch({
            type: 'mowizard/queryBrIPPreview',
            payload: {
              currentItem: neitem,
            },
          })

        }
      })

    }
  }

  const prev = () => {
    let current = currentStep - 1;
    dispatch({
      type: 'mowizard/setState',
      payload: {
        bripCurrentStep: current,
      },
    })
  }

  const modalOpts = {
    title: '网点IP向导',
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

  // 初次打开MO弹出窗口,不修改应用文本框值。如果选择应用文本框值，才覆盖

  if (appSelect.currentItem.affectSystem !== undefined) {
    neitem.appName = appSelect.currentItem.affectSystem
    neitem.uniqueCode = appSelect.currentItem.c1
    neitem.appCode = appSelect.currentItem.englishCode
  }

  const appSelectProps = Object.assign({}, appSelect, {
    placeholders: '请输入应用信息查询',
    name: '应用分类名称',
    modeType: 'combobox',
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
    if ((value == '分行生产区' || value == '分行办公区') && neitem.secondClass == 'SWITCH') {
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

  const filterFirstSecAreaFH = () => {
    let SelectOption = genDictOptsByName('firstSecAreaFH')
    let Options = SelectOption.filter(c => c.key == '自助银行' || c.key == '社区银行' || c.key == '支行' || c.key == '分行无线移动通讯专网接入区')
    return Options
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
          <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
            {getFieldDecorator('hostname', {
              initialValue: neitem.hostname,
              rules: [
              ],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="IP" key="discoveryIP" hasFeedback {...formItemLayout}>
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
            })(<Input disabled={modalType == 'update' ? true : false} />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="IP地址类型" key="ipType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('ipType', {
              initialValue: neitem.ipType,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select>
              <Option value="虚网关IP">虚网关IP</Option >
              <Option value="loopbackIP">loopbackIP</Option >
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="网点类型" key="branchType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchType', {
              initialValue: neitem.branchType,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select>
              <Option value="支行">支行</Option>
              <Option value="自助银行">自助银行</Option>
              <Option value="社区银行">社区银行</Option>
              <Option value="柜台">柜台</Option>
              <Option value="普通机构">普通机构</Option>
              <Option value="二级分行">二级分行</Option>
            </Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="所属行名称" key="branchName" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branchName', {
              initialValue: neitem.branchName,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select onSelect={onBranchNameChange} disabled={user.branch !== undefined} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>

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
          <FormItem label="一级安全域" key="firstSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('firstSecArea', {
              initialValue: neitem.firstSecArea,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select showSearch>{neitem.branchName === 'QH' || neitem.branchName === 'ZH' ? '' : filterFirstSecAreaFH()}</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="二级安全域" key="secondSecArea" hasFeedback {...formItemLayout}>
            {getFieldDecorator('secondSecArea', {
              initialValue: neitem.secondSecArea,
              rules: [
                {},
              ],
            })(<Select disabled={true}>{genDictOptsByName('secondSecArea')}</Select>)}
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
            })(<Input disabled />
            )}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: neitem.description,
              rules: [
              ],
            })(<Input />)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="主备模式" key="haMode" hasFeedback {...formItemLayout}>
            {getFieldDecorator('haMode', {
              initialValue: neitem.haMode,
              rules: [],
            })(<Select>{genDictOptsByName('haRole')}</Select>)}
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
            })(<Select onSelect={onMngtOrg} filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="型号" key="model" hasFeedback {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: neitem.model,
              rules: [
              ],
            })(<Input />)}
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
              rules: [],
            })(<Select>{genDictOptsByName('room')}</Select>)}
          </FormItem>
        </span>
        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="厂商" key="vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendor', {
              initialValue: neitem.vendor,
              rules: [],
            })(<Select>{genDictOptsByName('networkVendor')}</Select>)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="SNMP写团体串" key="snmpWriteCommunity" hasFeedback {...formItemLayout}>
            {getFieldDecorator('snmpWriteCommunity', {
              initialValue: neitem.snmpWriteCommunity,
              rules: [
              ],
            })(<Input />)}
          </FormItem>
        </span>

        <span style={{ width: '50%', float: 'left' }}>
          <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
            {getFieldDecorator('srcType', {
              initialValue: neitem.srcType,
              rules: [
              ],
            })(<Input />)}
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
              <div className="steps-content" style={currentStep !== 0 ? hideStyle : showStyle}>{secondForm()}</div>
              <div className="steps-content" style={currentStep !== 1 ? hideStyle : showStyle}>{fourthForm()}</div>
            </Form>
          </Row>
          <Row gutter={4} style={{ marginTop: 8, marginBottom: 10 }}>
            {currentStep === steps.length - 1 && (
              // <Button type="primary" style={{ float: 'left', marginLeft: 12 }} onClick={issue}><Icon type="deployment-unit" />
              //   下  发
              // </Button>
              <Button type="primary" style={{ float: 'left', marginLeft: 12 }}  onClick={onDone}><Icon type="check-circle-o" />
                    保  存
              </Button>
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
                  <Button type="primary" onClick={issue}><Icon type="deployment-unit" />
                    下  发
                  </Button>
/*                   <Button type="primary" onClick={onDone}><Icon type="check-circle-o" />
                    保  存
                  </Button> */
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
