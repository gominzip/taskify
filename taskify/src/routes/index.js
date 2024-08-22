import express from "express";
import * as columnController from "../controller/ColumnController.js";

const router = express.Router();

router.get("/", columnController.getAllColumns);

export default router;
