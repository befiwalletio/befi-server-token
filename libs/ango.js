const request = require('request');


class Ango {

    constructor(option = {}) {
        this.host = option['host'];
        option = JSON.parse(JSON.stringify(option));
        delete option['host'];
        this.language = 'en';
        for (let key in option) {
            this[key] = option[key];
        }
        delete option['description'];
        this.headers = Object.assign(
            {'Content-Type': 'application/json', language: this.language,},
            option)
    }

    _matchOptions(url, params = {}, headers = {}) {
        let headersT = Object.assign(this.headers, headers);
        params['appId']=headersT['appId'];
        let obj = {
            headers: headersT,
            url: this.host + url,
            form: params,
            json: true,
            timeout: 10000
        };
        return obj;
    }

    post(url, params = {}) {
        let config = this._matchOptions(url, params);
        config['method'] = 'POST';
        return new Promise(resolve => {
            request.post(config, (err, httpResponse, body) => {
                console.log(' \n' + `========= Ango Post Result ========`.yellow);
                console.log(`>> PATH   : ${url}`);
                console.log(`>> PARAMS : ${JSON.stringify(params)}`);
                console.log(`>> HEADER : ${JSON.stringify(config['headers'])}`);
                if (err){
                    console.log(`>> ERROR  : `.red, err);
                } else {
                    console.log(`>> Body   : `, body);
                }
                console.log(`************************************`);
                if (err) {
                    resolve(null);
                }
                // let result = Ango.default.resultParse(body);
                resolve(body);
            })
        });
    }

    get(url, params = {}) {
        let config = this._matchOptions(url, params);
        config['method'] = 'GET';
        return new Promise(resolve => {
            console.debug(' \n' + `========= Ango Get Request ========`.blue);
            console.debug(`>> PATH   : ${url}`);
            console.debug(`>> PARAMS : ${JSON.stringify(params)}`);
            console.debug(`************************************`);
            request.get(config, (err, httpResponse, body) => {
                console.log(' \n' + `========= Ango Post Result ========`.yellow);
                console.log(`>> PATH   : ${url}`);
                console.log(`>> PARAMS : ${JSON.stringify(params)}`);
                console.log(`>> HEADER : ${JSON.stringify(config['headers'])}`);
                if (err){
                    console.log(`>> ERROR  : `.red, err);
                } else {
                    // console.log(`>> Body   : `, body);
                }
                console.log(`************************************`);
                resolve(body);
            })
        });
    }
}

module.exports = Ango;
