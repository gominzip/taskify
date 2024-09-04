import express from "express";
import * as historyController from "../controller/HistoryContoller.js";

const router = express.Router();

router.get("/", historyController.getAllHistory);

router.delete("/", historyController.deleteAllHistory);

export default router;
