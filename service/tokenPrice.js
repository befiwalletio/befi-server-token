const superagent = require("superagent");
const Convert = require("./convert");

class Temp extends Convert {

    constructor() {
        super();
    }

    //sleep
    sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    async getPrice() {
        let tokens = await MYSQL.BEEPAY(`select symbol from tokens`)
        let result = []
        for (let it of tokens) {
            result.push(it.symbol)
        }

        //
        while (result.length > 0) {
            let doArry = result.splice(0, 50)
            try {
                await this.doGetPrice(doArry)
            } catch (ex) {
                console.log(ex)
            }
            await this.sleep(1000)
        }
        await this.sleep(1000 * 60 * 10)
        this.getPrice()
    }

    async doGetPrice(tokens) {
        let api_key = CONFIG.cryptocompareApiKey[Math.floor(Math.random() * CONFIG.cryptocompareApiKey.length)]
        console.log(`api_key`, api_key)
        let that = this
        let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokens.join(',')}&tsyms=USDT,USD,CNY,KRW`
        superagent
            .get(url)
            .query({
                api_key: api_key
            })
            .end((err, res) => {
                if (res) {
                    console.log(res.text)
                    let data = JSON.parse(res.text);
                    that.savePrice(data)
                }
            });
    }

    async savePrice(data) {
        for (let it in data) {
            let symbol = it
            let USDPrice = data[it].USD > 0 ? data[it].USD : 0
            let CNYPrice = data[it].CNY > 0 ? data[it].CNY : 0
            let KRWPrice = data[it].KRW > 0 ? data[it].KRW : 0
            let USDTPrice = data[it].USDT > 0 ? data[it].USDT : 0
            let USDKey = `BEEPAY:PRICE:USD`
            let CNYKey = `BEEPAY:PRICE:CNY`
            let KRWKey = `BEEPAY:PRICE:KRW`
            let USDTKey = `BEEPAY:PRICE:USDT`
            REDIS.BEEPAY.hset(USDKey, symbol, USDPrice)
            REDIS.BEEPAY.hset(CNYKey, symbol, CNYPrice)
            REDIS.BEEPAY.hset(KRWKey, symbol, KRWPrice)
            REDIS.BEEPAY.hset(USDTKey, symbol, USDTPrice)
        }
    }

    async exec() {
        this.getPrice()
    }

}

new Temp().exec();
