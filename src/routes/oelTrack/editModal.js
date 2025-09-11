import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, TreeSelect, Select, Tabs, Row, Col, Icon, Collapse, Button, DatePicker, Radio, InputNumber } from 'antd'
import moment from 'moment'
const RadioGroup = Radio.Group
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
const formItemLayout3 = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 6,
    },
}
const formItemLayout1 = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 11,
    },
}
const ColProps = {
    style: {
        marginBottom: 8,
        textAlign: 'right',
    },
}
const Colpost = {
    style: {
        marginLeft: 30,
        marginBottom: 8,
        textAlign: 'right',
    },
}
const Colpost1 = {
    style: {
        marginBottom: 8,
        textAlign: 'right',
    },
}
const Colpost2 = {
    style: {
        marginTop: 10,
        marginLeft: 140,
        marginBottom: 20,
        color: '#000',
    },
}
const colstyle = {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'right',
}
const FormItemProps = {
    style: {
        margin: 0,
    },
}

const modal = ({
    dispatch,
    visible,
    filter,
    timertype,
    typeValue,
    item,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
    },
}) => {
    let {
        n_CustomerSeverity, n_AppName, nodeAlias, alertGroup, node, n_ComponentType, n_SumMaryCn, firstOccurrence1, lastOccurrence1, n_MaintainETime1, n_MaintainStatus, nextalart, num, createdTime, oz_LimitTime,
    } = item
    let firstobj = { interval: '', action: '', value: '' ,name:'' , voice:''}
    let {
        filterItems = [{ ...firstobj }],
        filterIndex = [0],
    } = filter
    if (filterItems && filterItems.length === 0) {
        filterItems = [{ ...firstobj }]
    }
    if (filterIndex && filterIndex.length === 0) {
        filterIndex = [0]
    }
    if (filterIndex.length != filterItems.length) {
        let indexs = []
        if (filterItems.length > 1) {
            filterItems.forEach((item, index) => {
                indexs.push(index)
            })
        } else {
            indexs = [0]
        }
        filterIndex = indexs
    }
    const onOk = () => {
        validateFieldsAndScroll((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            //如果有时间的数据，转换成时间戳
            for (let field in data) {
                if (typeof (data[field]) === 'object') {
                    data[field] = Date.parse(data[field])
                }
            }
            let fields = []
            let filterIndex = [0]
            if (filter && filter.filterIndex && filter.filterIndex.length > 0) {
                filterIndex = filter.filterIndex
            }
            if (filter && filter.filterItems && filter.filterItems.length > 0 && filter.filterItems.length != filterIndex.length) {
                let indexs = []
                filter.filterItems.forEach((item, index) => {
                    indexs.push(index)
                })
                filterIndex = indexs
            }

            filterIndex.forEach((num) => {
                fields.push(`interval_${num}`)
                fields.push(`action_${num}`)
                fields.push(`name_${num}`)
                fields.push(`voice_${num}`)
            })
            const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
            let arrs = []
            filterIndex.forEach((num, index) => {
                let bean = {}
                bean.action = valObj[`action_${num}`]
                bean.interval = valObj[`interval_${num}`]
                bean.name = valObj[`name_${num}`]
                bean.voice = valObj[`voice_${num}`]
                arrs.push(bean)
            })
            let changeData = {
                name:data.name,
                actions: arrs,
                traceType: data.traceType,
                oz_LimitTime: timertype == 'TIMELIMIT' ? data.oz_LimitTime : 0,
                cycleMechanism: data.cycleMechanism,
                beginTime: typeValue == 'CUSTOM' ? data.date : item.beginTime,
            }
            const payload = { ...item, ...changeData }
            dispatch({
                type: 'oelTrack/update',											//抛一个事件给监听这个type的监听器
                payload,
            })
            resetFields()
        })
    }

    const onCancel = () => { //弹出窗口中点击取消按钮触发的函数
        resetFields()
        dispatch({
            type: 'oelTrack/setState', //抛一个事件给监听这个type的监听器
            payload: {
                editModalvisible: false,
                timeFileinfo: {},
                timertype: '',
            },
        })
    }
    const onChangetimer = (e) => {
        let val = e.target.value
        let arrs = allColumsVals()
        let maxValue = 0
        for (let val of filterIndex) {
            maxValue = (maxValue < val ? val : maxValue)
        }
        let arrIndex = []
        let arrItem = []
        if (val === 'ORDINARY') {
            filter.basicItems = arrs
            if (filter.advancedItems && filter.advancedItems.length > 0) {
                arrItem = filter.advancedItems
                filter.advancedItems.forEach((num, index) => {
                    arrIndex.push(maxValue + 1 + index)
                })
            } else {
                arrIndex.push(maxValue + 1)
            }
        } else {
            filter.advancedItems = arrs
            if (filter.basicItems && filter.basicItems.length > 0) {
                arrItem = filter.basicItems
                filter.basicItems.forEach((num, index) => {
                    arrIndex.push(maxValue + 1 + index)
                })
            } else {
                arrIndex.push(maxValue + 1)
            }
        }
        filter.filterMode = val //模式

        filter.filterItems = arrItem //过滤条件
        filter.filterIndex = arrIndex //过滤条件下标的数组
        //    resetFields([])
        dispatch({
            type: 'oelTrack/setState',
            payload: {
                timertype: val,
                timeFileinfo: filter,
            },
        })
    }
    const typeChange = (value) => {
        dispatch({
            type: 'oelTrack/setState',
            payload: {
                typeValue: value,
            },
        })
    }
    const add = (index) => {
        let maxValue = 0
        for (let val of filterIndex) {
            maxValue = (maxValue < val ? val : maxValue)
        }
        //if(filterIndex.length > 0 && filterIndex.length < 11){ //把已经选择的值都保存一下。
        filterItems = allColumsVals()
        //}
        let indexList = [...filterIndex]
        indexList.splice(index + 1, 0, maxValue + 1) //插入下标的值

        let arrs = [...filterItems]
        arrs.splice(index + 1, 0, firstobj) //在指定的下标下面，插入一个数组元素
		/*
			测试用
		*/
        let newIndexList = []
        //if(filterIndex.length > 0 && filterIndex.length < 11){
        indexList.forEach((val, index) => {
            newIndexList.push(maxValue + 2 + index)
        })
        //}
        filter.filterItems = arrs
        filter.filterIndex = newIndexList
		/*
			修改过滤条件的集合
        */
        dispatch({
            type: 'oelTrack/setState',
            payload: {
                timeFileinfo: filter,
            },
        })
    }

    const remove = (myindex) => {
        let indexList = filterIndex.filter((val, index) => index != myindex)
        let arrs = filterItems.filter((item, index) => index != myindex)
        filter.filterItems = arrs
        filter.filterIndex = indexList
        /*

           修改过滤条件的集合
       */
        dispatch({
            type: 'oelTrack/setState',
            payload: {
                timeFileinfo: filter,
            },
        })
    }
    const allColumsVals = () => {
        let fields = []
        filterIndex.forEach((num) => {
            fields.push(`interval_${num}`)
            fields.push(`action_${num}`)
            fields.push(`name_${num}`)
            fields.push(`voice_${num}`)
            fields.push(`value_${num}`)
        })

        const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值

        let arrs = []
        filterIndex.forEach((num) => {
            let bean = {}
            bean.interval = valObj[`interval_${num}`]
            bean.action = valObj[`action_${num}`]
            bean.name = valObj[`name_${num}`]
            bean.voice = valObj[`voice_${num}`]
            bean.value = valObj[`value_${num}`]
            arrs.push(bean)
        })
        return arrs
    }
    //数值验证
    const blurFunctions = (rulr, value, callback) => {
        let regx = /^\+?[1-9][0-9]*$/
        if (!regx.test(value)) {
            callback('Please enter a positive integer！')
        } else {
            callback()
        }
    }
    const loop = data => data.map((item, index) => {
        switch (timertype) {
            case 'ORDINARY':
                return (
                    <Row gutter={8} key={`row_${filterIndex[index]}`} >
                        <div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
                            <Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                                <FormItem {...FormItemProps} hasFeedback key={`interval_info_${filterIndex[index]}`}>
                                    {
                                        getFieldDecorator(`interval_${filterIndex[index]}`, {
                                            initialValue: item.interval,
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                                {
                                                    validator: blurFunctions,
                                                },
                                            ],
                                        })(<InputNumber min={1} precision={1} style={{ width: '100%', height: '100%' }} />)
                                    }
                                </FormItem>
                            </Col>
                        </div>
                        <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`name_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`name_${filterIndex[index]}`, {
                                        initialValue: item.name,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`action_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`action_${filterIndex[index]}`, {
                                        initialValue: item.action,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`voice_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`voice_${filterIndex[index]}`, {
                                        initialValue: item.voice ? item.voice : 'default',
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select >
                                        <Option value="default">默认</Option>
                                        <Option value="five">声音5分钟</Option>
                                        <Option value="ten">声音10分钟</Option>
                                        <Option value="fifteen">声音15分钟</Option>
                                        <Option value="twenty-five">声音25分钟</Option>
                                        <Option value="thirty">声音30分钟</Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_5`} style={{ textAlign: 'right' }} {...ColProps} xl={3} md={3} >
                            <Button.Group style={{ width: '100%' }}>
                                <Button type="default" icon="minus" onClick={() => remove(index)} disabled={data.length === 1} />
                                <Button type="default" icon="plus" onClick={() => add(index)} />
                            </Button.Group>
                        </Col>
                    </Row>
                )
            case 'TIMELIMIT':
                return (
                    <Row gutter={8} key={`row_${filterIndex[index]}`} >
                        <div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
                            <Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                                <FormItem {...FormItemProps} hasFeedback key={`interval_info_${filterIndex[index]}`}>
                                    {
                                        getFieldDecorator(`interval_${filterIndex[index]}`, {
                                            initialValue: item.interval,
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                                {
                                                    validator: blurFunctions,
                                                },
                                            ],
                                        })(<InputNumber min={1} precision={1} style={{ width: '100%', height: '100%' }} />)
                                    }
                                </FormItem>
                            </Col>
                        </div>
                        <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`name_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`name_${filterIndex[index]}`, {
                                        initialValue: item.name,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`action_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`action_${filterIndex[index]}`, {
                                        initialValue: item.action,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 5 }} md={{ span: 5 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`voice_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`voice_${filterIndex[index]}`, {
                                        initialValue: item.voice ? item.voice : 'default',
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select >
                                        <Option value="default">默认</Option>
                                        <Option value="five">声音5分钟</Option>
                                        <Option value="ten">声音10分钟</Option>
                                        <Option value="fifteen">声音15分钟</Option>
                                        <Option value="twenty-five">声音25分钟</Option>
                                        <Option value="thirty">声音30分钟</Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_5`} style={{ textAlign: 'right' }} {...ColProps} xl={3} md={3} >
                            <Button.Group style={{ width: '100%' }}>
                                <Button type="default" icon="minus" onClick={() => remove(index)} disabled={data.length === 1} />
                                <Button type="default" icon="plus" onClick={() => add(index)} />
                            </Button.Group>
                        </Col>
                    </Row>
                )
        }
    })

    const myConditionItem = loop(filterItems)

    const modalOpts = {
        title: '编辑告警跟踪',
        visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 100,
    }
    return (
        <Modal {...modalOpts} width="850px" footer={[<Button key="cancdata" onClick={onCancel}>关闭</Button>, <Button key="submit" type="primary" onClick={onOk}>确定</Button>]}>
            <Form layout="horizontal">
                <Tabs defaultActiveKey="templet_1">
                    <TabPane tab={<span><Icon type="user" />重要信息</span>} key="templet_1">
                        <FormItem label="跟踪名称" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: item.name ? item.name : "",
                                rules: [
                                    {
//                                        required: true,
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                    </TabPane>
                </Tabs>
                <Collapse bordered={false}>
                    <Panel header="基本信息">
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>应用系统</b> : {n_AppName}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>IP地址</b> : {nodeAlias}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 22 }} md={{ span: 22 }} sm={{ span: 22 }}><b style={{ textDecoration: 'underline' }}>告警详情</b> : {n_SumMaryCn}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>级别</b> :{n_CustomerSeverity}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>主机名</b> : {node}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>告警组</b> : {alertGroup}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>告警大类</b> : {n_ComponentType}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>首次发生时间</b> : {firstOccurrence1}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>末次发生时间</b> : {lastOccurrence1}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>出维护期时间</b> : {n_MaintainETime1}</Col>
                        <Col style={{ marginBottom: 10, marginLeft: 25 }} xl={{ span: 11 }} md={{ span: 11 }} sm={{ span: 11 }}><b style={{ textDecoration: 'underline' }}>维护期状态</b> : {n_MaintainStatus}</Col>
                    </Panel>
                </Collapse>
                <Tabs>
                    <TabPane tab={<span><Icon type="switcher" />类型选择</span>} key="dingyi">
                        <span style={{ width: '100%', float: 'left' }}>
                            {
                                timertype == 'TIMELIMIT' ?
                                    <FormItem label="限期时间" key="oz_LimitTime" hasFeedback {...formItemLayout3}>
                                        {getFieldDecorator('oz_LimitTime', {
                                            initialValue: moment(moment(Number.parseInt(item.oz_LimitTime)).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
                                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                                    </FormItem>
                                    :
                                    <div {...Colpost2}>限期时间&nbsp;:&nbsp;&nbsp;未设置</div>
                            }
                        </span>

                        <span style={{ width: '100%', float: 'left' }}>
                            <FormItem label="定时器类型" key="type" hasFeedback {...formItemLayout}>
                                {getFieldDecorator('traceType', {
                                    initialValue: item.traceType,
                                })(<RadioGroup onChange={onChangetimer} >
                                    <Radio value="ORDINARY">普通</Radio>
                                    <Radio value="TIMELIMIT">限期</Radio>
                                </RadioGroup>)}
                            </FormItem>
                        </span>
                    </TabPane>
                </Tabs>
                {
                    ((timertype == 'TIMELIMIT')) ?
                        <div>
                            <Tabs>
                                <TabPane tab={<span><Icon type="setting" />告警跟踪循环机制定义</span>} key="dingyi">
                                    <Row>
                                        <Col key="nsss" xl={{ span: 6 }} md={{ span: 6 }}>
                                            <div style={colstyle}>循环机制:限期时间到达之前&nbsp;</div>
                                        </Col>
                                        <Col {...Colpost1} xl={{ span: 16 }} md={{ span: 16 }}> {myConditionItem}</Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </div>
                        :
                        <div>
                            <Tabs>
                                <TabPane tab={<span><Icon type="setting" />告警跟踪循环机制定义</span>} key="dingyi">
                                    <Row>
                                        <Col key="soso" xl={{ span: 12 }} md={{ span: 12 }}>
                                            <div style={{ position: 'relative' }} id="area1" />
                                            <FormItem label="开始时间" hasFeedback {...formItemLayout1}>
                                                {getFieldDecorator('cycleMechanism', {
                                                    initialValue: item.cycleMechanism,
                                                })(<Select
                                                    onChange={typeChange}
                                                    getPopupContainer={() => document.getElementById('area1')}
                                                >
                                                    <Select.Option value="FIRSTOCCURRENCE">首次发生时间</Select.Option>
                                                    <Select.Option value="OUTMAINTAIN">出维护期时间</Select.Option>
                                                    <Select.Option value="CUSTOM">自定义时间</Select.Option>
                                                </Select>)}
                                            </FormItem>
                                        </Col>
                                        {
                                            (typeValue == 'CUSTOM') ?
                                                <Col xl={{ span: 10 }} md={{ span: 10 }}>
                                                    <FormItem label="" key="date" hasFeedback {...formItemLayout}>
                                                        {getFieldDecorator('date', {
                                                            initialValue: moment(moment(Number.parseInt(item.beginTime)).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
                                                        })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
                                                    </FormItem>
                                                </Col>
                                                :
                                                null
                                        }
                                    </Row>
                                    <Row>
                                        <Col key="nsss" xl={{ span: 6 }} md={{ span: 6 }}>
                                            <div style={colstyle}>重复时间点：</div>
                                        </Col>
                                        <Col {...Colpost1} xl={{ span: 16 }} md={{ span: 16 }}> {myConditionItem}</Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </div>
                }
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
