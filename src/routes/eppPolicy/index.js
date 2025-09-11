/**
 * @module 监控配置/监控工具管理 
 * @description
 * URL: <u>/eppPolicylist</u>
 * ## 指标操作
 * ##### 新增
 * 添加新的指标，点击弹出新增标准指标窗口。
 * 
 * ##### 批量删除
 * 选中多条指标并点击顶部“批量删除“按钮删除多条。
 * 
 * ##### 删除
 * 选中指标并点击顶部或右侧"删除"按钮删除指标。
 * 
 * ##### 查看
 * 点击打开查看标准指标窗口。
 * 
 * ##### 编辑
 * 点击打开编辑标准指标窗口进行编辑。
 * 
 */
import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tree, Modal } from 'antd'
import ButtonZone from './ButtonZone'
import Filter from '../../components/Filter/Filter'
import FilterSchema from './FilterSchema'
import List from './List'
import EppModal from './Modal'

import PolicyModalDesc from '../../components/policyModal/PolicyModalDesc'
import MosColumns from '../../utils/MosColumns'
import queryString from "query-string";
import HelpButton from '../../components/helpButton'
const TreeNode = Tree.TreeNode
const eppPolicy = ({
	location, dispatch, eppPolicy, loading, labelGroup,
}) => {
	const {
		list, pagination, currentItem, modalVisible, modalType, checkStatus, isClose, batchDelete, choosedRows, filterSchema, pageChange, q, typeValue, element, paginationEpp, listEpp, eppKeyFlag, eppKey, targetKeys, resultVisible, results, resultStatus, formObj
	} = eppPolicy	//这里把入参eppPolicy做了拆分，后面代码可以直接调用拆分的变量

	if (resultStatus === 'running' && targetKeys.length > 0 && results.length > 0 && targetKeys.length === results.length) {
		dispatch({
			type: `eppPolicy/updateState`,
			payload: {
				resultStatus: 'finished',
			}
		})
	}

	const modalProps = {															//这里定义的是弹出窗口要绑定的数据源
		dispatch,
		item: modalType === 'create' ? {} : currentItem,		//要展示在弹出窗口的选中对象
		type: modalType,																		//弹出窗口的类型是'创建'还是'编辑'
		visible: modalVisible,															//弹出窗口的可见性是true还是false
		checkStatus,																				//检测状态done,success,fail,checking
		isClose,
		typeValue,
		element,
		paginationEpp,
		listEpp,
		eppKeyFlag,
		eppKey,
		targetKeys,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
		expand: false,
		filterSchema: FilterSchema,
		onSearch(q) {
			const { search, pathname } = location
			const query = queryString.parse(search);
			if (q != '' && q != undefined) {
				q += ';__distinct__==true'
			}
			query.q = q
			query.page = 0
			const stringified = queryString.stringify(query)
			dispatch(routerRedux.push({
				pathname,
				search: stringified,
				query: query,
			}))
		},
		queryPreProcess(data) {
			if (data.tags_name !== undefined) {
				data['tags.name'] = data.tags_name
				delete data.tags_name
			}
			return data
		},
	}

	const listProps = { //这里定义的是查询页面要绑定的数据源
		dispatch,
		dataSource: list,
		loading: loading.effects['eppPolicy/query'],
		pagination,
		key: pageChange,
		q,
		batchDelete,
		choosedRows,
	}

	/*
		  关联的对象
	  */
	const mosListProps = {
		dispatch,
		loading,
		scroll: 3500,
		columns: MosColumns,
		dataSource: eppPolicy.mosList,
		pagination: eppPolicy.paginationMos,
		onPageChange(page) {
			dispatch({
				type: 'eppPolicy/queryMos',
				payload: {
					current: page.current - 1,
					page: page.current - 1,
					pageSize: page.pageSize,
					relatedType: 'eppPolicy_INST',
				},
			})
		},

	}
	const mosModalDescProps = {
		dispatch,
		visible: eppPolicy.mosVisible,
		policyListProps: mosListProps,
		loading,
		titlename: '关联监控对象',
		policyObjInfo: `关联监控对象数 ${eppPolicy.eppPolicyMosNumber}`,

		onCancel() {
			dispatch({
				type: 'eppPolicy/showModal',
				payload: {
					mosVisible: false,
					eppPolicyInstUUIDMos: '', //点击cancel 值为空
					eppPolicyMosNumber: 0,
					mosList: [],
				},
			})
		},
	}

	const buttonZoneProps = {
		dispatch,
		batchDelete,
		choosedRows,
	}
	let buton = <ButtonZone {...buttonZoneProps} />
	const hbProps = {
		title: '监控工具',
		tag: 'eppPolicylist'
	}

	const handleOk = () => {
		if (resultStatus === 'init') {
			delete formObj.uuid
			let flag = 0
			// 先改成 running 状态
			dispatch({
				type: `eppPolicy/updateState`,
				payload: {
					resultStatus: 'running',
					modalVisible: false
				}
			})
			// 循环插入实例
			targetKeys.forEach(element => {
				formObj.eppKey = element
				dispatch({
					type: `eppPolicy/create`,
					payload: formObj,
				})
			})
		} if (resultStatus === 'finished') {
			dispatch({
				type: `eppPolicy/updateState`,
				payload: {
					resultVisible: false,
					resultStatus: 'init',
					results: [],
					formObj: null,
					targetKeys: [],
					listEpp: []
				}
			})
		}
	}

	const handleCancel = () => {
		dispatch({
			type: `eppPolicy/updateState`,
			payload: {
				resultVisible: false,
				resultStatus: 'init',
				results: [],
				formObj: null,
				targetKeys: [],
				listEpp: []
			}
		})
	}

	return (
		<div className="content-inner">
			<Filter {...filterProps} buttonZone={buton} />
			<List {...listProps} />
			<HelpButton {...hbProps} />
			<EppModal {...modalProps} />
			<PolicyModalDesc {...mosModalDescProps} />
			<Modal
				title="EPP策略实例生成"
				visible={resultVisible}
				confirmLoading={resultStatus === 'running' ? true : false}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				{(resultStatus === 'init') ? <p>是否开始生成这{targetKeys.length}条策略实例？</p> : <p>策略实例生成中……</p>}
				{
					results.map(item => <p>{item}</p>)
				}
				{(resultStatus === 'finished') ? <p>策略实例生成完毕。</p> : null}
			</Modal>
		</div>
	)
}

//通过connect把model的数据注入到这个eppPolicy页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ eppPolicy, labelGroup, loading }) => ({ eppPolicy, labelGroup, loading: loading }))(eppPolicy)
