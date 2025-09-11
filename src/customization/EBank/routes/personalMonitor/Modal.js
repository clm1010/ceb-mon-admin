import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'throttle-debounce/debounce'
import RegularCurve from './HookeChart'
import Expres from './Expres'
import { Form, Modal, Tabs, Select, Icon, Input, Radio, Button, InputNumber, Spin } from 'antd'
import './modal.less'
const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 15,
    },
}
const formItemLayout1 = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}
const formItemLayout2 = {
    labelCol: {
        span: 0,
    },
    wrapperCol: {
        span: 22,
    },
}
const formItemLayout3 = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 18,
    },
}
const formItemLayout4 = {
    labelCol: {
        span: 0,
    },
    wrapperCol: {
        span: 24,
    },
}
const modal = ({
    visible,
    item,
    dispatch,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        setFieldsValue,
    },
    showCurve,
    listTag,
    fetchingtag,
    listIndicator,
    fetchingindicator,
    modalType,
    paramTag,
    cluster,
    namespace,
    service,
    CurveData
}) => {

    const onOk = () => {
        validateFields((errors) => {
            if (errors) {
                return
            }
            const data = {
                ...getFieldsValue(),
            }
            let tagString
            let tagUUIDs = []
            if (Object.keys(paramTag).length > 0) {
                tagString = `${paramTag.key}=${paramTag.value}`
                tagUUIDs.push(paramTag.uuid)
                data.tagUUIDs = tagUUIDs
                delete data.tags
            }
            let op
            switch (data.operator) {
                case "EQUAL":
                    op = '='
                    break;
                case "NOT_EQUAL":
                    op = '!='
                    break;
                case "GREATER_THAN":
                    op = '>'
                    break;
                case "GREATER_THAN_OR_EQUAL":
                    op = '>='
                    break;
                case "LESS_THAN":
                    op = '<'
                    break;
                case "LESS_THAN_OR_EQUAL":
                    op = '<='
                    break;
                default:
                    break;
            }
            data.promql = `${data.indicator}{namespace=${data.namespace},service=${data.service},${tagString}}${op}${data.threshold}`
            dispatch({
                type: `personalMonitor/${modalType}`,											//抛一个事件给监听这个type的监听器
                payload: data
            })
            dispatch({
                type: 'personalMonitor/updateState',											//抛一个事件给监听这个type的监听器
                payload: {
                    modalVisible: false,
                    showCurve: false
                }
            })
            resetFields()
        })

    }

    const onCancel = () => {
        dispatch({
            type: 'personalMonitor/updateState',											//抛一个事件给监听这个type的监听器
            payload: {
                modalVisible: false,
                showCurve: false
            }
        })
        resetFields()
    }
    const modalOpts = {
        title: '个性化',
        visible,
        onOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        maskClosable: false,
        zIndex: 1000,
        width: "75%",
    }
    //适用范围查询条件搜索---start
    const mySearchInfo = (input, option) => {
        return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
    const onQueryCurve = () => {
        const data = {
            ...getFieldsValue(),
        }
        let cluster = data.clusterName ? `cluster='${data.clusterName}',` : null
        let namespace = data.namespace ? `namespace='${data.namespace}',` : null
        let service = data.service ? `service='${data.service}',` : null
        let tags = data.tags ? `${paramTag.key}='${paramTag.value}',` : null
        // let tags = null
        let indicator = data.indicator
        let query =  '{'
        if(cluster){
            query+=cluster
        }
        if(namespace){
            query+=namespace
        }
        if(service){
            query+=service
        }
        if(tags){
            query+=tags
        }
        let aa = ''
        if(query.length == 1){
            aa = ''
        }else{
            aa = query.substr(0,query.length-1) + "}"
        }
        let end = parseInt(new Date().getTime()/1000)
        let start = parseInt(new Date().getTime()/1000-24*60*60)
        dispatch({
            type: 'personalMonitor/updateState',											//抛一个事件给监听这个type的监听器
            payload: {
                showCurve: !showCurve,
            }
        })
        dispatch({
            type: 'personalMonitor/queryCurve',
            payload:{
                end: end,
                query: `${indicator}${aa}`,
                start: start
            }
        })
    }
    const onQueryCurve1 = () => {
        const data = {
            ...getFieldsValue(),
        }
        let cluster = data.clusterName ? `cluster='${data.clusterName}',` : null
        let namespace = data.namespace ? `namespace='${data.namespace}',` : null
        let service = data.service ? `service='${data.service}',` : null
        let tags = data.tags ? `${paramTag.key}='${paramTag.value}',` : null
        // let tags = null
        let indicator = data.indicator
        let query =  '{'
        if(cluster){
            query+=cluster
        }
        if(namespace){
            query+=namespace
        }
        if(service){
            query+=service
        }
        if(tags){
            query+=tags
        }
        let aa = ''
        if(query.length == 1){
            aa = ''
        }else{
            aa = query.substr(0,query.length-1) + "}"
        }
        let end = parseInt(new Date().getTime()/1000)
        let start = parseInt(new Date().getTime()/1000-24*60*60)
        dispatch({
            type: 'personalMonitor/queryCurve',
            payload:{
                end: end,
                query: `${indicator}${aa}`,
                start: start
            }
        })
    }

    //end


    const expresProps = {
        promql: item.promql,
        CurveData

    }
    const regularCurveProps = {
        CurveData
    }
    const optionTag = []
    listTag.forEach((item, index) => {
        optionTag.push(<Option key={item.uuid} value={item.uuid}>{item.name}</Option>)
    })

    const optionIndicator = []
    listIndicator.forEach((item, index) => {
        optionIndicator.push(<Option key={item.uuid} value={item.name}>{item.name}</Option>)
    })

    const clusterOption = []
    cluster.forEach((item, index) => {
        clusterOption.push(<Option key={item} value={item}>{item}</Option>)
    })
    
    const namespaceOption = []
    namespace.forEach((item, index) => {
        namespaceOption.push(<Option key={item} value={item}>{item}</Option>)
    })
    
    const serviceOption = []
    service.forEach((item, index) => {
        serviceOption.push(<Option key={item} value={item}>{item}</Option>)
    })

    const queryTag = (value) => {
        //先改变当前状态为正在查询中
        dispatch({
            type: `personalMonitor/updateState`,
            payload: {
                fetchingtag: true,	//修改下拉列表状态为查询中
                listTag: [], //每次查询都清空上一次查到的集合
            },
        })
        dispatch({
            type: `personalMonitor/queryTag`,
            payload: {
                q: `name == *${value}*`,
                pageSize: 20,
            },
        })
    }
    const queryIndicator = (value) => {
        //先改变当前状态为正在查询中
        dispatch({
            type: `personalMonitor/updateState`,
            payload: {
                fetchingindicator: true,	//修改下拉列表状态为查询中
                listIndicator: [], //每次查询都清空上一次查到的集合
            },
        })
        dispatch({
            type: `personalMonitor/queryIndicator`,
            payload: {
                q: `name == *${value}*`,
                pageSize: 50,
            },
        })
    }
    const getTaginof = (item) => {
        dispatch({
            type: `personalMonitor/queryTag`,
            payload: {
                q: `uuid == ${item}`,
                pageSize: 10,
            },
        })
    }
    const OnCluster = (value)=>{
        dispatch({
            type:'personalMonitor/queryToolLable',
            payload:{
                query:`kube_service_info{cluster='${value}'}`,
                label:"namespace"
            }
        })
    }
    const OnCNameSpace = (value)=>{
        dispatch({
            type:'personalMonitor/queryToolLable',
            payload:{
                query:`kube_service_info{namespace='${value}'}`,
                label:"service"
            }
        })
    }

    const queryExpres = (value)=>{
        let end = parseInt(new Date().getTime()/1000)
        let start = parseInt(new Date().getTime()/1000-24*60*60)

        dispatch({
            type: 'personalMonitor/queryCurve',
            payload:{
                end: end,
                query: value,
                start: start
            }
        })
    }

    let optionExpres = []
    optionExpres = CurveData.map((item)=>{
        let metric = item.metric
        const keys = Object.keys(metric)
        let expres = ''
        
        let arrkeys = []
        for(let i=0;i<keys.length;i++){
            let temp = keys[i]
            if(temp !== '__name__'){
                arrkeys.push(`${temp}='${metric[temp]}'`)
            }
        }
        let OptionVal = '' + metric['__name__']+'{' + arrkeys.join(',')+'}'
        return <Option key={OptionVal} value={OptionVal}>{OptionVal}</Option>
    })

    const onClose  = (value)=>{
        dispatch({
            type: 'personalMonitor/updateState',											//抛一个事件给监听这个type的监听器
            payload: {
                showCurve: !showCurve,
            }
        })
    }
    return (
        <Modal {...modalOpts}>
            <Form layout="horizontal">
                <Tabs defaultActiveKey="templet_1">
                    <TabPane tab={<span><Icon type="user" />基本信息</span>} key="templet_1">
                        <FormItem label="名称" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: item.name,
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label="备注" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('description', {
                                initialValue: item.description,
                                rules: [
                                ],
                            })(<Input.TextArea rows={4} />)}
                        </FormItem>
                        <FormItem label="类型" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('category', {
                                initialValue: item.category ? item.category : "SPECIAL",
                                rules: [
                                ],
                            })(<Radio.Group buttonStyle="solid" disabled>
                                <Radio.Button value='STANDARD'>标准指标</Radio.Button>
                                <Radio.Button value='SPECIAL'>个性化指标</Radio.Button>
                                <Radio.Button value='RATIO'>同环指标</Radio.Button>
                                <Radio.Button value='AGGREGATION'>全域指标汇聚</Radio.Button>
                            </Radio.Group>)}
                        </FormItem>
                    </TabPane>
                </Tabs>
                <Tabs defaultActiveKey="templet_1">
                    <TabPane tab={<span><Icon type="user" />配置规则</span>} key="templet_2">
                    <div className='Monitorrow'>
                        <div className='Monitorrow0'>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label="集群" hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('clusterName', {
                                        initialValue: item.clusterName,
                                        rules: [
                                            // {
                                            //     required: true,
                                            // },
                                        ],
                                    })(<Select
                                        allowClear
                                        showSearch
                                        getPopupContainer={() => document.body}
                                        filterOption={mySearchInfo}
                                        onSelect={OnCluster}
                                    >
                                        {clusterOption}
                                    </Select>)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label="命名空间" hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('namespace', {
                                        initialValue: item.namespace,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select
                                        allowClear
                                        showSearch
                                        getPopupContainer={() => document.body}
                                        filterOption={mySearchInfo}
                                        onSelect={OnCNameSpace}
                                    >
                                        {namespaceOption}
                                    </Select>)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label="服务" hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('service', {
                                        initialValue: item.service,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select
                                        allowClear
                                        showSearch
                                        getPopupContainer={() => document.body}
                                        filterOption={mySearchInfo}
                                    >
                                        {serviceOption}
                                    </Select>)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label="指标" hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('indicator', {
                                        initialValue: item.indicator,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select
                                        notFoundContent={fetchingindicator ? <Spin size="small" /> : null}
                                        allowClear
                                        showSearch
                                        onSearch={debounce(800, queryIndicator)}
                                        getPopupContainer={() => document.body}
                                        filterOption={mySearchInfo}
                                    >
                                        {optionIndicator}
                                    </Select>)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label="标签" hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('tags', {
                                        initialValue: (item.tags && item.tags.length > 0) ? item.tags[0].name : null,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select
                                        notFoundContent={fetchingtag ? <Spin size="small" /> : null}
                                        allowClear
                                        showSearch
                                        onSearch={debounce(800, queryTag)}
                                        getPopupContainer={() => document.body}
                                        onSelect={getTaginof}
                                        filterOption={mySearchInfo}
                                    >
                                        {optionTag}
                                    </Select>)}
                                </FormItem>
                            </span>
                        </div>
                        <div  className='Monitorrow3'>
                            {
                               showCurve ? 
                                <span style={{ width: '100%', float: 'left', textAlign: 'center' }}>
                                    <Button type='primary' icon="search" size='small' onClick={onQueryCurve1} />
                                </span>
                                :
                                null
                             }
                        </div>
                        <div className='Monitorrow1'>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label='粒度' hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('interval', {
                                        initialValue: item.interval ? item.interval : 1,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select  >
                                        <Option value={1}>粒度1分钟</Option>
                                        <Option value={5}>粒度5分钟</Option>
                                    </Select>)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label='持续时间' hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('duration', {
                                        initialValue: item.duration ? item.duration : 1,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<InputNumber
                                        min={1}  precision={0} style={{ width: "100%" }}
                                        formatter={value => `${value}分`}
                                        parser={value => value.replace('分', '')}
                                    />)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label='操作符' hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('operator', {
                                        initialValue: item.operator ? item.operator : "EQUAL",
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select  >
                                        <Option key="EQUAL" value="EQUAL">=</Option>
                                        <Option key="NOT_EQUAL" value="NOT_EQUAL">!=</Option>
                                        <Option key="GREATER_THAN" value="GREATER_THAN">&gt;</Option>
                                        <Option key="GREATER_THAN_OR_EQUAL" value="GREATER_THAN_OR_EQUAL">&gt;=</Option>
                                        <Option key="LESS_THAN" value="LESS_THAN">&lt;</Option>
                                        <Option key="LESS_THAN_OR_EQUAL" value="LESS_THAN_OR_EQUAL">&lt;=</Option>
                                    </Select>)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label='阈值' hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('threshold', {
                                        initialValue: item.threshold ? item.threshold : 1,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<InputNumber min={1} step={1} precision={1} style={{ width: "100%" }} />)}
                                </FormItem>
                            </span>
                            <span style={{ width: '20%', float: 'left' }}>
                                <FormItem label='级别' hasFeedback {...formItemLayout1}>
                                    {getFieldDecorator('severity', {
                                        initialValue: item.severity ? item.severity : 1,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select  >
                                        <Option value={1}>一级</Option>
                                        <Option value={2}>二级</Option>
                                        <Option value={3}>三级</Option>
                                        <Option value={4}>四级</Option>
                                        <Option value={5}>五级</Option>
                                    </Select>)}
                                </FormItem>
                            </span>
                        </div>
                        <div className='Monitorrow2'>
                           {
                               showCurve ? 
                            <span style={{ width: '100%', float: 'left', textAlign: 'center' }}>
                                <Button type='primary' icon="up" size='small' onClick={onClose} />
                            </span>
                            :
                            <span style={{ width: '100%', float: 'left', textAlign: 'center' }}>
                                <Button type='primary' icon="down" size='small' onClick={onQueryCurve} />
                            </span>
                           }
                        </div>
                    </div>
                        
                    <div className={showCurve ? 'showChart' : "hiddenChart"}>
                             <Select allowClear showSearch onSelect={queryExpres} filterOption={mySearchInfo}> 
                                    {optionExpres}
                            </Select>
                            <div className='showqxt'>
                                <RegularCurve {...regularCurveProps} />
                            </div>
                            <div className="expres">
                                <Expres {...expresProps} />
                            </div>
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
    onOk: PropTypes.func,
}
export default Form.create()(modal)