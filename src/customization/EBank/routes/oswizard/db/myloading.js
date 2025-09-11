import React from 'react'
import { Button, Progress } from 'antd'
let  load
class my_loading extends React.Component {
    constructor() {
        super();
        this.state = {
            num: 0,
            loading_state: false,
            loading_step: 2,
        }
    }

    static getDerivedStateFromProps(props, state) {
        console.log('getDerivedStateFromProps')
        console.log('loading_step:', Number(10 / (props.loading_step + 5)))
        if (state.loading_state && !props.loading_state) {
            clearInterval(load)
            return {
                num: 0,
                loading_state: props.loading_state,
            }
        }
        return {
            loading_state: props.loading_state,
            loading_step: Number(10 / (props.loading_step*1.2)) || 2
        }
    }

    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate')
        if (this.state.loading_state && this.state.num == 0) {
            this.onDown()
        }
    }

    onDown = () => {
        load = setInterval(() => {
            console.log('loadingNum', this.state.num)
            if (this.state.num >= 100) {
                clearInterval(load)
            }
            this.setState(() => {
                return {
                    num: this.state.num + this.state.loading_step,
                }
            })
        }, 100)
    }

    render() {
        return (
            <div>
                {
                    this.state.loading_state ?
                        <Progress style={{ paddingRight: 10 }} status='active' percent={Number(this.state.num).toFixed(2)} />
                        :
                        null
                }
            </div>
        )
    }
}

export default my_loading