module.exports = {
    server: {
        name: 'bee_token',
        port: 9002,
        debug: true,
    },
    mongo: {
        BEEPAY: {
            uri: "",
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        }
    },
    mysql: {
        BEEPAY: {
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: "123456",
            database: "beepay"
        }
    },
    redis: {
        BEEPAY: {
            host: "127.0.0.1",
            port: 6379,
            auth: ""
        }
    },
    hosts: {
        local: {
            host: 'http://127.0.0.1:9002',
            appid: '123',
            version: '1.0.0',
            description: ''
        },
        api: {
            host: 'http://127.0.0.1:9000',
            appid: '123',
            version: '1.0.0',
            description: ''
        },
        chain: {
            host: 'http://127.0.0.1:9001',
            appid: '123',
            version: '1.0.0',
            description: ''
        }
    },
    provider:{
        eth:{
            host:''
        }

    },
    redisKeys: {
        TOKENICON: "BEEPAY:TOKEN:ICON",
        NFTPRICEFLOOR:"BEEPAY:NFTPRICEFLOOR"
    },
    cryptocompareApiKey: ['']
}
