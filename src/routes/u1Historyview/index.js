import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, Switch, Route } from 'dva/router'
import myStyle from './index.css'
import { Row, Col, Tree, Input, Card } from 'antd'
import U1hisoryview from '../u1HistoryviewInfo'
import HistoryviewInfo from "../historyviewInfo";
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

function u1HistoryviewGroup ({
 location, dispatch, u1Historyview, loading, children, u1HistoryviewGroup,
}) {
	const { q, filterSelect, expand } = u1Historyview
	const { appList } = u1HistoryviewGroup
	//组装请求到的应用，将它们设为树的父节点
	let appTreeNodes = []
	if (appList && appList.length > 0) {
		for (let data of appList) {
			appTreeNodes.push(<TreeNode value={data.affectSystem} title={data.affectSystem} key={data.uuid} />)
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

	const onSelect = (value, node) => {
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
		if (q !== undefined) {
			if (!q.includes(`n_AppName=='${node.node.props.value}'`)) {
				_q = `n_AppName=='${node.node.props.value}';${_q}`
				dispatch({
					type: 'u1Historyview/setState',
					payload: {
						filterSelect: `n_AppName=='${node.node.props.value}';`,
					},
				})
			} else {
				dispatch({
					type: 'u1Historyview/setState',
					payload: {
						filterSelect: '',
					},
				})
			}
		} else {
			_q = `n_AppName=='${node.node.props.value}';`
		}
		const { search, pathname } = location
		const query = queryString.parse(search);
	  	dispatch(routerRedux.push({
				 pathname,
				 search,
	      	query: {
	      		...query,
	        	page: 0,
	        	q: _q,
	      	},
	   	}))
	}
	//应用的回车事件
	const onSearch = (value) => {
		if (value === '') {
			dispatch({
				type: 'u1HistoryviewGroup/query',
				payload: {
					q: '',
		          	page: 0,
		          	pageSize: 9999,
				},
			})
		} else {
			dispatch({
				type: 'u1HistoryviewGroup/query',
				payload: {
					q: `affectSystem == '*${value}*'`,
				},
			})
		}
	}

	const customPanelStyle = {
	    borderRadius: 4,
	    border: 0,
	    overflow: 'hidden',
	    paddingLeft: 17,
	    paddingRight: 12,
	    paddingTop: 0,
	}

	const u1History = {
    location,
    dispatch,
    u1Historyview,
    loading
  }

	return (
		<ConfigProvider locale={zhCN}>
  <Row className="content-tree">
    <Col xl={expand ? 4 : 0} lg={expand ? 4 : 0} md={expand ? 6 : 0} sm={expand ? 6 : 0} xs={expand ? 6 : 0} xl={expand ? 6 : 0} className={myStyle.contentLeft}>
      <div className="content-left">
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
          <div>
            <Tree onSelect={onSelect} defaultExpandAll>
              {appTreeNodes}
            </Tree>
          </div>
        </Card>
      </div>
    </Col>
    <Col xl={expand ? 20 : 24} lg={expand ? 20 : 24} md={expand ? 20 : 24} sm={expand ? 18 : 24} xs={expand ? 18 : 24} xl={expand ? 18 : 24} className={myStyle.contentRight}>
      <div className="lines" />
      <Card style={{ minHeight: '100vh' }}>
        <Switch>
          <Route path='/u1Historyviews/u1HistoryviewScend' render={()=>(<U1hisoryview {...u1History}/>)}/>
        </Switch>
      </Card>
    </Col>
  </Row>
	</ConfigProvider>
	)
}


u1HistoryviewGroup.propTypes = {
  u1HistoryviewGroup: PropTypes.object,
}

export default connect(({ u1HistoryviewGroup, u1Historyview, loading }) => ({ u1HistoryviewGroup, u1Historyview, loading: loading.models.u1HistoryviewGroup }))(u1HistoryviewGroup)
