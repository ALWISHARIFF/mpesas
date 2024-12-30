import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { parse } from 'url';

export class HttpService {
    constructor(config) {
        const { baseURL, headers = {} } = config;
        this.uri = parse(baseURL);
        this.headers = headers;
    }

    async request(method, path, data = '', headers = {}) {
        const request = this.uri.protocol === 'https:' ? httpsRequest : httpRequest;

        return new Promise((resolve, reject) => {
            const options = {
                protocol: this.uri.protocol,
                hostname: this.uri.hostname,
                path,
                method,
                headers: { ...this.headers, ...headers },
            };

            const clientRequest = request(options, (response) => {
                const { headers, statusCode, statusMessage } = response;
                let dataChunks = '';

                response.on('data', (chunk) => {
                    dataChunks += chunk;
                });

                response.on('end', () => {
                    let responseData;
                    try {
                        responseData = JSON.parse(dataChunks);
                    } catch {
                        responseData = dataChunks;
                    }

                    const result = {
                        protocol: this.uri.protocol,
                        hostname: this.uri.hostname,
                        path,
                        method,
                        headers: headers,
                        statusCode: statusCode ?? null,
                        statusMessage: statusMessage ?? null,
                        data: responseData,
                    };

                    if (statusCode >= 200 && statusCode < 300) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                });
            });

            clientRequest.on('error', reject);

            if (data) {
                clientRequest.write(data);
            }

            clientRequest.end();
        });
    }

    async get(path, options = {}) {
        return this.request('GET', path, '', options.headers);
    }

    async post(path, payload, options = {}) {
        const data = JSON.stringify(payload);
        const headers = { 'Content-Type': 'application/json', 'Content-Length': data.length, ...options.headers };
        return this.request('POST', path, data, headers);
    }
}
