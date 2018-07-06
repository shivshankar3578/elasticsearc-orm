const EventEmitter = require('events').EventEmitter;
const request = require('./util/request.js');
const config = require('./util/globalConfig.js');
const Entity = require('./src/entity.js');

function Connection(opts) {
    EventEmitter.call(this);
    const self = this;
    const entities = new Map();
    const BASE_URL = `http://${opts.domain}:${opts.port}/`;

    let testConnection = async() => {
        let body = await request({
            'url': BASE_URL
        });
        config.set('version', body.version.number);
    };

    let connect = async() => {
        await testConnection();
    };

    this.register = (name, opts, mappings, settings) => {
        if (!opts.index) {
            throw new Error("index could not be blank");
        }
        entities.set(new Entity(name, opts, mappings, settings));
        return entities.get(name);
    };


    connect().then((ret) => {
        config.set('domain', opts.domain);
        config.set('port', opts.port);
        config.set('BASE_URL', BASE_URL);
        self.emit('connected');
    }).catch((e) => {
        self.emit('error', e);
    });
};

Connection.prototype = new EventEmitter();
module.exports = (opts) => {
    if (!opts.domain || !opts.port) {
        throw new Error("opts params is invalide");
    }
    let conn = new Connection(opts);
    return conn;
}