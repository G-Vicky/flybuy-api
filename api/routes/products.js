const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const { prependOnceListener } = require("../models/product");
const Product = require("../models/product");

router.get('/', (req, res) => {

    Product.find()
            .exec()
            .then(docs => {
                console.log(docs);
                if (docs.length > 0) {
                    res.status(200)
                    .json({
                        status : "success",
                        message: "products retrived",
                        count : docs.length,
                        data : docs
                    });
                } else {
                    res.status(200)
                    .json({
                        status : "success",
                        message: "no products available",
                        count: 0,
                        data : []
                    });
                }
            })
            .catch( err => {
                res.status(500)
                .json([
                    {
                        status: "failure",
                        message: "unable to fetch products",
                        error: err,
                        data: []
                    }
                ]);
            });

    
});

router.post('/', (req, res) => {

    const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDescription: req.body.productDescription,
        category: req.body.category,
        Brand: req.body.brand,
        inventoryQuantity: req.body.inventoryCount,
        dateCreated: new Date()
    });

    newProduct.save()
        .then(result => {
            console.log("Result: ", result);
            res.status(201)
            .json([
                {
                    status : "success",
                    message: "product created",
                    data : [newProduct]
                }
            ]);
        }).catch(err => {
            console.log("Error: ", err);
            res.status(500)
            .json([
                {
                    status: "failure",
                    message: "unable to create product",
                    error: err,
                    data: []
                }
            ]);
        });

    
});

router.get('/:productId', (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .exec()
        .then(doc => {
            console.log("Found: ", doc);
            if (doc) {
                res.status(200)
                .json([
                    {
                        status: 'success',
                        message: "document retrived",
                        data: [doc]
                    }
                ]);
            } else {
                res.status(404)
                .json([
                    {
                        status: 'failure',
                        message: "no valid product found for provided id",
                        data: []
                    }
                ]);
            }
        })
        .catch(err => {
            console.log("Error: ", err);
            res.status(500)
            .json([
                {
                    status: "failure",
                    message: "unable to find the product",
                    error: err,
                    data: []
                }
            ]);
        });    
});

router.put('/:productId', (req, res) => {
    const productId = req.params.productId;
    
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.findByIdAndUpdate({_id: productId}, {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200)
                .json([
                    {
                        status: 'success',
                        message: "updated product successfully"
                    }
                ]);
            })
            .catch(err => {
                console.log('erroe: ', err);
                res.status(500)
                .json([
                    {
                        status: 'failure',
                        message: "unable to update product",
                        data : []
                    }
                ]);
            })
    
});

router.delete('/:productId', (req, res) => {
    const productId = req.params.productId;
    Product.remove({_id: productId})
        .exec()
        .then(result => {
            console.log(result.deletedCount);
            if(result.deletedCount > 0) {
                res.status(200)
                .json([
                    {
                        status: 'success',
                        message: "product deleted successfully",
                    }
                ]);
            } else {
                res.status(404)
                .json([
                    {
                        status: 'failure',
                        message: "no valid product found for provided id",
                    }
                ])
            }
            
        })
        .catch(error => {
            res.status(500)
            .json([
                {
                    status: 'failure',
                    message: "unable to delete product",
                }
            ])
        });
    
});

module.exports = router;













