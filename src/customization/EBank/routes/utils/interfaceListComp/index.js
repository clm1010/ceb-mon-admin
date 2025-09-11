import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Modal } from 'antd'
import InterfaceTable from '../../objectGroup/interfacer/List'
import InterfaceForm from '../../objectGroup/interfacer/Modal'
import EquipmentModal from '../../objectGroup/interfacer/equipmentModal'

const InterfaceModal = ({
	dispatch,
	loading,
	location,
	interfacer,
	interfaceList,
	objectGroup,
	moSingleSelect,
}) => {
	const {
		q,
		list,
		currentItem,
		modalVisible,
		modalType,
		pagination,
		batchDelete,
		selectedRows,
		moSynState,
		_mngInfoSrc,
		zabbixUrl,
		alertType,
		alertMessage,
		equipment,
		equipmentVisible,
		equipmentSecondClass,
		appCategorlist,
	} = interfacer

	const { infsVisible, neUUID	} = interfaceList

	const listProps = { //这里定义的是表格对应的数据源与配置
    dispatch,
    dataSource: list,
    loading,
    pagination: false,
    location,
    onPageChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          q,
          page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
          pageSize: page.pageSize,
        },
      }))
    },
    batchDelete,
    selectedRows,
  }

  const modalOpts = {
    title: '设备接口列表',
    visible: infsVisible,
    //onCancel,
    wrapClassName: 'vertical-center-modal',
		width: 1150,
		maskClosable: false,
		onCancel () {
			dispatch({
				type: 'interfaceList/setState',
				payload: {
					infsVisible: false,
				},
			})

			dispatch({
				type: 'interfacer/setState',
				payload: {
					list: [],
				},
			})
		},
  }

  const modalProps = {	//这里定义的是弹出窗口要绑定的数据源
		q,
		loading,
		dispatch,
		item: currentItem,		//要展示在弹出窗口的选中对象
		modalType, //弹出窗口的类型是'创建'还是'编辑'
		modalVisible, //弹出窗口的可见性是true还是false
		modalName: '接口',		//@@@
		moSynState,
		_mngInfoSrc,
		alertType,
		alertMessage,
		moSingleSelect,
		appCategorlist,
	}

  const equipmentModalProps = {
  	dispatch,
  	item: equipment,
  	visible: equipmentVisible,
  	equipmentSecondClass,
  }

  return (
    <div>
      <Modal {...modalOpts}>
        <InterfaceTable {...listProps} />
      </Modal>
      <InterfaceForm {...modalProps} />
      <EquipmentModal {...equipmentModalProps} />
    </div>
  )
}

export default connect(({ loading }) => ({ loading: loading.models.interfacer }))(InterfaceModal)
