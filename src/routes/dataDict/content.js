import React from 'react'
import { Table, Modal, Button, Layout, Input } from 'antd'
import DictItemModal from './dictItemModal'

const confirm = Modal.confirm
const { Content } = Layout
const { Search } = Input

function content (dataDictItem) {
  const {
 dispatch, loading, list, pagination, batchDelete, selectedRows, modalType, modalVisible, currentItem, searchDict,searchDictItemName,
} = dataDictItem
  const onPageChange = (page) => {
    dispatch({
      type: 'dataDictItem/query',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        searchDict: searchDict || {},
        searchDictItemName:searchDictItemName || '',
      },
    })
    dispatch({
      type: 'dataDictItem/setState',
      payload: {
        batchDelete: false,
        selectedRows: [],
      },
    })
  }

  const searchDictItem = (value) => {
    dispatch({
      type: 'dataDictItem/query',
      payload: {
        searchDictItemName: value,
        searchDict,
      },
    })
    dispatch({
      type: 'dataDictItem/setState',
      payload: {
        batchDelete: false,
        selectedRows: [],
      },
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let choosed = []
      selectedRows.forEach((object) => {
          choosed.push = object.id
        })

      if (selectedRows.length > 0) {
        dispatch({
          type: 'dataDictItem/setState',
          payload: {
            batchDelete: true,
            selectedRows,
          },
        })
      } else if (selectedRows.length === 0) {
        dispatch({
          type: 'dataDictItem/setState',
          payload: {
            batchDelete: false,
            selectedRows,
          },
        })
      }
    },
  }

  const onDeletes = (record) => {
    const titles = '您确定要删除这条记录吗?'
    confirm({
      title: titles,
      onOk () {
        dispatch({
          type: 'dataDictItem/delete',
          payload: record.uuid,
        })
      },
    })
  }

  const onEdit = (record) => {
    dispatch({
      type: 'dataDictItem/findById',
      payload: {
        currentItem: record.uuid,
      },
    })
    dispatch({
      type: 'dataDictItem/setState',
      payload: {
        modalType: 'update',
        modalVisible: true,
      },
    })
  }

  const getColumns = () => {
    let columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'KEY',
      dataIndex: 'key',
      key: 'key',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (record.status === 0) {
          return '激活'
        }
        return '禁用'
      },
    }]

    // 如果是特殊字典，显示特殊列
    if (searchDict.metaData && searchDict.metaData.length > 0) {
      const cols = eval(searchDict.metaData)
      columns = columns.concat(cols)
    } else {
      columns.push({
        title: '值',
        dataIndex: 'value',
        key: 'value',
      })
    }

    columns.push({
      title: '操作',
      key: 'operation',
      width: 110,
      render: (text, record) => {
        return <div><Button style={{ float: 'left' }} size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} /><Button style={{ float: 'left', marginLeft: 5 }} size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} /></div>
      },
    })
    return columns
  }

  const getList = () => {
    let datasource = []
    // 如果是特殊字典，显示特殊列
    if (searchDict.metaData && searchDict.metaData.length > 0) {
      list.forEach((element) => {
        if (element.value !== undefined) {
          const externalColVal = JSON.parse(element.value || '')
          element = { ...element, ...externalColVal }
        }
        datasource.push(element)
      })
    } else {
      datasource = list
    }
    return datasource
  }

  const showAddModal = () => {
    dispatch({
      type: 'dataDictItem/setState',
      payload: {
        modalVisible: true,
        modalType: 'create',
      },
    })
  }

  const onDelete = () => {
    confirm({
      title: '您确定要批量删除这些记录吗?',
      onOk () {
        let ids = []
        selectedRows.forEach(record => ids.push(record.uuid))
        dispatch({
          type: 'dataDictItem/batchRemove',
          payload: ids,
        })
      },
    })
  }

  const modalProps = {															// 这里定义的是弹出窗口要绑定的数据源
    dispatch,
    currentItem: modalType === 'create' ? {} : currentItem,		// 要展示在弹出窗口的选中对象
    type: modalType,																		// 弹出窗口的类型是'创建'还是'编辑'
    visible: modalVisible,															// 弹出窗口的可见性是true还是false
    modalType,
    searchDict,
  }

  const importDictItem = () => {
    dispatch({
      type: 'dataDictItem/importOelDictItem',
      payload: {},
    })
  }

  return (
    <Content style={{ padding: '0 8px', minHeight: 280 }}>
      <div>
        <Search
          placeholder="输入配置项名称"
          style={{ width: 250, marginLeft: 5 }}
          onSearch={value => searchDictItem(value)}
        />
        <Button style={{ marginLeft: 5, float: 'right' }} type="primary" onClick={() => showAddModal()}>新增</Button>
        <Button style={{ marginLeft: 5, float: 'right' }} size="default" type="ghost" onClick={() => onDelete()} disabled={!batchDelete}>删除</Button>
        {/*<Button style={{ marginLeft: 5, float: 'right' }} type="primary" onClick={() => importDictItem()}>导入</Button>*/}
      </div>
      <div style={{ marginTop: 10 }}>
        <Table
          columns={getColumns()}
          dataSource={getList()}
          pagination={pagination}
          onChange={onPageChange}
          rowKey={record => record.uuid}
          rowSelection={rowSelection}
          loading={loading}
        />
      </div>
      <DictItemModal {...modalProps} />
    </Content>
  )
}

export default content
