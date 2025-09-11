import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import FilterSchema from './FilterSchema'
import DataList from './DataList'
import OELEventFiltersMode from './ConditionFilter/OELEventFiltersMode'

const modal = ({
  dispatch,
  loading,
  oelEventFilter,
  form,
}) => {
   const {
 getFieldDecorator, validateFields, getFieldsValue, resetFields,
} = form
   const {
 list, currentItem, pagination, filtervisible, confirmLoading, batchDelete, choosed2s, evnetType, eventName, eventIsGlobal, filterKey, choosedRows,
} = oelEventFilter
	const onOk = () => {
		validateFields((errors) => {
			if (errors) {
				return
			}

			dispatch({
				type: 'oelEventFilter/updateState',													//抛一个事件给监听这个type的监听器
				payload: {
					//filtervisible: false,
					confirmLoading: true,
				},
			})
		})
	}

	const onCancel = () => {															//弹出窗口中点击取消按钮触发的函数
		dispatch({
			type: 'oelEventFilter/updateState',													//抛一个事件给监听这个type的监听器
			payload: {
				filtervisible: false,
				confirmLoading: false,
				eventName: '',
				eventIsGlobal: '',
			},
		})
		resetFields()
	}

   	const dataFilterProps = {
		//key: zabbixItemsInfo.filterKey,
		expand: false,
		filterSchema: FilterSchema,
		onSearch (q) {
			let mystr = q
			if (mystr && mystr.length > 0) {
				mystr = mystr.replace(/\'\*true\*\'/g, true).replace(/\'\*false\*\'/g, false)
			}
			dispatch({
			type: 'oelEventFilter/query',													//抛一个事件给监听这个type的监听器
			payload: {
				q: mystr,
			},
		})
		},
	}

	const dataListProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		myform: form,
		loading,
		pagination,
		batchDelete,
		choosedRows,
		eventName,
		eventIsGlobal,
	}

  const modalOpts = {
    title: '过滤器配置',
    visible: filtervisible,
    onOk,
    onCancel,
	//confirmLoading:confirmLoading,
	maskClosable: false,
    wrapClassName: 'vertical-center-modal',
	width: 1000,
  }

  //过滤规则配置参数 start

	const oelEventFiltersModeProps = {
		dispatch,
		loading,
		currentItem: currentItem || {},
		moFilterValue: oelEventFilter.oelFilterValue,
		moFilterName: 'oelFilterValue',
		moFilterOldValue: oelEventFilter.moFilterOldValue,
		queryPath: 'oelEventFilter/updateState',
		visible: oelEventFilter.oelFiltervisible,
		visibleName: 'oelFiltervisible',
		title: (evnetType && evnetType === 'create' ? '新增过滤器' : '编辑过滤器'),
		confirmLoading: oelEventFilter.confirmLoading,
		evnetType,
		//modelkey: zabbixItemsInfo.setModelKey,
		key: filterKey,
	}


  return (

    <Modal {...modalOpts} width="800px" footer={null} height="600px">
      <div className="content-inner">
        {/*<Filter {...dataFilterProps}/>*/}
        {/*<div style={{height:200}}>*/}
        <DataList {...dataListProps} />
        {/*</div>*/}
        <OELEventFiltersMode {...oelEventFiltersModeProps} />
      </div>


    </Modal>
  )
}

modal.propTypes = {
  //form: PropTypes.object.isRequired,
  oelEventFilter: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
