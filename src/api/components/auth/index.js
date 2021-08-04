const store = require('../../../store/postgres')
const controller = require('./controller')

module.exports = controller(store);