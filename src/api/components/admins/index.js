const config = require('../../../../config/index');
let store, cache;
if (config.remoteDB === true) {
    store = require('../../../store/remote-postgres');
    cache = require('../../../store/remote-cache');
} else {
    store = require('../../../store/postgres');
    cache = require('../../../store/redis');
}

const ctrl = require('./controller');


module.exports = ctrl(store, cache);