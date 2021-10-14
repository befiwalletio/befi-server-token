const superagent = require("superagent");
const Convert = require("./convert");

class Temp extends Convert {

    constructor() {
        super();
    }
    sleep(time = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    async getIcon() {
        let tokens = await MYSQL.BEEPAY(`select symbol,icon,contractAddress from tokens`)
        for (let it of tokens) {
          await REDIS.BEEPAY.hset(CONFIG.redisKeys.TOKENICON,`${it.symbol}:${it.contractAddress.toLowerCase()}`,it.icon)
        }
        await this.sleep(1000 * 60 * 10)
    }
    async exec() {
        this.getIcon()
    }
}

new Temp().exec();
