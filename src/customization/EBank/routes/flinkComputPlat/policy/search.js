import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Form, Row, Col, Select, Input, Button, TimePicker } from 'antd';
import moment from 'moment'

const Option = Select.Option
const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 14,
    },
}
const formItemLayout1 = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
}

const SearchFilter = ({ form, visibleSearchFilter, dispatch, contions, searchValues, tableStatue }) => {

    const [timeState, setTimeState] = useState("")
    const [afterState, setAfterState] = useState("1")

    const { getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue } = form

    useEffect(() => {
        if (searchValues && searchValues != "" && afterState == '2') {
            setFieldsValue({ ip: searchValues })
        }
    }, [searchValues])


    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            if (data.workEndTime) {
                data.workEndTime = data.workEndTime.format('HH:mm:ss')
            }
            if (data.workStartTime) {
                data.workStartTime = data.workStartTime.format('HH:mm:ss')
            }
            for (let item in data) {
                if (data[item] == '') {
                    data[item] = undefined
                }
            }
            dispatch({
                type: 'flinkComputPlat/query',
                payload: data,
            })

        })
    }
    const onreseat = () => {
        resetFields()
    }
    const onchangeTimeMode = (value) => {
        setTimeState(value)
    }
    const onSelectAfter = (value) => {
        setAfterState(value)
        if (value === "2") {
            dispatch({
                type: 'flinkComputPlat/setState',
                payload: {
                    searchMoalVisible: true
                },
            })
        }
    }

    const selectAfter = (
        <Select defaultValue="1" style={{ width: 70 }} onChange={onSelectAfter}>
            <Option value="1">模糊</Option>
            <Option value="2">精确</Option>
        </Select>
    )

    return (
        <div style={{ paddingTop: 15, marginRight: 15,  height: 800,borderWidth:'0 2px 0 0',borderStyle:'solid',borderColor:'#f4f4f4' }}>
            <Form layout="horizontal" hideRequiredMark>
                <Row gutter={6}>
                    <Col span={22}>
                        <Form.Item label="策略名称" key="policyName" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('policyName', {
                            })(
                                <Input allowClear />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={22}>
                        <Form.Item label="监控设备" key="ipAddress" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('ipAddress', {
                                rules: [],
                            })(
                                <Input allowClear />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={22}>
                        <Form.Item label="策略大类" key="componentType" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('componentType')(
                                <Select allowClear>
                                    <Option value='操作系统'> 操作系统</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={22}>
                        <Form.Item label="策略中类" key="component" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('component', {
                            })(
                                <Select allowClear>
                                    <Option value='LINUX'>LINUX </Option>
                                    <Option value='AIX'>AIX </Option>
                                    <Option value='HPUX'>HPUX </Option>
                                    <Option value='WINDOWS'>WINDOWS </Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={22}>
                        <Form.Item label="策略小类" key="subComponent" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('subComponent', {
                                rules: [],
                            })(
                                <Select allowClear>
                                    <Option value='CPU'>CPU </Option>
                                    <Option value='内存'>内存 </Option>
                                    <Option value='文件系统'>文件系统 </Option>
                                    <Option value='文件系统索引节点'>文件系统索引节点 </Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={22}>
                        <Form.Item label="生效周期" key="workDay" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('workDay', {
                                rules: [],
                            })(
                                <Select allowClear showSearch>
                                    <Option value='0'>每天 </Option>
                                    <Option value='1'>工作日 </Option>
                                    <Option value='2'>节假日 </Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={22}>
                        <Form.Item label="监控时间" key="timeMode" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('timeMode', {
                                rules: [],
                            })(<Select allowClear showSearch onChange={onchangeTimeMode}>
                                <Option value='0'>全天 </Option>
                                <Option value='1'>白天(8:00--17:00) </Option>
                                <Option value='2'>夜间(17:00--次日8:00) </Option>
                                <Option value='3'>自定义 </Option>
                            </Select>)}
                        </Form.Item>
                    </Col>
                    {
                        timeState == "3" ?
                            <>
                                <Col span={22}>
                                    <Form.Item label="开始时间" key="workStartTime" hasFeedback {...formItemLayout}>
                                        {getFieldDecorator('workStartTime', {
                                        })(<TimePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            placeholder="请选择开始时间"
                                            format="HH:mm:ss"
                                            style={{ width: '100%' }}
                                        />)}
                                    </Form.Item>
                                </Col>
                                <Col span={22}>
                                    <Form.Item label="结束时间" key="workEndTime" hasFeedback {...formItemLayout}>
                                        {getFieldDecorator('workEndTime', {
                                        })(<TimePicker
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            placeholder="请选择开始时间"
                                            format="HH:mm:ss"
                                            style={{ width: '100%' }}
                                        />)}
                                    </Form.Item>
                                </Col>
                            </>
                            : null
                    }
                </Row>
            </Form>
            <div
                style={{
                    right: 0,
                    top: 200,
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'center',
                }}
            >
                <Button onClick={onOk} type="primary" style={{ marginRight: 20 }}>
                    确定
                </Button>
                <Button onClick={onreseat} >
                    重置
                </Button>
            </div>
        </div>

    )

}

export default Form.create()(SearchFilter)