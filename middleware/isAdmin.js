const User = require('../Models/User')
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) =>{
    const token = req.header('Authorization')
    if (!token) return res.status(401).send('Access Denaied ...')
    try{
        const decoded = jwt.verify(token, process.env.JWT)
        let user = await User.findOne({where: {email: decoded.email}});
        if (!user) return res.status(401).send('Not Found User ...')
        req.user = user;
        // 403 => Forbidden
        if (req.user.isAdmin !== true) return res.status(403).send("Forbidden");
        next()
    }catch(err){
        return res.status(400).json({
            message: `Invalid Token ....${err.message}`
        })
    }
};