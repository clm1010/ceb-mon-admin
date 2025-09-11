import React from 'react'
import { connect } from 'dva'
import PageHead from '../../../../components/pageHeader/pageHeader'
import Descri from '../../../../components/descriPtions/descriPtions'
import Echart from '../../../../components/eChart/eChart'
import Cards from '../../../../components/card/card'

import { Descriptions, Icon, Tag, Button, DatePicker, Select, Row, Col } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const { Option } = Select

const netLinePage = ({ dispatch, location, netLinePage, loading }) => {
	
	const { item, pageHeadContent, rpingLossxAxis , rpingLossyAxis, rpingTimexAxis, rpingTimeyAxis } = netLinePage
	
	//页头组件描述
	const subTitle = <div key='1'>
						&nbsp;&nbsp;&nbsp; 
						<Icon type="environment" theme="twoTone" twoToneColor='#FFBA15' style={{ fontSize: '20px' }}/>
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
	
	const descri = <Descri {...contentProps}/>
	
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
	
	//rping时间选择器 //   netLinePage/rpingLoss 
	const onRpingLoss = (value) => {
		dispatch({
			type: 'netLinePage/setState',
			payload:{
				lossStart: moment(value[0]).unix(),
				lossEnd: moment(value[1]).unix()
			}
		})
		dispatch({
			type: 'netLinePage/rpingLoss',
			payload:{
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}
	
	//rping粒度选择器
	const onRpingLossSelect = (option) =>　{
		dispatch({
			type: 'netLinePage/setState',
			payload:{
				intervalLoss: option
			}
		})
		dispatch({
			type: 'netLinePage/rpingLoss',
			payload:{
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
			placeholder={['开始时间','结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value)=>onRpingLoss(value)}
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
		subtext: '',
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis :[{ type : 'category', data : rpingLossxAxis}],
		yAxis :[{ type : 'value',show: true, axisLabel: { formatter: '{value} %' }, max (value) {return value.max + 1}}],
		series : [{name:'RPING丢包率',type:'line',data:rpingLossyAxis}],
		loading: loading.effects['netLinePage/rpingLoss']
	}
	
	//RPING丢包率
	const rpingLossProps = {
		con: <Echart {...rpingLossEchart}/>,
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
			payload:{
				timeStart: moment(value[0]).unix(),
				timeEnd: moment(value[1]).unix()
			}
		})
		dispatch({
			type: 'netLinePage/rpingTime',
			payload:{
				hostip: item.hostip,
				moname: item.moname
			}
		})
	}
	
	//rping响应时间选择器
	const onRpingTimeSelect = (option) => {
		dispatch({
			type: 'netLinePage/setState',
			payload:{
				intervalTime: option
			}
		})
		dispatch({
			type: 'netLinePage/rpingTime',
			payload:{
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
			placeholder={['开始时间','结束时间']}
			size='small'
			style={{ width: 190 }}
			onOk={(value)=>onRpingTime(value)}
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
		titleColor: '#D3D7DD',
		minHeight: '250px',//高度minHeight
		xAxis :[{ type : 'category', data : rpingTimexAxis}],
		yAxis :[{ type : 'value',show: true, axisLabel: { formatter: '{value} ms' }, max (value) {return value.max + 1}}],
		series : [{name:'RPING响应时间',type:'line',data:rpingTimeyAxis}],
		loading: loading.effects['netLinePage/rpingTime']
	}
	
	//rping响应时间
	const rpingTimeProps = {
		con: <Echart {...rpingTimeEchart}/>,
		extra: rpingTimeExtra,//右上角操作区域
		actions: [],//底部操作按钮
		size: 'small',// default
		title: 'RPING响应时间',
		loading: false,
		minHeight: ''
	}
	
	return (
		<div>
			<Row>
				<Col  xs={24}  sm={24} md={24} lg={24} xl={24}>
						<PageHead {...pageHeadProps}/>
				</Col>
			</Row>
			<Row gutter={4,4}>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...rpingLossProps}/>
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<div style={{ marginTop: 5 }}>
						<Cards {...rpingTimeProps}/>
					</div>
				</Col> 
			</Row>	
		</div>
	)
}

export default connect(({ netLinePage, loading }) => ({ netLinePage, loading: loading }))(netLinePage)