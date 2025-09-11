import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Drawer, Button, Steps, Spin, Alert, Row, Tooltip, Typography, Tag, Result, Col, message, Divider } from 'antd';
import List from './table'
import OelTable from './oelTable'

const { CheckableTag } = Tag;

const { Step } = Steps
const { Title, Paragraph, Text } = Typography;

const steps = [
    {
        title: '第一步 : 获取IP',
        content: '输入应用系统名,查询系统下MO信息的IP列表',
    },
    {
        title: '第二步 : 确认IP并下线',
        content: '对IP信息的确认,并下线',
    },
    {
        title: '第三步 : 查看告警',
        content: '请检查因下发产生的已关闭的告警',
    },
    {
        title: '第四步 : 下线结果',
        content: '下线完成',
    }
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
    currentStep,
    form,
    appSelect,
    downList,
    downpagination,
    q,
    down_os_uuids,
    down_os_ips,
    offlineResult,
    loadingDownState,
    zabbixHostList,
    branchType,
}) => {
    const [selectedTags, setselectedTags] = useState([])
    const [TagsLsit, setTagsLsit] = useState([])

    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,
    } = form

    const onClose = () => {
        setselectedTags([])
        setTagsLsit([])
        resetFields()
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                down_DrawerVisible: false,
                currentStep: 0,
                downList: [],
                down_os_ips: [],
                down_os_uuids:[],
                downpagination: {
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: total => `共 ${total} 条`,
                    current: 1,
                    total: null,
                    pageSizeOptions: ['10', '20', '50', '100', '200'],
                },
            }
        })
    }

    const onShowOel = () => {
        const ips = []
        // offlineResult.alertList
        down_os_ips.forEach(item => {
            // ips.push(`NodeAlias = ${item.NodeAlias}`)
            ips.push(`NodeAlias = '${item}'`)
        })

        dispatch({
            type: 'oel/query',
            payload: {
                needFilter: false,
                filterDisable: true,
                preFilter: `and ( ${ips.join(' or ')} )`,
            },
        })
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                oelModalVisible: true
            }
        })
    }

    const Offline = () => {
        if(TagsLsit.length == 0){
            message.error('请点击选择主机信息！！')
            return
        }
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                loadingDownState: true
            }
        })
        dispatch({
            type: 'oswizard/Offline',
            payload: TagsLsit
        })
    }

    const next = () => {
        if (currentStep == 0) {
            let scdFields = ['ticket']
            validateFields(scdFields, (errors) => {
                if (errors) {
                    return
                }
                if (down_os_ips.length == 0) {
                    message.error('请勾选择要下线的MO')
                    return
                }
                dispatch({
                    type: 'oswizard/getzabbixHost',
                    payload: {
                        uuids: down_os_uuids
                    }
                })
            })
        } else if (currentStep == 2) {
            dispatch({
                type: 'oswizard/updateState',
                payload: {
                    currentStep: currentStep + 1,
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

    const handleChangeTag = (tag, checked, element) => {
        // 记录显示的名称list
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        //记录整条数据的list
        const newTagsLsit = checked ? [...TagsLsit, element] : TagsLsit.filter(e => e.host.hostAlias !== tag)

        setselectedTags(nextSelectedTags)
        setTagsLsit(newTagsLsit)
    }

    const firstForm = () => {
        const listProps = {
            dispatch,
            dataSource: downList,
            appSelect,
            form,
            pagination: downpagination,
            q,
            down_os_uuids
        }

        return (
            <List {...listProps} />
        )
    }
    const secondForm = () => {
        return (
            <Row gutter={[0, 24]} type="flex" justify="center"  style={{ marginTop: 8, marginBottom: 20 }}>
                {/* {down_os_ips.map(item => {
                    return <Col span={4}> <Tag color='volcano' > {item} </Tag> </Col>
                })} */}

                {
                    zabbixHostList.map(item => {
                        const tags = item.items.map(element => (
                            <CheckableTag
                                key={element.host.hostAlias}
                                checked={selectedTags.indexOf(element.host.hostAlias) > -1}
                                onChange={checked => handleChangeTag(element.host.hostAlias, checked, element)}
                            >
                                <Tooltip title={element.host.hostName}> {element.host.hostAlias} </Tooltip>
                            </CheckableTag>
                        ))
                        return <Col span={18} > {item.group} <Divider type="vertical" style={{width:'2px',height:'1em',backgroundColor:'#eb2f96'}}/> {tags} </Col>
                    })
                }
            </Row>
        )
    }
    const thirdForm = () => {
        const listProps = {
            dispatch,
            dataSource: offlineResult.alertList,
            pagination: downpagination,
            q
        }

        return (
            <OelTable {...listProps} />
        )
    }

    const fourForm = () => {
        if (offlineResult.requestSuccess) {
            return (
                <Result
                    status="success"
                    title="下线成功,IP整机下线流程结束"
                    subTitle="IP主机监控已下线,关联OEL告警已关闭."
                    extra={[
                        //                        <Button type="primary" key="console" onClick={onShowOel}>
                        //                           查看OEL告警信息
                        //                        </Button>,
                        <Button key="finish" onClick={onClose}>完成</Button>,
                    ]}
                />
            )
        }
        return (
            <Result
                status="error"
                title="下线失败,IP整机下线流程结束"
                subTitle={offlineResult.requestMsg}
                extra={[
                    <Button key="finish" onClick={onClose}>完成</Button>,
                ]}
            />
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

    return (
        <Drawer {...drawerOpts}>
            <Spin spinning={loadingDownState}>
                <Steps current={currentStep} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <br />
                <Row gutter={4} style={{ backgroundColor: '#fff', padding: 8 }}>
                    <div className="steps-content"><Alert message={steps[currentStep] ? `${steps[currentStep].content}` : null} type='info' showIcon /><br /></div>
                    <Form layout="horizontal" >
                        <div className="steps-content" style={currentStep !== 0 ? hideStyle : showStyle}>{firstForm()}</div>
                        <div className="steps-content" style={currentStep !== 1 ? hideStyle : showStyle}>{secondForm()}</div>
                        <div className="steps-content" style={currentStep !== 2 ? hideStyle : showStyle}>{thirdForm()}</div>
                        <div className="steps-content" style={currentStep !== 3 ? hideStyle : showStyle}>{fourForm()}</div>
                    </Form>
                </Row>
                <Row gutter={4} style={{ marginTop: 8, marginBottom: 10, textAlign: 'center' }}>
                    {
                        (currentStep == 0 || currentStep == 2) && (
                            <Button type="primary" style={{ marginLeft: 8 }} onClick={next}>
                                下一步
                            </Button>
                        )
                    }
                    {
                        currentStep == 1 && (
                            <span>
                                <Paragraph>共计主机数量为<Text strong type="danger">{selectedTags.length}</Text>条</Paragraph>
                                <Button type="primary" onClick={prev}>
                                    上一步
                                </Button>
                                <Button type="primary" style={{ marginLeft: 8 }} onClick={Offline}>
                                    下线
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