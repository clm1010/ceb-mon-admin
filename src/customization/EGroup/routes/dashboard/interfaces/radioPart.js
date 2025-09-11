import React from 'react'
import myStyle from './myStyle.css'
import { Col, Radio, Select } from 'antd'
import {genDictOptsByName} from "../../../../../utils/FunctionTool";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
const radioPart = ({
 dispatch, loading, location, organValue, branchValue, typeValue, firmValue, firstValue, secondValue, user, fenhang,
}) => {
	const onChangeOrgan = (e) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				organValue: e.target.value,
				firstValue: '',
				branchValue: '',
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: { organValue: e.target.value },
		})
	}
	const onChangeBranch = (value) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				branchValue: value,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: { branchValue: value },
		})
	}
	const onChangeType = (e) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				typeValue: e.target.value,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: {
				typeValue: e.target.value,
			},
		})
	}
	const onChangeFirm = (e) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				firmValue: e.target.value,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: {
				firmValue: e.target.value,
			},
		})
	}
	const onChangeFirst = (e) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				firstValue: e.target.value,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: { firstValue: e.target.value },
		})
	}
	const onChangeSecond = (e) => {
		dispatch({
			type: 'interfaces/querySuccess',
			payload: {
				secondValue: e.target.value,
			},
		})
		dispatch({
			type: 'interfaces/query',
			payload: { secondValue: e.target.value },
		})
	}
	const mySearchInfo = (input, option) => {
		return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0)
	}
	return (
  <Col span={24} className={myStyle.nextPart}>
    { (user.branch === 'ZH' || user.branch === undefined)
				?
  <div className={myStyle.radioStyle}>
    <span className={myStyle.labelStyle}>机构类型：</span>
    <RadioGroup onChange={onChangeOrgan} defaultValue="zongHang">
      <RadioButton value="zongHang">总行</RadioButton>
      <RadioButton value="fenHang">分行</RadioButton>
    </RadioGroup>
  </div>
				:
  <div />
			}
    { (organValue === 'zongHang')
				?
  <div />
				:
  <div className={myStyle.radioStyle}>
    <span className={myStyle.labelStyle}>分行：</span>
    {/*
					<RadioGroup onChange={onChangeBranch} defaultValue="BJ">
						<RadioButton value="BJ">北京</RadioButton>
						<RadioButton value="TJ">天津</RadioButton>
						<RadioButton value="HLJ">黑龙江</RadioButton>
						<RadioButton value="CQ">重庆</RadioButton>
						<RadioButton value="YT">烟台</RadioButton>
						<RadioButton value="more">更多...</RadioButton>
					</RadioGroup>
					*/}
    <Select
      style={{ width: 300 }}
      showSearch
      filterOption={mySearchInfo}
      onChange={onChangeBranch}
    >
      {fenhang.map(d => <Option key={d.key}>{d.value}</Option>)}
    </Select>
  </div>

			}
    <div className={myStyle.radioStyle}>
      <span className={myStyle.labelStyle}>设备类型：</span>
      <select onChange={onChangeType} defaultValue="">
        {genDictOptsByName('equipType')}
      </select>
      {/*<RadioGroup onChange={onChangeType} defaultValue="">*/}
      {/*  <RadioButton value="">全部</RadioButton>*/}
      {/*  <RadioButton value="ROUTER">路由器</RadioButton>*/}
      {/*  <RadioButton value="SWITCH">交换机</RadioButton>*/}
      {/*  <RadioButton value="FIREWALL">防火墙</RadioButton>*/}
      {/*  <RadioButton value="F5">负载均衡</RadioButton>*/}
      {/*</RadioGroup>*/}
    </div>
    <div className={myStyle.radioStyle}>
      <span className={myStyle.labelStyle}>厂商：</span>
      <select onChange={onChangeFirm} defaultValue="">
        {genDictOptsByName('networkVendor')}
      </select>
      {/*<RadioGroup onChange={onChangeFirm} defaultValue="">*/}
      {/*  <RadioButton value="">全部</RadioButton>*/}
      {/*  <RadioButton value="CISCO">思科</RadioButton>*/}
      {/*  <RadioButton value="H3C">华为</RadioButton>*/}
      {/*  <RadioButton value="RUIJIE">锐捷</RadioButton>*/}
      {/*  <RadioButton value="MP">MP</RadioButton>*/}
      {/*  <RadioButton value="OTHER">OTHER</RadioButton>*/}
      {/*</RadioGroup>*/}
    </div>
    <div className={myStyle.radioStyle}>
      <span className={myStyle.labelStyle}>一级安全域：</span>
      <span className={myStyle.radioButtonStyle}>
        { (organValue === 'zongHang') ?
          <select onChange={onChangeFirm} defaultValue="">
            {genDictOptsByName('firstSecAreaZH')}
          </select>
          :
          <select onChange={onChangeFirm} defaultValue="">
            {genDictOptsByName('firstSecAreaFH')}
          </select>
          // <RadioGroup onChange={onChangeFirst} defaultValue={firstValue}>
          //   <RadioButton value="">全部</RadioButton>
          //   <RadioButton value="总行云服务域">总行云服务域</RadioButton>
          //   <RadioButton value="数据域大数据区">数据域大数据区</RadioButton>
          //   <RadioButton value="核心交换域光传输区">核心交换域光传输区</RadioButton>
          //   <RadioButton value="分行核心网络分行核心区">分行核心网络分行核心区</RadioButton>
          //   <RadioButton value="数据域专属备份区">数据域专属备份区</RadioButton>
          //   <RadioButton value="生产服务域生产A区">生产服务域生产A区</RadioButton>
          //   <RadioButton value="核心交换域核心交换区">核心交换域核心交换区</RadioButton>
          //   <RadioButton value="数据域专属存储区">数据域专属存储区</RadioButton>
          //   <RadioButton value="办公服务域城域网接入区">办公服务域城域网接入区</RadioButton>
          //   <RadioButton value="互联网服务域外联区">互联网服务域外联区</RadioButton>
          //   <RadioButton value="互联网服务域公众服务区">互联网服务域公众服务区</RadioButton>
          //   <RadioButton value="第三方服务域">第三方服务域</RadioButton>
          //   <RadioButton value="开发测试域">开发测试域</RadioButton>
          //   <RadioButton value="业务服务域">业务服务域</RadioButton>
          //   <RadioButton value="骨干网络域">骨干网络域</RadioButton>
          //   <RadioButton value="IT管理域">IT管理域</RadioButton>
          //   <RadioButton value="办公服务域">办公服务域</RadioButton>
          //   <RadioButton value="分行云服务域">分行云服务域</RadioButton>
          //   <RadioButton value="生产服务域生产B区">生产服务域生产B区</RadioButton>
          //   <RadioButton value="网银武汉异地接入区">网银武汉异地接入区</RadioButton>
          //   <RadioButton value="信用卡中心网络">信用卡中心网络</RadioButton>
          //   <RadioButton value="互联网服务域办公DMZ区">互联网服务域办公DMZ区</RadioButton>
          //   <RadioButton value="武汉灾备中心">武汉灾备中心</RadioButton>
          //   <RadioButton value="海外分行域">海外分行域</RadioButton>
          //   <RadioButton value="武汉客户满意中心">武汉客户满意中心</RadioButton>
          //   <RadioButton value="分行核心网络分行上联区">分行核心网络分行上联区</RadioButton>
          //   <RadioButton value="投产准备域">投产准备域</RadioButton>
          // </RadioGroup>
					// :
          // <RadioGroup onChange={onChangeFirst} defaultValue={firstValue}>
          //   <RadioButton value="">全部</RadioButton>
          //   <RadioButton value="分行下联区">分行下联区</RadioButton>
          //   <RadioButton value="分行上联区">分行上联区</RadioButton>
          //   <RadioButton value="社区银行">社区银行</RadioButton>
          //   <RadioButton value="支行">支行</RadioButton>
          //   <RadioButton value="分行办公区">分行办公区</RadioButton>
          //   <RadioButton value="自助银行">自助银行</RadioButton>
          //   <RadioButton value="二级分行">二级分行</RadioButton>
          //   <RadioButton value="分行视频接入区">分行视频接入区</RadioButton>
          //   <RadioButton value="分行核心交换区">分行核心交换区</RadioButton>
          //   <RadioButton value="分行中间业务区">分行中间业务区</RadioButton>
          // </RadioGroup>
					}
      </span>
    </div>
    {/*
			{ (firstValue === 'Area_First_Service')
				?
				<div className={myStyle.radioStyle}>
					<span className={myStyle.labelStyle}>二级安全域：</span>
					<RadioGroup onChange={onChangeSecond} defaultValue="Area_Second_Service_A">
						<RadioButton value="Area_Second_Service_A">服务域A</RadioButton>
						<RadioButton value="Area_Second_Service_B">服务域B</RadioButton>
						<RadioButton value="Area_Second_Service_C">服务域C</RadioButton>
					</RadioGroup>
				</div>
				:

					firstValue === 'Area_First_Core'
					?
					<div className={myStyle.radioStyle}>
						<span className={myStyle.labelStyle}>二级安全域：</span>
						<RadioGroup onChange={onChangeSecond} defaultValue="Area_Second_Core_A">
							<RadioButton value="Area_Second_Core_A">核心域A</RadioButton>
							<RadioButton value="Area_Second_Core_B">核心域B</RadioButton>
							<RadioButton value="Area_Second_Core_C">核心域C</RadioButton>
						</RadioGroup>
					</div>
					:
					<div className={myStyle.radioStyle}>
						<span className={myStyle.labelStyle}>二级安全域：</span>
						<RadioGroup onChange={onChangeSecond} defaultValue="Area_Second_Join_A">
							<RadioButton value="Area_Second_Join_A">接入域A</RadioButton>
							<RadioButton value="Area_Second_Join_B">接入域B</RadioButton>
							<RadioButton value="Area_Second_Join_C">接入域C</RadioButton>
						</RadioGroup>
					</div>

			}
			*/}
  </Col>
	)
}
export default radioPart
