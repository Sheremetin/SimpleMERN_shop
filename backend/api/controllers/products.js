const Product = require('../models/product')
const mongoose = require('mongoose')

exports.get_products = (req, res, next) => {
    Product.find()
        .select('name price _id productCreator')
        .exec()
        .then(doc => {
            const request = {
                count: doc.length,
                products: doc.map(el => {
                    return {
                        ...el._doc,
                        url: `/products/${el._id}`,
                    }
                }),
            }
            if (doc) {
                return res.status(200).json(request)
            }
            res.status(404).json({ message: 'there is no product there' })
        }).catch(err => {
            console.log('__PROD__', err)
            res.status(500).json({ error: err })
        })
}
exports.create_product = (req, res, next) => {
    const productNew = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        productCreator: req.userData.userId,
    })
    Product.find({ name: req.body.name })
        .exec()
        .then(product => {
            if (product.length > 0) {
                return res.status(409).json({ msg: 'Product already exist' })
            }
            productNew.save().then(doc => {
                res.status(201).json({
                    msg: 'product successfully created',
                    createdProduct: {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        desc: doc.desc,
                        url: `http://localhost:3000/products/${doc._id}`,
                        productCreator: req.userData.userId,
                    },
                })
            }).catch(err => {
                res.status(500).json({ msg: err.message })
            })
        })
}
exports.get_product = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id).exec().then(doc => {
        if (doc) {
            return res.status(200).json({
                _id: doc._id,
                name: doc.name,
                price: doc.price,
                desc: doc.desc,
            })
        }
        res.status(404).json({ message: 'there is no product by this id' })
    }).catch(err => res.status(500).json({ error: err }))
}
exports.update_product = (req, res, next) => {
    const id = req.params.productId
    const updatedOps = {}

    for (const ops of req.body) {
        updatedOps[ops.propName] = ops.value
    }

    Product.update({ _id: id }, { $set: updatedOps }).exec().then(result => {
        console.log('SUCCESS patched', result)
        res.status(200).json(result)
    }).catch(err => res.status(500).json({ error: err }))
}
exports.delete_product = (req, res, next) => {
    const id = req.params.productId

    Product.findById(id)
        .then(result => {
            if (req.userData.userId !== result.productCreator.toString()) {
                return res.status(405).json({ message: 'not allowed' })
            }
            Product
                .remove({ _id: id })
                .exec()
                .then(result => {
                    res.status(200).json(result)
                }).catch(err => res.status(500).json({ error: err }))

        }).catch(err => res.status(500).json({ error: err }))
}
