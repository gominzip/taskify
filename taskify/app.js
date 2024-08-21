import express from "express";
import columnRoutes from "./src/routes/ColumnRoutes.js";
import taskRoutes from "./src/routes/TaskRoutes.js";

const app = express();

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`./src/public`));

app.use("/", columnRoutes);
app.use("/tasks", taskRoutes);

export default app;
