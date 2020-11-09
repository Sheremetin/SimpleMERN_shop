const jwt = require('jsonwebtoken')

//TODO find out why nodemon.json doesn't work
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })

module.exports = (req, res, next) => {
    try {
        console.log('___Authorization___', req.headers)
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY)
        req.userData = decoded
        next()
    } catch (error) {
        res.status(401).json({msg: 'Unauthorized wtf???'})
    }
}
