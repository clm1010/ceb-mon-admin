import React from 'react'
import { connect } from 'dva'
import Detail from './Detail'

const Chd = ({
 location, dispatch, chd, loading, objectGroup,
}) => {
	const {
 branch, responseStar, responseEnd, lossStar, lossEnd, instrumentChart, nodeDetails, intfDetails, cpuLineChart, memLineChart, responseLineChart, lossLineChart, cpuTimescope, memTimescope, responseTimescope, lossTimescope, cpuGran, memGran, responseGran, lossGran, neUUID, tableState, alarmDataSource, paginationAlarm, uuid,
} = chd

  const detailProps = { //这里定义的是查询页面要绑定的数据源
  	nodeDetails,
  	intfDetails,
  	instrumentChart,
  	cpuLineChart,
  	memLineChart,
  	responseLineChart,
  	lossLineChart,
  	cpuTimescope,
  	memTimescope,
  	responseTimescope,
  	lossTimescope,
  	cpuGran,
  	memGran,
  	responseGran,
  	dispatch,
  	lossGran,
  	neUUID,
  	isClosed: objectGroup.isClosed,
  	paginationIntf: chd.paginationIntf,
  	loading,
  	tableState,
  	responseStar,
	responseEnd,
	lossStar,
	lossEnd,
	alarmDataSource,
	paginationAlarm,
	branch,
	uuid,
 	}

  return (
    <div>
      <Detail {...detailProps} />
    </div>
  )
}

//通过connect把model的数据注入到这个Tool页面中来
//loading为自带对象，标记页面的加载状态
export default connect(({ chd, loading, objectGroup }) => ({ chd, objectGroup, loading }))(Chd)
