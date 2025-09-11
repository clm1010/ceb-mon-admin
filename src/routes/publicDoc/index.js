import React from 'react'
import { Card, Button,Tree } from 'antd'
import styles from './index.less'

const publicDoc = ({location, dispatch, monitor, loading }) => {

  const onShowHelp = () => {
    window.open(`${window.location.origin}/helpdoc/configurationHelp.html`, '配置帮助', '', 'false')
  };
  return (
    <Card className={styles.back}>
      <Button style={{ width: 200, height: 300 }} icon='book' onClick={onShowHelp} size='large'>
        用户手册下载
      </Button>
    </Card>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
// export default connect(({ traceBack, loading }) => ({ traceBack, loading: loading.models.traceBack }))(publicDoc)
export default publicDoc
