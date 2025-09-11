import React from 'react'
import { Table, Modal, Row, Col, Button, Tooltip } from 'antd'
import { Link } from 'dva/router'
import './List.css'
const confirm = Modal.confirm

function list ({
	dispatch, loading, dataSource, pagination, onDeleteItem, onEditItem, isMotion, batchDelete, choosedRows, fenhang, q,
   }) {
	   let maps = new Map()
	   fenhang.forEach((obj, index) => {
		   let keys = obj.key
		   let values = obj.value
		   maps.set(keys, values)
	   })
   
	   const onPageChange = (page) => {
		 dispatch({
			 type: 'policyTemplet/query',
			 payload: {
				 page: page.current - 1,
			   pageSize: page.pageSize,
			   q,
			 },
		 })
   
		 // 设置高度
		 let heightSet = {
		   height: '1021px',
		   overflow: 'hidden',
	   }
	   if (page.pageSize === 10) {
		   heightSet.height = '1021px'
	   } else if (page.pageSize === 20) {
		   heightSet.height = '1691px'
	   } else if (page.pageSize === 30) {
		   heightSet.height = '2397px'
	   } else if (page.pageSize === 40) {
		   heightSet.height = '3085px'
	   } else if (page.pageSize === 100) {
		   heightSet.height = '6709px'
	   } else if (page.pageSize === 200) {
		   heightSet.height = '20825px'
	   }
		 dispatch({
			 type: 'policyTemplet/showModal',
			 payload: {
				 pageChange: new Date().getTime(),
				 batchDelete: false,
				 selectedRows: [],
				 heightSet,
			 },
		 })
	   }
   
	   const onAdd = () => {
		   dispatch({
			   type: 'policyTemplet/showModal',
			   payload: {
				   modalType: 'create',
				   currentItem: {
					   name: '',
							 policyType: 'NORMAL',
					   collectParams: {
							 collectInterval: '',
							 timeout: '',
							 retries: '',
							 pktSize: '',
							 pktNum: '',
							 srcDeviceTimeout: '',
							 srcDeviceRetries: '',
						 },
				   },
				   modalVisible: true,
				   isClose: false,
				   typeValue: 'NORMAL',
				   tabstate: {
						 activeKey: 'n1',
						 panes: [
						  {
							  title: '新操作1',
							 key: 'n1',
							 content: {
								 uuid: '',
								 period: '',
								 times: '',
								 foward: '>',
								 value: '',
								 originalLevel: '',
								 innderLevel: '',
								 outerLevel: '',
								 discard_innder: '',
								 discard_outer: '',
								 alarmName: '',
								 recoverType: '1',
								 actionsuuid: '',
							   aDiscardActionuuid: '',
							   aGradingActionuuid: '',
							   aNamingActionuuid: '',
							   conditionuuid: '',
							   timePerioduuid: '',
							   useExt: false, //是否使用扩展条件
							   extOp: '<', //扩展条件
							   extThreshold: '', //扩展阈值
							 },
						 },
						   ],
						newTabIndex: 1,
					 },
					 stdInfoVal: {},
			   }, //payload
		   })
	   }
   
	   const onDelete = () => {
		   confirm({
				   title: '您确定要批量删除这些记录吗?',
				   onOk () {
					let ids = []
					   choosedRows.forEach(record => ids.push(record.policyTemplate.uuid))
					 dispatch({
						   type: 'policyTemplet/delete',
						   payload: ids,
					 })
				   },
			 })
	   }
   
	   const handleMenuClick = (record, e) => {
			   if (e.key === '2') {
			   dispatch({
				   type: 'policyTemplet/findById',
				   payload: {
					   record,
				   },
			   })
			   } else if (e.key === '3') {
				 confirm({
					   title: '您确定要删除这条记录吗?',
					   onOk () {
						   let ids = []
						   ids.push(record.policyTemplate.uuid)
						 dispatch({
							   type: 'policyTemplet/delete',
							   payload: ids,
						 })
					   },
				 })
			   } else if (e.key === '1') {
				   dispatch({
					   type: 'policyTemplet/findById',
					   payload: {
						   record,
					   },
				   })
				   dispatch({
					   type: 'policyTemplet/updateState',
					   payload: {
						   see: 'yes',
					   },
				   })
			   }
		 }
	   const openPolicyModal = (record, e) => {
		   let uuid = ''
		   let policyCount = 0
		   if (record) {
			   uuid = record.policyTemplate.uuid
			   policyCount = record.policyInstances
		   }
   
   
		   /*
			   获取关联实例的数据
		   */
		   dispatch({
			   type: 'policyTemplet/queryPolicies',
			   payload: {
				   uuid,
   
			   },
		   })
		   dispatch({
			   type: 'policyTemplet/updateState',
			   payload: {
				   stdUUIDToPolicy: uuid,
				   stdPolicyNumber: policyCount,
				   policyVisible: true,
			   },
		   })
	   }
	   const openMosModal = (record, e) => {
		   let uuid = ''
		   let policyCount = 0
		   if (record) {
			   uuid = record.policyTemplate.uuid
			   policyCount = record.mos
		   }
		   console.log('openMosModal : ', uuid)
   
   
		   /*
			   获取关联实例的数据
		   */
		   dispatch({
			   type: 'policyTemplet/queryMos',
			   payload: {
				   uuid,
				   relatedType: 'POLICY_TEMPLATE',
			   },
		   })
		   /*
			   打开弹出框
		   */
		   dispatch({
			   type: 'policyTemplet/updateState',
			   payload: {
				   stdUUIDMos: uuid,
				   stdMosNumber: policyCount,
				   mosVisible: true,
			   },
		   })
	   }
		 const openIndicatorsModal = (record, e) => {
			 let data = record.policyTemplate.monitorParams.indicator.group
			 let result = ''
		   if (data && data.length > 0) {
			   data.forEach((item) => {
				   result = `${result + item.name},`
			   })
		   }
			   record.policyTemplate.monitorParams.indicator.groupname = result
			  dispatch({
			   type: 'policyTemplet/updateState',
			   payload: {
					 indicatorsItem: record.policyTemplate.monitorParams.indicator,
				   indicatorsModalVisible: true,
			   },
		   })
		   }
		   const onEdit = (record) => {
			   dispatch({
				   type: 'policyTemplet/findById',
				   payload: {
					   record,
				   },
			   })
		   }
   
			   const onSee = (record) => {
				   dispatch({
					   type: 'policyTemplet/findById',
					   payload: {
						   record,
					   },
				   })
				   dispatch({
					   type: 'policyTemplet/updateState',
					   payload: {
						   see: 'yes',
					   },
				   })
			   }
		   const onDeletes = (record) => {
			   confirm({
				   title: '您确定要删除这条记录吗?',
				   onOk () {
					   let ids = []
					   ids.push(record.policyTemplate.uuid)
					   dispatch({
						   type: 'policyTemplet/delete',
						   payload: ids,
				   })
				   },
		   })
		   }
		 const columns = [
	   {
			 title: '模板名称',
			 dataIndex: 'policyTemplate.name',
			 key: 'policyTemplate.name',
   //    	width: 100,
	   }, {
			 title: '分支机构',
			 dataIndex: 'policyTemplate.branch',
			 key: 'policyTemplate.branch',
			 width: 100,
			 render: (text, record) => {
			   let typename = maps.get(text)
				 return typename
		   },
	   }, {
			 title: '指标',
			 dataIndex: 'indicators',
			 key: 'indicators',
			 width: 150,
			 render: (text, record, index) => {
				 if (record.policyTemplate === undefined) {
					 return ''
				 }
				 if (record.policyTemplate.monitorParams === undefined) {
					 return ''
				 }
				 if (record.policyTemplate.monitorParams.indicator === undefined) {
					 return ''
				 }
			   let name = record.policyTemplate.monitorParams.indicator.name
			   return name//<Link onClick={e => openIndicatorsModal(record, e)}>{name}</Link>
		   },
	   }, {
			 title: '告警参数',
			 dataIndex: 'monitorParams',
			 key: 'monitorParams',
			 render: (text, record) => {
				 let params = ''
				 if (record.policyTemplate.monitorParams === undefined) {
					 return ''
				 }
				 if (record.policyTemplate.monitorParams.ops === undefined) {
					 return ''
				 }
				 let ops = record.policyTemplate.monitorParams.ops
			   if (ops !== undefined) {
				   ops.forEach((op) => {
					   let fuhao = ''
					   if (op.condition.op === '>') {
						   fuhao = '高于'
					   }else if(op.condition.op === '>='){
						   fuhao = '高于等于'
					   } else {
						   fuhao = '低于'
					   }
					   if (record.policyTemplate.policyType === 'SYSLOG') {
						   params += `${op.actions.namingAction.naming};`
					   }else if(op.condition.useExt == false && op.condition.extOp == 'ADV'){
						   let texts=''
						   let objectArray = JSON.parse(op.condition.extThreshold)
						   objectArray.forEach((i)=>{
							   texts+=i.name
						   })
						   params += `${texts};`
					   }else {
						   params += `连续${op.condition.count}次${fuhao}${op.condition.threshold};${op.actions.gradingAction.oriSeverity}级告警;${op.actions.namingAction.naming};`
					   }
				   })
			   }
			   if (record.policyTemplate.policyType === 'SYSLOG') {
				   const typeStyle = <div className="ellipsis" title={params}>{params}</div>
   
				   return typeStyle
			   }
				   return params
		   },
	   }, {
			 title: '策略类型',
			 dataIndex: 'policyType',
			 key: 'policyType',
			 width: 150,
			 render: (text, record) => {
				 let typename = '普通'
			   if (record.policyTemplate.policyType == 'NORMAL') {
				   typename = '普通'
			   } else {
				   typename = record.policyTemplate.policyType
			   }
			   return typename
		   },
   
	   }, {
			 title: '策略实例数',
			 dataIndex: 'policyInstances',
			 key: 'policyInstances',
			 width: 80,
			 render: (text, record, index) => {
			   return text//<Link onClick={e => openPolicyModal(record, e)}>{text}</Link>
		   },
	   }, {
			 title: '监控对象数',
			 dataIndex: 'mos',
			 key: 'mos',
			 width: 80,
			 render: (text, record, index) => {
			   return text//<Link onClick={e => openMosModal(record, e)}>{text}</Link>
			 },
	   },
		   {
			 title: '操作',
			 width: 120,
			 fixed: 'right',
			 render: (text, record) => {
				   return (<div>
	 <Button size="default" type="ghost" shape="circle" icon="eye-o" onClick={() => onSee(record)} />
	 <Button size="default" type="ghost" shape="circle" icon="edit" onClick={() => onEdit(record)} />
	 <Button size="default" type="ghost" shape="circle" icon="delete" onClick={() => onDeletes(record)} />
			   </div>)
			 },
		   },
		 ]
   
		 const rowSelection = {
			 onChange: (selectedRowKeys, selectedRows) => {
				 let choosed = []
				 selectedRows.forEach((object) => {
						 choosed.push = object.id
					 })
				 if (selectedRows.length > 0) {
					 dispatch({
					   type: 'policyTemplet/updateState',
					   payload: {
						   batchDelete: true,
						   choosedRows: selectedRows,
					   },
				   })
			   } else if (selectedRows.length === 0) {
				   dispatch({
						   type: 'policyTemplet/updateState',
					   payload: {
						   batchDelete: false,
						   choosedRows: selectedRows,
					   },
				   })
			   }
			 },
	   }
   
	   const onCopy = () => {
		   dispatch({
			   type: 'policyTemplet/updateState',
			   payload: {
				   copyOrMoveModalType: 'copy',
				   copyOrMoveModal: true,
				   keys: new Date().getTime(),
			   },
		   })
	   }
   
	   const onMove = () => {
		   dispatch({
			   type: 'policyTemplet/updateState',
			   payload: {
				   copyOrMoveModalType: 'move',
				   copyOrMoveModal: true,
				   keys: new Date().getTime(),
			   },
		   })
	   }
   
	   const columeEdit = () => {
		   dispatch({
			   type: 'policyTemplet/updateState',
			   payload: {
				   columeVisible: true,
				   columeList: [
				   {
						  key: '1',
						  name: 'colume1',
						  width: 18,
						  locked: true,
						  sort: 'asc',
						  isSelected: true,
					  },
					  {
						  key: '2',
						  name: 'colume2',
						  width: 19,
						  locked: false,
						  sort: 'asc',
						  isSelected: false,
					  },
					  {
						  key: '3',
						  name: 'colume3',
						  width: 20,
						  locked: true,
						  sort: 'asc',
						  isSelected: true,
					  },
					  {
						  key: '4',
						  name: 'colume4',
						  width: 21,
						  locked: false,
						  sort: 'desc',
						  isSelected: false,
					  },
				   ],
			   },
		   })
	   }
	   //动态获取屏幕分辨率宽度
	   const resize = () => {
		   let widths = ''
		   widths = window.innerWidth
		   if (widths > 950) {
			   const buttonGroup = () => {
				   return (
	 <div>
	   <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete}>批量复制</Button>
	   <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete}>批量移动</Button>
	   <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete}>删除</Button>
	   <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} >新增</Button>
	 </div>
				   )
			   }
			   return buttonGroup()
		   }
			   const buttonGroup = () => {
				   return (
	 <div>
	   <Tooltip placement="topLeft" title="批量复制" trigger="hover">
		 <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={!batchDelete} icon="copy" shape="circle" />
	   </Tooltip>
	   <Tooltip placement="topLeft" title="批量移动" trigger="hover">
		 <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={!batchDelete} icon="code-o" shape="circle" />
	   </Tooltip>
	   <Tooltip placement="topLeft" title="批量删除" trigger="hover">
		 <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={!batchDelete} icon="delete" shape="circle" />
	   </Tooltip>
	   <Tooltip placement="topLeft" title="新增" trigger="hover">
		 <Button style={{ marginLeft: 8 }} size="default" type="ghost" onClick={onAdd} icon="plus" shape="circle" />
	   </Tooltip>
	 </div>
				   )
			   }
			   return buttonGroup()
	   }
	   window.onresize = resize
	   resize()
   //	let textInput = null;
   //  const click = () => {
   //  		CustomTextInput()
   //  		if(textInput){
   //  			if(window.innerWidth > 950){
   //				const buttonGroup = () =>{
   //					return(
   //						<div>
   //			        			<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={batchDelete?false:true}>批量复制</Button>
   //			        			<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={batchDelete?false:true}>批量移动</Button>
   //			        			<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={batchDelete?false:true} icon="delete" />
   //			        			<Button style={{marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增策略模板</Button>
   //			        			<Button style={{marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="setting"></Button>
   //			    			</div>
   //					)
   //				}
   //				textInput.innerHTML = `${buttonGroup()}`
   //			}else{
   //				const buttonGroup = () =>{
   //					return(
   //						<div>
   //							<Tooltip placement="topLeft" title='批量复制' trigger='hover'>
   //			        				<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onCopy}  disabled={batchDelete?false:true} icon="copy" shape="circle"/>
   //			        			</Tooltip>
   //			        			<Tooltip placement="topLeft" title='批量移动' trigger='hover'>
   //			        				<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={batchDelete?false:true} icon="code-o" shape="circle"/>
   //			        			</Tooltip>
   //			        			<Tooltip placement="topLeft" title='批量删除' trigger='hover'>
   //			        				<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={batchDelete?false:true} icon="delete" shape="circle" />
   //			        			</Tooltip>
   //			        			<Tooltip placement="topLeft" title='新增策略模板' trigger='hover'>
   //			        				<Button style={{marginLeft: 8 }} size="default" type="primary" onClick={onAdd} icon="plus" shape="circle" />
   //			        			</Tooltip>
   //			        			<Tooltip placement="topLeft" title='setting' trigger='hover'>
   //			        				<Button style={{marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="setting" />
   //			    				</Tooltip>
   //			    			</div>
   //					)
   //				}
   //				textInput.innerHTML = buttonGroup()
   //			}
   //  		}
   //  }
   //	const CustomTextInput = (props) => {
   //	    return (
   //	        <div ref={div => { textInput = div; }} >
   //      			<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onCopy} disabled={batchDelete?false:true}>批量复制</Button>
   //      			<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onMove} disabled={batchDelete?false:true}>批量移动</Button>
   //      			<Button style={{marginLeft: 8 }} size="default" type="ghost" onClick={onDelete} disabled={batchDelete?false:true} icon="delete" />
   //      			<Button style={{marginLeft: 8 }} size="default" type="primary" onClick={onAdd}>新增策略模板</Button>
   //      			<Button style={{marginLeft: 8 }} size="default" type="ghost" shape="circle" icon="setting"></Button>
   //	        	</div>
   //	    );
   //	}
   //	window.onresize = click;
   //	click();
	   //end
		 return (
	   <Row gutter={24}>
		 <Col xl={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
		   <Table
   
			 bordered
			 columns={columns}
			 scroll={{ x: 1300 }}
			 dataSource={dataSource}
			 loading={loading}
			 onChange={onPageChange}
			 pagination={pagination}
			 simple
			 rowKey={record => record.policyTemplate.uuid}
			 size="small"
			 rowSelection={rowSelection}
		   />
		 </Col>
	   </Row>
		 )
}

export default list
