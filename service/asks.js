const superagent = require("superagent");
const Convert = require("./convert");

class Temp extends Convert{

    constructor() {
        super();
    }

    // get token list
    async askList(page){
        return []
    }
    //get token detail
    async askDetail(code){
        return {}
    }
    async  save(row){

        let data = {
            symbol:row['symbol'],
            name:row['name'],
            chain:row['platform']?row['platform']:row['symbol'],
            icon:row['logo'],
            tokenDecimal:18,
            coindesc:{'zh':row['coindesc']},
            whitepager:row['white_paper'],
            website:row['siteurl'],
            maxsupply:row['maxsupply'],
            totalsupply:row['totalSupply'],
            supply:row['supply'],
            onlinetime:row['online_time'],
            openprice:row['openprice'],
            explorer:row['explorer'],
            contract:'',


        }
        let contracts=row['contracts'];
        if (contracts && contracts.length>0){
            for (let contract of contracts) {
                let temp = JSON.parse(JSON.stringify(data));
                temp.contract=contract.address;
                temp.chain=contract.platform;
                await this.saveRow(temp);
            }
            return true;
        }else {
            await this.saveRow(data);
            return true;
        }

    }

    async saveRow(data){
        console.log('SaveRow => ',data.symbol)
        try {
            await MYSQL.BEEPAY('insert into tokens (symbol,name,contract,chain,icon,coindesc,whitepaper,website,maxsupply,supply,totalsupply,onlinetime,openprice,tokenDecimal,explorer) ' +
                'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [data.symbol, data.name, data.contract, data.chain, data.icon, JSON.stringify(data.coindesc), data.whitepager, data.website, data.maxsupply, data.supply, data.totalsupply, data.onlinetime, data.openprice, data.tokenDecimal,data.explorer]);
        } catch (e) {
        }
    }

    async  exec(){
        for (let i = 101; i < 200; i++) {
            await this.askList(i+1);
        }
    }

}

new Temp().exec();