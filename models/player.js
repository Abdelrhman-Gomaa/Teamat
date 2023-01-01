const { DataTypes } = require('@sequelize/core');
const sequelize = require('../startup/db');
const Team = require('./team');
const User = require('./User')

const Player = sequelize.define('Player', {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        power: {
            type: DataTypes.REAL,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 50,
                max: 99
            }
        },
        nation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isIn: [['GK', 'SW', 'CB', 'RB', 'LB', 'CDM', 'CAM', 'CM', 'RWB', 'LWB', 'RW', 'LW', 'CF', 'SS']]
            }
        },
        salary: {
            type: DataTypes.REAL,
            allowNull: false,
            defaultValue: 0
        },
        pac : {   
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 99
            }
        },
        sho : {   
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 99
            }
        },
        pas : {   
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 99
            }
        },
        dri : {   
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 99
            }
        },
        def : {   
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 99
            }
        },
        phy : {   
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 99
            }
        }
},
{
    timestamps: false,
});

Team.hasMany(Player)
Player.belongsTo(Team)

User.hasMany(Player)
Player.belongsTo(User)

/*sequelize.sync({alter: true})
    .then(() => {
        console.log('Player Model && relation with Team Model Synchronized successfully ........................')
    }).catch((error) => {
        console.log(`Oobs .. Unable to Synchronized Player Model in database ........................: ${error.message}`)
    })*/

module.exports = Player
