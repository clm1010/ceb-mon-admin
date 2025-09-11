import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, message } from 'antd'
import SubFormItem from './SubFormItem'

const FormItem = Form.Item
const Option = Select.Option
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
}

const modal = ({
	dispatch,
  visibleFilter,
  tagFilters,
  currentSelected,
  form,
  cfgType,
}) => {
	const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form

	let columns = []
	for (let column of ViewColumns) {
		columns.push(<Option value={column.key} key={column.key}>{column.name}</Option>)
	}

	function onOk () {																				//弹出窗口点击确定按钮触发的函数
		validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      if (data.int !== undefined) {
      	data.children = data.int
      }
      if (data.utc !== undefined) {
      	data.children = parseInt(data.utc / 1000)
      }
      if (data.str !== undefined) {
      	data.children = data.str
      }
      let dateFields = []
			for (let column of ViewColumns) {
				if (column.type === 'utc') {
					dateFields.push(column.key)
				}
			}
      if ((data.op === 'like' || data.op === 'not like') && (data.int !== undefined || data.utc !== undefined)) {
				message.error('数值型字段和日期不能使用like或者not like匹配')
				return
			}
      //初始状态----------------------------
			if (tagFilters.size === 0) {
				if (data.name === 'Severity') {
					tagFilters.set('Severity', { name: data.name, op: data.op, value: String(data.children) })
				} else if (dateFields.indexOf(data.name) >= 0) {
						tagFilters.set(1, { name: data.name, op: data.op, value: String(data.children) })
					} else {
						tagFilters.set(1, { name: data.name, op: data.op, value: String(data.children) })
					}
			} else {	//非初始状态
				if (data.name === 'Severity') {			//如果是severity类型
					if (tagFilters.has('Severity')) { //如果包含severity标签，先删掉，再增加，确保severity标签只有一个
				  	tagFilters.delete('Severity')
					}
					tagFilters.set('Severity', { name: data.name, op: data.op, value: String(data.children) })
				} else { //如果是非severity类型的
					//获取key最大值
					let maxValue = 0
					for (let [key, value] of tagFilters) {
						if (key > maxValue) { maxValue = key }
					}
					//生成最大值加1的新item
					// if ( dateFields.indexOf(data.name) >= 0 ) {
					//	tagFilters.set(1,{name:data.name, op:data.op, value:String(data.children/1000)})
					//}
					//生成最大值加1的新item
					//else {
						tagFilters.set(maxValue + 1, { name: data.name, op: data.op, value: String(data.children) })
					//}
				}
			}

      //------------------------------------
			if (data.name === 'Severity') {
				dispatch({
				  type: 'oelhint/query',
				  payload: {
				  	tagFilters,
				  	currentSelected: data.children,
				  	visibleFilter: false,
            pagination: {																		//分页对象
              showSizeChanger: true,												//是否可以改变 pageSize
              showQuickJumper: true, //是否可以快速跳转至某页
              showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
              current: 1,																		//当前页数
              total: null,																	//数据总数？
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
              pageSize: 100,
            },
				  },
				})
			} else {
				dispatch({
				  type: 'oelhint/query',
				  payload: {
				  	tagFilters,
				  	visibleFilter: false,
            pagination: {																		//分页对象
              showSizeChanger: true,												//是否可以改变 pageSize
              showQuickJumper: true, //是否可以快速跳转至某页
              showTotal: total => `共 ${total} 条`,					 //用于显示数据总量
              current: 1,																		//当前页数
              total: null,																	//数据总数？
              pageSizeOptions: ['10', '20', '30', '40', '100', '200'],
              pageSize: 100,
            },
            //treeSelected:{}
				  },
				})
			}
			resetFields()
    })
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		resetFields()
		dispatch({
			type: 'oelhint/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				visibleFilter: false,
			},
		})
		resetFields()
	}

  const modalOpts = {
    title: '查询告警',
    visible: visibleFilter,
    onOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

 	function onChange (value) {
		dispatch({
			type: 'oelhint/updateState',
			payload: {
				cfgType: value,
			},
		})
	}

	const formulaProps = {
		form,
		cfgType,
	}

  return (
    <Modal {...modalOpts} width="300px" height="600px">
      <Form>
        <FormItem hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Select optionFilterProp="children" showSearch onChange={onChange} placeholder="请选择字段名">
            {columns}
          </Select>)}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout}>
          {getFieldDecorator('op', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Select showSearch placeholder="查询表达式">
            <Option value="=">=</Option>
            <Option value="!=">!=</Option>
            <Option value=">">&gt;</Option>
            <Option value="<">&lt;</Option>
            <Option value=">=">&gt;=</Option>
            <Option value="<=">&lt;=</Option>
            <Option value="like">like</Option>
            <Option value="not like">not like</Option>
          </Select>)}
        </FormItem>
        <SubFormItem {...formulaProps} />
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
