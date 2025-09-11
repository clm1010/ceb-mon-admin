import React from 'react'
import { connect } from 'dva'
import Detail from './Detail'

const InterfaceChart = ({
 location, dispatch, interfaceChart, loading,
}) => {
	const {
 instrumentChart,
			nodeDetails,
			portUtilization,
			folwAvg,
			usageTimescope,
			flowTimescope,
			usageGran,
			flowGran,
			neUUID,
			orgcode,
			unitState,
			lossGran,
			wrongGran,
			lossTimescope,
			wrongTimescope,
			wrongChart,
			lossChart,
			flowTimeStart,
			flowTimeEnd,
			usageStart,
			usageEnd,
			lossStart,
			lossEnd,
			wrongStart,
			wrongEnd,
			alarmDataSource,
			paginationAlarm,
			uuid,
			poetName,
			branch,
	} = interfaceChart
  	const detailProps = { //这里定义的是查询页面要绑定的数据源
  			dispatch,
    		nodeDetails,
    		instrumentChart,
    		portUtilization: orgcode,
    		folwAvg,
    		usageTimescope,
    		flowTimescope,
    		usageGran,
    		flowGran,
    		lossGran,
			wrongGran,
			lossTimescope,
			wrongTimescope,
    		neUUID,
    		unitState,
    		wrongChart,
    		lossChart,
    		flowTimeStart,
			flowTimeEnd,
			usageStart,
			usageEnd,
			lossStart,
			lossEnd,
			wrongStart,
			wrongEnd,
			alarmDataSource,
			paginationAlarm,
			uuid,
			poetName,
			branch,
			loading,
 	}

  return (
    <div>
      <Detail {...detailProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ interfaceChart, loading }) => ({ interfaceChart, loading }))(InterfaceChart)
