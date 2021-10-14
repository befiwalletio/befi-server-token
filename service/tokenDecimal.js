const superagent = require("superagent");
const Convert = require("./convert");
let Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.provider.eth.host));
const tokenAbi = require('./token_abi.json');

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

    async getDecimal() {
        let tokens = await MYSQL.BEEPAY(`select symbol,contract from tokens where chain="ETH" and contract <> ''`)
        // let tokens = await MYSQL.BEEPAY(`select symbol,contract from tokens where chain="ETH" and contract <> '' and tokenDecimal = -1`)
        for (let it of tokens) {
            try {
                let contract = new web3.eth.Contract(tokenAbi, it.contract)
                contract.methods.decimals().call(function (err, dec) {
                    if(!dec || dec == undefined || dec == 'undefined'){
                        console.log(it.contract,dec)
                    }
                    MYSQL.BEEPAY(`update tokens set tokenDecimal = ${dec} where contract = "${it.contract}"`)
                })
            } catch (ex) {
                console.log(ex)
            }
        }

    }

    async exec() {
        this.getDecimal()
    }

}

new Temp().exec();
