async function insertMYSQL(){

}

async function upsertMYSQL(){

}

async function getMYSQL(){

}

async function listMYSQL(){

}

async function filterMYSQL(){

}

async function queryMYSQL(connection){
    let joinQuery = '';
    
    if (join) {
        const key = Object.keys(join)[0];
        const val = join[key];
        joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`;
    }

    connection.query(`SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`, query, (err, res) => {
        if (err) return reject(err);
        resolve(res[0] || null);
    })
}

async function updateMYSQL(){
    
}

module.exports ={
    upsertMYSQL,
    insertMYSQL, 
    getMYSQL,
    listMYSQL, 
    filterMYSQL, 
    queryMYSQL, 
    updateMYSQL
}