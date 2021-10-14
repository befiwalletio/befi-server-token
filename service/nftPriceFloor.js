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
        console.log(`start nft price floor 2 redis`)
        this.doGetPrice()
        console.log(`end nft price floor 2 redis`)
        await this.sleep(1000 * 60 * 10)
        this.getPrice()
    }

    async doGetPrice() {
        let that = this
        let url = `https://api.nft.gold.upc.edu/nfts`
        superagent
            .get(url)
            .end((err, res) => {
                if (res) {
                    console.log(`nft price floor`,res.text)
                    let data = JSON.parse(res.text);
                    that.savePrice(data)
                }
            });
    }

    async savePrice(data) {
        for (let it of data) {
            console.log(CONFIG.redisKeys.NFTPRICEFLOOR,it.slug,it.floorPriceETH)
           await REDIS.BEEPAY.hset(CONFIG.redisKeys.NFTPRICEFLOOR, it.slug, JSON.stringify(it))
        }
    }

    async exec() {
        this.getPrice()
    }

}

new Temp().exec();
