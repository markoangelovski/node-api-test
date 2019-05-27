const mongoose = require("mongoose");

// Schema imports
const Order = require("../models/order");
const Product = require("../models/product");

// Config import
const heroku = require("../config/config");

// Handle GET requests
exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate("product", "name")
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: heroku.api.url + "/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

// Handle incoming POST requests
exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            };
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save() 
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: heroku.api.url + "/orders/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// Handle incoming GET requests for single order
exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate("product")
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: heroku.api.url + "/orders"
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// Handle incoming DELETE order requests
exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: heroku.api.url + "/orders",
                body: { productId: "ID", quantity: "Number" }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};