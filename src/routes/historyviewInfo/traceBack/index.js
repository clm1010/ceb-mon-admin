import React from 'react'
import { connect } from 'dva'
import TraceBack from './traceBack';
const traceBack = ({ location, dispatch, traceBack, loading }) => {
  const props = {
    dispatch,
    loading,
    traceBack,
  }
  return (
    <TraceBack {...props} />
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ traceBack, loading }) => ({ traceBack, loading: loading.models.traceBack }))(traceBack)
