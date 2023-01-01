const {Sequelize} = require('@sequelize/core')

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {   
    host: process.env.DB_HOST,  
    dialect: 'postgres'
});
testDB(sequelize)
  
async function testDB (sequelize){
        await sequelize.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch((error => {
                console.error('Unable to connect to the database:', error);
            }))
        await sequelize.sync({alter: true})
            .then(() => {
                console.log('Models Synchronized successfully from DB ........................ ')
            }).catch((error) => {
                console.log(`Oobs .. Unable to Synchronized Models in database: ........................ ${error.message}`)
            })
}

module.exports = sequelize