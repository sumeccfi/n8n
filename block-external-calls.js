// Network call blocker for n8n
// This script blocks all external HTTP/HTTPS calls to prevent ETIMEDOUT errors

const originalHttpRequest = require('http').request;
const originalHttpsRequest = require('https').request;

// List of allowed localhost/internal domains
const allowedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    'host.docker.internal'
];

function isAllowedHost(hostname) {
    if (!hostname) return false;
    
    // Allow localhost variants
    if (allowedHosts.includes(hostname)) return true;
    
    // Allow local network ranges
    if (hostname.match(/^10\./)) return true;
    if (hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) return true;
    if (hostname.match(/^192\.168\./)) return true;
    
    return false;
}

function blockExternalRequest(originalRequest, protocol) {
    return function(options, callback) {
        const hostname = options.hostname || options.host;
        
        if (!isAllowedHost(hostname)) {
            console.log(`[BLOCKED] ${protocol.toUpperCase()} request to ${hostname} blocked to prevent external network calls`);
            
            // Return a mock error to prevent hanging
            const error = new Error(`ECONNREFUSED: Connection refused to ${hostname} (blocked by n8n offline mode)`);
            error.code = 'ECONNREFUSED';
            
            if (callback && typeof callback === 'function') {
                process.nextTick(() => callback(error));
            }
            
            return {
                on: () => {},
                end: () => {},
                abort: () => {},
                write: () => {}
            };
        }
        
        // Allow the request for local/internal hosts
        return originalRequest.call(this, options, callback);
    };
}

// Override HTTP and HTTPS request methods
require('http').request = blockExternalRequest(originalHttpRequest, 'http');
require('https').request = blockExternalRequest(originalHttpsRequest, 'https');

console.log('[N8N OFFLINE MODE] External network calls blocked. Only localhost and internal network requests allowed.');