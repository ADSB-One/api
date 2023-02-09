export default interface Receiver {
    uuid: string,
    positions_s: number,
    timed_out: number,
    latMin: number,
    latMax: number,
    lonMin: number,
    lonMax: number,
    badExtent: boolean,
    lat: number,
    lon: number
}