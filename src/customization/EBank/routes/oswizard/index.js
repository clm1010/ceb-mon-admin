
import React, { useState } from 'react'
import { connect } from 'dva'
import Drawer from './Drawer'
import ZHOSDrawer from './zhos/ZH_OS_Drawer'
import ZHDownDrawer from './zhdown/ZH_Down_Drawer'
import DBDrawer from './db/DB_Drawer'
import FHDB from './image/FHDB.png'
import ZH from './image/ZH.png'
import FH from './image/FH.png'
import ZHOS from './image/OS.png'
import ZHMW from './image/MW.png'
import ZHDB from './image/ZHDB.png'
import FHMW from './image/FHMW.png'
import FHOS from './image/FHOS.png'
import DOWN from './image/dowm.png'
import FHOSS from './image/FHOSS.png'
import PING from './image/ping.png'
import './index.css'
import { Card, Row, Col, Tooltip, Divider, Typography, Carousel, Avatar } from 'antd';
import OelModal from './zhdown/DetailModal'

const { Title } = Typography;
const { Meta } = Card;
const carouselRef = React.createRef();

const oswizard = ({
    location, dispatch, loading, oswizard, appSelect, oel,
}) => {
    const [state, setState] = useState(true)
    const user = JSON.parse(sessionStorage.getItem('user'))

    const {
        fh_os_DrawerVisible, item, q, loadingState, currentStep, appCategorlist, hasMOMess, resultState, resultMess, os_DrawerVisible, monitorList, monitoresult,
        findOSData, addMo, validateMO, secondflag, down_DrawerVisible, downpagination, downList, down_os_uuids, down_os_ips, offlineResult, oelModalVisible, loadingOState,
        visibleOelDetail, OelItem, fieldKeyword, loadingDownState, zabbixHostList, loading_step, loading_state, branchType,ping_DrawerVisible,
        db_DrawerVisible, loadingDBstate, MOData, existMoint, importItem, verifyRes, thirdRes, fourRes, os_type, mw_DrawerVisible,needMO
    } = oswizard	//这里把入参做了拆分，后面代码可以直接调用拆分的变量

    const drawerProps = {
        dispatch,
        visible: fh_os_DrawerVisible,
        loading,
        loadingState,
        currentStep,
        appSelect,
        appCategorlist,
        item,
        hasMOMess,
        resultState,
        resultMess
    }

    const osdrawerProps = {
        dispatch,
        visible: os_DrawerVisible,
        loading,
        appSelect,
        currentStep,
        findOSData,
        monitorList,  // 保存监控数据
        monitoresult, // 监控结果
        addMo,
        validateMO, // Mo确认信息
        secondflag,
        loadingOState,
        loading_step,
        loading_state,
        branchType
    }

    const zhdowndrawerProps = {
        dispatch,
        visible: down_DrawerVisible,
        currentStep,
        appSelect,
        downList,
        downpagination,
        q,
        down_os_uuids,
        down_os_ips,
        offlineResult,
        loadingDownState,
        zabbixHostList,
    }

    const onOpenDrawer = (visible, type) => {
        dispatch({
            type: 'oswizard/updateState',
            payload: {
                [`${visible}_DrawerVisible`]: true,
                branchType: type,
                os_type: visible, // 操作类型
            }
        })
    }

    const modalOelProps = {
        dispatch,
        visible: visibleOelDetail,
        loading,
        location,
        currentItem: OelItem,
        fieldKeyword
    }
    const db_mw_drwderProps = {
        dispatch,
        visible: db_DrawerVisible || mw_DrawerVisible || ping_DrawerVisible,
        loading,
        location,
        loading_step,
        loading_state,
        monitoresult, // 监控结果
        loadingDBstate,
        currentStep,
        MOData,     // Mo信息
        existMoint, //存在监控
        importItem,  //导入信息
        verifyRes, //验证结果
        thirdRes,
        fourRes,
        os_type,
        needMO,
    }

    let onPower = user.roles
    let disPower = false
    for (let a = 0; a < onPower.length; a++) {
        if (onPower[a].name == '超级管理员') {
            disPower = true
        }
    }

    return (
        <div className="content-inner">
            <div style={{ textAlign: "center", marginTop: '2%' }}>
                <Title>请选择要上线的类型</Title>
                <Divider />
            </div>
            <Row type='flex' justify='center' align='middle' style={{ marginTop: '2%', marginBottom: '2%' }} gutter={[20, 20]}>
                {
                    (user.branch == 'ZH' || !user.branch || disPower) ?
                        <Col span={4}>
                            <div className={state ? 'BranchBg' : ''}>
                                <Card style={{ width: 240, marginTop: 16 }}
                                    onClick={() => {
                                        setState(true)
                                        carouselRef.current.goTo(0);
                                    }}>
                                    <Meta
                                        avatar={
                                            <Avatar src={ZH} />
                                        }
                                        title="总行"
                                        description="总行监控自服务"
                                    />
                                </Card>
                            </div>
                        </Col>
                        : null
                }
                {
                    (user.branch != 'ZH' || !user.branch || disPower) ?
                        <Col span={4}>
                            <div className={state ? '' : 'BranchBg'}>
                                <Card style={{ marginTop: 16 }}
                                    onClick={() => {
                                        setState(false)
                                        carouselRef.current.goTo(1);
                                    }}>
                                    <Meta
                                        avatar={
                                            <Avatar src={FH} />
                                        }
                                        title="分行"
                                        description="分行监控自服务"
                                    />
                                </Card>
                            </div>
                        </Col>
                        : null
                }
            </Row>
            <Carousel ref={carouselRef} style={{ marginTop: 50 }}>
                {
                    (user.branch == 'ZH' || !user.branch || disPower) ?
                        <div>
                            <Row type='flex' justify='center' align='middle' gutter={[20, 20]}>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src={ZHOS} />}
                                        onClick={() => onOpenDrawer('os', 'zh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='总行-操作系统监控自服务'>操作系统类</Tooltip>}
                                            description="总行-操作系统监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" /*className='img' 置灰*/ src={ZHMW} />}
                                        onClick={() => onOpenDrawer('mw', 'zh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='总行-中间件监控自服务'>中间件类</Tooltip>}
                                            description="总行-中间件监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" /*className='img' 置灰*/ src={ZHDB} />}
                                        onClick={() => onOpenDrawer('db', 'zh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='总行-数据库监控自服务'>数据库类</Tooltip>}
                                            description="总行-数据库统监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" /*className='img' 置灰*/ src={PING} />}
                                        onClick={() => onOpenDrawer('ping', 'zh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='总行-ping监控自服务'>PING</Tooltip>}
                                            description="总行-ping监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src={DOWN} />}
                                        onClick={() => onOpenDrawer('down', 'zh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='总行-整机IP下线'>下线</Tooltip>}
                                            description="总行-整机IP下线" />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        : null
                }
                {
                    (user.branch != 'ZH' || !user.branch || disPower) ?
                        <div >
                            <Row type='flex' justify='center' align='middle' gutter={[20, 20]}>
                                {/* <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src={FHOS} />}
                                        onClick={() => onOpenDrawer('fh_os')}
                                    >

                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='分行-操作系统监控自服务'>操作系统类</Tooltip>}
                                            description="分行-操作系统监控自服务" />
                                    </Card>
                                </Col> */}
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src={FHOSS} />}
                                        onClick={() => onOpenDrawer('os', 'fh')}
                                    >

                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='分行-批量操作系统监控自服务'>操作系统类</Tooltip>}
                                            description="分行-批量操作系统监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" /* className='img' */ src={FHMW} />}
                                        onClick={() => onOpenDrawer('mw', 'zh')}
                                    >

                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='分行-中间件监控自服务'>中间件类</Tooltip>}
                                            description="分行-中间件监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" /* className='img' */ src={FHDB} />}
                                        onClick={() => onOpenDrawer('db', 'zh')}
                                    >

                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='分行-数据库监控自服务'>数据库类</Tooltip>}
                                            description="分行-批量数据库监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" /*className='img' 置灰*/ src={PING} />}
                                        onClick={() => onOpenDrawer('ping', 'zh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='分行-ping监控自服务'>PING</Tooltip>}
                                            description="分行-ping监控自服务" />
                                    </Card>
                                </Col>
                                <Col span={4}>
                                    <Card
                                        hoverable
                                        cover={<img alt="example" src={DOWN} />}
                                        onClick={() => onOpenDrawer('down', 'fh')}
                                    >
                                        <Meta style={{ textAlign: 'center' }} title={<Tooltip title='分行-整机IP下线'>下线</Tooltip>}
                                            description="分行-整机IP下线" />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        : null
                }
            </Carousel>
            <Drawer {...drawerProps} />
            <ZHOSDrawer {...osdrawerProps} />
            <ZHDownDrawer {...zhdowndrawerProps} />
            <OelModal {...modalOelProps} />
            <DBDrawer {...db_mw_drwderProps} />
        </div>
    )
}

//通过connect把model的数据注入到这个页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ oswizard, appSelect, oel, loading }) => ({ oswizard, appSelect, oel, loading: loading }))(oswizard)
