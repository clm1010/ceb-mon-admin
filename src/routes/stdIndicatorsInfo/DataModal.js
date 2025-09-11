import React from 'react'
import PropTypes from 'prop-types'
import mystyle from './DataModal.less'
import { Form, Input, Radio, Modal, Button, Select, TreeSelect, Row, Col } from 'antd'
import { genDictOptsByName } from '../../utils/FunctionTool'
const FormItem = Form.Item
const SHOW_ALL = TreeSelect.SHOW_ALL

const formItemLayout = {
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
	type,
	item = {},
	form: {
		getFieldDecorator,
		validateFields,
		getFieldsValue,
		resetFields,
	},
	modalType,
	checkStatus,
	isClose,
	treeNodes,
        treeData,
	see,
}) => {

  const getGroups = (targetGroups) =>{
    let uuids = targetGroups.map((item) => item.value)
    let g1 = targetGroups
    const getParents = (data,uuids,parents=[]) => data.map((item) => {
      let parent = []
      Object.assign(parent,parents)
      if (uuids === item.uuid) {
        parent.map((i) => {
          if (g1.filter((f)=> f.value === i.value).length ===0) g1.push(i)
        })
        return parent
      } else {
        if (item.children && item.children.length > 0) {
          parent.push({'value':item.uuid,'label':item.name})
          return getParents(item.children,uuids,parent)
        }
        else {
          return []
        }
      }
    })
    uuids.map((id) => getParents(treeData,id))
  }
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}
			const data = {
				...getFieldsValue(), //获取弹出框所有字段的值
			}
                        getGroups(data.targetGroupUUIDs)
			data.name = data.name.trim()   //去除名称的空格
			if (data.targetGroupUUIDs && data.targetGroupUUIDs.length > 0) {
				let arrs = []
				data.targetGroupUUIDs.forEach((item) => {
					if (arrs.length > 0) {
						arrs = [...arrs, item.value]
					} else {
						arrs = [item.value]
					}
				})
				data.targetGroupUUIDs = arrs
			}

			dispatch({
				type: `stdIndicatorsinfo/${type}`,
				payload: data,
			})
		})
	}

	const onCancel = () => {
		dispatch({
			type: 'stdIndicatorsinfo/controllerModal',
			payload: {
				modalVisible: false,
				isClose: true,
				see: 'no',
			},
		})
		dispatch({
			type: 'indexlist/setState',
			payload: {
				modalVisible: false,
				isClose: true,
				see: 'no',
			},
		})
		dispatch({
			type: 'totalnet/setState', // 抛一个事件给监听这个type的监听器
			payload: {
			  moKpiVisible: false,
			  isClose: true,
			  see: 'no'
			}
		  })
	  
		  dispatch({
			type: 'branchnet/setState', // 抛一个事件给监听这个type的监听器
			payload: {
			  moKpiVisible: false,
			  isClose: true,
			  see: 'no'
			}
		  })
	}

	const showGroupName = (data) => {
		//[{value:'0-0-0',label:'Child Node1'}]
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

	const modalOpts = {
		title: type === 'create' && see === 'no' ? '新增标准指标' : type === 'update' && see === 'no' ? '编辑标准指标' : type === 'update' && see === 'yes' ? '查看标准指标' : null,
		visible,
		onOk,
		onCancel,
		wrapClassName: 'vertical-center-modal',
		maskClosable: false,
	}

	const treeProps = {

		multiple: true,
		treeCheckable: true,
		treeCheckStrictly: true,
		treeDefaultExpandAll: true,
		showCheckedStrategy: SHOW_ALL,
		searchPlaceholder: 'Please select',
	}

	return (
		isClose ? null :
		<Modal {...modalOpts}
  height="600px"
  footer={see === 'no' ? [<Button key="cancel" onClick={onCancel}>关闭</Button>,
    <Button key="submit" type="primary" onClick={onOk}>确定</Button>] : [<Button key="cancel" onClick={onCancel}>关闭</Button>]}
		>
  <Form layout="horizontal">
    <FormItem label="指标名称" hasFeedback {...formItemLayout}>
      {getFieldDecorator('name', {
					initialValue: item.name,
					rules: [
					  {
						required: true,
					  },
					],
				  })(<Input />)}
    </FormItem>
    <FormItem label="指标描述" hasFeedback {...formItemLayout}>
      {getFieldDecorator('description', {
					initialValue: item.description,
					rules: [
					  {
						required: true,
					  },
					],
				  })(<Input />)}
    </FormItem>
    <FormItem label="单位" hasFeedback {...formItemLayout}>
      {getFieldDecorator('unit', {
					initialValue: item.unit,
				  })(<Input />)}
    </FormItem>
    <div style={{ position: 'relative' }} id="area5" />
    <FormItem label="数据类型" hasFeedback {...formItemLayout} >
      {getFieldDecorator('dataType', {
					initialValue: item.dataType,
					rules: [
					  {
						required: false,
					  },
					],
				  })(<Select
  placeholder="请选择"
  getPopupContainer={() => document.getElementById('area5')}
				  >
  <Select.Option key="Int" value="Int">Int</Select.Option>
  <Select.Option key="Float" value="Float">Float</Select.Option>
  <Select.Option key="String" value="String">String</Select.Option>
  <Select.Option key="Log" value="Log">日志</Select.Option>
         </Select>)}
    </FormItem>
    <div style={{ position: 'relative' }} id="groupAreaId">
      <FormItem label="告警分组" hasFeedback {...formItemLayout}>
        {getFieldDecorator('alarmGroup', {
            initialValue: item.alarmGroup,
          })(<Select >
           {genDictOptsByName('alarmGroup')}
          </Select>)}
      </FormItem>
    </div>
    <div style={{ position: 'relative' }} id="groupAreaId">
      <FormItem label="分组" {...formItemLayout}>
        {getFieldDecorator('targetGroupUUIDs', {
					initialValue: showGroupName(item.group), /*此处为字段的值，可以把 item对象 的值放进来*/
					rules: [
					  {
						//required: true,
						type: 'array',
					  },
					],
				  })(<TreeSelect {...treeProps} getPopupContainer={() => document.getElementById('groupAreaId')}>
  {treeNodes}
</TreeSelect>)}
      </FormItem>
    </div>

    <Row className={(type === 'update' ? mystyle.formItemDisplayBlock : mystyle.formItemDisplayNone)}>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>创建者:</Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={item.createdBy} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>创建时间: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={new Date(item.createdTime).format('yyyy-MM-dd hh:mm:ss')} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>最后更新者: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={item.updatedBy} disabled /></Col>
      <Col span={4} style={{ textAlign: 'right', marginRight: 8 }} className={mystyle.rowSpacing}>最后更新时间: </Col>
      <Col span={7} className={mystyle.rowSpacing}><Input value={new Date(item.updatedTime).format('yyyy-MM-dd hh:mm:ss')} disabled /></Col>
    </Row>

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
