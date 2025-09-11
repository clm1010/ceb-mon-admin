
import React from 'react'
import { Icon, Form, Button, Row, Col, DatePicker, Input, Cascader, Select, Tooltip, Radio, Checkbox, InputNumber } from 'antd'
import { getFilterUrlMap } from './../../utils/FunctionTool'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import debounce from 'throttle-debounce/debounce'


const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
    style: { marginBottom: 4 },
}

const conditionFormItemLayout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 6,
    },
    style: { marginTop: 8, marginBottom: 4 },
}

class Filter extends React.Component {
    constructor(props) {
        super(props)
        this.state.props = props
    }

    static getDerivedStateFromProps(props) {
        return props
    }

    state = {
        props: {}
    }

    onChange = (checkedValue) => {
        this.state.dispatch({
            type: 'mainRuleInstanceInfo/updateState',
            payload: {
                checkedValue
            },
        })
    }

    render() {
        const {
            props
        } = this.state
        const {
            getFieldDecorator,
        } = this.props.form
        const options = props.options.map(item => {
            if (item.description.includes('default-true,')) {
                item.description = item.description.replace('default-true,', '')
            }
            return <Col>
                <Checkbox value={item.value} >{item.label}</Checkbox>
                <Tooltip title={item.description} overlayClassName='bmd'>
                    <Icon type="question" style={{ color: '#eb2f96', fontSize: "16px", marginTop: "7px", fontWeight: "900" }} />
                </Tooltip>
            </Col>
        })
        return (
            <Checkbox.Group
                className={props.className}
                defaultValue={props.value}
                disabled={props.disabled}
                onChange={this.onChange}
            >
                {options}
            </Checkbox.Group>
        )
    }
}

export default Form.create()(Filter)
