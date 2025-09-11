import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Drawer, Button, Steps, Spin, Alert, Row, Input, Typography, Descriptions, Icon, Col, Modal, Progress } from 'antd';
import Fenhang from '../../../../../utils/fenhang'
import MyUpload from './MyUpload'
import Editable from './Editable'
import MoTable from './moTable'
import MOStateList from './monitorStateList'
import { config } from '../../../../../utils'
import '../index.css'
import './zhosDrawer.css'

import Myload from './myloading'

const { Step } = Steps
const { TextArea } = Input;
const { Text } = Typography;
const FormItem = Form.Item

const { ZabbixOSImport, registServeImport, exportExcelURL } = config.api

const steps = [
    {
        title: '第一步 : 导入MO',
        content: '请先导出模板,按模板规则进行填写,最大可导入50条数据',
    },
    {
        title: '第二步 : MO信息的添加、确认',
        content: '请核对MO信息',
    },
    {
        title: '第三步 : 监控信息',
        content: '点击“安装”进行监控添加，请耐心等待',
    },
    {
        title: '第四步 : 监控结果',
        content: '监控结果',
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

const drawer = ({
    dispatch,
    visible,
    loading,
    currentStep,
    form,
    appSelect,
    item = {},
    secondflag,
    findOSData,
    monitorList,
    monitoresult,
    addMo,
    validateMO,
    loadingOState,

    loading_step,
    loading_state,
    branchType,
}) => {

    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,
    } = form


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
                os_DrawerVisible: false,
                currentStep: 0,
                hasMOMess: '',
                monitorList: {}
            }
        })
    }

    const next = () => {
        if (currentStep == 1) {
            const validateMO = [...findOSData.exists, ...addMo]
            validateFields((errors) => {
                if (errors) {
                    return
                } else {
                    dispatch({
                        type: 'oswizard/checkexistsmonitor',
                        payload: {
                            validateMO,
                            onFun: onClose
                        }
                    })
                }
            })
        } else if (currentStep == 2) {
            if (monitorList.notExists.length === 0) {
                Modal.info({
                    title: '上监控结果',
                    content: '所有主机均已添加监控，无需再次添加，请退出',
                    okText: '完成',
                    onOk: nextFun,
                })
            } else if (monitorList.notExists.length > 0 && monitorList.exists.length > 0) {
                Modal.info({
                    title: '上监控结果',
                    content: '存在没有监控的MO,只对没有监控的MO进行监控,已经存在监控的MO,不进行任何操作.',
                    onOk: nextFun,
                })
            } else {
                nextFun()
            }
        }
    }
    const nextFun = () => {
        const mos = monitorList.notExists
        let fieldValue = getFieldsValue(['ticket'])

        dispatch({
            type: 'oswizard/updateState',
            payload: {
                loadingOState: true,
            }
        })
        if (monitorList.notExists.length === 0) {
            dispatch({
                type: 'oswizard/updateState',
                payload: {
                    zh_os_DrawerVisible: false,
                    currentStep: 0,
                    hasMOMess: ''
                }
            })
        } else {
            dispatch({
                type: 'oswizard/batch',
                payload: {
                    mos,
                    ticket: fieldValue.ticket
                }
            })
        }
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
        let scdFields = ['ticket']
        validateFields(scdFields, (errors) => {
            if (errors) {
                return false
            }
            return true
        })
    }

    const onRule = () => {
        let fieldValue = getFieldsValue(['ticket'])
        let scdFields = ['ticket']
        let validator = false
        validateFields(scdFields, (errors) => {
            if (errors) {
                return validator = true
            }
        })
        return validator
    }
    const onDownOut = () => {
        branchType == 'zh' ?
            window.open(`${exportExcelURL}/static2/excel/自服务导入模板-总行.xlsx`, '_parent')
            :
            window.open(`${exportExcelURL}/static2/excel/自服务导入模板-分行.xlsx`, '_parent')
    }

    const validaticket = (rule, value, callback) => {
        let reg = /^(CHG|CHD)-[0-9]{8}-[0-9]{5}$/
        let reg1 = /^RQ[0-9]{16}$/
        let reg2 = /^BCHG-[0-9]{8}-[0-9]{5}$/

        if (value === undefined || value == '') {
            callback()
        } else if (!(reg1.test(value) || reg.test(value) || reg2.test(value))) {
            callback('请正确填写工单号！')
        } else {
            callback()
        }
    }

    const firstForm = () => {
        const uploadprops = {
            dispatch,
            pathType: 'oswizard/updateState',
            url: ZabbixOSImport,
            currentStep,
            onRule,
        }

        return (
            <Row gutter={[24, 24]} style={{ marginTop: '2%', marginBottom: 8 }} >
                <Col lg={{ span: 16, offset: 2 }} md={{ span: 16, offset: 2 }} sm={{ span: 16, offset: 2 }} xs={{ span: 16, offset: 2 }} >
                    <FormItem label="工单号" key="ticket" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('ticket', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请填写工单号!'
                                },
                                {
                                    validator: validaticket,
                                },
                            ],
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col lg={{ span: 4, offset: 8 }} md={{ span: 4, offset: 8 }} sm={{ span: 4, offset: 8 }} xs={{ span: 4, offset: 8 }} >
                    <Button className='but_down' size="default" type="dashed" onClick={onDownOut} ><Icon type="download" /><div>下载模板</div></Button>
                </Col>
                <Col lg={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} xs={{ span: 4 }} >
                    <MyUpload {...uploadprops} />
                </Col>
            </Row>
        )
    }
    const secondForm = () => {
        function onOk() {
            dispatch({
                type: 'oswizard/updateState',
                payload: {
                    zh_os_DrawerVisible: false,
                    currentStep: 0,
                    hasMOMess: '',
                    findOSData: {}
                }
            })
        }
        if (addMo) {
            addMo.forEach((item, index) => {
                item.editingKey = index
            })
        }
        const editableProps = {
            currentStep: 1,
            addMo,
            validateMO,
            dispatch
        }
        return <MoTable {...editableProps} />
    }
    // const thirdForm = () => {
    //     const editableProps = {
    //         currentStep: 2,
    //         data: validateMO,
    //         dispatch
    //     }
    //     return <Editable {...editableProps} />

    // }
    const thirdForm = () => {
        const msLsit = {
            dispatch,
            loading,
            monitorList
        }
        return <MOStateList  {...msLsit} />
    }
    const fourForm = () => {

        const mt = monitoresult.mt || {}
        let requestResult = monitoresult.requestResult || []
        const succIPs = requestResult.filter(item => item.success)
        const falseIPs = requestResult.filter(item => !item.success)

        const time = mt.timeDef ? `${mt.timeDef.range[0].begin} - ${mt.timeDef.range[0].end}` : ''
        const aa = []
        const bb = []
        succIPs.forEach(item => {
            aa.push(item.IP)
        })
        falseIPs.forEach(item => {
            bb.push(`${item.IP} --- ${item.msg} /n`)
        })
        return (
            <div className='zh_os_five'>
                {
                    Object.keys(mt).length == 0 ? null :
                        <Row>
                            <Col>
                                <Descriptions title={<Text >监控添加成功，默认已按照IP维度添加半小时维护期，维护期信息如下，请检查维护期内告警，如无问题请尽快结束维护期</Text>}>
                                    <Descriptions.Item label="维护期名">{mt.name}</Descriptions.Item>
                                    <Descriptions.Item label="维护期时间">{time}</Descriptions.Item>
                                    <Descriptions.Item label="申请人">{mt.applicant}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                }
                <br></br>
                <Row gutter={[16, 16]}>
                    <Col> <Text strong>以下IP监控成功:</Text></Col>
                    <Col>
                        <TextArea rows={6} value={aa.join(' ; ')} />
                    </Col>
                </Row>
                <br></br>
                <Row gutter={[16, 16]}>
                    <Col> <Text strong>以下IP监控失败,请联系管理员处理:</Text></Col>
                    <Col>
                        <TextArea rows={6} value={bb.join('')} />
                    </Col>
                </Row>
            </div>
        )
    }

    const drawerOpts = {
        title: "OS向导",
        placement: "right",
        closable: false,
        visible,
        onClose,
        width: '75%',
    }
    let hideStyle = { display: "none", }
    let showStyle = { display: "block", }

    const myloadprops = {
        loading_state,
        loading_step,
    }
    
    return (
        <Drawer {...drawerOpts}>
            <Spin spinning={loadingOState}>
                <Steps current={currentStep} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <Myload  {...myloadprops} />
                <br />
                <Row gutter={4} style={{ backgroundColor: '#fff', padding: 8 }}>
                    <div className="steps-content"><Alert message={steps[currentStep] ? `${steps[currentStep].content}` : null} type='info' showIcon /><br /></div>
                    <Form layout="horizontal" >
                        <div className="steps-content" style={currentStep == 0 ? showStyle : hideStyle}>{firstForm()}</div>
                        <div className="steps-content" style={currentStep == 1 ? showStyle : hideStyle}>{secondForm()}</div>
                        <div className="steps-content" style={currentStep == 2 ? showStyle : hideStyle}>{thirdForm()}</div>
                        <div className="steps-content" style={currentStep == 3 ? showStyle : hideStyle}>{fourForm()}</div>
                        {/*<div className="steps-content" style={currentStep == 4 ? showStyle : hideStyle}>{fourForm()}</div>*/}
                    </Form>
                </Row>
                <Row gutter={4} style={{ marginTop: 8, marginBottom: 10, textAlign: 'center' }}>
                    {currentStep == 1 && (
                        <span>
                            <Button type="primary" onClick={prev}>
                                上一步
                            </Button>
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={next}>
                                下一步
                            </Button>
                        </span>

                    )}
                    {currentStep == 2 && (
                        <span>
                            <Button type="primary" onClick={prev}>
                                上一步
                            </Button>
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={next}>
                                安装
                            </Button>
                        </span>

                    )}
                    {
                        currentStep == 3 && (
                            <span>
                                <Button type="primary" onClick={onClose}>
                                    完成
                                </Button>
                            </span>
                        )
                    }
                </Row>
            </Spin>
        </Drawer >
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