import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from '../../components/Filter/OelFilter'
import FilterSchema from './FilterSchema'
import { Row, Col } from 'antd'
import DetailModal from './DetailModal'
import queryString from "query-string";
// internationalization
import { ConfigProvider } from 'antd';//国际化控件
import zhCN from 'antd/es/locale/zh_CN';//导入国际化包
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');//指定加载国际化目标
// end internationalization

const oelCust = ({
 location, dispatch, oelCust, oelEventFilter, loading, oelToolset, oelDataSouseset, eventviews,
}) => {
	const {
 q, title, filterDisable, list, pagination, currentItem, initValue, tagFilters, currentSelected, visibleFilter, visibleDetail, dataSouseeditVisible, oelViewer, oelColumns, oelDatasource, toolList, oelFilter, currentFieldValue, selectedRows, contextInput, fieldKeyword, journelList, curDetailTabKey,
} = oelCust
  const user = JSON.parse(sessionStorage.getItem('user'))
	document.title = title
  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: list,
    loading: loading.effects['oel/query'],
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
        type: 'oelCust/query',
        payload: {
          pagination: page,
          orderBy,
        },
      })
    },
  }

  const modalDetailProps = {
  	dispatch,
  	visibleDetail,
  	currentItem,
  	currentFieldValue,
		fieldKeyword,
		journelList,
		curDetailTabKey,
	}

	const filterProps = { //这里定义的是查询页面要绑定的数据源
    filterSchema: FilterSchema,
    q,
    dispatch,
    onSearch (q) {
			const { pathname } = location
      const query = queryString.parse(location.search);
      query.q = q
      query.page = 0
      const stringified = queryString.stringify(query)
			// delete query.datasourceList
			// delete query.dateFields
			// delete query.filterList
			// delete query.filteredSeverityMap
			// delete query.list
			// delete query.nonStringFields
			// delete query.oelColumns
			// delete query.oelDatasource
			// delete query.oelFilter
			// delete query.oelViewer
			// delete query.osUuid
			// delete query.pagination
			// delete query.qFilter
			// delete query.toolList
			// delete query.viewList
			// delete query.whereSQL

	    dispatch(routerRedux.push({
        pathname,
        search:stringified,
	      query: {
	      	...query,
	        page: 0,
	        q,
	      },
	    }))
    },
	}

  return (
    <div>
      <ConfigProvider locale={zhCN}>
      <Row style={{ background: '#fff' }}>
        <Col>
          <Filter {...filterProps} />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="content-inner3">
          <List {...listProps} />
        </Col>
      </Row>
      <DetailModal {...modalDetailProps} />
      </ConfigProvider>
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
 oelCust, oelEventFilter, oelToolset, oelDataSouseset, eventviews, app, loading,
}) => ({
 oelCust, oelToolset, oelEventFilter, oelDataSouseset, eventviews, app, loading,
}))(oelCust)
