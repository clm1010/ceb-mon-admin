import React, { useState, useEffect, Fragment } from "react";
import { Checkbox, Icon, Drawer, Button,Tooltip } from 'antd'
import Sortable from 'sortablejs';
import { cloneDeep } from "lodash";
import Columns from './Columns'

const ViewColumns = JSON.parse(localStorage.getItem('dict')).historyColumn.filter(e => e.status == 0)
const user = JSON.parse(sessionStorage.getItem('user'))

class DynamiColumDrawerFun extends React.Component {

    constructor(props) {
        super(props);
        this.state.dispatch = props.dispatch
        this.state.DrawerVisible = props.DrawerVisible
        this.state.CustomColumns = props.CustomColumns   /// 显示的列
        this.state.timeStamp = props.timeStamp
        this.state.initColumState = props.initColumState
    }

    state = {
        selectColums: [],
        showColums: [],
        timeStamp: 0,
    }

    static getDerivedStateFromProps(props, state) {
        if (state.timeStamp != props.timeStamp) {
            let temShowColums = cloneDeep(ViewColumns)
            let col = props.CustomColumns.length > 0 ? props.CustomColumns : Columns
            // 通过用传进来的 列进行遍历，以保证列表的顺序不会改变

            // 显示 没有勾选的剩余数据
            let col2 = temShowColums.filter(item => {
                let a = true
                for (let index = 0; index < col.length; index++) {
                    if (col[index].key== item.key) {
                        return a = false
                    }
                }
                return a
            })
            temShowColums = [...col, ...col2]
            return {
                showColums: temShowColums,  /// 显示的列
                DrawerVisible: props.DrawerVisible,
                selectColums: col.map(item => item.key), // 选择的列
                timeStamp: props.timeStamp,
                initColumState:props.initColumState,
            }
        }
    }

    onClose = () => {
        this.state.dispatch({
            type: 'historyview/setState',
            payload: {
                DrawerVisible: false
            }
        })
    }

    onOk = () => {
        let _c = this.state.selectColums
        let col = this.state.showColums.filter(item => {
            for (let i = 0; i < _c.length; i++) {
                if (_c[i] == item.key) {
                    return true
                }
            }
        })
        let res = col.map(item => {
            return { title: item.name || item.title, dataIndex: item.key, key: item.key, width: 150 }
        })
        if(this.state.initColumState == ''){
            this.state.dispatch({
                type: 'historyview/createDefindColums',
                payload: {
                    user: user.username,
                    viewInfo: JSON.stringify(res),
                    viewKey: 'historyview'
                }
            })
        }else{
            this.state.dispatch({
                type: 'historyview/saveDefindColums',
                payload: {
                    user: user.username,
                    viewInfo: JSON.stringify(res),
                    viewKey: 'historyview',
                    uuid:this.state.initColumState
                }
            })
        }

    }

    onChange = (checkedValues, key) => {
        let value = checkedValues.target.value
        let checked = checkedValues.target.checked
        if (checked) {
            this.state.selectColums.push(value)
        } else {
            let index = this.state.selectColums.indexOf(value)
            this.state.selectColums.splice(index, 1)
        }
        this.setState({
            selectColums: this.state.selectColums
        })
    }
    reSet = ()=>{
        this.state.dispatch({
            type: 'historyview/delDefindColums',
            payload: {
                uuid:this.state.initColumState
            }
        })
    }
    render() {
        let col = this.state.selectColums
        let render
        render = this.state.showColums.map((item, index) => {
            let checked = false
            for (let i = 0; i < col.length; i++) {
                if (item.key == col[i]) {
                    checked = true
                }
            }
            return (<div key={item.key}>
                <span className='my-handle' style={{ margin: 6, cursor: 'pointer' }} ><Icon type="drag" /></span> <Checkbox key={item.key} value={item.key} onChange={this.onChange} checked={checked}><Tooltip title={item.key}>{item.name || item.title}</Tooltip></Checkbox>
            </div>)
        })
        //className={style.DynamiCol}
        return (
            <Fragment>
                <Drawer
                    closable={false}
                    onClose={this.onClose}
                    width={300}
                    visible={this.state.DrawerVisible}
                >
                    <h3> 请选择列表</h3>
                    <div id="itxst" style={{height:800 , overflow:'scroll'}}>
                        {
                            render
                        }
                    </div>
                    <div style={{ marginTop: 10, textAlign: "center" }}>
                        <Button onClick={this.onOk} type="primary">确定</Button> <Button onClick={this.reSet} >恢复默认列表</Button>
                    </div>
                </Drawer>
            </Fragment>
        )
    }

    onEnd = (evt) => {
        const oldEl = this.state.showColums.splice(evt.oldIndex, 1);
        this.state.showColums.splice(evt.newIndex, 0, oldEl[0]);
    }

    componentDidUpdate() {
        // let temShowColums = this.state.showColums
        setTimeout(() => {
            const el = document.getElementById('itxst'); // 根据类名选择器获取DOM元素
            if (el) {
                Sortable.create(el, {
                    animation: 150,
                    handle: '.my-handle',
                    onEnd: (evt) => this.onEnd(evt)
                    // function (evt) {
                    //     //拖拽完毕之后发生，只需关注该事件
                    //     // Array.splice(指定修改的开始位置,要移除的个数,要添加进数组的元素)----语法
                    //     //先把拖拽元素的位置删除 再新的位置添加进旧的元素
                    //     const oldEl = temShowColums.splice(evt.oldIndex, 1);
                    //     temShowColums.splice(evt.newIndex, 0, oldEl[0]);
                    //     // const aa = this.state.showColums
                    //     // this.setState({
                    //     //     showColums: temShowColums
                    //     // })
                    // }
                });
            }
        }, 0);
    }
}
export default DynamiColumDrawerFun