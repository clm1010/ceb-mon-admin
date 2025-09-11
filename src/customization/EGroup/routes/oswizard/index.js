import React from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import Filter from './queryForm'
import OsFilterSchema from './OsWizard/FilterSchema'
import OsButtonZone from './OsWizard/ButtonZone'
import OsList from './OsWizard/List'
import OsWizard from './OsWizard/osWizard'


const oswizard = ({
    location, dispatch, oswizard, loading, app, appSelect,
}) => {
    const {
        pagination,
        osWizardVisible,
        currentStep,
        modalType,
        batchDelete,
        pageChange,
        q,
        checkAll,
        policyAllList,
        policyExistList,
        policyList,
        errorList,
        preListType,
        errorMessage,
        listDb,
        dbItem,
        loadingEffect,
        batchSelect,
        onIssueForbid,         //下发禁止状态
        appCategorlist,
        twoStepData,
        dbinfos
    } = oswizard	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

    const osFilterProps = {//这里定义的是查询页面要绑定的数据源
        expand: false,
        filterSchema: OsFilterSchema,
        dispatch,
        onSearch(q) {
            dispatch({
                type: 'oswizard/queryOses',
                payload: {
                    page: 0,
                    q,
                },
            })
        }
    }

    const listOsProps = { //这里定义的是查询页面要绑定的数据源
        dispatch,
        dataSource: listDb,
        loading: loading,//.effects['oswizard/queryLines'],
        pagination,
        key: pageChange,
        batchDelete,
        batchSelect,
        q,
    }

    const buttonZoneProps = {
        dispatch,
        batchDelete,
        checkAll,
        q,
        batchSelect,
    }

    const modalOsProps = {	//这里定义的是弹出窗口要绑定的数据源
        loadingEffect,
        dispatch,
        dbItem: dbItem,		//要展示在弹出窗口的选中对象
        modalType, //弹出窗口的类型是'创建'还是'编辑'
        osWizardVisible, //弹出窗口的可见性是true还是false
        currentStep,
        appSelect,
        policyAllList,
        policyExistList,
        policyList,
        errorList,
        preListType,
        errorMessage,
        q,
        onIssueForbid,
        appCategorlist,
        twoStepData,
        dbinfos
    }

    let osButon = <OsButtonZone {...buttonZoneProps} />

    return (
        <div className="content-inner">
            <Row gutter={24}>
                <Col>
                    <Filter {...osFilterProps} buttonZone={osButon} />
                    <OsList {...listOsProps} />
                    <OsWizard {...modalOsProps} />
                </Col>
            </Row>
        </div>
    )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({
    oswizard, loading, app, appSelect
}) => ({
    oswizard, loading: loading.models.oswizard, app, appSelect
}))(oswizard)