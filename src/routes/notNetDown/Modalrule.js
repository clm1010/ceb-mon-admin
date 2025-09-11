import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Button, Select, Row, Col, TreeSelect, message } from 'antd'
import fenhang from '../../utils/fenhang'

const SHOW_ALL = TreeSelect.SHOW_ALL
const Option = Select.Option
const FormItem = Form.Item


const formItemLayout = {
  	labelCol: {
    		span: 5,
  	},
  	wrapperCol: {
    		span: 15,
  	},
}

const formItemLayout2 = {
  	labelCol: {
    		span: 5,
  	},
  	wrapperCol: {
    		span: 19,
  	},
}
const formItemLayout3 = {
  	labelCol: {
    		span: 9,
  	},
  	wrapperCol: {
    		span: 15,
  	},
}
const tailFormItemLayout = {
	wrapperCol: {
	  	xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 14,
			offset: 6,
		},
	},
}

const formButtonLayout = {
  	labelCol: {
    		span: 6,
  	},
  	wrapperCol: {
    		span: 14,
  	},
}

const modal = ({
	dispatch,
  	visible,
  	citem = {},
  	form: {
    		getFieldDecorator,
    		resetFields,
  	},
  	//tempList,
  	//alarmFilterInfo,
  	treeNodes,
}) => {
  let item = {}
  if (citem.currentItem) item = citem.currentItem
  let tempList = []
  if (citem.tempList) tempList = citem.tempList
  let alarmFilterInfo = {}
  if (citem.alarmFilterInfo) alarmFilterInfo = citem.alarmFilterInfo

	const onOk = () => {																				//弹出窗口点击确定按钮触发的函数

	}

	const onCancel = () => {
		resetFields()
		dispatch({
			type: 'notNetDown/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				modalRuleVisible: false,
			},
		})
	}

  	const modalOpts = {
    		title: '查看策略模板应用规则',
    		visible,
    		tempList,
    		onOk,
    		onCancel,
    		wrapClassName: 'vertical-center-modal',
//		key:modalVisibleKey,
		maskClosable: false,
  	}


  const showMoFilterName = (data) => {
		if (data && data.filterItems && data.filterItems.length > 0) {
			return '已配置'
		}
			return '未配置'
	}

  	const showGroupName = (data) => {
		let arrs = []
		if (data && data.length > 0) {
			data.forEach((item) => {
				if (arrs.length > 0) {
					arrs = [...arrs, { value: item.uuid, label: item.name }]
				} else {
					arrs = [{ value: item.uuid, label: item.name }]
				}
			})
		}
		return arrs
	}
  	const treeProps = {

		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',

	}

  	//适用范围查询条件搜索---start
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
	//end

  	return (
    		<Modal {...modalOpts} width="700px" footer={[<Button key="cancel" onClick={onCancel}>关闭</Button>]}>
      		<Form layout="horizontal">
        <div style={{ marginLeft: 60 }}>
          <FormItem label="规则名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
	            				initialValue: item.name,
	            				rules: [],
	          			})(<Input readOnly />)}
          </FormItem>
          <FormItem label="监控对象特征" hasFeedback {...formItemLayout}>
            {getFieldDecorator('alarmFilter', {
	            				initialValue: showMoFilterName(alarmFilterInfo),
	            				rules: [],
	          			})(<Input readOnly />)}
          </FormItem>

          <div style={{ position: 'relative' }} id="area2" />
          <FormItem label="分组" {...formItemLayout}>
            {getFieldDecorator('group', {
							initialValue: showGroupName(item.group), /*此处为字段的值，可以把 item对象 的值放进来*/
							rules: [],
					  	})(<TreeSelect	{...treeProps} >{treeNodes}</TreeSelect>)}
          </FormItem>

          <FormItem label="分支机构" hasFeedback {...formItemLayout}>
            {getFieldDecorator('branch', {
			            		initialValue: item.branch,
			            		rules: [],
			         	})(<Select disabled>{fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}</Select>)}
          </FormItem>
        </div>

        {tempList.map(templet =>
          (<Row key={`row_${templet.index}`}>
            <Col span={14} key={`col_${templet.index}_0`}>
              <FormItem label="模板" hasFeedback {...formItemLayout2} key={`muban_${templet.index}`}>
                {getFieldDecorator(`muban${templet.index}`, {
           					 		initialValue: templet.tempname,
           					 		rules: [],
          						})(<Input readOnly title={templet.tempname} />)}
              </FormItem>
            </Col>
            <Col span={9} key={`col_${templet.index}_1`}>
              <FormItem label="监控工具" hasFeedback {...formItemLayout3} key={`tool_${templet.index}`}>
                {getFieldDecorator(`tool${templet.index}`, {
           					 		initialValue: templet.tool,
									rules: [],
          						})(<Select disabled>
            <Option value="ZABBIX">ZABBIX</Option>
            <Option value="ITM">ITM</Option>
            <Option value="OVO">OVO</Option>
            <Option value="SYSLOG_EPP">SYSLOG_EPP</Option>
            <Option value="NAGIOS">NAGIOS</Option>
          </Select>)}
              </FormItem>
            </Col>
           </Row>))}
      </Form>
    		</Modal>
  	)
}

modal.propTypes = {
  	form: PropTypes.object.isRequired,
  	visible: PropTypes.bool,
  	type: PropTypes.string,
  	item: PropTypes.object,
  	onCancel: PropTypes.func,
  	onOk: PropTypes.func,
}

export default Form.create()(modal)
