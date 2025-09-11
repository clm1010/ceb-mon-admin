import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, TimePicker, Icon, Tabs, Tooltip, message, Tag } from 'antd'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const { CheckableTag } = Tag
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
    dictModalVisible,
    DictList1,
    DictList2,
    DictList3,
    form,
    parentId1,
    parentId2,
}) => {
    const [checked, setChecked] = useState('')

    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue,
    } = form

    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'flinkComputPlat/setState',				//@@@//抛一个事件给监听这个type的监听器
            payload: {
                dictModalVisible: false,
            },
        })
    }

    const onOk = () => {
        resetFields()
        dispatch({
            type: "flinkComputPlat/setState",
            payload: {
                dictModalVisible: false
            }
        })
    }

    const modalOpts = {
        title: `flink管理平台策略维护`,
        visible: dictModalVisible,
        onCancel,
        onOk,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        destroyOnClose: true
    }

    const onChange = (tag, checked) => {
        setChecked()
    }
    const onClick = (value) => {
        dispatch({
            type: 'flinkComputPlat/getDictChild',
            payload: {
                id: value.id,
                page: 1,
                size: 1000,
                level: value.level
            }
        })
        dispatch({
            type: "flinkComputPlat/setState",
            payload: {
                DictList3: [],
                DictList2: [],
                parentId1: value.id,
            }
        })
    }

    const onClick2 = (value) => {
        dispatch({
            type: 'flinkComputPlat/getDictChild',
            payload: {
                id: value.id,
                page: 1,
                size: 1000,
                level: value.level,
                parentId: value.parentId
            }
        })
        dispatch({
            type: "flinkComputPlat/setState",
            payload: {
                DictList3: [],
                parentId2: value.id
            }
        })
    }

    const onAddF = (num,parentId) => {
        dispatch({
            type: "flinkComputPlat/setState",
            payload: {
                addDictVisible: true,
                level: num,
                parentId:parentId
            }
        })
    }
    return (
        <Modal {...modalOpts}
            width={900}
            footer={[
                <Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确认</Button>]}
            key="routerModal"
        >
            <Form layout="horizontal" preserve={false}>
                <Tabs defaultActiveKey="dict_1">
                    <TabPane tab={<span><Icon type="user" />一级分类</span>} key="dict_1">
                        <div style={{ marginLeft: 30 }}>
                            {
                                DictList1.map((tag, index) => {
                                    return <Tooltip title={tag.key} key={tag.id}>
                                        <Tag key={tag.id} checked={checked} onChange={onChange} onClick={() => onClick(tag)} color={parentId1 == tag.id ? '#eb2f96' : '#87d068'}> {tag.value}</Tag>
                                    </Tooltip>
                                })
                            }
                            <Tag onClick={() => onAddF(1,null)} style={{ background: '#fff', borderStyle: 'dashed' }}> <Icon type='plus' /> </Tag>
                        </div>
                    </TabPane>
                </Tabs>
                <Tabs defaultActiveKey="dict_2">
                    <TabPane tab={<span><Icon type="user" />二级分类</span>} key="dict_2">
                        <div style={{ marginLeft: 30 }}>
                            {
                                DictList2.map((tag, index) => {
                                    return <Tooltip title={tag.key} key={tag.id}>
                                        <Tag key={tag.id} checked={checked} onChange={onChange} onClick={() => onClick2(tag)} color={parentId2 == tag.id ? '#eb2f96' : '#87d068'}> {tag.value}</Tag>
                                    </Tooltip>
                                })
                            }
                            <Tag onClick={() => onAddF(2,parentId1)} style={{ background: '#fff', borderStyle: 'dashed' }}> <Icon type='plus' /> </Tag>
                        </div>
                    </TabPane>
                </Tabs>
                <Tabs defaultActiveKey="dict_3">
                    <TabPane tab={<span><Icon type="user" />三级分类</span>} key="dict_3">
                        <div style={{ marginLeft: 30 }}>
                            {
                                DictList3.map((tag, index) => {
                                    return <Tooltip title={tag.key} key={tag.id}>
                                        <Tag key={tag.id} checked={checked} onChange={onChange} color='#87d068'> {tag.value}</Tag>
                                    </Tooltip>
                                })
                            }
                            <Tag onClick={() => onAddF(3,parentId2)} style={{ background: '#fff', borderStyle: 'dashed' }}> <Icon type='plus' /> </Tag>
                            <Tag onClick={() => onAddF(3,parentId1)} style={{ background: '#fff', borderStyle: 'dashed' }}> ++ </Tag>
                        </div>
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
}

export default Form.create()(modal)
