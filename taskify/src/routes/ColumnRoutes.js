import express from "express";
import * as columnController from "../controller/ColumnController.js";

const router = express.Router();

router.post("/", columnController.addColumn);

router.patch("/:id", columnController.updateColumn);

router.delete("/:id", columnController.deleteColumn);

export default router;
