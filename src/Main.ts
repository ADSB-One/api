import axios from 'axios';
import * as FS from 'fs';
import * as CORS from 'cors';
import * as Express from 'express';
import type BeastClient from './BeastClient';
import type MlatClient from './MlatClient';

const server = Express.default();

server.use(CORS.default());

server.get('/feed-status', async(req: any, res) => {
    var clients = await JSON.parse(FS.readFileSync('/beast-json/clients.json', 'utf8'));
    var receivers = await JSON.parse(FS.readFileSync('/beast-json/receivers.json', 'utf8'));
    var mlatClients = await JSON.parse(FS.readFileSync('/mlat-json/clients.json', 'utf8'));
    var ip = req.headers['cf-connecting-ip'];

    clients = clients.clients;
    receivers = receivers.receivers;
    var feederClients: BeastClient[] = [];
    var feederReceivers: any[] = [];
    var feederMlats: MlatClient[] = [];

    // Iterate through clients.json to find clients with matching IP.
    for (var client of clients) {

        // Get rid of the bullshit spacing in the host/ip section of the client.
        var rawIp = client[1].toString().replace(' port ', ':').replace(/\s/g, '');
        // Split into IP and port.
        var clientIp = rawIp.split(':')[0];
        var clientPort = rawIp.split(':')[1];
        
        // If a client IP matches the connecting IP, add it to the list of clients.
        if (clientIp == ip) {
            var c: BeastClient = {
                receiverId: client[0],
                port: clientPort,
                avg_kbit_s: client[2],
                conn_time: client[3],
                messages_s: client[4],
                positions_s: client[5],
                reduce_signal: client[6], 
                recent_rtt: client[7],
                positions: client[8]
            };

            feederClients.push(c);
        }
    }

    for (var a of feederClients) {
        var shortUuid = a.receiverId.substring(0, a.receiverId.lastIndexOf('-', a.receiverId.lastIndexOf('-') -1));
        for (var b of receivers) {
            if (b[0] == shortUuid) feederReceivers.push(b);
        }
    }

    for (var mclient in mlatClients) {
        var mlatClient = mlatClients[mclient];
        if (mlatClient.source_ip == ip) {
            feederMlats.push({
                user: mlatClient.user,
                uid: mlatClient.uid,
                uuid: mlatClient.uuid,
                lat: mlatClient.lat,
                lon: mlatClient.lon,
                alt: mlatClient.alt,
                port: mlatClient.source_port,
                message_rate: mlatClient.message_rate,
                peer_count: mlatClient.peer_count,
                bad_sync_timeout: mlatClient.bad_sync_timeout,
                outlier_percent: mlatClient.outlier_percent,
                bad_peer_list: mlatClient.bad_peer_list,
                sync_interest: mlatClient.sync_interest,
                mlat_interest: mlatClient.mlat_interest
            });
        }
    }
    
    res.type('json');

    var clientInfo = {"host": ip, "feederClients": feederClients, "feederReceivers": feederReceivers, "feederMlats": feederMlats};

    res.send(clientInfo);
});

server.get('/clients/beast', async (_req: any, res) => {
    var clients = await JSON.parse(FS.readFileSync('/beast-json/clients.json', 'utf8'));
    var receivers = await JSON.parse(FS.readFileSync('/beast-json/receivers.json', 'utf8'));
    
    clients = clients.clients;
    receivers = receivers.receivers;
    var cleaned: any[][] = [];

    for (var a of clients) {
        var shortUuid = a[0].substring(0, a[0].lastIndexOf('-', a[0].lastIndexOf('-') -1));
        for (var b of receivers) {
            if (b[0] == shortUuid) cleaned.push([b[8],b[9]]);
        }
    }

    var rres = {
        "clients": clients.length,
        "receivers": cleaned
    };

    res.send(rres);
    cleaned.length = 0;
});

server.get('/clients/mlat', async (_req: any, res) => {
    var syncs = await JSON.parse(FS.readFileSync('/mlat-json/sync.json', 'utf8'));
    var syncClients: any [] = [];
    var syncPeerCoords: any[][] = [];
    
    // Parse through syncs, and store.
    for (var sync in syncs) {
        var syncClient = syncs[sync]
        
        if (syncClient.lat != null) syncClients.push([syncClient.lat, syncClient.lon]);
        for (var peer in syncClient.peers) {
            if (syncs[peer].lat != null && syncClient.lat != null) syncPeerCoords.push([syncClient.lat, syncClient.lon, syncs[peer].lat, syncs[peer].lon]);
        }
    }

    var rres = {
        "client_count": syncClients.length,
        "clients": syncPeerCoords,
    };

    res.type('json');
    res.send(rres);
});

server.get('/v2/hex/:hex', async (req: any, res) => {
    var hex = req.params.hex;
    
    var hexRes: any = await axios.get(`https://globe.adsb.one/re-api/?find_hex=${hex}&jv2`);
    hexRes = JSON.stringify(hexRes.data);
    
    res.type('json');
    res.send(hexRes);
});

server.get('/v2/callsign/:callsign', async (req: any, res) => {
    var callsign = req.params.callsign;
    
    var callsignRes: any = await axios.get(`https://globe.adsb.one/re-api/?find_callsign=${callsign}&jv2`);
    callsignRes = JSON.stringify(callsignRes.data);
    
    res.type('json');
    res.send(callsignRes);
});

server.get('/v2/reg/:reg', async (req: any, res) => {
    var reg = req.params.reg;
    
    var regRes: any = await axios.get(`https://globe.adsb.one/re-api/?find_reg=${reg}&jv2`);
    regRes = JSON.stringify(regRes.data);
    
    res.type('json');
    res.send(regRes);
});

server.get('/v2/type/:type', async (req: any, res) => {
    var type = req.params.type;
    
    var typeRes: any = await axios.get(`https://globe.adsb.one/re-api/?find_type=${type}&jv2`);
    typeRes = JSON.stringify(typeRes.data);
    
    res.type('json');
    res.send(typeRes);
});

server.get('/v2/squawk/:squawk', async (req: any, res) => {
    var squawk = req.params.squawk;
    
    var squawkRes: any = await axios.get(`https://globe.adsb.one/re-api/?all&filter_squawk=${squawk}&jv2`);
    squawkRes = JSON.stringify(squawkRes.data);
    
    res.type('json');
    res.send(squawkRes);
});

server.get('/v2/mil/', async (_req: any, res) => {
    var milRes: any = await axios.get(`https://globe.adsb.one/re-api/?all&filter_mil&jv2`);
    milRes = JSON.stringify(milRes.data);
    
    res.type('json');
    res.send(milRes);
});

server.get('/v2/ladd/', async (_req: any, res) => {
    var laddRes: any = await axios.get(`https://globe.adsb.one/re-api/?all&filter_ladd&jv2`);
    laddRes = JSON.stringify(laddRes.data);
    
    res.type('json');
    res.send(laddRes);
});

server.get('/v2/pia/', async (_req: any, res) => {
    var piaRes: any = await axios.get(`https://globe.adsb.one/re-api/?all&filter_pia&jv2`);
    piaRes = JSON.stringify(piaRes.data);
    
    res.type('json');
    res.send(piaRes);
});

server.get('/v2/point/:lat/:lon/:rad', async (req: any, res) => {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var rad = req.params.rad;
    rad > 250 ? rad = 250 : rad = rad;

    var pointRes: any = await axios.get(`https://globe.adsb.one/re-api/?circle=${lat},${lon},${rad}&jv2`);
    pointRes = JSON.stringify(pointRes.data);
    
    res.type('json');
    res.send(pointRes);
});

server.listen(3001);