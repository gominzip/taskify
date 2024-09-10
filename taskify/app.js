import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import columnRoutes from "./src/routes/ColumnRoutes.js";
import taskRoutes from "./src/routes/TaskRoutes.js";
import historyRoutes from "./src/routes/HistoryRoutes.js";
import userRoutes from "./src/routes/UserRoutes.js";
import mainRoutes from "./src/routes/index.js";
import "./src/config/passport.js";

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`./src/public`));

app.use("/column", columnRoutes);
app.use("/task", taskRoutes);
app.use("/history", historyRoutes);
app.use("/user", userRoutes);
app.use("/", mainRoutes);

export default app;
