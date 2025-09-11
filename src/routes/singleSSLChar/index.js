import React from "react"
import { connect } from 'dva'
import PageHead from '../../components/pageHeader/pageHeader'
import Descri from '../../components/descriPtions/descriPtions'
import Echart from '../../components/eChart/eChart'
import EchartImp from '../../components/eChart/eChartImport'
import { Icon, Tag, DatePicker, Select, Row, Col, Table } from 'antd'
import Cards from '../../components/card/card'
import moment from 'moment'
import Alarm from '../chd/alarm'

const { RangePicker } = DatePicker
const { Option } = Select

const singleSSLChar = ({ dispatch, location, singleSSLChar, loading }) => {

	const {
		content, //根据原始数据转化的JSON对象
		item, //对象基本数据
		xAxisVS, //VS趋势图 x轴
		yAxisVS,  //VS趋势图 y轴
		xAxisconn, //SSL每秒连接 x轴
		yAxisconn, //SSL每秒连接 y轴
		xAxisCPU, //cpu趋势图 x轴
		yAxisCPU,  //cpu趋势图 y轴
		xAxisMemory, //内存 x轴
		yAxisMemory, //内存 y轴
		uuid,//hostIp
		interfacerSource,//防火墙接口表格
		interfacerPagination,//pagination数据
		alarmDataSource,//告警集合
		paginationAlarm,//表格位置
	} = singleSSLChar//数据模板

	//描述控件
	const contentProps = {
		title: '',  //标题
		size: 'small',	//描述大小   在bordere为true时起作用
		bordere: false,//边框可见性
		layout: 'vertical',//布局方式  vertical   horizontal
		colon: true,//冒号可见性
		column: 6,//一行展示多少个
		item: content//{label: '', span: 0, color: 'blue', content: '' }
	}

	//页头组件描述
	const subTitle = <div key='1'>
		&nbsp;&nbsp;&nbsp;
		<Icon type="environment" theme="twoTone" twoToneColor='#FFBA15' style={{ fontSize: '20px' }} />
	</div>

	//描述组件实例     该组件传入了页头组件
	const descri = <Descri {...contentProps} />

	//tags是页头组件的对象描述
	const tags = [
		<Tag color='purple' key='1'>{item.branchnamecn}</Tag>,
		<Tag color='purple' key='2'>{item.bizarea}</Tag>
	]

	//页头组件实例
	const pageHeadProps = {
		title: item.moname,//标题
		backIcon: '',//标题前的图标  只有在onBack存在时开启
		//onBack: onBack,
		subTitle: subTitle,//描述信息
		tags: tags,//描述信息下的tags集合
		extra: [],//右上角操作区域
		dividerVisible: true,//分隔线可见性
		content: descri,//内容
		headerColor: '#FFFFFF',//颜色
		iconTheme: 'twoTone',//backIcon样式
		twoToneColor: '#FFBA15',//backIcon颜色
		iocnSize: '20px',//backIcon大小
		footer: <div></div>
	}

	//VS选择时间区间
	const onVS = (value) => {
		dispatch({
			type: "singleSSLChar/setState",
			payload: {
				startVS: moment(value[0]).unix(),
				endVS: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "singleSSLChar/queryVS",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//VS选择聚合粒度
	const onVSSelect = (option) => {
		dispatch({
			type: 'singleSSLChar/setState',
			payload: {
				intervalVS: option
			}
		})
		dispatch({
			type: "singleSSLChar/queryVS",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//Cards组件右上角操作区域
	const VSExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onVS(value)}
			key='RangePicker'
		/>,
		<Select
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onVSSelect(option)}
		>
			<Option key='1' value='5m'>5分钟</Option>
			<Option key='2' value='hour'>小时</Option>
			<Option key='3' value='day'>天</Option>
			<Option key='4' value='month'>月</Option>
			<Option key='5' value='year'>年</Option>
		</Select>
	]

	//VS Echart
	const VSEchart = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: xAxisVS }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value}' }, max(value) { return value.max + 1 } }],
		series: [{ name: 'SSL-VS并发', type: 'line', data: yAxisVS }],
		loading: loading.effects['singleSSLChar/queryVS']
	}

	//VS趋势图
	const VSProps = {
		con: <Echart {...VSEchart} />,
		extra: VSExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: 'SSL-VS并发',
		loading: false,
		minHeight: ''
	}

	//SSL每秒连接选择时间区间
	const onconn = (value) => {
		dispatch({
			type: "singleSSLChar/setState",
			payload: {
				startconn: moment(value[0]).unix(),
				endconn: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "singleSSLChar/queryconn",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//SSL每秒连接选择聚合粒度
	const onconnSelect = (option) => {
		dispatch({
			type: 'singleSSLChar/setState',
			payload: {
				intervalconn: option
			}
		})
		dispatch({
			type: "singleSSLChar/queryconn",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//Cards组件右上角操作区域
	const connExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onconn(value)}
			key='RangePicker'
		/>,
		<Select
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onconnSelect(option)}
		>
			<Option key='1' value='5m'>5分钟</Option>
			<Option key='2' value='hour'>小时</Option>
			<Option key='3' value='day'>天</Option>
			<Option key='4' value='month'>月</Option>
			<Option key='5' value='year'>年</Option>
		</Select>
	]

	//SSL每秒连接 Echart
	const connEchart = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight ,
		xAxis: [{ type: 'category', data: xAxisconn }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value}' }, max(value) { return value.max + 1 } }],
		series: [{ name: 'SSL每秒连接', type: 'line', data: yAxisconn }],
		loading: loading.effects['singleSSLChar/queryconn']
	}

	//SSL每秒连接趋势图
	const connProps = {
		con: <Echart {...connEchart} />,
		extra: connExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: 'SSL每秒连接',
		loading: false,
		minHeight: ''
	}

	//cpu选择时间区间
	const onCpu = (value) => {
		dispatch({
			type: "singleSSLChar/setState",
			payload: {
				startCPU: moment(value[0]).unix(),
				endCPU: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "singleSSLChar/queryCPU",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//cpu选择聚合粒度
	const onCpuSelect = (option) => {
		dispatch({
			type: 'singleSSLChar/setState',
			payload: {
				intervalCPU: option
			}
		})
		dispatch({
			type: "singleSSLChar/queryCPU",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//Cards组件右上角操作区域
	const cpuExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onCpu(value)}
			key='RangePicker'
		/>,
		<Select
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onCpuSelect(option)}
		>
			<Option key='1' value='5m'>5分钟</Option>
			<Option key='2' value='hour'>小时</Option>
			<Option key='3' value='day'>天</Option>
			<Option key='4' value='month'>月</Option>
			<Option key='5' value='year'>年</Option>
		</Select>
	]

	//cpu Echart
	const cpuEchart = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: xAxisCPU }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value} %' }, max(value) { return value.max + 1 } }],
		series: [{ name: 'CPU利用率', type: 'line', data: yAxisCPU }],
		loading: loading.effects['singleSSLChar/queryCPU']
	}

	//cpu趋势图
	const cpuProps = {
		con: <Echart {...cpuEchart} />,
		extra: cpuExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: 'CPU利用率',
		loading: false,
		minHeight: ''
	}

	//内存选择时间区间
	const onMemory = (value) => {
		dispatch({
			type: "singleSSLChar/setState",
			payload: {
				startMemory: moment(value[0]).unix(),
				endMemory: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "singleSSLChar/querymemory",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//内存选择聚合粒度
	const onMemorySelect = (option) => {
		dispatch({
			type: 'singleSSLChar/setState',
			payload: {
				intervalMemory: option
			}
		})
		dispatch({
			type: "singleSSLChar/querymemory",
			payload: {
				hostip: item.hostip,
				keyword: item.keyword,
				branchname: item.branchname
			}
		})
	}

	//Cards组件右上角操作区域
	const memoryExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onMemory(value)}
			key='RangePicker'
		/>,
		<Select
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onMemorySelect(option)}
		>
			<Option key='1' value='5m'>5分钟</Option>
			<Option key='2' value='hour'>小时</Option>
			<Option key='3' value='day'>天</Option>
			<Option key='4' value='month'>月</Option>
			<Option key='5' value='year'>年</Option>
		</Select>
	]

	//内存 Echart
	const memoryEchart = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight ,
		xAxis: [{ type: 'category', data: xAxisMemory }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value} %' }, max(value) { return value.max + 1 } }],
		series: [{ name: '内存使用率', type: 'line', data: yAxisMemory }],
		loading: loading.effects['singleSSLChar/querymemory']
	}

	//内存趋势图
	const memoryProps = {
		con: <Echart {...memoryEchart} />,
		extra: memoryExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: '内存使用率',
		loading: false,
		minHeight: ''
	}

	const alarmTableProps = {
		dataSource: alarmDataSource,
		paginationAlarm,
		uuid,
		dispatch,
		loading:loading.effects['singleSSLChar/queryAlarm'],
		path: 'singleSSLChar',
	}

	//告警组
	const alarmProps = {
		con: <Alarm {...alarmTableProps} />,
		extra: [],
		actions: [],
		size: 'small',
		title: '告警列表',
		loading: false,
		minHeight: ''
	}

	const columns = [
		{
			key: 'moname',
			dataIndex: 'moname',
			title: '接口名称',
		}, {
			key: 'flowOut',
			dataIndex: 'flowOut',
			title: '端口输出流量',
			render: (text) => {
				let dot = text < 1024 ? 'B' : text < 1048576 ? 'K' : text < 1073741824 ? 'M' : 'G'
				let value = text === null ? null : (text < 1024 * 1024) ? (text / 1024).toFixed(2) : (text / 1024 / 1024).toFixed(2)
				return (value + dot)
			}
		}, {
			key: 'flowIn',
			dataIndex: 'flowIn',
			title: '端口输入流量',
			render: (text) => {
				let dot = text < 1024 ? 'B' : text < 1048576 ? 'K' : text < 1073741824 ? 'M' : 'G'
				let value = text === null ? null : (text < 1024 * 1024) ? (text / 1024).toFixed(2) : (text / 1024 / 1024).toFixed(2)
				return (value + dot)
			}
		}
	]

	const interfacerTableProps = {
		con: <Table
			dataSource={interfacerSource}
			bordered
			loading={loading.effects['singleSSLChar/queryAllInterfacer']}
			columns={columns}
			size="small"
			pagination={interfacerPagination}
		/>,
		extra: [],
		actions: [],
		size: 'small',
		title: 'SSL列表',
		loading: false,
		minHeight: ''
	}

	return (
		<div>
			<Row>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<PageHead {...pageHeadProps} />
				</Col>
			</Row>
			<Row gutter={[4, 4]}>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...VSProps} />
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...connProps} />
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...cpuProps} />
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...memoryProps} />
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<div style={{ marginTop: 5 }}>
						<Cards {...interfacerTableProps} />
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<div style={{ marginTop: 5 }}>
						<Cards {...alarmProps} />
					</div>
				</Col>
			</Row>
		</div>
	)
}
export default connect(({ singleSSLChar, loading }) => ({ singleSSLChar, loading: loading }))(singleSSLChar)
