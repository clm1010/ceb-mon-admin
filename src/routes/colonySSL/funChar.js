import React from "react"
import Echart from '../../components/eChart/eChart'
import { DatePicker, Col } from 'antd'
import Cards from '../../components/card/card'
import moment from 'moment'

const { RangePicker } = DatePicker

const funChar = ({ dispatch, xAxis, yVSAxis, yConAxis, loading, effectsPath, reducersPath, name }) => {

    //Cards Echart
    const CardsEchart = {
        title: '',
        subtext: '',
        legend: { data: ['SSL每秒连接', 'SSL-VS并发'] },
        tooltip: { trigger: 'axis' },//tooltip
        toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
        dataZoom: [{ show: true, realtime: true }],//dataZoom
        titleColor: '#D3D7DD',
        minHeight: '250px',//高度minHeight
        xAxis: [{ type: 'category', data: xAxis }],
        yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value}' }, max(value) { return value.max + 1 } }],
        series: [{ name: 'SSL每秒连接', type: 'line', data: yConAxis }, { name: 'SSL-VS并发', type: 'line', data: yVSAxis }],
        loading: loading
    }

    //Cards选择时间区间
    const onCards = (value) => {
        dispatch({
            type: effectsPath,
            payload: {
                name,
                starTime: moment(value[0]).unix() * 1000,
                endTime: moment(value[1]).unix() * 1000
            }
        })
    }

    //Cards组件右上角操作区域
    const CardsExtra = [
        <RangePicker
            showTime={{ format: 'HH:mm' }}
            format='YYYY-MM-DD HH:mm:ss'
            placeholder={['开始时间', '结束时间']}
            size='small'
            style={{ width: 200 }}
            onOk={(value) => onCards(value)}
            key='RangePicker'
        />
    ]

    //Cards趋势图
    const CardsProps = {
        con: <Echart {...CardsEchart} />,
        extra: CardsExtra,//右上角操作区域
        actions: [],//底部操作按钮
        size: 'small',// default
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
