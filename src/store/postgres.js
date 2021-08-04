const chalk = require('chalk')
const {pool} = require('./db')
const {nanoid} = require('nanoid')
const bcrypt = require('bcrypt')
const { bgRed } = require('chalk')
const request = require('request')
const { I18n } = require('i18n')
const moment = require('moment')
const {insertTionDatas, queryDatas, updateDatas, listDatas, getData} = require('../utils/actions/postgres/index')
const {handleSuccessResponse, handleFatalError} = require('../utils/responses/customRespon')
const config = require('../../config/index');

let procedence = '[STORE - POSTGRES]'

function list(table) {
    console.log('listing--->', table)
    return new Promise( (resolve, reject) => {
        pool.query(`SELECT * FROM ${table} `, (err, result) => {
            if (err) return reject(err);
            console.log('resut--->', result.rows)
            resolve(result.rows);
        })
    })
}

function get({type, querys},table) {
    return new Promise(async(resolve, reject) => {
        const {theQuery} = await getData(querys, type)
        console.log('TheQuery--->', theQuery, 'tableee--->', table)
        pool.query(`SELECT * FROM ${table} ${theQuery}`, (err, result) => {
            if(err){
                console.log('error Get--->',err.stack)
                reject(err)
              }else{
                console.log(chalk.redBright(`succefull ${type}!`),result.rows[0])
                resolve(result.rows[0]);
             }
        })
    })
}

async function insert(table, {data, type}) {
    console.warn('datas to insert --->', data, type, table)
     return new Promise(async(resolve, reject) => {
          const {keys, values} = await insertTionDatas(data, type)
          console.log('keys-->', keys, 'values--->', values)
         pool.query(`INSERT INTO ${table}(${keys}) values(${values}) RETURNING *`, (err, result) => {
            if (err) {
                console.log('error Insert--->',err.stack)
              } else {
                console.log(chalk.redBright(`succefull ${type}!`),result.rows[0])
                resolve(result.rows[0]);
              }
         })
     })
}

function update(table, {data, type}) {
    return new Promise(async(resolve, reject) => {
        const {keysAndValuesToUpdate, conditions} = await updateDatas(data, type)

        pool.query(`UPDATE ${table} SET ${keysAndValuesToUpdate} ${conditions} RETURNING *`, (err, result) => {
            if(err){
                console.log('error Update--->',err.stack)
                reject(err)
              }else{
                console.log(chalk.redBright(`succefull ${type}!`),result.rows[0])
                resolve(result.rows[0]);
             }
        })
    })
}

function upsert(table, data) {
    console.warn('datas upsert--->', data)
    if (data && data.id) {
        return update(table, data);
    } else {
        return insert(table, data);
    }
}

async function query(table, typequery, joins) {
    console.log(chalk.redBright('comming to query--->'), table, typequery, joins)
      let joinQuery = '';
      let query = ''
       if (joins.length) {
        const {theJoinQuery, theQuery} = await queryDatas(table, typequery, joins)
        joinQuery = theJoinQuery
        query = theQuery
      }else{
        const {theQuery} = await queryDatas(table, typequery, null)
        query = theQuery
      }
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${table} ${joinQuery}  ${query}`, (err, res) => {
            if (err) return reject(err);
            console.log('xdd-->', res.rows[0])
            resolve(res.rows[0]);
        })
    })
}

module.exports = {
    list,
    get,
    upsert,
    query
};