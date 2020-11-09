const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//TODO find out why nodemon.json doesn't work
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })

console.log('ENV', process.env.JWT_KEY)

const User = require('../models/user')

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 1) {
                return res.status(409).send('User already exist')
            }
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err, msg: 'problem with encryption' })
                }
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                })
                user.save()
                    .then(result => {
                        const token = jwt.sign({
                                email: result.email,
                                userId: result._id,
                            },
                            process.env.JWT_KEY,
                            { expiresIn: '1h' })
                        return res.status(201).json({
                            ...result,
                            token,
                            msg: 'User created',
                        })
                    })
                    .catch(err => {
                        res.status(500).json({ error: err, msg: 'can\'t save user' })
                    })
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({msg: 'Unauthorized'})
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).send('Unauthorized')
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        process.env.JWT_KEY,
                        { expiresIn: '1y' })
                    return res.status(200).json({
                        ...result,
                        msg: 'Auth successful',
                        userId: user[0]._id,
                        token
                    })
                }
                res.status(401).json({msg: 'Unauthorized'})
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}
exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({ msg: 'User was deleted', result })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}
