export default interface BeastData {
    receiverId: string,
    port: number,
    avg_kbit_s: number,
    conn_time: number,
    messages_s: number,
    positions_s: number,
    reduce_signal: number,
    recent_rtt: number,
    positions: number
}