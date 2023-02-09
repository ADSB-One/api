export default interface MlatClient {
    user: string,
    uid: number,
    uuid: string,
    lat: number,
    lon: number,
    alt: number,
    port: number,
    message_rate: number,
    peer_count: number,
    bad_sync_timeout: number,
    outlier_percent: number,
    bad_peer_list: string[],
    sync_interest: string[],
    mlat_interest: string[]
}