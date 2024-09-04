import express from "express";
import columnRoutes from "./src/routes/ColumnRoutes.js";
import taskRoutes from "./src/routes/TaskRoutes.js";
import historyRoutes from "./src/routes/HistoryRoutes.js";
import mainRoutes from "./src/routes/index.js";

const app = express();

// 앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`./src/public`));

app.use("/column", columnRoutes);
app.use("/task", taskRoutes);
app.use("/history", historyRoutes);
app.use("/", mainRoutes);

export default app;
