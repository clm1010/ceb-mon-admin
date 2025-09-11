import React from 'react'
import List from './List'
import { Row, Col } from 'antd'

const miniOel = ({
 location, dispatch, loading, performance, app, onPageChange, pagination,
}) => {
	const { alarmList, oelColumns } = performance

  const listProps = { //这里定义的是查询页面要绑定的数据源
    dispatch,
    dataSource: alarmList,
    loading: loading,
    pagination,
    location,
    oelColumns,
    onPageChange,
  }

  return (
    <div>
      <Row gutter={24}>
        <Col className="content-inner2">
          <List {...listProps} />
        </Col>
      </Row>
    </div>
  )
}

//loading为自带对象，标记页面的加载状态
export default miniOel
