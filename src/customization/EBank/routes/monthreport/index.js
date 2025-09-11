import React from 'react'
import { connect } from 'dva'
import { Tabs, Card, Row, Col, Modal, Button } from 'antd'
import styles from './index.less'

import MyUpload from './MyUpload'
import monthMap from './monthMap'
import { config } from '../../../../utils'

const { TabPane } = Tabs
const { monthReportApi } = config.api

const monthreport = ({
    dispatch, monthreport
}) => {
    const {
        filelist
    } = monthreport

    function callback(key) {
        console.log(key)
    }

    const ondownload = (name) => {
        dispatch({
            type: 'monthreport/downLoad',
            payload: {
                filename: name
            }
        })
    }

    const ondeleFile = (name) => {
        Modal.confirm({
            title: `您确定要删除${name}吗?`,
            onOk() {
                dispatch({
                    type: 'monthreport/delfile',
                    payload: {
                        filename: name
                    }
                })
            }
        })
    }
    const uploadprops = {
        url: monthReportApi + 'upload/',
        dispatch
    }
    /**
     * 把数据转换为按年的对象
     */
    const fileObj = {}
    filelist.forEach(item => {
        let filenameList = item.substr(0, item.length - 5).split('_')
        if (fileObj[filenameList[filenameList.length - 2]]) {
            fileObj[filenameList[filenameList.length - 2]].push(item)
        } else {
            fileObj[filenameList[filenameList.length - 2]] = [item]
        }
    })
    let result_show = []
    for (let element in fileObj) {
        let name, src
        let a = fileObj[element].filter(item=>item.includes('y')).sort()
        let b = fileObj[element].filter(item=>item.includes('Q')).sort()
        let c = fileObj[element].filter(item=>!(item.includes('Q') || item.includes('y'))).sort()
        let d = a.concat(b).concat(c)
        
        const showTab = d.map(item => {
            let filenameList = item.substr(0, item.length - 5).split('_')
            for (let e of monthMap) {
                if (filenameList[filenameList.length - 1] == e.key) {
                    src = e.url
                    name = e.name
                }
            }
            return (
                <Col span={4}>
                    <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }} title={name} extra={<div className={styles.extra}><Button icon="download" onClick={() => ondownload(item)} /><Button icon="delete" onClick={() => ondeleFile(item)} /></div>} >
                        <div className={styles.custom}>
                            <a onClick={() => ondownload(item)}>
                                <img width="100%" height="178px" src={src} />
                            </a>
                        </div>
                    </Card>
                </Col>
            )
        })
        const tabPane =
            <TabPane tab={`${element}年监控报表`} key={`${element}`}>
                <Row gutter={16}>
                    {showTab}
                    {/* <Col span={4}>
                        <Card style={{ width: 240 }} title='添加监控报表' headStyle={{ textAlign: 'center' }} >
                            <div className={styles.custom}>
                                <MyUpload {...uploadprops} />
                            </div>
                        </Card>
                    </Col> */}
                </Row>
            </TabPane>
        result_show.unshift(tabPane)
    }

    return (
        <Card style={{ height: '100vh' }} >
            <Tabs onChange={callback}>
                {result_show}
            </Tabs>
        </Card >
    )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ monthreport, loading }) => ({ monthreport, loading }))(monthreport)
