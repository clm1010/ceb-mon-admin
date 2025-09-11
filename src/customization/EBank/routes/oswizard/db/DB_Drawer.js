import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Drawer, Button, Steps, Spin, Alert, Row, Input, Typography, Descriptions, Icon, Col, Modal, Progress } from 'antd';
import Fenhang from '../../../../../utils/fenhang'
import MyUpload from './MyUpload'
import MoTable from './moTable'
import { config } from '../../../../../utils'
import '../index.css'
import './Drawer.css'
import ThirdForm from './ThirdForm';
import FourForm from './FourForm';
import Myload from './myloading'

const { Step } = Steps
const { TextArea } = Input;
const { Text } = Typography;
const FormItem = Form.Item

const { ZabbixOSImport, dbWizard, exportExcelURL } = config.api

const steps = [
    {
        title: '第一步 : 导入MO',
        content: '请先导出模板,按模板规则进行填写,最大可导入50条数据',
    },
    {
        title: '第二步 : MO信息的确认',
        content: '请核对确认MO信息',
    },
    {
        title: '第三步 : 监控信息',
        content: '点击“验证”进行监控验证，请耐心等待',
    },
    {
        title: '第四步 : 验证结果',
        content: '监控结果没有问题请添加',
    },
    {
        title: '第五步 : 添加结果',
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
    monitorList,
    monitoresult,
    loadingDBstate,
    loading_step,
    loading_state,
    branchType,
    MOData,     // Mo信息
    existMoint, //存在监控
    importItem,  //导入信息
    verifyRes, //验证结果
    thirdRes, // 是否为监控
    fourRes, // 是否验证通过
    os_type, // 判断是os类型 数据库 中间件 os 等
    needMO,
}) => {

    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,
    } = form


    const onClose = () => {
        resetFields()
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                [`${os_type}_DrawerVisible`]: false,
                currentStep: 0,
                thirdRes: false,
                fourRes: false
            }
        })
    }

    const next = () => {
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                currentStep: currentStep + 1,
            }
        })
    }
    const onVerify = () => {
        dispatch({
            type: 'oswizard/verify',
            payload: importItem
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
        let fieldValue = getFieldsValue(['ticket'])
        dispatch({
            type: 'oswizard/addMonit',
            payload: {
                items: importItem,
                needMO:needMO,
                ticket: fieldValue.ticket
            }
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
            window.open(`${exportExcelURL}/static2/excel/数据库、中间件、PING自服务模板.xlsx`, '_parent')
            :
            window.open(`${exportExcelURL}/static2/excel/数据库、中间件、PING自服务模板.xlsx`, '_parent')
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
            url: dbWizard +`${os_type == 'ping' ? 'ping' : 'dbmid'}`+ '/uploadAndCheck',
            currentStep,
            onRule,
            os_type,
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
        const editableProps = {
            currentStep: 1,
            MOData,
            dispatch
        }
        return <MoTable {...editableProps} />
    }

    const thirdForm = () => {
        const msLsit = {
            dispatch,
            loading,
            existMoint,
            importItem,
        }
        return <ThirdForm {...msLsit} />
    }
    const fourForm = () => {
        const msLsit = {
            dispatch,
            loading,
            verifyRes
        }
        return <FourForm {...msLsit} />
    }

    const fiveForm = () => {

        const mt = monitoresult.mt || {}
        let requestResult = monitoresult.requestResult || []
        const succIPs = requestResult.filter(item => item.status === 0)
        const falseIPs = requestResult.filter(item => item.status !=0)

        const time = mt.timeDef ? `${mt.timeDef.range[0].begin} - ${mt.timeDef.range[0].end}` : ''
        const aa = []
        const bb = []
        succIPs.forEach(item => {
            aa.push(item.hostIP)
        })
        falseIPs.forEach(item => {
            bb.push(`${item.hostIP} --- ${item.msg} /n`)
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
        title:  `${os_type.toUpperCase()}向导`,
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
            <Spin spinning={loadingDBstate}>
                <Steps current={currentStep} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <Myload  {...myloadprops} />
                <br />
                <Row gutter={4} style={{ backgroundColor: '#fff', padding: 8 }}>
                    {
                        (currentStep == 0 || currentStep == 1 || currentStep == 4) ? <div className="steps-content"><Alert message={steps[currentStep] ? `${steps[currentStep].content}` : null} type='info' showIcon /><br /></div> : null
                    }
                    {
                        currentStep == 2 ? thirdRes ? <div className="steps-content"><Alert message='全部为未监控数据库，可以进行验证操作' type='success' showIcon /><br /></div> :
                            <div className="steps-content"><Alert message='存在已监控数据库，请确认数据库是否正确，退出操作' type='error' showIcon /><br /></div> : null
                    }
                    {
                        currentStep == 3 ? fourRes ? <div className="steps-content"><Alert message={'验证没有问题全部通过'} type='info' showIcon /><br /></div> :
                            <div className="steps-content"><Alert message={'存在有问题的数据库，验证不通过'} type='error' showIcon /><br /></div> : null
                    }
                    <Form layout="horizontal" >
                        <div className="steps-content" style={currentStep == 0 ? showStyle : hideStyle}>{firstForm()}</div>
                        <div className="steps-content" style={currentStep == 1 ? showStyle : hideStyle}>{secondForm()}</div>
                        <div className="steps-content" style={currentStep == 2 ? showStyle : hideStyle}>{thirdForm()}</div>
                        <div className="steps-content" style={currentStep == 3 ? showStyle : hideStyle}>{fourForm()}</div>
                        <div className="steps-content" style={currentStep == 4 ? showStyle : hideStyle}>{fiveForm()}</div>
                    </Form>
                </Row>
                <Row gutter={4} style={{ marginTop: 8, marginBottom: 10, textAlign: 'center' }}>
                    {currentStep > 0 && currentStep < 4 && (
                        <span>
                            <Button onClick={prev}>
                                上一步
                            </Button>
                        </span>

                    )}
                    {currentStep == 1 && (
                        <span>
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={next}>
                                下一步
                            </Button>
                        </span>

                    )}
                    {currentStep == 2 && (
                        thirdRes ?
                            <span>
                                <Button type="primary" style={{ marginLeft: 8 }} onClick={onVerify}>
                                    验证
                                </Button>
                            </span>
                            :
                            <span>
                                <Button style={{ marginLeft: 8 }} onClick={onClose}>
                                    退出
                                </Button>
                            </span>

                    )}
                    {
                        currentStep == 3 && (
                            fourRes ?
                                <span>
                                    <Button type="primary" style={{ marginLeft: 8, marginRight: 8 }} onClick={OnMonitor}>
                                        添加
                                    </Button>
                                </span>
                                :
                                <span>
                                    <Button type="primary" style={{ marginLeft: 8, marginRight: 8 }} onClick={onClose}>
                                        退出
                                    </Button>
                                </span>
                        )
                    }
                    {
                        currentStep == 4 && (
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