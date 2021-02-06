const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Customer = require("../models/customer");

router.get("/", (req, res) => {
  var name = req.query.q; //for searching
  var regex = ".*";
  var regex1 = new RegExp(regex);
  if (name) {
    regex = ".*" + name + ".*";
    regex1 = new RegExp(regex, "i");
  }

  Customer.find({ customerName: { $regex: regex1 } })
    .sort({ customerName: 1 })
    .exec()
    .then((docs) => {
      // console.log(docs);
      if (docs.length > 0) {
        res.status(200).json({
          status: "success",
          message: "customers retrived",
          count: docs.length,
          data: docs,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "no customers available",
          count: 0,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to fetch customers",
          error: err,
          data: [],
        },
      ]);
    });
});

router.post("/", (req, res) => {
  const newCustomer = new Customer({
    _id: new mongoose.Types.ObjectId(),
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    city: req.body.address,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode,
    createdAt: new Date(),
  });

  newCustomer
    .save()
    .then((result) => {
      console.log("Result: ", result);
      res.status(201).json([
        {
          status: "success",
          message: "customer created",
          data: [newCustomer],
        },
      ]);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to create customer",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  Customer.findById(customerId)
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
            message: "no valid customer found for provided id",
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
          message: "unable to find the customer",
          error: err,
          data: [],
        },
      ]);
    });
});

router.put("/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Customer.findByIdAndUpdate({ _id: customerId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json([
        {
          status: "success",
          message: "customer updated successfully",
        },
      ]);
    })
    .catch((err) => {
      console.log("erroe: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to update customer",
          data: [],
        },
      ]);
    });
});

router.delete("/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  Customer.remove({ _id: customerId })
    .exec()
    .then((result) => {
      console.log(result.deletedCount);
      if (result.deletedCount > 0) {
        res.status(200).json([
          {
            status: "success",
            message: "customer deleted successfully",
          },
        ]);
      } else {
        res.status(404).json([
          {
            status: "failure",
            message: "no valid customer found for provided id",
          },
        ]);
      }
    })
    .catch((error) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to delete customer",
        },
      ]);
    });
});

module.exports = router;
