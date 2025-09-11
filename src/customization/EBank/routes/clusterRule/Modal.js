import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button } from 'antd'
import MyTreeSelect from './myTreeSelect'

const FormItem = Form.Item

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
    type,
    item,
    form: {
		getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
	},
    normalTreeSelected,
    basicsTreeSelected,
    normalTreeData,
    basicsTreeData,

    normalList,
    basicsList,

}) => {
    const onOk = () => { //弹出窗口点击确定按钮触发的函数
        validateFieldsAndScroll((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            let payload = {
                clusterName: data.clusterName,
                promUrl: data.promUrl,
                serverUrl: data.serverUrl,
                normalRuleList: normalList,
                basicsRuleList: basicsList,
                tool: item.tool
            }
            resetFields()
            dispatch({
                type: `clusterRule/update`,			//抛一个事件给监听这个type的监听器
                payload: payload
            })
        })
    }

    const onCancel = () => {						//弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'clusterRule/setState',			//抛一个事件给监听这个type的监听器
            payload: {
                modalVisible: false,
                normalTreeSelected: [],
                basicsTreeSelected: [],
                normalList: [],
                basicsList: [],
            },
        })
    }

    const selectRule = type => {
        if (type == 'normal') {
            dispatch({ type: 'clusterRule/getRuleNormal' })
        } else {
            dispatch({ type: 'clusterRule/getRuleBasics' })
        }

        dispatch({
            type: 'clusterRule/setState',			//抛一个事件给监听这个type的监听器
            payload: {
                RuleVisible: true,
                transfromLoading: true,
                ruleType: type
            },
        })
    }

    const showSelectName = (data) => {
        let arrs = []
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (arrs.length > 0) {
                    arrs = [...arrs, { value: item.value, label: item.name }]
                } else {
                    arrs = [{ value: item.value, label: item.name }]
                }
            })
        }
        return arrs
    }
    const modalOpts = {
        title: type === 'update' ? '编辑信息' : '查看信息',
        visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
    }

    return (

        <Modal {...modalOpts}
            width="600px"
            footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>, type === 'update' ? <Button key="submit" type="primary" onClick={onOk}>确定</Button> : null]}
        >
            <Form layout="horizontal">
                <FormItem label="集群名称" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('clusterName', {
                        initialValue: item.clusterName,
                        rules: [
                            {
                                required: true,
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Server Url" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('serverUrl', {
                        initialValue: item.serverUrl,
                        rules: [
                            {
                                required: true
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Prometheus Url" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('promUrl', {
                        initialValue: item.promUrl,
                        rules: [
                            {
                                required: true
                            },
                        ],
                    })(<Input />)}
                </FormItem>

                <FormItem label="基础规则" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('basics', {
                        initialValue: `配置了${basicsList.length}条规则`,
                        rules: [],
                    })(<Input readOnly placeholder='Please Input' onClick={() => selectRule('basics')} />)}
                </FormItem>
                <FormItem label="普通规则" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('normal', {
                        initialValue: `配置了${normalList.length}条规则`,
                        rules: [],
                    })(<Input readOnly placeholder='Please Input' onClick={() => selectRule('normal')} />)}
                </FormItem>

                {/*<FormItem label="加载规则" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('normal', {
                        initialValue: '',
                        rules: [
                        ],
                    })(<MyTreeSelect
                        treeData={normalTreeData}
                        ArrNodes={normalTreeSelected}
                        dispatch={dispatch}
                        type='normalTreeSelected'
                    ></MyTreeSelect>)}
                </FormItem>
                <FormItem label="基础规则" hasFeedback {...formItemLayout}>
                    {getFieldDecorator('basics', {
                        initialValue: '',
                        rules: [
                        ],
                    })(<MyTreeSelect
                        treeData={basicsTreeData}
                        ArrNodes={basicsTreeSelected}
                        dispatch={dispatch}
                        type='basicsTreeSelected'
                    ></MyTreeSelect>)}
                </FormItem>*/}

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
