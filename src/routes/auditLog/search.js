import React from 'react'
import { Form, Row, Col, Select, Button, DatePicker, Input } from 'antd'
import Option from './option'
import moment from 'moment'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
    style: { marginBottom: 4 },
}

class search extends React.Component {

    constructor(props) {
        super(props)
        this.state.dispatch = props.dispatch
        this.state.ModalList = props.ModalList
        this.state.apiList = props.apiList
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ModalList: nextProps.ModalList,
            condition: nextProps.condition,
            apiList:nextProps.apiList,
        }
    }


    state = {
        apiOption: [],
        ModalList:[],
        apiList:[]
    }

    onOk = () => {
        const {
            validateFields, getFieldsValue, resetFields, validateFieldsAndScroll, setFieldsValue, getFieldValue,
        } = this.props.form

        validateFieldsAndScroll((errors, value) => {
            if (errors) {
                return
            }
            let data = {
                ...getFieldsValue(),
            }
            const time = {}
            if (data.time != '') {
                time.start = moment(data.time[0]).valueOf()
                time.end = moment(data.time[1]).valueOf()
            }
            const q_array = []
            let keyword = ''
            for (let key in data) {
                if (key === 'keyword' && data[key] != '') {
                    keyword = `\\\"${data[key]}\\\"`
                } else if (typeof data[key] === 'string' && data[key] && data[key] != '') {
                    q_array.push(`${key} == \"${data[key]}\"`)
                }
            }
            const condition = {
                q: q_array.length > 0 ? `| where ${q_array.join(' && ')}` : null,
                message: keyword,
                time: time
            }
            this.state.dispatch({
                type: 'auditLog/query',
                payload: condition,
            })
        })
    }

    onModal = () => {
        this.state.dispatch({
            type: 'auditLog/setState',
            payload: {
                auditLogVisiable: true,
                apiList:[],
                ModalList:[]
            },
        })
        this.state.dispatch({
            type: 'auditLog/modalQuery',
            payload: {},
        })
    }

    onChange = (value,e) => {
        this.state.dispatch({
            type: 'auditLog/modalMess',
            payload: {
                uuid: e.key
            },
        })

        // if (value) {
        //     const aa = Option[value] && Option[value].map(item => <Option value={item.value}>{item.name}</Option>)
        //     this.setState({ apiOption: aa })
        // } else {
        //     this.setState({ apiOption: [] })
        // }
    }

    render() {
        const {
            getFieldDecorator,
        } = this.props.form

        return (
            <Form>
                <Row gutter={4} style={{ backgroundColor: '#eef2f9', padding: 8 }}>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="模块" key="module" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('module', {
                                initialValue: '',
                            })(<Select
                                allowClear={true}
                                showSearch
                                onChange={this.onChange}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    this.state.ModalList.map(item =><Select.Option value={item.name} key={item.uuid}>{item.description}</Select.Option>)
                                }
                                {/* <Option value="User">用户</Option>
                                <Option value="Role">角色</Option>
                                <Option value="ReporterStatus">历史告警</Option>
                                <Option value="MO">监控对象</Option>
                                <Option value="NotificationRule">通知规则</Option>
                                <Option value="Rule">策略规则</Option>
                                <Option value="RuleInst">监控实例</Option>
                                <Option value="EventsMenuConf">监控告警右键菜单</Option>
                                <Option value="SelfService">主机监控自服务</Option> */}
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="用户" key="user" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('user', {
                                initialValue: '',
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="时间" key="time" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('time', {
                                initialValue: [moment(new Date().getTime() - 1000 * 60 * 60), moment(new Date().getTime())],
                            })(<RangePicker
                                allowClear={true}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="操作" key="api" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('api', {
                                initialValue: '',
                            })(<Select allowClear={true}>
                                {this.state.apiList.map(item=><Select.Option value={item.name} key={item.uuid}>{item.description}</Select.Option>)}
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="关键字" key="keyword" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('keyword', {
                                initialValue: '',
                            })(<Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={4} style={{ marginTop: 8, marginBottom: 12, marginLeft: 8, marginRight: 8 }}>
                    <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <span style={{ float: 'left' }}>
                            <Button htmlType="submit" onClick={this.onModal}>模块</Button>
                        </span>
                        <span style={{ float: 'right' }}>
                            <Button htmlType="submit" onClick={this.onOk}>查询</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        )
    }

}

export default Form.create()(search)