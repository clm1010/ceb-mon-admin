export default  [
{
	width: 300,
	title: '1_time',
	dataIndex: 'time',
	key: 'time',
	render: (text, record) => {
			return new Date(text * 1000).format('yyyy-MM-dd hh:mm:ss')
		},
}, {
	width: 300,
	title: '2_close_flow_count',
	dataIndex: 'close_flow_count',
	key: 'close_flow_count',

}, {
	width: 300,
	title: '3_concurrent_flow_count',
	dataIndex: 'concurrent_flow_count',
	key: 'concurrent_flow_count',

}, {
	width: 300,
	title: '4_create_flow_count',
	dataIndex: 'create_flow_count',
	key: 'create_flow_count',

}, {
	width: 300,
	title: '5_endpoint1_packet_lost_rate',
	dataIndex: 'endpoint1_packet_lost_rate',

	key: 'endpoint1_packet_lost_rate',
}, {
	width: 300,
	title: '6_endpoint1_packet_retrans_rate',
	dataIndex: 'endpoint1_packet_retrans_rate',
	key: 'endpoint1_packet_retrans_rate',

}, {
	width: 300,
	title: '7_endpoint1_tx_bitps',
	dataIndex: 'endpoint1_tx_bitps',
	key: 'endpoint1_tx_bitps',

}, {
	width: 300,
	title: '8_endpoint1_tx_byte',
	dataIndex: 'endpoint1_tx_byte',
	key: 'endpoint1_tx_byte',

}, {
	width: 300,
	title: '9_endpoint1_tx_packet',
	dataIndex: 'endpoint1_tx_packet',
	key: 'endpoint1_tx_packet',

}, {
	width: 300,
	title: '10_endpoint1_tx_tcp_retransmission_packet',
	dataIndex: 'endpoint1_tx_tcp_retransmission_packet',

	key: 'endpoint1_tx_tcp_retransmission_packet',
}, {
	width: 300,
	title: '11_endpoint1_tx_tcp_segment_lost_packet',
	dataIndex: 'endpoint1_tx_tcp_segment_lost_packet',

	key: 'endpoint1_tx_tcp_segment_lost_packet',
}, {
	width: 300,
	title: '12_endpoint1_tx_tcp_syn_packet',
	dataIndex: 'endpoint1_tx_tcp_syn_packet',
	key: 'endpoint1_tx_tcp_syn_packet',

}, {
	width: 300,
	title: '13_endpoint1_tx_tcp_synack_packet',
	dataIndex: 'endpoint1_tx_tcp_synack_packet',

	key: 'endpoint1_tx_tcp_synack_packet',
}, {
	width: 300,
	title: '14_endpoint2_packet_lost_rate',
	dataIndex: 'endpoint2_packet_lost_rate',
	key: 'endpoint2_packet_lost_rate',

}, {
	width: 300,
	title: '15_endpoint2_packet_retrans_rate',
	dataIndex: 'endpoint2_packet_retrans_rate',
	key: 'endpoint2_packet_retrans_rate',

}, {
	width: 300,
	title: '16_endpoint2_tx_bitps',
	dataIndex: 'endpoint2_tx_bitps',
	key: 'endpoint2_tx_bitps',

}, {
	width: 300,
	title: '17_endpoint2_tx_byte',
	dataIndex: 'endpoint2_tx_byte',
	key: 'endpoint2_tx_byte',

}, {
	width: 300,
	title: '18_endpoint2_tx_packet',
	dataIndex: 'endpoint2_tx_packet',

	key: 'endpoint2_tx_packet',
}, {
	width: 300,
	title: '19_endpoint2_tx_tcp_retransmission_packet',
	dataIndex: 'endpoint2_tx_tcp_retransmission_packet',
	key: 'endpoint2_tx_tcp_retransmission_packet',

}, {
	width: 300,
	title: '20_endpoint2_tx_tcp_segment_lost_packet',
	dataIndex: 'endpoint2_tx_tcp_segment_lost_packet',

	key: 'endpoint2_tx_tcp_segment_lost_packet',
}, {
	width: 300,
	title: '21_endpoint2_tx_tcp_syn_packet',
	dataIndex: 'endpoint2_tx_tcp_syn_packet',
	key: 'endpoint2_tx_tcp_syn_packet',

}, {
	width: 300,
	title: '22_endpoint2_tx_tcp_synack_packet',
	dataIndex: 'endpoint2_tx_tcp_synack_packet',
	key: 'endpoint2_tx_tcp_synack_packet',

}, {
	width: 300,
	title: '23_ip_endpoint1',
	dataIndex: 'ip_endpoint1',
	key: 'ip_endpoint1',

}, {
	width: 300,
	title: '24_ip_endpoint2',
	dataIndex: 'ip_endpoint2',
	key: 'ip_endpoint2',

}, {
	width: 300,
	title: '25_netlinkId',
	dataIndex: 'netlinkId',

	key: 'netlinkId',
}, {
	width: 300,
	title: '26_taskName',
	dataIndex: 'taskName',

	key: 'taskName',
}, {
	width: 300,
	title: '27_alive_flow_count',
	dataIndex: 'alive_flow_count',
	key: 'alive_flow_count',

}, {
	width: 300,
	title: '28_total_bitps',
	dataIndex: 'total_bitps',
	key: 'total_bitps',

}, {
	width: 300,
	title: '29_total_byte',
	dataIndex: 'total_byte',
	key: 'total_byte',

}, {
	width: 300,
	title: '30_total_packet',
	dataIndex: 'total_packet',
	key: 'total_packet',

}, {
	width: 300,
	title: '31_total_packet_retrans_rate',
	dataIndex: 'total_packet_retrans_rate',
	key: 'total_packet_retrans_rate',

},
]
