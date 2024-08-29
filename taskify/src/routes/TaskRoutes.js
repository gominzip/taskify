import express from "express";
import * as taskController from "../controller/TaskController.js";

const router = express.Router();

router.get("/:id", taskController.getTask);

router.post("/", taskController.addTask);

router.patch("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

export default router;
