const mongoose = require("mongoose");

// Models import
const Product = require("../models/product");

// Handle all GET requests to /products
exports.products_get_all = (req, res, next) => {
    Product.find()
    .select("_id name price productImage")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: `https://sleepy-dusk-28123.herokuapp.com/products/${doc._id}`
                    }
                }
            }) 
        };
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
};

// Handle create product requests
exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully!",
            createdProduct:{
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: `https://sleepy-dusk-28123.herokuapp.com/products/${result._id}`
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
};

// Handle GET single product requests
exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select("_id name price productImage")
    .exec()
    .then(doc => {
        console.log(`From database ${doc}`);
        if (doc){
        res.status(200).json({
            product: doc,
            request: {
                type: "GET",
                url: `https://sleepy-dusk-28123.herokuapp.com/products${doc._id}`
            }
        });
        } else {
            res.status(404).json({message: "No valid entry found for provided ID."})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

// Handle PATCH requests for single product
exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product updated successfully!",
            request: {
                type: "GET",
                url: `https://sleepy-dusk-28123.herokuapp.com/products/${id}`
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
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted.",
            request: {
                type: "POST",
                url: "https://sleepy-dusk-28123.herokuapp.com/products",
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}