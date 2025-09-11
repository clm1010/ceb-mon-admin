/**
 * @module 监控配置/策略规则 
 * @description 
 * URL: <u>/policyRuleGroup/policyRule</u>
 *
 * 此页面用于添加、修改和删除指标组及指标。
 * 页面分两部分：分组树（左）和指标列表（右）。选择左侧的分组将出现不同的指标列表。
 * 
 * ## 分组操作
 * ##### 添加分组
 * 添加新的分组，点击弹出新增指标组窗口。
 *
 * ##### 编辑分组
 * 编辑分组，点击弹出编辑指标组窗口。
 *
 * ##### 删除分组
 * 删除分组前应先删除相应的指标。
 * 
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, Switch, Route } from 'dva/router'
import { Row, Col, Modal, Button, Tree } from 'antd'
import Rule from '../rule'
import GroupModal from './GroupModal'

const TreeNode = Tree.TreeNode

const confirm = Modal.confirm

function policyRuleGroup ({
	children, location, dispatch, policyRuleGroup, loading, policyRule, objectGroup, stdIndicatorGroup, objectMOsModal, appSelect, policyTempletGroup, labelGroup
   }) {
	   const {
	treeDatas, selectTreeNode, selectKeys, modalVisible, modalType, isClose,
   } = policyRuleGroup
	   const { expand } = policyRule
	   const onSelect = (selectedKeys, info) => {
		   let nodes = selectTreeNodesInfo(selectedKeys) //获取后台传入的树节点。以便在修改弹出框进行回填赋值
   
		   dispatch({ //把选择中的 key 保存到state中，以便在其他触发事件中使用
			   type: 'policyRuleGroup/controllerState',
			   payload: {
				   selectTreeNode: nodes,
				   selectKeys: selectedKeys,
			   },
		   })
   
		   dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
			   type: 'policyRule/updateState',
			   payload: {
				   groupUUID: selectedKeys,
				   filterKey: `${new Date().getTime()}`,
			   },
		   })
   
   
		   dispatch(routerRedux.push(`/policyRuleGroup/policyRule`)) //显示第三级页面
	   }
   
	   const selectTreeNodesInfo = (keys) => {
		   let mynodes = []
		   if (keys && keys.length > 0) {
			   const loopkeys = (data, mykey) => {
				   let falg = false
				   data.forEach((key) => {
					   if (key === mykey) {
						   falg = true
					   }
				   })
				   return [falg]
			   }
			   const loopnodes = (data) => {
				   data.forEach((item) => {
					   if (item.children && item.children.length > 0) {
						   loopnodes(item.children)
					   }
					   let falg = loopkeys(keys, item.uuid)
					   if (falg && falg[0]) {
						   if (mynodes && mynodes.length > 0) {
							   mynodes = [...mynodes, item]
						   } else {
							   mynodes = [item]
						   }
					   }
				   })
			   }
			   loopnodes(treeDatas)
		   }
		   return mynodes
	   }
   
   
	   const onAdd = () => {
		   dispatch({
			   type: 'policyRuleGroup/controllerState',
			   payload: {
				   modalType: 'create',
				   //currentItem: {},
				   modalVisible: true,
				   isClose: false,
			   },
		   })
	   }
   
	   const onEdit = () => {
		   if (selectKeys && selectKeys.length > 0) {
			   dispatch({
				   type: 'policyRuleGroup/controllerState',
				   payload: {
					   modalType: 'update',
					   //currentItem: selectTreeNode[0],
					   modalVisible: true,
					   isClose: false,
				   },
			   })
		   } else {
			   Modal.warning({
				   title: '请选择编辑的节点',
				   okText: 'OK',
			   })
		   }
	   }
   
	   const onDelete = () => {
		   if (selectKeys && selectKeys.length > 0) {
		   confirm({
			   title: '您确定要删除些结点吗?',
			   onOk () {
				 dispatch({
					   type: 'policyRuleGroup/delete',
					   payload: selectKeys[0],
					 })
			   },
			 })
		   } else {
			   Modal.warning({
				   title: '请选择删除的节点',
				   okText: 'OK',
			   })
		   }
	   }
   
	   const groupModalProps = {									//这里定义的是弹出窗口要绑定的数据源
		   dispatch,
		   item: modalType === 'create' ? {} : selectTreeNode[0],		//要展示在弹出窗口的选中对象
		   selectparentKeys: modalType === 'create' ? selectKeys : [],
		   type: modalType,										//弹出窗口的类型是'创建'还是'编辑'
		   visible: modalVisible,									//弹出窗口的可见性是true还是false
		   //checkStatus,											//检测状态done,success,fail,checking
		   isClose,
	   }
   
	 const ruleProps = {
	   loading,
	   location,
	   dispatch,
	   policyRuleGroup,
	   objectGroup,
	   stdIndicatorGroup,
	   policyRule,
	   policyTempletGroup,
	   objectMOsModal,
	   appSelect,
	   labelGroup,
	 }
   
	   /*
		   此方法是用来 在页面上进行增加节点没有与后台交互的 (样例)
	   */
	   const onAddInPage = () => {
		   let time = Date.parse(new Date())
		   let temptrees = [...treeDatas]
		   if (selectTreeNode && selectTreeNode.length > 0) {
			   const loops = (data) => {
				   data.forEach((item) => {
					   if (item.uuid === selectTreeNode[0]) {
						   let obj = { name: `add ${item.name}-01_${time}`, uuid: `${item.uuid}-01_${time}`, isLeaf: true }
						   if (item.children && item.children.length > 0) {
							   item.children = [...item.children, obj]
						   } else {
							   if (item.isLeaf) {
								   item.isLeaf = false
							   }
							   item.children = [obj]
						   }
					   } else if (item.children && item.children.length > 0) {
							   loops(item.children)
						   }
				   })
			   }
			   loops(temptrees)
		   } else {
			   let obj = { name: 'root add new node -01', uuid: 'new node -01', isLeaf: true }
			   temptrees = [...treeDatas, obj]
		   }
   
		   dispatch({
			   type: 'policyRuleGroup/controllerState',
			   payload: {
				   treeDatas: temptrees,
			   },
		   })
	   }
   
   
	   //定义默认展开的节点数组
	   let expandKeys = []
	   const loop = data => data.map((item) => {
		   if (item.children && item.children.length > 0) {
			   expandKeys.push(item.uuid)
			   return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
		   }
		   return <TreeNode title={item.name} key={item.uuid} isLeaf />
	   })
   
	   let treeNodes = []
	   if (treeDatas && treeDatas.length > 0) {
		   treeNodes = loop(treeDatas)
	   }
   
   
	   return (
	 <Row gutter={12} className="content-tree">
	   <Col lg={expand ? 5 : 0} md={expand ? 6 : 0} sm={expand ? 7 : 0} xs={24} style={{ padding: 0 }}>
		 <div style={policyRule.heightSet}>
		   <div style={{ margin: '12px 6px' }}>模板组
			 <span>
			   <GroupModal {...groupModalProps} />
   
			   <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="delete" shape="circle" onClick={onDelete} />
			   <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="edit" shape="circle" onClick={onEdit} />
			   <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="plus" shape="circle" onClick={onAdd} />
			 </span>
		   </div>
		   <div style={{
	width: '100%', height: '90%', float: 'left', overflow: 'scroll',
   }}
		   >
			 {/*
					   <Tree
						   showLine
						   defaultSelectedKeys={selectKeys}
						   expandedKeys={expandKeys}
						   onSelect={onSelect}
						   defaultExpandAll
						 >
						 {treeNodes}
					 </Tree>
					 */}
			 <Tree
			   showLine
			   autoExpandParent={false}
			   defaultExpandAll={false}
			   onSelect={onSelect}
			 >
			   {treeNodes}
			 </Tree>
		   </div>
		 </div>
   
	   </Col>
	   <Col lg={expand ? 19 : 24} md={expand ? 18 : 24} sm={expand ? 17 : 24} xs={24} className="content-right">
		 <div className="lines" />
		 <Switch>
		   <Route path='/policyRuleGroup/policyRule' render={() => (<Rule {...ruleProps}/>)}/>
		 </Switch>
	   </Col>
	 </Row>
	   )
}


policyRuleGroup.propTypes = {
  policyRuleGroup: PropTypes.object,
}

//export default connect()(StdIndicators)
export default connect(({ policyRuleGroup, loading, policyRule,objectGroup,stdIndicatorGroup,policyTempletGroup,objectMOsModal,appSelect,labelGroup }) => ({ policyRuleGroup, policyRule,
	objectGroup,stdIndicatorGroup,policyTempletGroup,objectMOsModal,appSelect,labelGroup, loading: loading.models.policyRuleGroup }))(policyRuleGroup)
