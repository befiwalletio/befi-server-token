global.CONFIG = require('../config');
const exceptions = require('../config/excetions');

class NetException extends Error {
    constructor(code, message = "", language = 'zh') {
        let exception = exceptions[code + ''];
        if (exception) {
            if (String.isEmpty(message)) {
                message = exception[language];
            }
        }
        console.log(exception);
        super(message);
        this.code = code;
        this.message = message;
        this.language = language;
    }
}
function installAngo(){
    const ango = require('../libs/ango');
    global.Ango = ango;
    if (!global.HOSTS){
        global.HOSTS={};
    }
    const hosts = CONFIG.hosts;
    if (hosts){
        for (const host in hosts) {
            global.HOSTS[host.toUpperCase()]=function (){
                return new Ango(hosts[host]);
            }
        }
    }

}
function installException(){
    global.NetException = NetException;
}
function installMongo(){
    function createMongo(name,config){
        const mongoose = require('mongoose');
        mongoose.connect(config.uri, config.options);
        mongoose.set('debug', CONFIG.debug);
        if(!global['MONGO'] ){
            global['MONGO']={};
        }
        global['MONGO'][name.toUpperCase()] = mongoose;
    }

    let mongos = CONFIG['mongo'];
    if (mongos) {
        for (let key in mongos){
            let value = mongos[key];
            if (value){
                createMongo(key,value);
            }
        }
    }

}
function installMysql(){
    const mysql = require('mysql');
    const rds = require('ali-rds');
    const poolextend = function (target, source, flag) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                flag ? (target[key] = source[key]) : (target[key] === void 0 && (target[key] = source[key]));
            }
        }
        return target;
    }
    function createMysql(name, config) {
        let dbname = name.toUpperCase();
        let pool = mysql.createPool(poolextend({}, config));
        if (!global['MYSQL']) {
            global['MYSQL'] = {};
        }
        global['MYSQL'][dbname+"RDS"] =  function (transactions=false){
            console.log(`config`,config)
            return rds(config);
        };
        global['MYSQL'][dbname] = function (sql, params, log = false, extra = {}) {
            return new Promise(resolve => {
                pool.getConnection((err, conn) => {
                    if (err) {
                        console.log("MYSQL_" + dbname + "(01)", err)
                        resolve(null);
                    } else {
                        let callback = (err, replay) => {
                            if (err) {
                                console.log("MYSQL_" + dbname + "(02)", err)
                                resolve(null);
                                return
                            }
                            resolve(replay);
                        };
                        if (params) {
                            conn.query(sql, params, callback);
                        } else {
                            conn.query(sql, [], callback);
                        }
                        conn.release();
                    }
                });
            });
        }
        global['MYSQL'][dbname + "_ONE"] = function (sql, params, log = false, extra = {}) {
            // console.log(new Date(), sql, params, extra)
            return new Promise(async (resolve) => {
                let items = await global['MYSQL'][dbname](sql, params, log, extra);
                if (items) {
                    resolve(items[0]);
                    return
                }
                resolve(null);
            });
        }
        global['MYSQL'][dbname + "_COUNT"] = function (TABLE, WHERE, log = false, extra = {}) {
            let sql = `select count(*) as total from ${TABLE}`;
            if (!String.isEmpty(WHERE)) {
                sql = `${sql} ${WHERE}`;
            }
            // console.log(new Date(), {TABLE, WHERE})
            return new Promise(resolve => {
                pool.getConnection((err, conn) => {
                    if (err) {
                        console.log("MYSQL_" + dbname + "_COUNT(01)", err)
                        resolve(0);
                    } else {
                        conn.query(sql, [], (err, replay) => {
                            if (err) {
                                console.log("MYSQL_" + dbname + "_COUNT(02)", err)
                                resolve(0);
                                return
                            }
                            let total = replay[0]['total'];
                            resolve(total);
                        });
                        conn.release();
                    }
                });
            });

        }
        global['MYSQL'][dbname + "_TRANS"] = function (sqls, log = false, extra = {}) {
            // console.log(new Date(), sqls, extra)
            return new Promise(resolve => {
                pool.getConnection(async (err, conn) => {
                    if (err) {
                        console.log("MYSQL_" + dbname + "_TRANS(01)", err)
                        resolve(null);
                    } else {
                        try {
                            await conn.beginTransaction();
                            for (let sql of sqls) {
                                conn.query(sql.sql, sql.params);
                            }
                            await conn.commit();
                            conn.release();
                            return resolve(true);
                        } catch (e) {
                            console.log("MYSQL_" + dbname + "_TRANS(02)", err)
                            await conn.rollback();
                            return resolve(false);
                        }
                    }
                });
            });
        }
    }

    let mysqls = CONFIG['mysql'];
    if (mysqls) {
        for (let key in mysqls) {
            let value = mysqls[key];
            if (value) {
                createMysql(key, value);
            }
        }
    }
}
function installRedis(){
    function createRedis(name,config) {
        // console.log(name,config)
        let bluebird = require('bluebird');
        let redis = require("redis");
        function retryStrategy(options){
            if (options.error && options.error.code === 'ECONNREFUSED') {
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                return undefined;
            }
            return Math.min(options.attempt * 100, 3000);
        }
        if (!global['REDIS']){
            global['REDIS']={};
        }
        let client = redis.createClient(config);
        if(config.auth) client.auth(config.auth);

        client.on('ready', function () {
            console.log(`Redis client [${name.toLocaleUpperCase()}]: ready`);
        });

        client.on('connect', function () {
            console.log(new Date(), `Redis [${name.toLocaleUpperCase()}] is now connected!`);
        });

        client.on('reconnecting', function () {
            console.log(new Date(), `Redis [${name.toLocaleUpperCase()}] reconnecting`, arguments);
            createRedis(name,config)
        });

        client.on('end', function () {
            console.log(`Redis [${name.toLocaleUpperCase()}] Closed!`);
        });

        client.on('warning', function () {
            console.log(`Redis client [${name.toLocaleUpperCase()}]: warning`, arguments);
        });

        client.on('error', function (err) {
            console.error(`Redis Error [${name.toLocaleUpperCase()}]` + err);
            client.connection_gone("manual",err);
        });
        global['REDIS'][`${name.toLocaleUpperCase()}`]=client;
        // config['retry_strategy']=retryStrategy;
        // console.log(`Create Redis Client: ${name.toLocaleUpperCase()}(${config.host})`);
        bluebird.promisifyAll(redis.RedisClient.prototype);
        bluebird.promisifyAll(redis.Multi.prototype);
    }
    let redises = CONFIG['redis'];
    if (redises) {
        for (let key in redises){
            let value = redises[key];
            if (value){
                createRedis(key,value);
            }
        }
    }
}

installException();
installAngo();
installRedis();
installMongo();
installMysql();


