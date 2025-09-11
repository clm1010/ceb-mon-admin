import React, { Component } from 'react'
import { Modal, Button, message, Icon } from 'antd'
const confirm = Modal.confirm
class Countdown extends Component {
    constructor (props) {
        super(props) // 当父组件向子组件传递数据时，需要在这里传入props。
        this.dispatch =props.dispatch
        this.state.abled = true
        this.record = props.record
        this.item = props.item
        this.nowtime = props.nowDate
    }
    componentWillReceiveProps (props) {
        this.dispatch =props.dispatch
        this.record = props.record
        this.item = props.item
        this.nowtime = props.nowDate
        this.query()
    }
    state = {
        abled: true,
    }
    onDone = (record , dispatch, item) => {
          confirm({
            title: '当前环节已处理完成?',
            onOk() {
              let obj = {}
              if (record) {
                if (record.handled) {
                  message.error(`已经通知过${record.action}了`)
                  return
                }
                if (record.uuid) {
                  obj.action = record.action
                  obj.interval = record.interval
                  obj.name = record.name
                  obj.voice = record.voice
                  obj.handled = true
                  obj.uuid = record.uuid
                }
                dispatch({
                  type: 'oelTrack/updateAction1',
                  payload: {
                    obj,
                    currentItem:item
                  },
                })
              }
            },
          })
      }
    query=() => {
        clearInterval(this.timer)
        let timeLag = this.record.timePoint
        let nowtime = this.nowtime
        let chavalue = parseInt(nowtime, 10) - parseInt(timeLag, 10)
        this.timer = setInterval(() => { // 创建倒计时定时器
            chavalue += 1000
            let time = chavalue
            if (time >= 0) { 
                this.setState({
                    abled: false,
                })
                clearInterval(this.timer)
            }else{
              this.setState({
                abled:true
              })
            }
        }, 1000)
    }
    componentDidMount=() => {
        this.query()
    }
    componentWillUnmount=() => {
        clearInterval(this.timer) 
    }
    render () {
        return (<div>
            <Button style={{background:'#000c17'}} size="large" shape="circle" disabled={this.state.abled} onClick={() => this.onDone(this.record ,this.dispatch , this.item)}>
              { this.state.abled ? 
                <Icon type='tool' style={{fontSize:26 , color:'#ff4242'}}/>
                :
                <Icon type='tool' style={{fontSize:26 , color:'#52C41A'}}/>
              }
            </Button>
          </div>)
    }
}

export default Countdown
