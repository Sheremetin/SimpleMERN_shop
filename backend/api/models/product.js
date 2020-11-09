const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    desc: {type: String, required: true},
    productCreator: {type: mongoose.ObjectId, ref: 'UserModel', required: true}
})

module.exports = mongoose.model('ProductModel', productSchema)
