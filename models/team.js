const { DataTypes } = require('@sequelize/core');
const sequelize = require('../startup/db')

module.exports = sequelize.define('Team', {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rate: {
            type: DataTypes.REAL,
            allowNull: false,
            defaultValue: 0,
            validate:{
                max: 5
            }
        },
},
{
    timestamps: false,
});


/*
// sync ({alter: true}) // compare model we wanna to create with tables in db and if it aleardy exist => do nothing
// sync ({force: true}) // delete table from db if it exist and create new one
sequelize.sync({alter: true})
    .then(() => {
        console.log('Team Model Synchronized successfully ........................')
    }).catch((error) => {
        console.log(`Oobs .. Unable to Synchronized Team Model in database ........................: ${error.message}`)
    })*/

/*
// It is possible to create foreign keys:
  bar_id: {
    type: DataTypes.INTEGER,

    references: {
      // This is a reference to another model
      model: Bar,

      // This is the column name of the referenced model
      key: 'id',

      // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
      deferrable: Deferrable.INITIALLY_IMMEDIATE
      // Options:
      // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
      // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
      // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
    }
  },
  */
