import React, { useState, useEffect, Fragment } from "react";
import {  Form, Row, Col, Select, Input, Button } from 'antd';
import moment from 'moment'

const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}

const SearchFilter = ({ form, visibleSearchFilter, dispatch}) => {

    const { getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue } = form


    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            dispatch({
                type: 'flinkComputPlat/queryGroup',
                payload: data,
            })

        })
    }
    const onreseat = () => {
        resetFields()
    }

    return (
        <div style={{ paddingTop: 15, marginRight: 15,  height: 800,borderWidth:'0 2px 0 0',borderStyle:'solid',borderColor:'#f4f4f4' }}>
            <Form layout="horizontal" hideRequiredMark>
                <Row gutter={6}>
                    <Col span={22}>
                        <Form.Item label="策略组名称" key="name" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('name', {
                            })(
                                <Input allowClear />
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