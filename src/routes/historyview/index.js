import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, Route, Switch } from 'dva/router'
import { Row, Col, Tree, Input, Card, Tag } from 'antd'
import myStyle from './index.css'
import HistoryviewInfo from '../historyviewInfo'
import queryString from "query-string";
// internationalization
import { ConfigProvider } from 'antd';//国际化控件
import zhCN from 'antd/es/locale/zh_CN';//导入国际化包
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');//指定加载国际化目标
// end internationalization

const TreeNode = Tree.TreeNode
const Search = Input.Search

function historyviewGroup({
	location, dispatch, historyview, loading, children, historyviewGroup
}) {
	const [appNameList, setAppNameList] = useState([])

	const { q, filterSelect, expand } = historyview
	const { appList } = historyviewGroup
	//组装请求到的应用，将它们设为树的父节点
	let appTreeNodes = []
	if (appList && appList.length > 0) {
		for (let data of appList) {
			appTreeNodes.push(<TreeNode value={data.affectSystem} title={`${data.affectSystem}/${data.branch}`} key={data.uuid} />)
		}
	}
	//每次点击单个树节点时，触发事件，将n_AppName参数去掉，是为了避免查询条件重复出现n_AppName
	let newSql = filterSelect.split(';')
	let info = ''
	for (let i = 0; i < newSql.length; i++) {
		if (!newSql[i].includes('n_AppName==')) {
			info = `${info + newSql[i]};`
		}
	}
	//去除最后的分号
	if (info.endsWith(';')) {
		info = info.substring(0, info.length - 1)
	}

	const queryfun = (appNameList) => {
		if(q == '') return
		let _q = q || ''
		// 干掉关于这个应用的查询条件
		let c = _q.split(';')	// 拆成数组
		if (c.length > 0) {
			let cf = c.filter(item => !item.includes('n_AppName=='))	// 过滤掉特定元素
			_q = ''	//重新组装
			cf.forEach((item, idx) => {
				if (item !== '') {
					_q += `${item};`
				}
			})
		}

		// 追加查询应用的条件
		if (appNameList.length > 0) {
		if (_q !== undefined) {
			if (!_q.includes(`n_AppName==`)) {
				_q = `(n_AppName=='${appNameList.join('\' or n_AppName==\'')}');${_q}`
				dispatch({
					type: 'historyview/setState',
					payload: {
						filterSelect: `(n_AppName=='${appNameList.join('\' or n_AppName==\'')}');`,
					},
				})
			} else {
				dispatch({
					type: 'historyview/setState',
					payload: {
						filterSelect: '',
					},
				})
			}
		} else {
			_q = `(n_AppName=='${appNameList.join('\' or n_AppName==\'')}');`
		}
		} else {
			dispatch({
				type: 'historyview/setState',
				payload: {
					filterSelect: '',
				},
			})
		}
		const { search, pathname } = location
		let query = queryString.parse(search);
		query.q = _q
		query.page = 0
		let stringified = queryString.stringify(query)
		dispatch(routerRedux.push({
			pathname,
			search: stringified,
			query,
		}))
	}
	const onSelect = (value, node) => {
		appNameList.push(node.node.props.value)
		setAppNameList(() => appNameList)
		queryfun(appNameList)
	}
	//应用的回车事件
	const onSearch = (value) => {
		if (value === '') {
			dispatch({
				type: 'historyviewGroup/query',
				payload: {
					q: '',
					page: 0,
					pageSize: 9999,
				},
			})
		} else {
			dispatch({
				type: 'historyviewGroup/query',
				payload: {
					q: `affectSystem == '*${value}*';(englishCode != null or affectSystem == '网络|*')`,
					page: 0,
					pageSize: 9999,
				},
			})
		}
	}

	const his = {
		location,
		dispatch,
		historyview,
		loading
	}

	const customPanelStyle = {
		borderRadius: 4,
		border: 0,
		overflow: 'hidden',
		paddingLeft: 17,
		paddingRight: 12,
		paddingTop: 0,
	}

	const closeTag = (key, e) => {
		e.preventDefault()
		let newAppNameList = appNameList.filter(item => item != key)
		setAppNameList(() => newAppNameList)
		queryfun(newAppNameList)
	}
	let showAppName = []
	for (let value of appNameList) {
		showAppName.push(<Tag style={{ marginBottom: 2 }} color="#2db7f5" onClose={closeTag.bind(this, value)} key={value} closable>{value}</Tag>)
	}

	return (
		<ConfigProvider locale={zhCN}>
			<Row className="content-tree">
				<Col lg={expand ? 5 : 0} md={expand ? 5 : 0} sm={expand ? 5 : 0} xs={expand ? 5 : 0} xl={expand ? 5 : 0} className={myStyle.contentLeft}>
					<div>
						<Card style={{ minHeight: '100vh' }}>
							<div>告警分组(前20个应用)</div>
							<br />
							<div style={customPanelStyle}>
								<Search
									placeholder="输入应用,回车检索"
									onSearch={onSearch}
									style={{ width: 190 }}
								/>
							</div>
							<div style={{ marginTop: 4, marginBottom: 2 }}>
								{showAppName}
							</div>
							<div>
								<Tree onSelect={onSelect} defaultExpandAll>
									{appTreeNodes}
								</Tree>
							</div>
						</Card>
					</div>
				</Col>
				<Col lg={expand ? 19 : 24} md={expand ? 19 : 24} sm={expand ? 19 : 24} xs={expand ? 19 : 24} xl={expand ? 19 : 24} className={myStyle.contentRight}>
					<div className="lines" />
					<Card style={{ minHeight: '100vh' }}>
						<Switch>
							<Route path='/historyviewGroup/historyviews' render={() => (<HistoryviewInfo {...his} />)} />
							<Route path='/historyviewGroup/xykhistoryviews' render={() => (<HistoryviewInfo {...his} />)} />
						</Switch>
					</Card>
				</Col>
			</Row>
		</ConfigProvider>
	)
}


historyviewGroup.propTypes = {
	historyviewGroup: PropTypes.object,
}

//export default connect(({ historyviewGroup, historyview, loading }) => ({ historyviewGroup, historyview, loading: loading.models.historyviewGroup }))(historyviewGroup)
export default connect(({ historyviewGroup, historyview, loading }) => ({ historyviewGroup, historyview, loading }))(historyviewGroup)
