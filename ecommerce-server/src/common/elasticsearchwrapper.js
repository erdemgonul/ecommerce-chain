const AWS = require('aws-sdk');

/*
Sample Usage:
    const resp = await elasticInstance.Search({
        query: {
            match: { FirstName: 'Kursat' }
        }
    })
*/
module.exports = class ElasticSearchWrapper {
    constructor(region, domain, index, type, authEnabled, authUsername, authPassword) {
        this.region = region;
        this.domain = domain;
        this.index = index;
        this.type = type;
        this.authEnabled = authEnabled;
        this.authUsername = authUsername;
        this.authPassword = authPassword;
    }

    /***
     * Executes given query on elastic search
     *
     * @param payload JSON query payload.
     */
    Search(payload) {
        return new Promise((resolve, reject) => {
            const endpoint = new AWS.Endpoint(this.domain);
            const request = new AWS.HttpRequest(endpoint, this.region);

            if (this.authEnabled) {
                request.headers['authorization'] = "Basic " + new Buffer(this.authUsername + ":" + this.authPassword).toString("base64");
            }

            request.method = 'POST';
            request.path += `${this.index}/${this.type}/_search`;
            request.headers['host'] = this.domain;
            request.headers['Content-Type'] = 'application/json';
            request.body = JSON.stringify(payload);

            // Content-Length is only needed for DELETE requests that include a request
            // body, but including it for all requests doesn't seem to hurt anything.

            request.headers['Content-Length'] = Buffer.byteLength(request.body);

            const client = new AWS.HttpClient();

            client.handleRequest(request, null, function (response) {
                    if (response && response.statusCode !== 200) {
                        reject(response.statusMessage);
                    } else {
                        let responseBody = '';

                        response.on('data', function (chunk) {
                            responseBody += chunk;
                        });

                        response.on('end', function () {
                            let retval = [];

                            if (responseBody) {
                                responseBody = JSON.parse(responseBody);

                                if (responseBody && responseBody.hits && responseBody.hits.hits) {

                                    for (const property in responseBody.hits.hits) {
                                        let row = responseBody.hits.hits[property];

                                        retval.push(row._source);
                                    }
                                }
                            }

                            resolve(retval);
                        });
                    }
                },
                function (error) {
                    reject(error);
                }
            );
        });
    };

    /***
     * Inserts a new search item into elastic search
     *
     * @param document
     * @param id
     * @param callback
     */
    AddNewDocument(document, id) {
        return new Promise((resolve, reject) => {
            const endpoint = new AWS.Endpoint(this.domain);
            const request = new AWS.HttpRequest(endpoint, this.region);

            if (this.authEnabled) {
                request.headers['authorization'] = "Basic " + new Buffer(this.authUsername + ":" + this.authPassword).toString("base64");
            }

            request.method = 'PUT';
            request.path += `${this.index}/${this.type}/${id}`;
            request.headers['host'] = this.domain;
            request.headers['Content-Type'] = 'application/json';
            request.body = JSON.stringify(document);

            // Content-Length is only needed for DELETE requests that include a request
            // body, but including it for all requests doesn't seem to hurt anything.

            request.headers['Content-Length'] = Buffer.byteLength(request.body);

            const client = new AWS.HttpClient();

            client.handleRequest(request, null, function (response) {
                    if (response && (response.statusCode !== 201 && response.statusCode !== 200)) {
                        reject(response.statusMessage);
                    } else {
                        let responseBody = '';

                        response.on('data', function (chunk) {
                            responseBody += chunk;
                        });

                        response.on('end', function () {
                            resolve(JSON.parse(responseBody));
                        });
                    }
                },
                function (error) {
                    reject(error);
                }
            );
        });
    };

    /***
     * Deletes an item from elastic search
     *
     * @param id
     * @param callback
     */
    DeleteDocument(id) {
        return new Promise((resolve, reject) => {
            const endpoint = new AWS.Endpoint(this.domain);
            const request = new AWS.HttpRequest(endpoint, this.region);

            if (this.authEnabled) {
                request.headers['authorization'] = "Basic " + new Buffer(this.authUsername + ":" + this.authPassword).toString("base64");
            }

            request.method = 'DELETE';
            request.path += `${this.index}/${this.type}/${id}`;
            request.headers['host'] = this.domain;
            request.headers['Content-Type'] = 'application/json';

            // Content-Length is only needed for DELETE requests that include a request
            // body, but including it for all requests doesn't seem to hurt anything.

            request.headers['Content-Length'] = Buffer.byteLength(request.body);

            const client = new AWS.HttpClient();

            client.handleRequest(request, null, function (response) {
                    if (response && response.statusCode !== 200) {
                        reject(response.statusMessage);
                    } else {
                        let responseBody = '';

                        response.on('data', function (chunk) {
                            responseBody += chunk;
                        });

                        response.on('end', function () {
                            resolve(JSON.parse(responseBody));
                        });
                    }
                },
                function (error) {
                    reject(error);
                }
            );
        });
    };
};
