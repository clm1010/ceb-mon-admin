import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Collapse, Button, DatePicker } from 'antd'
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const Panel = Collapse.Panel
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}
const modal = ({
    dispatch,
    visible,
    ruleInfoVal,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
    },
}) => {
    const onOk = () => {
        validateFieldsAndScroll((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            for (let field in data) {
                if (typeof (data[field]) === 'object') {
                    data[field] = Date.parse(data[field])
                }
            }
            const actions = ruleInfoVal.actions.map(item=>({
                name:item.name,
                interval:item.interval,
                action:item.action,
                voice:item.voice
            }))
            let payload = {
                name:data.name,
                beginTime:data.beginTime,
                actions:actions,
                traceType:'ORDINARY',
                cycleMechanism:'CUSTOM'
            }
            dispatch({
                type: 'oelTrack/create',											//抛一个事件给监听这个type的监听器
                payload:payload,
            })
            resetFields()
        })
    }

    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'oelTrack/setState', //抛一个事件给监听这个type的监听器
            payload: {
                addModalvisible: false,
                ruleInfoVal: {},
            },
        })
    }
    const onTrackRuleinfo = () => { //弹出窗口中点击取消按钮触发的函数
        dispatch({
            type: 'oelTrack/trackRule', //抛一个事件给监听这个type的监听器
            payload: {},
        })
        dispatch({
            type: 'oelTrack/setState', //抛一个事件给监听这个type的监听器
            payload: {
                trackRuleModalvisible: true,
            },
        })
    }
    const modalOpts = {
        title: '新增告警跟踪',
        visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 900,
    }
    return (
        <Modal {...modalOpts} width="600px" footer={[<Button key="cancdata" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}>
            <Form layout="horizontal">
                <Tabs defaultActiveKey="templet_1">
                    <TabPane tab={<span><Icon type="user" />标题</span>} key="templet_1">
                    <FormItem label="跟踪名称" hasFeedback {...formItemLayout}>
							{getFieldDecorator('name', {
								initialValue: "",
								rules: [
									{
										required: true,
									},
								],
							})(<Input />)}
						</FormItem>
                    </TabPane>
                </Tabs>
                <Tabs defaultActiveKey="templet_2">
                    <TabPane tab={<span><Icon type="switcher" />时间定义</span>} key="templet_2">
                        <FormItem label="开始时间" key="beginTime" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('beginTime', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                            </FormItem>
                    </TabPane>
                </Tabs>
                <Tabs defaultActiveKey="templet_3">
                    <TabPane tab={<span><Icon type="user" />处置动作</span>} key="templet_3">
                    <FormItem label="跟踪规则" hasFeedback {...formItemLayout}>
							{getFieldDecorator('acton', {
								initialValue: ruleInfoVal.name ? ruleInfoVal.name : "",
								rules: [
									{
										required: true,
									},
								],
							})(<Input readOnly onClick={onTrackRuleinfo}/>)}
						</FormItem>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    )
}

modal.propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool,
    type: PropTypes.string,
    item: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
}

export default Form.create()(modal)
