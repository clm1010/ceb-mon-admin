import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Form, Row, Col, Select, Input, Button, TimePicker } from 'antd';

const Option = Select.Option

const formItemLayout1 = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
}

const SearchFilter = ({ form, visibleSearchFilter, dispatch, devGroupAllList, searchValues, tableStatue }) => {

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
            let newData = {}
            if (afterState == "1") {
                newData.ipAddress = data.ip
            } else {
                newData.ips = data.ip.split(',')
            }
            for (let item in newData) {
                if (newData[item] == '') {
                    newData[item] = undefined
                }
            }
            if(data.dictId){
                newData.dictId = data.dictId
            }
            dispatch({
                type: 'flinkComputPlat/queryDevice',
                payload: newData,
            })
        })
    }
    const onreseat = () => {
        resetFields()
    }

    const onSelectAfter = (value) => {
        setAfterState(value)
        dispatch({
            type: 'flinkComputPlat/setState',
            payload: {
                searchMoalVisible: true
            },
        })
    }

    const selectAfter = (
        <Select defaultValue="1" style={{ width: 70 }} onChange={onSelectAfter}>
            <Option value="1">模糊</Option>
            <Option value="2">精确</Option>
        </Select>
    )

    return (
        <div style={{ paddingTop: 15, marginRight: 15, height: 800, borderWidth: '0 2px 0 0', borderStyle: 'solid', borderColor: '#f4f4f4' }}>
            <Form layout="horizontal" hideRequiredMark>
                <Row>
                    <Col span={24}>
                        <Form.Item label="设备地址" key="ip" hasFeedback {...formItemLayout1}>
                            {getFieldDecorator('ip', {
                                initialValue: '',
                            })(
                                <Input allowClear addonAfter={selectAfter} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="设备组" key="dictId" hasFeedback {...formItemLayout1}>
                            {getFieldDecorator('dictId', {
                                initialValue: '',
                            })(
                                <Select allowClear>
                                    {devGroupAllList.map(item=>{
                                        return <Option value={item.id}>{item.value} </Option>
                                    })}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
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