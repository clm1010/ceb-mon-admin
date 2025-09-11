import React from 'react'
import { Form, Row, Col, Button, DatePicker, Input } from 'antd'
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
        this.state.branch_ips = props.branch_ips
    }

    state = {
        apiOption:[],
        branch_ips:[]
    }

    onOk = () => {
        const {
            getFieldsValue, validateFieldsAndScroll
        } = this.props.form

        validateFieldsAndScroll((errors, value) => {
            if (errors) {
                return
            }
            let data = {
                ...getFieldsValue(),
            }
            const time = {}
            if (data.systime != '') {
                time.start = moment(data.systime[0]).valueOf()
                time.end = moment(data.systime[1]).valueOf()
            }
            const q_array = []
            let message
            for (let key in data) {
                if(key == 'message' && data[key]  && data[key] != ''){
                    message = `\\\"${data[key]}\\\"`
                }else if (typeof data[key] === 'string' && data[key] && data[key] != '') {
                    q_array.push(`${key} == \"${data[key]}\"`)
                }
            }
            let q = ' | where '
            if(q_array.length > 0){
                q+= `${q_array.join(' & ')}`
            }
            if(this.state.branch_ips && this.state.branch_ips.length > 0){
                if(q_array.length > 0){
                    q += ` && ( ${this.state.branch_ips.join(' || ')})`
                }else{
                    q += ` (${this.state.branch_ips.join(' || ')})`
                }
            }
            if(q_array.length == 0 && this.state.branch_ips.length == 0){
                q = ''
            }
            const condition = {
                q: q,
                time: time,
                message
            }
            this.state.dispatch({
                type: 'qhNetLog/query',
                payload: condition, 
            })
        })
    }

    render() {
        const {
            getFieldDecorator,
        } = this.props.form

        return (
            <Form>
                <Row gutter={4} style={{ backgroundColor: '#eef2f9', padding: 8 }}>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="IP" key="source_ip" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('source_ip', {
                                initialValue: '',
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="时间" key="systime" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('systime', {
                                initialValue: [moment(new Date().getTime() - 1000 * 60 * 60), moment(new Date().getTime())],
                            })(<RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} md={{ span: 6 }} sm={{ span: 6 }} xm={{ span: 6 }}>
                        <FormItem label="内容" key="message" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('message', {
                                initialValue: '',
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 4 }}>
                        <span style={{ float: 'right',marginTop:5 }}>
                            <Button htmlType="submit" onClick={this.onOk}>查询</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        )
    }

}

export default Form.create()(search)