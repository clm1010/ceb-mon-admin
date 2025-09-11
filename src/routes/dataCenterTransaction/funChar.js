import React from "react"
import Echart from '../../components/eChart/eTabsChart'
import { DatePicker, Col, Select } from 'antd'
import Cards from '../../components/card/card'
import moment from 'moment'
import ExtraComponent from './extra'
const { Option } = Select
const { RangePicker } = DatePicker

const funChar = ({ dispatch, loading, xAxis, unitState, yInAxis, yOutAxis, yInAvgAxis, yInMinAxis, yInMaxAxis, yOutAvgAxis, yOutMinAxis, yOutMaxAxis, yMonth, yInAxis1, yOutAxis1, name, EffectName, state }) => {

    function unitTran(unitState, indata, outdata) {
        if (unitState == 'G') {
            for (let i = 0; i < indata.length; i++) {
                indata[i] = (Math.round(((indata[i]) / 1000000000) * 100) / 100).toFixed(2)
            }
            for (let i = 0; i < outdata.length; i++) {
                outdata[i] = (Math.round(((outdata[i]) / 1000000000) * 100) / 100).toFixed(2)
            }
        } else if (unitState == 'M') {
            for (let i = 0; i < indata.length; i++) {
                indata[i] = (Math.round(((indata[i]) / 1000000) * 100) / 100).toFixed(2)
            }
            for (let i = 0; i < outdata.length; i++) {
                outdata[i] = (Math.round(((outdata[i]) / 1000000) * 100) / 100).toFixed(2)
            }
        } else if (unitState == 'K') {
            for (let i = 0; i < indata.length; i++) {
                indata[i] = (Math.round(((indata[i]) / 1000) * 100) / 100).toFixed(2)
            }
            for (let i = 0; i < outdata.length; i++) {
                outdata[i] = (Math.round(((outdata[i]) / 1000) * 100) / 100).toFixed(2)
            }
        }
    }

    // Echart图表
    const EchartProps = {
        title: '',
        subtext: '',
        legend: { data: ['总行端口输入流量实际值', '总行端口输出流量实际值'] },
        tooltip: { trigger: 'axis' },//tooltip
        toolbox: { show: true, feature: { dataView: { show: true, readOnly: true } } },//toolbox
        dataZoom: [{ show: true, realtime: true }],//dataZoom
        titleColor: '#D3D7DD',
        minHeight: '260px',//高度minHeight   ,
        xAxis: [{ type: 'category', data: xAxis }],
        yAxis: [{ type: 'value', show: true, axisLabel: { formatter: `${unitState}` == 0 ? '{value}Kbps' : `${unitState}` == 1 ? '{value}Mbps' : '{value}Gbps' } }],
        seriesDay: [{ name: '总行端口输入流量实际值', type: 'line', data: yInAxis, markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] }, markLine: { data: [{ type: 'average', name: '均值' }] } },
        { name: '总行端口输出流量实际值', type: 'line', data: yOutAxis, markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] }, markLine: { data: [{ type: 'average', name: '均值' }] } }],
        seriesMonth: [
            { name: '总行端口输入流量平均值', type: 'line', data: yInAvgAxis },
            { name: '总行端口输入流量最小值', type: 'line', data: yInMinAxis },
            { name: '总行端口输入流量最大值', type: 'line', data: yInMaxAxis },
            { name: '总行端口输出流量平均值', type: 'line', data: yOutAvgAxis },
            { name: '总行端口输出流量最小值', type: 'line', data: yOutMinAxis },
            { name: '总行端口输出流量最大值', type: 'line', data: yOutMaxAxis }
        ],
        loading,
        EffectName,
        name,
        dispatch
    }
    const extra = {
        dispatch,
        EffectName,
        values: [...yMonth]
    }

    // 时间选择
    const on = (value) => {
        let start = moment(value[0]).unix()
        let end = moment(value[1]).unix()
        let temp = parseInt((end - start) / 86400)
        if (temp > 10) {
            message.error('选取时间范围超过10天,不支持查询')
            return
        }
        dispatch({
            type: `dataCenterTransaction/setState`,
            payload: {
                [`loading_${EffectName}`]: true
            },
        })
        dispatch({
            type: "dataCenterTransaction/query_pre",
            payload: {
                name,
                start: moment(value[0]).unix() * 1000,
                end: moment(value[1]).unix() * 1000
            }
        })
    }

    // 粒度选择
    const onSelect = (option) => {
        let temple = 86400000 // 一天
        switch (option) {
            case 'day': temple *= 0
                break
            case 'three': temple *= 2
                break
            case 'five': temple *= 4
                break
            case 'ten': temple *= 9
        }
        let start = new Date().getTime() - temple
        dispatch({
            type: `dataCenterTransaction/setState`,
            payload: {
                [`loading_${EffectName}`]: true
            },
        })
        dispatch({
            type: "dataCenterTransaction/query_pre",
            payload: {
                name,
                start: start,
                end: new Date().getTime(),
            }
        })
    }
    const onUnit = (option, [...yInAxis], [...yOutAxis]) => {
        unitTran(option, yInAxis, yOutAxis)
        dispatch({
            type: "dataCenterTransaction/setState",
            payload: {
                [`yInAxis${EffectName}`]: yInAxis,
                [`yOutAxis${EffectName}`]: yOutAxis,
                [`unitState${EffectName}`]: option == 'K' ? 0 : option == 'M' ? 1 : 2,
            }
        })
    }
    //图表右上角操作区域
    const Extra = [
        <RangePicker
            // showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm:ss'
            placeholder={['开始时间', '结束时间']}
            size='small'
            style={{ width: 190 }}
            onChange={(value) => on(value)}
            key='RangePicker'
        />,
        <Select
            key='Time'
            placeholder='时间'
            size='small'
            style={{ width: 100 }}
            onSelect={(option) => onSelect(option)}
        >
            <Option key='day' value='day'>当天</Option>
            <Option key='three' value='three'>前三天</Option>
            <Option key='five' value='five'>前五天</Option>
            <Option key='ten' value='ten'>前十天</Option>
        </Select>,
        <Select
            key='Unit'
            placeholder='单位'
            size='small'
            style={{ width: 70 }}
            onSelect={(option) => onUnit(option, yInAxis1, yOutAxis1)}
        >
            <Option key='K' value='K'>K</Option>
            <Option key='M' value='M'>M</Option>
            <Option key='G' value='G'>G</Option>
        </Select>
    ]

    //F环 酒仙桥 图表
    const CardsProps = {
        con: <Echart {...EchartProps} />,
        extra: state == 'month' ? <ExtraComponent {...extra} /> : Extra,//右上角操作区域
        actions: [],//底部操作按钮
        size: 'default',// default
        title: name,
        loading: false,
        minHeight: ''
    }

    return (
        <div>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div style={{ marginTop: 2 }}>
                    <Cards {...CardsProps} />
                </div>
            </Col>
        </div>
    )
}
export default funChar
