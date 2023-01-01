const Player = require('../models/player');
const Team = require('../models/team')
const express = require('express')
const authCheck = require('../middleware/authCheck')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

// Featch All Teams
router.get('/', async (req, res) => {
    const player = await Player.findAll({include: {all: true}},{
        order: ['name']
        //order: fn('max', col('rate'))
        //order: literal('max(rate) DESC')
    })
        .then(result =>{
            res.status(200).json({
                message: 'Object find Successfully',
                player: result
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
        const player = await Player.findOne({
            where: {
                id: req.params.id
            },
            include: Team
        })
        if(!player) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })
        else{
            res.status(200).json({
                message: 'Object find Successfully',
                player: player
            });
            console.log(player)
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
    let player = await Player.findOne({
        where: {name: req.body.name}
    })
    console.log(player)
    if(player) return res.status(400).json({ message: `Error this '${req.body.name}' is already exist` })

    player = await Player.create({
        name: req.body.name,
        power: req.body.power,
        nation: req.body.nation,
        position: req.body.position,
        salary: req.body.salary,
        pac: req.body.pac,
        sho: req.body.sho,
        pas: req.body.pas,
        dri: req.body.dri,
        def: req.body.def,
        phy: req.body.phy,
        TeamId: req.body.TeamId,
       UserId: req.body.UserId,
    }).then(result =>{
        res.status(201).json({
            message: 'Object Created Successfully',
            player: result
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
    let player = await Player.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!player) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })

    player.update({
        name: req.body.name,
        rate: req.body.rate,
        nation: req.body.nation,
        position: req.body.position,
        salary: req.body.salary,
        TeamId: req.body.TeamId,
    },
    {
        where: {
            id: req.params.id
        }
    }).then(result =>{
        res.status(201).json({
            message: 'Object Updated Successfully',
            PlayerUpdated: result
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
    let player = await Player.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!player) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })

    player.destroy({
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

module.exports = router