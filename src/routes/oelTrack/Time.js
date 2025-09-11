import React, { Component } from 'react'
import sound from '../../../public/alerttrace.mp3'
import five from '../../../public/five.mp3'
import ten from '../../../public/ten.mp3'
import fifteen from '../../../public/fifteen.mp3'
import twentyfive from '../../../public/twenty-five.mp3'
import thirty from '../../../public/thirty.mp3'
class Countdown extends Component {
    constructor (props) {
        super(props) // 当父组件向子组件传递数据时，需要在这里传入props。
        this.dispatch =props.dispatch
        this.state.starTime =props.starTime
        this.state.endTime = props.endTime 
        this.state.sty = props.sty
        this.state.msg = props.msg
        this.state.voice = props.voice
        this.state.showtime = ''
        this.state.actionName = props.actionName
        this.item = props.item
        this.onlyOne = props.onlyOne
        this.state.nowtime = props.nowDate
    }
    componentWillReceiveProps (props) {
        this.dispatch = props.dispatch
        this.state.starTime = props.starTime
        this.state.voice = this.state.voice == props.voice ? props.voice : props.forbind ? props.voice : ''
        this.state.msg = this.props.msg
        this.state.showtime = ((this.state.showtime == '00:00:00'  || this.state.showtime == '请处理') ? '' : this.state.showtime)
        this.item = props.item
        this.state.actionName = this.state.actionName == props.actionName ? props.actionName : props.forbind ? props.actionName : this.state.actionName
        this.state.nowtime = props.nowDate
        this.onlyOne = props.onlyOne
        this.state.endTime = props.forbind ? props.endTime : this.state.endTime
        this.state.forbind = props.forbind
        if (this.props.sty == 1) {
            this.DownTime()
        } else if (this.props.sty == 2) {
            this.CountTime()
        }
    }
    state = {
        starTime: 0,
        endTime: 0,
        sty: 0,
        showtime: '',
        voice:'',
        msg:'',
        actionName:'',
        nowtime:0,
        forbind:true
    }
    getActionName = (endTimes ,ModaldataSource,endTime ,actionName) =>{
        let name 
        if(ModaldataSource){
             ModaldataSource.forEach(element => {
                if(endTimes <= element.timePoint && element.timePoint < endTime && element.handled==false){
                    name = element.name
                    return name
                }
            });
        }
        return name ? name : actionName
    }
    genSound = (voice , onlyOne) => {
        let autoPlay = false
        if (this.state.showtime == '00:00:00' || this.state.showtime == '请处理') {
            autoPlay = true
        }
        if(!onlyOne){
            autoPlay = false
        }
        let key = autoPlay ? onlyOne : autoPlay
        let sounds 
        switch(voice){
            case 'default' : sounds = sound 
            break
            case 'five' : sounds = five 
            break
            case 'ten' : sounds = ten 
            break
            case 'fifteen' : sounds = fifteen 
            break
            case 'twenty-five' : sounds = twentyfive 
            break
            case 'thirty' : sounds = thirty 
            break
        }
        return <audio autoPlay={key} src={sounds} key={key} />
    }
    DownTime=() => {
        clearInterval(this.timer)
        let nowtime = this.state.nowtime
        let timeLag = parseInt(this.state.endTime, 10) - parseInt(nowtime, 10)
        this.timer = setInterval(() => { // 创建倒计时定时器
            timeLag -= 1000
            let time = timeLag // time为两个时间戳之间相差的秒数
            let clocker = '' // 打印出时间对象
            let timeobj = {
                seconds: Math.floor(time / 1000) % 60,
                minutes: Math.floor(time / 60 / 1000) % 60,
                hours: Math.floor(time / 60 / 60 / 1000),
            }
            clocker = `${(timeobj.hours)} 小时 ${(timeobj.minutes)} 分 ${(timeobj.seconds)} 秒`
            if (time <= 0) { 
                console.log(this.state.msg + '倒计时')
                clocker = this.state.msg
                this.setState({
                    showtime: clocker,
                    forbind:true
                })
                clearInterval(this.timer)
            }
            this.genSound( this.state.voice , this.onlyOne)
            this.setState({
                showtime: clocker,
                forbind:true
            })
        }, 1000)
    }
    CountTime =() => {
        clearInterval(this.timer)
        let nowtime = this.state.nowtime
        let timeLag = parseInt(nowtime, 10) - parseInt(this.state.starTime, 10)
        this.timer = setInterval(() => { // 创建倒计时定时器
            timeLag += 1000
            let time = timeLag // time为两个时间戳之间相差的秒数
            let clocker = '' // 打印出时间对象
            let timeobj = {
                seconds: Math.floor(time / 1000) % 60,
                minutes: Math.floor(time / 60 / 1000) % 60,
                hours: Math.floor(time / 60 / 60 / 1000),
            }
            clocker = `${(timeobj.hours)} 小时 ${(timeobj.minutes)} 分 ${(timeobj.seconds)} 秒`
            if (time <= 0) { // 当时间差小于等于0的时候证明倒计时已经过结束
                clocker = this.props.msg || '00:00:00'
                clearInterval(this.timer)
            }
            this.setState({
                showtime: clocker,
                forbind:true
            })
        }, 1000)
    }
    shouldComponentUpdate=()=>{
        if(!this.state.forbind){
            return false
        }else{
            return true
        }
    }
    componentDidMount=() => {
        if (this.props.sty == 1) {
            this.DownTime()
            if(this.item){
            }
        } else if (this.props.sty == 2) {
            this.CountTime()
        }
    }
    componentWillUnmount=() => {
        clearInterval(this.timer) 
    }
    render () {
        return (
          <span >{this.genSound( this.state.voice , this.onlyOne) }{ (this.state.showtime =='请处理' ||this.state.showtime =='已结束') && this.state.actionName ? <span>{this.state.actionName}： </span> : this.state.actionName ? <span>距{this.state.actionName}： </span>: null}{this.state.showtime}</span>
        )
    }
}

export default Countdown
