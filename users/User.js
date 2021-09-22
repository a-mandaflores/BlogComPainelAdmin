const Sequelize = require('sequelize')
const Connection = require('../database/database')

const User = Connection.define('user', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },

})



module.exports = User