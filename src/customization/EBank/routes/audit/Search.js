import React from 'react'
import { Tag, Input, Row, Col, DatePicker, Button, Select } from 'antd'
import sty from './style.css'
import './rangePicker.css'
import { query_es } from './ES_DSL'
import lodash from 'lodash'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker

class search extends React.Component {
    constructor(props) {
        super(props)
        this.state.searchArr = props.searchArr
        this.state.dispatch = props.dispatch
    }

    static getDerivedStateFromProps(props, state) {
        return {
            searchArr: props.searchArr
        }
    }

    state = {
        startTime: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
        endTime: new Date().getTime(),
        es_dsl: lodash.cloneDeep(query_es),
        // sTimeFormat: new Date(new Date().setHours(0, 0, 0, 0)).format('yyyy-MM-dd hh:mm:ss'),
        // eTimeFormat: new Date().format('yyyy-MM-dd hh:mm:ss')
    }

    onClose = (key, e) => {
        const newSearchArr = this.state.searchArr.filter(item => item.value != key)
        this.state.dispatch({
            type: 'audit/setState',
            payload: {
                searchArr: newSearchArr
            }
        })
    }

    transformeES = (values) => {
        const obj = {}
        values.forEach(item => {
            if (obj[item.name]) {
                obj[item.name].push(item.value)
            } else {
                obj[item.name] = [item.value]
            }
        })
        for (let key in obj) {
            if (obj[key].length > 1) {
                const es_should = {
                    bool: {
                        should: []
                    }
                }
                obj[key].forEach(item => {
                    es_should.bool.should.push({
                        term: {
                            [key]: item
                        }
                    })
                })
                this.state.es_dsl.query.bool.must.push(es_should)
            } else {
                let es_terms = {
                    term: {
                        [key]: obj[key][0]
                    }
                }
                this.state.es_dsl.query.bool.must.push(es_terms)
            }
        }
    }

    onClick = () => {
        this.transformeES(this.state.searchArr)
        let es = lodash.cloneDeep(this.state.es_dsl)
        this.setState({
            es_dsl: lodash.cloneDeep(query_es)
        })
        this.state.dispatch({
            type: 'audit/query',
            payload: {
                es: es,
                startTime: this.state.startTime,
                endTime: this.state.endTime,
            }
        })

    }

    onChange = (time, timeString) => {
        let start, end
        if (time.length > 0) {
            start = moment(time[0]).valueOf()
            end = moment(time[1]).valueOf()
        }
        this.setState({
            startTime: start,
            endTime: end,
        })
        this.state.dispatch({
            type: 'audit/queryTree',
            payload: {
                startTime:moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
            }
        })
        this.state.dispatch({
            type: 'audit/query',
            payload: {
                startTime: start,
                endTime: end,
            }
        })
    }

    render() {
        const {
            searchArr,
            startTime,
            endTime
        } = this.state

        let TagsValue = []
        searchArr.forEach(element => {
            TagsValue.push(<Tag closable style={{ padding: 0, marginLeft: 6, marginTop: 6 }} color="#2db7f5" key={element.value} onClose={this.onClose.bind(this, element.value)} >{element.name}: {element.value}</Tag>)
        });

        return (
            <Row gutter={[12, 0]} style={{ background: "#fff", paddingTop: 12, paddingBottom: 12, marginLeft: 0, marginRight: 0 }}>
                <Col lg={5} md={5} sm={5} xs={5}>
                    <RangePicker defaultValue={[moment(startTime), moment(endTime)]} showTime format="YYYY-MM-DD HH:mm:ss" className='rangePicker' style={{ width: '100%' }} onOk={this.onChange} />
                </Col>
                <Col lg={17} md={17} sm={17} xs={17}>
                    <div className={sty.search}> {TagsValue} </div>
                </Col>
                <Col lg={2} md={4} sm={2} xs={2}>
                    <Button shape='circle' icon='search' type="primary" style={{ width: "36px", height: "36px" }} onClick={this.onClick} />
                </Col>
            </Row>
        )
    }

}

export default search


