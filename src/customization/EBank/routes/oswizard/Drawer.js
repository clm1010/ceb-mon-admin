import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Drawer, Button, Steps, Spin, Alert, Row, Input, Select, Result, Typography, Icon, Popover, Tabs } from 'antd';
import { validateIP } from '../../../../utils/FormValTool'
import AppSelect from '../../../../components/appSelectComp'
import { onSearchInfo, genDictOptsByName } from '../../../../utils/FunctionTool'
import Fenhang from '../../../../utils/fenhang'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
const { TabPane } = Tabs
const { Paragraph, Text } = Typography

const steps = [
    {
        title: '第一步',
        content: '信息发现',
    },
    {
        title: '第二步',
        content: 'MO信息',
    },
    {
        title: '第三步',
        content: '结果',
    },
];
const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}

const formItemLayout1 = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 12,
    },
}

const drawer = ({
    dispatch,
    visible,
    loading,
    loadingState,
    currentStep,
    form,
    appSelect,
    item = {},
    appCategorlist,
    hasMOMess,
    resultState,
    resultMess
}) => {
    const [TabPaneKey, setTabPaneKey] = useState("0")
    const [appName, setappName] = useState("")
    const [HostName, setHostName] = useState("")
    const [sysType, setsysType] = useState("")

    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,
    } = form
    const user = JSON.parse(sessionStorage.getItem('user'))

    if (appSelect.currentItem.affectSystem !== undefined) {
        item.appName = appSelect.currentItem.affectSystem
        item.uniqueCode = appSelect.currentItem.c1
        item.appCode = appSelect.currentItem.englishCode
    }

    const onClose = () => {
        resetFields()
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                fh_os_DrawerVisible: false,
                currentStep: 0,
                hasMOMess: ''
            }
        })
    }

    const next = () => {
        let fstFields = ["hostIP", "branch", 'resourcePool']
        validateFields(fstFields, (errors) => {
            if (errors) {
                return
            } else {
                dispatch({
                    type: 'oswizard/updateState',
                    payload: {
                        loadingState: true
                    },
                })
                dispatch({
                    type: 'oswizard/appcategories',
                    payload: {},
                })
                let values = getFieldsValue(fstFields)
                let querydata = {}
                querydata.hostIP = values.hostIP
                querydata.branch = values.branch
                querydata.resourcePool = values.resourcePool
                dispatch({
                    type: 'oswizard/findOsMO',
                    payload: querydata,
                })
            }
        })
    }

    const prev = () => {
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                currentStep: currentStep - 1,
                hasMOMess: ''
            }
        })
    }
    let Fenhangmaps = new Map()
    Fenhang.forEach((obj, index) => {
        Fenhangmaps.set(obj.key, obj.value)
    })

    const OnMonitor = () => {
        let scdFields = ['discoveryIP', 'appName', 'secondClass', 'hostname', 'alias', 'mngtOrgCode', 'branchName']
        validateFields(scdFields, (errors) => {
            if (errors) {
                return
            } else {
                let field = getFieldsValue(["resourcePool"])
                let values = getFieldsValue()
                values.branchNameCn = Fenhangmaps.get(item.branchName)
                values.mngtOrg = Fenhangmaps.get(item.mngtOrgCode)
                for (let field in values) {
                    if (typeof (values[field]) === 'object') {
                        values[field] = Date.parse(item[field])
                    }
                }
                Object.assign(item, values)
                dispatch({
                    type: 'oswizard/wizardPreview',
                    payload: {
                        os: item,
                        resourcePool: field.resourcePool
                    }
                })
            }
        })
    }
    const appSelectProps = Object.assign({}, appSelect, {
        placeholders: '',
        name: '应用分类名称',
        modeType: 'combobox',
        required: true,
        dispatch,
        form,
        disabled: false,
        compName: 'appName',
        formItemLayout,
        currentItem: { affectSystem: item.appName },
        onChangeFun: onAppName
    })
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
    const openHideMs = () => {
        let key = TabPaneKey == "0" ? "2" : "0"
        setTabPaneKey(key)
    }
    const onSysType = (value) => {
        setsysType(value)
    }
    const onHostName = (e) => {
        setHostName(e.target.value)
    }
    function onAppName(value, opting) {
        setappName(value)
    }
    const MoName = () => {
        let rest = ""
        if (!appName == "") {
            rest += `${appName}_`
        }
        if (!sysType == "") {
            rest += `${sysType}_`
        } else {
            rest += `${item.secondClass}_`
        }
        if (!HostName == "") {
            rest += `${HostName}`
        } else {
            rest += `${item.hostname}`
        }
        return rest
    }
    const firstForm = () => {
        const content = (
            <div>
                <p>10.221.0.0/16</p>
                <p>10.222.0.0/16</p>
                <p>10.227.0.0/16</p>
                <p>10.254.30.32/28</p>
                <p>10.254.30.80/28</p>
            </div>
        );

        return (
            <div>
                <span style={{ width: '80%', float: 'left' }}>
                    <FormItem label="设备IP" key="hostIP" hasFeedback {...formItemLayout1}>
                        {getFieldDecorator('hostIP', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                },
                                {
                                    validator: validateIP,
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                </span>
                <span style={{ width: '80%', float: 'left' }}>
                    <FormItem label="所属行名称" key="branch" hasFeedback {...formItemLayout1}>
                        {getFieldDecorator('branch', {
                            initialValue: user.branch,
                            rules: [
                                {
                                    required: true,
                                },
                            ],
                        })(<Select filterOption={onSearchInfo} showSearch >{genDictOptsByName('branch')}</Select>)}
                    </FormItem>
                </span>
                <span style={{ width: '80%', float: 'left' }}>
                    <Popover content={content} title="以下网段属于一级资源池,其他属于二级资源池">
                        <FormItem label="资源池" key="resourcePool" hasFeedback {...formItemLayout1}>
                            {getFieldDecorator('resourcePool', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(
                                <Select>
                                    <Option value={1}>一级资源池</Option>
                                    <Option value={2}>二级资源池</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Popover>
                </span>
            </div>
        )
    }
    const secondForm = () => {
        return (
            <>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab={<span><Icon type="border-outer" />基本信息(必填)</span>} key="1-1">
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="管理IP" key="discoveryIP" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('discoveryIP', {
                                    initialValue: item.discoveryIP,
                                    rules: [
                                        {
                                            required: true,
                                        }
                                    ],
                                })(<Input  />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <AppSelect {...appSelectProps} />
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="系统类型" key="secondClass " hasFeedback {...formItemLayout}>
                                {getFieldDecorator('secondClass', {
                                    initialValue: item.secondClass,
                                    rules: [
                                        { required: true, message: '系统类型不能为空' },
                                    ],
                                })(<Select onSelect={onSysType} >{genDictOptsByName('osType')}</Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="主机名" key="hostname" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('hostname', {
                                    initialValue: item.hostname,
                                    rules: [
                                        { required: true, whitespace: true, message: '您输入了纯空格' },
                                    ],
                                })(<Input onChange={onHostName} />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="名称" key="name" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('name', {
                                    initialValue: MoName() !=='' ? MoName() : item.name,
                                    rules: [
                                        { required: true, message: '名称不能为空' }
                                    ],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="设备管理机构" key="mngtOrgCode" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('mngtOrgCode', {
                                    initialValue: item.mngtOrgCode ? item.mngtOrgCode : item.branchName,
                                    rules: [
                                        {
                                            required: true, message: '管理机构不能为空',
                                        },
                                    ],
                                })(<Select filterOption={onSearchInfo} showSearch>{genDictOptsByName('branch')}</Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label='设备所属机构' key="branchName" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('branchName', {
                                    initialValue: item.branchName,
                                    rules: [
                                        {
                                            required: true, message: '所属机构不能为空',
                                        },
                                    ],
                                })(<Select >{genDictOptsByName('branch')}</Select>)}
                            </FormItem>
                        </span>
                    </TabPane>
                </Tabs>
                <Tabs activeKey={TabPaneKey} onTabClick={openHideMs}>
                    <TabPane tab={<span><Icon type="border-inner" />扩展信息(选填)</span>} key="2" >
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="关键字" key="keyword" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('keyword', {
                                    initialValue: item.keyword,
                                })(<Input disabled />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="应用分类编码" key="appCode" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('appCode', {
                                    initialValue: item.appCode,
                                })(<Input disabled />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="描述" key="description" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('description', {
                                    initialValue: item.description,
                                    rules: [
                                        { whitespace: true, message: '您输入了纯空格' },
                                    ],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="別名" key="alias" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('alias', {
                                    initialValue: item.alias,
                                    rules: [
                                    ],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="纳管状态" key="managedStatus" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('managedStatus', {
                                    initialValue: item.managedStatus,
                                })(<Select >{genDictOptsByName('managedStatus')}</Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="在线状态" key="onlineStatus" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('onlineStatus', {
                                    initialValue: item.onlineStatus,
                                    rules: [
                                        {},
                                    ],
                                })(<Select>{genDictOptsByName('onlineStatus')}</Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="发现方式" key="mngInfoSrc" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('mngInfoSrc', {
                                    initialValue: item.mngInfoSrc ? item.mngInfoSrc : '手工',
                                    rules: [
                                    ],
                                })(<Select >
                                    {genDictOptsByName('mngInfoSrc')}
                                </Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="网络域" key="netDomain" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('netDomain', {
                                    initialValue: item.netDomain,
                                })(<Select >
                                    {genOptions(appCategorlist)}
                                </Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="机房" key="room" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('room', {
                                    initialValue: item.room,
                                })(<Select>{genDictOptsByName('room')}</Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="srcType" key="srcType" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('srcType', {
                                    initialValue: item.srcType,
                                    rules: [
                                        { whitespace: true, message: '您输入了纯空格' },
                                    ],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="用途" key="usage" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('usage', {
                                    initialValue: item.usage,
                                })(<Select>
                                    {genDictOptsByName('usage')}
                                </Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="软件版本" key="SV" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('softwareVersion', {
                                    initialValue: item.softwareVersion,
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="所有IP" key="allIps" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('allIps', {
                                    initialValue: item.allIps,
                                    rules: [
                                        {
                                            validator: validateIP,
                                        },
                                    ]
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="虚拟IP" key="virtualIP" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('virtualIp', {
                                    initialValue: item.virtualIp,
                                    rules: [
                                        { whitespace: true, message: '您输入了纯空格' },
                                        {
                                            validator: validateIP,
                                        },],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="映射IP" key="mappingIP" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('mappingIP', {
                                    initialValue: item.mappingIP,
                                    rules: [
                                        { whitespace: true, message: '您输入了纯空格' },
                                        {
                                            validator: validateIP,
                                        },],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="应用模式" key="AppMode" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('appMode', {
                                    initialValue: item.appMode || [],
                                })(<Select mode="multiple">
                                    {genDictOptsByName('appMode')}
                                </Select>)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="容灾模式" key="disasterType" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('disasterType', {
                                    initialValue: item.disasterType,
                                    rules: [
                                        { whitespace: true, message: '您输入了纯空格' },
                                    ],
                                })(<Input />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="应用容量特征" key="capType" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('capType', {
                                    initialValue: item.capType,
                                    rules: [
                                        { whitespace: true, message: '您输入了纯空格' },
                                    ],
                                })(<Input disabled />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="模式组子类" key="appRoleGroup" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('appRoleGroup', {
                                    initialValue: item.appRoleGroup,
                                })(<Input disabled />)}
                            </FormItem>
                        </span>
                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="Oracle" key="oracleInstalled" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('oracleInstalled', {
                                    initialValue: item.oracleInstalled,
                                })(<Select >
                                    {genDictOptsByName('InstalledType')}
                                </Select>)}
                            </FormItem>
                        </span>

                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="Weblogic" key="weblogicInstalled" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('weblogicInstalled', {
                                    initialValue: item.weblogicInstalled,
                                })(<Select >
                                    {genDictOptsByName('InstalledType')}
                                </Select>)}
                            </FormItem>
                        </span>

                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="ASM" key="ASMInstalled" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('asminstalled', {
                                    initialValue: item.asminstalled,
                                })(<Select >
                                    {genDictOptsByName('InstalledType')}
                                </Select>)}
                            </FormItem>
                        </span>

                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="Tuxedo" key="tuxedoInstalled" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('tuxedoInstalled', {
                                    initialValue: item.tuxedoInstalled,
                                })(<Select >
                                    {genDictOptsByName('InstalledType')}
                                </Select>)}
                            </FormItem>
                        </span>

                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="VCS" key="VCSInstalled" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('vcsinstalled', {
                                    initialValue: item.vcsinstalled,
                                })(<Select >
                                    {genDictOptsByName('InstalledType')}
                                </Select>)}
                            </FormItem>
                        </span>

                        <span style={{ width: '25%', float: 'left' }}>
                            <FormItem label="联系人" key="contact" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('contact', {
                                    initialValue: item.contact,
                                    rules: [],
                                })(<Input />)}
                            </FormItem>
                        </span>
                    </TabPane>
                </Tabs>
            </>
        )
    }
    const thirdForm = () => {
        let rest
        if (resultState == 'success') {
            rest = (<Result
                status="success"
                title="上监控成功"
                subTitle={`${resultMess},流程结束`}
            />)
        } else if (resultState == 'failed') {
            rest = (<Result
                status="error"
                title="上监控失败"
                subTitle="请检查或修改mo信息,或者联系管理,重新提交"
            >
                <div className="desc">
                    <Paragraph>
                        <Text
                            strong
                            style={{
                                fontSize: 16,
                            }}
                        >
                            您提交的内容有一下问题：
                        </Text>
                    </Paragraph>
                    <Paragraph>
                        <Icon style={{ color: 'red' }} type="close-circle" /> {resultMess}
                    </Paragraph>

                </div>
            </Result>)
        }
        return rest
    }

    const drawerOpts = {
        title: "OS向导",
        placement: "right",
        closable: false,
        visible,
        onClose,
        width: '75%'
    }
    let hideStyle = { display: "none", }
    let showStyle = { display: "block", }

    return (
        <Drawer {...drawerOpts}>
            <Spin spinning={loadingState === undefined ? false : loadingState}>
                <Steps current={currentStep} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <br />
                <Row gutter={4} style={{ backgroundColor: '#fff', padding: 8 }}>
                    <div className="steps-content"><Alert message={steps[currentStep] ? `${steps[currentStep].content} ${hasMOMess}` : null} type='info' showIcon /><br /></div>
                    <Form layout="horizontal" >
                        <div className="steps-content" style={currentStep !== 0 ? hideStyle : showStyle}>{firstForm()}</div>
                        <div className="steps-content" style={currentStep !== 1 ? hideStyle : showStyle}>{secondForm()}</div>
                        <div className="steps-content" style={currentStep !== 2 ? hideStyle : showStyle}>{thirdForm()}</div>
                    </Form>
                </Row>
                <Row gutter={4} style={{ marginTop: 8, marginBottom: 10, textAlign: 'center' }}>
                    {currentStep == 0 && (
                        <Button type="primary" onClick={next}>
                            下一步
                        </Button>
                    )}
                    {currentStep === 1 && (
                        <span>
                            <Button onClick={prev}>
                                上一步
                            </Button>
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={OnMonitor}>
                                下一步
                            </Button>
                        </span>
                    )}
                    {currentStep === 2 && (
                        <Button type="primary" onClick={onClose}>
                            完成
                        </Button>
                    )}
                </Row>
            </Spin>
        </Drawer>
    )
}

drawer.propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    type: PropTypes.string,
    item: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
}

export default Form.create()(drawer)