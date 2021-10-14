// const Rules = {};
const Rules = require('require-all')({
    dirname: __dirname + '/',
    filter:/^((?!index|convert)).*$/,
    resolve:(controller)=>{
        return controller
    }
});

class Route {

    constructor(app) {
        this.app = app;
        this.init=this.init.bind(this);
        this.rules = this.rules.bind(this);
        this._matchRules = this._matchRules.bind(this);
    }

    init(){
        this.rules();
    }

    rules() {
        this._matchRules();
    }

    _matchRules() {
        let keys = Object.keys(Rules);
        for (let key of keys) {
            if (String.isNotEmpty(Rules[key].prefix)) {
                let prefix = Rules[key].prefix;
                if (!Rules[key].prefix.endsWith('/')) {
                    prefix += '/';
                }
                this.app.post(Rules[key].prefix + '/*', Rules[key].route);
                if (CONFIG['server']['debug']) {
                    this.app.get(Rules[key].prefix + '/*', Rules[key].route);
                }
            }
        }
    }
}
module.exports = Route;
