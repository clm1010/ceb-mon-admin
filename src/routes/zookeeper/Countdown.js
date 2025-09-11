import React from 'react'
import { Icon, Button, Tooltip } from 'antd'
import myStyle from './myStyle.css'
import questionPic from "./question.png"

class Countdown extends React.Component {
    constructor(props) {
        super(props)
        this.dispatch = this.props.dispatch
        this.initValue = this.props.initValue
        this.dubboType = this.props.dubboType
        this.dubboMsg = this.props.dubboMsg
        this.state = {
            count: this.initValue,
        }
        this.step = this.props.step || 1
    }

    componentWillReceiveProps(nextProps) {
        this.dispatch = nextProps.dispatch
        this.initValue = nextProps.initValue
        this.dubboType = nextProps.dubboType
        this.dubboMsg = nextProps.dubboMsg
        this.q = nextProps.q
        this.state = { count: this.initValue }
        this.step = nextProps.step || 1
    }

    stop = () => {
       window.clearInterval(this.interval)
    }
    start = () => {
        clearInterval(this.interval)

        this.interval = setInterval(() => {
            let count = this.state.count - this.step
            if (this.props.onStep) {
                this.props.onStep(count)
            }
            if (count == 0) {
                this.dispatch({
                    type: 'zookeeper/dubbo',
                    payload: {
                        q:this.q
                    },
                })
            } else {
                this.setState({ count })
            }
        }, 1000)
    }
    componentDidMount() {
        this.dispatch({
            type: 'zookeeper/dubbo',
            payload: {},
        })
        this.start()
    }

    componentWillUnmount() {
        this.stop()
    }

    render() {
        return (
            <span style={{ float: 'right', marginBottom: '15px' }}>
                <div style={{ float: 'right', marginTop: 5, marginRight: 75, fontSize: 15 }}>dubbo服务可用状态：
                    {(this.dubboType === true) ?
                        <span className={myStyle.countStyle} style={{ backgroundColor: 'green' }}></span>
                        :
                        <span>
                            <span className={myStyle.countStyle} style={{ backgroundColor: 'red' }}></span>
                            <Tooltip placement="topRight" title={this.dubboMsg}>
                                <img className={myStyle.question} src={questionPic} alt=''></img>
                            </Tooltip>
                        </span>
                    }
                </div>
            </span>)
    }
}

export default Countdown
