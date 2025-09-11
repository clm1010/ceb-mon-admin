import React from 'react'
import {  Row, Col, Icon } from 'antd'

class DateNow extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getTime();
      }

      componentDidMount() {
        this.setTimer();
      }

      componentWillUnmount() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
      }

      setTimer() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.updateClock.bind(this), 1000);
      }

      updateClock() {
        this.setState(this.getTime, this.setTimer);
      }

      getWeek(weekNum){
        switch (weekNum) {
          case 1:
              return ' 星期一'
          case 2:
              return ' 星期二'
          case 3:
              return ' 星期三'
          case 4:
              return ' 星期四'
          case 5:
              return ' 星期五'
          case 6:
              return ' 星期六'
          case 7:
              return ' 星期日'
          break;
            default:
              return ''
        }
      };

      getTime() {
        const currentTime = new Date();
        return {
          years:currentTime.getFullYear(),
          months:currentTime.getMonth()+1,
          days:currentTime.getDate(),
          hours: currentTime.getHours(),
          minutes: currentTime.getMinutes(),
          seconds: currentTime.getSeconds(),
          weeks: this.getWeek(currentTime.getDay()),
          ampm: currentTime.getHours() >= 12 ? '下午 ' : '上午 '
        }
      }

      render() {
        const {years,months,days,hours, minutes, seconds, weeks, ampm} = this.state;
        return (
          <div style={{fontSize: 16, color: '#FFFF00', verticalAlign:'middle',textAlign:'center', marginBottom:'2px'}}>
                <Row>
                  <Icon style={{color:"red"}}type="clock-circle-o" />
                  {' ' + years}年
                  {months < 10 ? `0${months}` : months}月
                  {days < 10 ? `0${days}`+ '日 ':　days + '日 '}
                  {weeks + ' '}
                  {ampm}
                  {
                    hours == 0 ? 12 : hours
                  }:{
                  minutes > 9 ? minutes : `0${minutes}`
                  }:{
                    seconds > 9 ? seconds : `0${seconds}`
                  }
                </Row>
          </div>
        )
      }
    }
export default DateNow;
