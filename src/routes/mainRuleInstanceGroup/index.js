/**
 * @module 维护期管理/维护期设置 
 * @description 
 * URL: <u>/mainRuleInstanceGroup/mainRuleInstanceInfo</u>
 *
 * 此页面用于添加、修改和删除实例组及实例。
 * 页面分两部分：分组树（左）和实例列表（右）。选择左侧的分组将出现不同的实例列表。
 * 
 * ## 分组操作
 * ##### 添加分组
 * 添加新的分组，点击弹出新增实例组窗口。
 *
 * ##### 编辑分组
 * 编辑分组，点击弹出编辑实例组窗口。
 *
 * ##### 删除分组
 * 删除分组前应先删除相应的实例。
 * 
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, Switch, Route } from 'dva/router'
import { Row, Col, Modal, Button, Tree, Tooltip } from 'antd'
import GroupModal from './GroupModal'
import MainRuleInstanceInfo from '../mainRuleInstanceInfo'
const ButtonGroup = Button.Group
const TreeNode = Tree.TreeNode

const confirm = Modal.confirm

function MainRuleInstanceGroup ({ children, location, dispatch, mainRuleInstanceGroup, mainRuleInstanceInfo,stdIndicatorGroup, objectGroup, userSelect, appSelect, loading}) {
	const {
 treeDatas, selectTreeNode, selectKeys, modalVisible, modalType, isClose,
} = mainRuleInstanceGroup
	const { expand } = mainRuleInstanceInfo
  const user = JSON.parse(sessionStorage.getItem('user'))
	const onSelect = (selectedKeys, info) => {
		let nodes = selectTreeNodesInfo(selectedKeys) //获取后台传入的树节点。以便在修改弹出框进行回填赋值
		dispatch({ //把选择中的 key 保存到state中，以便在其他触发事件中使用
			type: 'mainRuleInstanceGroup/controllerState',
			payload: {
				selectTreeNode: nodes,
				selectKeys: selectedKeys,
			},
		})
		dispatch({ //把选择中的 key 保存到指标信息的state中，以便查询时，获取对应的指标
			type: 'mainRuleInstanceInfo/controllerModal',
			payload: {
				groupUUID: selectedKeys,
				targetGroupUUIDs: selectedKeys,
				filterKey: `${new Date().getTime()}`,
			},
		})


		dispatch(routerRedux.push(`/mainRuleInstanceGroup/mainRuleInstanceInfo`)) //显示第三级页面
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
			type: 'mainRuleInstanceGroup/controllerState',
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
				type: 'mainRuleInstanceGroup/controllerState',
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
			title: '您确定要删除这些结点吗?',
			onOk () {
			  dispatch({
					type: 'mainRuleInstanceGroup/delete',
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
		user: user,
	}


	//定义默认展开的节点数组
	let expandKeys = []
	//定义默认选中的节点数组
	let selectedKeysVal = []
	const loop = data => data.map((item) => {
		if (item && location.pathname.includes(item.uuid)) {
			selectedKeysVal.push(item.uuid)
		}

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

  const mainRuleInstanceInfoProps = {
    location,
    dispatch,
    mainRuleInstanceGroup,
    mainRuleInstanceInfo,
    stdIndicatorGroup,
    objectGroup,
    loading,
    userSelect,
    appSelect,
  }

	return (
  <Row gutter={12} className="content-tree">
    <Col lg={expand ? 5 : 0} md={expand ? 6 : 0} sm={expand ? 7 : 0} xs={24}>
      <div className="content-left">
        <div>管理组
          <span>
            <GroupModal {...groupModalProps} />
            <Tooltip placement="top" title="删除">
              <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="delete" shape="circle" onClick={onDelete} />
            </Tooltip>
            <Tooltip placement="top" title="编辑">
              <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="edit" shape="circle" onClick={onEdit} />
            </Tooltip>
            <Tooltip placement="top" title="新增">
              <Button style={{ float: 'right', marginRight: 5 }} type="default" size="small" icon="plus" shape="circle" onClick={onAdd} />
            </Tooltip>
          </span>
        </div>
        <div>
          <Tree
            showLine
            selectedKeys={selectKeys}
//						expandedKeys={expandKeys}
            onSelect={onSelect}
            defaultExpandAll
          >
            {treeNodes}
          </Tree>

        </div>
      </div>
    </Col>
    <Col lg={expand ? 19 : 24} md={expand ? 18 : 24} sm={expand ? 17 : 24} xs={24} className="content-right">
      <div className="lines" />
      <Switch>
        <Route path='/mainRuleInstanceGroup/mainRuleInstanceInfo' render={() => (<MainRuleInstanceInfo {...mainRuleInstanceInfoProps}/>)}/>
      </Switch>
    </Col>
  </Row>
	)
}


MainRuleInstanceGroup.propTypes = {
  MainRuleInstanceGroup: PropTypes.object,
}

//export default connect()(StdIndicators)
export default connect(({
 mainRuleInstanceGroup, mainRuleInstanceInfo, loading, stdIndicatorGroup, objectGroup, userSelect, appSelect
}) => ({
 mainRuleInstanceGroup, mainRuleInstanceInfo, stdIndicatorGroup, objectGroup, userSelect, appSelect, loading: loading.models.mainRuleInstanceGroup,
}))(MainRuleInstanceGroup)
