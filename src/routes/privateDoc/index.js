import React from 'react'
import { connect } from 'dva'
import { Card, Button } from 'antd'
import styles from './index.less'

const privateDoc = ({
 location, dispatch, monitor, loading,
}) => { 

  return (
    <Card className={styles.back}>
      <Button style={{ width: 200, height: 300 }} icon="book" size="large">
        管理员手册下载
      </Button>
    </Card>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
//export default connect(({ monitor, loading }) => ({ monitor, loading: loading.models.monitor }))(privateDoc)
export default privateDoc
