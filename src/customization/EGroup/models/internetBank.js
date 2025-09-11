import { queryNpmLog } from '../../../services/dashboard'
import { peformanceCfg } from '../../../utils/performanceOelCfg'
import { Tag, Tooltip } from 'antd'
export default {

  namespace: 'internetBank',

  state:{
    q:'',
    buttonState: true,
    queryTime: 3,
    endTime: 0,
    list: [],//网银互联网出口上地电信-实时流量
    topList: [],//网银互联网出口上地电信-SYN包TOP
		JXQDXlist: [],//网银互联网出口酒仙桥电信-实时流量
		JXQDXTop: [],//网银互联网出口酒仙桥电信-SYN包TOP
		SDYDlist: [],//网银互联网出口上地移动-实时流量
		SDYDTop: [],//网银互联网出口上地移动-SYN包TOP
		JXQYDlist: [],//网银互联网出口酒仙桥移动-实时流量
		JXQYDTop: [],//网银互联网出口酒仙桥移动-SYN包TOP
		SDLTlist: [],//网银互联网出口上地联通-实时流量
		SDLTTop: [],//网银互联网出口上地联通-SYN包TOP
		JXQLTlist: [],//网银互联网出口酒仙桥联通-实时流量
		JXQLTTop: []//网银互联网出口酒仙桥联通-SYN包TOP
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen( location => {
        if(location.pathname === '/dashboard/internetBank'){
//        dispatch({ type: 'query', payload:{ vlan_id: '1,101', path: 'tcpmonvlan'} }),
//        dispatch({ type: 'queryTop', payload:{ vlan_id: '1,101', path: 'tcpmonvlantop'} }),
//        dispatch({ type: 'queryJXQDX', payload:{ vlan_id: '2,101', path: 'tcpmonvlan'} }),
//        dispatch({ type: 'queryJXQDXTop', payload:{ vlan_id: '2,101', path: 'tcpmonvlantop'} }),
//        dispatch({ type: 'querySDYD', payload:{ vlan_id: '1,324', path: 'tcpmonvlan'} }),
//        dispatch({ type: 'querySDYDTop', payload:{ vlan_id: '1,324', path: 'tcpmonvlantop'} }),
//        dispatch({ type: 'queryJXQYD', payload:{ vlan_id: '2,103', path: 'tcpmonvlan'} }),
//        dispatch({ type: 'queryJXQYDTop', payload:{ vlan_id: '2,103', path: 'tcpmonvlantop'} }),  
//        dispatch({ type: 'querySDLT', payload:{ vlan_id: '1,102', path: 'tcpmonvlan'} }),
//        dispatch({ type: 'querySDLTTop', payload:{ vlan_id: '1,102', path: 'tcpmonvlantop'} }),
//        dispatch({ type: 'queryJXQLT', payload:{ vlan_id: '2,102', path: 'tcpmonvlan'} }),
//        dispatch({ type: 'queryJXQLTTop', payload:{ vlan_id: '2,102', path: 'tcpmonvlantop'} })
        }
      })
    }
  },

  effects:{
  	//网银互联网出口上地电信-实时流量
	*query ({ payload }, { call, put }) {
		let list = {}
		let time = [], ins = [], out = []
		let queryLines = peformanceCfg.queryLines
		queryLines.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
		queryLines.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 60
		let newDate = { path: payload.path,queryLog: queryLines }
		const data = yield call ( queryNpmLog, newDate )
		if(data.success && data.aggregations.top_info.hits.hits){
			for(let info of data.aggregations.top_info.hits.hits){
				time.push(new Date(info._source.time*1000).format('yyyy-MM-dd hh:mm:ss'))//时间
				ins.push((info._source.rx_bitps/8000).toFixed(2))//接收的比特率
				out.push((info._source.tx_bitps/8000).toFixed(2))//发送的比特率
			}
			list.time = time
			list.ins = ins
			list.out = out
		}
		yield put({
			type: 'setState',
			payload:{
				list:list
			}
		})
  },
  //网银互联网出口上地电信-SYN包TOP
  *queryTop ({ payload }, { call, put }) {
  	let queryTOP = peformanceCfg.queryTOP
  	queryTOP.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
  	queryTOP.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 180
  	let newDate = { path: payload.path,queryLog: queryTOP }
  	const data = yield call ( queryNpmLog, newDate )
  	if(data.success && data.aggregations.top_info.hits.hits){
			let source = data.aggregations.top_info.hits.hits
			let info = source.map((itme, index) => {
				return  <li key={itme._source.ip_endpoint1+'_'+index}>
									<p style={{ color: '#D3D7DD', marginLeft: 5 }}><Tag color="#f50" style={{ marginLeft: 5 }}>TOP {index+1}</Tag><Tooltip title={itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}>{itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}</Tooltip></p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{new Date(itme._source.time*1000).format('yyyy-MM-dd hh:mm:ss')}</p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{itme._source.tcp_syn_packet}</p>
								</li>
			})
			yield put({
				type: 'setState',
				payload:{
					topList: info
				}
			})
		}
  },
  //网银互联网出口酒仙桥电信-实时流量
  *queryJXQDX ({ payload }, { call, put }) {
  	let list = {}
		let time = [], ins = [], out = []
		let queryJXQDX = peformanceCfg.queryJXQDX
		queryJXQDX.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
		queryJXQDX.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 60
		let newDate = { path: payload.path,queryLog: queryJXQDX }
		const data = yield call ( queryNpmLog, newDate )
		if(data.success && data.aggregations.top_info.hits.hits){
			for(let info of data.aggregations.top_info.hits.hits){
				time.push(new Date(info._source.time*1000).format('yyyy-MM-dd hh:mm:ss'))//时间
				ins.push((info._source.rx_bitps/8000).toFixed(2))//接收的比特率
				out.push((info._source.tx_bitps/8000).toFixed(2))//发送的比特率
			}
			list.time = time
			list.ins = ins
			list.out = out
		}
		yield put({
			type: 'setState',
			payload:{
				JXQDXlist:list
			}
		})
  },
  //网银互联网出口酒仙桥电信-SYN包TOP
  *queryJXQDXTop ({ payload }, { call, put }) {
  	let queryJXQDXTop = peformanceCfg.queryJXQDXTop
  	queryJXQDXTop.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
  	queryJXQDXTop.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 180
  	let newDate = { path: payload.path,queryLog: queryJXQDXTop }
  	const data = yield call ( queryNpmLog, newDate )
  	if(data.success && data.aggregations.top_info.hits.hits){
			let source = data.aggregations.top_info.hits.hits
			let info = source.map((itme, index) => {
				return  <li>
									<p style={{ color: '#D3D7DD', marginLeft: 5 }}><Tag color="#f50" style={{ marginLeft: 5 }}>TOP {index+1}</Tag><Tooltip title={itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}>{itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}</Tooltip></p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{new Date(itme._source.time*1000).format('yyyy-MM-dd hh:mm:ss')}</p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{itme._source.tcp_syn_packet}</p>
								</li>
			})
			yield put({
				type: 'setState',
				payload:{
					JXQDXTop: info
				}
			})
		}
  },
  //网银互联网出口上地移动-实时流量
  *querySDYD({ payload }, { call, put }){
  	let list = {}
		let time = [], ins = [], out = []
		let querySDYD = peformanceCfg.querySDYD
		querySDYD.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
		querySDYD.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 60
		let newDate = { path: payload.path,queryLog: querySDYD }
		const data = yield call ( queryNpmLog, newDate )
		if(data.success && data.aggregations.top_info.hits.hits){
			for(let info of data.aggregations.top_info.hits.hits){
				time.push(new Date(info._source.time*1000).format('yyyy-MM-dd hh:mm:ss'))//时间
				ins.push((info._source.rx_bitps/8000).toFixed(2))//接收的比特率
				out.push((info._source.tx_bitps/8000).toFixed(2))//发送的比特率
			}
			list.time = time
			list.ins = ins
			list.out = out
		}
		yield put({
			type: 'setState',
			payload:{
				SDYDlist:list
			}
		})
  },
  //网银互联网出口上地移动-SYN包TOP
  *querySDYDTop({ payload }, { call, put }){
  	let querySDYDTop = peformanceCfg.querySDYDTop
  	querySDYDTop.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
  	querySDYDTop.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 180
  	let newDate = { path: payload.path,queryLog: querySDYDTop }
  	const data = yield call ( queryNpmLog, newDate )
  	if(data.success && data.aggregations.top_info.hits.hits){
			let source = data.aggregations.top_info.hits.hits
			let info = source.map((itme, index) => {
				return  <li>
									<p style={{ color: '#D3D7DD', marginLeft: 5 }}><Tag color="#f50" style={{ marginLeft: 5 }}>TOP {index+1}</Tag><Tooltip title={itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}>{itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}</Tooltip></p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{new Date(itme._source.time*1000).format('yyyy-MM-dd hh:mm:ss')}</p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{itme._source.tcp_syn_packet}</p>
								</li>
			})
			yield put({
				type: 'setState',
				payload:{
					SDYDTop: info
				}
			})
		}
  },
  //网银互联网出口酒仙桥移动-实时流量
  *queryJXQYD({ payload }, { call, put }){
  	let list = {}
		let time = [], ins = [], out = []
		let queryJXQYD = peformanceCfg.queryJXQYD
		queryJXQYD.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
		queryJXQYD.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 60
		let newDate = { path: payload.path,queryLog: queryJXQYD }
		const data = yield call ( queryNpmLog, newDate )
		if(data.success && data.aggregations.top_info.hits.hits){
			for(let info of data.aggregations.top_info.hits.hits){
				time.push(new Date(info._source.time*1000).format('yyyy-MM-dd hh:mm:ss'))//时间
				ins.push((info._source.rx_bitps/8000).toFixed(2))//接收的比特率
				out.push((info._source.tx_bitps/8000).toFixed(2))//发送的比特率
			}
			list.time = time
			list.ins = ins
			list.out = out
		}
		yield put({
			type: 'setState',
			payload:{
				JXQYDlist:list
			}
		})
  },
  //网银互联网出口酒仙桥移动-SYN包TOP
  *queryJXQYDTop({ payload }, { call, put }){
  	let queryJXQYDTop = peformanceCfg.queryJXQYDTop
  	queryJXQYDTop.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
  	queryJXQYDTop.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 180
  	let newDate = { path: payload.path,queryLog: queryJXQYDTop }
  	const data = yield call ( queryNpmLog, newDate )
  	if(data.success && data.aggregations.top_info.hits.hits){
			let source = data.aggregations.top_info.hits.hits
			let info = source.map((itme, index) => {
				return  <li>
									<p style={{ color: '#D3D7DD', marginLeft: 5 }}><Tag color="#f50" style={{ marginLeft: 5 }}>TOP {index+1}</Tag><Tooltip title={itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}>{itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}</Tooltip></p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{new Date(itme._source.time*1000).format('yyyy-MM-dd hh:mm:ss')}</p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{itme._source.tcp_syn_packet}</p>
								</li>
			})
			yield put({
				type: 'setState',
				payload:{
					JXQYDTop: info
				}
			})
		}
  },
  //网银互联网出口上地联通-实时流量
  *querySDLT({ payload }, { call, put }){
  	let list = {}
		let time = [], ins = [], out = []
		let querySDLT = peformanceCfg.querySDLT
		querySDLT.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
		querySDLT.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 60
		let newDate = { path: payload.path,queryLog: querySDLT }
		const data = yield call ( queryNpmLog, newDate )
		if(data.success && data.aggregations.top_info.hits.hits){
			for(let info of data.aggregations.top_info.hits.hits){
				time.push(new Date(info._source.time*1000).format('yyyy-MM-dd hh:mm:ss'))//时间
				ins.push((info._source.rx_bitps/8000).toFixed(2))//接收的比特率
				out.push((info._source.tx_bitps/8000).toFixed(2))//发送的比特率
			}
			list.time = time
			list.ins = ins
			list.out = out
		}
		yield put({
			type: 'setState',
			payload:{
				SDLTlist:list
			}
		})
  },
  //网银互联网出口上地联通-SYN包TOP
  *querySDLTTop({ payload }, { call, put }){
  	let querySDLTTop = peformanceCfg.querySDLTTop
  	querySDLTTop.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
  	querySDLTTop.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 180
  	let newDate = { path: payload.path,queryLog: querySDLTTop }
  	const data = yield call ( queryNpmLog, newDate )
  	if(data.success && data.aggregations.top_info.hits.hits){
			let source = data.aggregations.top_info.hits.hits
			let info = source.map((itme, index) => {
				return  <li>
									<p style={{ color: '#D3D7DD', marginLeft: 5 }}><Tag color="#f50" style={{ marginLeft: 5 }}>TOP {index+1}</Tag><Tooltip title={itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}>{itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}</Tooltip></p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{new Date(itme._source.time*1000).format('yyyy-MM-dd hh:mm:ss')}</p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{itme._source.tcp_syn_packet}</p>
								</li>
			})
			yield put({
				type: 'setState',
				payload:{
					SDLTTop: info
				}
			})
		}
  },
  //网银互联网出口酒仙桥联通-实时流量
  *queryJXQLT({ payload }, { call, put }){
  	let list = {}
		let time = [], ins = [], out = []
		let queryJXQLT = peformanceCfg.queryJXQLT
		queryJXQLT.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
		queryJXQLT.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 60
		let newDate = { path: payload.path,queryLog: queryJXQLT }
		const data = yield call ( queryNpmLog, newDate )
		if(data.success && data.aggregations.top_info.hits.hits){
			for(let info of data.aggregations.top_info.hits.hits){
				time.push(new Date(info._source.time*1000).format('yyyy-MM-dd hh:mm:ss'))//时间
				ins.push((info._source.rx_bitps/8000).toFixed(2))//接收的比特率
				out.push((info._source.tx_bitps/8000).toFixed(2))//发送的比特率
			}
			list.time = time
			list.ins = ins
			list.out = out
		}
		yield put({
			type: 'setState',
			payload:{
				JXQLTlist:list
			}
		})
  },
  //网银互联网出口酒仙桥联通-SYN包TOP
  *queryJXQLTTop({ payload }, { call, put }){
  	let queryJXQLTTop = peformanceCfg.queryJXQLTTop
  	queryJXQLTTop.query.filtered.filter.bool.must[0].term.vlan_id = payload.vlan_id
  	queryJXQLTTop.query.filtered.filter.bool.must[1].range.time.gt = Date.parse(new Date()) / 1000 - 180
  	let newDate = { path: payload.path,queryLog: queryJXQLTTop }
  	const data = yield call ( queryNpmLog, newDate )
  	if(data.success && data.aggregations.top_info.hits.hits){
			let source = data.aggregations.top_info.hits.hits
			let info = source.map((itme, index) => {
				return  <li>
									<p style={{ color: '#D3D7DD', marginLeft: 5 }}><Tag color="#f50" style={{ marginLeft: 5 }}>TOP {index+1}</Tag><Tooltip title={itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}>{itme._source.ip_endpoint1+' - '+itme._source.ip_endpoint2}</Tooltip></p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{new Date(itme._source.time*1000).format('yyyy-MM-dd hh:mm:ss')}</p>
									<p style={{ color: '#D3D7DD', textAlign: 'center' }}>{itme._source.tcp_syn_packet}</p>
								</li>
			})
			yield put({
				type: 'setState',
				payload:{
					JXQLTTop: info
				}
			})
		}
  },
  },

  reducers:{
    setState( state, action ){
      return { ...state, ...action.payload }
    }
  }

}
