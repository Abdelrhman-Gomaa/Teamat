const express = require('express')
const teams = require('../routers/teamsRouter')
const players = require('../routers/playersRouter')
const user = require('../routers/usersRouter')
const {serverErrorHandler, errorHandler} = require('../middleware/errors')

module.exports = function (app) {
    app.use(express.json());
    app.use('/team', teams)
    app.use('/player', players)
    app.use('/', user)
    app.use(serverErrorHandler)
    app.use(errorHandler)
}