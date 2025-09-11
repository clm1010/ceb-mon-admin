
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Select, Form, Tabs, Input, Radio, Icon, InputNumber } from 'antd'
import Advanced_mode from './Advanced_mode'
import moment from 'moment'

const FormItem = Form.Item
const TabPane = Tabs.TabPane

const ColProps = {
    style: {
        marginBottom: 0,
        textAlign:'center',
    },
}
const ColtestProps = {
    style: {
        paddingLeft:6,
        paddingTop:6,
    },
}
const FormItemProps = {
    style: {
        margin: 0,
    },
}
const FormItemProps1 = {
    style: {
        marginLeft:80,
        marginBottom: 0,
    },
}
const moformItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 18,
    },
    style: {
        margin: 0,
    },
}
const moformItemLayout1 = {
	wrapperCol: {
        span: 24,
        offset: 0,
    },
    style: {
        margin: 0,
    },
}
const moformItemLayout2 = {
	labelCol: {
		span: 10,
	},
	wrapperCol: {
		span: 14,
    },
    style: {
        margin: 0,
    },
}
const ConditionBasicMode = ({
    dispatch,
    filter,
    queryPath,
    moFilterName,
    myform,
    advancedItem,
    resetCalInput,
    pane,
    keys,
    isDS
}) => {
    if(!advancedItem.exprForFrontend && pane){
        advancedItem = pane.content
    }
    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields,
    } = myform
    let firstobj = {
        indicator: {name:'',uuid:''}, function: 'count', count:'', exprLValue: '', exprOperator:'', exprRValue:'', op: '', threshold: '',index:0,
    }
    let {
        mode = '0',
        logicOp = 'AND',
        filterItems = [{ ...firstobj }],
        filterIndex = [0],
    } = filter
    if (isDS) {
        mode = '1'
    } 
    if (filterItems && filterItems.length === 0) {
        filterItems = [{ ...firstobj }]
    }
    if (filterIndex && filterIndex.length === 0) {
        filterIndex = [0]
    }
    if(pane && pane.content.filterItems && filterIndex.length <= pane.content.filterItems.length ){
        //mode = tabstate.panes[keys].content.mode
        //logicOp = tabstate.panes[keys].content.logicOp
        //filterItems = mode=='0' ? tabstate.panes[keys].content.filterItems : filterItems
        if(mode=='1'){
            filterItems=[{indicator: {name:'',uuid:''}, function: 'count', count:'', exprLValue: '', exprOperator:'', exprRValue:'', op: '', threshold: '',index:0,}]
        }
        if(filterIndex.length>filterItems.length){
            filterItems.push(firstobj)
        }
        let index=0 
        filterItems.forEach((item)=>{
            if(!item.index){
                item.index=index
                index++
            }
            if(item.function=='nodata' && item.exprRValue=='0'){
                item.function='nodata_1'
            }
            if(item.function=='regexp' && item.exprRValue=='0'){
                item.function='regexp_1'
            }
        })
    }
    if (filterIndex.length != filterItems.length) {
        let indexs = []
        if (filterItems.length > 1) {
            filterItems.forEach((item, index) => {
                indexs.push(index)
            })
        } else {
            indexs = [0]
        }
        filterIndex = indexs
    }
    const add = (index) => {
        let maxValue = 0
        for (let val of filterIndex) {
            maxValue = (maxValue < val ? val : maxValue)
        }
        filterItems = allColumsVals()
        let indexList = [...filterIndex]
        indexList.splice(index + 1, 0, maxValue + 1) //插入下标的值

        let arrs = [...filterItems]
        firstobj.index = maxValue+1
        arrs.splice(index + 1, 0, firstobj) //在指定的下标下面，插入一个数组元素
        filter.filterItems = arrs
        filter.filterIndex = indexList
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                filter: filter,
            },
        })
    }

    const remove = (myindex) => {
        
        let indexList = filterIndex.filter((val, index) => index != myindex)
        let arrs = filterItems.filter((item, index) => index != myindex)
        filter.filterItems = arrs
        filter.filterIndex = indexList
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                mofilter: filter,
            },
        })
    }

    /*
		指标器
    */
	const onstdIndicatorsInfo = (index) => {
		/*
			获取指标树节点的所有信息
        */
		dispatch({
			type: 'stdIndicatorGroup/query',
			payload: {},
		})
        let groupUUID = '' //此处的 groupUUID 需要指标 所在的 分组
		if (advancedItem && advancedItem.stdIndicator && advancedItem.stdIndicator.group && advancedItem.stdIndicator.group.length > 0) {
			groupUUID = advancedItem.stdIndicator.group[0].uuid
		}
		/*
			获取列表
		*/
		dispatch({
			type: `${queryPath}/querystdInfo`,
			payload: {
				groupUUID,
			},
		})
		/*
			打开弹出框
        */
		dispatch({
            type: `${queryPath}/updateState`,
			payload: {
                kpiVisible: true,
                selectIndex: index,
                filter:filter,
                modaType:'basices'
			},
		})
    }
    
    const getPopupContainers = (index) => {
        if (filterIndex.length > 15) {
            return document.getElementById(`div_col_${filterIndex[index]}_1`)
        }
        return document.body
    }

    const onChangeColums = (val, index) => {
        let maxValue = 0
        for (let val of filterIndex) {
            maxValue = (maxValue < val ? val : maxValue)
        }
        let myfilterItems = allColumsVals()
        myfilterItems[index].function = val
        let indexList = [...filterIndex]
        let newIndexList = []
        // indexList.forEach((val, index) => {
        //     newIndexList.push(maxValue + 1 + index)
        // })
        filter.filterItems = myfilterItems
        filter.filterIndex = indexList
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                mofilter: filter,
            },
        })
    }
      	//数值验证
	const blurFunctions = (rulr, value, callback) => {
		let regx = /^\+?[1-9][0-9]*$/
		if (!regx.test(value)) {
		    callback('Please enter a positive integer！')
		} else {
			callback()
		}
	}
    const ByfunSelect = (funtype, item, keyval, index) => {
        switch (funtype) {
            case 'count':
                return (
                    <Row gutter={12} key={`row_${filterIndex[index]}_2`}>
                        <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`count_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`count_${filterIndex[index]}`, {
                                        initialValue: item.count,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: blurFunctions,
                                            },
                                        ],
                                    })(<InputNumber />)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_n`} {...ColtestProps} xl={{ span: 2 }} md={{ span: 2 }}>次</Col>
                        <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`op_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`op_${filterIndex[index]}`, {
                                        initialValue: item.op,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: '100%' }}>
                                    <Select.Option value=">">大于</Select.Option>
                                    <Select.Option value="=">等于</Select.Option>
                                    <Select.Option value="<">小于</Select.Option>
                                    <Select.Option value=">=">大于等于</Select.Option>
                                    <Select.Option value="<=">小于等于</Select.Option>
                                    <Select.Option value="!=">不等于</Select.Option>
                                    <Select.Option value="iregexp">匹配</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_5`} {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`threshold_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`threshold_${filterIndex[index]}`, {
                                        initialValue: item.threshold,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                )
            case '_expr_':     //exprLValue: '', exprOperator:'', exprRValue:''
                return ( 
                    <Row gutter={8} key={`row_${filterIndex[index]}_2`}>
                        <Col key={`col_${filterIndex[index]}_3`} {...ColProps} xl={{ span: 10 }} md={{ span: 10 }}>
                            <FormItem label='左值' {...moformItemLayout} hasFeedback key={`exprLValue_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`exprLValue_${filterIndex[index]}`, {
                                        initialValue: item.exprLValue,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`exprOperator_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`exprOperator_${filterIndex[index]}`, {
                                        initialValue: item.exprOperator,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Select.Option value=">">大于</Select.Option>
                                        <Select.Option value="=">等于</Select.Option>
                                        <Select.Option value="<">小于</Select.Option>
                                        <Select.Option value=">=">大于等于</Select.Option>
                                        <Select.Option value="<=">小于等于</Select.Option>
                                        <Select.Option value="!=">不等于</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_5`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
                            <FormItem label='右值' {...moformItemLayout2} hasFeedback key={`exprRValue_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`exprRValue_${filterIndex[index]}`, {
                                        initialValue: item.exprRValue,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                )
            case 'diff':     //exprLValue: '', exprOperator:'', exprRValue:''
                return (
                    <Row gutter={8} key={`row_${filterIndex[index]}_2`}>
                        <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 6 }} md={{ span: 6 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`exprOperator_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`exprOperator_${filterIndex[index]}`, {
                                        initialValue: item.exprOperator,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Select.Option value=">">大于</Select.Option>
                                        <Select.Option value="=">等于</Select.Option>
                                        <Select.Option value="<">小于</Select.Option>
                                        <Select.Option value=">=">大于等于</Select.Option>
                                        <Select.Option value="<=">小于等于</Select.Option>
                                        <Select.Option value="!=">不等于</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_5`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
                            <FormItem label='右值' {...moformItemLayout2} hasFeedback key={`exprRValue_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`exprRValue_${filterIndex[index]}`, {
                                        initialValue: item.exprRValue,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                )
            case 'last':
                    return(
                        <Row gutter={12} key={`row_${filterIndex[index]}_2`}>
                            <Col key={`col_${filterIndex[index]}_4`} {...ColProps} xl={{ span: 8 }} md={{ span: 8 }}>
                                <FormItem {...FormItemProps} hasFeedback key={`exprOperator_info_${filterIndex[index]}`}>
                                    {
                                        getFieldDecorator(`exprOperator_${filterIndex[index]}`, {
                                            initialValue: item.exprOperator,
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        <Select.Option value=">">大于</Select.Option>
                                        <Select.Option value="=">等于</Select.Option>
                                        <Select.Option value="<">小于</Select.Option>
                                        <Select.Option value=">=">大于等于</Select.Option>
                                        <Select.Option value="<=">小于等于</Select.Option>
                                        <Select.Option value="!=">不等于</Select.Option>
                                        </Select>)
                                    }
                                </FormItem>
                            </Col>
                            <Col key={`col_${filterIndex[index]}_5`} {...ColProps} xl={{ span: 12 }} md={{ span: 12 }}>
                                <FormItem {...FormItemProps} hasFeedback key={`exprRValue_info_${filterIndex[index]}`}>
                                    {
                                        getFieldDecorator(`exprRValue_${filterIndex[index]}`, {
                                            initialValue: item.exprRValue,
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(<Input />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    )
            default:
                return(
                    <Row gutter={12} key={`row_${filterIndex[index]}_2`}>
                        <Col key={`col_${filterIndex[index]}_5`} {...ColProps} xl={{ span: 12 }} md={{ span: 12 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`threshold_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`threshold_${filterIndex[index]}`, {
                                        initialValue: item.threshold,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                )
        }
    }
    //let index = 0
    //
    const AdvancedModePropr = {
        dispatch,
        advancedItem,
        form:myform,
        resetCalInput,
        queryPath,
    }
    const loop = data => data.map((item, index) => {
        switch (mode) {
            case '0':
                return (
                    <Row gutter={12} key={`row_${filterIndex[index]}_1`} style={{marginBottom:0,marginLeft:75}}>
                        <div id={`div_col_${filterIndex[index]}_1`} style={{ position: 'relative' }}>
                            <Col key={`col_${filterIndex[index]}_1`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
                                <FormItem {...FormItemProps} hasFeedback key={`indicator_info_${filterIndex[index]}`}>
                                    {
                                        getFieldDecorator(`indicator_${filterIndex[index]}`, {
                                            initialValue: item.indicator.name,
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(<Input readOnly onClick={onstdIndicatorsInfo.bind(this, item.index)} title={item.indicator.name} placeholder='请选择指标'/>)
                                    }
                                </FormItem>
                            </Col>
                        </div>
                        <Col key={`col_${filterIndex[index]}_2`} {...ColProps} xl={{ span: 4 }} md={{ span: 4 }}>
                            <FormItem {...FormItemProps} hasFeedback key={`function_info_${filterIndex[index]}`}>
                                {
                                    getFieldDecorator(`function_${filterIndex[index]}`, {
                                        initialValue: item.function,
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Select optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={val => onChangeColums(val, index)}>
                                    <Select.Option value="count">连续</Select.Option>
                                    <Select.Option value="last">最近值</Select.Option>
                                    <Select.Option value="nodata">有数据</Select.Option>
                                    <Select.Option value="nodata_1">无数据</Select.Option>
                                    <Select.Option value="regexp">匹配</Select.Option>
                                    <Select.Option value="regexp_1">不匹配</Select.Option>
                                    <Select.Option value="_expr_">表达式</Select.Option>
                                    </Select>)
                                }
                            </FormItem>
                        </Col>
                        <Col key={`col_${filterIndex[index]}_`} xl={{ span: 12 }} md={{ span: 12 }}>
                            {ByfunSelect(item.function, item, `value_info_${filterIndex[index]}`, index)}
                        </Col>
                        <Col key={`col_${filterIndex[index]}_6`} style={{ textAlign: 'right' }} {...ColProps} xl={2} md={2}>
                            <Button.Group >
                                <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => remove(index)} disabled={data.length === 1} />
                                {/* <Button type="default" icon="plus" onClick={() => add(index)} /> */}
                            </Button.Group>
                        </Col>
                    </Row>
                )

            case '1':
                return (
                    <Row gutter={24} key={`row_${filterIndex[index]}_3`}>
                        <Col key={`col_${filterIndex[index]}_7`} {...ColProps}>
                            <FormItem {...moformItemLayout1} hasFeedback key={`expr_info_${filterIndex[index]}`}>
                                <Advanced_mode {...AdvancedModePropr}/>
                            </FormItem>
                        </Col>
                    </Row>
                )
        }
    })

    const onBlur = (index) => {
        let fileds = [`logicOp_${filterIndex[index]}`]
        validateFields(fileds)
    }

    const myConditionItem = loop(filterItems)


    //获取时间的值
    const getColumsVal = (val) => {
        if (typeof (val) === 'object') {
            return Date.parse(val)
        }
        return val
    }
    const allColumsVals = () => {
        let fields = []
        filterIndex.forEach((num) => {
            fields.push(`indicator_${num}`)
            fields.push(`function_${num}`)
            fields.push(`op_${num}`)
            fields.push(`count_${num}`)
            fields.push(`exprLValue_${num}`)
            fields.push(`exprOperator_${num}`)
            fields.push(`exprRValue_${num}`)
            fields.push(`threshold_${num}`)
            fields.push('index')
        })
        const valObj = { ...getFieldsValue(fields) } //获取所有指定字段的值
        let arrs = []
        filterIndex.forEach((num) => {
            let bean = {}
            bean.indicator ={}
            bean.indicator.name = valObj[`indicator_${num}`]
            bean.function = valObj[`function_${num}`]
            bean.op = valObj[`op_${num}`]
            bean.count = valObj[`count_${num}`]
            bean.exprLValue = getColumsVal(valObj[`exprLValue_${num}`])
            bean.exprOperator = getColumsVal(valObj[`exprOperator_${num}`])
            bean.exprRValue = getColumsVal(valObj[`exprRValue_${num}`])
            bean.threshold = valObj[`threshold_${num}`]
            bean.index = num
            if(filterItems.length>0 &&filterItems[num].index==num){
                bean.indicator.uuid = filterItems[num].indicator.uuid
            }
            arrs.push(bean)
        })
        return arrs
    }

    const onChange = (val) => {
        let field = ['logicOp']
        const valObj = { ...getFieldsValue(field) } //获取所有指定字段的值
        let arrs = allColumsVals()
        let maxValue = 0
        for (let val of filterIndex) {
            maxValue = (maxValue < val ? val : maxValue)
        }
        let arrIndex = []
        let arrItem = []
        if (val === '1') {
            filter.basicItems = arrs
            filter.logicOp = valObj.logicOp //基础模式的逻辑操作符,保存切换之前的
            if (filter.advancedItems && filter.advancedItems.length > 0) {
                arrItem = filter.advancedItems
            }
        } else {
            filter.advancedItems = arrs
            if (filter.basicItems && filter.basicItems.length > 0) {
                arrItem = filter.basicItems
            } 
        }
        filter.mode = val //模式

        filter.filterItems = arrItem //过滤条件
        filter.filterIndex = arrIndex //过滤条件下标的数组

        let fields = []
        filterIndex.forEach((num) => {
            fields.push(`indicator_${num}`)
            fields.push(`function_${num}`)
            fields.push(`op_${num}`)
            fields.push(`count_${num}`)
            fields.push(`exprLValue_${num}`)
            fields.push(`exprOperator_${num}`)
            fields.push(`exprRValue_${num}`)
            fields.push(`threshold_${num}`)
        })
        resetFields(fields) //需要重置一下表单
        /*
  
          修改过滤条件的集合
        */
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                filter:filter,
            },
        })
    }

    const operations = (<FormItem {...FormItemProps} hasFeedback key="modeswitch">
        {getFieldDecorator('mode', {
            initialValue: mode,
            rules: [
                {
                    required: true,
                },
            ],
        })(<Select showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} size="small" onChange={onChange} style={{ width: '140px' }}>
            <Select.Option value="0">普通模式</Select.Option>
            <Select.Option value="1">高级模式</Select.Option>
        </Select>)
        }
    </FormItem>)

    const basicRow = (<Row>
        <Col xl={{ span: 24 }} md={{ span: 24 }}>
            <FormItem {...FormItemProps1}>
                {getFieldDecorator('logicOp', {
                    initialValue: logicOp,
                    rules: [
                        {
                            required: true,
                        },
                    ],
                })(<Radio.Group>
                    <Radio value="AND">AND</Radio>
                    <Radio value="OR">OR</Radio>
                </Radio.Group>)}
            </FormItem>
        </Col>
    </Row>)
    return (<div>
        <Tabs defaultActiveKey="templet_2" size="small" type="line"  tabBarExtraContent={operations}>
            <TabPane tab={<span><Icon type="user" />告警条件设置</span>} key="templet_2">
                {(mode === '0') ? basicRow : null}
                {myConditionItem}
                {
                (mode === '0') ?
                    <Row style={{marginLeft:110,marginTop:5}}>
                        <Col xl={4} md={4}>
                            <Button size="default"  type="ghost" shape="circle" icon="plus" onClick={() => add(filterItems.length)} />
                        </Col>
                    </Row>
                    :
                    null
                }
                
            </TabPane>
		</Tabs>
    </div>)
}

ConditionBasicMode.propTypes = {
    filter: PropTypes.object,
    queryPath: PropTypes.string,
    moFilterName: PropTypes.string,
    myform: PropTypes.object.isRequired,
}

export default ConditionBasicMode
