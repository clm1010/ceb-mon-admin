import { Row, Col, Button } from "antd";
import React from "react";
import Statistics from "./statistics";
import TimeStic from "./timeStic"
import DetailsStic from './detailsStic'

class TraceBack extends React.Component {
    constructor(props) {
        super(props)
    }
    onclice = () =>{

    }
    render() {
        return (
            <div style={{ padding: 6 ,backgroundColor:"#eef2f9" }} >
                <Row>
                    <Statistics {...this.props} />
                </Row>
                <Row>
                    <TimeStic {...this.props} />
                </Row>
                <Row>
                    <DetailsStic {...this.props} />
                </Row>
            </div>
        )
    }
}

export default TraceBack