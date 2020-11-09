const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.ObjectId,
    quantity: {type: Number, required: true},
    productId: {type: mongoose.ObjectId, ref: 'ProductModel', required: true},
    owner: {type: mongoose.ObjectId, ref: 'UserModel', required: true},
    date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('OrderModel', productSchema)
