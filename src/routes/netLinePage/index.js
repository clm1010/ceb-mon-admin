import React from 'react'
import { connect } from 'dva'
import PageHead from '../../components/pageHeader/pageHeader'
import Descri from '../../components/descriPtions/descriPtions'
import Echart from '../../components/eChart/eChartImport'
import Cards from '../../components/card/card'
import { Icon, Tag, DatePicker, Select, Row, Col } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const { Option } = Select

const netLinePage = ({ dispatch, location, netLinePage, loading }) => {

	const { item, pageHeadContent, rpingLossxAxis, rpingLossyAxis, rpingTimexAxis, rpingTimeyAxis, sourceIn, comIn, sourceOut,
		startOut, endOut, comOut, portOutxAxis, portOutyAxis, portInxAxis, portInyAxis } = netLinePage

	const disabledDate = (current) => {
		return current && current > moment().endOf('day')
	}
	//最大时间,最小时间，索引的名字， 类型（day，month）
	//let indexs = findIndex(1600396838000,1590890262000,'u2performance-', 'month')
	//页头组件描述
	const subTitle = <div key='1'>
		&nbsp;&nbsp;&nbsp;
		<Icon type="environment" theme="twoTone" twoToneColor='#FFBA15' style={{ fontSize: '20px' }} />
	</div>

	//tags是页头组件的对象描述
	const tags = [
		<Tag color='purple' key='1'>{item.branchnamecn}</Tag>,
		<Tag color='purple' key='2'>{item.bizarea}</Tag>
	]

	//描述控件
	const contentProps = {
		title: '',  //标题
		size: 'small',	//描述大小   在bordere为true时起作用
		bordere: false,//边框可见性
		layout: 'vertical',//布局方式  vertical   horizontal
		colon: true,//冒号可见性
		column: 5,//一行展示多少个
		item: pageHeadContent//{label: '', span: 0, color: 'blue', content: '' }
	}

	const descri = <Descri {...contentProps} />

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

	//rping时间选择器 //   netLinePage/rpingLoss
	const onRpingLoss = (value) => {
		dispatch({
			type: 'netLinePage/setState',
			payload: {
				lossStart: moment(value[0]).unix(),
				lossEnd: moment(value[1]).unix()
			}
		})
		dispatch({
			type: 'netLinePage/rpingLoss',
			payload: {
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}

	//rping粒度选择器
	const onRpingLossSelect = (option) => {
		dispatch({
			type: 'netLinePage/setState',
			payload: {
				intervalLoss: option
			}
		})
		dispatch({
			type: 'netLinePage/rpingLoss',
			payload: {
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}

	//Cards组件右上角操作区域
	const rpingLossExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			disabledDate={disabledDate}
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onRpingLoss(value)}
			key='RangePicker'
		/>,
		<Select
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onRpingLossSelect(option)}
		>
			<Option key='1' value='1m'>分钟</Option>
			<Option key='2' value='hour'>小时</Option>
			<Option key='3' value='day'>天</Option>
			<Option key='4' value='month'>月</Option>
			<Option key='5' value='year'>年</Option>
		</Select>
	]

	//cpu Echart
	const rpingLossEchart = {
		title: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		subtext: '',
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: rpingLossxAxis }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value} %' }, max(value) { return value.max + 1 } }],
		series: [{ name: 'RPING丢包率', type: 'line', data: rpingLossyAxis }],
		loading: loading.effects['netLinePage/rpingLoss']
	}

	//RPING丢包率
	const rpingLossProps = {
		con: <Echart {...rpingLossEchart} />,
		extra: rpingLossExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: 'RPING丢包率',
		loading: false,
		minHeight: ''
	}

	//rping响应时间时间选择器
	const onRpingTime = (value) => {
		dispatch({
			type: 'netLinePage/setState',
			payload: {
				timeStart: moment(value[0]).unix(),
				timeEnd: moment(value[1]).unix()
			}
		})
		dispatch({
			type: 'netLinePage/rpingTime',
			payload: {
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}

	//rping响应时间选择器
	const onRpingTimeSelect = (option) => {
		dispatch({
			type: 'netLinePage/setState',
			payload: {
				intervalTime: option
			}
		})
		dispatch({
			type: 'netLinePage/rpingTime',
			payload: {
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}

	//Cards组件右上角操作区域
	const rpingTimeExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间', '结束时间']}
			disabledDate={disabledDate}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onRpingTime(value)}
			key='RangePicker'
		/>,
		<Select
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onRpingTimeSelect(option)}
		>
			<Option key='1' value='1m'>分钟</Option>
			<Option key='2' value='hour'>小时</Option>
			<Option key='3' value='day'>天</Option>
			<Option key='4' value='month'>月</Option>
			<Option key='5' value='year'>年</Option>
		</Select>
	]

	//rping响应时间 Echart
	const rpingTimeEchart = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: rpingTimexAxis }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value} ms' }, max(value) { return value.max + 1 } }],
		series: [{ name: 'RPING响应时间', type: 'line', data: rpingTimeyAxis }],
		loading: loading.effects['netLinePage/rpingTime']
	}

	//rping响应时间
	const rpingTimeProps = {
		con: <Echart {...rpingTimeEchart} />,
		extra: rpingTimeExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: 'RPING响应时间',
		loading: false,
		minHeight: ''
	}

	//uyun输入流量时间选择函数
	const onUyunInTime = (value) => {
		dispatch({
			type: 'netLinePage/setState',
			payload: {
				startIn: moment(value[0]).unix(),
				endIn: moment(value[1]).unix()
			}
		})
		dispatch({
			type: 'netLinePage/portIn',
			payload: {
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}
	//颜色
	const onChange = (params) => {
		let color = ''
		if (params.name.slice(20, params.name.length - 1) === 'norm') {
			color = '#136dfb'
		} else if (params.name.slice(20, params.name.length - 1) === 'abn') {
			color = 'red'
		}
		return color
	}
	//点的大小
	const onSymbol = (params, obj) => {
		let size = 0
		if (obj.name.slice(20, obj.name.length - 1) === 'norm') {
			size = 1
		} else if (obj.name.slice(20, obj.name.length - 1) === 'abn') {
			size = 5
		}
		return size
	}

	//输入流量卡片右上角时间选择器
	const uyunFolwInExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			disabledDate={disabledDate}
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onUyunInTime(value)}
			key='RangePicker'
		/>
	]

	//uyun输入流量视图
	const uyunFolwInChartProps = {
		title: '',
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', borderWidth: 1, shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, color: '#606266' }
			},
			formatter: function (params) {
				console.log(params)
				return '上基线: ' + (params[0] ? params[0].value : '') + ' ' + comIn + '<br/>' + '当前流量: ' + (params[1] ? params[1].value : '') + ' ' + comIn + '<br/>' + '下基线: ' + (params[2] ? params[2].value : '') + ' ' + comIn + '<br/>' + '采集时间: ' + params[0].axisValue + '<br/>' + '(数据处理后默认保留两位小数)'
			}
		},
		toolbox: {
			feature: {
				dataZoom: { yAxisIndex: 'none' },
				restore: {},
				saveAsImage: {}
			}
		},
		dataZoom: [{ type: 'slider' }],
		subtext: '',
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: sourceIn.map((item, index) => { return item.time }) }],
		yAxis: [
			{
				type: 'value', splitLine: { show: false },
				axisLabel: {
					formatter: '{value}' + comIn
				}
			}
		],
		series: [
			{
				data: sourceIn.map((item, index) => {
					return item.upper
				}),//最高
				type: 'line',
				areaStyle: { normal: { color: '#dce9fe' } },
				symbol: 'none',
				smooth: true,
				itemStyle: {
					normal: {
						color: '#D7D7D7', //改变折线点的颜色
						lineStyle: {
							color: '#dce9fe' //改变折线颜色
						}
					}
				},
			},
			{
				data: sourceIn.map((item, index) => {
					return item.value
				}),//值
				smooth: true,
				showAllSymbol: true,
				symbol: 'rect',     //设定为实心点
				symbolSize: (params, obj) => onSymbol(params, obj),   //设定实心点的大小
				type: 'line',
				itemStyle: {
					normal: {
						color: (params) => onChange(params), //改变折线点的颜色
						lineStyle: {
							color: '#136dfb' //改变折线颜色
						}
					}
				}
			},
			{
				data: sourceIn.map((item, index) => {
					return item.lower
				}),//最低s
				type: 'line',
				areaStyle: {
					normal: {
						color: '#FFFFFF'
					}
				},
				symbol: 'none',
				smooth: true,
				itemStyle: {
					normal: {
						color: '#dce9fe', //改变折线点的颜色
						lineStyle: {
							color: '#dce9fe' //改变折线颜色
						}
					}
				}
			}
		],
		loading: loading.effects['netLinePage/uyunFolwIn']
	}

	//总行端口输入流量实际值 echart
	const portInchartprops = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: portInxAxis }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value} kb' }, max(value) { return value.max + 1 } }],
		series: [{ name: '总行端口输入流量实际值', type: 'line', data: portInyAxis }],
		loading: loading.effects['netLinePage/portIn']
	}

	//uyun输入流量卡片
	const uyunFolwInCardProps = {
		con: <Echart {...portInchartprops} />,
		extra: uyunFolwInExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: '输入流量',
		loading: false,
		minHeight: ''
	}

	//uyun输出时间选择器函数
	const onUyunOutTime = (value) => {
		dispatch({
			type: 'netLinePage/setState',
			payload: {
				startOut: moment(value[0]).unix(),
				endOut: moment(value[1]).unix()
			}
		})
		dispatch({
			type: 'netLinePage/portOut',
			payload: {
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}

	//uyun输出卡片右上角时间选择器
	const uyunFolwOutExtra = [
		<RangePicker
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			disabledDate={disabledDate}
			placeholder={['开始时间', '结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value) => onUyunOutTime(value)}
			key='RangePicker'
		/>
	]

	//uyun输出流量视图
	const uyunFolwOutChartProps = {
		title: '',
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				animation: false,
				label: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF', borderWidth: 1, shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0, color: '#606266' }
			},
			formatter: function (params) {
				return '上基线: ' + (params[0] ? params[0].value : '') + ' ' + comOut + '<br/>' + '当前流量: ' + (params[1] ? params[1].value : '') + ' ' + comOut + '<br/>' + '下基线: ' + (params[2] ? params[2].value : '') + ' ' + comOut + '<br/>' + '采集时间: ' + params[0].axisValue + '<br/>' + '(数据处理后默认保留两位小数)'
			}
		},
		toolbox: {
			feature: {
				dataZoom: { yAxisIndex: 'none' },
				restore: {},
				saveAsImage: {}
			}
		},
		dataZoom: [{ type: 'slider' }],
		subtext: '',
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: sourceOut.map((item, index) => { return item.time }) }],
		yAxis: [
			{
				type: 'value', splitLine: { show: false },
				axisLabel: {
					formatter: '{value}' + comOut
				}
			}
		],
		series: [
			{
				data: sourceOut.map((item, index) => {
					return item.upper
				}),//最高
				type: 'line',
				areaStyle: { normal: { color: '#dce9fe' } },
				symbol: 'none',
				smooth: true,
				itemStyle: {
					normal: {
						color: '#D7D7D7', //改变折线点的颜色
						lineStyle: {
							color: '#dce9fe' //改变折线颜色
						}
					}
				},
			},
			{
				data: sourceOut.map((item, index) => {
					return item.value
				}),//值
				smooth: true,
				showAllSymbol: true,
				symbol: 'rect',     //设定为实心点
				symbolSize: (params, obj) => onSymbol(params, obj),   //设定实心点的大小
				type: 'line',
				itemStyle: {
					normal: {
						color: (params) => onChange(params), //改变折线点的颜色
						lineStyle: {
							color: '#136dfb' //改变折线颜色
						}
					}
				}
			},
			{
				data: sourceOut.map((item, index) => {
					return item.lower
				}),//最低s
				type: 'line',
				areaStyle: {
					normal: {
						color: '#FFFFFF'
					}
				},
				symbol: 'none',
				smooth: true,
				itemStyle: {
					normal: {
						color: '#dce9fe', //改变折线点的颜色
						lineStyle: {
							color: '#dce9fe' //改变折线颜色
						}
					}
				}
			}
		],
		loading: loading.effects['netLinePage/uyunFolwOut']
	}

	//总行端口输入流量实际值 echart
	const portOutchartprops = {
		title: '',
		subtext: '',
		tooltip: { trigger: 'axis' },//tooltip
		toolbox: { feature: { dataZoom: { yAxisIndex: 'none' } } },//toolbox
		dataZoom: [{ show: true, realtime: true }],//dataZoom
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis: [{ type: 'category', data: portOutxAxis }],
		yAxis: [{ type: 'value', show: true, axisLabel: { formatter: '{value} kb' }, max(value) { return value.max + 1 } }],
		series: [{ name: '总行端口输出流量实际值', type: 'line', data: portOutyAxis }],
		loading: loading.effects['netLinePage/portOut']
	}

	//uyun输出流量卡片
	const uyunFolwOutCardProps = {
		con: <Echart {...portOutchartprops} />,
		extra: uyunFolwOutExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: '输出流量',
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
						<Cards {...rpingLossProps} />
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...rpingTimeProps} />
					</div>
				</Col>
			</Row>
			<Row gutter={[4, 4]}>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...uyunFolwInCardProps} />
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...uyunFolwOutCardProps} />
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default connect(({ netLinePage, loading }) => ({ netLinePage, loading: loading }))(netLinePage)
