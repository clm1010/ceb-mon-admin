import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Link, routerRedux } from 'dva/router'

import { Row, Col, Card, Table, Tree, Badge, Progress, Tooltip, Select, Spin, Button, message, Tag, Popover, Icon, DatePicker } from 'antd'
import myStyle from './index.less'
import moTree from '../../../../../utils/moTree/moTree'
import Countdown from './Countdown'
import Menus from './Menus'
import FirstValueSelect from './firstValueSelect'
//import { onSearchInfo, genDictOptsByName } from '../../../utils/FunctionTool'
import moment from 'moment'
import './list.css'
import DashboardAlarm from '../alarm'

const { RangePicker } = DatePicker
const { CheckableTag } = Tag
message.config({ top: 100 })
const TreeNode = Tree.TreeNode
const Option = Select.Option
const OptGroup = Select.OptGroup
const performance = ({
                       dispatch, loading, location, performance, initValue, countState,
                     }) => {
  console.log(performance.initValue)
  //获取当前用户信息
  const user = JSON.parse(sessionStorage.getItem('user'))
  //倒计时配置项---start
  const countdownProps = {
    dispatch,
    initValue: performance.initValue,
    location,
    countState,
  }
  //end
  //菜单配置项---start
  const menuProps = {
    current: 'Home',
    dispatch,
    userbranch:user.branch
  }
  //end
  //数值格式转换---start
  function formatNumber (num, precision, separator) {
    let parts
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
      // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
      // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
      // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
      // 的值变成了 12312312.123456713
      num = Number(num)
      // 处理小数点位数
      num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString()
      // 分离数字的小数部分和整数部分
      parts = num.split('.')
      // 整数部分加[separator]分隔, 借用一个著名的正则表达式
      parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator || ','}`)

      return parts.join('.')
    }
    return NaN
  }
  //数值格式转换---end

  const {
    lossList,
    responseList,
    cpuList,
    memoryList,
    portUsageList,
    portTrafficList,
    paginationPortUsage,
    pagination,
    paginationMemory,
    paginationCpu,
    paginationLoss,
    paginationResponse,
    firstValue,
    paginationTopTraffic,
    InPortDicardsList,
    OutPortDicardsList,
    InPortErrorList,
    OutPortErrorList,
    paginationInPortDicards,
    paginationOutPortDicards,
    paginationInPortError,
    paginationOutPortError,
    severityMap,
    cpuNums, //cpu告警数
    menNums, //内存告警数
    equDownNums, //设备Down告警数
    equUpNums, //设备Up告警数
    portDownNums, //端口Down告警数
    porUpNums, //端口up告警数
    portUsageInList,
    paginationPortUsageIn,
    portTrafficInList,
    paginationTopTrafficIn,
    inForwardDateSource,//端口输入包转发数
    outForwardDateSource,//端口输出包转发数
    inForwardRateDateSource,//端口输入包转发率
    outForwardRateDateSource,//端口输出包转发率
    inForwardPagination,//端口输入包转发数
    outForwardPagination,//端口输出包转发数
    inForwardRatePagination,//端口输入包转发率
    outForwardRatePagination,//端口输出包转发率
    oneHour,
    towHour,
    toDay,
    severity1,
    severity2,
    severity3,
    severity4,
    severity5
  } = performance

  //排序函数
  let by = function (name) {
    return function (o, p) {
      let a,
        b
      if (typeof o === 'object' && typeof p === 'object' && o && p) {
        a = o[name]
        b = p[name]
        if (a === b) {
          return 0
        }
        if (typeof a === typeof b) {
          return a > b ? -1 : 1
        }
        return typeof a > typeof b ? -1 : 1
      }
      throw ('error')
    }
  }
//	console.log('portUsageNewList : ',portUsageNewList)
  //入方向流量+出方向流量排序
  const columns = [{
    title: '主机名',
    dataIndex: 'hostName',
    key: 'hostName',
    className: 'hostName',
    render: (text, record) => {
      return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chdlistall?q=${record.histIp}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
    },

  }, {
    title: '接口名',
    dataIndex: 'interfaceName',
    key: 'interfaceName',
    className: 'interfaceName',
    render: (text, record) => {
      let bgcolor = 'default'
      if (record.sta == '1') {
        bgcolor = 'success'
      } else if (record.sta == '2') {
        bgcolor = 'error'
      } else {
        bgcolor = 'default'
      }
      return <div style={{ float: 'left' }}><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.interfaceName}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
    },
  }, {
    title: '采集时间',
    dataIndex: 'time',
    key: 'time',
    width: 180,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  }, {
    title: '端口描述',
    dataIndex: 'port',
    key: 'port',
    render: (text, record) => {
      return <div title={text}>{text}</div>
    },
  }, {
    title: '出方向利用率',
    dataIndex: 'value',
    key: 'value',
    width: 200,
    render: (percent, record) => {
      let v = ''
      let statu = ''
      //流量计算
//		 	if(nums >= 8388608 && nums < 8589934592){
//		 		v=formatNumber((nums/8388608).toFixed(2))+'Mbps'
//		 	}else if(nums >=8589934592){
//		 		v=formatNumber((nums/8589934592).toFixed(2))+'Gbps'
//		 	}else if(nums < 8388608){
//		 		v=formatNumber((nums/8192).toFixed(2))+'Kbps'
//		 	}
      let info = `${record.value.toFixed(2)}%`
      let precents = `${Math.round(percent * 100) / 100}%`
      if (parseInt(percent) >= 0 && parseInt(percent) <= 50) {
        statu = 'success'
      } else if (parseInt(percent) > 50 && parseInt(percent) <= 70) {
        statu = 'active'
      } else if (parseInt(percent) > 70) {
        statu = 'exception'
      }

      return <Progress style={{ paddingRight: 10 }} status={statu} percent={percent > 100 ? 100 : percent} format={() => info} />
    },
  }]

  const portUsageInListColumns = [
    {
      title: '主机名',
      dataIndex: 'hostName',
      key: 'hostName',
      className: 'hostName',
      render: (text, record) => {
        return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chdlistall?q=${record.histIp}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
      },
    }, {
      title: '接口名',
      dataIndex: 'interfaceName',
      key: 'interfaceName',
      className: 'interfaceName',
      render: (text, record) => {
        let bgcolor = 'default'
        if (record.sta == '1') {
          bgcolor = 'success'
        } else if (record.sta == '2') {
          bgcolor = 'error'
        } else {
          bgcolor = 'default'
        }
        return <div style={{ float: 'left' }}><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.interfaceName}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
      },
    }, {
      title: '采集时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (text, record) => {
        return <div style={{ float: 'left' }}>{text}</div>
      },
    }, {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port',
      render: (text, record) => {
        return <div>{text}</div>
      },
    }, {
      title: '入方向利用率',
      dataIndex: 'value',
      key: 'value',
      width: 200,
      render: (percent, record) => {
        let v = ''
        let statu = ''
        let info = `${record.value.toFixed(2)}%`
        let precents = `${Math.round(percent * 100) / 100}%`
        if (parseInt(percent) >= 0 && parseInt(percent) <= 50) {
          statu = 'success'
        } else if (parseInt(percent) > 50 && parseInt(percent) <= 70) {
          statu = 'active'
        } else if (parseInt(percent) > 70) {
          statu = 'exception'
        }

        return <Progress style={{ paddingRight: 10 }} width={132} status={statu} percent={percent > 100 ? 100 : percent} format={() => info} />
      },
    },
  ]

  const columns10 = [{
    title: '主机名',
    dataIndex: 'hostName',
    key: 'hostName',
    className: 'hostName',
    render: (text, record) => {
      return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chdlistall?q=${record.histIp}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
    },
  }, {
    title: '接口名',
    dataIndex: 'interfaceName',
    key: 'interfaceName',
    className: 'interfaceName',
    render: (text, record) => {
      let bgcolor = 'default'
      if (record.sta == '1') {
        bgcolor = 'success'
      } else if (record.sta == '2') {
        bgcolor = 'error'
      } else {
        bgcolor = 'default'
      }
      return <div style={{ float: 'left' }}><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.interfaceName}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
    },
  }, {
    title: '采集时间',
    dataIndex: 'time',
    key: 'time',
    width: 180,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  },
    {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port',
      render: (text, record) => {
        return <div title={text}>{text}</div>
      },
    },
    {
      title: '出方向流量',
      dataIndex: 'value',
      key: 'value',
      width: 200,
      render: (text, record) => {
        let v = ''
        let nums = text
        if (nums >= 1048576 && nums < 1073741824) {
          v = `${(nums / 1048576).toFixed(2)}MB`
        } else if (nums >= 1073741824) {
          v = `${(nums / 1073741824).toFixed(2)}GB`
        } else if (nums < 1073741824) {
          v = `${(nums / 1024).toFixed(2)}KB`
        }
        return <span style={{ width: '100%', float: 'left', textAlign: 'left' }}>{v}</span>
      },
    }]

  const portTrafficListTopIn20 = [{
    title: '主机名',
    dataIndex: 'hostName',
    key: 'hostName',
    className: 'hostName',
    render: (text, record) => {
      return <div style={{ float: 'left' }}><Tooltip placement="top" title={text}><Link to={`/chdlistall?q=${record.histIp}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
    },
  }, {
    title: '接口名',
    dataIndex: 'interfaceName',
    key: 'interfaceName',
    className: 'interfaceName',
    render: (text, record) => {
      let bgcolor = 'default'
      if (record.sta == '1') {
        bgcolor = 'success'
      } else if (record.sta == '2') {
        bgcolor = 'error'
      } else {
        bgcolor = 'default'
      }
      return <div style={{ float: 'left' }}><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.interfaceName}+${record.branchname}`} target="_blank">{text}</Link></Tooltip></div>
    },
  }, {
    title: '采集时间',
    dataIndex: 'time',
    key: 'time',
    width: 180,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  },
    {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port',
      render: (text, record) => {
        return <div title={text}>{text}</div>
      },
    },
    {
      title: '入方向流量',
      dataIndex: 'value',
      key: 'value',
      width: 200,
      render: (text, record) => {
        let v = ''
        let nums = text
        if (nums >= 1048576 && nums < 1073741824) {
          v = `${(nums / 1048576).toFixed(2)}MB`
        } else if (nums >= 1073741824) {
          v = `${(nums / 1073741824).toFixed(2)}GB`
        } else if (nums < 1073741824) {
          v = `${(nums / 1024).toFixed(2)}KB`
        }
        return <span style={{ width: '100%', float: 'left', textAlign: 'left' }}>{v}</span>
      },
    }]

  const columns20 = [{
    title: '主机名',
    dataIndex: 'hostName',
    className: 'interfaceName',
    key: 'hostName',
    render: (text, record) => {
      let bgcolor = 'default'
      if (record.Severity == 0) {
        bgcolor = 'error'
      } else {
        bgcolor = 'success'
      }
      return <Badge status={bgcolor} text={record.hostName} />
    },
  }, {
    title: '响应时间',
    dataIndex: 'CorrespondingTime',
    key: 'CorrespondingTime',
    width: 80,
    sorter: (a, b) => a.CorrespondingTime - b.CorrespondingTime,
  }, {
    title: '丢包率',
    dataIndex: 'packetloss',
    key: 'packetloss',
    width: 80,
    sorter: (a, b) => a.packetloss - b.packetloss,
  }]

  const responseColumns = [{
    title: '主机名',
    dataIndex: 'deviceName',
    key: 'deviceName',
    className: 'name',
    width: 170,
    render: (text, record) => {
      return <div><Tooltip placement="top" title={text}><Link to={`/chdlistresponse?q=${record.histIp}+${record.branchname}`} target="_blank">{record.deviceName}</Link></Tooltip></div>
    },
  }, {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    width: 150,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  }, {
    title: '响应时间',
    dataIndex: 'responseValue',
    key: 'responseValue',
    width: 70,
    render: (text, record) => {
      let nums
      if (text >= 1) {
        nums = `${text}秒`
      } else if (text < 1) {
        nums = `${text.toFixed(3) * 1000}ms`
      }
      return <div style={{ float: 'left', height: '20px' }}>{nums}</div>
    },
  }]

  const lossColumns = [{
    title: '主机名',
    dataIndex: 'deviceName',
    key: 'deviceName',
    className: 'name',
    width: 170,
    render: (text, record) => {
      return <div><Tooltip placement="top" title={text}><Link to={`/chdlistloss?q=${record.histIp}+${record.branchname}`} target="_blank">{record.deviceName}</Link></Tooltip></div>
    },
  }, {
    title: '采集时间',
    dataIndex: 'time',
    key: 'time',
    width: 150,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  }, {
    title: '丢包率',
    dataIndex: 'lossValue',
    key: 'lossValue',
    width: 120,
    render: (text, record) => {
      let statu = ''
      let info = `${record.lossValue.toFixed(2)}%`
      if (parseInt(text) >= 0 && parseInt(text) <= 50) {
        statu = 'success'
      } else if (parseInt(text) > 50 && parseInt(text) <= 70) {
        statu = 'active'
      } else if (parseInt(text) > 70) {
        statu = 'exception'
      }
      return <Progress style={{ paddingRight: 10 }} status={statu} percent={parseInt(text) > 100 ? 100 : parseInt(text)} format={() => info} />
    },
  }]

  const cpuColumns = [{
    title: '主机名',
    dataIndex: 'deviceName',
    width: 170,
    key: 'deviceName',
    className: 'name',
    render: (text, record) => {
      return <div><Tooltip placement="top" title={text}><Link to={`/chdlistcpu?q=${record.histIp}+${record.branchname}`} target="_blank">{record.deviceName}</Link></Tooltip></div>
    },
  }, {
    title: 'CPU',
    dataIndex: 'cpuPolicName',
    width: 100,
    key: 'cpuPolicName',
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  },{
    title: '采集时间',
    dataIndex: 'time',
    key: 'time',
    width: 150,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  }, {
    title: 'CPU使用率',
    dataIndex: 'cpuValue',
    key: 'cpuValue',
    width: 120,
    render: (text, record) => {
      let statu = ''
      let info = `${text.toFixed(2)}%`
      if (parseInt(text) >= 0 && parseInt(text) <= 50) {
        statu = 'success'
      } else if (parseInt(text) > 50 && parseInt(text) <= 70) {
        statu = 'active'
      } else if (parseInt(text) > 70) {
        statu = 'exception'
      }

      return <Progress style={{ paddingRight: 10 }} status={statu} percent={parseInt(text) > 100 ? 100 : parseInt(text)} format={() => info} />
    },
  }]

  const memoryColumns = [{
    title: '主机名',
    dataIndex: 'deviceName',
    key: 'deviceName',
    width: 170,
    className: 'name',
    render: (text, record) => {
      return <div><Tooltip placement="top" title={text}><Link to={`/chdlistmemery?q=${record.histIp}+${record.branchname}`} target="_blank">{record.deviceName}</Link></Tooltip></div>
    },
  }, {
    title: '内存',
    dataIndex: 'kpiname',
    width: 100,
    key: 'kpiname',
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  },{
    title: '采集时间',
    dataIndex: 'time',
    key: 'time',
    width: 150,
    render: (text, record) => {
      return <div style={{ float: 'left' }}>{text}</div>
    },
  }, {
    title: '内存使用率',
    dataIndex: 'memoryValue',
    key: 'memoryValue',
    width: 120,
    render: (text, record) => {
      let statu = ''
      let info = `${text.toFixed(2)}%`
      if (parseInt(text) >= 0 && parseInt(text) <= 50) {
        statu = 'success'
      } else if (parseInt(text) > 50 && parseInt(text) <= 70) {
        statu = 'active'
      } else if (parseInt(text) > 70) {
        statu = 'exception'
      }
      return <Progress style={{ paddingRight: 10 }} status={statu} percent={parseInt(text) > 100 ? 100 : parseInt(text)} format={() => info} />
    },
  }]

  const portDicards1 = [
    {
      title: '端口名',
      dataIndex: 'moname',
      key: 'moname',
      className: 'name',
      render: (text, record) => {
        let bgcolor = 'default'
        if (record.sta == '1') {
          bgcolor = 'success'
        } else if (record.sta == '2') {
          bgcolor = 'error'
        } else {
          bgcolor = 'default'
        }
        return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
      },
    },
    {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port1',
      className: 'ellipsis',
      render: (text, record) => <div title={text}>{text}</div>,
    },
    {
      title: '输出丢包数',
      dataIndex: 'value',
      width: 95,
      key: 'value',
    },
  ]

  const portDicards2 = [
    {
      title: '端口名',
      dataIndex: 'moname',
      key: 'moname',
      className: 'name',
      render: (text, record) => {
        let bgcolor = 'default'
        if (record.sta == '1') {
          bgcolor = 'success'
        } else if (record.sta == '2') {
          bgcolor = 'error'
        } else {
          bgcolor = 'default'
        }
        return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
      },
    },
    {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port2',
      className: 'ellipsis',
      render: (text, record) => <div title={text}>{text}</div>,
    },
    {
      title: '输入丢包数',
      width: 85,
      dataIndex: 'value',
      key: 'value',
    },
  ]

  const portError1 = [
    {
      title: '端口名',
      dataIndex: 'moname',
      key: 'moname',
      className: 'name',
      render: (text, record) => {
        let bgcolor = 'default'
        if (record.sta == '1') {
          bgcolor = 'success'
        } else if (record.sta == '2') {
          bgcolor = 'error'
        } else {
          bgcolor = 'default'
        }
        return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
      },
    },
    {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port3',
      className: 'ellipsis',
      render: (text, record) => <div title={text}>{text}</div>,
    },
    {
      title: '输出错包数',
      width: 85,
      dataIndex: 'value',
      key: 'value',
    },
  ]

  const portError2 = [
    {
      title: '端口名',
      dataIndex: 'moname',
      key: 'moname',
      className: 'name',
      render: (text, record) => {
        let bgcolor = 'default'
        if (record.sta == '1') {
          bgcolor = 'success'
        } else if (record.sta == '2') {
          bgcolor = 'error'
        } else {
          bgcolor = 'default'
        }
        return <div><Badge status={bgcolor} /><Tooltip placement="top" title={text}><Link to={`/chddetail?q=${record.histIp}+${record.keyword}+${record.branchname}`} target="_blank">{record.moname}</Link></Tooltip></div>
      },
    },
    {
      title: '端口描述',
      dataIndex: 'port',
      key: 'port4',
      render: (text, record) => <div title={text}>{text}</div>,
    },
    {
      title: '输入错包数',
      width: 95,
      dataIndex: 'value',
      key: 'value',
    },
  ]
  //dicards  portError
  //end
  //故障统计
  const faultType = [
    {
      title: '故障类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: '告警数',
      dataIndex: 'nums',
      key: 'nums',
      render: (text, record) => {
        let id = `/faultList?q=${record.id}`
        return <Link to={id} target="_blank" >{text}</Link>
      },
    },
  ]

  const faultDataSource = [
    {
      type: 'CPU',
      id: 'cpu',
      nums: cpuNums,
      sql: 'n_ComponentTypeID == \'NetWork\';( n_SubComponentID == \'CPU\' or  n_SubComponent == \'cpu\' );',
    }, {
      type: '内存',
      id: 'men',
      nums: menNums,
      sql: 'n_ComponentTypeID == \'NetWork\';( n_SubComponentID == \'Memory\' or  n_SubComponent == \'内存\' );',
    }, {
      type: '设备Down',
      id: 'equDown',
      nums: equDownNums,
      sql: 'n_ComponentTypeID == \'NetWork\';agent==\'*Ping*\';((manager==\'*Zabbix*\';alertGroup==\'ICMP_Failed\') or manager!=\'*Zabbix*\');n_ClearTime==1970-01-01T08:00:00;severity!=\'0\';',
    }, {
      type: '设备Up',
      id: 'equUp',
      nums: equUpNums,
      sql: 'n_ComponentTypeID == \'NetWork\';agent==\'*Ping*\';n_ClearTime>1970-01-01T08:00:00;severity==\'0\';',
    }, {
      type: '端口Down',
      id: 'portDown',
      nums: portDownNums,
      sql: 'n_ComponentTypeID == \'NetWork\';manager!=\'*Zabbix*\';n_InstanceID!=null;(evenTid==\'*DOWN*\' or evenTid==\'*ADJCHG*\');alertGroup!=\'未知SYSLOG事件\';(evenTid!=\'*_full*\' or evenTid!=\'*_up*\');',
    }, {
      type: '端口Up',
      id: 'portUp',
      nums: porUpNums,
      sql: 'n_ComponentTypeID == \'NetWork\';manager!=\'*Zabbix*\';n_InstanceID!=null;(evenTid==\'*DOWN*\' or evenTid==\'*ADJCHG*\');alertGroup!=\'未知SYSLOG事件\';(evenTid==\'*_full*\' or evenTid==\'*_up*\');',
    },
  ]

  const inForwardColumns = [
    {
      title: '端口名',
      dataIndex: 'portName',
      className: 'name',
      key: 'portName',
      render: (text,record) => {
        return <div><Link to={`/chddetail?q=${record.hostip}+${record.keyword}+${record.branchname}`} target="_blank">{record.portName}</Link></div>
      }
    },{
      title: '时间',
      dataIndex: 'time',
      className: 'ellipsis',
      key: 'time',
      render: (text, record) => {
        return new Date(text*1000).format('yyyy-MM-dd hh:mm:ss')
      }
    },{
      title: '入转发数',
      dataIndex: 'value',
      width: 85,
      key: 'value'
    }
  ]
  const outForwardColumns = [
    {
      title: '端口名',
      dataIndex: 'portName',
      className: 'name',
      key: 'portName',
      render: (text,record) => {
        return <div><Link to={`/chddetail?q=${record.hostip}+${record.keyword}+${record.branchname}`} target="_blank">{record.portName}</Link></div>
      }
    },{
      title: '时间',
      dataIndex: 'time',
      className: 'ellipsis',
      key: 'time',
      render: (text, record) => {
        return new Date(text*1000).format('yyyy-MM-dd hh:mm:ss')
      }
    },{
      title: '出转发数',
      dataIndex: 'value',
      width: 85,
      key: 'value'
    }
  ]
  const inForwardRateColumns = [
    {
      title: '端口名',
      dataIndex: 'portName',
      className: 'name',
      key: 'portName',
      render: (text,record) => {
        return <div><Link to={`/chddetail?q=${record.hostip}+${record.keyword}+${record.branchname}`} target="_blank">{record.portName}</Link></div>
      }
    },{
      title: '时间',
      dataIndex: 'time',
      className: 'ellipsis',
      key: 'time',
      render: (text, record) => {
        return new Date(text*1000).format('yyyy-MM-dd hh:mm:ss')
      }
    },{
      title: '入转发率',
      dataIndex: 'value',
      width: 85,
      key: 'value'
    }
  ]
  const outForwardRateColumns = [
    {
      title: '端口名',
      dataIndex: 'portName',
      className: 'name',
      key: 'portName',
      render: (text,record) => {
        return <div><Link to={`/chddetail?q=${record.hostip}+${record.keyword}+${record.branchname}`} target="_blank">{record.portName}</Link></div>
      }
    },{
      title: '时间',
      dataIndex: 'time',
      className: 'ellipsis',
      key: 'time',
      render: (text, record) => {
        return new Date(text*1000).format('yyyy-MM-dd hh:mm:ss')
      }
    },{
      title: '出转发率',
      dataIndex: 'value',
      width: 85,
      key: 'value'
    }
  ]

  const oelProps = {
    dispatch,
    loading:loading.effects['performance/queryEvent'],
    location,
    performance,
    onPageChange,
    pagination,
  }

	function onPageChange (page, filters) {
		const { query, pathname } = location
		dispatch({
		    	type: 'performance/queryEvent',
			payload: {
				page: page.current - 1,											//分页要减1，因为后端数据页数从0开始
             	pageSize: page.pageSize,
			},
		})
	}

  const onSelect = () => {

  }

  //定义默认展开的节点数组
  let expandKeys = []
  //定义默认选中的节点数组
  let selectedKeysVal = []
  const loop = data => data.map((item) => {
    if (item && location.pathname.includes(item.uuid)) {
      selectedKeysVal.push(item.uuid)
    }

    if (item.children && item.children.length > 0) {
      expandKeys.push(item.uuid)
      return <TreeNode title={item.name} key={item.uuid} isLeaf={false}>{loop(item.children)}</TreeNode>
    }
    return <TreeNode title={item.name} key={item.uuid} isLeaf />
  })

  let treeNodes = []
  if (moTree && moTree.length > 0) {
    treeNodes = loop(moTree)
  }

  const onChangeType = (value) => {
    console.log(`radio checked:${value}`)
    dispatch({
      type: 'performance/querySuccess',
      payload: {
        typeValue: value,
      },
    })
  }
  const onChangeFirm = (value) => {
    console.log(`radio checked:${value}`)
    dispatch({
      type: 'performance/querySuccess',
      payload: {
        firmValue: value,
      },
    })
  }
  const onChangeFirst = (value) => {
    console.log(`radio checked:${value}`)
    if (value.length === 0) {
      message.info('必须选择查询条件!', 5)
    }
    dispatch({
      type: 'performance/querySuccess',
      payload: {
        firstValue: value,
      },
    })
  }

  localStorage.getItem(`${user.username}_firstValue`)
  let querySql = []
  if (localStorage.getItem(`${user.username}_firstValue`) === null) {
    querySql.push('ALL')
  } else {
    querySql = localStorage.getItem(`${user.username}_firstValue`).split('_')
  }

  const firstValueSelectProps = {
    dispatch,
    firstValue,
    querySql,
  }

  const onClick = () => {
    let state = document.getElementById('select').textContent.trim()
    if (firstValue.length === 1 && firstValue[0] === '全部') {

    } else if (firstValue.length === 0 && state === '服务域：') {
      message.info('服务域必须选择查询条件!', 5)
    } else if (firstValue.length > 1 && firstValue.join(',').includes('ALL')) {
      message.info('服务域条件选择逻辑错误!', 5)
    } else {
      	dispatch({ type: 'performance/queryEvent' })
        dispatch({ type: 'performance/queryFault' })
        dispatch({ type: 'performance/queryTopUsage' })
        dispatch({ type: 'performance/queryTopUsageIn' })
        dispatch({ type: 'performance/queryTopTraffic' })
        dispatch({ type: 'performance/queryTopRespon'})
        dispatch({ type: 'performance/queryTopLoss' })
        dispatch({ type: 'performance/queryTopCPU' })
        dispatch({ type: 'performance/queryTopMem' })
        dispatch({ type: 'performance/queryInDicards' })
        dispatch({ type: 'performance/queryOutDicards' })
        dispatch({ type: 'performance/queryInError' })
        //dispatch({ type: 'queryOutError' })
        dispatch({ type: 'performance/queryTopTrafficIn' })
        dispatch({ type: 'performance/outForwardQuery' })
        dispatch({ type: 'performance/inForwardQuery' })
        dispatch({ type: 'performance/outForwardRateQuery' })
        dispatch({ type: 'performance/inForwardRateQuery' })
    }
  }

  //时间互斥
  const handleChangeOneHour = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			oneHour: value,
		    towHour: false,
		    toDay: false,
		    rangePicker: false,
		    rangePickerDate: []
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeTowHour = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			oneHour: false,
		    towHour: value,
		    toDay: false,
		    rangePicker: false,
		    rangePickerDate: []
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeToDay = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			oneHour: false,
		    towHour: false,
		    toDay: value,
		    rangePicker: false,
		    rangePickerDate: []
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeYesDay = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			oneHour: false,
		    towHour: false,
		    toDay: false,
		    rangePicker: true,
		    rangePickerDate: value
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }


  //等级不互斥
  const handleChangeSeverity1 = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			severity1: value
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeSeverity2 = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			severity2: value
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeSeverity3 = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			severity3: value
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeSeverity4 = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			severity4: value
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const handleChangeSeverity5 = (value) => {
  	dispatch({
  		type: 'performance/querySuccess',
  		payload:{
  			severity5: value
  		}
  	})
  	dispatch({ type: 'performance/queryEvent' })
  }

  const dashboardAlarmProps = {
  	dataSource: performance.alarmList,
  	paginationAlarm: performance.pagination,
  	loading: loading.effects['performance/queryEvent']
  }

  console.log('localStoragegetItem', localStorage.getItem(`${user.username}_firstValue`))

  console.log('querySql:', querySql)
  //{genDictOptsByName('equipType')}
  //{genDictOptsByName('networkVendor')}
  return (
    <Row gutter={6}>
      <Col lg={16} md={16} sm={16} xs={16}>
        <Menus {...menuProps} />
      </Col>
      <Col lg={8} md={8} sm={8} xs={8}>
        <Countdown {...countdownProps} />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24} style={{ float: 'right' }}>
        <Card bodyStyle={{ width: '100%', border: 'none', padding: 6 }} style={{ marginBottom: '6px' }}>
          <div className={myStyle.selectPart} style={{ marginLeft: 32 }}>
            <span>设备类型：</span>
            <Select
              style={{ width: 100 }}
              showSearch
              defaultValue={localStorage.getItem(`${user.username}_typeValue`) === null ? 'ALL' : localStorage.getItem(`${user.username}_typeValue`)}
              onChange={onChangeType}
            >

              <Option value="ALL">全部</Option>
              <Option value="路由器">路由器</Option>
              <Option value="交换机">交换机</Option>
              <Option value="防火墙">防火墙</Option>
              <Option value="负载均衡">负载均衡</Option>
              <Option value="线路">线路</Option>
              <Option value="网点">网点</Option>
            </Select>
          </div>
          <div className={myStyle.selectPart}>
            <span>厂商：</span>
            <Select
              style={{ width: 100 }}
              showSearch
              defaultValue={localStorage.getItem(`${user.username}_firmValue`) === null ? 'ALL' : localStorage.getItem(`${user.username}_firmValue`)}
              onChange={onChangeFirm}
            >

              <Option value="ALL">全部</Option>
              <Option value="CISCO">思科(英文)</Option>
              <Option value="H3C">华为</Option>
              <Option value="RUIJIE">锐捷(英文)</Option>
              <Option value="MP">MP</Option>

              <Option value="JUNIPER">JUNIPER</Option>
              <Option value="cisco">cisco</Option>
              <Option value="F5">F5</Option>
              <Option value="HILLSTONE">HILLSTONE</Option>
              <Option value="锐捷">锐捷(中文)</Option>
              <Option value="HW">HW</Option>
              <Option value="RG">RG</Option>
              <Option value="juniper">juniper</Option>

              <Option value="思科">思科(中文)</Option>
              <Option value="Switch">Switch</Option>
              <Option value="maipu">maipu</Option>
              <Option value="venustech">venustech</Option>

              <Option value="MAIPU">MAIPU</Option>
              <Option value="H3c">H3c</Option>
              <Option value="xa_xc_cisco2611">xa_xc_cisco2611</Option>
              <Option value="mapu">mapu</Option>

              <Option value="OTHER">OTHER</Option>
            </Select>
          </div>
          <div className={myStyle.selectPart} id="select">
            <FirstValueSelect {...firstValueSelectProps} />
          </div>
          <Button onClick={onClick} icon="search" />
        </Card>
      </Col>
      <Col lg={24} md={24} sm={24} xs={24} style={{ float: 'right' }}>
        <Card bodyStyle={{ width: '98%', border: 'none', padding: 6 }}
              style={{ marginBottom: '6px' }}
              title="最新100条告警"
              extra={
                <div>
                  <CheckableTag checked={oneHour} onChange={handleChangeOneHour}>最近1小时</CheckableTag>
                  <CheckableTag checked={towHour} onChange={handleChangeTowHour}>最近2小时</CheckableTag>
                  <CheckableTag checked={toDay} onChange={handleChangeToDay}>今天</CheckableTag>
                  <Popover placement='topRight' content={<RangePicker
						showTime={{ format: 'HH:mm' }}
						format='YYYY-MM-DD HH:mm:ss'
						placeholder={['开始时间','结束时间']}
						size='small'
						style={{ width: 190 }}
						onOk = { handleChangeYesDay }
						key='RangePicker'
					/>}>
                  	<Icon type="clock-circle" theme="twoTone" twoToneColor="#F5CD19"/>
                  </Popover>
                  <br/>
                  <CheckableTag checked={severity1} onChange={handleChangeSeverity1}>一级</CheckableTag>
                  <CheckableTag checked={severity2} onChange={handleChangeSeverity2}>二级</CheckableTag>
                  <CheckableTag checked={severity3} onChange={handleChangeSeverity3}>三级</CheckableTag>
                  <CheckableTag checked={severity4} onChange={handleChangeSeverity4}>四级</CheckableTag>
                  <CheckableTag checked={severity5} onChange={handleChangeSeverity5}>五级</CheckableTag>
                </div>
              }
        >
          <DashboardAlarm {...dashboardAlarmProps}/>
        </Card>
          <Card bodyStyle={{
            width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
          }}
                style={{ marginBottom: '6px' }}
                title="端口输出流量利用率最高的10条端口"
          >
            <Table
              dataSource={portUsageList}
              bordered
              loading={loading.effects['performance/queryTopUsage']}
              columns={columns}
              size="small"
              pagination={paginationPortUsage}
            />
          </Card>
          <Card bodyStyle={{
            width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
          }}
                style={{ marginBottom: '6px' }}
                title="端口输入流量利用率最高的10条端口"
          >
            <Table
              dataSource={portUsageInList}
              bordered
              loading={loading.effects['performance/queryTopUsageIn']}
              columns={portUsageInListColumns}
              size="small"
              pagination={paginationPortUsageIn}
            />
          </Card>
          <Card bodyStyle={{
            width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
          }}
                style={{ marginBottom: '0px' }}
                title="Top 20 CPU使用率表 / 内存使用率表"
          >
            <div style={{ width: '49%', float: 'left' }}>
              <Table
                dataSource={cpuList}
                bordered
                loading={loading.effects['performance/queryTopCPU']}
                columns={cpuColumns}
                size="small"
                pagination={paginationCpu}
              />
            </div>
            <div style={{ width: '49%', float: 'right' }}>
              <Table
                dataSource={memoryList}
                bordered
                loading={loading.effects['performance/queryTopMem']}
                columns={memoryColumns}
                size="small"
                pagination={paginationMemory}
              />
            </div>
          </Card>
          <Card bodyStyle={{
            width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
          }}
                style={{ marginBottom: '6px' }}
                title="端口输出流量最高的10条端口"
          >
            <Table
              dataSource={portTrafficList}
              bordered
              loading={loading.effects['performance/queryTopTraffic']}
              columns={columns10}
              pagination={paginationTopTraffic}
              size="small"
            />
          </Card>
          <Card bodyStyle={{
            width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
          }}
                style={{ marginBottom: '6px' }}
                title="端口输入流量最高的10条端口"
          >
            <Table
              dataSource={portTrafficInList}
              bordered
              loading={loading.effects['performance/queryTopTrafficIn']}
              columns={portTrafficListTopIn20}
              pagination={paginationTopTrafficIn}
              size="small"
            />
          </Card>
          <Card bodyStyle={{width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center'}}
                style={{ marginBottom: '6px' }}
                title="Top 20 响应时间表 / Top 20 丢包率表"
          >
            <div style={{ width: '49%', float: 'left' }}>
              <Table
                dataSource={responseList}
                bordered
                loading={loading.effects['performance/queryTopRespon']}
                columns={responseColumns}
                size="small"
                pagination={paginationResponse}
              />
            </div>
            <div style={{ width: '49%', float: 'right' }}>
              <Table
                dataSource={lossList}
                bordered
                loading={loading.effects['performance/queryTopLoss']}
                columns={lossColumns}
                size="small"
                pagination={paginationLoss}
              />
            </div>
          </Card>
        {
          user.branch === 'ZH' || user.branch === '' || user.branch === undefined ?
            <Card bodyStyle={{
              width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
            }}
                  style={{ marginBottom: '6px' }}
                  title="端口input discard/Top 10  output discard/Top 10"
            >
              <div style={{ width: '49%', float: 'left' }}>
                <Table
                  dataSource={OutPortDicardsList}
                  bordered
                  loading={loading.effects['performance/queryOutDicards']}
                  columns={portDicards1}
                  size="small"
                  pagination={paginationOutPortDicards}
                />
              </div>
              <div style={{ width: '49%', float: 'right' }}>
                <Table
                  dataSource={InPortDicardsList}
                  bordered
                  loading={loading.effects['performance/queryInDicards']}
                  columns={portDicards2}
                  size="small"
                  pagination={paginationInPortDicards}
                />
              </div>
            </Card>
            :
            null
        }
        {
          user.branch === 'ZH' || user.branch === '' || user.branch === undefined ?
            <Card bodyStyle={{
              width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',
            }}
                  style={{ marginBottom: '6px' }}
                  title=" Top 10 input CRC error"
            >
              {/*<div style={{ width: '49%', float: 'left' }}>
                <Table
                  dataSource={OutPortErrorList}
                  bordered
                  loading={loading.effects['performance/queryOutError']}
                  columns={portError1}
                  size="small"
                  pagination={paginationOutPortError}
                />
              </div>*/}
              <div style={{ width: '100%' }}>
                <Table
                  dataSource={InPortErrorList}
                  bordered
                  loading={loading.effects['performance/queryInError']}
                  columns={portError2}
                  size="small"
                  pagination={paginationInPortError}
                />
              </div>
            </Card>
            :
            null
        }
        {
          user.branch === 'ZH' || user.branch === '' || user.branch === undefined ?
            <Card bodyStyle={{width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center'}}
                  style={{ marginBottom: '6px' }}
                  title="Top 10 端口输出包转发数 / Top 10 端口输入包转发数"
            >
              <div style={{ width: '49%', float: 'left' }}>
                <Table
                  dataSource={outForwardDateSource}
                  bordered
                  loading={loading.effects['performance/outForwardQuery']}
                  columns={outForwardColumns}
                  size="small"
                  pagination={outForwardPagination}
                />
              </div>
              <div style={{ width: '49%', float: 'right' }}>
                <Table
                  dataSource={inForwardDateSource}
                  bordered
                  loading={loading.effects['performance/inForwardQuery']}
                  columns={inForwardColumns}
                  size="small"
                  pagination={inForwardPagination}
                />
              </div>
            </Card>
            :
            null
        }
        {
          user.branch === 'ZH' || user.branch === '' || user.branch === undefined ?
            <Card bodyStyle={{width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center'}}
                  style={{ marginBottom: '6px' }}
                  title="Top 10 端口输出包转发率 / Top 10 端口输入包转发率"
            >
              <div style={{ width: '49%', float: 'left' }}>
                <Table
                  dataSource={outForwardRateDateSource}
                  bordered
                  loading={loading.effects['performance/outForwardRateQuery']}
                  columns={outForwardRateColumns}
                  size="small"
                  pagination={outForwardRatePagination}
                />
              </div>
              <div style={{ width: '49%', float: 'right' }}>
                <Table
                  dataSource={inForwardRateDateSource}
                  bordered
                  loading={loading.effects['performance/inForwardRateQuery']}
                  columns={inForwardRateColumns}
                  size="small"
                  pagination={inForwardRatePagination}
                />
              </div>
            </Card>
            :
            null
        }

        <Card bodyStyle={{width: '100%', marginBottom: '6px', border: 'none', padding: 6, align: 'center',}}
              style={{ marginBottom: '6px' }}
              title="故障统计(7天)"
        >
          <Table
            columns={faultType}
            dataSource={faultDataSource}
            bordered
            loading={loading.effects['performance/queryFault']}
            size="small"
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  )
}
export default connect(({ performance, interfaces, loading }) => ({ performance, interfaces, loading }))(performance)
