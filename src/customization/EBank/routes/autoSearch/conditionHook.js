import React, { useState, useEffect } from 'react'
import { Form, Input, Modal, Button, Select, Row, Col, TreeSelect, message } from 'antd'
import { config } from '../../../../utils'
import style from './conditionHook.css'
const { monitorImport } = config.api

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
}
const formItemLayout1 = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
}
const conditions = ({ dispatch, form, project, clusert, nameSpace, service, monitorTag, urlSuffix, dataSource, clusterData }) => {
    const {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        setFieldsValue,
        validateFieldsAndScroll,
    } = form
    const [index, setIndex] = useState(0)
    const [tempList, settempList] = useState([{ index: 0, project: '', clusert: '', nameSpace: '' }])

    const projectList = project.map((item) => {
        return <Option key={item} value={item}>{item}</Option>
    })
    const clusertList = clusert.map((item) => {
        return <Option key={item} value={item}>{item}</Option>
    })
    const nameSpaceList = nameSpace.map((item) => {
        return <Option key={item} value={item}>{item}</Option>
    })
    const serviceList = service.map((item) => {
        return <Option key={item} value={item}>{item}</Option>
    })
    const monitorTagList = monitorTag.map((item) => {
        return <Option key={item.tagValue} value={item.tagValue}>{item.tagKey}</Option>
    })
    const urlSuffixList = urlSuffix.map((item) => {
        return <Option key={item.tagValue} value={item.tagValue}>{item.tagKey}</Option>
    })

    const jiahao = () => {
        let temp = tempList[tempList.length - 1]
        let index = temp.index
        index++
        tempList.push({ index, project: '', clusert: '', nameSpace: '' })
        settempList([...tempList])
        setIndex(index)
    }
    const jianhao = (index) => {
        const tempListNew = tempList.filter(temp => temp.index !== index)
        settempList([...tempListNew])
    }

    const onProject = (value, e, index) => {
        const envValue = getFieldsValue([`env${index}`])[`env${index}`]
        resetFields(['cluster0', 'nameSpace0'])
        // if (envValue == '2') {
        //     dispatch({
        //         type: 'autoSearch/querySuccess',
        //         payload: {
        //             clusert: clusterData[value],
        //             nameSpace: [],
        //         }
        //     })
        // } else {
            dispatch({
                type: 'autoSearch/querySuccess',
                payload: {
                    clusert: [],
                    nameSpace: [],
                }
            })
            dispatch({
                type: 'autoSearch/queryCluster',
                payload: {
                    env: envValue,
                    project: value
                }
            })
        // }

    }

    const onCluster = (value, e, index) => {
        const envValue = getFieldsValue([`env${index}`])[`env${index}`]
        const projectValue = getFieldsValue([`project${index}`])[`project${index}`]
        resetFields(['nameSpace0'])
        dispatch({
            type: 'autoSearch/querySuccess',
            payload: {
                nameSpace: [],
            }
        })
        dispatch({
            type: 'autoSearch/queryNameSpace',
            payload: {
                env: envValue,
                project: projectValue,
                cluster: value
            }
        })
    }
    const onNameSpace = (value, e, index) => {
        const envValue = getFieldsValue([`env${index}`])[`env${index}`]
        const clusterValue = getFieldsValue([`cluster${index}`])[`cluster${index}`]
        dispatch({
            type: 'autoSearch/queryService',
            payload: {
                env: envValue,
                clusterName: clusterValue,
                nameSpace: value
            }
        })
    }

    const onnev = (value, e, index) => {
        resetFields(['project0', 'cluster0', 'nameSpace0'])
        dispatch({
            type: 'autoSearch/querySuccess',
            payload: {
                project: [],
                clusert: [],
                nameSpace: [],
            }
        })
        dispatch({
            type: 'autoSearch/queryProject',
            payload: {
                env: value
            }
        })
    }
    //适用范围查询条件搜索---start
    const mySearchInfo = (input, option) => {
        return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }

    const onDebug = () => {
        validateFieldsAndScroll((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            const temp = []
            tempList.forEach((item) => {
                let obj = {}
                // obj.monitorTag = []

                let env_ = `env${item.index}`
                obj.env = data[env_]

                let project_ = `project${item.index}`
                obj.project = data[project_]

                let cluster_ = `cluster${item.index}`
                obj.cluster = data[cluster_]

                let nameSpace_ = `nameSpace${item.index}`
                obj.namespace = data[nameSpace_]

                // let service_ = `service${item.index}`
                // obj.serviceName = data[service_]

                // let monitorTag_ = `monitorTag${item.index}`

                // obj.monitorTagList = data[monitorTag_]

                // let urlSuffix_ = `urlSuffix${item.index}`
                // obj.urlSuffix = data[urlSuffix_]
                obj.parentCode = ""
                temp.push(obj)

            });
            dispatch({
                type: 'autoSearch/queryTest',
                payload: {
                    qContion: temp[0]
                }
            })
        })
    }
    const onExport = () => {
        const parentCode = dataSource[0].distriMonitorTree.parentCode
        dispatch({
            type: 'autoSearch/onExport',
            payload: {
                parentCode: parentCode,
                filename: '监控评价'
            }
        })
    }

    const restule = tempList.map(templet =>
    (<Row key={`row_${templet.index}`}>
        <Col span={4} key={`col_${templet.index}_0`}>
            <FormItem label="环境" hasFeedback {...formItemLayout} key={`env_${templet.index}`}>
                {getFieldDecorator(`env${templet.index}`, {
                    initialValue: templet.env,
                    rules: [
                        {
                            required: true,
                            message: '必填',
                        },
                    ],
                })(<Select style={{ width: "100%" }} onSelect={(value, e) => onnev(value, e, index)}>
                    <Option value='0'>cpaas.td.io</Option>
                    <Option value='1'>cpaas.ms.io</Option>
                    <Option value='2'>cpaas.eca.dev.cebbank</Option>
                </Select>)}
            </FormItem>
        </Col>
        <Col span={4} key={`col_${templet.index}_1`}>
            <FormItem label="项目" hasFeedback {...formItemLayout} key={`project_${templet.index}`}>
                {getFieldDecorator(`project${templet.index}`, {
                    initialValue: templet.project,
                    rules: [
                        {
                            required: true,
                            message: '必填',
                        },
                    ],
                })(<Select style={{ width: "100%" }}
                    allowClear
                    showSearch
                    getPopupContainer={() => document.body}
                    filterOption={mySearchInfo}
                    onSelect={(value, e) => onProject(value, e, templet.index)}
                >
                    {projectList}
                </Select>)}
            </FormItem>
        </Col>
        <Col span={8} key={`col_${templet.index}_1`}>
            <FormItem label="集群" hasFeedback {...formItemLayout1} key={`cluster_${templet.index}`}>
                {getFieldDecorator(`cluster${templet.index}`, {
                    initialValue: templet.cluster,
                    rules: [
                        {
                            required: true,
                            message: '必填',
                        },
                    ],
                })(<Select style={{ width: "100%" }}
                    allowClear
                    showSearch
                    getPopupContainer={() => document.body}
                    filterOption={mySearchInfo}
                    onSelect={(value, e) => onCluster(value, e, templet.index)}
                >
                    {clusertList}
                </Select>)}
            </FormItem>
        </Col>
        <Col span={8} key={`col_${templet.index}_2`}>
            <FormItem label="命名空间" hasFeedback {...formItemLayout1} key={`nameSpace_${templet.index}`}>
                {getFieldDecorator(`nameSpace${templet.index}`, {
                    initialValue: templet.nameSpace,
                    rules: [
                        {
                            required: true,
                            message: '必填',
                        },
                    ],
                })(<Select style={{ width: "100%" }}
                    allowClear
                    showSearch
                    getPopupContainer={() => document.body}
                    filterOption={mySearchInfo}
                //onSelect={(value, e) => onNameSpace(value, e, templet.index)}
                >
                    {nameSpaceList}
                </Select>)}
            </FormItem>
        </Col>
        {/*<Col span={5} key={`col_${templet.index}_3`}>
                <FormItem label="内部路由" hasFeedback {...formItemLayout} key={`service_${templet.index}`}>
                    {getFieldDecorator(`service${templet.index}`, {
                        initialValue: templet.service,
                        rules: [
                        ],
                    })(<Select style={{ width: "100%" }}
                        allowClear
                        showSearch
                        getPopupContainer={() => document.body}
                        filterOption={mySearchInfo}>
                        {serviceList}
                    </Select>)}
                </FormItem>
            </Col>
            <Col span={4} key={`col_${templet.index}_4`}>
                <FormItem label="标签" hasFeedback {...formItemLayout} key={`monitorTag_${templet.index}`}>
                    {getFieldDecorator(`monitorTag${templet.index}`, {
                        initialValue: templet.monitorTag,
                        rules: [
                        ],
                    })(<Select style={{ width: "100%" }} mode='multiple'>
                        {monitorTagList}
                    </Select>)}
                </FormItem>
            </Col>
            <Col span={3} key={`col_${templet.index}_5`}>
                <FormItem label="后缀" hasFeedback {...formItemLayout} key={`urlSuffix_${templet.index}`}>
                    {getFieldDecorator(`urlSuffix${templet.index}`, {
                        initialValue: templet.urlSuffix,
                        rules: [
                        ],
                    })(<Select style={{ width: "100%" }} >
                        {urlSuffixList}
                    </Select>)}
                </FormItem>
            </Col>
        <Col span={4} key={`col_${templet.index}_6`}>
            <div style={{ marginTop: 4 }}>
                <Button disabled={tempList.length === 1} onClick={jianhao.bind(this, templet.index)} style={{ float: 'right' }}>-</Button>
                <Button onClick={jiahao} style={{ float: 'right' }}>+</Button>
            </div>
        </Col>
        */}
    </Row>))

    return (
        <div className={style.hg}>
            {restule}
            <Row span={24} style={{ marginBottom: 8 }}>
                <Col span={24}>
                    <Button style={{ marginLeft: 8 }} onClick={onDebug}>验证</Button>
                    <Button style={{ marginLeft: 8 }} onClick={onExport}>导出</Button>
                    {/*<span style={{ display:'inline-block' }}>
                        <Upload {...uploadprops}><Button ><Icon type="upload" />导入</Button></Upload>
                    </span> */}
                    <Button style={{ marginLeft: 8 }} icon="question" onClick={() => {
                        window.open(`http://10.200.197.200:17565/pages/viewpage.action?pageId=40568085`, '')
                    }} >说明文档</Button>
                </Col>
            </Row>
        </div>
    )
}

export default Form.create()(conditions) 