require('./core');

const express = require('nanoexpress');
const bodyParser = require('@nanoexpress/middleware-body-parser/cjs');

const session = require('express-session');
const app = express();

app.use(bodyParser());

app.use(session({
    secret: '12345',
    cookie: {
        secure:true,
        maxAge: 10000 },
    saveUninitialized: true,
    resave: false,
}));

app.use( function(req, res, next) {
    res.callback = (code, msg, data) => {
        let result = {};
        if (msg == null&& data==null
            && (typeof code === 'object')){
            if (code && code.hasOwnProperty('code')){
                result = code;
            } else {
                result = {'code': 0, 'msg': '', 'data': code};
            }
        } else {
            result = {'code': code || 0, 'msg': msg || '', 'data': data == null?{}:data};
        }
        if (process.env.NODE_ENV === 'test'){
            result['params']=req.params;
        }
        res.json(result);
    };
    let cookies = req.headers['cookie'] || req.headers['Cookie'];
    cookies = String.map(cookies, ';', '=');
    req.DEVICE = cookies;
    if (next){
        next();
    }
});
const Controller = require('./controller');
new Controller(app).init();

process.setMaxListeners(0);
app.listen(CONFIG.server.port).then(()=>{
        let message =
`--------------------------------
      HTTP Server listening
      ${CONFIG.server.name}
      on port  ${CONFIG.server.port}
      on debug ${CONFIG.server.debug}
--------------------------------`;
    console.log(message);
});
