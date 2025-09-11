import React from "react"
import { connect } from 'dva'
import Menus from '../dashboard/performance/Menus'
import { Row, Col } from 'antd'
import FunChar from './funChar'
import { getSourceByKey } from '../../utils/FunctionTool'

const moValues = getSourceByKey('SSL-COLONY')

const colonySSL = ({ dispatch, location, colonySSL, loading }) => {

    const menuProps = {
        current: 'colonySSL',
        dispatch
    }

    const loopFunChar = moValues.map(item => {
        const props = {
            dispatch,
            xAxis: colonySSL[`${item.key}_xAxis`],
            yVSAxis: colonySSL[`${item.key}_yVSAxis`],
            yConAxis: colonySSL[`${item.key}_yConAxis`],
            loading: colonySSL[`${item.key}_loading`],
            effectsPath: 'colonySSL/query_pre',
            reducersPath: 'colonySSL/setState',
            name: item.name
        }
        return <FunChar {...props} />
    })

    return (
        <div>
            <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Menus {...menuProps} />
                </Col>
            </Row>
            <Row gutter={[4, 4]}>
                <div style={{ marginTop: 5 }}>
                    {loopFunChar}
                </div>
            </Row>
        </div>
    )
}
export default connect(({ colonySSL, loading }) => ({ colonySSL, loading: loading }))(colonySSL)
