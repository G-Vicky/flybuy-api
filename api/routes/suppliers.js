const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Supplier = require("../models/supplier");

router.get("/", (req, res) => {
  Supplier.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length > 0) {
        res.status(200).json({
          status: "success",
          message: "suppliers retrived",
          count: docs.length,
          data: docs,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "no suppliers available",
          count: 0,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to fetch suppliers",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/products", (req, res) => {
  var data = [];
  Supplier.find()
    .exec()
    .then((docs) => {
      docs.map((document) => {
        const data1 = document.products;
        data.push(data1);
      });
      if (docs.length > 0) {
        res.status(200).json({
          status: "success",
          message: "suppliers retrived",
          count: data.length,
          data: data,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "no suppliers available",
          count: 0,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to fetch suppliers",
          error: err,
          data: [],
        },
      ]);
    });
});

router.post("/", (req, res) => {
  const newSupplier = new Supplier({
    _id: new mongoose.Types.ObjectId(),
    company: req.body.company,
    contactName: req.body.contactName,
    phone: req.body.phone,
    country: req.body.country,
    products: req.body.products,
    createdAt: new Date(),
  });
  newSupplier
    .save()
    .then((result) => {
      console.log("Result: ", result);
      res.status(201).json([
        {
          status: "success",
          message: "supplier created",
          data: [newSupplier],
        },
      ]);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to create supplier",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/:supplierId", (req, res) => {
  const supplierId = req.params.supplierId;
  Supplier.findById(supplierId)
    .exec()
    .then((doc) => {
      console.log("Found: ", doc);
      if (doc) {
        res.status(200).json([
          {
            status: "success",
            message: "document retrived",
            data: [doc],
          },
        ]);
      } else {
        res.status(404).json([
          {
            status: "failure",
            message: "no valid supplier found for provided id",
            data: [],
          },
        ]);
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to find the supplier",
          error: err,
          data: [],
        },
      ]);
    });
});

router.put("/:supplierId", (req, res) => {
  const supplierId = req.params.supplierId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Supplier.findByIdAndUpdate({ _id: supplierId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json([
        {
          status: "success",
          message: "supplier updated successfully",
        },
      ]);
    })
    .catch((err) => {
      console.log("erroe: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to update supplier",
          data: [],
        },
      ]);
    });
});

router.delete("/:supplierId", (req, res) => {
  const supplierId = req.params.supplierId;
  Supplier.remove({ _id: supplierId })
    .exec()
    .then((result) => {
      console.log(result.deletedCount);
      if (result.deletedCount > 0) {
        res.status(200).json([
          {
            status: "success",
            message: "supplier deleted successfully",
          },
        ]);
      } else {
        res.status(404).json([
          {
            status: "failure",
            message: "no valid supplier found for provided id",
          },
        ]);
      }
    })
    .catch((error) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to delete supplier",
        },
      ]);
    });
});

module.exports = router;
