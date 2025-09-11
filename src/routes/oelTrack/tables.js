import React, { Component } from 'react';
import { Table, Row, Input } from 'antd'
import './tableStyle.css'
class tables extends Component {
    constructor(props) {
        super(props)
        this.state.list = props.dataSource
        this.item = props.item
        this.tkey = props.tkey
    }
    state = {
        list: [],
    }
    componentWillReceiveProps(nextProps) {
        this.state.list = nextProps.dataSource
        this.item = nextProps.item
        if(nextProps.tkey){
            this.query()
        }else{
            clearInterval(this.ref)
        }
    }
    stop = () =>{
        clearInterval(this.ref)
        this.props.dispatch({
            type: 'oelTrack/setState',
            payload: {
                tkey:false
            },
        })
    }
    query = () => {
        clearInterval(this.ref)
        this.ref = setInterval(() => {
            this.props.dispatch({
                type: 'oelTrack/findById',
                payload: {
                    currentItem: this.item
                },
            })
            this.props.dispatch({
                type: 'oelTrack/setState',
                payload: {
                    forbind:false
                },
            })
        }, 30000)
    }
    componentDidMount = () => {
        if(this.tkey){
            this.query()
        }
    }
    componentWillUnmount = () => {
        this.stop()
    }
    render() {
        return (
            <div className='tableStyle'>
                <Row>
                    <Table
                        columns={this.props.colums}
                        dataSource={this.state.list}
                        size="small"
                        bordered
                        rowKey={record => record.key}
                        scroll={{ x: 750 }}
                        pagination={false}
                    />
                </Row>
            </div>
        )
    }
}
export default tables
