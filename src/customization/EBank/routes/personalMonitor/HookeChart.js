import ReactEcharts from "echarts-for-react"
import React from 'react'


function RegularCurve(props) {
    let CurveData
    if(props.CurveData !== undefined){
        CurveData = props.CurveData
    }else{
        CurveData =  []
    }

    let xAxisIndex
    let xAxisNum = 0
    let xAxisData = []
    
    let seriesData = []
    let fristValue = {}
    CurveData.forEach((item,index)=>{
        if(item.values.length >= xAxisNum){
            xAxisIndex = index
            let data = []
            item.values.forEach((value)=>{
                data.push(value[1])
            })
            let obj = {
                data:data,
                type: 'line',
            }
            seriesData.push(obj)
        }
    })
    if(CurveData.length>0){
        CurveData[xAxisIndex].values.forEach((item)=>{
             xAxisData.push(new Date(parseInt(item[0])*1000).toLocaleString().replace(/:\d{1,2}$/,' '))
        })
        fristValue = CurveData[0].metric
    }

    const option = {
        xAxis: {
            type: 'category',
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis',
            formatter:`{b0};值:{c0}<br />container:${fristValue.container}<br />endpoint:${fristValue.endpoint}<br />instance:${fristValue.instance}<br />job:${fristValue.job}
            <br />pod:${fristValue.pod}<br />prometheus:${fristValue.prometheus}<br />prometheus_replica:${fristValue.prometheus_replica}<br />ump_project:${fristValue.ump_project}
            <br />name:${fristValue.__name__}`
        },
        series: seriesData,
        grid: {
            top: "5%",
            bottom:'12%',
        }
    }

    return (
        <ReactEcharts
            option={option}
            notMerge={true}
            style={{height: '99%', width: '99%'}}
        />
    )
}

export default RegularCurve