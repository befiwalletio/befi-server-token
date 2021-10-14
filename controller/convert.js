class Page{

    constructor(option={page:1,size:100}) {
        option = JSON.parse(JSON.stringify(option));
        this.params = option;
        this.page = this.params?this.params.page:1;
        this.size = this.params?this.params.size:100;
        this.offset = 0;
        this.sql='';
    }

    test(){
        if (isNaN(this.page)) {
            this.page = 1;
        }
        if (this.page<=0){
            this.page=1;
        }
        this.page=this.page-1;
        if (isNaN(this.size) || this.size < 10 || this.size > 100) {
            this.size = 100;
        }
        this.offset = this.page * this.size;
        this.sql = ` limit ${this.size} offset ${this.offset} `;
        return this;
    }

}
class Convert {

    constructor(prefix, whiteList = []) {
        this.whiteList = whiteList;
        this.prefix = prefix;
        this.route = this.route.bind(this);
        this.email = '';
    }

    async assertParams(params, keys = []) {
        for (let key of keys) {
            if (!params[key]) {
                await this.error(801);
                break
            }
        }
    }


    page(params) {
        return new Page(params).test();
    }

    error(code = 20001, message = '',language='zh') {
        if (!String.isEmpty(this.req.params.language)){
            language = this.req.params.language;
        }
        throw new NetException(code, message,language);
    }

    route(req, res) {
        let path = req.path;
        let method = '';
        if (String.isNotEmpty(this.prefix)) {
            if (!this.prefix.endsWith('/')) {
                this.prefix += '/';
            }
            path = path.replace(this.prefix, '');
            path = path.split('/');
            method = path[0];
            for (let i = 0; i < path.length; i++) {
                if (i > 0) {
                    let value = path[i];
                    method += (value.charAt(0).toUpperCase() + value.slice(1))
                }
            }
        } else {
            path = path.split('/');
            method = path[path.length - 1];
        }
        let params = {};
        params = Object.assign(params, req.query);
        params = Object.assign(params, req.body);
        params = Object.assign(params, req.DEVICE);
        req.params=params;
        (async () => {
            this.req = req;
            this.res = res;
            try {
                let fullMethod = "action_"+method;
                if (!this[fullMethod]) {
                    await this.error(20001);
                    return;
                }
                let result = await this[fullMethod](params, req, res);
                return res.callback(result);
            } catch (e) {
                if (e instanceof NetException) {
                    return res.callback(e['code'], e['message']);
                } else {
                    console.log(e)
                    return res.callback(20001, 'server error -1 '+e);
                }
            }
        })();
    }
}

module.exports = Convert;