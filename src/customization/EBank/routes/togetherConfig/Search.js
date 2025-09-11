import React from 'react'
import { Tag, Input, Row, Col, DatePicker, Button, Form,Select } from 'antd'
import moment from 'moment'
import queryString from "query-string";

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 17,
    },
}
const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item
const Option = Select.Option

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state.searchArr = props.searchArr
        this.state.dispatch = props.dispatch
        this.state.serviceArea = props.serviceArea
    }

    static getDerivedStateFromProps(props, state) {
        return {
            serviceArea:props.serviceArea
        }
    }

    state = {

    }

    onAdd = ()=>{
        this.state.dispatch({
            type:"togetherConfig/updateState",
            payload:{
                visible:true,
                vList:[],
                type:"create"
            }
        })
    }
    onQuery = ()=>{
        this.props.form.validateFields((errors) => {
            if (errors) {
				return
			}
			const data = {
				...this.props.form.getFieldsValue(),
			}
            let q = ''
            for (let key in data) {
                if (typeof data[key] === 'string' && data[key] && data[key] != '') {
                    q += `${key}==${data[key]};`
                }
            }
            q = q.slice(0,q.length-1)
            if(q){
                this.state.dispatch({
                    type:"togetherConfig/query",
                    payload:{
                        data
                    }
                })
            }else{
                this.state.dispatch({
                    type:"togetherConfig/query",
                    payload:{
                    }
                })
            }

        })
    }
    render() {
        const {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
            resetFields,
            setFieldsValue,
        } = this.props.form
        const SelectServiceArea = this.state.serviceArea.map((item) => <Option value={item.value}>{item.name}</Option>)
        return (
            <div>
                <Row gutter={4} style={{ background: "#ecf0f7", paddingTop: 12, marginLeft: 0, marginRight: 0 }}>
                    <Col lg={8} md={8} sm={8} xs={8}>
                        <FormItem label="名称" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue: '',
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={8} xs={8}>
                        <FormItem label="组件类型" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('typ', {
                                initialValue: '',
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col lg={8} md={8} sm={8} xs={8}>
                        <FormItem label="服务域" hasFeedback {...formItemLayout}>
                            {getFieldDecorator('area', {
                                initialValue: '',
                            })(<Select style={{width:'100%'}} allowClear>
								{SelectServiceArea}
							</Select>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{ paddingTop: 12, paddingBottom: 12 }}>
                    <Col lg={6} md={6} sm={6} xs={6} >
                        <Button style={{ marginLeft: 8 }} onClick={this.onAdd} >新增</Button>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} push={15} >
                        <Button type="primary" style={{ float: 'right', marginRight: 8 }} onClick={this.onQuery}>查询</Button>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default Form.create()(Search)


