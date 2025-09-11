import React from 'react'
import { Form, Button, Select,Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

function genOptions(objArray) {
    let options = []
    objArray.forEach((option) => {
        options.push(<Option key={option.uuid} value={option.uuid}>{option.name}</Option>)
    })
    return options
}

function Advanced_mode({
    dispatch, advancedItem, form, itemType, resetCalInput,queryPath,
}) {
    //先取state里的expr字符串，转换成对象数组
    let objectArray = typeof (advancedItem.exprForFrontend) !== 'undefined' && advancedItem.exprForFrontend !== '' ? JSON.parse(advancedItem.exprForFrontend) : []
    const onstdIndicatorsInfo = (index) => {
        dispatch({
            type: 'stdIndicatorGroup/query',
            payload: {},
        })
        let groupUUID = '' //此处的 groupUUID 需要指标 所在的 分组
        if (advancedItem && advancedItem.stdIndicator && advancedItem.stdIndicator.group && advancedItem.stdIndicator.group.length > 0) {
            groupUUID = advancedItem.stdIndicator.group[0].uuid
        }
        dispatch({
            type: `${queryPath}/querystdInfo`,
            payload: {
                groupUUID,
            },
        })
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                kpiVisible: true,
                modaType:'advanced',
                resetCalInput: false,
            },
        })
        resetFields(['exprForFrontend'])
    }
    const resetFormula = () => {
        advancedItem.expr = ''
        advancedItem.exprForFrontend = ''
        advancedItem.logicOp = ''
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                advancedItem: advancedItem,
                resetCalInput: true,
            },
        })
        resetFields(['exprForFrontend'])
    }

    const getFormulaStrs = (objarrs) => {
        let formulastr = ''
        if (objarrs && objarrs.length > 0) {
            objarrs.forEach((bean) => {
                let uuidstr = bean.uuid
                if (uuidstr && uuidstr.includes('_')) {
                    let arrs = uuidstr.split('_')
                    if (arrs && arrs.length > 0) {
                        formulastr += arrs[0]
                    }
                }
            })
        }
        return formulastr
    }

    const addOps = (type) => {
        resetFields(['exprForFrontend']) 
        let uuid
        if (type.length > 1) {
            uuid = `${type}_${new Date().getTime()}`
        } else {
            uuid = `${type}_${new Date().getTime()}`
        }
        //向数组推送新的对象
        objectArray.push({ uuid, name: type })
        //再转型成字符串
        let stringArray = JSON.stringify(objectArray)
        //修改当前item的formual属性
        advancedItem.exprForFrontend = stringArray
        //后台需要解析并计算的公式
        advancedItem.expr = getFormulaStrs(objectArray)
    }
    const addString = (type) => {
        resetFields(['exprForFrontend']) //当输入框的内容被删空后，再次插入内容需要清空一下。
        let uuid
        if (type.length > 1) {
            uuid = `#{${type}}_${new Date().getTime()}`
        } else {
            uuid = `#{${type}}_${new Date().getTime()}`
        }
        objectArray.push({ uuid, name: type })
        let stringArray = JSON.stringify(objectArray)
        advancedItem.exprForFrontend = stringArray
        advancedItem.expr = getFormulaStrs(objectArray)
        dispatch({
			type: `${queryPath}/updateState`,
			payload: {
				advancedItem: advancedItem,
				resetCalInput: false,
			},
		})
    }
    const {
        getFieldDecorator, validateFields, getFieldsValue, resetFields,
    } = form
    const options = typeof (advancedItem.exprForFrontend) !== 'undefined' && advancedItem.exprForFrontend !== '' ? genOptions(objectArray) : []
    const defaultValue = []

    if (!resetCalInput) {		//如果判断不是清空，则展现，否则不展现
        options.forEach((option) => {
            defaultValue.push(option.key)
        })
    }
    const handleChange = (val) => {
        let arrs = []
        if (val && val.length > 0) {
            if(val[val.length-1]==onSearchval){
                let type = onSearchval
                let uuid = `${type}_${new Date().getTime()}`
                objectArray.push({ uuid, name: type })
            }
            if (val.length < objectArray.length ) {
                let dearr = []
                advancedItem.exprForFrontend = ''
                advancedItem.expr = ''
                for (let i = 0; i < val.length; i++){
                   if ( val[i] === objectArray[i].uuid ) {
                       dearr.push(objectArray[i])
                   }
                }
                objectArray = dearr
            }
            // arrs = objectArray.filter((bean, index) => val.includes(bean.uuid))
            arrs = objectArray
        } else {
            advancedItem.exprForFrontend = ''
            advancedItem.expr = ''
        }
        if (arrs.length > 0) {
            advancedItem.exprForFrontend = JSON.stringify(arrs)
            advancedItem.expr = getFormulaStrs(arrs)
        }
		/*
		把修改后的当前currentItem，覆盖到state中去
        */
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                advancedItem: advancedItem,
                resetCalInput: false,
            },
        })
    }

    let onSearchval
    const onSearch = (val) => {
        if(val!=''){
            onSearchval = val
        }
        // if(val!=''){
        //     onSearchval = val
        // }else if(onSearchval && onSearchval !== ''){
        //     addOps(onSearchval)
        // }
        // resetFields(['exprForFrontend']) 
    }

    const onBlur = () => {
        if (onSearchval && onSearchval !== '') {
            addOps(onSearchval)
        }
    //    onSearchval = ''
    }

    const handleChangeOp = (val) => {
        advancedItem.logicOp = val.target.value;
        dispatch({
            type: `${queryPath}/updateState`,
            payload: {
                advancedItem: advancedItem,
                resetCalInput: false,
            },
        })
    }
    return (<div id="test"><FormItem label="公式编辑区" hasFeedback {...formItemLayout}>
        {getFieldDecorator('exprForFrontend', {
            initialValue: defaultValue,
            rules: [
                {
                    required: true,
                },
            ],
        })(<Select placeholder="公式编辑区" allowClear mode="tags" dropdownStyle={{ display: 'none' }} onChange={handleChange} onSearch={onSearch}>
            {options}
        </Select>)}
        <ButtonGroup style={{float: 'right'}}>
            <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={onstdIndicatorsInfo}>插入指标</Button>
            <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addString('host')}>插入host</Button>
            <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={() => addString('PROCESSNUM')}>插入PROCESSNUM</Button>
            <Button size="small" style={{ marginTop: '8px', marginLeft: '6px' }} onClick={resetFormula}>清空</Button>
        </ButtonGroup>
    </FormItem>
    <FormItem label="告警阈值" hasFeedback {...formItemLayout}>
			{getFieldDecorator(`logicOp`, {
				initialValue: (advancedItem ? advancedItem.logicOp : ''),
				rules: [
					{
						required: false,
					},
				],
			})(<Input onChange={handleChangeOp}/>)}
	</FormItem>
    </div>)
}

export default Advanced_mode
