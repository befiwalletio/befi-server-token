let configDev = require('./config.dev.js');
let config = configDev;
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
}

if (process.env.NODE_ENV.toLowerCase() === "production") {
    let configRel = require('./config.rel.js');
    config = Object.assign(configDev, configRel);
}

module.exports = config;