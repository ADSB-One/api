# ADSB One API

The ADSB One API lives at https://api.adsb.one. Use the table below for endpoints.

| Endpoint | Method | Description |
-----------|--------|----------------
| /v2/icao/[icao] | GET | Return all aircraft with an exact match on one of the given Mode S hex ids (limited to 1000) |
| /v2/callsign/[callsign] | GET | Returns all aircraft with an exact match on one of the given callsigns (limited to 1000 or 8000 characters for the request) |
| /v2/reg/[reg] | GET | Returns all aircraft with an exact match on one of the given registrations (limited to 1000 or 8000 characters for the request) |
| /v2/type/[type] | GET | Returns all aircraft that have one of the specified ICAO type codes (A321, B738, etc.) |
| /v2/squawk/[squawk] | GET | Returns all aircraft that are squawking the specified value |
| /v2/mil/ | GET | Returns all aircraft tagged as military |
| /v2/ladd/ | GET | Returns all aircraft tagged as LADD |
| /v2/pia/ | GET | Returns all aircraft tagged as PIA |
| /v2/point/[lat]/[lon]/[radius] | GET | Returns all aircraft within a certain radius of a given point up to 250 nm |
