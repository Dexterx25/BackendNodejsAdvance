const insertTionDatas = (data, type) => {
    let $data = {}
      for(var k in data){
       if(data[k] != null)
          $data[k] = data[k];
       }
    let $keys 
    let $values
    switch (type) {
         case 'email_register':
         case 'facebook_register':
         case 'ios_register':
         case 'insert_auth':
         $keys = Object.keys($data).toString().replace("[", "").replace("]", "");
         $values = `${Object.values($data).map(e => `'${e}'`).toString()}`
            console.log('values intoActions-->', $values)
         return  {
            keys:$keys,
            values:$values 
          };
             break;
     
         default:
             break;
     }
}
const queryDatas = (table, typequery, joins) =>{
    console.log('queryAction!', table, typequery, joins)
let query = Object.keys(typequery)
let queryValues = Object.values(typequery)
let theJoinQuery = '';
let theQuery = ''
        switch (table) {
            case 'authentications_users':
         if(joins){
             theJoinQuery = `INNER JOIN ${joins[0]} ON ${table}.${query[0]} = ${joins[0]}.${query[0]}`;
         }
             theQuery = `WHERE ${table}.${query[0]} = '${queryValues[0]}'`
             console.log('datasFilter--->', theJoinQuery,   'query-->', theQuery)
         return{
            theJoinQuery,
            theQuery
         } 
         break;
        
            default:
                break;
        }
}
const updateDatas = (data, type) =>{
    let $data = {}
      for(var k in data){
       if(data[k] != null)
          $data[k] = data[k];
       } 
       let keysAndValuesToUpdate = []
       let conditions = []
       switch (type) {
           case 'user_update':
            for (let i = 0; i < Object.keys($data).length; i++) {
                const dataKeys = Object.keys($data)[i]
                const dataValues = Object.values($data)[i]
                keysAndValuesToUpdate.push(` ${dataKeys} = ${dataValues}`)
           }
              const {id} = $data
             conditions.push(` ${Object.keys(id)} = ${Object.values(id)}`) 
                   
               return{
                keysAndValuesToUpdate:keysAndValuesToUpdate.toString().replace("[", "").replace("]", ""),
                conditions:conditions.toString().replace("[", "").replace("]", "")
               }
               break;
       
           default:
               break;
       }

}
const getData = (querys, type) => {
    let $data = {}
    for(var k in querys){
     if(querys[k] != null)
        $data[k] = querys[k];
     }
     let theQuery = []
     switch (type) {
         case 'getUser':
             for (let i = 0; i < Object.keys($data).length; i++) {
                 if(Object.keys($data).length <= 1){
                     console.log('entra aqui-->')
                     theQuery.push(`WHERE ${Object.keys($data)[i]} = '${Object.values($data)[i]}'`)
                 }
             }
         return{
            theQuery:theQuery.toString().replace("[", "").replace("]", "")
            }    
             
         default:

             break;
     }

}
module.exports = {
    insertTionDatas,
    queryDatas,
    updateDatas,
    getData
}