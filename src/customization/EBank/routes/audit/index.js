
import React from 'react'
import { connect } from 'dva'
import List from './List'
import Tree from './Tree'
import Search from './Search'
import Drawer from './Drawer'
import { Row, Col } from 'antd'

const audit = ({
    location, dispatch, loading, audit,
}) => {
    const { list, q, treeValues, searchArr, currentItem, visible, expand , preData,pagination,es_q} = audit	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

    const listProps = { //这里定义的是查询页面要绑定的数据源
        dispatch,
        dataSource: list,
        pagination,
        loading: loading.effects['audit/query'],
        es_q,
        expand,
    }

    const treeProps = { //这里定义的是查询页面要绑定的数据源
        dispatch,
        treeValues,
        searchArr,
        loading: loading.effects['audit/queryTree'],
    }

    const searchProps = {
        dispatch,
        searchArr,
    }

    const drawerProps = {
        dispatch,
        item: currentItem,
        visible,
        loading: loading.effects['audit/queryPre'],
        preData,
    }
    return (
        <div>
            <Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <Search {...searchProps} />
                </Col>
            </Row>
            <Row gutter={24}>
                <Col lg={expand ? 0 : 5} md={expand ? 0 : 5} sm={expand ? 0 : 5} xs={expand ? 0 : 5} style={{ paddingRight: 0 }}>
                    <Tree {...treeProps} />
                </Col>
                <Col lg={expand ? 24 : 19} md={expand ? 24 : 19} sm={expand ? 24 : 19} xs={expand ? 24 : 19}>
                    <List {...listProps} />
                </Col>
            </Row>
            <Drawer  {...drawerProps} />
        </div>
    )
}

//通过connect把model的数据注入到这个页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ audit, loading }) => ({ audit, loading: loading }))(audit)
