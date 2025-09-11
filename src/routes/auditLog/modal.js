import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Select, Row, Col, Input } from 'antd'

const FormItem = Form.Item
// const TabPane = Tabs.TabPane
const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
}
const formItemLayout2 = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
}

const modal = ({
    dispatch,
    auditLogVisiable,
    ModalList,
    apiList,
    form: {
        getFieldDecorator,
        getFieldsValue,
        validateFields,
        resetFields,
    },
}) => {
    const [tempList, setTempList] = useState([{ index: 1, name: '', description: '' }])

    useEffect(() => {
        const temp = apiList.map((item, index) => { return { index, name: item.name, description: item.description } })
        if (temp.length > 0) {
            setTempList([...temp])
        } else {
            setTempList([{ index: 1, name: '', description: '' }])
        }
    }, [apiList])

    const jiahao = () => {
        let temp = tempList[tempList.length - 1]
        let index = temp.index
        index++
        tempList.push({
            index, name: '', description: '',
        })
        setTempList([...tempList])
    }

    const jianhao = (index) => {
        const tempListNew = tempList.filter(temp => temp.index !== index)
        setTempList([...tempListNew])
    }

    const onCancel = () => {
        setTempList([{ index: 1, name: '', description: '' }])
        dispatch({
            type: 'auditLog/setState',
            payload: {
                auditLogVisiable: false
            },
        })
        resetFields()
    }
    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            let apis = []
            tempList.forEach((item) => {
                let name = `name${item.index}`
                let description = `description${item.index}`
                let obj = {}
                obj.name = data[name]
                obj.description = data[description]
                apis.push(obj)
            })
            let modalItem = ModalList.find(f => f.uuid == data.modalNmae)
            dispatch({
                type: 'auditLog/apiSave',
                payload: {
                    name: modalItem.name,
                    description: modalItem.description,
                    uuid: modalItem.uuid,
                    // ...modalItem,
                    apis,
                }
            })
            setTempList([{ index: 1, name: '', description: '' }])
            resetFields()
        })
    }
    const addModal = () => {
        dispatch({
            type: 'auditLog/setState',
            payload: {
                modalVisiable: true
            },
        })
    }
    const delModal = ()=>{
        let aa = getFieldsValue(['modalNmae'])
        dispatch({
            type: 'auditLog/delModal',
            payload: {
                uuid: aa.modalNmae
            },
        })
    }
    const onSelectOpt = (value) => {
        dispatch({
            type: 'auditLog/modalMess',
            payload: {
                uuid: value
            },
        })
    }
    const modalOpts = {
        title: '操作模块',
        visible: auditLogVisiable,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 100,
    }

    // 适用范围查询条件搜索---start
    return (
        <Modal {...modalOpts} width="45%" footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>, <Button key="ok" onClick={onOk}>确定</Button>]}>
            <Form layout="horizontal">
                <Row gutter={[4, 12]} style={{ backgroundColor: '#eef2f9' }}  >
                    <Col push={2} xl={{ span: 18 }} md={{ span: 18 }} sm={{ span: 18 }} key="modalNmae">
                        <FormItem label="模块名" {...formItemLayout} style={{ marginTop: 8, marginBottom: 8 }} >
                            {getFieldDecorator('modalNmae', {
                                initialValue: "",
                            })(
                                <Select
                                    showSearch
                                    getPopupContainer={() => document.body}
                                    onSelect={onSelectOpt}
                                >
                                    {ModalList.map(item => <Select.Option value={item.uuid} >{item.description}</Select.Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col push={1} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }} key="button" >
                        <Button onClick={addModal} style={{ marginTop: 12, marginRight: 5 }}>+</Button>
                        <Button onClick={delModal} style={{ marginTop: 12, textAlign: 'center' }}>-</Button>
                    </Col>
                </Row>
                <div style={{ height: '20px' }}></div>
                {tempList.map(templet => (<Row key={`row_${templet.index}`} >
                    <Col push={1} span={9} key={`col_${templet.index}_0`}>
                        <FormItem label="名称" hasFeedback {...formItemLayout2} key={`name_${templet.index}`} style={{ marginTop: 4, marginBottom: 4 }} >
                            {getFieldDecorator(`name${templet.index}`, {
                                initialValue: templet.name,
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(<Input placeholder='请输入key值' />)}
                        </FormItem>
                    </Col>
                    <Col push={1} span={9} key={`col_${templet.index}_1`}>
                        <FormItem label="键值" hasFeedback {...formItemLayout2} key={`description_${templet.index}`} style={{ marginTop: 4, marginBottom: 4 }} >
                            {getFieldDecorator(`description${templet.index}`, {
                                initialValue: templet.description,
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(<Input placeholder='请输入value值' />)}
                        </FormItem>
                    </Col>
                    <Col span={4} key={`col_${templet.index}_2`}>
                        <Button disabled={tempList.length === 1} onClick={jianhao.bind(this, templet.index)} style={{ float: 'right', marginTop: 6, marginBottom: 4 }}>-</Button>
                        <Button onClick={jiahao} style={{ marginRight: 5, float: 'right', marginTop: 6, marginBottom: 4 }}>+</Button>
                    </Col>
                </Row>)
                )}
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
