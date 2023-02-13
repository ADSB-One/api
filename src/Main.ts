import axios from 'axios';
import * as CORS from 'cors';
import * as Express from 'express';

const server = Express.default();

server.use(CORS.default());

const readsb_api_host = process.env['READSB_API_HOST'] || 'readsb_hub';
const readsb_api_port = process.env['READSB_API_PORT'] || '30006';

server.get('/v2/hex/:hex', async (req: any, res) => {
    var hex = req.params.hex;
    
    var hexRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_hex=${hex}&jv2`);
    hexRes = JSON.stringify(hexRes.data);
    
    res.type('json');
    res.send(hexRes);
});

server.get('/v2/callsign/:callsign', async (req: any, res) => {
    var callsign = req.params.callsign;
    
    var callsignRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_callsign=${callsign}&jv2`);
    callsignRes = JSON.stringify(callsignRes.data);
    
    res.type('json');
    res.send(callsignRes);
});

server.get('/v2/reg/:reg', async (req: any, res) => {
    var reg = req.params.reg;
    
    var regRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_reg=${reg}&jv2`);
    regRes = JSON.stringify(regRes.data);
    
    res.type('json');
    res.send(regRes);
});

server.get('/v2/type/:type', async (req: any, res) => {
    var type = req.params.type;
    
    var typeRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?find_type=${type}&jv2`);
    typeRes = JSON.stringify(typeRes.data);
    
    res.type('json');
    res.send(typeRes);
});

server.get('/v2/squawk/:squawk', async (req: any, res) => {
    var squawk = req.params.squawk;
    
    var squawkRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_squawk=${squawk}&jv2`);
    squawkRes = JSON.stringify(squawkRes.data);
    
    res.type('json');
    res.send(squawkRes);
});

server.get('/v2/mil/', async (_req: any, res) => {
    var milRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_mil&jv2`);
    milRes = JSON.stringify(milRes.data);
    
    res.type('json');
    res.send(milRes);
});

server.get('/v2/ladd/', async (_req: any, res) => {
    var laddRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_ladd&jv2`);
    laddRes = JSON.stringify(laddRes.data);
    
    res.type('json');
    res.send(laddRes);
});

server.get('/v2/pia/', async (_req: any, res) => {
    var piaRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?all&filter_pia&jv2`);
    piaRes = JSON.stringify(piaRes.data);
    
    res.type('json');
    res.send(piaRes);
});

server.get('/v2/point/:lat/:lon/:rad', async (req: any, res) => {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var rad = req.params.rad;
    rad > 250 ? rad = 250 : rad = rad;

    var pointRes: any = await axios.get(`http://${readsb_api_host}:${readsb_api_port}/re-api/?circle=${lat},${lon},${rad}&jv2`);
    pointRes = JSON.stringify(pointRes.data);
    
    res.type('json');
    res.send(pointRes);
});

server.listen(3000, () => {
    console.info('ADSB One API server started.')
});
