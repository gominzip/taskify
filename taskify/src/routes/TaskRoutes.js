import express from "express";
import * as taskController from "../controller/TaskController.js";

const router = express.Router();

router.post("/", taskController.addTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export default router;
