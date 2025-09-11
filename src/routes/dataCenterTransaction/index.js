import React from "react"
import { connect } from 'dva'
import { Row, Col } from 'antd'
import Menus from '../dashboard/performance/Menus'
import FunChar from './funChar'
import { getSourceByKey } from '../../utils/FunctionTool'
const moValues = getSourceByKey('DataCenterTransaction')

const dataCenterTransaction = ({ dispatch, dataCenterTransaction }) => {
    //菜单组件
    const menuProps = {
        current: 'dataCenterTransaction',
        dispatch
    }

    const loopFunChar = moValues.sort((a,b)=>{
        return a.sortOrder - b.sortOrder
    }).map(item => {
        const props = {
            dispatch,
            effectsPath: 'dataCenterTransaction/query_pre',
            reducersPath: 'dataCenterTransaction/setState',
            name: item.name,
            EffectName:item.key,
            xAxis: dataCenterTransaction[`xAxis${item.key}`],
            yInAxis: dataCenterTransaction[`yInAxis${item.key}`],
            yOutAxis: dataCenterTransaction[`yOutAxis${item.key}`],
            yInAxis1: dataCenterTransaction[`yInAxis${item.key}1`],
            yOutAxis1: dataCenterTransaction[`yOutAxis${item.key}1`],
            unitState: dataCenterTransaction[`unitState${item.key}`],
            yInAvgAxis: dataCenterTransaction[`yInAvgAxis${item.key}`],
            yInMinAxis: dataCenterTransaction[`yInMinAxis${item.key}`],
            yInMaxAxis: dataCenterTransaction[`yInMaxAxis${item.key}`],
            yOutAvgAxis: dataCenterTransaction[`yOutAvgAxis${item.key}`],
            yOutMinAxis: dataCenterTransaction[`yOutMinAxis${item.key}`],
            yOutMaxAxis: dataCenterTransaction[`yOutMaxAxis${item.key}`],
            yMonth: dataCenterTransaction[`yMonth${item.key}`] || [],
            state: dataCenterTransaction[`state_${item.key}`],
            loading: dataCenterTransaction[`loading_${item.key}`],
        }
        return <FunChar {...props} />
    })

    return (
        <div>
            <Row gutter={6}>
                <Col md={24} lg={24} xl={24}>
                    <Menus {...menuProps} />
                </Col>
            </Row>
            <Row >
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div style={{ marginTop: 2, height: '420px' }}>
                        {loopFunChar}
                    </div>
                </Col>
            </Row>
        </div>
    )
}
export default connect(({ dataCenterTransaction, loading }) => ({ dataCenterTransaction, loading: loading }))(dataCenterTransaction)
