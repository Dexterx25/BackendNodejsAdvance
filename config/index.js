const { host } = require("pg/lib/defaults")

const config = {
    remoteDB: process.env.REMOTE_DB || false,

    api:{
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        publicRoute: process.env.PUBLIC_ROUTE || 'app'
        },

    OneSignal:{
        key_api:process.env.KEY_API_OneSignal,
        app_id:process.env.app_id_OneSignal
        },
        jwt:{
            secret: process.env.JWT_SECRET ||  'SECRETOINCRIPTACIONDEVELOP'
            //redis password: confirmapp-redisserverpjr110971asr1243cbv
            //changed for this: q6mUvhd8y7539z+yMGFnQetknyTPhmQvlgaIwrxDjKojljEjNhKQY72Tpmc2PyD02VbamA7B2GcPtyDar
        },
    /// bussines MicroServices: 
    MSV_Postgress:{
       port: process.env.PSQL_PORT || 3001,
       host: process.env.PSQL_HOST || 'localhost'
    },
    MSV_Mysql:{
        port: process.env.MYSQL_PORT || 3002,
        host: process.env.MYSQL_HOST || 'localhost'
     },
    ///---> microservices Utils:
    notificationsService:{
        host: process.env.NOTIFICATIONS_SRV_HOST || 'localhost',
        port: process.env.NOTIFICATIONS_SRV_PORT || 4000,  
    },
    devicesService:{
        host: process.env.DEVICES_SRV_HOST || 'localhost',
        port: process.env.DEVICES_SRV_PORT || 5000
    },
    cacheService:{
        host: process.env.CACHE_SRV_HOST || 'localhost',
        port: process.env.CACHE_SRV_PORT || 3003
        },
    redis:{
            host: process.env.REDIS_SRV_HOST || '127.0.0.1',
            port: process.env.REDIS_SRV_PORT || 6379,
           //pasword: process.env.REDIS_SRV_PORT  || 'q6mUvhd8y7539z+yMGFnQetknyTPhmQvlgaIwrxDjKojljEjNhKQY72Tpmc2PyD02VbamA7B2GcPtyDar'
        },
        DBconfigPSQL:{
            user: process.env.DB_USER_PSQL || 'developuser',
           // password:process.env.DB_PASS_PSQL || '',
            host: process.env.DB_HOST_PSQL || 'localhost',
            database:process.env.DB_NAME || 'developdbpsql'
        },
    
        DBconfigMYSQL:{
            user: process.env.DB_USER_MYSQL || 'developuser',
            password:process.env.DB_PASS_MYSQL || 'developPass',
            host: process.env.DB_HOST_MYSQL || 'localhost',
            database:process.env.DB_NAME || 'developDBmysql',
         //   socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
       //     port: '8889'
       port:"80"
        },
        cacheService: {
            host: process.env.MYSQL_SRV_HOST || 'localhost',
            port: process.env.MYSQL_SRV_PORT || 3004,
        },
        // redis: {
        //     host: process.env.REDIS_HOST || 'localhost',
        //     port: process.env.REDIS_PORT || 13556,
        //     password: process.env.REDIS_PASS || '9sWIItAvlPbkoTcwOXstNm9hDFv7AU2F',
        // },
        EmailService:{
            NewUserInvitation:{
        //host:"smtp.ethereal.email",
                host:"smtp.gmail.com",
                port:465,
                secure:true,
               auth:{
                 //  user:"jillian.zieme@ethereal.email",
                 user:"confirmapphw@gmail.com",  
                // password:"YhsaV5pEyFUXeuKBJC"
                password:"uexfxodrnoonxofd"
                }
            }
        }

}

module.exports = config