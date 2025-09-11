import React from 'react'
import { routerRedux } from 'dva/router'
import { TreeSelect,Tree  } from 'antd'
import queryString from "query-string"

import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import ButtonZone from './ButtonZone'
import Modal from './Modal'

const TreeSelectNode = TreeSelect.TreeNode
const TreeNode = Tree.TreeNode

function label({ location, dispatch, loading, label, labelGroup }) {
    const {
        batchDelete, choosedRows, expand, list, pagination, modalVisible, modalType, isClose,currentItem,q,inputKeyValue
    } = label
    const loop = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
		}
		return <TreeNode title={item.name} key={item.uuid} isLeaf />
	})
	/*
		获取选择树节点
	*/
	const loopSelect = data => data.map((item) => {
		if (item.children && item.children.length > 0) {
			return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf={false}>{loopSelect(item.children)}</TreeSelectNode>
		}
		return <TreeSelectNode title={item.name} value={item.uuid} key={item.uuid} isLeaf />
    })
    
    const listProps = { //这里定义的是查询页面要绑定的数据源
        dispatch,
        dataSource: list,
        loading: loading,
        pagination,
        location,
        batchDelete,
        choosedRows,
        q,
    }

    const filterProps = {
        expand: false,
        filterSchema: FilterSchema,
        onSearch(q) {
            const { search, pathname } = location
            const query = queryString.parse(search);
            query.q = q
            query.page = 0
            const stringified = queryString.stringify(query)
            dispatch(routerRedux.push({
                pathname,
                search: stringified,
                query,
            }))
        },
    }

    const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
        dispatch,
        item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
        type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
        visible: modalVisible,															//弹出窗口的可见性是true还是false
        isClose,
        treeNodes: labelGroup.treeDatas.length > 0 ? loopSelect(labelGroup.treeDatas) : [],
        inputKeyValue,
    }

    const buttonZoneProps = {
        dispatch,
        batchDelete,
        choosedRows,
        expand,
    }
    let buton = <ButtonZone {...buttonZoneProps} />
    return (
        <div className='content-inner'>
            <Filter {...filterProps} buttonZone={buton} />
            <List {...listProps} />
            <Modal {...modalProps} />
        </div>
    )
}
export default label