// import the sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
// const sequelize = new Sequelize('just_tech_news_db', 'username', 'password', {
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
// });

// module.exports = sequelize;

const sequelize = new Sequelize(process.env.DB_URL, {
    // host: 'localhost',
    dialect: 'postgres',
    // operatorsAliases: false,
    port: 5432,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;