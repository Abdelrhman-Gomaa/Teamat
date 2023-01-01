const { DataTypes } = require('@sequelize/core');
const sequelize = require('../startup/db')

const User = sequelize.define('User', {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please Emter Your Name'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN
        },
        nation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.INTEGER,
        },
        codeVerifing: {
            type: DataTypes.STRING,
            allowNull: false
        }
},
{
    timestamps: false,
});

/*sequelize.sync({alter: true})
    .then(() => {
        console.log('User Model && Relation Pick Team With Player Model Synchronized successfully ........................')
    }).catch((error) => {
        console.log(`Oobs .. Unable to Synchronized User Model in database ........................: ${error.message}`)
    })*/

module.exports = User