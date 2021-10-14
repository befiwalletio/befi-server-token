const Convert = require('./convert')
const Decimal = require('../core/mathutil')

class Temp extends Convert{

    constructor() {
        super("/chain");
    }

    async action_test(params){
        console.log("action_test",params)

        return{result:true};
    }

    async action_price(params){
        await this.assertParams(params,['coin','exCoin'])
        let exCoin = params.exCoin.toUpperCase();
        let coins=[params.coin];
        if (params.coin.indexOf(',')>=0){
            coins=params.coin.split(',');
        }
        let result = []
        for (let item of coins) {
            item = item.toUpperCase();
            let price = await this._get_price(item,exCoin);
            if (price){
                result.push({
                    coin:item,
                    exCoin:exCoin,
                    price:price.toString()
                });
            }

        }

        return {items:result}
    }
    async _get_price(coin,exCoin){
        let result = await REDIS.BEEPAY.hgetAsync(`BEEPAY:PRICE:${exCoin.toUpperCase()}`,coin.toUpperCase());
        return new Decimal(result).toString();
    }
}


module.exports = new Temp();
