const moment = require("moment");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Transaction = require("../models/transaction");

router.get("/", (req, res) => {
  Transaction.find()
    .sort()
    .exec()
    .then((docs) => {
      // console.log(docs);
      if (docs.length > 0) {
        res.status(200).json({
          status: "success",
          message: "transactions retrived",
          count: docs.length,
          data: docs,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "no transactions available",
          count: 0,
          data: [],
        });
      }
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to fetch transactions",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/today", (req, res) => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  start = start.getTime();

  Transaction.find({
    createdAt: { $gte: start },
  })
    .exec()
    .then((doc) => {
      // console.log(doc);
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: doc,
        },
      ]);
    });
});

router.get("/daily", (req, res) => {
  var today = new Date();
  year = today.getFullYear();
  month = today.getMonth();
  console.log(year, month);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  month = monthNames[month];

  if (req.body.year) {
    year = +req.body.year;
    month = req.body.month;
  }

  Transaction.aggregate([
    {
      $match: { $and: [{ year: year }, { month: month }] },
    },
    {
      $group: {
        _id: "$day",
        totalCost: { $sum: "$totalCost" },
      },
    },
  ])
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/monthly", (req, res) => {
  var yearStart = 0;
  var yearEnd = Number.MAX_SAFE_INTEGER;

  if (req.query.yearStart) {
    yearStart = +req.query.yearStart;
  }
  if (req.query.yearEnd) {
    yearEnd = +req.query.yearEnd;
  }

  Transaction.aggregate([
    {
      $match: { year: { $gte: yearStart, $lte: yearEnd } },
    },
    {
      $group: {
        _id: "$month",
        totalCost: { $sum: "$totalCost" },
      },
    },
  ])
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/yearly", (req, res) => {
  var yearStart = 0;
  var yearEnd = Number.MAX_SAFE_INTEGER;

  if (req.query.yearStart) {
    yearStart = +req.query.yearStart;
  }
  if (req.query.yearEnd) {
    yearEnd = +req.query.yearEnd;
  }

  Transaction.aggregate([
    {
      $match: { year: { $gte: yearStart, $lte: yearEnd } },
    },
    {
      $group: {
        _id: "$year",
        totalCost: { $sum: "$totalCost" },
      },
    },
  ])
    .exec()
    .then((doc) => {
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        totolCost: doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/totalcost", (req, res) => {
  var match = {};
  if (req.query.year) {
    year = +req.query.year;
    match = { year: year };
  }
  if (req.query.year && req.query.month) {
    year = +req.query.year;
    month = req.query.month;
    match = { $and: [{ year: year }, { month: month }] };
  }

  console.log(match);
  Transaction.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: null,
        cost: { $sum: "$totalCost" },
      },
    },
  ])
    .exec()
    .then((doc) => {
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        totalCost: doc[0].cost,
      });
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          totalCost: 0,
        },
      ]);
    });
});

router.get("/products", (req, res) => {
  var match = {};
  if (req.query.year) {
    year = +req.query.year;
    match = { year: year };
  }
  if (req.query.year && req.query.month) {
    year = +req.query.year;
    month = req.query.month;
    match = { $and: [{ year: year }, { month: month }] };
  }

  Transaction.aggregate([
    {
      $match: match,
    },
    { $unwind: "$products" },
    {
      $sort: {
        "products.productCount": -1,
      },
    },
  ])
    .limit(5)
    .exec()
    .then((doc) => {
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          totalCost: 0,
        },
      ]);
    });
});

router.get("/highest", (req, res) => {
  var fromTimestamp = 1;
  var toTimestamp = Number.MAX_SAFE_INTEGER;
  if (req.query.from) {
    fromTimestamp = +req.query.from;
    toTimestamp = +req.query.to;
  }
  Transaction.find()
    .sort({ totalCost: -1 })
    .limit(1)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: doc,
        },
      ]);
    });
});

router.get("/starttime", (req, res) => {
  Transaction.find()
    .sort({ createdAt: 1 })
    .limit(1)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: doc,
        },
      ]);
    });
});

router.get("/endtime", (req, res) => {
  Transaction.find()
    .sort({ createdAt: -1 })
    .limit(1)
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        status: "success",
        message: "transactions processed",
        data: doc,
      });
    })
    .catch((err) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to process transactions",
          error: err,
          data: doc,
        },
      ]);
    });
});

router.post("/", (req, res) => {
  const newTransaction = new Transaction({
    _id: new mongoose.Types.ObjectId(),
    customerId: req.body.customerId,
    products: req.body.products,
    totalCost: req.body.totalCost,
    year: req.body.year,
    month: req.body.month,
    day: req.body.day,
    createdAt: new Date(),
  });

  newTransaction
    .save()
    .then((result) => {
      console.log("Result: ", result);
      res.status(201).json([
        {
          status: "success",
          message: "transaction created",
          data: [newTransaction],
        },
      ]);
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to create transaction",
          error: err,
          data: [],
        },
      ]);
    });
});

router.get("/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  Transaction.findById(transactionId)
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
            message: "no valid transaction found for provided id",
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
          message: "unable to find the transaction",
          error: err,
          data: [],
        },
      ]);
    });
});

router.put("/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Transaction.findByIdAndUpdate({ _id: transactionId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json([
        {
          status: "success",
          message: "transaction updated successfully",
        },
      ]);
    })
    .catch((err) => {
      console.log("erroe: ", err);
      res.status(500).json([
        {
          status: "failure",
          message: "unable to update transaction",
          data: [],
        },
      ]);
    });
});

router.delete("/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  Transaction.remove({ _id: transactionId })
    .exec()
    .then((result) => {
      console.log(result.deletedCount);
      if (result.deletedCount > 0) {
        res.status(200).json([
          {
            status: "success",
            message: "transaction deleted successfully",
          },
        ]);
      } else {
        res.status(404).json([
          {
            status: "failure",
            message: "no valid transaction found for provided id",
          },
        ]);
      }
    })
    .catch((error) => {
      res.status(500).json([
        {
          status: "failure",
          message: "unable to delete transaction",
        },
      ]);
    });
});

module.exports = router;
