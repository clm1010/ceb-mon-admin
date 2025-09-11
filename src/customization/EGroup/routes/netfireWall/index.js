import React from "react"
import { connect } from 'dva'
import PageHead from '../../../../components/pageHeader/pageHeader'
import Descri from '../../../../components/descriPtions/descriPtions'
import Echart from '../../../../components/eChart/eChart'
import { Descriptions, Icon, Tag, Button, DatePicker, Select, Row, Col } from 'antd'
import Cards from '../../../../components/card/card'
import moment from 'moment'

const { RangePicker } = DatePicker
const { Option } = Select

const netfireWall = ({ dispatch, location, netfireWall, loading }) => {

	const {  
		content, //根据原始数据转化的JSON对象
		item, //对象基本数据
		xAxisCPU, //cpu趋势图 x轴
		yAxisCPU,  //cpu趋势图 y轴
		xAxisMemory, //内存 x轴
		yAxisMemory, //内存 y轴
		xAxisNewSession, //新建session x轴
		yAxisNewSession, //新建session y轴
		xAxisConcurrentSession, //并发session x轴
		yAxisConcurrentSession //并发session y轴
	} = netfireWall//数据模板
	 
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
						<Icon type="environment" theme="twoTone" twoToneColor='#FFBA15' style={{ fontSize: '20px' }}/>
					 </div>
	
	//描述组件实例     该组件传入了页头组件
	const descri = <Descri {...contentProps}/>
	
	//tags是页头组件的对象描述
	const tags = [ 
				  <Tag color='purple' key='1'>{item.branchnamecn}</Tag>,
				  <Tag color='purple' key='2'>{item.bizarea}</Tag>
				 ]
	
	//页头组件实例
	const pageHeadProps = {
		title: item.moname,//标题
		backIcon : '',//标题前的图标  只有在onBack存在时开启
		//onBack: onBack,
		subTitle: subTitle,//描述信息
		tags: tags,//描述信息下的tags集合
		extra: [],//右上角操作区域
		dividerVisible:true,//分隔线可见性
		content: descri,//内容
		headerColor: '#FFFFFF',//颜色
		iconTheme: 'twoTone',//backIcon样式
		twoToneColor: '#FFBA15',//backIcon颜色
		iocnSize: '20px',//backIcon大小
		footer: <div></div>
	}
	
	//cpu选择时间区间
	const onCpu = (value) => {
		dispatch({
			type: "netfireWall/setState",
			payload:{
				startCPU: moment(value[0]).unix(),
				endCPU: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "netfireWall/queryCPU",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//cpu选择聚合粒度
	const onCpuSelect = (option) => {
		dispatch({
			type: 'netfireWall/setState',
			payload:{
				intervalCPU:option
			}
		})
		dispatch({
			type: "netfireWall/queryCPU",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//Cards组件右上角操作区域
	const cpuExtra = [
		<RangePicker 
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间','结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value)=>onCpu(value)}
			key='RangePicker'
		/>,
		<Select 
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onCpuSelect(option)}
		>
				<Option key='1' value='5m'>分钟</Option>
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
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis :[{ type : 'category', data : xAxisCPU}],
		yAxis :[{ type : 'value',show: true,max (value) {return value.max + 1}}],
		series : [{name:'CPU利用率',type:'line',data:yAxisCPU}],
		loading: loading.effects['netfireWall/queryCPU']
	}
	
	//cpu趋势图
	const cpuProps = {
		con: <Echart {...cpuEchart}/>,
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
			type: "netfireWall/setState",
			payload:{
				startMemory: moment(value[0]).unix(),
				endMemory: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "netfireWall/querymemory",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//内存选择聚合粒度
	const onMemorySelect = (option) => {
		dispatch({
			type: 'netfireWall/setState',
			payload:{
				intervalMemory:option
			}
		})
		dispatch({
			type: "netfireWall/querymemory",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//Cards组件右上角操作区域
	const memoryExtra = [
		<RangePicker 
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间','结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value)=>onMemory(value)}
			key='RangePicker'
		/>,
		<Select 
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onMemorySelect(option)}
		>
				<Option key='1' value='5m'>分钟</Option>
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
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight , 
		xAxis :[{ type : 'category', data : xAxisMemory}],
		yAxis :[{ type : 'value',show: true,max (value) {return value.max + 1}}],
		series : [{name:'内存使用率',type:'line',data: yAxisMemory}],
		loading: loading.effects['netfireWall/querymemory']
	}
	
	//内存趋势图
	const memoryProps = {
		con: <Echart {...memoryEchart}/>,
		extra: memoryExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: '内存使用率',
		loading: false,
		minHeight: ''
	}
	
	//新建会话数选择时间区间
	const onNewSession = (value) => {
		dispatch({
			type: "netfireWall/setState",
			payload:{
				startNewSession: moment(value[0]).unix(),
				endNewSession: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "netfireWall/queryNewSession",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//新建会话数选择聚合粒度
	const onNewSessionSelect = (option) => {
		dispatch({
			type: 'netfireWall/setState',
			payload:{
				intervalNewSession:option
			}
		})
		dispatch({
			type: "netfireWall/queryNewSession",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//Cards组件右上角操作区域
	const newSessionExtra = [
		<RangePicker 
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间','结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value)=>onNewSession(value)}
			key='RangePicker'
		/>,
		<Select 
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onNewSessionSelect(option)}
		>
				<Option key='1' value='5m'>分钟</Option>
				<Option key='2' value='hour'>小时</Option>
				<Option key='3' value='day'>天</Option>
				<Option key='4' value='month'>月</Option>
				<Option key='5' value='year'>年</Option>
		</Select>
	]
	
	//新建会话数 Echart
	const newSessionEchart = {
		title: '',
		subtext: '',
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight 
		xAxis :[{ type : 'category', data : xAxisNewSession}],
		yAxis :[{ type : 'value',show: true, max (value) {return value.max + 1}}],
		series : [{name:'新建会话数',type:'line',data:yAxisNewSession}],
		loading: loading.effects['netfireWall/queryNewSession']
	}
	
	//新建会话数趋势图
	const newSessionProps = {
		con: <Echart {...newSessionEchart}/>,
		extra: newSessionExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: '新建会话数',
		loading: false,
		minHeight: ''
	}
	
	//并发会话数选择时间区间
	const onConcurrentSession = (value) => {
		dispatch({
			type: "netfireWall/setState",
			payload:{
				startConcurrentSession: moment(value[0]).unix(),
				endConcurrentSession: moment(value[1]).unix()
			}
		})
		dispatch({
			type: "netfireWall/queryConcurrentSession",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//并发会话数选择聚合粒度
	const onConcurrentSessionSelect = (option) => {
		dispatch({
			type: 'netfireWall/setState',
			payload:{
				intervalConcurrentSession:option
			}
		})
		dispatch({
			type: "netfireWall/queryConcurrentSession",
			payload:{
				hostip:item.hostip,
				keyword:item.keyword,
				branchname:item.branchname
			}
		})
	}
	
	//Cards组件右上角操作区域
	const concurrentExtra = [
		<RangePicker 
			showTime={{ format: 'HH:mm' }}
			format='YYYY-MM-DD HH:mm:ss'
			placeholder={['开始时间','结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value)=>onConcurrentSession(value)}
			key='RangePicker'
		/>,
		<Select 
			key='Select'
			placeholder='粒度'
			size='small'
			style={{ width: 70 }}
			onSelect={(option) => onConcurrentSessionSelect(option)}
		>
				<Option key='1' value='5m'>分钟</Option>
				<Option key='2' value='hour'>小时</Option>
				<Option key='3' value='day'>天</Option>
				<Option key='4' value='month'>月</Option>
				<Option key='5' value='year'>年</Option>
		</Select>
	]
	
	//并发会话数 Echart
	const concurrentSessionEchart = {
		title: '',
		subtext: '',
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight   , 
		xAxis :[{ type : 'category', data : xAxisConcurrentSession}],
		yAxis :[{ type : 'value',show: true, max (value) {return value.max + 1}}],
		series : [{name:'并发会话数',type:'line',data: yAxisConcurrentSession}],
		loading: loading.effects['netfireWall/queryConcurrentSession']
	}
	
	//并发会话趋势图
	const concurrentSessionProps = {
		con: <Echart {...concurrentSessionEchart}/>,
		extra: concurrentExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: '并发会话数',
		loading: false,
		minHeight: ''
	}
	
	return(
		<div>
			<Row>
				<Col  xs={24}  sm={24} md={24} lg={24} xl={24}>
					<PageHead {...pageHeadProps}/>
				</Col>
			</Row>
			<Row gutter={4,4}>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...cpuProps}/>
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...memoryProps}/>
					</div>
				</Col> 
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...newSessionProps}/>
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...concurrentSessionProps}/>
					</div>
				</Col>
			</Row>	
		</div> 
	)
}

export default connect(({ netfireWall, loading }) => ({ netfireWall, loading: loading }))(netfireWall)