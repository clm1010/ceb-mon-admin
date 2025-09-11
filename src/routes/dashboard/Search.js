import React from 'react'
import { Icon, Form, Button, Row, Col, Input, DatePicker, Select, TreeSelect, Radio, Checkbox, InputNumber, message } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
    style: { marginBottom: 4 },
}
const formItemLayout1 = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
    style: { marginBottom: 4 },
}
class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state.schema = props.filterSchema
        this.state.dispatch = props.dispatch
        this.state.queryPreProcess = props.queryPreProcess
    }
    componentWillReceiveProps(props) {
        this.state.schema = props.filterSchema
        this.state.dispatch = props.dispatch
        this.state.queryPreProcess = props.queryPreProcess
    }
    state = {
        schema: [],
        appSelt: ''
    }

    getStringTypeValue = (key, val) => {
        let condition = {}
        condition[key] = val
        if (val == 'ALL' || val == '') {

        } else {
            return { term: condition }
        }
    }
    getArrayTypeValue = (key, val, objmap) => {
        let result = {}
        let condition = []    
        if (objmap && objmap.size > 0) {
            let bean = objmap.get(key)
            if (bean && bean.showType && bean.showType === 'between') {
                result = { range: { clock: { gt: Date.parse(val[0])/1000, lt: Date.parse(val[1])/1000 } } }
            } else {  // 域内分区
                val.forEach((item) => {
                    condition.push({ term: { appname: item } })
                })
                if (condition.length > 0) {
                    result = { bool: { should: condition } }
                }
            }
        }
        return result
    }
    query = () => {
        let data = this.props.form.getFieldsValue()
        let queryTerms = []
        let netDomain = data.netDomain
        let appName = data.appName || []
        const fields = this.state.schema
        let myMap = new Array()
        if (fields && fields.length > 0) {
            fields.forEach((bean, index) => {
                if (bean.key == 'netDomain') {
                    bean.children.forEach((item) => {
                        if (item.key == netDomain) {
                            myMap = item.children
                        }
                    })
                }
            })
        }
        let selectedMap = new Map()
        if (fields && fields.length > 0) {
            fields.forEach((bean, index) => {
                selectedMap.set(bean.key, bean)
            })
        }
        if(data.createdTime && data.createdTime.length>0){
            queryTerms.push(data.createdTime)
        }
        if (netDomain && netDomain !== '' && (appName == undefined || appName.length == 0)) {
            myMap.forEach((item) => {
                appName.push(item)
            })
            this.props.form.resetFields('appName')
        }
        for (let [key, value] of Object.entries(data)) {
            if (key == 'appName') {
                value = appName
            }
            if (key !== 'netDomain') {
                switch (typeof (value)) {
                    case 'string':
                        if (value && value.length > 0 && value != 'ALL') {
                            queryTerms.push(this.getStringTypeValue(key, value, selectedMap))
                        }
                        break
                    case 'object':
                        if (value && value.length > 0) {
                            queryTerms.push(this.getArrayTypeValue(key, value, selectedMap))
                        }
                        break
                }
            }
        }
        this.props.onSearch(queryTerms)

    }
    transformSelect(field, key, getFieldDecorator) {
        const options = []
        const mySearchInfo = (input, option) => {
            return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        }
        field.options.forEach((option) => {
            options.push(<Option key={option.key} value={option.key} disabled={option.disabled || false}>{option.value}</Option>)
        })
        return (
            <Col xl={{ span: 4 }} md={{ span: 6 }} sm={{ span: 11 }} style={{ padding: 0 }} key={key}>
                <FormItem {...formItemLayout} label={field.title}>
                    {getFieldDecorator(field.key, { initialValue: field.defaultValue })(
                        <Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children" filterOption={mySearchInfo} getPopupContainer={() => document.body}>
                            {options}
                        </Select>
                    )}
                </FormItem>
            </Col>)
    }
    transformTreeSelect(field, key, getFieldDecorator, resetFields) {
        const onChangeApp = (value) => {
            resetFields('appName')
            this.setState({
                appSelt: value
            })
        }
        const netDomain = []
        const appName = []
        const mySearchInfo = (input, option) => {
            return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        }
        field.children.forEach((option) => {
            netDomain.push(<Option key={option.key} value={option.key} disabled={option.disabled || false}>{option.value}</Option>)
        })
        if (this.state.appSelt !== '') {
            let app = []
            field.children.forEach((item) => {
                if (this.state.appSelt == item.key) {
                    app = item.children
                }
            })
            app.forEach((option) => {
                appName.push(<Option key={option} value={option} >{option}</Option>)
            })
        }
        return (
            <>
                <Col xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 11 }} style={{ padding: 0 }} key={key}>
                    <FormItem {...formItemLayout} label={field.title}>
                        {getFieldDecorator(field.key, { initialValue: field.defaultValue })(
                            <Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children"
                                filterOption={mySearchInfo} getPopupContainer={() => document.body} onChange={onChangeApp} >
                                {netDomain}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 11 }} style={{ padding: 0 }} key={`${key}_appName`}>
                    <FormItem {...formItemLayout1} label='域内分区'>
                        {getFieldDecorator('appName', [])(
                            <Select allowClear showSearch placeholder={field.placeholder || '请选择'} optionFilterProp="children"
                                filterOption={mySearchInfo} getPopupContainer={() => document.body} mode='multiple'>
                                {appName}
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </>
        )
    }
    transformBetween(field, key, getFieldDecorator) {
        return (<Col xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 11 }} style={{ padding: 0 }} key={key} id={`date_time_area_${key}`}>
            <FormItem {...formItemLayout} label={field.title}>{
                getFieldDecorator(field.key, { initialValue: field.defaultValue })(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" getCalendarContainer={() => document.getElementById(`date_time_area_${key}`)} style={{ width: '100%' }} />
                )}
            </FormItem>
        </Col>)
    }
    parse(schema, getFieldDecorator, resetFields) {
        const children = []
        for (let i = 0; i < schema.length; i++) {
            switch (schema[i].showType) {
                case 'select':
                    children.push(this.transformSelect(schema[i], i, getFieldDecorator))
                    break
                case 'treeSelect':
                    children.push(this.transformTreeSelect(schema[i], i, getFieldDecorator, resetFields))
                    break
                case 'between':
                    children.push(this.transformBetween(schema[i], i, getFieldDecorator))
                    break
            }
        }
        return children
    }

    render() {
        const { schema, } = this.state
        const { getFieldDecorator, resetFields } = this.props.form
        const children = this.parse(schema, getFieldDecorator, resetFields)

        return (
            <Form style={{ backgroundColor: '#fff' }}>
                <Row gutter={24} style={{ paddingTop: 8 }}>
                    <Col span={24} >
                        {children}
                        <Col span={2} style={{ float: 'left', paddingTop: 4 }}>
                            <Button type="primary" shape='circle' icon='search' style={{ paddingTop: 2 }} onClick={this.query} />
                        </Col>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default Form.create()(Search)