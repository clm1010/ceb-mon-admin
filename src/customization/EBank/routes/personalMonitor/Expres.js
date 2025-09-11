import React from 'react'
import contentSytle from './express.less'
import { Tag } from 'antd'

const expres = ({ promql,CurveData }) => {
    let exps, indicator, indicatorkey, indicatorvalue, servicekey, servicevalue, tagskey, tags, end
    if (promql) {
        //解析表达式
        exps = promql.match(/\{([\S \s]*)\}/)[1]
        //表达式结果
        end = promql.match(/\}(\S*)/)[1]
        //指标
        indicator = promql.match(/(\S*)\{/)[1]
        //命名空间
        indicatorkey = exps.split(',')[0].split('=')[0]
        indicatorvalue = exps.split(',')[0].split('=')[1]
        //service
        servicekey = exps.split(',')[1].split('=')[0]
        servicevalue = exps.split(',')[1].split('=')[1]
        //tags
        tagskey = exps.split(',')[2].split('=')[0]
        tags = exps.split(',')[2].split('=')[1]
    }
    let expresValues = []
    let metric = {}
    if(CurveData.length>0){

        metric = CurveData[0].metric
    }

    const objKeys = Object.keys(metric)
    const showResult = objKeys.map((item)=>{
        return  <li className={contentSytle.liStyle}><Tag color="green">{item}</Tag>:{metric[item]}</li>
    })
    return (
        // <div className={contentSytle.content}>
        //     {indicator} 
        //     {'\u007B'}
        //     {indicatorkey} =  <Tag color="green">{indicatorvalue}</Tag> ,
        //     {servicekey}= <Tag color="green">{servicevalue}</Tag> ,
        //     {tagskey}= <Tag color="green">{tags} </Tag> 
        //     {'\u007d'}
        //     {end}  <Tag color="green">{indicatorvalue}</Tag>
        // </div>
        <div className={contentSytle.content}>
            <ul>
                {showResult}
            </ul>
        </div>
    )

}

export default expres