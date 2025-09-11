//内存使用率图表
import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { exportExcel } from 'xlsx-oc'
import { Icon, Modal, message } from 'antd'

const MemLadderChart = (ladderChart) => {
	const option = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: { // 坐标轴指示器，坐标轴触发有效
	            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
	        },
	    },
	    toolbox: {
			show: true,
			x: 'left',
			padding: 15,
			feature: {
				dataView: { show: true, readOnly: true },
			},
		},
	    legend: {
	        data: ladderChart.show,
	        textStyle: {
	        		fontSize: 9,
	        },
	        itemGap: 5,
	        itemHeight: 15,
	    },
	    dataZoom: [
        {
        		xAxisIndex: 0,
        		filterMode: 'empty',
        },
        {
            yAxisIndex: 0,
            show: false,
            filterMode: 'empty',
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'empty',
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'empty',
        },
		],
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '15%',
	        containLabel: true,
	    },
	    xAxis: {
	        type: 'category',
	        splitLine: { show: false },
	        data: ladderChart.allTime, //时间
	    },
	    yAxis: {
	        type: 'value',
	        min: 'dataMin',
   			max: 'dataMax',
			splitLine: {
	        		show: false,
	        },
	        axisLabel: {
	        		formatter: '{value} %',
	        },
	    },
	    series:ladderChart.dataSource
	}
	const onDownload = () => {
		Modal.confirm({
			title: '确认需要导出图表数据吗？',
			onOk () {
				let dataSource = []
				let headers = [{ k: 'time', v: '时间' } ]//ladderChart.allTime
				let flag,flag0,flag1,flag2,flag3,flag4,flag5,flag6,flag7 = ''
				let num = []
				let num0 = []
				let num1 = []
				let num2 = []
				let num3 = []
				let num4 = []
				let num5 = []
				let num6 = []
				let num7 = []
				for(let i = 0; i < ladderChart.biaoti.length; i++){
					if(ladderChart.biaoti[i] == '内存利用率'){
						flag = '1'
						num = [
							   { k: 'avg', v: '内存平均使用率' }]
					}
					if(ladderChart.biaoti[i] == '内存利用率0'){
						flag0 = '1'
						num0 = [
							   { k: 'avg0', v: '内存平均使用率0' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率1'){
						flag1 = '1'
						num1 = [
							   { k: 'avg1', v: '内存平均使用率1' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率2'){
						flag2 = '1'
						num2 = [
							   { k: 'avg2', v: '内存平均使用率2' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率3'){
						flag3 = '1'
						num3 = [
							   { k: 'avg3', v: '内存平均使用率3' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率4'){
						flag4 = '1'
						num4 = [
							   { k: 'avg4', v: '内存平均使用率4' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率5'){
						flag5 = '1'
						num5 = [
							   { k: 'avg5', v: '内存平均使用率5' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率6'){
						flag6 = '1'
						num6 = [
							   { k: 'avg6', v: '内存平均使用率6' }]
						
					}
					if(ladderChart.biaoti[i] == '内存利用率7'){
						flag7 = '1'
						num7 = [
							   { k: 'avg7', v: '内存平均使用率7' }]
						
					}
				}
				headers = headers.concat(num).concat(num0).concat(num1).concat(num2).concat(num3).concat(num4).concat(num5).concat(num6).concat(num7)
			
				if (ladderChart.allTime.length > 0) {
					for (let i = 0; i < ladderChart.allTime.length; i++) {
						let info = {}
						info.time = ladderChart.allTime[i]
						if(flag == '1'){
							info.avg = ladderChart.avgInfoMem[i]
						}
						if(flag0 == '1'){
							info.avg0 = ladderChart.avgInfoMem0[i]
						}
						if(flag1 == '1'){
							info.avg1 = ladderChart.avgInfoMem1[i]
						}
						if(flag2 == '1'){
							info.avg2 = ladderChart.avgInfoMem2[i]
						}
						if(flag3 == '1'){
							info.avg3 = ladderChart.avgInfoMem3[i]
						}
						if(flag4 == '1'){
							info.avg4 = ladderChart.avgInfoMem4[i]
						}
						if(flag5 == '1'){
							info.avg5 = ladderChart.avgInfoMem5[i]
						}
						if(flag6 == '1'){
							info.avg6 = ladderChart.avgInfoMem6[i]
						}
						if(flag7 == '1'){
							info.avg7 = ladderChart.avgInfoMem7[i]
						}
						console.log(info)
						dataSource.push(info)
					}
					exportExcel(headers, dataSource, '内存使用率.xlsx')
				} else {
					message.info('图表无数据！')
				}
			},
			onCancel () {},
		})
	}
	return (
  <div>
    <div style={{ marginLeft: 17 }}><Icon type="download" style={{ fontSize: 13 }} onClick={() => onDownload()} /></div>
    <ReactEcharts
      option={option}
      style={{ height: '280px', width: '100%' }}
      showLoading={ladderChart.loading.effects['chd/queryMem']}
    />
  </div>
    )
}

export default MemLadderChart
