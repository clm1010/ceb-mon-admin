import React, { Component } from "react";
import { DatePicker, Select } from 'antd'
import moment from 'moment'
const { RangePicker, MonthPicker } = DatePicker
const { Option } = Select

class ExtraComponent extends Component {
    constructor(props) {
        super(props)
        this.state.dispatch = props.dispatch
        this.state.values = props.values
        this.state.EffectName = props.EffectName
    }
    componentWillReceiveProps(nextProps) {
        this.state.dispatch = nextProps.dispatch
        this.state.values = nextProps.values
        this.state.EffectName = nextProps.EffectName
    }
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    }

    unitTran(unitState, ...values) {
        if (unitState == 'G') {
            for (let i = 0; i < values[0].length; i++) {
                for (let j = 0; j < values.length; j++) {
                    values[j][i] = (Math.round(((values[j][i]) / 1000000000) * 100) / 100).toFixed(2)
                }
            }
        } else if (unitState == 'M') {
            for (let i = 0; i < values[0].length; i++) {
                for (let j = 0; j < values.length; j++) {
                    values[j][i] = (Math.round(((values[j][i]) / 1000000) * 100) / 100).toFixed(2)
                }
            }
        } else if (unitState == 'K') {
            for (let i = 0; i < values[0].length; i++) {
                for (let j = 0; j < values.length; j++) {
                    values[j][i] = (Math.round(((values[j][i]) / 1000) * 100) / 100).toFixed(2)
                }
            }
        }
    }

    onPicker = (value) => {
        /* 
            获取某月的开始和结束时间
            const startDate = moment().month(moment(value).month()).startOf('month').valueOf()+86400000;
            const endDate = moment().month(moment(value).month()).endOf('month').valueOf();
        */
        const startDate = moment(this.state.startValue).startOf('month').valueOf() + 86400000;
        let endDate
        if (new Date(value).getMonth() == new Date().getMonth()) {
            endDate = Date.parse(new Date());
        } else {
            endDate = moment(value).endOf('month').valueOf();
        }
        this.state.dispatch({
            type: `dataCenterTransaction/setState`,
            payload: {
                [`loading_${this.state.EffectName}`]:true
            },
        })
        this.state.dispatch({
            type: "dataCenterTransaction/query_Month",
            payload: {
                startDate: startDate,
                endDate: endDate,
                EffectName: this.state.EffectName,
                [`state_${this.state.EffectName}`]: 'month'
            }
        })
    }
    onUnit = (option) => {
        /* 
            解构+ 深拷贝
        */
        let [[...yInAvgAxis], [...yInMinAxis], [...yInMaxAxis], [...yOutAvgAxis], [...yOutMinAxis], [...yOutMaxAxis]] = [...this.state.values]
        this.unitTran(option, yInAvgAxis, yInMinAxis, yInMaxAxis, yOutAvgAxis, yOutMinAxis, yOutMaxAxis)
        this.state.dispatch({
            type: "dataCenterTransaction/setState",
            payload: {
                [`yInAvgAxis${this.state.EffectName}`]: [...yInAvgAxis],
                [`yInMinAxis${this.state.EffectName}`]: [...yInMinAxis],
                [`yInMaxAxis${this.state.EffectName}`]: [...yInMaxAxis],
                [`yOutAvgAxis${this.state.EffectName}`]: [...yOutAvgAxis],
                [`yOutMinAxis${this.state.EffectName}`]: [...yOutMinAxis],
                [`yOutMaxAxis${this.state.EffectName}`]: [...yOutMaxAxis],
                unitStateAXS: option == 'K' ? 0 : option == 'M' ? 1 : 2
            }
        })
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
    };

    onEndChange = value => {
        this.onChange('endValue', value);
        this.onPicker(value)
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
    };

    render() {
        const { endOpen } = this.state;
        return (
            <>
                <MonthPicker
                    key='MonthPicker1'
                    format='YYYY-MM'
                    placeholder="开始"
                    size='small'
                    style={{ width: 100 }}
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                <MonthPicker
                    key='MonthPicker2'
                    format='YYYY-MM'
                    placeholder="结束"
                    size='small'
                    style={{ width: 100, marginRight:5 }}
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                />
                <Select
                    key='Unit'
                    placeholder='单位'
                    size='small'
                    style={{ width: 70 }}
                    onSelect={(option) => this.onUnit(option)}
                >
                    <Option key='K' value='K'>K</Option>
                    <Option key='M' value='M'>M</Option>
                    <Option key='G' value='G'>G</Option>
                </Select>
            </>
        )
    }
}

export default ExtraComponent