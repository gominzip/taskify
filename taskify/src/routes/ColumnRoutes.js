"use strict";

const express = require("express");
const router = express.Router();
const columnController = require("../controller/ColumnController");

router.get("/", columnController.getAllColumns);

router.post("/", columnController.addColumn);

router.put("/:id", columnController.updateColumn);

router.delete("/:id", columnController.deleteColumn);

module.exports = router;
