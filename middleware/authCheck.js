const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const token = req.header('Authorization')
    // 401 => Unauthorized
    if (!token) return res.status(401).send('Access Denaied ...')
    try{
        const decoded = jwt.verify(token, process.env.JWT)
        req.user = decoded
        next()
    }catch(err){
        // 400 => Bad Request
        return res.status(400).json({
            message: `Invalid Token ....${err.message}`
        })
    }
};