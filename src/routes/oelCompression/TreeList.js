import React from 'react'
import { Table, Row, Col, Icon, message, Tree, Tag, Layout} from 'antd'
import './List.css'
import List from './List'
import DetailModal from './DetailModal'
import {ozr} from '../../utils/clientSetting/'
const ViewColumns = JSON.parse(localStorage.getItem('dict')).OelColumns
const { TreeNode, DirectoryTree } = Tree;
const { Content, Sider } = Layout;

const customTreeStyle = {
  background: '#FFFFFF',
  borderRadius: 4,
  border: 0,
  overflow: 'hidden',
  borderBottom: '1px solid #E9E9E9',
  paddingLeft: 12,
  paddingRight: 12,
  paddingBottom: 12,
  paddingTop: 12,
}

function treelist ({
 dispatch, loading, dataSource, list, pagination, location, onPageChange, tagFilters, currentSelected, oelColumns, oelDatasource, oelFilter, oelViewer, toolList, selectedRows, user,
 isPackedAlarms,treeNodes, selectedKeys, treeCollapse, appNameNum, modalDetailProps
}) {
  const onSelect = (v,e) => {
    const idxs = e.selected?e.node.props.pos.split('-'):[]
    const offset = 1
    let tmpNodes = treeNodes[0].children
    const appName = idxs[offset+1]?tmpNodes[idxs[offset+1]].lable:undefined
    const componentType = idxs[offset+2]?tmpNodes[idxs[offset+1]].children[idxs[offset+2]].lable:undefined
    const nodeAlias = idxs[offset+3]?tmpNodes[idxs[offset+1]].children[idxs[offset+2]].children[idxs[offset+3]].lable:undefined
    dispatch({
      type: 'oelcompression/query',
      payload: {
        treeSelected:{
          appName,
          componentType,
          nodeAlias
        },
        selectedKeys:v
      },
    })
  }

  const loop = data => data.map((item) => {
    let title1
    if(item.lable === '全部'){
      title1= `${item.lable}${appNameNum}个应用系统[${item.total?item.total:0}: ${item.packed?item.packed:0}]`
    }else{
      title1= `${item.lable} [${item.total?item.total:0}: ${item.packed?item.packed:0}]`
    }
    if (item.children && item.children.length > 0) {
			return (<TreeNode title={title1} key={item.key} isLeaf={false}>
              {loop(item.children)}</TreeNode>)
		}
		return <TreeNode title={title1} key={item.key} isLeaf />
	})

  let treenodes = [] //树节点
  if (treeNodes && treeNodes.length > 0) {
		treenodes = loop(treeNodes)
	}

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource,
    loading,//.effects['oelcompression/query'],
    pagination,
    location,
    tagFilters,
    currentSelected,
    oelColumns,
    oelDatasource,
    oelFilter,
    oelViewer,
    toolList,
    selectedRows,
    user,
    onPageChange (page, filters, sorter) {
      const { query, pathname } = location

      let orderBy = ''
      //如果用户点击排序按钮
      if (sorter.order != undefined) {
        let order = sorter.order === 'descend' ? ' desc' : ' asc'

        //排序字段首字母大写
        let filterName = sorter.field.slice(0, 1).toUpperCase() + sorter.field.slice(1)
        orderBy = `order by ${filterName}${order}`
      } else {
        orderBy = 'order by FirstOccurrence desc'
      }


      dispatch({
        type: 'oelcompression/query',
        payload: {
          pagination: page,
          oelDatasource,
          oelViewer,
          oelFilter,
          orderBy,
        },
      })
    },
    isPackedAlarms,
    isSubAlarms:false
  }

  const onCollapse = (e) => {
    console.log(e);
    dispatch({
      type: 'oelcompression/updateState',
      payload: {
        treeCollapse: e,
      },
    })
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Sider
       style={{
        overflow: 'auto',
        height: '100vh',
        //position: 'fixed',
        //left: 0,
        background:'#FFFFFF'
      }}
      width='330px'
      collapsible collapsed={treeCollapse}
      onCollapse= {onCollapse}
      collapsedWidth = {30}
      theme='light'
    >
      {!treeCollapse?
      <div  >
      <Tree
        //showLine
        //blockNode
        //showIcon
        //switcherIcon={<Icon type="down" />}
        //defaultExpandAll
        onSelect={onSelect}
        selectedKeys = {selectedKeys}
        defaultExpandedKeys = {selectedKeys}
        //onExpand={onExpand}
      >
       {treenodes}
      </Tree>
      </div>:null}
    </Sider>
    <Layout >
    <Content style={{ margin: '0 16px' }} /* style={{ margin: '24px 16px 0', overflow: 'initial' }} */>

    <div>
    <List {...listProps} />
    {/* <DetailModal {...modalDetailProps} /> */}

    </div>
    </Content>
    </Layout>
    </Layout>
  )
}

export default treelist

