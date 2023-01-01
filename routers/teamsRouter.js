const Team = require('../models/team')
const express = require('express')
const { Op, fn, col, literal } = require('@sequelize/core')

const authCheck = require('../middleware/authCheck')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

// Featch All Teams
router.get('/', async (req, res) => {
    const team = await Team.findAll({include: {all: true}},{
        
        order: ['name']
        //order: fn('max', col('rate'))
        //order: literal('max(rate) DESC')
        
    })
        .then(result =>{
            res.status(200).json({
                message: 'Object find Successfully',
                teams: result
            });
            console.log(result)
        }).catch((error) => {  
            console.log('error', error)
            res.status(500).json({
                error: error.message
            })
        })
})

// Featch Specific Team
router.get('/:id', async (req, res) => {
    try{
        const team = await Team.findOne({
            where: {
                id: req.params.id
            }
        })
        if(!team) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })
        else{
            res.status(200).json({
                message: 'Object find Successfully',
                teams: team
            });
            console.log(team)
        }
    }catch(error){
        console.log('error', error)
        res.status(500).json({
            error: error.message
        })
    }
})

// Add New Team
router.post('/', authCheck, async (req, res) => {
    let team = await Team.findOne({
        where: {
            [Op.and]:[
                {name: req.body.name},
                {nation: req.body.nation}
            ]
        }
    })
    console.log(team)
    if(team) return res.status(400).json({ message: `Error this '${req.body.name}' is already exist` })

    team = await Team.create({
        name: req.body.name,
        nation: req.body.nation,
        rate: req.body.rate
    }).then(result =>{
        res.status(201).json({
            message: 'Object Created Successfully',
            Busket: result
        });
        console.log(result)
    }).catch((error) => {  
        console.log('error', error)
        res.status(500).json({
            error: error.message
        })
    })
})

// Edit Specific Team
router.patch('/:id', authCheck, isAdmin, async(req, res) => {
    let team = await Team.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!team) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })

    Team.update({
        name: req.body.name,
        nation: req.body.nation,
        rate: req.body.rate
    },
    {
        where: {
            id: req.params.id
        }
    }).then(result =>{
        res.status(201).json({
            message: 'Object Updated Successfully',
            TeamUpdated: result
        });
        console.log(result)
    }).catch((error) => {  
        console.log('error: .', error)
        res.status(500).json({
            error: error.message
        })
    })
})

// Delete Specific Team
router.delete('/:id', authCheck, isAdmin, async(req, res) => {
    let team = await Team.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!team) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })

    Team.destroy({
        where: {
            id: req.params.id
        }
        // to delete All Table 
        // truncate: true
    })
    .then(result =>{
        res.status(201).json({
            message: 'Object Deleted Successfully'
        })
    }).catch((error) => {  
        console.log('error: .', error)
        res.status(500).json({
            error: error.message
        })
    })
})

module.exports = router;