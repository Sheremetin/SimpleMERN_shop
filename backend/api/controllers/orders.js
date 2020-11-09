const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose')

exports.get_orders = (req, res, next) => {
    Order
        .find({ owner: req.userData.userId })
        .select('productId id quantity date')
        .populate('productId', 'name price')
        .then(orders => {
            if (orders) {
                console.log(5)
                res.status(200).json({
                    orders: orders.map(order => {
                        const orderRes = {
                            ...order._doc,
                            url: `http://localhost:3000/products/${order.productId}`,
                        }
                        return orderRes
                    }),
                })
            }
            console.log(555)
            res.status(404).json({ msg: 'Orders not found' })
        })
        .catch(err => {
            console.log(55555555)
            res.status(500).json({ msg: err })
        })
}
exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity,
                owner: req.userData.userId,
                createdDate: new Date(),
            })
            return order.save().then((order) => {
                res.status(201).json({
                    _id: order._id,
                    productId: {
                        _id: req.body.productId,
                        name: product.name,
                        price: product.price,
                    },
                    quantity: order.quantity,
                    url: `http://localhost:3000/orders/${order._id}`,
                    msg: 'Successfully created!!!'
                })
            })
                .catch(err => res.status(500).json({ error: err }))
        })
}
exports.get_order = (req, res, next) => {
    const id = req.params.orderId
    Order
        .findById(id)
        .select('quantity _id productId')
        .exec()
        .then(order => {
            if (order) {
                return res.status(200).json({
                    ...order._doc,
                    url: `http://localhost:3000/products/${order.productId}`,
                })
            }
            res.status(404).json({ msg: 'Order not found' })
        })
        .catch(err => res.status(500).json({ error: err }))
}
exports.delete_order = (req, res, next) => {
    Order
        .remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            console.log('SUCCESS deleted', result)
            res.status(200).json(result)
        })
        .catch(err => res.status(500).json({ error: err, msg: 'OOPS!' }))
}
