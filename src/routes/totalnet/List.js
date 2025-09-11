import React from 'react'
import { Table, Col, Tooltip, Button } from 'antd'
import { Link } from 'dva/router'

const list = ({ dispatch, loading, pagination, dataSource, backRoute, q, onSearch, percent }) => {
  const onSee = (record) =>{
    dispatch({
      type: 'totalnet/scoreLine',
      payload: {
        appCode: record.appCode,
        startTime: new Date().valueOf()-5*24*3600*1000,
        endTime: new Date().valueOf(),
      }
    })

    //打开echarts表格
    dispatch({
      type: 'totalnet/setState',
      payload: {
        echartsVisible: true,
        appCode: record.appCode,
      }
    })
  }

  const openMosModal = (record, e) => {
    console.log('openMosModal :', record)
    let smn = true
    let imn = false
    let uuid = null
    switch (e) {
      // 标准指标策略个数
      case 'criNumber':
      case 'criNumberPle':
        imn = true
        uuid = record.appCode
        break
      // 实际监控指标策略数
      case 'aceNumber':
      case 'aceNumberPle':
        imn = true
        break
      // 未覆盖指标策略数
      case 'noKpiNumber':
      case 'noKpiNumberPle':
        break
      // 个性策略数
      case 'acnNumberPle':
        smn = false
        imn = true
        break
      default:
    }

    /*
    获取关联实例的数据
  */
    dispatch({
      type: 'totalnet/kpiPolicy',
      payload: {
        kpiUUID: uuid,
        parentUUID: record.appCode,
        shouldMonitor: smn,
        isMonitoring: imn,
      },
    })
    /*
     打开弹出框
      */
    dispatch({
      type: 'totalnet/setState',
      payload: {
        mosVisible: true,
        parentUUID: record.appCode,
        shouldMonitor: smn,
        isMonitoring: imn,
        kpiUUID: uuid,
      },
    })
  }

  const onPageChange = (page) => {
    dispatch({
      type: 'totalnet/query',
      payload: {
        page: page.current - 1,
        pageSize: page.pageSize,
        q,
      },
    })
  }

  const click = (record) => {
    if (backRoute.length !== JSON.parse(sessionStorage.getItem('data')).length) {
      backRoute = JSON.parse(sessionStorage.getItem('data'))
    }
    let data = {
      name: record.appName,
      code: record.appCode,
      index: backRoute.length + 1,
    }
    backRoute.push(data)
    sessionStorage.setItem('data', JSON.stringify(backRoute))
  }
  const onSelect = (info) => {
    if (backRoute.length !== JSON.parse(sessionStorage.getItem('data')).length) {
      backRoute = JSON.parse(sessionStorage.getItem('data'))
    }
    let data = {
      name: info.appName,
      code: info.appCode,
      index: backRoute.length + 1,
    }
    backRoute.push(data)
    let query = `monitoringTree.parentCode == ${info.appCode}`
    onSearch(query)

    dispatch({
      type: 'totalnet/setState',
      payload: {
        backRoute,
      },
    })
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'appName',
      key: 'appName',
      render: (text, record) => {
        if (record.monitoringTree.children.length > 0) {
          return <div onClick={() => onSelect(record)}><a>{text}</a></div>
        }
        if (record.monitoringType.length > 0) {
          return <div>{text}({record.monitoringType.length})</div>
        }
        return <div>{text}</div>
      },
    },{
      title: '评分',
      dataIndex: 'monitoringScore',
      key: 'monitoringScore',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.monitoringScore - b.monitoringScore,
      render: (text, record) => {
        let total = percent.kpi + percent.tem + percent.over
        let actual = Math.floor((percent.kpi * record.coverage / total + percent.tem * record.normalizedRate / total + percent.over * record.overMonitoringRate / total) * 100) / 100
        return <div>{actual}</div>
        // return <div>{record.coverage - record.normalizedRate}</div>
      },
    },{
      title: 'IP地址',
      dataIndex: 'monitoringTree.discoverIP',
      key: 'monitoringTree.discoverIP',
      render: (text) => <div> {text} </div>,
    }, {
      title: '指标覆盖率',
      dataIndex: 'coverage',
      key: 'coverage',
      sorter: (a, b) => a.coverage - b.coverage,
      render: (text, record) => {
        let tips = ''
        record.monitoringType.forEach(item => {
          if (!item.isMonitoring && item.shouldMonitor) {
            tips = tips + item.kpiName + ','
          }
        })
        tips = tips.substring(0, tips.length - 1)
        if (record.monitoringTree.children.length === 0) {
          return <div>
            <Tooltip title={tips}>
              <Link to={`/indexlist/${record.appCode}`} onClick={() => click(record)}>{text}</Link>
            </Tooltip>
          </div>
        }
        return <div>{text}</div>
      },
    }, {
      title: '策略标准化率',
      dataIndex: 'normalizedRate',
      key: 'normalizedRate',
      sorter: (a, b) => a.normalizedRate - b.normalizedRate,
      render: (text, record) => {
        let tips = ''
        record.monitoringType.forEach(item => {
          if (!item.isMonitoring && item.shouldMonitor) {
            tips = tips + item.policyName + ','
          }
        })
        tips = tips.substring(0, tips.length - 1)
        if (record.monitoringTree.children.length === 0) {
          return <div>
            <Tooltip title={tips}>
              <Link to={`/strategylist/${record.appCode}`} onClick={() => click(record)}> {text} </Link>
            </Tooltip>
          </div>
        }
        return <div>{text}</div>
      },
    }, {
      title: '超额率',
      dataIndex: 'overMonitoringRate',
      key: 'overMonitoringRate',
      sorter: (a, b) => a.overMonitoringRate - b.overMonitoringRate,
    },{
      title: '标准指标数',
      dataIndex: 'criNumber',
      key: 'criNumber',
      sorter: (a, b) => a.criNumber - b.criNumber,
      render: (text, record) => {
        return <a onClick={() => openMosModal(record, 'criNumber')} >{text}</a>
      }
    }, {
      title: '实际指标数',
      dataIndex: 'aceNumber',
      key: 'aceNumber',
      sorter: (a, b) => a.aceNumber - b.aceNumber,
      render: (text, record) => {
        return <a onClick={() => openMosModal(record, 'aceNumber')} >{text}</a>
      }
    }, {
      title: '未覆盖指标数',
      sorter: (a, b) => (a.criNumber - a.aceNumber) - (b.criNumber - b.aceNumber),
      render: (text, record) => {
        return <a style={{ color: 'red' }} onClick={() => openMosModal(record, 'noKpiNumber')} >{record.criNumber - record.aceNumber}</a>
      }
    }, {
      title: '标准策略数',
      dataIndex: 'criNumberPle',
      key: 'criNumberPle',
      sorter: (a, b) => a.criNumberPle - b.criNumberPle,
      render: (text, record) => {
        return <a onClick={() => openMosModal(record, 'criNumberPle')} >{text}</a>
      }
    }, {
      title: '实际策略数',
      dataIndex: 'aceNumberPle',
      key: 'aceNumberPle',
      sorter: (a, b) => a.aceNumberPle - b.aceNumberPle,
      render: (text, record) => {
        return <a onClick={() => openMosModal(record, 'aceNumberPle')} >{text}</a>
      }
    },  {
      title: '未覆盖策略数',
      sorter: (a, b) => (a.criNumberPle - a.aceNumberPle) - (b.criNumberPle - b.aceNumberPle),
      render: (text, record) => {
        return <a style={{ color: 'red' }} onClick={() => openMosModal(record, 'noPleNumber')} >{record.criNumberPle - record.aceNumberPle}</a>
      }
    },{
      title: '个性策略数',
      dataIndex: 'acnNumberPle',
      key: 'acnNumberPle',
      sorter: (a, b) => a.acnNumberPle - b.acnNumberPle,
      render: (text, record) => {
        return <a onClick={() => openMosModal(record, 'acnNumberPle')} >{text}</a>
      }
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (<div>
          <Button size="small" shape="circle" icon="eye-o" onClick={() => onSee(record)} />
        </div>)
      },
    },

  ]

  const rowSelection = {
    onChange: (selecteRowKeys, selectedRows) => {
      let choosed = []
      selecteRowKeys.forEach(
        function (object) {
          choosed.push = object.id
        },
      )
      if (selectedRows.length > 0) {
        dispatch({
          type: 'totalnet/setState',
          paload: {
            batchDelete: true,
            selectedRows,
          },
        })
      } else if (selectedRows.length === 0) {
        dispatch({
          type: 'totalnet/setState',
          paload: {
            batchDelete: false,
            selectedRows: selectedRows,
          },
        })
      }
    },
  }
  return (
    <div>
      <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowSelection={rowSelection}
          pagination={pagination}
          onChange={onPageChange}
          loading={loading}
          rowKey={record => record.uuid}
          scroll={{ x: 1500 }}
          simple
          bordered
          size="middle"
        />
      </Col>
    </div>
  )
}
export default list
