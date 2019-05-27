
const mongoose = require("mongoose");

// Schema imports
const Product = require("../models/product");

// Config import
const heroku = require("../config/config");

// Handle GET requests to /products
exports.products_get_all = (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        request: {
                            type: `GET`,
                            url: heroku.api.url + `/products/` + doc.id
                        }
                    };
                })
            };
            if (docs.length > 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entries found"
                });
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

// Handle POST requests to /products
exports.products_post_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price 
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Product sucessfully created",
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: "GET",
                        url: heroku.api.url + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
};

// Handle GET single product requests
exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(doc => {
            console.log("From database:", doc);
            if (doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: heroku.api.url + "/products"
                    }
                });
            } else {
                res.status(404).json({message: "No valid entry found for provided Product ID"});
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

// Handle PATCH product requests
// PATCH example:
/* [
	{
	"propName": "name",
	"value": "Novi film bez slike 2"
	},
	{
	"propName": "price",
	"value": "50"
	}
] */
exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: heroku.api.url + "/products/" + id
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

// Handle DELETE product requests
exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: heroku.api.url + "/products",
                    body: { name: "String", price: "Number"}
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