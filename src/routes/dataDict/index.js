import React from 'react'
import { connect } from 'dva'
import Sider from './sider'
import Content from './content'
import { Layout } from 'antd'
import ImportResultModal from '../../routes/objectMO/ImportByExcel/ImportResultModal'

const dataDict = ({
 location, dispatch, dataDict, dataDictItem, loading,
}) => {
  dataDict.dispatch = dispatch
  dataDict.loading = loading.effects['dataDict/query']

  dataDictItem.dispatch = dispatch
  dataDictItem.loading = loading.effects['dataDictItem/query']

  const {
		moImportResultVisible,
		moImportResultType,
		moImportResultdataSource,
  } = dataDict
  const importResultModalProps = {
    dispatch,
    visible: moImportResultVisible,
    type: moImportResultType,
    dataSource: moImportResultdataSource,
    queryPath: 'dataDict/setState'
  }

  return (
    <Layout style={{ padding: '8px', background: '#fff', height: 'calc(100vh - 140px)' }}>
      <Sider {...dataDict} />
      <Content {...dataDictItem} />
      <ImportResultModal {...importResultModalProps}/>
    </Layout>
  )
}

// 通过connect把model的数据注入到这个Tool页面中来
// loading为自带对象，标记页面的加载状态
export default connect(({ dataDict, dataDictItem, loading }) => ({ dataDict, dataDictItem, loading }))(dataDict)
