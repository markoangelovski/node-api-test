const mongoose = require("mongoose");

// Models imports
const Order = require("../models/order");
const Product = require("../models/product");

// Handle incoming GET requests to /orders
exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select("_id product quantity")
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
                        url: `https://sleepy-dusk.herokuapp.com/orders/${doc._id}`
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

// Handle incoming POST requests to /orders
exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product not found!"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order stored!",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: "GET",
                url: `https://sleepy-dusk.herokuapp.com/orders/${result._id}`
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

// Handle incoming GET requests to for single order
exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: "Order not found!"
            });
        }
        res.status(200).json({
            order: order,
            requests: {
                type: "GET",
                url: "https://sleepy-dusk.herokuapp.com/orders"
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

// Handle incoming DELETE requests to /orders
exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result =>
        res.status(200).json({
            message: "Order deleted!",
            request:{
                type: "POST",
                url: "http:localhost:3000/orders",
                body: { productId: "ID", quantity: "Number"}
            }
    }))
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};