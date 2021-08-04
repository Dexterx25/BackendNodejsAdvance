const redis = require('redis');

//redis.createClient();

const config = require('../../config/index');

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
  //  password: config.redis.password,
});
function list(table) {
    return new Promise((resolve, reject) => {
        client.get(table, (err, data) => {
            if (err) return reject(err);

            let res = data || null;
            if (data) {
                console.log('dataaaaaa cache list-->', data)
                res = JSON.parse(data);
            }
            resolve(res);
        });
    });
}

function get(id, table) {
    console.log('entra get Redis')
    return list(table + '_' + id);
}

async function upsert(data, table) {
    let key = table;
    if (data && data.id) {
        key = key + '_' + data.id;
    }
    console.log('dataaaaaa cache upsert-->', data)

    client.setex(key, 10, JSON.stringify(data));
    return true;
}

module.exports = {
    list,
    get,
    upsert,
};