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
	title: '5_downlink_packet_lost_rate',
	dataIndex: 'downlink_packet_lost_rate',
	key: 'downlink_packet_lost_rate',

}, {
	width: 300,
	title: '6_downlink_packet_retrans_rate',
	dataIndex: 'downlink_packet_retrans_rate',
	key: 'downlink_packet_retrans_rate',

}, {
	width: 300,
	title: '7_downlink_tcp_retransmission_packet',
	dataIndex: 'downlink_tcp_retransmission_packet',

	key: 'downlink_tcp_retransmission_packet',
}, {
	width: 300,
	title: '8_downlink_tcp_segment_lost_packet',
	dataIndex: 'downlink_tcp_segment_lost_packet',
	key: 'downlink_tcp_segment_lost_packet',

}, {
	width: 300,
	title: '9_netlinkId',
	dataIndex: 'netlinkId',
	key: 'netlinkId',

}, {
	width: 300,
	title: '10_rx_bitps',
	dataIndex: 'rx_bitps',
	key: 'rx_bitps',

}, {
	width: 300,
	title: '11_rx_byte',
	dataIndex: 'rx_byte',
	key: 'rx_byte',

}, {
	width: 300,
	title: '12_rx_packet',
	dataIndex: 'rx_packet',
	key: 'rx_packet',

}, {
	width: 300,
	title: '13_rx_tcp_syn_packet',
	dataIndex: 'rx_tcp_syn_packet',

	key: 'rx_tcp_syn_packet',
}, {
	width: 300,
	title: '14_rx_tcp_synack_packet',
	dataIndex: 'rx_tcp_synack_packet',
	key: 'rx_tcp_synack_packet',
}, {
	width: 300,
	title: '15_taskName',
	dataIndex: 'taskName',
	key: 'taskName',
}, {
	width: 300,
	title: '16_tcp_retransmission_packet',
	dataIndex: 'tcp_retransmission_packet',
	key: 'tcp_retransmission_packet',

}, {
	width: 300,
	title: '17_tcp_segment_lost_packet',
	dataIndex: 'tcp_segment_lost_packet',
	key: 'tcp_segment_lost_packet',
}, {
	width: 300,
	title: '18_tcp_syn_packet',
	dataIndex: 'tcp_syn_packet',
	key: 'tcp_syn_packet',

}, {
	width: 300,
	title: '19_tcp_synack_packet',
	dataIndex: 'tcp_synack_packet',
	key: 'tcp_synack_packet',

}, {
	width: 300,
	title: '20_alive_flow_count',
	dataIndex: 'alive_flow_count',

	key: 'alive_flow_count',
}, {
	width: 300,
	title: '21_total_bitps',
	dataIndex: 'total_bitps',
	key: 'total_bitps',

}, {
	width: 300,
	title: '22_total_byte',
	dataIndex: 'total_byte',

	key: 'total_byte',
}, {
	width: 300,
	title: '23_total_packet',
	dataIndex: 'total_packet',
	key: 'total_packet',

}, {
	width: 300,
	title: '24_total_packet_lost_rate',
	dataIndex: 'total_packet_lost_rate',
	key: 'total_packet_lost_rate',

}, {
	width: 300,
	title: '25_total_packet_retrans_rate',
	dataIndex: 'total_packet_retrans_rate',
	key: 'total_packet_retrans_rate',

}, {
	width: 300,
	title: '26_tx_bitps',
	dataIndex: 'tx_bitps',
	key: 'tx_bitps',

}, {
	width: 300,
	title: '27_tx_byte',
	dataIndex: 'tx_byte',
	key: 'tx_byte',

}, {
	width: 300,
	title: '28_tx_packet',
	dataIndex: 'tx_packet',
	key: 'tx_packet',

}, {
	width: 300,
	title: '29_tx_tcp_syn_packet',
	dataIndex: 'tx_tcp_syn_packet',

	key: 'tx_tcp_syn_packet',
}, {
	width: 300,
	title: '30_tx_tcp_synack_packet',
	dataIndex: 'tx_tcp_synack_packet',
	key: 'tx_tcp_synack_packet',

}, {
	width: 300,
	title: '31_uplink_packet_lost_rate',
	dataIndex: 'uplink_packet_lost_rate',
	key: 'uplink_packet_lost_rate',

}, {
	width: 300,
	title: '32_uplink_packet_retrans_rate',
	dataIndex: 'uplink_packet_retrans_rate',
	key: 'uplink_packet_retrans_rate',

}, {
	width: 300,
	title: '33_uplink_tcp_retransmission_packet',
	dataIndex: 'uplink_tcp_retransmission_packet',
	key: 'uplink_tcp_retransmission_packet',

}, {
	width: 300,
	title: '34_uplink_tcp_segment_lost_packet',
	dataIndex: 'uplink_tcp_segment_lost_packet',
	key: 'uplink_tcp_segment_lost_packet',

}, {
	width: 300,
	title: '35_vlan_id',
	dataIndex: 'vlan_id',
	key: 'vlan_id',

}]
